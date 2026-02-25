#!/usr/bin/env bash
# Kill orgchart server (port 4000) and client (port 5173)

killed=0

for port in 4000 5173; do
  pid=$(lsof -ti :$port 2>/dev/null)
  if [ -n "$pid" ]; then
    kill $pid 2>/dev/null && echo "Stopped process on :$port (PID $pid)" && killed=$((killed+1))
  fi
done

[ $killed -eq 0 ] && echo "Nothing running on :4000 or :5173."
