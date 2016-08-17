#sample imu and upload one minute of data hourly to ftp
import time
import os 
afile = open('afile.csv', 'w')
afile.close()
mfile = open('mfile.csv', 'w')
mfile.close()
gfile = open('gfile.csv', 'w')
gfile.close()

for x in range(0,1000):
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
        time.sleep(0.02)
afile.close()
mfile.close()
gfile.close()

N = 750 # number of samples
T = 1.0 / 25.0 # sample spacing
x = np.linspace(0.0, N*T, N)
y= genfromtxt('afile.csv', delimiter=',', usecols=2) #1=x, 2=y, 3=z for columns
yf = scipy.fftpack.fft(y)
yf = 1/yf #convert to graph of frequency of periods
xf = np.linspace(0.0, 1.0/(2.0*T), N/2)
plt.plot(xf[1:], 2.0/N * np.abs(yf[0:N/2])[1:])
#plt.show()
plt.savefig('fft.png')##save plot





## upload plot
print "done!"

