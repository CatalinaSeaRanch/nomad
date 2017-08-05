import pynmea2
import serial
import time
from ISStreamer.Streamer import Streamer
streamer = Streamer(bucket_name="NomadBuoy", bucket_key="DQQTCP4FWSYK", access_key="LIrzTUCldL8wVbMSokjT27MNVSBui1Li")


#msg = pynmea2.parse("$GPGGA,184353.07,1929.045,S,02410.506,E,1,04,2.6,100.00,M,-33.9,M,,0000*6D")

ser = serial.Serial(
    port='/dev/ttyUSB2',\
    baudrate=9600,\
    parity=serial.PARITY_NONE,\
    stopbits=serial.STOPBITS_ONE,\
    bytesize=serial.EIGHTBITS,\
    timeout=3)
while True:
	input = ser.readline()
	try
		msg=pynmea2.parse(input)
		print "sentence received and parsed"
	try
		streamer.log("Lat",msg.latitude)
		streamer.log("Lon",msg.longitude)
		print "data pushed"
		print msg.latitude
		print msg.longitude
	time.sleep(5)