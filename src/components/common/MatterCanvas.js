// components/MatterCanvas.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Engine, Render, World, Bodies, Runner, Composite } from 'matter-js';

const MatterCanvas = () => {
	const canvasRef = useRef(null);
	const engineInstanceRef = useRef(null); // 使用新的 ref 名称，避免与 Matter.Engine 混淆
	const renderInstanceRef = useRef(null);
	const runnerInstanceRef = useRef(null);
	const bodiesAddedRef = useRef(false);

	const [dimensions, setDimensions] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 800,
		height: typeof window !== 'undefined' ? window.innerHeight : 600,
	});

	const [permissionGranted, setPermissionGranted] = useState(false);
	const [permissionRequested, setPermissionRequested] = useState(false);
	const [deviceOrientationSupported, setDeviceOrientationSupported] = useState(false);

	const [orientationData, setOrientationData] = useState({
		alpha: 0,
		beta: 0,
		gamma: 0,
	});

	const handleOrientation = useCallback((event) => {
		if (engineInstanceRef.current && permissionGranted) {
			const { beta, gamma } = event;

			setOrientationData({
				alpha: event.alpha ? event.alpha.toFixed(2) : 0,
				beta: beta ? beta.toFixed(2) : 0,
				gamma: gamma ? gamma.toFixed(2) : 0,
			});

			const maxTiltAngle = 45;
			const normalizedGamma = gamma / maxTiltAngle;
			const normalizedBeta = beta / maxTiltAngle;

			engineInstanceRef.current.world.gravity.x = Math.sin(normalizedGamma * Math.PI / 2);
			engineInstanceRef.current.world.gravity.y = Math.sin(normalizedBeta * Math.PI / 2);
			engineInstanceRef.current.world.gravity.scale = 0.5;
		}
	}, [permissionGranted]);

	const requestDeviceOrientationPermission = useCallback(async () => {
		if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent).requestPermission === 'function') {
			setDeviceOrientationSupported(true);
			try {
				const permissionState = await (DeviceOrientationEvent).requestPermission();
				if (permissionState === 'granted') {
					setPermissionGranted(true);
				} else {
					console.warn('Device orientation permission denied.');
					setPermissionGranted(false);
				}
			} catch (error) {
				console.error('Error requesting device orientation permission:', error);
				setPermissionGranted(false);
			}
		} else if (typeof DeviceOrientationEvent !== 'undefined') {
			setDeviceOrientationSupported(true);
			setPermissionGranted(true); // Assume granted for non-iOS browsers that support it without explicit request
		} else {
			setDeviceOrientationSupported(false);
			setPermissionGranted(false);
			console.log("DeviceOrientationEvent not supported on this device.");
		}
		setPermissionRequested(true);
	}, []);

	// 主要的 Matter.js 初始化 useEffect
	useEffect(() => {
		// 自动请求权限 (只在组件挂载时运行一次)
		if (!permissionRequested) {
			requestDeviceOrientationPermission();
		}

		// 初始化 Matter.js 引擎、渲染器和运行器
		// 确保这些只在组件首次挂载时被创建
		if (!engineInstanceRef.current) {
			engineInstanceRef.current = Engine.create();
		}
		const engine = engineInstanceRef.current;

		if (!renderInstanceRef.current) {
			renderInstanceRef.current = Render.create({
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
			Render.run(renderInstanceRef.current);
		}

		if (!runnerInstanceRef.current) {
			runnerInstanceRef.current = Runner.create();
			Runner.run(runnerInstanceRef.current, engine);
		}

		// 添加初始物体 (只在引擎创建时或清理后重新添加)
		if (!bodiesAddedRef.current) {
			World.add(engine.world, [
				Bodies.rectangle(dimensions.width / 2, 0, dimensions.width, 50, { isStatic: true }),
				Bodies.rectangle(dimensions.width / 2, dimensions.height, dimensions.width, 50, { isStatic: true }),
				Bodies.rectangle(0, dimensions.height / 2, 50, dimensions.height, { isStatic: true }),
				Bodies.rectangle(dimensions.width, dimensions.height / 2, 50, dimensions.height, { isStatic: true }),
				Bodies.circle(dimensions.width * 0.2, dimensions.height * 0.2, 30, { restitution: 0.9 }),
				Bodies.rectangle(dimensions.width * 0.4, dimensions.height * 0.3, 60, 40, { angle: Math.PI * 0.2 }),
				Bodies.circle(dimensions.width * 0.6, dimensions.height * 0.4, 40, { restitution: 0.7 }),
				Bodies.rectangle(dimensions.width * 0.8, dimensions.height * 0.5, 80, 50, { angle: Math.PI * 0.4 }),
			]);
			bodiesAddedRef.current = true;
		}

		// 清理函数：仅在组件卸载时执行一次
		return () => {
			// 停止并清理 Matter.js 实例
			if (renderInstanceRef.current) {
				Render.stop(renderInstanceRef.current);
				renderInstanceRef.current.canvas.remove();
				renderInstanceRef.current.context = null;
				renderInstanceRef.current.textures = {};
			}
			if (runnerInstanceRef.current) {
				Runner.stop(runnerInstanceRef.current);
			}
			if (engineInstanceRef.current) {
				World.clear(engineInstanceRef.current.world);
				Engine.clear(engineInstanceRef.current);
			}

			// 清除 ref 引用
			engineInstanceRef.current = null;
			renderInstanceRef.current = null;
			runnerInstanceRef.current = null;
			bodiesAddedRef.current = false;

			// 重置状态
			setPermissionGranted(false);
			setPermissionRequested(false);
			setDeviceOrientationSupported(false);
		};
	}, []); // <-- 确保这个 useEffect 的依赖数组为空，它只运行一次

	// 处理窗口大小变化的 useEffect
	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});

			if (renderInstanceRef.current) {
				renderInstanceRef.current.options.width = window.innerWidth;
				renderInstanceRef.current.options.height = window.innerHeight;
				renderInstanceRef.current.canvas.width = window.innerWidth;
				renderInstanceRef.current.canvas.height = window.innerHeight;
				Render.setPixelRatio(renderInstanceRef.current, window.devicePixelRatio);
			}

			// 重新调整边界 (如果需要的话)
			// 在这里，如果你希望墙壁随着窗口大小实时调整，你需要移除旧的墙壁并添加新的
			if (engineInstanceRef.current) {
				World.clear(engineInstanceRef.current.world); // 清除所有物体，包括旧墙壁
				bodiesAddedRef.current = false; // 标记为需要重新添加物体
				// 重新添加物体和墙壁
				World.add(engineInstanceRef.current.world, [
					Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, { isStatic: true }),
					Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { isStatic: true }),
					Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
					Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
					Bodies.circle(window.innerWidth * 0.2, window.innerHeight * 0.2, 30, { restitution: 0.9 }),
					Bodies.rectangle(window.innerWidth * 0.4, window.innerHeight * 0.3, 60, 40, { angle: Math.PI * 0.2 }),
					Bodies.circle(window.innerWidth * 0.6, window.innerHeight * 0.4, 40, { restitution: 0.7 }),
					Bodies.rectangle(window.innerWidth * 0.8, window.innerHeight * 0.5, 80, 50, { angle: Math.PI * 0.4 }),
				]);
				bodiesAddedRef.current = true;
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [dimensions]); // 仅在 dimensions 变化时运行

	// 处理陀螺仪事件的 useEffect (依赖于权限和支持性)
	useEffect(() => {
		const engine = engineInstanceRef.current; // 获取当前的引擎实例

		if (permissionGranted && deviceOrientationSupported) {
			window.addEventListener('deviceorientation', handleOrientation);
		} else if (engine) {
			// 如果没有权限或设备不支持，设置 Matter.js 的默认重力（向下）
			// 仅当引擎存在时才设置
			engine.world.gravity.x = 0;
			engine.world.gravity.y = 1; // 默认向下
			engine.world.gravity.scale = 0.001; // Matter.js 默认重力强度
		}

		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	}, [permissionGranted, deviceOrientationSupported, handleOrientation]); // 依赖这些状态

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
			<div ref={canvasRef} />

			{/* 陀螺仪信息显示框 - 仅在支持且权限授予时显示 */}
			{permissionGranted && deviceOrientationSupported && (
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
					<strong>方向数据:</strong>
					<div>Alpha: {orientationData.alpha}</div>
					<div>Beta: {orientationData.beta}</div>
					<div>Gamma: {orientationData.gamma}</div>
				</div>
			)}

			{/* 权限请求按钮或提示 */}
			{!permissionGranted && !permissionRequested && typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent).requestPermission === 'function' && (
				<button
					onClick={requestDeviceOrientationPermission}
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
					启用设备方向控制 (点击请求权限)
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
					{!deviceOrientationSupported
						? '当前设备/浏览器不支持设备方向控制。将使用默认重力。'
						: '权限被拒绝或用户未授权。请在设备设置中允许访问，或刷新重试。'
					}
				</div>
			)}
			{permissionGranted && deviceOrientationSupported && (
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
					opacity: 0.9,
					pointerEvents: 'none'
				}}>
					陀螺仪已启用！请倾斜设备。
				</div>
			)}
		</div>
	);
};

export default MatterCanvas;