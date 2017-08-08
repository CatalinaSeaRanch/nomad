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
	ser.flushInput()
	ser.write('?!')
	ser.readline()
	ser.write('0M2!')
	ser.readline()
	ser.readline()
	ser.write('0D0!')
	windData = ser.readline()
	time.sleep(0.5)
	ser.write('0M1!')
	ser.readline()
	ser.readline()
	ser.write('0D0!')
	airData = ser.readline()
	RWD = windData.split("+")[1]
	RWS = windData.split("+")[2]
	Atemp = airData.split("+")[1]
	Humidity = airData.split("+")[2]
	dpoint = airData.split("+")[3]
	bpressure = airData.split("+")[4]
	print("data")
	print(RWD)
	print(RWS)
	print(Atemp)
	print(Humidity)
	print(dpoint)
	print(bpressure)
	print(" collected")
	streamer.log("RWD, d",RWD)
	streamer.log("RWS, m/s",RWS)
	streamer.log("BP, hPa",bpressure)
	streamer.log("RH, %", Humidity)
	streamer.log("Air Temp, C",Atemp)
	streamer.log("DP, C",dpoint)
	time.sleep(60)
#screen -dmS weather.nomad python /home/udooer/nomad/nomad/atmospheric.nomad.py
#to do - take 1 minute average of samples @ 10 seconds? 5 seconds?
