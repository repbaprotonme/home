//todo: https://obfuscator.io
//todo: safari max size

/* ++ += ==
Copyright 2017 Tom Brinkman
http://www.reportbase.comk
*/

const ISMOBILE = window.matchMedia("only screen and (max-width: 760px)").matches;
const FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const IFRAME = window !== window.parent;
const VIRTCONST = 0.8;
const MAXVIRTUAL = 5760*2;
const SWIPETIME = 20;
const THUMBORDER = 6;
const THUMBLINE = 1;
const THUMBLINEIN = 4.0;
const THUMBLINEOUT = 4.0;
const JULIETIME = 100;
const DELAY = 10000000;
const HNUB = 10;
const ALIEXTENT = 60;
const ARROWBORES = 22;
const DELAYCENTER = 3.926;
const TIMEOBJ = 3926;
const FONTHEIGHT = 16;
const MENUSELECT = "rgba(0,0,100,0.85)";
const MENUTAP = "rgba(200,0,0,0.75)";
const THUMBSELECT = "rgba(0,0,255,0.25)";
const THUMBODY = "rgba(0,0,0,1)";
const PROGRESSFILL = "rgba(255,255,255,0.75)";
const PROGRESSFALL = "rgba(0,0,0,0.5)";
const SCROLLNUB = "rgba(0,0,0,0.5)";
const SCROLLNAB = "rgba(0,0,0,0.5)";
const SCROLLBACK = "rgba(255,255,255,0.75)";
const HEADBACK = "rgba(0,0,0,0.4)";
const MENUCOLOR = "rgba(0,0,0,0.50)";
const BUTTONBACK = "rgba(0,0,0,0.25)";
const OPTIONFILL = "rgb(255,255,255)";
const THUMBFILL = "rgba(0,0,0,0.35)";
const THUMBFILL2 = "rgba(0,0,0,0.40)";
const THUMBSTROKE = "rgba(255,255,255,0.75)";
const ARROWFILL = "white";
const SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

globalobj = {};

let photo = {}
photo.image = 0;
photo.help = 0;

let loaded = new Set()

function randomNumber(min, max) { return Math.floor(Math.random() * (max - min) + min); }

let url = new URL(window.location.href);
url.time = url.searchParams.has("t") ? Number(url.searchParams.get("t")) : TIMEOBJ/2;
url.row = url.searchParams.has("r") ? Number(url.searchParams.get("r")) : 50;
url.virtualcols = url.searchParams.has("v") ? Number(url.searchParams.get("v")) : 24;
url.autostart = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 1;
url.timemain = url.searchParams.has("n") ? Number(url.searchParams.get("n")) : 4;

url.filepath = function() { return url.origin + "/data/"; }

Math.clamp = function (min, max, val)
{
    if (typeof val === "undefined" || Number.isNaN(val) || val == null)
        val = max;
    if (max < min)
        return min;
    return (val < min) ? min : (val > max) ? max : val;
};

let makeoption = function (title, data)
{
    this.title = title.toLowerCase().replace(/\./g, "");
    this.fulltitle = title;
    this.ANCHOR = 0;
    this.CURRENT = 0;
    this.data = data;
    this.length = function () { return Array.isArray(this.data) ? this.data.length : Number(this.data); };
    this.getanchor = function () { return (this.ANCHOR < this.length() &&
		Array.isArray(this.data)) ? this.data[this.ANCHOR] : this.anchor(); };

    this.getcurrent = function ()
    {
        return (this.CURRENT < this.length() &&
		    Array.isArray(this.data)) ? this.data[this.CURRENT] : this.current();
    };

    this.get = function (index)
    {
        index += this.CURRENT;
        if (index >= this.length())
            index = 0;
        else if (index < 0)
            index = this.length()-1;
        return Array.isArray(this.data) ? this.data[index] : index;
    };

    this.anchor = function () { return this.ANCHOR; };
    this.current = function () { return this.CURRENT; };

    this.print = function()
    {
        return (this.current()+1).toFixed(0)  +"-"+ this.length().toFixed(0)
    };

    this.split = function(k,j,size)
    {
        k = Math.floor(k);
        let s = j.split("-");
        let begin = Number(s[0]);
        let end = Number(s[1]);
        let mn = begin;
        let mx = end;
        let ad = (mx-mn)/size;
        if (mx == mn)
            size = 1;
        let lst = [];
        for (let n = 0; n < size; ++n, mn+=ad)
            lst.push(mn.toFixed(4));
        this.data = lst;
        this.set(k);
        this.begin = begin;
        this.end = end;
    }

    this.berp = function ()
    {
        if (this.length() == 1)
            return 0;
        return Math.berp(0,this.length()-1,this.current());
    };

    this.lerp = function ()
    {
        if (this.length() == 1)
            return 0;
        return Math.lerp(0,this.length()-1,this.current()/this.length());
    };

    this.rotate = function (index)
    {
        var L = this.length()
        let k = this.CURRENT+index;
        if (k >= L)
            k = k-L;
        else if (k < 0)
            k = L+k;
        this.CURRENT = Math.clamp(0,this.length()-1, k);
    };

    this.setanchor = function (index)
    {
        if (typeof index === "undefined" || Number.isNaN(index) || index == null)
            index = 0;
        this.ANCHOR = Math.clamp(0, this.length() - 1, index);
    };

    this.setdata = function (data)
    {
        this.data = data;
        if (this.current() >= this.length())
            this.setcurrent(this.length()-1);
    };

    this.setcurrent = function (index)
    {
        if (typeof index === "undefined" || Number.isNaN(index) || index == null)
            index = 0;
        this.CURRENT = Math.clamp(0, this.length() - 1, index);
    };

    this.set = function (index)
    {
        this.setcurrent(index);
        this.setanchor(index);
    };

    this.add = function (index)
    {
        this.set(Number(this.current())+Math.floor(index));
    };

    this.find = function (k)
    {
        let j = this.data.findIndex(function(a){return a == k;})
        if (j == -1)
            return 0;
        return this.data[j];
    }
};

var guidelst =
[
    {
        draw: function (context, rect, user, time)
        {
        },

        pan: function (context, rect, x, y, type)
        {
            var zoom = zoomobj.getcurrent()
            context.hithumb(x,y);
            var b = zoom.current() || Number(zoom.getcurrent());
            if (b)
                contextobj.reset()
            else
                context.refresh();
        }
    },
    {
        draw: function (context, rect, user, time)
        {
            context.beginPath();
            context.save();
            for (var n = 0; n < channelobj.length(); n++)
            {
                var k = channelobj.data[n];
                context.strokeStyle = "rgba(255,255,255,0.4)";
                context.lineWidth = 3;
                var j = rect.y + (k/100)*rect.height;
                context.moveTo(rect.x, j);
                context.lineTo(rect.x+rect.width, j);
            }
            context.stroke();
            context.restore();
        },

        pan: function (context, rect, x, y, type)
        {
            var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
            if (!isthumbrect)
                return;
            var index = Math.floor(((y-context.thumbrect.y)/context.thumbrect.height)
                    *channelobj.data.length);
            var row = (channelobj.data[index]/100)*rowobj.length();
            if (rowobj.current() != row)
            {
                context.hithumb(x);
                rowobj.set(row);
                contextobj.reset()
            }
            else if (type == "panleft" || type == "panright")
            {
                context.hithumb(x,y);
                context.refresh();
            }
        }
    },
    {
        draw: function (context, rect, user, time)
        {
            context.beginPath();
            context.save();

            for (var n = 0; n < colobj.length(); n++)
            {
                var k = colobj.data[n];
                context.strokeStyle = "rgba(255,255,255,0.4)";
                context.lineWidth = 3;
                var j = rect.x + (k/100)*rect.width;
                context.moveTo(j, rect.y);
                context.lineTo(j, rect.y+rect.height);
            }

            context.stroke();
            context.restore();
        },

        pan: function (context, rect, x, y, type)
        {
            var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
            if (!isthumbrect)
                return;
            var b = (y-context.thumbrect.y)/context.thumbrect.height;
            var e = Math.floor(b*rowobj.length());
            if (e != rowobj.current() && (type == "panup" || type == "pandown"))
            {
                rowobj.set(e);
                contextobj.reset();
            }

            var col = Math.floor(((x-context.thumbrect.x)/context.thumbrect.width)*colobj.length());
            if (colobj.current() != col)
            {
                colobj.set(col);
                var time = (colobj.getcurrent()/100)*context.timeobj.length();
                context.timeobj.set(time);
                context.refresh();
            }
        }
    },
    {
        draw: function (context, rect, user, time)
        {
            context.beginPath();
            context.save();

            for (var n = 0; n < colobj.length(); n++)
            {
                var k = colobj.data[n];
                context.strokeStyle = "rgba(255,255,255,0.4)";
                context.lineWidth = 3;
                var j = rect.x + (k/100)*rect.width;
                context.moveTo(j, rect.y);
                context.lineTo(j, rect.y+rect.height);
            }

            for (var n = 0; n < channelobj.length(); n++)
            {
                var k = channelobj.data[n];
                context.strokeStyle = "rgba(255,255,255,0.4)";
                context.lineWidth = 3;
                var j = rect.y + (k/100)*rect.height;
                context.moveTo(rect.x, j);
                context.lineTo(rect.x+rect.width, j);
            }

            context.stroke();
            context.restore();
        },

        pan: function (context, rect, x, y, type)
        {
            var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
            if (!isthumbrect)
                return;

            var index = Math.floor(((y-context.thumbrect.y)/context.thumbrect.height)
                    *channelobj.data.length);
            var row = (channelobj.data[index]/100)*rowobj.length();
            if (rowobj.current() != row)
            {
                context.hithumb(x);
                rowobj.set(row);
                contextobj.reset()
            }

            var col = Math.floor(((x-context.thumbrect.x)/context.thumbrect.width)*colobj.length());
            if (colobj.current() != col)
            {
                colobj.set(col);
                var time = (colobj.getcurrent()/100)*context.timeobj.length();
                context.timeobj.set(time);
                context.refresh();
            }
        }
    },
]

var colorlst =
    [
      'green', 'blue', 'orange', 'purple', 'brown',
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF',
    ];

var colorobj = new makeoption("COLOR", [...colorlst, ...colorlst, ...colorlst, ...colorlst]);
var speedxobj = new makeoption("SPEEDX", 100);
var speedyobj = new makeoption("SPEEDY", 100);
var guideobj = new makeoption("GUIDE", guidelst);
var colobj = new makeoption("COLUMNS", [0,10,20,30,40,50,60,70,80,90,99].reverse());
var channelobj = new makeoption("CHANNELS", [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,99]);

function drawslices()
{
    if (!photo.image.complete ||
        photo.image.naturalHeight == 0)
        return;

    for (var n = 0; n < 1; n++)
    {
        var context = _4cnvctx;
        var rect = context.rect();
        if (rect.width == 1)
            continue;

        if (!context.timemain && context.lastime == context.timeobj.current())
            continue;
        else
            context.lastime = context.timeobj.current();

        if (!menuenabled() && !context.pinching && !context.panning && context.timemain)
        {
            if ( context.slidestop - context.slidereduce > 0)
            {
                context.slidestop -= context.slidereduce;
                context.timeobj.rotate(context.autodirect*context.slidestop);
            }
            else
            {
                clearInterval(context.timemain);
                context.timemain  = 0;
                if (globalobj.masterload)
                {
                    masterload();
                    globalobj.masterload = 0;
                    context.refresh();
                }
            }
        }

        var stretch = stretchobj.getcurrent();
        context.virtualpinch = context.virtualwidth*stretch.getcurrent()/100;
        context.virtualeft = (context.virtualpinch-rect.width)/2-context.colwidth;
        var j = (context.colwidth/(context.colwidth+context.virtualwidth))*TIMEOBJ;
        var time = (context.timeobj.getcurrent()+j)/1000;
        var slicelst = context.sliceobj.data;
        var slice = slicelst[0];
        if (!slice)
            break;
        context.save();
        context.translate(-context.colwidth, 0);
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        var j = time+slice.time;
        var b = Math.tan(j*VIRTCONST);
        var bx = Math.berp(-1, 1, b) * context.virtualpinch - context.virtualeft;
        var extra = context.colwidth;
        var width = rect.width+extra;
        var x1,xn,s1,sn;
        for (var m = 0; m < slicelst.length; ++m)
        {
            slicelst[m].visible = 0;
            slicelst[m].stretchwidth = 0;
        }

        for (var m = 1; m < slicelst.length; ++m)
        {
            var slice = slicelst[m];
            var j = time + slice.time;
            var b = Math.tan(j*VIRTCONST);
            var bx2 = Math.berp(-1, 1, b) * context.virtualpinch - context.virtualeft;
            var stretchwidth = bx2-bx+1;
            slice.stretchwidth = stretchwidth;
            slice.bx = bx;
            if (m == 1)
            {
                x1 = slice.bx;
                s1 = stretchwidth;
            }
            else if (m == slicelst.length-1)
            {
                xn = slice.bx;
                sn = stretchwidth;
            }

            if (bx >= rect.width+context.colwidth || bx2 < context.colwidth)
            {
                bx = bx2;
                continue;
            }

            slice.visible = 1;
            slice.strechwidth = stretchwidth;
            context.drawImage(slice.canvas, slice.x, 0, context.colwidth, rect.height,
              slice.bx, 0, stretchwidth, rect.height);

            if (colorobj.enabled)
            {
                context.globalAlpha = 0.5;
                var a = new Fill(colorobj.data[m]);
                a.draw(context, new rectangle(slice.bx,0,stretchwidth,rect.height), 0, 0);
                context.globalAlpha = 1.0;
            }

            bx = bx2;
        }

        var x = xn+sn;
        var w = x1-x;
        if (x+w > context.colwidth && x < rect.width+context.colwidth)
        {
            var slice = slicelst[0];
            slice.visible = 1;
            slice.strechwidth = w;
            context.drawImage(slice.canvas, 0, 0, context.colwidth, rect.height,
                  x, 0, w, rect.height);
            if (colorobj.enabled)
            {
                context.globalAlpha = 0.5;
                var a = new Fill(colorobj.data[0]);
                a.draw(context, new rectangle(x,0,w,rect.height), 0, 0);
                context.globalAlpha = 1.0;
            }
        }

        context.restore();
        delete context.addimage;
        delete context.selectrect;
        delete context.openimage;
        delete context.delimage;
        delete context.moveprev;
        delete context.movenext;
        delete context.ignores;
        delete context.menuup;
        delete context.menuhome;
        delete context.menudown;
        delete context.login;
        delete context.logout;
        delete context.deleteimage;
        delete context.account;
        delete context.zoomctrl;
        if (context.setcolumncomplete)
        {
            if (!context.pressed && headcnv.height)
                headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);
            if (!context.pressed && footcnv.height)
                footobj.getcurrent().draw(footcnvctx, footcnvctx.rect(), 0);
            bodyobj.set(0)
            if (_8cnvctx.enabled)
            {
                bodyobj.set(2)
            }
            else if (bodyobj.enabled)
            {
                bodyobj.set(bodyobj.enabled)
            }
            else if (!context.pressed && !headobj.enabled)
            {
                thumbobj.getcurrent().draw(context, rect, 0, 0);
                bodyobj.set(1)
            }

            bodyobj.getcurrent().draw(context, rect, 0, 0);
        }

        context.setcolumncomplete = 1;
    }

    var data = [_3cnvctx,  _5cnvctx, _6cnvctx, _7cnvctx, _8cnvctx, _9cnvctx, ];
    for (var n = 0; n < data.length; n++)
    {
        var context = data[n];
        if (!context.enabled)
            continue;
        if (!context.canvas.height)
            continue;
        var time = context.timeobj.getcurrent()/1000;
        if ((context.lastime.toFixed(8) == time.toFixed(8)))
            continue;
        else
            context.lastime = Number(time.toFixed(8));

        if (context.slideshow > 0)
        {
            var k = (context.swipetype == "swipeup")?-1:1;
            context.timeobj.rotate(k*context.slideshow);
            context.slideshow -= context.slidereduce
        }
        else
        {
            context.slideshow = 0;
            clearInterval(context.timemain);
            context.timemain = 0;
        }

        var slices =  context.sliceobj.data;
        var r = context.rect();
        var w = r.width;
        var h = r.height;
        context.fillStyle = MENUCOLOR;
        context.clear();
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.visibles = [];

        for (var m = 0; m < slices.length; ++m)
        {
            var slice = slices[m];
            slice.fitwidth = 0;
            slice.fitheight = 0;
        }

        for (var m = 0; m < slices.length; ++m)
        {
            var slice = slices[m];
            slice.time = time + (m*context.delayinterval);
            var e = (context.virtualheight-r.height)/2;
            var bos = Math.tan(slice.time *VIRTCONST);
            let y = Math.berp(-1, 1, bos) * context.virtualheight;
            y -= e;
            var x = w/2;
            var j = context.buttonheight;
            if (y < -j || y >= window.innerHeight+j)
                continue;
            context.visibles.push({slice, x, y});
        }

        for (var m = 0; m < context.visibles.length; ++m)
        {
            var j = context.visibles[m];
            j.slice.center = {x: j.x, y: j.y};
            j.slice.fitwidth = 0;
            j.slice.fitheight = 0;
            context.save();
            context.translate(j.x, j.y);
            context.draw(context, context.rect(), j.slice, 0);
            context.restore();
        }
    }
}

