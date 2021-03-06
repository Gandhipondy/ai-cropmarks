/***************************************************

    CUSTOM CROP MARK CREATOR v0.1

    For use with: Adobe Illustrator CS6
    Written by: Ken Sugiura
    copyright(c) Sept 2014

***************************************************/

var WINDOW,
    SETTINGS;

//
// Initialization
//

function main() {

    if (!app.activeDocument) return 1;

    WINDOW = {};
    initSettings();
    initWindowMain();

}

function initSettings() {
    var doc     = app.activeDocument,
        docUnit = getDocUnit();

    var _sData = {
        dX : new UnitValue(doc.width,  "pt"),
        dY : new UnitValue(doc.height, "pt"),
        cX : new UnitValue(0,     "in"),
        cY : new UnitValue(0,     "in"),
        bX : new UnitValue(0.125, "in"),
        bY : new UnitValue(0.125, "in"),
        sW : new UnitValue(0.25,  "pt"),
        sL : new UnitValue(0.25,  "in"),
        sO : new UnitValue(0.25,  "in")
    };

    SETTINGS = {
        docUnit       : docUnit,
        whiteOutlines : true,
        drawGuides    : false,
        debuggerOn    : false,
        setVal        : function (tag, val) {
            // EXPECTS: String tag, Number val
            // RETURNS: void
            _sData[tag] = new UnitValue(val, docUnit);
        },
        getVal        : function (tag) {
            // EXPECTS: String tag
            // RETURNS: Number value
            return _sData[tag].as(docUnit);
        },
        getPts        : function (tag) {
            // EXPECTS: String tag
            // RETURNS: Number value
            return _sData[tag].as("pt");
        }
    };

}

