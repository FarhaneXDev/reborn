#!/usr/bin/env python3
"""
Script Keep-Alive pour Reborn (Render & Neon PostgreSQL).
Peut être exécuté localement, via une tâche cron, ou sur un serveur.
"""

import sys
import os
import urllib.request
import urllib.error
import time

def ping_http(url: str):
    health_url = url.rstrip('/') + '/api/v1/health/'
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Envoi du ping HTTP vers : {health_url}")
    try:
        req = urllib.request.Request(
            health_url,
            headers={"User-Agent": "Reborn-KeepAlive-Ping/1.0"}
        )
        with urllib.request.urlopen(req, timeout=30) as res:
            content = res.read().decode('utf-8')
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] ✅ Succès (HTTP {res.status}) : {content}")
            return True
    except urllib.error.HTTPError as e:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] ⚠️ Erreur HTTP {e.code} : {e.reason}")
        return False
    except Exception as e:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] ❌ Erreur réseau : {e}")
        return False

def ping_neon_direct(database_url: str):
    try:
        import psycopg2
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Connexion directe à Neon PostgreSQL...")
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        cur.fetchone()
        cur.close()
        conn.close()
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] ✅ Succès : Requête SQL directe réussie sur Neon !")
        return True
    except Exception as e:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] ❌ Erreur connexion PostgreSQL : {e}")
        return False

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else os.getenv("RENDER_APP_URL", "http://127.0.0.1:8000")
    if target.startswith("postgresql://") or target.startswith("postgres://"):
        ping_neon_direct(target)
    else:
        ping_http(target)
