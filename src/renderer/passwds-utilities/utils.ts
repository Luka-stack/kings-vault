export const MIN_LENGTH = 4;
export const DEFAULT_LENGTH = 14;
export const MAX_LENGTH = 50;

export const greaterThanDefault = (input: string): boolean => {
  const lengthString = input.replaceAll(' ', '');

  length = Number(lengthString);
  if (length && length >= DEFAULT_LENGTH) {
    return true;
  }

  let sign = lengthString[0];
  length = Number(lengthString.slice(1));

  if (!length) {
    return false;
  }

  if ((sign === '=' || sign === '>') && length >= DEFAULT_LENGTH) {
    return true;
  }

  return false;
};

export const setLength = (input: string): number => {
  let length;
  let min = MIN_LENGTH;
  let max = MAX_LENGTH;
  const lengthString = input.replaceAll(' ', '');

  // Check if it is only number and if it is greater than min length
  length = Number(lengthString);
  if (length) {
    if (length > max || length < min) {
      throw `Length must be from range ${min} >= x >= ${max}`;
    }
    return Math.max(length, MIN_LENGTH);
  }

  // In case there is sign '>', '<', '='
  let sign = lengthString[0];
  length = Number(lengthString.slice(1));

  if (!length) {
    throw "Length can contain only '<', '>', '=' and digits. ex. > 10";
  }

  if (length > max || length < min) {
    throw `Length must be from range ${min}>= x >= ${max}`;
  }

  if (sign === '=') {
    return length;
  } else if (sign === '>') {
    min = length;
  } else if (sign === '<') {
    max = length;
  } else {
    throw "Length can contain only '<', '>', '=' and digits. ex. > 10";
  }

  return Math.floor(Math.random() * (max - min) + min);
};
