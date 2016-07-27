import serial
import time
import os

#To read ADC values - for battery voltage and current sense amplifier output - 

while True:
		raw = int(open("/sys/bus/iio/devices/iio:device0/in_voltage1_raw").read())
		scale = float(open("/sys/bus/iio/devices/iio:device0/in_voltage_scale").read())
		Batv = raw*scale*float(4.52941)*float(0.001)-float(1.214)
		#print Batv
		output=os.popen('cat /sys/devices/virtual/thermal/thermal_zone0/temp').read()
		InternalTemp = float(output)/1000
		#print udoo_temp
		f = open('system.nomad','w')
		f.close()  #opens/closes file and deletes contents
		f = open('system.nomad','w') #opens file and inserts data
		f.write('voltage')
		f.write(Batv)
		f.write('&')
		f.write('internaltemp')
		f.write(InternalTemp)
		f.write('&')
		time.sleep(10)
		