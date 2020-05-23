import {Kafka} from "kafkajs";

export interface IKafkaConsumerTopic {
    topic: string;
    fromBeginning: boolean;
}

export interface IKafkaConsumerConfig {
    groupId: string;
    topics: IKafkaConsumerTopic[];
    // Either provide kafka instance or brokers
    kafka?: Kafka;
    brokers?: string[];
}
