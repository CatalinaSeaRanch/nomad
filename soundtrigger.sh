# Triggered by soundmeter call, placed in rc.local
# soundmeter --trigger +XXX 3 --action exec --exec trigger.sh --daemonize
# replace XXX with value above RMS avg  or max from test report called with:
# soundmeter --collect --seconds 30

#https://linuxconfig.org/how-to-test-microphone-with-audio-linux-sound-architecture-alsa

filename=`date --iso-8601=sec`.wav
arecord -d 10 /tmp/filename.wav