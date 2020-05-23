import {ILogger} from "./@def";

export class Logger implements ILogger {
    private static _instance: ILogger;
    private delegate = console;

    public static instance() {
        if (!Logger._instance) {
            Logger._instance = new Logger();
        }
        return Logger._instance;
    }

    public info(msg: string) {
        this.delegate.info(msg);
    }

    public debug(msg: string) {
        this.delegate.debug(msg);
    }

    public warn(msg: string) {
        this.delegate.warn(msg);
    }

    public error(msg: string) {
        this.delegate.error(msg);
    }
}

export const log = Logger.instance();