"use client";

import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const colors = ["#FF5722", "#3F51B5", "#4CAF50", "#E91E63", "#FFC107"];

export default function GyroPhysics() {
	const sceneRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<Matter.Engine>(null);
	const renderRef = useRef<Matter.Render>(null);

	useEffect(() => {
		if (!sceneRef.current) return;

		const Engine = Matter.Engine;
		const Render = Matter.Render;
		const World = Matter.World;
		const Bodies = Matter.Bodies;

		// 创建引擎
		const engine = Engine.create();
		engineRef.current = engine;
		engine.gravity.scale = 0.005;

		// 创建渲染器
		const render = Render.create({
			element: sceneRef.current,
			engine: engine,
			options: {
				width: window.innerWidth,
				height: window.innerHeight,
				wireframes: false,
				background: "#000",
			},
		});
		renderRef.current = render;

		// 边界
		const boundaries = [
			Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, { isStatic: true }),
			Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true }),
			Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
			Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
		];
		World.add(engine.world, boundaries);

		// 创建多个物体
		for (let i = 0; i < 20; i++) {
			const size = 30 + Math.random() * 40;
			let body: Matter.Body;

			if (Math.random() > 0.5) {
				body = Bodies.rectangle(
					Math.random() * window.innerWidth,
					Math.random() * (window.innerHeight / 4),
					size,
					size,
					{
						restitution: 0.3,
						friction: 0.1,
						render: { fillStyle: colors[Math.floor(Math.random() * colors.length)] },
					}
				);
			} else {
				body = Bodies.circle(
					Math.random() * window.innerWidth,
					Math.random() * (window.innerHeight / 4),
					size / 2,
					{
						restitution: 0.3,
						friction: 0.1,
						render: { fillStyle: colors[Math.floor(Math.random() * colors.length)] },
					}
				);
			}

			World.add(engine.world, body);
		}

		// 监听陀螺仪
		const handleOrientation = (event: DeviceOrientationEvent) => {
			const gamma = event.gamma ?? 0; // 左右 [-90,90]
			const beta = event.beta ?? 0;   // 前后 [-180,180]

			engine.gravity.x = gamma / 90;
			engine.gravity.y = beta / 90;
		};

		// iOS 13+ 需要权限请求
		const requestPermission = async () => {
			if (
				typeof DeviceOrientationEvent !== "undefined" &&
				typeof (DeviceOrientationEvent as any).requestPermission === "function"
			) {
				try {
					const response = await (DeviceOrientationEvent as any).requestPermission();
					if (response === "granted") {
						window.addEventListener("deviceorientation", handleOrientation);
					}
				} catch {
					// 权限被拒绝或其他错误
					window.addEventListener("deviceorientation", handleOrientation);
				}
			} else {
				window.addEventListener("deviceorientation", handleOrientation);
			}
		};

		requestPermission();

		Engine.run(engine);
		Render.run(render);

		const handleResize = () => {
			if (render.canvas) {
				render.canvas.width = window.innerWidth;
				render.canvas.height = window.innerHeight;
			}
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("deviceorientation", handleOrientation);
			Render.stop(render);
			Engine.clear(engine);
			render.canvas.remove();
			render.textures = {};
		};
	}, []);

	return <div ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />;
}
