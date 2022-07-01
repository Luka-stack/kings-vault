import crypto from 'crypto';

const AES256 = 'aes-256-ctr';
const AES256Secret = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const AES128 = 'aes-128-ctr';
const AES128Secret = 'vOVH6sdmpNWvfr3w';

const SHA256 = 'sha256';
const SHA256Secret = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

export const AES256Ecryption = (
  text: string,
  iv?: string
): { iv: string; content: string } => {
  return encryption(text, AES256, AES256Secret, iv);
};

export const AES256Decryption = (iv: string, content: string) => {
  return decryption(content, iv, AES256, AES256Secret);
};

export const AES1286Ecryption = (
  text: string,
  iv?: string
): { iv: string; content: string } => {
  return encryption(text, AES128, AES128Secret, iv);
};

export const AES128Decryption = (iv: string, content: string) => {
  return decryption(content, iv, AES128, AES128Secret);
};

export const createHash = (data: string): string => {
  return crypto.createHmac(SHA256, SHA256Secret).update(data).digest('base64');
};

const encryption = (
  text: string,
  algorithm: string,
  secret: string,
  iv?: string
): { iv: string; content: string } => {
  let initVector = iv ? Buffer.from(iv, 'hex') : crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secret, initVector);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: initVector.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decryption = (
  content: string,
  iv: string,
  algorithm: string,
  secret: string
): string => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secret,
    Buffer.from(iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
