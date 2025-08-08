import { useLogin } from "@privy-io/react-auth";
import useApiLogin from "@/hooks/useApiLogin";

export default function usePrivyLogin() {
    const { apiLogin } = useApiLogin();

    const { login: toLogin } = useLogin({
        onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
            console.log("[Privy Login] ✅ Success:", {
                user,
                isNewUser,
                wasAlreadyAuthenticated,
                loginMethod,
                loginAccount,
            });

            const solanaWallet = user?.linkedAccounts.find(
                (account) => account.type === "wallet" && account.walletClientType === "privy" && account.chainType === "solana"
            );

            apiLogin({ user, solanaWallet });
        },
        onError: (error) => {
            console.error("[Privy Login] ❌ Failed:", error);
        },
    });

    return { toLogin };
}
