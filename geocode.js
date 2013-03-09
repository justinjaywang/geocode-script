// modules
var fs = require('fs'),
  geocoder = require('geocoder');

// customize name of address column
var addressColumn = 'Address';

// read from stdin
process.stdin.resume();
var size = fs.fstatSync(process.stdin.fd).size; // get buffer size
var response = fs.readSync(process.stdin.fd, size, 0); // fs.readSync(fd, buffer, offset)
process.stdin.pause();

// data is first item in reponse array
data = response[0];

// convert csv to arrays
markerArr = csv2array(data);
labelArr = markerArr[0];
markerArr.splice(0, 1);

// convert arrays to objects
markerObjArr = array2obj(labelArr, markerArr);

// add lat and lng to each object and write to output file
markerObjArr.forEach(function(markerObj) {
  addLocation(markerObj, markerObjArr.length);
})

// functions
function csv2array(data) {
  // inputs csv data and returns an array (length equal to number of lines) of marker arrays
  lines = data.toString().split('\n');
  // populate markers array
  markerArr = [];
  lines.forEach(function (line) {
    if (line.length!=0) {
      // fields = line.split(delimiter);
      fields = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      for (i=0; i<fields.length; i++) {
        fields[i] =  fields[i].replace(/"/g,''); // remove surrounding double quotes
      }
      markerArr.push(fields);
    }
  })
  return markerArr;
}

function array2obj(labels, markers) {
  // inputs markers array and returns an array of marker objects
  markerObjArr = [];
  markers.forEach(function(marker) {
    markerObj = {};
    for (j=0; j<labels.length; j++) {
      markerObj[labels[j]] = marker[j];
    }
    markerObjArr.push(markerObj);
  });
  return markerObjArr;
}

function addLocation(markerObj, n) {
  // inputs markerObj and length of markerObjArr
  // append lat, lng to marker object and writes to output file
  markersObjArr = []; // instantiate new markers object array
  geocoder.geocode(markerObj[addressColumn], function(err, data) {
    if (err) {
      console.log('Geocoding failed for marker ' + markerObj['name']);
      lat = lng = '';
    } else {
      location = data.results[0].geometry.location;
      lat = location.lat;
      lng = location.lng;
    }
    // set lat, lng from query as keys in markerObj, then push to array
    markerObj['lat'] = lat;
    markerObj['lng'] = lng;
    markersObjArr.push(markerObj);
    if (markersObjArr.length==n) { 
      // last marker has been added, write to output file
      process.stdout.write(JSON.stringify(markerObjArr,undefined,2));
      process.stdout.write("\n");
    }
  });
}
