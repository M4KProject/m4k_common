/// <reference types="@types/node" />

import { _models } from './_models.ts';
import { writeFile } from 'fs/promises';

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
  orderBy?: (Keys<T> | ` + '`-${Keys<T>}`' + `)[];
  filter?: string;
  fields?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}
`;

const sb = [base];

for (const model of _models) {
    const interfaceName = '_' + model.name[0].toUpperCase() + model.name.substring(1, model.name.length-1) + 'Model';
    sb.push(`export interface ${interfaceName} extends ${model.type === "auth" ? 'AuthModelBase' : 'ModelBase'} {`);
    for (const prop of model.fields) {
        try {
            let type = {
                json: 'any',
                text: 'string',
                file: 'File|Blob|string',
                number: 'number',
                editor: 'string',
                date: 'Date|string',
                bool: 'boolean',
            }[prop.type];
            if (!type) {
                const options = (prop as any).options || {};
                if (prop.type === 'select') {
                    type = '""|' + options.values.map((v: string) => `"${v}"`).join('|');
                }
                else if (prop.type === 'relation') {
                    type = options.maxSelect === 1 ? 'string' : 'string[]';
                }
                else {
                    throw new Error('type unknown');
                }
            }
            if (prop.required) {
                sb.push(`    ${prop.name}: ${type};`);
            }
            else {
                sb.push(`    ${prop.name}?: ${type};`);
            }
        }
        catch(err) {
            console.error('prop', model.name, prop.name);
        }
    }
    sb.push(`}`);
    sb.push(``);
}

const result = sb.join('\n');
writeFile('_models.generated.ts', result);