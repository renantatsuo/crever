import { parseArgs } from "./helpers.js";

const args = parseArgs(
  [
    {
      name: "password",
      options: ["-p", "--password"],
      required: true,
    },
  ],
  process.argv.slice(2)
);
