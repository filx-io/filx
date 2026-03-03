import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import * as readline from "readline";
import { initiateLogin, verifyOtp } from "../api.js";
import { config } from "../config.js";

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export const loginCommand = new Command("login")
  .description("Log in and create your FliX agent wallet")
  .argument("<email>", "Your email address")
  .action(async (email: string) => {
    console.log();
    console.log(chalk.bold.white("  FliX Agent Wallet Setup"));
    console.log(chalk.gray("  Powered by Privy embedded wallets — no private key ever"));
    console.log();

    const spinner = ora("Sending OTP to " + chalk.cyan(email)).start();

    let token: string;
    try {
      const res = await initiateLogin(email);
      token = res.token;
      spinner.succeed("OTP sent! Check your inbox.");
    } catch (err) {
      spinner.fail("Failed to send OTP.");
      console.error(chalk.red((err as Error).message));
      process.exit(1);
    }

    const otp = await prompt(chalk.gray("  Enter OTP → "));

    const verifySpinner = ora("Verifying…").start();
    try {
      const { api_key, wallet_address } = await verifyOtp(email, otp, token);

      config.set("apiKey", api_key);
      config.set("walletAddress", wallet_address);
      config.set("userEmail", email);

      verifySpinner.succeed("Logged in!");
      console.log();
      console.log(chalk.bold("  ✓ Agent wallet created"));
      console.log(chalk.gray("    Address : ") + chalk.cyan(wallet_address));
      console.log(chalk.gray("    Email   : ") + chalk.white(email));
      console.log();
      console.log(
        chalk.gray("  To use in scripts: ") +
          chalk.bold.white("export FILX_API_KEY=$(filx api-key)")
      );
      console.log();
    } catch (err) {
      verifySpinner.fail("Verification failed.");
      console.error(chalk.red((err as Error).message));
      process.exit(1);
    }
  });
