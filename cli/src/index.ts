#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { loginCommand } from "./commands/login.js";
import { whoamiCommand } from "./commands/whoami.js";
import { balanceCommand } from "./commands/balance.js";
import { promptCommand } from "./commands/prompt.js";
import { apiKeyCommand } from "./commands/api-key.js";
import { signCommand } from "./commands/sign.js";

const program = new Command();

program
  .name("filx")
  .description(
    [
      "",
      chalk.bold.white("  FliX CLI"),
      chalk.gray("  File conversion for AI agents — pay as you go with USDC"),
      "",
      chalk.gray("  Docs     : ") + chalk.cyan("https://filx.io/docs"),
      chalk.gray("  Discord  : ") + chalk.cyan("https://discord.gg/filx"),
      "",
    ].join("\n")
  )
  .version("0.1.0", "-v, --version");

program.addCommand(loginCommand);
program.addCommand(whoamiCommand);
program.addCommand(balanceCommand);
program.addCommand(promptCommand);
program.addCommand(apiKeyCommand);
program.addCommand(signCommand);

// Pretty error for unknown commands
program.on("command:*", (operands) => {
  console.error(chalk.red(`\n  Unknown command: ${operands[0]}`));
  console.log(chalk.gray(`  Run ${chalk.white("filx --help")} for available commands.\n`));
  process.exit(1);
});

program.parse(process.argv);

// Show help if no args
if (process.argv.length === 2) {
  program.help();
}
