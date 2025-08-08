import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { SystemProgram } from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountIdempotentInstruction,
} from "@solana/spl-token";
import { Mmm } from "../constant/json/mmm";

import BN from "bn.js";

export async function createTokenIxs(
    program: Program<Mmm>,
    tokenInfo: { name: string; symbol: string; uri: string },
    payer: PublicKey,
    mint: PublicKey
) {
    const [programConfigPDA] = PublicKey.findProgramAddressSync([Buffer.from("program_config")], program.programId);

    const [tokenVaultPDA] = PublicKey.findProgramAddressSync([Buffer.from("token_vault"), mint.toBuffer()], program.programId);

    const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault_token_account"), mint.toBuffer()],
        program.programId
    );

    const [metadataPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(), mint.toBuffer()],
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );

    const [eventAuthority] = PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], program.programId);

    return await program.methods
        .createToken(tokenInfo.name, tokenInfo.symbol, tokenInfo.uri)
        .accountsStrict({
            payer,
            mint,
            tokenVault: tokenVaultPDA,
            vaultTokenAccount,
            config: programConfigPDA,
            metadata: metadataPDA,
            metadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            eventAuthority,
            program: program.programId,
        })
        .instruction();
}

export async function claimRedPacketIxs(
    program: Program<Mmm>,
    recipient: PublicKey,
    mint: PublicKey,
    orderId: BN,
    amount: BN,
    signature: number[],
    firstLevelReferrer?: PublicKey,
    secondLevelReferrer?: PublicKey
): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];
    const [programConfigPDA] = PublicKey.findProgramAddressSync([Buffer.from("program_config")], program.programId);

    const [tokenVaultPDA] = PublicKey.findProgramAddressSync([Buffer.from("token_vault"), mint.toBuffer()], program.programId);

    const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault_token_account"), mint.toBuffer()],
        program.programId
    );

    const recipientTokenAccount = getAssociatedTokenAddressSync(mint, recipient);

    // Create recipient token account if needed
    instructions.push(
        createAssociatedTokenAccountIdempotentInstruction(recipient, recipientTokenAccount, recipient, mint, TOKEN_PROGRAM_ID)
    );
    console.log("---");

    const [orderClaimPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("order_claim"), orderId.toArrayLike(Buffer, "le", 8)],
        program.programId
    );

    const [eventAuthority] = PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], program.programId);

    let firstLevelReferrerTokenAccount = null;
    let secondLevelReferrerTokenAccount = null;
    if (firstLevelReferrer) {
        firstLevelReferrerTokenAccount = getAssociatedTokenAddressSync(mint, firstLevelReferrer);
        // Create first level referrer token account if needed
        instructions.push(
            createAssociatedTokenAccountIdempotentInstruction(
                recipient,
                firstLevelReferrerTokenAccount,
                firstLevelReferrer,
                mint,
                TOKEN_PROGRAM_ID
            )
        );
    }

    if (secondLevelReferrer) {
        secondLevelReferrerTokenAccount = getAssociatedTokenAddressSync(mint, secondLevelReferrer);
        // Create second level referrer token account if needed
        instructions.push(
            createAssociatedTokenAccountIdempotentInstruction(
                recipient,
                secondLevelReferrerTokenAccount,
                secondLevelReferrer,
                mint,
                TOKEN_PROGRAM_ID
            )
        );
    }

    const claimInstruction = await program.methods
        .claimRedPacket({
            orderId,
            amount,
            signature,
        })
        .accountsStrict({
            recipient,
            config: programConfigPDA,
            tokenVault: tokenVaultPDA,
            vaultTokenAccount,
            recipientTokenAccount,
            orderClaim: orderClaimPDA,
            firstLevelReferrerTokenAccount,
            secondLevelReferrerTokenAccount,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            eventAuthority,
            program: program.programId,
        })
        .instruction();

    instructions.push(claimInstruction);
    return instructions;
}

