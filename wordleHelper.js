const lettersCorrectSpotMap = {
  e: 2,
  r: 3,
};

const lettersWrongSpotMap = {
  t: [0],
};

const MAX_LETTERS = 5;
const BLANK = '_';
const correctSpotLetters = Object.keys(lettersCorrectSpotMap);
const wrongSpotLetters = Object.keys(lettersWrongSpotMap);
const allLettersFound = [...correctSpotLetters, ...wrongSpotLetters];
const totalLettersFound = correctSpotLetters.length + wrongSpotLetters.length;

const removeValuesFromArray = (array, valuesToRemove) => {
  return array.filter((item) => !valuesToRemove.includes(item));
};

const removeCorrectSpotIndex = (indexArray) => {
  const takenIndex = Object.values(lettersCorrectSpotMap);
  return removeValuesFromArray(indexArray, takenIndex);
};

const getInitialIndexArray = () => {
  const array = [];
  for (let i = 0; i < MAX_LETTERS; i++) {
    array.push(i);
  }
  return array;
};

const lettersPossibleIndexMap = {};

for (const letter of correctSpotLetters) {
  // If 5 letters were found, then no letters are repeating
  // and correct spot letter can't also be in another spot
  if (totalLettersFound === MAX_LETTERS) {
    lettersPossibleIndexMap[letter] = [lettersCorrectSpotMap[letter]];
    continue;
  }
  // If less than 5 letters have been found, correct spot
  // letter may still be at another index as well
  let possibleIndex = getInitialIndexArray();
  possibleIndex = removeCorrectSpotIndex(possibleIndex);
  possibleIndex.push(lettersCorrectSpotMap[letter]);
  lettersPossibleIndexMap[letter] = possibleIndex;
}

for (const letter of wrongSpotLetters) {
  let possibleIndex = getInitialIndexArray();
  possibleIndex = removeCorrectSpotIndex(possibleIndex);
  possibleIndex = removeValuesFromArray(possibleIndex, lettersWrongSpotMap[letter]);
  lettersPossibleIndexMap[letter] = possibleIndex;
}

(() => {
  if (totalLettersFound < MAX_LETTERS) {
    let possibleIndex = getInitialIndexArray();
    possibleIndex = removeCorrectSpotIndex(possibleIndex);
    lettersPossibleIndexMap[BLANK] = possibleIndex;
  }
})();

let allCombinations = [''];

for (let wordIndex = 0; wordIndex < MAX_LETTERS; wordIndex++) {
  const possibleLettersForIndex = Object.keys(lettersPossibleIndexMap).filter((letter) =>
    lettersPossibleIndexMap[letter].includes(wordIndex),
  );

  const combinations = [];
  for (const combination of allCombinations) {
    for (const letter of possibleLettersForIndex) {
      combinations.push(combination + letter);
    }
  }
  allCombinations = combinations;
}

allCombinations = allCombinations.filter((combination) => {
  // Each letter found needs to appear at least once
  for (const letter of allLettersFound) {
    if (!combination.includes(letter)) {
      return false;
    }
  }

  return true;
});

const getNumberOfBlanks = (combination) => combination.split(BLANK).length - 1;

allCombinations.sort((a, b) => {
  const sortByNumBlanks = getNumberOfBlanks(b) - getNumberOfBlanks(a);
  if (sortByNumBlanks !== 0) {
    return sortByNumBlanks;
  }
  let indexA = a.indexOf(BLANK);
  let indexB = b.indexOf(BLANK);
  let sortByBlankPosition = indexA - indexB;
  while (sortByBlankPosition === 0 && indexA > -1 && indexB > -1) {
    indexA = a.indexOf(BLANK, indexA + 1);
    indexB = b.indexOf(BLANK, indexB + 1);
    sortByBlankPosition = indexA - indexB;
  }
  if (sortByBlankPosition !== 0) {
    return sortByBlankPosition;
  }
  const sortAlphabetically = a[0] > b[0] ? 1 : -1;
  return sortAlphabetically;
});

console.log(allCombinations);
