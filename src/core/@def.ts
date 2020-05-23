import {IKafkaConsumerTopic} from "../kafka/@def";

export interface IDictionary<T> {
    [index: string]: T;
}

export interface ILogger {
    info(msg: any): void;
    debug(msg: any): void;
    warn(msg: any): void;
    error(msg: any): void;
}

export enum EKafkaConsumerType {
    stdout = "stdout",
    countUniques = "count-uniques"
}

export interface IHandlerConfig<T = any, U = any> {
    id: string;
    type: T;
    config: U;
}

export interface IConfig {
    kafka: {
        brokers: string[];
        groupId: string;
        consumers: IHandlerConfig<EKafkaConsumerType>[];
        topics: IKafkaConsumerTopic[];
    }
}