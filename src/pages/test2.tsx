'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useDeviceMotion } from '@/hooks/test';


export default function PhysicsPage() {
	const sceneRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef(Matter.Engine.create());
	const boxesRef = useRef<Matter.Body[]>([]);

	const { accelerationIncludingGravity } = useDeviceMotion();

	useEffect(() => {
		const engine = engineRef.current;
		const render = Matter.Render.create({
			element: sceneRef.current!,
			engine,
			options: {
				width: window.innerWidth,
				height: window.innerHeight,
				wireframes: false,
				background: '#f0f0f0',
			},
		});

		// 地板
		const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 20, window.innerWidth, 40, {
			isStatic: true,
		});

		Matter.World.add(engine.world, [ground]);

		// 生成随机方块
		for (let i = 0; i < 10; i++) {
			const box = Matter.Bodies.rectangle(
				60 + i * 50,
				0,
				40,
				40,
				{
					restitution: 0.1,
					friction: 0.8,
					render: { fillStyle: '#333' },
				}
			);
			boxesRef.current.push(box);
		}

		Matter.World.add(engine.world, boxesRef.current);

		Matter.Engine.run(engine);
		Matter.Render.run(render);

		// 清理
		return () => {
			Matter.Render.stop(render);
			Matter.Engine.clear(engine);
			render.canvas.remove();
			render.textures = {};
		};
	}, []);

	// 响应陀螺仪（左右摇晃）
	useEffect(() => {
		const engine = engineRef.current;
		const interval = setInterval(() => {
			if (accelerationIncludingGravity?.x) {
				const xForce = accelerationIncludingGravity.x * 0.0005;
				boxesRef.current.forEach(body => {
					Matter.Body.applyForce(body, body.position, { x: xForce, y: 0 });
				});
			}
		}, 50);

		return () => clearInterval(interval);
	}, [accelerationIncludingGravity]);

	return (
		<div
			ref={sceneRef}
			style={{
				width: '100vw',
				height: '100vh',
				overflow: 'hidden',
				margin: 0,
				padding: 0,
			}}
		/>
	);
}
