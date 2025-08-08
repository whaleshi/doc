import CryptoJS from "crypto-js";
import { usePrivy } from "@privy-io/react-auth";
import { getApiBaseUrl } from "@/service/base";
import qs from "qs";
import { useUserStore } from "@/stores/user";
import Cookies from "js-cookie";

let timer: any = null;
const useApiLogin = () => {
    const { getAccessToken, logout } = usePrivy();
    const timestamp = Math.floor(Date.now() / 1000);
    const iv = "1234567812345678";
    const Encrypt = (word: string | CryptoJS.lib.WordArray) => {
        const key = timestamp + 5;
        const key1 = CryptoJS.MD5(key + "game.comupup")
            .toString()
            .slice(0, 16);
        const keyHex = CryptoJS.enc.Utf8.parse(key1);
        const ivHex = CryptoJS.enc.Utf8.parse(iv);

        const encrypted = CryptoJS.AES.encrypt(word, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        const str = CryptoJS.enc.Base64.stringify(encrypted.ciphertext).replace(/\+/g, "&&&");
        return str;
    };

    const apiLogin = (props: { user: any; solanaWallet: any }) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(async () => {
            try {
                const token = Cookies.get("login_token");
                if (token) {
                    return;
                }
                const accessToken = await getAccessToken();
                const jsonObj = {
                    twitter_username: props.user?.twitter?.username,
                    twitter_name: props.user?.twitter?.name,
                    twiiter_picture_url: props.user?.twitter?.profilePictureUrl,
                    twitter_id: props.user?.twitter?.subject,
                };
                const jsonString = JSON.stringify(jsonObj);
                const params = {
                    auth_token: Encrypt(accessToken!),
                    privy_did: props.user?.id,
                    addr: props.solanaWallet.address,
                    addr_token: Encrypt(props.solanaWallet.address),
                    random_token: timestamp,
                    login_method: "twitter",
                    extend_token: Encrypt(jsonString),
                };
                const response = await fetch(`${getApiBaseUrl()}/mmm/privy/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: qs.stringify(params),
                });
                const data = await response.json();
                if (data.data.code === 0) {
                    const userInfo = { ...data.common.user_info, free_quota: data.data.quota_info.free_quota / 1e6 };
                    if (userInfo.twitter_info?.profile_image_url) {
                        userInfo.twitter_info.profile_image_url = userInfo.twitter_info.profile_image_url.replace("_normal", "");
                    }
                    Cookies.set("login_token", data.data.token);
                    Cookies.set("login_secret", data.data.secret);
                    useUserStore.getState().setCommonUser(userInfo);

                    // setAuthData(data.data, data.common);
                    // 登录成功后的逻辑
                    // if (router.query.code) {
                    //   try {
                    //     const response = await fetch(BIND_URL, {
                    //       method: "POST",
                    //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    //       body: buildParams().toString(),
                    //     });
                    //     const res = await response.json();
                    //     if (res?.data?.user_info) {
                    //       toast.error(t('Other.bind1'), { duration: 1000 })
                    //       changeAuthData(res?.data)
                    //     }
                    //   } catch (error) {
                    //     toast.error(t('Other.bind2'), { duration: 1000 })
                    //   }
                }
            } catch (error) {
                await logout();
            }
        }, 500);
    };

    return { apiLogin };
};

export default useApiLogin;
