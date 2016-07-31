#sample imu and upload one minute of data hourly to ftp
import time
import os

for x in range(0,1000):
        accel = open('/sensors/accelerometer/data','r')
        mag = open('/sensors/magnetometer/data','r')
        gyro = open('/sensors/gyroscope/data','r')
        adata = accel.read()
        millisa = int(round(time.time() * 1000))
        afile = open('afile.csv', 'a')
        afile.write(millisa)
        afile.write(',')
        afile.write(adata)
        mdata = mag.read()
        millism = int(round(time.time() * 1000))
        mfile = open('mfile.csv', 'a')
        mfile.write(millism)
        mfile.write(',')
        mfile.write(mdata)
        gdata = gyro.read()
        millisg = int(round(time.time() * 1000))
        gfile = open('gfile.csv', 'a')
        gfile.write(millisg)
        gfile.write(',')
        gfile.write(gdata)
        x=x+1
        time.sleep(0.01)
afile.close()
mfile.close()
gfile.close()
print "done!"

