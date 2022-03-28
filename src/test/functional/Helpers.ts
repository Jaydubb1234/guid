import * as fs from "fs";

export class Helpers {
    public static readonly EXAMPLE_DATA_PATH = "./src/test/mocks/exampleData/";

    public static getExampleJsonDataFile(fileName: string): object {
        const fullPath: string = Helpers.EXAMPLE_DATA_PATH + fileName;

        return JSON.parse(fs.readFileSync(fullPath, "utf8"));
    }
}
