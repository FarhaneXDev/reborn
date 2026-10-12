# Guide de Déploiement : Reborn ✨ (GitHub, Render & Vercel)

Ce guide décrit pas à pas la mise en ligne du projet :
- **Dépôt Git** : Monorepo sur GitHub
- **Backend API** : Hébergé sur **Render** (Python / Django) avec base de données **Render PostgreSQL**
- **Frontend Web** : Hébergé sur **Vercel** (Next.js)

---

## Étape 1 : Publier le projet sur GitHub

1. Créez un nouveau dépôt vide sur votre compte GitHub (ex: `reborn` ou `nocontact`).
2. Dans votre terminal local, liez le dépôt distant et poussez le code :
```bash
cd /Users/blvck/Desktop/Projects/nocontact

# Remplacez <VOTRE_PSEUDO_OU_URL> par votre lien GitHub
git remote add origin https://github.com/<VOTRE_PSEUDO>/<NOM_DU_REPO>.git
git branch -M main
git push -u origin main
```

---

## Étape 2 : Déployer le Backend sur Render

### A. Créer la base de données PostgreSQL sur Render
1. Rendez-vous sur votre compte **[Render](https://dashboard.render.com/)**.
2. Cliquez sur **New +** > **PostgreSQL**.
3. Renseignez un nom (ex: `reborn-db`), laissez le plan Free (ou Starter).
4. Cliquez sur **Create Database**.
5. Une fois créée, copiez la **Internal Database URL** (ou *External Database URL* si vous préférez).

### B. Créer le Web Service Django
1. Sur Render, cliquez sur **New +** > **Web Service**.
2. Connectez votre dépôt GitHub.
3. Configurez les options suivantes :
   - **Name** : `reborn-api`
   - **Root Directory** : `backend`
   - **Environment** : `Python`
   - **Build Command** : `./build.sh`
   - **Start Command** : `gunicorn config.wsgi:application`
4. Dans la section **Environment Variables**, ajoutez :
   - `DATABASE_URL` : *(L'URL PostgreSQL copiée à l'étape A)*
   - `DJANGO_SECRET_KEY` : *(Une chaîne secrète aléatoire et complexe)*
   - `DJANGO_DEBUG` : `False`
   - `DJANGO_ALLOWED_HOSTS` : `*`
   - `CORS_ALLOW_ALL_ORIGINS` : `True` *(ou l'URL Vercel de votre frontend)*
5. Cliquez sur **Deploy Web Service**.

> **Note :** Le script `./build.sh` s'occupe automatiquement de :
> - Installer les dépendances
> - Collecter les fichiers statiques (WhiteNoise)
> - Appliquer les migrations de base de données
> - Créer les 30 missions guidées (`seed_missions`)
> - Créer votre compte pré-configuré `farhane@mail.com` (`seed_user`)

Une fois déployé, notez l'URL fournie par Render (ex: `https://reborn-api.onrender.com`).

---

## Étape 3 : Déployer le Frontend sur Vercel

1. Rendez-vous sur **[Vercel](https://vercel.com/)**.
2. Cliquez sur **Add New...** > **Project**.
3. Importez votre dépôt GitHub `reborn`.
4. Dans la configuration du projet :
   - **Root Directory** : Cliquez sur *Edit* et sélectionnez `frontend`.
   - **Framework Preset** : `Next.js` (détecté automatiquement).
5. Dans la section **Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_API_BASE_URL` : `https://reborn-api.onrender.com/api/v1` *(en remplaçant par votre URL Render exacte, en terminant par `/api/v1`)*
6. Cliquez sur **Deploy**.

---

## Étape 4 : Connexion à l'application

Une fois Vercel déployé :
1. Ouvrez l'URL de votre application Vercel dans votre navigateur.
2. L'application vous redirige automatiquement sur la page de connexion `/login`.
3. Connectez-vous avec vos identifiants pré-enregistrés :
   - **Email** : `farhane@mail.com`
   - **Mot de passe** : `Bl4ckM4f!4667#`
4. Vous accédez immédiatement à votre tableau de bord, avec votre prénom **Farhane** et votre compteur configuré dès le **10/10/2026** !
