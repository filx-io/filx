import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getWhoami } from "../api.js";
import { config } from "../config.js";

export const whoamiCommand = new Command("whoami")
  .description("Show your FliX agent wallet info")
  .action(async () => {
    const apiKey = config.get("apiKey");
    if (!apiKey) {
      console.error(chalk.red("  Not logged in. Run: filx login <email>"));
      process.exit(1);
    }

    const spinner = ora("Fetching wallet info…").start();
    try {
      const info = await getWhoami();
      spinner.stop();
      console.log();
      console.log(chalk.bold("  FliX Agent Wallet"));
      console.log(chalk.gray("  ─────────────────────────────────────────"));
      console.log(chalk.gray("  Address : ") + chalk.cyan(info.address));
      console.log(chalk.gray("  Email   : ") + chalk.white(info.email));
      console.log(chalk.gray("  Chain   : ") + chalk.white("Base (Mainnet)"));
      console.log();
    } catch (err) {
      spinner.fail("Failed.");
      console.error(chalk.red((err as Error).message));
      process.exit(1);
    }
  });
