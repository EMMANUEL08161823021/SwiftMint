// pages/api/auth/nonce.js
import { randomUUID } from "crypto";

const NONCE_STORE = global.__NONCE_STORE ||= new Map();

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const nonce = randomUUID();
  // store nonce temporarily (expires in 5 minutes)
  NONCE_STORE.set(nonce, Date.now());
  setTimeout(() => NONCE_STORE.delete(nonce), 5 * 60 * 1000);
  res.json({ nonce });
}