#!/usr/bin/python

from optparse import OptionParser
import os
import glob
import time
import ftplib

parser = OptionParser()
parser.add_option("-n","--hostname",dest="hostname",help="FTP Hostname")
parser.add_option("-u","--username",dest="username",help="FTP Username")
parser.add_option("-p","--password",dest="password",help="FTP Password")
parser.add_option("-s","--src",dest="src",help="Source directory for image files (must end with '/'")
(options,args) = parser.parse_args()

lastImg = "none"

ftp = ftplib.FTP(options.hostname)

while True:
		print "Searching for newest camera image..."
		
		newImage = max(glob.iglob(options.src+'*.[Jj][Pp][Gg]'), key=os.path.getctime)

		if ( newImage ):
				if ( newImage != lastImg ):
						print "New image found at "+newImage

						time.sleep(1) # Sleep just in case the camera was still writing the image
				
						try:
								imageFile = open(newImage,'rb')
								ftp = ftplib.FTP(options.hostname)
								ftp.login(options.username,options.password)
								ftp.storbinary('STOR camera1/latest.jpg',imageFile,1024)
								ftp.quit()	
								imageFile.close()
								print "Image uploaded to server successfully."
						except:
								print "Unknown FTP exception."

						lastImg = newImage

						print "Waiting 60 seconds to repeat..."

				else:
						print "No new images found."
				
		time.sleep(60)

# To run this script on the onboard computer, add the following line
# to rc.local:
# screen -dm -S camera python /home/[username]/nomad/imagesToServer.py --hostname [hostname] --username [username] --password [password] --src [src dir]
