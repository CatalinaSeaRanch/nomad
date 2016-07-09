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
		ip = get('https://api.ipify.org').text 
		print 'My public IP address is:', ip

		print "Sending data to Sparkfun Phant..."
		try: 
				requestString = getURL+'?private_key='+options.private_key+'&ip_address='+ip
				r = requests.get(requestString)
				print "Request:"
				print requestString
				print "Result: "
				print r.text
		except ValueError:
				print "Unexpected error:", sys.exc_info()[0]
		except:
				print "Unknown error"

		time.sleep(60)

# To run this on boot, add the following line to /etc/rc.local
# screen -dm -S phantIP python /home/[username]/nomad/nomadIPtoPhant.py --key [private_key]