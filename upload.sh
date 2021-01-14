#!/bin/bash
# Push to private Git repo
git push
# Push to public Git repo
git --git-dir=.git2 push
# Give yourself a necessary reminder
echo "Pull the new Web site code to PythonAnywhere"