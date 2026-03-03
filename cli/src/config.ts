import Conf from "conf";

interface FilxConfig {
  apiKey?: string;
  walletAddress?: string;
  userEmail?: string;
}

export const config = new Conf<FilxConfig>({
  projectName: "filx-cli",
  schema: {
    apiKey:        { type: "string" },
    walletAddress: { type: "string" },
    userEmail:     { type: "string" },
  },
});

export const FILX_API = "https://api.filx.io";
