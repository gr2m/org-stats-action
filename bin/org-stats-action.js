const { Octokit } = require("@octokit/action");
const core = require("@actions/core");

const run = require("..");

const octokit = new Octokit();

run(octokit, {
  org: core.getInput("org"),
  output: core.getInput("output"),
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