function initWindowMain() {
    var doc    = app.activeDocument;

    var window = new Window("dialog { \
        orientation   : 'column',            \
        alignChildren : ['fill', 'top'],     \
        preferredSize : [300, 130],          \
        text          : 'Custom Crop Marks', \
        margins       : 15,                  \
        \
        boxPanel : Panel { \
            orientation   : 'column',        \
            alignChildren : ['fill', 'top'], \
            margins       : 15,              \
            text          : 'Bounding Box',  \
            rows : Group { \
                orientation   : 'column',       \
                alignChildren : ['fill', 'top'] \
            }, \
            hr0 : Panel { \
                preferredSize : [undefined, 2] \
            }, \
            bleeds : Group { \
                orientation   : 'column',        \
                alignChildren : ['fill', 'top'], \
                st0  : StaticText {text:'Bleeds'}, \
                row0 : Group { \
                    orientation   : 'row',  \
                    alignChildren : 'left', \
                    st0 : StaticText {text:'Top:'},    \
                    bT  : EditText {value:0, text:'0', characters:10, justify:'left'}, \
                    st1 : StaticText {text:'Bottom:'}, \
                    bB  : EditText {value:0, text:'0', characters:10, justify:'left'}, \
                    st2 : StaticText {text:'Left:'},   \
                    bL  : EditText {value:0, text:'0', characters:10, justify:'left'}, \
                    st3 : StaticText {text:'Right:'},  \
                    bR  : EditText {value:0, text:'0', characters:10, justify:'left'}  \
                }, \
                row1 : Group { \
                    orientation   : 'row',  \
                    alignChildren : 'left', \
                    bC : Checkbox {text:'Centered', value:true}, \
                    li : Checkbox {text:'Linked',   value:false} \
                } \
            } \
        }, \
        strokePanel : Panel { \
            orientation   : 'column',        \
            alignChildren : ['fill', 'top'], \
            margins       : 15,              \
            text          : 'Stroke',        \
            row0 : Group { \
                orientation   : 'row',  \
                alignChildren : 'left', \
                st0 : StaticText {text:'Thickness:'}, \
                sW  : EditText {minvalue:0, value:0, text:'0', characters:10, justify:'left'}, \
                st1 : StaticText {text:'Length:'}, \
                sL  : EditText {minvalue:0, value:0, text:'0', characters:10, justify:'left'}, \
                st2 : StaticText {text:'Offset:'}, \
                sO  : EditText {minvalue:0, value:0, text:'0', characters:10, justify:'left'}  \
            }, \
            row1 : Group { \
                orientation   : 'row',  \
                alignChildren : 'left', \
                wO : Checkbox {text:'White Outlines', value:false}, \
                dG : Checkbox {text:'Draw Guides',    value:false}  \
            } \
        }, \
        bottomGroup : Group { \
            cancelButton : Button { \
                text       : 'Close',            \
                properties : {name:'cancel'},    \
                size       : [120, 24],          \
                alignment  : ['right', 'center'] \
            }, \
            startButton  : Button { \
                text       : 'Draw Crop Marks',  \
                properties : {name:'ok'},        \
                size       : [120, 24],          \
                alignment  : ['right', 'center'] \
            } \
        } \
    }");

    function createRolColHeader(parent, label) {
        var newStatic = parent.add("statictext");
        newStatic.preferredSize.width = 80;
        newStatic.text = label;
        return newStatic;
    }

    function createRowColInput(parent, label, isEdit) {
        var newCol,
            newStatic,
            newText;

        newCol = parent.add("group");
        newCol.orientation = "row";
        newCol.preferredSize.width = 80;

        newStatic = newCol.add("statictext");
        newStatic.preferredSize.width = 12;
        newStatic.text = label + ":";

        if (isEdit) {
            newText = newCol.add("edittext");
            newText.minValue   = 0;
            newText.value      = 0;
            newText.text       = "0";
            newText.characters = 10;
            newText.justify    = "left";
        }
        else {
            newText = newCol.add("statictext");
        }

        return newText;

    }

    function createRowColInputGroupsArr(parent) {
        var newRow0 = parent.add("group"),
            newRow1 = parent.add("group"),
            newRow2 = parent.add("group");

        newRow0.orientation   = "row";
        newRow0.alignChildren = ["left", "center"];
        createRolColHeader(newRow0, "Document");
        createRolColHeader(newRow0, "Crop Area");

        newRow1.orientation   = "row";
        newRow1.alignChildren = ["left", "center"];
        newRow2.orientation   = "row";
        newRow2.alignChildren = ["left", "center"];

        return [
            [
                createRowColInput(newRow1, "W", false),
                createRowColInput(newRow1, "X", true),
                createRowColInput(newRow1, "W", true)
            ],
            [
                createRowColInput(newRow2, "H", false),
                createRowColInput(newRow2, "Y", true),
                createRowColInput(newRow2, "H", true)
            ]
        ];

    }

    function createDebugPanel(parent) {
        var newPanel = parent.add("panel"),
            newText  = newPanel.add("statictext");
        newPanel.alignChildren = ["fill", "fill"];
        newPanel.margins       = 15;
        newPanel.text          = "Debug Info";
        newPanel.preferredSize.height = 20;
        newText.preferredSize = ["fill", "fill"];
        newText.scrollable    = true;
        return newText;
    }

    if (SETTINGS.debuggerOn) WINDOW.DEBUG = createDebugPanel(window);

    var boxPanelInputs = createRowColInputGroupsArr(window.boxPanel.rows);

    // Controls

    var CONTROLS = {
        DW : boxPanelInputs[0][0],
        DH : boxPanelInputs[1][0],
        PX : boxPanelInputs[0][1],
        PY : boxPanelInputs[1][1],
        CX : boxPanelInputs[0][2],
        CY : boxPanelInputs[1][2],
        LI : window.boxPanel.bleeds.row1.li,
        BC : window.boxPanel.bleeds.row1.bC,
        BT : window.boxPanel.bleeds.row0.bT,
        BB : window.boxPanel.bleeds.row0.bB,
        BL : window.boxPanel.bleeds.row0.bL,
        BR : window.boxPanel.bleeds.row0.bR,
        SL : window.strokePanel.row0.sL,
        SW : window.strokePanel.row0.sW,
        SO : window.strokePanel.row0.sO,
        WO : window.strokePanel.row1.wO,
        DG : window.strokePanel.row1.dG
    };

    var setBoxProp = (function () {
        var uT = SETTINGS.docUnit,
            dX = SETTINGS.getVal("dX"),
            dY = SETTINGS.getVal("dY"),
            cX = SETTINGS.getVal("cX"),
            cY = SETTINGS.getVal("cY"),
            bX = SETTINGS.getVal("bX"),
            bY = SETTINGS.getVal("bY");

        // Helper functions
        var setEvenCX   = function () {cX = dX - (2 * bX);},
            setEvenCY   = function () {cY = dY - (2 * bY);},
            setCenterCX = function () {if (CONTROLS.LI.value) {bX = bY; setEvenCX();}},
            setCenterCY = function () {if (CONTROLS.LI.value) {bY = bX; setEvenCY();}},
            setCenterBX = function () {setEvenCX(); setCenterCY();},
            setCenterBY = function () {setEvenCY(); setCenterCX();},
            getBB       = function () {return dY - (bY + cY);},
            getBR       = function () {return dX - (bX + cX);};

        // Crop area property setters
        var setPX = function (n) {bX = n;},
            setPY = function (n) {bY = n;},
            setCX = function (n) {
                cX = n;
                if (CONTROLS.BC.value) bX = (dX - cX) / 2;
                setCenterCY();
            },
            setCY = function (n) {
                cY = n;
                if (CONTROLS.BC.value) bY = (dY - cY) / 2;
                setCenterCX();
            },
            setBT = function (n) {
                var tmp = bY;
                bY = n;
                if (CONTROLS.BC.value) setCenterBY();
                else                   cY -= n - tmp;
            },
            setBB = function (n) {
                cY += getBB() - n;
                if (CONTROLS.BC.value) {
                    bY = getBB();
                    setCenterBY();
                }
            },
            setBL = function (n) {
                var tmp = bX;
                bX = n;
                if (CONTROLS.BC.value) setCenterBX();
                else                   cX -= n - tmp;
            },
            setBR = function (n) {
                cX += getBR() - n;
                if (CONTROLS.BC.value) {
                    bX = getBR();
                    setCenterBX();
                }
            },
            setBA = function (n) {
                bX = bY = n;
                setEvenCX();
                setEvenCY();
            };

        // Input and Update functions
        var updateControl = function (control, input, displayUnit) {
                // EXPECTS: Object control, String input, String displayUnit
                // RETURNS: Number value
                var _uV;
                if (typeof displayUnit === "undefined") displayUnit  = uT;
                if (typeof input === "undefined")       input        = control.text;
                _uV = (isValidNumber(input))?
                    new UnitValue(input, uT) :
                    new UnitValue(input);
                control.value = _uV.as(uT);
                control.text  = trimDec(_uV.as(displayUnit)) + " " + displayUnit;
                return control.value;
            },
            update        = function () {
                // EXPECTS: void
                // RETURNS: void
                updateControl(CONTROLS.PX, bX); updateControl(CONTROLS.PY, bY);
                updateControl(CONTROLS.CX, cX); updateControl(CONTROLS.CY, cY);
                updateControl(CONTROLS.BT, bY); updateControl(CONTROLS.BB, getBB());
                updateControl(CONTROLS.BL, bX); updateControl(CONTROLS.BR, getBR());
            };

        return function (tag, input, displayUnit) {
            // EXPECTS: String tag, String input, String displayUnit
            // RETURNS: void
            var n = updateControl(CONTROLS[tag], input, displayUnit);
            switch (tag) {
                case "PX" : setPX(n); break;
                case "PY" : setPY(n); break;
                case "CX" : setCX(n); break;
                case "CY" : setCY(n); break;
                case "BT" : setBT(n); break;
                case "BB" : setBB(n); break;
                case "BL" : setBL(n); break;
                case "BR" : setBR(n); break;
                case "BA" : setBA(n); break;
            }
            update();
        };

    })();

    setBoxProp("DW", SETTINGS.getVal("dX"));
    setBoxProp("DH", SETTINGS.getVal("dY"));

    CONTROLS.CX.onChange = function () {setBoxProp("CX");};
    CONTROLS.CY.onChange = function () {setBoxProp("CY");};
    CONTROLS.PX.onChange = function () {setBoxProp("PX");};
    CONTROLS.PY.onChange = function () {setBoxProp("PY");};

    CONTROLS.LI.onClick  = function () {
        CONTROLS.BC.enabled = !CONTROLS.LI.value;
        if (CONTROLS.LI.value) {
            CONTROLS.BC.value = CONTROLS.LI.value;
            CONTROLS.BC.onClick();
            setBoxProp("BA");
        }
    };
    CONTROLS.BC.onClick  = function () {
        CONTROLS.PX.enabled = CONTROLS.PY.enabled = !CONTROLS.BC.value;
        if (CONTROLS.BC.value) {
            CONTROLS.CX.onChange();
            CONTROLS.CY.onChange();
        }
    };

    CONTROLS.BT.onChange = function () {setBoxProp("BT");};
    CONTROLS.BB.onChange = function () {setBoxProp("BB");};
    CONTROLS.BL.onChange = function () {setBoxProp("BL");};
    CONTROLS.BR.onChange = function () {setBoxProp("BR");};

    CONTROLS.SW.onChange = function () {setBoxProp("SW", undefined, "pt");};
    CONTROLS.SL.onChange = function () {setBoxProp("SL");};
    CONTROLS.SO.onChange = function () {setBoxProp("SO");};

    // Buttons

    window.bottomGroup.cancelButton.onClick = function () {return window.close();};
    window.bottomGroup.startButton.onClick  = function () {

        // save settings
        SETTINGS.setVal("cX", CONTROLS.CX.value);
        SETTINGS.setVal("cY", CONTROLS.CY.value);
        SETTINGS.setVal("bX", CONTROLS.BL.value);
        SETTINGS.setVal("bY", CONTROLS.BT.value);
        SETTINGS.setVal("sW", CONTROLS.SW.value);
        SETTINGS.setVal("sL", CONTROLS.SL.value);
        SETTINGS.setVal("sO", CONTROLS.SO.value);
        SETTINGS.whiteOutlines = CONTROLS.WO.value;
        SETTINGS.drawGuides    = CONTROLS.DG.value;

        // start
        window.close();
        draw();

    };

    // Init UI

    CONTROLS.BC.onClick();
    CONTROLS.LI.onClick();
    setBoxProp("BT", SETTINGS.getVal("bY"));
    CONTROLS.BT.onChange();
    setBoxProp("BL", SETTINGS.getVal("bX"));
    CONTROLS.BL.onChange();
    setBoxProp("SW", SETTINGS.getVal("sW"), "pt");
    setBoxProp("SL", SETTINGS.getVal("sL"));
    setBoxProp("SO", SETTINGS.getVal("sO"));

    WINDOW.MAIN = window;

    window.show();

}

