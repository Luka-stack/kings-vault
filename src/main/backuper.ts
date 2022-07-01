import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { AES1286Ecryption } from './cipher';
import { Passwd } from './database/entities/passwd/passwd';

const fileCheckKey = 'da6630c1552916270d55012ff8b15aac';

export const exportPasswd = async (passwds: Passwd[]) => {
  // Prune JSON
  for (let passwd of passwds) {
    Reflect.deleteProperty(passwd, 'id');
    Reflect.deleteProperty(passwd, 'userId');
    Reflect.deleteProperty(passwd, 'username');
  }

  const encryptedPasswd = AES1286Ecryption(
    JSON.stringify(passwds),
    fileCheckKey
  );

  try {
    const filepath = path.join(
      'C:\\Users\\lkrra\\Documents',
      `Passwords-${getCurrentDate()}.txt`
    );

    await writeFile(filepath, encryptedPasswd.content, 'utf-8');
  } catch (err) {
    console.log(err);
  }
};

const getCurrentDate = (): string => {
  const current = new Date();
  const cDate =
    current.getFullYear() +
    '-' +
    (current.getMonth() + 1) +
    '-' +
    current.getDate();
  const cTime =
    current.getHours() +
    '.' +
    current.getMinutes() +
    '.' +
    current.getSeconds();

  return cDate + '_' + cTime;
};
