#!/usr/bin/env bash
# Auto-commit and push after each Claude turn.
# Safety rules:
#   - Never stages any path matching /\.env/ (root or nested)
#   - Aborts cleanly if no changes
#   - Always exits 0 so Stop event is never blocked
# Set CLAUDE_AUTO_PUSH_DISABLE=1 to bypass.
set -u

[ -n "${CLAUDE_AUTO_PUSH_DISABLE:-}" ] && exit 0

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$REPO_ROOT" || exit 0

FILES=()
while IFS= read -r line; do
  [ -n "$line" ] && FILES+=("$line")
done < <(
  {
    git diff --name-only
    git diff --cached --name-only
    git ls-files --others --exclude-standard
  } | sort -u | grep -vE '(^|/)\.env' || true
)

if [ ${#FILES[@]} -gt 0 ]; then
  git add -- "${FILES[@]}" 2>/dev/null || exit 0
fi

if git diff --cached --name-only 2>/dev/null | grep -qE '(^|/)\.env'; then
  exit 0
fi

if git diff --cached --quiet 2>/dev/null; then
  git push 2>/dev/null || true
  exit 0
fi

N=$(git diff --cached --name-only | wc -l | tr -d ' ')
FIRST=$(git diff --cached --name-only | head -1)
if [ "$N" -eq 1 ]; then
  MSG="auto: update $FIRST"
else
  MSG="auto: update $FIRST and $((N - 1)) more"
fi

git commit -m "$MSG" >/dev/null 2>&1 || exit 0
git push 2>/dev/null || true
exit 0
