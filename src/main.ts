import * as _ from "lodash";
import {Kafka} from "kafkajs";

import {IConfig, EKafkaConsumerType} from "./core/@def";
import {KafkaConsumer} from "./kafka/Consumer";
import {ConsumerFactory} from "./handlers/HandlerFactory";
import {IUniqCounterConfig, ECountInterval} from "./handlers/@def";

const config: IConfig = {
    "kafka": {
        "brokers": [
            "localhost:9092"
        ],
        "groupId": "user-stream",
        "consumers": [
            // {
            //     id: "stdout-handler",
            //     type: EKafkaConsumerType.stdout,
            //     config: {}
            // },
            {
                id: "uid-counter",
                type: EKafkaConsumerType.countUniques,
                config: {
                    key: "uid",
                    outputs: ["stdout"],
                    intervals: [ECountInterval.perMinute],
                    timestampKey: "ts"
                } as IUniqCounterConfig
            }
        ],
        "topics": [{topic: "mytopic", fromBeginning: true}]
    }
};

const run = async () => {
    const kafkaConfig = config.kafka;
    if (!kafkaConfig.brokers) {
        throw new Error("Error running script: No brokers configured");
    }
    const consumerFactory = new ConsumerFactory();
    const kafka = new Kafka({brokers: kafkaConfig.brokers});
    const consumer = new KafkaConsumer();
    await consumer.init({kafka, groupId: kafkaConfig.groupId, topics: kafkaConfig.topics});
    _.forEach(kafkaConfig.consumers, consumerConfig => {
        const handler = consumerFactory.create(consumerConfig);
        consumer.registerHandler(consumerConfig.id, handler);
    });
    consumer.run();
};

run().catch(console.error);