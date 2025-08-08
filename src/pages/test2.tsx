import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function GyroPhysics() {
	const sceneRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<Matter.Engine | null>(null);
	const renderRef = useRef<Matter.Render | null>(null);

	useEffect(() => {
		if (!sceneRef.current) return;

		const Engine = Matter.Engine,
			Render = Matter.Render,
			World = Matter.World,
			Bodies = Matter.Bodies;

		const engine = Engine.create();
		engineRef.current = engine;
		engine.gravity.scale = 0.001;

		const width = window.innerWidth;
		const height = window.innerHeight;

		const render = Render.create({
			element: sceneRef.current,
			engine: engine,
			options: {
				width,
				height,
				wireframes: false,
				background: "#000",
			},
		});
		renderRef.current = render;

		// 边界
		const boundaries = [
			Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),
			Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
			Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
			Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true }),
		];
		World.add(engine.world, boundaries);

		// 随机生成块
		const colors = ["#FF5722", "#3F51B5", "#4CAF50", "#E91E63", "#FFC107"];
		for (let i = 0; i < 20; i++) {
			const size = 30 + Math.random() * 40;
			const shape =
				Math.random() > 0.5
					? Bodies.rectangle(
						Math.random() * width,
						(Math.random() * height) / 2,
						size,
						size,
						{
							restitution: 0.8,
							friction: 0.3,
							render: {
								fillStyle: colors[Math.floor(Math.random() * colors.length)],
							},
						}
					)
					: Bodies.circle(
						Math.random() * width,
						(Math.random() * height) / 2,
						size / 2,
						{
							restitution: 0.8,
							friction: 0.3,
							render: {
								fillStyle: colors[Math.floor(Math.random() * colors.length)],
							},
						}
					);
			World.add(engine.world, shape);
		}

		// 监听设备方向，更新重力
		const handleOrientation = (event: DeviceOrientationEvent) => {
			const gamma = event.gamma ?? 0; // 左右 [-90,90]
			const beta = event.beta ?? 0; // 前后 [-180,180]
			engine.gravity.x = gamma / 90;
			engine.gravity.y = beta / 90;
		};
		window.addEventListener("deviceorientation", handleOrientation);

		Engine.run(engine);
		Render.run(render);

		const handleResize = () => {
			if (!render.canvas) return;
			render.canvas.width = window.innerWidth;
			render.canvas.height = window.innerHeight;

			// 更新边界位置和尺寸
			World.remove(engine.world, boundaries);
			boundaries[0] = Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, { isStatic: true });
			boundaries[1] = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true });
			boundaries[2] = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
			boundaries[3] = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
			World.add(engine.world, boundaries);
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("deviceorientation", handleOrientation);
			window.removeEventListener("resize", handleResize);
			Render.stop(render);
			Engine.clear(engine);
			render.canvas.remove();
			render.textures = {};
		};
	}, []);

	return <div ref={sceneRef} style={{ width: "100vw", height: "100vh", overflow: "hidden" }} />;
}
