# org-stats-action

> A GitHub Action to fetch statistics for a GitHub organization

## Usage

Example to log JSON result for the [@octokit](https://github.com/octokit) organization.

```yml
Name: Log @octokit organization statistics
on:
  schedule:
    # https://crontab.guru/every-day
    - cron: 0 0 * * *

jobs:
  logOctokitStats:
    runs-on: ubuntu-latest
    steps:
      - uses: gr2m/orgs-stats-action@v1.x
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

## License

[ISC](LICENSE.md)
