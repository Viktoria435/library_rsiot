export const CUSTOM_ALPHABET =
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789' +
  '.,;:=|!?()[]{}"\'-_/\\@#$%^&* ';

const alphabetMap = new Map<string, number>();

for (let i = 0; i < CUSTOM_ALPHABET.length; i++) {
  alphabetMap.set(CUSTOM_ALPHABET[i], i + 1);
}

function getPos(char: string): number {
  const pos = alphabetMap.get(char);
  if (!pos) throw new Error(`Character "${char}" is missing in the alphabet`);
  return pos;
}

function getChar(pos: number): string {
  return CUSTOM_ALPHABET[pos - 1];
}

export function encryptWithAlphabet(text: string, key: string): string {
  let result = '';
  const N = CUSTOM_ALPHABET.length;

  for (let i = 0; i < text.length; i++) {
    const tPos = getPos(text[i]);
    const kPos = getPos(key[i % key.length]);

    let encPos = tPos + kPos;
    if (encPos > N) encPos -= N;

    result += getChar(encPos);
  }

  return result;
}

export function decryptWithAlphabet(encrypted: string, key: string): string {
  let result = '';
  const N = CUSTOM_ALPHABET.length;

  for (let i = 0; i < encrypted.length; i++) {
    const ePos = getPos(encrypted[i]);
    const kPos = getPos(key[i % key.length]);

    let decPos = ePos - kPos;
    if (decPos <= 0) decPos += N;

    result += getChar(decPos);
  }

  return result;
}
