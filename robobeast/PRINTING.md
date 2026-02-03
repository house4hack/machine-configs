# Printing with the RoboBeast 3D Printer

This guide covers the complete workflow for printing with the RoboBeast, including preparing G-code, transferring files, and managing prints.

## Printing Methods

The RoboBeast supports two printing methods:

### Method 1: USB Tethered Printing (via Pronterface)
- Print directly from your computer via USB
- Real-time monitoring and control
- **Limitation:** Computer must remain connected throughout the entire print

### Method 2: SD Card Printing (Recommended for Long Prints)
- Copy G-code to the Smoothieboard's SD card
- Start print from SD card using Pronterface or the LCD panel
- **Advantage:** Computer can be disconnected after starting the print
- **Best for:** Long-running jobs, overnight prints, or when you need your computer

## Complete Printing Workflow

### Step 1: Slice Your Model

1. Open CURA with the Beast profile loaded
2. Import your 3D model (STL, OBJ, or 3MF file)
3. Position and orient the model on the build plate
4. Adjust print settings:
   - Layer height
   - Infill density
   - Support structures (if needed)
   - Print speed
   - Nozzle temperature
5. Click **Slice**
6. Review the preview and estimated print time
7. Click **Save to File** and export the G-code

### Step 2: Transfer G-code to SD Card

The Smoothieboard SD card automatically mounts as a USB drive when you connect the printer to your computer via USB:

1. **Connect the printer** to your computer via USB cable
   - The Smoothieboard SD card should appear as a USB drive on your computer
   - Wait a few seconds for the drive to mount

2. **Copy your G-code file** to the SD card drive
   - Use short, simple filenames (8.3 format recommended)
   - Avoid spaces and special characters
   - Example: `print01.gcode`, `vase_v2.nc`, etc.

3. **Safely eject the USB drive** from your computer
   - This ensures the file is completely written
   - On Linux: right-click and select "Safely Remove"
   - On Windows: use "Safely Remove Hardware"
   - On macOS: drag to trash or use eject button

**Note:** The SD card is physically difficult to access in the RoboBeast's design, so always use the USB connection method rather than removing the card.

### Step 3: Prepare the Printer

1. **Connect via Pronterface** (if not already connected)
   - Port: `/dev/ttyACM0` (Linux) or `COM3` (Windows)
   - Baud rate: `115200`
   - Click **Connect**

2. **Home all axes**
   - Click the home buttons in Pronterface, or
   - Send `G28` in the console

3. **Preheat the nozzle**
   - Set nozzle temperature (e.g., 210°C for PLA): `M104 S210`
   - Wait for temperature to stabilize
   - Or use the temperature controls in Pronterface

4. **Load filament** (if needed)
   - Heat the nozzle to printing temperature
   - Feed filament through the extruder
   - Extrude some material to verify flow: `G1 E50 F200`

5. **Level the bed** (if needed)
   - Run bed leveling: `G29` or `G32`
   - Or use manual paper test method if configured

### Step 4A: Print from SD Card (Recommended)

1. **List files on SD card**:
   ```
   M20
   ```
   This shows all files on the SD card

2. **Start printing from SD card**:
   ```
   play /sd/filename.gcode
   ```
   Or use the shorter format:
   ```
   play filename.gcode
   ```

3. **Alternative:** Use Pronterface SD card menu
   - In Pronterface, go to the SD card section
   - Click **Refresh** to see available files
   - Select your file
   - Click **SD Print**

4. **Monitor the first layer**
   - Watch closely to ensure proper adhesion
   - Adjust Z-offset if needed

5. **Disconnect if desired**
   - Once the print is running smoothly (after first few layers)
   - You can safely disconnect your computer
   - The printer will continue printing from the SD card
   - The LCD panel (if installed) will show progress

### Step 4B: Print from Computer (USB Tethered)

1. **Load G-code in Pronterface**
   - Click **Load file**
   - Select your G-code file

2. **Start the print**
   - Click **Print**

3. **Monitor the print**
   - Watch the first layer carefully
   - Adjust Z-offset if needed using the babystep controls

4. **Keep computer connected**
   - Do not close Pronterface
   - Do not disconnect the USB cable
   - Prevent computer from sleeping

## During the Print

### Monitoring
- Check the first layer for proper adhesion
- Monitor temperatures (should remain stable)
- Listen for unusual sounds or grinding
- Watch for filament tangles or runout

### Print Control Commands

| Command | Description |
|---------|-------------|
| `M24` | Resume/Start SD print |
| `M25` | Pause SD print |
| `M26` | Set SD position |
| `M27` | Report SD print status |
| `M28` | Begin write to SD card |
| `M29` | Stop writing to SD card |
| `M30` | Delete file from SD card |
| `M32` | Select file and start SD print |
| `progress` | Show print progress |
| `abort` | Abort current print |

### Pausing and Resuming

