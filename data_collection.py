
import serial
import time

#To read ADC values - for battery voltage and current sense amplifier output - 
#
#while True:
#		raw = int(open("/sys/bus/iio/devices/iio:device0/in_voltage1_raw").read())
#		scale = float(open("/sys/bus/iio/devices/iio:device0/in_voltage_scale").read())
#		Batv = raw*scale*float(4.52941)*float(0.001)-float(1.214)
#		print Batv
#		time.sleep(5)

# To communicate I2C with Atlas Scientific Sensors - easiest to use A9
# with drivers / methods from pi image hosted by Atlas - avoid arduino? Libraries may
# be available for either



# Vemco Acoustic Receiver - 96008N1 - Tag ID / TIME






#Seabird MicroCAT - 96008n1 - Conducitivity / DO / Pressure / TEMP (?)
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
                f = open('/home/udooer/nomad/data/seabird.nomad', 'w')
				f.close()  #opens file and deletes contents
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
		
				



