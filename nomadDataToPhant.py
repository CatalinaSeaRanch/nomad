#!/usr/bin/python

from optparse import OptionParser
from requests import get 
import requests
import time
import os
import re
import sys

parser = OptionParser()
parser.add_option("-k","--key",dest="private_key",help="Phant private key for IP address data.")
parser.add_option("-s","--src",dest="source",help="Source directory for '.nomad' data files.")
(options,args) = parser.parse_args()

getURL = 'http://data.sparkfun.com/input/0lgbR1rRQ9UgbE6LoLx1'

while True:
		# Initialize request string
		requestData = ""

		# Find applicable files
		for file in os.listdir(options.source):
		    if file.endswith(".nomad"):
		        f = open(options.source+"/"+file,'r')
		        #requestData = requestData + re.sub(r'[^\w!*\'()\;:@&.=+$,/?#[]]', '',(f.read().strip()))
		        requestData = requestData + f.read().strip()
		        f.close()

		requestData = requestData.rstrip('&')

		print "Sending data to Sparkfun Phant..."
		try: 
				requestString = getURL+'?private_key='+options.private_key+'&'+requestData
				r = requests.get(requestString,timeout=10)
				print "Request:"
				print requestString
				print "Result: "
				print r.text
		except:
				print "Unexpected error:", sys.exc_info()[0]

		time.sleep(10)

# To run this on boot, add the following lines to /etc/rc.local
#
# screen -dmS phantData python /home/[username]/nomad/nomadDataToPhant.py --key [private_key] --src [directory]

# The .nomad data file format must be one single line in the following form:
#
# data1=value&data2=value&data3=value&