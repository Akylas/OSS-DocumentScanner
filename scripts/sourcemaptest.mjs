import { readFileSync } from "fs";
import { SourceMapConsumer } from "source-map";

const rawSourceMap= JSON.parse(readFileSync('/home/mguillon/dev/nativescript/com.akylas.documentscanner/build/documentscanner/android/app/src/main/assets/app/16.js.map'))
const whatever = await SourceMapConsumer.with(rawSourceMap, null, consumer => {

    console.log(consumer.sources);
    // [ 'http://example.com/www/js/one.js',
    //   'http://example.com/www/js/two.js' ]
  
    console.log('test1', consumer.originalPositionFor({
      line: 90,
      column: 56
    }));
    console.log('test2', consumer.originalPositionFor({
      line: 142,
      column: 103
    }));
  });