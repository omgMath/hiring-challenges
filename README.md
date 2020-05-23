# Data Engineer Challenge
## Setup
- Make sure you have a current version of `nodejs` and `npm` installed. I used `node v12.16.3` and `npm 6.14.4`.
- Clone the repository: `git clone https://github.com/omgMath/hiring-challenges.git`
- `cd hiring-challenges`
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
