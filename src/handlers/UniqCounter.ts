import * as _ from "lodash";
import {format} from "date-fns";

import {IUniqCounterConfig, IHandler, ECountInterval} from "./@def";
import {IDictionary} from "../core/@def";


interface IUniqeCounts {
    start: string;
    duration: number; // ms
    uniques: Set<any>;
    cancelTimeout: NodeJS.Timeout;
}

interface IDataProvider {
    (ts: number): Omit<IUniqeCounts, "uniques" | "cancelTimeout">;
}

export interface ICountDict extends IDictionary<IUniqeCounts> {
    // key is the start time of the given interval
}

export class UniqCounter implements IHandler {
    private counts: IDictionary<ICountDict> = {};
    private dataProviders: IDictionary<IDataProvider> = {};

    constructor(private config: IUniqCounterConfig) {
        _.forEach(config.intervals, interval => {
            this.counts[interval] = {};
            this.dataProviders[interval] = this.getDataProvider(interval);
        });
    }

    public async handle(payload: any): Promise<void> {
        const id = payload[this.config.key];
        const ts = payload[this.config.timestampKey];
        _.forEach(this.config.intervals, interval => {
            const {start, duration} = this.dataProviders[interval](ts);
            const current = this.counts[interval][start] || {start: null, duration: null, uniques: new Set(), cancelTimeout: null};
            if (!current.start) {
                current.start = start;
                current.duration = duration;
            }
            current.uniques.add(id);
            if (current.cancelTimeout) {
                clearTimeout(current.cancelTimeout);
            }
            current.cancelTimeout = setTimeout(() => this.flush(interval, start), 5000);
            this.counts[interval][start] = current;
        });
    }

    public async flush(interval?: ECountInterval, start?: string) {
        if (interval && start) {
            const data = this.counts[interval][start];
            console.log({start: data.start, duration: data.duration, count: data.uniques.size});
            delete this.counts[interval][start];
        }
        else {
            console.log("Not implemented");
        }

    }

    public getDataProvider(interval: ECountInterval): IDataProvider {
        const minute = 1000 * 60;
        const hour = 60 * minute;
        const day = 24 * hour;
        const week = day * 7;
        switch (interval) {
            case ECountInterval.perMinute: {
                return (ts: number) => {
                    return {
                        start: format(ts * 1000, "dd.MM.yyyy, HH:mm"),
                        duration: minute
                    };
                };
            }
            case ECountInterval.perDay: {
                return (ts: number) => {
                    return {
                        start: format(ts * 1000, "dd.MM.yyyy"),
                        duration: day
                    };
                };
            }
            case ECountInterval.perWeek: {
                return (ts: number) => {
                    return {
                        start: format(ts * 1000, "W"),
                        duration: week
                    };
                };
            }
            case ECountInterval.perYear: {
                return (ts: number) => {
                    return {
                        start: format(ts * 1000, "yyyy"),
                        duration: day * 365 // FIXME: Edge case
                    };
                };
            }
            default: throw new Error("Invalid interval"); // per minute
        }
    }
}