/* tank.js - Controls tank data viewing system. */

// Global Variables
var lastUpdateDate = new Date();

//var base_url = 'http://data.sparkfun.com/output/';
var data_base_url = 'http://ec2-52-88-170-89.us-west-2.compute.amazonaws.com:8080/output/';
//var public_key = '0lgbR1rRQ9UgbE6LoLx1';
var data_public_key = 'mr8jMdveOGSrqoB4XdWQcVrjaWQ';

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
		beforeSend: function() {
			spinner(true);
		},
		complete: function() {
			spinner(false);
		}
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

// onload callback
function drawChart() {
	console.log("Drawing charts");
	shouldUpdate = false;

  var dataPage;
  var maxAge;
  var sinceDate;

  if ( document.getElementById("fiveMin").checked ) {
    sinceDate = "-5minutes";
    pointSize = 4;
  } else if ( document.getElementById("fifteenMin").checked ) {
    sinceDate = "-15minutes";
    pointSize = 2;
  } else if ( document.getElementById("oneHr").checked ) {
    sinceDate = "-60minutes";
    pointSize = 1;
  } else if ( document.getElementById("oneDay").checked ) {
    sinceDate = "-24hours";
  } else if ( document.getElementById("oneWeek").checked ) {
    sinceDate = "-7days";
  } else if ( document.getElementById("oneMonth").checked ) {
    sinceDate = "-30days";
  } else if ( document.getElementById("allPages").checked ) {
    sinceDate = "";
  }

  console.log("Getting data: "+data_base_url + data_public_key + '.json' + '?gte[timestamp]='+sinceDate);

	// JSONP request
	var jsonData = $.ajax({
		url: data_base_url + data_public_key + '.json' + '?gte[timestamp]='+sinceDate,
		jsonp: 'callback',
		cache: true,
		dataType: 'jsonp',
		beforeSend: function() {
			spinner(true);
			enableRangeSelector(false);
		},
		complete: function() {
			spinner(false);
			enableRangeSelector(true);
		}
	}).done(function (results) {

		// init data tables
		dataTemp     = new google.visualization.DataTable();
		dataSalinity = new google.visualization.DataTable();
		dataConductivity = new google.visualization.DataTable();
		dataOxygen   = new google.visualization.DataTable();
		dataDepth       = new google.visualization.DataTable();

		dataTemp.addColumn('datetime', 'Time');
		dataTemp.addColumn('number', 'Water Temperature');
		dataSalinity.addColumn('datetime', 'Time');
		dataSalinity.addColumn('number', 'Salinity');
		dataConductivity.addColumn('datetime', 'Time');
		dataConductivity.addColumn('number', 'Conductivity');
		dataOxygen.addColumn('datetime', 'Time');
		dataOxygen.addColumn('number', 'Dissolved Oxygen');
		dataDepth.addColumn('datetime', 'Time');
		dataDepth.addColumn('number', 'Depth');

		var mostRecent;

		$.each(results, function (i, row) {
			if ( i == 0 ) {
				mostRecent = new Date(row.timestamp);
			}

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
			dataDepth.addRow([
				(new Date(row.timestamp)),
				parseFloat(row.depth)
				]);

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
	chartDepth       = new google.visualization.LineChart($('#chartDepth').get(0));

	drawCharts();

	console.log("Enabling live updates");
	shouldUpdate = true;
	});
}

function drawCharts() {
	if ( shouldUpdate ) {
		console.log("Redrawing charts");
		spinner(true);
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
		chartDepth.draw(dataDepth, {
			title: 'Depth',
			vAxis: {
				'title': 'Depth'
			},  
			'height': 300,
			colors: ['#2222ff'],
			pointSize: pointSize
		});
		spinner(false);
	}
}

function updateChart() {
	if ( shouldUpdate ) {
		console.log("Update data");

		// JSONP request
		var jsonData = $.ajax({
			url: data_base_url + data_public_key + '.json' + '.json?gte[timestamp]=-60seconds',
			jsonp: 'callback',
			cache: true,
			dataType: 'jsonp',
			beforeSend: function() {
				spinner(true);
			},
			complete: function() {
				spinner(false);
			}
		}).done(function (results) {

			var mostRecent;

			$.each(results, function (i, row) {
				if ( i == 0 ) {
					dataTemp.insertRows(0,[[
						(new Date(row.timestamp)),
						parseFloat(row.watertemp)
						]]);
					dataSalinity.insertRows(0,[[
						(new Date(row.timestamp)),
						parseFloat(row.salinity)
						]]);
					dataConductivity.insertRows(0,[[
						(new Date(row.timestamp)),
						parseFloat(row.conductivity)
						]]);
					dataOxygen.insertRows(0,[[
						(new Date(row.timestamp)),
						parseFloat(row.dissolvedo2)
						]]);
					dataDepth.insertRows(0,[[
						(new Date(row.timestamp)),
						parseFloat(row.depth)
						]]);

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
		drawCharts();
	}

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

var spinnerCount = 0;
function spinner(on) {
	if ( on ) {
		spinnerCount++;
	} else {
		spinnerCount--;
		if ( spinner < 0 ) {
			spinner = 0;
		}
	}
	if ( spinnerCount > 0 ) {
		document.getElementById("spinner").innerHTML = '<i class="fa fa-spinner fa-pulse fa-fw"></i>';
	} else {
		document.getElementById("spinner").innerHTML = '';
	}
}

function cameraImageUpdate() {
	document.getElementById("camera1Image").src = "http://nomadcam.catalinasearanch.com/camera1/latest.jpg#" + new Date().getTime();
	document.getElementById("camera2Image").src = "http://nomadcam.catalinasearanch.com/camera2/latest.jpg#" + new Date().getTime();

	if ( true ) {
		document.getElementById("camAlive").style.color = 'YellowGreen';
	} else {
		document.getElementById("camAlive").style.color = 'red';
	}

	/*$.ajax({
  url: "http://nomadcam.catalinasearanch.com/camera1/",
  success: function(data){
  	var thumbnailHTML = '';
  	var count = 0;
  	var index = 0;

  	jQuery.fn.reverse = [].reverse;

    $($(data).find("a:contains(.jpg)")).reverse().each(function(){
        // will loop through 
        var image = $(this).attr("href");

        if ( count == 0 ) {
        	count++;
        	return;
        }

        if ( index % 15 == 0 ) {
	        if ( count++ <= 8 ) {
	        	thumbnailHTML += '<div class="col-sm-6 col-md-3 col-lg-3">';
	        	thumbnailHTML += '<div class="thumbnail">';
	        	thumbnailHTML += '<a href="http://nomadcam.catalinasearanch.com/camera1/'+image+'">';
	        	thumbnailHTML += '<img src="http://nomadcam.catalinasearanch.com/camera1/'+image+'" class="img-responsive" />';
	        	thumbnailHTML += '</a></div></div>';
	        }
	      }

        index++;
     });

    document.getElementById("cameraThumbSpan").innerHTML = thumbnailHTML;
  }
});*/

	// recursive call to repeat this function
  setTimeout(cameraImageUpdate,30000);
}

function fftPlotUpdate() {
	console.log("Updating FFT plot image");
	document.getElementById("fftPlot").src = "http://nomadcam.catalinasearanch.com/imu/latest.png#" + new Date().getTime();

	// recursive call to repeat this function
  setTimeout(fftPlotUpdate,5*60*1000);
}

function enableRangeSelector(enable) {
	var radioClass;
	if (enable) {
		radioClass = "btn btn-primary";
	} else {
		radioClass = "btn btn-primary disabled";
	}
	document.getElementById("fiveMinLabel").className = radioClass + (document.getElementById("fiveMinLabel").classList.contains("active") ? " active" : "");
	document.getElementById("fifteenMinLabel").className = radioClass + (document.getElementById("fifteenMinLabel").classList.contains("active") ? " active" : "");
	document.getElementById("oneHrLabel").className = radioClass + (document.getElementById("oneHrLabel").classList.contains("active") ? " active" : "");
	document.getElementById("oneDayLabel").className = radioClass + (document.getElementById("oneDayLabel").classList.contains("active") ? " active" : "");
	document.getElementById("oneWeekLabel").className = radioClass + (document.getElementById("oneWeekLabel").classList.contains("active") ? " active" : "");
	document.getElementById("oneMonthLabel").className = radioClass + (document.getElementById("oneMonthLabel").classList.contains("active") ? " active" : "");
	document.getElementById("allPagesLabel").className = radioClass + (document.getElementById("allPagesLabel").classList.contains("active") ? " active" : "");
}

// load chart lib
google.charts.load('current', {'packages':['corechart']});

// init data tables
var dataTemp;
var dataSalinity;
var dataConductivity;
var dataOxygen;
var dataDepth;

var chartTemp;
var chartSalinity;
var chartConductivity;
var chartOxygen;
var chartDepth;

var shouldUpdate = false;
var pointSize = 0;

// grab IP on start
//updateAddress();

// Start timer update
timerUpdate();

// Start loading camera images
cameraImageUpdate();

// Start loading fft plots
fftPlotUpdate();

// disable range selector
enableRangeSelector(false);

// call drawChart once google charts is loaded
google.charts.setOnLoadCallback(drawChart);

// start update cycle
setTimeout(updateChart,10000);

