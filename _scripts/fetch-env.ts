import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

// Load existing .env.local if present
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Load region and environment stage from .env or default fallback
const REGION = process.env.AWS_REGION || "ap-northeast-1";
const ENV_STAGE = process.env.FE_MODE || "dev1";

// Initialize SSM client
const ssm = new SSMClient({ region: REGION });

// Fetch parameter from SSM
async function getParam(Name: string) {
  const command = new GetParameterCommand({ Name, WithDecryption: true });
  const response = await ssm.send(command);

  return response.Parameter?.Value || "";
}

async function main() {
  const ssmKeys = {
    FE_USER_POOLS_ID: `/tanuki/${ENV_STAGE}/FE_USER_POOLS_ID`,
    FE_USER_POOLS_WEB_CLIENT_ID: `/tanuki/${ENV_STAGE}/FE_USER_POOLS_WEB_CLIENT_ID`,
  };

  const envVars: Record<string, string> = {};

  for (const [key, ssmPath] of Object.entries(ssmKeys)) {
    try {
      const value = await getParam(ssmPath);

      envVars[key] = value;
      console.log(`✅ ${key} fetched from ${ssmPath}`);
    } catch (err) {
      console.error(`❌ Failed to fetch ${key}:`, err);
    }
  }

  // Construct .env.local path
  const envPath = path.resolve(process.cwd(), ".env.local");

  // Read existing content if file exists
  const originalContent = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf-8")
    : "";

  // Remove old SSM block (between markers)
  const cleanedContent = originalContent
    .replace(/# === SSM START ===[\s\S]*?# === SSM END ===/gm, "")
    .trim();

  // Create new block to inject
  const newSSMBlock = [
    "# === SSM START ===",
    `# Injected for FE_MODE=${ENV_STAGE}`,
    ...Object.entries(envVars).map(([k, v]) => `${k}=${v}`),
    "# === SSM END ===",
  ].join("\n");

  // Merge cleaned + new block with spacing
  const finalContent =
    [cleanedContent, newSSMBlock].filter(Boolean).join("\n\n") + "\n";

  // Write to .env.local
  fs.writeFileSync(envPath, finalContent);
  console.log("📦 .env.local updated with SSM parameters.");
}

main().catch(console.error);
