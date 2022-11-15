//TODO: safair slicewidth

/* +=
Copyright 2017 Tom Brinkman
http://www.reportbase.com
*/

const ISMOBILE = window.matchMedia("only screen and (max-width: 760px)").matches;
const SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const IFRAME = window !== window.parent;
const VIRTCONST = 0.8;
const MAXVIRTUAL = 5760*2;
const SWIPETIME = 40;
const THUMBLINE = 1;
const THUMBLINEIN = 4.0;
const THUMBLINEOUT = 4.0;
const JULIETIME = 100;
const DELAY = 10000000;
const HNUB = 4;
const THUMBORDER = 16;
const ALIEXTENT = 60;
const ARROWBORES = 20;
const DELAYCENTER = 3.926;
const TIMEOBJ = 3926;
const FONTHEIGHT = 16;
const MENUSELECT = "rgba(0,0,100,0.85)";
const MENUTAP = "rgba(200,0,0,0.75)";
const THUMBSELECT = "rgba(0,0,255,0.3)";
const PROGRESSFILL = "rgba(255,255,255,0.75)";
const PROGRESSFALL = "rgba(0,0,0,0.5)";
const SCROLLNUB = "rgba(255,255,255,0.75)";
const SCROLLNAB = "rgba(0,0,0,0.5)";
const SCROLLBACK = "rgba(0,0,0,0.5)";
const HEADBACK = "rgba(0,0,0,0.15)";
const MENUCOLOR = "rgba(0,0,0,0.50)";
const BUTTONBACK = "rgba(0,0,0,0.25)";
const OPTIONFILL = "rgba(255,255,255,0.75)"
const THUMBFILL = "rgba(0,0,0,0.25)"
const THUMBFILL2 = "rgba(0,0,0,0.40)"
const THUMBSTROKE = "rgba(255,255,235,0.35)"
const ARROWFILL = "rgb(255,255,255)";
const TIMEBEGIN = 0;

globalobj = {};
globalobj.timemain = 8;
globalobj.slidefactor = 12;
globalobj.tabtime = 600;
globalobj.autodirect = -1;

let photo = {}
photo.image = 0;
photo.cached = 0;
photo.menu = 0;

let slicelst = [];
for (let n = 399; n >= 1; n=n-1)
    slicelst.push({slices: n*3, delay: 131000/n});

let loaded = new Set()

function randomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);
}

let url = new URL(window.location.href);
url.time = url.searchParams.has("t") ? Number(url.searchParams.get("t")) : TIMEOBJ/2;
url.row = url.searchParams.has("r") ? Number(url.searchParams.get("r")) : 50;
url.header = url.searchParams.has("h") ? Number(url.searchParams.get("h")) : 1;
url.thumbnail = url.searchParams.has("b") ? Number(url.searchParams.get("b")) : 1;

if (url.searchParams.has("p"))
{
    var e = url.searchParams.get("p");
    let k = e.split(".");
    if (k.length == 3)
    {
        url.path = k[0];
        url.project = Number(k[1]);
        url.extension = k[2]
    }
    else if (k.length == 2)
    {
        url.path = k[0];
        url.project = 0;
        url.extension = k[1]
    }
    else
    {
        url.path = k[0];
        url.project = 0;
        url.extension = "webp";
    }

    url.path = url.path.toUpperCase();
}
else
{
    url.path = "HOME";
    url.project = 0;
    url.extension = "jpg";
}

url.filepath = function() { return url.basepath ? url.basepath : (url.origin + "/data/"); }
url.shortname = function() { return url.path + ".jpg"; }

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
    this.data_ = data;
    this.length = function () { return Array.isArray(this.data()) ? this.data().length : Number(this.data()); };
    this.getanchor = function () { return (this.ANCHOR < this.length() &&
		Array.isArray(this.data())) ? this.data()[this.ANCHOR] : this.anchor(); };

    this.getcurrent = function ()
    {
        return (this.CURRENT < this.length() &&
		    Array.isArray(this.data())) ? this.data()[this.CURRENT] : this.current();
    };

    this.get = function (index)
    {
        index += this.CURRENT;
        if (index >= this.length())
            index = 0;
        else if (index < 0)
            index = this.length()-1;
        return Array.isArray(this.data()) ? this.data()[index] : index;
    };

    this.data = function () { return this.data_; };
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
        this.data_ = lst;
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

    this.rotate = function (factor)
    {
        let k = Number(this.current())+factor;
        if (k >= this.length())
            k = k-this.length();
        else if (k < 0)
            k = this.length()+k;
        this.set(k);
    };

    this.setanchor = function (index)
    {
        if (typeof index === "undefined" || Number.isNaN(index) || index == null)
            index = 0;
        this.ANCHOR = Math.clamp(0, this.length() - 1, index);
    };

    this.setdata = function (data)
    {
        this.data_ = data;
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
        let j = this.data_.findIndex(function(a){return a == k;})
        if (j == -1)
            return 0;
        return this.data_[j];
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
            var pt = context.getweightedpoint(x,y);
            x = pt?pt.x:x;
            y = pt?pt.y:y;
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
                var k = channelobj.data()[n];
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
            var pt = context.getweightedpoint(x,y);
            x = pt?pt.x:x;
            y = pt?pt.y:y;
            var index = Math.floor(((y-context.thumbrect.y)/context.thumbrect.height)
                    *channelobj.data_.length);
            var row = (channelobj.data_[index]/100)*rowobj.length();
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
                var k = colobj.data()[n];
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
]

var guideobj = new makeoption("ASSIST", guidelst);
var colobj = new makeoption("COLUMNS", [75,50,25]);
var channelobj = new makeoption("CHANNELS", [2,26,50,74,98]);
var positobj = new makeoption("POSITION", [0,0,0,0,0,0,0,0,0]);

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

        if (context.lastime == context.timeobj.current())
            continue;
        else
            context.lastime = context.timeobj.current();

        if (!context.pinching && !context.panning && context.timemain)
        {
            if ( context.slidestop - context.slidereduce > 0)
            {
                context.slidestop -= context.slidereduce;
                context.timeobj.rotate(globalobj.autodirect*context.slidestop);
            }
            else
            {
                clearInterval(context.timemain);
                context.timemain = 0;
                addressobj.update();
            }
        }

        var stretch = stretchobj.getcurrent();
        context.virtualpinch = context.virtualwidth*stretch.getcurrent()/100;
        context.virtualeft = (context.virtualpinch-rect.width)/2-globalobj.slicewidth;
        var j = (globalobj.slicewidth/(globalobj.slicewidth+context.virtualwidth))*TIMEOBJ;
        var time = (context.timeobj.getcurrent()+j)/1000;
        var slicelst = context.sliceobj.data_;
        var slice = slicelst[0];
        if (!slice)
            break;
        var r = calculateAspectRatioFit(context.colwidth,
            rect.height, rect.width, rect.height);
        var xt = -rect.width/2;
        var y = rect.height*0.5;
        context.save();
        context.translate(xt, 0);
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        var j = time+slice.time;
        var b = Math.tan(j*VIRTCONST);
        var bx = Math.berp(-1, 1, b) * context.virtualpinch - context.virtualeft;
        var extra = context.colwidth;
        var width = rect.width+extra;
        context.visibles = 0;

        for (var m = 0; m < slicelst.length; ++m)
        {
            var e = m == slicelst.length-1?0:m+1
            var slice = slicelst[e];
            var j = time + slice.time;
            var b = Math.tan(j*VIRTCONST);
            var bx2 = Math.berp(-1, 1, b) * context.virtualpinch - context.virtualeft;
            var stretchwidth = bx2-bx;
            var xx = bx+r.x;
            var xxx = bx+r.x-width/2;
            if (bx >= width)
            {
                bx = bx2;
                continue;
            }

            slice.stretchwidth = stretchwidth;
            slice.bx = bx;
            slice.xx = xx;
            slice.xxx = xxx;
            context.drawImage(slice.canvas, slice.x, 0, context.colwidth, rect.height,
                slice.xx, 0, stretchwidth, rect.height);
            bx = bx2;
            context.visibles++
        }

        context.drawslicescount++;
        context.headrect = new rectangle(0,0,rect.width,ALIEXTENT);

        context.restore();
        context.save();
        if (!context.panning && headcnv.height)
            headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);
        if (footcnv.height)
            footobj.getcurrent().draw(footcnvctx, footcnvctx.rect(), 0);

        thumbobj.getcurrent().draw(context, rect, 0, 0);

        context.setcolumncomplete = 1;
        context.restore();
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

        var slices =  context.sliceobj.data();
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

let helplst =
[
    { title:"0", path: "NAME", func: function() {menuhide(); } },
    { title:"1", path: "NAME", func: function() {menuhide(); } },
    { title:"2", path: "NAME", func: function() {menuhide(); } },
    { title:"3", path: "NAME", func: function() {menuhide(); } },
    { title:"4", path: "NAME", func: function() {menuhide(); } },
    { title:"5", path: "NAME", func: function() {menuhide(); } },
    { title:"6", path: "NAME", func: function() {menuhide(); } },
    { title:"7", path: "NAME", func: function() {menuhide(); } },
    { title:"8", path: "NAME", func: function() {menuhide(); } },
    { title:"9", path: "NAME", func: function() {menuhide(); } },
];

const opts = {synchronized: true, };
let _1cnv = document.getElementById("_1");
let _1cnvctx = _1cnv.getContext("2d", opts);
let _2cnv = document.getElementById("_2");
let _2cnvctx = _2cnv.getContext("2d", opts);
let _3cnv = document.getElementById("_3");
let _3cnvctx = _3cnv.getContext("2d", opts);
let _4cnv = document.getElementById("_4");
let _4cnvctx = _4cnv.getContext("2d", opts);
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

