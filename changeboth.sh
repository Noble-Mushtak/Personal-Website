#!/bin/bash
# Apply to public Git repo
git "$@"
# Spacing for stdout
echo "--------------------------------------------------------------------------------"
# Apply to private Git repo
git --git-dir=.git2 --work-tree=./ "$@"
# Get rid of website/secrets.py and ignore stdout
git --git-dir=.git2 --work-tree=./ reset "website/secrets.py" > /dev/null
