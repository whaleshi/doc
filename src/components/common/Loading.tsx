import React, { useEffect, useState } from 'react';

export default function SnakeCycle() {
	const [phase, setPhase] = useState<'eating' | 'rebuilding'>('eating');
	const [visibleFoods, setVisibleFoods] = useState([true, true, true]);
	const [snakeKey, setSnakeKey] = useState(0);

	useEffect(() => {
		if (phase === 'eating') {
			setVisibleFoods([true, true, true]);
			setTimeout(() => setVisibleFoods([false, true, true]), 500);
			setTimeout(() => setVisibleFoods([false, false, true]), 1000);
			setTimeout(() => setVisibleFoods([false, false, false]), 1500);
			setTimeout(() => {
				setPhase('rebuilding');
				setSnakeKey((k) => k + 1);
			}, 2200);
		}

		if (phase === 'rebuilding') {
			setTimeout(() => setVisibleFoods([true, false, false]), 500);
			setTimeout(() => setVisibleFoods([true, true, false]), 1000);
			setTimeout(() => setVisibleFoods([true, true, true]), 1500);
			setTimeout(() => {
				setPhase('eating');
				setSnakeKey((k) => k + 1);
			}, 2200);
		}
	}, [phase]);

	return (
		<div className="relative w-[90px] h-20 flex items-center justify-center overflow-hidden">
			{visibleFoods.map((visible, i) => (
				<div className='w-[30px]' key={i}>
					<div className='ml-[11px] food' style={{ opacity: visible ? 1 : 0, }}><AddIcon /></div>
				</div>
			))}
			<div key={snakeKey} className="snake w-[20px] h-[20px]">
				{phase === 'eating' ? <Eat /> : <Get />}
			</div>
		</div>
	);
}


const AddIcon = () => (
	<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M2.39941 2.39941H0V5.59961H2.39941V8H5.59961V5.59961H8V2.39941H5.59961V0H2.39941V2.39941Z" fill="#FFDF39" />
	</svg>
);

const Eat = () => (
	<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
		<path d="M2.46181 27.0771H4.92372V29.5381H9.84657V32H22.1542V29.5381H27.077V27.0771H29.539V22.1543H24.6161V19.6924H17.2313V17.2305H9.84657V14.7695H17.2313V12.3076H24.6161V9.8457H29.539V4.92285H27.077V2.46191H22.1542V0H9.84657V2.46191H4.92372V4.92285H2.46181V9.8457H-0.000106812V22.1543H2.46181V27.0771Z" fill="#FFDF39" />
		<path d="M12.3081 7.38434H11.0776V9.84625H12.3081V11.0767H14.77V9.84625H16.0005V7.38434H14.77V6.15387H12.3081V7.38434Z" fill="black" />
	</svg>
);

const Get = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M15.0003 20H17.6927V18.8467H15.0003V20ZM8.46127 20H11.1537V18.8467H8.46127V20ZM1.53842 20H4.61557V18.8467H1.53842V20ZM0.385101 18.8457H5.3851V17.3076H7.30795V18.8457H12.308V17.3076H13.846V18.8457H19.2308V8.07715H0.385101V18.8457ZM2.69272 4.61523H1.53842V8.07617H17.6927V4.61523H16.5384V3.07715H2.69272V4.61523ZM6.92319 1.53809H4.2308V3.07617H15.0003V1.53809H12.308V0H6.92319V1.53809Z" fill="#FE4A4A" />
		<path d="M13.8456 10.7698H16.538V9.61548H13.8456V10.7698ZM7.3075 10.7698H9.99988V9.61548H7.3075V10.7698ZM13.8456 5.76978H12.3075V9.23071H17.6923V5.76978H16.538V4.61548H13.8456V5.76978ZM7.3075 5.76978H5.76941V9.23071H11.1542V5.76978H9.99988V4.61548H7.3075V5.76978Z" fill="#FFE5E5" />
		<rect width="5" height="0.384615" transform="matrix(-1 0 0 1 17.3077 9.23096)" fill="#FFE5E5" />
		<rect width="5" height="0.384615" transform="matrix(-1 0 0 1 10.7692 9.23096)" fill="#FFE5E5" />
		<path d="M15.3846 7.30713V7.69189H14.9999V9.22998H15.3846V9.61475H14.9999V9.61572H17.6923V9.61475H17.3075V9.22998H17.6923V7.69189H17.3075V7.30713H15.3846Z" fill="black" />
		<path d="M8.84625 7.30713V7.69189H8.46149V9.22998H8.84625V9.61475H8.46149V9.61572H11.1539V9.61475H10.7691V9.22998H11.1539V7.69189H10.7691V7.30713H8.84625Z" fill="black" />
	</svg>
);