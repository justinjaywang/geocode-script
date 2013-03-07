// modules
var fs = require("fs"),
  geocoder = require('geocoder'),
  inputFile = 'sample-data.csv',
  outputFile = 'sample-data-output.json';

// start writing to output file
fs.writeFile(outputFile, '');

// read csv file and write to json file
fs.readFile(inputFile, 'utf-8', function(err, data) {
  if (err) throw err;
  
  // convert csv to arrays
  directorArr = csv2array(data);
  labelArr = directorArr[0];
  directorArr.splice(0, 1);
  
  // convert arrays to objects
  directorObjArr = array2obj(labelArr, directorArr);

  // add lat and lng to each object and write to output file
  directorObjArr.forEach(function(directorObj) {
    addLocation(directorObj, directorObjArr.length);
  })
});

// functions
function csv2array(data) {
  // inputs csv data and returns an array (length equal to number of lines) of director arrays
  lines = data.toString().split('\n');
  // populate directors array
  directorArr = [];
  lines.forEach(function (line) {
    if (line.length!=0) {
      fields = line.split(';');
      for (i=0; i<fields.length; i++) {
        fields[i] =  fields[i].trim();
      }
      directorArr.push(fields);
    }
  })
  return directorArr;
}

function array2obj(labels, directors) {
  // inputs directors array and returns an array of director objects
  directorObjArr = [];
  directors.forEach(function(director) {
    directorObj = {};
    for (j=0; j<labels.length; j++) {
      directorObj[labels[j]] = director[j];
    }
    directorObjArr.push(directorObj);
  });
  return directorObjArr;
}

function addLocation(directorObj, n) {
  // inputs directorObj and length of directorObjArr
  // append lat, lng to director object and writes to output file
  directorsObjArr = []; // instantiate new directors object array
  geocoder.geocode(directorObj['address'], function(err, data) {
    if (err) {
      console.log('Geocoding failed for director ' + directorObj['name']);
      lat = lng = '';
    } else {
      location = data.results[0].geometry.location;
      lat = location.lat;
      lng = location.lng;
    }
    // set lat, lng from query as keys in directorObj, then push to array
    directorObj['lat'] = lat;
    directorObj['lng'] = lng;
    directorsObjArr.push(directorObj);
    if (directorsObjArr.length==n) { 
      // last director has been added, write to output file
      fs.writeFile(outputFile, JSON.stringify(directorObjArr));
    }
  });
}
