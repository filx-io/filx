import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getBalance } from "../bankr.js";
import { config } from "../config.js";

export const balanceCommand = new Command("balance")
  .description("Show USDC balance of your FliX agent wallet")
  .action(async () => {
    const apiKey = config.get("bankrApiKey");
    if (!apiKey) {
      console.error(chalk.red("  Not logged in. Run: filx login <email>"));
      process.exit(1);
    }

    const spinner = ora("Fetching balance…").start();
    try {
      const bal = await getBalance();
      spinner.stop();
      console.log();
      console.log(chalk.bold("  Agent Wallet Balance"));
      console.log(chalk.gray("  ─────────────────────────────────────────"));
      console.log(chalk.gray("  USDC  : ") + chalk.bold.green("$" + bal.usdc + " USDC"));
      console.log(chalk.gray("  ETH   : ") + chalk.white(bal.eth + " ETH"));
      console.log(chalk.gray("  Chain : ") + chalk.white(bal.chain ?? "Base"));
      console.log();
      console.log(
        chalk.gray("  To fund: send USDC on Base to ") +
          chalk.cyan(config.get("walletAddress") ?? "your wallet address")
      );
      console.log();
    } catch (err) {
      spinner.fail("Failed.");
      console.error(chalk.red((err as Error).message));
      process.exit(1);
    }
  });
