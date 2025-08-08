import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useLogin } from "@privy-io/react-auth";
import useApiLogin from '@/hooks/useApiLogin';
import { useUserStore } from '@/stores/user';
import AvatarImage from '@/components/common/AvatarImage';



import ReadIcon from '@/icons/red.svg';

export default function Header() {
	const router = useRouter();
	const { t, i18n } = useTranslation();
	const [mounted, setMounted] = useState(false);
	const { apiLogin } = useApiLogin();
	const commonUser = useUserStore((state) => state.commonUser);
	const [lang, setLang] = useState('en');
	const [createStatus, setCreateStatus] = useState(false);


	useEffect(() => {
		if (typeof window !== 'undefined') {
			const lang = i18n?.language || 'en'
			const html = document.documentElement
			html.lang = lang
			html.classList.remove('lang-en', 'lang-zh')
			html.classList.add(`lang-${lang}`)
			setLang(lang);
		}
	}, [i18n.language])

	const toCreate = () => {
		if (commonUser?.addr) {
			setCreateStatus(true);
		} else {
			toLogin();
		}
	}


	const { login: toLogin } = useLogin({
		onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
			console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount)
			const solanaWallet = user?.linkedAccounts.find(
				(account) =>
					account.type === "wallet" &&
					account.walletClientType === "privy" &&
					account.chainType === "solana",
			)
			apiLogin({ user, solanaWallet })
		},
		onError: (error) => {
			console.error("Login failed", error);
		},
	});

	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) return null;

	return <>
		<header className='w-full max-w-[450px] fixed h-[56px] flex items-center justify-between px-[16px] bg-[#6730fe] z-[100]'>
			<Link href='/'>
				<Image src="/images/common/headLogo.png" alt="logo" width={114} height={24} priority />
			</Link>
			<div className='flex items-center f600'>
				<div onClick={() => i18n.changeLanguage(lang === 'en' ? 'zh' : 'en')}>
					{lang === 'en' ? <LangEnIcon /> : <LangIcon />}
				</div>
				<div className='h-[36px] px-[12px] flex items-center justify-center cursor-pointer bg-[rgba(0,0,0,0.10)] rounded-[12px] text-[13px] text-[#fff] mx-[12px]' onClick={() => { toCreate() }}>
					<ReadIcon className='mr-[2px]' />发红包
				</div>
				{
					commonUser?.addr ? <div className='cursor-pointer' onClick={() => { router.push(`/address/${commonUser?.addr}`) }}>
						<AvatarImage src={commonUser?.twitter_info?.profile_image_url} width={32} height={32} round />
					</div> : <div className='h-[36px] px-[12px] flex items-center justify-center cursor-pointer rounded-[12px] text-[13px] text-[#101010] bg-[#60EF60]' onClick={() => { toLogin() }}>{t('Header.login')}</div>
				}
			</div>
		</header>
	</>;
}

const LangIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="cursor-pointer">
		<path d="M11 7V18M7 10H15V15H7V10Z" stroke="white" stroke-width="2" />
		<path d="M8 19.5V21C8 22.6569 9.34315 24 11 24H13.5" stroke="white" stroke-opacity="0.35" stroke-width="2" />
		<path d="M23.5 13.5L23.5 12C23.5 10.3431 22.1569 9 20.5 9L18 9" stroke="white" stroke-opacity="0.35" stroke-width="2" />
		<path d="M26.1553 25H23.9746L22.6699 22H18.6387L17.4648 25H15.3174L19.4258 14.5H21.5898L26.1553 25ZM19.4219 20H21.8008L20.5488 17.1201L19.4219 20Z" fill="white" fill-opacity="0.35" />
	</svg>
)

const LangEnIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="cursor-pointer">
		<path d="M11 7V18M7 10H15V15H7V10Z" stroke="white" stroke-opacity="0.35" stroke-width="2" />
		<path d="M8 19.5V21C8 22.6569 9.34315 24 11 24H13.5" stroke="white" stroke-width="2" />
		<path d="M23.5 13.5L23.5 12C23.5 10.3431 22.1569 9 20.5 9L18 9" stroke="white" stroke-width="2" />
		<path d="M26.1553 25H23.9746L22.6699 22H18.6387L17.4648 25H15.3174L19.4258 14.5H21.5898L26.1553 25ZM19.4219 20H21.8008L20.5488 17.1201L19.4219 20Z" fill="white" />
	</svg>
)