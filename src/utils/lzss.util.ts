export interface LZSSMatch {
  offset: number;
  length: number;
}

export interface LZSSToken {
  type: 'literal' | 'match';
  value: string | LZSSMatch;
}

// Параметры LZSS
const WINDOW_SIZE = 4096; // Размер окна поиска (12 бит)
const LOOKAHEAD_SIZE = 18; // Размер буфера упреждения
const MIN_MATCH_LENGTH = 3; // Минимальная длина совпадения

export function lzssEncode(text: string): string {
  if (!text) return '';

  const tokens: LZSSToken[] = [];
  let pos = 0;

  while (pos < text.length) {
    let bestMatch: LZSSMatch | null = null;
    let bestLength = 0;

    // Определяем начало окна поиска
    const windowStart = Math.max(0, pos - WINDOW_SIZE);
    const lookaheadEnd = Math.min(text.length, pos + LOOKAHEAD_SIZE);

    // Ищем самое длинное совпадение в окне
    for (let i = windowStart; i < pos; i++) {
      let matchLength = 0;

      // Считаем длину совпадения
      while (
        pos + matchLength < lookaheadEnd &&
        text[i + matchLength] === text[pos + matchLength]
      ) {
        matchLength++;
      }

      // Если найдено лучшее совпадение
      if (matchLength >= MIN_MATCH_LENGTH && matchLength > bestLength) {
        bestLength = matchLength;
        bestMatch = {
          offset: pos - i,
          length: matchLength,
        };
      }
    }

    if (bestMatch) {
      tokens.push({
        type: 'match',
        value: bestMatch,
      });
      pos += bestMatch.length;
    } else {
      tokens.push({
        type: 'literal',
        value: text[pos],
      });
      pos++;
    }
  }

  // Кодируем токены в бинарную строку
  return encodeTokens(tokens);
}

function encodeTokens(tokens: LZSSToken[]): string {
  let result = '';

  for (const token of tokens) {
    if (token.type === 'literal') {
      // Флаг 1 означает литерал, затем 8 бит символа
      result += '1';
      const char = token.value as string;
      const charCode = char.charCodeAt(0);
      result += charCode.toString(2).padStart(16, '0'); // 16 бит для Unicode
    } else {
      // Флаг 0 означает совпадение
      result += '0';
      const match = token.value as LZSSMatch;
      // 12 бит для смещения, 6 бит для длины (максимум 18+3=21)
      result += match.offset.toString(2).padStart(12, '0');
      result += (match.length - MIN_MATCH_LENGTH).toString(2).padStart(6, '0');
    }
  }

  return result;
}

export function lzssDecode(encoded: string): string {
  if (!encoded) return '';

  let result = '';
  let pos = 0;

  while (pos < encoded.length) {
    const flag = encoded[pos];
    pos++;

    if (flag === '1') {
      // Литерал: читаем 16 бит
      if (pos + 16 > encoded.length) {
        console.error('Неполный литерал на позиции', pos);
        break;
      }
      const charCode = parseInt(encoded.substring(pos, pos + 16), 2);
      result += String.fromCharCode(charCode);
      pos += 16;
    } else if (flag === '0') {
      // Совпадение: читаем 12 бит смещения и 6 бит длины
      if (pos + 18 > encoded.length) {
        console.error('Неполное совпадение на позиции', pos);
        break;
      }

      const offset = parseInt(encoded.substring(pos, pos + 12), 2);
      pos += 12;
      const length =
        parseInt(encoded.substring(pos, pos + 6), 2) + MIN_MATCH_LENGTH;
      pos += 6;

      // Копируем из уже декодированной части
      const startPos = result.length - offset;

      if (startPos < 0) {
        console.error(
          `Некорректное смещение: ${offset} на позиции результата ${result.length}`,
        );
        break;
      }

      for (let i = 0; i < length; i++) {
        result += result[startPos + i];
      }
    } else {
      console.error('Неизвестный флаг:', flag);
      break;
    }
  }

  return result;
}

// Функция для статистики сжатия
export function getLZSSStats(
  original: string,
  encoded: string,
): {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
} {
  const originalSize = original.length * 16; // 16 бит на символ (UTF-16)
  const compressedSize = encoded.length;

  return {
    originalSize,
    compressedSize,
    compressionRatio: compressedSize / originalSize,
  };
}
