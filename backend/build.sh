#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "📦 Installation des dépendances Python..."
pip install -r requirements.txt

echo "🎨 Collecte des fichiers statiques..."
python manage.py collectstatic --no-input

echo "🗄️ Application des migrations de base de données..."
python manage.py migrate

echo "🌱 Chargement des 30 missions du parcours Reborn..."
python manage.py seed_missions

echo "👤 Initialisation du compte Farhane..."
python manage.py seed_user

echo "✅ Build terminé avec succès !"