const opts =
{
    synchronized: true,
    alpha: true,
    antialias: false,
    depth: false,
};

const opts4 =
{
    synchronized: true,
    antialias: false,
    depth: false,
};

let _1cnv = document.getElementById("_1");
let _1cnvctx = _1cnv.getContext("2d", opts);
let _2cnv = document.getElementById("_2");
let _2cnvctx = _2cnv.getContext("2d", opts);
let _3cnv = document.getElementById("_3");
let _3cnvctx = _3cnv.getContext("2d", opts);
let _4cnv = document.getElementById("_4");
let _4cnvctx = _4cnv.getContext("2d", opts4);
let _5cnv = document.getElementById("_5");
let _5cnvctx = _5cnv.getContext("2d", opts);
let _6cnv = document.getElementById("_6");
let _6cnvctx = _6cnv.getContext("2d", opts);
let _7cnv = document.getElementById("_7");
let _7cnvctx = _7cnv.getContext("2d", opts);
let _8cnv = document.getElementById("_8");
let _8cnvctx = _8cnv.getContext("2d", opts);
let _9cnv = document.getElementById("_9");
let _9cnvctx = _9cnv.getContext("2d", opts);
let headcnv = document.getElementById("head");
let headcnvctx = headcnv.getContext("2d", opts);
let footcnv = document.getElementById("foot");
let footcnvctx = footcnv.getContext("2d", opts);

let contextlst = [_1cnvctx,_2cnvctx,_3cnvctx,_4cnvctx,_5cnvctx,_6cnvctx,_7cnvctx,_8cnvctx,_9cnvctx];
let canvaslst = [];
var eventlst =
[
    {name: "_1cnvctx", mouse: "DEFAULT", guide: "DEFAULT", thumb: "DEFAULT", tap: "DEFAULT", pan: "DEFAULT", swipe: "DEFAULT", draw: "DEFAULT", wheel: "DEFAULT", contextmenu: "DEFAULT", drop: "DEFAULT", key: "DEFAULT", press: "DEFAULT", pinch: "DEFAULT"},
    {name: "_2cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "MENU", contextmenu: "DEFAULT", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT"},
    {name: "_3cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "MENU", contextmenu: "DEFAULT", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT"},
    {name: "_4cnvctx", mouse: "BOSS", guide: "GUIDE", thumb: "BOSS",  tap: "BOSS", pan: "BOSS", swipe: "BOSS", draw: "BOSS", wheel: "BOSS", contextmenu: "BOSS", drop: "BOSS", key: "BOSS", press: "BOSS", pinch: "BOSS"},
    {name: "_5cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel:  "MENU", contextmenu: "DEFAULT", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT"},
    {name: "_6cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "MENU", contextmenu: "DEFAULT",  drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT"},
    {name: "_7cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "EMENU", wheel: "MENU", contextmenu: "DEFAULT",  drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT"},
    {name: "_8cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "GMENU", wheel: "MENU", contextmenu: "DEFAULT",  drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT"},
    {name: "_9cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "MENU", contextmenu: "DEFAULT",  drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT"},
];

function seteventspanel(panel)
{
    _1ham.panel = panel;
    _2ham.panel = panel;
    _3ham.panel = panel;
    _4ham.panel = panel;
    _5ham.panel = panel;
    _6ham.panel = panel;
    _7ham.panel = panel;
    _8ham.panel = panel;
    _9ham.panel = panel;
}

function setevents(context, obj)
{
    var k = pinchlst.findIndex(function (a) { return a.name == obj.pinch });
    k = pinchlst[k];
    context.pinch_ = k.pinch;
    context.pinchstart_ = k.pinchstart;
    context.pinchend_ = k.pinchend;

    var k = droplst.findIndex(function (a) { return a.name == obj.drop });
    k = droplst[k];
    context.drop = k.drop;

    var k = keylst.findIndex(function (a) { return a.name == obj.key });
    k = keylst[k];
    context.keyup_ = k.keyup;
    context.keydown_ = k.keydown;

    var k = contextmenulst.findIndex(function (a) { return a.name == obj.contextmenu });
    k = contextmenulst[k];
    context.contextmenu = k.click;

    var k = wheelst.findIndex(function (a) { return a.name == obj.wheel });
    k = wheelst[k];
    context.wheelup_ = k.up;
    context.wheeldown_ = k.down;

    var k = mouselst.findIndex(function (a) {return a.name == obj.mouse});
    k = mouselst[k];
    context.mouse = k;

    var k = presslst.findIndex(function (a) {return a.name == obj.press});
    k = presslst[k];
    context.pressup_ = k.pressup;
    context.press_ = k.press;

    var k = swipelst.findIndex(function (a) {return a.name == obj.swipe});
    k = swipelst[k];
    context.swipeleftright_ = k.swipeleftright;
    context.swipeupdown_ = k.swipeupdown;

    var k = drawlst.findIndex(function (a) {return a.name == obj.draw});
    k = drawlst[k];
    context.draw = k.draw;

    var k = taplst.findIndex(function (a) {return a.name == obj.tap});
    k = taplst[k];
    context.tap_ = k.tap;

    var k = panlst.findIndex(function (a) {return a.name == obj.pan});
    k = panlst[k];
    context.panstart_ = k.panstart;
    context.pan_ = k.pan;
    context.panupdown_ = k.updown;
    context.panleftright_ = k.leftright;
    context.panend_ = k.panend;
}


function calculateAspectRatioFit(imgwidth, imgheight, rectwidth, rectheight)
{
	let ratio = Math.min(rectwidth/imgwidth, rectheight/imgheight);
	let imgaspectratio = imgwidth/imgheight;
	let rectaspectratio = rectwidth/rectheight;
	let xstart = 0;
	let ystart = 0;
	let width = imgwidth * ratio;
	let height = imgheight * ratio;
	if (imgaspectratio < rectaspectratio)
	{
		xstart = (rectwidth - width) / 2;
		ytart = 0;
	}
	else if (imgaspectratio > rectaspectratio)
	{
		xstart = 0;
		ystart = (rectheight - height) / 2;
	}

	return new rectangle(xstart, ystart, width, height);
}

function downloadtext(name, text)
{
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', name);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

Math.berp = function (v0, v1, t) { return (t - v0) / (v1 - v0); };
Math.lerp = function (v0, v1, t) { return (1 - t) * v0 + t * v1; };

String.prototype.clean = function()
{
	let _trimLeft  = /^\s+/,
        _trimRight = /\s+$/,
	    _multiple  = /\s+/g;
	return this.replace(_trimLeft, '').replace(_trimRight, '').replace(_multiple, ' ');
};

Array.prototype.sum = function()
{
    return this.reduce(function(a,b){return a+b;});
};

Array.prototype.move = function (from, to)
{
    this.splice(to, 0, this.splice(from, 1)[0]);
};

String.prototype.wild = function (e)
{
    let re = new RegExp("^" + e.split("*").join(".*") + "$");
    return re.test(this);
};

var PatternPanel = function ()
{
    this.draw = function (context, rect, user, time)
    {
        const cnv = document.createElement('canvas');
        const ctx = cnv.getContext('2d');
        cnv.width = 50;
        cnv.height = 50;
        ctx.fillStyle = '#fec';
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.arc(0, 0, 50, 0, .5 * Math.PI);
        ctx.stroke();
        const pattern = context.createPattern(cnv, 'repeat');
        context.fillStyle = pattern;
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
    };
};

var Empty = function()
{
    this.draw = function (context, rect, user, time)
    {
    }
};

var ScrollPanel = function(obj, rev)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = "black"
        var a = new CurrentVPanel(new Fill(SCROLLNAB), Math.min(ALIEXTENT*2, rect.height/4), rev);
        a.draw(context, rect, obj, 0);
        context.restore();
    }
}

var Centered = function (width, height, func)
{
    this.draw = function (context, rect, user, time)
    {
        var a = new Col([0,width,0],
            [
                0,
                new Row([0,height,0],
                [
                    0,
                    func,
                    0,
                ]),
                0,
            ]);
        a.draw(context, rect, user, time);
    };
};

var Message = function (width, height, title, func)
{
    this.draw = function (context, rect, user, time)
    {
        context.movenext = new rectangle()
        context.moveprev = new rectangle()
        context.ignores = [];
        context.font = "1rem Archivo Black";

        var a = new Centered(width,ALIEXTENT+height+10,
            new LayerA(
            [
                new Fill(MENUCOLOR),
                new Rectangles(),
                new RowA([ALIEXTENT,height,0],
                [
                    new Layer(
                    [
                        new Fill(MENUCOLOR),
                        new Col([ALIEXTENT,0,ALIEXTENT],
                        [
                            new Layer(
                            [
                                context.movingpage == -1 ? new Fill("rgba(0,0,150,0.75)") : 0,
                                new Rectangle(context.moveprev),
                                new Shrink(new Arrow(ARROWFILL,270),ARROWBORES,ARROWBORES),
                            ]),
                            new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                            new Layer(
                            [
                                context.movingpage == 1 ? new Fill("rgba(0,0,150,0.75)") : 0,
                                new Rectangle(context.movenext),
                                new Shrink(new Arrow(ARROWFILL,90),ARROWBORES,ARROWBORES),
                            ]),
                        ])
                    ]),
                    func,
                    new Fill("black"),
                ])
            ])
        );

        a.draw(context, rect,
        [
            0,
            context.ignores,
            [
                title,
                user,
            ]
        ], time);
    };
};

var Fill = function (color)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
        context.fillStyle = color?color:user;
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
        context.restore();
    };
};

var ProgressCircle = function (rev)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
        var percent = (1-user.berp())*100;
        let centerX = rect.x + rect.width / 2;
        let centerY = rect.y + rect.height / 2;
        let radius = rect.width / 2;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = "black"
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = PROGRESSFILL;
        context.fill();

        let startAngle = 1.5 * Math.PI;
        let unitValue = (Math.PI - 0.5 * Math.PI) / 25;
        if (percent >= 0 && percent <= 25)
            endAngle = startAngle + (percent * unitValue);
        else if (percent > 25 && percent <= 50)
            endAngle = startAngle + (percent * unitValue);
        else if (percent > 50 && percent <= 75)
            endAngle = startAngle + (percent * unitValue);
        else if (percent > 75 && percent <= 100)
            endAngle = startAngle + (percent * unitValue);

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startAngle, endAngle, false);
        context.closePath();
        context.fillStyle = PROGRESSFALL;
        context.fill();
        context.restore();
    };
};

var Stroke = function (color,width)
{
    this.draw = function (context, rect, user, time)
    {
        context.save()
        context.lineWidth = width;
        context.strokeStyle = color;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.restore();
    }
}

var Plus = function (color)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
        context.translate(rect.width/2-8,rect.height/2-6);
	    var w = rect.width
        var h = rect.height
        var x = rect.x;
        var y = rect.y;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
	    var path = new Path2D();
        x += 6;
        y -= 3;
		path.moveTo(x,y);
        x += 5;
		path.lineTo(x,y);
        y += 22;
		path.lineTo(x,y);
        x += -5;
		path.lineTo(x,y);
        y += 22;
		path.lineTo(x,y);
		context.fillStyle = color;
		context.fill(path);

        var x = rect.x-3;
        var y = rect.y+5;
		path.moveTo(x,y);
        x += 22;
		path.lineTo(x,y);
        y += 5;
		path.lineTo(x,y);
        x += -22;
		path.lineTo(x,y);
        y += 5;
		path.lineTo(x,y);
		context.fillStyle = color;
		context.fill(path);

        context.restore();
    };
};

var Minus = function (color)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
        context.translate(rect.width/2-8,rect.height/2-5);
	    var w = rect.width
        var h = rect.height
        var x = rect.x;
        var y = rect.y;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
	    var path = new Path2D();
        var x = rect.x-3;
        var y = rect.y+5;
		path.moveTo(x,y);
        x += 21;
		path.lineTo(x,y);
        y += 5;
		path.lineTo(x,y);
        x += -21;
		path.lineTo(x,y);
        y += 5;
		path.lineTo(x,y);
		context.fillStyle = color;
		context.fill(path);

        context.restore();
    };
};

var Arrow = function (color, degrees)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
	    var w = rect.width
        var h = rect.height
        var x = rect.x
        var y = rect.y
        var k = degrees == 270 ? 0 : 0;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.translate(x+w/2-k, y+h/2);
        context.rotate(degrees*Math.PI/180.0);
        context.translate(-x-w/2, -y-h/2);
	    var path = new Path2D();
		path.moveTo(rect.x+rect.width/2,rect.y);
		path.lineTo(rect.x+rect.width,rect.y+rect.height-3);
		path.lineTo(rect.x,rect.y+rect.height-3);
		context.fillStyle = color;
		context.fill(path);
        context.restore();
    };
};

function rectangle(x, y, w, h, user)
{
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.user = user;
    this.right = x+w;
    this.left = x;
    this.top = y;
    this.bottom = y+h;
}

rectangle.prototype.hitest = function (x, y)
{
    return x >= this.x && y >= this.y &&
		x < (this.x + this.width) && y < (this.y + this.height);
};

rectangle.prototype.get = function (x, y, w, h)
{
    return new rectangle(this.x + x, this.y + y, w, h);
};

rectangle.prototype.getindex = function(cols, rows, x, y)
{
    var b = (x-this.x)/this.width;
    var col = Math.floor(b*cols);
    var b = (y-this.y)/this.height;
    var row = Math.floor(b*rows);
    return cols*row+col;
}

rectangle.prototype.shrink = function (x, y)
{
	this.x += x;
	this.y += y;
	this.width -= x*2;
	this.height -= y*2;
    return this;
};

rectangle.prototype.expand = function (x, y)
{
	this.x -= x;
	this.y -= y;
	this.width += x*2;
	this.height += y*2;
    return this;
};

var addressobj = {}

addressobj.full = function ()
{
    var zoom = zoomobj.getcurrent();
    var height = heightobj.getcurrent();
    var out = url.origin;
    out +=
        "/?p="+galleryobj.getcurrent().title+
        "&h="+headobj.enabled+
        "&v="+url.virtualcols+
        "&a="+url.autostart+
        "&n="+url.timemain+
        "&s="+url.slidetop+
        "&f="+url.slidefactor+
        "&o="+Number(height.current()).toFixed(2)+
        "&z="+Number(zoom.current()).toFixed(2)+
        "&r="+(100*rowobj.berp()).toFixed(2)+
        "&t="+_4cnvctx.timeobj.current().toFixed(4);
    return out;
};

addressobj.update = function()
{
    try
    {
        clearTimeout(globalobj.addresstime);
        globalobj.addresstime = setTimeout(function()
        {
            history.replaceState(null, document.title, addressobj.full());
        }, 100);
    }
    catch(e)
    {

    }
}

history.pushState(null, null, document.URL);

CanvasRenderingContext2D.prototype.moveup = function()
{
    var context = this;
    var k = rowobj.berp()*100;
    var index = channelobj.data.findLastIndex(a=>{return a < k;})
    channelobj.set(index-1);
    var k = channelobj.berp()*rowobj.length()
    rowobj.set(k);
}

CanvasRenderingContext2D.prototype.movedown = function()
{
    var context = this;
    var k = rowobj.berp()*100;
    var index = channelobj.data.findIndex(a=>{return a > k;})
    channelobj.set(index);
    var k = channelobj.berp()*rowobj.length()
    rowobj.set(k);
}

CanvasRenderingContext2D.prototype.movepage = function(j)
{
    if (!_4cnvctx.setcolumncomplete)
        return;
    galleryobj.rotate(j);
    var path = galleryobj.getcurrent().title;
    galleryobj.rotate(-j);

    if (_4cnvctx.movingpage || !loaded.has(path) || galleryobj.length() == 1)
    {
        masterload()
        _4cnvctx.movingpage = 0;
        this.refresh();
        return;
    }

    _4cnvctx.movingpage = j;
    this.refresh();
    clearTimeout(globalobj.move);
    globalobj.move = setTimeout(function()
    {
        delete photo.image;
        _4cnvctx.setcolumncomplete = 0;
        if (rowobj.enabled)
            rowobj.set(0);
        galleryobj.rotate(j);
        contextobj.reset();
        addressobj.update();
        setTimeout(function(){_4cnvctx.movingpage = 0; _4cnvctx.refresh(); }, 200);
    }, 500);
}

CanvasRenderingContext2D.prototype.hide = function ()
{
    if (this.canvas.height == 0 && !this.enable)
        return;
    this.canvas.height = 0;
    this.enabled = 0;
};

CanvasRenderingContext2D.prototype.tab = function ()
{
    var context = this;
    context.slidestart = context.timeobj.current();
    context.slidestop = (context.timeobj.length()/context.virtualwidth)*url.slidetop;
    context.slidereduce = url.slidefactor?context.slidestop/url.slidefactor:0;
    clearInterval(context.timemain);
    context.timemain = setInterval(function () { drawslices() }, url.timemain);
}

CanvasRenderingContext2D.prototype.refresh = function ()
{
    this.lastime = -0.0000000000101010101;
    drawslices()
};

