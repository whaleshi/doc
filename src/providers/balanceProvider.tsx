'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useUserStore } from "@/stores/user";
import { getChainConfig } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { getAccount, getAssociatedTokenAddress, getMint } from "@solana/spl-token";

interface BalanceContextType {
	solBalance: number;
	solPrice: number;
	tokenBalances: Record<string, number>;
	setTokenMints: (mints: string[]) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
	const [solBalance, setSolBalance] = useState(0);
	const [solPrice, setSolPrice] = useState(0);
	const [tokenMints, setTokenMints] = useState<string[]>([]);
	const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
	const commonUser = useUserStore((state) => state.commonUser);
	const currentAddress = commonUser?.addr;

	// --- SOL Balance ---
	useEffect(() => {
		if (!currentAddress) {
			setSolBalance(0);
			setTokenBalances({});
			return;
		}

		const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC!, "confirmed");
		const pubKey = new PublicKey(currentAddress);

		connection.getBalance(pubKey).then((lamports) => {
			setSolBalance(lamports / LAMPORTS_PER_SOL);
		});

		const subId = connection.onAccountChange(pubKey, (accountInfo) => {
			setSolBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
			console.log('💰 balance change', accountInfo.lamports / LAMPORTS_PER_SOL);
		});

		return () => {
			connection.removeAccountChangeListener(subId);
		};
	}, [currentAddress]);

	// --- Token Balances ---
	// useEffect(() => {
	// 	if (!currentAddress || tokenMints.length === 0) {
	// 		setTokenBalances({});
	// 		return;
	// 	}

	// 	const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC!, "confirmed");
	// 	const pubKey = new PublicKey(currentAddress);
	// 	const subscriptions: number[] = [];
	// 	const aborted = new Set<string>();

	// 	tokenMints.forEach(async (mint) => {
	// 		try {
	// 			const mintPubKey = new PublicKey(mint);
	// 			const ata = await getAssociatedTokenAddress(mintPubKey, pubKey);
	// 			const tokenAccount = await getAccount(connection, ata);
	// 			const mintInfo = await getMint(connection, mintPubKey);

	// 			if (aborted.has(mint)) return;

	// 			const balance = Number(tokenAccount.amount) / 10 ** mintInfo.decimals;
	// 			setTokenBalances((prev) => ({ ...prev, [mint]: balance }));

	// 			const subId = connection.onAccountChange(ata, (info) => {
	// 				const rawAmount = Number(info.data.slice(64, 72).readBigUInt64LE());
	// 				setTokenBalances((prev) => ({
	// 					...prev,
	// 					[mint]: rawAmount / 10 ** mintInfo.decimals,
	// 				}));
	// 			});

	// 			subscriptions.push(subId);
	// 		} catch (err) {
	// 			console.warn(`❌ Failed to track token: ${mint}`, err);
	// 			setTokenBalances((prev) => ({ ...prev, [mint]: 0 }));
	// 		}
	// 	});

	// 	return () => {
	// 		subscriptions.forEach((id) => connection.removeAccountChangeListener(id));
	// 		tokenMints.forEach((mint) => aborted.add(mint));
	// 	};
	// }, [currentAddress, tokenMints]);
	useEffect(() => {
		if (!currentAddress || tokenMints.length === 0) {
			setTokenBalances({});
			return;
		}

		const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC!, "confirmed");
		const pubKey = new PublicKey(currentAddress);

		(async () => {
			try {
				console.log(tokenMints)
				const mintPubKeys = tokenMints.map((mint) => new PublicKey(mint));
				const ataAddresses = await Promise.all(
					mintPubKeys.map((mint) => getAssociatedTokenAddress(mint, pubKey))
				);

				// 获取 mint info 和 token account info（合并为一次请求）
				const allAccounts = [...ataAddresses, ...mintPubKeys];
				const accountInfos = await connection.getMultipleAccountsInfo(allAccounts);

				const nextBalances: Record<string, number> = {};

				for (let i = 0; i < tokenMints.length; i++) {
					const mint = tokenMints[i];
					const ataInfo = accountInfos[i];
					const mintInfo = accountInfos[i + tokenMints.length];

					if (!ataInfo || !mintInfo) {
						nextBalances[mint] = 0;
						continue;
					}

					// 解析 mint decimals（偏移量 44，1 byte）
					const decimals = mintInfo.data[44];

					// 解析账户中的 amount（偏移量 64 开始 8 字节）
					const amount = Number(ataInfo.data.slice(64, 72).readBigUInt64LE());

					nextBalances[mint] = amount / 10 ** decimals;
				}

				setTokenBalances(nextBalances);
			} catch (err) {
				console.error("❌ 批量获取 token 余额失败", err);
			}
		})();
	}, [currentAddress, tokenMints]);


	// --- Price ---
	const { data } = useQuery({
		queryKey: ["price"],
		queryFn: async () => await getChainConfig(),
		refetchInterval: 5000,
	});

	useEffect(() => {
		if (!data) return;
		setSolPrice(data?.data?.price);
	}, [data]);

	return (
		<BalanceContext.Provider
			value={{
				solBalance,
				solPrice,
				tokenBalances,
				setTokenMints,
			}}
		>
			{children}
		</BalanceContext.Provider>
	);
}

export function useBalanceContext() {
	const ctx = useContext(BalanceContext);
	if (!ctx) throw new Error("useBalanceContext must be used within BalanceProvider");
	return ctx;
}
