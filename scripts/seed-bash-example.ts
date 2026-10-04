/**
 * Script to create a complete and realistic Bash script test/example
 * with full anatomy breakdown to demonstrate the UI capabilities.
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "cert-hub.db");
const db = new Database(dbPath);

console.log("🚀 Starting to seed a complete Bash example...");

const anatomyData = [
  {
    id: "01",
    title: "SHEBANG",
    type: "single",
    items: [
      {
        id: "sh1",
        interpreter: "/bin/bash",
        option: "-e",
        meaning: "Executes the script using bash and exits immediately if any command fails (set -e equivalent).",
      }
    ]
  },
  {
    id: "02",
    title: "SCRIPT OPTIONS",
    type: "multiple",
    items: [
      {
        id: "opt1",
        command: "set -uo pipefail",
        explanation: "Treat unset variables as an error (-u) and catch errors in pipelines (-o pipefail)."
      }
    ]
  },
  {
    id: "03",
    title: "VARIABLES / CONSTANTS",
    type: "multiple",
    items: [
      {
        id: "var1",
        variableName: "BACKUP_DIR",
        value: "/var/backups/system",
        variableType: "Constant",
        explanation: "Defines the destination directory for the backups."
      },
      {
        id: "var2",
        variableName: "TIMESTAMP",
        value: "$(date +%Y-%m-%d_%H-%M-%S)",
        variableType: "Dynamic Variable",
        explanation: "Stores the current date and time to create unique backup filenames."
      }
    ]
  },
  {
    id: "04",
    title: "FUNCTIONS",
    type: "multiple",
    items: [
      {
        id: "fn1",
        functionName: "log_message",
        parameters: "$1 (The message to log)",
        returnValue: "None (echoes to stdout)",
        explanation: "Standardized logging function that prepends a timestamp to messages."
      }
    ]
  },
  {
    id: "06",
    title: "CONDITIONS",
    type: "multiple",
    items: [
      {
        id: "cond1",
        condition: "if [[ ! -d \"$BACKUP_DIR\" ]]",
        expectedResult: "Checks if the backup directory DOES NOT exist.",
        explanation: "If the directory is missing, the script will attempt to create it using mkdir -p."
      }
    ]
  },
  {
    id: "07",
    title: "LOOPS",
    type: "multiple",
    items: [
      {
        id: "loop1",
        loopType: "for file in \"$@\"",
        iterationSource: "Arguments passed to the script ($@)",
        explanation: "Iterates over every file or directory passed as an argument to the script to back them up."
      }
    ]
  },
  {
    id: "09",
    title: "PIPELINES",
    type: "multiple",
    items: [
      {
        id: "pipe1",
        components: "tar -czf - \"$file\" | gpg --symmetric > \"$archive.gpg\"",
        explanation: "Archives the file to stdout using tar, then pipes the output directly to gpg for encryption before writing to disk."
      }
    ]
  }
];

const scriptTitle = "Automated Secure Backup Script";
const scriptProblem = `You need to create a robust backup script that:
1. Takes a list of files or directories as arguments.
2. Archives and compresses each input using tar and gzip.
3. Encrypts the resulting archive symmetrically using gpg.
4. Uses strict error handling (set -euo pipefail).
5. Logs all activities with timestamps.`;

const scriptContent = `#!/bin/bash -e

# Strict error handling
set -uo pipefail

# Constants
readonly BACKUP_DIR="/var/backups/system"
readonly TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

# Function to log messages
log_message() {
    local message="$1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $message"
}

# Ensure backup directory exists
if [[ ! -d "$BACKUP_DIR" ]]; then
    log_message "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# Check if arguments were provided
if [[ $# -eq 0 ]]; then
    log_message "Error: No files or directories provided."
    echo "Usage: $0 <file1> <dir1> ..."
    exit 1
fi

# Main backup loop
for target in "$@"; do
    if [[ -e "$target" ]]; then
        basename_target=$(basename "$target")
        archive_name="\${BACKUP_DIR}/\${basename_target}_\${TIMESTAMP}.tar.gz.gpg"
        
        log_message "Backing up and encrypting: $target"
        
        # Archive, compress, and encrypt in a pipeline
        tar -czf - "$target" | gpg --symmetric --batch --yes --passphrase "SuperSecretKey" -o "$archive_name"
        
        log_message "Successfully backed up to: $archive_name"
    else
        log_message "Warning: Target '$target' does not exist. Skipping."
    fi
done

log_message "Backup process completed successfully."
exit 0
`;

try {
  const insert = db.prepare(
    `
    INSERT INTO bash_scripts (title, problem, script_content, anatomy)
    VALUES (@title, @problem, @script_content, @anatomy)
  `
  );

  insert.run({
    title: scriptTitle,
    problem: scriptProblem,
    script_content: scriptContent,
    anatomy: JSON.stringify(anatomyData),
  });

  console.log("✅ Success! A complete test Bash script with Anatomy was created in the database.");
} catch (error) {
  console.error("❌ Error inserting test data:", error);
}

db.close();
