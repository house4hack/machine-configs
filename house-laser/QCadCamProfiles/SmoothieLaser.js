// include GCode configuration:
include("GCode.js");

// constructor: set up global settings:
function SmoothieLaser(documentInterface, newDocumentInterface) {
    GCode.call(this, documentInterface, newDocumentInterface);

    // cut inner contours before outer contours (default):
    this.innerBeforeOuter = true;

    // always write G-code, even if it is the same as on the previous line:
    this.alwaysWriteGCode = true;

    // split circles into two halves (default):
    this.splitFullCircles = true;

    // use SmoothieLaser.ui for global options:
    this.globalOptions = "SmoothieLaser";

    // use SmoothieLaser_lay.ui for layer options:
    this.layerOptions = "SmoothieLaser_lay";

    this.s = undefined;
    this.sPrev = undefined;
    this.rf = undefined;
    this.rfPrev = undefined;

  // output four decimals (e.g. 1.2345):
    this.decimals = 4;
}

SmoothieLaser.prototype = new GCode();

SmoothieLaser.prototype.initGlobalOptionWidget = function(w) {
    switch (w.objectName) {
    case "WaitTime":
        w.addItems(["0.0", "0.1", "0.2", "0.3", "0.4", "0.5", "1.0", "2.0", "3.0"]);
        w.setEditText("0.1");
        break;
    case "Feedrate":
        w.addItems(["100", "150","200", "300", "400", "500", "600", "700", "800", "1000","1500","2000", "3000","5000","10000"]);
        w.setEditText("1000");
        break;
    case "RapidFrate":
        w.addItems(["3000",  "5000", "10000", "15000", "20000"]);
        w.setEditText("10000");
        break;
    case "Power":
        w.addItems(["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]);
        w.setEditText("60");
        break;
    case "ZCutting":
        w.addItems(["0", "1", "2", "3", "3.16", "4", "4.36", "5", "6", "8", "10"]);
        w.setEditText("5");
        break;
    }
};

SmoothieLaser.prototype.initLayerOptionWidget = function(w) {
    switch (w.objectName) {

    case "Feedrate":
        w.addItems(["100","150","200", "300", "400", "500", "600", "700", "800", "1000", "1500", "3000","5000","10000"]);
        w.setEditText("1000");
        break;
    case "Power":
        w.addItems(["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]);
        w.setEditText("60");
        break;
    case "ZCutting":
        w.addItems(["0", "1", "2", "3", "3.16", "4", "4.16", "5", "6", "8", "10"]);
        w.setEditText("5");
        break;
    }
};

SmoothieLaser.prototype.getFileExtensions = function() {
    return ["gcode"];
};

SmoothieLaser.prototype.getRapidMoveCode = function() {
    return "G0";
};

SmoothieLaser.prototype.getLinearMoveCode = function() {
    return "G1";
};

SmoothieLaser.prototype.getCircularCWMoveCode = function() {
    return "G2";
};

SmoothieLaser.prototype.getCircularCCWMoveCode = function() {
    return "G3";
};

SmoothieLaser.prototype.getLineNumberCode = function() {
    // don't use line numbers:
    return "";
};

SmoothieLaser.prototype.getSCode = function(value) {
    return "S" + this.formatNumber(value);
};

SmoothieLaser.prototype.getFCode = function(value) {
    return "F" + this.formatNumber(value);
};


SmoothieLaser.prototype.getToolDownLevel = function() {
    var docValue = parseFloat(this.getGlobalOption("ZCutting", 0));
    return parseFloat(this.getLayerOption("ZCutting", docValue));
};


SmoothieLaser.prototype.getFeedrate = function() {
    var docValue = parseFloat(this.getGlobalOption("Feedrate", 1000));
    return parseFloat(this.getLayerOption("Feedrate", docValue));
};

SmoothieLaser.prototype.getRapidFeedrate = function() {
    return parseFloat(this.getGlobalOption("RapidFrate", 5000));
};


SmoothieLaser.prototype.getPower = function() {
    var docValue = parseFloat(this.getGlobalOption("Power", 60));
    return parseFloat(this.getLayerOption("Power", docValue)/100);
};

SmoothieLaser.prototype.gotPowerChange = function(s) {
    return (isNull(this.sPrev) && !isNull(s)) || (!isNull(s) && s!==this.sPrev);
};

SmoothieLaser.prototype.gotRapidFeedrateChange = function(rf) {
    return (isNull(this.rfPrev) && !isNull(rf)) || (!isNull(rf) && rf!==this.rfPrev);
};


SmoothieLaser.prototype.writeToolUp = function() {
    this.writeLine("M5 M9");                        // Disable Laser and stop air flow

    this.g = GCode.Mode.Rapid;
    //this.z = this.getToolUpLevel();
    this.toolPosition = GCode.ToolPosition.Up;
    if (this.feedRateSet!==true) {
        this.writeLine(undefined, "F" + Math.round(this.getRapidFeedrate()));
        this.feedRateSet=true;
    }
    else {
        this.writeLine();
    }
    this.toolIsUp();
};

SmoothieLaser.prototype.writeToolDown = function() {

    this.g = GCode.Mode.Rapid;
    this.z = this.getToolDownLevel();

    this.toolPosition = GCode.ToolPosition.Down;
    this.writeLine();

    this.g = GCode.Mode.Normal;
    this.writeLine("M3 M7");                      // Enable Laser and start air flow

    this.toolIsDown();
};


//##################################################

// G01:
SmoothieLaser.prototype.writeLinearMove = function(x, y) {
    this.prepareForCutting();

    this.g = GCode.Mode.Normal;
    this.x = x;
    this.y = y;

    this.f = this.getFeedrate();
    this.s = this.getPower();

    this.writeLine();
};

// G02 / G03:
SmoothieLaser.prototype.writeCircularMove = function(x, y,
    center, radius,
    startAngle, endAngle,
    isLarge, isReversed) {

    this.prepareForCutting();

    if (isReversed) {
        this.g = GCode.Mode.CircularCW;
    }
    else {
        this.g = GCode.Mode.CircularCCW;
    }

    if (this.absoluteIJ) {
        this.i = center.x;
        this.j = center.y;
    }
    else {
        this.i = center.x - this.x;
        this.j = center.y - this.y;
    }
    this.x = x;
    this.y = y;

    this.f = this.getFeedrate();
    this.s = this.getPower();

    this.writeLine();
};

GCode.prototype.writeZMove = function(z) {
    this.g = GCode.Mode.Rapid;
    this.z = z;
    this.writeLine();
};


/**
 * Called in the beginning of the program.
 */
SmoothieLaser.prototype.writeHeader = function() {
    this.toolIsUp();
//    this.f = this.getFeedrate();
    this.rf = this.getRapidFeedrate();
//    this.s = this.getPower();
    this.writeLine("G0 F" + this.rf);  // set laser rapid speed
//    this.writeLine("G1 S" + this.s + " F" + this.f);  // set laser power & speed

};

/**
 * Called in the end of the program.
 */
SmoothieLaser.prototype.writeFooter = function() {
    this.writeToolUp();
    this.writeLine("G0 X0 Y0");  // go back to start
    this.writeLine("M2");
};


/**
 * Writes the next line of the file or the given custom line with line nummer.
 *
 * \param custom string (optional) custom line contents
 * \param append string (optional) append to line contents
 */
SmoothieLaser.prototype.writeLine = function(custom, append) {
    var line = "";

    if (!isNull(custom)) {
        line = this.getLineNumberCode();
        line = this.append(line, custom);
        CamExporter.prototype.writeLine.call(this, line);
        return;
    }

    var gotModeChange = this.gotModeChange(this.g);
    var gotXMove = this.gotXMove(this.x);
    var gotYMove = this.gotYMove(this.y);
    var gotZMove = this.gotZMove(this.z);
    var gotFeedrateChange = this.gotFeedrateChange(this.f);
    var gotRapidFeedrateChange = this.gotRapidFeedrateChange(this.rf)
    var gotPowerChange = this.gotPowerChange(this.s);

    // nothing to do:
    if (this.g!==GCode.Mode.CircularCW && this.g!==GCode.Mode.CircularCCW &&
        !gotXMove && !gotYMove && !gotZMove && !gotFeedrateChange && !gotPowerChange) {
        return;
    }

    line = this.getLineNumberCode();

    switch (this.g) {
    case GCode.Mode.Rapid:
        if (gotModeChange) {
            line = this.append(line, this.getRapidMoveCode());
        }
        break;
    case GCode.Mode.Normal:
        if (gotModeChange) {
            line = this.append(line, this.getLinearMoveCode());
        }
        break;
    case GCode.Mode.CircularCW:
        line = this.append(line, this.getCircularCWMoveCode());
        break;
    case GCode.Mode.CircularCCW:
        line = this.append(line, this.getCircularCCWMoveCode());
        break;
    }

    if (gotZMove) {
        line = this.append(line, this.getZCode(this.z));
    }

    if (gotXMove || this.g===GCode.Mode.CircularCW || this.g===GCode.Mode.CircularCCW) {
        line = this.append(line, this.getXCode(this.x));
    }

    if (gotYMove || this.g===GCode.Mode.CircularCW || this.g===GCode.Mode.CircularCCW) {
        line = this.append(line, this.getYCode(this.y));
    }

    if (this.g!== GCode.Mode.Rapid && gotFeedrateChange) {
        line = this.append(line, this.getFCode(this.f));
    }

    if (this.g===GCode.Mode.Rapid && gotRapidFeedrateChange) {
        line = this.append(line, this.getFCode(this.rf));
    }


    if (this.g!==GCode.Mode.Rapid && gotPowerChange) {
        line = this.append(line, this.getSCode(this.s));
    }

    if (this.g===GCode.Mode.CircularCW || this.g===GCode.Mode.CircularCCW) {
        line = this.append(line, this.getICode(this.i));
        line = this.append(line, this.getJCode(this.j));
    }

    switch (this.g) {
    case GCode.Mode.Rapid:
        line = this.append(line, this.getRapidMoveCodePostfix());
        break;
    case GCode.Mode.Normal:
        line = this.append(line, this.getLinearMoveCodePostfix());
        break;
    case GCode.Mode.CircularCW:
        line = this.append(line, this.getCircularCWMoveCodePostfix());
        break;
    case GCode.Mode.CircularCCW:
        line = this.append(line, this.getCircularCCWMoveCodePostfix());
        break;
    }

    if (!isNull(append)) {
        line = this.append(line, append);
    }

    CamExporter.prototype.writeLine.call(this, line);

    this.xPrev = this.x;
    this.yPrev = this.y;
    this.zPrev = this.z;
    this.fPrev = this.f;
    this.rfPrev = this.rf;
    this.gPrev = this.g;
    this.sPrev = this.s;
};
