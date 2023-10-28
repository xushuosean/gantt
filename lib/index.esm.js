/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var GanttEvent;
(function (GanttEvent) {
    GanttEvent["CLICK"] = "click";
    GanttEvent["MOUSEDOWN"] = "mousedown";
    GanttEvent["MOUSEMOVE"] = "mousemove";
    GanttEvent["MOUSEUP"] = "mouseup";
    GanttEvent["CHANGE"] = "change";
})(GanttEvent || (GanttEvent = {}));
var GanttEvent$1 = GanttEvent;

var GanttEventSource = /** @class */ (function () {
    function GanttEventSource() {
        this.eventListeners = [];
    }
    GanttEventSource.prototype.addListener = function (name, listener) {
        if (this.eventListeners == null) {
            this.eventListeners = [];
        }
        this.eventListeners.push(name);
        this.eventListeners.push(listener);
    };
    GanttEventSource.prototype.removeListener = function (listener) {
        if (this.eventListeners != null) {
            var i = 0;
            while (i < this.eventListeners.length) {
                if (this.eventListeners[i + 1] == listener) {
                    this.eventListeners.splice(i, 2);
                }
                else {
                    i += 2;
                }
            }
        }
    };
    GanttEventSource.prototype.fireEvent = function (evt) {
        if (this.eventListeners != null) {
            var args = [evt];
            for (var i = 0; i < this.eventListeners.length; i += 2) {
                var listen = this.eventListeners[i];
                if (listen === null || listen === evt.getName()) {
                    this.eventListeners[i + 1].apply(this, args);
                }
            }
        }
    };
    return GanttEventSource;
}());

var GanttSelectionCellsHandler = /** @class */ (function (_super) {
    __extends(GanttSelectionCellsHandler, _super);
    function GanttSelectionCellsHandler(gantt) {
        var _this = _super.call(this) || this;
        _this.handlers = new Map();
        _this.gantt = gantt;
        _this.gantt.addMouseListener(_this);
        _this.gantt.selectionModel.addListener(GanttEvent$1.CHANGE, _this.refresh.bind(_this));
        return _this;
    }
    GanttSelectionCellsHandler.prototype.mouseDown = function (me) {
        this.handlers.forEach(function (handler) {
            handler.mouseDown.apply(handler, [me]);
        });
    };
    GanttSelectionCellsHandler.prototype.mouseMove = function (me) {
        this.handlers.forEach(function (handler) {
            handler.mouseMove.apply(handler, [me]);
        });
    };
    GanttSelectionCellsHandler.prototype.mouseUp = function (me) {
        this.handlers.forEach(function (handler) {
            handler.mouseUp.apply(handler, [me]);
        });
    };
    GanttSelectionCellsHandler.prototype.refresh = function () {
        var tmp = this.gantt.selectionModel.cells.slice();
        var oldHanlders = this.handlers;
        this.handlers = new Map();
        // destroy old handlers
        oldHanlders.forEach(function (handler) {
            handler.destroy();
        });
        // create new handlers
        for (var i = 0; i < tmp.length; i++) {
            var state = this.gantt.view.getState(tmp[i]);
            if (state) {
                var handler = this.handlers.get(tmp[i]);
                if (!handler) {
                    handler = this.gantt.createBarHandler(state);
                    this.handlers.set(tmp[i], handler);
                }
                else {
                    console.log('has handler exists');
                }
            }
        }
    };
    return GanttSelectionCellsHandler;
}(GanttEventSource));

var GanttEventObject = /** @class */ (function () {
    function GanttEventObject(name) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        this.name = '';
        this.consumed = false;
        this.name = name;
        this.properties = [];
        for (var i = 0; i < rest.length + 1; i += 2) {
            if (rest[i + 1] != null) {
                this.properties[rest[i]] = rest[i + 1];
            }
        }
    }
    GanttEventObject.prototype.getName = function () {
        return this.name;
    };
    GanttEventObject.prototype.getProperties = function () {
        return this.properties;
    };
    GanttEventObject.prototype.getProperty = function (key) {
        return this.properties[key];
    };
    GanttEventObject.prototype.consume = function () {
        this.consumed = true;
    };
    GanttEventObject.prototype.isConsumed = function () {
        return this.consumed;
    };
    return GanttEventObject;
}());

var GanttSelectionChange = /** @class */ (function () {
    function GanttSelectionChange(selectionModel, added, removed) {
        this.selectionModel = selectionModel;
        this.added = added ? added.slice() : [];
        this.removed = removed ? removed.slice() : [];
    }
    GanttSelectionChange.prototype.execute = function () {
        var _this = this;
        if (this.removed) {
            this.removed.forEach(function (cell) {
                _this.selectionModel.cellRemoved(cell);
            });
        }
        if (this.added) {
            this.added.forEach(function (cell) {
                _this.selectionModel.cellAdded(cell);
            });
        }
        console.log('added', this.added, 'removed', this.removed);
        this.selectionModel.fireEvent(new GanttEventObject(GanttEvent$1.CHANGE, 'added', this.added, 'removed', this.removed));
    };
    return GanttSelectionChange;
}());
var GanttSelectionModel = /** @class */ (function (_super) {
    __extends(GanttSelectionModel, _super);
    function GanttSelectionModel(gantt) {
        var _this = _super.call(this) || this;
        _this.cells = [];
        _this.gantt = gantt;
        return _this;
    }
    GanttSelectionModel.prototype.setCell = function (cell) {
        if (cell) {
            this.setCells([cell]);
        }
    };
    GanttSelectionModel.prototype.setCells = function (cells) {
        this.changeSelection(cells, this.cells);
    };
    GanttSelectionModel.prototype.changeSelection = function (added, removed) {
        var change = new GanttSelectionChange(this, added, removed);
        change.execute();
    };
    GanttSelectionModel.prototype.cellAdded = function (cell) {
        if (cell) {
            this.cells.push(cell);
        }
    };
    GanttSelectionModel.prototype.clear = function () {
        this.changeSelection([], this.cells);
    };
    GanttSelectionModel.prototype.cellRemoved = function (cell) {
        if (cell) {
            var index = this.cells.indexOf(cell);
            if (index >= 0) {
                this.cells.splice(index, 1);
            }
        }
    };
    return GanttSelectionModel;
}(GanttEventSource));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var dayjs_min = {exports: {}};

