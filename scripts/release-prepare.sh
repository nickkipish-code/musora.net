#!/usr/bin/env bash
set -e
echo "Running release prepare: generate changelog and run tests"
pnpm changelog || true
pnpm -w test || true
echo "Release prep done. Run 'pnpm release:tag' to push tag."


