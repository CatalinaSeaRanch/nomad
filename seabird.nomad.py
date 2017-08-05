
import serial
import time
from ISStreamer.Streamer import Streamer
streamer = Streamer(bucket_name="NomadBuoy", bucket_key="DQQTCP4FWSYK", access_key="LIrzTUCldL8wVbMSokjT27MNVSBui1Li")

#Seabird MicroCAT - 96008n1 - Conducitivity / DO / Pressure / TEMP / PSU
ser = serial.Serial(
    port='/dev/ttyUSB0',\
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
				temp = input.split(" ")[2]
				temp = temp.replace(',', '')
				conduct = input.split(" ")[4]
		                conduct = conduct.replace(',', '')
				pressure = input.split(" ")[8]
        		        pressure = pressure.replace(',', '')
				DO = input.split(" ")[10]
        		        DO = DO.replace(',', '')
				PSU = input.split(" ")[12]
        		        PSU = PSU.replace(',', '')
				#day = input.split(" ")[13]
                #month = input.split(" ")[14]
                #year = input.split(" ")[15]
                #time = input.split(" ")[16]
                #time = time.replace(',', '')
        			print "Data collected, saving to local backup file..."
				f = open('/home/udooer/nomad/data/seabird.nomad','w') #opens file and inserts data
                                f.write(time.strftime('%X %Z %Z'))
				f.write(',')
				f.write(DO)
				f.write(',')
				f.write(PSU)
				f.write(',')
				f.write(temp)
				f.write(',')
				f.write(conduct)
				f.write(',')
				f.write(pressure)
				f.write('\n')
				f.close()
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
		
				
# sudo chmod 777 /dev/ttyUSB0

#screen -dmS seabird.nomad python /home/udooer/nomad/nomad/seabird.nomad.py

