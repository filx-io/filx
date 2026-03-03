import Conf from "conf";

interface FilxConfig {
  bankrApiKey?: string;
  walletAddress?: string;
  userEmail?: string;
}

export const config = new Conf<FilxConfig>({
  projectName: "filx-cli",
  schema: {
    bankrApiKey: { type: "string" },
    walletAddress: { type: "string" },
    userEmail: { type: "string" },
  },
});

export const BANKR_API = "https://api.bankr.bot";
export const FILX_API = "https://api.filx.io";
