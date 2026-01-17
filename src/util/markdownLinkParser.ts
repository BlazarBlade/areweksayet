export interface MarkdownLink {
  text: string;
  url: string;
  startIndex: number;
  endIndex: number;
}

export interface MarkdownParseResult {
  links: MarkdownLink[];
  replacedText: string;
}

/**
 * Delegate type for link replacement logic.
 */
export type LinkReplacer = (text: string, url: string) => string;

/**
 * Parses top-level markdown style links: [Link Text](URL)
 * Correctly handles nested brackets and parentheses by tracking nesting levels.
 * Optionally replaces links using the provided replacer function.
 */
export function parseMarkdownLinks(input: string, replacer?: LinkReplacer): MarkdownParseResult {
  const links: MarkdownLink[] = [];
  let replacedText = '';
  let lastIndex = 0;
  let pos = 0;

  while (pos < input.length) {
    if (input[pos] === '[') {
      const startOfLink = pos;
      const bracketContent = findClosingMatch(input, pos, '[', ']');

      if (bracketContent) {
        const afterBracket = bracketContent.endIndex + 1;

        if (afterBracket < input.length && input[afterBracket] === '(') {
          const parenContent = findClosingMatch(input, afterBracket, '(', ')');

          if (parenContent) {
            // Found a valid top-level link
            const linkData: MarkdownLink = {
              text: bracketContent.content,
              url: parenContent.content,
              startIndex: startOfLink,
              endIndex: parenContent.endIndex
            };
            links.push(linkData);

            // Handle replacement logic
            if (replacer) {
              replacedText += input.slice(lastIndex, startOfLink);
              replacedText += replacer(linkData.text, linkData.url);
              lastIndex = parenContent.endIndex + 1;
            }

            pos = parenContent.endIndex + 1;
            continue;
          }
        }
      }
    }
    pos++;
  }

  // Finalize the replaced text
  if (replacer) {
    replacedText += input.slice(lastIndex);
  } else {
    replacedText = input;
  }

  return { links, replacedText };
}


/**
 * Helper to find the matching closing character while respecting nesting.
 */
function findClosingMatch(
  input: string,
  startIdx: number,
  openChar: string,
  closeChar: string
): { content: string; endIndex: number } | null {
  let depth = 0;
  for (let i = startIdx; i < input.length; i++) {
    if (input[i] === openChar) {
      depth++;
    } else if (input[i] === closeChar) {
      depth--;
      if (depth === 0) {
        return {
          content: input.slice(startIdx + 1, i),
          endIndex: i
        };
      }
    }
  }
  return null;
}
