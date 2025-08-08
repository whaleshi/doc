// pages/gyroscope-falling.tsx
import React, { useEffect, useState, useRef } from "react";

const NUM_BLOCKS = 5;
const BLOCK_SIZE = 80;
const GRAVITY = 0.8;
const FLOOR_FRICTION = 0.8;
const ELASTICITY = 0.6;

function useDeviceOrientation() {
	const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });

	useEffect(() => {
		function handleOrientation(e: DeviceOrientationEvent) {
			setOrientation({
				beta: e.beta ?? 0,   // X轴倾斜，前后
				gamma: e.gamma ?? 0, // Y轴倾斜，左右
			});
		}

		if (
			typeof DeviceOrientationEvent !== "undefined" &&
			typeof (DeviceOrientationEvent as any).requestPermission === "function"
		) {
			// iOS 13+ 需要请求权限
			(DeviceOrientationEvent as any)
				.requestPermission()
				.then((result: string) => {
					if (result === "granted") {
						window.addEventListener("deviceorientation", handleOrientation);
					}
				})
				.catch(console.error);
		} else {
			window.addEventListener("deviceorientation", handleOrientation);
		}

		return () => {
			window.removeEventListener("deviceorientation", handleOrientation);
		};
	}, []);

	return orientation;
}

type Block = {
	id: number;
	x: number;
	y: number;
	vy: number; // 垂直速度
	vx: number; // 水平速度
};

export default function GyroFalling() {
	const { beta, gamma } = useDeviceOrientation();

	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [blocks, setBlocks] = useState<Block[]>([]);
	const rafId = useRef<number>(null);

	// 初始化窗口大小和blocks
	useEffect(() => {
		if (typeof window !== "undefined") {
			const width = window.innerWidth;
			const height = window.innerHeight;
			setWindowSize({ width, height });

			// 初始化blocks，上面排列，不重叠，居中
			const initBlocks: Block[] = Array(NUM_BLOCKS)
				.fill(0)
				.map((_, i) => ({
					id: i,
					x: width / 2 - BLOCK_SIZE / 2,
					y: -BLOCK_SIZE * (NUM_BLOCKS - i), // 上面堆叠
					vy: 0,
					vx: 0,
				}));

			setBlocks(initBlocks);
		}
	}, []);

	// 物理模拟主循环
	useEffect(() => {
		if (!windowSize.width || !windowSize.height) return;

		let lastTime = performance.now();

		function step() {
			const now = performance.now();
			const dt = (now - lastTime) / 16; // 基于60fps的时间比例
			lastTime = now;

			setBlocks((oldBlocks) => {
				let newBlocks = [...oldBlocks];

				// 根据陀螺仪偏角控制水平加速度
				// gamma: -90(左倾) ~ +90(右倾)，映射为水平加速度
				const maxAccel = 0.5;
				const ax = (gamma / 90) * maxAccel;

				// 逐个计算块物理运动
				for (let i = 0; i < newBlocks.length; i++) {
					let b = { ...newBlocks[i] };

					// 水平加速度叠加
					b.vx += ax * dt;
					// 水平阻尼 (摩擦力)
					b.vx *= 0.95;

					// 垂直加速度（重力）
					b.vy += GRAVITY * dt;

					// 更新位置
					b.x += b.vx * dt * 10; // 放大一点速度感
					b.y += b.vy * dt * 10;

					// 边界检测 - 左右墙壁反弹
					if (b.x < 0) {
						b.x = 0;
						b.vx = -b.vx * ELASTICITY;
					} else if (b.x + BLOCK_SIZE > windowSize.width) {
						b.x = windowSize.width - BLOCK_SIZE;
						b.vx = -b.vx * ELASTICITY;
					}

					// 底部检测 - 堆叠在底部或别的块上
					// 先假设底部
					let floorY = windowSize.height - BLOCK_SIZE;

					// 再检测上方块，防止重叠
					for (let j = 0; j < newBlocks.length; j++) {
						if (i === j) continue;
						const other = newBlocks[j];

						// 判断x方向是否重叠
						const horizontalOverlap =
							b.x < other.x + BLOCK_SIZE && b.x + BLOCK_SIZE > other.x;

						if (horizontalOverlap && other.y + BLOCK_SIZE <= floorY) {
							// 如果其他块在b下面并且更靠上，floorY设为其他块顶部
							if (other.y + BLOCK_SIZE > floorY) continue;
							floorY = Math.min(floorY, other.y - BLOCK_SIZE);
						}
					}

					if (b.y > floorY) {
						b.y = floorY;
						if (Math.abs(b.vy) > 0.1) {
							b.vy = -b.vy * ELASTICITY; // 轻微反弹
						} else {
							b.vy = 0;
						}

						// 水平速度衰减模仿摩擦
						b.vx *= FLOOR_FRICTION;
					}

					newBlocks[i] = b;
				}

				return newBlocks;
			});

			rafId.current = requestAnimationFrame(step);
		}

		rafId.current = requestAnimationFrame(step);
		return () => {
			if (rafId.current) cancelAnimationFrame(rafId.current);
		};
	}, [windowSize, beta, gamma]);

	return (
		<div
			style={{
				position: "relative",
				width: windowSize.width || "100vw",
				height: windowSize.height || "100vh",
				overflow: "hidden",
				background: "#111",
			}}
		>
			{blocks.map(({ id, x, y }) => (
				<div
					key={id}
					style={{
						position: "absolute",
						width: BLOCK_SIZE,
						height: BLOCK_SIZE,
						borderRadius: 12,
						backgroundColor: "#4fc3f7",
						boxShadow: "0 0 10px #42a5f5",
						userSelect: "none",
						transform: `translate3d(${x}px, ${y}px, 0)`,
						transition: "box-shadow 0.3s",
					}}
				/>
			))}

			<div
				style={{
					position: "absolute",
					top: 20,
					left: 20,
					color: "#eee",
					fontFamily: "sans-serif",
					fontSize: 16,
					background: "rgba(0,0,0,0.5)",
					padding: 10,
					borderRadius: 8,
					userSelect: "none",
				}}
			>
				<div>陀螺仪数据:</div>
				<div>Beta (前后倾斜): {beta.toFixed(2)}</div>
				<div>Gamma (左右倾斜): {gamma.toFixed(2)}</div>
			</div>
		</div>
	);
}
