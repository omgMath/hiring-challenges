# Report

## Bootstrap
1. Install Kafka: https://kafka.apache.org/quickstart
1. Short read about `kafka`, as I had no prior experience with it.
    - There were some similarities to the `node` event listeners.
1. Set up `git`, `nodejs` and `TypeScript` environment.
    - Made sense to use `JavaScript` to process data delivered in `JavaScriptObjectNotation`.
    - The non-blocking nature of `node` seemed to be an advantage in processing events. 
    - `Typescript` for type safety.
1. Retrieve data from http://tx.tamedia.ch.s3.amazonaws.com/challenge/data/stream.jsonl.gz
1. Select a `Kafka` library: https://github.com/tulios/kafkajs
    - I prevered this one over https://github.com/SOHU-Co/kafka-node, since they have comparable GitHub stars, but the latter had its last commit 7 months ago.

## Implementation phase
### What did I do and why?
- Definition of fundamential interfaces.
- Abstraction for logger, some set utils.
- Implementation of [KafkaConsumer](../src/kafka/Consumer.ts), for which different handlers can be registered (e.g. one to print out the data, one to count the unique user ids).
- Implementation of two handlers, the [StdoutHandler](../src/handlers/StdoutHandler.ts) to print out the data, the [UniqCounter](../src/handlers/UniqCounter.ts) to count the uniq values.
- Initial configuration support within the [main](../src/main.ts).

### Performance metric
I was not able to find a "de-facto-standart" library to measure FPS in `node`, the closest search result I found was [this one](https://nodejs.org/es/docs/guides/simple-profiling/).

Running `npm run profile` generates a output of the form `isolate-0xnnnnnnnnnnnn-v8.log`, which then can be processed with `node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt`.

You can find an example of the output [here](../docs/Profiling_Example.txt).

#### Future performance improvements
The output above gives a first clue on where to improve performance:

```
[C++ entry points]:
   ticks    cpp   total   name
  84403   96.0%   55.7%  v8::internal::Builtin_JsonParse[...]
```

Most of the compution time is currently wasted by parsing the recived JSON strings into objects. Thus, one of the next steps would be to parse the required key/values out of the string, instead of parsing the whole object.

There are various pitfalls to keep in mind:
- `ts` and `uid` don't only occur top-level, i.e. the regex `(?:"uid":")(.*?)(?:")` will not work in all cases.
- Counting `{` and `}` is dangerous, as they also can occur within string values, not only as object-start-indicator.

### When to output the data
The requirements/assumptions were the following:
- *you want to display the results as soon as possible*
- *You can assume that 99.9% of the frames arrive with a maximum latency of 5 seconds*

Thus, within the [UniqCounter.ts](../src/handlers/UniqCounter.ts), we make use of the `JavaScript` `setTimeout` and `clearTimeout`, to flush the data, as soon as 5 seconds with no updates passed - 99.9% seemed to be good enough at start.

### Estimated error in counting
Each minute, I count about 65k data items, with 50k unique uids, thus the uniqueness-ratio is around 0.78.
Given that we miss about 500 data items (i.e. 0.01%), I expect the error in counting to be around (-110).

### Ingestion of historical data
I implemented no tooling/testing but I think this should be possible by piping the historical data into the kafka producer.

### Data structures

#### Counting
Sets by definition don't contain duplicates. Thus it seemed reasonable to use sets as a foundation for counting the `uid`s.

#### Output
The data per-minute structure we output looks like this:
```
{start: "11.07.2016, 15:51", duration: 60000, count: 43659}
```

The data structure is simple and could be directly consumed by an API/Charting library to display the values.

## Next steps
I did not finish all the tasks. The following would have been my next steps:
- Implement a *Producer*-equivalent of the (Consumer)[../src/kafka/Consumer.ts], use this Producer to output the results into a new topic.
- Think about how to optimize the JSON parsing - without falling into the pitfalls mentioned above.
- Think and write about scaling.
- Handle edge cases: Leap years.
- Include command-line-options or create a config.json, where all the important configuration can be done.