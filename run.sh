#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
TEAL='\033[38;2;42;181;178m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

echo -e "${TEAL}${BOLD}"
echo "    _    _                 _        ___              ____ _                _   "
echo "   / \  (_) ___  _ __   __| | __ _ / _ \ _ __ __ _ / ___| |__   __ _ _ __| |_ "
echo "  / _ \ | |/ _ \| '_ \ / _\` |/ _\` | | | | '__/ _\` | |   | '_ \ / _\` | '__| __|"
echo " / ___ \| | (_) | | | | (_| | (_| | |_| | | | (_| | |___| | | | (_| | |  | |_ "
echo "/_/   \_\_|\___/|_| |_|\__,_|\__,_|\___/|_|  \__, |\____|_| |_|\__,_|_|   \__|"
echo "                                              |___/                             "
echo -e "${RESET}"
echo -e "${DIM}AI Workforce Management — powered by OpenClaw${RESET}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required. Install it from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18+ required (found v$(node -v))"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo -e "${TEAL}Installing dependencies...${RESET}"
    npm install
    echo ""
fi

# Copy .env if missing
if [ ! -f "server/.env" ] && [ -f ".env.example" ]; then
    cp .env.example server/.env
    echo -e "${DIM}Created server/.env from template (edit for Matrix integration)${RESET}"
fi

# Cleanup on exit
cleanup() {
    echo ""
    echo -e "${DIM}Shutting down...${RESET}"
    kill $SERVER_PID $CLIENT_PID 2>/dev/null || true
    wait $SERVER_PID $CLIENT_PID 2>/dev/null || true
    echo -e "${TEAL}Goodbye.${RESET}"
}
trap cleanup EXIT INT TERM

# Start server
echo -e "${TEAL}Starting GraphQL server on :4000...${RESET}"
cd server && npx tsx src/index.ts &
SERVER_PID=$!
cd "$SCRIPT_DIR"

# Wait for server to be ready
for i in $(seq 1 30); do
    if curl -s http://localhost:4000/health > /dev/null 2>&1; then
        echo -e "${TEAL}Server ready.${RESET}"
        break
    fi
    sleep 1
done

# Start client
echo -e "${TEAL}Starting frontend on :5173...${RESET}"
cd client && npx vite --host &
CLIENT_PID=$!
cd "$SCRIPT_DIR"

echo ""
echo -e "${BOLD}${TEAL}Ready!${RESET}"
echo -e "  Frontend:  ${BOLD}http://localhost:5173${RESET}"
echo -e "  GraphQL:   ${BOLD}http://localhost:4000/graphql${RESET}"
echo -e "  Health:    ${BOLD}http://localhost:4000/health${RESET}"
echo ""
echo -e "${DIM}Press Ctrl+C to stop${RESET}"

# Wait for either process to exit
wait
