module.exports = run;

const core = require("@actions/core");

async function run(octokit, { org, output }) {
  const query = `query ($org: String!, $after: String) {
    rateLimit {
      cost
      limit
      nodeCount
      remaining
      resetAt
    }
    organization(login: $org) {
      repositories(first: 30, privacy: PUBLIC, after:$after) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          name
          isArchived
          openIssues: issues(first: 1, states: [OPEN]) {
            totalCount
          }
          closedIssues: issues(first: 1, states: [CLOSED]) {
            totalCount
          }
          openPullRequests: pullRequests(first: 1, states: [OPEN]) {
            totalCount
          }
          closedPullRequests: pullRequests(first: 1, states: [CLOSED]) {
            totalCount
          }
          mergedPullRequests: pullRequests(first: 1, states: [MERGED]) {
            totalCount
          }
        }
      }
    }
  }`;

  process.stdout.write(`Requesting repo stats for ${org} `);
  const repoStats = [];
  let result;
  do {
    result = await octokit.graphql(query, {
      org,
      after: result
        ? result.organization.repositories.pageInfo.endCursor
        : undefined,
    });
    repoStats.push(...result.organization.repositories.nodes);
    process.stdout.write(".");
  } while (result.organization.repositories.pageInfo.hasNextPage);
  process.stdout.write("\n");

  const orgStats = repoStats.reduce(
    (orgStats, repo) => {
      if (repo.isArchived) {
        return orgStats;
      }

      for (const key of Object.keys(orgStats)) {
        orgStats[key] += repo[key].totalCount;
      }

      return orgStats;
    },
    {
      openIssues: 0,
      closedIssues: 0,
      openPullRequests: 0,
      closedPullRequests: 0,
      mergedPullRequests: 0,
    }
  );

  core.setOutput("data", JSON.stringify(orgStats, null, 2) + "\n");
}
