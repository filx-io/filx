import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { sendPrompt } from "../api.js";
import { config } from "../config.js";

export const promptCommand = new Command("prompt")
  .description("Natural language file conversion — FliX pays automatically")
  .argument("<text>", "What you want to do (in plain English)")
  .option("--dry-run", "Preview cost without executing")
  .option("--json", "Output raw JSON")
  .addHelpText(
    "after",
    `
Examples:
  filx prompt "Convert https://example.com/doc.pdf to markdown"
  filx prompt "Extract text from https://example.com/invoice.pdf"
  filx prompt --dry-run "Convert https://example.com/doc.pdf to markdown"
`
  )
  .action(async (text: string, opts: { dryRun?: boolean; json?: boolean }) => {
    const apiKey = config.get("apiKey");
    if (!apiKey) {
      console.error(chalk.red("  Not logged in. Run: filx login <email>"));
      process.exit(1);
    }

    const spinner = opts.dryRun
      ? ora(chalk.gray("Estimating cost (dry run)…")).start()
      : ora(chalk.gray("Processing…")).start();

    try {
      const result = await sendPrompt(text, opts.dryRun ?? false);
      spinner.stop();

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      if (opts.dryRun) {
        console.log();
        console.log(chalk.bold.yellow("  Dry Run — no payment made"));
        console.log(chalk.gray("  Estimated cost : ") + chalk.bold("$" + (result.cost_usdc ?? "?") + " USDC"));
        console.log();
        return;
      }

      console.log();
      if (result.cost_usdc) {
        console.log(chalk.gray("  Cost paid : ") + chalk.bold.green("$" + result.cost_usdc + " USDC"));
      }
      if (result.tx_hash) {
        console.log(
          chalk.gray("  Tx        : ") +
            chalk.cyan(`https://basescan.org/tx/${result.tx_hash}`)
        );
      }
      console.log();
      console.log(result.result);
      console.log();
    } catch (err) {
      spinner.fail("Failed.");
      console.error(chalk.red((err as Error).message));
      process.exit(1);
    }
  });
