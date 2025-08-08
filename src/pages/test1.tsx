import { useEffect, useState, useRef } from 'react';

type Block = {
	id: number;
	x: number;  // 横坐标，单位 px
	y: number;  // 纵坐标，单位 px
	width: number;
	height: number;
	falling: boolean; // 是否正在掉落
};

export default function FallingBlocks() {
	const containerWidth = 300;
	const containerHeight = 500;
	const blockSize = 50;

	const [blocks, setBlocks] = useState<Block[]>([]);
	const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });
	const requestRef = useRef<number>(null);

	// 初始化几个块，横坐标随机，y坐标负数(屏幕上方)
	useEffect(() => {
		const initialBlocks: Block[] = [];
		for (let i = 0; i < 5; i++) {
			initialBlocks.push({
				id: i,
				x: Math.random() * (containerWidth - blockSize),
				y: -Math.random() * 300 - blockSize,
				width: blockSize,
				height: blockSize,
				falling: true,
			});
		}
		setBlocks(initialBlocks);
	}, []);

	// 监听陀螺仪，用gamma（左右倾斜）调节横坐标偏移，beta（前后倾斜）暂时没用
	useEffect(() => {
		const handleOrientation = (e: DeviceOrientationEvent) => {
			setOrientation({
				beta: e.beta ?? 0,
				gamma: e.gamma ?? 0,
			});
		};

		if (
			typeof DeviceOrientationEvent !== 'undefined' &&
			typeof (DeviceOrientationEvent as any).requestPermission === 'function'
		) {
			(DeviceOrientationEvent as any).requestPermission().then((res: string) => {
				if (res === 'granted') {
					window.addEventListener('deviceorientation', handleOrientation, true);
				}
			});
		} else {
			window.addEventListener('deviceorientation', handleOrientation, true);
		}

		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	}, []);

	// 帧动画控制下落和碰撞
	const animate = () => {
		setBlocks((prev) => {
			const gravity = 3; // 每帧下落速度(px)
			const maxXOffset = 15; // 陀螺仪左右最大偏移(px)
			let newBlocks = [...prev];

			// 根据 gamma 陀螺仪左右倾斜度 [-90,90]映射到 [-maxXOffset, maxXOffset]
			const gamma = Math.max(Math.min(orientation.gamma, 90), -90);
			const offsetX = (gamma / 90) * maxXOffset;

			// 模拟每个方块下落
			for (let i = 0; i < newBlocks.length; i++) {
				if (newBlocks[i].falling) {
					let newY = newBlocks[i].y + gravity;
					if (newY + blockSize > containerHeight) {
						// 撞到底部，停止下落，放置到底部
						newY = containerHeight - blockSize;
						newBlocks[i].falling = false;
					}

					// 横坐标跟陀螺仪左右偏移，加上初始x，限制边界
					let newX = newBlocks[i].x + offsetX;
					if (newX < 0) newX = 0;
					if (newX + blockSize > containerWidth) newX = containerWidth - blockSize;

					// 碰撞检测：不能和其他已停止的方块垂直重叠
					for (let j = 0; j < newBlocks.length; j++) {
						if (i === j) continue;
						if (!newBlocks[j].falling) {
							// 判断是否重叠（简单矩形碰撞检测）
							const rect1 = { x: newX, y: newY, w: blockSize, h: blockSize };
							const rect2 = { x: newBlocks[j].x, y: newBlocks[j].y, w: blockSize, h: blockSize };
							const isOverlap = !(
								rect1.x + rect1.w <= rect2.x ||
								rect1.x >= rect2.x + rect2.w ||
								rect1.y + rect1.h <= rect2.y ||
								rect1.y >= rect2.y + rect2.h
							);

							if (isOverlap) {
								// 堆叠在该块上面
								newY = newBlocks[j].y - blockSize;
								newBlocks[i].falling = false;
								break;
							}
						}
					}

					newBlocks[i] = { ...newBlocks[i], x: newX, y: newY, falling: newBlocks[i].falling };
				} else {
					// 停止下落，方块跟随陀螺仪左右微调位置
					let newX = newBlocks[i].x + offsetX;
					if (newX < 0) newX = 0;
					if (newX + blockSize > containerWidth) newX = containerWidth - blockSize;
					newBlocks[i] = { ...newBlocks[i], x: newX };
				}
			}

			return newBlocks;
		});

		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => {
			if (requestRef.current) cancelAnimationFrame(requestRef.current);
		};
	}, [orientation]);

	return (
		<div
			style={{
				width: containerWidth,
				height: containerHeight,
				border: "2px solid #444",
				margin: "auto",
				position: "relative",
				background: "#fafafa",
				overflow: "hidden",
				touchAction: "none",
			}}
		>
			{blocks.map((block) => (
				<div
					key={block.id}
					style={{
						width: block.width,
						height: block.height,
						backgroundColor: "deepskyblue",
						position: "absolute",
						left: block.x,
						top: block.y,
						borderRadius: 8,
						boxShadow: "0 0 6px rgba(0,0,255,0.7)",
						userSelect: "none",
					}}
				/>
			))}
			<p style={{ position: "absolute", bottom: 5, left: 10, fontSize: 12, color: "#666" }}>
				倾斜手机让方块左右移动，方块从上方掉落并堆叠
			</p>
		</div>
	);
}
