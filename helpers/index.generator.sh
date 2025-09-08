#!/bin/bash

INDEX_TS="$(dirname "$0")/index.ts"

echo "" > "$INDEX_TS"

for file in "$(dirname "$0")"/*.ts; do
  filename=$(basename "$file")
  
  if [[ "$filename" != "index.ts" && "$filename" != *.spec.ts ]]; then
    module_name="${filename%.ts}"
    echo "export * from './$module_name';" >> "$INDEX_TS"
  fi
done