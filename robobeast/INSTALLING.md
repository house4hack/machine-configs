# RoboBeast 3D Printer Setup

This guide will help you set up the RoboBeast 3D printer with CURA slicer and Pronterface control software.

## Software Installation

### CURA Slicer

**Download:** [https://ultimaker.com/software/ultimaker-cura](https://ultimaker.com/software/ultimaker-cura)

CURA is the recommended slicer for preparing your 3D models for printing.

#### Installation Steps:
1. Download the latest version of CURA from the official website
2. Install using your system's package manager or the provided installer
3. On Linux, you may need to make the AppImage executable: `chmod +x Ultimaker_Cura-*.AppImage`

#### Importing the Beast Profile:
1. Open CURA
2. Go to **Settings → Printer → Add Printer**
3. Select **Add a non-networked printer**
4. Choose **Custom → Custom FFF printer**
5. Import the `beast profile.3mf` file from this folder:
   - **Method 1:** Go to **File → Open File(s)** and select `beast profile.3mf`
   - **Method 2:** Drag and drop the `beast profile.3mf` file into CURA
   - **Method 3:** Go to **Settings → Printer → Manage Printers → Import** and select the profile

#### Common CURA Gotchas:
- **Profile not loading:** Make sure you're using CURA 4.0 or later, as .3mf profiles are not supported in older versions
- **Wrong printer selected:** Always verify the correct printer is selected in the top-right dropdown before slicing
- **USB connection issues:** CURA can sometimes interfere with Pronterface. Close CURA when using Pronterface for printing
- **Linux permissions:** Add your user to the `dialout` group for USB access: `sudo usermod -a -G dialout $USER` (requires logout/login)

---

### Pronterface (PrintRun)

**Download:** [https://www.pronterface.com/](https://www.pronterface.com/)  
**GitHub:** [https://github.com/kliment/Printrun](https://github.com/kliment/Printrun)

Pronterface is used to control the printer directly, send G-code, and monitor printing progress.

#### Installation Steps:

**Linux (Recommended):**
```bash
# Install via package manager (Ubuntu/Debian)
sudo apt-get install printrun

# Or install via pip
pip install printrun

# Or run from source
git clone https://github.com/kliment/Printrun.git
cd Printrun
pip install -r requirements.txt
python pronterface.py
```

**Windows:**
- Download the Windows installer from [pronterface.com](https://www.pronterface.com/)
- Run the installer and follow the prompts

**macOS:**
```bash
# Install via Homebrew
brew install printrun

# Or install via pip
pip install printrun
```

#### Connecting to the Smoothieboard:
1. Connect the RoboBeast printer to your computer via USB
2. Launch Pronterface
3. In the **Port** dropdown, select the device (usually `/dev/ttyACM0` on Linux, `COM3` or similar on Windows)
4. Set **Baud rate** to `115200` (Smoothieboard default)
5. Click **Connect**
6. The console should show "Printer is now online"

#### Common Pronterface Gotchas:

**Connection Issues:**
- **Port not appearing:**
  - Linux: Check permissions with `ls -l /dev/ttyACM*`. Add user to dialout group: `sudo usermod -a -G dialout $USER` (requires logout)
  - Windows: Install CH340 or FTDI drivers depending on your USB chip
  - Verify the cable supports data transfer (not just charging)
  
- **Permission denied:**
  ```bash
  # Linux: Grant temporary access
  sudo chmod 666 /dev/ttyACM0
  
  # Better: Add user to dialout group permanently
  sudo usermod -a -G dialout $USER
  # Then logout and login again
  ```

- **Port already in use:**
  - Close CURA or any other software that might be using the serial port
  - Check for other Pronterface instances: `ps aux | grep pronterface`
  - Kill zombie processes: `sudo fuser -k /dev/ttyACM0`

**Smoothieboard Specific:**
- **Baud rate mismatch:** Smoothieboard defaults to 115200. If connection fails, verify the baud rate in the Smoothieboard config
- **No response after connecting:** Try sending `M105` (temperature request) to verify communication
- **Unexpected resets:** Some USB hubs can cause power issues. Try connecting directly to the computer
- **Firmware verification:** Send `version` command in the console to verify Smoothieboard firmware

**Print Issues:**
- **G-code not executing:** Ensure the G-code was sliced with correct printer settings (bed size, nozzle diameter, etc.)
- **Lost connection during print:** Check USB cable quality and avoid USB hubs. Consider printing from SD card if available
- **Temperature not reaching target:** Verify heater connections and PID settings in Smoothieboard config

## Workflow

1. **Prepare your model in CURA:**
   - Open your STL/OBJ file
   - Verify the Beast profile is selected
   - Adjust print settings as needed
   - Slice and save G-code

2. **Print with Pronterface:**
   - Connect to the printer
   - Home all axes (click the home buttons)
   - Heat up the nozzle to desired temperature
   - Load your G-code file (**File → Load**)
   - Click **Print** to start

3. **Monitor the print:**
   - Watch the first layer carefully
   - Use the temperature graph to monitor stability
   - Emergency stop: Click **Pause** or **Reset** if needed

## Additional Resources

- **Smoothieboard Documentation:** [http://smoothieware.org/](http://smoothieware.org/)
- **CURA Settings Guide:** [https://support.ultimaker.com/](https://support.ultimaker.com/)
- **Pronterface User Guide:** [https://github.com/kliment/Printrun/blob/master/README.md](https://github.com/kliment/Printrun/blob/master/README.md)

## Troubleshooting Checklist

- [ ] CURA has the Beast profile loaded
- [ ] USB cable is connected and working
- [ ] Correct serial port selected in Pronterface
- [ ] Baud rate set to 115200
- [ ] User is in the dialout group (Linux)
- [ ] No other software is using the serial port
- [ ] Smoothieboard is powered on
- [ ] Firmware responds to `M105` or `version` commands
