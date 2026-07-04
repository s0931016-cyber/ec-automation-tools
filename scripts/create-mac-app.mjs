import { chmod, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const appName = "iPod出品ツール.app";
const appRoot = path.join(repoRoot, appName);
const contentsDir = path.join(appRoot, "Contents");
const macosDir = path.join(contentsDir, "MacOS");
const plistPath = path.join(contentsDir, "Info.plist");
const launcherPath = path.join(macosDir, "launcher");

const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>ja</string>
  <key>CFBundleDisplayName</key>
  <string>iPod出品ツール</string>
  <key>CFBundleExecutable</key>
  <string>launcher</string>
  <key>CFBundleIdentifier</key>
  <string>local.ec-automation-tools.ipod-workbench</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>iPod出品ツール</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>0.1.0</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>LSMinimumSystemVersion</key>
  <string>10.13</string>
</dict>
</plist>
`;

const launcher = `#!/bin/zsh

set -u

APP_BUNDLE="$(cd "$(dirname "$0")/../.." && pwd)"
REPO_DIR="$(cd "$APP_BUNDLE/.." && pwd)"
COMMAND_FILE="$REPO_DIR/start-ipod-workbench.command"

if [[ ! -x "$COMMAND_FILE" ]]; then
  osascript -e 'display dialog "start-ipod-workbench.command が見つからないか、実行権限がありません。iPod出品ツール.app はリポジトリ直下に置いてください。" buttons {"OK"} default button "OK" with icon caution'
  exit 1
fi

open -a Terminal "$COMMAND_FILE"
`;

await rm(appRoot, { recursive: true, force: true });
await mkdir(macosDir, { recursive: true });
await writeFile(plistPath, infoPlist, "utf8");
await writeFile(launcherPath, launcher, "utf8");
await chmod(launcherPath, 0o755);

console.log(`Created ${appName}`);
