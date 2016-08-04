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
		jsonp: 'callback',
		cache: true,
		dataType: 'jsonp',
	}).done(function (results) {
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

function test() {
	console.log("test");
}

// onload callback
function drawChart() {
	console.log("Drawing charts");
	shouldUpdate = false;

  var public_key = '0lgbR1rRQ9UgbE6LoLx1';

  var dataPage;
  var maxAge;

  if ( document.getElementById("fiveMin").checked ) {
    dataPage = {page: 1};
    maxAge = 5*60*1000;
    pointSize = 4;
  } else if ( document.getElementById("fifteenMin").checked ) {
    dataPage = {page: 1};
    maxAge = 15*60*1000;
    pointSize = 2;
  } else if ( document.getElementById("oneHr").checked ) {
    dataPage = {page: 1};
    maxAge = 60*60*1000;
    pointSize = 1;
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
		jsonp: 'callback',
		cache: true,
		dataType: 'jsonp',
	}).done(function (results) {

		// init data tables
		dataTemp     = new google.visualization.DataTable();
		dataSalinity = new google.visualization.DataTable();
		dataConductivity = new google.visualization.DataTable();
		dataOxygen   = new google.visualization.DataTable();
		dataPH       = new google.visualization.DataTable();

		dataTemp.addColumn('datetime', 'Time');
		dataTemp.addColumn('number', 'Water Temperature');
		dataSalinity.addColumn('datetime', 'Time');
		dataSalinity.addColumn('number', 'Salinity');
		dataConductivity.addColumn('datetime', 'Time');
		dataConductivity.addColumn('number', 'Conductivity');
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
					parseFloat(row.watertemp)
					]);
				dataSalinity.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.salinity)
					]);
				dataConductivity.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.conductivity)
					]);
				dataOxygen.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.dissolvedo2)
					]);
				dataPH.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.ph)
					]);
			}
			if ( i == 0 ) {
				document.getElementById("waterTempLabel").innerHTML = row.watertemp;
				document.getElementById("salinityLabel").innerHTML = row.salinity;
				document.getElementById("conductivityLabel").innerHTML = row.conductivity;
				document.getElementById("oxygenLabel").innerHTML = row.dissolvedo2;
				document.getElementById("pHLabel").innerHTML = row.ph;
				document.getElementById("currentLabel").innerHTML = row.current;
				document.getElementById("voltageLabel").innerHTML = row.voltage;
				document.getElementById("intTempLabel").innerHTML = row.internaltemp;
				document.getElementById("depthLabel").innerHTML = row.depth;
				lastUpdateDate = new Date(row.timestamp);             
			}
  	});

	chartTemp     = new google.visualization.LineChart($('#chartTemp').get(0));
	chartSalinity = new google.visualization.LineChart($('#chartSalinity').get(0));
	chartConductivity = new google.visualization.LineChart($('#chartConductivity').get(0));
	chartOxygen   = new google.visualization.LineChart($('#chartOxygen').get(0));
	chartPH       = new google.visualization.LineChart($('#chartPH').get(0));

	drawCharts();

	});

	shouldUpdate = true;
}

function drawCharts() {
	if ( shouldUpdate ) {
		chartTemp.draw(dataTemp, {
			title: 'Water Temperature',
			vAxis: {
				'title': 'Temperature (deg C)'
			},  
			'height': 300,
			colors: ['#ff0000'],
			pointSize: pointSize
		});
		chartSalinity.draw(dataSalinity, {
			title: 'Salinity',
			vAxis: {
				'title': 'Salinity (g/kg)'
			},  
			'height': 300, 
			colors: ['#00ff00'],
			pointSize: pointSize
		});
		chartConductivity.draw(dataConductivity, {
			title: 'Conductivity',
			vAxis: {
				'title': 'Conductivity (S/m)'
			},  
			'height': 300, 
			colors: ['#0000ff'],
			pointSize: pointSize
		});
		chartOxygen.draw(dataOxygen, {
			title: 'Dissolved Oxygen',
			vAxis: {
				'title': 'Dissolved Oxygen (mL/L)'
			},  
			'height': 300,
			colors: ['#ff00ff'],
			pointSize: pointSize
		});
		chartPH.draw(dataPH, {
			title: 'pH',
			vAxis: {
				'title': 'pH'
			},  
			'height': 300,
			colors: ['#2222ff'],
			pointSize: pointSize
		});
	}
}

function updateChart() {
	if ( shouldUpdate ) {
		console.log("Update data");

		var public_key = '0lgbR1rRQ9UgbE6LoLx1';

		// JSONP request
		var jsonData = $.ajax({
			url: 'https://data.sparkfun.com/output/' + public_key + '.json',
			data: {page: 1},
			jsonp: 'callback',
			cache: true,
			dataType: 'jsonp',
		}).done(function (results) {

			var mostRecent;

			$.each(results, function (i, row) {
				if ( i == 0 ) {
					dataTemp.addRow([
						(new Date(row.timestamp)),
						parseFloat(row.watertemp)
						]);
					dataSalinity.addRow([
						(new Date(row.timestamp)),
						parseFloat(row.salinity)
						]);
					dataConductivity.addRow([
						(new Date(row.timestamp)),
						parseFloat(row.conductivity)
						]);
					dataOxygen.addRow([
						(new Date(row.timestamp)),
						parseFloat(row.dissolvedo2)
						]);
					dataPH.addRow([
						(new Date(row.timestamp)),
						parseFloat(row.ph)
						]);

					document.getElementById("waterTempLabel").innerHTML = row.watertemp;
					document.getElementById("salinityLabel").innerHTML = row.salinity;
					document.getElementById("conductivityLabel").innerHTML = row.conductivity;
					document.getElementById("oxygenLabel").innerHTML = row.dissolvedo2;
					document.getElementById("pHLabel").innerHTML = row.ph;
					document.getElementById("currentLabel").innerHTML = row.current;
					document.getElementById("voltageLabel").innerHTML = row.voltage;
					document.getElementById("intTempLabel").innerHTML = row.internaltemp;
					document.getElementById("depthLabel").innerHTML = row.depth;
					lastUpdateDate = new Date(row.timestamp);             
				}
	  	});
		});
	}

	drawCharts();

	// recursive call to repeat this function
  setTimeout(updateChart,10000);
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
	document.getElementById("cameraImage").src = "http://nomadcam.catalinasearanch.com/camera1/latest.jpg#" + new Date().getTime();

	if ( true ) {
		document.getElementById("camAlive").style.color = 'YellowGreen';
	} else {
		document.getElementById("camAlive").style.color = 'red';
	}

	// recursive call to repeat this function
  setTimeout(cameraImageUpdate,30000);
}

// load chart lib
google.load('visualization', '1', {
  packages: ['corechart']
});

// init data tables
var dataTemp;
var dataSalinity;
var dataConductivity;
var dataOxygen;
var dataPH;

var chartTemp;
var chartSalinity;
var chartConductivity;
var chartOxygen;
var chartPH;

var shouldUpdate = false;
var pointSize = 0;

// grab IP on start
updateAddress();

// Start timer update
timerUpdate();

// Start loading camera images
cameraImageUpdate();

// call drawChart once google charts is loaded
google.setOnLoadCallback(drawChart);

// start update cycle
setTimeout(updateChart,10000);