CanvasRenderingContext2D.prototype.show = function (x, y, width, height)
{
	if (this.canvas.style.left != x+"px")
	    this.canvas.style.left = x+"px";
	if (this.canvas.style.top != y+"px");
		this.canvas.style.top = y+"px";
	if (this.canvas.width != width)
	    this.canvas.width = width;
	if (this.canvas.height != height)
	    this.canvas.height = height;
};

CanvasRenderingContext2D.prototype.rect = function ()
{
    return new rectangle(0, 0, this.canvas.width, this.canvas.height);
};

CanvasRenderingContext2D.prototype.clear =
    CanvasRenderingContext2D.prototype.clear || function (rect)
    {
        if (!rect)
            rect = new rectangle(0, 0, this.canvas.width, this.canvas.height);
        this.clearRect(rect.x, rect.y, rect.width, rect.height);
    };

var makehammer = function (context, v, t)
{
    var canvas = context.canvas;
    var ham = new Hammer(canvas, { domEvents: true });
	context.ham = ham;
    ham.get("pan").set({ direction: Hammer.DIRECTION_ALL });
    ham.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
    ham.get('swipe').set({ velocity: 0.6});//0.30
	ham.get('swipe').set({ threshold: 20});//10
	ham.get('press').set({ time: 500 });//251

	ham.on("pinch", function (evt)
	{
		evt.preventDefault();
		var x = evt.center.x;
		var y = evt.center.y;
		if (typeof (ham.panel.pinch) == "function")
			ham.panel.pinch(context, evt.scale);

		context.pinchblock = 1;
		clearTimeout(globalobj.pinch);
		globalobj.pinch = setTimeout(function() { context.pinchblock = 0; }, 400);
	});

	ham.on("pinchend", function (evt)
	{
		evt.preventDefault();
		if (typeof (ham.panel.pinchend) == "function")
			ham.panel.pinchend(context);
	});

	ham.on("pinchstart", function (evt)
	{
		context.pinchblock = 1;
		evt.preventDefault();
		var x = evt.center.x;
		var y = evt.center.y;
		if (typeof (ham.panel.pinchstart) == "function")
			ham.panel.pinchstart(context,
			    new rectangle(0, 0, ham.element.width, ham.element.height), x, y);
	});

	ham.on("swipeleft swiperight", function (evt)
    {
        if ((new Date() - ham.panstart) > 200)
            return;
   	    evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.swipeleftright) == "function")
            ham.panel.swipeleftright(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y, evt);
    });

    ham.on("swipeup swipedown", function (evt)
    {
        if ((new Date() - ham.panstart) > 200)
            return;
   	    evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.swipeupdown) == "function")
            ham.panel.swipeupdown(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y, evt);
    });

    ham.element.addEventListener("auxclick", function (evt)
    {
   	    evt.preventDefault();
        var x = evt.offsetX;
        var y = evt.offsetY;
        if (typeof (ham.panel.auxclick) == "function")
            ham.panel.auxclick(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y);
    }, false);

    ham.element.addEventListener("contextmenu", function (evt)
    {
   	    evt.preventDefault();
        var x = evt.offsetX;
        var y = evt.offsetY;
        if (typeof (ham.panel.contextmenu) == "function")
            ham.panel.contextmenu(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y);
    }, false);

    ham.element.addEventListener("dragleave", function (evt)
    {
   	    evt.preventDefault();
    }, false);

    ham.element.addEventListener("dragenter", function (evt)
    {
   	    evt.preventDefault();
    }, false);

    ham.element.addEventListener("dragover", function (evt)
    {
   	    evt.preventDefault();
    }, false);

    ham.element.addEventListener("drop", function (evt)
    {
   	    evt.preventDefault();
        if (typeof (ham.panel.drop) !== "function")
            return;
        ham.panel.drop(context, evt);
    }, false);

    ham.element.addEventListener("mouseout", function (evt)
    {
        if (typeof (ham.panel.mouseout) !== "function")
            return;
        ham.panel.mouseout(context, evt);
    });

    ham.element.addEventListener("mouseenter", function (evt)
    {
        if (typeof (ham.panel.mouseenter) !== "function")
            return;
        ham.panel.mouseenter(context, evt);
    });

    ham.element.addEventListener("mousemove", function (evt)
    {
        var xj = parseInt(canvas.style.left, 10);
        var x = evt.offsetX;
        var y = evt.offsetY;
        if (typeof (ham.panel.mousemove) !== "function")
            return;
        ham.panel.mousemove(context, context.rect(), x, y);
    });

    ham.element.addEventListener("wheel", function (evt)
    {
        var xj = parseInt(canvas.style.left, 10);
        var x = evt.offsetX;
        var y = evt.offsetY;
        evt.preventDefault();
        if (evt.deltaY < 0)
        {
            if (typeof (ham.panel.wheelup) == "function")
                ham.panel.wheelup(context, x, y, evt.ctrlKey, evt.shiftKey);
        }
        else
        {
            if (typeof (ham.panel.wheeldown) == "function")
                ham.panel.wheeldown(context, x, y, evt.ctrlKey, evt.shiftKey);
        }
    });

	ham.on("press", function (evt)
    {
        evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.press) !== "function")
            return;
        var k = evt.srcEvent;
        ham.panel.press(context,
			new rectangle(0, 0, ham.element.width, ham.element.height), x, y, k.shiftKey, k.ctrlKey);
    });

    ham.on("pressup", function (evt)
    {
        evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (typeof (ham.panel.pressup) !== "function")
            return;
        var k = evt.srcEvent;
        ham.panel.pressup(context,
			new rectangle(0, 0, ham.element.width, ham.element.height), x, y, k.shiftKey, k.ctrlKey);
    });

    ham.on("panmove", function (evt)
    {
   		if (ham.pinchblock || evt.pointers.length >= 2)
			return;
        evt.preventDefault();
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, context.canvas.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, context.canvas.height - 1, evt.center.y - evt.target.offsetTop);
        if (typeof (ham.panel.panmove) == "function")
            ham.panel.panmove(context, rect, x, y);
    });

    ham.on("panend", function (evt)
    {
   		if (ham.pinchblock || evt.pointers.length >= 2)
			return;
        evt.preventDefault();
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, context.canvas.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, context.canvas.height - 1, evt.center.y - evt.target.offsetTop);
        if (typeof (ham.panel.panend) == "function")
            ham.panel.panend(context, rect, x, y);
    });

	ham.on("panstart", function (evt)
    {
   		if (ham.pinchblock || evt.pointers.length >= 2)
			return;
        evt.preventDefault();
        ham.x = evt.center.x;
        ham.y = evt.center.y;
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, context.canvas.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, context.canvas.height - 1, evt.center.y - evt.target.offsetTop);
        if (typeof (ham.panel.panstart) == "function")
            ham.panel.panstart(context, rect, x, y);
	});

    ham.on("panleft panright", function (evt)
    {
   		if (ham.pinchblock || evt.pointers.length >= 2)
			return;
        evt.preventDefault();
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, context.canvas.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, context.canvas.height - 1, evt.center.y - evt.target.offsetTop);
        if (typeof (ham.panel.panleftright) == "function")
            ham.panel.panleftright(context, rect, x, y, evt.type);
        else if (evt.type == "panleft" && typeof (ham.panel.panleft) == "function")
            ham.panel.panleft(context, rect, x, y);
        else if (evt.type == "panright" && typeof (ham.panel.panright) == "function")
            ham.panel.panright(context, rect, x, y);
    });

    ham.on("pandown panup", function (evt)
    {
   		if (ham.pinchblock || evt.pointers.length >= 2)
			return;
    	evt.preventDefault();
        var rect = new rectangle(0, 0, ham.element.width, ham.element.height);
        var x = Math.clamp(0, ham.element.width - 1, evt.center.x - evt.target.offsetLeft);
        var y = Math.clamp(0, ham.element.height - 1, evt.center.y - evt.target.offsetTop);
     	if (typeof (ham.panel.panupdown) == "function")
            ham.panel.panupdown(context, rect, x, y, evt.type);
        else if (evt.type == "panup" && typeof (ham.panel.panup) == "function")
            ham.panel.panup(context, rect, x, y);
        else if (evt.type == "pandown" && typeof (ham.panel.pandown) == "function")
            ham.panel.pandown(context, rect, x, y);
    });

    ham.on("pan", function (evt)
    {
   		if (ham.pinchblock || evt.pointers.length >= 2)
			return;
        evt.preventDefault();
		var x = evt.center.x - evt.target.offsetLeft;
		var y = evt.center.y - evt.target.offsetTop;
		if (x < 0 || x >= ham.element.width)
			return;
		if (y < 0 || y >= ham.element.height)
			return;
		if (typeof (ham.panel.pan) == "function")
			ham.panel.pan(context,
				new rectangle(0, 0, ham.element.width, ham.element.height), x, y, evt.additionalEvent);
    });

	ham.on("tap", function (evt)
    {
		ham.context = 0;
        evt.preventDefault();
        var x = evt.center.x - evt.target.offsetLeft;
        var y = evt.center.y - evt.target.offsetTop;
        if (x < 0 || x >= ham.element.width)
            return;
        if (y < 0 || y >= ham.element.height)
            return;
		if (typeof (ham.panel.tap) != "function")
			return;
        var k = evt.srcEvent;
		ham.panel.tap(context, new rectangle(0, 0, ham.element.width, ham.element.height), x, y, k.shiftKey, k.ctrlKey);
 	});

	var panel = new function () { this.draw = function () {}; }();
    ham.panel = panel;
    return ham;
};

var _1ham = makehammer(_1cnvctx,0.5,15);
var _2ham = makehammer(_2cnvctx,0.5,15);
var _3ham = makehammer(_3cnvctx,0.5,15);
var _4ham = makehammer(_4cnvctx,0.5,15);
var _5ham = makehammer(_5cnvctx,0.5,15);
var _6ham = makehammer(_6cnvctx,0.5,15);
var _7ham = makehammer(_7cnvctx,0.5,15);
var _8ham = makehammer(_8cnvctx,0.5,15);
var _9ham = makehammer(_9cnvctx,0.5,15);
var headham = makehammer(headcnvctx,0.5,15);
var footham = makehammer(footcnvctx,0.5,15);
_4ham.get('pinch').set({ enable: true });

var contextmenulst =
[
{
    name: "DEFAULT",
    up: function (context, ctrl, shift) { },
    click: function (context, rect, x, y)
    {
    },
},
{
    name: "BOSS",
    click: function (context, rect, x, y)
    {
    },
},
]

var wheelst =
[
{
    name: "DEFAULT",
    up: function (context, ctrl, shift) { },
 	down: function (context, ctrl, shift) { },
},
{
    name: "MENU",
    up: function (context, ctrl, shift)
    {
        var k = (8/context.virtualheight)*context.timeobj.length();
        context.timeobj.rotate(-k);
        context.refresh()
    },
 	down: function (context, ctrl, shift)
    {
        var k = (8/context.virtualheight)*context.timeobj.length();
        context.timeobj.rotate(k);
        context.refresh()
    },
},
{
    name: "BOSS",
    up: function (context, x, y, ctrl, shift)
    {
        var thumb = context.thumbrect && context.thumbrect.hitest(x,y);
        var isthumbrect = thumbobj.current()==0 && thumb;
        if (!headobj.enabled && isthumbrect)
        {
            context.pinching = 1;
            clearTimeout(globalobj.pinch);
            globalobj.pinch = setTimeout(function()
                {
                    context.pinching = 0;
                    context.refresh();
                }, 500);

            heightobj.getcurrent().add(1);
            context.refresh();
        }
        else if (shift)
        {
            rowobj.add(-rowobj.length()*0.01);
            contextobj.reset();
        }
        else if (ctrl)
        {
            context.slideshow = 0;
            var zoom = zoomobj.getcurrent()
            zoom.add(10);
            contextobj.reset();
        }
        else
        {
            _4cnvctx.timeobj.rotate(TIMEOBJ*0.01);
            context.refresh();
        }
	},
 	down: function (context, x, y, ctrl, shift)
    {
        var thumb = context.thumbrect && context.thumbrect.hitest(x,y);
        var isthumbrect = thumbobj.current()==0 && thumb;
        if (!headobj.enabled && isthumbrect)
        {
            context.pinching = 1;
            clearTimeout(globalobj.pinch);
            globalobj.pinch = setTimeout(function()
                {
                    context.pinching = 0;
                    context.refresh();
                }, 500);

            heightobj.getcurrent().add(-1);
            context.refresh();
        }
        else if (shift)
        {
            rowobj.add(rowobj.length()*0.01);
            contextobj.reset();
        }
        else if (ctrl)
        {
            context.slideshow = 0;
            var zoom = zoomobj.getcurrent()
            zoom.add(-10);
            contextobj.reset();
        }
        else
        {
            _4cnvctx.timeobj.rotate(-TIMEOBJ*0.01);
            context.refresh();
        }
	},
},
];

var pinchlst =
[
{
    name: "DEFAULT",
    pinch: function (context, scale) { },
    pinchend: function (context) { },
    pinchstart: function (context, rect, x, y) { },
},
{
    name: "BOSS",
    pinch: function (context, scale)
    {
        if (!headobj.enabled && context.isthumbrect)
        {
            var obj = heightobj.getcurrent();
            var data = obj.data;
            var k = Math.clamp(data[0], data[data.length-1], scale*context.heightsave);
            var j = Math.berp(data[0], data[data.length-1], k);
            var e = Math.lerp(0,obj.length(),j)/100;
            var f = Math.max(20,Math.floor(obj.length()*e));
            obj.set(f);
        }
        else
        {
            var obj = stretchobj.getcurrent();
            var data = obj.data;
            var k = Math.clamp(data[0], data[data.length-1], scale*context.pinchsave);
            var j = Math.berp(data[0], data[data.length-1], k);
            var e = Math.lerp(0,obj.length(),j)/100;
            var f = Math.max(0,Math.floor(obj.length()*e));
            obj.set(f);
        }

        context.refresh();
    },
    pinchstart: function (context, rect, x, y)
    {
        context.isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
        context.pinching = 1;
        context.heightsave = heightobj.getcurrent().getcurrent()
        var stretch = stretchobj.getcurrent()
        context.pinchsave = stretch.getcurrent()
    },
    pinchend: function (context)
    {
        setTimeout(function()
        {
            context.isthumbrect = 0;
            context.tapping = 0;
            context.pinching = 0;
            context.refresh();
            addressobj.update();
        }, 100);
    },
},
];

var rowobj = new makeoption("ROW", window.innerHeight);
rowobj.set(window.innerHeight*(url.row/100));

pretchobj = new makeoption("PORTSTRETCH", 100);
letchobj = new makeoption("LANDSTRETCH", 100);
stretchobj = new makeoption("STRETCH", [pretchobj,letchobj]);

var poomobj = new makeoption("PORTZOOM", 100);
var loomobj = new makeoption("LANDZOOM", 100);
var zoomobj = new makeoption("ZOOM", [poomobj,loomobj]);

var traitobj = new makeoption("TRAIT", 100);
var scapeobj = new makeoption("SCAPE", 100);
var heightobj = new makeoption("HEIGHT", [traitobj,scapeobj]);

function promptFile()
{
    var input = document.createElement("input");
    input.type = "file";
    input.multiple = 0;
    input.accept = "image/*";
    return new Promise(function(resolve)
    {
        document.activeElement.onfocus = function()
        {
            document.activeElement.onfocus = null;
            setTimeout(resolve, 500);
        };

        input.onchange = function()
        {
            var files = Array.from(input.files);
            return resolve(files);
        };

        input.click();
    });
}

function dropfiles(files)
{
    if (!files || !files.length)
        return;
    delete photo.image;
    _4cnvctx.setcolumncomplete = 0;
    globalobj.promptedfile = URL.createObjectURL(files[0]);
    contextobj.reset();
}

var droplst =
[
{
    name: "DEFAULT",
    drop: function (context, evt) { },
},
{
    name: "BOSS",
    drop: function (context, evt) { dropfiles(evt.dataTransfer.files); },
},
];

