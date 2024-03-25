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

function comparePassword(dbPass: string, logedPass: string): boolean {
  const decrypted = decrypt(dbPass);
  console.log({ decrypted });
  console.log({ logedPass });
  if (logedPass === String(decrypted)) {
    console.log('TRUE!');
    console.log({ decrypted: String(decrypted), logedPass });
    return true;
  }
  return false;
}

export { encrypt, decrypt, comparePassword };
