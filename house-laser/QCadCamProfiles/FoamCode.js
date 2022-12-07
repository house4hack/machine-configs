include("scripts/Cam/CamExport/CamExporter.js");
include("GCode.js");

function FoamCode(documentInterface, newDocumentInterface) {
    GCode.call(this, documentInterface, newDocumentInterface);
    // cut inner contours before outer contours (default):
    this.innerBeforeOuter = true;

    // always write G-code, even if it is the same as on the previous line:
    this.alwaysWriteGCode = true;

    // split circles into two halves (default):
    this.splitFullCircles = true;

    // use ruijie.ui for global options:
    this.globalOptions = "FoamCode";

    this.s = undefined;
    this.sPrev = undefined;

}

FoamCode.prototype = new GCode();


FoamCode.prototype.getXCode = function(value) {
    var v = value;
    if (this.getIncrementalXYZ()) {
        v -= this.xPrev;
    }
    return sprintf("X%.%1f Z%.%1f".arg(this.decimals), v,v);
};

FoamCode.prototype.getYCode = function(value) {
    var v = value;
    if (this.getIncrementalXYZ()) {
        v -= this.yPrev;
    }
    return sprintf("Y%.%1f E%.%1f".arg(this.decimals), v,v);
};


FoamCode.prototype.getLineNumberCode = function() {
    // don't use line numbers:
    return "";
};

FoamCode.prototype.getICode = function(value) {
    return "";
};

FoamCode.prototype.getJCode = function(value) {
    return "";
};

FoamCode.prototype.getZCode = function(value) {
    return "";
};

FoamCode.prototype.getLineSegmentLength = function() {
    return parseFloat(this.document.getVariable("Cam/LineSegmentLength", 5));
};

FoamCode.prototype.getPower = function() {
    var docValue = parseFloat(this.getGlobalOption("Power", 180));
    return parseFloat(this.getLayerOption("Power", docValue));
};

FoamCode.prototype.getHeatingTime = function() {
    var docValue = parseFloat(this.getGlobalOption("HeatingTime", 30));
    return parseFloat(this.getLayerOption("HeatingTime", docValue));
};
/**
 * Called in the beginning of the program.
 */
FoamCode.prototype.writeHeader = function() {
    this.writeLine("G21");
    this.writeLine("G90");
    this.writeLine("G92 X0 Y0 Z0 E0");  // Use current position as the reference - Have to jog the head to position before cut
    this.writeLine("M3 S" + this.getPower());   // Set Heating Power
    this.writeLine("G4 S" + this.getHeatingTime());  // Wait for wire to heat up
    this.writeLine("G1 F" + this.getFeedrate());  // set foam cutter speed
    this.feedRateSet=true;
};

/**
 * Called in the end of the program.
 */
FoamCode.prototype.writeFooter = function() {
    this.writeLine("G0 X0 Y0 Z0 E0");  // go back to start
    this.writeLine("G4 S12");          // wait for wire to complete the cut 
    this.writeLine("M5");              // Turn off heating wire 
};


FoamCode.prototype.gotModeChange = function(m) {
    return true;
};


// G02 / G03:
FoamCode.prototype.writeCircularMove = function(x, y,
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

FoamCode.prototype.initGlobalOptionWidget = function(w) {
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
        w.addItems(["100", "180", "210", "255"]);
        w.setEditText("180");

    case "HeatingTime":
        w.addItems(["8", "12", "30", "45"]);
        w.setEditText("12");
        
    }
};

FoamCode.prototype.getFileExtensions = function() {
    return ["gco"];
};


