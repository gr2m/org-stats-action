# org-stats-action

> A GitHub Action to fetch statistics for a GitHub organization

## Usage

### Fetch and log stats

```yml
name: Log @octokit organization statistics
on:
  schedule:
    # https://crontab.guru/every-day
    - cron: "0 0 * * *"

jobs:
  logOctokitStats:
    runs-on: ubuntu-latest
    steps:
      - uses: gr2m/org-stats-action@v1.x
        id: stats
        with:
          org: octokit
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: |
          cat << EOF
          result: ${{ steps.stats.outputs.data }}
          EOF
```

### Fetch stats and update CSV file in repository

```yml
name: Update data/octokit-stats.csv
on:
  schedule:
    # https://crontab.guru/every-day
    - cron: "0 0 * * *"
jobs:
  updateOctokitStats:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # fetch statistics for @octokit org
      - uses: gr2m/org-stats-action@v1.x
        id: stats
        with:
          org: octokit
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      # append stats to data/octokit.csv
      - uses: gr2m/write-csv-file-action@v1.x
        with:
          path: data/octokit.csv
          columns: open issues,closed issues,open pull requests,closed pull requests,merged pull requests
          "open issues": ${{ fromJson(steps.stats.outputs.data).openIssues }}
          "closed issues": ${{ fromJson(steps.stats.outputs.data).closedIssues }}
          "open pull requests": ${{ fromJson(steps.stats.outputs.data).openPullRequests }}
          "closed pull requests": ${{ fromJson(steps.stats.outputs.data).closedPullRequests }}
          "merged pull requests": ${{ fromJson(steps.stats.outputs.data).mergedPullRequests }}
      # push updated file back to main branch
      - run: git config --local user.email "action@github.com"
      - run: git config --local user.name "GitHub Action"
      - run: git add data
      - run: git commit -m "data/octokit.csv updated"
      - run: "git push https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git HEAD"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## License

[ISC](LICENSE.md)