(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return "["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,u=e.clone().add(r+(s?-1:1),c);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:c,y:h,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof b},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new b(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var b=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,f=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[a]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[u]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===h){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,f){var d,l=this;r=Number(r);var $=O.p(f),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},d=function(t){return O.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(y,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return O.s(e.$y,4,"0");case"M":return a+1;case"MM":return O.s(a+1,2,"0");case"MMM":return h(n.monthsShort,a,c,3);case"MMMM":return h(c,a);case"D":return e.$D;case"DD":return O.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return h(n.weekdaysMin,e.$W,o,2);case"ddd":return h(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(s);case"HH":return O.s(s,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(s,u,!0);case"A":return $(s,u,!1);case"m":return String(u);case"mm":return O.s(u,2,"0");case"s":return String(e.$s);case"ss":return O.s(e.$s,2,"0");case"SSS":return O.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=this,M=O.p(d),m=w(r),v=(m.utcOffset()-this.utcOffset())*e,g=this-m,D=function(){return O.m(y,m)};switch(M){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(g-v)/6048e5;break;case a:$=(g-v)/864e5;break;case u:$=g/n;break;case s:$=g/e;break;case i:$=g/t;break;default:$=g;}return l?$:O.a($)},m.daysInMonth=function(){return this.endOf(c).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),_=b.prototype;return w.prototype=_,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",c],["$y",h],["$D",d]].forEach((function(t){_[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,b,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w})); 
} (dayjs_min));

var dayjs_minExports = dayjs_min.exports;
var dayjs$1 = /*@__PURE__*/getDefaultExportFromCjs(dayjs_minExports);

var minMax$1 = {exports: {}};

(function (module, exports) {
	!function(e,n){module.exports=n();}(commonjsGlobal,(function(){return function(e,n,t){var i=function(e,n){if(!n||!n.length||1===n.length&&!n[0]||1===n.length&&Array.isArray(n[0])&&!n[0].length)return null;var t;1===n.length&&n[0].length>0&&(n=n[0]);t=(n=n.filter((function(e){return e})))[0];for(var i=1;i<n.length;i+=1)n[i].isValid()&&!n[i][e](t)||(t=n[i]);return t};t.max=function(){var e=[].slice.call(arguments,0);return i("isAfter",e)},t.min=function(){var e=[].slice.call(arguments,0);return i("isBefore",e)};}})); 
} (minMax$1));

var minMaxExports = minMax$1.exports;
var minMax = /*@__PURE__*/getDefaultExportFromCjs(minMaxExports);

dayjs$1.extend(minMax);
var CodeToGantt = /** @class */ (function () {
    function CodeToGantt(gantt, tasks, options) {
        this.datas = [];
        this.gantt = gantt;
        this.tasks = tasks;
        this.options = options;
        this.init();
    }
    CodeToGantt.prototype.init = function () {
        this.setupDate();
        this.convertToCell();
    };
    /** 获取最小最大值 */
    CodeToGantt.prototype.getMinMaxDate = function () {
        var minDate = dayjs$1(this.tasks[0].start);
        var maxDate = dayjs$1(this.tasks[0].end);
        this.tasks.forEach(function (task) {
            minDate = dayjs$1.min(dayjs$1(minDate), dayjs$1(task.start));
            maxDate = dayjs$1.max(dayjs$1(maxDate), dayjs$1(task.end));
        });
        return [minDate, maxDate];
    };
    CodeToGantt.prototype.setupDate = function () {
        var _a;
        _a = this.getMinMaxDate(), this.ganttStart = _a[0], this.ganttEnd = _a[1];
    };
    Object.defineProperty(CodeToGantt.prototype, "diffMonth", {
        get: function () {
            return this.ganttEnd.diff(this.ganttStart, 'month');
        },
        enumerable: false,
        configurable: true
    });
    CodeToGantt.prototype.convertToCell = function () {
        var _this = this;
        this.datas = this.tasks.map(function (task, index) {
            return _this.doConvert(task, index);
        });
    };
    CodeToGantt.prototype.doConvert = function (task, index) {
        var paddingLeft = dayjs$1(task.start).month() - this.ganttStart.month();
        var x = paddingLeft * this.getRenderColumnWidth();
        var y = this.headerHeight + this.rowHeight * index + this.options.padding / 2;
        var width = this.getRenderColumnWidth() * this.getSplitNumber(task);
        var height = this.options.barHeight;
        return {
            id: task.id,
            value: task.value,
            x: x,
            y: y,
            width: width,
            height: height
        };
    };
    CodeToGantt.prototype.getSplitNumber = function (task) {
        return dayjs$1(task.end).diff(dayjs$1(task.start), 'month') + 1;
    };
    CodeToGantt.prototype.getRenderColumnWidth = function () {
        if (this.options.viewMode) {
            return this.options.columnWidth * 4;
        }
        return this.options.columnWidth;
    };
    Object.defineProperty(CodeToGantt.prototype, "headerHeight", {
        get: function () {
            return this.options.headerHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CodeToGantt.prototype, "rowHeight", {
        /** row 高度 */
        get: function () {
            return this.options.barHeight + this.options.padding;
        },
        enumerable: false,
        configurable: true
    });
    return CodeToGantt;
}());

var GanttGeometry = /** @class */ (function () {
    function GanttGeometry(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    GanttGeometry.prototype.clone = function () {
        return new GanttGeometry(this.x, this.y, this.width, this.height);
    };
    return GanttGeometry;
}());

var GanttMouseEvent = /** @class */ (function () {
    function GanttMouseEvent(evt, state) {
        this.state = null;
        this.consumed = false;
        this.evt = evt;
        if (state) {
            this.state = state;
            this.sourcerState = state;
        }
    }
    GanttMouseEvent.prototype.getEvent = function () {
        return this.evt;
    };
    GanttMouseEvent.prototype.getX = function () {
        return this.getEvent().clientX;
    };
    GanttMouseEvent.prototype.getY = function () {
        return this.getEvent().clientY;
    };
    GanttMouseEvent.prototype.isComsumed = function () {
        return this.consumed;
    };
    GanttMouseEvent.prototype.consume = function (preventDefault) {
        if (preventDefault && this.evt.preventDefault) {
            this.evt.preventDefault();
        }
        // Sets local consumed state
        this.consumed = true;
    };
    return GanttMouseEvent;
}());

var GanttEventFunc = /** @class */ (function () {
    function GanttEventFunc() {
    }
    GanttEventFunc.redirectMouseEvents = function (node, gantt, state) {
        GanttEventFunc.addGestureListeners(node, function (evt) {
            gantt.fireMouseEvent(GanttEvent$1.MOUSEDOWN, new GanttMouseEvent(evt, state));
        }, function (evt) {
            gantt.fireMouseEvent(GanttEvent$1.MOUSEMOVE, new GanttMouseEvent(evt, state));
        }, function (evt) {
            gantt.fireMouseEvent(GanttEvent$1.MOUSEUP, new GanttMouseEvent(evt, state));
        });
    };
    GanttEventFunc.addGestureListeners = function (node, startListener, moveListener, endListener) {
        if (startListener != null) {
            node.addEventListener('mousedown', startListener);
        }
        if (moveListener != null) {
            node.addEventListener('mousemove', moveListener);
        }
        if (endListener != null) {
            node.addEventListener('mouseup', endListener);
        }
    };
    return GanttEventFunc;
}());

var GanttSvgCanvas = /** @class */ (function () {
    function GanttSvgCanvas(root) {
        this.minStrokeWidth = 1;
        this.root = root;
        this.reset();
    }
    GanttSvgCanvas.prototype.rect = function (x, y, width, height, rx, paddingVertical, paddingHorizontal) {
        var n = this.createElement('rect');
        if (paddingVertical) {
            height -= paddingVertical;
            y += paddingVertical / 2;
        }
        if (paddingHorizontal) {
            width -= paddingHorizontal;
            x += paddingHorizontal / 2;
        }
        n.setAttribute('x', "".concat(x));
        n.setAttribute('y', "".concat(y));
        n.setAttribute('width', "".concat(width));
        n.setAttribute('height', "".concat(height));
        if (rx) {
            n.setAttribute('rx', "".concat(rx));
        }
        this.node = n;
    };
    GanttSvgCanvas.prototype.ellipse = function (x, y, width, height) {
        var n = this.createElement('ellipse');
        n.setAttribute('cx', "".concat(x + width / 2));
        n.setAttribute('cy', "".concat(y + height / 2));
        n.setAttribute('rx', "".concat(width / 2));
        n.setAttribute('ry', "".concat(height / 2));
        this.node = n;
    };
    GanttSvgCanvas.prototype.end = function () {
        this.addNode(true, true);
    };
    GanttSvgCanvas.prototype.addNode = function (filled, stroke) {
        var node = this.node;
        if (node) {
            if (filled && this.state.fillColor) {
                this.updateFill();
            }
            else {
                node.setAttribute('fill', 'none');
            }
            if (stroke && this.state.strokeColor) {
                this.updateStroke();
            }
        }
        this.root.appendChild(this.node);
    };
    GanttSvgCanvas.prototype.updateFill = function () {
        this.node.setAttribute('fill', String(this.state.fillColor).toLowerCase());
        this.node.setAttribute('fill-opacity', String(this.state.alpha).toLowerCase());
    };
    GanttSvgCanvas.prototype.updateStroke = function () {
        var s = this.state;
        this.node.setAttribute('stroke', String(s.strokeColor).toLocaleLowerCase());
        if (s.alpha < 1 || s.strokeAlpha < 1) {
            this.node.setAttribute('stroke-opacity', (s.alpha * s.strokeAlpha).toString());
        }
        var sw = this.getCurrentStrokeWidth();
        if (sw !== 1) {
            this.node.setAttribute('stroke-width', sw.toString());
        }
        if (s.dashed) {
            this.node.setAttribute('stroke-dasharray', this.createDashPattern(((s.fixDash) ? 1 : s.strokeWidth) * s.scale));
        }
    };
    GanttSvgCanvas.prototype.format = function (value) {
        return parseFloat(parseFloat(value).toFixed(2));
    };
    GanttSvgCanvas.prototype.getCurrentStrokeWidth = function () {
        return Math.max(this.minStrokeWidth, Math.max(0.01, this.format(this.state.strokeWidth * this.state.scale)));
    };
    GanttSvgCanvas.prototype.createDashPattern = function (scale) {
        var pat = [];
        if (typeof (this.state.dashPattern) === 'string') {
            var dash = this.state.dashPattern.split(' ');
            if (dash.length > 0) {
                for (var i = 0; i < dash.length; i++) {
                    pat[i] = Number(dash[i]) * scale;
                }
            }
        }
        return pat.join(' ');
    };
    GanttSvgCanvas.prototype.createElement = function (tagName) {
        var elt = this.root.ownerDocument.createElement(tagName);
        return elt;
    };
    GanttSvgCanvas.prototype.reset = function () {
        this.state = this.createState();
    };
    GanttSvgCanvas.prototype.createState = function () {
        return {
            fillColor: null,
            alpha: 1,
            strokeColor: null,
            dashed: false,
            dashPattern: '3 3',
            fixDash: false,
            strokeWidth: 1,
            scale: 1,
            strokeAlpha: 1
        };
    };
    GanttSvgCanvas.prototype.setFillColor = function (value) {
        this.state.fillColor = value;
    };
    GanttSvgCanvas.prototype.setStrokeColor = function (value) {
        this.state.strokeColor = value;
    };
    GanttSvgCanvas.prototype.setStrokeWidth = function (vaule) {
        this.state.strokeWidth = vaule;
    };
    GanttSvgCanvas.prototype.setDashed = function (value, fixDash) {
        this.state.dashed = value;
        this.state.fixDash = fixDash;
    };
    GanttSvgCanvas.prototype.setDashPattern = function (value) {
        this.state.dashPattern = value;
    };
    GanttSvgCanvas.prototype.setAlpha = function (value) {
        this.state.alpha = value;
    };
    return GanttSvgCanvas;
}());

var ganttShape = /** @class */ (function () {
    function ganttShape() {
        this.initStyles();
    }
    ganttShape.prototype.initStyles = function () {
        this.strokeWidth = 1;
        this.opacity = 100;
    };
    ganttShape.prototype.init = function (container) {
        this.node = this.create(container);
        if (container) {
            container.appendChild(this.node);
        }
    };
    ganttShape.prototype.create = function (container) {
        return this.createSvg();
    };
    ganttShape.prototype.createSvg = function () {
        return document.createElementNS('http://www.w3.org/2000/svg', 'g');
    };
    ganttShape.prototype.redraw = function () {
        this.clear();
        var canvas = this.createCanvas();
        this.doRedrawShape(canvas);
        this.node.insertAdjacentHTML('beforeend', canvas.root.outerHTML);
    };
    ganttShape.prototype.doRedrawShape = function (canvas) {
        this.beforePaint(canvas);
        this.paint(canvas);
        this.afterPaint(canvas);
    };
    ganttShape.prototype.beforePaint = function (canvas) { };
    ganttShape.prototype.paint = function (canvas) {
        this.configureCanvas(canvas);
        this.paintShape(canvas, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    };
    ganttShape.prototype.afterPaint = function (canvas) { };
    ganttShape.prototype.paintShape = function (canvas, x, y, width, height) {
        this.paintBackground(canvas, x, y, width, height);
        this.paintForeground(canvas, x, y, width, height);
    };
    ganttShape.prototype.paintBackground = function (canvas, x, y, width, height) { };
    ganttShape.prototype.paintForeground = function (canvas, x, y, width, height) { };
    ganttShape.prototype.configureCanvas = function (c) {
        c.setFillColor(this.fillColor);
        c.setAlpha(this.opacity / 100);
        c.setDashed(true, true);
        c.setStrokeColor(this.stroke);
    };
    ganttShape.prototype.createCanvas = function () {
        return new GanttSvgCanvas(this.node);
    };
    ganttShape.prototype.apply = function (state) {
        this.state = state;
    };
    ganttShape.prototype.destroy = function () {
        if (this.node.parentNode != null) {
            this.node.parentNode.removeChild(this.node);
        }
    };
    ganttShape.prototype.setCursor = function (cursor) {
        if (cursor === undefined) {
            cursor = '';
        }
        this.cursor = cursor;
        if (this.node != null) {
            this.node.style.cursor = cursor;
        }
    };
    ganttShape.prototype.clear = function () {
        if (this.node.ownerSVGElement != null) {
            while (this.node.lastChild != null) {
                this.node.removeChild(this.node.lastChild);
            }
        }
        else {
            this.node.style.cssText = 'position:absolute;' + ((this.cursor != null) ?
                ('cursor:' + this.cursor + ';') : '');
            this.node.innerHTML = '';
        }
    };
    return ganttShape;
}());

var BorderShape = /** @class */ (function (_super) {
    __extends(BorderShape, _super);
    function BorderShape(bounds, fillColor, stroke, strokeWidth) {
        var _this = _super.call(this) || this;
        _this.bounds = bounds;
        _this.fillColor = fillColor;
        _this.stroke = stroke;
        if (strokeWidth !== undefined)
            _this.strokeWidth = strokeWidth;
        return _this;
    }
    BorderShape.prototype.paintBackground = function (canvas, x, y, width, height) {
        canvas.rect(x, y, width, height, 4, 0);
        canvas.end();
    };
    return BorderShape;
}(ganttShape));

var GanttPoint = /** @class */ (function () {
    function GanttPoint(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    return GanttPoint;
}());

var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = 0;
        this.y = 0;
        if (x)
            this.x = x;
        if (y)
            this.y = y;
    }
    return Point;
}());

function convertPoint(container, x, y) {
    var origin = getScrollOrigin(container, false);
    var offset = getOffset(container);
    offset.x -= origin.x;
    offset.y -= origin.y;
    return new Point(x - offset.x, y - offset.y);
}
function getScrollOrigin(node, includeAncestors) {
    includeAncestors = (includeAncestors != null) ? includeAncestors : false;
    var doc = (node != null) ? node.ownerDocument : document;
    var b = doc.body;
    var d = doc.documentElement;
    var result = new Point();
    while (node != null && node != b && node != d) {
        if (!isNaN(node.scrollLeft) && !isNaN(node.scrollTop)) {
            result.x += node.scrollLeft;
            result.y += node.scrollTop;
        }
        node = (includeAncestors) ? node.parentNode : null;
    }
    return result;
}
function getOffset(container) {
    var offsetLeft = 0;
    var offsetTop = 0;
    // Ignores document scroll origin for fixed elements
    var fixed = false;
    var node = container;
    var b = document.body;
    var d = document.documentElement;
    while (node != null && node != b && node != d && !fixed) {
        node = node.parentNode;
    }
    var r = container.getBoundingClientRect();
    if (r != null) {
        offsetLeft += r.left;
        offsetTop += r.top;
    }
    return new Point(offsetLeft, offsetTop);
}
function contains(bounds, x, y) {
    return (bounds.x <= x && bounds.x + bounds.width >= x &&
        bounds.y <= y && bounds.y + bounds.height >= y);
}

var GanttBarHandle;
(function (GanttBarHandle) {
    GanttBarHandle[GanttBarHandle["left"] = 10] = "left";
    GanttBarHandle[GanttBarHandle["right"] = 11] = "right";
})(GanttBarHandle || (GanttBarHandle = {}));
var GanttBarHandler = /** @class */ (function () {
    function GanttBarHandler(state) {
        this.sizers = [];
        this.startX = 0;
        this.startY = 0;
        this.unscaledBounds = null;
        this.bounds = null;
        this.index = null;
        this.state = state;
        this.init();
    }
    GanttBarHandler.prototype.init = function () {
        this.gantt = this.state.view.gantt;
        this.selectionBounds = this.getSelectionBounds(this.state);
        this.bounds = new GanttGeometry(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height);
        this.selectionBorder = this.createSelectionShape(this.selectionBounds);
        this.selectionBorder.init(this.gantt.view.getOverlayPane());
        // this.selectionBorder.redraw()
        // Adds the sizer handles
        this.sizers = [];
        var i = 0;
        this.sizers.push(this.createSizer('w-resize', i++));
        this.sizers.push(this.createSizer('e-resize', i++));
        this.redraw();
    };
    GanttBarHandler.prototype.createSizer = function (cursor, i) {
        var size = 6;
        var bounds = new GanttGeometry(0, 0, size, size);
        var sizer = this.createSizerShape(bounds, i);
        sizer.init(this.gantt.view.getOverlayPane());
        GanttEventFunc.redirectMouseEvents(sizer.node, this.gantt, this.state);
        sizer.setCursor(cursor);
        return sizer;
    };
    GanttBarHandler.prototype.createSizerShape = function (bounds, index) {
        return new BorderShape(bounds, '#00FF00', 'black');
    };
    GanttBarHandler.prototype.getSelectionBounds = function (state) {
        return new GanttGeometry(state.x, state.y, state.width, state.height);
    };
    GanttBarHandler.prototype.createSelectionShape = function (bounds) {
        var shape = new BorderShape(bounds, '', '#00a8ff', 1);
        return shape;
    };
    GanttBarHandler.prototype.redraw = function () {
        console.log('redraw');
        this.drawPreview();
        this.redrawHandles();
    };
    GanttBarHandler.prototype.drawPreview = function () {
        if (this.preview) {
            this.preview.bounds = this.bounds;
            console.log(this.preview.bounds);
            this.preview.redraw();
        }
        this.selectionBorder.bounds = this.bounds;
        this.selectionBorder.redraw();
    };
    GanttBarHandler.prototype.redrawHandles = function () {
        var s = this.selectionBounds;
        var r = s.x + s.width;
        var cy = s.y + s.height / 2;
        this.moveSizerTo(this.sizers[0], s.x, cy);
        this.moveSizerTo(this.sizers[1], r, cy);
    };
    GanttBarHandler.prototype.moveSizerTo = function (shape, x, y) {
        if (shape != null) {
            shape.bounds.x = Math.floor(x - shape.bounds.width / 2);
            shape.bounds.y = Math.floor(y - shape.bounds.height / 2);
            // Fixes visible inactive handles in VML
            if (shape.node != null && shape.node.style.display != 'none') {
                shape.redraw();
            }
        }
    };
    GanttBarHandler.prototype.start = function (x, y, index) {
        this.startX = x;
        this.startY = y;
        this.index = index;
        this.selectionBorder.node.style.display = 'none';
        this.preview = this.createSelectionShape(this.selectionBounds);
        this.preview.init(this.gantt.view.getOverlayPane());
    };
    GanttBarHandler.prototype.resizeVertex = function (me) {
        var point = new GanttPoint(me.graphX, me.graphY);
        var dx = point.x - this.startX;
        var dy = 0;
        var geo = this.gantt.getCellGeometry(this.state.cell);
        this.unscaledBounds = new GanttGeometry(geo === null || geo === void 0 ? void 0 : geo.x, geo === null || geo === void 0 ? void 0 : geo.y, (geo === null || geo === void 0 ? void 0 : geo.width) + dx, (geo === null || geo === void 0 ? void 0 : geo.height) + dy);
        this.bounds = new GanttGeometry(this.unscaledBounds.x, this.unscaledBounds.y, this.unscaledBounds.width, this.unscaledBounds.height);
        if (this.preview) {
            this.drawPreview();
        }
    };
    GanttBarHandler.prototype.getHandleForEvent = function (me) {
        var checkShape = function (me, sizer) {
            var x = me.graphX;
            var y = me.graphY;
            return contains(sizer.bounds, x, y);
        };
        var handle = null;
        this.sizers.forEach(function (sizer, index) {
            if (checkShape(me, sizer)) {
                handle = index;
            }
        });
        return handle;
    };
    GanttBarHandler.prototype.mouseDown = function (me) {
        if (!me.isComsumed()) {
            var handle = this.getHandleForEvent(me);
            if (handle) {
                this.start(me.graphX, me.graphY, GanttBarHandle.left);
                me.consume();
            }
        }
    };
    GanttBarHandler.prototype.mouseMove = function (me) {
        if (!me.isComsumed() && this.index != null) {
            this.resizeVertex(me);
        }
    };
    GanttBarHandler.prototype.mouseUp = function (me) {
        console.log(this.index);
        if (this.index !== null && this.state !== null && !me.isComsumed()) {
            this.index;
            this.index = null;
            var point = new GanttPoint(me.graphX, me.graphY);
            this.gantt.model.beginUpdate();
            try {
                var dx = point.x - this.startX;
                var dy = point.y - this.startY;
                this.resizeCell(this.state.cell);
            }
            finally {
                this.gantt.model.endUpdate();
            }
            me.consume();
            this.reset();
            this.redrawHandles();
        }
    };
    GanttBarHandler.prototype.resizeCell = function (cell) {
        if (this.unscaledBounds) {
            this.gantt.resizeCell(cell, this.unscaledBounds);
        }
    };
    GanttBarHandler.prototype.reset = function () {
        this.index = null;
        if (this.preview) {
            this.preview.destroy();
        }
        if (this.selectionBorder) {
            // todo: update new bounds
            this.selectionBorder.node.style.display = 'inline';
            this.selectionBounds = this.getSelectionBounds(this.state);
            this.bounds = new GanttGeometry(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height);
            console.log('reset');
            this.drawPreview();
        }
        this.unscaledBounds = null;
    };
    GanttBarHandler.prototype.destroy = function () {
        if (this.selectionBorder) {
            this.selectionBorder.destroy();
        }
        if (this.preview) {
            this.preview.destroy();
        }
        if (this.sizers) {
            for (var i = 0; i < this.sizers.length; i++) {
                this.sizers[i].destroy();
            }
        }
    };
    return GanttBarHandler;
}());

var GanttPopupHandler = /** @class */ (function (_super) {
    __extends(GanttPopupHandler, _super);
    function GanttPopupHandler(gantt) {
        var _this = _super.call(this) || this;
        _this.gantt = gantt;
        return _this;
    }
    return GanttPopupHandler;
}(GanttEventSource));

var GanttRectangleShape = /** @class */ (function (_super) {
    __extends(GanttRectangleShape, _super);
    function GanttRectangleShape(bounds, fillColor) {
        var _this = _super.call(this) || this;
        _this.bounds = bounds;
        _this.fillColor = fillColor;
        return _this;
    }
    GanttRectangleShape.prototype.paintBackground = function (canvas, x, y, width, height) {
        canvas.rect(x, y, width, height, 4);
        canvas.end();
    };
    return GanttRectangleShape;
}(ganttShape));

var GanttBarRenderer = /** @class */ (function () {
    function GanttBarRenderer() {
        this.defaultShapes = new Map();
        this.defaultShape = GanttRectangleShape;
    }
    GanttBarRenderer.prototype.redraw = function (state) {
        this.redrawShape(state);
    };
    GanttBarRenderer.prototype.redrawShape = function (state) {
        if (state.shape) {
            state.shape.destroy();
            state.shape = null;
        }
        if (state.shape === null) {
            state.shape = this.createShape(state);
            this.initializeShape(state);
            this.installListeners(state);
            state.shape.apply(state);
            state.shape.bounds = new GanttGeometry(state.x, state.y, state.width, state.height);
            this.doRedrawShape(state);
        }
    };
    GanttBarRenderer.prototype.initializeShape = function (state) {
        var _a;
        (_a = state.shape) === null || _a === void 0 ? void 0 : _a.init(state.view.getDrawPane());
    };
    GanttBarRenderer.prototype.installListeners = function (state) {
        var _a, _b, _c;
        var gantt = state.view.gantt;
        (_a = state.shape) === null || _a === void 0 ? void 0 : _a.node.addEventListener(GanttEvent$1.MOUSEDOWN, function (evt) {
            gantt.fireMouseEvent(GanttEvent$1.MOUSEDOWN, new GanttMouseEvent(evt, state));
        });
        (_b = state.shape) === null || _b === void 0 ? void 0 : _b.node.addEventListener(GanttEvent$1.MOUSEMOVE, function (evt) {
            gantt.fireMouseEvent(GanttEvent$1.MOUSEMOVE, new GanttMouseEvent(evt, state));
        });
        (_c = state.shape) === null || _c === void 0 ? void 0 : _c.node.addEventListener(GanttEvent$1.MOUSEUP, function (evt) {
            gantt.fireMouseEvent(GanttEvent$1.MOUSEUP, new GanttMouseEvent(evt, state));
        });
    };
    GanttBarRenderer.prototype.doRedrawShape = function (state) {
        var _a;
        (_a = state.shape) === null || _a === void 0 ? void 0 : _a.redraw();
    };
    GanttBarRenderer.prototype.createShape = function (state) {
        var ctor = this.getShapeConstructor(state);
        return new ctor(state.cell.geometry, '#ccc');
    };
    GanttBarRenderer.prototype.registerShape = function (key, shape) {
        this.defaultShapes.set(key, shape);
    };
    GanttBarRenderer.prototype.getShapeConstructor = function (state) {
        var ctor = this.getShape('');
        if (!ctor) {
            return this.defaultShape;
        }
        return ctor;
    };
    GanttBarRenderer.prototype.getShape = function (name) {
        return name ? this.defaultShapes.get(name) : null;
    };
    return GanttBarRenderer;
}());

var GanttHandler = /** @class */ (function () {
    function GanttHandler(gantt) {
        this.selectEnabled = true;
        this.moveEnabled = true;
        this.cellWasClicked = false;
        this.gantt = gantt;
        this.gantt.addMouseListener(this);
    }
    GanttHandler.prototype.isSelectEnabled = function () {
        return this.selectEnabled;
    };
    GanttHandler.prototype.setSelectEnabled = function (value) {
        this.selectEnabled = value;
    };
    GanttHandler.prototype.isMoveEnabled = function () {
        return this.moveEnabled;
    };
    GanttHandler.prototype.setMoveEnabled = function (value) {
        this.moveEnabled = value;
    };
    GanttHandler.prototype.mouseDown = function (me) {
        if (!me.isComsumed() && me.state) {
            var cell = me.state.cell;
            console.log(cell);
            if (this.isSelectEnabled()) {
                this.gantt.setSelectionCell(cell);
            }
            if (this.isMoveEnabled()) {
                this.start(cell, me.getX(), me.getY());
                this.cellWasClicked = true;
                me.consume();
            }
        }
    };
    GanttHandler.prototype.start = function (cell, x, y) { };
    GanttHandler.prototype.mouseMove = function () { };
    GanttHandler.prototype.mouseUp = function (me) {
        // if (!me.isComsumed() {
        // })
        if (this.cellWasClicked) {
            console.log('cell was click', me.getEvent());
            me.consume();
        }
        this.reset();
    };
    GanttHandler.prototype.reset = function () {
        this.cellWasClicked = false;
    };
    return GanttHandler;
}());

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".gantt .headerBackground {\n  fill: #ffffff;\n}\n\n.gantt .bodyRow {\n  fill: #f5f5f5\n}\n\n.gantt .bodyRow:nth-child(even) {\n  fill: #ffffff;\n}\n\n.gantt .row-line {\n  stroke: #ebeff2;\n}\n\n.gantt .bar {\n  fill: #1677ff;\n}\n\n.gantt .barText {\n  dominant-baseline: central;\n  fill: #555;\n}\n\n.ddd {\n  background-color: red;\n}";
styleInject(css_248z);

var GanttCellState = /** @class */ (function () {
    function GanttCellState(view, cell) {
        this.shape = null;
        this.invalid = false;
        this.view = view;
        this.cell = cell;
    }
    return GanttCellState;
}());

function createSVG(tag, attrs) {
    var elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var attr in attrs) {
        if (attr === 'append_to') {
            var parent_1 = attrs.append_to;
            parent_1.appendChild(elem);
        }
        else if (attr === 'innerHTML') {
            elem.innerHTML = attrs.innerHTML;
        }
        else {
            elem.setAttribute(attr, attrs[attr]);
        }
    }
    return elem;
}

var TableView = /** @class */ (function (_super) {
    __extends(TableView, _super);
    function TableView(gantt, mode, columnNum, columnWidth, headerHeight) {
        var _this = _super.call(this) || this;
        _this.gantt = gantt;
        _this.mode = mode;
        _this.columnNum = columnNum;
        _this.columnWidth = columnWidth;
        _this.headerHeight = headerHeight;
        return _this;
    }
    TableView.prototype.init = function (container) {
        this.container = container;
        this.createSvg();
        this.renderTable();
    };
    TableView.prototype.createSvg = function () {
        var tablePanel = this.createGElement();
        this.tableHeaderPanel = this.createGElement();
        this.tableHeaderPanel.classList.add('tableHeaderPanel');
        tablePanel.appendChild(this.tableHeaderPanel);
        this.tableBodyPanel = this.createGElement();
        this.tableBodyPanel.classList.add('tableBodyPanel');
        tablePanel.appendChild(this.tableBodyPanel);
        this.tableBorderPanel = this.createGElement();
        this.tableBorderPanel.classList.add('tableBorderPanel');
        tablePanel.appendChild(this.tableBorderPanel);
        this.container.appendChild(tablePanel);
    };
    TableView.prototype.renderTable = function () {
        this.redrawTableHeader();
        this.redrawTableBody();
        this.redrawTableBorder();
        this.updateGanttBounds();
    };
    TableView.prototype.updateGanttBounds = function () {
        this.gantt.view.ganttBounds = new GanttGeometry(0, 0, this.getTableWidth(), this.getTableHeight());
    };
    TableView.prototype.redrawTableHeader = function () {
        createSVG('rect', {
            x: 0,
            y: 0,
            width: this.getTableWidth(),
            height: this.headerHeight,
            class: 'headerBackground',
            append_to: this.tableHeaderPanel
        });
        for (var i = 0; i <= this.columnNum; i++) {
            var curDate = this.gantt.ganttStart.add(i, 'month');
            var curYear = curDate.year();
            var curMonth = curDate.month() + 1;
            if (curMonth === 6) {
                createSVG('text', {
                    x: i * this.getRenderColumnWidth() + this.getRenderColumnWidth() / 2,
                    y: 30,
                    innerHTML: curYear,
                    append_to: this.tableHeaderPanel
                });
            }
            createSVG('text', {
                x: i * this.getRenderColumnWidth(),
                y: 50,
                innerHTML: curMonth,
                append_to: this.tableHeaderPanel
            });
        }
    };
    Object.defineProperty(TableView.prototype, "rowHeight", {
        /** row 高度 */
        get: function () {
            return this.gantt.options.barHeight + this.gantt.options.padding;
        },
        enumerable: false,
        configurable: true
    });
    TableView.prototype.redrawTableBody = function () {
        var _this = this;
        var bodyHeight = 0;
        this.gantt.tasks.forEach(function (task, index) {
            createSVG('rect', {
                x: 0,
                y: index * _this.rowHeight + _this.headerHeight,
                width: _this.getTableWidth(),
                height: _this.rowHeight,
                class: 'bodyRow',
                append_to: _this.tableBodyPanel,
            });
            bodyHeight += _this.rowHeight;
        });
    };
    TableView.prototype.redrawTableBorder = function () {
        // 竖向 line
        for (var i = 0; i <= this.columnNum; i++) {
            createSVG('line', {
                x1: this.getRenderColumnWidth() * i,
                y1: this.headerHeight,
                x2: this.getRenderColumnWidth() * i,
                y2: this.headerHeight + this.rowHeight * this.gantt.tasks.length,
                class: 'row-line',
                append_to: this.tableBorderPanel,
            });
        }
    };
    TableView.prototype.createGElement = function () {
        return document.createElementNS('http://www.w3.org/2000/svg', 'g');
    };
    /** 获取 header 宽度 */
    TableView.prototype.getTableWidth = function () {
        return this.columnNum * this.getRenderColumnWidth();
    };
    TableView.prototype.getTableHeight = function () {
        return this.headerHeight + this.rowHeight * this.gantt.tasks.length;
    };
    TableView.prototype.getRenderColumnWidth = function () {
        if (this.mode) {
            return this.columnWidth * 4;
        }
        return this.columnWidth;
    };
    return TableView;
}(GanttEventSource));

var GanttView = /** @class */ (function (_super) {
    __extends(GanttView, _super);
    function GanttView(gantt) {
        var _this = _super.call(this) || this;
        _this.gantt = gantt;
        _this.states = new Map();
        return _this;
    }
    GanttView.prototype.init = function () {
        this.installListener();
        this.createSvg();
    };
    GanttView.prototype.isContainerEvent = function (evt) {
        var source = evt.srcElement ? evt.srcElement : evt.target;
        var containerElement = [
            this.gantt.container,
        ];
        var sourceParnet = source.parentNode;
        return containerElement.some(function (element) { return element === source; }) || [this.tableView.tableBodyPanel].some(function (ele) { return ele === sourceParnet; });
    };
    GanttView.prototype.installListener = function () {
        var _this = this;
        var container = this.gantt.container;
        var gantt = this.gantt;
        container.addEventListener(GanttEvent$1.MOUSEDOWN, function (evt) {
            if (_this.isContainerEvent(evt))
                gantt.fireMouseEvent(GanttEvent$1.MOUSEDOWN, new GanttMouseEvent(evt));
        });
        container.addEventListener(GanttEvent$1.MOUSEMOVE, function (evt) {
            if (_this.isContainerEvent(evt))
                gantt.fireMouseEvent(GanttEvent$1.MOUSEMOVE, new GanttMouseEvent(evt));
        });
        container.addEventListener(GanttEvent$1.MOUSEUP, function (evt) {
            if (_this.isContainerEvent(evt))
                gantt.fireMouseEvent(GanttEvent$1.MOUSEUP, new GanttMouseEvent(evt));
        });
    };
    GanttView.prototype.createGElement = function () {
        return document.createElementNS('http://www.w3.org/2000/svg', 'g');
    };
    GanttView.prototype.createSvg = function () {
        var container = this.gantt.container;
        var canvas = (this.canvas = document.createElementNS('http://www.w3.org/2000/svg', 'g'));
        canvas.classList.add('canvas');
        this.tableView = new TableView(this.gantt, this.gantt.options.viewMode, this.gantt.diffMonth + 1, this.gantt.options.columnWidth, this.gantt.options.headerHeight);
        this.tableView.init(canvas);
        this.drawPane = this.createGElement();
        this.drawPane.classList.add('drawPane');
        canvas.appendChild(this.drawPane);
        this.overlayPane = this.createGElement();
        this.overlayPane.classList.add('overlayPane');
        canvas.appendChild(this.overlayPane);
        var root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        root.style.left = '0px';
        root.style.top = '0px';
        root.style.width = '100%';
        root.style.height = '100%';
        root.style.display = 'block';
        root.classList.add('gantt');
        root.appendChild(this.canvas);
        if (container != null) {
            container.appendChild(root);
        }
    };
    GanttView.prototype.getState = function (cell) {
        var state = null;
        if (cell) {
            state = this.states.get(cell);
            if (!state) {
                state = this.createState(cell);
                this.states.set(cell, state);
            }
        }
        return state;
    };
    GanttView.prototype.createState = function (cell) {
        return new GanttCellState(this, cell);
    };
    GanttView.prototype.invalidate = function (cell) {
        var state = this.getState(cell);
        if (state) {
            state.invalid = true;
        }
    };
    GanttView.prototype.validate = function () {
        var _this = this;
        var cells = this.gantt.model.cells;
        cells.forEach(function (cell) {
            var state = _this.getState(cell);
            if (state === null || state === void 0 ? void 0 : state.invalid) {
                state.invalid = false;
                _this.updateCellState(state);
                _this.gantt.barRenderer.redraw(state);
            }
        });
    };
    GanttView.prototype.updateCellState = function (state) {
        var geo = this.gantt.getCellGeometry(state.cell);
        if (geo !== null) {
            state.x = geo.x;
            state.y = geo.y;
            state.width = geo.width;
            state.height = geo.height;
        }
    };
    GanttView.prototype.getDrawPane = function () {
        return this.drawPane;
    };
    GanttView.prototype.getOverlayPane = function () {
        return this.overlayPane;
    };
    return GanttView;
}(GanttEventSource));

var GanttUndoableEdit = /** @class */ (function () {
    function GanttUndoableEdit(source) {
        this.source = source;
        this.changes = [];
    }
    GanttUndoableEdit.prototype.add = function (change) {
        this.changes.push(change);
    };
    GanttUndoableEdit.prototype.notify = function () { };
    GanttUndoableEdit.prototype.isEmpty = function () {
        return this.changes.length === 0;
    };
    return GanttUndoableEdit;
}());

var GanttChildChange = /** @class */ (function () {
    function GanttChildChange(model, cell) {
        this.model = model;
        this.cell = cell;
    }
    GanttChildChange.prototype.execute = function () {
    };
    return GanttChildChange;
}());
var mxGeometryChange = /** @class */ (function () {
    function mxGeometryChange(model, cell, geometry) {
        this.model = model;
        this.cell = cell;
        this.geometry = geometry;
        this.previous = geometry;
    }
    mxGeometryChange.prototype.execute = function () {
        if (this.cell != null) {
            this.geometry = this.previous;
            this.previous = this.model.geometryForCellChanged(this.cell, this.previous);
        }
    };
    return mxGeometryChange;
}());
var GanttModel = /** @class */ (function (_super) {
    __extends(GanttModel, _super);
    function GanttModel() {
        var _this = _super.call(this) || this;
        _this.updateLevel = 0;
        _this.endingUpdate = false;
        _this.cells = [];
        _this.currentEdit = _this.createUndoableEdit();
        return _this;
    }
    GanttModel.prototype.add = function (cell) {
        this.cells.push(cell);
        this.execute(new GanttChildChange(this, cell));
    };
    GanttModel.prototype.execute = function (change) {
        change.execute();
        this.beginUpdate();
        this.currentEdit.add(change);
        this.endUpdate();
    };
    GanttModel.prototype.createUndoableEdit = function () {
        var edit = new GanttUndoableEdit(this);
        edit.notify = function () {
            var evt = new GanttEventObject(GanttEvent$1.CHANGE, 'edit', edit, 'chagnes', edit.changes);
            edit.source.fireEvent(evt);
        };
        return edit;
    };
    GanttModel.prototype.beginUpdate = function () {
        this.updateLevel++;
    };
    GanttModel.prototype.endUpdate = function () {
        this.updateLevel--;
        if (!this.endingUpdate) {
            this.endingUpdate = this.updateLevel === 0;
            try {
                if (this.endingUpdate && !this.currentEdit.isEmpty()) {
                    var tmp = this.currentEdit;
                    this.currentEdit = this.createUndoableEdit();
                    tmp.notify();
                }
            }
            finally {
                this.endingUpdate = false;
            }
        }
    };
    GanttModel.prototype.getGeometry = function (cell) {
        return cell ? cell.getGeometry() : null;
    };
    GanttModel.prototype.setGeometry = function (cell, geometry) {
        this.execute(new mxGeometryChange(this, cell, geometry));
        return geometry;
    };
    GanttModel.prototype.geometryForCellChanged = function (cell, geometry) {
        var previous = this.getGeometry(cell);
        cell.setGeometry(geometry);
        return previous;
    };
    return GanttModel;
}(GanttEventSource));

var GanttCell = /** @class */ (function () {
    function GanttCell(value, geometry, style) {
        this.value = value;
        this.geometry = geometry;
        this.style = style;
    }
    GanttCell.prototype.getGeometry = function () {
        return this.geometry;
    };
    GanttCell.prototype.setGeometry = function (geometry) {
        this.geometry = geometry;
    };
    return GanttCell;
}());

var _a;
var ViewMode;
(function (ViewMode) {
    ViewMode["DAY"] = "Day";
    ViewMode["WEEK"] = "Week";
    ViewMode["MONTH"] = "Month";
    ViewMode["YEAR"] = "Year";
})(ViewMode || (ViewMode = {}));
// viewModel 到 dayjs 单位的 map
var viewModeMapDayjsUnit = (_a = {},
    _a[ViewMode.DAY] = 'day',
    _a[ViewMode.WEEK] = 'week',
    _a[ViewMode.MONTH] = 'month',
    _a[ViewMode.YEAR] = 'year',
    _a);
var Gantt = /** @class */ (function (_super) {
    __extends(Gantt, _super);
    function Gantt(container, tasks, options) {
        var _this = _super.call(this) || this;
        _this.mouseListeners = [];
        _this.isMouseDown = false;
        _this.tasks = tasks;
        _this.options = options;
        _this.container = container;
        _this.setupOptions();
        _this.barRenderer = _this.createBarRenderer();
        _this.model = new GanttModel();
        _this.selectionModel = new GanttSelectionModel(_this);
        _this.view = _this.createGanttView();
        _this.model.addListener(GanttEvent$1.CHANGE, function (evt) {
            evt.getProperty('edit').changes.forEach(_this.processChange.bind(_this));
            _this.view.validate();
        });
        _this.codeToGantt = new CodeToGantt(_this, _this.tasks, _this.options);
        _this.createHandlers();
        if (container) {
            _this.init(container);
        }
        _this.sizeDidChange();
        _this.autoCreateCell();
        return _this;
    }
    Gantt.prototype.setSelectionCell = function (cell) {
        this.selectionModel.setCell(cell);
    };
    Gantt.prototype.setSelectionCells = function (cells) {
        this.selectionModel.setCells(cells);
    };
    Gantt.prototype.sizeDidChange = function () {
        var bounds = this.view.ganttBounds;
        var root = this.view.getDrawPane().ownerSVGElement;
        if (root) {
            root.style.minWidth = "".concat(bounds.width, "px");
            root.style.minHeight = "".concat(bounds.height, "px");
        }
    };
    Gantt.prototype.insertBar = function (id, value, x, y, width, height) {
        var ganttCell = new GanttCell(value, new GanttGeometry(x, y, width, height), {});
        ganttCell.id = id;
        this.addCell(ganttCell);
    };
    Gantt.prototype.autoCreateCell = function () {
        var _this = this;
        this.codeToGantt.datas.forEach(function (item) {
            _this.insertBar(item.id, item.value, item.x, item.y, item.width, item.height);
        });
    };
    Gantt.prototype.processChange = function (change) {
        if (change instanceof GanttChildChange) {
            this.view.invalidate(change.cell);
        }
        else if (change instanceof mxGeometryChange) {
            this.view.invalidate(change.cell);
        }
    };
    Gantt.prototype.createGanttView = function () {
        return new GanttView(this);
    };
    Gantt.prototype.init = function (container) {
        this.view.init();
    };
    Gantt.prototype.addCell = function (cell) {
        this.addCells([cell]);
    };
    Gantt.prototype.addCells = function (cells) {
        var _this = this;
        cells.forEach(function (cell) {
            _this.model.add(cell);
        });
    };
    Gantt.prototype.addMouseListener = function (listener) {
        this.mouseListeners.push(listener);
    };
    Gantt.prototype.intersects = function (state, x, y) {
        return contains(state.cell.geometry, x, y);
    };
    Gantt.prototype.getCellAt = function (x, y) {
        var cells = this.model.cells;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var state = this.view.getState(cell);
            if (state && this.intersects(state, x, y)) {
                return cell;
            }
        }
    };
    Gantt.prototype.updateMouseDown = function (me, eventName) {
        if (eventName === GanttEvent$1.MOUSEUP && this.isMouseDown) {
            this.isMouseDown = false;
        }
        else if (eventName === GanttEvent$1.MOUSEDOWN && !this.isMouseDown) {
            this.isMouseDown = true;
        }
    };
    Gantt.prototype.fireMouseEvent = function (eventName, me) {
        var pt = convertPoint(this.container, me.getX(), me.getY());
        me.graphX = pt.x;
        me.graphY = pt.y;
        if (this.isMouseDown && eventName === GanttEvent$1.MOUSEMOVE) {
            var cell = this.getCellAt(me.graphX, me.graphY);
            if (cell) {
                me.state = this.view.getState(cell);
            }
        }
        this.updateMouseDown(me, eventName);
        for (var i = 0; i < this.mouseListeners.length; i++) {
            var l = this.mouseListeners[i];
            if (eventName === GanttEvent$1.MOUSEDOWN) {
                l.mouseDown.apply(l, [me]);
            }
            else if (eventName === GanttEvent$1.MOUSEMOVE) {
                l.mouseMove.apply(l, [me]);
            }
            else if (eventName === GanttEvent$1.MOUSEUP) {
                console.log(l, 'mouseup');
                l.mouseUp.apply(l, [me]);
            }
        }
        if (eventName === GanttEvent$1.MOUSEUP) {
            this.click(me);
        }
    };
    Gantt.prototype.click = function (me) {
        var _a;
        me.getEvent();
        var cell = (_a = me.state) === null || _a === void 0 ? void 0 : _a.cell;
        // todo: fire click event
        console.log(me.isComsumed());
        if (!me.isComsumed()) {
            if (cell) {
                this.setSelectionCell(cell);
            }
            else {
                this.clearSelection();
            }
        }
    };
    Gantt.prototype.clearSelection = function () {
        this.selectionModel.clear();
    };
    Gantt.prototype.getCellGeometry = function (cell) {
        return this.model.getGeometry(cell);
    };
    Gantt.prototype.addBar = function () {
    };
    Gantt.prototype.createBarRenderer = function () {
        return new GanttBarRenderer();
    };
    Gantt.prototype.createHandlers = function () {
        this.selectionBarHandler = this.createSelectionBarHandler();
        this.ganttHandler = this.createGanttHandler();
        this.createPopupHandler();
    };
    Gantt.prototype.createGanttHandler = function () {
        return new GanttHandler(this);
    };
    Gantt.prototype.createBarHandler = function (state) {
        return new GanttBarHandler(state);
    };
    Gantt.prototype.createSelectionBarHandler = function () {
        return new GanttSelectionCellsHandler(this);
    };
    Gantt.prototype.createPopupHandler = function () {
        return new GanttPopupHandler(this);
    };
    Gantt.prototype.resizeCell = function (cell, bounds) {
        this.resizeCells([cell], [bounds]);
    };
    Gantt.prototype.resizeCells = function (cells, bounds) {
        this.model.beginUpdate();
        try {
            this.cellsResized(cells, bounds);
        }
        finally {
            this.model.endUpdate();
        }
    };
    Gantt.prototype.cellsResized = function (cells, bounds) {
        var _this = this;
        this.model.beginUpdate();
        try {
            cells.forEach(function (cell, index) {
                _this.cellResized(cell, bounds[index]);
            });
        }
        finally {
            this.model.endUpdate();
        }
    };
    Gantt.prototype.cellResized = function (cell, bounds) {
        var prev = this.getCellGeometry(cell);
        var geo = prev === null || prev === void 0 ? void 0 : prev.clone();
        geo.x = bounds.x;
        geo.y = bounds.y;
        geo.width = bounds.width;
        geo.height = bounds.height;
        this.model.beginUpdate();
        try {
            this.model.setGeometry(cell, geo);
        }
        finally {
            this.model.endUpdate();
        }
    };
    Gantt.prototype.getSplitNumber = function (task) {
        return dayjs(task.end).diff(dayjs(task.start), viewModeMapDayjsUnit[this.options.viewMode]) + 1;
    };
    Gantt.prototype.createGElement = function () {
        return document.createElementNS('http://www.w3.org/2000/svg', 'g');
    };
    Gantt.prototype.setupOptions = function () {
        var defaultOptions = {
            headerHeight: 80,
            columnWidth: 30,
            step: 24,
            viewMode: ViewMode.DAY,
            barHeight: 30,
            padding: 18
        };
        this.options = Object.assign({}, defaultOptions, this.options);
    };
    Gantt.prototype.getRenderColumnWidth = function () {
        if (this.options.viewMode) {
            return this.options.columnWidth * 4;
        }
        return this.options.columnWidth;
    };
    /** 获取 header 宽度 */
    Gantt.prototype.getTableWidth = function () {
        return this.diffMonth * this.getRenderColumnWidth();
    };
    Object.defineProperty(Gantt.prototype, "ganttStart", {
        // get headerHeight() {
        //   return this.options.headerHeight + 10;
        // }
        get: function () {
            return this.codeToGantt.ganttStart;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Gantt.prototype, "ganttEnd", {
        get: function () {
            return this.codeToGantt.ganttEnd;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Gantt.prototype, "diffMonth", {
        get: function () {
            return this.codeToGantt.diffMonth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Gantt.prototype, "rowHeight", {
        /** row 高度 */
        get: function () {
            return this.options.barHeight + this.options.padding;
        },
        enumerable: false,
        configurable: true
    });
    Gantt.prototype.dispose = function () { };
    return Gantt;
}(GanttEventSource));

export { Gantt as default };
