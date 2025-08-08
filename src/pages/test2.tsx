'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export default function PhysicsPage() {
	const sceneRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!sceneRef.current) return;

		const { Engine, Render, World, Bodies, Body, Events, Mouse, MouseConstraint } = Matter;

		const engine = Engine.create();
		const width = window.innerWidth;
		const height = window.innerHeight;

		const render = Render.create({
			element: sceneRef.current,
			engine,
			options: {
				width,
				height,
				background: '#111',
				wireframes: false,
			},
		});

		// 设置重力初始值
		engine.gravity.scale = 0.001;
		engine.gravity.y = 1;

		// 创建世界边界
		const boundaries = [
			Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }), // top
			Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }), // bottom
			Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }), // left
			Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true }), // right
		];
		World.add(engine.world, boundaries);

		// 添加多个圆形和方形
		const colors = ['#FF5722', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'];
		const shapes = [];

		for (let i = 0; i < 20; i++) {
			const size = 30 + Math.random() * 30;
			const x = Math.random() * width;
			const y = Math.random() * height * 0.5;

			const isCircle = Math.random() < 0.5;

			const body = isCircle
				? Bodies.circle(x, y, size / 2, {
					restitution: 0.4,
					friction: 0.2,
					render: { fillStyle: colors[i % colors.length] },
				})
				: Bodies.rectangle(x, y, size, size, {
					restitution: 0.4,
					friction: 0.2,
					render: { fillStyle: colors[i % colors.length] },
				});

			shapes.push(body);
		}

		World.add(engine.world, shapes);

		// 监听陀螺仪事件更新重力方向
		window.addEventListener(
			'deviceorientation',
			(event) => {
				const gamma = event.gamma ?? 0; // 左右 [-90,90]
				const beta = event.beta ?? 0; // 前后 [-180,180]
				engine.gravity.x = gamma / 90;
				engine.gravity.y = beta / 90;
			},
			true
		);

		// 添加鼠标拖动
		const mouse = Mouse.create(render.canvas);
		const mouseConstraint = MouseConstraint.create(engine, {
			mouse,
			constraint: {
				stiffness: 0.1,
				render: { visible: false },
			},
		});
		World.add(engine.world, mouseConstraint);

		// 启动引擎和渲染
		Engine.run(engine);
		Render.run(render);

		// 清理函数
		return () => {
			Render.stop(render);
			Engine.clear(engine);
			World.clear(engine.world, false);
			render.canvas.remove();
			render.textures = {};
		};
	}, []);

	return <div ref={sceneRef} style={{ width: '100vw', height: '100vh', touchAction: 'none' }} />;
}