export async function claimRedPacket2Ixs(
    program: Program<Mmm>,
    recipient: PublicKey,
    mint: PublicKey,
    orderId: BN,
    amount: BN,
    solAmount: BN,
    signature: number[],
    firstLevelReferrer?: PublicKey,
    secondLevelReferrer?: PublicKey
): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];
    const [programConfigPDA] = PublicKey.findProgramAddressSync([Buffer.from("program_config")], program.programId);

    const [tokenVaultPDA] = PublicKey.findProgramAddressSync([Buffer.from("token_vault"), mint.toBuffer()], program.programId);

    const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault_token_account"), mint.toBuffer()],
        program.programId
    );

    const recipientTokenAccount = getAssociatedTokenAddressSync(mint, recipient);

    // Create recipient token account if needed
    instructions.push(
        createAssociatedTokenAccountIdempotentInstruction(recipient, recipientTokenAccount, recipient, mint, TOKEN_PROGRAM_ID)
    );

    const [orderClaimPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("order_claim"), orderId.toArrayLike(Buffer, "le", 8)],
        program.programId
    );

    const [eventAuthority] = PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], program.programId);

    let firstLevelReferrerTokenAccount = null;
    let secondLevelReferrerTokenAccount = null;

    if (firstLevelReferrer) {
        firstLevelReferrerTokenAccount = getAssociatedTokenAddressSync(mint, firstLevelReferrer, true);
        // Create first level referrer token account if needed
        instructions.push(
            createAssociatedTokenAccountIdempotentInstruction(
                recipient,
                firstLevelReferrerTokenAccount,
                firstLevelReferrer,
                mint,
                TOKEN_PROGRAM_ID
            )
        );
    }

    if (secondLevelReferrer) {
        secondLevelReferrerTokenAccount = getAssociatedTokenAddressSync(mint, secondLevelReferrer, true);
        // Create second level referrer token account if needed
        instructions.push(
            createAssociatedTokenAccountIdempotentInstruction(
                recipient,
                secondLevelReferrerTokenAccount,
                secondLevelReferrer,
                mint,
                TOKEN_PROGRAM_ID
            )
        );
    }

    const claimInstruction = await program.methods
        .claimRedPacket2({
            orderId,
            amount,
            solAmount,
            signature,
        })
        .accountsStrict({
            recipient,
            config: programConfigPDA,
            tokenVault: tokenVaultPDA,
            vaultTokenAccount,
            recipientTokenAccount,
            orderClaim: orderClaimPDA,
            firstLevelReferrerTokenAccount,
            secondLevelReferrerTokenAccount,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            eventAuthority,
            program: program.programId,
        })
        .instruction();

    instructions.push(claimInstruction);
    return instructions;
}

export async function stakeHuntGoldIx(
    program: Program<Mmm>,
    user: PublicKey,
    mint: PublicKey,
    amount: BN
): Promise<TransactionInstruction> {
    const [programConfigPDA] = PublicKey.findProgramAddressSync([Buffer.from("program_config")], program.programId);

    const [tokenVaultPDA] = PublicKey.findProgramAddressSync([Buffer.from("token_vault"), mint.toBuffer()], program.programId);

    const [userStakePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_stake"), user.toBuffer(), mint.toBuffer()],
        program.programId
    );

    const [eventAuthority] = PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], program.programId);

    return await program.methods
        .stakeHuntGold({ amount })
        .accountsStrict({
            user,
            tokenVault: tokenVaultPDA,
            userStake: userStakePDA,
            config: programConfigPDA,
            systemProgram: SystemProgram.programId,
            eventAuthority,
            program: program.programId,
        })
        .instruction();
}

export async function claimHuntGoldIx(program: Program<Mmm>, user: PublicKey, mint: PublicKey): Promise<TransactionInstruction> {
    const [programConfigPDA] = PublicKey.findProgramAddressSync([Buffer.from("program_config")], program.programId);

    const [tokenVaultPDA] = PublicKey.findProgramAddressSync([Buffer.from("token_vault"), mint.toBuffer()], program.programId);

    const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault_token_account"), mint.toBuffer()],
        program.programId
    );

    const [userStakePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_stake"), user.toBuffer(), mint.toBuffer()],
        program.programId
    );

    const userTokenAccount = getAssociatedTokenAddressSync(mint, user);

    const [eventAuthority] = PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], program.programId);

    return await program.methods
        .claimHuntGold()
        .accountsStrict({
            user,
            tokenVault: tokenVaultPDA,
            userStake: userStakePDA,
            userTokenAccount,
            vaultTokenAccount,
            config: programConfigPDA,
            tokenProgram: TOKEN_PROGRAM_ID,
            eventAuthority,
            program: program.programId,
        })
        .instruction();
}

export async function refundHuntGoldIx(program: Program<Mmm>, user: PublicKey, mint: PublicKey): Promise<TransactionInstruction> {
    const [programConfigPDA] = PublicKey.findProgramAddressSync([Buffer.from("program_config")], program.programId);

    const [tokenVaultPDA] = PublicKey.findProgramAddressSync([Buffer.from("token_vault"), mint.toBuffer()], program.programId);

    const [userStakePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_stake"), user.toBuffer(), mint.toBuffer()],
        program.programId
    );

    const [eventAuthority] = PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], program.programId);

    return await program.methods
        .refundHuntGold()
        .accountsStrict({
            user,
            tokenVault: tokenVaultPDA,
            userStake: userStakePDA,
            config: programConfigPDA,
            systemProgram: SystemProgram.programId,
            eventAuthority,
            program: program.programId,
        })
        .instruction();
}

