#!/usr/bin/env bash
# Publishes the Hostinger build to the `hostinger-site` branch.
# Hostinger (hPanel → Advanced → Git) deploys that branch into public_html.
# Usage: npm run deploy:hostinger [-- "commit message"]
set -euo pipefail
cd "$(dirname "$0")/.."
BRANCH=hostinger-site
MESSAGE=${1:-"Deploy site $(git rev-parse --short HEAD)"}

npm run --silent build:hostinger

work=$(mktemp -d)
trap 'git worktree remove --force "$work" >/dev/null 2>&1 || true' EXIT
if git fetch -q origin "$BRANCH" 2>/dev/null; then
  git worktree add -q -B "$BRANCH" "$work" "origin/$BRANCH"
else
  git worktree add -q --detach "$work"
  git -C "$work" checkout -q --orphan "$BRANCH"
fi
git -C "$work" rm -rqf --ignore-unmatch .
cp -a dist/hostinger/. "$work/"
git -C "$work" add -A
if git -C "$work" diff --cached --quiet; then
  echo "Nothing new to deploy."
  exit 0
fi
git -C "$work" commit -qm "$MESSAGE"
git -C "$work" push -u origin "$BRANCH"
echo "Pushed to $BRANCH — Hostinger deploys it automatically."
