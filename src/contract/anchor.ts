import * as anchor from "@coral-xyz/anchor";
import type { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import { getConstants } from "@/constant";
import { createConnection } from "./utils";
import { Mmm } from "@/constant/json/mmm";

type initAnchorOptions = {
    providerInstance: any;
};

export const initAnchor = async ({ providerInstance }: initAnchorOptions) => {
    try {
        const { MMM_IDL_JSON } = getConstants();
        const connection = createConnection(process.env.NEXT_PUBLIC_HELIUS_RPC!);
        if (!providerInstance) {
            console.error("Please connect wallet");
            return null;
        }
        const anchorProvider = new anchor.AnchorProvider(connection, providerInstance, {
            commitment: "confirmed",
        });
        anchor.setProvider(anchorProvider);
        const program = new anchor.Program<Mmm>(MMM_IDL_JSON, anchorProvider);
        return program;
    } catch (err) {
        console.error("initAnchor error:", err);
        return null;
    }
};
