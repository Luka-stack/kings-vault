const charsets = {
  lowerCaseLetters: 'a-z',
  upperCaseLetters: 'A-Z',
  numbers: '0-9',
  other: ' !"#$%&\'()*+,-./:;<=>?@[\\]\\^_`{|}~',
};

const patterns = {
  lowerCaseLetters: '(?=.*[a-z])',
  upperCaseLetters: '(?=.*[A-Z])',
  numbers: '(?=.*\\d)',
  other: '(?=.*(\\W+|_))',
};

const getRandomByte = () => {
  const result = new Uint8Array(1);
  window.crypto.getRandomValues(result);
  return result[0];
};

const generate = (charset: RegExp, length: number): string => {
  const ret = Array.apply(null, { length } as unknown[])
    .map(() => {
      let result;

      while (true) {
        result = String.fromCharCode(getRandomByte());

        if (charset.test(result)) {
          return result;
        }
      }
    })
    .join('');

  return ret;
};

const prepareRegex = (settings: {
  lowerSet: boolean;
  upperSet: boolean;
  numbersSet: boolean;
  symbolsSet: boolean;
}): {
  charset: RegExp;
  pattern: RegExp;
} => {
  const { lowerSet, upperSet, numbersSet, symbolsSet } = settings;

  let charsetSoFar = [];
  let patternSoFar = [];

  if (numbersSet) {
    charsetSoFar.push(charsets.numbers);
    patternSoFar.push(patterns.numbers);
  }

  if (symbolsSet) {
    charsetSoFar.push(charsets.other);
    patternSoFar.push(patterns.other);
  }

  if (lowerSet) {
    charsetSoFar.push(charsets.lowerCaseLetters);
    patternSoFar.push(patterns.lowerCaseLetters);
  }

  if (upperSet) {
    charsetSoFar.push(charsets.upperCaseLetters);
    patternSoFar.push(patterns.upperCaseLetters);
  }

  return {
    charset: new RegExp(`[${charsetSoFar.join('')}]`),
    pattern: new RegExp(`${patternSoFar.join('')}.*`),
  };
};

export const generatePassword = (
  settings: {
    lowerSet: boolean;
    upperSet: boolean;
    numbersSet: boolean;
    symbolsSet: boolean;
  },
  length: number
): string => {
  const { charset, pattern } = prepareRegex(settings);
  let result: string;

  while (true) {
    result = generate(charset, length);

    if (pattern.test(result)) {
      return result;
    }
  }
};
