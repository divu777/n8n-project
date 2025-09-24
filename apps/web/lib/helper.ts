import crypto from 'crypto'
const algo = 'aes-256-gcm'
const SECRET_KEY = crypto.scryptSync(process.env.SECRET_KEY!,'salt',32)
const IV = crypto.randomBytes(16);



export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algo, SECRET_KEY, IV);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${IV.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedData: string) {
  const [ivHex, tagHex, encryptedHex] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv(algo, SECRET_KEY, Buffer.from(ivHex!, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex!, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex!, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}