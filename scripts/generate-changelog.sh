#!/usr/bin/env bash
echo "Generating changelog (placeholder)..."
git log --pretty=format:"- %s (%h)" $(git describe --tags --abbrev=0)..HEAD > CHANGELOG.md
echo "Changelog written to CHANGELOG.md"


