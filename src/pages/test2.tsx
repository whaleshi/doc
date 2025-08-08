// pages/index.js
import dynamic from 'next/dynamic';

// 动态导入 MatterCanvas 组件，禁用 SSR
const MatterCanvas = dynamic(() => import('@/components/common/MatterCanvas'), {
	ssr: false,
});

export default function HomePage() {
	return (
		<div>
			<MatterCanvas />
		</div>
	);
}