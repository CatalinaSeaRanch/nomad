#sample imu and upload one minute of data hourly to ftp
import matplotlib
# Force matplotlib to not use any Xwindows backend.
matplotlib.use('Agg')
from optparse import OptionParser
import time
import os 
import glob
import numpy as np
import matplotlib.pyplot as plt
import scipy.fftpack
from numpy import genfromtxt
from scipy import signal
import ftplib

parser = OptionParser()
parser.add_option("-n","--hostname",dest="hostname",help="FTP Hostname")
parser.add_option("-u","--username",dest="username",help="FTP Username")
parser.add_option("-p","--password",dest="password",help="FTP Password")
parser.add_option("-s","--src",dest="src",help="Source directory for image files (must end with '/'")
(options,args) = parser.parse_args()

while True:
        afile = open('afile.csv', 'w')
        afile.close()
        mfile = open('mfile.csv', 'w')
        mfile.close()
        gfile = open('gfile.csv', 'w')
        gfile.close()
        print "previous data cleared, starting collection"
        for x in range(0,6000):
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
                time.sleep(0.05)
        afile.close()
        mfile.close()
        gfile.close()
        print "data collection finished, plotting to file"
        N = 6000 # number of samples
        T = 1.0 / 20.0 # sample spacing
        x = np.linspace(0.0, N*T, N)
        y= genfromtxt('gfile.csv', delimiter=',', usecols=1) #1=x, 2=y, 3=z for columns
        #y2= genfromtxt('gfile.csv', delimiter=',', usecols=2) 
	#y3= genfromtxt('gfile.csv', delimiter=',', usecols=3)
	#y4= np.vstack((y1,y2))
	#y = np.vstack((y4,y3))
	yf = scipy.fftpack.fft(y)
        #yf = 1/yf #convert to graph of frequency of periods
        xf = np.linspace(0.0, 1.0/(2.0*T), N/2)
        xf = 1/xf
        plt.figure(1)
        plt.subplot(211)
        plt.plot(x[1:],y[1:])
        plt.xlabel('Time (seconds)')
        plt.ylabel('Raw Sensor Value, single axis')
        plt.title('Raw Motion Data')
        plt.xlim([0, 300])
        plt.grid(True)
        #plt.subplot(212)
        #plt.plot(xf[1:], 2.0/N * np.abs(yf[0:N/2])[1:])
        #plt.xlabel('Period (seconds)')
        #plt.ylabel('Magnitude of Occurrence')
	#b=time.strftime('%X %Z')
        #plt.title('FFT of Gyro Data %s'%b)
        #plt.grid(True)
        #plt.xlim([0, 30])
	#plt.ylim([0, 6])
        #plt.xticks(np.arange(min(x), max(x)+1, 2.0))
        #max_y = max(yf)
        #max_x_pos = xf[y.index(max_y)]
        #plt.annotate('Dominant Period', xy=(max_x,max_y),xytext=(max_x+1,max_y+0.00001),arrowprops=dict(facecolor='black', shrink=0.01))
	#plt.annotate(time.strftime('%X %Z'),xy=(20,2.4))
	#plt.show()
	plt.subplot(212)
	f, Pxx_den = signal.welch(y, 20, nperseg=256)
	plt.semilogy(f, Pxx_den)
	plt.title('Dominant wave frequency Welchs method %s%b)
	#plt.ylim([0.5e-3, 1])
	
	plt.tight_layout()
	plt.savefig('fftg1.png')##save plot
	plt.close('all')
	
	
	
	
	print "uploading image to ftp"
        try:
                plotfig = open("fftg1.png",'rb')
                ftp = ftplib.FTP(options.hostname)
                ftp.login(options.username,options.password)
                ftp.storbinary('STOR imu/latest.png',plotfig,1024)
                ftp.quit()      
                plotfig.close()
                print "Figure uploaded to server successfully."
        except:
                print "Unknown FTP exception."

        print "done! sleeping 10 minutes to next sample period"
        time.sleep(600)


#screen -dmS imu.nomad python /home/udooer/nomad/imu.nomad.py --hostname [hostname] --username [username] --password [password] --src [src dir]
        

