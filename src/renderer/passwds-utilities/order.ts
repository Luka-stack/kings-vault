import { Passwd } from 'renderer/state';

export const STRENGTH_OPTIONS = [
  'All',
  'Very Weak',
  'Weak',
  'Good',
  'Strong',
  'Very Strong',
];
export const MODIFIED_OPTIONS = ['All', '< Week', '< Month', '< Year'];
export const ORDER_OPTIONS = ['Age', 'Label', 'Strength'];
export const VISIBILITY_OPTIONS = ['All', 'Public', 'Private'];

const strengthMap = new Map([
  ['very-weak', 0],
  ['weak', 1],
  ['good', 2],
  ['strong', 3],
  ['very-strong', 4],
]);

const sortByLabel = (passwdFir: Passwd, passwdSec: Passwd): number => {
  let lowerFir = passwdFir.label.toLowerCase();
  let lowerSec = passwdSec.label.toLowerCase();

  if (lowerFir < lowerSec) return -1;
  if (lowerFir > lowerSec) return 1;
  return 0;
};

const sortByStrength = (passwdFir: Passwd, passwdSec: Passwd): number => {
  let strengthFir = strengthMap.get(passwdFir.strength)!;
  let strengthSec = strengthMap.get(passwdSec.strength)!;

  if (strengthFir < strengthSec) return -1;
  if (strengthFir > strengthSec) return 1;
  return 0;
};

const sortByDate = (passwdFir: Passwd, passwdSec: Passwd): number => {
  let dateFir = new Date(passwdFir.modified).getTime();
  let dateSec = new Date(passwdSec.modified).getTime();

  return dateFir - dateSec;
};

export const orderPasswds = (
  passwds: Passwd[],
  order: string,
  stregth: string
): Passwd[] => {
  let newPasswds = passwds;

  if (order === 'Age') {
    newPasswds.sort(sortByDate);
  } else if (order === 'Label') {
    newPasswds.sort(sortByLabel);
  } else {
    newPasswds.sort(sortByStrength);
  }

  if (stregth !== 'All') {
    const pattern = stregth.replace(' ', '-').toLowerCase();
    newPasswds = passwds.filter((passwd) => passwd.strength === pattern);
  }

  return newPasswds;
};
