#!/bin/zsh

set -u

APP_URL="http://localhost:3000"
HOST="0.0.0.0"
PORT="3000"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$SCRIPT_DIR" || exit 1

echo "=== iPod Listing Workbench ==="
echo "Repository: $SCRIPT_DIR"
echo "Local URL: $APP_URL"
echo ""

has_command() {
  command -v "$1" >/dev/null 2>&1
}

needs_install() {
  [[ ! -d "node_modules" || ! -x "node_modules/.bin/next" ]]
}

choose_package_manager() {
  if has_command npm; then
    echo "npm"
    return 0
  fi

  if has_command pnpm; then
    echo "pnpm"
    return 0
  fi

  return 1
}

install_dependencies() {
  local preferred="$1"

  if [[ "$preferred" == "npm" ]]; then
    echo "=== Installing dependencies with npm ==="
    if npm install; then
      return 0
    fi

    if has_command pnpm; then
      echo "npm install failed. Falling back to pnpm install."
      PACKAGE_MANAGER="pnpm"
      pnpm install
      return $?
    fi

    return 1
  fi

  echo "=== Installing dependencies with pnpm ==="
  pnpm install
}

start_dev_server() {
  local manager="$1"

  echo "=== Starting dev server with $manager ==="
  if [[ "$manager" == "npm" ]]; then
    npm run dev -- --host "$HOST" &
  else
    pnpm run dev -- --host "$HOST" &
  fi

  DEV_PID=$!
  sleep 4

  if ! kill -0 "$DEV_PID" >/dev/null 2>&1; then
    wait "$DEV_PID"
    return 1
  fi

  return 0
}

PACKAGE_MANAGER="$(choose_package_manager)"
if [[ -z "${PACKAGE_MANAGER:-}" ]]; then
  echo "npm or pnpm is required. Install Node.js first, then try again."
  echo "Press Enter to close this window."
  read
  exit 1
fi

if needs_install; then
  if ! install_dependencies "$PACKAGE_MANAGER"; then
    echo "Dependency installation failed."
    echo "Press Enter to close this window."
    read
    exit 1
  fi
else
  echo "=== Dependencies already installed ==="
fi

if ! start_dev_server "$PACKAGE_MANAGER"; then
  if [[ "$PACKAGE_MANAGER" == "npm" ]] && has_command pnpm; then
    echo "npm dev server failed. Falling back to pnpm."
    PACKAGE_MANAGER="pnpm"
    start_dev_server "$PACKAGE_MANAGER" || exit 1
  else
    echo "Dev server failed to start."
    echo "Press Enter to close this window."
    read
    exit 1
  fi
fi

echo "=== Opening Safari ==="
sleep 2
open -a Safari "$APP_URL" >/dev/null 2>&1 || open "$APP_URL" >/dev/null 2>&1

echo ""
echo "Workbench is running."
echo "Mac: $APP_URL"
echo "iPhone: use your Mac local IP, for example http://192.168.x.x:$PORT"
echo "Press Control-C in this window to stop the server."

trap 'kill "$DEV_PID" >/dev/null 2>&1' INT TERM EXIT
wait "$DEV_PID"
