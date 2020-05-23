import * as _ from "lodash";
import cron from "node-cron";

import {IUniqCounterConfig, IHandler, ECountInterval} from "./@def";
import {IDictionary} from "../core/@def";
import {log} from "../core/Logger";


export class UniqCounter implements IHandler {
    private ids: IDictionary<Set<any>> = {};

    constructor(private config: IUniqCounterConfig) {
        _.forEach(config.intervals, interval => {
            this.ids[interval] = new Set();
            const flush = () => {
                try {
                    const size = this.ids[interval].size;
                    this.ids[interval] = new Set();
                    log.debug(">>>>>>>>>>>>>" + size + interval);
                }
                catch (err) {
                    log.error("UniqCounter - Error flushing to console: " + err);
                }
            };
            const cronExp = this.getCronExp(interval);
            cron.schedule(cronExp, () => flush());
        });
    }

    public async handle(payload: any): Promise<void> {
        _.forEach(this.config.intervals, interval => {
            this.ids[interval].add(payload[this.config.key]);
        });
    }

    private getCronExp(interval: ECountInterval): string {
        switch (interval) {
            case ECountInterval.perMinute: return "* * * * *";
            case ECountInterval.perDay: return "0 0 * * *";
            case ECountInterval.perWeek: return "0 0 * * 0";
            case ECountInterval.perYear: return "0 0 31 12 *";
            default: return "* * * * *"; // per minute
        }
    }
}