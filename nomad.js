/* tank.js - Controls tank data viewing system. */

// Global Variables
var lastUpdateDate = new Date();

var maxAliveTimeoutMS = 300000;

// Update IP address separately from everything else
function updateAddress() {
	var public_key = 'QGq9E8Yy1wc312pmoL0Z';

	var ipAddress;
	var date;

	// JSONP request
	var jsonData = $.ajax({
		url: 'https://data.sparkfun.com/output/' + public_key + '.json',
		data: {
			page: 1
		},
		dataType: 'jsonp',
	}).done(function (results) {
		console.log(results);

		$.each(results, function (i, row) {
			if ( i == 0 ) {
				date = new Date(row.timestamp);
			}
			if ( i == 0 ) {
				document.getElementById("lastUpdatedLabel").innerHTML = "Data last received ";
				document.getElementById("ipAddressLabel").innerHTML = row.ip_address;
				document.getElementById("ipAddressDateLabel").innerHTML = new Date(row.timestamp);
				if ( new Date() - new Date(row.timestamp) < maxAliveTimeoutMS ) {
					document.getElementById("alive").style.color = 'YellowGreen';
				} else {
					document.getElementById("alive").style.color = 'red';
				}
			}
  	});
  });

	// recursive call to repeat this function
  setTimeout(updateAddress,30000);
}

// onload callback
function drawChart() {

  var public_key = '7JvKZEOq2NtrpnxaoXW1';

  var dataPage;
  var maxAge;

  if ( document.getElementById("fiveMin").checked ) {
    dataPage = {page: 1};
    maxAge = 5*60*1000;
  } else if ( document.getElementById("fifteenMin").checked ) {
    dataPage = {page: 1};
    maxAge = 15*60*1000;
  } else if ( document.getElementById("oneHr").checked ) {
    dataPage = {page: 1};
    maxAge = 60*60*1000;
  } else if ( document.getElementById("oneDay").checked ) {
    dataPage = {page: -1};
    maxAge = 60*60*24*1000;
  } else if ( document.getElementById("oneWeek").checked ) {
    dataPage = {page: -1};
    maxAge = 60*60*24*7*1000;
  } else if ( document.getElementById("oneMonth").checked ) {
    dataPage = {page: -1};
    maxAge = 60*60*24*7*30*1000;
  } else if ( document.getElementById("allPages").checked ) {
    dataPage = {page: -1};
    maxAge = Math.abs(new Date());
  }

	// JSONP request
	var jsonData = $.ajax({
		url: 'https://data.sparkfun.com/output/' + public_key + '.json',
		data: dataPage,
		dataType: 'jsonp',
	}).done(function (results) {

		var dataTemp     = new google.visualization.DataTable();
		var dataSalinity = new google.visualization.DataTable();
		var dataOxygen   = new google.visualization.DataTable();
		var dataPH       = new google.visualization.DataTable();

		dataTemp.addColumn('datetime', 'Time');
		dataTemp.addColumn('number', 'Water Temperature');
		dataSalinity.addColumn('datetime', 'Time');
		dataSalinity.addColumn('number', 'Salinity');
		dataOxygen.addColumn('datetime', 'Time');
		dataOxygen.addColumn('number', 'Dissolved Oxygen');
		dataPH.addColumn('datetime', 'Time');
		dataPH.addColumn('number', 'pH');

		var mostRecent;

		$.each(results, function (i, row) {
			if ( i == 0 ) {
				mostRecent = new Date(row.timestamp);
			}
			if ( Math.abs(mostRecent - new Date(row.timestamp)) < maxAge ) {
				dataTemp.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.temperature)
					]);
				dataSalinity.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.salinity)
					]);
				dataOxygen.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.oxygen)
					]);
				dataPH.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.pH)
					]);
			}
			if ( i == 0 ) {
				document.getElementById("waterTempLabel").innerHTML = row.temperature;
				document.getElementById("salinityLabel").innerHTML = row.salinity;
				document.getElementById("oxygenLabel").innerHTML = row.oxygen;
				document.getElementById("pHLabel").innerHTML = row.pH;
				lastUpdateDate = new Date(row.timestamp);             
			}
  	});

	var chartTemp     = new google.visualization.LineChart($('#chartTemp').get(0));
	var chartSalinity = new google.visualization.LineChart($('#chartSalinity').get(0));
	var chartOxygen   = new google.visualization.LineChart($('#chartOxygen').get(0));
	var chartPH       = new google.visualization.LineChart($('#chartPH').get(0));

	chartTemp.draw(dataTemp, {
		title: 'Water Temperature',
		vAxis: {
			'title': 'Temperature (deg C)'
		},  
		'height': 300,
		colors: ['#ff0000']
	});
	chartSalinity.draw(dataSalinity, {
		title: 'Salinity',
		vAxis: {
			'title': 'Salinity (g/kg)'
		},  
		'height': 300, 
		colors: ['#00ff00']
	});
	chartOxygen.draw(dataOxygen, {
		title: 'Dissolved Oxygen',
		vAxis: {
			'title': 'Dissolved Oxygen (mL/L)'
		},  
		'height': 300,
		colors: ['#ffff00']
	});
	chartPH.draw(dataPH, {
		title: 'pH',
		vAxis: {
			'title': 'pH'
		},  
		'height': 300,
		colors: ['#2222ff']
	});

	});

	// recursive call to repeat this function
  setTimeout(drawChart,10000);
}

function timerUpdate() {
  var elapsed = Math.floor(Math.abs(new Date() - lastUpdateDate)/1000);
  if ( elapsed < 60 ) {
    document.getElementById("timeSinceUpdate").innerHTML = '<span class="label label-success"><i class="fa fa-clock-o fa-lg"></i> '+elapsed+' seconds ago</span>';
  } else if ( elapsed < 3600 ) {
    document.getElementById("timeSinceUpdate").innerHTML = '<span class="label label-danger"><i class="fa fa-clock-o fa-lg"></i> '+Math.floor(elapsed/60)+' minutes ago</span>';
  } else if ( elapsed < 84600) {
    document.getElementById("timeSinceUpdate").innerHTML = '<span class="label label-danger"><i class="fa fa-clock-o fa-lg"></i> '+Math.floor(elapsed/3600)+' hours ago</span>';
  } else {
    document.getElementById("timeSinceUpdate").innerHTML = '<span class="label label-danger"><i class="fa fa-clock-o fa-lg"></i> '+Math.floor(elapsed/86400)+' days ago</span>';
  }

  // recursive call to repeat this function
  setTimeout(timerUpdate,1000);
}

function cameraImageUpdate() {
	document.getElementById("cameraImage").src = "http://nomadcam.catalinasearanch.com/camera1/latest.jpg?" + new Date().getTime();

	// recursive call to repeat this function
  setTimeout(cameraImageUpdate,30000);
}

// load chart lib
google.load('visualization', '1', {
  packages: ['corechart']
});

// grab IP on start
updateAddress();

// Start timer update
timerUpdate();

// Start loading camera images
cameraImageUpdate();

// call drawChart once google charts is loaded
google.setOnLoadCallback(drawChart);

