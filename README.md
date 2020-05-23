# Data Engineer Challenge
## Setup
- Make sure you have a current version of nodejs and npm installed
- Clone the repository and run the following commands
- `npm install`
- `npm run build`

## Run the code
Make sure that `zookeeper`, the `Kafka` server, and the `Kafka` producer are running.

### Reference setup
As a reference, my local folder structure looks like this:

```
.
├── data
├── data-engineer-challenge (this repo)
└── kafka_2.12-2.5.0
    ├── bin
    └── ...
```

Within `kafka_2.12-2.5.0` you can run:
- `bin/zookeeper-server-start.sh config/zookeeper.properties`
- `bin/kafka-server-start.sh config/server.properties`
- `zcat ./data/stream.jsonl.gz | ./kafka_2.12-2.5.0/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic mytopic`

### Start the code
- `npm start`
