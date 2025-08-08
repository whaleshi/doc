import { useEffect, useState } from 'react';

export default function GyroscopeDemo() {
	const [orientation, setOrientation] = useState({
		alpha: 0, // 设备围绕 Z 轴旋转的角度（0 ~ 360）
		beta: 0,  // X 轴（前后倾斜，-180 ~ 180）
		gamma: 0, // Y 轴（左右倾斜，-90 ~ 90）
	});

	useEffect(() => {
		const handleOrientation = (event: DeviceOrientationEvent) => {
			setOrientation({
				alpha: event.alpha ?? 0,
				beta: event.beta ?? 0,
				gamma: event.gamma ?? 0,
			});
		};

		// 权限请求（iOS 13+ 必须）
		const requestPermission = async () => {
			if (
				typeof DeviceOrientationEvent !== 'undefined' &&
				typeof (DeviceOrientationEvent as any).requestPermission === 'function'
			) {
				const response = await (DeviceOrientationEvent as any).requestPermission();
				if (response === 'granted') {
					window.addEventListener('deviceorientation', handleOrientation, true);
				}
			} else {
				// 非 iOS 或不需要权限
				window.addEventListener('deviceorientation', handleOrientation, true);
			}
		};

		requestPermission();

		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	}, []);

	const requestIOSPermission = async () => {
		if (
			typeof DeviceOrientationEvent !== 'undefined' &&
			typeof (DeviceOrientationEvent as any).requestPermission === 'function'
		) {
			try {
				const result = await (DeviceOrientationEvent as any).requestPermission();
				if (result === 'granted') {
					window.addEventListener('deviceorientation', handleOrientation, true);
				} else {
					alert("权限被拒绝");
				}
			} catch (err) {
				alert("请求失败：" + err);
			}
		} else {
			// Android 或非 iOS13+，直接监听
			window.addEventListener('deviceorientation', handleOrientation, true);
		}
	};

	const handleOrientation = (event: DeviceOrientationEvent) => {
		console.log("alpha:", event.alpha, "beta:", event.beta, "gamma:", event.gamma);
	};


	return (
		<div style={{ padding: 20 }}>
			<button onClick={requestIOSPermission}>启用陀螺仪</button>
			<h2>手机陀螺仪数据</h2>
			<p>Alpha (Z轴旋转): {orientation.alpha.toFixed(2)}</p>
			<p>Beta (X轴前后倾): {orientation.beta.toFixed(2)}</p>
			<p>Gamma (Y轴左右倾): {orientation.gamma.toFixed(2)}</p>
		</div>
	);
}
