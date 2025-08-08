// pages/index.tsx

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

export default function PhysicsGyroDemo() {
	const sceneRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<Matter.Engine>();
	const [permissionGranted, setPermissionGranted] = useState(false);

	useEffect(() => {
		if (!sceneRef.current) return;

		// 初始化引擎和渲染器
		const engine = Matter.Engine.create();
		engine.world.gravity.scale = 0.001;
		engineRef.current = engine;

		const width = window.innerWidth;
		const height = window.innerHeight;

		const render = Matter.Render.create({
			element: sceneRef.current,
			engine: engine,
			options: {
				width,
				height,
				wireframes: false,
				background: "#000",
			},
		});

		// 创建世界边界
		const edges = [
			Matter.Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true }),
			Matter.Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }),
			Matter.Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }),
			Matter.Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }),
		];
		Matter.World.add(engine.world, edges);

		// 创建若干形状
		const shapes: Matter.Body[] = [];
		const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
		for (let i = 0; i < 5; i++) {
			const x = 100 + i * 80;
			const y = 100;
			const size = 50;
			const body =
				i % 2 === 0
					? Matter.Bodies.circle(x, y, size / 2, {
						density: 1,
						restitution: 0.8,
						friction: 1,
						frictionAir: 0.1,
						render: { fillStyle: colors[i] },
					})
					: Matter.Bodies.rectangle(x + 30, y + 30, size, size, {
						density: 1,
						restitution: 0.8,
						friction: 1,
						frictionAir: 0.1,
						render: { fillStyle: colors[i] },
					});
			shapes.push(body);
		}
		Matter.World.add(engine.world, shapes);

		// 鼠标拖拽支持
		const mouseConstraint = Matter.MouseConstraint.create(engine, {
			element: render.canvas,
			constraint: { stiffness: 0.2, render: { visible: false } },
		});
		Matter.World.add(engine.world, mouseConstraint);

		// 监听窗口大小变化
		const handleResize = () => {
			const w = window.innerWidth;
			const h = window.innerHeight;
			render.canvas.width = w;
			render.canvas.height = h;
			render.options.width = w;
			render.options.height = h;

			// 移除旧边界，添加新边界
			Matter.World.remove(engine.world, edges);
			edges.length = 0;
			edges.push(
				Matter.Bodies.rectangle(w / 2, -50, w, 100, { isStatic: true }),
				Matter.Bodies.rectangle(w / 2, h + 50, w, 100, { isStatic: true }),
				Matter.Bodies.rectangle(-50, h / 2, 100, h, { isStatic: true }),
				Matter.Bodies.rectangle(w + 50, h / 2, 100, h, { isStatic: true })
			);
			Matter.World.add(engine.world, edges);
		};
		window.addEventListener("resize", handleResize);

		// 启动引擎和渲染
		Matter.Engine.run(engine);
		Matter.Render.run(render);

		// 清理
		return () => {
			Matter.Render.stop(render);
			Matter.World.clear(engine.world, false);
			Matter.Engine.clear(engine);
			render.canvas.remove();
			render.textures = {};
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// 陀螺仪事件处理函数
	const handleOrientation = (e: DeviceOrientationEvent) => {
		const engine = engineRef.current;
		if (!engine) return;

		// gamma 左右 [-90,90], beta 前后 [-180,180]
		engine.world.gravity.x = e.gamma ? e.gamma / 90 : 0;
		engine.world.gravity.y = e.beta ? e.beta / 90 : 1;
	};

	// iOS 13+ 权限请求按钮事件
	const requestPermission = () => {
		if (
			typeof DeviceOrientationEvent !== "undefined" &&
			typeof (DeviceOrientationEvent as any).requestPermission === "function"
		) {
			(DeviceOrientationEvent as any)
				.requestPermission()
				.then((result: string) => {
					if (result === "granted") {
						window.addEventListener("deviceorientation", handleOrientation, true);
						setPermissionGranted(true);
					} else {
						alert("陀螺仪权限被拒绝");
					}
				})
				.catch(console.error);
		} else {
			// 非iOS设备或旧版本直接监听
			window.addEventListener("deviceorientation", handleOrientation, true);
			setPermissionGranted(true);
		}
	};

	return (
		<>
			{!permissionGranted && (
				<button
					onClick={requestPermission}
					style={{
						position: "fixed",
						top: 20,
						left: 20,
						zIndex: 1000,
						padding: "10px 20px",
						fontSize: 16,
						cursor: "pointer",
					}}
				>
					启用陀螺仪
				</button>
			)}
			<div
				ref={sceneRef}
				style={{
					width: "100vw",
					height: "100vh",
					overflow: "hidden",
					touchAction: "none",
					backgroundColor: "#000",
				}}
			/>
		</>
	);
}
