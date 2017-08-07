import serial
import time
from ISStreamer.Streamer import Streamer
streamer = Streamer(bucket_name="NomadBuoy", bucket_key="DQQTCP4FWSYK", access_key="LIrzTUCldL8wVbMSokjT27MNVSBui1Li")

import os
from math import log10, floor
def round_to_1(x):
	return round(x, -int(floor(log10(abs(x)))))
#To read ADC values - for battery voltage and current sense amplifier output - 

while True:	
		raw = int(open("/sys/bus/iio/devices/iio:device0/in_voltage1_raw").read())		
		scale = float(open("/sys/bus/iio/devices/iio:device0/in_voltage_scale").read())
		Batv = raw*scale*float(4.52941)*float(0.001)-float(1.214)
		Batv = round(Batv,3)
		print "Battery Voltage:"
		print Batv
		output=os.popen('cat /sys/devices/virtual/thermal/thermal_zone0/temp').read()
		InternalTemp = float(output)/1000
		print "internal temp:"
		print InternalTemp
		print "data written"
		streamer.log("internal_temp",InternalTemp)
		streamer.log("Battery_Voltage",Batv)
		streamer.close()
		time.sleep(120)
		#except:
		#	print "Error!"
		#	time.sleep(5)		
		#screen -dmS system.nomad python /home/udooer/nomad/system.nomad.py
