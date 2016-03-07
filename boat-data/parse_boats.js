var jsonfile = require('jsonfile')

var data1 = require('./boats.json');
var data2 = require('./boats2.json');
var data3 = require('./boats3.json');
var data4 = require('./boats4.json');


// needs photourl and title
data1 = data1.results.collection1.map(function(boat) {
	return {
		photoUrl: boat.picture.src,
		title: boat.name
	}
})

data2 = data2.collection1.map(function(boat) {
	return {
		photoUrl: boat.picture.src,
		title: boat.name
	}
})
data3 = data3.collection1.map(function(boat) {
	return {
		photoUrl: boat.picture.src,
		title: boat.name
	}
})

data4 = data4.collection1.map(function(boat) {
	return {
		photoUrl: boat.picture.src,
		title: boat.name
	}
})

var allData = data1.concat(data2.concat(data3.concat(data4)));

console.log(allData.length);

jsonfile.writeFile('./all_boats.json', allData, function (err) {
  console.error(err)
})


