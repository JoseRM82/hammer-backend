import Crypto from 'crypto-js';
import AES from 'crypto-js/aes';

function encrypt(text: string): string {
  const cryptedPass = AES.encrypt(text, process.env.JWT_KEY_PASS as string);
  return cryptedPass.toString();
}

function decrypt(hash: string): any {
  const decrypted = AES.decrypt(hash, process.env.JWT_KEY_PASS as string).toString(Crypto.enc.Utf8);
  console.log({ decrypted });
  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
}

function comparePassword(hash: string, compare: string): boolean {
  const decrypted = decrypt(hash);
  console.log({ decrypted });
  if (compare === String(decrypted)) {
    console.log('TRUE!');
    console.log({ decrypted: String(decrypted), compare });
    return true;
  }
  return false;
}

export { encrypt, decrypt, comparePassword };