function download(name, text)
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
Math.round5 = function (x) { return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5; }
Math.round2 = function (x) { return (x % 2) >= 1 ? parseInt(x / 2) * 2 + 2 : parseInt(x / 2) * 2; }

Image.prototype.load = function(url)
{
    let thisImg = this;
    let xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function(e)
    {
        let blob = new Blob([this.response]);
        thisImg.src = window.URL.createObjectURL(blob);
    };

    xmlHTTP.onprogress = function(e)
    {
        thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
    };

    xmlHTTP.onloadstart = function()
    {
        thisImg.completedPercentage = 0;
    };

    xmlHTTP.send();
};

Image.prototype.completedPercentage = 0;

String.prototype.stripquotes = function() { return this.replace(/(^"|"$)/g, ''); }

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

var ScrollHPanel = function(j)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        var a = new Layer(
        [
           new Fill(SCROLLBACK),
            new CurrentHPanel(new Fill(SCROLLNUB), Math.min(ALIEXTENT*2, rect.width/4)),
        ])

        a.draw(context, rect, user, 0);
        context.restore();
    }
}

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

var  Fill = function (color)
{
    this.draw = function (context, rect, user, time)
    {
        context.save();
        context.fillStyle = color;
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

var StrokeRect = function (color)
{
    this.draw = function (context, rect, user, time)
    {
        context.strokeStyle = color;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
}

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
    var out = url.origin;
    out +=
        "/?p="+projectobj.getcurrent()+
        "&h="+(url.header?1:0)+
        "&b="+(url.thumbnail?1:0)+
        "&y="+loomobj.current()+
        "&z="+poomobj.current()+
        "&r="+(100*rowobj.berp()).toFixed(2)+
        "&e="+traitobj.current()+
        "&a="+scapeobj.current()+
        "&u="+positobj.current()+
        "&t="+_4cnvctx.timeobj.current().toFixed(4);
    return out;
};

addressobj.update = function()
{
    clearTimeout(globalobj.addresstime);
    globalobj.addresstime = setTimeout(function()
    {
        history.replaceState(null, document.title, addressobj.full());
    }, 100);
}

history.pushState(null, null, document.URL);
window.addEventListener('popstate', function ()
{
    //history.pushState(null, null, document.URL);
});

CanvasRenderingContext2D.prototype.moveup = function()
{
    var context = this;
    var k = rowobj.berp()*100-1;
    var index = channelobj.data_.findLastIndex(a=>{return a < k;})
    if (index == -1)
        return;
    var j = (channelobj.data_[index]/100)*rowobj.length();
    rowobj.set(j);
}

CanvasRenderingContext2D.prototype.movedown = function()
{
    var context = this;
    var k = rowobj.berp()*100;
    var index = channelobj.data_.findIndex(a=>{return a > k;})
    if (index == -1)
        return;
    var j = (channelobj.data_[index]/100)*rowobj.length();
    rowobj.set(j);
}

CanvasRenderingContext2D.prototype.movepage = function(j)
{
    if (globalobj.promptedfile)
        return;
    projectobj.rotate(j);
    var path = url.filepath() + projectobj.getcurrent();
    projectobj.rotate(-j);
    if (_4cnvctx.movingpage || !loaded.has(path) || projectobj.length() == 1)
    {
        _4cnvctx.movingpage = 0;
         headobj.getcurrent().draw(headcnvctx, headcnvctx.rect(), 0);
        return;
    }

    _4cnvctx.movingpage = j;
    this.refresh();
    clearTimeout(globalobj.move);
    globalobj.move = setTimeout(function()
    {
        if (_4cnvctx.setcolumncomplete)
        {
            delete photo.cached;
            delete photo.image;
            _4cnvctx.setcolumncomplete = 0;
            projectobj.rotate(j);
            contextobj.reset();
            addressobj.update();
            setTimeout(function(){_4cnvctx.movingpage = 0; _4cnvctx.refresh(); }, 200);
        }
    }, 250);
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
    context.slidestop = (context.timeobj.length()/context.virtualwidth)*globalobj.slidetop;
    context.slidereduce = context.slidestop/globalobj.slidefactor;
    if (!extentobj.length() && context.allowpage == globalobj.autodirect)
    {
        context.allowpage = 0;
        context.movepage(-globalobj.autodirect);
        return;
    }

    context.allowpage = globalobj.autodirect;
    clearInterval(context.timepage);
    context.timepage = setTimeout(function () { context.allowpage = 0; }, globalobj.tabtime);
    clearInterval(context.timemain);
    context.timemain = setInterval(function () { context.refresh(); }, globalobj.timemain);
}

CanvasRenderingContext2D.prototype.refresh = function ()
{
    this.lastime = -0.0000101010101;
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
    ham.get('swipe').set({ velocity: 0.7});//0.30
	ham.get('swipe').set({ threshold: 10});//10
	ham.get('press').set({ time: 375 });//251
	//ham.get('pan').set({ threshold: 10 });
	ham.get('pinch').set({ enable: false });

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
        url.thumbnail = 1;
        context.pinching = 1;
        clearTimeout(globalobj.pinch);
        globalobj.pinch = setTimeout(function()
            {
                context.pinching = 0;
                context.refresh();
            }, 1000);

        var thumb = context.thumbrect && context.thumbrect.hitest(x,y);
        var isthumbrect = thumbobj.current()==0 && thumb;
        if (isthumbrect)
        {
            heightobj.getcurrent().add(-2);
            context.refresh();
        }
        else if (shift)
        {
            rowobj.add(-rowobj.length()/150);
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
            _4cnvctx.timeobj.rotate(-TIMEOBJ/100);
            context.refresh();
        }
	},
 	down: function (context, x, y, ctrl, shift)
    {
        url.thumbnail = 1;
        context.pinching = 1;
        clearTimeout(globalobj.pinch);
        globalobj.pinch = setTimeout(function()
            {
                context.pinching = 0;
                context.refresh();
            }, 1000);

        var thumb = context.thumbrect && context.thumbrect.hitest(x,y);
        var isthumbrect = thumbobj.current()==0 && thumb;
        if (isthumbrect)
        {
            delete photo.cached;
            heightobj.getcurrent().add(2);
            context.refresh();
        }
        else if (shift)
        {
            rowobj.add(rowobj.length()/150);
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
            _4cnvctx.timeobj.rotate(TIMEOBJ/100);
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
    name: "DESCRIBE",
    pinch: function (context, scale) { },
    pinchend: function (context) { },
    pinchstart: function (context, rect, x, y) { },
},
{
    name: "BOSS",
    pinch: function (context, scale)
    {
        var obj = heightobj.getcurrent();
        var data = obj.data_;
        var k = Math.clamp(data[0], data[data.length-1], scale*context.heightsave);
        var j = Math.berp(data[0], data[data.length-1], k);
        var e = Math.lerp(0,obj.length(),j)/100;
        var f = Math.max(20,Math.floor(obj.length()*e));
        obj.set(f);
        context.refresh();
    },
    pinchstart: function (context, rect, x, y)
    {
        url.thumbnail = 1;
        var k = positobj.data_.hitest(x,y);
        positobj.set(k);
        context.pinching = 1;
        context.heightsave = heightobj.getcurrent().getcurrent()
        var zoom = zoomobj.getcurrent()
        context.pinchsave = zoom.getcurrent()
    },
    pinchend: function (context)
    {
        setTimeout(function()
        {
            context.pinching = 0;
            context.refresh();
            addressobj.update();
        }, 400);
    },
},
];

var rowobj = new makeoption("ROW", window.innerHeight);
rowobj.set(window.innerHeight*(url.row/100));

var width = Math.floor(window.innerWidth/2);
pretchobj = new makeoption("PORTSTRETCH", width);
letchobj = new makeoption("LANDSTRETCH", width);
stretchobj = new makeoption("STRETCH", [pretchobj,letchobj]);

var poomobj = new makeoption("PORTZOOM", width);
var loomobj = new makeoption("LANDZOOM", width);
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
        context.pantype = type;

        if (context.isthumbrect && (url.thumbnail))
        {
            var assist = guideobj.getcurrent();
            assist.pan(context, rect, x, y, type);
        }
        else if (type == "panleft" || type == "panright")
        {
            globalobj.autodirect = type == "panleft"?-1:1;
            var pt = context.getweightedpoint(x,y);
            x = pt?pt.x:x;
            var len = context.timeobj.length();
            var diff = context.startx-x;
            var jvalue = (len/context.virtualwidth)*diff;
            var j = context.startt - jvalue;
            if (j < 0)
                j = len+j-1;
            else if (j >= len)
                j = j-len-1;
            context.timeobj.set(j);
            context.refresh()
        }
        else if (type == "panup" || type == "pandown")
        {
            var zoom = zoomobj.getcurrent()
            if (Number(zoom.getcurrent()))
            {
                var pt = context.getweightedpoint(x,y);
                y = pt?pt.y:y;
                var h = (rect.height*(1-zoom.getcurrent()/100))*2;
                y = (y/rect.height)*h;
                var k = panvert(rowobj, h-y);
                if (k == -1)
                    return;
                if (k == rowobj.anchor())
                    return;
                rowobj.set(k);
                contextobj.reset();
            }
        }
    },
	panstart: function (context, rect, x, y)
	{
        context.refresh();
        context.startx = x;
        context.starty = y;
        context.startt = context.timeobj.current();
        var zoom = zoomobj.getcurrent()
        context.isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
        clearInterval(context.timemain);
        context.timemain = 0;
        context.clearpoints();
        context.panning = 1;
    },
    panend: function (context, rect, x, y)
	{
        context.pantype = 0;
        context.panning = 0;
        context.isthumbrect = 0;
        var zoom = zoomobj.getcurrent()
        delete context.startx;
        delete context.starty;
        delete context.startt;
        delete zoom.offset;
        delete rowobj.offset;
        delete describeobj.offset;
        context.refresh();
        addressobj.update();
    }
},
];

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
        context.isthumbrect = 0;
        context.panning = 0;
        context.refresh()
    },
    press: function (context, rect, x, y)
    {
        context.isthumbrect = context.thumbrect && context.thumbrect.hitest(x,y);
        if (context.isthumbrect)
        {
            url.thumbnail = 1;
            guideobj.rotate(1);
            context.refresh()
        }
        else
        {
            url.header = url.header?0:1;
            pageresize();
            context.refresh();
            addressobj.update();
        }
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
            if (isthumbrect)
                return;
            globalobj.autodirect = evt.type == "swipeleft"?-1:1;
            context.tab();
        }, SWIPETIME);
    },

    swipeupdown: function (context, rect, x, y, evt)
    {
        setTimeout(function()
        {
            evt.type == "swipedown" ? context.moveup(): context.movedown();
        }, SWIPETIME);
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
            context.timeobj.rotate(-k);
            context.refresh()
        }
        else if (evt.key == "ArrowDown" || evt.key == "k")
		{
            var k = (20/context.virtualheight)*context.timeobj.length();
            context.timeobj.rotate(k);
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
        if (context.shifthit)
            url.thumbnail = 1;
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
        {
            context.shifthit = 1;
            url.thumbnail = 0;
        }

        context.refresh();

        if (evt.key != " " && isFinite(evt.key))
        {
            positobj.set(evt.key);
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
            globalobj.autodirect = evt.shiftKey ? 1 : -1;
            context.tab();
        }
        else if (evt.key == "ArrowLeft" || evt.key == "h")
        {
            globalobj.autodirect = 1;
            evt.preventDefault();
            _4cnvctx.timeobj.rotate(TIMEOBJ/300);
            context.refresh();
        }
        else if (evt.key == "ArrowRight" || evt.key == "l")
        {
            globalobj.autodirect = -1;
            evt.preventDefault();
            _4cnvctx.timeobj.rotate(-TIMEOBJ/300);
            context.refresh();
        }
        else if (evt.key == "ArrowUp" || evt.key == "k")
        {
            if (context.ctrlhit)
                rowobj.set(0);
            else
                rowobj.add(-rowobj.length()/150);
            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "ArrowDown" || evt.key == "j" )
        {
            if (context.ctrlhit)
                rowobj.set(rowobj.length()-1);
            else
                rowobj.add(rowobj.length()/150);
            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "Pageup" || evt.key == "o")
        {
            context.moveup()
            contextobj.reset();
            evt.preventDefault();
        }
        else if (evt.key == "Pagedown" || evt.key == "p")
        {
            context.movedown()
            contextobj.reset();
            evt.preventDefault();
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
        var count = 25+24+23+22+21+20+19+18+17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x25*1+this.x24*2+this.x23*3+this.x22*4+this.x21*5+this.x20*6+this.x19*7+this.x18*8+this.x17*9+this.x16*10+this.x15*11+this.x14*12+this.x13*13+this.x12*14+this.x11*15+this.x10*16+this.x9*17+this.x8*18+this.x7*19+this.x6*20+this.x5*21+this.x4*22+this.x3*23+this.x2*24+this.x1*25)/count;
        y = (this.y25*1+this.y24*2+this.y23*3+this.y22*4+this.y21*5+this.y20*6+this.y19*7+this.y18*8+this.y17*9+this.y16*10+this.y15*11+this.y14*12+this.y13*13+this.y12*14+this.y11*15+this.y10*16+this.y9*17+this.y8*18+this.y7*19+this.y6*20+this.y5*21+this.y4*22+this.y3*23+this.y2*24+this.y1*25)/count;
    }
    else if (this.x24)
    {
        var count = 24+23+22+21+20+19+18+17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x24*1+this.x23*2+this.x22*3+this.x21*4+this.x20*5+this.x19*6+this.x18*7+this.x17*8+this.x16*9+this.x15*10+this.x14*11+this.x13*12+this.x12*13+this.x11*14+this.x10*15+this.x9*16+this.x8*17+this.x7*18+this.x6*19+this.x5*20+this.x4*21+this.x3*22+this.x2*23+this.x1*24)/count;
        y = (this.y24*1+this.y23*2+this.y22*3+this.y21*4+this.y20*5+this.y19*6+this.y18*7+this.y17*8+this.y16*9+this.y15*10+this.y14*11+this.y13*12+this.y12*13+this.y11*14+this.y10*15+this.y9*16+this.y8*17+this.y7*18+this.y6*19+this.y5*20+this.y4*21+this.y3*22+this.y2*23+this.y1*24)/count;
    }
    else if (this.x23)
    {
        var count = 23+22+21+20+19+18+17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x23*1+this.x22*2+this.x21*3+this.x20*4+this.x19*5+this.x18*6+this.x17*7+this.x16*8+this.x15*9+this.x14*10+this.x13*11+this.x12*12+this.x11*13+this.x10*14+this.x9*15+this.x8*16+this.x7*17+this.x6*18+this.x5*19+this.x4*20+this.x3*21+this.x2*22+this.x1*23)/count;
        y = (this.y23*1+this.y22*2+this.y21*3+this.y20*4+this.y19*5+this.y18*6+this.y17*7+this.y16*8+this.y15*9+this.y14*10+this.y13*11+this.y12*12+this.y11*13+this.y10*14+this.y9*15+this.y8*16+this.y7*17+this.y6*18+this.y5*19+this.y4*20+this.y3*21+this.y2*22+this.y1*23)/count;
    }
    else if (this.x22)
    {
        var count = 22+21+20+19+18+17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x22*1+this.x21*2+this.x20*3+this.x19*4+this.x18*5+this.x17*6+this.x16*7+this.x15*8+this.x14*9+this.x13*10+this.x12*11+this.x11*12+this.x10*13+this.x9*14+this.x8*15+this.x7*16+this.x6*17+this.x5*18+this.x4*19+this.x3*20+this.x2*21+this.x1*22)/count;
        y = (this.y22*1+this.y21*2+this.y20*3+this.y19*4+this.y18*5+this.y17*6+this.y16*7+this.y15*8+this.y14*9+this.y13*10+this.y12*11+this.y11*12+this.y10*13+this.y9*14+this.y8*15+this.y7*16+this.y6*17+this.y5*18+this.y4*19+this.y3*20+this.y2*21+this.y1*22)/count;
    }
    else if (this.x21)
    {
        var count = 21+20+19+18+17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x21*1+this.x20*2+this.x19*3+this.x18*4+this.x17*5+this.x16*6+this.x15*7+this.x14*8+this.x13*9+this.x12*10+this.x11*11+this.x10*12+this.x9*13+this.x8*14+this.x7*15+this.x6*16+this.x5*17+this.x4*18+this.x3*19+this.x2*20+this.x1*21)/count;
        y = (this.y21*1+this.y20*2+this.y19*3+this.y18*4+this.y17*5+this.y16*6+this.y15*7+this.y14*8+this.y13*9+this.y12*10+this.y11*11+this.y10*12+this.y9*13+this.y8*14+this.y7*15+this.y6*16+this.y5*17+this.y4*18+this.y3*19+this.y2*20+this.y1*21)/count;
    }
    else if (this.x20)
    {
        var count = 20+19+18+17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x20*1+this.x19*2+this.x18*3+this.x17*4+this.x16*5+this.x15*6+this.x14*7+this.x13*8+this.x12*9+this.x11*10+this.x10*11+this.x9*12+this.x8*13+this.x7*14+this.x6*15+this.x5*16+this.x4*17+this.x3*18+this.x2*19+this.x1*20)/count;
        y = (this.y20*1+this.y19*2+this.y18*3+this.y17*4+this.y16*5+this.y15*6+this.y14*7+this.y13*8+this.y12*9+this.y11*10+this.y10*11+this.y9*12+this.y8*13+this.y7*14+this.y6*15+this.y5*16+this.y4*17+this.y3*18+this.y2*19+this.y1*20)/count;
    }
    else if (this.x19)
    {
        var count = 19+18+17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x19*1+this.x18*2+this.x17*3+this.x16*4+this.x15*5+this.x14*6+this.x13*7+this.x12*8+this.x11*9+this.x10*10+this.x9*11+this.x8*12+this.x7*13+this.x6*14+this.x5*15+this.x4*16+this.x3*17+this.x2*18+this.x1*19)/count;
        y = (this.y19*1+this.y18*2+this.y17*3+this.y16*4+this.y15*5+this.y14*6+this.y13*7+this.y12*8+this.y11*9+this.y10*10+this.y9*11+this.y8*12+this.y7*13+this.y6*14+this.y5*15+this.y4*16+this.y3*17+this.y2*18+this.y1*19)/count;
    }
    else if (this.x18)
    {
        var count = 18+17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x18*1+this.x17*2+this.x16*3+this.x15*4+this.x14*5+this.x13*6+this.x12*7+this.x11*8+this.x10*9+this.x9*10+this.x8*11+this.x7*12+this.x6*13+this.x5*14+this.x4*15+this.x3*16+this.x2*17+this.x1*18)/count;
        y = (this.y18*1+this.y17*2+this.y16*3+this.y15*4+this.y14*5+this.y13*6+this.y12*7+this.y11*8+this.y10*9+this.y9*10+this.y8*11+this.y7*12+this.y6*13+this.y5*14+this.y4*15+this.y3*16+this.y2*17+this.y1*18)/count;
    }
    else if (this.x17)
    {
        var count = 17+16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x17*1+this.x16*2+this.x15*3+this.x14*4+this.x13*5+this.x12*6+this.x11*7+this.x10*8+this.x9*9+this.x8*10+this.x7*11+this.x6*12+this.x5*13+this.x4*14+this.x3*15+this.x2*16+this.x1*17)/count;
        y = (this.y17*1+this.y16*2+this.y15*3+this.y14*4+this.y13*5+this.y12*6+this.y11*7+this.y10*8+this.y9*9+this.y8*10+this.y7*11+this.y6*12+this.y5*13+this.y4*14+this.y3*15+this.y2*16+this.y1*17)/count;
    }
    else if (this.x16)
    {
        var count = 16+15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x16*1+this.x15*2+this.x14*3+this.x13*4+this.x12*5+this.x11*6+this.x10*7+this.x9*8+this.x8*9+this.x7*10+this.x6*11+this.x5*12+this.x4*13+this.x3*14+this.x2*15+this.x1*16)/count;
        y = (this.y16*1+this.y15*2+this.y14*3+this.y13*4+this.y12*5+this.y11*6+this.y10*7+this.y9*8+this.y8*9+this.y7*10+this.y6*11+this.y5*12+this.y4*13+this.y3*14+this.y2*15+this.y1*16)/count;
    }
    else if (this.x15)
    {
        var count = 15+14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x15*1+this.x14*2+this.x13*3+this.x12*4+this.x11*5+this.x10*6+this.x9*7+this.x8*8+this.x7*9+this.x6*10+this.x5*11+this.x4*12+this.x3*13+this.x2*14+this.x1*15)/count;
        y = (this.y15*1+this.y14*2+this.y13*3+this.y12*4+this.y11*5+this.y10*6+this.y9*7+this.y8*8+this.y7*9+this.y6*10+this.y5*11+this.y4*12+this.y3*13+this.y2*14+this.y1*15)/count;
    }
    else if (this.x14)
    {
        var count = 14+13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x14*1+this.x13*2+this.x12*3+this.x11*4+this.x10*5+this.x9*6+this.x8*7+this.x7*8+this.x6*9+this.x5*10+this.x4*11+this.x3*12+this.x2*13+this.x1*14)/count;
        y = (this.y14*1+this.y13*2+this.y12*3+this.y11*4+this.y10*5+this.y9*6+this.y8*7+this.y7*8+this.y6*9+this.y5*10+this.y4*11+this.y3*12+this.y2*13+this.y1*14)/count;
    }
    else if (this.x13)
    {
        var count = 13+12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x13*1+this.x12*2+this.x11*3+this.x10*4+this.x9*5+this.x8*6+this.x7*7+this.x6*8+this.x5*9+this.x4*10+this.x3*11+this.x2*12+this.x1*13)/count;
        y = (this.y13*1+this.y12*2+this.y11*3+this.y10*4+this.y9*5+this.y8*6+this.y7*7+this.y6*8+this.y5*9+this.y4*10+this.y3*11+this.y2*12+this.y1*13)/count;
    }
    else if (this.x12)
    {
        var count = 12+11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x12*1+this.x11*2+this.x10*3+this.x9*4+this.x8*5+this.x7*6+this.x6*7+this.x5*8+this.x4*9+this.x3*10+this.x2*11+this.x1*12)/count;
        y = (this.y12*1+this.y11*2+this.y10*3+this.y9*4+this.y8*5+this.y7*6+this.y6*7+this.y5*8+this.y4*9+this.y3*10+this.y2*11+this.y1*12)/count;
     }
    else if (this.x11)
     {
        var count = 11+10+9+8+7+6+5+4+3+2+1;
        x = (this.x11*1+this.x10*2+this.x9*3+this.x8*4+this.x7*5+this.x6*6+this.x5*7+this.x4*8+this.x3*9+this.x2*10+this.x1*11)/count;
        y = (this.y11*1+this.y10*2+this.y9*3+this.y8*4+this.y7*5+this.y6*6+this.y5*7+this.y4*8+this.y3*9+this.y2*10+this.y1*11)/count;
     }
    else if (this.x10)
     {
        var count = 10+9+8+7+6+5+4+3+2+1;
        x = (this.x10*1+this.x9*2+this.x8*3+this.x7*4+this.x6*5+this.x5*6+this.x4*7+this.x3*8+this.x2*9+this.x1*10)/count;
        y = (this.y10*1+this.y9*2+this.y8*3+this.y7*4+this.y6*5+this.y5*6+this.y4*7+this.y3*8+this.y2*9+this.y1*10)/count;
     }
    else if (this.x9)
     {
        var count = 9+8+7+6+5+4+3+2+1;
        x = (this.x9*1+this.x8*2+this.x7*3+this.x6*4+this.x5*5+this.x4*6+this.x3*7+this.x2*8+this.x1*9)/count;
        y = (this.y9*1+this.y8*2+this.y7*3+this.y6*4+this.y5*5+this.y4*6+this.y3*7+this.y2*8+this.y1*9)/count;
     }
    else if (this.x8)
     {
        var count = 8+7+6+5+4+3+2+1;
        x = (this.x8*1+this.x7*2+this.x6*3+this.x5*4+this.x4*5+this.x3*6+this.x2*7+this.x1*8)/count;
        y = (this.y8*1+this.y7*2+this.y6*3+this.y5*4+this.y4*5+this.y3*6+this.y2*7+this.y1*8)/count;
     }
     if (this.x7)
     {
        var count = 7+6+5+4+3+2+1;
        x = (this.x7*1+this.x6*2+this.x5*3+this.x4*4+this.x3*5+this.x2*6+this.x1*7)/count;
        y = (this.y7*1+this.y6*2+this.y5*3+this.y4*4+this.y3*5+this.y2*6+this.y1*7)/count;
     }
    else if (this.x6)
     {
        var count = 6+5+4+3+2+1;
        x = (this.x6*1+this.x5*2+this.x4*3+this.x3*4+this.x2*5+this.x1*6)/count;
        y = (this.y6*1+this.y5*2+this.y4*3+this.y3*4+this.y2*5+this.y1*6)/count;
     }
    else if (this.x5)
    {
        var count = 5+4+3+2+1;
        x = (this.x5*1+this.x4*2+this.x3*3+this.x2*4+this.x1*5)/count;
        y = (this.y5*1+this.y4*2+this.y3*3+this.y2*4+this.y1*5)/count;
     }
    else if (this.x4)
    {
        var count = 4+3+2+1;
        x = (this.x4*1+this.x3*2+this.x2*3+this.x1*4)/count;
        y = (this.y4*1+this.y3*2+this.y2*3+this.y1*4)/count;
     }
    else if (this.x3)
     {
        var count = 3+2+1;
        x = (this.x3*1+this.x2*2+this.x1*3)/count;
        y = (this.y3*1+this.y2*2+this.y1*3)/count;
     }
    else if (this.x2)
     {
        var count = 2+1;
        x = (this.x2*1+this.x1*2)/count;
        y = (this.y2*1+this.y1*2)/count;
     }
    else if (this.x1)
     {
        x = this.x1;
        y = this.y1;
     }

    return {x,y}
}

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
        if (menuvisible())
        {
            menuhide();
            return;
        }

        if (context.prevpage && context.prevpage.hitest(x,y))
        {
            _4cnvctx.movepage(-1);
        }
        else if (context.nextpage && context.nextpage.hitest(x,y))
        {
            _4cnvctx.movepage(1);
        }
        else if (url.thumbnail && context.thumbrect && context.thumbrect.hitest(x,y))
        {
            context.hithumb(x,y);
            var zoom = zoomobj.getcurrent()
            var b = !Number(zoom.getcurrent()/100) && !zoom.current()
            if (b)
                context.refresh();
            else
                contextobj.reset()
        }
        else if (context.headrect && context.headrect.hitest(x,y))
        {
            url.header = 1;
            pageresize();
            context.refresh();
        }
        else
        {
            var slicelst = context.sliceobj.data();
            var k;
            for (k = 0; k < slicelst.length; k++)
            {
                var slice = slicelst[k];
                var r = new rectangle(slice.xxx,0,slice.stretchwidth,rect.height)
                if (!slice.xxx)
                    continue
                if (r.hitest(x,y))
                    break;
            }

            context.sliceobj.set(k);
            clearInterval(_4cnvctx.timemain);
            _4cnvctx.timemain = 0;
            var k = positobj.data_.hitest(x,y);
            positobj.set(k);
            pageresize();
            _4cnvctx.refresh();
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

		var slice = context.sliceobj.data()[k];
		slice.tap = 1;
        context.refresh();
        setTimeout(function ()
        {
            localStorage.setItem(url.path+"."+context.index,context.timeobj.current());
            slice.func();
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
        context.save();
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        var th = heightobj.getcurrent().getcurrent();
        var headers = headcnv.height + footcnv.height;
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

        var cols = 3;
        var pos = positobj.current();
        var row = Math.floor(pos/cols);
        var col = pos%cols;
        var w = r.width;

        var y = headcnv.height+THUMBORDER;
        if (row == 1)
            y = (rect.height-h)/2;
        else if (row == 2)
            y = rect.height-h-footcnv.height-THUMBORDER;

        var x = rect.x+THUMBORDER;
        if (col == 1)
            x = rect.x+(rect.width-w)/2;
        else if (col == 2)
            x = rect.x+rect.width-w-THUMBORDER;

        var blackfill = new Fill(THUMBFILL);
        var blackfill2 = new Fill("rgba(0,0,0,0.4)");

        context.thumbrect = new rectangle(x,y,w,h);
        if (url.thumbnail)
        {
            if (context.isthumbrect && (jp || context.panning || guideobj.current()))
            {
                blackfill.draw(context, context.thumbrect, 0, 0);
                guideobj.getcurrent().draw(context, context.thumbrect, 0, 0);
            }
            else if (context.pinching)
            {
                blackfill.draw(context, context.thumbrect, 0, 0);
                guideobj.getcurrent().draw(context, context.thumbrect, 0, 0);
            }
            else if (photo.cached && w == context.oldwidth && h == context.oldheight)
            {
                context.drawImage(photo.cached, x, y, w, h);
            }
            else
            {
                context.drawImage(photo.image, 0, 0, photo.image.width, photo.image.height, x, y, w, h);
                photo.cached = new Image();
                var c = document.createElement('canvas');
                var o = c.getContext('2d');
                c.width=w;
                c.height=h;
                o.drawImage(photo.image, 0, 0, w, h);
                photo.cached.src = o.canvas.toDataURL();
                context.oldheight = h;
                context.oldwidth = w;
            }

            context.lineWidth = 8;
            var whitestroke = new StrokeRect(THUMBSTROKE);
            var r = new rectangle(x,y,w,h);
            whitestroke.draw(context, r, 0, 0);
            var whitestroke = new StrokeRect(THUMBSTROKE);

            var region = new Path2D();
            region.rect(x,y,w,h);
            context.clip(region);

            var ww = Math.max(30,(rect.width/context.virtualwidth)*w);
            var stretch = stretchobj.getcurrent();
            if (stretch < 50)
            {
                stretch = (50-stretch.getcurrent())/100;
                stretch = 1-stretch;
                ww *= stretch;
            }
            else
            {
                stretch = (stretch.getcurrent()-50)/100;
                stretch = 1-stretch;
                ww *= stretch;
            }

            var berp = Math.berp(0,photo.image.height,context.imageheight);
            var hh = Math.lerp(0,h,berp);
            var jj = context.timeobj.berp();
            var bb = w*(1-jj);
            var xx = x+bb-ww/2;
            var berp = Math.berp(0,photo.image.height,context.nuby);
            var yy = y+Math.lerp(0,h,berp);
            context.lineWidth = 3;
            var selectrect = new rectangle(xx,yy,ww,hh);
            blackfill2.draw(context, selectrect, 0, 0);
            whitestroke.draw(context, selectrect, 0, 0);

            var ee = (xx+ww) - (x+w);
            if (ee > 0)
            {
                var r = new rectangle(x-ww+ee,yy,ww,hh);
                blackfill2.draw(context, r, 0, 0);
                whitestroke.draw(context, r, 0, 0);
            }

            var ee = xx-x;
            if (ee < 0)
            {
                var r = new rectangle(x+w+ee,yy,ww,hh);
                blackfill2.draw(context, r, 0, 0);
                whitestroke.draw(context, r, 0, 0);
            }
        }

        context.restore();
    },
},
];

