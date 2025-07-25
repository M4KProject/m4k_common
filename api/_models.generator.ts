/// <reference types="@types/node" />

import { stringify } from "../helpers/json.ts";
import { firstUpper } from "../helpers/str.ts";
import { _models } from "./_models.ts";
import { writeFile } from "fs/promises";

const base = `// GENERATED : ${new Date().toISOString()}

export interface ModelBase {
  // collectionId: string;
  // collectionName: string;
  id: string;
  created: Date;
  updated: Date;
}

export interface AuthModelBase extends ModelBase {
  email?: string;
  username?: string;
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
  verified?: boolean;
}

export type ModelReplace<T extends ModelBase> = Omit<
  T,
  "collectionId" | "collectionName" | "created" | "updated"
> &
  Partial<ModelBase>;

export type ModelCreate<T extends ModelBase> = Omit<ModelReplace<T>, "id"> & {
  id?: string;
};

export type ModelUpsert<T extends ModelBase> = Omit<ModelReplace<T>, "id">;

export type ModelUpdate<T extends ModelBase> = Partial<ModelUpsert<T>>;

export type Keys<T> = { [K in keyof T]: K extends symbol ? never : K }[keyof T];

export interface FindOptions<T extends ModelBase> {
  select?: Keys<T>[];
  where?: { [P in keyof T]?: string | number | Date };
  orderBy?: (Keys<T> | ` + "`-${Keys<T>}`" + `)[];
  filter?: string;
  fields?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}
`;

const sb = [base];

const res = await fetch('http://127.0.0.1:8090/api/schema');
// console.debug('res', res);
const models: typeof _models = await res.json();
// console.debug('models', models);
await writeFile("_models.ts", `/* generated : ${new Date()} */\n\nexport const _models = ${stringify(models, null, 2)};`);

for (const model of models) {
  if (model.name.startsWith('_')) continue;

  let name = model.name;
  name = name.substring(0, name.length - 1);

  if (name === "categorie") name = "category";

  const interfaceName = "_" + firstUpper(name) + "Model";

  sb.push(
    `export interface ${interfaceName} extends ${
      model.type === "auth" ? "AuthModelBase" : "ModelBase"
    } {`,
  );
  for (const prop of model.fields) {
    try {
      if (prop.name === 'created') continue;
      if (prop.name === 'updated') continue;
      let type = {
        json: "any",
        text: "string",
        file: "File|Blob|string",
        number: "number",
        editor: "string",
        date: "Date|string",
        autodate: "Date|string",
        bool: "boolean",
        email: "string",
        password: "string",
      }[prop.type];
      if (!type) {
        if (prop.type === "select") {
          type = '""|' + (prop as any).values.map((v: string) => `"${v}"`).join("|");
        } else if (prop.type === "relation") {
          type = (prop as any).maxSelect === 1 ? "string" : "string[]";
        } else {
          throw new Error("type unknown");
        }
      }
      if (prop.required) {
        sb.push(`    ${prop.name}: ${type};`);
      } else {
        sb.push(`    ${prop.name}?: ${type};`);
      }
    } catch (error) {
      console.error("prop", model.name, prop.name, prop.type, error, prop);
    }
  }
  sb.push(`}`);
  sb.push(``);
}

const result = sb.join("\n");
await writeFile("_models.generated.ts", result);
