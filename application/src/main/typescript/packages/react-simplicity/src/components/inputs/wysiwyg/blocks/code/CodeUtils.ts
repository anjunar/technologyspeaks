import {TokenNode} from "./TokenNode";
import {Token} from "prismjs";
import {TokenLineNode} from "./TokenLineNode";

export function toTokenNodes(tokens: (string | Token)[], startIndex = 0): TokenNode[] {
    let currentIndex = startIndex;
    return tokens.map(token => {
        if (typeof token === "string") {
            let node = new TokenNode(token, "text", currentIndex);
            currentIndex += token.length;
            return node;
        } else {
            let tokenStartIndex = currentIndex;

            if (Array.isArray(token.content)) {
                let content = toTokenNodes(token.content, tokenStartIndex);
                currentIndex = content.length > 0
                    ? content[content.length - 1].index + content[content.length - 1].text.length
                    : tokenStartIndex;
                return new TokenNode(content, token.type, tokenStartIndex);
            } else {
                currentIndex += (token.content as string).length;
                return new TokenNode(token.content as string, token.type, tokenStartIndex);
            }
        }
    });
}

export function groupTokensIntoLines(tokens: TokenNode[]): TokenLineNode[] {
    const lines: TokenLineNode[] = [new TokenLineNode([])];
    let currentLine = 0;

    tokens.forEach((token) => {
        if (typeof token.text === "string" && token.text.includes("\n")) {
            const parts = token.text.split("\n");
            const indexOfN = token.text.indexOf("\n")
            parts.forEach((part, index) => {
                if (index > 0) {
                    lines.push(new TokenLineNode([new TokenNode("", "whitespace", token.index + index + indexOfN)]));
                    currentLine++;
                }
                if (part) {
                    if (index > 0) {
                        lines[currentLine].children.push(
                            new TokenNode(part, token.type, token.index + index + indexOfN)
                        );
                    } else {
                        lines[currentLine].children.push(
                            new TokenNode(part, token.type, token.index + index)
                        );
                    }
                }
            });
        } else {
            lines[currentLine].children.push(token);
        }
    });

    return lines;
}

export function tokenDiff(
    oldLines: TokenLineNode[],
    newLines: TokenLineNode[]
): TokenLineNode[] {
    const result: TokenLineNode[] = [];

    newLines.forEach((newLine, index) => {

        let oldLine = oldLines[index];

        if (oldLine && compareTokenLines(oldLine.children, newLine.children)) {
            result.push(oldLine)
            updateIndices(oldLine.children, newLine.children)
        } else {
            result.push(newLine)
        }

    })

    return result;
}

export function compareTokenLines(oldTokens: TokenNode[], newTokens: TokenNode[]): boolean {
    if (oldTokens.length !== newTokens.length) {
        return false;
    }

    for (let i = 0; i < oldTokens.length; i++) {
        if (oldTokens[i].text !== newTokens[i].text || oldTokens[i].type !== newTokens[i].type) {
            return false;
        }
    }

    return true;
}

export function updateIndices(oldTokens: TokenNode[], newTokens: TokenNode[]): void {
    for (let i = 0; i < oldTokens.length; i++) {
        oldTokens[i].index = newTokens[i].index
    }
}