//
// Draw Functions
//

function draw() {
    var doc   = app.activeDocument,
        layer = doc.layers.add(),
        box   = layer.pathItems.rectangle(
            SETTINGS.getPts("bY") * -1,
            SETTINGS.getPts("bX"),
            SETTINGS.getPts("cX"),
            SETTINGS.getPts("cY")
        );

    layer.name = "CROP MARKS";

    drawCropMarks(doc, layer, box);

    if (SETTINGS.drawGuides) drawGuideBox(doc, layer, box);

    box.remove();

}

function drawCropMarks(doc, layer, box) {
    var DIR = {Up : 0, Right : 1, Down : 2, Left : 3},
        sW  = SETTINGS.getPts("sW"),
        sL  = SETTINGS.getPts("sL"),
        sO  = SETTINGS.getPts("sO"),
        BLACK,
        WHITE;

    if (doc.documentColorSpace === DocumentColorSpace.CMYK) {
        BLACK = colorCMYK(40,40,40,100);
        WHITE = colorCMYK(0,0,0,0);
    }
    else {
        BLACK = colorRGB(0,0,0);
        WHITE = colorRGB(255,255,255);
    }

    function getCorner(i) {
        // EXPECTS: Number i
        // RETURNS: Array anchor
        return box.pathPoints[i].anchor.slice(0);
    }

    function drawMark(startPoint, direction, isOutline) {
        // EXPECTS: Array startPoint, DIR direction, Boolean isOutline
        // RETURNS: PathItem line
        var newLine  = layer.pathItems.add(),
            endPoint = startPoint.slice(0);

        // set line properties
        newLine.stroked      = true;
        newLine.strokeColor  = (!isOutline)? BLACK : WHITE;
        newLine.strokeWidth  = (!isOutline)? sW    : sW * 3;
        newLine.pixelAligned = false;

        // set line path
        switch (direction) {
            case DIR.Up :
                startPoint[1] -= sO;
                endPoint[1] = startPoint[1] - sL;
                break;
            case DIR.Right :
                startPoint[0] += sO;
                endPoint[0] = startPoint[0] + sL;
                break;
            case DIR.Down :
                startPoint[1] += sO;
                endPoint[1] = startPoint[1] + sL;
                break;
            case DIR.Left :
                startPoint[0] -= sO;
                endPoint[0] = startPoint[0] - sL;
                break;
        }

        newLine.setEntirePath([startPoint, endPoint]);

        // return line
        return newLine;

    }

    function drawMarks(isOutline) {
        drawMark(getCorner(0), DIR.Up, isOutline);
        drawMark(getCorner(3), DIR.Up, isOutline);
        drawMark(getCorner(3), DIR.Right, isOutline);
        drawMark(getCorner(2), DIR.Right, isOutline);
        drawMark(getCorner(2), DIR.Down, isOutline);
        drawMark(getCorner(1), DIR.Down, isOutline);
        drawMark(getCorner(1), DIR.Left, isOutline);
        drawMark(getCorner(0), DIR.Left, isOutline);
    }

    if (SETTINGS.whiteOutlines) drawMarks(true);

    drawMarks(false);

}

