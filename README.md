# Geocode Script
*This script geocodes a CSV file and converts the result to JSON.*

## Documentation

View the documentation at my learnings repo.

* [2013-03-06](https://github.com/justinjaywang/learnings/blob/master/2013-03-06.md)
* [2013-03-08](https://github.com/justinjaywang/learnings/blob/master/2013-03-08.md)


## Use

### Test your installation

```
$ npm test
```

### Retrieve published CSV

```
$ sh curl2csv.sh
```

Eventually you'll need to modify the Spreadsheet key and CSV file name to which to write in `curl2csv.sh`.

### Geocode

Install the Geocoder package via `$ npm install` and run

```
node geocode.js < file.csv >! file.json
```

, where `file.csv` is the input file and `file.json` is the output file.