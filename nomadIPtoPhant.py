#!/usr/bin/python

from optparse import OptionParser
from requests import get 
import requests
import time

parser = OptionParser()
parser.add_option("-k","--key",dest="private_key",help="Phant private key for IP address data.")
(options,args) = parser.parse_args()

getURL = 'http://data.sparkfun.com/input/QGq9E8Yy1wc312pmoL0Z'

while True:
		ip = 'unknown'
		try:
			ip = get('https://api.ipify.org').text
		except:
			print "Unable to determine IP"
			
		print 'My public IP address is:', ip

		print "Sending data to Sparkfun Phant..."
		try: 
				requestString = getURL+'?private_key='+options.private_key+'&ip_address='+ip
				r = requests.get(requestString,timeout=10)
				print "Request:"
				print requestString
				print "Result: "
				print r.text
		except:
				print "Unexpected error:", sys.exc_info()[0]

		time.sleep(60)

# To run this on boot, add the following lines to /etc/rc.local
# sleep 10
# screen -dm -S phantIP python /home/[username]/nomad/nomadIPtoPhant.py --key [private_key]