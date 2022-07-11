import { parseArgs } from "./helpers.js";
import { onDiff } from "./onDiff.js";
import { run } from "./run.js";

const ARGS = parseArgs(
  [
    {
      name: "password",
      options: ["-p", "--password"],
      required: true,
      env: process.env.SWAG_PASSWORD,
    },
    {
      name: "url",
      options: ["-u", "--url"],
      required: true,
      env: process.env.SWAG_URL,
    },
    {
      name: "interval",
      options: ["-i", "--interval"],
      required: false,
      env: process.env.CHECK_INTERVAL_SECONDS,
      default: 10,
    },
  ],
  process.argv.slice(2)
);

run(ARGS, onDiff);
