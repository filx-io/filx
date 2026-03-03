import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { rotateApiKey } from "../bankr.js";
import { config } from "../config.js";

export const apiKeyCommand = new Command("api-key")
  .description("Print your FILX_API_KEY (for use in scripts and agents)")
  .option("--rotate", "Rotate to a new API key")
  .action(async (opts: { rotate?: boolean }) => {
    const apiKey = config.get("bankrApiKey");
    if (!apiKey) {
      console.error(chalk.red("  Not logged in. Run: filx login <email>"));
      process.exit(1);
    }

    if (opts.rotate) {
      const spinner = ora("Rotating API key…").start();
      try {
        const newKey = await rotateApiKey();
        config.set("bankrApiKey", newKey);
        spinner.succeed("API key rotated.");
        console.log(newKey);
      } catch (err) {
        spinner.fail("Failed.");
        console.error(chalk.red((err as Error).message));
        process.exit(1);
      }
      return;
    }

    // Just print the key (machine-readable, no decoration)
    console.log(apiKey);
  });
