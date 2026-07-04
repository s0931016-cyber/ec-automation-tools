import { spawn } from "node:child_process";

const rawArgs = process.argv.slice(2);
const args = ["dev"];

for (let index = 0; index < rawArgs.length; index += 1) {
  const arg = rawArgs[index];
  if (arg === "--") {
    continue;
  }
  if (arg === "--host") {
    args.push("--hostname");
    continue;
  }
  args.push(arg);
}

const child = spawn("next", args, {
  stdio: "inherit",
  shell: process.platform === "win32"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