export async function calculateClaimableTokens(
    program: Program<Mmm>,
    userPublicKey: PublicKey,
    tokenMint: PublicKey
): Promise<number> {
    try {
        // Fetch token vault
        const [tokenVaultPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("token_vault"), tokenMint.toBuffer()],
            program.programId
        );
        const tokenVault = await program.account.tokenVault.fetch(tokenVaultPDA);

        // Fetch user stake
        const [userStakePDA] = await PublicKey.findProgramAddress(
            [Buffer.from("user_stake"), userPublicKey.toBuffer(), tokenMint.toBuffer()],
            program.programId
        );

        // Check if user stake exists
        let userStake;
        try {
            userStake = await program.account.userStake.fetch(userStakePDA);
        } catch (e) {
            // User hasn't staked yet
            return 0;
        }

        if (userStake.totalStaked.toNumber() === 0) {
            return 0;
        }

        // Get current timestamp
        const currentTime = Math.floor(Date.now() / 1000);

        // Calculate effective time (cap at hunt end time if needed)
        let effectiveTime = currentTime;
        if (currentTime > tokenVault.huntGoldEndTs) {
            effectiveTime = tokenVault.huntGoldEndTs;
        }

        // Calculate time elapsed since last update
        const timeElapsed = Math.max(0, effectiveTime - tokenVault.lastUpdateTime);

        // Use BN for large number calculations
        const BN = anchor.BN;
        const precision = new BN(1_000_000_000_000); // 1e12

        // Calculate new tokens released since last update
        const newTokens = new BN(tokenVault.speed).mul(new BN(timeElapsed));

        // Calculate total reward per share including new tokens
        let updatedAccRewardPerShare = new BN(tokenVault.accRewardPerShare);
        if (tokenVault.totalStaked.gt(new BN(0)) && timeElapsed > 0) {
            const rewardIncrement = newTokens.mul(precision).div(tokenVault.totalStaked);
            updatedAccRewardPerShare = updatedAccRewardPerShare.add(rewardIncrement);
        }

        // Calculate user's accumulated rewards
        const userAccumulated = userStake.totalStaked.mul(updatedAccRewardPerShare).div(precision);

        // Subtract debt to get pending rewards from staking
        const pendingFromStaking = userAccumulated.gt(userStake.tokenDebt) ? userAccumulated.sub(userStake.tokenDebt) : new BN(0);

        // Add any existing pending rewards (which includes pre-stake tokens for first staker)
        const totalClaimable = pendingFromStaking.add(userStake.pendingRewards);

        // Convert to number for return (safe because this is for display)
        // If the value is too large, it will show Infinity
        return totalClaimable.toNumber();
    } catch (error) {
        console.error("Error calculating claimable tokens:", error);
        return 0;
    }
}

export async function calculateExpectedTokensForSol(
    program: Program<Mmm>,
    solAmount: number,
    tokenMint: PublicKey
): Promise<number> {
    try {
        // Fetch token vault
        const [tokenVaultPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("token_vault"), tokenMint.toBuffer()],
            program.programId
        );
        const tokenVault = await program.account.tokenVault.fetch(tokenVaultPDA);

        // Get current timestamp
        const currentTime = Math.floor(Date.now() / 1000);

        // If hunt gold has already ended, return 0
        if (currentTime >= tokenVault.huntGoldEndTs) {
            console.log("Hunt gold phase has already ended, no rewards available for new deposits");
            return 0;
        }

        // Use BN for calculations
        const BN = anchor.BN;

        // Calculate remaining time in hunt gold phase
        const remainingTime = tokenVault.huntGoldEndTs - Math.max(currentTime, tokenVault.huntGoldStartTs);

        // Calculate total tokens that will be distributed during the entire hunt gold phase
        const huntGoldDuration = tokenVault.huntGoldEndTs - tokenVault.huntGoldStartTs;
        const totalHuntGoldTokens = new BN(tokenVault.speed).mul(new BN(huntGoldDuration));

        // Calculate tokens already distributed
        const elapsedTime = Math.max(0, Math.min(currentTime, tokenVault.huntGoldEndTs) - tokenVault.huntGoldStartTs);
        const tokensAlreadyDistributed = new BN(tokenVault.speed).mul(new BN(elapsedTime));

        // Calculate remaining tokens to be distributed
        const remainingTokens = totalHuntGoldTokens.sub(tokensAlreadyDistributed);

        // Calculate new total staked after the hypothetical deposit
        const newTotalStaked = tokenVault.totalStaked.add(new BN(solAmount));

        // Calculate the user's share of the pool after depositing
        // userShare = solAmount / newTotalStaked
        // To maintain precision, we'll use: expectedTokens = remainingTokens * solAmount / newTotalStaked
        const expectedTokensFromRemaining = remainingTokens.mul(new BN(solAmount)).div(newTotalStaked);

        // Also need to consider accumulated rewards up to this point
        // When a new user stakes, they don't get past rewards (debt mechanism)
        // So we only calculate future rewards

        return expectedTokensFromRemaining.toNumber();
    } catch (error) {
        console.error("Error calculating expected tokens:", error);
        return 0;
    }
}