var panlst =
[
{
    name: "DEFAULT",
    updown: function (context, rect, x, y, type) { },
 	leftright: function (context, rect, x, y, type) { },
	pan: function (context, rect, x, y, type) { },
	panstart: function (context, rect, x, y) { },
    enabled : function() { return 1; },
	panend: function (context, rect, x, y) { }
},
{
    name: "MENU",
    updown: function (context, rect, x, y, type) { },
 	leftright: function (context, rect, x, y, type) { },
	pan: function (context, rect, x, y, type)
    {
        var jvalue = ((context.timeobj.length()/context.virtualheight)*(context.starty-y));
        var j = context.startt - jvalue;
        var len = context.timeobj.length();
        if (j < 0)
            j = len+j-1;
        else if (j >= len)
            j = j-len-1;
        j = j % context.timeobj.length();
        context.timeobj.set(j);
        context.refresh()
    },
	panstart: function (context, rect, x, y)
    {
        context.starty = y;
        context.startt = context.timeobj.current();
    },
	panend: function (context, rect, x, y)
    {
        delete context.starty;
        delete context.startt;
    }
},
{
    name: "BOSS",
    updown: function (context, rect, x, y, type) { },
 	leftright: function (context, rect, x, y, type) { },
	pan: function (context, rect, x, y, type)
	{
        if ( context.pinching )
             return;

        var pt = context.getweightedpoint(x,y);
        x = pt?pt.x:x;
        y = pt?pt.y:y;

        if (context.iszoomrect)
        {
            var zoom = zoomobj.getcurrent()
            var m = (y - context.zoomctrl.y)/context.zoomctrl.height;
            m = Math.floor((1-m)*zoom.length());
            zoom.set(m);
            contextobj.reset();
        }
        else if (context.isthumbrect && !headobj.enabled)
        {
            var k = guideobj.getcurrent();
            if (context.freepan)
            {
                k.pan(context, rect, x, y, type);
            }
            else if ((type == "panleft" || type == "panright"))
            {
                k.pan(context, rect, x, context.starty, type);
                context.startx = x;
            }
            else if ((type == "panup" || type == "pandown"))
            {
                k.pan(context, rect, context.startx, y, type);
                context.starty = y;
            }
        }
        else
        {
            if ((type == "panleft" || type == "panright"))
            {
                context.autodirect = (type == "panleft")?-1:1;
                var len = context.timeobj.length();
                var diff = context.startx-x;
                var jvalue = ((len/context.virtualwidth)*speedxobj.getcurrent())*diff;
                var j = context.startt - jvalue;
                if (j < 0)
                    j = len+j-1;
                else if (j >= len)
                    j = j-len-1;
                context.timeobj.set(j);
                context.refresh()
            }
            else if ((type == "panup" || type == "pandown"))
            {
                var zoom = zoomobj.getcurrent()
                if (Number(zoom.getcurrent()))
                {
                    var h = (rect.height*(1-zoom.getcurrent()/100))*2;
                    y = ((y/rect.height)*speedyobj.getcurrent())*h;
                    var k = panvert(rowobj, h-y);
                    if (k == -1)
                        return;
                    if (k == rowobj.anchor())
                        return;
                    rowobj.set(k);
                    contextobj.reset();
                }
            }
        }
    },
	panstart: function (context, rect, x, y)
	{
        context.startx = x;
        context.starty = y;
        context.startt = context.timeobj.current();
        var zoom = zoomobj.getcurrent()
        context.isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
        context.iszoomrect = context.zoomctrl && context.zoomctrl.hitest(x,y);
        clearInterval(context.timemain);
        context.timemain = 0;
        context.panning = 1;
        context.clearpoints();
        context.refresh();
    },
    panend: function (context, rect, x, y)
	{
        context.pressed = 0;
        context.panning = 0;
        context.isthumbrect = 0;
        context.iszoomrect = 0;
        var zoom = zoomobj.getcurrent()
        delete context.startx;
        delete context.starty;
        delete context.startt;
        delete zoom.offset;
        delete rowobj.offset;
        pageresize();
        contextobj.reset();
        addressobj.update();
    }
},
];

CanvasRenderingContext2D.prototype.clearpoints = function()
{
    this.w1 = this.w2 = this.w3 =
    this.w4 = this.w5 = this.w6 = this.w7 =
    this.w8 = this.w9 = this.w10 =
    this.w11 = this.w12 = this.w9 = this.w10 = this.w11 =
    this.w12 = this.w13 = this.w14 =
    this.w15 = this.w16 = this.w17 =
    this.w18 = this.w19 = this.w20 =
    this.w21 = this.w22 = this.w23 =
    this.w24 = this.w25 = this.w26 =
    this.w27 = this.w28 = this.w29 = this.w30 =
    this.x1 = this.x2 = this.x3 =
    this.x4 = this.x5 = this.x6 = this.x7 =
    this.x8 = this.x9 = this.x10 =
    this.x11 = this.x12 = this.x9 = this.x10 = this.x11 =
    this.x12 = this.x13 = this.x14 =
    this.x15 = this.x16 = this.x17 =
    this.x18 = this.x19 = this.x20 =
    this.x21 = this.x22 = this.x23 =
    this.x24 = this.x25 = this.x26 =
    this.x27 = this.x28 = this.x29 = this.x30 =
    this.y1 = this.y2 = this.y3 = this.y4 =
    this.y5 = this.y6 = this.y7 =
    this.y8 = this.y9 = this.y10 =
    this.y11 = this.y12 = this.y13 =
    this.y14 = this.y15 = this.y16 =
    this.y17 = this.y18 = this.y19 =
    this.y20 = this.y21 = this.y22 =
    this.y23 = this.y24 = this.y25 =
    this.y26 = this.y27 = this.y28 =
    this.y29 = this.y30 =
    0;
}

