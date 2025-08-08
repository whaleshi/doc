// components/MatterCanvas.js
import React, { useEffect, useRef, useState } from 'react';
import { Engine, Render, World, Bodies, Runner, Composite } from 'matter-js';

const MatterCanvas = () => {
	const canvasRef = useRef(null);
	const engineRef = useRef(null);
	const renderRef = useRef(null);
	const runnerRef = useRef(null);
	const bodiesAddedRef = useRef(false);

	const [dimensions, setDimensions] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 800,
		height: typeof window !== 'undefined' ? window.innerHeight : 600,
	});

	const [permissionGranted, setPermissionGranted] = useState(false);
	const [permissionRequested, setPermissionRequested] = useState(false);

	// 新增：用于存储陀螺仪运动数据的状态
	const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });

	const requestDeviceMotionPermission = async () => {
		if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
			try {
				const permissionState = await DeviceMotionEvent.requestPermission();
				if (permissionState === 'granted') {
					setPermissionGranted(true);
				} else {
					console.warn('Device motion permission denied.');
					setPermissionGranted(false);
				}
			} catch (error) {
				console.error('Error requesting device motion permission:', error);
				setPermissionGranted(false);
			}
		} else {
			setPermissionGranted(true); // Assume granted for unsupported browsers
		}
		setPermissionRequested(true);
	};

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});

			if (renderRef.current) {
				renderRef.current.options.width = window.innerWidth;
				renderRef.current.options.height = window.innerHeight;
				renderRef.current.canvas.width = window.innerWidth;
				renderRef.current.canvas.height = window.innerHeight;
				Render.setPixelRatio(renderRef.current, window.devicePixelRatio);
			}

			if (engineRef.current && bodiesAddedRef.current) {
				World.clear(engineRef.current.world);
				bodiesAddedRef.current = false;
			}
		};

		window.addEventListener('resize', handleResize);

		if (!engineRef.current) {
			engineRef.current = Engine.create();
		}
		const engine = engineRef.current;

		if (!renderRef.current) {
			renderRef.current = Render.create({
				element: canvasRef.current,
				engine: engine,
				options: {
					width: dimensions.width,
					height: dimensions.height,
					wireframes: false,
					background: '#f0f0f0',
					pixelRatio: window.devicePixelRatio,
				},
			});
			Render.run(renderRef.current);
		}

		if (!runnerRef.current) {
			runnerRef.current = Runner.create();
			Runner.run(runnerRef.current, engine);
		}

		if (!bodiesAddedRef.current) {
			World.add(engine.world, [
				Bodies.rectangle(dimensions.width / 2, 0, dimensions.width, 50, { isStatic: true }),
				Bodies.rectangle(dimensions.width / 2, dimensions.height, dimensions.width, 50, { isStatic: true }),
				Bodies.rectangle(0, dimensions.height / 2, 50, dimensions.height, { isStatic: true }),
				Bodies.rectangle(dimensions.width, dimensions.height / 2, 50, dimensions.height, { isStatic: true }),

				Bodies.circle(150, 50, 30, { restitution: 0.9 }),
				Bodies.rectangle(250, 100, 60, 40, { angle: Math.PI * 0.2 }),
				Bodies.circle(350, 150, 40, { restitution: 0.7 }),
				Bodies.rectangle(450, 200, 80, 50, { angle: Math.PI * 0.4 }),
			]);
			bodiesAddedRef.current = true;
		}

		const handleDeviceMotion = (event) => {
			if (engineRef.current && permissionGranted) {
				const { x, y, z } = event.accelerationIncludingGravity;

				// 更新陀螺仪数据显示
				setMotionData({ x: x ? x.toFixed(2) : 0, y: y ? y.toFixed(2) : 0, z: z ? z.toFixed(2) : 0 });

				const gravityScale = 0.05;

				engineRef.current.world.gravity.x = x * gravityScale;
				engineRef.current.world.gravity.y = y * gravityScale;
				engineRef.current.world.gravity.scale = 0.001;
			}
		};

		if (permissionGranted) {
			window.addEventListener('devicemotion', handleDeviceMotion);
		}

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('devicemotion', handleDeviceMotion);

			if (renderRef.current) {
				Render.stop(renderRef.current);
				renderRef.current.canvas.remove();
				renderRef.current.context = null;
				renderRef.current.textures = {};
				renderRef.current = null;
			}
			if (runnerRef.current) {
				Runner.stop(runnerRef.current);
				runnerRef.current = null;
			}
			if (engineRef.current) {
				World.clear(engineRef.current.world);
				Engine.clear(engineRef.current);
				engineRef.current = null;
			}
			bodiesAddedRef.current = false;
			setPermissionGranted(false);
			setPermissionRequested(false);
		};
	}, [dimensions, permissionGranted]);

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
			<div ref={canvasRef} />

			{/* 陀螺仪信息显示框 */}
			{permissionGranted && ( // 仅在权限授予后显示
				<div
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						background: 'rgba(0, 0, 0, 0.7)',
						color: 'white',
						padding: '10px',
						borderRadius: '5px',
						fontSize: '0.9em',
						fontFamily: 'monospace',
						zIndex: 100,
					}}
				>
					<strong>陀螺仪数据:</strong>
					<div>X: {motionData.x}</div>
					<div>Y: {motionData.y}</div>
					<div>Z: {motionData.z}</div>
				</div>
			)}

			{!permissionRequested && typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function' && (
				<button
					onClick={requestDeviceMotionPermission}
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						padding: '10px 20px',
						fontSize: '1.2em',
						zIndex: 100,
						cursor: 'pointer',
					}}
				>
					启用设备运动控制
				</button>
			)}
			{!permissionGranted && permissionRequested && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'rgba(0,0,0,0.7)',
					color: 'white',
					padding: '15px',
					borderRadius: '8px',
					textAlign: 'center',
					zIndex: 100,
				}}>
					需要设备运动权限才能启用陀螺仪控制。
					<br />
					请确保在设备设置中允许访问。
				</div>
			)}
		</div>
	);
};

export default MatterCanvas;