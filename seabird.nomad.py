
import serial
import time

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
        f = open('/home/udooer/nomad/data/seabird.nomad','w')
				f.close()  #opens/closes file and deletes contents
				f = open('/home/udooer/nomad/data/seabird.nomad','w') #opens file and inserts data
				f.write('watertemp=')
				f.write(temp)
				f.write('&')
				f.write('conductivity=')
				f.write(conduct)
				f.write('&')
				f.write('pressure=')
				f.write(pressure)
				f.write('&')
				f.write('DO=')
				f.write(DO)
				f.write('&')
				f.write('PSU=')
				f.write(PSU)
				f.write('&')
				f.close()
			except:
			#	print "not a packet with data"
				time.sleep(8)
		
				

#screen -dmS seabird.nomad python /home/udooer/nomad/seabird.nomad.py