var thumbobj = new makeoption("THUMB", thumblst);

var getbuttonfrompoint = function (context, x, y)
{
	var lst = context.sliceobj.data();

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
    name: "MENU",
    draw: function (context, rect, user, time)
    {
        context.save();
        rect.height = context.buttonheight;
        rect.width -= 40;
        context.translate(-rect.width/2, -rect.height/2);
        user.fitwidth = rect.width;
        user.fitheight = rect.height;
        context.font = "16px Archivo Black";
        var clr = SCROLLNAB;
        var str = user.title;

        if (user.tap)
        {
            clr = MENUTAP;
        }
        else
        {
            if (user.path == "PROJECT")
            {
                if (user.index == projectobj.current())
                    clr = MENUSELECT;
            }
            else if (user.path == "FULLSCREEN")
            {
                if (screenfull.isFullscreen)
                    clr = MENUSELECT;
            }
            else if (user.path == "THUMB")
            {
                if (url.thumbnail)
                    clr = MENUSELECT;
            }
            else if (user.path == "GUIDENONE")
            {
                if (guideobj.current() == 0)
                    clr = MENUSELECT;
            }
            else if (user.path == "GUIDEHORZ")
            {
                if (guideobj.current() == 1)
                    clr = MENUSELECT;
            }
            else if (user.path == "GUIDEVERT")
            {
                if (guideobj.current() == 2)
                    clr = MENUSELECT;
            }
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
    name: "PMENU",
    draw: function (context, rect, user, time)
    {
        context.save();
        rect.height = context.buttonheight;
        rect.width -= 40;
        context.translate(-rect.width/2, -rect.height/2);
        user.fitwidth = rect.width;
        user.fitheight = rect.height+70;
        var clr = "rgba(0,0,0,0.5)";
        var tap = "rgba(200,0,0,0.75)";
        var select = "rgba(200,0,0,0.75)";

        context.font = "16px Archivo Black";
        var hh = photo.menu.height/projectobj.length();
        var r = calculateAspectRatioFit(photo.menu.width, hh, rect.width-20, rect.height+120-20);
        var x = rect.x+(rect.width-r.width)/2;
        var y = (rect.height-r.height)/2;

        if (user.tap)
            clr = tap;

        var a = new Expand(new Rounded(clr, 2, "white", 8, 8), 0, 60);
        a.draw(context, rect, 0, 0);

        var yy = (Number(user.title)-1)*hh;
        context.drawImage(photo.menu,
            0, yy, photo.menu.width, hh,
            x, y, r.width, r.height);

        var a = new Row([0,ALIEXTENT,0],
        [
            0,
            new Row([0,ALIEXTENT,0],
            [
                0,
                new Layer(
                [
                    new Circle(SCROLLNAB,"white",4),
                    new Text("white", "center", "middle",0, 0, 1),
                ]),
                0,
            ]),
            0,
        ]);

        a.draw(context, rect, user.title, time);

        context.restore();
    }
},
{
    name: "HMENU",
    draw: function (context, rect, user, time)
    {
        context.save();
        rect.height = context.buttonheight;
        rect.width -= 40;
        context.translate(-rect.width/2, -rect.height/2);
        user.fitwidth = rect.width;
        user.fitheight = rect.height+70;
        var clr = "rgba(0,0,0,0.5)";
        var tap = "rgba(200,0,0,0.75)";
        var select = "rgba(200,0,0,0.75)";

        context.font = "16px Archivo Black";
        var hh = photo.help.height/helplst.length;
        var r = calculateAspectRatioFit(photo.help.width, hh, rect.width-20, rect.height+120-20);
        var x = rect.x+(rect.width-r.width)/2;
        var y = (rect.height-r.height)/2;

        if (user.tap)
            clr = tap;

        var a = new Expand(new Rounded(clr, 2, "white", 8, 8), 0, 60);
        a.draw(context, rect, 0, 0);

        var yy = Number(user.title)*hh;
        context.drawImage(photo.help,
            0, yy, photo.help.width, hh,
            x, y, r.width, r.height);

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
    if (!photo.image.height)
        return;

    var canvas = _4cnv;
    var context = _4cnvctx;
    var l = -globalobj.slicewidth;
    var w = window.innerWidth + globalobj.slicewidth*2;
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

    globalobj.slicewidth = (SAFARI)?6:context.virtualwidth/12;
    if (globalobj.slicewidth > window.innerWidth)
        globalobj.slicewidth = window.innerWidth;
    var ks = 0;
    for (var n = 0; n < slicelst.length; ++n)
    {
        var k = slicelst[n];
        var fw = context.virtualwidth / k.slices;
        if (fw < globalobj.slicewidth)
            continue;
        ks = n;
        break;
    }

    var canvaslen = Math.ceil(context.virtualwidth/MAXVIRTUAL);
    var e = slicelst[ks];
    var delay = e.delay;
    var slices = Math.ceil(e.slices/canvaslen);
    context.delayinterval = delay/100000;
    context.delay = e;
    var gwidth = photo.image.width/canvaslen;
    context.bwidth = context.virtualwidth/canvaslen;
    context.colwidth = context.bwidth/slices;
    var slice = 0;
    context.sliceobj.data_ = []
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
            context.sliceobj.data_.push(k);
            j += context.delayinterval;
        }
    }

    window.rect = new rectangle(0,0,window.innerWidth,window.innerHeight);
    window.landscape = window.rect.width > window.rect.height?1:0;
    window.portrait = window.rect.width < window.rect.height?1:0;
    heightobj.set(window.landscape?1:0);
    stretchobj.set(window.landscape?1:0);
    zoomobj.set(window.landscape?1:0);

    positobj.data_ = []
    var a = new Grid (3, 3, 0, new Push());
    a.draw(context, window.rect, positobj.data_, 0);

    context.refresh();
}

var eventlst =
[
    {name: "_1cnvctx", mouse: "DEFAULT", guide: "DEFAULT", thumb: "DEFAULT", tap: "DEFAULT", pan: "DEFAULT", swipe: "DEFAULT", draw: "DEFAULT", wheel: "DEFAULT", drop: "DEFAULT", key: "DEFAULT", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 0},
    {name: "_2cnvctx", mouse: "DEFAULT", guide: "DEFAULT", thumb: "DEFAULT", tap: "DEFAULT", pan: "DEFAULT", swipe: "DEFAULT", draw: "DEFAULT", wheel: "DEFAULT", drop: "DEFAULT", key: "DEFAULT", press: "DEFAULT", pinch: "DEFAULT", fillwidth: 0},
    {name: "_3cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "MENU", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: Math.min(420,window.innerWidth)},
    {name: "_4cnvctx", mouse: "BOSS", guide: "GUIDE", thumb: "BOSS",  tap: "BOSS", pan: "BOSS", swipe: "BOSS", draw: "BOSS", wheel: "BOSS", drop: "BOSS", key: "BOSS", press: "BOSS", pinch: "BOSS", fillwidth: 0},
    {name: "_5cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "PMENU", wheel: "MENU", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: Math.min(420,window.innerWidth)},
    {name: "_6cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "MENU", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: Math.min(320,window.innerWidth-ALIEXTENT*2)},
    {name: "_7cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "HMENU", wheel: "MENU", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: Math.min(420,window.innerWidth)},
    {name: "_8cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "MENU", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: Math.min(320,window.innerWidth-ALIEXTENT*2)},
    {name: "_9cnvctx", mouse: "MENU", guide: "DEFAULT", thumb: "DEFAULT", tap: "MENU", pan: "MENU", swipe: "MENU", draw: "MENU", wheel: "MENU", drop: "DEFAULT", key: "MENU", press: "DEFAULT", pinch: "DEFAULT", fillwidth: Math.min(320,window.innerWidth-ALIEXTENT*2)},
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
    context.fillwidth = obj.fillwidth;
}

var templatelst =
[
{
    name: "COMIC",
    init: function ()
    {
        globalobj.slidetop = 24;
        globalobj.slidefactor = 48;
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 4;
        positobj.set(u);
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : loomobj.length()*0.4;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : loomobj.length()*0.4;
        loomobj.split(y, "70-85", loomobj.length());
        poomobj.split(z, "60-85", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 85;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 100;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "PORTRAIT",
    init: function ()
    {
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 4;
        positobj.set(u);
        globalobj.slidetop = 28;
        globalobj.slidefactor = 72;
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : loomobj.length()*0.4;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : loomobj.length()*0.4;
        loomobj.split(y, "70-85", loomobj.length());
        poomobj.split(z, "60-85", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 85;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 100;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "SIDESCROLL",
    init: function ()
    {
        globalobj.slidetop = 28;
        globalobj.slidefactor = 36;
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 7;
        positobj.set(u);
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : 0;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 0;
        loomobj.split(y, "0-25", loomobj.length());
        poomobj.split(z, "0-25", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 100;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 60;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "ULTRAWIDE",
    init: function ()
    {
        globalobj.slidetop = 28;
        globalobj.slidefactor = 96;
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 7;
        positobj.set(u);
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : 0;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 0;
        loomobj.split(y, "0-10", loomobj.length());
        poomobj.split(z, "0-10", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 100;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 60;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "WIDE",
    init: function ()
    {
        globalobj.slidetop = 36;
        globalobj.slidefactor = 72;
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 7;
        positobj.set(u);
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : 0;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 0;
        loomobj.split(y, "25-75", loomobj.length());
        poomobj.split(z, "0-75", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 100;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 75;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "LANDSCAPE",
    init: function (j)
    {
        globalobj.slidetop = 36;
        globalobj.slidefactor = 36;
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 7;
        positobj.set(u);
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : 25;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : 25;
        loomobj.split(y, "50-90", loomobj.length());
        poomobj.split(z, "25-90", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 100;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 60;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
   }
},
{
    name: "EXTRATALL",
    init: function ()
    {
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 4;
        positobj.set(u);
        globalobj.slidetop = 36;
        globalobj.slidefactor = 18;
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : loomobj.length()*0.5;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : loomobj.length()*0.5;
        loomobj.split(y, "90-95", loomobj.length());
        poomobj.split(z, "90-95", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 100;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 100;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "TALL",
    init: function ()
    {
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 4;
        positobj.set(u);
        globalobj.slidetop = 36;
        globalobj.slidefactor = 36;
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : loomobj.length()*0.5;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : loomobj.length()*0.5;
        loomobj.split(y, "80-95", loomobj.length());
        poomobj.split(z, "80-95", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 100;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 100;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
    }
},
{
    name: "LEGEND",
    init: function ()
    {
        var u = url.searchParams.has("u") ? Number(url.searchParams.get("u")) : 4;
        positobj.set(u);
        globalobj.slidetop = 36;
        globalobj.slidefactor = 36;
        var y = url.searchParams.has("y") ? Number(url.searchParams.get("y")) : loomobj.length()*0.8;
        var z = url.searchParams.has("z") ? Number(url.searchParams.get("z")) : loomobj.length()*0.8;
        loomobj.split(y, "80-90", loomobj.length());
        poomobj.split(z, "60-90", poomobj.length());
        var e = url.searchParams.has("e") ? Number(url.searchParams.get("e")) : 100;
        var a = url.searchParams.has("a") ? Number(url.searchParams.get("a")) : 100;
        traitobj.split(e, "0.1-1.0", traitobj.length());
        scapeobj.split(a, "0.1-1.0", scapeobj.length());
    }
},
];

var templateobj = new makeoption("TEMPLATE", templatelst);
var extentobj = new makeoption("", 0);
var describeobj = new makeoption("", 0);
describeobj.positions = [0,0,0];

var projectobj = new makeoption("", 0);

var path = url.origin + "/data/" + url.path + ".json";
fetch(path)
  .then(function (response)
  {
     return response.json();
  })
  .then(function (data)
  {
        setfavicon();

        letchobj.split(Math.floor(letchobj.length()/2), "40-80", letchobj.length());
        pretchobj.split(Math.floor(pretchobj.length()/2), "40-80", pretchobj.length());

        url.template = data.template;
        var j = templatelst.findIndex(function(a){return a.name == url.template;})
        templateobj.set(j);
        templateobj.getcurrent().init();

        if (typeof data.channelobj !== "undefined")
            channelobj.data_ = data.channelobj.split(",");
        if (typeof data.colobj !== "undefined")
            colobj.data_ = data.colobj.split(",").reverse();
        if (typeof data.extension !== "undefined")
            url.extension = data.extension;
        if (typeof data.path !== "undefined")
            url.basepath = data.path;
        if (typeof data.crossorigin !== "undefined")
            globalobj.crossorigin = data.crossorigin;

        photo.help = new Image();
        photo.help.src = url.filepath() + ((typeof data.help === "undefined") ? "HELP.jpg" : data.help);

        if (typeof data.list !== "undefined")
        {
            projectobj.data_ = data.list;
        }
        else
        {
            var size = data.images+1;
            projectobj.data_ = [];
            for (var n = 0; n < size; ++n)
            {
                projectobj.data_[n] = url.path + "." + n.pad(4) + "." + url.extension;
            }
        }

        globalobj.config = data;
        globalobj.config.path = url.filepath();
        globalobj.config.list = projectobj.data_;

        projectobj.set(url.project);

        if (data.extents)
        {
            var j = data.extents.split(",");
            extentobj.data_ = []
            for (var n = 0; n < j.length; ++n)
            {
                var e = j[n].split("x");
                extentobj.data_.push(e);
            }

            var k = extentobj.data_.findIndex(a=>
            {
                var h = Number(a[1]);
                return h > window.innerHeight;
            })

            if (url.searchParams.has("p"))
            {
                let p = url.searchParams.get("p").split(".");
                if (p.length < 3 && k >= 0)
                {
                    projectobj.set(k);
                    extentobj.set(k);
                }
            }
        }

        for (var n = 0; n < contextlst.length; ++n)
		{
            context = contextlst[n];
			context.index = n;
			context.id = n == 0 ? "" : "_" + (n+1);
            context.imageSmoothingEnabled = false;
            context.imageSmoothingQuality = "low";
		    context.enabled = 0;
			context.canvas.width = 1;
			context.canvas.height = 1;
			context.font = "400 100px Russo One";
			context.fillText("  ", 0, 0);
			context.font = "400 100px Archivo Black";
			context.fillText("  ", 0, 0);
			context.font = "400 100px Source Code Pro";
			context.fillText("  ", 0, 0);
			context.slideshow = 0;
	        context.lastime = 0;
			context.allowpage = 0;
			context.buttonheight = 32;
            setevents(context, eventlst[n]);
            context.sliceobj = new makeoption("", []);
            context.timeobj = new makeoption("", TIMEOBJ);
            var k = localStorage.getItem(url.path+"."+context.index);
            context.timeobj.set(k?k:TIMEOBJ/2);
        }

        _4cnvctx.timeobj.set(url.time);

        function project()
        {
            menuhide();
            projectobj.set(this.index);
            window.location.href = addressobj.full();
        }

        var slices = _5cnvctx.sliceobj;
        slices.data_= [];
        var items = projectobj.length();
        for (var n = 0; n < items; ++n)
            slices.data_.push({index:n, title:(n+1)+"", path: "PROJECT", func: project})
        _5cnvctx.buttonheight = 240;
        _5cnvctx.delayinterval = DELAYCENTER / slices.data_.length;
        _5cnvctx.rvalue = 10;
        _5cnvctx.virtualheight = slices.data_.length*_5cnvctx.buttonheight;

        let lst =
        [
            {
                title:"None", path: "GUIDENONE", func: function()
                {
                    guideobj.set(0);
                    _4cnvctx.refresh()
                }
            },
            {
                title:"Horizontal", path: "GUIDEHORZ", func: function()
                {
                    guideobj.set(1);
                    _4cnvctx.refresh()
                }
            },
            {
                title:"Vertical", path: "GUIDEVERT", func: function()
                {
                    guideobj.set(2);
                    _4cnvctx.refresh()
                }
            },
        ];

        var slices = _6cnvctx.sliceobj;
        slices.data_= lst;
        _6cnvctx.delayinterval = DELAYCENTER / slices.data_.length;
        _6cnvctx.virtualheight = slices.data_.length*_6cnvctx.buttonheight;
        _6cnvctx.rvalue = 2;
        _6cnvctx.slideshow_ = 20;
        _6cnvctx.slidereduce = 0.75;

        var slices = _7cnvctx.sliceobj;
        slices.data_= helplst;
        _7cnvctx.buttonheight = 240;
        _7cnvctx.delayinterval = DELAYCENTER / slices.data_.length;
        _7cnvctx.virtualheight = slices.data_.length*_7cnvctx.buttonheight;
        _7cnvctx.rvalue = 10;

        var slices = _8cnvctx.sliceobj;
        slices.data_= [];
        var items = projectobj.length();
        for (var n = 0; n < items; ++n)
        {
            var t = (n+1)+"";
            if (extentobj.data()[n])
                t = extentobj.data()[n].join("x");
            slices.data_.push({index:n, title:t, path: "PROJECT", func: project})
        }

        _8cnvctx.delayinterval = DELAYCENTER / slices.data_.length;
        _8cnvctx.virtualheight = slices.data_.length*_8cnvctx.buttonheight;
        _8cnvctx.rvalue = 2;
        _8cnvctx.slideshow_ = 20;
        _8cnvctx.slidereduce = 0.75;

        var slices = _9cnvctx.sliceobj;
        slices.data_= [];
        slices.data_.push({title:"Open...", path: "LOAD", func: function()
        {
            menuhide();
            promptFile().then(function(files) { dropfiles(files); })
        }});

        slices.data_.push({title:"Refresh", path: "REFRESH", func: function(){location.reload();}})

        slices.data_.push({title:"Config", path: "CONFIG", func: function()
        {
            var str = JSON.stringify(globalobj.config, null, 2);
            var tab = window.open('about:blank', '_blank');
            tab.document.write("<pre>"+str+"</pre>");
            tab.document.close();
        }});

        slices.data_.push({ title:"Original", path: "ORIGINAL", func: function()
        {
           window.location.href = photo.image.original;
        }});

        slices.data_.push({title:"Thumbnail", path: "THUMB", func: function()
        {
            url.thumbnail = url.thumbnail?0:1;
            _4cnvctx.refresh()
        }});

        slices.data_.push({title:"Help", path: "HELP", func: function(){ menushow(_7cnvctx); }})
        slices.data_.push({title:"Guidelines", path: "GUIDE", func: function(){ menushow(_6cnvctx); }})
        slices.data_.push({title:"Fullscreen", path: "FULLSCREEN", func: function ()
        {
            if (screenfull.isEnabled)
                screenfull.toggle();
        }})

        slices.data_.push({ title: "Screenshot", path: "SCREENSHOT", func: function()
        {
            _4cnvctx.refresh()
            _4cnvctx.screenshot = 1;
            setTimeout(function()
            {
                var k = document.createElement('canvas');
                var link = document.createElement("a");
                link.href = _4cnvctx.canvas.toDataURL('image/jpg');
                link.download = projectobj.current().pad(4) + ".jpg";
                link.click();
                _4cnvctx.screenshot = 0;
                _4cnvctx.refresh()
            }, 1000);
        }});

        _9cnvctx.delayinterval = DELAYCENTER / slices.data_.length;
        _9cnvctx.virtualheight = slices.data_.length*_9cnvctx.buttonheight;
        _9cnvctx.rvalue = 2;
        _9cnvctx.slideshow_ = 20;
        _9cnvctx.slidereduce = 0.75;

        seteventspanel(new YollPanel());
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
        length: function () { return this.data().length; },
        enabled: function () { return 0; },
        setanchor: function (index) { this.ANCHOR = Math.clamp(0, this.length() - 1, index); },
        setcurrent: function (index) { this.CURRENT = Math.clamp(0, this.length() - 1, index); },
        getcurrent: function () { return this.data()[this.current()]; },
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

			if (context.index == 3)//boss
            {
            }
            else if (context.index == 4 || context.index == 6)
            {
                w = Math.min(_4cnv.width,context.fillwidth);
                l = Math.floor((window.innerWidth-w)/2);
				context.show(l, 0, w, _4cnv.height);
			}
            else
            {
                w = Math.min(_4cnv.width-ALIEXTENT*2-10,context.fillwidth);
                l = Math.floor((window.innerWidth-w)/2);
				context.show(l, 0, w, _4cnv.height);
			}
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
            context.drawslicescount = 0;
            if (photo.image)
            {
                contextobj.resize(context);
                resetcanvas(context);
            }
            else if (url.path)
            {
                var path = url.filepath() + projectobj.getcurrent();
                if (globalobj.promptedfile)
                    path = globalobj.promptedfile;
                seteventspanel(new Empty());
                photo.image = new Image();
                if (globalobj.crossorigin)
                    photo.image.crossOrigin = globalobj.crossorigin;
                photo.image.original = path;
                photo.image.src = path;

                photo.image.onerror =
                    photo.image.onabort = function(e)
                {
                    location.reload();
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
                    document.title = projectobj.getcurrent()+" ("+this.extent+")"

                    if (globalobj.promptedfile)
                    {
                        var k;
                        if (this.aspect < 0.5)
                            k = "TALL"
                        else if (this.aspect < 1.3)
                            k = "PORTRAIT"
                        else if (this.aspect < 3.0)
                            k = "LANDSCAPE"
                        else
                            k = "WIDE"
                        var j = templatelst.findIndex(function(a){return a.name == k;})
                        templateobj.set(j);
                        templateobj.getcurrent().init();
                    }

                    clearInterval(context.timemain);
                    context.timemain = 0;
                    pageresize();
                    contextobj.resize(context);
                    resetcanvas(context);
                    seteventspanel(new YollPanel());
                    reset();

                    setTimeout(function()
                    {
                        photo.menu = new Image();
                        photo.menu.src = url.filepath() + url.shortname();

                        var k = projectobj.current();
                        projectobj.rotate(1);
                        var img = new Image();
                        img.src = url.filepath() + projectobj.getcurrent();
                        projectobj.rotate(-2);
                        img.onload = function() { loaded.add(this.src); }
                        var img = new Image();
                        img.onload = function() { loaded.add(this.src); }
                        img.src = url.filepath() + projectobj.getcurrent();
                        projectobj.set(k);
                    }, 600);
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

    return n;
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

var Push = function ()
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

function menuvisible()
{
    var k = _5cnv.height || _6cnv.height || _7cnv.height ||
        _8cnv.height || _9cnv.height;
    return k;
}

function menuhide()
{
    var k = menuvisible();
    _3cnvctx.enabled = 0;
    _5cnvctx.enabled = 0;
    _6cnvctx.enabled = 0;
    _7cnvctx.enabled = 0;
    _8cnvctx.enabled = 0;
    _9cnvctx.enabled = 0;
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
    seteventspanel(new Empty());
    contextobj.reset()
    setTimeout(contextobj.reset,150);
    setTimeout(contextobj.reset,300);
    setTimeout(function()
    {
        contextobj.reset();
        seteventspanel(new YollPanel());
    }, 450);
}

function resize()
{
    reset();
    menuhide();
    var n = eventlst.findIndex(function(a){return a.name == "_4cnvctx";})
    setevents(_4cnvctx, eventlst[n])
    pageresize();
    _4cnvctx.refresh();
}

function escape()
{
    url.header = 1;
    clearInterval(_4cnvctx.timemain);
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

	this.rightclick = function(context, rect, x, y)
	{
   		if (context.rightclick_)
        	context.rightclick_(context, rect, x, y);
	}
};

var headlst =
[
	new function ()
	{
    	this.press = function (context, rect, x, y)
        {
            url.header = url.header?0:1;
            pageresize();
            _4cnvctx.refresh();
        }

    	this.tap = function (context, rect, x, y)
		{
            if (context.page.hitest(x,y))
            {
                if (photo.menu.complete && photo.menu.naturalHeight)
                    menushow(_5cnvctx)
                else
                    menushow(_8cnvctx)
            }
            else if (context.prevpage.hitest(x,y))
            {
                _4cnvctx.movepage(-1);
            }
            else if (context.picture.hitest(x,y))
            {
                url.thumbnail = url.thumbnail?0:1;
                addressobj.update();
                reset();
            }
            else if (context.nextpage.hitest(x,y))
            {
                _4cnvctx.movepage(1);
            }
            else if (context.option.hitest(x,y))
            {
                menushow(_7cnvctx);
            }
            else
            {
                globalobj.autodirect = x<rect.width/2 ? 1 : -1;
                _4cnvctx.tab();
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
            context.extent = new rectangle()
            context.size = new rectangle()
            context.prevpage2 = new rectangle()
            context.nextpage2 = new rectangle()
            context.picture = new rectangle()
            context.font = "15px Archivo Black";
            var j = rect.width < 375 ? 60:120;
            var s = _5cnvctx.enabled || _8cnvctx.enabled;
            var a = new Layer(
            [
                _4cnvctx.isthumbrect?0:new Fill(HEADBACK),
                new Col([ALIEXTENT,0,ALIEXTENT,j,ALIEXTENT,0,ALIEXTENT],
                [
                    _4cnvctx.isthumbrect?0:new Layer(
                    [
                        s ? new Fill(BUTTONBACK) : 0,
                        new PagePanel(s?0.125:0.1),
                        new Rectangle(context.page),
                    ]),
                    new Rectangle(context.extent),
                    (_4cnvctx.isthumbrect)?0:new Row([HNUB,0,HNUB],
                    [
                        0,
                        new Layer(
                        [
                            _4cnvctx.movingpage == -1 ?
                                new Shrink(new Circle(SCROLLNAB,"white",4),4,4) : 0,
                            new Shrink(new Arrow(_4cnvctx.movingpage == -1?"WHITE":ARROWFILL,270),ARROWBORES,ARROWBORES-HNUB),
                            new Rectangle(context.prevpage),
                        ]),
                        0,
                    ]),
                    (headinfo.current() == 0 && (_4cnvctx.isthumbrect))?0:new Row([HNUB,0,HNUB],
                    [
                        0,
                        new Layer(
                        [
                            url.thumbnail ? new Fill(THUMBSELECT) : 0,
                            new Text(ARROWFILL, "center", "middle",0,1,1),
                            new Rectangle(context.picture),
                        ]),
                        0,
                    ]),
                    (_4cnvctx.isthumbrect)?0:new Row([HNUB,0,HNUB],
                    [
                        0,
                        new Layer(
                        [
                            _4cnvctx.movingpage == 1 ?
                                new Shrink(new Circle(SCROLLNAB,"white",4),4,4) : 0,
                            new Shrink(new Arrow(_4cnvctx.movingpage == 1?"WHITE":ARROWFILL,90),ARROWBORES,ARROWBORES-HNUB),
                            new Rectangle(context.nextpage),
                        ]),
                        0,
                    ]),
                    (_4cnvctx.isthumbrect||rect.width<510)?0:
                    new Rectangle(context.size),
                    _4cnvctx.isthumbrect?0:new Layer(
                    [
                        _7cnvctx.enabled ? new Fill(BUTTONBACK):0,
                        new OptionPanel((!_9cnvctx.enabled)?0.1:0.125),
                        new Rectangle(context.option),
                    ])
                ])
           ]);

           var j = (projectobj.current()+1).toFixed(0);
           var jt = (projectobj.current()+1).toFixed(0)+" of "+projectobj.length();
           var f = projectobj.current();
           var s = extentobj.data_[f];
           var k = extentobj.length() ? s.join("x") : j;
           var h = headinfo.current();
            if (h == 1)
                k = jt;
            else if (h == 2)
                k = photo.image.extent;
            else if (h == 3)
                k = _4cnvctx.virtualextent;
            else if (h == 4)
                k = photo.image.size;
            else if (h == 5)
                k = _4cnvctx.virtualsize;
            else if (h == 6)
                k = photo.image.aspect.toFixed(2);
            else if (h == 7)
                k = _4cnvctx.timeobj.current().toFixed(4);
            else if (h == 8)
                k = _4cnvctx.drawslicescount.toFixed(0);
            else if (h  == 9)
            {
                var s = (100*_4cnvctx.sliceobj.berp()).toFixed(0);
                var f = 100*rowobj.berp();
                f = f.toFixed(0);
                k = s+"x"+f
            }
            else if (h == 10)
                k = globalobj.slicewidth.toFixed(0);

            a.draw(context, rect, k, time);
            context.restore()
		};
	},
	new function ()
	{
		this.tap = function (context, rect, x, y)
		{
            history.go(-1);
		};

		this.draw = function (context, rect, user, time)
		{
            context.clear()
            context.save()
            context.font = "16px Archivo Black";
            var a = new Layer(
            [
                new Fill("black"),
                new Text("white","center","middle",0,1,1),
           ]);

           a.draw(context, rect, "Exit?", time);
           context.restore()
		};
	},
];

var headinfo = new makeoption("", Math.max(window.innerWidth,window.innerHeight));
var headobj = new makeoption("", headlst);

var footlst =
[
    new function()
    {
      	this.press = function (context, rect, x, y)
        {
            url.header = url.header?0:1;
            pageresize();
            _4cnvctx.refresh();
        }

        this.panstart = function (context, rect, x, y)
        {
            delete photo.cached;
            _4cnvctx.pinching = 1;
            context.panobj = x<rect.width/2?zoomobj.getcurrent():stretchobj.getcurrent();
            _4cnvctx.refresh();
        }

        this.panend = function (context, rect, x, y)
        {
            delete context.panobj.offset;
            _4cnvctx.pinching = 0;
            addressobj.update();
        };

        this.pan = function (context, rect, x, y, type)
        {
            var k = panhorz(context.panobj, x);
            if (k == -1)
                return;
            if (k == context.panobj.anchor())
                return;
            context.panobj.set(Math.floor(k));
            contextobj.reset();
        };

        this.tap = function (context, rect, x, y)
        {
            if (context.progresscircle.hitest(x,y))
            {
                menushow(_9cnvctx);
            }
            else if (context.leftab.hitest(x,y))
            {
                var obj = zoomobj.getcurrent();
                x = x - context.leftab.x
                var k = Math.floor(obj.length()*(x/context.leftab.width))
                obj.set(k);
                pageresize();
                contextobj.reset();
            }
            else if (context.rightab.hitest(x,y))
            {
                var obj = stretchobj.getcurrent()
                x = x - context.rightab.x
                var k = Math.floor(obj.length()*(x/context.rightab.width))
                obj.set(k);
                pageresize();
                contextobj.reset();
            }
        };
        this.draw = function (context, rect, user, time)
        {
            context.clear();
            context.save();
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "black"
            context.progresscircle = new rectangle();
            context.leftab = new rectangle()
            context.rightab = new rectangle()
            var j = _4cnvctx.isthumbrect || stretchobj.getcurrent().length() <= 1;
            var e = 0;
            var f = 360;
            if (rect.width < 360*2+20*4+ALIEXTENT)
            {
                e = -1;
                f = 0;
            }

            var a =
            new Layer(
            [
               j?0:new Fill(HEADBACK),
               new ColA([16,0,16,ALIEXTENT-16,16,0,16],
               [
                    0,
                   new Row([0,10,0],
                   [
                       0,
                       new Col([e,f],
                       [
                           0,
                           new Layer(
                           [
                                j?0:new ScrollHPanel(),
                               new Expand(new Rectangle(context.leftab),0,30),
                           ]),
                       ]),
                       0,
                   ]),
                   0,
                    new Layer(
                       [
                           new ProgressCircle(1),
                           new Rectangle(context.progresscircle),
                       ]),
                   0,
                   new Row([0,10,0],
                   [
                       0,
                       new Col([f,e],
                       [
                           new Layer(
                           [
                               j?0:new ScrollHPanel(),
                               new Expand(new Rectangle(context.rightab),0,30),
                           ]),
                           0,
                       ]),
                       0,
                   ]),
                   0
               ]),
            ]);

            a.draw(context, rect,
            [
                0,
                zoomobj.getcurrent(),
                0,
                _4cnvctx.timeobj,
                0,
                stretchobj.getcurrent(),
                0,
            ], 0);

            context.restore()
        };
    }
];

var footobj = new makeoption("", footlst);

function menushow(context)
{
    _4cnvctx.slideshow = 0;
    var enabled = context.enabled;
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
            new Row( [0, rect.height*0.5, 0],
            [
                0,
                new Col ([0,j,k,j,k,j,0],
                [
                    0,
                    e,
                    0,
                    e,
                    0,
                    e,
                    0,
                ]),
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
            new Col( [0,rect.height*0.5,0],
            [
                0,
                new Row( [0,j,k,j,k,j,0],
                [
                    0,
                    e,
                    0,
                    e,
                    0,
                    e,
                    0
                ]),
                0,
            ]),
        ]);

        a.draw(context, rect, user, time);
        context.restore()
    }
};

window.addEventListener("touchend", function (evt) { });

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

function pageresize()
{
    var y = 0;
    var h = url.header ? ALIEXTENT : 0;
    headcnvctx.show(0,y,window.innerWidth,h);
    headham.panel = headobj.getcurrent();
    var h = url.header ? ALIEXTENT : 0;
    footham.panel = footobj.getcurrent();
    footcnvctx.show(0,window.innerHeight-h, window.innerWidth, h);
}

window.onerror = function(message, source, lineno, colno, error)
{
//    window.alert( error+","+lineno+","+console.trace());
};


document.addEventListener("touchstart", function(evt)
{
}, {passive: false});

document.addEventListener('touchmove', function (evt)
{
}, { passive: false });

window.addEventListener("visibilitychange", (evt) =>
{
    if (document.visibilityState === 'hidden')
    {
    }
    else
    {
    }
});

window.addEventListener("beforeunload", (evt) =>
{
});

window.addEventListener("pagehide", (evt) =>
{
});

const darkModeListener = (event) =>
{
    setfavicon();
};

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', darkModeListener);

function setfavicon()
{
    var element = document.querySelector("link[rel='icon']");
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      element.setAttribute("href","res/favicon-light.svg");
    else
      element.setAttribute("href","res/favicon-dark.svg");
}

window.addEventListener("load", async () =>
{
    try
    {
//        if ("serviceWorker" in navigator && url.hostname == "reportbase.com")
//           navigator.serviceWorker.register("sw.js");
    }
    catch(error)
    {
    }
});



