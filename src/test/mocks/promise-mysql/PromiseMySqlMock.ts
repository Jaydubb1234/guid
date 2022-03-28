import * as fs from "fs";
import * as YAML from "yaml";
import * as assert from "assert";
import * as mysql from "promise-mysql";
import {Connection, ConnectionConfig} from "promise-mysql";
import {Logger} from "../../../main/util/Logger";

export class PromiseMySqlMock {
    private static readonly MYSQL_MOCK_PATH: string = "./src/test/mocks/promise-mysql";

    public format: (sql: string, values: any[]) => {} = mysql.format;
    public mockEndConnection: any = Function.prototype;

    private mockData: any = {};

    public constructor(
        mappingFile: string,
        private expectedConnectionConfig: ConnectionConfig,
        private logger: Logger,
    ) {
        this.loadMockData(mappingFile);
    }

    public async createConnection(connectionConfig: ConnectionConfig): Promise<Connection> {
        assert.deepStrictEqual(connectionConfig, this.expectedConnectionConfig);

        return this.getMockConnection();
    }

    private loadMockData(mappingFile: string): void {
        const mappingFilePath: string = `${PromiseMySqlMock.MYSQL_MOCK_PATH}/mappings/${mappingFile}`;
        const fileContents: string = fs.readFileSync(mappingFilePath, "utf-8");
        const data: Array<{ query: string, dataFile: string }> = YAML.parse(fileContents);

        for (const record of data) {
            this.insertIntoMockDataObject(record);
        }
    }

    private insertIntoMockDataObject(record: { query: string, dataFile: string }): void {
        let {query = ""} = record;
        const dataFilePath: string = `./testData/${record.dataFile}`;
        if (query) {
            query = this.trimSQL(query);
        }
        this.mockData[query] = require(dataFilePath).data;
    }

    private getMockConnection(): any {
        return {
            end: this.mockEndConnection,
            query: async (args): Promise<any> => {
                let {sql} = args;
                sql = this.trimSQL(sql);
                const mockData: any = this.mockData[sql];
                if (mockData === undefined) {
                    const message: string = `PromiseMySqlMock ERROR: No mock data found for the following query:\n${sql}`;

                    this.logger.error(message);

                    throw new Error(message);
                }

                return this.mockData[sql];
            },
        };
    }

    private trimSQL(sql: string): string {
        return sql
            .replace( /  +/g, " " )
            .replace( /\t/g, " " )
            .replace( /\n/g, " " )
            .replace(/\s\s+/g, " ")
            .trim();
    }
}
