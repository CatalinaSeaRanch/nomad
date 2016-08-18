#sample imu and upload one minute of data hourly to ftp
import matplotlib
# Force matplotlib to not use any Xwindows backend.
matplotlib.use('Agg')

import time
import os 
import numpy as np
import matplotlib.pyplot as plt
import scipy.fftpack
from numpy import genfromtxt

afile = open('afile.csv', 'w')
afile.close()
mfile = open('mfile.csv', 'w')
mfile.close()
gfile = open('gfile.csv', 'w')
gfile.close()

for x in range(0,2000):
        accel = open('/sensors/accelerometer/data','r')
        mag = open('/sensors/magnetometer/data','r')
        gyro = open('/sensors/gyroscope/data','r')
        adata = accel.read()
        millisa = int(round(time.time() * 1000))
        afile = open('afile.csv', 'a')
        afile.write(str(millisa))
        afile.write(',')
        afile.write(adata)
        mdata = mag.read()
        millism = int(round(time.time() * 1000))
        mfile = open('mfile.csv', 'a')
        mfile.write(str(millism))
        mfile.write(',')
        mfile.write(mdata)
        gdata = gyro.read()
        millisg = int(round(time.time() * 1000))
        gfile = open('gfile.csv', 'a')
        gfile.write(str(millisg))
        gfile.write(',')
        gfile.write(gdata)
        x=x+1
        time.sleep(0.03)
afile.close()
mfile.close()
gfile.close()

N = 2000 # number of samples
T = 1.0 / 33.3333 # sample spacing
x = np.linspace(0.0, N*T, N)
y= genfromtxt('gfile.csv', delimiter=',', usecols=1) #1=x, 2=y, 3=z for columns
yf = scipy.fftpack.fft(y)
#yf = 1/yf #convert to graph of frequency of periods
xf = np.linspace(0.0, 1.0/(2.0*T), N/2)
xf = 1/xf
#plt.tight_layout(pad=1.08)
plt.figure(1)
plt.subplot(211)
plt.plot(x,y)
plt.xlabel('Time (seconds)')
plt.ylabel('Raw Sensor Value')
plt.title('Raw Motion Data')
plt.xlim([0, 60])
plt.grid(True)
plt.subplot(212)
plt.plot(xf[1:], 2.0/N * np.abs(yf[0:N/2])[1:])
plt.xlabel('Period (seconds)')
plt.ylabel('Magnitude of Occurrence')
plt.title('FFT of Gyro Data')
plt.grid(True)
plt.xlim([0, 25])
#plt.xticks(np.arange(min(x), max(x)+1, 2.0))
#max_y = max(yf)
#max_x_pos = xf[y.index(max_y)]
#plt.annotate('Dominant Period', xy=(max_x,max_y),xytext=(max_x+1,max_y+0.00001),arrowprops=dict(facecolor='black', shrink=0.01))
#plt.show()
plt.tight_layout()
plt.savefig('fftg1.png')##save plot





## upload plot
print "done!"

