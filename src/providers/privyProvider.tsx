'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

export default function PrivyProviders({ children }: { children: React.ReactNode }) {
	const privyId = process.env.NEXT_PUBLIC_PRIVY_ID;
	return (
		<PrivyProvider
			appId={privyId as string}
			config={{
				appearance: {
					accentColor: "#6730fe",
					theme: "#FFFFFF",
					walletChainType: "solana-only",
					walletList: [
						"phantom",
						"okx_wallet",
						"metamask",
						"solflare",
						"backpack",
					],
				},
				loginMethods: ["twitter"],
				fundingMethodConfig: {
					moonpay: {
						useSandbox: true,
					},
				},
				embeddedWallets: {
					createOnLogin: "all-users",
					requireUserPasswordOnCreate: false,
					showWalletUIs: true,
					ethereum: {
						createOnLogin: "off",
					},
					solana: {
						createOnLogin: "users-without-wallets",
					},
				},
				mfa: {
					noPromptOnMfaRequired: false,
				},
				externalWallets: { solana: { connectors: toSolanaWalletConnectors() } },
				solanaClusters: [
					{
						name: "mainnet-beta",
						rpcUrl: process.env.NEXT_PUBLIC_HELIUS_RPC,
					},
				],
			}}
		>
			{children}
		</PrivyProvider>
	);
}