import { AES, enc } from 'crypto-js';

function hash(text, nonce) {
  if (!text) {
    return null;
  }
  const plainDigest = nonce + process.env.REACT_APP_KEY;

  return AES.encrypt(text, plainDigest).toString();
}

function dehash(aes, nonce) {
  if (!aes) {
    return null;
  }
  const plainDigest = nonce + process.env.REACT_APP_KEY;

  return AES.decrypt(aes, plainDigest).toString(enc.Utf8);
}

export { hash, dehash };
