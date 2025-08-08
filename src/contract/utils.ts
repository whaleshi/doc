import {
    AddressLookupTableAccount,
    ComputeBudgetProgram,
    Connection,
    Keypair,
    PublicKey,
    RpcResponseAndContext,
    SimulatedTransactionResponse,
    SystemProgram,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";
// import fs from "fs";
// import path from "path";
// import os from "os";

const RETRY_INTERVAL_MS = 1000;
const RETRY_INTERVAL_INCREASE = 500;
const MAX_RETRIES = 10;
const POLL_INTERVAL = 500;

interface SendTransactionParams {
    program: any;
    connection: Connection;
    instructions: TransactionInstruction[];
    payer: PublicKey | undefined;
    priorityFee?: number;
    otherSigners?: Keypair[];
    lookupTables?: AddressLookupTableAccount[];
    maxRetries?: number;
    initialDelayMs?: number;
}

export async function sendAndConfirmOptimalTransaction({
    program,
    connection,
    instructions,
    payer,
    priorityFee = 10_000,
    otherSigners = [],
    lookupTables = [],
    maxRetries = MAX_RETRIES,
    initialDelayMs = RETRY_INTERVAL_MS,
}: SendTransactionParams): Promise<string> {
    const transaction = await buildOptimalTransaction(connection, instructions, payer!, priorityFee, lookupTables);

    if (otherSigners) {
        transaction.sign(otherSigners);
    }

    const signTx = await program.provider.wallet.signTransaction(transaction, {
        skipPreflight: true,
    });
    const signature = await connection.sendTransaction(signTx, {
        preflightCommitment: "confirmed",
    });

    return signature;

    // const transaction = await buildOptimalTransaction(connection, instructions, payer!, priorityFee, lookupTables);

    // transaction.sign([...otherSigners]);

    // let signature: string | null = null;
    // let retries = 0;
    // let delayMs = initialDelayMs;

    // while (retries < maxRetries) {
    //     try {
    //         signature = await connection.sendRawTransaction(transaction.serialize(), {
    //             skipPreflight: true,
    //             maxRetries: 0,
    //         });

    //         let timeoutMs = delayMs;
    //         while (timeoutMs > 0) {
    //             await sleep(POLL_INTERVAL);
    //             const response = await connection.getSignatureStatus(signature);

    //             if (response?.value?.confirmationStatus === "confirmed" || response?.value?.confirmationStatus === "finalized") {
    //                 return signature;
    //             }

    //             timeoutMs -= POLL_INTERVAL;
    //         }
    //     } catch (error) {
    //         retries++;

    //         if (retries === maxRetries) {
    //             throw error instanceof Error ? error : new Error(`Unknown error: ${error}`);
    //         }

    //         delayMs += RETRY_INTERVAL_INCREASE;
    //         continue;
    //     }

    //     retries++;
    //     if (retries < maxRetries) {
    //         delayMs += RETRY_INTERVAL_INCREASE;
    //     }
    // }

    // throw new Error(`Transaction failed after ${maxRetries} retries. Last signature: ${signature}`);
}

export async function buildOptimalTransaction(
    connection: Connection,
    instructions: TransactionInstruction[],
    payer: PublicKey,
    priorityFee: number = 10_000,
    lookupTables: AddressLookupTableAccount[] = []
): Promise<VersionedTransaction> {
    // Add compute budget instructions
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_400_000,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee,
    });

    const allInstructions = [modifyComputeUnits, addPriorityFee, ...instructions];

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    // Create transaction message
    const messageV0 = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions: allInstructions,
    }).compileToV0Message(lookupTables);

    return new VersionedTransaction(messageV0);
}

export async function simulateTransaction(
    connection: Connection,
    transaction: VersionedTransaction
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
    return await connection.simulateTransaction(transaction);
}

// export function loadKeypair(filepath: string): Keypair {
//     const resolvedPath = filepath.startsWith("~") ? path.join(os.homedir(), filepath.slice(1)) : filepath;

//     const keypairData = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
//     return Keypair.fromSecretKey(new Uint8Array(keypairData));
// }

// export function loadProgramIdl(filepath: string): any {
//     return JSON.parse(fs.readFileSync(filepath, "utf-8"));
// }

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function deriveSecp256k1PublicKey(keypair: Keypair): number[] {
    const secp256k1 = require("secp256k1");
    const privateKey = keypair.secretKey.slice(0, 32);
    const publicKey = secp256k1.publicKeyCreate(privateKey, false);
    // Remove the first byte (0x04 prefix) to get the 64-byte public key
    return Array.from(publicKey.slice(1));
}

export const createConnection = (rpcUrl: string): Connection => {
    if (!rpcUrl) {
        throw new Error("无效的 RPC 地址");
    }
    return new Connection(rpcUrl, "confirmed");
};
