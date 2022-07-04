import zxcvbn from 'zxcvbn';

export type PasswordStrength =
  | 'very-weak'
  | 'weak'
  | 'good'
  | 'strong'
  | 'very-strong';

// const patterns = {
//   lowercaseExp: /(?=.*[a-z])/,
//   uppercaseExp: /(?=.*[A-Z])/,
//   numbersExp: /(?=.*\d)/,
//   otherExp: /(?=.*(\W+|_))/,
// };

// const scorePassword = (password: string): number => {
//   let char: string;
//   let prevChar = '';

//   let lowersCount = 0;
//   let uppersCount = 0;
//   let numbersCount = 0;
//   let symbolsCount = 0;

//   let consecutiveNumbers = 0;
//   let consecutiveLowers = 0;
//   let consecutiveUppers = 0;

//   const { lowercaseExp, uppercaseExp, numbersExp, otherExp } = patterns;

//   for (let i = 0; i < password.length; ++i) {
//     char = password[i];

//     if (lowercaseExp.test(char)) {
//       ++lowersCount;

//       if (lowercaseExp.test(prevChar)) {
//         ++consecutiveLowers;
//       }
//     } else if (uppercaseExp.test(char)) {
//       ++uppersCount;

//       if (uppercaseExp.test(prevChar)) {
//         ++consecutiveUppers;
//       }
//     } else if (numbersExp.test(char)) {
//       ++numbersCount;

//       if (numbersExp.test(prevChar)) {
//         ++consecutiveNumbers;
//       }
//     } else if (otherExp.test(char)) {
//       ++symbolsCount;
//     }

//     prevChar = char;
//   }

//   let sum = 0;

//   // Numbers of Characters
//   sum += password.length * 4;

//   // Uppercase letters
//   if (uppersCount) {
//     sum += (password.length - uppersCount) * 2;
//   }

//   // Lowercase letters
//   if (lowersCount) {
//     sum += (password.length - lowersCount) * 2;
//   }

//   // Numbers
//   sum += numbersCount * 4;

//   // Symbols
//   sum += symbolsCount * 6;

//   // Letters Only
//   if (!numbersCount && !symbolsCount) {
//     sum -= uppersCount + lowersCount;
//   }

//   // Numbers Only
//   if (!uppersCount && !lowersCount && !symbolsCount) {
//     sum -= numbersCount;
//   }

//   // Consecutive Uppercase Letters
//   sum -= consecutiveUppers * 2;

//   // Consecutive Lowercase Letters
//   sum -= consecutiveLowers * 2;

//   // Consecutive Numbers
//   sum -= consecutiveNumbers * 2;

//   return sum;
// };

// const rankPassword = (password: string): PasswordStrength => {
//   const score = scorePassword(password);

//   if (score < 27) {
//     return 'very-weak';
//   }

//   if (27 <= score && score < 39) {
//     return 'weak';
//   }

//   if (39 <= score && score < 54) {
//     return 'good';
//   }

//   if (54 <= score && score < 68) {
//     return 'strong';
//   }

//   return 'very-strong';
// };

export const rankPassword = (password: string): PasswordStrength => {
  const score = zxcvbn(password).score;

  console.log(score);

  switch (score) {
    case 0:
      return 'very-weak';

    case 1:
      return 'weak';

    case 2:
      return 'good';

    case 3:
      return 'strong';

    case 4:
      return 'very-strong';
  }
};
