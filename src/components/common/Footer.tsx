import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUserStore } from '@/stores/user';

export default function Footer() {
	const router = useRouter();
	const commonUser = useUserStore((state) => state.commonUser);
	console.log(router)
	return (
		<footer className='bg-[rgba(0,0,0,0.10)] fixed bottom-0 left-0 h-[56px] w-full flex justify-center backdrop-blur-[20px] z-[100]'>
			<div className='w-full max-w-[450px] flex items-center justify-around f500 text-[10px] text-[rgba(255,255,255,0.35)]'>
				<div onClick={() => router.push('/')} className='flex flex-col items-center cursor-pointer'>
					<HomeIcon opacity={router.pathname === '/' ? "1" : "0.35"} />
					<div className={`mt-[2px] ${router.pathname === '/' && 'text-[#fff]'}`}>首页</div>
				</div>
				<div onClick={() => commonUser?.addr && router.push('/invite')} className='flex flex-col items-center cursor-pointer'>
					<InviteIcon opacity={router.pathname === '/invite' ? "1" : "0.35"} />
					<div className={`mt-[2px] ${router.pathname === '/invite' && 'text-[#fff]'}`}>邀请</div>
				</div>
				<div onClick={() => commonUser?.addr && router.push(`/address/${commonUser?.addr}`)} className='flex flex-col items-center cursor-pointer'>
					<MeIcon opacity={router.pathname === '/address/[address]' ? "1" : "0.35"} />
					<div className={`mt-[2px] ${router.pathname === '/address/[address]' && 'text-[#fff]'}`}>我的</div>
				</div>
			</div>
		</footer>
	);
}


const HomeIcon = ({ opacity = "0.35" }: { opacity?: any }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<g opacity={opacity}>
			<path d="M10.7441 2.38281C11.4989 1.8724 12.5011 1.8724 13.2559 2.38281L21.0557 7.65722C21.6359 8.0496 22 8.70114 22 9.41601V19.2881C22 20.8324 20.6986 21.9999 19.2002 22H4.7998C3.30143 21.9999 2 20.8324 2 19.2881V9.41601C2.00001 8.70114 2.36412 8.0496 2.94434 7.65722L10.7441 2.38281ZM16.707 14.793C16.3165 14.4024 15.6835 14.4024 15.293 14.793C13.5312 16.5548 10.7089 16.6097 8.88086 14.958L8.70703 14.793L8.63086 14.7246C8.23809 14.4043 7.65908 14.4268 7.29297 14.793C6.92685 15.1591 6.90426 15.7381 7.22461 16.1309L7.29297 16.207L7.54102 16.4434C10.1542 18.8044 14.1886 18.7255 16.707 16.207C17.0976 15.8165 17.0976 15.1835 16.707 14.793Z" fill="white" />
		</g>
	</svg>
);

const InviteIcon = ({ opacity = "0.35" }: { opacity?: any }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<g opacity={opacity}>
			<path d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM12 6.10449C11.4645 6.10449 11.0303 6.50365 11.0303 6.99609V7.80664H10.7881C10.0431 7.80664 9.33192 8.08415 8.81055 8.57227C8.28974 9.06002 8 9.71851 8 10.4014C8 11.0842 8.28974 11.7427 8.81055 12.2305C9.33192 12.7186 10.043 12.9961 10.7881 12.9961H13.2119C13.4311 12.9961 13.6451 13.0772 13.8057 13.2275C13.9667 13.3784 14.0605 13.5864 14.0605 13.8066C14.0605 14.027 13.9668 14.2358 13.8057 14.3867C13.6451 14.5369 13.431 14.6182 13.2119 14.6182H10.8135C10.6543 14.6086 10.4995 14.556 10.3682 14.4648C10.2319 14.3703 10.1267 14.2379 10.0684 14.083C9.89323 13.6176 9.34009 13.3712 8.83398 13.5322C8.3282 13.6934 8.06029 14.2008 8.23535 14.666C8.41829 15.1521 8.75327 15.5786 9.2002 15.8887C9.64727 16.1988 10.1853 16.3777 10.7451 16.4004C10.7593 16.401 10.7739 16.4014 10.7881 16.4014H11.0303V17.2129C11.0305 17.7052 11.4646 18.1045 12 18.1045C12.5354 18.1045 12.9695 17.7052 12.9697 17.2129V16.4014H13.2119C13.957 16.4014 14.6681 16.124 15.1895 15.6357C15.7103 15.148 16 14.4895 16 13.8066C15.9999 13.1239 15.7102 12.4662 15.1895 11.9785C14.6681 11.4902 13.9571 11.2129 13.2119 11.2129H10.7881C10.5689 11.2129 10.3549 11.1308 10.1943 10.9805C10.0332 10.8296 9.93945 10.6217 9.93945 10.4014C9.93946 10.181 10.0332 9.97317 10.1943 9.82227C10.3549 9.67191 10.5689 9.58984 10.7881 9.58984H13.1865C13.3456 9.59937 13.5005 9.65206 13.6318 9.74316C13.768 9.83764 13.8733 9.9702 13.9316 10.125C14.1068 10.5904 14.6599 10.8378 15.166 10.6768C15.6719 10.5156 15.9397 10.0073 15.7646 9.54199C15.5817 9.05599 15.2466 8.62932 14.7998 8.31934C14.3528 8.00928 13.8147 7.83028 13.2549 7.80762C13.2407 7.80704 13.2261 7.80664 13.2119 7.80664H12.9697V6.99609C12.9697 6.50365 12.5355 6.10449 12 6.10449Z" fill="white" />
		</g>
	</svg>
);

const MeIcon = ({ opacity = "0.35" }: { opacity?: any }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<g opacity={opacity}>
			<circle cx="12" cy="7" r="5" fill="white" stroke="white" />
			<path d="M2.5 20C2.5 16.6863 5.18629 14 8.5 14H15.5C18.8137 14 21.5 16.6863 21.5 20C21.5 21.1046 20.6046 22 19.5 22H4.5C3.39543 22 2.5 21.1046 2.5 20Z" fill="white" />
		</g>
	</svg>
);