import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { signX402 } from "../bankr.js";
import { config } from "../config.js";

export const signCommand = new Command("sign-x402")
  .description("Sign an x402 PAYMENT-REQUIRED header value")
  .argument("<header>", "The PAYMENT-REQUIRED header value from a 402 response")
  .addHelpText(
    "after",
    `
Example (in a shell script):
  SIGNED=$(filx sign-x402 "$PAYMENT_REQUIRED_HEADER")
  curl -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
    -H "PAYMENT-SIGNATURE: $SIGNED" \\
    -d '{"url": "https://example.com/doc.pdf"}'
`
  )
  .action(async (header: string) => {
    const apiKey = config.get("bankrApiKey");
    if (!apiKey) {
      console.error(chalk.red("  Not logged in. Run: filx login <email>"));
      process.exit(1);
    }

    const spinner = ora("Signing payment…").start();
    try {
      const signature = await signX402(header);
      spinner.stop();
      // Output clean — designed to be captured by $()
      console.log(signature);
    } catch (err) {
      spinner.fail("Signing failed.");
      console.error(chalk.red((err as Error).message));
      process.exit(1);
    }
  });
