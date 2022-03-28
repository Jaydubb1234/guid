import { ConnectionConfig, Connection } from "promise-mysql";
import { ChainableError } from "../ChainableError";
import {Logger} from "../Logger";

export class MySqlConnectionManager {
    private static readonly QUERY_TIMEOUT: number = 25000;
    private connection: Connection = null;

    public constructor(
        private mysql: any,
        private config: ConnectionConfig,
        private logger: Logger,
    ) { }

    public async runQuery(sql: string, ...params: any[]): Promise<any> {
        const connection: Connection = await this.acquireConnection();
        try {
            const formattedSql: string = this.mysql.format(sql, params);
            this.logger.info(`Query : ${formattedSql}`);
            return connection.query({sql: formattedSql, timeout: MySqlConnectionManager.QUERY_TIMEOUT});
        } catch (e) {
            this.logger.error(`Error : ${JSON.stringify(e)}`);
            throw new ChainableError(`An error occurred when executing a query.`, e);
        }
    }

    public async closeConnection(): Promise<string> {
        try {
            if (this.connection) {
                await this.connection.end();
            }

            return;
        } catch (e) {
            this.logger.error(`Error : ${JSON.stringify(e)}`);
            throw new ChainableError(`An error occurred when attempting to terminate the MySQL connection: ${e}`);
        }
    }

    private async acquireConnection(): Promise<Connection> {
        try {
            if (this.connection === null) {
                this.connection = await this.mysql.createConnection(this.config);
            }

            return this.connection;
        } catch (e) {
            this.logger.error(`Error : ${JSON.stringify(e)}`);
            throw new ChainableError(`Unable to acquire MySQL connection.`, e);
        }
    }
}
