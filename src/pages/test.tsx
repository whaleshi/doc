import { useEffect, useState } from 'react';

export default function GyroscopeDemo() {
	const [orientation, setOrientation] = useState({
		alpha: 0, // 设备围绕 Z 轴旋转的角度（0 ~ 360）
		beta: 0,  // X 轴（前后倾斜，-180 ~ 180）
		gamma: 0, // Y 轴（左右倾斜，-90 ~ 90）
	});
	const [permissionGranted, setPermissionGranted] = useState(false);

	// 监听函数要用 useCallback 或放外面，避免重复添加监听器
	const handleOrientation = (event: DeviceOrientationEvent) => {
		setOrientation({
			alpha: event.alpha ?? 0,
			beta: event.beta ?? 0,
			gamma: event.gamma ?? 0,
		});
	};

	const requestIOSPermission = async () => {
		if (
			typeof DeviceOrientationEvent !== 'undefined' &&
			typeof (DeviceOrientationEvent as any).requestPermission === 'function'
		) {
			try {
				const result = await (DeviceOrientationEvent as any).requestPermission();
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
		// 自动尝试监听（可根据需要注释掉）
		requestIOSPermission();

		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	}, []);

	// 计算小球位置，限制最大偏移50px
	const maxTilt = 30; // 陀螺仪最大角度映射
	const clamp = (num: number, min: number, max: number) =>
		Math.min(Math.max(num, min), max);

	const xPercent = clamp(orientation.gamma, -maxTilt, maxTilt) / maxTilt;
	const yPercent = clamp(orientation.beta, -maxTilt, maxTilt) / maxTilt;

	const maxMove = 50;

	return (
		<div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 400, margin: "auto" }}>
			<button onClick={requestIOSPermission} disabled={permissionGranted} style={{ marginBottom: 20 }}>
				{permissionGranted ? "陀螺仪已启用" : "启用陀螺仪"}
			</button>

			<h2>手机陀螺仪数据</h2>
			<p>Alpha (Z轴旋转): {orientation.alpha.toFixed(2)}</p>
			<p>Beta (X轴前后倾): {orientation.beta.toFixed(2)}</p>
			<p>Gamma (Y轴左右倾): {orientation.gamma.toFixed(2)}</p>

			<div
				style={{
					width: 200,
					height: 200,
					border: "2px solid #333",
					borderRadius: "50%",
					margin: "40px auto",
					position: "relative",
					background: "#eee",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: 40,
						height: 40,
						background: "deepskyblue",
						borderRadius: "50%",
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: `translate(calc(-50% + ${xPercent * maxMove}px), calc(-50% + ${yPercent * maxMove}px))`,
						transition: "transform 0.1s ease-out",
						boxShadow: "0 0 8px rgba(0, 191, 255, 0.6)",
					}}
				/>
			</div>
			<p style={{ textAlign: "center" }}>请用手机倾斜屏幕，观察小球移动</p>
		</div>
	);
}
