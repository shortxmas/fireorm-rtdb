import { Database } from "./Database";

export function Model(path: string) {
  return function (constructor: any) {
    Database.registerModel(path, constructor);
  };
}
