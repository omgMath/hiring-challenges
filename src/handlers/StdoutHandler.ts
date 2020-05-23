import {IHandler} from "./@def";
import {log} from "../core/Logger";


export class StdoutHandler implements IHandler {

    public async handle(payload: any): Promise<void> {
        log.info(payload);
    }

    public async flush() {
        // NOP
    }
}