import pynmea2
import serial
import time
from ISStreamer.Streamer import Streamer
streamer = Streamer(bucket_name="NomadBuoy", bucket_key="DQQTCP4FWSYK", access_key="LIrzTUCldL8wVbMSokjT27MNVSBui1Li")


#msg = pynmea2.parse("$GPGGA,184353.07,1929.045,S,02410.506,E,1,04,2.6,100.00,M,-33.9,M,,0000*6D")

ser = serial.Serial(
    port='/dev/ttyUSB0',\
    baudrate=38400,\
    parity=serial.PARITY_NONE,\
    stopbits=serial.STOPBITS_ONE,\
    bytesize=serial.EIGHTBITS,\
    timeout=3)
line=0
while True:
	while line < 40:
		input = ser.readline()
		try:
			msg=pynmea2.parse(input)
			line = line+1
			print "sentence received and parsed"
		except:
			print "not a sentence"
	try:
		#streamer.log("Lat",msg.latitude)
		#streamer.log("Lon",msg.longitude)
		print "data pushed"
		print msg.latitude
		print msg.longitude
		line = 0
	except:
		print "data push fail"
	time.sleep(5)

