// components/MatterCanvas.js
import React, { useEffect, useRef, useState, useCallback } from 'react'; // 导入 useCallback
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

	// 新增：用于存储陀螺仪（DeviceOrientation）运动数据的状态
	const [orientationData, setOrientationData] = useState({
		alpha: 0,
		beta: 0,
		gamma: 0,
	});

	// 使用 useCallback 包装事件处理函数，确保其引用稳定
	const handleOrientation = useCallback((event) => {
		// 确保 Matter.js 引擎存在
		if (engineRef.current && permissionGranted) {
			const { beta, gamma } = event; // 获取 beta 和 gamma 角度

			setOrientationData({ // 更新显示数据
				alpha: event.alpha ? event.alpha.toFixed(2) : 0,
				beta: beta ? beta.toFixed(2) : 0,
				gamma: gamma ? gamma.toFixed(2) : 0,
			});

			// 将角度转换为重力矢量
			// Matter.js 重力默认强度为 0.001
			// 角度通常在 -90 到 90 之间（gamma），或 -180 到 180 (beta)
			// 我们需要将其标准化并映射到 Matter.js 的重力范围 (例如 -1 到 1)

			const maxTiltAngle = 45; // 假设最大倾斜角度为 45 度，超过这个角度重力达到最大

			// 计算 X 轴重力（左右倾斜）
			// gamma 角度范围通常为 -90 到 90
			const normalizedGamma = gamma / maxTiltAngle; // 归一化到 -1 到 1 范围
			engineRef.current.world.gravity.x = Math.sin(normalizedGamma * Math.PI / 2); // 使用sin函数平滑映射

			// 计算 Y 轴重力（前后倾斜）
			// beta 角度范围通常为 -180 到 180，但对于前后倾斜，主要在 -90 到 90
			const normalizedBeta = beta / maxTiltAngle; // 归一化到 -1 到 1 范围
			// 注意：beta 增加通常是手机屏幕朝上倾斜，这在Matter.js中应该导致物体向上滚
			// 因此，通常需要反转 beta 的影响，或者根据您的预期行为调整符号
			engineRef.current.world.gravity.y = Math.sin(normalizedBeta * Math.PI / 2);

			// 设置重力强度。这很重要，因为它影响倾斜的敏感度。
			// 这个值越大，重力响应越强。通常在 0.1 到 2 之间调整。
			engineRef.current.world.gravity.scale = 0.5; // 可以根据需要调整，0.5 是一个不错的起始值
		}
	}, [permissionGranted]); // handleOrientation 依赖 permissionGranted

	// 请求设备方向权限的函数
	const requestDeviceOrientationPermission = useCallback(async () => {
		if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent).requestPermission === 'function') {
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
		} else {
			// Android 或非 iOS13+，直接假定已授权
			setPermissionGranted(true);
		}
		setPermissionRequested(true);
	}, []); // requestDeviceOrientationPermission 没有外部依赖

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
				// 清除所有物体（包括旧墙壁），以便根据新尺寸重新添加
				World.clear(engineRef.current.world);
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

		// 只有在没有添加过物体时才添加它们（或尺寸改变后）
		if (!bodiesAddedRef.current) {
			World.add(engine.world, [
				// 墙壁 (根据当前尺寸设置)
				Bodies.rectangle(dimensions.width / 2, 0, dimensions.width, 50, { isStatic: true }),
				Bodies.rectangle(dimensions.width / 2, dimensions.height, dimensions.width, 50, { isStatic: true }),
				Bodies.rectangle(0, dimensions.height / 2, 50, dimensions.height, { isStatic: true }),
				Bodies.rectangle(dimensions.width, dimensions.height / 2, 50, dimensions.height, { isStatic: true }),

				// 一些球体和矩形
				Bodies.circle(dimensions.width * 0.2, dimensions.height * 0.2, 30, { restitution: 0.9 }),
				Bodies.rectangle(dimensions.width * 0.4, dimensions.height * 0.3, 60, 40, { angle: Math.PI * 0.2 }),
				Bodies.circle(dimensions.width * 0.6, dimensions.height * 0.4, 40, { restitution: 0.7 }),
				Bodies.rectangle(dimensions.width * 0.8, dimensions.height * 0.5, 80, 50, { angle: Math.PI * 0.4 }),
			]);
			bodiesAddedRef.current = true;
		}

		// 只有在权限被授予后才添加事件监听器
		if (permissionGranted) {
			window.addEventListener('deviceorientation', handleOrientation);
		}

		// 清理函数
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('deviceorientation', handleOrientation); // 移除 deviceorientation 监听器

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
	}, [dimensions, permissionGranted, handleOrientation]); // 依赖 dimensions, permissionGranted, handleOrientation

	// 确保 div 元素占据整个视口
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
					<strong>方向数据:</strong>
					<div>Alpha: {orientationData.alpha}</div>
					<div>Beta: {orientationData.beta}</div>
					<div>Gamma: {orientationData.gamma}</div>
				</div>
			)}

			{/* 权限请求按钮或提示 */}
			{!permissionRequested && typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent).requestPermission === 'function' && (
				<button
					onClick={requestDeviceOrientationPermission} // 使用新的权限请求函数
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
					启用设备方向控制
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
					需要设备方向权限才能启用陀螺仪控制。
					<br />
					请确保在设备设置中允许访问。
				</div>
			)}
		</div>
	);
};

export default MatterCanvas;