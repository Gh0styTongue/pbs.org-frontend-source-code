// remove accents/diacritics and replace them inline
// courtesy of https://stackoverflow.com/a/37511463
const normalizeTextInput = (input: string): string => {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export { normalizeTextInput };
