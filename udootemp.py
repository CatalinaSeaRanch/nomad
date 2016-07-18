#reads processor temp and publishes
import os
import time
while True:
		output=os.popen('cat /sys/devices/virtual/thermal/thermal_zone0/temp').read()
		udoo_temp = float(output)/1000
		print udoo_temp
		time.sleep(3)
