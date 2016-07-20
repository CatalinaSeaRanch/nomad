
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
while True:
		if ser.inWaiting() == 73:
			input = ser.readline()
			print input
			temp = input.split(" ")[2]
			conduct = input.split(" ")[4]
			pressure = input.split(" ")[8]
			DO = input.split(" ")[10]
			PSU = input.split(" ")[12]
			day = input.split(" ")[13]
			month = input.split(" ")[14]
			year = input.split(" ")[15]
			time = input.split(" ")[16]
			print temp
			print DO
			time.sleep(45)
		else:
			discard = ser.readline()



#to read temp of NEO processor: cat /sys/class/thermal/thermal_zone0/temp
# import commands
#//need to replace print with casting to internal temp variable
#print(commands.getstatusoutput("cat /sys/class/thermal/thermal_zone0/temp"))


