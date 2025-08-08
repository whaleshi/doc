// 正式idl
import mainnet_idl from "./json/mmm.json"; // 合约 IDL 文件
// 测试idl
import testnet_idl from "./json/mmm.json"; // 合约 IDL 文件

// mainnet NEW GAME Program ID
const MAINNET_PROGRAM_ID = "mmmiTjVcVzyzKzMcKWjZbeYvceHhuKNwDwk7wqXZy3o";
// testnet NEW GAME Program ID
const TESTNET_PROGRAM_ID = "mmmiTjVcVzyzKzMcKWjZbeYvceHhuKNwDwk7wqXZy3o";


export const getConstants = () => {
  const NEXT_APP_ENV = process.env.NEXT_PUBLIC_APP_ENV; // 获取环境变量

  const MMM_PROGRAM_ID = NEXT_APP_ENV === "development" ? TESTNET_PROGRAM_ID : MAINNET_PROGRAM_ID;
  const MMM_IDL_JSON = NEXT_APP_ENV === "development" ? testnet_idl : mainnet_idl;

  return {
    MMM_PROGRAM_ID,
    MMM_IDL_JSON
  };
};
