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
    port='/dev/tty???',\
    baudrate=9600,\
    parity=serial.PARITY_NONE,\
    stopbits=serial.STOPBITS_ONE,\
    bytesize=serial.EIGHTBITS,\
    timeout=3)
while True:
	

