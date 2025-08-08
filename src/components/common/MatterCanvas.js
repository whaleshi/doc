import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Engine, Render, World, Bodies, Runner } from 'matter-js';

const MatterCanvas = () => {
	const canvasRef = useRef(null);
	const engineRef = useRef(null);
	const renderRef = useRef(null);
	const runnerRef = useRef(null);

	const [dimensions, setDimensions] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 800,
		height: typeof window !== 'undefined' ? window.innerHeight : 600,
	});

	const [permissionGranted, setPermissionGranted] = useState(false);
	const [permissionRequested, setPermissionRequested] = useState(false);
	const [deviceOrientationSupported, setDeviceOrientationSupported] = useState(false);
	const [showGyroMessage, setShowGyroMessage] = useState(false);

	const [orientationData, setOrientationData] = useState({
		alpha: 0,
		beta: 0,
		gamma: 0,
	});

	// --- New State Variable for Settling ---
	const [isSettled, setIsSettled] = useState(false);

	// Handle device orientation events to update Matter.js gravity
	const handleOrientation = useCallback((event) => {
		// --- Apply gravity only if permission granted AND objects are settled ---
		if (engineRef.current && permissionGranted && isSettled) {
			const { beta, gamma } = event;

			setOrientationData({
				alpha: event.alpha ? parseFloat(event.alpha.toFixed(2)) : 0,
				beta: beta ? parseFloat(beta.toFixed(2)) : 0,
				gamma: gamma ? parseFloat(gamma.toFixed(2)) : 0,
			});

			const maxTiltAngle = 45; // Degrees
			const normalizedGamma = Math.max(-1, Math.min(1, gamma / maxTiltAngle));
			const normalizedBeta = Math.max(-1, Math.min(1, beta / maxTiltAngle));

			engineRef.current.world.gravity.x = Math.sin(normalizedGamma * Math.PI / 2);
			engineRef.current.world.gravity.y = Math.sin(normalizedBeta * Math.PI / 2);
			engineRef.current.world.gravity.scale = 0.0005; // Adjust for subtle tilt
		}
	}, [permissionGranted, isSettled]); // Add isSettled to dependencies

	// Request device orientation permission
	const requestDeviceOrientationPermission = useCallback(async () => {
		if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent).requestPermission === 'function') {
			setDeviceOrientationSupported(true);
			try {
				const permissionState = await (DeviceOrientationEvent).requestPermission();
				if (permissionState === 'granted') {
					setPermissionGranted(true);
					setShowGyroMessage(true);
					setTimeout(() => setShowGyroMessage(false), 3000);
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
			setPermissionGranted(true);
			setShowGyroMessage(true);
			setTimeout(() => setShowGyroMessage(false), 3000);
		} else {
			setDeviceOrientationSupported(false);
			setPermissionGranted(false);
			console.log("DeviceOrientationEvent not supported on this device.");
		}
		setPermissionRequested(true);
	}, []);

	// --- Matter.js Initialization and Cleanup ---
	useEffect(() => {
		const currentCanvas = canvasRef.current;
		if (!currentCanvas) return;

		const engine = Engine.create();
		engineRef.current = engine;

		const render = Render.create({
			element: currentCanvas,
			engine: engine,
			options: {
				width: dimensions.width,
				height: dimensions.height,
				wireframes: false,
				background: '#f0f0f0',
				pixelRatio: window.devicePixelRatio,
			},
		});
		renderRef.current = render;
		Render.run(render);

		const runner = Runner.create();
		runnerRef.current = runner;
		Runner.run(runner, engine);

		const walls = [
			Bodies.rectangle(dimensions.width / 2, 25, dimensions.width, 50, { isStatic: true, label: 'wallTop' }),
			Bodies.rectangle(dimensions.width / 2, dimensions.height - 25, dimensions.width, 50, { isStatic: true, label: 'wallBottom' }),
			Bodies.rectangle(25, dimensions.height / 2, 50, dimensions.height, { isStatic: true, label: 'wallLeft' }),
			Bodies.rectangle(dimensions.width - 25, dimensions.height / 2, 50, dimensions.height, { isStatic: true, label: 'wallRight' }),
		];
		World.add(engine.world, walls);

		const dynamicBodies = [
			Bodies.circle(dimensions.width * 0.2, dimensions.height * 0.2, 30, { restitution: 0.9, label: 'circle1' }),
			Bodies.rectangle(dimensions.width * 0.4, dimensions.height * 0.3, 60, 40, { angle: Math.PI * 0.2, label: 'rect1' }),
			Bodies.circle(dimensions.width * 0.6, dimensions.height * 0.4, 40, { restitution: 0.7, label: 'circle2' }),
			Bodies.rectangle(dimensions.width * 0.8, dimensions.height * 0.5, 80, 50, { angle: Math.PI * 0.4, label: 'rect2' }),
		];
		World.add(engine.world, dynamicBodies);

		// --- Set isSettled to true after a delay ---
		// Give objects some time to fall and settle
		const settlingTimer = setTimeout(() => {
			setIsSettled(true);
			console.log("Objects settled, gyroscope control enabled.");
		}, 2000); // 2 seconds delay, adjust as needed

		// Cleanup function
		return () => {
			clearTimeout(settlingTimer); // Clear timer on unmount

			if (renderRef.current) {
				Render.stop(renderRef.current);
				if (renderRef.current.canvas && renderRef.current.canvas.parentNode) {
					renderRef.current.canvas.parentNode.removeChild(renderRef.current.canvas);
				}
				renderRef.current.context = null;
				renderRef.current.textures = {};
			}
			if (runnerRef.current) {
				Runner.stop(runnerRef.current);
			}
			if (engineRef.current) {
				World.clear(engineRef.current.world);
				Engine.clear(engineRef.current);
			}

			engineRef.current = null;
			renderRef.current = null;
			runnerRef.current = null;
			setIsSettled(false); // Reset settling state on unmount
		};
	}, []);

	// --- Window Resize Handling ---
	useEffect(() => {
		const handleResize = () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;

			setDimensions({ width: newWidth, height: newHeight });

			if (renderRef.current) {
				renderRef.current.options.width = newWidth;
				renderRef.current.options.height = newHeight;
				renderRef.current.canvas.width = newWidth;
				renderRef.current.canvas.height = newHeight;
				Render.setPixelRatio(renderRef.current, window.devicePixelRatio);
			}

			if (engineRef.current) {
				const world = engineRef.current.world;

				const walls = World.getAllBodies(world).filter(body => body.isStatic && body.label.startsWith('wall'));
				World.remove(world, walls); // Remove old walls

				// Re-add static walls with new dimensions
				World.add(world, [
					Bodies.rectangle(newWidth / 2, 25, newWidth, 50, { isStatic: true, label: 'wallTop' }),
					Bodies.rectangle(newWidth / 2, newHeight - 25, newWidth, 50, { isStatic: true, label: 'wallBottom' }),
					Bodies.rectangle(25, newHeight / 2, 50, newHeight, { isStatic: true, label: 'wallLeft' }),
					Bodies.rectangle(newWidth - 25, newHeight / 2, 50, newHeight, { isStatic: true, label: 'wallRight' }),
				]);

				// Reset settling state and re-enable timer on resize to allow objects to re-settle
				setIsSettled(false);
				setTimeout(() => {
					setIsSettled(true);
					console.log("Objects re-settled after resize, gyroscope control re-enabled.");
				}, 1500); // Shorter delay for resize, adjust as needed
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// --- Device Orientation Event Listener ---
	useEffect(() => {
		if (permissionGranted && deviceOrientationSupported) {
			window.addEventListener('deviceorientation', handleOrientation);
		} else if (engineRef.current) {
			engineRef.current.world.gravity.x = 0;
			engineRef.current.world.gravity.y = 1;
			engineRef.current.world.gravity.scale = 0.001;
		}

		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	}, [permissionGranted, deviceOrientationSupported, handleOrientation]);

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
			<div ref={canvasRef} style={{ width: '100%', height: '100%' }} />

			{/* Gyroscope Information Display */}
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
					<strong>Orientation Data:</strong>
					<div>Alpha: {orientationData.alpha}</div>
					<div>Beta: {orientationData.beta}</div>
					<div>Gamma: {orientationData.gamma}</div>
				</div>
			)}

			{/* Permission / Status Messages */}
			{!permissionGranted && !permissionRequested && deviceOrientationSupported && (
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
					Enable Device Orientation Control
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
						? 'Your device/browser does not support device orientation control. Default gravity will be used.'
						: 'Permission denied or not granted by the user. Please allow access in device settings or refresh to retry.'
					}
				</div>
			)}

			{/* Message about Gyroscope Status */}
			{showGyroMessage && permissionGranted && deviceOrientationSupported && (
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
					pointerEvents: 'none',
					transition: 'opacity 0.5s ease-out',
				}}>
					陀螺仪已启用！物体已落下，请倾斜设备。
				</div>
			)}

			{/* New message to indicate settling period */}
			{permissionGranted && deviceOrientationSupported && !isSettled && (
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
					pointerEvents: 'none',
				}}>
					物体正在落下...
				</div>
			)}
		</div>
	);
};

export default MatterCanvas;