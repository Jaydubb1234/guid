/* tslint:disable no-console */

import * as sprintf from "sprintf";

export class Logger {
    public static readonly LEVEL_INFO: number = 0x8;
    public static readonly LEVEL_WARNING: number = 0x4;
    public static readonly LEVEL_ERROR: number = 0x2;
    public static readonly LEVEL_CRITICAL: number = 0x1;

    public static readonly INFO: string = "INFO";
    public static readonly WARNING: string = "WARNING";
    public static readonly ERROR: string = "ERROR";
    public static readonly CRITICAL: string = "CRITICAL";

    private static readonly MESSAGE_TEMPLATE = "[%s, %s]: %s";

    private logInfo: boolean;
    private logWarning: boolean;
    private logError: boolean;
    private logCritical: boolean;

    public constructor(logLevel: number, private applicationName: string) {
        this.logInfo = Boolean(logLevel & Logger.LEVEL_INFO);
        this.logWarning = Boolean(logLevel & Logger.LEVEL_WARNING);
        this.logError = Boolean(logLevel & Logger.LEVEL_ERROR);
        this.logCritical = Boolean(logLevel & Logger.LEVEL_CRITICAL);
    }

    public info(message: string) {
        if (this.logInfo) {
            console.log(sprintf(Logger.MESSAGE_TEMPLATE, Logger.INFO, this.applicationName, message));
        }
    }

    public warning(message: string) {
        if (this.logWarning) {
            console.warn(sprintf(Logger.MESSAGE_TEMPLATE, Logger.WARNING, this.applicationName, message));
        }
    }

    public error(message: string) {
        if (this.logError) {
            console.error(sprintf(Logger.MESSAGE_TEMPLATE, Logger.ERROR, this.applicationName, message));
        }
    }

    public critical(message: string) {
        if (this.logCritical) {
            console.error(sprintf(Logger.MESSAGE_TEMPLATE, Logger.CRITICAL, this.applicationName, message));
        }
    }
}
