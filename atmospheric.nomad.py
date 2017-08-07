# SDI adapter for weather sensor
#9600 baud rate, 8-bit data, 1-bit stop
#send  command  '?!'  without  the  quotation.  
#The  sensor  should  respond  with  its  one-character address. 

# TEMP, HUMIDITY & PRESSURE & PRECIPITATION & WIND 
# Node,
# Relative Wind Direction, Relative Wind Speed, Corrected Wind Direction, Pressure,
# RH,
# Temp,
# Dewpoint,
# Total Precipitation, Precipitation Intensity, Date and Time,
# Supply Voltage,
# Status,
# Checksum.

import serial
import time
from ISStreamer.Streamer import Streamer
streamer = Streamer(bucket_name="NomadBuoy", bucket_key="DQQTCP4FWSYK", access_key="LIrzTUCldL8wVbMSokjT27MNVSBui1Li")

#Seabird MicroCAT - 96008n1 - Conducitivity / DO / Pressure / TEMP / PSU
ser = serial.Serial(
    port='/dev/ttyUSB1',\
    baudrate=9600,\
    parity=serial.PARITY_NONE,\
    stopbits=serial.STOPBITS_ONE,\
    bytesize=serial.EIGHTBITS,\
    timeout=3)
while True:
	time.sleep(1)
	ser.write('?!')
	time.sleep(0.5)
	ser.write('0M1!')
	time.sleep(0.5)
	ser.write('0D0!'
	input1 = ser.readline()
	time.sleep(0.5)
	ser.write('0M2!')
	time.sleep(0.5)
	ser.write('0D0!')
	input2 = ser.readline()
	print(input1)
	print(input2)
		

		#streamer.log("Relative Wind Direction",RWD)
		#streamer.log("Relative Wind Speed",RWS)
		#streamer.log("BaroPressure",bpressure)
		#streamer.log("Relative Humidity",RH)
		#streamer.log("Air Temp",Atemp)
		#streamer.log("Dewpoint",dpoint)

		time.sleep(10)