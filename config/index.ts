import path from 'path';
import dotenv from 'dotenv';
let env: NodeJS.ProcessEnv | null = null;

export function enableEnviroments() {
  if (!env) {
    if (process.env.NODE_ENV !== 'prod') {
      dotenv.config({
        path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
      });
    } else {
      dotenv.config();
    }

    env = process.env;
    return env;
  }
  return env;
}
