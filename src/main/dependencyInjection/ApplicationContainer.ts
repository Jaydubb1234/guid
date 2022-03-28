import * as fs from "fs";
import * as Ajv from "ajv";
import * as mysql from "promise-mysql";
import { ConnectionConfig } from "promise-mysql";
import * as moment from "moment";

import { Logger } from "../util/Logger";
import { MySqlConnectionManager } from "../util/connectionManager/MySqlConnectionManager";

import { MessengerController } from "../controller/MessengerController";
import { MessengerService } from "../service/MessengerService";
import { MessengerRepository } from "../repositories/MessengerRepository";

declare let process: any;

export class ApplicationContainer {
    public static getApplicationContainer(): ApplicationContainer {
        if (!ApplicationContainer.containerInstance) {
            ApplicationContainer.containerInstance = new ApplicationContainer();
        }

        return ApplicationContainer.containerInstance;
    }

    private static containerInstance: ApplicationContainer = null;

    private messengerController: MessengerController;
    private messengerService: MessengerService;
    private messengerRepository: MessengerRepository;

    private sqlReadConnectionManager: MySqlConnectionManager;
    private sqlWriteConnectionManager: MySqlConnectionManager;
    private mysql: any;
    private dbReadConnectionParameters: ConnectionConfig;
    private dbWriteConnectionParameters: ConnectionConfig;
    private logger: Logger;
    private fs: any;
    private ajv: any;
    private moment: any = null;

    public getMessengerController(): MessengerController {
        return this.messengerController;
    }

    public getLogger(): Logger {
        return this.logger;
    }

    public setLogger(logger): void {
        this.logger = logger;
    }

    public setMysql(mysqlModule: any): void {
        this.mysql = mysqlModule;
    }

    public setDbReadConnectionParameters(dbReadConnectionParameters: any): void {
        this.dbReadConnectionParameters = dbReadConnectionParameters;
    }

    public setDbWriteConnectionParameters(dbWriteConnectionParameters: any): void {
        this.dbWriteConnectionParameters = dbWriteConnectionParameters;
    }

    public setFs(filesystem: any): void {
        this.fs = filesystem;
    }

    public setSQLReadConnectionManager(sqlReadConnectionManager: MySqlConnectionManager): void {
        this.sqlReadConnectionManager = sqlReadConnectionManager;
    }

    public setSQLWriteConnectionManager(sqlWriteConnectionManager: MySqlConnectionManager): void {
        this.sqlWriteConnectionManager = sqlWriteConnectionManager;
    }

    public setMoment(momentValue: any) {
        this.moment = momentValue;
    }

    public composeDependencies(): void {
        this.ajv = new Ajv();
        if (!this.logger) {
            this.setUpLogger();
        }

        if (this.moment === null) {
            this.moment = moment;
        }

        if (!this.fs) {
            this.fs = fs;
        }

        if (!this.mysql) {
            this.mysql = mysql;
        }

        if (!this.dbReadConnectionParameters) {
            this.dbReadConnectionParameters = {
                database: process.env.dbName,
                host: process.env.dbHost,
                password: process.env.dbPassword,
                port: process.env.dbPort,
                user: process.env.dbUsername,
            };
        }

        if (!this.dbWriteConnectionParameters) {
            this.dbWriteConnectionParameters = {
                database: process.env.dbName,
                host: process.env.dbHostWrite,
                password: process.env.dbPassword,
                port: process.env.dbPortWrite,
                user: process.env.dbUsername,
            };
        }

        this.sqlReadConnectionManager = new MySqlConnectionManager(
            this.mysql,
            this.dbReadConnectionParameters,
            this.logger,
        );

        this.sqlWriteConnectionManager = new MySqlConnectionManager(
            this.mysql,
            this.dbWriteConnectionParameters,
            this.logger,
        );

        this.messengerRepository = new MessengerRepository(
            this.sqlReadConnectionManager,
            this.sqlWriteConnectionManager,
            this.logger,
        );
        this.messengerService = new MessengerService(
            this.messengerRepository,
            this.logger,
        );
        this.messengerController = new MessengerController(
            this.messengerService,
            this.sqlReadConnectionManager,
            this.sqlWriteConnectionManager,
            this.logger,
            this.ajv,
            this.moment,
        );
    }

    private setUpLogger(): void {
        const loggingApplicationName: string = process.env.loggingApplicationName;
        const loggingLevel: string = process.env.loggingLevel;

        let logSettings: number;

        if (loggingLevel === "INFO") {
            logSettings = Logger.LEVEL_INFO | Logger.LEVEL_WARNING | Logger.LEVEL_ERROR | Logger.LEVEL_CRITICAL;
        } else if (loggingLevel === "ERROR") {
            logSettings = Logger.LEVEL_ERROR | Logger.LEVEL_CRITICAL;
        }

        this.logger = new Logger(logSettings, loggingApplicationName);
    }
}
