import dayjs, { Dayjs } from 'dayjs';
import { Passwd } from 'renderer/state';

export const STRENGTH_OPTIONS = [
  'All',
  'Very Weak',
  'Weak',
  'Good',
  'Strong',
  'Very Strong',
];
export const MODIFIED_OPTIONS = [
  'All',
  '< Month',
  '> Month',
  '> 2 Month',
  '> 3 Month',
];
export const ORDER_OPTIONS = ['Label', 'Modified', 'Strength'];
export const VISIBILITY_OPTIONS = ['All', 'Public', 'Private'];

const strengthMap = new Map([
  ['very-weak', 0],
  ['weak', 1],
  ['good', 2],
  ['strong', 3],
  ['very-strong', 4],
]);

const sortByLabel = (
  passwdFir: Passwd,
  passwdSec: Passwd,
  isASC: boolean
): number => {
  let lowerFir = passwdFir.label.toLowerCase();
  let lowerSec = passwdSec.label.toLowerCase();

  isASC = !isASC;

  if (lowerFir < lowerSec) return -1 + +!!isASC * 2;
  if (lowerFir > lowerSec) return 1 - +!!isASC * 2;

  return 0;
};

const sortByStrength = (
  passwdFir: Passwd,
  passwdSec: Passwd,
  isASC: boolean
): number => {
  let strengthFir = strengthMap.get(passwdFir.strength)!;
  let strengthSec = strengthMap.get(passwdSec.strength)!;

  isASC = !isASC;

  if (strengthFir < strengthSec) return -1 + +!!isASC * 2;
  if (strengthFir > strengthSec) return 1 - +!!isASC * 2;
  return 0;
};

const sortByDate = (
  passwdFir: Passwd,
  passwdSec: Passwd,
  isASC: boolean
): number => {
  let dateFir = new Date(passwdFir.modified).getTime();
  let dateSec = new Date(passwdSec.modified).getTime();

  if (isASC) {
    return dateSec - dateFir;
  }

  return dateFir - dateSec;
};

const filterByDate = (query: string, modified: string, now: Dayjs): boolean => {
  const diff = dayjs(now).diff(modified, 'hour');

  if (query === '< Month' && diff < 744) {
    return true;
  }

  if (query === '> Month' && diff >= 744) {
    return true;
  }

  if (query === '> 2 Month' && diff >= 1488) {
    return true;
  }

  if (query === '> 3 Month' && diff >= 2232) {
    return true;
  }

  return false;
};

export const orderPasswds = (
  passwds: Passwd[],
  order: string,
  stregth: string,
  modified: string,
  visibility: string,
  isASC: boolean
): Passwd[] => {
  let newPasswds = passwds;

  if (order === 'Modified') {
    newPasswds.sort((passwdFir, passwdSec) =>
      sortByDate(passwdFir, passwdSec, isASC)
    );
  } else if (order === 'Label') {
    newPasswds.sort((passwdFir, passwdSec) =>
      sortByLabel(passwdFir, passwdSec, isASC)
    );
  } else {
    newPasswds.sort((passwdFir, passwdSec) =>
      sortByStrength(passwdFir, passwdSec, isASC)
    );
  }

  if (stregth !== 'All') {
    const pattern = stregth.replace(' ', '-').toLowerCase();
    newPasswds = passwds.filter((passwd) => passwd.strength === pattern);
  }

  if (modified !== 'All') {
    const now = dayjs(new Date());
    newPasswds = passwds.filter((passwd) =>
      filterByDate(modified, passwd.modified, now)
    );
  }

  if (visibility !== 'All') {
    const isPublic = visibility === 'Public';
    newPasswds = passwds.filter((passwd) => +!!passwd.isPublic === +!!isPublic);
  }

  return newPasswds;
};
