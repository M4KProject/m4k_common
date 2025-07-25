import { addCssFile } from "./html.ts";

export const addFont = (name: string) => addCssFile(`https://fonts.m4k.fr/v1/${name}`);

export default addFont;