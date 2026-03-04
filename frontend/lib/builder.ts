/**
 * Base Builder Code — ERC-8021 attribution for FilX.io
 *
 * Builder Code: bc_0qf26yvh
 * Registered at: https://base.dev
 *
 * Add `dataSuffix` to any wallet transaction sent from the FilX frontend
 * so that Base can attribute onchain activity back to FilX.
 *
 * Usage with wagmi (ERC-5792):
 * ```ts
 * import { BUILDER_DATA_SUFFIX } from "@/lib/builder";
 *
 * await wallet.sendCalls({
 *   calls: [...],
 *   capabilities: {
 *     dataSuffix: {
 *       value: BUILDER_DATA_SUFFIX,
 *       optional: true,
 *     },
 *   },
 * });
 * ```
 *
 * Usage with viem / ethers:
 * ```ts
 * const tx = await walletClient.sendTransaction({
 *   ...txParams,
 *   data: txParams.data
 *     ? (txParams.data + BUILDER_DATA_SUFFIX.slice(2))
 *     : BUILDER_DATA_SUFFIX,
 * });
 * ```
 */

/** Builder code identifier (human-readable) */
export const BUILDER_CODE = "bc_0qf26yvh";

/**
 * ERC-8021 encoded dataSuffix for `bc_0qf26yvh`.
 *
 * Encoding:
 *   [0x0b]             — length of "bc_0qf26yvh" (11 bytes)
 *   [62635f3071663236797668] — "bc_0qf26yvh" in ASCII
 *   [00]               — null terminator
 *   [8021 × 8]         — ERC-8021 magic bytes (16 bytes)
 */
export const BUILDER_DATA_SUFFIX =
  "0x0b62635f30716632367976680080218021802180218021802180218021" as const;

/**
 * ERC-5792 capabilities object — drop directly into `wallet.sendCalls()`.
 */
export const BUILDER_CAPABILITIES = {
  dataSuffix: {
    value: BUILDER_DATA_SUFFIX,
    optional: true, // won't fail if wallet doesn't support ERC-5792
  },
} as const;