function drawGuideBox(doc, layer, box) {

    function drawGuide(shift, isVertical) {
        var newLine    = layer.pathItems.add(),
            startPoint = [],
            endPoint   = [];
        newLine.guides = true;
        if (isVertical) {
            startPoint[0] = endPoint[0] = shift;
            startPoint[1] = 0;
            endPoint[1]   = SETTINGS.getPts("dY") * -1;
        }
        else {
            startPoint[1] = endPoint[1] = shift * -1;
            startPoint[0] = 0;
            endPoint[0]   = SETTINGS.getPts("dX");
        }
        newLine.setEntirePath([startPoint, endPoint]);
        return newLine;
    }

    drawGuide(SETTINGS.getPts("bX"),                         true);
    drawGuide(SETTINGS.getPts("bX") + SETTINGS.getPts("cX"), true);
    drawGuide(SETTINGS.getPts("bY"),                         false);
    drawGuide(SETTINGS.getPts("bY") + SETTINGS.getPts("cY"), false);

}

//
// Utility Functions
//

function isValidNumber(s) {
    // EXPECTS: String s
    // RETURNS: Boolean
    return parseFloat(s).toString() === s.toString();
}

function trimDec(n) {
    // EXPECTS: Number n
    // RETURNS: String
    if (Math.ceil((n * 100000) % 10) > 0) return n.toFixed(4);
    else                                  return n.toString();
}

function getDocUnit() {
    // EXPECTS: void
    // RETURNS: String unit
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Centimeters: return "cm";
        case RulerUnits.Inches:      return "in";
        case RulerUnits.Millimeters: return "mm";
        case RulerUnits.Picas:       return "pc";
        case RulerUnits.Points:      return "pt";
        case RulerUnits.Qs:          return "qs";
        case RulerUnits.Pixels:      return "px";
        case RulerUnits.Unknown:     return "?";
    }
}

function colorRGB(r, g, b) {
    var newColor = new RGBColor();
    newColor.red   = r;
    newColor.green = g;
    newColor.blue  = b;
    return newColor;
}

function colorCMYK(c, m, y, k) {
    var newColor = new CMYKColor();
    newColor.cyan    = c;
    newColor.magenta = m;
    newColor.yellow  = y;
    newColor.black   = k;
    return newColor;
}

function printToDebug(s) {
    if (SETTINGS.debuggerOn) WINDOW.DEBUG.text += s + " ";
}

//
// Run
//

main();