CanvasRenderingContext2D.prototype.getweightedpoint = function(x,y)
{
    this.x30 = this.x29;
    this.x29 = this.x28;
    this.x28 = this.x27;
    this.x27 = this.x26;
    this.x26 = this.x25;
    this.x25 = this.x24;
    this.x24 = this.x23;
    this.x23 = this.x22;
    this.x22 = this.x21;
    this.x21 = this.x20;
    this.x20 = this.x19;
    this.x19 = this.x18;
    this.x18 = this.x17;
    this.x17 = this.x16;
    this.x16 = this.x15;
    this.x15 = this.x14;
    this.x14 = this.x13;
    this.x13 = this.x12;
    this.x12 = this.x11;
    this.x11 = this.x10;
    this.x10 = this.x9;
    this.x9 = this.x8;
    this.x8 = this.x7;
    this.x7 = this.x6;
    this.x6 = this.x5;
    this.x5 = this.x4;
    this.x4 = this.x3;
    this.x3 = this.x2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y30 = this.y29;
    this.y29 = this.y28;
    this.y28 = this.y27;
    this.y27 = this.y26;
    this.y26 = this.y25;
    this.y25 = this.y24;
    this.y24 = this.y23;
    this.y23 = this.y22;
    this.y22 = this.y21;
    this.y21 = this.y20;
    this.y20 = this.y19;
    this.y19 = this.y18;
    this.y18 = this.y17;
    this.y17 = this.y16
    this.y16 = this.y15;
    this.y15 = this.y14;
    this.y14 = this.y14;
    this.y13 = this.y12;
    this.y12 = this.y11;
    this.y11 = this.y10;
    this.y10 = this.y9;
    this.y9 = this.y8;
    this.y8 = this.y7;
    this.y7 = this.y6;
    this.y6 = this.y5;
    this.y5 = this.y4;
    this.y4 = this.y3;
    this.y3 = this.y2;
    this.y2 = this.y1;
    this.y1 = y;

    var x,y;
    if (this.x25)
    {
        x = (this.x25+this.x24+this.x23+this.x22+this.x21+this.x20+this.x19+this.x18+this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/25;
        y = (this.y25+this.y24+this.y23+this.y22+this.y21+this.y20+this.y19+this.y18+this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/25;
    }
    else if (this.x24)
    {
        x = (this.x24+this.x23+this.x22+this.x21+this.x20+this.x19+this.x18+this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/24;
        y = (this.y24+this.y23+this.y22+this.y21+this.y20+this.y19+this.y18+this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/24;
    }
    else if (this.x23)
    {
        x = (this.x23+this.x22+this.x21+this.x20+this.x19+this.x18+this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/23;
        y = (this.y23+this.y22+this.y21+this.y20+this.y19+this.y18+this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/23;
    }
    else if (this.x22)
    {
        x = (this.x22+this.x21+this.x20+this.x19+this.x18+this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/22;
        y = (this.y22+this.y21+this.y20+this.y19+this.y18+this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/22;
    }
    else if (this.x21)
    {
        x = (this.x21+this.x20+this.x19+this.x18+this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/21;
        y = (this.y21+this.y20+this.y19+this.y18+this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/21;
    }
    else if (this.x20)
    {
        x = (this.x20+this.x19+this.x18+this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/20;
        y = (this.y20+this.y19+this.y18+this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/20;
    }
    else if (this.x19)
    {
        x = (this.x19+this.x18+this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/19;
        y = (this.y19+this.y18+this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/19;
    }
    else if (this.x18)
    {
        x = (this.x18+this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/18;
        y = (this.y18+this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/18;
    }
    else if (this.x17)
    {
        x = (this.x17+this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/17;
        y = (this.y17+this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/17;
    }
    else if (this.x16)
    {
        x = (this.x16+this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/16;
        y = (this.y16+this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/16;
    }
    else if (this.x15)
    {
        x = (this.x15+this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/15;
        y = (this.y15+this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/15;
    }
    else if (this.x14)
    {
        x = (this.x14+this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/14;
        y = (this.y14+this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/14;
    }
    else if (this.x13)
    {
        x = (this.x13+this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/13;
        y = (this.y13+this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/13;
    }
    else if (this.x12)
    {
        x = (this.x12+this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/12;
        y = (this.y12+this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/12;
     }
    else if (this.x11)
     {
        x = (this.x11+this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/11;
        y = (this.y11+this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/11;
     }
    else if (this.x10)
     {
        x = (this.x10+this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/10;
        y = (this.y10+this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/10;
     }
    else if (this.x9)
     {
        x = (this.x9+this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/9;
        y = (this.y9+this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/9;
     }
    else if (this.x8)
     {
        x = (this.x8+this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/8;
        y = (this.y8+this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/8;
     }
     if (this.x7)
     {
        x = (this.x7+this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/7;
        y = (this.y7+this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/7;
     }
    else if (this.x6)
     {
        x = (this.x6+this.x5+this.x4+this.x3+this.x2+this.x1)/6;
        y = (this.y6+this.y5+this.y4+this.y3+this.y2+this.y1)/6;
     }
    else if (this.x5)
    {
        x = (this.x5+this.x4+this.x3+this.x2+this.x1)/5;
        y = (this.y5+this.y4+this.y3+this.y2+this.y1)/5;
     }
    else if (this.x4)
    {
        x = (this.x4+this.x3+this.x2+this.x1)/4;
        y = (this.y4+this.y3+this.y2+this.y1)/4;
     }
    else if (this.x3)
     {
        x = (this.x3+this.x2+this.x1)/3;
        y = (this.y3+this.y2+this.y1)/3;
     }
    else if (this.x2)
     {
        x = (this.x2+this.x1)/2;
        y = (this.y2+this.y1)/2;
     }
    else if (this.x1)
     {
        x = (this.x1)/1;
        y = (this.y1)/1;
     }

    return {x,y}
}

var mouselst =
[
{
    name: "DEFAULT",
    down: function (evt) { },
 	out: function (evt) { },
    enter: function (evt) { },
    up: function (evt) { },
	move: function (context, rect, x, y) { },
},
{
    name: "MENU",
    down: function (evt) { },
 	up: function (evt) { },
 	enter: function (evt) { },
	out: function (context, evt) { },
	move: function (context, rect, x, y) { },
},
{
    name: "BOSS",
    down: function (evt) { },
 	ep: function (evt) { },
 	enter: function (evt) { },
	out: function (context, evt) { },
	move: function (context, rect, x, y) { }
},
];

var mouseobj = new makeoption("MOUSE", mouselst);

var presslst =
[
{
    name: "DEFAULT",
    pressup: function (context, rect, x, y) { },
    press: function (context, rect, x, y) { }
},
{
    name: "BOSS",
    pressup: function (context, rect, x, y)
    {
    },
    press: function (context, rect, x, y)
    {
        context.freepan = context.freepan?0:1;
        context.refresh();
    }
},
];

var swipelst =
[
{
    name: "DEFAULT",
    swipeleftright: function (context, rect, x, y, evt) {},
    swipeupdown: function (context, rect, x, y, evt) {},
},
{
    name: "MENU",
    swipeleftright: function (context, rect, x, y, evt) {},
    swipeupdown: function (context, rect, x, y, evt)
    {
        context.slideshow = (context.timeobj.length()/context.virtualheight)*context.rvalue*6;
        context.swipetype = evt.type;
        context.slidereduce = context.slideshow/15;
        clearInterval(context.timemain);
        context.timemain = setInterval(function () { context.refresh(); }, globalobj.timemain);
    },
},
{
    name: "BOSS",
    swipeleftright: function (context, rect, x, y, evt)
    {
        setTimeout(function()
        {
            evt.preventDefault();
            var isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
            if (!headobj.enabled && isthumbrect)
                return;
            context.autodirect = evt.type == "swipeleft"?-1:1;
            context.tab();
        }, SWIPETIME);
    },

    swipeupdown: function (context, rect, x, y, evt)
    {
    },
},
];

var keylst =
[
{
	name: "DEFAULT",
	keyup: function (evt) { },
	keydown: function (evt) { }
},
{
	name: "MENU",
	keyup: function (evt) { },
	keydown: function (evt)
	{
		var context =
            _3cnvctx.enabled ? _3cnvctx :
            _5cnvctx.enabled ? _5cnvctx :
            _6cnvctx.enabled ? _6cnvctx :
            _7cnvctx.enabled ? _7cnvctx :
			_8cnvctx.enabled ? _8cnvctx :
            _9cnvctx.enabled ? _9cnvctx :
            _4cnvctx;

		if (evt.key == "ArrowUp" || evt.key == "j")
		{
            var k = (20/context.virtualheight)*context.timeobj.length();
            context.timeobj.rotate(k);
            context.refresh()
        }
        else if (evt.key == "ArrowDown" || evt.key == "k")
		{
            var k = (20/context.virtualheight)*context.timeobj.length();
            context.timeobj.rotate(-k);
            context.refresh()
        }
        else if (evt.key == "Pageup" || evt.key == "o")
        {
            var k = (60/context.virtualheight)*context.timeobj.length();
            context.timeobj.rotate(-k);
            context.refresh()
        }
        else if (evt.key == "Pagedown" || evt.key == "p")
        {
            var k = (60/context.virtualheight)*context.timeobj.length();
            context.timeobj.rotate(k);
            context.refresh()
        }
 	}
},
{
	name: "BOSS",
	keyup: function (evt)
	{
		var context = _4cnvctx;
        context.ctrlhit = 0;
        context.shifthit = 0;
        context.refresh();
	},
	keydown: function (evt)
	{
		var context = _4cnvctx;
		var rect = context.rect();
        if (evt.ctrlKey)
            context.ctrlhit = 1;
        if (evt.shiftKey)
            context.shifthit = 1;

        context.refresh();

        if (evt.key != " " && isFinite(evt.key))
        {
            thumbpos.set(evt.key);
            context.refresh();
            evt.preventDefault();
            return false;
        }
        else if (evt.key == " ")
        {
            if (screenfull.isEnabled)
            {
                if (screenfull.isFullscreen)
                    screenfull.exit();
                else
                    screenfull.request();
            }

            pageresize();
            context.refresh();
            evt.preventDefault();
        }
        else if (evt.key == "Tab")
        {
            evt.preventDefault();
            context.autodirect = evt.shiftKey ? 1 : -1;
            context.tab();
        }
        else if (evt.key == "ArrowLeft" || evt.key == "h")
        {
            evt.preventDefault();
            context.autodirect = 1;
            context.tab();
        }
        else if (evt.key == "ArrowRight" || evt.key == "l")
        {
            context.autodirect = -1;
            evt.preventDefault();
            context.tab();
        }
        else if (evt.key == "Pageup" || evt.key == "ArrowUp" || evt.key == "k")
        {
            if (!rowobj.current())
                return;
            context.moveup();
            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "Pageup" || evt.key == "ArrowDown" || evt.key == "j" )
        {
            if (rowobj.current() >= rowobj.length()-1)
                return;
            context.movedown();
            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "\\")
        {
            headobj.enabled = 1;
            footobj.enabled = 1;
            colorobj.enabled=colorobj.enabled?0:1;
            pageresize()
            context.refresh();
        }
        else if (evt.key == "[" || evt.key == "-")
        {
            var zoom = zoomobj.getcurrent();
            if (!zoom.current())
                return;
            zoom.add(-5);
            contextobj.reset()
        }
        else if (evt.key == "]" || evt.key == "+")
        {
            var zoom = zoomobj.getcurrent();
            if (zoom.current() >= zoom.length()-1)
                return;
            zoom.add(5);
            contextobj.reset()
        }
        else if (evt.key == "Enter")
        {
            context.movepage(evt.shiftKey?-1:1);
            evt.preventDefault();
        }

        addressobj.update();
	}
},

];

CanvasRenderingContext2D.prototype.hithumb = function(x,y)
{
    if (typeof x !== "undefined")
    {
        var rect = this.thumbrect;
        var c = (x-rect.x) % rect.width;
        var b = c/rect.width;
        var e = this.sliceobj.length();
        var m = (1-b)*e;
        var j = DELAYCENTER/e;
        var time = j*m;
        var k = time % DELAYCENTER;
        var e = this.timeobj.length()*(k/DELAYCENTER);
        this.timeobj.set(e);
    }

    if (typeof y !== "undefined")
    {
        var b = (y-rect.y)/rect.height;
        var e = b*rowobj.length();
        rowobj.set(e);
    }
}

var taplst =
[
{
	name: "DEFAULT",
	tap: function (context, rect, x, y, shift, ctrl) { }
},
{
	name: "BOSS",
	tap: function (context, rect, x, y, shift, ctrl)
	{
        clearInterval(context.timemain);
        context.timemain = 0;
        if (context.moveprev && context.moveprev.hitest(x,y))
        {
            _4cnvctx.movepage(-1);
        }
        else if (context.movenext && context.movenext.hitest(x,y))
        {
            _4cnvctx.movepage(1);
        }
        else if (context.login && context.login.hitest(x,y))
        {
            authClient.redirectToLoginPage()
        }
        else if (context.zoomctrl && context.zoomctrl.hitest(x,y))
        {
            var zoom = zoomobj.getcurrent();
            var a = (y-context.zoomctrl.y)/context.zoomctrl.height;
            var b = Math.floor(zoom.length()*(1-a));
            zoom.set(b);
            contextobj.reset()
        }
        else if (context.deleteimage && context.deleteimage.hitest(x,y))
        {
        }
        else if (context.logout && context.logout.hitest(x,y))
        {
            authClient.logout(false)
        }
        else if (context.account && context.account.hitest(x,y))
        {
            authClient.redirectToAccountPage()
        }
        else if (context.menudown && context.menudown.hitest(x,y))
        {
            var context = _8cnvctx;
            context.slideshow = (context.timeobj.length()/context.virtualheight)*context.rvalue*18;
            context.swipetype = "swipedown";
            context.slidereduce = context.slideshow/15;
            clearInterval(context.timemain);
            context.timemain = setInterval(function () { context.refresh(); }, globalobj.timemain);
            context.refresh();
            var context = _4cnvctx;
            context.tapindex = 1;
            context.refresh();
            clearInterval(globalobj.tapthumb);
            globalobj.tapthumb = setTimeout(function()
            {
                context.tapindex = 0;
                context.refresh();
            }, 400)
        }
        else if (context.menuup && context.menuup.hitest(x,y))
        {
            var context = _8cnvctx;
            context.slideshow = (context.timeobj.length()/context.virtualheight)*context.rvalue*18;
            context.swipetype = "swipeup";
            context.slidereduce = context.slideshow/15;
            clearInterval(context.timemain);
            context.timemain = setInterval(function () { context.refresh(); }, globalobj.timemain);
            context.refresh();
            var context = _4cnvctx;
            context.tapindex = 3;
            context.refresh();
            clearInterval(globalobj.tapthumb);
            globalobj.tapthumb = setTimeout(function()
            {
                context.tapindex = 0;
                context.refresh();
            }, 400)
        }
        else if (context.addimage && context.addimage.hitest(x,y))
        {
            context.tapindex = 1;
            context.refresh();
            clearInterval(globalobj.tapthumb);
            globalobj.tapthumb = setTimeout(function()
            {
                context.tapindex = 0;
                context.refresh();
                promptFile().then(function(files) { dropfiles(files); })
            },400)
        }
        else if (context.fullscreen && context.fullscreen.hitest(x,y))
        {
            if (screenfull.isEnabled)
                screenfull.toggle();
            context.refresh();
        }
        else if (context.openimage && context.openimage.hitest(x,y))
        {
            context.tapindex = 1;
            context.refresh();
            clearInterval(globalobj.tapthumb);
            globalobj.tapthumb = setTimeout(function()
            {
                context.tapindex = 0;
                context.refresh();
                promptFile().then(function(files) { dropfiles(files); })
            }, 400)
        }
        else if (context.delimage && context.delimage.hitest(x,y))
        {
            context.tapindex = 2;
            context.refresh();
            clearInterval(globalobj.tapthumb);
            globalobj.tapthumb = setTimeout(function()
            {
                context.tapindex = 0;
                context.refresh();
            }, 400)
        }
        else if (context.menuhome && context.menuhome.hitest(x,y))
        {
            var obj = _8cnvctx.timeobj;
            var j = obj.berp() == 0 ? (1-galleryobj.berp())*TIMEOBJ : 0;
            obj.set(j);
            context.tapindex = 2;
            context.refresh();
            clearInterval(globalobj.tapthumb);
            globalobj.tapthumb = setTimeout(function()
            {
                _4cnvctx.tapindex = 0;
                _4cnvctx.refresh();
            }, 400)
        }
        else if (!headobj.enabled && context.thumbrect && context.thumbrect.hitest(x,y))
        {
            if (context.selectrect && context.selectrect.hitest(x,y)>=0)
            {
                context.tapping = context.tapping?0:1;
                context.refresh();
            }
            else
            {
                menuhide();
                context.hithumb(x,y);
                var zoom = zoomobj.getcurrent()
                var b = !Number(zoom.getcurrent()/100) && !zoom.current()
                if (!b)
                    contextobj.reset()
                context.tapping = 1;
                context.refresh();
            }
        }
        else if (context.ignores && context.ignores.hitest(x,y)>=0)
        {
             authClient.getAuthenticationInfoOrNull(false)
                .then(function(client)
                {
                     globalobj.user = client.user;
                })
        }
        else
        {
            masterhide(x, y);
        }

        addressobj.update();
    }
},
{
    name: "MENU",
    tap: function (context, rect, x, y)
    {
		var k = getbuttonfrompoint(context, x, y);
		if (k == -1)
            return;

		var slice = context.sliceobj.data[k];
		slice.tap = 1;
        context.refresh();
        setTimeout(function ()
        {
            slice.func(rect, x, y);
            slice.tap = 0;
            context.refresh();
        }, JULIETIME*5);
    },
},
];

ico = {};

Number.prototype.inrange = function(a, b)
{
    var min = Math.min(a, b),
        max = Math.max(a, b);
    return this >= min && this < max;
}

Number.prototype.pad = function(size)
{
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
	    return s;
}

var thumblst =
[
{
    name: "BOSS",
    draw: function (context, rect, user, time)
    {
        var th = heightobj.getcurrent().getcurrent();
        var headers = headcnv.height*2;
        var width = rect.width-THUMBORDER*2;
        var height = rect.height-headers-THUMBORDER*2;
        if (width < 0 || height < 0)
            return;
        var r = calculateAspectRatioFit(photo.image.width, photo.image.height, width*th, height*th);
        var h = r.height;
        var jp = 0;
        if (h < 30)
        {
            h = 30;
            jp = 1;
        }

        var w = r.width;

        if (photo.image.aspect < 1.5)
        {
            var col = thumbpos.current();
            var y = rect.height-h-footcnv.height-THUMBORDER;

            var x = rect.x+THUMBORDER;
            if (col == 1)
                x = rect.x+(rect.width-w)/2;
            else if (col == 2)
                x = rect.x+rect.width-w-THUMBORDER;
            context.thumbrect = new rectangle(x,y,w,h);
        }
        else
        {
            var x = rect.x+(rect.width-w)/2;
            var y = rect.height-h-footcnv.height-THUMBORDER;
            context.thumbrect = new rectangle(x,y,w,h);
        }

        context.save();
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        var blackfill = new Fill(THUMBFILL);

        if (context.isthumbrect && jp)
        {
            if (!context.pressed)
            {
                blackfill.draw(context, context.thumbrect, 0, 0);
                guideobj.getcurrent().draw(context, context.thumbrect, 0, 0);
            }
        }
        else if (context.pinching || context.tapping)
        {
            blackfill.draw(context, context.thumbrect, 0, 0);
            guideobj.getcurrent().draw(context, context.thumbrect, 0, 0);
        }
        else
        {
            context.drawImage(photo.image, x, y, w, h);
        }

        var r = new rectangle(x,y,w,h);
        if (!context.freepan)
        {
            var blackstroke = new Stroke("black",THUMBORDER*2);
            blackstroke.draw(context, r, 0, 0);
        }

        var whitestroke = new Stroke(THUMBSTROKE,THUMBORDER);
        whitestroke.draw(context, r, 0, 0);
        var region = new Path2D();
        region.rect(x,y,w,h);
        context.clip(region);

        var ww = Math.max(30,(rect.width/context.virtualwidth)*w);
        var stretch = stretchobj.getcurrent();
        if (stretch < 50)
            stretch = (50-stretch.getcurrent())/100;
        else
            stretch = (stretch.getcurrent()-50)/100;
        stretch = 1-stretch;
        ww *= stretch;

        var b = Math.berp(0,photo.image.height,context.imageheight);
        var hh = Math.lerp(0,h,b);
        var b = Math.berp(0,photo.image.height,context.nuby);
        var yy = y+Math.lerp(0,h,b);
        var jj = context.timeobj.berp();
        var bb = w*(1-jj);
        var xx = x+bb-ww/2;
        context.lineWidth = THUMBORDER/2;
        var r = new rectangle(xx,yy,ww,hh);
        context.selectrect = []
        context.selectrect.push(r);
        blackfill.draw(context, r, 0, 0);
        var whitestroke = new Stroke(THUMBSTROKE,THUMBORDER/2);
        whitestroke.draw(context, r, 0, 0);

        if (xx > x)//leftside
        {
            var r = new rectangle(xx-w,yy,ww,hh);
            context.selectrect.push(r);
            blackfill.draw(context, r, 0, 0);
            whitestroke.draw(context, r, 0, 0);
        }
        else if (xx < x)//right side
        {
            var r = new rectangle(w+xx,yy,ww,hh);
            context.selectrect.push(r);
            blackfill.draw(context, r, 0, 0);
            whitestroke.draw(context, r, 0, 0);
        }

        context.restore();
    },
},
];

var thumbobj = new makeoption("THUMB", thumblst);

var getbuttonfrompoint = function (context, x, y)
{
	var lst = context.sliceobj.data;

	var k;
    for (k = 0; k < lst.length; k++)
    {
		var hit = lst[k];
		if (!hit.fitwidth || !hit.fitheight)
			continue;
		var w = hit.fitwidth;
		var h = hit.fitheight + 18*2;
		var x1 = hit.center.x - w / 2;
		var y1 = hit.center.y - h / 2;
		var x2 = x1 + w;
		var y2 = y1 + h;
		if (x >= x1 && x < x2 &&
			y >= y1 && y < y2)
			break;
    }

	return k<lst.length?k:-1;
}

var drawlst =
[
{
    name: "DEFAULT",
    draw: function (context, rect, user, time){}
},
{
    name: "EMENU",
    draw: function (context, rect, user, time)
    {
        context.save();
        rect.height = context.buttonheight;
        rect.width -= 40;
        context.translate(-rect.width/2, -rect.height/2);
        user.fitwidth = rect.width;
        user.fitheight = rect.height;
        context.font = "0.9rem Archivo Black";
        var clr = SCROLLNAB;
        var str = user.title;

        if (user.tap)
        {
            clr = MENUTAP;
        }
        else if (user.path == "PROJECT")
        {
            if (user.index == galleryobj.current())
                clr = MENUSELECT;
        }

        var a = new Layer(
        [
            new Expand(new Rounded(clr, 2, "white", 8, 8), 0, 12),
            new RowA([0,20,20,20,20,0],
            [
                0,
                new Text("white", "center", "middle", 0, 0, 1),
                new Text("white", "center", "middle", 0, 0, 1),
                new Text("white", "center", "middle", 0, 0, 1),
                new Text("white", "center", "middle", 0, 0, 1),
                0,
            ]),
        ]);

        a.draw(context, rect,
        [
            0,
            user.line1,
            user.line2,
            user.line3,
            user.line4,
            0
        ], time);
        context.restore();
    }
},
{
    name: "GMENU",
    draw: function (context, rect, user, time)
    {
        context.save();
        rect.height = context.buttonheight;
        rect.width -= 40;
        context.translate(-rect.width/2, -rect.height/2);
        user.fitwidth = rect.width;
        user.fitheight = rect.height;
        context.font = "0.9rem Archivo Black";
        var clr = SCROLLNAB;
        var str = user.title;

        if (user.tap)
        {
            clr = MENUTAP;
        }
        else if (user.path == "PROJECT")
        {
            if (user.index == galleryobj.current())
                clr = MENUSELECT;
        }

        var a = new Layer(
        [
            new Expand(new Rounded(clr, 2, "white", 8, 8), 0, 12),
            new RowA([0,20,20,20,0],
            [
                0,
                new Text("white", "center", "middle", 0, 0, 1),
                new Text("white", "center", "middle", 0, 0, 1),
                new Text("white", "center", "middle", 0, 0, 1),
                0,
            ]),
        ]);

        a.draw(context, rect,
        [
            0,
            (user.index+1).toFixed(0),
            user.title,
            user.width+"x"+user.height,
            0
        ], time);
        context.restore();
    }
},
{
    name: "MENU",
    draw: function (context, rect, user, time)
    {
        context.save();
        rect.height = context.buttonheight;
        rect.width -= 40;
        context.translate(-rect.width/2, -rect.height/2);
        user.fitwidth = rect.width;
        user.fitheight = rect.height;
        context.font = "0.9rem Archivo Black";
        var clr = SCROLLNAB;
        var str = user.title;

        if (user.tap)
        {
            clr = MENUTAP;
        }
        else if (user.path == "PROJECT")
        {
            if (user.index == galleryobj.current())
                clr = MENUSELECT;
        }
        else if (!headobj.enabled && user.path == "THUMBNAIL")
        {
            if (user.id == thumbpos.current())
                clr = MENUSELECT;
        }
        else if (user.path == "INFO")
        {
            if (colorobj.enabled)
                clr = MENUSELECT;
        }
        else if (user.path == "FULLSCREEN")
        {
            if (screenfull.isFullscreen)
                clr = MENUSELECT;
        }

        var a = new Layer(
        [
            new Expand(new Rounded(clr, 2, "white", 8, 8), 0, 6),
            new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
        ]);

        a.draw(context, rect, user.title, time);
        context.restore();
    }
},
{
    name: "BOSS",
    draw: function (unused, rect, user, time)
    {
	}
},
];

function resetcanvas()
{
    window.footrect = new rectangle(0,window.innerHeight-ALIEXTENT,window.innerWidth,ALIEXTENT);
    window.headrect = new rectangle(0,0,window.innerWidth,ALIEXTENT);
    window.leftrect = new rectangle(0,0,window.innerWidth/2,window.innerHeight);
    window.rightrect = new rectangle(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight);
    window.rect = new rectangle(0,0,window.innerWidth,window.innerHeight);
    window.landscape = window.rect.width > window.rect.height?1:0;
    window.portrait = window.rect.width < window.rect.height?1:0;
    heightobj.set(window.landscape);
    stretchobj.set(window.landscape);
    zoomobj.set(window.landscape);

    thumbpos.data = []
    if (photo.image.aspect < 1.5)
    {
        var a = new Grid (3, 1, 0, new Rectangles());
        a.draw(context, window.rect, thumbpos.data, 0);
    }
    else
    {
        var a = new Grid (1, 2, 0, new Rectangles());
        a.draw(context, window.rect, thumbpos.data, 0);
    }

    if (!photo.image.height)
        return;

    var canvas = _4cnv;
    var context = _4cnvctx;
    var l = 0;
    var w = window.innerWidth;
    context.show(0, 0, window.innerWidth, window.innerHeight);

    var z = zoomobj.getcurrent().getcurrent();
    var zoom = (100-z)/100;
    context.imageheight = photo.image.height*zoom;
    var imageaspect = photo.image.width/context.imageheight;
    context.imagewidth = context.imageheight*imageaspect;
    context.virtualheight = context.canvas.height;
    context.virtualwidth = context.virtualheight * imageaspect;
    context.virtualaspect = context.virtualwidth / context.virtualheight;
    context.virtualextent = context.virtualwidth.toFixed(0) + "x" + context.virtualheight;
    context.virtualsize = ((context.virtualwidth * context.virtualheight)/1000000).toFixed(1) + "MP";
    var y = Math.clamp(0,context.canvas.height-1,context.canvas.height*rowobj.berp());
    context.nuby = Math.nub(y, context.canvas.height, context.imageheight, photo.image.height);

    const SLICERADIUS = 131000;

    let slicelst = [];
    for (let n = 499; n >= 1; n=n-1)
        slicelst.push({slices: n*3, delay: SLICERADIUS/n});
    context.slicewidth = context.virtualwidth/url.virtualcols;
    if (context.slicewidth > rect.width)
        context.slicewidth = rect.width;

    var slices = 0;
    for (; slices < slicelst.length; ++slices)
    {
        var k = slicelst[slices];
        var fw = context.virtualwidth / k.slices;
        if (fw >= context.slicewidth)
            break;
    }

    var canvaslen = SAFARI?Math.ceil(context.virtualwidth/MAXVIRTUAL):1;
    var e = slicelst[slices-1];
    var delay = e.delay;
    var slices = Math.ceil(e.slices/canvaslen);
    context.delayinterval = delay/100000;
    context.delay = e;
    var gwidth = photo.image.width/canvaslen;
    context.bwidth = context.virtualwidth/canvaslen;
    context.colwidth = context.bwidth/slices;
    var slice = 0;
    context.sliceobj.data = []
    canvaslst = []

    var j = 0;
    for (var n = 0; n < canvaslen; ++n)
    {
        var cnv = document.createElement("canvas");
        canvaslst.push(cnv);
        if (cnv.height != context.canvas.height)
            cnv.height = context.canvas.height;
        if (cnv.width != context.bwidth)
            cnv.width = context.bwidth;

        var ctx = cnv.getContext('2d');
        ctx.drawImage(photo.image,
            n*gwidth, context.nuby, gwidth, context.imageheight,
            0, 0, context.bwidth, cnv.height);

        for (var e = 0; e < slices; ++e)
        {
            var k = {};
            k.x = e*context.colwidth;
            k.p = k.x/context.virtualwidth;
            k.slice = slice;
            k.time = j;
            k.canvas = cnv;
            slice++;
            context.sliceobj.data.push(k);
            j += context.delayinterval;
        }
    }

    context.refresh();
}

var templatelst =
[
{
    name: "COMIC",
    init: function ()
    {
        rowobj.enabled = 1;
        galleryobj.maxmegapix = 4000000;
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : (window.innerWidth>window.innerHeight?100:75);
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 50;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 36;
        loomobj.split(url.zoom, "70-85", loomobj.length());
        poomobj.split(url.zoom, "35-85", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "PORTRAIT",
    init: function ()
    {
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : (window.innerWidth>window.innerHeight?100:75);
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 50;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 36;
        loomobj.split(url.zoom, "70-95", loomobj.length());
        poomobj.split(url.zoom, "35-95", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "SIDESCROLL",
    init: function ()
    {
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : 100;
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 0;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 48;
        loomobj.split(url.zoom, "0-50", loomobj.length());
        poomobj.split(url.zoom, "0-50", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "ULTRAWIDE",
    init: function ()
    {
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : 100;
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 0;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 72;
        loomobj.split(url.zoom, "0-50", loomobj.length());
        poomobj.split(url.zoom, "0-50", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "WIDE",
    init: function ()
    {
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : (window.innerWidth>window.innerHeight?75:100);
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 0;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 56;
        loomobj.split(url.zoom, "25-80", loomobj.length());
        poomobj.split(url.zoom, "0-80", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "LANDSCAPE",
    init: function (j)
    {
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : (window.innerWidth>window.innerHeight?75:100);
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 50;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 48;
        loomobj.split(url.zoom, "35-90", loomobj.length());
        poomobj.split(url.zoom, "0-90", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
   }
},
{
    name: "EXTRATALL",
    init: function ()
    {
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : 75;
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 50;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 36;
        loomobj.split(url.zoom, "90-95", loomobj.length());
        poomobj.split(url.zoom, "60-90", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "TALL",
    init: function ()
    {
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : 75;
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 50;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 36;
        loomobj.split(url.zoom, "80-90", loomobj.length());
        poomobj.split(url.zoom, "50-90", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "LEGEND",
    init: function ()
    {
        url.height = url.searchParams.has("o") ? Number(url.searchParams.get("o")) : 75;
        url.zoom = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 50;
        url.slidetop = url.searchParams.has("s") ? Number(url.searchParams.get("s")) : 24;
        url.slidefactor = url.searchParams.has("f") ? Number(url.searchParams.get("f")) : 36;
        guideobj.set(1);
        loomobj.split(url.zoom, "90-95", loomobj.length());
        poomobj.split(url.zoom, "60-90", poomobj.length());
        traitobj.split(url.height, "0.1-1.0", traitobj.length());
        scapeobj.split(url.height, "0.1-1.0", scapeobj.length());
    }
},
];

var templateobj = new makeoption("TEMPLATE", templatelst);

var bodylst =
[
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
        }
    },
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            context.save();
            context.font = "1rem Archivo Black";
            context.moveprev = new rectangle()
            context.movenext = new rectangle()
            var zoom = zoomobj.getcurrent();
            var j = headcnv.height;
            var a =
                    new Col([60,0,60],
                    [
                        j?0:new Row([90,60,0],
                        [
                            0,
                            new Layer(
                            [
                                new Rectangle(context.moveprev),
                                new Shrink(new Circle(_4cnvctx.movingpage == -1?"red":SCROLLNAB,"white",3),10,10),
                                new Shrink(new Arrow(ARROWFILL,270),22,22),
                            ]),
                            0,
                        ]),
                        0,
                        j?0:new Row([90,60,0],
                        [
                            0,
                            new Layer(
                            [
                                new Rectangle(context.movenext),
                                new Shrink(new Circle(_4cnvctx.movingpage == 1?"red":SCROLLNAB,"white",3),10,10),
                                new Shrink(new Arrow(ARROWFILL,90),22,22),
                            ]),
                            0,
                        ]),
                    ]);

            a.draw(context, rect, 0, 0);
            context.restore();
        }
    },
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            context.save();
            context.ignores = [];
            context.menuup = new rectangle()
            context.menuhome = new rectangle()
            context.menudown = new rectangle()
            context.font = "1rem Archivo Black";
            var a = new Col([0,ALIEXTENT,_8cnv.width,ALIEXTENT,0],
                    [
                        0,
                        0,
                        0,
                        new Row([0,30,ALIEXTENT,ALIEXTENT,ALIEXTENT,30,0],
                            [
                                0,
                                new Rectangles(),
                                new Layer(
                                [
                                    new Fill(context.tapindex == 1 ? "rgba(0,0,150,0.75)" : MENUCOLOR),
                                    new Rectangle(context.menudown),
                                    new Shrink(new Arrow(ARROWFILL,0),20,20),
                                ]),
                                new Layer(
                                [
                                    new Fill(context.tapindex == 2 ? "rgba(0,0,150,0.75)" : MENUCOLOR),
                                    new Rectangle(context.menuhome),
                                    new Shrink(new Circle("white"),20,20)
                                ]),
                                new Layer(
                                [
                                    new Fill(context.tapindex == 3 ? "rgba(0,0,150,0.75)" : MENUCOLOR),
                                    new Rectangle(context.menuup),
                                    new Shrink(new Arrow(ARROWFILL,180),20,20),
                                ]),
                                new Rectangles(),
                                0,
                            ]),
                        0,
                    ]);

            a.draw(context, rect, context.ignores, 0);
            context.restore();
        }
    },
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            context.addimage = new rectangle()
            context.delimage = new rectangle()
            var w = Math.min(ALIEXTENT*8,rect.width-ALIEXTENT);
            var h =  40*2;
            var a = new Message(w,h,"Upload",new RowA([0,0],
                [
                    new Layer(
                    [
                        new Rectangle(context.addimage),
                        context.tapindex == 1 ? new Fill("rgba(0,0,150,0.5)") : 0,
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                    ]),
                    new Layer(
                    [
                        new Rectangle(context.delimage),
                        context.tapindex == 2 ? new Fill("rgba(0,0,150,0.5)") : 0,
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                    ]),
                ]));

            a.draw(context, rect,
            [
                "Image ...",
                "Folder ...",
            ],
            0);
        }
    },
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            context.openimage = new rectangle()
            var w = Math.min(ALIEXTENT*8,rect.width-ALIEXTENT);
            var h = 40*1;
            var a = new Message(w,h,galleryobj.getcurrent().title,new RowA([0],
                [
                    new Layer(
                    [
                        context.tapindex == 1 ? new Fill("rgba(0,0,150,0.5)") : 0,
                        new Rectangle(context.openimage),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                    ]),
                ]));

                a.draw(context, rect,
                [
                    "Open ...",
                ],
                0);
        }
    },
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            context.save();
            context.font = "1rem Archivo Black";
            var w = Math.min(ALIEXTENT*8,rect.width-ALIEXTENT);
            var rowlst = [0,0,0,0,0,0];
            var rowheight = 40;
            rowlst.length = Math.floor(Math.min(rowlst.length,(rect.height-ALIEXTENT*3)/rowheight))
            var h = rowheight*rowlst.length;
            var title = galleryobj.getcurrent().title;
            var a = new Message(w,h,title,new RowA(rowlst,
                    [
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                    ]));

            var width = 0;
            var visibles = 0;
            var slicelst = context.sliceobj.data;
            for (var m = 0; m < slicelst.length; ++m)
            {
                if (!slicelst[m].visible)
                    continue;
                visibles += 1;
                var w = slicelst[m].stretchwidth;
                width += w;
            }

            var eff = width/rect.width;
            a.draw(context, rect,
            [
                "Image Size: "+photo.image.width+"X"+photo.image.height,
                "Virtual Size: "+context.virtualwidth.toFixed(0)+"X"+context.virtualheight,
                "Visibles: "+visibles.toFixed(0)+"-"+context.sliceobj.length(),
                "Slice Width: "+context.slicewidth.toFixed(0),
                "Efficiency: "+eff.toFixed(4),
                "Window: "+window.rect.width+"X"+window.rect.height,
            ],
            0);
         }
    },
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            context.login = new rectangle()
            context.logout = new rectangle()
            context.account = new rectangle()
            var w = Math.min(ALIEXTENT*8,rect.width-ALIEXTENT);
            var h = 40*3;
            var a = new Message(w,h,"User Account",new RowA([0,0,0],
                [
                    new Layer(
                    [
                        new Rectangle(context.login),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                    ]),
                    new Layer(
                    [
                        new Rectangle(context.logout),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                    ]),
                    new Layer(
                    [
                        new Rectangle(context.account),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                    ]),
                ]));

                a.draw(context, rect,
                [
                    "Login",
                    "Logout",
                    "Account",
                ],
                0);
        }
    },
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            context.deleteimage = new rectangle()
            var w = Math.min(ALIEXTENT*8,rect.width-ALIEXTENT);
            var h = 40*1;
            var a = new Message(w,h,"Delete",new RowA([0],
                [
                    new Layer(
                    [
                        new Rectangle(context.deleteimage),
                        new Shrink(new Text("white", "center", "middle",0, 0, 1),20,0),
                    ]),
                ]));

                a.draw(context, rect,
                [
                    "Confirm",
                ],
                0);
        }
    },
    new function()
    {
        this.draw = function (context, rect, user, time)
        {
            if (rect.height < 480)
                return;
            context.zoomctrl = new rectangle()
            context.save();
            var w = ALIEXTENT;
            var h = Math.min(640,rect.height-ALIEXTENT*4);
            var a = new Centered(w,h, new Layer(
                [
                    new Rectangle(context.zoomctrl),
                    new Fill(THUMBFILL),
                    new Stroke(THUMBSTROKE,THUMBORDER),
                    new Shrink(new CurrentVPanel(new Fill(THUMBSTROKE), ALIEXTENT, 1),5,8),
                ]));

            a.draw(context, rect, zoomobj.getcurrent(), 0);
            context.restore();
        }
    },
];

var bodyobj = new makeoption("", bodylst);
bodyobj.enabled = 4;
url.path = "HOME";
url.project = 0;
if (url.searchParams.has("p"))
{
    bodyobj.enabled = 0;
    var e = url.searchParams.get("p");
    let k = e.split(".");
    url.path = k[0].toUpperCase();
    if (k.length == 2)
        url.project = Number(k[1]);
}

var galleryobj = new makeoption("", 0);
galleryobj.mode = 0;
galleryobj.path = function()
{
    var k = galleryobj.getcurrent();
    var name = k.title;
    var w = k.width;
    var h = k.height;
    var a = w/h;

    if (w > h)
    {
        while (w*h > galleryobj.maxmegapix)
        {
            w *= 0.999;
            h = w/a;
        }
    }
    else
    {
        while (w*h > galleryobj.maxmegapix)
        {
            h *= 0.999;
            w = a*h;
        }
    }

    w = Math.floor(w);
    h = Math.floor(h);
    var q = this.quality;
    var s = 'https://reportbase.com/image/'+name+'/w='+w+',h='+h+',quality='+q;
    return s;
}

authClient = PropelAuth.createClient({authUrl: "https://auth.reportbase.com", enableBackgroundTokenRefresh: true})

var path = "https://reportbase.com/gallery/" + url.path;
fetch(path)
  .then(function (response)
  {
     return response.json();
  })
  .then(function (obj)
  {
        galleryobj = Object.assign(galleryobj,obj);
        setfavicon();

        var j = templatelst.findIndex(function(a){return a.name == obj.template;})
        templateobj.set(j);
        templateobj.getcurrent().init();

        traitobj.set(url.height);
        scapeobj.set(url.height);
        poomobj.set(url.zoom);
        loomobj.set(url.zoom);
        pretchobj.split(60, "40-90", pretchobj.length());
        letchobj.split(60, "40-90", letchobj.length());
        speedxobj.split(1.25, "1-20", speedxobj.length());
        speedyobj.split(1.25, "1-20", speedyobj.length());

        if (typeof galleryobj.quality  === "undefined")
            galleryobj.quality = 75;
        if (typeof galleryobj.galleryobj  === "undefined")
            galleryobj.maxmegapix = 9000000;

        for (var n = 0; n < contextlst.length; ++n)
        {
            var context = contextlst[n];
            context.index = n;
            context.imageSmoothingEnabled = false;
            context.freepan = 1;
            context.enabled = 0;
            context.canvas.width = 1;
            context.canvas.height = 1;
            context.autodirect = -1;
            context.font = "400 1rem Archivo Black";
            context.fillText("  ", 0, 0);
            context.slideshow = 0;
            context.lastime = 0;
            context.slidereduce = 0;
            context.slidestop = 0;
            context.buttonheight = ALIEXTENT/2;
            setevents(context, eventlst[n]);
            context.sliceobj = new makeoption("", []);
            context.timeobj = new makeoption("", TIMEOBJ);
            context.timeobj.set(TIMEOBJ/2);
        }

        var k = url.path + "." + url.project.pad(4)
        var j = galleryobj.data.findIndex(function(a){return a[0] == k;})
        if (j >= 0)
            galleryobj.set(j);

        _4cnvctx.timeobj.set(url.time);

        function project()
        {
           menuhide();
            galleryobj.set(this.index);
            window.location.href = addressobj.full();
        }

        var slices = _5cnvctx.sliceobj;
        slices.data= [];
        var items = galleryobj.length();
        for (var n = 0; n < items; ++n)
        {
            var k = galleryobj.data[n];
            slices.data.push({index:n, title:k, path: "PROJECT", func: project})
        }

        _5cnvctx.buttonheight = 240;
        _5cnvctx.delayinterval = DELAYCENTER / slices.data.length;
        _5cnvctx.rvalue = 10;
        _5cnvctx.virtualheight = slices.data.length*_5cnvctx.buttonheight;

        function thumbnail()
        {
            if (!headobj.enabled && this.id == thumbpos.current())
            {
                headobj.enabled = 1;
                footobj.enabled = 1;
            }
            else
            {
                headobj.enabled = 0;
                footobj.enabled = 0;
                thumbpos.set(this.id);
            }

            pageresize();
            _4cnvctx.refresh();
            addressobj.update();
        }

        var lst =
        [
            {
                line1: "Image Research",
                line2: "https://repba.com",
                line3: "images@repba.com",
                line4: "Tom Brinkman",
                func: function() {menuhide(); }
            },
            {
                line1: "High Resolution",
                line2: "360?? Panoramas",
                line3: "Image Stretching",
                line4: "Image Zooming",
                //Sidescrolling
                //Wrap-Around:w
                //Ultra-wide Imagas
                //Drone PHotograhy
                func: function() {menuhide(); }
            },
            {
                line1: "Image Viewer",
                line2: "Digital Art",
                line3: "Graphic Novels",
                line4: "Drone Photgraphy",
                //Sidescrolling
                //Wrap-Around:w
                //Ultra-wide Imagas
                //Drone PHotograhy
                func: function() {menuhide(); }
            },
        ];

        var slices = _7cnvctx.sliceobj;
        slices.data = lst;
        _7cnvctx.buttonheight = 240;
        _7cnvctx.delayinterval = DELAYCENTER / slices.data.length;
        _7cnvctx.virtualheight = slices.data.length*_7cnvctx.buttonheight;
        _7cnvctx.rvalue = 2;
        _7cnvctx.slidereduce = 0.75;

        var slices = _8cnvctx.sliceobj;
        slices.data = galleryobj.data;
        for (var n = 0; n < galleryobj.data.length; ++n)
        {
            var k = galleryobj.data[n];
            k.title = k[0];
            k.width = k[1];
            k.height = k[2];
            k.index = n;
            k.path = "PROJECT";
            k.func = project;
        }

        _8cnvctx.timeobj.set((1-galleryobj.berp())*TIMEOBJ);
        _8cnvctx.buttonheight = ALIEXTENT;
        _8cnvctx.delayinterval = DELAYCENTER / slices.length();
        _8cnvctx.virtualheight = slices.length()*_8cnvctx.buttonheight;
        _8cnvctx.rvalue = 2;
        _8cnvctx.slidereduce = 0.75;

        var slices = _9cnvctx.sliceobj;
        slices.data= [];
        slices.data.push({title:"Refresh", path: "REFRESH", func: function(){location.reload();}})

        slices.data.push({title:"Open", path: "OPEN", func: function()
        {
            bodyobj.enabled = 4;
            menuhide();
            _4cnvctx.refresh();
        }});

        slices.data.push({title:"Delete", path: "DELETE", func: function()
        {
            bodyobj.enabled = 7;
            menuhide();
            _4cnvctx.refresh();
        }});

        slices.data.push({title:"Information", path: "INFO", func: function(rect, x, y)
        {
            headobj.enabled = 1;
            footobj.enabled = 1;
            colorobj.enabled=colorobj.enabled?0:1;
            bodyobj.enabled = 5;
            menuhide();
            _4cnvctx.refresh();
        }})

        slices.data.push({ title:"Upload", path: "ADDIMG", func: function()
        {
            bodyobj.enabled = 3;
            menuhide();
            _4cnvctx.refresh();
        }});

        slices.data.push({ title:"Download", path: "DOWNLOAD", func: function()
        {
            context.refresh();
            var obj = galleryobj.getcurrent();
            window.open("https://reportbase.com/image/"+obj.title+"/w="+obj.width,"Reportbase");
        }});

        slices.data.push({ title:"Login", path: "LOGIN", func: function()
        {
            bodyobj.enabled = 6;
            menuhide();
            _4cnvctx.refresh();
        }});

        slices.data.push({ title:"Gallery", path: "GALLERY", func: function()
        {
            window.location.href = "https://gallery.reportbase.com";
        }});

        slices.data.push({title:"Help", path: "HELP", func: function(){menushow(_7cnvctx); }})
        slices.data.push({title:"Fullscreen", path: "FULLSCREEN", func: function ()
        {
            if (screenfull.isEnabled)
                screenfull.toggle();
        }})

        slices.data.push({ title: "Screenshot", path: "SCREENSHOT", func: function()
        {
            _4cnvctx.refresh()
            setTimeout(function()
            {
                var k = document.createElement('canvas');
                var link = document.createElement("a");
                link.href = _4cnvctx.canvas.toDataURL('image/jpg');
                link.download = galleryobj.getcurrent()[0] + ".jpg";
                link.click();
                _4cnvctx.refresh()
            }, 1000);
        }});

        _9cnvctx.delayinterval = DELAYCENTER / slices.data.length;
        _9cnvctx.virtualheight = slices.data.length*_9cnvctx.buttonheight;
        _9cnvctx.rvalue = 2;
        _9cnvctx.slidereduce = 0.75;

        _4cnvctx.enabled = 1;
        pageresize();
        contextobj.reset();
  })

var ContextObj = (function ()
{
    function init()
    {
        this.ANCHOR = 0;
        this.CURRENT = 0;
    }

    init.prototype =
	{
        anchor: function () { return this.ANCHOR; },
        current: function () { return this.CURRENT; },
        label: function () { return ""; },
        length: function () { return this.data.length; },
        enabled: function () { return 0; },
        setanchor: function (index) { this.ANCHOR = Math.clamp(0, this.length() - 1, index); },
        setcurrent: function (index) { this.CURRENT = Math.clamp(0, this.length() - 1, index); },
        getcurrent: function () { return this.data[this.current()]; },
        name: function () { return this.CURRENT.toString(); },
        title: function () { return this.CURRENT.toString(); },

		resize: function (context)
       	{
			var top = 0;
			var left = 0;
			if (!context.enabled)
			{
				context.enabled = 0
				context.canvas.height = 0;
				return;
			}

            var w = Math.min(ALIEXTENT*7,window.innerWidth-ALIEXTENT*2);
            var l = Math.floor((window.innerWidth-w)/2);
            context.show(l, 0, w, _4cnv.height);
        },

		reset: function ()
       	{
            contextobj.resetcontext4(_4cnvctx);
            setTimeout(function()
            {
                var lst = [_1cnvctx, _2cnvctx, _3cnvctx,  _5cnvctx,
                    _6cnvctx, _7cnvctx, _8cnvctx, _9cnvctx];
                for (var n = 0; n < lst.length; n++)
                {
                    var context = lst[n];
                    contextobj.resetcontext(context);
                }
            }, JULIETIME);
		},

        resetcontext4: function (context)
       	{
            if (photo.image)
            {
                contextobj.resize(context);
                resetcanvas(context);
            }
            else if (url.path)
            {
                var path =  galleryobj.path();
                if (globalobj.promptedfile)
                    path = globalobj.promptedfile;
                seteventspanel(new Empty());
                photo.image = new Image();
                photo.image.crossOrigin = 1;
                photo.image.original = path;
                photo.image.src = path;

                photo.image.onerror =
                    photo.image.onabort = function(e)
                {
                    location.reload();//todo
                    _4cnvctx.setcolumncomplete = 1;
                    contextobj.resize(context);
                    context.refresh();
                    delete globalobj.promptedfile;
                    seteventspanel(new YollPanel());
                    contextobj.reset();
                }

                photo.image.onload = function()
                {
                    this.aspect = this.width/this.height;
                    this.size = ((this.width * this.height)/1000000).toFixed(1) + "MP";
                    this.extent = this.width + "x" + this.height;
                    var e = galleryobj.getcurrent();
                    if (e[0])
                        document.title = e[0]+" ("+this.extent+")";
                    else
                        document.title = this.extent;

                    if (globalobj.promptedfile)
                    {
                        var k;
                        if (this.aspect < 0.5)
                            k = "TALL"
                        else if (this.aspect < 1.0)
                            k = "PORTRAIT"
                        else if (this.aspect < 2.0)
                            k = "LANDSCAPE"
                        else if (this.aspect < 3.0)
                            k = "WIDE"
                        else
                            k = "ULTRAWIDE"
                        var j = templatelst.findIndex(function(a){return a.name == k;})
                        templateobj.set(j);
                        templateobj.getcurrent().init();
                    }

                    var zoom = zoomobj.getcurrent();
                    if (this.aspect < 0.5)
                        zoom.set(50);
                    else if (this.aspect < 1.0)
                        zoom.set(50);
                    else if (this.aspect < 2.0)
                        zoom.set(25);
                    else
                        zoom.set(0);

                    clearInterval(context.timemain);
                    context.timemain = 0;
                    pageresize();
                    contextobj.resize(context);
                    resetcanvas(context);
                    seteventspanel(new YollPanel());
                    contextobj.reset()
                    if (url.autostart)
                    {
                        if (!_4cnvctx.movingpage)
                            context.autodirect = -1;
                        else
                            context.autodirect = _4cnvctx.movingpage==1?-1:1
                        globalobj.masterload = 1;
                        _4cnvctx.tab();
                    }
                }
			}

			return 1;
    	},
		resetcontext: function (context)
       	{
			contextobj.resize(context);
            return 1;
    	},
	};

	return init;
})();

var contextobj = new ContextObj();

function masterload()
{
    var imglst = [];
    var k = galleryobj.current();
    var size = 4;
    for (var n = 0; n < size; ++n)
    {
        galleryobj.rotate(1);
        imglst[n] = new Image();
        imglst[n].src = galleryobj.path();
        imglst[n].title = galleryobj.getcurrent().title
        imglst[n].onload = function() { loaded.add(this.title); }
    }

    galleryobj.rotate(-5);
    var img = new Image();
    img.src = galleryobj.path();
    img.path = galleryobj.getcurrent().title
    img.onload = function() { loaded.add(this.path); }
    galleryobj.set(k);
}

function gridToRect(cols, rows, margin, width, height)
{
    var rects = [];
    var iheight = height + margin;
    var rwidth = width + margin;
    var ww = parseInt(rwidth / cols);
    var hh = parseInt(iheight / rows);
    var xadj = rwidth - (cols * ww);
    var yadj = iheight - (rows * hh);
    var y = 0;

    var n = 0;
    for (var row = 0; row < rows; ++row)
    {
        var h = hh - margin;
        if (yadj-- >= 1)
            h++;
        var x = 0;
        for (var col = 0; col < cols; ++col, ++n)
        {
            var w = ww - margin;
            if (col >= (cols - xadj))
                w++;
            rects[n] = new rectangle(x, y, w, h);
            rects[n].row = row;
            rects[n].col = col;
            x += w + margin;
        }

        y += h + margin;
    }

    return rects;
}

function gridToGridB(k, extent)
{
    var e = k.slice(0);
    var empty_slots = 0;
    var aextent = 0;
    for (var n = 0; n < e.length; ++n)
    {
        if (e[n] == -1)
            continue;
        if (e[n] < 1)
            e[n] = extent * Math.abs(e[n]);
        aextent += e[n];
        empty_slots += e[n] == 0 ? 1 : 0;
    }

    if (empty_slots == 0)
        return e;

    var balance = extent - aextent;
    if (balance <= 0)
        return e;

    var slot_extent = Math.floor(balance / empty_slots);
    var remainder = balance - (empty_slots * slot_extent);

    for (n = e.length - 1; n >= 0; --n)
    {
        if (e[n])
            continue;

        var d = slot_extent;
        if (remainder-- >= 1)
            d++;
        e[n] = d;
    }

    return e;
}

Array.prototype.sum = function ()
{
    return this.reduce(function (a, b) { return a + b; });
};

Array.prototype.hitest = function (x, y)
{
    var n = 0;
    for (; n < this.length; ++n)
    {
        var rect = this[n];
        if (!rect || !rect.hitest || !rect.hitest(x, y))
            continue;
        break;
    }

    return n==this.length?-1:n;
};

Math.getPans = function (size, extent, factor)
{
    var j = size < extent ? 1 : Math.lerp(0.01, size / extent, factor);
    if (size > 200)
        size = size / 2;
    size = Math.clamp(0, Math.max(size, 10), extent);
    var lst = [];
    for (var n = 0; n < extent; ++n)
    {
        var k = Math.lerp(0, size * j, n / extent);
        lst.push(Math.floor(k));
    }

    return lst;
};

var panhorz = function (obj, x)
{
    if (typeof obj.offset === "undefined")
    {
        obj.offset = obj.anchor() - x;
        return -1;
    }
    else
    {
        return x + obj.offset;
    }
};

var panvert = function (obj, y)
{
    if (typeof obj.offset === "undefined")
    {
        obj.offset = obj.anchor() - y;
        return -1;
    }
    else
    {
        return y + obj.offset;
    }
};

var Rectangle = function (r)
{
    this.draw = function (context, rect, user, time)
    {
        r.x  = rect.x;
        r.y  = rect.y;
        r.width  = rect.width;
        r.height  = rect.height;
    }
}

var Rectangles = function ()
{
    this.draw = function (context, rect, user, time)
    {
        user.push(rect);
    }
}

var Circle = function (color, scolor, width)
{
    this.draw = function (context, rect, user, time)
    {
        var radius = rect.height / 2;
	    if (radius <= 0)
            return;
	    context.save();
    	context.beginPath();
        context.arc(rect.x + rect.width / 2, rect.y + rect.height / 2, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.fill();
        if (width)
        {
		    context.strokeStyle = scolor;
            context.lineWidth = width;
			context.stroke();
        }

		context.restore();
    };
};

var RotatedText = function()
{
    this.draw = function (context, rect, user, time)
    {
        //https://erikonarheim.com/posts/canvas-text-metrics/
        const pos = [10, 100];
        const bounds =
        {
          top: pos[1] - metrics.actualBoundingBoxAscent,
          right: pos[0] + metrics.actualBoundingBoxRight,
          bottom: pos[1] + metrics.actualBoundingBoxDescent,
          left: pos[0] - metrics.actualBoundingBoxLeft
        };

        const center =
        [
          (bounds.left + bounds.right) / 2,
          (bounds.top + bounds.bottom) / 2
        ];

        context.save();
        context.translate(center[0], center[1]);
        context.scale(1, -1);
        context.rotate(Math.PI / 4);
        context.fillText(text, pos[0] - center[0], pos[1] - center[1]);
        context.restore();
    }
};

var Text = function (color,  align="center", baseline="middle", reverse=0, noclip=0, shadow=0)
{
    this.draw = function (context, rect, user, time)
    {
		if (typeof (user) !== "string")
            return;

        if (rect.width < 0)
            return;
        var n = user.length;
        if (n <= 0)
            return;

        if (reverse)
            user = user.split("").reverse().join("");

        context.save();
        context.textAlign = align;
        context.textBaseline = baseline;
        context.fillStyle = color;
        context.shadowOffsetX = shadow?shadow:0;
        context.shadowOffsetY = shadow?shadow:0;
        context.shadowColor = "black"

        var metrics;
        var str;

        if (!noclip)
        {
            do
            {
                str = user.substr(0, n);
                metrics = context.measureText(str);
                n--;
            }
            while (n >= 0 && metrics.width > rect.width);
        }
        else
        {
            str = user;
        }

        var x = rect.x;
        if (align == "center")
            x = rect.x + rect.width / 2;
        else if (align == "right")
            x = rect.x + rect.width - 1;
        var y = rect.y + Math.floor(rect.height/2) + 1;

        if (reverse)
            str = str.split("").reverse().join("");
        context.fillText(str, x, y);
        context.restore();
    };
};

var Row = function (e, panel)
{
    this.draw = function (context, rect, user, time)
    {
        if (!e.length)
            e = new Array(panel.length).fill(0);
        var j = gridToGridB(e, rect.height);

        var y = 0;
        for (var n = 0; n < panel.length; ++n)
        {
            if (j[n] == -1)
                continue;

            var r = rect.get(0, y, rect.width, j[n]);
            y += j[n];
            if (typeof (panel[n]) != "object")
                continue;
            r.id = n;
            panel[n].draw(context, r, user, time);
        }
    };
};

var Col = function (e, panel)
{
    this.draw = function (context, rect, user, time)
    {
        if (!e.length)
            e = new Array(panel.length).fill(0);
        var j = gridToGridB(e, rect.width);
        var x = 0;
        for (var n = 0; n < panel.length; ++n)
        {
            if (j[n] == -1)
                continue;
            var r = rect.get(x, 0, j[n], rect.height);
            x += j[n];
            if (typeof (panel[n]) != "object")
                continue;
            r.id = n;
            panel[n].draw(context, r, user, time);
        }
    };
};

var RowA = function (e, panel)
{
    this.draw = function (context, rect, user, time)
    {
        var j = gridToGridB(e, rect.height);
        var y = 0;
        for (var n = 0; n < panel.length; ++n)
        {
            if (j[n] == -1)
                continue;
            var r = rect.get(0, y, rect.width, j[n]);
            y += j[n];
            if (typeof (panel[n]) != "object")
                continue;
            r.id = n;
            panel[n].draw(context, r, user[n], time);
        }
    };
};

var ColA = function (e, panel)
{
    this.draw = function (context, rect, user, time)
    {
        var j = gridToGridB(e, rect.width);
        var x = 0;
        for (var n = 0; n < panel.length; ++n)
        {
            if (j[n] == -1)
                continue;
            var r = rect.get(x, 0, j[n], rect.height);
            x += j[n];
            if (typeof (panel[n]) != "object")
                continue;
            panel[n].draw(context, r, user[n], time);
        }
    };
};

var Grid = function (cols, rows, margin, panel)
{
    this.draw = function (context, rect, user, time)
    {
        var rects = new gridToRect(cols, rows, margin, rect.width, rect.height);
        for (var n = 0; n < cols*rows; ++n)
        {
            var r = rect.get(rects[n].x, rects[n].y,
                rects[n].width, rects[n].height);
            panel.draw(context, r, user, time);
        }
    };
};

var GridA = function (cols, rows, margin, panel)
{
    this.draw = function (context, rect, user, time)
    {
        var rects = new gridToRect(cols, rows, margin, rect.width, rect.height);
        for (var n = 0; n < cols*rows; ++n)
        {
            var r = rect.get(rects[n].x, rects[n].y,
                rects[n].width, rects[n].height);
            panel.draw(context, r, user[n], time);
        }
    };
};

var Expand = function (panel, extentw, extenth)
{
    this.draw = function (context, rect, user, time)
    {
		return panel.draw(context, new rectangle(
			rect.x-extentw,
			rect.y-extenth,
			rect.width+extentw*2,
			rect.height+extenth*2),
				user, time);
    };
};

var Shrink = function (panel, extentw, extenth)
{
    this.draw = function (context, rect, user, time)
    {
		return panel.draw(context, new rectangle(
			rect.x+extentw,
			rect.y+extenth,
			rect.width-extentw*2,
			rect.height-extenth*2),
				user, time);
    };
};

var Rounded = function (color, linewidth, strokecolor, radiustop, radiusbot)
{
    this.draw = function (context, rect, user, time)
    {
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var height = rect.height;
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x, y + radiustop);
        context.lineTo(x, y + height - radiusbot);
        context.arcTo(x, y + height, x + radiusbot, y + height, radiusbot);
        context.lineTo(x + width - radiusbot, y + height);
        context.arcTo(x + width, y + height, x + width, y + height - radiusbot, radiusbot);
        context.lineTo(x + width, y + radiustop);
        context.arcTo(x + width, y, x + width - radiustop, y, radiustop);
        context.lineTo(x + radiustop, y);
        context.arcTo(x, y, x, y + radiustop, radiustop);
        context.fill();
		if (linewidth)
		{
			context.lineWidth = linewidth;
			context.strokeStyle = strokecolor;
			context.stroke();
		}
    };
};

var Layer = function (panels)
{
    this.draw = function (context, rect, user, time)
    {
        for (var n = 0; n < panels.length; ++n)
        {
            if (typeof (panels[n]) == "object")
                panels[n].draw(context, rect, user, time);
        }
    };
};

var LayerA = function (panels)
{
    this.draw = function (context, rect, user, time)
    {
        for (var n = 0; n < panels.length; ++n)
        {
            if (typeof (panels[n]) == "object")
                panels[n].draw(context, rect, user[n], time);
        }
    };
};

var ImagePanel = function (shrink)
{
    this.draw = function (context, rect, user, time)
    {
        var w = user.width*(shrink?shrink:1)
        var h = user.height*(shrink?shrink:1);
        var x = Math.floor(rect.x + (rect.width - w) / 2);
        var y = Math.floor(rect.y + (rect.height - h) / 2);

        context.save();
        if (user.degrees)
        {
            context.translate(x+w/2, y+h/2);
            context.rotate(user.degrees*Math.PI/180.0);
            context.translate(-x-w/2, -y-h/2);
        }

        context.drawImage(user, x, y, w, h);
        context.restore();
	};
};

var CurrentHPanel = function (panel, extent)
{
    this.draw = function (context, rect, user, time)
    {
	    var current = user.current();
        var length = user.length();
        var nub = Math.nub(current, length, extent, rect.width);
        var r = new rectangle(rect.x + nub, rect.y, extent, rect.height);
        panel.draw(context, r, 0, time);
    };
};

var CurrentVPanel = function (panel, extent, rev)
{
    this.draw = function (context, rect, user, time)
    {
        var k = rev ? user.length() - user.current() : user.current();
        var nub = Math.nub(k, user.length(), extent, rect.height);
        var r = new rectangle(rect.x, rect.y + nub, rect.width, extent);
        panel.draw(context, r, 0, time);
    };
};

//Math.nub(99,100,100,1000) = 900
//Math.nub(0,100,100,1000) = 0
Math.nub = function (n, size, nubextent, extent)
{
    var b = Math.berp(0,size-1,n);
    var e = b*nubextent;
    var f = b*extent;
    return f - e;
};

function rotate(pointX, pointY, originX, originY, angle)
{
	angle = angle * Math.PI / 180.0;
	var k = {
		x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
		y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
	};

	return k;
}

function menuenabled()
{
    var k = _2cnv.height || _3cnv.height || _5cnv.height || _6cnv.height || _7cnv.height ||
        _8cnv.height || _9cnv.height;
    return k;
}

function menuhide()
{
    var k = menuenabled();
    _2cnvctx.enabled = 0;
    _3cnvctx.enabled = 0;
    _5cnvctx.enabled = 0;
    _6cnvctx.enabled = 0;
    _7cnvctx.enabled = 0;
    _8cnvctx.enabled = 0;
    _9cnvctx.enabled = 0;
    _2cnvctx.hide();
    _3cnvctx.hide();
    _5cnvctx.hide();
    _6cnvctx.hide();
    _7cnvctx.hide();
    _8cnvctx.hide();
    _9cnvctx.hide();
    _4cnvctx.refresh();
    return k;
}

function reset()
{
    contextobj.reset()
    setTimeout(function() { contextobj.reset(); }, 400);
    setTimeout(function() { contextobj.reset(); }, 1000);
}

function resize()
{
    reset();
    menuhide();
    var n = eventlst.findIndex(function(a){return a.name == "_4cnvctx";})
    setevents(_4cnvctx, eventlst[n])
    pageresize();
    _4cnvctx.tapping = 0;
    _4cnvctx.refresh();
}

function escape()
{
    clearInterval(_4cnvctx.timemain);
    colorobj.enabled = 0;
    bodyobj.enabled = 0;
    _4cnvctx.tapping = 0;
    _4cnvctx.timemain = 0;
    menuhide();
    var n = eventlst.findIndex(function(a){return a.name == "_4cnvctx";})
    setevents(_4cnvctx, eventlst[n])
    _4cnvctx.setcolumncomplete = 0;
    reset();
    pageresize();
    _4cnvctx.refresh();
}

window.addEventListener("focus", (evt) => { });
window.addEventListener("blur", (evt) => { escape(); });
window.addEventListener("resize", (evt) => { resize(); });
window.addEventListener("screenorientation", (evt) => { resize(); });

var YollPanel = function ()
{
    this.draw = function (context, rect, user, time)
    {
    };

	this.tap = function (context, rect, x, y, shift, ctrl)
    {
        if (context.tap_)
    		context.tap_(context, rect, x, y, shift, ctrl);
	};

    this.wheeldown = function (context, x, y, ctrl, shift)
    {
		if (context.wheeldown_)
      		context.wheeldown_(context, x, y, ctrl, shift);
   	};

    this.wheelup = function (context, x, y, ctrl, shift)
    {
		if (context.wheelup_)
      		context.wheelup_(context, x, y, ctrl, shift);
   	};

    this.drop = function (context, evt)
    {
		if (context.drop)
      		context.drop(context, evt);
   	};

    this.mouseout = function (context, evt)
    {
		if (context.mouse && context.mouse.out)
      		context.mouse.out(context, evt);
   	};

    this.mouseenter = function (context, evt)
    {
		if (context.mouse && context.mouse.enter)
      		context.mouse.enter(evt);
   	};

    this.mousemove = function (context, rect, x, y)
    {
		if (context.mouse && context.mouse.move)
      		context.mouse.move(context, rect, x, y);
   	};

	this.pan = function (context, rect, x, y, type)
	{
		context.pan_(context, rect, x, y, type);
	};

	this.panend = function (context, rect, x, y)
    {
      	context.panend_(context, rect, x, y);
   	};

	this.panleftright = function (context, rect, x, y, type)
    {
       	context.panleftright_(context, rect, x, y, type);
    };

	this.panupdown = function (context, rect, x, y, type)
    {
   		context.panupdown_(context, rect, x, y, type);
    };

	this.panstart = function (context, rect, x, y, type)
    {
       	context.panstart_(context, rect, x, y);
	};

    this.swipeleftright = function (context, rect, x, y, type)
    {
   		if (context.swipeleftright_)
        	context.swipeleftright_(context, rect, x, y, type);
	};

    this.swipeupdown = function (context, rect, x, y, type)
    {
   		if (context.swipeupdown_)
        	context.swipeupdown_(context, rect, x, y, type);
	};

    this.pinch = function (context, scale)
    {
   		if (context.pinch_)
        	context.pinch_(context, scale);
	};

    this.pinchend = function(context)
	{
   		if (context.pinchend_)
        	context.pinchend_(context);
	}

    this.pinchstart = function(context, rect, x, y)
	{
   		if (context.pinchstart_)
        	context.pinchstart_(context, rect, x, y);
	}

	this.pressup = function(context)
	{
   		if (context.pressup_)
        	context.pressup_(context);
	}

	this.press = function(context, rect, x, y, shift, ctrl)
	{
		if (context.press_)
        	context.press_(context, rect, x, y, shift, ctrl);
	}

	this.contextmenu = function(context, rect, x, y)
	{
        if (context.contextmenu)
            context.contextmenu(context, rect, x, y);
	}
};

var headlst =
[
    new function ()
    {
    },
	new function ()
	{
    	this.press = function (context, rect, x, y)
        {
            infobj.rotate(1);
            _4cnvctx.refresh();
        }

    	this.tap = function (context, rect, x, y)
		{
            if (context.page.hitest(x,y))
            {
                _8cnvctx.timeobj.set((1-galleryobj.berp())*TIMEOBJ);
                menushow(_8cnvctx)
                _4cnvctx.refresh();
            }
            else if (context.prevpage.hitest(x,y))
            {
                _4cnvctx.movepage(-1);
            }
            else if (context.picture.hitest(x,y))
            {
                bodyobj.enabled = (bodyobj.enabled==4)?0:4;
                _4cnvctx.refresh();
            }
            else if (context.nextpage.hitest(x,y))
            {
                _4cnvctx.movepage(1);
            }
            else if (context.option.hitest(x,y))
            {
                _4cnvctx.refresh();
                menushow(_9cnvctx);
            }
            else if (context.leftab.hitest(x,y))
            {
                masterhide(x, 0)
            }
            else if (context.rightab.hitest(x,y))
            {
                masterhide(x, 0)
            }

            _4cnvctx.refresh();
		};

		this.draw = function (context, rect, user, time)
		{
            context.clear()
            context.save()
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "black"
            context.page = new rectangle()
            context.option = new rectangle()
            context.prevpage = new rectangle()
            context.nextpage = new rectangle()
            context.thumbnail = new rectangle()
            context.leftab = new rectangle()
            context.rightab = new rectangle()
            context.picture = new rectangle()
            context.font = "1rem Archivo Black";
            var j = rect.width < 420 ? (rect.width-ALIEXTENT*4):180;
            var s = _5cnvctx.enabled || _8cnvctx.enabled;
            var a = new ColA([ALIEXTENT,0,ALIEXTENT,j,ALIEXTENT,0,ALIEXTENT],
                [
                    new Layer(
                    [
                        s ? new Fill(BUTTONBACK) : 0,
                        new PagePanel(s?0.115:0.1),
                        new Rectangle(context.page),
                    ]),
                    new Rectangle(context.leftab),
                    new Layer(
                    [
                        new Rectangle(context.prevpage),
                        new Row([HNUB,0,HNUB],
                        [
                            0,
                            new Layer(
                            [
                                _4cnvctx.movingpage == -1 ?
                                    new Shrink(new Circle(SCROLLNAB,"white",3),0,0) : 0,
                                new Shrink(new Arrow(ARROWFILL,270),ARROWBORES,ARROWBORES-HNUB),
                            ]),
                            0,
                        ]),
                    ]),
                    new Layer(
                    [
                        new Rectangle(context.picture),
                        new Row([HNUB,0,HNUB],
                        [
                            0,
                            new Layer(
                            [
                                bodyobj.enabled == 4 ? new Fill(HEADBACK):0,
                                new Shrink(new Text("white", "center", "middle",0,0,1),20,20),
                            ]),
                            0,
                        ]),
                    ]),
                    new Layer(
                    [
                        new Rectangle(context.nextpage),
                        new Row([HNUB,0,HNUB],
                        [
                            0,
                            new Layer(
                            [
                                _4cnvctx.movingpage == 1 ? new Shrink(new Circle(SCROLLNAB,"white",3),0,0) : 0,
                                new Shrink(new Arrow(ARROWFILL,90),ARROWBORES,ARROWBORES-HNUB),
                            ]),
                            0,
                        ]),
                    ]),
                    new Rectangle(context.rightab),
                    new Layer(
                    [
                        _9cnvctx.enabled ? new Fill(BUTTONBACK):0,
                        new OptionPanel((!_9cnvctx.enabled)?0.1:0.115),
                        new Rectangle(context.option),
                    ])
                ]);

            var s;
            if (globalobj.promptedfile)
            {
                    s = "...";
            }
            else if (infobj.current() == 0)
            {
                s = (galleryobj.current()+1).toFixed(0);
                if (rect.width >= 400)
                    s += " of "+galleryobj.length()
            }
            else if (infobj.current() == 1)
            {
                s = galleryobj.getcurrent().title;
            }
            else if (infobj.current() == 2)
            {
                s = galleryobj.getcurrent().width + "x"+ galleryobj.getcurrent().height;
            }

            var j = _4cnvctx.timeobj.getcurrent().toFixed(1);
            var e = globalobj.promptedfile?"1 of 1":j;
            a.draw(context, rect, [0,0,0,colorobj.enabled?e:s,0,0,0], time);
            context.restore()
		};
	},
];


var footlst =
[
    new function()
    {
    },
    new function()
    {
        this.press = function (context, rect, x, y)
        {
        };

        this.tap = function (context, rect, x, y)
        {
            if (context.progresscircle.hitest(x,y))
            {
                _4cnvctx.autodirect = -1;
                _4cnvctx.tab();
            }
            else if (context.keyzoomup && context.keyzoomup.hitest(x,y))
            {
                bodyobj.enabled = 8;
                _4cnvctx.refresh();
                var zoom = zoomobj.getcurrent();
                if (zoom.current() >= zoom.length()-1)
                    return;
                zoom.add(4);
                contextobj.reset()
            }
            else if (context.keyzoomdown && context.keyzoomdown.hitest(x,y))
            {
                bodyobj.enabled = 8;
                _4cnvctx.refresh();
                var zoom = zoomobj.getcurrent();
                if (!zoom.current())
                    return;
                zoom.add(-4);
                contextobj.reset()
            }
            else if (context.leftab.hitest(x,y))
            {
                masterhide(x, 0)
            }
            else if (context.rightab.hitest(x,y))
            {
                masterhide(x, 0)
            }

            addressobj.update();
        };

        this.draw = function (context, rect, user, time)
        {
            context.clear();
            context.save();
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "black"
            context.progresscircle = new rectangle();
            context.keyzoomup = new rectangle()
            context.keyzoomdown = new rectangle()
            context.leftab = new rectangle()
            context.rightab = new rectangle()

            var a =
               new Col([0,20,90,20,ALIEXTENT-16,20,90,20,0],
               [
                    new Rectangle(context.leftab),
                    0,
                    new Layer(
                    [
                        new Rectangle(context.keyzoomdown),
                        new Minus(ARROWFILL),
                    ]),
                    0,
                    new Layer(
                       [
                           new ProgressCircle(1),
                           new Rectangle(context.progresscircle),
                       ]),
                    0,
                    new Layer(
                    [
                        new Rectangle(context.keyzoomup),
                        new Plus(ARROWFILL),
                    ]),
                    0,
                    new Rectangle(context.rightab),
               ]);

            a.draw(context, rect, _4cnvctx.timeobj, 0);
            context.restore()
        };
    },
];

var footobj = new makeoption("", footlst);
var headobj = new makeoption("", headlst);
var infobj = new makeoption("", 3);
var thumbpos = new makeoption("THUMBNAIL", [0,0,0,0,0,0,0,0,0]);
thumbpos.set(1);
var j = url.searchParams.has("h") ? Number(url.searchParams.get("h")) : 0;
headobj.enabled = j;
footobj.enabled = j;

function menushow(context)
{
    bodyobj.enabled = 0;
    _4cnvctx.slideshow = 0;
    var enabled = context.enabled;
    _2cnvctx.hide();
    _3cnvctx.hide();
    _5cnvctx.hide();
    _6cnvctx.hide();
    _7cnvctx.hide();
    _8cnvctx.hide();
    _9cnvctx.hide();
    context.refresh();
    if (enabled)
        return;

    context.enabled = 1;
    if (context.complete)
    {
        contextobj.resize(context);
    }
    else
    {
        contextobj.resetcontext(context);
        context.complete = 1;
    }

    context.refresh();
    _4cnvctx.refresh();
}

var PagePanel = function (size)
{
    this.draw = function (context, rect, user, time)
    {
        context.save()
        var j = rect.width*size;
        var k = j/2;
        var e = new Fill(OPTIONFILL);
        var a = new Layer(
        [
            new Row( [0, rect.height*0.35, 0],
            [
                0,
                new Col ([0,j,k,j,k,j,0], [0,e,0,e,0,e,0,]),
                0,
            ]),
        ])

        a.draw(context, rect, user, time);
        context.restore()
    }
};

var OptionPanel = function (size)
{
    this.draw = function (context, rect, user, time)
    {
        context.save()
        var j = rect.width*size;
        var k = j/2;
        var e = new Fill(OPTIONFILL);
        var a = new Layer(
        [
            new Col( [0,rect.height*0.35,0],
            [
                0,
                new Row( [0,j,k,j,k,j,0], [0,e,0,e,0,e,0]),
                0,
            ]),
        ]);

        a.draw(context, rect, user, time);
        context.restore()
    }
};

window.addEventListener("keyup", function (evt)
{
	if (evt.key == "Escape")
	{
        escape();
        evt.preventDefault();
        return true;
	}
	else
	{
		var context = _7cnvctx.enabled ? _7cnvctx :
			_8cnvctx.enabled ? _8cnvctx : _9cnvctx.enabled ? _9cnvctx :
				_4cnv.height ? _4cnvctx : _1cnvctx;
		if (context.keyup_)
			return context.keyup_(evt);
	}
});

window.addEventListener("keydown", function (evt)
{
    var context =
        _3cnvctx.enabled ? _3cnvctx :
        _5cnvctx.enabled ? _5cnvctx :
        _6cnvctx.enabled ? _6cnvctx :
        _7cnvctx.enabled ? _7cnvctx :
        _8cnvctx.enabled ? _8cnvctx :
        _9cnvctx.enabled ? _9cnvctx :
        _4cnvctx;
    if (context.keydown_)
        return context.keydown_(evt);
}, false);

function masterhide(x, y)
{
    var context = _4cnvctx;
    if (menuenabled())
    {
        menuhide();
        context.refresh();
    }
    else if (bodyobj.enabled)
    {
        bodyobj.enabled = 0;
        colorobj.enabled = 0;
        context.tapping = 0;
        pageresize();
        context.refresh();
        reset();
    }
    else
    {
        colorobj.enabled = 0;
        context.tapping = 0;
        thumbpos.set(thumbpos.data.hitest(x,y))
        headobj.enabled = headobj.enabled?0:1;
        footobj.enabled = headobj.enabled;
        pageresize();
        context.refresh();
        reset();
    }
}

function pageresize()
{
    var h = headobj.enabled ? ALIEXTENT : 0;
    headcnvctx.show(0,0,window.innerWidth,h);
    headobj.set(h?1:0);
    headham.panel = headobj.getcurrent();
    var h = footobj.enabled ? (SAFARI?90:ALIEXTENT) : 0;
    footcnvctx.show(0,window.innerHeight-h, window.innerWidth, h);
    footobj.set(h?1:0);
    footham.panel = footobj.getcurrent();
}

window.onerror = function(message, source, lineno, colno, error)
{
    //window.alert( error+","+lineno+","+console.trace());
};

document.addEventListener("touchstart", function(evt) { }, {passive: false});
document.addEventListener('touchmove', function (evt) { }, { passive: false });
window.addEventListener("touchend", function (evt) { });
window.addEventListener("beforeunload", (evt) => { });
window.addEventListener("pagehide", (evt) => { });
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() { setfavicon(); });

function setfavicon()
{
    var element = document.querySelector("link[rel='icon']");
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      element.setAttribute("href","res/favicon-light.svg");
    else
      element.setAttribute("href","res/favicon-dark.svg");
}

window.addEventListener("visibilitychange", (evt) =>
{
    reset();
});

window.addEventListener("load", async () =>
{
});

