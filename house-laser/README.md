HOUSE-LASER
===========

Power limited to +/- 80W. thus a 100% setting will be about 80W laser power.
	
Focussing:
* Plexiglass: Focus on the top of the surface
* Wood: Focus in the middle of the wood. If 8mm, then focus at 4mm.

Cutting Speed/Power settings:
* 3mm Plexi: 60% @ 800mm/min
* 5mm Plexi: 60% @ 600mm/min
* 8mm Wood: 80% @ high speed

Etching Speed/Power:
* 12-20% @ 2000mm/min

Basic steps to use the laser cutter:
- You need to be on the Morgan network and have a 192.168.13.* ip address.
- Switch the electronics on on the laser cutter (Top switch)
- Connect to LaserWeb on the RPi by going to http://192.168.13.20:8000
- Click on "Comms"
- Under "Server Connection" set SERVER IP = 192.168.13.20:8000 and click connect
- Under "Machine Connection" set 
	- MACHINE CONNECTION = USB
	- USB / SERIAL PORT = LPCUSB @ /dev/ttyACM0
	- BAUDRATE = 115200
- Click connect
- Click on "Settings" and under "Tools" add the files from the LaserWebConfig to:
	- Settings : laserweb-settings.json
	- Machine Profiles : laserweb-profiles.json
	- ? : laserweb-snapshot.json
- Now you are ready to use it.

If you have a head crash, the laser bed will need to be levelled again. 

Some Notes:
* Home position is at X=-4.67 and Y=-7mm.
* We have a plexiglass square at X=0mm and Y=405mm  
