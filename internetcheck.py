#!/bin/bash

#This will check for internet connectivity every 5 minutes and reset router for 4 minutes if none is detected.
echo 1 > /gpio/pin40/value
echo out > /gpio/pin40/direction
echo 1 > /gpio/pin40/value

WGET="/usr/bin/wget"

$WGET -q --tries=20 --timeout=15 http://www.google.com -O /tmp/google.idx &> /dev/null
if [ ! -s /tmp/google.idx ]
then
        echo "offline"
    echo 0 > /gpio/pin40/value
    sleep 15
    echo 1 > /gpio/pin40/value
    sleep 4m
else
        echo "online"
        echo 1 > /gpio/pin40/value
fi
sleep 5m
/bin/bash /home/udooer/nomad/internetcheck.sh