**To pause:**
```
M25
```
Or click **Pause** in Pronterface

**To resume:**
```
M24
```
Or click **Resume** in Pronterface

### Emergency Stop

If something goes wrong:
1. Click **Reset** in Pronterface, or
2. Send `M112` (emergency stop), or
3. Power off the printer (last resort)

## After the Print

1. **Wait for cool down**
   - Let the nozzle cool before handling the print area
   - Use the part removal tools carefully

2. **Turn off heater** (if still on):
   ```
   M104 S0  # Turn off hotend
   ```

3. **Home or move to safe position**:
   ```
   G28 X Y  # Home X and Y
   G1 Z200  # Raise Z for easy access
   ```

4. **Remove the print**
   - Use a spatula or scraper if needed
   - Be careful not to damage the print surface

## Troubleshooting

### SD Card Issues

**SD card not mounting:**
- Disconnect and reconnect the USB cable
- Try a different USB port on your computer
- Format the SD card as FAT32
- Check SD card is not write-protected
- Try a different SD card (some cards are incompatible)

**Files not appearing:**
- Check filename format (8.3 format works best)
- Avoid long filenames, spaces, or special characters
- Verify the file extension (.gcode, .nc, or .g)
- Check the file is in the root directory

**Print starts but stops immediately:**
- Check G-code file is not corrupted
- Verify temperatures are being reached
- Send `M27` to check SD print status

### Print Quality Issues

**First layer not adhering:**
- Level the bed
- Adjust Z-offset (closer to bed)
- Clean the print surface
- Use adhesion aids (glue stick, hairspray, blue tape)

**Print fails mid-way:**
- Check filament hasn't run out or tangled
- Verify temperatures remain stable
- Check for loose belts or mechanical issues
- If USB tethered: ensure computer didn't sleep

**Layer shifting:**
- Check belt tension
- Reduce print speed
- Check for mechanical obstructions
- Verify stepper motor currents

**Stringing or blobs:**
- Enable retraction in CURA
- Reduce printing temperature
- Increase travel speed
- Adjust retraction distance and speed

### USB Connection Issues

**Lost connection during print:**
- This is why SD card printing is recommended for long prints!
- Check USB cable quality
- Avoid USB hubs, connect directly
- Check for loose connections
- Prevent computer from sleeping
- Close other programs that might interfere

## Tips for Successful Prints

### General Tips
- Always watch the first layer - it's critical for success
- Clean the print bed before each print
- Store filament in a dry place to prevent moisture absorption
- Keep the printer in a draft-free area for better temperature stability

### For Long Prints
- **Use SD card printing** to avoid USB connection issues
- Test your G-code with a small test print first
- Ensure adequate filament is loaded (check spool)
- Consider printing during times when power outages are unlikely
- If available, use power loss recovery features

### Bed Adhesion
- Clean bed with isopropyl alcohol before printing
- Level the bed regularly (especially after moving the printer)
- Update the bed leveling mesh with `G29` if print area changes
- Apply adhesion aids if needed (PVA glue for PLA, etc.)

### Maintenance Between Prints
- Check for filament debris around the extruder
- Wipe the nozzle with brass brush while hot
- Verify all axes move smoothly
- Check belt tension periodically
- Lubricate linear rods/rails as needed

## Recommended Start G-code

Add this to your CURA machine settings (or customize as needed):

```gcode
G28           ; Home all axes
G29           ; Auto bed level (if configured)
G1 Z15 F6000  ; Move Z up
M104 S{material_print_temperature_layer_0}  ; Set hotend temp
M109 S{material_print_temperature_layer_0}  ; Wait for hotend
G1 Z0.2 F3000 ; Move to first layer height
G92 E0        ; Reset extruder
G1 X10 Y10 F3000     ; Move to start position
G1 X100 E15 F1000    ; Draw purge line
G92 E0        ; Reset extruder
```

## Recommended End G-code

```gcode
M104 S0       ; Turn off hotend
G91           ; Relative positioning
G1 E-2 F2700  ; Retract filament
G1 Z10 F3000  ; Raise Z
G90           ; Absolute positioning
G28 X Y       ; Home X and Y
M84           ; Disable steppers
```

## Quick Reference Card

### Pre-Print Checklist
- [ ] G-code sliced with correct profile
- [ ] G-code copied to SD card (for long prints)
- [ ] Printer powered on and connected
- [ ] Bed cleaned and leveled
- [ ] Sufficient filament loaded
- [ ] Temperatures set correctly

### SD Card Printing Commands
```
M20                      # List files on SD card
play filename.gcode      # Start print from SD
M27                      # Check print progress
M25                      # Pause print
M24                      # Resume print
abort                    # Stop print
```

---

For software installation and initial setup, see **[INSTALLING.md](INSTALLING.md)**.  
For configuration files and firmware, see **[README.md](README.md)**.
