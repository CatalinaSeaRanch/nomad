#sample imu and upload one minute of data hourly to ftp
import time
import os
for x in range(0,1000):
        accel = open('/sensors/accelerometer/data','r')
        mag = open('/sensors/magnetometer/data','r')
        gyro = open('/sensors/gyroscope/data','r')
        adata = accel.read()
        afile = open('afile.csv', 'a')
        afile.write(adata)
	mdata = mag.read()
        mfile = open('mfile.csv', 'a')
        mfile.write(mdata)
        gdata = gyro.read()
        gfile = open('gfile.csv', 'a')
        gfile.write(gdata)
	x=x+1
        time.sleep(0.01)
afile.close()
mfile.close()
gfile.close()
print "done!"
