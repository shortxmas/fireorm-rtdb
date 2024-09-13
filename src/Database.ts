import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
}

export class Database {
  private db;
  private static modelsRegistry = new Map<string, any>();

  constructor(config: FirebaseConfig) {
    const app = initializeApp(config);
    this.db = getDatabase(app);
  }

  static registerModel(path: string, constructor: any) {
    this.modelsRegistry.set(constructor.name, path);
  }

  async createData<T extends { constructor: Function }>(
    model: T
  ): Promise<void> {
    const modelClass = model.constructor;
    const modelPath = Database.modelsRegistry.get(modelClass.name);

    if (!modelPath) {
      throw new Error(`Model is not registered with a @Model decorator.`);
    }

    const fields = (modelClass as any)._fields;
    const data: any = {};

    for (const field of fields) {
      data[field] = (model as any)[field];
    }

    const dbRef = ref(this.db, `${modelPath}/${data.name}`);
    try {
      await set(dbRef, data);
      console.log("Data successfully written!");
    } catch (error) {
      console.error("Error writing data:", error);
    }
  }
}
