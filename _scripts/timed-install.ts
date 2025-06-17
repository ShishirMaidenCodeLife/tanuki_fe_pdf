#!/usr/bin/env node

import { spawn } from "child_process";

/**
 * Timed npm install utility
 * Runs npm install and reports the duration
 */
function runTimedInstall(): void {
  console.log("Starting npm install...");

  const startTime = Date.now();

  const child = spawn("npm", ["install"], {
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code: number | null) => {
    const endTime = Date.now();
    const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);

    if (code === 0) {
      console.log(
        `npm install finished successfully in ${durationSeconds} seconds.`,
      );
    } else {
      console.error(
        `npm install exited with code ${code} after ${durationSeconds} seconds.`,
      );
    }
  });

  child.on("error", (error: Error) => {
    console.error("Failed to start npm install:", error.message);
    process.exit(1);
  });
}

// Run the timed install if this file is executed directly
if (require.main === module) {
  runTimedInstall();
}
