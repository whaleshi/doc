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

	// 用于跟踪设备运动事件的许可状态
	const [permissionGranted, setPermissionGranted] = useState(false);
	const [permissionRequested, setPermissionRequested] = useState(false); // 跟踪是否已请求过权限

	// 请求设备运动权限的函数
	const requestIOSPermission = async () => {
		if (
			typeof DeviceOrientationEvent !== 'undefined' &&
			typeof (DeviceOrientationEvent).requestPermission === 'function'
		) {
			try {
				const result = await (DeviceOrientationEvent).requestPermission();
				if (result === 'granted') {
					window.addEventListener('deviceorientation', handleOrientation, true);
					setPermissionGranted(true);
				} else {
					alert("权限被拒绝");
				}
			} catch (err) {
				alert("请求失败：" + err);
			}
		} else {
			// Android 或非 iOS13+，直接监听
			window.addEventListener('deviceorientation', handleOrientation, true);
			setPermissionGranted(true);
		}
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

			// 重新调整边界 (如果需要)
			if (engineRef.current && bodiesAddedRef.current) {
				World.clear(engineRef.current.world); // 清除所有物体
				bodiesAddedRef.current = false; // 标记为需要重新添加物体
			}
		};

		window.addEventListener('resize', handleResize);

		// 初始化 Matter.js 引擎、渲染器和运行器
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

		// 只有在没有添加过物体时才添加它们
		if (!bodiesAddedRef.current) {
			World.add(engine.world, [
				// 墙壁 (根据当前尺寸设置)
				Bodies.rectangle(dimensions.width / 2, 0, dimensions.width, 50, { isStatic: true }),
				Bodies.rectangle(dimensions.width / 2, dimensions.height, dimensions.width, 50, { isStatic: true }),
				Bodies.rectangle(0, dimensions.height / 2, 50, dimensions.height, { isStatic: true }),
				Bodies.rectangle(dimensions.width, dimensions.height / 2, 50, dimensions.height, { isStatic: true }),

				// 一些球体和矩形
				Bodies.circle(150, 50, 30, { restitution: 0.9 }),
				Bodies.rectangle(250, 100, 60, 40, { angle: Math.PI * 0.2 }),
				Bodies.circle(350, 150, 40, { restitution: 0.7 }),
				Bodies.rectangle(450, 200, 80, 50, { angle: Math.PI * 0.4 }),
			]);
			bodiesAddedRef.current = true;
		}

		// ************************************
		// 陀螺仪控制逻辑
		// ************************************
		const handleDeviceMotion = (event) => {
			if (engineRef.current && permissionGranted) {
				const { x, y } = event.accelerationIncludingGravity;

				// 根据设备倾斜方向调整重力
				// 注意：这里的方向可能需要根据您的设备和期望的行为进行调整
				// 手机直立时 (Home键在下):
				//   - 向右倾斜: x 变为正
				//   - 向左倾斜: x 变为负
				//   - 向前倾斜: y 变为负
				//   - 向后倾斜: y 变为正

				// 默认重力是向下 (y轴正方向)
				// 我们需要将设备的 x, y 倾斜映射到 Matter.js 的 x, y 重力上

				// 调整重力强度 (可以根据需要调整这个乘数)
				const gravityScale = 0.05; // 调整重力对倾斜的响应敏感度

				// 将设备的 X 轴加速度映射到 Matter.js 的 X 轴重力
				engineRef.current.world.gravity.x = x * gravityScale;

				// 将设备的 Y 轴加速度映射到 Matter.js 的 Y 轴重力
				// 通常手机Y轴倾斜是前后，对应游戏世界的Y轴，所以这里是 y * gravityScale
				// 如果您希望手机向前倾斜（y负）导致物体向上运动，可能需要 -y
				engineRef.current.world.gravity.y = y * gravityScale;

				// 确保 Z 轴重力为 1 或其他固定值，因为 devicemotion 的 Z 轴通常不用于模拟重力方向
				// Matter.js 默认重力.y 是 1
				engineRef.current.world.gravity.scale = 0.001; // 调整整体重力强度，避免过于强烈
			}
		};

		// 只有在权限被授予后才添加事件监听器
		if (permissionGranted) {
			window.addEventListener('devicemotion', handleDeviceMotion);
		}

		// 清理函数
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('devicemotion', handleDeviceMotion); // 移除 devicemotion 监听器

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
			// 重置权限状态，以便下次组件挂载时可以重新请求
			setPermissionGranted(false);
			setPermissionRequested(false);
		};
	}, [dimensions, permissionGranted]); // 依赖 permissionGranted，当权限状态改变时重新运行 effect

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
			<div ref={canvasRef} />
			{/* 只有在尚未请求权限且设备支持时才显示按钮 */}
			{!permissionRequested && typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function' && (
				<button
					onClick={requestIOSPermission}
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						padding: '10px 20px',
						fontSize: '1.2em',
						zIndex: 100, // 确保按钮在画布上方
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