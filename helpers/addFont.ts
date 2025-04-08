import { addCssFile } from "./html";

export default function addFont(name: string) {
  return addCssFile(`https://fonts.m4k.fr/v1/${name}`);
}
