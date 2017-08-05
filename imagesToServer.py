#!/usr/bin/python

from optparse import OptionParser
import os
import glob
import time
import ftplib
import datetime
import pytz
from astral import *
from astral import GoogleGeocoder
a=Astral(GoogleGeocoder)
location = a['Los Angeles']

parser = OptionParser()
parser.add_option("-n","--hostname",dest="hostname",help="FTP Hostname")
parser.add_option("-u","--username",dest="username",help="FTP Username")
parser.add_option("-p","--password",dest="password",help="FTP Password")
parser.add_option("-s","--src",dest="src",help="Source directory for image files (must end with '/'")
(options,args) = parser.parse_args()

lastImg = "none"

while True:
		print "Searching for newest camera image..."
		sun=location.sun(date=datetime.datetime.now(),local=True)

		newImage = max(glob.iglob(options.src+'*.[Jj][Pp][Gg]'), key=os.path.getctime)
		timenow = datetime.datetime.now(pytz.timezone('US/Pacific'))
		if ( newImage ) and sun['dawn'] < timenow and sun['dusk'] > timenow :
				if ( newImage != lastImg ):
						print "New image found at "+newImage

						time.sleep(1) # Sleep just in case the camera was still writing the image
				
						try:
								imageFile = open(newImage,'rb')
								imageFileAgain = open(newImage,'rb')
								ftp = ftplib.FTP(options.hostname)
								ftp.login(options.username,options.password)
								ftp.storbinary('STOR camera1/latest.jpg',imageFile,1024)
								ftp.storbinary('STOR camera1/nomad-'+time.strftime("%Y%m%d-%H%M%S")+'.jpg',imageFileAgain,1024)
								ftp.quit()	
								imageFile.close()
								print "Image uploaded to server successfully."
						except:
								print "Unknown FTP exception."

						lastImg = newImage

						print "Waiting 60 seconds to repeat..."

				else:
						print "No new images found."
				
		time.sleep(900)

# To run this script on the onboard computer, add the following line
# to rc.local:
# screen -dmS camera python /home/[username]/nomad/nomad/imagesToServer.py --hostname [hostname] --username [username] --password [password] --src [src dir]
