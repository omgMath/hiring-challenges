import {IHandlerConfig} from "../core/@def";

export interface IHandler {
    handle(payload: any): Promise<void>;
    flush(): Promise<void>;
}

export interface IHandlerFactory {
    create(config: IHandlerConfig): IHandler;
}

export enum ECountInterval {
    perMinute = "perMinute",
    perDay = "perDay",
    perWeek = "perWeek",
    perYear = "perYear"
}

export interface IUniqCounterConfig {
    key: string;
    intervals: ECountInterval[];
    timestampKey: string;
    outputs: string[];
}