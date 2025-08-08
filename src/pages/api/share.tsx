import { ImageResponse } from '@vercel/og';
import type { NextRequest } from "next/server";

export const config = {
	runtime: 'edge',
};


export default async function handler(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const tokenImg = searchParams.get("imgUrl");
	const tokenSymbol = searchParams.get("symbol");
	const tokenCreator = searchParams.get("creatorName") as string;
	const tokenCreatorImg = searchParams.get("creatorImg");
	const lang = searchParams.get("lang") || "en";
	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					fontSize: 60,
					color: 'black',
				}}
			>
				<div tw="flex w-full h-full">
					<div tw="h-[630px] w-[1200px] flex flex-col relative">
						<img tw="absolute" src="https://newgame.mypinata.cloud/ipfs/bafybeigfnu4w6ypqne6f7blkgulhojkkm66qbiboovus6ylr7ho76ocbqe" width={1200} height={630} alt="bg" />
						<div tw="flex items-center pl-[80px] mt-[60px] text-[36px] text-[#fff]">
							<img tw="mr-[20px] rounded-full" src={tokenCreatorImg as string} width={60} height={60} alt='head' />
							{tokenCreator?.length > 7 ? tokenCreator?.slice(0, 7) + '...' : tokenCreator} 邀请你一起领红包奖励
						</div>
						<div tw="text-[40px] text-[#fff] pl-[80px] mt-[73px]">恭喜获得红包奖励</div>
						<div tw="text-[90px] text-[#FFE83D] font-black pl-[80px] mt-[4px]">1000-50000</div>
						<div tw="text-[60px] text-[#FFE83D] font-bold pl-[80px] mt-[4px]">{tokenSymbol}</div>
						<div tw='w-[420px] absolute right-[110px] top-[200px] flex' style={{ justifyContent: 'center', alignItems: 'center' }}>
							<div tw='flex items-center h-[68px] pl-[8px] pr-[20px] rounded-[40px] bg-[rgba(0,0,0,0.10)]'>
								<img tw='mr-[10px] rounded-full' src={tokenImg as string} width={52} height={52} alt='token' />
								<div tw='text-[32px] text-[#fff] font-bold'>{tokenSymbol}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
