import { pick } from "./pick";
const formats = "_*`   ";
const lorem = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";
const loremTitle = lorem.split(" ");
const punctItems = ",.";
const generateParagraph = (words: number): string => {
  if (words === 0) {
    return "."
  } else {
    let punct = " ";
    if (Math.random() > .9) {
      punct = pick(punctItems) + " ";
    }
    return `${pick(loremTitle)}${punct}${generateParagraph(words - 1)}`;
  }
}

export const generateContent = (paragraphs: number): string => {
  if (paragraphs === 0) {
    return ""
  } else {
    const format = pick(formats);
    return `${format}${generateParagraph(Math.round(Math.random() * 100 + 20))}${format}\n\n${generateContent(paragraphs - 1)}`
  }
}

export const generateTitle = (words: number): string => {
  if (words === 0) {
    return ""
  } else {
    return `${pick(loremTitle)} ${generateTitle(words - 1)}`;
  }
}