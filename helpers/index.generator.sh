#!/bin/bash
# chmod +x index.generator.sh
# ./index.generator.sh

# Vider le fichier s'il existe déjà
echo "" > "index.ts"

# Boucle sur tous les fichiers .ts sauf ceux exclus
for file in ./*.ts; do

  # Exclusion des fichiers index.ts, *.spec.ts et index.generator.sh
  if [[ "$file" != "./index.ts" && "$file" != "./index.generator.sh" && "$file" != *.spec.ts ]]; then

    # Enlever le ./ et le .ts pour obtenir le nom du module
    module_name="${file#./}"
    module_name="${module_name%.ts}"
    echo "export * from \"./$module_name\";" >> "index.ts"

  fi

done

echo "Fichier 'index.ts' généré avec succès."
