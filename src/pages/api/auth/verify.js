// pages/api/auth/verify.js
import nacl from "tweetnacl";
import bs58 from "bs58";

const NONCE_STORE = global.__NONCE_STORE ||= new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { pubkey, signature, nonce } = req.body;
  if (!pubkey || !signature || !nonce) return res.status(400).send("missing fields");

  // validate nonce exists
  if (!NONCE_STORE.has(nonce)) return res.status(400).send("invalid or expired nonce");

  // reconstruct message exactly as the client signed
  const msg = `Sign in to EdgeMetrics\nnonce: ${nonce}`;
  const msgBytes = new TextEncoder().encode(msg);

  try {
    const sigUint8 = Uint8Array.from(signature);
    const pubkeyUint8 = bs58.decode(pubkey); // public key is base58
    const verified = nacl.sign.detached.verify(msgBytes, sigUint8, pubkeyUint8);

    if (!verified) return res.status(401).send("signature verification failed");

    // verification succeeded -> create session / JWT here
    // For demo we return success and delete the nonce
    NONCE_STORE.delete(nonce);

    // TODO: create your application session here (cookie or JWT)
    res.json({ ok: true, pubkey });
  } catch (err) {
    console.error("verify error:", err);
    res.status(500).send("server error");
  }
}