# backend/deps.py
from fastapi import HTTPException, status, Header
import firebase_admin
from firebase_admin import auth as fb_auth, credentials
from google.cloud import firestore
import os
import json
import base64
from dotenv import load_dotenv

# Initialise Firebase Admin once
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

from fastapi import Depends, HTTPException, status
from firebase_admin import auth as fb_auth, credentials, initialize_app
from firebase_admin import firestore

# Use env variable to find service account path
b64_key = os.getenv("FIREBASE_CREDENTIALS_BASE64")

if b64_key:
    cred_dict = json.loads(base64.b64decode(b64_key).decode())
    cred = credentials.Certificate(cred_dict)
else:
    # 2) Fallback to local file for dev –––––––––––––––––––––––––––
    cred = credentials.Certificate("backend/serviceAccountKey.json")
    # (make sure this file is in .gitignore)

initialize_app(cred)
db = firestore.client()
PROMPT_LIMIT = 5

# ------------------------------------------------------------------
def _extract_token(authorization: str | None = Header(None)) -> str:
    """
    Pulls Bearer token from 'Authorization' header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Missing Bearer token")
    return authorization.split(" ", 1)[1]

def _uid_from_token(authorization: str = Header(...)) -> str:
    """
    Verifies Firebase ID token and returns UID.
    """
    token = _extract_token(authorization)
    try:
        decoded = fb_auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid Firebase token")

def enforce_quota(uid: str = Header(..., alias="X-UID")):
    """
    FastAPI dependency that:
    1) Verifies the token & gets UID   (done by header alias on route)
    2) Atomically reads + increments prompt count
    3) Raises 429 when PROMPT_LIMIT reached
    """
    doc_ref = db.collection("usage").document(uid)

    @firestore.transactional
    def _txn(tx):
        snap = doc_ref.get(transaction=tx)
        used = snap.get("prompts") if snap.exists else 0
        if used >= PROMPT_LIMIT:
            raise HTTPException(status_code=429,
                                detail=f"Quota exceeded ({PROMPT_LIMIT} prompts)")
        tx.set(doc_ref, {"prompts": firestore.Increment(1)}, merge=True)

    _txn(db.transaction())
    return uid  # injected into route

# ------------------------------------------------------------------
# Provide a single dependency that does both token verify + quota
def quota_guard(authorization: str = Header(...)):
    uid = _uid_from_token(authorization)
    enforce_quota(uid=uid)
    return uid
