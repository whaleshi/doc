import { getApiBaseUrl } from "./base";
import { post, _post } from "./tool";

export const getLoginin = (params) => post(getApiBaseUrl() + "/mmm/privy/login", params);
export const setCode = (params) => _post(getApiBaseUrl() + "/mmm/invite/set", params);
export const getCoinList = (params) => post(getApiBaseUrl() + "/mmm/coin_list", params);
export const getCoinDetails = (params) => post(getApiBaseUrl() + "/mmm/coin_show", params);
export const createCoin = (params) => _post(getApiBaseUrl() + "/mmm/coin_create", params);
export const getCreateMint = (params) => _post(getApiBaseUrl() + "/mmm/query_mint", params);
export const getFeeSign = (params) => _post(getApiBaseUrl() + "/mmm/redpacket/sign", params);
export const getPaidSign = (params) => _post(getApiBaseUrl() + "/mmm/redpacket/sing_paid", params);


export const getRewardList = (params) => _post(getApiBaseUrl() + "/mmm/coin_reward_list", params);


export const getChainConfig = (params) => post(getApiBaseUrl() + "/mmm/query/chain_asset_config", params);
export const getNumConfig = (params) => post(getApiBaseUrl() + "/mmm/config", params);
