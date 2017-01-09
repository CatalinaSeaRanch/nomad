/* tank.js - Controls tank data viewing system. */

// Global Variables
var lastUpdateDate = new Date();

//var base_url = 'http://data.sparkfun.com/output/';
//var data_base_url = 'http://ec2-52-88-170-89.us-west-2.compute.amazonaws.com:8080/output/';
//var public_key = '0lgbR1rRQ9UgbE6LoLx1';
//var data_public_key = 'mr8jMdveOGSrqoB4XdWQcVrjaWQ';

//var maxAliveTimeoutMS = 300000;



// onload callback
//
  /*var elapsed = Math.floor(Math.abs(new Date() - lastUpdateDate)/1000);
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
  setTimeout(timerUpdate,1000);*/
//}

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

	document.getElementById("camera1Link").href = document.getElementById("camera1Image").src;
	document.getElementById("camera2Link").href = document.getElementById("camera2Image").src;

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

//function enableRangeSelector(enable) {
	//var radioClass;
//	/if (enable) {
//		radioClass = "btn btn-primary";
//	} else {
//		radioClass = "btn btn-primary disabled";
//	}
//	document.getElementById("fiveMinLabel").className = radioClass + (document.getElementById("fiveMinLabel").classList.contains("active") ? " active" : "");
//	document.getElementById("fifteenMinLabel").className = radioClass + (document.getElementById("fifteenMinLabel").classList.contains("active") ? " active" : "");
//	document.getElementById("oneHrLabel").className = radioClass + (document.getElementById("oneHrLabel").classList.contains("active") ? " active" : "");
//	document.getElementById("oneDayLabel").className = radioClass + (document.getElementById("oneDayLabel").classList.contains("active") ? " active" : "");
//	document.getElementById("oneWeekLabel").className = radioClass + (document.getElementById("oneWeekLabel").classList.contains("active") ? " active" : "");
//	document.getElementById("oneMonthLabel").className = radioClass + (document.getElementById("oneMonthLabel").classList.contains("active") ? " active" : "");
//	document.getElementById("allPagesLabel").className = radioClass + (document.getElementById("allPagesLabel").classList.contains("active") ? " active" : "");
//}

// load chart lib
//google.charts.load('current', {'packages':['corechart']});

// init data tables
//var dataTemp;
//var dataSalinity;
//var dataConductivity;
//var dataOxygen;
//var dataDepth;

//var chartTemp;
//var chartSalinity;
//var chartConductivity;
//var chartOxygen;
//var chartDepth;

var shouldUpdate = false;
//var pointSize = 0;

// grab IP on start
//updateAddress();

// Start timer update
timerUpdate();

// Start loading camera images
cameraImageUpdate();

// Start loading fft plots
fftPlotUpdate();

// disable range selector
//enableRangeSelector(false);

// call drawChart once google charts is loaded
//google.charts.setOnLoadCallback(drawChart);

// start update cycle
//setTimeout(updateChart,10000);

