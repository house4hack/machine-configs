include("scripts/Cam/CamExport/CamExporter.js");
include("GCode.js");

function FoamCodeV2(documentInterface, newDocumentInterface) {
    GCode.call(this, documentInterface, newDocumentInterface);
    // cut inner contours before outer contours (default):
    this.innerBeforeOuter = true;

    // always write G-code, even if it is the same as on the previous line:
    this.alwaysWriteGCode = true;

    // split circles into two halves (default):
    this.splitFullCircles = true;

    // use ruijie.ui for global options:
    this.globalOptions = "FoamCodeV2";

    this.s = undefined;
    this.sPrev = undefined;

}

FoamCodeV2.prototype = new GCode();


FoamCodeV2.prototype.getXCode = function(value) {
    var v = value;
    if (this.getIncrementalXYZ()) {
        v -= this.xPrev;
    }
    return sprintf("X%.%1f Z%.%1f".arg(this.decimals), v,v);
};

FoamCodeV2.prototype.getYCode = function(value) {
    var v = value;
    if (this.getIncrementalXYZ()) {
        v -= this.yPrev;
    }
    return sprintf("Y%.%1f A%.%1f".arg(this.decimals), v,v);
};


FoamCodeV2.prototype.getLineNumberCode = function() {
    // don't use line numbers:
    return "";
};

FoamCodeV2.prototype.getICode = function(value) {
    return "";
};

FoamCodeV2.prototype.getJCode = function(value) {
    return "";
};

FoamCodeV2.prototype.getZCode = function(value) {
    return "";
};

FoamCodeV2.prototype.getLineSegmentLength = function() {
    return parseFloat(this.document.getVariable("Cam/LineSegmentLength", 5));
};

FoamCodeV2.prototype.getPower = function() {
    var docValue = parseFloat(this.getGlobalOption("Power", 180));
    return parseFloat(this.getLayerOption("Power", docValue));
};

FoamCodeV2.prototype.getHeatingTime = function() {
    var docValue = parseFloat(this.getGlobalOption("HeatingTime", 30));
    return parseFloat(this.getLayerOption("HeatingTime", docValue));
};
/**
 * Called in the beginning of the program.
 */
FoamCodeV2.prototype.writeHeader = function() {
    this.writeLine("G21");
    this.writeLine("G90");
    this.writeLine("G92 X0 Y0 Z0 A0");  // Use current position as the reference - Have to jog the head to position before cut
    this.writeLine("M3 S" + this.getPower());   // Set Heating Power
    this.writeLine("G4 S" + this.getHeatingTime());  // Wait for wire to heat up
    this.writeLine("G1 F" + this.getFeedrate());  // set foam cutter speed
    this.feedRateSet=true;
};

/**
 * Called in the end of the program.
 */
FoamCodeV2.prototype.writeFooter = function() {
    this.writeLine("G0 X0 Y0 Z0 A0");  // go back to start
    this.writeLine("G4 S12");          // wait for wire to complete the cut
    this.writeLine("M5");              // Turn off heating wire
};


FoamCodeV2.prototype.gotModeChange = function(m) {
    return true;
};


// G02 / G03:
FoamCodeV2.prototype.writeCircularMove = function(x, y,
    center, radius,
    startAngle, endAngle,
    isLarge, isReversed) {


    this.g = GCode.Mode.Normal;
    this.arc = new RArc(center, radius, startAngle, endAngle, isReversed)
    this.arclines = this.arc.approximateWithLines(this.getLineSegmentLength());


    for(var i=0; i<this.arclines.countVertices(); i++){
       this.x =  this.arclines.getVertexAt(i).getX();
       this.y = this.arclines.getVertexAt(i).getY();
       this.writeLine()
    }

};

FoamCodeV2.prototype.initGlobalOptionWidget = function(w) {
    switch (w.objectName) {

    case "Feedrate":
        w.addItems(["120", "140", "160", "180", "200"]);
        w.setEditText("160");
        break;

    case "LineSegmentLength":
        w.addItems(["3", "5", "10", "15"]);
        w.setEditText("5");
        break;


    case "Power":
        w.addItems(["100","145", "180", "210", "255"]);
        w.setEditText("145");

    case "HeatingTime":
        w.addItems(["8", "12", "30", "45"]);
        w.setEditText("12");

    }
};

FoamCodeV2.prototype.getFileExtensions = function() {
    return ["gco"];
};


