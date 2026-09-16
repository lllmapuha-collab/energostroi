#!/usr/bin/env bash
set -u
DIR=/tmp/ges-tunnel
mkdir -p "$DIR"
URL_FILE="$DIR/url.txt"
LOG="$DIR/cloudflared.log"
CF="${CLOUDFLARED_BIN:-/tmp/cloudflared}"

if [[ ! -x "$CF" ]]; then
  curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o "$CF"
  chmod +x "$CF"
fi

# Ensure Next responds on :3000
ensure_next() {
  if curl -sf --max-time 3 http://127.0.0.1:3000/ >/dev/null; then
    return 0
  fi
  echo "$(date -Is) next down, starting production server" >>"$DIR/watchdog.log"
  cd /agent/ges-site
  # Prefer already-built app
  if [[ ! -d .next ]]; then
    npm run build >>"$DIR/next-build.log" 2>&1 || true
  fi
  pkill -f 'next start' 2>/dev/null || true
  pkill -f 'next dev' 2>/dev/null || true
  sleep 1
  nohup npx next start --hostname 0.0.0.0 --port 3000 >>"$DIR/next.log" 2>&1 &
  for i in $(seq 1 30); do
    curl -sf --max-time 2 http://127.0.0.1:3000/ >/dev/null && return 0
    sleep 1
  done
  return 1
}

echo "$(date -Is) watchdog starting" >>"$DIR/watchdog.log"

while true; do
  ensure_next || { sleep 5; continue; }

  : >"$LOG"
  "$CF" tunnel --url http://127.0.0.1:3000 --no-autoupdate >"$LOG" 2>&1 &
  CF_PID=$!

  URL=""
  for i in $(seq 1 40); do
    URL=$(rg -o 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" | head -1 || true)
    if [[ -n "$URL" ]]; then
      echo "$URL" >"$URL_FILE"
      echo "$(date -Is) tunnel up: $URL" >>"$DIR/watchdog.log"
      break
    fi
    sleep 1
  done

  # Wait until cloudflared dies, then restart
  while kill -0 "$CF_PID" 2>/dev/null; do
    # Refresh health every 20s
    if ! curl -sf --max-time 5 http://127.0.0.1:3000/ >/dev/null; then
      echo "$(date -Is) next unhealthy, restarting tunnel loop" >>"$DIR/watchdog.log"
      kill "$CF_PID" 2>/dev/null || true
      break
    fi
    sleep 20
  done

  echo "$(date -Is) tunnel exited, restarting in 3s" >>"$DIR/watchdog.log"
  echo "" >"$URL_FILE"
  sleep 3
done
