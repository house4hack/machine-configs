
# **HOUSE-LASER** 


[Link to Loading & Cutting using LaserWeb (after steps below)](../house-laser/LaserWebConfig/Cutting%20Design.md)


<br/>

Power limited to +/- 80W. thus a 100% setting will be about 80W laser power.
	
Focussing:
* Plexiglass: Focus on the top of the surface
* Wood: Focus in the middle of the wood. If 8mm, then focus at 4mm.

Cutting Speed/Power settings:
* 3mm Plexi: 60% @ 800mm/min
* 5mm Plexi: 60% @ 600mm/min
* 8mm Wood: 80% @ high speed
* 6mm MDF : 80% @ 1000mm/n ( 2 passes )
* 0.3mm Mylar 20% @ 1500mm/min ( reduce Air Pressure on Regulator to below +-.5bar : normal setting 1.5bar)

Etching Speed/Power:
* 12-20% @ 2000mm/min

<br/>
<br/>


# Basic steps to use the laser cutter:



**1. Powering ON the LASER**	
---------------------------------
<br>
- Ensure the E-Stop (big red button on LHS) is not depressed, to release, turn the knob to test.
- Switch on the 4 black switches below the E-Stop.
- Power up the Compressor 
	- On the compressor's control panel Press the Power on button 
	- Enable individual Compressor heads, by pressing the green buttons along the bottom of the Panel.
	- NOTE: One of the Heads sounds louder than the others, leave that particular head powered off. 

----
<br/>

**2. Connect to Laser Cutter**
-----


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
	- Application State - On File - Load : laserweb-snapshot.json  
<br/>


----
  
**3. Test Connection to Laser**
--

- Select the Control Tab on the LEFT hand side.
- At the top of the screen, verify the status is idle (green)
- Click the "Home All" - Laser should home the head, if it doesnt - Repeat Step 2 above.


If you have a head crash, the laser bed will need to be levelled again. 

---
<br/>


[NEXT - Link to Loading & Cutting using LaserWeb](../house-laser/LaserWebConfig/Cutting%20Design.md)


**Some Notes:**
---------------------------
* Home position is at X=-4.67 and Y=-7mm.
* We have a plexiglass square at X=0mm and Y=405mm
* The BOTTOM RIGHT of the Laser Bed is TOP LEFT on the Laser Web View.  (Rotated 180)

