/* tank.js - Controls tank data viewing system. */

// Global Variables
var lastUpdateDate = new Date();

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
			}
  	});
  });
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

		var dataVoltage = new google.visualization.DataTable();
		var dataCurrent = new google.visualization.DataTable();
		var dataPower   = new google.visualization.DataTable();
		var dataRPM     = new google.visualization.DataTable();
		var dataThrust  = new google.visualization.DataTable();
		var dataSignal  = new google.visualization.DataTable();

		dataVoltage.addColumn('datetime', 'Time');
		dataVoltage.addColumn('number', 'Voltage');
		dataCurrent.addColumn('datetime', 'Time');
		dataCurrent.addColumn('number', 'Current');
		dataPower.addColumn('datetime', 'Time');
		dataPower.addColumn('number', 'Power');
		dataRPM.addColumn('datetime', 'Time');
		dataRPM.addColumn('number', 'RPM');
		dataThrust.addColumn('datetime', 'Time');
		dataThrust.addColumn('number', 'Thrust');
		dataSignal.addColumn('datetime', 'Time');
		dataSignal.addColumn('number', 'Signal');

		var mostRecent;

		$.each(results, function (i, row) {
			if ( i == 0 ) {
				mostRecent = new Date(row.timestamp);
			}
			if ( Math.abs(mostRecent - new Date(row.timestamp)) < maxAge ) {
				dataVoltage.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.voltage)
					]);
				dataCurrent.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.current)
					]);
				dataPower.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.power)
					]);
				dataRPM.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.rpm)
					]);
				dataThrust.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.thrust)
					]);
				dataSignal.addRow([
					(new Date(row.timestamp)),
					parseFloat(row.signal)
					]);
			}
			if ( i == 0 ) {
				document.getElementById("voltageLabel").innerHTML = row.voltage;
				document.getElementById("currentLabel").innerHTML = row.current;
				document.getElementById("powerLabel").innerHTML = row.power;
				document.getElementById("rpmLabel").innerHTML = row.rpm;
				document.getElementById("thrustLabel").innerHTML = row.thrust;
				document.getElementById("signalLabel").innerHTML = row.signal;
				lastUpdateDate = new Date(row.timestamp);             
			}
  	});

	var chartVoltage = new google.visualization.LineChart($('#chartVoltage').get(0));
	var chartCurrent = new google.visualization.LineChart($('#chartCurrent').get(0));
	var chartPower   = new google.visualization.LineChart($('#chartPower').get(0));
	var chartRPM     = new google.visualization.LineChart($('#chartRPM').get(0));
	var chartThrust  = new google.visualization.LineChart($('#chartThrust').get(0));
	var chartSignal  = new google.visualization.LineChart($('#chartSignal').get(0));

	chartVoltage.draw(dataVoltage, {
		title: 'Voltage',
		vAxis: {
			'title': 'Voltage (V)'
		},  
		'height': 300,
		colors: ['#ff0000']
	});
	chartCurrent.draw(dataCurrent, {
		title: 'Current',
		vAxis: {
			'title': 'Current (A)'
		},  
		'height': 300, 
		colors: ['#00ff00']
	});
	chartPower.draw(dataPower, {
		title: 'Power',
		vAxis: {
			'title': 'Power (W)'
		},  
		'height': 300,
		colors: ['#ffff00']
	});
	chartRPM.draw(dataRPM, {
		title: 'RPM',
		vAxis: {
			'title': 'RPM'
		},  
		'height': 300,
		colors: ['#2222ff']
	});
	chartThrust.draw(dataThrust, {
		title: 'Thrust',
		vAxis: {
			'title': 'Thrust (lb)'
		},  
		'height': 300,  
		colors: ['#888888']
	});
	chartSignal.draw(dataSignal, {
		title: 'Signal',
		vAxis: {
			'title': 'Signal (us)'
		},  
		'height': 300,
		colors: ['#0000aa']
	});

	});

}

function sendCommand() {
  save();
  var public_key = 'YGDq7JmrxXtyDEMNnmO0';
  $.ajax({
    url: 'http://data.sparkfun.com/input/' + public_key + '.json',
    jsonp: 'callback',
    cache: true,
    dataType: 'jsonp',
    data: {
      private_key: document.getElementById("private_key").value,      
      pulsewidtha: document.getElementById("inputA").value,
      pulsewidthb: document.getElementById("inputB").value
    },
    success: function(response) {
      if ( response.success ) {
        document.getElementById("commandResponse").innerHTML = '<div class="alert alert-success" role="alert">Command Successfully Sent!</div>';
        window.setTimeout(function(){clearCommandResponse()}, 10000);
      } else {
        document.getElementById("commandResponse").innerHTML = '<div class="alert alert-danger" role="alert">Command Failed: '+response.message+'</div>';
        window.setTimeout(function(){clearCommandResponse()}, 10000);
      }
    }
  });
}

function clearCommandResponse() {
  document.getElementById("commandResponse").innerHTML = '';
}

function save() {
  var text_to_save=document.getElementById('private_key').value;
	localStorage.setItem("phant_private_key", text_to_save); // save the item
}

function retrieve() {
	//var text=localStorage.getItem("phant_private_key"); // retrieve
	//document.getElementById('private_key').value = text; // display
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
}

function drawLoop() {
  retrieve();
  drawChart();
  window.setInterval(function(){
    drawChart();
  }, 5000);
  window.setInterval(function(){
    timerUpdate();
  }, 1000);	
}

// load chart lib
google.load('visualization', '1', {
  packages: ['corechart']
});

// grab IP on start
updateAddress();

// call drawChart once google charts is loaded
google.setOnLoadCallback(drawLoop);

