import React, { useEffect, useState } from 'react';
import { Overlay, Button, Loading } from 'react-vant';
import AvatarImage from '@/components/common/AvatarImage';

type Props = {
	openStatus: boolean;
	onConsumed?: () => void;
	info: any;
	freeQuota: any;
	paidQuota: any;
	time: any;
	loading: boolean;
	toClaimPaid: () => void;
};

const FeeRedPopup = ({ openStatus, onConsumed, info, freeQuota, paidQuota, time, loading, toClaimPaid }: Props) => {
	const [visible, setVisible] = useState(false);
	const [ruleStatus, setRuleStatus] = useState(false)

	useEffect(() => {
		if (openStatus) {
			setVisible(true);
			onConsumed?.();
		}
	}, [openStatus]);

	return (
		<div>
			<Overlay visible={visible} zIndex={999} onClick={() => setVisible(false)}
				className='h-[100%] flex items-center justify-center'
				customStyle={{ background: 'rgba(0, 0, 0, 0.85)' }}
			>
				<div className='w-[100%] max-w-[330px]'>
					<div
						style={{
							border: "5px solid #FF9491",
							background: "linear-gradient(180deg, #FF2C44 0%, #FF4E4A 100%)",
						}}
						className="w-full h-[340px] rounded-t-[160px] rounded-b-[20px]"
					>
						<div className='px-[12px] mt-[-30px]'>
							<div className='border-[5px] border-[#fff] bg-[#FFF9E6] h-[245px] rounded-t-[20px] flex flex-col items-center'>
								<div className='border-[5px] border-[#fff] w-[90px] h-[90px] rounded-full mt-[22px]'>
									<AvatarImage src={info?.img_url} width={80} height={80} round />
								</div>
								<div className='text-[18px] f500 text-[#101010] mt-[16px]'>领取成功</div>
								<div className='text-[32px] text-[#FF3846] f7001 mt-[8px]'>+{freeQuota.toString()} {info?.symbol?.toUpperCase()}</div>
							</div>
						</div>
						<div className='px-[18px] pt-[14px]'>
							<div className='text-[13px] f500 text-[#FFFDC8] text-center'>支付<span className='f5001 mx-[2px]'>$10</span>额外领取<span className='f5001 mx-[2px]'>{paidQuota.toString()} {info?.symbol?.toUpperCase()}</span></div>
							<div className='h-[48px] rounded-[12px] mt-[12px] flex flex-col items-center justify-center cursor-pointer text-[15px] text-[#101010]'
								style={{ background: "linear-gradient(90deg, #FFE9A2 0%, #FFD073 100%)" }}
								onClick={() => { toClaimPaid() }}
							>
								{
									loading ? <Loading type="spinner" size="24px" color='#101010' /> : <>
										<div>支付<span className='f5001 mx-[2px]'>$10</span>并领取</div>
										<div className='text-[11px] text-[#878787]'><span className='f5001'>{time}</span> 后无法领取</div>
									</>
								}

							</div>
						</div>
					</div>
				</div>
			</Overlay>
		</div>
	)
}

export default FeeRedPopup;