# Reborn ✨ — Se reconstruire un jour à la fois

Application web personnelle et bienveillante d'accompagnement après une rupture amoureuse.

## 🌿 Principes directeurs
- **Bienveillance absolue** : Aucun jugement, aucune obligation de performance ni culpabilisation.
- **Progression flexible** : Possibilité de reporter, sauter ou reprendre n'importe quelle mission du parcours.
- **Variantes douces** : Des alternatives courtes pensées pour les journées émotionnellement difficiles.
- **Confidentialité totale** : Isolation stricte des données personnelles, écrits privés et humeurs.

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 16 (App Router, **Pur JavaScript `.jsx`**, sans TypeScript), Tailwind CSS, police Google **Outfit**, gestionnaire de paquets **pnpm**.
- **Backend** : Python 3.13, Django 5.1, Django REST Framework, SimpleJWT, CORS Headers, PostgreSQL / SQLite.

---

## 🚀 Démarrage rapide

### 1. Backend (Django)
```bash
cd backend
source venv/bin/activate
python manage.py migrate
python manage.py seed_missions  # Charge les 30 missions guidées
python manage.py runserver
```
L'API REST est accessible sur `http://127.0.0.1:8000/api/v1/`.

### 2. Frontend (Next.js)
```bash
cd frontend
pnpm install
pnpm run dev
```
L'application est accessible sur `http://localhost:3000`.

---

## 🧭 Fonctionnalités intégrées

1. **Tableau de bord (`/`)** : Mission du jour avec variante douce, enregistrement immédiat de l'humeur, rappel réconfortant et raccourcis.
2. **Mon parcours (`/parcours`)** : 30 jours structurés autour de 4 thèmes (*Repères*, *Estime*, *Souvenirs*, *Avenir*) avec liberté totale de progression.
3. **Mon journal (`/journal`)** : Écriture intime sans contrainte, tags thématiques, recherche et suppression protégée.
4. **Mes statistiques (`/statistiques`)** : Évolution de l'humeur (7j, 30j, 90j), bilans descriptifs sans score toxique de guérison.
5. **Mon avenir (`/avenir`)** : Définition d'objectifs personnels et découpage en micro-actions concrètes.
6. **Espace d'apaisement SOS (`/sos`)** : Respiration guidée 4-7-8, prise de recul sur l'impulsion de contacter, lettre privée non envoyée et alternatives douces.
7. **Paramètres (`/parametres`)** : Date de début du parcours, date configurable de no-contact, fuseau horaire, export JSON et réinitialisation des données.
