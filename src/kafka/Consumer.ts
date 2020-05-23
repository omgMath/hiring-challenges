import * as _ from "lodash";
import {Kafka, Consumer} from "kafkajs";

import {IKafkaConsumerConfig} from "./@def";
import {IDictionary} from "../core/@def";
import {log} from "../core/Logger";
import {IHandler} from "../handlers/@def";


export class KafkaConsumer {
    private handlers: IDictionary<IHandler> = {};
    private consumer: Consumer;

    public async init(config: IKafkaConsumerConfig) {
        if (!config.kafka && !config.brokers) {
            throw new Error("KafkaConsumer - kafka instance or brokers required");
        }
        const kafka = config.kafka ?? new Kafka({
            brokers: config.brokers
        });
        this.consumer = kafka.consumer({groupId: config.groupId});
        await this.consumer.connect();
        for (const topicConfig of config.topics) {
            await this.consumer.subscribe(topicConfig);
        }
    }

    public registerHandler(id: string, handler: IHandler) {
        this.handlers[id] = handler;
    }

    public unregisterHandler(id: string) {
        delete this.handlers[id];
    }

    public async run() {
        await this.consumer.run({
            eachMessage: async ({message}) => {
                const ids = _.keys(this.handlers);
                try {
                    const parsed = JSON.parse(message.value.toString());
                    // Optimization opportunity: JSON.parse takes too long - extract ts and uid keys manually
                    if (parsed) {
                        for (const id of ids) {
                            try {
                                this.handlers[id].handle(parsed);
                            }
                            catch (err) {
                                log.error("KafkaConsumer - Error executing handler with id: " + id);
                            }
                        }
                    }
                }
                catch (err) {
                    log.error("KfakaConsumer - Received Invalid JSON");
                }
            }
        });
    }

    public async close() {
        const ids = _.keys(this.handlers);
        for (const id of ids) {
            this.handlers[id].flush();
        }
        this.consumer.disconnect();
    }
}