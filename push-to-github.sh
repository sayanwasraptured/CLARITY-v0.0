#!/bin/bash
# Push Clarity to a GitHub repo.
# Usage:  ./push-to-github.sh YOUR_GITHUB_USERNAME
# Optional repo name:  ./push-to-github.sh YOUR_USERNAME my-repo-name

set -e
USER="$1"
REPO="${2:-clarity}"

if [ -z "$USER" ]; then
  echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME [repo-name]"
  exit 1
fi

echo "-> Repo:  https://github.com/$USER/$REPO"
echo "-> Pages: https://$USER.github.io/$REPO/"
echo
echo "Create the repo on GitHub first (github.com/new), EMPTY, no README."
read -r -p "Press Enter once it exists, or Ctrl+C to cancel..."

git init -q 2>/dev/null || true
git add -A
git commit -q -m "Clarity: voice-first campus navigation for NITK Surathkal" 2>/dev/null || echo "  (nothing new to commit)"
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$USER/$REPO.git"
git push -u origin main

echo
echo "Done. Now switch on Pages:"
echo "  https://github.com/$USER/$REPO/settings/pages"
echo "  Source: Deploy from a branch -> main -> / (root) -> Save"
echo
echo "Live about 60 seconds later at:"
echo "  https://$USER.github.io/$REPO/"
