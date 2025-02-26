#!/bin/bash

# Script to remove duplicate files with " 2" in their names

echo "Starting cleanup of duplicate files..."

# Find all files with " 2" in their names and remove them
find . -name "* 2*" -type f -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*" | while read file; do
  echo "Removing duplicate file: $file"
  rm "$file"
done

# Find all directories with " 2" in their names and remove them
find . -name "* 2*" -type d -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*" | sort -r | while read dir; do
  echo "Removing duplicate directory: $dir"
  rm -rf "$dir"
done

echo "Cleanup complete!" 