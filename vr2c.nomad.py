#listenes to serial port at /dev/USB_ and parses messages from VR2C acoustic fish tag receiver. Formats data for exchange to phant data stream script

import serial
import time
from ISStreamer.Streamer import Streamer
streamer = Streamer(bucket_name="NomadBuoy", bucket_key="DQQTCP4FWSYK", access_key="LIrzTUCldL8wVbMSokjT27MNVSBui1Li")
#Vemco VR2C acoustic shark tag receiver
ser = serial.Serial(
    port='/dev/ttyUSB1',\
    baudrate=9600,\
    parity=serial.PARITY_NONE,\
    stopbits=serial.STOPBITS_ONE,\
    bytesize=serial.EIGHTBITS,\
    timeout=3)
count = 1
while True:
		if ser.inWaiting() > 70:
			input = ser.readline()
			#print input
			try:
				tag=input.split(" ")[2]
        			
				print "File written"
				streamer.log("DO",DO)
				streamer.log("Salinity",PSU)
				streamer.log("watertemp",temp)
				streamer.log("conductivity",conduct)
				streamer.log("depth_m",pressure)
				streamer.close()
				print "Data pushed to InitialState"
				print time.strftime('%X %Z %Z')
			except:
				print "not a packet with data"
				time.sleep(8)
		
				
# sudo chmod 777 /dev/ttyUSB1

#screen -dmS vr2c.nomad python /home/udooer/nomad/nomad/vr2c.nomad.py

