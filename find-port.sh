#!/usr/bin/env bash

# Function to find a free port in the given range [start_port, end_port]
find_free_port() {
  local start_port="$1"
  local end_port="$2"
  for port in $(seq "$start_port" "$end_port"); do
    # Check if the port is in use by trying to listen on it.
    # The `2>/dev/null` redirects stderr to avoid cluttering output.
    if ! (echo "" >/dev/tcp/localhost/"$port") >/dev/null 2>&1; then
      echo "$port"
      return 0
    fi
  done
  return 1 # Return an error code if no free port is found
}

# Set the default port range
START_PORT=9003
END_PORT=9010

# Call the function and capture its output
FREE_PORT=$(find_free_port "$START_PORT" "$END_PORT")

# Check if a port was found
if [ -z "$FREE_PORT" ]; then
  # Write to stderr so that callers can distinguish error messages from the port number
  echo "Error: No free port found between $START_PORT and $END_PORT." >&2
  exit 1
fi

# Output the found port number to stdout
echo "$FREE_PORT"
