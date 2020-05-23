import {IHandlerFactory} from "./@def";
import {UniqCounter} from "./UniqCounter";
import {StdoutHandler} from "./StdoutHandler";
import {IHandlerConfig, EKafkaConsumerType} from "../core/@def";

export class ConsumerFactory implements IHandlerFactory {
    public create({type, config}: IHandlerConfig<EKafkaConsumerType>) {
        switch (type) {
            case EKafkaConsumerType.stdout: return new StdoutHandler();
            case EKafkaConsumerType.countUniques: return new UniqCounter(config);
            default: throw new Error("ConsumerFactory - Unsupported type: " + type);
        }
    }
}