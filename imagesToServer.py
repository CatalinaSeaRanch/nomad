#!/usr/bin/python

from optparse import OptionParser
import os
import glob

parser = OptionParser()
parser.add_option("-u","--username",dest="username",help="SFTP Username")
parser.add_option("-p","--password",dest="password",help="SFTP Password")
(options,args) = parser.parse_args()

imgDir = "/home/udoo/logs/images/"

while True:
		print "Searching for newest camera image..."
		
		newImage = max(glob.iglob('*.[Jj][Pp][Gg]'), key=os.path.getctime)

		if ( newImage ):
				#sftp image here