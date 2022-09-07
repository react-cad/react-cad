#!/usr/bin/env bash

set -eo pipefail

git diff --name-only $(git describe --abbrev=0 HEAD^) | grep packages/core/Dockerfile
# Grep returns an error if Dockerfile is unchanged, so this ony runs if it changes
echo "Dockerfile changed"
