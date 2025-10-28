var Na = Object.defineProperty;
var za = (r, e, t) => e in r ? Na(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var U = (r, e, t) => za(r, typeof e != "symbol" ? e + "" : e, t);
import { defineComponent as Ga, ref as j, computed as ns, watch as Ye, nextTick as ut, inject as Wa, onMounted as Xa, onBeforeUnmount as Ja, createElementBlock as z, openBlock as G, Fragment as Pt, createElementVNode as E, createCommentVNode as xe, unref as jA, createTextVNode as Rt, toDisplayString as le, normalizeClass as Vr, withModifiers as We, renderList as dA, withDirectives as Vt, vModelCheckbox as Nr, createVNode as ja, TransitionGroup as Ya, withCtx as Za, vModelText as YA } from "vue";
import { usePositionsQuery as $a, useThesisQuery as qa, useThesisConnectionsQuery as el, useSupabase as tl, extractSymbolRoot as Al } from "@y2kfund/core";
import { useQueryClient as il } from "@tanstack/vue-query";
class ye {
  constructor(e) {
    this.table = e;
  }
  //////////////////////////////////////////
  /////////////// DataLoad /////////////////
  //////////////////////////////////////////
  reloadData(e, t, A) {
    return this.table.dataLoader.load(e, void 0, void 0, void 0, t, A);
  }
  //////////////////////////////////////////
  ///////////// Localization ///////////////
  //////////////////////////////////////////
  langText() {
    return this.table.modules.localize.getText(...arguments);
  }
  langBind() {
    return this.table.modules.localize.bind(...arguments);
  }
  langLocale() {
    return this.table.modules.localize.getLocale(...arguments);
  }
  //////////////////////////////////////////
  ////////// Inter Table Comms /////////////
  //////////////////////////////////////////
  commsConnections() {
    return this.table.modules.comms.getConnections(...arguments);
  }
  commsSend() {
    return this.table.modules.comms.send(...arguments);
  }
  //////////////////////////////////////////
  //////////////// Layout  /////////////////
  //////////////////////////////////////////
  layoutMode() {
    return this.table.modules.layout.getMode();
  }
  layoutRefresh(e) {
    return this.table.modules.layout.layout(e);
  }
  //////////////////////////////////////////
  /////////////// Event Bus ////////////////
  //////////////////////////////////////////
  subscribe() {
    return this.table.eventBus.subscribe(...arguments);
  }
  unsubscribe() {
    return this.table.eventBus.unsubscribe(...arguments);
  }
  subscribed(e) {
    return this.table.eventBus.subscribed(e);
  }
  subscriptionChange() {
    return this.table.eventBus.subscriptionChange(...arguments);
  }
  dispatch() {
    return this.table.eventBus.dispatch(...arguments);
  }
  chain() {
    return this.table.eventBus.chain(...arguments);
  }
  confirm() {
    return this.table.eventBus.confirm(...arguments);
  }
  dispatchExternal() {
    return this.table.externalEvents.dispatch(...arguments);
  }
  subscribedExternal(e) {
    return this.table.externalEvents.subscribed(e);
  }
  subscriptionChangeExternal() {
    return this.table.externalEvents.subscriptionChange(...arguments);
  }
  //////////////////////////////////////////
  //////////////// Options /////////////////
  //////////////////////////////////////////
  options(e) {
    return this.table.options[e];
  }
  setOption(e, t) {
    return typeof t < "u" && (this.table.options[e] = t), this.table.options[e];
  }
  //////////////////////////////////////////
  /////////// Deprecation Checks ///////////
  //////////////////////////////////////////
  deprecationCheck(e, t, A) {
    return this.table.deprecationAdvisor.check(e, t, A);
  }
  deprecationCheckMsg(e, t) {
    return this.table.deprecationAdvisor.checkMsg(e, t);
  }
  deprecationMsg(e) {
    return this.table.deprecationAdvisor.msg(e);
  }
  //////////////////////////////////////////
  //////////////// Modules /////////////////
  //////////////////////////////////////////
  module(e) {
    return this.table.module(e);
  }
}
class ie {
  static elVisible(e) {
    return !(e.offsetWidth <= 0 && e.offsetHeight <= 0);
  }
  static elOffset(e) {
    var t = e.getBoundingClientRect();
    return {
      top: t.top + window.pageYOffset - document.documentElement.clientTop,
      left: t.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }
  static retrieveNestedData(e, t, A) {
    var i = e ? t.split(e) : [t], s = i.length, n;
    for (let o = 0; o < s && (A = A[i[o]], n = A, !!A); o++)
      ;
    return n;
  }
  static deepClone(e, t, A = []) {
    var i = {}.__proto__, s = [].__proto__;
    t || (t = Object.assign(Array.isArray(e) ? [] : {}, e));
    for (var n in e) {
      let o = e[n], a, l;
      o != null && typeof o == "object" && (o.__proto__ === i || o.__proto__ === s) && (a = A.findIndex((h) => h.subject === o), a > -1 ? t[n] = A[a].copy : (l = Object.assign(Array.isArray(o) ? [] : {}, o), A.unshift({ subject: o, copy: l }), t[n] = this.deepClone(o, l, A)));
    }
    return t;
  }
}
let sl = class Xn extends ye {
  constructor(e, t, A) {
    super(e), this.element = t, this.container = this._lookupContainer(), this.parent = A, this.reversedX = !1, this.childPopup = null, this.blurable = !1, this.blurCallback = null, this.blurEventsBound = !1, this.renderedCallback = null, this.visible = !1, this.hideable = !0, this.element.classList.add("tabulator-popup-container"), this.blurEvent = this.hide.bind(this, !1), this.escEvent = this._escapeCheck.bind(this), this.destroyBinding = this.tableDestroyed.bind(this), this.destroyed = !1;
  }
  tableDestroyed() {
    this.destroyed = !0, this.hide(!0);
  }
  _lookupContainer() {
    var e = this.table.options.popupContainer;
    return typeof e == "string" ? (e = document.querySelector(e), e || console.warn("Menu Error - no container element found matching selector:", this.table.options.popupContainer, "(defaulting to document body)")) : e === !0 && (e = this.table.element), e && !this._checkContainerIsParent(e) && (e = !1, console.warn("Menu Error - container element does not contain this table:", this.table.options.popupContainer, "(defaulting to document body)")), e || (e = document.body), e;
  }
  _checkContainerIsParent(e, t = this.table.element) {
    return e === t ? !0 : t.parentNode ? this._checkContainerIsParent(e, t.parentNode) : !1;
  }
  renderCallback(e) {
    this.renderedCallback = e;
  }
  containerEventCoords(e) {
    var t = !(e instanceof MouseEvent), A = t ? e.touches[0].pageX : e.pageX, i = t ? e.touches[0].pageY : e.pageY;
    if (this.container !== document.body) {
      let s = ie.elOffset(this.container);
      A -= s.left, i -= s.top;
    }
    return { x: A, y: i };
  }
  elementPositionCoords(e, t = "right") {
    var A = ie.elOffset(e), i, s, n;
    switch (this.container !== document.body && (i = ie.elOffset(this.container), A.left -= i.left, A.top -= i.top), t) {
      case "right":
        s = A.left + e.offsetWidth, n = A.top - 1;
        break;
      case "bottom":
        s = A.left, n = A.top + e.offsetHeight;
        break;
      case "left":
        s = A.left, n = A.top - 1;
        break;
      case "top":
        s = A.left, n = A.top;
        break;
      case "center":
        s = A.left + e.offsetWidth / 2, n = A.top + e.offsetHeight / 2;
        break;
    }
    return { x: s, y: n, offset: A };
  }
  show(e, t) {
    var A, i, s, n, o;
    return this.destroyed || this.table.destroyed ? this : (e instanceof HTMLElement ? (s = e, o = this.elementPositionCoords(e, t), n = o.offset, A = o.x, i = o.y) : typeof e == "number" ? (n = { top: 0, left: 0 }, A = e, i = t) : (o = this.containerEventCoords(e), A = o.x, i = o.y, this.reversedX = !1), this.element.style.top = i + "px", this.element.style.left = A + "px", this.container.appendChild(this.element), typeof this.renderedCallback == "function" && this.renderedCallback(), this._fitToScreen(A, i, s, n, t), this.visible = !0, this.subscribe("table-destroy", this.destroyBinding), this.element.addEventListener("mousedown", (a) => {
      a.stopPropagation();
    }), this);
  }
  _fitToScreen(e, t, A, i, s) {
    var n = this.container === document.body ? document.documentElement.scrollTop : this.container.scrollTop;
    (e + this.element.offsetWidth >= this.container.offsetWidth || this.reversedX) && (this.element.style.left = "", A ? this.element.style.right = this.container.offsetWidth - i.left + "px" : this.element.style.right = this.container.offsetWidth - e + "px", this.reversedX = !0);
    let o = Math.max(this.container.offsetHeight, n ? this.container.scrollHeight : 0);
    if (t + this.element.offsetHeight > o)
      if (A)
        switch (s) {
          case "bottom":
            this.element.style.top = parseInt(this.element.style.top) - this.element.offsetHeight - A.offsetHeight - 1 + "px";
            break;
          default:
            this.element.style.top = parseInt(this.element.style.top) - this.element.offsetHeight + A.offsetHeight + 1 + "px";
        }
      else
        this.element.style.height = o + "px";
  }
  isVisible() {
    return this.visible;
  }
  hideOnBlur(e) {
    return this.blurable = !0, this.visible && (setTimeout(() => {
      this.visible && (this.table.rowManager.element.addEventListener("scroll", this.blurEvent), this.subscribe("cell-editing", this.blurEvent), document.body.addEventListener("click", this.blurEvent), document.body.addEventListener("contextmenu", this.blurEvent), document.body.addEventListener("mousedown", this.blurEvent), window.addEventListener("resize", this.blurEvent), document.body.addEventListener("keydown", this.escEvent), this.blurEventsBound = !0);
    }, 100), this.blurCallback = e), this;
  }
  _escapeCheck(e) {
    e.keyCode == 27 && this.hide();
  }
  blockHide() {
    this.hideable = !1;
  }
  restoreHide() {
    this.hideable = !0;
  }
  hide(e = !1) {
    return this.visible && this.hideable && (this.blurable && this.blurEventsBound && (document.body.removeEventListener("keydown", this.escEvent), document.body.removeEventListener("click", this.blurEvent), document.body.removeEventListener("contextmenu", this.blurEvent), document.body.removeEventListener("mousedown", this.blurEvent), window.removeEventListener("resize", this.blurEvent), this.table.rowManager.element.removeEventListener("scroll", this.blurEvent), this.unsubscribe("cell-editing", this.blurEvent), this.blurEventsBound = !1), this.childPopup && this.childPopup.hide(), this.parent && (this.parent.childPopup = null), this.element.parentNode && this.element.parentNode.removeChild(this.element), this.visible = !1, this.blurCallback && !e && this.blurCallback(), this.unsubscribe("table-destroy", this.destroyBinding)), this;
  }
  child(e) {
    return this.childPopup && this.childPopup.hide(), this.childPopup = new Xn(this.table, e, this), this.childPopup;
  }
};
class Y extends ye {
  constructor(e, t) {
    super(e), this._handler = null;
  }
  initialize() {
  }
  ///////////////////////////////////
  ////// Options Registration ///////
  ///////////////////////////////////
  registerTableOption(e, t) {
    this.table.optionsList.register(e, t);
  }
  registerColumnOption(e, t) {
    this.table.columnManager.optionsList.register(e, t);
  }
  ///////////////////////////////////
  /// Public Function Registration ///
  ///////////////////////////////////
  registerTableFunction(e, t) {
    typeof this.table[e] > "u" ? this.table[e] = (...A) => (this.table.initGuard(e), t(...A)) : console.warn("Unable to bind table function, name already in use", e);
  }
  registerComponentFunction(e, t, A) {
    return this.table.componentFunctionBinder.bind(e, t, A);
  }
  ///////////////////////////////////
  ////////// Data Pipeline //////////
  ///////////////////////////////////
  registerDataHandler(e, t) {
    this.table.rowManager.registerDataPipelineHandler(e, t), this._handler = e;
  }
  registerDisplayHandler(e, t) {
    this.table.rowManager.registerDisplayPipelineHandler(e, t), this._handler = e;
  }
  displayRows(e) {
    var t = this.table.rowManager.displayRows.length - 1, A;
    if (this._handler && (A = this.table.rowManager.displayPipeline.findIndex((i) => i.handler === this._handler), A > -1 && (t = A)), e && (t = t + e), this._handler)
      return t > -1 ? this.table.rowManager.getDisplayRows(t) : this.activeRows();
  }
  activeRows() {
    return this.table.rowManager.activeRows;
  }
  refreshData(e, t) {
    t || (t = this._handler), t && this.table.rowManager.refreshActiveData(t, !1, e);
  }
  ///////////////////////////////////
  //////// Footer Management ////////
  ///////////////////////////////////
  footerAppend(e) {
    return this.table.footerManager.append(e);
  }
  footerPrepend(e) {
    return this.table.footerManager.prepend(e);
  }
  footerRemove(e) {
    return this.table.footerManager.remove(e);
  }
  ///////////////////////////////////
  //////// Popups Management ////////
  ///////////////////////////////////
  popup(e, t) {
    return new sl(this.table, e, t);
  }
  ///////////////////////////////////
  //////// Alert Management ////////
  ///////////////////////////////////
  alert(e, t) {
    return this.table.alertManager.alert(e, t);
  }
  clearAlert() {
    return this.table.alertManager.clear();
  }
}
var rl = {
  rownum: function(r, e, t, A, i, s) {
    return s.getPosition();
  }
};
const qt = class qt extends Y {
  constructor(e) {
    super(e), this.allowedTypes = ["", "data", "download", "clipboard", "print", "htmlOutput"], this.registerColumnOption("accessor"), this.registerColumnOption("accessorParams"), this.registerColumnOption("accessorData"), this.registerColumnOption("accessorDataParams"), this.registerColumnOption("accessorDownload"), this.registerColumnOption("accessorDownloadParams"), this.registerColumnOption("accessorClipboard"), this.registerColumnOption("accessorClipboardParams"), this.registerColumnOption("accessorPrint"), this.registerColumnOption("accessorPrintParams"), this.registerColumnOption("accessorHtmlOutput"), this.registerColumnOption("accessorHtmlOutputParams");
  }
  initialize() {
    this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("row-data-retrieve", this.transformRow.bind(this));
  }
  //initialize column accessor
  initializeColumn(e) {
    var t = !1, A = {};
    this.allowedTypes.forEach((i) => {
      var s = "accessor" + (i.charAt(0).toUpperCase() + i.slice(1)), n;
      e.definition[s] && (n = this.lookupAccessor(e.definition[s]), n && (t = !0, A[s] = {
        accessor: n,
        params: e.definition[s + "Params"] || {}
      }));
    }), t && (e.modules.accessor = A);
  }
  lookupAccessor(e) {
    var t = !1;
    switch (typeof e) {
      case "string":
        qt.accessors[e] ? t = qt.accessors[e] : console.warn("Accessor Error - No such accessor found, ignoring: ", e);
        break;
      case "function":
        t = e;
        break;
    }
    return t;
  }
  //apply accessor to row
  transformRow(e, t) {
    var A = "accessor" + (t.charAt(0).toUpperCase() + t.slice(1)), i = e.getComponent(), s = ie.deepClone(e.data || {});
    return this.table.columnManager.traverse(function(n) {
      var o, a, l, h;
      n.modules.accessor && (a = n.modules.accessor[A] || n.modules.accessor.accessor || !1, a && (o = n.getFieldValue(s), o != "undefined" && (h = n.getComponent(), l = typeof a.params == "function" ? a.params(o, s, t, h, i) : a.params, n.setFieldValue(s, a.accessor(o, s, t, l, h, i)))));
    }), s;
  }
};
U(qt, "moduleName", "accessor"), //load defaults
U(qt, "accessors", rl);
let xs = qt;
var nl = {
  method: "GET"
};
function Ts(r, e) {
  var t = [];
  if (e = e || "", Array.isArray(r))
    r.forEach((i, s) => {
      t = t.concat(Ts(i, e ? e + "[" + s + "]" : s));
    });
  else if (typeof r == "object")
    for (var A in r)
      t = t.concat(Ts(r[A], e ? e + "[" + A + "]" : A));
  else
    t.push({ key: e, value: r });
  return t;
}
function ol(r) {
  var e = Ts(r), t = [];
  return e.forEach(function(A) {
    t.push(encodeURIComponent(A.key) + "=" + encodeURIComponent(A.value));
  }), t.join("&");
}
function Jn(r, e, t) {
  return r && t && Object.keys(t).length && (!e.method || e.method.toLowerCase() == "get") && (e.method = "get", r += (r.includes("?") ? "&" : "?") + ol(t)), r;
}
function al(r, e, t) {
  var A;
  return new Promise((i, s) => {
    if (r = this.urlGenerator.call(this.table, r, e, t), e.method.toUpperCase() != "GET")
      if (A = typeof this.table.options.ajaxContentType == "object" ? this.table.options.ajaxContentType : this.contentTypeFormatters[this.table.options.ajaxContentType], A) {
        for (var n in A.headers)
          e.headers || (e.headers = {}), typeof e.headers[n] > "u" && (e.headers[n] = A.headers[n]);
        e.body = A.body.call(this, r, e, t);
      } else
        console.warn("Ajax Error - Invalid ajaxContentType value:", this.table.options.ajaxContentType);
    r ? (typeof e.headers > "u" && (e.headers = {}), typeof e.headers.Accept > "u" && (e.headers.Accept = "application/json"), typeof e.headers["X-Requested-With"] > "u" && (e.headers["X-Requested-With"] = "XMLHttpRequest"), typeof e.mode > "u" && (e.mode = "cors"), e.mode == "cors" ? (typeof e.headers.Origin > "u" && (e.headers.Origin = window.location.origin), typeof e.credentials > "u" && (e.credentials = "same-origin")) : typeof e.credentials > "u" && (e.credentials = "include"), fetch(r, e).then((o) => {
      o.ok ? o.json().then((a) => {
        i(a);
      }).catch((a) => {
        s(a), console.warn("Ajax Load Error - Invalid JSON returned", a);
      }) : (console.error("Ajax Load Error - Connection Error: " + o.status, o.statusText), s(o));
    }).catch((o) => {
      console.error("Ajax Load Error - Connection Error: ", o), s(o);
    })) : (console.warn("Ajax Load Error - No URL Set"), i([]));
  });
}
function Ls(r, e) {
  var t = [];
  if (e = e || "", Array.isArray(r))
    r.forEach((i, s) => {
      t = t.concat(Ls(i, e ? e + "[" + s + "]" : s));
    });
  else if (typeof r == "object")
    for (var A in r)
      t = t.concat(Ls(r[A], e ? e + "[" + A + "]" : A));
  else
    t.push({ key: e, value: r });
  return t;
}
var ll = {
  json: {
    headers: {
      "Content-Type": "application/json"
    },
    body: function(r, e, t) {
      return JSON.stringify(t);
    }
  },
  form: {
    headers: {},
    body: function(r, e, t) {
      var A = Ls(t), i = new FormData();
      return A.forEach(function(s) {
        i.append(s.key, s.value);
      }), i;
    }
  }
};
const Je = class Je extends Y {
  constructor(e) {
    super(e), this.config = {}, this.url = "", this.urlGenerator = !1, this.params = !1, this.loaderPromise = !1, this.registerTableOption("ajaxURL", !1), this.registerTableOption("ajaxURLGenerator", !1), this.registerTableOption("ajaxParams", {}), this.registerTableOption("ajaxConfig", "get"), this.registerTableOption("ajaxContentType", "form"), this.registerTableOption("ajaxRequestFunc", !1), this.registerTableOption("ajaxRequesting", function() {
    }), this.registerTableOption("ajaxResponse", !1), this.contentTypeFormatters = Je.contentTypeFormatters;
  }
  //initialize setup options
  initialize() {
    this.loaderPromise = this.table.options.ajaxRequestFunc || Je.defaultLoaderPromise, this.urlGenerator = this.table.options.ajaxURLGenerator || Je.defaultURLGenerator, this.table.options.ajaxURL && this.setUrl(this.table.options.ajaxURL), this.setDefaultConfig(this.table.options.ajaxConfig), this.registerTableFunction("getAjaxUrl", this.getUrl.bind(this)), this.subscribe("data-loading", this.requestDataCheck.bind(this)), this.subscribe("data-params", this.requestParams.bind(this)), this.subscribe("data-load", this.requestData.bind(this));
  }
  requestParams(e, t, A, i) {
    var s = this.table.options.ajaxParams;
    return s && (typeof s == "function" && (s = s.call(this.table)), i = Object.assign(Object.assign({}, s), i)), i;
  }
  requestDataCheck(e, t, A, i) {
    return !!(!e && this.url || typeof e == "string");
  }
  requestData(e, t, A, i, s) {
    var n;
    return !s && this.requestDataCheck(e) ? (e && this.setUrl(e), n = this.generateConfig(A), this.sendRequest(this.url, t, n)) : s;
  }
  setDefaultConfig(e = {}) {
    this.config = Object.assign({}, Je.defaultConfig), typeof e == "string" ? this.config.method = e : Object.assign(this.config, e);
  }
  //load config object
  generateConfig(e = {}) {
    var t = Object.assign({}, this.config);
    return typeof e == "string" ? t.method = e : Object.assign(t, e), t;
  }
  //set request url
  setUrl(e) {
    this.url = e;
  }
  //get request url
  getUrl() {
    return this.url;
  }
  //send ajax request
  sendRequest(e, t, A) {
    return this.table.options.ajaxRequesting.call(this.table, e, t) !== !1 ? this.loaderPromise(e, A, t).then((i) => (this.table.options.ajaxResponse && (i = this.table.options.ajaxResponse.call(this.table, e, t, i)), i)) : Promise.reject();
  }
};
U(Je, "moduleName", "ajax"), //load defaults
U(Je, "defaultConfig", nl), U(Je, "defaultURLGenerator", Jn), U(Je, "defaultLoaderPromise", al), U(Je, "contentTypeFormatters", ll);
let Is = Je;
var hl = {
  replace: function(r) {
    return this.table.setData(r);
  },
  update: function(r) {
    return this.table.updateOrAddData(r);
  },
  insert: function(r) {
    return this.table.addData(r);
  }
}, ul = {
  table: function(r) {
    var e = [], t = !0, A = this.table.columnManager.columns, i = [], s = [];
    return r = r.split(`
`), r.forEach(function(n) {
      e.push(n.split("	"));
    }), e.length && !(e.length === 1 && e[0].length < 2) ? (e[0].forEach(function(n) {
      var o = A.find(function(a) {
        return n && a.definition.title && n.trim() && a.definition.title.trim() === n.trim();
      });
      o ? i.push(o) : t = !1;
    }), t || (t = !0, i = [], e[0].forEach(function(n) {
      var o = A.find(function(a) {
        return n && a.field && n.trim() && a.field.trim() === n.trim();
      });
      o ? i.push(o) : t = !1;
    }), t || (i = this.table.columnManager.columnsByIndex)), t && e.shift(), e.forEach(function(n) {
      var o = {};
      n.forEach(function(a, l) {
        i[l] && (o[i[l].field] = a);
      }), s.push(o);
    }), s) : !1;
  }
}, cl = {
  copyToClipboard: ["ctrl + 67", "meta + 67"]
}, dl = {
  copyToClipboard: function(r) {
    this.table.modules.edit.currentCell || this.table.modExists("clipboard", !0) && this.table.modules.clipboard.copy(!1, !0);
  }
}, fl = {
  keybindings: {
    bindings: cl,
    actions: dl
  }
};
const gt = class gt extends Y {
  constructor(e) {
    super(e), this.mode = !0, this.pasteParser = function() {
    }, this.pasteAction = function() {
    }, this.customSelection = !1, this.rowRange = !1, this.blocked = !0, this.registerTableOption("clipboard", !1), this.registerTableOption("clipboardCopyStyled", !0), this.registerTableOption("clipboardCopyConfig", !1), this.registerTableOption("clipboardCopyFormatter", !1), this.registerTableOption("clipboardCopyRowRange", "active"), this.registerTableOption("clipboardPasteParser", "table"), this.registerTableOption("clipboardPasteAction", "insert"), this.registerColumnOption("clipboard"), this.registerColumnOption("titleClipboard");
  }
  initialize() {
    this.mode = this.table.options.clipboard, this.rowRange = this.table.options.clipboardCopyRowRange, (this.mode === !0 || this.mode === "copy") && this.table.element.addEventListener("copy", (e) => {
      var t, A, i;
      this.blocked || (e.preventDefault(), this.customSelection ? (t = this.customSelection, this.table.options.clipboardCopyFormatter && (t = this.table.options.clipboardCopyFormatter("plain", t))) : (i = this.table.modules.export.generateExportList(this.table.options.clipboardCopyConfig, this.table.options.clipboardCopyStyled, this.rowRange, "clipboard"), A = this.table.modules.export.generateHTMLTable(i), t = A ? this.generatePlainContent(i) : "", this.table.options.clipboardCopyFormatter && (t = this.table.options.clipboardCopyFormatter("plain", t), A = this.table.options.clipboardCopyFormatter("html", A))), window.clipboardData && window.clipboardData.setData ? window.clipboardData.setData("Text", t) : e.clipboardData && e.clipboardData.setData ? (e.clipboardData.setData("text/plain", t), A && e.clipboardData.setData("text/html", A)) : e.originalEvent && e.originalEvent.clipboardData.setData && (e.originalEvent.clipboardData.setData("text/plain", t), A && e.originalEvent.clipboardData.setData("text/html", A)), this.dispatchExternal("clipboardCopied", t, A), this.reset());
    }), (this.mode === !0 || this.mode === "paste") && this.table.element.addEventListener("paste", (e) => {
      this.paste(e);
    }), this.setPasteParser(this.table.options.clipboardPasteParser), this.setPasteAction(this.table.options.clipboardPasteAction), this.registerTableFunction("copyToClipboard", this.copy.bind(this));
  }
  reset() {
    this.blocked = !0, this.customSelection = !1;
  }
  generatePlainContent(e) {
    var t = [];
    return e.forEach((A) => {
      var i = [];
      A.columns.forEach((s) => {
        var n = "";
        if (s)
          if (A.type === "group" && (s.value = s.component.getKey()), s.value === null)
            n = "";
          else
            switch (typeof s.value) {
              case "object":
                n = JSON.stringify(s.value);
                break;
              case "undefined":
                n = "";
                break;
              default:
                n = s.value;
            }
        i.push(n);
      }), t.push(i.join("	"));
    }), t.join(`
`);
  }
  copy(e, t) {
    var A, i;
    this.blocked = !1, this.customSelection = !1, (this.mode === !0 || this.mode === "copy") && (this.rowRange = e || this.table.options.clipboardCopyRowRange, typeof window.getSelection < "u" && typeof document.createRange < "u" ? (e = document.createRange(), e.selectNodeContents(this.table.element), A = window.getSelection(), A.toString() && t && (this.customSelection = A.toString()), A.removeAllRanges(), A.addRange(e)) : typeof document.selection < "u" && typeof document.body.createTextRange < "u" && (i = document.body.createTextRange(), i.moveToElementText(this.table.element), i.select()), document.execCommand("copy"), A && A.removeAllRanges());
  }
  //PASTE EVENT HANDLING
  setPasteAction(e) {
    switch (typeof e) {
      case "string":
        this.pasteAction = gt.pasteActions[e], this.pasteAction || console.warn("Clipboard Error - No such paste action found:", e);
        break;
      case "function":
        this.pasteAction = e;
        break;
    }
  }
  setPasteParser(e) {
    switch (typeof e) {
      case "string":
        this.pasteParser = gt.pasteParsers[e], this.pasteParser || console.warn("Clipboard Error - No such paste parser found:", e);
        break;
      case "function":
        this.pasteParser = e;
        break;
    }
  }
  paste(e) {
    var t, A, i;
    this.checkPasteOrigin(e) && (t = this.getPasteData(e), A = this.pasteParser.call(this, t), A ? (e.preventDefault(), this.table.modExists("mutator") && (A = this.mutateData(A)), i = this.pasteAction.call(this, A), this.dispatchExternal("clipboardPasted", t, A, i)) : this.dispatchExternal("clipboardPasteError", t));
  }
  mutateData(e) {
    var t = [];
    return Array.isArray(e) ? e.forEach((A) => {
      t.push(this.table.modules.mutator.transformRow(A, "clipboard"));
    }) : t = e, t;
  }
  checkPasteOrigin(e) {
    var t = !0, A = this.confirm("clipboard-paste", [e]);
    return (A || !["DIV", "SPAN"].includes(e.target.tagName)) && (t = !1), t;
  }
  getPasteData(e) {
    var t;
    return window.clipboardData && window.clipboardData.getData ? t = window.clipboardData.getData("Text") : e.clipboardData && e.clipboardData.getData ? t = e.clipboardData.getData("text/plain") : e.originalEvent && e.originalEvent.clipboardData.getData && (t = e.originalEvent.clipboardData.getData("text/plain")), t;
  }
};
U(gt, "moduleName", "clipboard"), U(gt, "moduleExtensions", fl), //load defaults
U(gt, "pasteActions", hl), U(gt, "pasteParsers", ul);
let Ms = gt;
class gl {
  constructor(e) {
    return this._row = e, new Proxy(this, {
      get: function(t, A, i) {
        return typeof t[A] < "u" ? t[A] : t._row.table.componentFunctionBinder.handle("row", t._row, A);
      }
    });
  }
  getData(e) {
    return this._row.getData(e);
  }
  getElement() {
    return this._row.getElement();
  }
  getTable() {
    return this._row.table;
  }
  getCells() {
    var e = [];
    return this._row.getCells().forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  getCell(e) {
    var t = this._row.getCell(e);
    return t ? t.getComponent() : !1;
  }
  _getSelf() {
    return this._row;
  }
}
class jn {
  constructor(e) {
    return this._cell = e, new Proxy(this, {
      get: function(t, A, i) {
        return typeof t[A] < "u" ? t[A] : t._cell.table.componentFunctionBinder.handle("cell", t._cell, A);
      }
    });
  }
  getValue() {
    return this._cell.getValue();
  }
  getOldValue() {
    return this._cell.getOldValue();
  }
  getInitialValue() {
    return this._cell.initialValue;
  }
  getElement() {
    return this._cell.getElement();
  }
  getRow() {
    return this._cell.row.getComponent();
  }
  getData(e) {
    return this._cell.row.getData(e);
  }
  getType() {
    return "cell";
  }
  getField() {
    return this._cell.column.getField();
  }
  getColumn() {
    return this._cell.column.getComponent();
  }
  setValue(e, t) {
    typeof t > "u" && (t = !0), this._cell.setValue(e, t);
  }
  restoreOldValue() {
    this._cell.setValueActual(this._cell.getOldValue());
  }
  restoreInitialValue() {
    this._cell.setValueActual(this._cell.initialValue);
  }
  checkHeight() {
    this._cell.checkHeight();
  }
  getTable() {
    return this._cell.table;
  }
  _getSelf() {
    return this._cell;
  }
}
class OA extends ye {
  constructor(e, t) {
    super(e.table), this.table = e.table, this.column = e, this.row = t, this.element = null, this.value = null, this.initialValue, this.oldValue = null, this.modules = {}, this.height = null, this.width = null, this.minWidth = null, this.component = null, this.loaded = !1, this.build();
  }
  //////////////// Setup Functions /////////////////
  //generate element
  build() {
    this.generateElement(), this.setWidth(), this._configureCell(), this.setValueActual(this.column.getFieldValue(this.row.data)), this.initialValue = this.value;
  }
  generateElement() {
    this.element = document.createElement("div"), this.element.className = "tabulator-cell", this.element.setAttribute("role", "gridcell"), this.column.isRowHeader && this.element.classList.add("tabulator-row-header");
  }
  _configureCell() {
    var e = this.element, t = this.column.getField(), A = {
      top: "flex-start",
      bottom: "flex-end",
      middle: "center"
    }, i = {
      left: "flex-start",
      right: "flex-end",
      center: "center"
    };
    if (e.style.textAlign = this.column.hozAlign, this.column.vertAlign && (e.style.display = "inline-flex", e.style.alignItems = A[this.column.vertAlign] || "", this.column.hozAlign && (e.style.justifyContent = i[this.column.hozAlign] || "")), t && e.setAttribute("tabulator-field", t), this.column.definition.cssClass) {
      var s = this.column.definition.cssClass.split(" ");
      s.forEach((n) => {
        e.classList.add(n);
      });
    }
    this.dispatch("cell-init", this), this.column.visible || this.hide();
  }
  //generate cell contents
  _generateContents() {
    var e;
    switch (e = this.chain("cell-format", this, null, () => this.element.innerHTML = this.value), typeof e) {
      case "object":
        if (e instanceof Node) {
          for (; this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
          this.element.appendChild(e);
        } else
          this.element.innerHTML = "", e != null && console.warn("Format Error - Formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", e);
        break;
      case "undefined":
        this.element.innerHTML = "";
        break;
      default:
        this.element.innerHTML = e;
    }
  }
  cellRendered() {
    this.dispatch("cell-rendered", this);
  }
  //////////////////// Getters ////////////////////
  getElement(e) {
    return this.loaded || (this.loaded = !0, e || this.layoutElement()), this.element;
  }
  getValue() {
    return this.value;
  }
  getOldValue() {
    return this.oldValue;
  }
  //////////////////// Actions ////////////////////
  setValue(e, t, A) {
    var i = this.setValueProcessData(e, t, A);
    i && (this.dispatch("cell-value-updated", this), this.cellRendered(), this.column.definition.cellEdited && this.column.definition.cellEdited.call(this.table, this.getComponent()), this.dispatchExternal("cellEdited", this.getComponent()), this.subscribedExternal("dataChanged") && this.dispatchExternal("dataChanged", this.table.rowManager.getData()));
  }
  setValueProcessData(e, t, A) {
    var i = !1;
    return (this.value !== e || A) && (i = !0, t && (e = this.chain("cell-value-changing", [this, e], null, e))), this.setValueActual(e), i && this.dispatch("cell-value-changed", this), i;
  }
  setValueActual(e) {
    this.oldValue = this.value, this.value = e, this.dispatch("cell-value-save-before", this), this.column.setFieldValue(this.row.data, e), this.dispatch("cell-value-save-after", this), this.loaded && this.layoutElement();
  }
  layoutElement() {
    this._generateContents(), this.dispatch("cell-layout", this);
  }
  setWidth() {
    this.width = this.column.width, this.element.style.width = this.column.widthStyled;
  }
  clearWidth() {
    this.width = "", this.element.style.width = "";
  }
  getWidth() {
    return this.width || this.element.offsetWidth;
  }
  setMinWidth() {
    this.minWidth = this.column.minWidth, this.element.style.minWidth = this.column.minWidthStyled;
  }
  setMaxWidth() {
    this.maxWidth = this.column.maxWidth, this.element.style.maxWidth = this.column.maxWidthStyled;
  }
  checkHeight() {
    this.row.reinitializeHeight();
  }
  clearHeight() {
    this.element.style.height = "", this.height = null, this.dispatch("cell-height", this, "");
  }
  setHeight() {
    this.height = this.row.height, this.element.style.height = this.row.heightStyled, this.dispatch("cell-height", this, this.row.heightStyled);
  }
  getHeight() {
    return this.height || this.element.offsetHeight;
  }
  show() {
    this.element.style.display = this.column.vertAlign ? "inline-flex" : "";
  }
  hide() {
    this.element.style.display = "none";
  }
  delete() {
    this.dispatch("cell-delete", this), !this.table.rowManager.redrawBlock && this.element.parentNode && this.element.parentNode.removeChild(this.element), this.element = !1, this.column.deleteCell(this), this.row.deleteCell(this), this.calcs = {};
  }
  getIndex() {
    return this.row.getCellIndex(this);
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    return this.component || (this.component = new jn(this)), this.component;
  }
}
class Yn {
  constructor(e) {
    return this._column = e, this.type = "ColumnComponent", new Proxy(this, {
      get: function(t, A, i) {
        return typeof t[A] < "u" ? t[A] : t._column.table.componentFunctionBinder.handle("column", t._column, A);
      }
    });
  }
  getElement() {
    return this._column.getElement();
  }
  getDefinition() {
    return this._column.getDefinition();
  }
  getField() {
    return this._column.getField();
  }
  getTitleDownload() {
    return this._column.getTitleDownload();
  }
  getCells() {
    var e = [];
    return this._column.cells.forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  isVisible() {
    return this._column.visible;
  }
  show() {
    this._column.isGroup ? this._column.columns.forEach(function(e) {
      e.show();
    }) : this._column.show();
  }
  hide() {
    this._column.isGroup ? this._column.columns.forEach(function(e) {
      e.hide();
    }) : this._column.hide();
  }
  toggle() {
    this._column.visible ? this.hide() : this.show();
  }
  delete() {
    return this._column.delete();
  }
  getSubColumns() {
    var e = [];
    return this._column.columns.length && this._column.columns.forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  getParentColumn() {
    return this._column.getParentComponent();
  }
  _getSelf() {
    return this._column;
  }
  scrollTo(e, t) {
    return this._column.table.columnManager.scrollToColumn(this._column, e, t);
  }
  getTable() {
    return this._column.table;
  }
  move(e, t) {
    var A = this._column.table.columnManager.findColumn(e);
    A ? this._column.table.columnManager.moveColumn(this._column, A, t) : console.warn("Move Error - No matching column found:", A);
  }
  getNextColumn() {
    var e = this._column.nextColumn();
    return e ? e.getComponent() : !1;
  }
  getPrevColumn() {
    var e = this._column.prevColumn();
    return e ? e.getComponent() : !1;
  }
  updateDefinition(e) {
    return this._column.updateDefinition(e);
  }
  getWidth() {
    return this._column.getWidth();
  }
  setWidth(e) {
    var t;
    return e === !0 ? t = this._column.reinitializeWidth(!0) : t = this._column.setWidth(e), this._column.table.columnManager.rerenderColumns(!0), t;
  }
}
var Zn = {
  title: void 0,
  field: void 0,
  columns: void 0,
  visible: void 0,
  hozAlign: void 0,
  vertAlign: void 0,
  width: void 0,
  minWidth: 40,
  maxWidth: void 0,
  maxInitialWidth: void 0,
  cssClass: void 0,
  variableHeight: void 0,
  headerVertical: void 0,
  headerHozAlign: void 0,
  headerWordWrap: !1,
  editableTitle: void 0
};
const Lt = class Lt extends ye {
  constructor(e, t, A) {
    super(t.table), this.definition = e, this.parent = t, this.type = "column", this.columns = [], this.cells = [], this.isGroup = !1, this.isRowHeader = A, this.element = this.createElement(), this.contentElement = !1, this.titleHolderElement = !1, this.titleElement = !1, this.groupElement = this.createGroupElement(), this.hozAlign = "", this.vertAlign = "", this.field = "", this.fieldStructure = "", this.getFieldValue = "", this.setFieldValue = "", this.titleDownload = null, this.titleFormatterRendered = !1, this.mapDefinitions(), this.setField(this.definition.field), this.modules = {}, this.width = null, this.widthStyled = "", this.maxWidth = null, this.maxWidthStyled = "", this.maxInitialWidth = null, this.minWidth = null, this.minWidthStyled = "", this.widthFixed = !1, this.visible = !0, this.component = null, this.definition.columns ? (this.isGroup = !0, this.definition.columns.forEach((i, s) => {
      var n = new Lt(i, this);
      this.attachColumn(n);
    }), this.checkColumnVisibility()) : t.registerColumnField(this), this._initialize();
  }
  createElement() {
    var e = document.createElement("div");
    switch (e.classList.add("tabulator-col"), e.setAttribute("role", "columnheader"), e.setAttribute("aria-sort", "none"), this.isRowHeader && e.classList.add("tabulator-row-header"), this.table.options.columnHeaderVertAlign) {
      case "middle":
        e.style.justifyContent = "center";
        break;
      case "bottom":
        e.style.justifyContent = "flex-end";
        break;
    }
    return e;
  }
  createGroupElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-col-group-cols"), e;
  }
  mapDefinitions() {
    var e = this.table.options.columnDefaults;
    if (e)
      for (let t in e)
        typeof this.definition[t] > "u" && (this.definition[t] = e[t]);
    this.definition = this.table.columnManager.optionsList.generate(Lt.defaultOptionList, this.definition);
  }
  checkDefinition() {
    Object.keys(this.definition).forEach((e) => {
      Lt.defaultOptionList.indexOf(e) === -1 && console.warn("Invalid column definition option in '" + (this.field || this.definition.title) + "' column:", e);
    });
  }
  setField(e) {
    this.field = e, this.fieldStructure = e ? this.table.options.nestedFieldSeparator ? e.split(this.table.options.nestedFieldSeparator) : [e] : [], this.getFieldValue = this.fieldStructure.length > 1 ? this._getNestedData : this._getFlatData, this.setFieldValue = this.fieldStructure.length > 1 ? this._setNestedData : this._setFlatData;
  }
  //register column position with column manager
  registerColumnPosition(e) {
    this.parent.registerColumnPosition(e);
  }
  //register column position with column manager
  registerColumnField(e) {
    this.parent.registerColumnField(e);
  }
  //trigger position registration
  reRegisterPosition() {
    this.isGroup ? this.columns.forEach(function(e) {
      e.reRegisterPosition();
    }) : this.registerColumnPosition(this);
  }
  //build header element
  _initialize() {
    for (var e = this.definition; this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
    e.headerVertical && (this.element.classList.add("tabulator-col-vertical"), e.headerVertical === "flip" && this.element.classList.add("tabulator-col-vertical-flip")), this.contentElement = this._buildColumnHeaderContent(), this.element.appendChild(this.contentElement), this.isGroup ? this._buildGroupHeader() : this._buildColumnHeader(), this.dispatch("column-init", this);
  }
  //build header element for header
  _buildColumnHeader() {
    var e = this.definition;
    if (this.dispatch("column-layout", this), typeof e.visible < "u" && (e.visible ? this.show(!0) : this.hide(!0)), e.cssClass) {
      var t = e.cssClass.split(" ");
      t.forEach((A) => {
        this.element.classList.add(A);
      });
    }
    e.field && this.element.setAttribute("tabulator-field", e.field), this.setMinWidth(parseInt(e.minWidth)), e.maxInitialWidth && (this.maxInitialWidth = parseInt(e.maxInitialWidth)), e.maxWidth && this.setMaxWidth(parseInt(e.maxWidth)), this.reinitializeWidth(), this.hozAlign = this.definition.hozAlign, this.vertAlign = this.definition.vertAlign, this.titleElement.style.textAlign = this.definition.headerHozAlign;
  }
  _buildColumnHeaderContent() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-col-content"), this.titleHolderElement = document.createElement("div"), this.titleHolderElement.classList.add("tabulator-col-title-holder"), e.appendChild(this.titleHolderElement), this.titleElement = this._buildColumnHeaderTitle(), this.titleHolderElement.appendChild(this.titleElement), e;
  }
  //build title element of column
  _buildColumnHeaderTitle() {
    var e = this.definition, t = document.createElement("div");
    if (t.classList.add("tabulator-col-title"), e.headerWordWrap && t.classList.add("tabulator-col-title-wrap"), e.editableTitle) {
      var A = document.createElement("input");
      A.classList.add("tabulator-title-editor"), A.addEventListener("click", (i) => {
        i.stopPropagation(), A.focus();
      }), A.addEventListener("mousedown", (i) => {
        i.stopPropagation();
      }), A.addEventListener("change", () => {
        e.title = A.value, this.dispatchExternal("columnTitleChanged", this.getComponent());
      }), t.appendChild(A), e.field ? this.langBind("columns|" + e.field, (i) => {
        A.value = i || e.title || "&nbsp;";
      }) : A.value = e.title || "&nbsp;";
    } else
      e.field ? this.langBind("columns|" + e.field, (i) => {
        this._formatColumnHeaderTitle(t, i || e.title || "&nbsp;");
      }) : this._formatColumnHeaderTitle(t, e.title || "&nbsp;");
    return t;
  }
  _formatColumnHeaderTitle(e, t) {
    var A = this.chain("column-format", [this, t, e], null, () => t);
    switch (typeof A) {
      case "object":
        A instanceof Node ? e.appendChild(A) : (e.innerHTML = "", console.warn("Format Error - Title formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", A));
        break;
      case "undefined":
        e.innerHTML = "";
        break;
      default:
        e.innerHTML = A;
    }
  }
  //build header element for column group
  _buildGroupHeader() {
    if (this.element.classList.add("tabulator-col-group"), this.element.setAttribute("role", "columngroup"), this.element.setAttribute("aria-title", this.definition.title), this.definition.cssClass) {
      var e = this.definition.cssClass.split(" ");
      e.forEach((t) => {
        this.element.classList.add(t);
      });
    }
    this.titleElement.style.textAlign = this.definition.headerHozAlign, this.element.appendChild(this.groupElement);
  }
  //flat field lookup
  _getFlatData(e) {
    return e[this.field];
  }
  //nested field lookup
  _getNestedData(e) {
    var t = e, A = this.fieldStructure, i = A.length, s;
    for (let n = 0; n < i && (t = t[A[n]], s = t, !!t); n++)
      ;
    return s;
  }
  //flat field set
  _setFlatData(e, t) {
    this.field && (e[this.field] = t);
  }
  //nested field set
  _setNestedData(e, t) {
    var A = e, i = this.fieldStructure, s = i.length;
    for (let n = 0; n < s; n++)
      if (n == s - 1)
        A[i[n]] = t;
      else {
        if (!A[i[n]])
          if (typeof t < "u")
            A[i[n]] = {};
          else
            break;
        A = A[i[n]];
      }
  }
  //attach column to this group
  attachColumn(e) {
    this.groupElement ? (this.columns.push(e), this.groupElement.appendChild(e.getElement()), e.columnRendered()) : console.warn("Column Warning - Column being attached to another column instead of column group");
  }
  //vertically align header in column
  verticalAlign(e, t) {
    var A = this.parent.isGroup ? this.parent.getGroupElement().clientHeight : t || this.parent.getHeadersElement().clientHeight;
    this.element.style.height = A + "px", this.dispatch("column-height", this, this.element.style.height), this.isGroup && (this.groupElement.style.minHeight = A - this.contentElement.offsetHeight + "px"), this.columns.forEach(function(i) {
      i.verticalAlign(e);
    });
  }
  //clear vertical alignment
  clearVerticalAlign() {
    this.element.style.paddingTop = "", this.element.style.height = "", this.element.style.minHeight = "", this.groupElement.style.minHeight = "", this.columns.forEach(function(e) {
      e.clearVerticalAlign();
    }), this.dispatch("column-height", this, "");
  }
  //// Retrieve Column Information ////
  //return column header element
  getElement() {
    return this.element;
  }
  //return column group element
  getGroupElement() {
    return this.groupElement;
  }
  //return field name
  getField() {
    return this.field;
  }
  getTitleDownload() {
    return this.titleDownload;
  }
  //return the first column in a group
  getFirstColumn() {
    return this.isGroup ? this.columns.length ? this.columns[0].getFirstColumn() : !1 : this;
  }
  //return the last column in a group
  getLastColumn() {
    return this.isGroup ? this.columns.length ? this.columns[this.columns.length - 1].getLastColumn() : !1 : this;
  }
  //return all columns in a group
  getColumns(e) {
    var t = [];
    return e ? this.columns.forEach((A) => {
      t.push(A), t = t.concat(A.getColumns(!0));
    }) : t = this.columns, t;
  }
  //return all columns in a group
  getCells() {
    return this.cells;
  }
  //retrieve the top column in a group of columns
  getTopColumn() {
    return this.parent.isGroup ? this.parent.getTopColumn() : this;
  }
  //return column definition object
  getDefinition(e) {
    var t = [];
    return this.isGroup && e && (this.columns.forEach(function(A) {
      t.push(A.getDefinition(!0));
    }), this.definition.columns = t), this.definition;
  }
  //////////////////// Actions ////////////////////
  checkColumnVisibility() {
    var e = !1;
    this.columns.forEach(function(t) {
      t.visible && (e = !0);
    }), e ? (this.show(), this.dispatchExternal("columnVisibilityChanged", this.getComponent(), !1)) : this.hide();
  }
  //show column
  show(e, t) {
    this.visible || (this.visible = !0, this.element.style.display = "", this.parent.isGroup && this.parent.checkColumnVisibility(), this.cells.forEach(function(A) {
      A.show();
    }), !this.isGroup && this.width === null && this.reinitializeWidth(), this.table.columnManager.verticalAlignHeaders(), this.dispatch("column-show", this, t), e || this.dispatchExternal("columnVisibilityChanged", this.getComponent(), !0), this.parent.isGroup && this.parent.matchChildWidths(), this.silent || this.table.columnManager.rerenderColumns());
  }
  //hide column
  hide(e, t) {
    this.visible && (this.visible = !1, this.element.style.display = "none", this.table.columnManager.verticalAlignHeaders(), this.parent.isGroup && this.parent.checkColumnVisibility(), this.cells.forEach(function(A) {
      A.hide();
    }), this.dispatch("column-hide", this, t), e || this.dispatchExternal("columnVisibilityChanged", this.getComponent(), !1), this.parent.isGroup && this.parent.matchChildWidths(), this.silent || this.table.columnManager.rerenderColumns());
  }
  matchChildWidths() {
    var e = 0;
    this.contentElement && this.columns.length && (this.columns.forEach(function(t) {
      t.visible && (e += t.getWidth());
    }), this.contentElement.style.maxWidth = e - 1 + "px", this.table.initialized && (this.element.style.width = e + "px"), this.parent.isGroup && this.parent.matchChildWidths());
  }
  removeChild(e) {
    var t = this.columns.indexOf(e);
    t > -1 && this.columns.splice(t, 1), this.columns.length || this.delete();
  }
  setWidth(e) {
    this.widthFixed = !0, this.setWidthActual(e);
  }
  setWidthActual(e) {
    isNaN(e) && (e = Math.floor(this.table.element.clientWidth / 100 * parseInt(e))), e = Math.max(this.minWidth, e), this.maxWidth && (e = Math.min(this.maxWidth, e)), this.width = e, this.widthStyled = e ? e + "px" : "", this.element.style.width = this.widthStyled, this.isGroup || this.cells.forEach(function(t) {
      t.setWidth();
    }), this.parent.isGroup && this.parent.matchChildWidths(), this.dispatch("column-width", this), this.subscribedExternal("columnWidth") && this.dispatchExternal("columnWidth", this.getComponent());
  }
  checkCellHeights() {
    var e = [];
    this.cells.forEach(function(t) {
      t.row.heightInitialized && (t.row.getElement().offsetParent !== null ? (e.push(t.row), t.row.clearCellHeight()) : t.row.heightInitialized = !1);
    }), e.forEach(function(t) {
      t.calcHeight();
    }), e.forEach(function(t) {
      t.setCellHeight();
    });
  }
  getWidth() {
    var e = 0;
    return this.isGroup ? this.columns.forEach(function(t) {
      t.visible && (e += t.getWidth());
    }) : e = this.width, e;
  }
  getLeftOffset() {
    var e = this.element.offsetLeft;
    return this.parent.isGroup && (e += this.parent.getLeftOffset()), e;
  }
  getHeight() {
    return Math.ceil(this.element.getBoundingClientRect().height);
  }
  setMinWidth(e) {
    this.maxWidth && e > this.maxWidth && (e = this.maxWidth, console.warn("the minWidth (" + e + "px) for column '" + this.field + "' cannot be bigger that its maxWidth (" + this.maxWidthStyled + ")")), this.minWidth = e, this.minWidthStyled = e ? e + "px" : "", this.element.style.minWidth = this.minWidthStyled, this.cells.forEach(function(t) {
      t.setMinWidth();
    });
  }
  setMaxWidth(e) {
    this.minWidth && e < this.minWidth && (e = this.minWidth, console.warn("the maxWidth (" + e + "px) for column '" + this.field + "' cannot be smaller that its minWidth (" + this.minWidthStyled + ")")), this.maxWidth = e, this.maxWidthStyled = e ? e + "px" : "", this.element.style.maxWidth = this.maxWidthStyled, this.cells.forEach(function(t) {
      t.setMaxWidth();
    });
  }
  delete() {
    return new Promise((e, t) => {
      this.isGroup && this.columns.forEach(function(i) {
        i.delete();
      }), this.dispatch("column-delete", this);
      var A = this.cells.length;
      for (let i = 0; i < A; i++)
        this.cells[0].delete();
      this.element.parentNode && this.element.parentNode.removeChild(this.element), this.element = !1, this.contentElement = !1, this.titleElement = !1, this.groupElement = !1, this.parent.isGroup && this.parent.removeChild(this), this.table.columnManager.deregisterColumn(this), this.table.columnManager.rerenderColumns(!0), this.dispatch("column-deleted", this), e();
    });
  }
  columnRendered() {
    this.titleFormatterRendered && this.titleFormatterRendered(), this.dispatch("column-rendered", this);
  }
  //////////////// Cell Management /////////////////
  //generate cell for this column
  generateCell(e) {
    var t = new OA(this, e);
    return this.cells.push(t), t;
  }
  nextColumn() {
    var e = this.table.columnManager.findColumnIndex(this);
    return e > -1 ? this._nextVisibleColumn(e + 1) : !1;
  }
  _nextVisibleColumn(e) {
    var t = this.table.columnManager.getColumnByIndex(e);
    return !t || t.visible ? t : this._nextVisibleColumn(e + 1);
  }
  prevColumn() {
    var e = this.table.columnManager.findColumnIndex(this);
    return e > -1 ? this._prevVisibleColumn(e - 1) : !1;
  }
  _prevVisibleColumn(e) {
    var t = this.table.columnManager.getColumnByIndex(e);
    return !t || t.visible ? t : this._prevVisibleColumn(e - 1);
  }
  reinitializeWidth(e) {
    this.widthFixed = !1, typeof this.definition.width < "u" && !e && this.setWidth(this.definition.width), this.dispatch("column-width-fit-before", this), this.fitToData(e), this.dispatch("column-width-fit-after", this);
  }
  //set column width to maximum cell width for non group columns
  fitToData(e) {
    if (!this.isGroup) {
      this.widthFixed || (this.element.style.width = "", this.cells.forEach((i) => {
        i.clearWidth();
      }));
      var t = this.element.offsetWidth;
      if ((!this.width || !this.widthFixed) && (this.cells.forEach((i) => {
        var s = i.getWidth();
        s > t && (t = s);
      }), t)) {
        var A = t + 1;
        e ? this.setWidth(A) : (this.maxInitialWidth && !e && (A = Math.min(A, this.maxInitialWidth)), this.setWidthActual(A));
      }
    }
  }
  updateDefinition(e) {
    var t;
    return this.isGroup || this.parent.isGroup ? (console.error("Column Update Error - The updateDefinition function is only available on ungrouped columns"), Promise.reject("Column Update Error - The updateDefinition function is only available on columns, not column groups")) : (t = Object.assign({}, this.getDefinition()), t = Object.assign(t, e), this.table.columnManager.addColumn(t, !1, this).then((A) => (t.field == this.field && (this.field = !1), this.delete().then(() => A.getComponent()))));
  }
  deleteCell(e) {
    var t = this.cells.indexOf(e);
    t > -1 && this.cells.splice(t, 1);
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    return this.component || (this.component = new Yn(this)), this.component;
  }
  getPosition() {
    return this.table.columnManager.getVisibleColumnsByIndex().indexOf(this) + 1;
  }
  getParentComponent() {
    return this.parent instanceof Lt ? this.parent.getComponent() : !1;
  }
};
U(Lt, "defaultOptionList", Zn);
let St = Lt;
class Di {
  constructor(e) {
    return this._row = e, new Proxy(this, {
      get: function(t, A, i) {
        return typeof t[A] < "u" ? t[A] : t._row.table.componentFunctionBinder.handle("row", t._row, A);
      }
    });
  }
  getData(e) {
    return this._row.getData(e);
  }
  getElement() {
    return this._row.getElement();
  }
  getCells() {
    var e = [];
    return this._row.getCells().forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  getCell(e) {
    var t = this._row.getCell(e);
    return t ? t.getComponent() : !1;
  }
  getIndex() {
    return this._row.getData("data")[this._row.table.options.index];
  }
  getPosition() {
    return this._row.getPosition();
  }
  watchPosition(e) {
    return this._row.watchPosition(e);
  }
  delete() {
    return this._row.delete();
  }
  scrollTo(e, t) {
    return this._row.table.rowManager.scrollToRow(this._row, e, t);
  }
  move(e, t) {
    this._row.moveToRow(e, t);
  }
  update(e) {
    return this._row.updateData(e);
  }
  normalizeHeight() {
    this._row.normalizeHeight(!0);
  }
  _getSelf() {
    return this._row;
  }
  reformat() {
    return this._row.reinitialize();
  }
  getTable() {
    return this._row.table;
  }
  getNextRow() {
    var e = this._row.nextRow();
    return e && e.getComponent();
  }
  getPrevRow() {
    var e = this._row.prevRow();
    return e && e.getComponent();
  }
}
class He extends ye {
  constructor(e, t, A = "row") {
    super(t.table), this.parent = t, this.data = {}, this.type = A, this.element = !1, this.modules = {}, this.cells = [], this.height = 0, this.heightStyled = "", this.manualHeight = !1, this.outerHeight = 0, this.initialized = !1, this.heightInitialized = !1, this.position = 0, this.positionWatchers = [], this.component = null, this.created = !1, this.setData(e);
  }
  create() {
    this.created || (this.created = !0, this.generateElement());
  }
  createElement() {
    var e = document.createElement("div");
    e.classList.add("tabulator-row"), e.setAttribute("role", "row"), this.element = e;
  }
  getElement() {
    return this.create(), this.element;
  }
  detachElement() {
    this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element);
  }
  generateElement() {
    this.createElement(), this.dispatch("row-init", this);
  }
  generateCells() {
    this.cells = this.table.columnManager.generateCells(this);
  }
  //functions to setup on first render
  initialize(e, t) {
    if (this.create(), !this.initialized || e) {
      for (this.deleteCells(); this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
      this.dispatch("row-layout-before", this), this.generateCells(), this.initialized = !0, this.table.columnManager.renderer.renderRowCells(this, t), e && this.normalizeHeight(), this.dispatch("row-layout", this), this.table.options.rowFormatter && this.table.options.rowFormatter(this.getComponent()), this.dispatch("row-layout-after", this);
    } else
      this.table.columnManager.renderer.rerenderRowCells(this, t);
  }
  rendered() {
    this.cells.forEach((e) => {
      e.cellRendered();
    });
  }
  reinitializeHeight() {
    this.heightInitialized = !1, this.element && this.element.offsetParent !== null && this.normalizeHeight(!0);
  }
  deinitialize() {
    this.initialized = !1;
  }
  deinitializeHeight() {
    this.heightInitialized = !1;
  }
  reinitialize(e) {
    this.initialized = !1, this.heightInitialized = !1, this.manualHeight || (this.height = 0, this.heightStyled = ""), this.element && this.element.offsetParent !== null && this.initialize(!0), this.dispatch("row-relayout", this);
  }
  //get heights when doing bulk row style calcs in virtual DOM
  calcHeight(e) {
    var t = 0, A = 0;
    this.table.options.rowHeight ? this.height = this.table.options.rowHeight : (A = this.calcMinHeight(), t = this.calcMaxHeight(), e ? this.height = Math.max(t, A) : this.height = this.manualHeight ? this.height : Math.max(t, A)), this.heightStyled = this.height ? this.height + "px" : "", this.outerHeight = this.element.offsetHeight;
  }
  calcMinHeight() {
    return this.table.options.resizableRows ? this.element.clientHeight : 0;
  }
  calcMaxHeight() {
    var e = 0;
    return this.cells.forEach(function(t) {
      var A = t.getHeight();
      A > e && (e = A);
    }), e;
  }
  //set of cells
  setCellHeight() {
    this.cells.forEach(function(e) {
      e.setHeight();
    }), this.heightInitialized = !0;
  }
  clearCellHeight() {
    this.cells.forEach(function(e) {
      e.clearHeight();
    });
  }
  //normalize the height of elements in the row
  normalizeHeight(e) {
    e && !this.table.options.rowHeight && this.clearCellHeight(), this.calcHeight(e), this.setCellHeight();
  }
  //set height of rows
  setHeight(e, t) {
    (this.height != e || t) && (this.manualHeight = !0, this.height = e, this.heightStyled = e ? e + "px" : "", this.setCellHeight(), this.outerHeight = this.element.offsetHeight, this.subscribedExternal("rowHeight") && this.dispatchExternal("rowHeight", this.getComponent()));
  }
  //return rows outer height
  getHeight() {
    return this.outerHeight;
  }
  //return rows outer Width
  getWidth() {
    return this.element.offsetWidth;
  }
  //////////////// Cell Management /////////////////
  deleteCell(e) {
    var t = this.cells.indexOf(e);
    t > -1 && this.cells.splice(t, 1);
  }
  //////////////// Data Management /////////////////
  setData(e) {
    this.data = this.chain("row-data-init-before", [this, e], void 0, e), this.dispatch("row-data-init-after", this);
  }
  //update the rows data
  updateData(e) {
    var t = this.element && ie.elVisible(this.element), A = {}, i;
    return new Promise((s, n) => {
      typeof e == "string" && (e = JSON.parse(e)), this.dispatch("row-data-save-before", this), this.subscribed("row-data-changing") && (A = Object.assign(A, this.data), A = Object.assign(A, e)), i = this.chain("row-data-changing", [this, A, e], null, e);
      for (let o in i)
        this.data[o] = i[o];
      this.dispatch("row-data-save-after", this);
      for (let o in e)
        this.table.columnManager.getColumnsByFieldRoot(o).forEach((l) => {
          let h = this.getCell(l.getField());
          if (h) {
            let u = l.getFieldValue(i);
            h.getValue() !== u && (h.setValueProcessData(u), t && h.cellRendered());
          }
        });
      t ? (this.normalizeHeight(!0), this.table.options.rowFormatter && this.table.options.rowFormatter(this.getComponent())) : (this.initialized = !1, this.height = 0, this.heightStyled = ""), this.dispatch("row-data-changed", this, t, e), this.dispatchExternal("rowUpdated", this.getComponent()), this.subscribedExternal("dataChanged") && this.dispatchExternal("dataChanged", this.table.rowManager.getData()), s();
    });
  }
  getData(e) {
    return e ? this.chain("row-data-retrieve", [this, e], null, this.data) : this.data;
  }
  getCell(e) {
    var t = !1;
    return e = this.table.columnManager.findColumn(e), !this.initialized && this.cells.length === 0 && this.generateCells(), t = this.cells.find(function(A) {
      return A.column === e;
    }), t;
  }
  getCellIndex(e) {
    return this.cells.findIndex(function(t) {
      return t === e;
    });
  }
  findCell(e) {
    return this.cells.find((t) => t.element === e);
  }
  getCells() {
    return !this.initialized && this.cells.length === 0 && this.generateCells(), this.cells;
  }
  nextRow() {
    var e = this.table.rowManager.nextDisplayRow(this, !0);
    return e || !1;
  }
  prevRow() {
    var e = this.table.rowManager.prevDisplayRow(this, !0);
    return e || !1;
  }
  moveToRow(e, t) {
    var A = this.table.rowManager.findRow(e);
    A ? (this.table.rowManager.moveRowActual(this, A, !t), this.table.rowManager.refreshActiveData("display", !1, !0)) : console.warn("Move Error - No matching row found:", e);
  }
  ///////////////////// Actions  /////////////////////
  delete() {
    return this.dispatch("row-delete", this), this.deleteActual(), Promise.resolve();
  }
  deleteActual(e) {
    this.detachModules(), this.table.rowManager.deleteRow(this, e), this.deleteCells(), this.initialized = !1, this.heightInitialized = !1, this.element = !1, this.dispatch("row-deleted", this);
  }
  detachModules() {
    this.dispatch("row-deleting", this);
  }
  deleteCells() {
    var e = this.cells.length;
    for (let t = 0; t < e; t++)
      this.cells[0].delete();
  }
  wipe() {
    if (this.detachModules(), this.deleteCells(), this.element) {
      for (; this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
      this.element.parentNode && this.element.parentNode.removeChild(this.element);
    }
    this.element = !1, this.modules = {};
  }
  isDisplayed() {
    return this.table.rowManager.getDisplayRows().includes(this);
  }
  getPosition() {
    return this.isDisplayed() ? this.position : !1;
  }
  setPosition(e) {
    e != this.position && (this.position = e, this.positionWatchers.forEach((t) => {
      t(this.position);
    }));
  }
  watchPosition(e) {
    this.positionWatchers.push(e), e(this.position);
  }
  getGroup() {
    return this.modules.group || !1;
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    return this.component || (this.component = new Di(this)), this.component;
  }
}
var pl = {
  avg: function(r, e, t) {
    var A = 0, i = typeof t.precision < "u" ? t.precision : 2;
    return r.length && (A = r.reduce(function(s, n) {
      return Number(s) + Number(n);
    }), A = A / r.length, A = i !== !1 ? A.toFixed(i) : A), parseFloat(A).toString();
  },
  max: function(r, e, t) {
    var A = null, i = typeof t.precision < "u" ? t.precision : !1;
    return r.forEach(function(s) {
      s = Number(s), (s > A || A === null) && (A = s);
    }), A !== null ? i !== !1 ? A.toFixed(i) : A : "";
  },
  min: function(r, e, t) {
    var A = null, i = typeof t.precision < "u" ? t.precision : !1;
    return r.forEach(function(s) {
      s = Number(s), (s < A || A === null) && (A = s);
    }), A !== null ? i !== !1 ? A.toFixed(i) : A : "";
  },
  sum: function(r, e, t) {
    var A = 0, i = typeof t.precision < "u" ? t.precision : !1;
    return r.length && r.forEach(function(s) {
      s = Number(s), A += isNaN(s) ? 0 : Number(s);
    }), i !== !1 ? A.toFixed(i) : A;
  },
  concat: function(r, e, t) {
    var A = 0;
    return r.length && (A = r.reduce(function(i, s) {
      return String(i) + String(s);
    })), A;
  },
  count: function(r, e, t) {
    var A = 0;
    return r.length && r.forEach(function(i) {
      i && A++;
    }), A;
  },
  unique: function(r, e, t) {
    var A = r.filter((i, s) => (r || i === 0) && r.indexOf(i) === s);
    return A.length;
  }
};
const pt = class pt extends Y {
  constructor(e) {
    super(e), this.topCalcs = [], this.botCalcs = [], this.genColumn = !1, this.topElement = this.createElement(), this.botElement = this.createElement(), this.topRow = !1, this.botRow = !1, this.topInitialized = !1, this.botInitialized = !1, this.blocked = !1, this.recalcAfterBlock = !1, this.registerTableOption("columnCalcs", !0), this.registerColumnOption("topCalc"), this.registerColumnOption("topCalcParams"), this.registerColumnOption("topCalcFormatter"), this.registerColumnOption("topCalcFormatterParams"), this.registerColumnOption("bottomCalc"), this.registerColumnOption("bottomCalcParams"), this.registerColumnOption("bottomCalcFormatter"), this.registerColumnOption("bottomCalcFormatterParams");
  }
  createElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-calcs-holder"), e;
  }
  initialize() {
    this.genColumn = new St({ field: "value" }, this), this.subscribe("cell-value-changed", this.cellValueChanged.bind(this)), this.subscribe("column-init", this.initializeColumnCheck.bind(this)), this.subscribe("row-deleted", this.rowsUpdated.bind(this)), this.subscribe("scroll-horizontal", this.scrollHorizontal.bind(this)), this.subscribe("row-added", this.rowsUpdated.bind(this)), this.subscribe("column-moved", this.recalcActiveRows.bind(this)), this.subscribe("column-add", this.recalcActiveRows.bind(this)), this.subscribe("data-refreshed", this.recalcActiveRowsRefresh.bind(this)), this.subscribe("table-redraw", this.tableRedraw.bind(this)), this.subscribe("rows-visible", this.visibleRows.bind(this)), this.subscribe("scrollbar-vertical", this.adjustForScrollbar.bind(this)), this.subscribe("redraw-blocked", this.blockRedraw.bind(this)), this.subscribe("redraw-restored", this.restoreRedraw.bind(this)), this.subscribe("table-redrawing", this.resizeHolderWidth.bind(this)), this.subscribe("column-resized", this.resizeHolderWidth.bind(this)), this.subscribe("column-show", this.resizeHolderWidth.bind(this)), this.subscribe("column-hide", this.resizeHolderWidth.bind(this)), this.registerTableFunction("getCalcResults", this.getResults.bind(this)), this.registerTableFunction("recalc", this.userRecalc.bind(this)), this.resizeHolderWidth();
  }
  resizeHolderWidth() {
    this.topElement.style.minWidth = this.table.columnManager.headersElement.offsetWidth + "px";
  }
  tableRedraw(e) {
    this.recalc(this.table.rowManager.activeRows), e && this.redraw();
  }
  blockRedraw() {
    this.blocked = !0, this.recalcAfterBlock = !1;
  }
  restoreRedraw() {
    this.blocked = !1, this.recalcAfterBlock && (this.recalcAfterBlock = !1, this.recalcActiveRowsRefresh());
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  userRecalc() {
    this.recalc(this.table.rowManager.activeRows);
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  blockCheck() {
    return this.blocked && (this.recalcAfterBlock = !0), this.blocked;
  }
  visibleRows(e, t) {
    return this.topRow && t.unshift(this.topRow), this.botRow && t.push(this.botRow), t;
  }
  rowsUpdated(e) {
    this.table.options.groupBy ? this.recalcRowGroup(e) : this.recalcActiveRows();
  }
  recalcActiveRowsRefresh() {
    this.table.options.groupBy && this.table.options.dataTreeStartExpanded && this.table.options.dataTree ? this.recalcAll() : this.recalcActiveRows();
  }
  recalcActiveRows() {
    this.recalc(this.table.rowManager.activeRows);
  }
  cellValueChanged(e) {
    (e.column.definition.topCalc || e.column.definition.bottomCalc) && (this.table.options.groupBy ? ((this.table.options.columnCalcs == "table" || this.table.options.columnCalcs == "both") && this.recalcActiveRows(), this.table.options.columnCalcs != "table" && this.recalcRowGroup(e.row)) : this.recalcActiveRows());
  }
  initializeColumnCheck(e) {
    (e.definition.topCalc || e.definition.bottomCalc) && this.initializeColumn(e);
  }
  //initialize column calcs
  initializeColumn(e) {
    var t = e.definition, A = {
      topCalcParams: t.topCalcParams || {},
      botCalcParams: t.bottomCalcParams || {}
    };
    if (t.topCalc) {
      switch (typeof t.topCalc) {
        case "string":
          pt.calculations[t.topCalc] ? A.topCalc = pt.calculations[t.topCalc] : console.warn("Column Calc Error - No such calculation found, ignoring: ", t.topCalc);
          break;
        case "function":
          A.topCalc = t.topCalc;
          break;
      }
      A.topCalc && (e.modules.columnCalcs = A, this.topCalcs.push(e), this.table.options.columnCalcs != "group" && this.initializeTopRow());
    }
    if (t.bottomCalc) {
      switch (typeof t.bottomCalc) {
        case "string":
          pt.calculations[t.bottomCalc] ? A.botCalc = pt.calculations[t.bottomCalc] : console.warn("Column Calc Error - No such calculation found, ignoring: ", t.bottomCalc);
          break;
        case "function":
          A.botCalc = t.bottomCalc;
          break;
      }
      A.botCalc && (e.modules.columnCalcs = A, this.botCalcs.push(e), this.table.options.columnCalcs != "group" && this.initializeBottomRow());
    }
  }
  //dummy functions to handle being mock column manager
  registerColumnField() {
  }
  removeCalcs() {
    var e = !1;
    this.topInitialized && (this.topInitialized = !1, this.topElement.parentNode.removeChild(this.topElement), e = !0), this.botInitialized && (this.botInitialized = !1, this.footerRemove(this.botElement), e = !0), e && this.table.rowManager.adjustTableSize();
  }
  reinitializeCalcs() {
    this.topCalcs.length && this.initializeTopRow(), this.botCalcs.length && this.initializeBottomRow();
  }
  initializeTopRow() {
    var e = document.createDocumentFragment();
    this.topInitialized || (e.appendChild(document.createElement("br")), e.appendChild(this.topElement), this.table.columnManager.getContentsElement().insertBefore(e, this.table.columnManager.headersElement.nextSibling), this.topInitialized = !0);
  }
  initializeBottomRow() {
    this.botInitialized || (this.footerPrepend(this.botElement), this.botInitialized = !0);
  }
  scrollHorizontal(e) {
    this.botInitialized && this.botRow && (this.botElement.scrollLeft = e);
  }
  recalc(e) {
    var t, A;
    if (!this.blockCheck() && (this.topInitialized || this.botInitialized)) {
      if (t = this.rowsToData(e), this.topInitialized) {
        for (this.topRow && this.topRow.deleteCells(), A = this.generateRow("top", t), this.topRow = A; this.topElement.firstChild; ) this.topElement.removeChild(this.topElement.firstChild);
        this.topElement.appendChild(A.getElement()), A.initialize(!0);
      }
      if (this.botInitialized) {
        for (this.botRow && this.botRow.deleteCells(), A = this.generateRow("bottom", t), this.botRow = A; this.botElement.firstChild; ) this.botElement.removeChild(this.botElement.firstChild);
        this.botElement.appendChild(A.getElement()), A.initialize(!0);
      }
      this.table.rowManager.adjustTableSize(), this.table.modExists("frozenColumns") && this.table.modules.frozenColumns.layout();
    }
  }
  recalcRowGroup(e) {
    this.recalcGroup(this.table.modules.groupRows.getRowGroup(e));
  }
  recalcAll() {
    if ((this.topCalcs.length || this.botCalcs.length) && (this.table.options.columnCalcs !== "group" && this.recalcActiveRows(), this.table.options.groupBy && this.table.options.columnCalcs !== "table")) {
      var e = this.table.modules.groupRows.getChildGroups();
      e.forEach((t) => {
        this.recalcGroup(t);
      });
    }
  }
  recalcGroup(e) {
    var t, A;
    this.blockCheck() || e && e.calcs && (e.calcs.bottom && (t = this.rowsToData(e.rows), A = this.generateRowData("bottom", t), e.calcs.bottom.updateData(A), e.calcs.bottom.reinitialize()), e.calcs.top && (t = this.rowsToData(e.rows), A = this.generateRowData("top", t), e.calcs.top.updateData(A), e.calcs.top.reinitialize()));
  }
  //generate top stats row
  generateTopRow(e) {
    return this.generateRow("top", this.rowsToData(e));
  }
  //generate bottom stats row
  generateBottomRow(e) {
    return this.generateRow("bottom", this.rowsToData(e));
  }
  rowsToData(e) {
    var t = [], A = this.table.options.dataTree && this.table.options.dataTreeChildColumnCalcs, i = this.table.modules.dataTree;
    return e.forEach((s) => {
      var n;
      t.push(s.getData()), A && ((n = s.modules.dataTree) != null && n.open) && this.rowsToData(i.getFilteredTreeChildren(s)).forEach((o) => {
        t.push(s);
      });
    }), t;
  }
  //generate stats row
  generateRow(e, t) {
    var A = this.generateRowData(e, t), i;
    return this.table.modExists("mutator") && this.table.modules.mutator.disable(), i = new He(A, this, "calc"), this.table.modExists("mutator") && this.table.modules.mutator.enable(), i.getElement().classList.add("tabulator-calcs", "tabulator-calcs-" + e), i.component = !1, i.getComponent = () => (i.component || (i.component = new gl(i)), i.component), i.generateCells = () => {
      var s = [];
      this.table.columnManager.columnsByIndex.forEach((n) => {
        this.genColumn.setField(n.getField()), this.genColumn.hozAlign = n.hozAlign, n.definition[e + "CalcFormatter"] && this.table.modExists("format") ? this.genColumn.modules.format = {
          formatter: this.table.modules.format.lookupFormatter(n.definition[e + "CalcFormatter"]),
          params: n.definition[e + "CalcFormatterParams"] || {}
        } : this.genColumn.modules.format = {
          formatter: this.table.modules.format.lookupFormatter("plaintext"),
          params: {}
        }, this.genColumn.definition.cssClass = n.definition.cssClass;
        var o = new OA(this.genColumn, i);
        o.getElement(), o.column = n, o.setWidth(), n.cells.push(o), s.push(o), n.visible || o.hide();
      }), i.cells = s;
    }, i;
  }
  //generate stats row
  generateRowData(e, t) {
    var A = {}, i = e == "top" ? this.topCalcs : this.botCalcs, s = e == "top" ? "topCalc" : "botCalc", n, o;
    return i.forEach(function(a) {
      var l = [];
      a.modules.columnCalcs && a.modules.columnCalcs[s] && (t.forEach(function(h) {
        l.push(a.getFieldValue(h));
      }), o = s + "Params", n = typeof a.modules.columnCalcs[o] == "function" ? a.modules.columnCalcs[o](l, t) : a.modules.columnCalcs[o], a.setFieldValue(A, a.modules.columnCalcs[s](l, t, n)));
    }), A;
  }
  hasTopCalcs() {
    return !!this.topCalcs.length;
  }
  hasBottomCalcs() {
    return !!this.botCalcs.length;
  }
  //handle table redraw
  redraw() {
    this.topRow && this.topRow.normalizeHeight(!0), this.botRow && this.botRow.normalizeHeight(!0);
  }
  //return the calculated
  getResults() {
    var e = {}, t;
    return this.table.options.groupBy && this.table.modExists("groupRows") ? (t = this.table.modules.groupRows.getGroups(!0), t.forEach((A) => {
      e[A.getKey()] = this.getGroupResults(A);
    })) : e = {
      top: this.topRow ? this.topRow.getData() : {},
      bottom: this.botRow ? this.botRow.getData() : {}
    }, e;
  }
  //get results from a group
  getGroupResults(e) {
    var t = e._getSelf(), A = e.getSubGroups(), i = {}, s = {};
    return A.forEach((n) => {
      i[n.getKey()] = this.getGroupResults(n);
    }), s = {
      top: t.calcs.top ? t.calcs.top.getData() : {},
      bottom: t.calcs.bottom ? t.calcs.bottom.getData() : {},
      groups: i
    }, s;
  }
  adjustForScrollbar(e) {
    this.botRow && (this.table.rtl ? this.botElement.style.paddingLeft = e + "px" : this.botElement.style.paddingRight = e + "px");
  }
};
U(pt, "moduleName", "columnCalcs"), //load defaults
U(pt, "calculations", pl);
let Ds = pt;
class $n extends Y {
  constructor(e) {
    super(e), this.indent = 10, this.field = "", this.collapseEl = null, this.expandEl = null, this.branchEl = null, this.elementField = !1, this.startOpen = function() {
    }, this.registerTableOption("dataTree", !1), this.registerTableOption("dataTreeFilter", !0), this.registerTableOption("dataTreeSort", !0), this.registerTableOption("dataTreeElementColumn", !1), this.registerTableOption("dataTreeBranchElement", !0), this.registerTableOption("dataTreeChildIndent", 9), this.registerTableOption("dataTreeChildField", "_children"), this.registerTableOption("dataTreeCollapseElement", !1), this.registerTableOption("dataTreeExpandElement", !1), this.registerTableOption("dataTreeStartExpanded", !1), this.registerTableOption("dataTreeChildColumnCalcs", !1), this.registerTableOption("dataTreeSelectPropagate", !1), this.registerComponentFunction("row", "treeCollapse", this.collapseRow.bind(this)), this.registerComponentFunction("row", "treeExpand", this.expandRow.bind(this)), this.registerComponentFunction("row", "treeToggle", this.toggleRow.bind(this)), this.registerComponentFunction("row", "getTreeParent", this.getTreeParent.bind(this)), this.registerComponentFunction("row", "getTreeChildren", this.getRowChildren.bind(this)), this.registerComponentFunction("row", "addTreeChild", this.addTreeChildRow.bind(this)), this.registerComponentFunction("row", "isTreeExpanded", this.isRowExpanded.bind(this));
  }
  initialize() {
    if (this.table.options.dataTree) {
      var e = null, t = this.table.options;
      switch (this.field = t.dataTreeChildField, this.indent = t.dataTreeChildIndent, this.options("movableRows") && console.warn("The movableRows option is not available with dataTree enabled, moving of child rows could result in unpredictable behavior"), t.dataTreeBranchElement ? t.dataTreeBranchElement === !0 ? (this.branchEl = document.createElement("div"), this.branchEl.classList.add("tabulator-data-tree-branch")) : typeof t.dataTreeBranchElement == "string" ? (e = document.createElement("div"), e.innerHTML = t.dataTreeBranchElement, this.branchEl = e.firstChild) : this.branchEl = t.dataTreeBranchElement : (this.branchEl = document.createElement("div"), this.branchEl.classList.add("tabulator-data-tree-branch-empty")), t.dataTreeCollapseElement ? typeof t.dataTreeCollapseElement == "string" ? (e = document.createElement("div"), e.innerHTML = t.dataTreeCollapseElement, this.collapseEl = e.firstChild) : this.collapseEl = t.dataTreeCollapseElement : (this.collapseEl = document.createElement("div"), this.collapseEl.classList.add("tabulator-data-tree-control"), this.collapseEl.tabIndex = 0, this.collapseEl.innerHTML = "<div class='tabulator-data-tree-control-collapse'></div>"), t.dataTreeExpandElement ? typeof t.dataTreeExpandElement == "string" ? (e = document.createElement("div"), e.innerHTML = t.dataTreeExpandElement, this.expandEl = e.firstChild) : this.expandEl = t.dataTreeExpandElement : (this.expandEl = document.createElement("div"), this.expandEl.classList.add("tabulator-data-tree-control"), this.expandEl.tabIndex = 0, this.expandEl.innerHTML = "<div class='tabulator-data-tree-control-expand'></div>"), typeof t.dataTreeStartExpanded) {
        case "boolean":
          this.startOpen = function(A, i) {
            return t.dataTreeStartExpanded;
          };
          break;
        case "function":
          this.startOpen = t.dataTreeStartExpanded;
          break;
        default:
          this.startOpen = function(A, i) {
            return t.dataTreeStartExpanded[i];
          };
          break;
      }
      this.subscribe("row-init", this.initializeRow.bind(this)), this.subscribe("row-layout-after", this.layoutRow.bind(this)), this.subscribe("row-deleting", this.rowDeleting.bind(this)), this.subscribe("row-deleted", this.rowDelete.bind(this), 0), this.subscribe("row-data-changed", this.rowDataChanged.bind(this), 10), this.subscribe("cell-value-updated", this.cellValueChanged.bind(this)), this.subscribe("edit-cancelled", this.cellValueChanged.bind(this)), this.subscribe("column-moving-rows", this.columnMoving.bind(this)), this.subscribe("table-built", this.initializeElementField.bind(this)), this.subscribe("table-redrawing", this.tableRedrawing.bind(this)), this.registerDisplayHandler(this.getRows.bind(this), 30);
    }
  }
  tableRedrawing(e) {
    var t;
    e && (t = this.table.rowManager.getRows(), t.forEach((A) => {
      this.reinitializeRowChildren(A);
    }));
  }
  initializeElementField() {
    var e = this.table.columnManager.getFirstVisibleColumn();
    this.elementField = this.table.options.dataTreeElementColumn || (e ? e.field : !1);
  }
  getRowChildren(e) {
    return this.getTreeChildren(e, !0);
  }
  columnMoving() {
    var e = [];
    return this.table.rowManager.rows.forEach((t) => {
      e = e.concat(this.getTreeChildren(t, !1, !0));
    }), e;
  }
  rowDataChanged(e, t, A) {
    this.redrawNeeded(A) && (this.initializeRow(e), t && (this.layoutRow(e), this.refreshData(!0)));
  }
  cellValueChanged(e) {
    var t = e.column.getField();
    t === this.elementField && this.layoutRow(e.row);
  }
  initializeRow(e) {
    var t = e.getData()[this.field], A = Array.isArray(t), i = A || !A && typeof t == "object" && t !== null;
    !i && e.modules.dataTree && e.modules.dataTree.branchEl && e.modules.dataTree.branchEl.parentNode.removeChild(e.modules.dataTree.branchEl), !i && e.modules.dataTree && e.modules.dataTree.controlEl && e.modules.dataTree.controlEl.parentNode.removeChild(e.modules.dataTree.controlEl), e.modules.dataTree = {
      index: e.modules.dataTree ? e.modules.dataTree.index : 0,
      open: i ? e.modules.dataTree ? e.modules.dataTree.open : this.startOpen(e.getComponent(), 0) : !1,
      controlEl: e.modules.dataTree && i ? e.modules.dataTree.controlEl : !1,
      branchEl: e.modules.dataTree && i ? e.modules.dataTree.branchEl : !1,
      parent: e.modules.dataTree ? e.modules.dataTree.parent : !1,
      children: i
    };
  }
  reinitializeRowChildren(e) {
    var t = this.getTreeChildren(e, !1, !0);
    t.forEach(function(A) {
      A.reinitialize(!0);
    });
  }
  layoutRow(e) {
    var t = this.elementField ? e.getCell(this.elementField) : e.getCells()[0], A = t.getElement(), i = e.modules.dataTree;
    i.branchEl && (i.branchEl.parentNode && i.branchEl.parentNode.removeChild(i.branchEl), i.branchEl = !1), i.controlEl && (i.controlEl.parentNode && i.controlEl.parentNode.removeChild(i.controlEl), i.controlEl = !1), this.generateControlElement(e, A), e.getElement().classList.add("tabulator-tree-level-" + i.index), i.index && (this.branchEl ? (i.branchEl = this.branchEl.cloneNode(!0), A.insertBefore(i.branchEl, A.firstChild), this.table.rtl ? i.branchEl.style.marginRight = (i.branchEl.offsetWidth + i.branchEl.style.marginLeft) * (i.index - 1) + i.index * this.indent + "px" : i.branchEl.style.marginLeft = (i.branchEl.offsetWidth + i.branchEl.style.marginRight) * (i.index - 1) + i.index * this.indent + "px") : this.table.rtl ? A.style.paddingRight = parseInt(window.getComputedStyle(A, null).getPropertyValue("padding-right")) + i.index * this.indent + "px" : A.style.paddingLeft = parseInt(window.getComputedStyle(A, null).getPropertyValue("padding-left")) + i.index * this.indent + "px");
  }
  generateControlElement(e, t) {
    var A = e.modules.dataTree, i = A.controlEl;
    t = t || e.getCells()[0].getElement(), A.children !== !1 && (A.open ? (A.controlEl = this.collapseEl.cloneNode(!0), A.controlEl.addEventListener("click", (s) => {
      s.stopPropagation(), this.collapseRow(e);
    })) : (A.controlEl = this.expandEl.cloneNode(!0), A.controlEl.addEventListener("click", (s) => {
      s.stopPropagation(), this.expandRow(e);
    })), A.controlEl.addEventListener("mousedown", (s) => {
      s.stopPropagation();
    }), i && i.parentNode === t ? i.parentNode.replaceChild(A.controlEl, i) : t.insertBefore(A.controlEl, t.firstChild));
  }
  getRows(e) {
    var t = [];
    return e.forEach((A, i) => {
      var s, n;
      t.push(A), A instanceof He && (A.create(), s = A.modules.dataTree, !s.index && s.children !== !1 && (n = this.getChildren(A, !1, !0), n.forEach((o) => {
        o.create(), t.push(o);
      })));
    }), t;
  }
  getChildren(e, t, A) {
    var i = e.modules.dataTree, s = [], n = [];
    return i.children !== !1 && (i.open || t) && (Array.isArray(i.children) || (i.children = this.generateChildren(e)), this.table.modExists("filter") && this.table.options.dataTreeFilter ? s = this.table.modules.filter.filter(i.children) : s = i.children, this.table.modExists("sort") && this.table.options.dataTreeSort && this.table.modules.sort.sort(s, A), s.forEach((o) => {
      n.push(o);
      var a = this.getChildren(o, !1, !0);
      a.forEach((l) => {
        n.push(l);
      });
    })), n;
  }
  generateChildren(e) {
    var t = [], A = e.getData()[this.field];
    return Array.isArray(A) || (A = [A]), A.forEach((i) => {
      var s = new He(i || {}, this.table.rowManager);
      s.create(), s.modules.dataTree.index = e.modules.dataTree.index + 1, s.modules.dataTree.parent = e, s.modules.dataTree.children && (s.modules.dataTree.open = this.startOpen(s.getComponent(), s.modules.dataTree.index)), t.push(s);
    }), t;
  }
  expandRow(e, t) {
    var A = e.modules.dataTree;
    A.children !== !1 && (A.open = !0, e.reinitialize(), this.refreshData(!0), this.dispatchExternal("dataTreeRowExpanded", e.getComponent(), e.modules.dataTree.index));
  }
  collapseRow(e) {
    var t = e.modules.dataTree;
    t.children !== !1 && (t.open = !1, e.reinitialize(), this.refreshData(!0), this.dispatchExternal("dataTreeRowCollapsed", e.getComponent(), e.modules.dataTree.index));
  }
  toggleRow(e) {
    var t = e.modules.dataTree;
    t.children !== !1 && (t.open ? this.collapseRow(e) : this.expandRow(e));
  }
  isRowExpanded(e) {
    return e.modules.dataTree.open;
  }
  getTreeParent(e) {
    return e.modules.dataTree.parent ? e.modules.dataTree.parent.getComponent() : !1;
  }
  getTreeParentRoot(e) {
    return e.modules.dataTree && e.modules.dataTree.parent ? this.getTreeParentRoot(e.modules.dataTree.parent) : e;
  }
  getFilteredTreeChildren(e) {
    var t = e.modules.dataTree, A = [], i;
    return t.children && (Array.isArray(t.children) || (t.children = this.generateChildren(e)), this.table.modExists("filter") && this.table.options.dataTreeFilter ? i = this.table.modules.filter.filter(t.children) : i = t.children, i.forEach((s) => {
      s instanceof He && A.push(s);
    })), A;
  }
  rowDeleting(e) {
    var t = e.modules.dataTree;
    t && t.children && Array.isArray(t.children) && t.children.forEach((A) => {
      A instanceof He && A.wipe();
    });
  }
  rowDelete(e) {
    var t = e.modules.dataTree.parent, A;
    t && (A = this.findChildIndex(e, t), A !== !1 && t.data[this.field].splice(A, 1), t.data[this.field].length || delete t.data[this.field], this.initializeRow(t), this.layoutRow(t)), this.refreshData(!0);
  }
  addTreeChildRow(e, t, A, i) {
    var s = !1;
    typeof t == "string" && (t = JSON.parse(t)), Array.isArray(e.data[this.field]) || (e.data[this.field] = [], e.modules.dataTree.open = this.startOpen(e.getComponent(), e.modules.dataTree.index)), typeof i < "u" && (s = this.findChildIndex(i, e), s !== !1 && e.data[this.field].splice(A ? s : s + 1, 0, t)), s === !1 && (A ? e.data[this.field].unshift(t) : e.data[this.field].push(t)), this.initializeRow(e), this.layoutRow(e), this.refreshData(!0);
  }
  findChildIndex(e, t) {
    var A = !1;
    return typeof e == "object" ? e instanceof He ? A = e.data : e instanceof Di ? A = e._getSelf().data : typeof HTMLElement < "u" && e instanceof HTMLElement ? t.modules.dataTree && (A = t.modules.dataTree.children.find((i) => i instanceof He ? i.element === e : !1), A && (A = A.data)) : e === null && (A = !1) : typeof e > "u" ? A = !1 : A = t.data[this.field].find((i) => i.data[this.table.options.index] == e), A && (Array.isArray(t.data[this.field]) && (A = t.data[this.field].indexOf(A)), A == -1 && (A = !1)), A;
  }
  getTreeChildren(e, t, A) {
    var i = e.modules.dataTree, s = [];
    return i && i.children && (Array.isArray(i.children) || (i.children = this.generateChildren(e)), i.children.forEach((n) => {
      n instanceof He && (s.push(t ? n.getComponent() : n), A && this.getTreeChildren(n, t, A).forEach((o) => {
        s.push(o);
      }));
    })), s;
  }
  getChildField() {
    return this.field;
  }
  redrawNeeded(e) {
    return (this.field ? typeof e[this.field] < "u" : !1) || (this.elementField ? typeof e[this.elementField] < "u" : !1);
  }
}
U($n, "moduleName", "dataTree");
function ml(r, e = {}, t) {
  var A = e.delimiter ? e.delimiter : ",", i = [], s = [];
  r.forEach((n) => {
    var o = [];
    switch (n.type) {
      case "group":
        console.warn("Download Warning - CSV downloader cannot process row groups");
        break;
      case "calc":
        console.warn("Download Warning - CSV downloader cannot process column calculations");
        break;
      case "header":
        n.columns.forEach((a, l) => {
          a && a.depth === 1 && (s[l] = typeof a.value > "u" || a.value === null ? "" : '"' + String(a.value).split('"').join('""') + '"');
        });
        break;
      case "row":
        n.columns.forEach((a) => {
          if (a) {
            switch (typeof a.value) {
              case "object":
                a.value = a.value !== null ? JSON.stringify(a.value) : "";
                break;
              case "undefined":
                a.value = "";
                break;
            }
            o.push('"' + String(a.value).split('"').join('""') + '"');
          }
        }), i.push(o.join(A));
        break;
    }
  }), s.length && i.unshift(s.join(A)), i = i.join(`
`), e.bom && (i = "\uFEFF" + i), t(i, "text/csv");
}
function wl(r, e, t) {
  var A = [];
  r.forEach((i) => {
    var s = {};
    switch (i.type) {
      case "header":
        break;
      case "group":
        console.warn("Download Warning - JSON downloader cannot process row groups");
        break;
      case "calc":
        console.warn("Download Warning - JSON downloader cannot process column calculations");
        break;
      case "row":
        i.columns.forEach((n) => {
          n && (s[n.component.getTitleDownload() || n.component.getField()] = n.value);
        }), A.push(s);
        break;
    }
  }), A = JSON.stringify(A, null, "	"), t(A, "application/json");
}
function bl(r, e = {}, t) {
  var A = [], i = [], s = {}, n = e.rowGroupStyles || {
    fontStyle: "bold",
    fontSize: 12,
    cellPadding: 6,
    fillColor: 220
  }, o = e.rowCalcStyles || {
    fontStyle: "bold",
    fontSize: 10,
    cellPadding: 4,
    fillColor: 232
  }, a = e.jsPDF || {}, l = e.title ? e.title : "", h, u;
  a.orientation || (a.orientation = e.orientation || "landscape"), a.unit || (a.unit = "pt"), r.forEach((f) => {
    switch (f.type) {
      case "header":
        A.push(c(f));
        break;
      case "group":
        i.push(c(f, n));
        break;
      case "calc":
        i.push(c(f, o));
        break;
      case "row":
        i.push(c(f));
        break;
    }
  });
  function c(f, w) {
    var b = [];
    return f.columns.forEach((v) => {
      var B;
      if (v) {
        switch (typeof v.value) {
          case "object":
            v.value = v.value !== null ? JSON.stringify(v.value) : "";
            break;
          case "undefined":
            v.value = "";
            break;
        }
        B = {
          content: v.value,
          colSpan: v.width,
          rowSpan: v.height
        }, w && (B.styles = w), b.push(B);
      }
    }), b;
  }
  h = this.dependencyRegistry.lookup("jspdf", "jsPDF"), u = new h(a), e.autoTable && (typeof e.autoTable == "function" ? s = e.autoTable(u) || {} : s = e.autoTable), l && (s.didDrawPage = function(f) {
    u.text(l, 40, 30);
  }), s.head = A, s.body = i, u.autoTable(s), e.documentProcessing && e.documentProcessing(u), t(u.output("arraybuffer"), "application/pdf");
}
function Bl(r, e, t) {
  var A = this, i = e.sheetName || "Sheet1", s = this.dependencyRegistry.lookup("XLSX"), n = s.utils.book_new(), o = new ye(this), a = "compress" in e ? e.compress : !0, l = e.writeOptions || { bookType: "xlsx", bookSST: !0, compression: a }, h;
  l.type = "binary", n.SheetNames = [], n.Sheets = {};
  function u() {
    var w = [], b = [], v = {}, B = { s: { c: 0, r: 0 }, e: { c: r[0] ? r[0].columns.reduce((y, D) => y + (D && D.width ? D.width : 1), 0) : 0, r: r.length } };
    return r.forEach((y, D) => {
      var L = [];
      y.columns.forEach(function(R, Q) {
        R ? (L.push(!(R.value instanceof Date) && typeof R.value == "object" ? JSON.stringify(R.value) : R.value), (R.width > 1 || R.height > -1) && (R.height > 1 || R.width > 1) && b.push({ s: { r: D, c: Q }, e: { r: D + R.height - 1, c: Q + R.width - 1 } })) : L.push("");
      }), w.push(L);
    }), s.utils.sheet_add_aoa(v, w), v["!ref"] = s.utils.encode_range(B), b.length && (v["!merges"] = b), v;
  }
  if (e.sheetOnly) {
    t(u());
    return;
  }
  if (e.sheets)
    for (var c in e.sheets)
      e.sheets[c] === !0 ? (n.SheetNames.push(c), n.Sheets[c] = u()) : (n.SheetNames.push(c), o.commsSend(e.sheets[c], "download", "intercept", {
        type: "xlsx",
        options: { sheetOnly: !0 },
        active: A.active,
        intercept: function(w) {
          n.Sheets[c] = w;
        }
      }));
  else
    n.SheetNames.push(i), n.Sheets[i] = u();
  e.documentProcessing && (n = e.documentProcessing(n));
  function f(w) {
    for (var b = new ArrayBuffer(w.length), v = new Uint8Array(b), B = 0; B != w.length; ++B) v[B] = w.charCodeAt(B) & 255;
    return b;
  }
  h = s.write(n, l), t(f(h), "application/octet-stream");
}
function Cl(r, e, t) {
  this.modExists("export", !0) && t(this.modules.export.generateHTMLTable(r), "text/html");
}
function vl(r, e, t) {
  const A = [];
  r.forEach((i) => {
    const s = {};
    switch (i.type) {
      case "header":
        break;
      case "group":
        console.warn("Download Warning - JSON downloader cannot process row groups");
        break;
      case "calc":
        console.warn("Download Warning - JSON downloader cannot process column calculations");
        break;
      case "row":
        i.columns.forEach((n) => {
          n && (s[n.component.getTitleDownload() || n.component.getField()] = n.value);
        }), A.push(JSON.stringify(s));
        break;
    }
  }), t(A.join(`
`), "application/x-ndjson");
}
var El = {
  csv: ml,
  json: wl,
  jsonLines: vl,
  pdf: bl,
  xlsx: Bl,
  html: Cl
};
const eA = class eA extends Y {
  constructor(e) {
    super(e), this.registerTableOption("downloadEncoder", function(t, A) {
      return new Blob([t], { type: A });
    }), this.registerTableOption("downloadConfig", {}), this.registerTableOption("downloadRowRange", "active"), this.registerColumnOption("download"), this.registerColumnOption("titleDownload");
  }
  initialize() {
    this.deprecatedOptionsCheck(), this.registerTableFunction("download", this.download.bind(this)), this.registerTableFunction("downloadToTab", this.downloadToTab.bind(this));
  }
  deprecatedOptionsCheck() {
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  downloadToTab(e, t, A, i) {
    this.download(e, t, A, i, !0);
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  //trigger file download
  download(e, t, A, i, s) {
    var n = !1;
    function o(l, h) {
      s ? s === !0 ? this.triggerDownload(l, h, e, t, !0) : s(l) : this.triggerDownload(l, h, e, t);
    }
    if (typeof e == "function" ? n = e : eA.downloaders[e] ? n = eA.downloaders[e] : console.warn("Download Error - No such download type found: ", e), n) {
      var a = this.generateExportList(i);
      n.call(this.table, a, A || {}, o.bind(this));
    }
  }
  generateExportList(e) {
    var t = this.table.modules.export.generateExportList(this.table.options.downloadConfig, !1, e || this.table.options.downloadRowRange, "download"), A = this.table.options.groupHeaderDownload;
    return A && !Array.isArray(A) && (A = [A]), t.forEach((i) => {
      var s;
      i.type === "group" && (s = i.columns[0], A && A[i.indent] && (s.value = A[i.indent](s.value, i.component._group.getRowCount(), i.component._group.getData(), i.component)));
    }), t;
  }
  triggerDownload(e, t, A, i, s) {
    var n = document.createElement("a"), o = this.table.options.downloadEncoder(e, t);
    o && (s ? window.open(window.URL.createObjectURL(o)) : (i = i || "Tabulator." + (typeof A == "function" ? "txt" : A), navigator.msSaveOrOpenBlob ? navigator.msSaveOrOpenBlob(o, i) : (n.setAttribute("href", window.URL.createObjectURL(o)), n.setAttribute("download", i), n.style.display = "none", document.body.appendChild(n), n.click(), document.body.removeChild(n))), this.dispatchExternal("downloadComplete"));
  }
  commsReceived(e, t, A) {
    switch (t) {
      case "intercept":
        this.download(A.type, "", A.options, A.active, A.intercept);
        break;
    }
  }
};
U(eA, "moduleName", "download"), //load defaults
U(eA, "downloaders", El);
let Ss = eA;
function Si(r, e) {
  var t = e.mask, A = typeof e.maskLetterChar < "u" ? e.maskLetterChar : "A", i = typeof e.maskNumberChar < "u" ? e.maskNumberChar : "9", s = typeof e.maskWildcardChar < "u" ? e.maskWildcardChar : "*";
  function n(o) {
    var a = t[o];
    typeof a < "u" && a !== s && a !== A && a !== i && (r.value = r.value + "" + a, n(o + 1));
  }
  r.addEventListener("keydown", (o) => {
    var a = r.value.length, l = o.key;
    if (o.keyCode > 46 && !o.ctrlKey && !o.metaKey) {
      if (a >= t.length)
        return o.preventDefault(), o.stopPropagation(), !1;
      switch (t[a]) {
        case A:
          if (l.toUpperCase() == l.toLowerCase())
            return o.preventDefault(), o.stopPropagation(), !1;
          break;
        case i:
          if (isNaN(l))
            return o.preventDefault(), o.stopPropagation(), !1;
          break;
        case s:
          break;
        default:
          if (l !== t[a])
            return o.preventDefault(), o.stopPropagation(), !1;
      }
    }
  }), r.addEventListener("keyup", (o) => {
    o.keyCode > 46 && e.maskAutoFill && n(r.value.length);
  }), r.placeholder || (r.placeholder = t), e.maskAutoFill && n(r.value.length);
}
function yl(r, e, t, A, i) {
  var s = r.getValue(), n = document.createElement("input");
  if (n.setAttribute("type", i.search ? "search" : "text"), n.style.padding = "4px", n.style.width = "100%", n.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let a in i.elementAttributes)
      a.charAt(0) == "+" ? (a = a.slice(1), n.setAttribute(a, n.getAttribute(a) + i.elementAttributes["+" + a])) : n.setAttribute(a, i.elementAttributes[a]);
  n.value = typeof s < "u" ? s : "", e(function() {
    r.getType() === "cell" && (n.focus({ preventScroll: !0 }), n.style.height = "100%", i.selectContents && n.select());
  });
  function o(a) {
    (s === null || typeof s > "u") && n.value !== "" || n.value !== s ? t(n.value) && (s = n.value) : A();
  }
  return n.addEventListener("change", o), n.addEventListener("blur", o), n.addEventListener("keydown", function(a) {
    switch (a.keyCode) {
      case 13:
        o();
        break;
      case 27:
        A();
        break;
      case 35:
      case 36:
        a.stopPropagation();
        break;
    }
  }), i.mask && Si(n, i), n;
}
function Fl(r, e, t, A, i) {
  var s = r.getValue(), n = i.verticalNavigation || "hybrid", o = String(s !== null && typeof s < "u" ? s : ""), a = document.createElement("textarea"), l = 0;
  if (a.style.display = "block", a.style.padding = "2px", a.style.height = "100%", a.style.width = "100%", a.style.boxSizing = "border-box", a.style.whiteSpace = "pre-wrap", a.style.resize = "none", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let u in i.elementAttributes)
      u.charAt(0) == "+" ? (u = u.slice(1), a.setAttribute(u, a.getAttribute(u) + i.elementAttributes["+" + u])) : a.setAttribute(u, i.elementAttributes[u]);
  a.value = o, e(function() {
    r.getType() === "cell" && (a.focus({ preventScroll: !0 }), a.style.height = "100%", a.scrollHeight, a.style.height = a.scrollHeight + "px", r.getRow().normalizeHeight(), i.selectContents && a.select());
  });
  function h(u) {
    (s === null || typeof s > "u") && a.value !== "" || a.value !== s ? (t(a.value) && (s = a.value), setTimeout(function() {
      r.getRow().normalizeHeight();
    }, 300)) : A();
  }
  return a.addEventListener("change", h), a.addEventListener("blur", h), a.addEventListener("keyup", function() {
    a.style.height = "";
    var u = a.scrollHeight;
    a.style.height = u + "px", u != l && (l = u, r.getRow().normalizeHeight());
  }), a.addEventListener("keydown", function(u) {
    switch (u.keyCode) {
      case 13:
        u.shiftKey && i.shiftEnterSubmit && h();
        break;
      case 27:
        A();
        break;
      case 38:
        (n == "editor" || n == "hybrid" && a.selectionStart) && (u.stopImmediatePropagation(), u.stopPropagation());
        break;
      case 40:
        (n == "editor" || n == "hybrid" && a.selectionStart !== a.value.length) && (u.stopImmediatePropagation(), u.stopPropagation());
        break;
      case 35:
      case 36:
        u.stopPropagation();
        break;
    }
  }), i.mask && Si(a, i), a;
}
function Ql(r, e, t, A, i) {
  var s = r.getValue(), n = i.verticalNavigation || "editor", o = document.createElement("input");
  if (o.setAttribute("type", "number"), typeof i.max < "u" && o.setAttribute("max", i.max), typeof i.min < "u" && o.setAttribute("min", i.min), typeof i.step < "u" && o.setAttribute("step", i.step), o.style.padding = "4px", o.style.width = "100%", o.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let h in i.elementAttributes)
      h.charAt(0) == "+" ? (h = h.slice(1), o.setAttribute(h, o.getAttribute(h) + i.elementAttributes["+" + h])) : o.setAttribute(h, i.elementAttributes[h]);
  o.value = s;
  var a = function(h) {
    l();
  };
  e(function() {
    r.getType() === "cell" && (o.removeEventListener("blur", a), o.focus({ preventScroll: !0 }), o.style.height = "100%", o.addEventListener("blur", a), i.selectContents && o.select());
  });
  function l() {
    var h = o.value;
    !isNaN(h) && h !== "" && (h = Number(h)), h !== s ? t(h) && (s = h) : A();
  }
  return o.addEventListener("keydown", function(h) {
    switch (h.keyCode) {
      case 13:
        l();
        break;
      case 27:
        A();
        break;
      case 38:
      case 40:
        n == "editor" && (h.stopImmediatePropagation(), h.stopPropagation());
        break;
      case 35:
      case 36:
        h.stopPropagation();
        break;
    }
  }), i.mask && Si(o, i), o;
}
function Ul(r, e, t, A, i) {
  var s = r.getValue(), n = document.createElement("input");
  if (n.setAttribute("type", "range"), typeof i.max < "u" && n.setAttribute("max", i.max), typeof i.min < "u" && n.setAttribute("min", i.min), typeof i.step < "u" && n.setAttribute("step", i.step), n.style.padding = "4px", n.style.width = "100%", n.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let a in i.elementAttributes)
      a.charAt(0) == "+" ? (a = a.slice(1), n.setAttribute(a, n.getAttribute(a) + i.elementAttributes["+" + a])) : n.setAttribute(a, i.elementAttributes[a]);
  n.value = s, e(function() {
    r.getType() === "cell" && (n.focus({ preventScroll: !0 }), n.style.height = "100%");
  });
  function o() {
    var a = n.value;
    !isNaN(a) && a !== "" && (a = Number(a)), a != s ? t(a) && (s = a) : A();
  }
  return n.addEventListener("blur", function(a) {
    o();
  }), n.addEventListener("keydown", function(a) {
    switch (a.keyCode) {
      case 13:
        o();
        break;
      case 27:
        A();
        break;
    }
  }), n;
}
function Hl(r, e, t, A, i) {
  var s = i.format, n = i.verticalNavigation || "editor", o = s ? window.DateTime || luxon.DateTime : null, a = r.getValue(), l = document.createElement("input");
  function h(c) {
    var f;
    return o.isDateTime(c) ? f = c : s === "iso" ? f = o.fromISO(String(c)) : f = o.fromFormat(String(c), s), f.toFormat("yyyy-MM-dd");
  }
  if (l.type = "date", l.style.padding = "4px", l.style.width = "100%", l.style.boxSizing = "border-box", i.max && l.setAttribute("max", s ? h(i.max) : i.max), i.min && l.setAttribute("min", s ? h(i.min) : i.min), i.elementAttributes && typeof i.elementAttributes == "object")
    for (let c in i.elementAttributes)
      c.charAt(0) == "+" ? (c = c.slice(1), l.setAttribute(c, l.getAttribute(c) + i.elementAttributes["+" + c])) : l.setAttribute(c, i.elementAttributes[c]);
  a = typeof a < "u" ? a : "", s && (o ? a = h(a) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), l.value = a, e(function() {
    r.getType() === "cell" && (l.focus({ preventScroll: !0 }), l.style.height = "100%", i.selectContents && l.select());
  });
  function u() {
    var c = l.value, f;
    if ((a === null || typeof a > "u") && c !== "" || c !== a) {
      if (c && s)
        switch (f = o.fromFormat(String(c), "yyyy-MM-dd"), s) {
          case !0:
            c = f;
            break;
          case "iso":
            c = f.toISO();
            break;
          default:
            c = f.toFormat(s);
        }
      t(c) && (a = l.value);
    } else
      A();
  }
  return l.addEventListener("blur", function(c) {
    (c.relatedTarget || c.rangeParent || c.explicitOriginalTarget !== l) && u();
  }), l.addEventListener("keydown", function(c) {
    switch (c.keyCode) {
      case 13:
        u();
        break;
      case 27:
        A();
        break;
      case 35:
      case 36:
        c.stopPropagation();
        break;
      case 38:
      case 40:
        n == "editor" && (c.stopImmediatePropagation(), c.stopPropagation());
        break;
    }
  }), l;
}
function Rl(r, e, t, A, i) {
  var s = i.format, n = i.verticalNavigation || "editor", o = s ? window.DateTime || luxon.DateTime : null, a, l = r.getValue(), h = document.createElement("input");
  if (h.type = "time", h.style.padding = "4px", h.style.width = "100%", h.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let c in i.elementAttributes)
      c.charAt(0) == "+" ? (c = c.slice(1), h.setAttribute(c, h.getAttribute(c) + i.elementAttributes["+" + c])) : h.setAttribute(c, i.elementAttributes[c]);
  l = typeof l < "u" ? l : "", s && (o ? (o.isDateTime(l) ? a = l : s === "iso" ? a = o.fromISO(String(l)) : a = o.fromFormat(String(l), s), l = a.toFormat("HH:mm")) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), h.value = l, e(function() {
    r.getType() == "cell" && (h.focus({ preventScroll: !0 }), h.style.height = "100%", i.selectContents && h.select());
  });
  function u() {
    var c = h.value, f;
    if ((l === null || typeof l > "u") && c !== "" || c !== l) {
      if (c && s)
        switch (f = o.fromFormat(String(c), "hh:mm"), s) {
          case !0:
            c = f;
            break;
          case "iso":
            c = f.toISO();
            break;
          default:
            c = f.toFormat(s);
        }
      t(c) && (l = h.value);
    } else
      A();
  }
  return h.addEventListener("blur", function(c) {
    (c.relatedTarget || c.rangeParent || c.explicitOriginalTarget !== h) && u();
  }), h.addEventListener("keydown", function(c) {
    switch (c.keyCode) {
      case 13:
        u();
        break;
      case 27:
        A();
        break;
      case 35:
      case 36:
        c.stopPropagation();
        break;
      case 38:
      case 40:
        n == "editor" && (c.stopImmediatePropagation(), c.stopPropagation());
        break;
    }
  }), h;
}
function xl(r, e, t, A, i) {
  var s = i.format, n = i.verticalNavigation || "editor", o = s ? this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime") : null, a, l = r.getValue(), h = document.createElement("input");
  if (h.type = "datetime-local", h.style.padding = "4px", h.style.width = "100%", h.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let c in i.elementAttributes)
      c.charAt(0) == "+" ? (c = c.slice(1), h.setAttribute(c, h.getAttribute(c) + i.elementAttributes["+" + c])) : h.setAttribute(c, i.elementAttributes[c]);
  l = typeof l < "u" ? l : "", s && (o ? (o.isDateTime(l) ? a = l : s === "iso" ? a = o.fromISO(String(l)) : a = o.fromFormat(String(l), s), l = a.toFormat("yyyy-MM-dd") + "T" + a.toFormat("HH:mm")) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), h.value = l, e(function() {
    r.getType() === "cell" && (h.focus({ preventScroll: !0 }), h.style.height = "100%", i.selectContents && h.select());
  });
  function u() {
    var c = h.value, f;
    if ((l === null || typeof l > "u") && c !== "" || c !== l) {
      if (c && s)
        switch (f = o.fromISO(String(c)), s) {
          case !0:
            c = f;
            break;
          case "iso":
            c = f.toISO();
            break;
          default:
            c = f.toFormat(s);
        }
      t(c) && (l = h.value);
    } else
      A();
  }
  return h.addEventListener("blur", function(c) {
    (c.relatedTarget || c.rangeParent || c.explicitOriginalTarget !== h) && u();
  }), h.addEventListener("keydown", function(c) {
    switch (c.keyCode) {
      case 13:
        u();
        break;
      case 27:
        A();
        break;
      case 35:
      case 36:
        c.stopPropagation();
        break;
      case 38:
      case 40:
        n == "editor" && (c.stopImmediatePropagation(), c.stopPropagation());
        break;
    }
  }), h;
}
let Tl = class {
  constructor(e, t, A, i, s, n) {
    this.edit = e, this.table = e.table, this.cell = t, this.params = this._initializeParams(n), this.data = [], this.displayItems = [], this.currentItems = [], this.focusedItem = null, this.input = this._createInputElement(), this.listEl = this._createListElement(), this.initialValues = null, this.isFilter = t.getType() === "header", this.filterTimeout = null, this.filtered = !1, this.typing = !1, this.values = [], this.popup = null, this.listIteration = 0, this.lastAction = "", this.filterTerm = "", this.blurable = !0, this.actions = {
      success: i,
      cancel: s
    }, this._deprecatedOptionsCheck(), this._initializeValue(), A(this._onRendered.bind(this));
  }
  _deprecatedOptionsCheck() {
  }
  _initializeValue() {
    var e = this.cell.getValue();
    typeof e > "u" && typeof this.params.defaultValue < "u" && (e = this.params.defaultValue), this.initialValues = this.params.multiselect ? e : [e], this.isFilter && (this.input.value = this.initialValues ? this.initialValues.join(",") : "", this.headerFilterInitialListGen());
  }
  _onRendered() {
    var e = this.cell.getElement();
    function t(A) {
      A.stopPropagation();
    }
    this.isFilter || (this.input.style.height = "100%", this.input.focus({ preventScroll: !0 })), e.addEventListener("click", t), setTimeout(() => {
      e.removeEventListener("click", t);
    }, 1e3), this.input.addEventListener("mousedown", this._preventPopupBlur.bind(this));
  }
  _createListElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-edit-list"), e.addEventListener("mousedown", this._preventBlur.bind(this)), e.addEventListener("keydown", this._inputKeyDown.bind(this)), e;
  }
  _setListWidth() {
    var e = this.isFilter ? this.input : this.cell.getElement();
    this.listEl.style.minWidth = e.offsetWidth + "px", this.params.maxWidth && (this.params.maxWidth === !0 ? this.listEl.style.maxWidth = e.offsetWidth + "px" : typeof this.params.maxWidth == "number" ? this.listEl.style.maxWidth = this.params.maxWidth + "px" : this.listEl.style.maxWidth = this.params.maxWidth);
  }
  _createInputElement() {
    var e = this.params.elementAttributes, t = document.createElement("input");
    if (t.setAttribute("type", this.params.clearable ? "search" : "text"), t.style.padding = "4px", t.style.width = "100%", t.style.boxSizing = "border-box", this.params.autocomplete || (t.style.cursor = "default", t.style.caretColor = "transparent"), e && typeof e == "object")
      for (let A in e)
        A.charAt(0) == "+" ? (A = A.slice(1), t.setAttribute(A, t.getAttribute(A) + e["+" + A])) : t.setAttribute(A, e[A]);
    return this.params.mask && Si(t, this.params), this._bindInputEvents(t), t;
  }
  _initializeParams(e) {
    var t = ["values", "valuesURL", "valuesLookup"], A;
    return e = Object.assign({}, e), e.verticalNavigation = e.verticalNavigation || "editor", e.placeholderLoading = typeof e.placeholderLoading > "u" ? "Searching ..." : e.placeholderLoading, e.placeholderEmpty = typeof e.placeholderEmpty > "u" ? "No Results Found" : e.placeholderEmpty, e.filterDelay = typeof e.filterDelay > "u" ? 300 : e.filterDelay, e.emptyValue = Object.keys(e).includes("emptyValue") ? e.emptyValue : "", A = Object.keys(e).filter((i) => t.includes(i)).length, A ? A > 1 && console.warn("list editor config error - only one of the values, valuesURL, or valuesLookup options can be set on the same editor") : console.warn("list editor config error - either the values, valuesURL, or valuesLookup option must be set"), e.autocomplete ? e.multiselect && (e.multiselect = !1, console.warn("list editor config error - multiselect option is not available when autocomplete is enabled")) : (e.freetext && (e.freetext = !1, console.warn("list editor config error - freetext option is only available when autocomplete is enabled")), e.filterFunc && (e.filterFunc = !1, console.warn("list editor config error - filterFunc option is only available when autocomplete is enabled")), e.filterRemote && (e.filterRemote = !1, console.warn("list editor config error - filterRemote option is only available when autocomplete is enabled")), e.mask && (e.mask = !1, console.warn("list editor config error - mask option is only available when autocomplete is enabled")), e.allowEmpty && (e.allowEmpty = !1, console.warn("list editor config error - allowEmpty option is only available when autocomplete is enabled")), e.listOnEmpty && (e.listOnEmpty = !1, console.warn("list editor config error - listOnEmpty option is only available when autocomplete is enabled"))), e.filterRemote && !(typeof e.valuesLookup == "function" || e.valuesURL) && (e.filterRemote = !1, console.warn("list editor config error - filterRemote option should only be used when values list is populated from a remote source")), e;
  }
  //////////////////////////////////////
  ////////// Event Handling ////////////
  //////////////////////////////////////
  _bindInputEvents(e) {
    e.addEventListener("focus", this._inputFocus.bind(this)), e.addEventListener("click", this._inputClick.bind(this)), e.addEventListener("blur", this._inputBlur.bind(this)), e.addEventListener("keydown", this._inputKeyDown.bind(this)), e.addEventListener("search", this._inputSearch.bind(this)), this.params.autocomplete && e.addEventListener("keyup", this._inputKeyUp.bind(this));
  }
  _inputFocus(e) {
    this.rebuildOptionsList();
  }
  _filter() {
    this.params.filterRemote ? (clearTimeout(this.filterTimeout), this.filterTimeout = setTimeout(() => {
      this.rebuildOptionsList();
    }, this.params.filterDelay)) : this._filterList();
  }
  _inputClick(e) {
    e.stopPropagation();
  }
  _inputBlur(e) {
    this.blurable && (this.popup ? this.popup.hide() : this._resolveValue(!0));
  }
  _inputSearch() {
    this._clearChoices();
  }
  _inputKeyDown(e) {
    switch (e.keyCode) {
      case 38:
        this._keyUp(e);
        break;
      case 40:
        this._keyDown(e);
        break;
      case 37:
      case 39:
        this._keySide(e);
        break;
      case 13:
        this._keyEnter();
        break;
      case 27:
        this._keyEsc();
        break;
      case 36:
      case 35:
        this._keyHomeEnd(e);
        break;
      case 9:
        this._keyTab(e);
        break;
      default:
        this._keySelectLetter(e);
    }
  }
  _inputKeyUp(e) {
    switch (e.keyCode) {
      case 38:
      case 37:
      case 39:
      case 40:
      case 13:
      case 27:
        break;
      default:
        this._keyAutoCompLetter(e);
    }
  }
  _preventPopupBlur() {
    this.popup && this.popup.blockHide(), setTimeout(() => {
      this.popup && this.popup.restoreHide();
    }, 10);
  }
  _preventBlur() {
    this.blurable = !1, setTimeout(() => {
      this.blurable = !0;
    }, 10);
  }
  //////////////////////////////////////
  //////// Keyboard Navigation /////////
  //////////////////////////////////////
  _keyTab(e) {
    this.params.autocomplete && this.lastAction === "typing" ? this._resolveValue(!0) : this.focusedItem && this._chooseItem(this.focusedItem, !0);
  }
  _keyUp(e) {
    var t = this.displayItems.indexOf(this.focusedItem);
    (this.params.verticalNavigation == "editor" || this.params.verticalNavigation == "hybrid" && t) && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault(), t > 0 && this._focusItem(this.displayItems[t - 1]));
  }
  _keyDown(e) {
    var t = this.displayItems.indexOf(this.focusedItem);
    (this.params.verticalNavigation == "editor" || this.params.verticalNavigation == "hybrid" && t < this.displayItems.length - 1) && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault(), t < this.displayItems.length - 1 && (t == -1 ? this._focusItem(this.displayItems[0]) : this._focusItem(this.displayItems[t + 1])));
  }
  _keySide(e) {
    this.params.autocomplete || (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault());
  }
  _keyEnter(e) {
    this.params.autocomplete && this.lastAction === "typing" ? this._resolveValue(!0) : this.focusedItem && this._chooseItem(this.focusedItem);
  }
  _keyEsc(e) {
    this._cancel();
  }
  _keyHomeEnd(e) {
    this.params.autocomplete && e.stopImmediatePropagation();
  }
  _keySelectLetter(e) {
    this.params.autocomplete || (e.preventDefault(), e.keyCode >= 38 && e.keyCode <= 90 && this._scrollToValue(e.keyCode));
  }
  _keyAutoCompLetter(e) {
    this._filter(), this.lastAction = "typing", this.typing = !0;
  }
  _scrollToValue(e) {
    clearTimeout(this.filterTimeout);
    var t = String.fromCharCode(e).toLowerCase();
    this.filterTerm += t.toLowerCase();
    var A = this.displayItems.find((i) => typeof i.label < "u" && i.label.toLowerCase().startsWith(this.filterTerm));
    A && this._focusItem(A), this.filterTimeout = setTimeout(() => {
      this.filterTerm = "";
    }, 800);
  }
  _focusItem(e) {
    this.lastAction = "focus", this.focusedItem && this.focusedItem.element && this.focusedItem.element.classList.remove("focused"), this.focusedItem = e, e && e.element && (e.element.classList.add("focused"), e.element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }));
  }
  //////////////////////////////////////
  /////// Data List Generation /////////
  //////////////////////////////////////
  headerFilterInitialListGen() {
    this._generateOptions(!0);
  }
  rebuildOptionsList() {
    this._generateOptions().then(this._sortOptions.bind(this)).then(this._buildList.bind(this)).then(this._showList.bind(this)).catch((e) => {
      Number.isInteger(e) || console.error("List generation error", e);
    });
  }
  _filterList() {
    this._buildList(this._filterOptions()), this._showList();
  }
  _generateOptions(e) {
    var t = [], A = ++this.listIteration;
    return this.filtered = !1, this.params.values ? t = this.params.values : this.params.valuesURL ? t = this._ajaxRequest(this.params.valuesURL, this.input.value) : typeof this.params.valuesLookup == "function" ? t = this.params.valuesLookup(this.cell, this.input.value) : this.params.valuesLookup && (t = this._uniqueColumnValues(this.params.valuesLookupField)), t instanceof Promise ? (e || this._addPlaceholder(this.params.placeholderLoading), t.then().then((i) => this.listIteration === A ? this._parseList(i) : Promise.reject(A))) : Promise.resolve(this._parseList(t));
  }
  _addPlaceholder(e) {
    var t = document.createElement("div");
    typeof e == "function" && (e = e(this.cell.getComponent(), this.listEl)), e && (this._clearList(), e instanceof HTMLElement ? t = e : (t.classList.add("tabulator-edit-list-placeholder"), t.innerHTML = e), this.listEl.appendChild(t), this._showList());
  }
  _ajaxRequest(e, t) {
    var A = this.params.filterRemote ? { term: t } : {};
    return e = Jn(e, {}, A), fetch(e).then((i) => i.ok ? i.json().catch((s) => (console.warn("List Ajax Load Error - Invalid JSON returned", s), Promise.reject(s))) : (console.error("List Ajax Load Error - Connection Error: " + i.status, i.statusText), Promise.reject(i))).catch((i) => (console.error("List Ajax Load Error - Connection Error: ", i), Promise.reject(i)));
  }
  _uniqueColumnValues(e) {
    var t = {}, A = this.table.getData(this.params.valuesLookup), i;
    return e ? i = this.table.columnManager.getColumnByField(e) : i = this.cell.getColumn()._getSelf(), i ? A.forEach((s) => {
      var n = i.getFieldValue(s);
      this._emptyValueCheck(n) || (this.params.multiselect && Array.isArray(n) ? n.forEach((o) => {
        this._emptyValueCheck(o) || (t[o] = !0);
      }) : t[n] = !0);
    }) : (console.warn("unable to find matching column to create select lookup list:", e), t = []), Object.keys(t);
  }
  _emptyValueCheck(e) {
    return e === null || typeof e > "u" || e === "";
  }
  _parseList(e) {
    var t = [];
    return Array.isArray(e) || (e = Object.entries(e).map(([A, i]) => ({
      label: i,
      value: A
    }))), e.forEach((A) => {
      typeof A != "object" && (A = {
        label: A,
        value: A
      }), this._parseListItem(A, t, 0);
    }), !this.currentItems.length && this.params.freetext && (this.input.value = this.initialValues, this.typing = !0, this.lastAction = "typing"), this.data = t, t;
  }
  _parseListItem(e, t, A) {
    var i = {};
    e.options ? i = this._parseListGroup(e, A + 1) : (i = {
      label: e.label,
      value: e.value,
      itemParams: e.itemParams,
      elementAttributes: e.elementAttributes,
      element: !1,
      selected: !1,
      visible: !0,
      level: A,
      original: e
    }, this.initialValues && this.initialValues.indexOf(e.value) > -1 && this._chooseItem(i, !0)), t.push(i);
  }
  _parseListGroup(e, t) {
    var A = {
      label: e.label,
      group: !0,
      itemParams: e.itemParams,
      elementAttributes: e.elementAttributes,
      element: !1,
      visible: !0,
      level: t,
      options: [],
      original: e
    };
    return e.options.forEach((i) => {
      this._parseListItem(i, A.options, t);
    }), A;
  }
  _sortOptions(e) {
    var t;
    return this.params.sort && (t = typeof this.params.sort == "function" ? this.params.sort : this._defaultSortFunction.bind(this), this._sortGroup(t, e)), e;
  }
  _sortGroup(e, t) {
    t.sort((A, i) => e(A.label, i.label, A.value, i.value, A.original, i.original)), t.forEach((A) => {
      A.group && this._sortGroup(e, A.options);
    });
  }
  _defaultSortFunction(e, t) {
    var A, i, s, n, o = 0, a, l = /(\d+)|(\D+)/g, h = /\d/, u = 0;
    if (this.params.sort === "desc" && ([e, t] = [t, e]), !e && e !== 0)
      u = !t && t !== 0 ? 0 : -1;
    else if (!t && t !== 0)
      u = 1;
    else {
      if (isFinite(e) && isFinite(t)) return e - t;
      if (A = String(e).toLowerCase(), i = String(t).toLowerCase(), A === i) return 0;
      if (!(h.test(A) && h.test(i))) return A > i ? 1 : -1;
      for (A = A.match(l), i = i.match(l), a = A.length > i.length ? i.length : A.length; o < a; )
        if (s = A[o], n = i[o++], s !== n)
          return isFinite(s) && isFinite(n) ? (s.charAt(0) === "0" && (s = "." + s), n.charAt(0) === "0" && (n = "." + n), s - n) : s > n ? 1 : -1;
      return A.length > i.length;
    }
    return u;
  }
  _filterOptions() {
    var e = this.params.filterFunc || this._defaultFilterFunc, t = this.input.value;
    return t ? (this.filtered = !0, this.data.forEach((A) => {
      this._filterItem(e, t, A);
    })) : this.filtered = !1, this.data;
  }
  _filterItem(e, t, A) {
    var i = !1;
    return A.group ? (A.options.forEach((s) => {
      this._filterItem(e, t, s) && (i = !0);
    }), A.visible = i) : A.visible = e(t, A.label, A.value, A.original), A.visible;
  }
  _defaultFilterFunc(e, t, A, i) {
    return e = String(e).toLowerCase(), t !== null && typeof t < "u" && (String(t).toLowerCase().indexOf(e) > -1 || String(A).toLowerCase().indexOf(e) > -1);
  }
  //////////////////////////////////////
  /////////// Display List /////////////
  //////////////////////////////////////
  _clearList() {
    for (; this.listEl.firstChild; ) this.listEl.removeChild(this.listEl.firstChild);
    this.displayItems = [];
  }
  _buildList(e) {
    this._clearList(), e.forEach((t) => {
      this._buildItem(t);
    }), this.displayItems.length || this._addPlaceholder(this.params.placeholderEmpty);
  }
  _buildItem(e) {
    var t = e.element, A;
    if (!this.filtered || e.visible) {
      if (!t) {
        if (t = document.createElement("div"), t.tabIndex = 0, A = this.params.itemFormatter ? this.params.itemFormatter(e.label, e.value, e.original, t) : e.label, A instanceof HTMLElement ? t.appendChild(A) : t.innerHTML = A, e.group ? t.classList.add("tabulator-edit-list-group") : t.classList.add("tabulator-edit-list-item"), t.classList.add("tabulator-edit-list-group-level-" + e.level), e.elementAttributes && typeof e.elementAttributes == "object")
          for (let i in e.elementAttributes)
            i.charAt(0) == "+" ? (i = i.slice(1), t.setAttribute(i, this.input.getAttribute(i) + e.elementAttributes["+" + i])) : t.setAttribute(i, e.elementAttributes[i]);
        e.group ? t.addEventListener("click", this._groupClick.bind(this, e)) : t.addEventListener("click", this._itemClick.bind(this, e)), t.addEventListener("mousedown", this._preventBlur.bind(this)), e.element = t;
      }
      this._styleItem(e), this.listEl.appendChild(t), e.group ? e.options.forEach((i) => {
        this._buildItem(i);
      }) : this.displayItems.push(e);
    }
  }
  _showList() {
    var e = this.popup && this.popup.isVisible();
    if (this.input.parentNode) {
      if (this.params.autocomplete && this.input.value === "" && !this.params.listOnEmpty) {
        this.popup && this.popup.hide(!0);
        return;
      }
      this._setListWidth(), this.popup || (this.popup = this.edit.popup(this.listEl)), this.popup.show(this.cell.getElement(), "bottom"), e || setTimeout(() => {
        this.popup.hideOnBlur(this._resolveValue.bind(this, !0));
      }, 10);
    }
  }
  _styleItem(e) {
    e && e.element && (e.selected ? e.element.classList.add("active") : e.element.classList.remove("active"));
  }
  //////////////////////////////////////
  ///////// User Interaction ///////////
  //////////////////////////////////////
  _itemClick(e, t) {
    t.stopPropagation(), this._chooseItem(e);
  }
  _groupClick(e, t) {
    t.stopPropagation();
  }
  //////////////////////////////////////
  ////// Current Item Management ///////
  //////////////////////////////////////
  _cancel() {
    this.popup.hide(!0), this.actions.cancel();
  }
  _clearChoices() {
    this.typing = !0, this.currentItems.forEach((e) => {
      e.selected = !1, this._styleItem(e);
    }), this.currentItems = [], this.focusedItem = null;
  }
  _chooseItem(e, t) {
    var A;
    this.typing = !1, this.params.multiselect ? (A = this.currentItems.indexOf(e), A > -1 ? (this.currentItems.splice(A, 1), e.selected = !1) : (this.currentItems.push(e), e.selected = !0), this.input.value = this.currentItems.map((i) => i.label).join(","), this._styleItem(e)) : (this.currentItems = [e], e.selected = !0, this.input.value = e.label, this._styleItem(e), t || this._resolveValue()), this._focusItem(e);
  }
  _resolveValue(e) {
    var t, A;
    if (this.popup && this.popup.hide(!0), this.params.multiselect)
      t = this.currentItems.map((i) => i.value);
    else if (e && this.params.autocomplete && this.typing)
      if (this.params.freetext || this.params.allowEmpty && this.input.value === "")
        t = this.input.value;
      else {
        this.actions.cancel();
        return;
      }
    else
      this.currentItems[0] ? t = this.currentItems[0].value : (A = Array.isArray(this.initialValues) ? this.initialValues[0] : this.initialValues, A === null || typeof A > "u" || A === "" ? t = A : t = this.params.emptyValue);
    t === "" && (t = this.params.emptyValue), this.actions.success(t), this.isFilter && (this.initialValues = t && !Array.isArray(t) ? [t] : t, this.currentItems = []);
  }
};
function Ll(r, e, t, A, i) {
  var s = new Tl(this, r, e, t, A, i);
  return s.input;
}
function Il(r, e, t, A, i) {
  var s = this, n = r.getElement(), o = r.getValue(), a = n.getElementsByTagName("svg").length || 5, l = n.getElementsByTagName("svg")[0] ? n.getElementsByTagName("svg")[0].getAttribute("width") : 14, h = [], u = document.createElement("div"), c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  function f(B) {
    h.forEach(function(y, D) {
      D < B ? (s.table.browser == "ie" ? y.setAttribute("class", "tabulator-star-active") : y.classList.replace("tabulator-star-inactive", "tabulator-star-active"), y.innerHTML = '<polygon fill="#488CE9" stroke="#014AAE" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>') : (s.table.browser == "ie" ? y.setAttribute("class", "tabulator-star-inactive") : y.classList.replace("tabulator-star-active", "tabulator-star-inactive"), y.innerHTML = '<polygon fill="#010155" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>');
    });
  }
  function w(B) {
    var y = document.createElement("span"), D = c.cloneNode(!0);
    h.push(D), y.addEventListener("mouseenter", function(L) {
      L.stopPropagation(), L.stopImmediatePropagation(), f(B);
    }), y.addEventListener("mousemove", function(L) {
      L.stopPropagation(), L.stopImmediatePropagation();
    }), y.addEventListener("click", function(L) {
      L.stopPropagation(), L.stopImmediatePropagation(), t(B), n.blur();
    }), y.appendChild(D), u.appendChild(y);
  }
  function b(B) {
    o = B, f(B);
  }
  if (n.style.whiteSpace = "nowrap", n.style.overflow = "hidden", n.style.textOverflow = "ellipsis", u.style.verticalAlign = "middle", u.style.display = "inline-block", u.style.padding = "4px", c.setAttribute("width", l), c.setAttribute("height", l), c.setAttribute("viewBox", "0 0 512 512"), c.setAttribute("xml:space", "preserve"), c.style.padding = "0 1px", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let B in i.elementAttributes)
      B.charAt(0) == "+" ? (B = B.slice(1), u.setAttribute(B, u.getAttribute(B) + i.elementAttributes["+" + B])) : u.setAttribute(B, i.elementAttributes[B]);
  for (var v = 1; v <= a; v++)
    w(v);
  return o = Math.min(parseInt(o), a), f(o), u.addEventListener("mousemove", function(B) {
    f(0);
  }), u.addEventListener("click", function(B) {
    t(0);
  }), n.addEventListener("blur", function(B) {
    A();
  }), n.addEventListener("keydown", function(B) {
    switch (B.keyCode) {
      case 39:
        b(o + 1);
        break;
      case 37:
        b(o - 1);
        break;
      case 13:
        t(o);
        break;
      case 27:
        A();
        break;
    }
  }), u;
}
function Ml(r, e, t, A, i) {
  var s = r.getElement(), n = typeof i.max > "u" ? s.getElementsByTagName("div")[0] && s.getElementsByTagName("div")[0].getAttribute("max") || 100 : i.max, o = typeof i.min > "u" ? s.getElementsByTagName("div")[0] && s.getElementsByTagName("div")[0].getAttribute("min") || 0 : i.min, a = (n - o) / 100, l = r.getValue() || 0, h = document.createElement("div"), u = document.createElement("div"), c, f;
  function w() {
    var b = window.getComputedStyle(s, null), v = a * Math.round(u.offsetWidth / ((s.clientWidth - parseInt(b.getPropertyValue("padding-left")) - parseInt(b.getPropertyValue("padding-right"))) / 100)) + o;
    t(v), s.setAttribute("aria-valuenow", v), s.setAttribute("aria-label", l);
  }
  if (h.style.position = "absolute", h.style.right = "0", h.style.top = "0", h.style.bottom = "0", h.style.width = "5px", h.classList.add("tabulator-progress-handle"), u.style.display = "inline-block", u.style.position = "relative", u.style.height = "100%", u.style.backgroundColor = "#488CE9", u.style.maxWidth = "100%", u.style.minWidth = "0%", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let b in i.elementAttributes)
      b.charAt(0) == "+" ? (b = b.slice(1), u.setAttribute(b, u.getAttribute(b) + i.elementAttributes["+" + b])) : u.setAttribute(b, i.elementAttributes[b]);
  return s.style.padding = "4px 4px", l = Math.min(parseFloat(l), n), l = Math.max(parseFloat(l), o), l = Math.round((l - o) / a), u.style.width = l + "%", s.setAttribute("aria-valuemin", o), s.setAttribute("aria-valuemax", n), u.appendChild(h), h.addEventListener("mousedown", function(b) {
    c = b.screenX, f = u.offsetWidth;
  }), h.addEventListener("mouseover", function() {
    h.style.cursor = "ew-resize";
  }), s.addEventListener("mousemove", function(b) {
    c && (u.style.width = f + b.screenX - c + "px");
  }), s.addEventListener("mouseup", function(b) {
    c && (b.stopPropagation(), b.stopImmediatePropagation(), c = !1, f = !1, w());
  }), s.addEventListener("keydown", function(b) {
    switch (b.keyCode) {
      case 39:
        b.preventDefault(), u.style.width = u.clientWidth + s.clientWidth / 100 + "px";
        break;
      case 37:
        b.preventDefault(), u.style.width = u.clientWidth - s.clientWidth / 100 + "px";
        break;
      case 9:
      case 13:
        w();
        break;
      case 27:
        A();
        break;
    }
  }), s.addEventListener("blur", function() {
    A();
  }), u;
}
function Dl(r, e, t, A, i) {
  var s = r.getValue(), n = document.createElement("input"), o = i.tristate, a = typeof i.indeterminateValue > "u" ? null : i.indeterminateValue, l = !1, h = Object.keys(i).includes("trueValue"), u = Object.keys(i).includes("falseValue");
  if (n.setAttribute("type", "checkbox"), n.style.marginTop = "5px", n.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let f in i.elementAttributes)
      f.charAt(0) == "+" ? (f = f.slice(1), n.setAttribute(f, n.getAttribute(f) + i.elementAttributes["+" + f])) : n.setAttribute(f, i.elementAttributes[f]);
  n.value = s, o && (typeof s > "u" || s === a || s === "") && (l = !0, n.indeterminate = !0), this.table.browser != "firefox" && this.table.browser != "safari" && e(function() {
    r.getType() === "cell" && n.focus({ preventScroll: !0 });
  }), n.checked = h ? s === i.trueValue : s === !0 || s === "true" || s === "True" || s === 1;
  function c(f) {
    var w = n.checked;
    return h && w ? w = i.trueValue : u && !w && (w = i.falseValue), o ? f ? l ? a : w : n.checked && !l ? (n.checked = !1, n.indeterminate = !0, l = !0, a) : (l = !1, w) : w;
  }
  return n.addEventListener("change", function(f) {
    t(c());
  }), n.addEventListener("blur", function(f) {
    t(c(!0));
  }), n.addEventListener("keydown", function(f) {
    f.keyCode == 13 && t(c()), f.keyCode == 27 && A();
  }), n;
}
function Sl(r, e, t, A, i) {
  var s = r._getSelf().column, n, o, a;
  function l(h) {
    var u = h.getValue(), c = "input";
    switch (typeof u) {
      case "number":
        c = "number";
        break;
      case "boolean":
        c = "tickCross";
        break;
      case "string":
        u.includes(`
`) && (c = "textarea");
        break;
    }
    return c;
  }
  return n = i.editorLookup ? i.editorLookup(r) : l(r), i.paramsLookup && (a = typeof i.paramsLookup == "function" ? i.paramsLookup(n, r) : i.paramsLookup[n]), o = this.table.modules.edit.lookupEditor(n, s), o.call(this, r, e, t, A, a || {});
}
var kl = {
  input: yl,
  textarea: Fl,
  number: Ql,
  range: Ul,
  date: Hl,
  time: Rl,
  datetime: xl,
  list: Ll,
  star: Il,
  progress: Ml,
  tickCross: Dl,
  adaptable: Sl
};
const TA = class TA extends Y {
  constructor(e) {
    super(e), this.currentCell = !1, this.mouseClick = !1, this.recursionBlock = !1, this.invalidEdit = !1, this.editedCells = [], this.convertEmptyValues = !1, this.editors = TA.editors, this.registerTableOption("editTriggerEvent", "focus"), this.registerTableOption("editorEmptyValue"), this.registerTableOption("editorEmptyValueFunc", this.emptyValueCheck.bind(this)), this.registerColumnOption("editable"), this.registerColumnOption("editor"), this.registerColumnOption("editorParams"), this.registerColumnOption("editorEmptyValue"), this.registerColumnOption("editorEmptyValueFunc"), this.registerColumnOption("cellEditing"), this.registerColumnOption("cellEdited"), this.registerColumnOption("cellEditCancelled"), this.registerTableFunction("getEditedCells", this.getEditedCells.bind(this)), this.registerTableFunction("clearCellEdited", this.clearCellEdited.bind(this)), this.registerTableFunction("navigatePrev", this.navigatePrev.bind(this)), this.registerTableFunction("navigateNext", this.navigateNext.bind(this)), this.registerTableFunction("navigateLeft", this.navigateLeft.bind(this)), this.registerTableFunction("navigateRight", this.navigateRight.bind(this)), this.registerTableFunction("navigateUp", this.navigateUp.bind(this)), this.registerTableFunction("navigateDown", this.navigateDown.bind(this)), this.registerComponentFunction("cell", "isEdited", this.cellIsEdited.bind(this)), this.registerComponentFunction("cell", "clearEdited", this.clearEdited.bind(this)), this.registerComponentFunction("cell", "edit", this.editCell.bind(this)), this.registerComponentFunction("cell", "cancelEdit", this.cellCancelEdit.bind(this)), this.registerComponentFunction("cell", "navigatePrev", this.navigatePrev.bind(this)), this.registerComponentFunction("cell", "navigateNext", this.navigateNext.bind(this)), this.registerComponentFunction("cell", "navigateLeft", this.navigateLeft.bind(this)), this.registerComponentFunction("cell", "navigateRight", this.navigateRight.bind(this)), this.registerComponentFunction("cell", "navigateUp", this.navigateUp.bind(this)), this.registerComponentFunction("cell", "navigateDown", this.navigateDown.bind(this));
  }
  initialize() {
    this.subscribe("cell-init", this.bindEditor.bind(this)), this.subscribe("cell-delete", this.clearEdited.bind(this)), this.subscribe("cell-value-changed", this.updateCellClass.bind(this)), this.subscribe("column-layout", this.initializeColumnCheck.bind(this)), this.subscribe("column-delete", this.columnDeleteCheck.bind(this)), this.subscribe("row-deleting", this.rowDeleteCheck.bind(this)), this.subscribe("row-layout", this.rowEditableCheck.bind(this)), this.subscribe("data-refreshing", this.cancelEdit.bind(this)), this.subscribe("clipboard-paste", this.pasteBlocker.bind(this)), this.subscribe("keybinding-nav-prev", this.navigatePrev.bind(this, void 0)), this.subscribe("keybinding-nav-next", this.keybindingNavigateNext.bind(this)), this.subscribe("keybinding-nav-up", this.navigateUp.bind(this, void 0)), this.subscribe("keybinding-nav-down", this.navigateDown.bind(this, void 0)), Object.keys(this.table.options).includes("editorEmptyValue") && (this.convertEmptyValues = !0);
  }
  ///////////////////////////////////
  ///////// Paste Negation //////////
  ///////////////////////////////////
  pasteBlocker(e) {
    if (this.currentCell)
      return !0;
  }
  ///////////////////////////////////
  ////// Keybinding Functions ///////
  ///////////////////////////////////
  keybindingNavigateNext(e) {
    var t = this.currentCell, A = this.options("tabEndNewRow");
    t && (this.navigateNext(t, e) || A && (t.getElement().firstChild.blur(), this.invalidEdit || (A === !0 ? A = this.table.addRow({}) : typeof A == "function" ? A = this.table.addRow(A(t.row.getComponent())) : A = this.table.addRow(Object.assign({}, A)), A.then(() => {
      setTimeout(() => {
        t.getComponent().navigateNext();
      });
    }))));
  }
  ///////////////////////////////////
  ///////// Cell Functions //////////
  ///////////////////////////////////
  cellIsEdited(e) {
    return !!e.modules.edit && e.modules.edit.edited;
  }
  cellCancelEdit(e) {
    e === this.currentCell ? this.table.modules.edit.cancelEdit() : console.warn("Cancel Editor Error - This cell is not currently being edited ");
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  updateCellClass(e) {
    this.allowEdit(e) ? e.getElement().classList.add("tabulator-editable") : e.getElement().classList.remove("tabulator-editable");
  }
  clearCellEdited(e) {
    e || (e = this.table.modules.edit.getEditedCells()), Array.isArray(e) || (e = [e]), e.forEach((t) => {
      this.table.modules.edit.clearEdited(t._getSelf());
    });
  }
  navigatePrev(e = this.currentCell, t) {
    var A, i;
    if (e) {
      if (t && t.preventDefault(), A = this.navigateLeft(), A)
        return !0;
      if (i = this.table.rowManager.prevDisplayRow(e.row, !0), i && (A = this.findPrevEditableCell(i, i.cells.length), A))
        return A.getComponent().edit(), !0;
    }
    return !1;
  }
  navigateNext(e = this.currentCell, t) {
    var A, i;
    if (e) {
      if (t && t.preventDefault(), A = this.navigateRight(), A)
        return !0;
      if (i = this.table.rowManager.nextDisplayRow(e.row, !0), i && (A = this.findNextEditableCell(i, -1), A))
        return A.getComponent().edit(), !0;
    }
    return !1;
  }
  navigateLeft(e = this.currentCell, t) {
    var A, i;
    return e && (t && t.preventDefault(), A = e.getIndex(), i = this.findPrevEditableCell(e.row, A), i) ? (i.getComponent().edit(), !0) : !1;
  }
  navigateRight(e = this.currentCell, t) {
    var A, i;
    return e && (t && t.preventDefault(), A = e.getIndex(), i = this.findNextEditableCell(e.row, A), i) ? (i.getComponent().edit(), !0) : !1;
  }
  navigateUp(e = this.currentCell, t) {
    var A, i;
    return e && (t && t.preventDefault(), A = e.getIndex(), i = this.table.rowManager.prevDisplayRow(e.row, !0), i) ? (i.cells[A].getComponent().edit(), !0) : !1;
  }
  navigateDown(e = this.currentCell, t) {
    var A, i;
    return e && (t && t.preventDefault(), A = e.getIndex(), i = this.table.rowManager.nextDisplayRow(e.row, !0), i) ? (i.cells[A].getComponent().edit(), !0) : !1;
  }
  findNextEditableCell(e, t) {
    var A = !1;
    if (t < e.cells.length - 1)
      for (var i = t + 1; i < e.cells.length; i++) {
        let s = e.cells[i];
        if (s.column.modules.edit && ie.elVisible(s.getElement()) && this.allowEdit(s)) {
          A = s;
          break;
        }
      }
    return A;
  }
  findPrevEditableCell(e, t) {
    var A = !1;
    if (t > 0)
      for (var i = t - 1; i >= 0; i--) {
        let s = e.cells[i];
        if (s.column.modules.edit && ie.elVisible(s.getElement()) && this.allowEdit(s)) {
          A = s;
          break;
        }
      }
    return A;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  initializeColumnCheck(e) {
    typeof e.definition.editor < "u" && this.initializeColumn(e);
  }
  columnDeleteCheck(e) {
    this.currentCell && this.currentCell.column === e && this.cancelEdit();
  }
  rowDeleteCheck(e) {
    this.currentCell && this.currentCell.row === e && this.cancelEdit();
  }
  rowEditableCheck(e) {
    e.getCells().forEach((t) => {
      t.column.modules.edit && typeof t.column.modules.edit.check == "function" && this.updateCellClass(t);
    });
  }
  //initialize column editor
  initializeColumn(e) {
    var t = Object.keys(e.definition).includes("editorEmptyValue"), A = {
      editor: !1,
      blocked: !1,
      check: e.definition.editable,
      params: e.definition.editorParams || {},
      convertEmptyValues: t,
      editorEmptyValue: e.definition.editorEmptyValue,
      editorEmptyValueFunc: e.definition.editorEmptyValueFunc
    };
    A.editor = this.lookupEditor(e.definition.editor, e), A.editor && (e.modules.edit = A);
  }
  lookupEditor(e, t) {
    var A;
    switch (typeof e) {
      case "string":
        this.editors[e] ? A = this.editors[e] : console.warn("Editor Error - No such editor found: ", e);
        break;
      case "function":
        A = e;
        break;
      case "boolean":
        e === !0 && (typeof t.definition.formatter != "function" ? this.editors[t.definition.formatter] ? A = this.editors[t.definition.formatter] : A = this.editors.input : console.warn("Editor Error - Cannot auto lookup editor for a custom formatter: ", t.definition.formatter));
        break;
    }
    return A;
  }
  getCurrentCell() {
    return this.currentCell ? this.currentCell.getComponent() : !1;
  }
  clearEditor(e) {
    var t = this.currentCell, A;
    if (this.invalidEdit = !1, t) {
      for (this.currentCell = !1, A = t.getElement(), this.dispatch("edit-editor-clear", t, e), A.classList.remove("tabulator-editing"); A.firstChild; ) A.removeChild(A.firstChild);
      t.row.getElement().classList.remove("tabulator-editing"), t.table.element.classList.remove("tabulator-editing");
    }
  }
  cancelEdit() {
    if (this.currentCell) {
      var e = this.currentCell, t = this.currentCell.getComponent();
      this.clearEditor(!0), e.setValueActual(e.getValue()), e.cellRendered(), (e.column.definition.editor == "textarea" || e.column.definition.variableHeight) && e.row.normalizeHeight(!0), e.column.definition.cellEditCancelled && e.column.definition.cellEditCancelled.call(this.table, t), this.dispatch("edit-cancelled", e), this.dispatchExternal("cellEditCancelled", t);
    }
  }
  //return a formatted value for a cell
  bindEditor(e) {
    if (e.column.modules.edit) {
      var t = this, A = e.getElement(!0);
      this.updateCellClass(e), A.setAttribute("tabindex", 0), A.addEventListener("mousedown", function(i) {
        i.button === 2 ? i.preventDefault() : t.mouseClick = !0;
      }), this.options("editTriggerEvent") === "dblclick" && A.addEventListener("dblclick", function(i) {
        A.classList.contains("tabulator-editing") || (A.focus({ preventScroll: !0 }), t.edit(e, i, !1));
      }), (this.options("editTriggerEvent") === "focus" || this.options("editTriggerEvent") === "click") && A.addEventListener("click", function(i) {
        A.classList.contains("tabulator-editing") || (A.focus({ preventScroll: !0 }), t.edit(e, i, !1));
      }), this.options("editTriggerEvent") === "focus" && A.addEventListener("focus", function(i) {
        t.recursionBlock || t.edit(e, i, !1);
      });
    }
  }
  focusCellNoEvent(e, t) {
    this.recursionBlock = !0, t && this.table.browser === "ie" || e.getElement().focus({ preventScroll: !0 }), this.recursionBlock = !1;
  }
  editCell(e, t) {
    this.focusCellNoEvent(e), this.edit(e, !1, t);
  }
  focusScrollAdjust(e) {
    if (this.table.rowManager.getRenderMode() == "virtual") {
      var t = this.table.rowManager.element.scrollTop, A = this.table.rowManager.element.clientHeight + this.table.rowManager.element.scrollTop, i = e.row.getElement();
      i.offsetTop < t ? this.table.rowManager.element.scrollTop -= t - i.offsetTop : i.offsetTop + i.offsetHeight > A && (this.table.rowManager.element.scrollTop += i.offsetTop + i.offsetHeight - A);
      var s = this.table.rowManager.element.scrollLeft, n = this.table.rowManager.element.clientWidth + this.table.rowManager.element.scrollLeft, o = e.getElement();
      this.table.modExists("frozenColumns") && (s += parseInt(this.table.modules.frozenColumns.leftMargin || 0), n -= parseInt(this.table.modules.frozenColumns.rightMargin || 0)), this.table.options.renderHorizontal === "virtual" && (s -= parseInt(this.table.columnManager.renderer.vDomPadLeft), n -= parseInt(this.table.columnManager.renderer.vDomPadLeft)), o.offsetLeft < s ? this.table.rowManager.element.scrollLeft -= s - o.offsetLeft : o.offsetLeft + o.offsetWidth > n && (this.table.rowManager.element.scrollLeft += o.offsetLeft + o.offsetWidth - n);
    }
  }
  allowEdit(e) {
    var t = !!e.column.modules.edit;
    if (e.column.modules.edit)
      switch (typeof e.column.modules.edit.check) {
        case "function":
          e.row.initialized && (t = e.column.modules.edit.check(e.getComponent()));
          break;
        case "string":
          t = !!e.row.data[e.column.modules.edit.check];
          break;
        case "boolean":
          t = e.column.modules.edit.check;
          break;
      }
    return t;
  }
  edit(e, t, A) {
    var i = this, s = !0, n = function() {
    }, o = e.getElement(), a = !1, l, h, u;
    if (this.currentCell) {
      !this.invalidEdit && this.currentCell !== e && this.cancelEdit();
      return;
    }
    function c(B) {
      if (i.currentCell === e && !a) {
        var y = i.chain("edit-success", [e, B], !0, !0);
        return y === !0 || i.table.options.validationMode === "highlight" ? (a = !0, i.clearEditor(), e.modules.edit || (e.modules.edit = {}), e.modules.edit.edited = !0, i.editedCells.indexOf(e) == -1 && i.editedCells.push(e), B = i.transformEmptyValues(B, e), e.setValue(B, !0), y === !0) : (a = !0, i.invalidEdit = !0, i.focusCellNoEvent(e, !0), n(), setTimeout(() => {
          a = !1;
        }, 10), !1);
      }
    }
    function f() {
      i.currentCell === e && !a && i.cancelEdit();
    }
    function w(B) {
      n = B;
    }
    if (e.column.modules.edit.blocked)
      return this.mouseClick = !1, this.blur(o), !1;
    if (t && t.stopPropagation(), s = this.allowEdit(e), s || A) {
      if (i.cancelEdit(), i.currentCell = e, this.focusScrollAdjust(e), h = e.getComponent(), this.mouseClick && (this.mouseClick = !1, e.column.definition.cellClick && e.column.definition.cellClick.call(this.table, t, h)), e.column.definition.cellEditing && e.column.definition.cellEditing.call(this.table, h), this.dispatch("cell-editing", e), this.dispatchExternal("cellEditing", h), u = typeof e.column.modules.edit.params == "function" ? e.column.modules.edit.params(h) : e.column.modules.edit.params, l = e.column.modules.edit.editor.call(i, h, w, c, f, u), this.currentCell && l !== !1)
        if (l instanceof Node) {
          for (o.classList.add("tabulator-editing"), e.row.getElement().classList.add("tabulator-editing"), e.table.element.classList.add("tabulator-editing"); o.firstChild; ) o.removeChild(o.firstChild);
          o.appendChild(l), n();
          for (var b = o.children, v = 0; v < b.length; v++)
            b[v].addEventListener("click", function(B) {
              B.stopPropagation();
            });
        } else
          return console.warn("Edit Error - Editor should return an instance of Node, the editor returned:", l), this.blur(o), !1;
      else
        return this.blur(o), !1;
      return !0;
    } else
      return this.mouseClick = !1, this.blur(o), !1;
  }
  emptyValueCheck(e) {
    return e === "" || e === null || typeof e > "u";
  }
  transformEmptyValues(e, t) {
    var A = t.column.modules.edit, i = A.convertEmptyValues || this.convertEmptyValues, s;
    return i && (s = A.editorEmptyValueFunc || this.options("editorEmptyValueFunc"), s && s(e) && (e = A.convertEmptyValues ? A.editorEmptyValue : this.options("editorEmptyValue"))), e;
  }
  blur(e) {
    this.confirm("edit-blur", [e]) || e.blur();
  }
  getEditedCells() {
    var e = [];
    return this.editedCells.forEach((t) => {
      e.push(t.getComponent());
    }), e;
  }
  clearEdited(e) {
    var t;
    e.modules.edit && e.modules.edit.edited && (e.modules.edit.edited = !1, this.dispatch("edit-edited-clear", e)), t = this.editedCells.indexOf(e), t > -1 && this.editedCells.splice(t, 1);
  }
};
U(TA, "moduleName", "edit"), //load defaults
U(TA, "editors", kl);
let ks = TA;
class zr {
  constructor(e, t, A, i) {
    this.type = e, this.columns = t, this.component = A || !1, this.indent = i || 0;
  }
}
class os {
  constructor(e, t, A, i, s) {
    this.value = e, this.component = t || !1, this.width = A, this.height = i, this.depth = s;
  }
}
var _l = {}, Ol = {
  visible: function() {
    return this.rowManager.getVisibleRows(!1, !0);
  },
  all: function() {
    return this.rowManager.rows;
  },
  selected: function() {
    return this.modules.selectRow.selectedRows;
  },
  active: function() {
    return this.options.pagination ? this.rowManager.getDisplayRows(this.rowManager.displayRows.length - 2) : this.rowManager.getDisplayRows();
  }
};
const mt = class mt extends Y {
  constructor(e) {
    super(e), this.config = {}, this.cloneTableStyle = !0, this.colVisProp = "", this.colVisPropAttach = "", this.registerTableOption("htmlOutputConfig", !1), this.registerColumnOption("htmlOutput"), this.registerColumnOption("titleHtmlOutput");
  }
  initialize() {
    this.registerTableFunction("getHtml", this.getHtml.bind(this));
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  generateExportList(e, t, A, i) {
    var s, n, o, a;
    return this.cloneTableStyle = t, this.config = e || {}, this.colVisProp = i, this.colVisPropAttach = this.colVisProp.charAt(0).toUpperCase() + this.colVisProp.slice(1), a = mt.columnLookups[A], a && (o = a.call(this.table), o = o.filter((l) => this.columnVisCheck(l))), s = this.config.columnHeaders !== !1 ? this.headersToExportRows(this.generateColumnGroupHeaders(o)) : [], o && (o = o.map((l) => l.getComponent())), n = this.bodyToExportRows(this.rowLookup(A), o), s.concat(n);
  }
  generateTable(e, t, A, i) {
    var s = this.generateExportList(e, t, A, i);
    return this.generateTableElement(s);
  }
  rowLookup(e) {
    var t = [], A;
    return typeof e == "function" ? e.call(this.table).forEach((i) => {
      i = this.table.rowManager.findRow(i), i && t.push(i);
    }) : (A = mt.rowLookups[e] || mt.rowLookups.active, t = A.call(this.table)), Object.assign([], t);
  }
  generateColumnGroupHeaders(e) {
    var t = [];
    return e || (e = this.config.columnGroups !== !1 ? this.table.columnManager.columns : this.table.columnManager.columnsByIndex), e.forEach((A) => {
      var i = this.processColumnGroup(A);
      i && t.push(i);
    }), t;
  }
  processColumnGroup(e) {
    var t = e.columns, A = 0, i = e.definition["title" + this.colVisPropAttach] || e.definition.title, s = {
      title: i,
      column: e,
      depth: 1
    };
    if (t.length) {
      if (s.subGroups = [], s.width = 0, t.forEach((n) => {
        var o = this.processColumnGroup(n);
        o && (s.width += o.width, s.subGroups.push(o), o.depth > A && (A = o.depth));
      }), s.depth += A, !s.width)
        return !1;
    } else if (this.columnVisCheck(e))
      s.width = 1;
    else
      return !1;
    return s;
  }
  columnVisCheck(e) {
    var t = e.definition[this.colVisProp];
    return this.config.rowHeaders === !1 && e.isRowHeader ? !1 : (typeof t == "function" && (t = t.call(this.table, e.getComponent())), t === !1 || t === !0 ? t : e.visible && e.field);
  }
  headersToExportRows(e) {
    var t = [], A = 0, i = [];
    function s(n, o) {
      var a = A - o;
      if (typeof t[o] > "u" && (t[o] = []), n.height = n.subGroups ? 1 : a - n.depth + 1, t[o].push(n), n.height > 1)
        for (let l = 1; l < n.height; l++)
          typeof t[o + l] > "u" && (t[o + l] = []), t[o + l].push(!1);
      if (n.width > 1)
        for (let l = 1; l < n.width; l++)
          t[o].push(!1);
      n.subGroups && n.subGroups.forEach(function(l) {
        s(l, o + 1);
      });
    }
    return e.forEach(function(n) {
      n.depth > A && (A = n.depth);
    }), e.forEach(function(n) {
      s(n, 0);
    }), t.forEach((n) => {
      var o = [];
      n.forEach((a) => {
        if (a) {
          let l = typeof a.title > "u" ? "" : a.title;
          o.push(new os(l, a.column.getComponent(), a.width, a.height, a.depth));
        } else
          o.push(null);
      }), i.push(new zr("header", o));
    }), i;
  }
  bodyToExportRows(e, t = []) {
    var A = [];
    return t.length === 0 && this.table.columnManager.columnsByIndex.forEach((i) => {
      this.columnVisCheck(i) && t.push(i.getComponent());
    }), this.config.columnCalcs !== !1 && this.table.modExists("columnCalcs") && (this.table.modules.columnCalcs.topInitialized && e.unshift(this.table.modules.columnCalcs.topRow), this.table.modules.columnCalcs.botInitialized && e.push(this.table.modules.columnCalcs.botRow)), e = e.filter((i) => {
      switch (i.type) {
        case "group":
          return this.config.rowGroups !== !1;
        case "calc":
          return this.config.columnCalcs !== !1;
        case "row":
          return !(this.table.options.dataTree && this.config.dataTree === !1 && i.modules.dataTree.parent);
      }
      return !0;
    }), e.forEach((i, s) => {
      var n = i.getData(this.colVisProp), o = [], a = 0;
      switch (i.type) {
        case "group":
          a = i.level, o.push(new os(i.key, i.getComponent(), t.length, 1));
          break;
        case "calc":
        case "row":
          t.forEach((l) => {
            o.push(new os(l._column.getFieldValue(n), l, 1, 1));
          }), this.table.options.dataTree && this.config.dataTree !== !1 && (a = i.modules.dataTree.index);
          break;
      }
      A.push(new zr(i.type, o, i.getComponent(), a));
    }), A;
  }
  generateTableElement(e) {
    var t = document.createElement("table"), A = document.createElement("thead"), i = document.createElement("tbody"), s = this.lookupTableStyles(), n = this.table.options["rowFormatter" + this.colVisPropAttach], o = {};
    return o.rowFormatter = n !== null ? n : this.table.options.rowFormatter, this.table.options.dataTree && this.config.dataTree !== !1 && this.table.modExists("columnCalcs") && (o.treeElementField = this.table.modules.dataTree.elementField), o.groupHeader = this.table.options["groupHeader" + this.colVisPropAttach], o.groupHeader && !Array.isArray(o.groupHeader) && (o.groupHeader = [o.groupHeader]), t.classList.add("tabulator-print-table"), this.mapElementStyles(this.table.columnManager.getHeadersElement(), A, ["border-top", "border-left", "border-right", "border-bottom", "background-color", "color", "font-weight", "font-family", "font-size"]), e.length > 1e3 && console.warn("It may take a long time to render an HTML table with more than 1000 rows"), e.forEach((a, l) => {
      let h;
      switch (a.type) {
        case "header":
          A.appendChild(this.generateHeaderElement(a, o, s));
          break;
        case "group":
          i.appendChild(this.generateGroupElement(a, o, s));
          break;
        case "calc":
          i.appendChild(this.generateCalcElement(a, o, s));
          break;
        case "row":
          h = this.generateRowElement(a, o, s), this.mapElementStyles(l % 2 && s.evenRow ? s.evenRow : s.oddRow, h, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]), i.appendChild(h);
          break;
      }
    }), A.innerHTML && t.appendChild(A), t.appendChild(i), this.mapElementStyles(this.table.element, t, ["border-top", "border-left", "border-right", "border-bottom"]), t;
  }
  lookupTableStyles() {
    var e = {};
    return this.cloneTableStyle && window.getComputedStyle && (e.oddRow = this.table.element.querySelector(".tabulator-row-odd:not(.tabulator-group):not(.tabulator-calcs)"), e.evenRow = this.table.element.querySelector(".tabulator-row-even:not(.tabulator-group):not(.tabulator-calcs)"), e.calcRow = this.table.element.querySelector(".tabulator-row.tabulator-calcs"), e.firstRow = this.table.element.querySelector(".tabulator-row:not(.tabulator-group):not(.tabulator-calcs)"), e.firstGroup = this.table.element.getElementsByClassName("tabulator-group")[0], e.firstRow && (e.styleCells = e.firstRow.getElementsByClassName("tabulator-cell"), e.styleRowHeader = e.firstRow.getElementsByClassName("tabulator-row-header")[0], e.firstCell = e.styleCells[0], e.lastCell = e.styleCells[e.styleCells.length - 1])), e;
  }
  generateHeaderElement(e, t, A) {
    var i = document.createElement("tr");
    return e.columns.forEach((s) => {
      if (s) {
        var n = document.createElement("th"), o = s.component._column.definition.cssClass ? s.component._column.definition.cssClass.split(" ") : [];
        n.colSpan = s.width, n.rowSpan = s.height, n.innerHTML = s.value, this.cloneTableStyle && (n.style.boxSizing = "border-box"), o.forEach(function(a) {
          n.classList.add(a);
        }), this.mapElementStyles(s.component.getElement(), n, ["text-align", "border-left", "border-right", "background-color", "color", "font-weight", "font-family", "font-size"]), this.mapElementStyles(s.component._column.contentElement, n, ["padding-top", "padding-left", "padding-right", "padding-bottom"]), s.component._column.visible ? this.mapElementStyles(s.component.getElement(), n, ["width"]) : s.component._column.definition.width && (n.style.width = s.component._column.definition.width + "px"), s.component._column.parent && s.component._column.parent.isGroup ? this.mapElementStyles(s.component._column.parent.groupElement, n, ["border-top"]) : this.mapElementStyles(s.component.getElement(), n, ["border-top"]), s.component._column.isGroup ? this.mapElementStyles(s.component.getElement(), n, ["border-bottom"]) : this.mapElementStyles(this.table.columnManager.getElement(), n, ["border-bottom"]), i.appendChild(n);
      }
    }), i;
  }
  generateGroupElement(e, t, A) {
    var i = document.createElement("tr"), s = document.createElement("td"), n = e.columns[0];
    return i.classList.add("tabulator-print-table-row"), t.groupHeader && t.groupHeader[e.indent] ? n.value = t.groupHeader[e.indent](n.value, e.component._group.getRowCount(), e.component._group.getData(), e.component) : t.groupHeader !== !1 && (n.value = e.component._group.generator(n.value, e.component._group.getRowCount(), e.component._group.getData(), e.component)), s.colSpan = n.width, s.innerHTML = n.value, i.classList.add("tabulator-print-table-group"), i.classList.add("tabulator-group-level-" + e.indent), n.component.isVisible() && i.classList.add("tabulator-group-visible"), this.mapElementStyles(A.firstGroup, i, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]), this.mapElementStyles(A.firstGroup, s, ["padding-top", "padding-left", "padding-right", "padding-bottom"]), i.appendChild(s), i;
  }
  generateCalcElement(e, t, A) {
    var i = this.generateRowElement(e, t, A);
    return i.classList.add("tabulator-print-table-calcs"), this.mapElementStyles(A.calcRow, i, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]), i;
  }
  generateRowElement(e, t, A) {
    var i = document.createElement("tr");
    if (i.classList.add("tabulator-print-table-row"), e.columns.forEach((s, n) => {
      if (s) {
        var o = document.createElement("td"), a = s.component._column, l = this.table, h = l.columnManager.findColumnIndex(a), u = s.value, c, f, w = {
          modules: {},
          getValue: function() {
            return u;
          },
          getField: function() {
            return a.definition.field;
          },
          getElement: function() {
            return o;
          },
          getType: function() {
            return "cell";
          },
          getColumn: function() {
            return a.getComponent();
          },
          getData: function() {
            return e.component.getData();
          },
          getRow: function() {
            return e.component;
          },
          getTable: function() {
            return l;
          },
          getComponent: function() {
            return w;
          },
          column: a
        }, b = a.definition.cssClass ? a.definition.cssClass.split(" ") : [];
        if (b.forEach(function(v) {
          o.classList.add(v);
        }), this.table.modExists("format") && this.config.formatCells !== !1)
          u = this.table.modules.format.formatExportValue(w, this.colVisProp);
        else
          switch (typeof u) {
            case "object":
              u = u !== null ? JSON.stringify(u) : "";
              break;
            case "undefined":
              u = "";
              break;
          }
        u instanceof Node ? o.appendChild(u) : o.innerHTML = u, f = ["padding-top", "padding-left", "padding-right", "padding-bottom", "border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "text-align"], a.isRowHeader ? (c = A.styleRowHeader, f.push("background-color")) : c = A.styleCells && A.styleCells[h] ? A.styleCells[h] : A.firstCell, c && (this.mapElementStyles(c, o, f), a.definition.align && (o.style.textAlign = a.definition.align)), this.table.options.dataTree && this.config.dataTree !== !1 && (t.treeElementField && t.treeElementField == a.field || !t.treeElementField && n == 0) && (e.component._row.modules.dataTree.controlEl && o.insertBefore(e.component._row.modules.dataTree.controlEl.cloneNode(!0), o.firstChild), e.component._row.modules.dataTree.branchEl && o.insertBefore(e.component._row.modules.dataTree.branchEl.cloneNode(!0), o.firstChild)), i.appendChild(o), w.modules.format && w.modules.format.renderedCallback && w.modules.format.renderedCallback();
      }
    }), t.rowFormatter && e.type === "row" && this.config.formatCells !== !1) {
      let s = Object.assign(e.component);
      s.getElement = function() {
        return i;
      }, t.rowFormatter(e.component);
    }
    return i;
  }
  generateHTMLTable(e) {
    var t = document.createElement("div");
    return t.appendChild(this.generateTableElement(e)), t.innerHTML;
  }
  getHtml(e, t, A, i) {
    var s = this.generateExportList(A || this.table.options.htmlOutputConfig, t, e, i || "htmlOutput");
    return this.generateHTMLTable(s);
  }
  mapElementStyles(e, t, A) {
    if (this.cloneTableStyle && e && t) {
      var i = {
        "background-color": "backgroundColor",
        color: "fontColor",
        width: "width",
        "font-weight": "fontWeight",
        "font-family": "fontFamily",
        "font-size": "fontSize",
        "text-align": "textAlign",
        "border-top": "borderTop",
        "border-left": "borderLeft",
        "border-right": "borderRight",
        "border-bottom": "borderBottom",
        "padding-top": "paddingTop",
        "padding-left": "paddingLeft",
        "padding-right": "paddingRight",
        "padding-bottom": "paddingBottom"
      };
      if (window.getComputedStyle) {
        var s = window.getComputedStyle(e);
        A.forEach(function(n) {
          t.style[i[n]] || (t.style[i[n]] = s.getPropertyValue(n));
        });
      }
    }
  }
};
U(mt, "moduleName", "export"), U(mt, "columnLookups", _l), U(mt, "rowLookups", Ol);
let _s = mt;
var Kl = {
  //equal to
  "=": function(r, e, t, A) {
    return e == r;
  },
  //less than
  "<": function(r, e, t, A) {
    return e < r;
  },
  //less than or equal to
  "<=": function(r, e, t, A) {
    return e <= r;
  },
  //greater than
  ">": function(r, e, t, A) {
    return e > r;
  },
  //greater than or equal to
  ">=": function(r, e, t, A) {
    return e >= r;
  },
  //not equal to
  "!=": function(r, e, t, A) {
    return e != r;
  },
  regex: function(r, e, t, A) {
    return typeof r == "string" && (r = new RegExp(r)), r.test(e);
  },
  //contains the string
  like: function(r, e, t, A) {
    return r === null || typeof r > "u" ? e === r : typeof e < "u" && e !== null ? String(e).toLowerCase().indexOf(r.toLowerCase()) > -1 : !1;
  },
  //contains the keywords
  keywords: function(r, e, t, A) {
    var i = r.toLowerCase().split(typeof A.separator > "u" ? " " : A.separator), s = String(e === null || typeof e > "u" ? "" : e).toLowerCase(), n = [];
    return i.forEach((o) => {
      s.includes(o) && n.push(!0);
    }), A.matchAll ? n.length === i.length : !!n.length;
  },
  //starts with the string
  starts: function(r, e, t, A) {
    return r === null || typeof r > "u" ? e === r : typeof e < "u" && e !== null ? String(e).toLowerCase().startsWith(r.toLowerCase()) : !1;
  },
  //ends with the string
  ends: function(r, e, t, A) {
    return r === null || typeof r > "u" ? e === r : typeof e < "u" && e !== null ? String(e).toLowerCase().endsWith(r.toLowerCase()) : !1;
  },
  //in array
  in: function(r, e, t, A) {
    return Array.isArray(r) ? r.length ? r.indexOf(e) > -1 : !0 : (console.warn("Filter Error - filter value is not an array:", r), !1);
  }
};
const st = class st extends Y {
  constructor(e) {
    super(e), this.filterList = [], this.headerFilters = {}, this.headerFilterColumns = [], this.prevHeaderFilterChangeCheck = "", this.prevHeaderFilterChangeCheck = "{}", this.changed = !1, this.tableInitialized = !1, this.registerTableOption("filterMode", "local"), this.registerTableOption("initialFilter", !1), this.registerTableOption("initialHeaderFilter", !1), this.registerTableOption("headerFilterLiveFilterDelay", 300), this.registerTableOption("placeholderHeaderFilter", !1), this.registerColumnOption("headerFilter"), this.registerColumnOption("headerFilterPlaceholder"), this.registerColumnOption("headerFilterParams"), this.registerColumnOption("headerFilterEmptyCheck"), this.registerColumnOption("headerFilterFunc"), this.registerColumnOption("headerFilterFuncParams"), this.registerColumnOption("headerFilterLiveFilter"), this.registerTableFunction("searchRows", this.searchRows.bind(this)), this.registerTableFunction("searchData", this.searchData.bind(this)), this.registerTableFunction("setFilter", this.userSetFilter.bind(this)), this.registerTableFunction("refreshFilter", this.userRefreshFilter.bind(this)), this.registerTableFunction("addFilter", this.userAddFilter.bind(this)), this.registerTableFunction("getFilters", this.getFilters.bind(this)), this.registerTableFunction("setHeaderFilterFocus", this.userSetHeaderFilterFocus.bind(this)), this.registerTableFunction("getHeaderFilterValue", this.userGetHeaderFilterValue.bind(this)), this.registerTableFunction("setHeaderFilterValue", this.userSetHeaderFilterValue.bind(this)), this.registerTableFunction("getHeaderFilters", this.getHeaderFilters.bind(this)), this.registerTableFunction("removeFilter", this.userRemoveFilter.bind(this)), this.registerTableFunction("clearFilter", this.userClearFilter.bind(this)), this.registerTableFunction("clearHeaderFilter", this.userClearHeaderFilter.bind(this)), this.registerComponentFunction("column", "headerFilterFocus", this.setHeaderFilterFocus.bind(this)), this.registerComponentFunction("column", "reloadHeaderFilter", this.reloadHeaderFilter.bind(this)), this.registerComponentFunction("column", "getHeaderFilterValue", this.getHeaderFilterValue.bind(this)), this.registerComponentFunction("column", "setHeaderFilterValue", this.setHeaderFilterValue.bind(this));
  }
  initialize() {
    this.subscribe("column-init", this.initializeColumnHeaderFilter.bind(this)), this.subscribe("column-width-fit-before", this.hideHeaderFilterElements.bind(this)), this.subscribe("column-width-fit-after", this.showHeaderFilterElements.bind(this)), this.subscribe("table-built", this.tableBuilt.bind(this)), this.subscribe("placeholder", this.generatePlaceholder.bind(this)), this.table.options.filterMode === "remote" && this.subscribe("data-params", this.remoteFilterParams.bind(this)), this.registerDataHandler(this.filter.bind(this), 10);
  }
  tableBuilt() {
    this.table.options.initialFilter && this.setFilter(this.table.options.initialFilter), this.table.options.initialHeaderFilter && this.table.options.initialHeaderFilter.forEach((e) => {
      var t = this.table.columnManager.findColumn(e.field);
      if (t)
        this.setHeaderFilterValue(t, e.value);
      else
        return console.warn("Column Filter Error - No matching column found:", e.field), !1;
    }), this.tableInitialized = !0;
  }
  remoteFilterParams(e, t, A, i) {
    return i.filter = this.getFilters(!0, !0), i;
  }
  generatePlaceholder(e) {
    if (this.table.options.placeholderHeaderFilter && Object.keys(this.headerFilters).length)
      return this.table.options.placeholderHeaderFilter;
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  //set standard filters
  userSetFilter(e, t, A, i) {
    this.setFilter(e, t, A, i), this.refreshFilter();
  }
  //set standard filters
  userRefreshFilter() {
    this.refreshFilter();
  }
  //add filter to array
  userAddFilter(e, t, A, i) {
    this.addFilter(e, t, A, i), this.refreshFilter();
  }
  userSetHeaderFilterFocus(e) {
    var t = this.table.columnManager.findColumn(e);
    if (t)
      this.setHeaderFilterFocus(t);
    else
      return console.warn("Column Filter Focus Error - No matching column found:", e), !1;
  }
  userGetHeaderFilterValue(e) {
    var t = this.table.columnManager.findColumn(e);
    if (t)
      return this.getHeaderFilterValue(t);
    console.warn("Column Filter Error - No matching column found:", e);
  }
  userSetHeaderFilterValue(e, t) {
    var A = this.table.columnManager.findColumn(e);
    if (A)
      this.setHeaderFilterValue(A, t);
    else
      return console.warn("Column Filter Error - No matching column found:", e), !1;
  }
  //remove filter from array
  userRemoveFilter(e, t, A) {
    this.removeFilter(e, t, A), this.refreshFilter();
  }
  //clear filters
  userClearFilter(e) {
    this.clearFilter(e), this.refreshFilter();
  }
  //clear header filters
  userClearHeaderFilter() {
    this.clearHeaderFilter(), this.refreshFilter();
  }
  //search for specific row components
  searchRows(e, t, A) {
    return this.search("rows", e, t, A);
  }
  //search for specific data
  searchData(e, t, A) {
    return this.search("data", e, t, A);
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  initializeColumnHeaderFilter(e) {
    var t = e.definition;
    t.headerFilter && this.initializeColumn(e);
  }
  //initialize column header filter
  initializeColumn(e, t) {
    var A = this, i = e.getField();
    function s(n) {
      var o = e.modules.filter.tagType == "input" && e.modules.filter.attrType == "text" || e.modules.filter.tagType == "textarea" ? "partial" : "match", a = "", l = "", h;
      if (typeof e.modules.filter.prevSuccess > "u" || e.modules.filter.prevSuccess !== n) {
        if (e.modules.filter.prevSuccess = n, e.modules.filter.emptyFunc(n))
          delete A.headerFilters[i];
        else {
          switch (e.modules.filter.value = n, typeof e.definition.headerFilterFunc) {
            case "string":
              st.filters[e.definition.headerFilterFunc] ? (a = e.definition.headerFilterFunc, h = function(u) {
                var c = e.definition.headerFilterFuncParams || {}, f = e.getFieldValue(u);
                return c = typeof c == "function" ? c(n, f, u) : c, st.filters[e.definition.headerFilterFunc](n, f, u, c);
              }) : console.warn("Header Filter Error - Matching filter function not found: ", e.definition.headerFilterFunc);
              break;
            case "function":
              h = function(u) {
                var c = e.definition.headerFilterFuncParams || {}, f = e.getFieldValue(u);
                return c = typeof c == "function" ? c(n, f, u) : c, e.definition.headerFilterFunc(n, f, u, c);
              }, a = h;
              break;
          }
          if (!h)
            switch (o) {
              case "partial":
                h = function(u) {
                  var c = e.getFieldValue(u);
                  return typeof c < "u" && c !== null ? String(c).toLowerCase().indexOf(String(n).toLowerCase()) > -1 : !1;
                }, a = "like";
                break;
              default:
                h = function(u) {
                  return e.getFieldValue(u) == n;
                }, a = "=";
            }
          A.headerFilters[i] = { value: n, func: h, type: a };
        }
        e.modules.filter.value = n, l = JSON.stringify(A.headerFilters), A.prevHeaderFilterChangeCheck !== l && (A.prevHeaderFilterChangeCheck = l, A.trackChanges(), A.refreshFilter());
      }
      return !0;
    }
    e.modules.filter = {
      success: s,
      attrType: !1,
      tagType: !1,
      emptyFunc: !1
    }, this.generateHeaderFilterElement(e);
  }
  generateHeaderFilterElement(e, t, A) {
    var i = this, s = e.modules.filter.success, n = e.getField(), o, a, l, h, u, c, f, w;
    e.modules.filter.value = t;
    function b() {
    }
    function v(B) {
      w = B;
    }
    if (e.modules.filter.headerElement && e.modules.filter.headerElement.parentNode && e.contentElement.removeChild(e.modules.filter.headerElement.parentNode), n) {
      switch (e.modules.filter.emptyFunc = e.definition.headerFilterEmptyCheck || function(B) {
        return !B && B !== 0;
      }, o = document.createElement("div"), o.classList.add("tabulator-header-filter"), typeof e.definition.headerFilter) {
        case "string":
          i.table.modules.edit.editors[e.definition.headerFilter] ? (a = i.table.modules.edit.editors[e.definition.headerFilter], (e.definition.headerFilter === "tick" || e.definition.headerFilter === "tickCross") && !e.definition.headerFilterEmptyCheck && (e.modules.filter.emptyFunc = function(B) {
            return B !== !0 && B !== !1;
          })) : console.warn("Filter Error - Cannot build header filter, No such editor found: ", e.definition.editor);
          break;
        case "function":
          a = e.definition.headerFilter;
          break;
        case "boolean":
          e.modules.edit && e.modules.edit.editor ? a = e.modules.edit.editor : e.definition.formatter && i.table.modules.edit.editors[e.definition.formatter] ? (a = i.table.modules.edit.editors[e.definition.formatter], (e.definition.formatter === "tick" || e.definition.formatter === "tickCross") && !e.definition.headerFilterEmptyCheck && (e.modules.filter.emptyFunc = function(B) {
            return B !== !0 && B !== !1;
          })) : a = i.table.modules.edit.editors.input;
          break;
      }
      if (a) {
        if (h = {
          getValue: function() {
            return typeof t < "u" ? t : "";
          },
          getField: function() {
            return e.definition.field;
          },
          getElement: function() {
            return o;
          },
          getColumn: function() {
            return e.getComponent();
          },
          getTable: () => this.table,
          getType: () => "header",
          getRow: function() {
            return {
              normalizeHeight: function() {
              }
            };
          }
        }, f = e.definition.headerFilterParams || {}, f = typeof f == "function" ? f.call(i.table, h) : f, l = a.call(this.table.modules.edit, h, v, s, b, f), !l) {
          console.warn("Filter Error - Cannot add filter to " + n + " column, editor returned a value of false");
          return;
        }
        if (!(l instanceof Node)) {
          console.warn("Filter Error - Cannot add filter to " + n + " column, editor should return an instance of Node, the editor returned:", l);
          return;
        }
        i.langBind("headerFilters|columns|" + e.definition.field, function(B) {
          l.setAttribute("placeholder", typeof B < "u" && B ? B : e.definition.headerFilterPlaceholder || i.langText("headerFilters|default"));
        }), l.addEventListener("click", function(B) {
          B.stopPropagation(), l.focus();
        }), l.addEventListener("focus", (B) => {
          var y = this.table.columnManager.contentsElement.scrollLeft, D = this.table.rowManager.element.scrollLeft;
          y !== D && (this.table.rowManager.scrollHorizontal(y), this.table.columnManager.scrollHorizontal(y));
        }), u = !1, c = function(B) {
          u && clearTimeout(u), u = setTimeout(function() {
            s(l.value);
          }, i.table.options.headerFilterLiveFilterDelay);
        }, e.modules.filter.headerElement = l, e.modules.filter.attrType = l.hasAttribute("type") ? l.getAttribute("type").toLowerCase() : "", e.modules.filter.tagType = l.tagName.toLowerCase(), e.definition.headerFilterLiveFilter !== !1 && (e.definition.headerFilter === "autocomplete" || e.definition.headerFilter === "tickCross" || (e.definition.editor === "autocomplete" || e.definition.editor === "tickCross") && e.definition.headerFilter === !0 || (l.addEventListener("keyup", c), l.addEventListener("search", c), e.modules.filter.attrType == "number" && l.addEventListener("change", function(B) {
          s(l.value);
        }), e.modules.filter.attrType == "text" && this.table.browser !== "ie" && l.setAttribute("type", "search")), (e.modules.filter.tagType == "input" || e.modules.filter.tagType == "select" || e.modules.filter.tagType == "textarea") && l.addEventListener("mousedown", function(B) {
          B.stopPropagation();
        })), o.appendChild(l), e.contentElement.appendChild(o), A || i.headerFilterColumns.push(e), w && w();
      }
    } else
      console.warn("Filter Error - Cannot add header filter, column has no field set:", e.definition.title);
  }
  //hide all header filter elements (used to ensure correct column widths in "fitData" layout mode)
  hideHeaderFilterElements() {
    this.headerFilterColumns.forEach(function(e) {
      e.modules.filter && e.modules.filter.headerElement && (e.modules.filter.headerElement.style.display = "none");
    });
  }
  //show all header filter elements (used to ensure correct column widths in "fitData" layout mode)
  showHeaderFilterElements() {
    this.headerFilterColumns.forEach(function(e) {
      e.modules.filter && e.modules.filter.headerElement && (e.modules.filter.headerElement.style.display = "");
    });
  }
  //programmatically set focus of header filter
  setHeaderFilterFocus(e) {
    e.modules.filter && e.modules.filter.headerElement ? e.modules.filter.headerElement.focus() : console.warn("Column Filter Focus Error - No header filter set on column:", e.getField());
  }
  //programmatically get value of header filter
  getHeaderFilterValue(e) {
    if (e.modules.filter && e.modules.filter.headerElement)
      return e.modules.filter.value;
    console.warn("Column Filter Error - No header filter set on column:", e.getField());
  }
  //programmatically set value of header filter
  setHeaderFilterValue(e, t) {
    e && (e.modules.filter && e.modules.filter.headerElement ? (this.generateHeaderFilterElement(e, t, !0), e.modules.filter.success(t)) : console.warn("Column Filter Error - No header filter set on column:", e.getField()));
  }
  reloadHeaderFilter(e) {
    e && (e.modules.filter && e.modules.filter.headerElement ? this.generateHeaderFilterElement(e, e.modules.filter.value, !0) : console.warn("Column Filter Error - No header filter set on column:", e.getField()));
  }
  refreshFilter() {
    this.tableInitialized && (this.table.options.filterMode === "remote" ? this.reloadData(null, !1, !1) : this.refreshData(!0));
  }
  //check if the filters has changed since last use
  trackChanges() {
    this.changed = !0, this.dispatch("filter-changed");
  }
  //check if the filters has changed since last use
  hasChanged() {
    var e = this.changed;
    return this.changed = !1, e;
  }
  //set standard filters
  setFilter(e, t, A, i) {
    this.filterList = [], Array.isArray(e) || (e = [{ field: e, type: t, value: A, params: i }]), this.addFilter(e);
  }
  //add filter to array
  addFilter(e, t, A, i) {
    var s = !1;
    Array.isArray(e) || (e = [{ field: e, type: t, value: A, params: i }]), e.forEach((n) => {
      n = this.findFilter(n), n && (this.filterList.push(n), s = !0);
    }), s && this.trackChanges();
  }
  findFilter(e) {
    var t;
    if (Array.isArray(e))
      return this.findSubFilters(e);
    var A = !1;
    return typeof e.field == "function" ? A = function(i) {
      return e.field(i, e.type || {});
    } : st.filters[e.type] ? (t = this.table.columnManager.getColumnByField(e.field), t ? A = function(i) {
      return st.filters[e.type](e.value, t.getFieldValue(i), i, e.params || {});
    } : A = function(i) {
      return st.filters[e.type](e.value, i[e.field], i, e.params || {});
    }) : console.warn("Filter Error - No such filter type found, ignoring: ", e.type), e.func = A, e.func ? e : !1;
  }
  findSubFilters(e) {
    var t = [];
    return e.forEach((A) => {
      A = this.findFilter(A), A && t.push(A);
    }), t.length ? t : !1;
  }
  //get all filters
  getFilters(e, t) {
    var A = [];
    return e && (A = this.getHeaderFilters()), t && A.forEach(function(i) {
      typeof i.type == "function" && (i.type = "function");
    }), A = A.concat(this.filtersToArray(this.filterList, t)), A;
  }
  //filter to Object
  filtersToArray(e, t) {
    var A = [];
    return e.forEach((i) => {
      var s;
      Array.isArray(i) ? A.push(this.filtersToArray(i, t)) : (s = { field: i.field, type: i.type, value: i.value }, t && typeof s.type == "function" && (s.type = "function"), A.push(s));
    }), A;
  }
  //get all filters
  getHeaderFilters() {
    var e = [];
    for (var t in this.headerFilters)
      e.push({ field: t, type: this.headerFilters[t].type, value: this.headerFilters[t].value });
    return e;
  }
  //remove filter from array
  removeFilter(e, t, A) {
    Array.isArray(e) || (e = [{ field: e, type: t, value: A }]), e.forEach((i) => {
      var s = -1;
      typeof i.field == "object" ? s = this.filterList.findIndex((n) => i === n) : s = this.filterList.findIndex((n) => i.field === n.field && i.type === n.type && i.value === n.value), s > -1 ? this.filterList.splice(s, 1) : console.warn("Filter Error - No matching filter type found, ignoring: ", i.type);
    }), this.trackChanges();
  }
  //clear filters
  clearFilter(e) {
    this.filterList = [], e && this.clearHeaderFilter(), this.trackChanges();
  }
  //clear header filters
  clearHeaderFilter() {
    this.headerFilters = {}, this.prevHeaderFilterChangeCheck = "{}", this.headerFilterColumns.forEach((e) => {
      typeof e.modules.filter.value < "u" && delete e.modules.filter.value, e.modules.filter.prevSuccess = void 0, this.reloadHeaderFilter(e);
    }), this.trackChanges();
  }
  //search data and return matching rows
  search(e, t, A, i) {
    var s = [], n = [];
    return Array.isArray(t) || (t = [{ field: t, type: A, value: i }]), t.forEach((o) => {
      o = this.findFilter(o), o && n.push(o);
    }), this.table.rowManager.rows.forEach((o) => {
      var a = !0;
      n.forEach((l) => {
        this.filterRecurse(l, o.getData()) || (a = !1);
      }), a && s.push(e === "data" ? o.getData("data") : o.getComponent());
    }), s;
  }
  //filter row array
  filter(e, t) {
    var A = [], i = [];
    return this.subscribedExternal("dataFiltering") && this.dispatchExternal("dataFiltering", this.getFilters(!0)), this.table.options.filterMode !== "remote" && (this.filterList.length || Object.keys(this.headerFilters).length) ? e.forEach((s) => {
      this.filterRow(s) && A.push(s);
    }) : A = e.slice(0), this.subscribedExternal("dataFiltered") && (A.forEach((s) => {
      i.push(s.getComponent());
    }), this.dispatchExternal("dataFiltered", this.getFilters(!0), i)), A;
  }
  //filter individual row
  filterRow(e, t) {
    var A = !0, i = e.getData();
    this.filterList.forEach((n) => {
      this.filterRecurse(n, i) || (A = !1);
    });
    for (var s in this.headerFilters)
      this.headerFilters[s].func(i) || (A = !1);
    return A;
  }
  filterRecurse(e, t) {
    var A = !1;
    return Array.isArray(e) ? e.forEach((i) => {
      this.filterRecurse(i, t) && (A = !0);
    }) : A = e.func(t), A;
  }
};
U(st, "moduleName", "filter"), //load defaults
U(st, "filters", Kl);
let Os = st;
function Pl(r, e, t) {
  return this.emptyToSpace(this.sanitizeHTML(r.getValue()));
}
function Vl(r, e, t) {
  return r.getValue();
}
function Nl(r, e, t) {
  return r.getElement().style.whiteSpace = "pre-wrap", this.emptyToSpace(this.sanitizeHTML(r.getValue()));
}
function zl(r, e, t) {
  var A = parseFloat(r.getValue()), i = "", s, n, o, a, l, h = e.decimal || ".", u = e.thousand || ",", c = e.negativeSign || "-", f = e.symbol || "", w = !!e.symbolAfter, b = typeof e.precision < "u" ? e.precision : 2;
  if (isNaN(A))
    return this.emptyToSpace(this.sanitizeHTML(r.getValue()));
  if (A < 0 && (A = Math.abs(A), i = c), s = b !== !1 ? A.toFixed(b) : A, s = String(s).split("."), n = s[0], o = s.length > 1 ? h + s[1] : "", e.thousand !== !1)
    for (a = /(\d+)(\d{3})/; a.test(n); )
      n = n.replace(a, "$1" + u + "$2");
  return l = n + o, i === !0 ? (l = "(" + l + ")", w ? l + f : f + l) : w ? i + l + f : i + f + l;
}
function Gl(r, e, t) {
  var A = r.getValue(), i = e.urlPrefix || "", s = e.download, n = A, o = document.createElement("a"), a;
  function l(h, u) {
    var c = h.shift(), f = u[c];
    return h.length && typeof f == "object" ? l(h, f) : f;
  }
  if (e.labelField && (a = r.getData(), n = l(e.labelField.split(this.table.options.nestedFieldSeparator), a)), e.label)
    switch (typeof e.label) {
      case "string":
        n = e.label;
        break;
      case "function":
        n = e.label(r);
        break;
    }
  if (n) {
    if (e.urlField && (a = r.getData(), A = ie.retrieveNestedData(this.table.options.nestedFieldSeparator, e.urlField, a)), e.url)
      switch (typeof e.url) {
        case "string":
          A = e.url;
          break;
        case "function":
          A = e.url(r);
          break;
      }
    return o.setAttribute("href", i + A), e.target && o.setAttribute("target", e.target), e.download && (typeof s == "function" ? s = s(r) : s = s === !0 ? "" : s, o.setAttribute("download", s)), o.innerHTML = this.emptyToSpace(this.sanitizeHTML(n)), o;
  } else
    return "&nbsp;";
}
function Wl(r, e, t) {
  var A = document.createElement("img"), i = r.getValue();
  switch (e.urlPrefix && (i = e.urlPrefix + r.getValue()), e.urlSuffix && (i = i + e.urlSuffix), A.setAttribute("src", i), typeof e.height) {
    case "number":
      A.style.height = e.height + "px";
      break;
    case "string":
      A.style.height = e.height;
      break;
  }
  switch (typeof e.width) {
    case "number":
      A.style.width = e.width + "px";
      break;
    case "string":
      A.style.width = e.width;
      break;
  }
  return A.addEventListener("load", function() {
    r.getRow().normalizeHeight();
  }), A;
}
function Xl(r, e, t) {
  var A = r.getValue(), i = r.getElement(), s = e.allowEmpty, n = e.allowTruthy, o = Object.keys(e).includes("trueValue"), a = typeof e.tickElement < "u" ? e.tickElement : '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>', l = typeof e.crossElement < "u" ? e.crossElement : '<svg enable-background="new 0 0 24 24" height="14" width="14"  viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
  return o && A === e.trueValue || !o && (n && A || A === !0 || A === "true" || A === "True" || A === 1 || A === "1") ? (i.setAttribute("aria-checked", !0), a || "") : s && (A === "null" || A === "" || A === null || typeof A > "u") ? (i.setAttribute("aria-checked", "mixed"), "") : (i.setAttribute("aria-checked", !1), l || "");
}
function Jl(r, e, t) {
  var A = this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime"), i = e.inputFormat || "yyyy-MM-dd HH:mm:ss", s = e.outputFormat || "dd/MM/yyyy HH:mm:ss", n = typeof e.invalidPlaceholder < "u" ? e.invalidPlaceholder : "", o = r.getValue();
  if (typeof A < "u") {
    var a;
    return A.isDateTime(o) ? a = o : i === "iso" ? a = A.fromISO(String(o)) : a = A.fromFormat(String(o), i), a.isValid ? (e.timezone && (a = a.setZone(e.timezone)), a.toFormat(s)) : n === !0 || !o ? o : typeof n == "function" ? n(o) : n;
  } else
    console.error("Format Error - 'datetime' formatter is dependant on luxon.js");
}
function jl(r, e, t) {
  var A = this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime"), i = e.inputFormat || "yyyy-MM-dd HH:mm:ss", s = typeof e.invalidPlaceholder < "u" ? e.invalidPlaceholder : "", n = typeof e.suffix < "u" ? e.suffix : !1, o = typeof e.unit < "u" ? e.unit : "days", a = typeof e.humanize < "u" ? e.humanize : !1, l = typeof e.date < "u" ? e.date : A.now(), h = r.getValue();
  if (typeof A < "u") {
    var u;
    return A.isDateTime(h) ? u = h : i === "iso" ? u = A.fromISO(String(h)) : u = A.fromFormat(String(h), i), u.isValid ? a ? u.diff(l, o).toHuman() + (n ? " " + n : "") : parseInt(u.diff(l, o)[o]) + (n ? " " + n : "") : s === !0 ? h : typeof s == "function" ? s(h) : s;
  } else
    console.error("Format Error - 'datetimediff' formatter is dependant on luxon.js");
}
function Yl(r, e, t) {
  var A = r.getValue();
  return typeof e[A] > "u" ? (console.warn("Missing display value for " + A), A) : e[A];
}
function Zl(r, e, t) {
  var A = r.getValue(), i = r.getElement(), s = e && e.stars ? e.stars : 5, n = document.createElement("span"), o = document.createElementNS("http://www.w3.org/2000/svg", "svg"), a = '<polygon fill="#FFEA00" stroke="#C1AB60" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>', l = '<polygon fill="#D2D2D2" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';
  n.style.verticalAlign = "middle", o.setAttribute("width", "14"), o.setAttribute("height", "14"), o.setAttribute("viewBox", "0 0 512 512"), o.setAttribute("xml:space", "preserve"), o.style.padding = "0 1px", A = A && !isNaN(A) ? parseInt(A) : 0, A = Math.max(0, Math.min(A, s));
  for (var h = 1; h <= s; h++) {
    var u = o.cloneNode(!0);
    u.innerHTML = h <= A ? a : l, n.appendChild(u);
  }
  return i.style.whiteSpace = "nowrap", i.style.overflow = "hidden", i.style.textOverflow = "ellipsis", i.setAttribute("aria-label", A), n;
}
function $l(r, e, t) {
  var A = this.sanitizeHTML(r.getValue()) || 0, i = document.createElement("span"), s = e && e.max ? e.max : 100, n = e && e.min ? e.min : 0, o = e && typeof e.color < "u" ? e.color : ["red", "orange", "green"], a = "#666666", l, h;
  if (!(isNaN(A) || typeof r.getValue() > "u")) {
    switch (i.classList.add("tabulator-traffic-light"), h = parseFloat(A) <= s ? parseFloat(A) : s, h = parseFloat(h) >= n ? parseFloat(h) : n, l = (s - n) / 100, h = Math.round((h - n) / l), typeof o) {
      case "string":
        a = o;
        break;
      case "function":
        a = o(A);
        break;
      case "object":
        if (Array.isArray(o)) {
          var u = 100 / o.length, c = Math.floor(h / u);
          c = Math.min(c, o.length - 1), c = Math.max(c, 0), a = o[c];
          break;
        }
    }
    return i.style.backgroundColor = a, i;
  }
}
function ql(r, e = {}, t) {
  var A = this.sanitizeHTML(r.getValue()) || 0, i = r.getElement(), s = e.max ? e.max : 100, n = e.min ? e.min : 0, o = e.legendAlign ? e.legendAlign : "center", a, l, h, u, c;
  switch (l = parseFloat(A) <= s ? parseFloat(A) : s, l = parseFloat(l) >= n ? parseFloat(l) : n, a = (s - n) / 100, l = Math.round((l - n) / a), typeof e.color) {
    case "string":
      h = e.color;
      break;
    case "function":
      h = e.color(A);
      break;
    case "object":
      if (Array.isArray(e.color)) {
        let v = 100 / e.color.length, B = Math.floor(l / v);
        B = Math.min(B, e.color.length - 1), B = Math.max(B, 0), h = e.color[B];
        break;
      }
    default:
      h = "#2DC214";
  }
  switch (typeof e.legend) {
    case "string":
      u = e.legend;
      break;
    case "function":
      u = e.legend(A);
      break;
    case "boolean":
      u = A;
      break;
    default:
      u = !1;
  }
  switch (typeof e.legendColor) {
    case "string":
      c = e.legendColor;
      break;
    case "function":
      c = e.legendColor(A);
      break;
    case "object":
      if (Array.isArray(e.legendColor)) {
        let v = 100 / e.legendColor.length, B = Math.floor(l / v);
        B = Math.min(B, e.legendColor.length - 1), B = Math.max(B, 0), c = e.legendColor[B];
      }
      break;
    default:
      c = "#000";
  }
  i.style.minWidth = "30px", i.style.position = "relative", i.setAttribute("aria-label", l);
  var f = document.createElement("div");
  f.style.display = "inline-block", f.style.width = l + "%", f.style.backgroundColor = h, f.style.height = "100%", f.setAttribute("data-max", s), f.setAttribute("data-min", n);
  var w = document.createElement("div");
  if (w.style.position = "relative", w.style.width = "100%", w.style.height = "100%", u) {
    var b = document.createElement("div");
    b.style.position = "absolute", b.style.top = 0, b.style.left = 0, b.style.textAlign = o, b.style.width = "100%", b.style.color = c, b.innerHTML = u;
  }
  return t(function() {
    if (!(r instanceof jn)) {
      var v = document.createElement("div");
      v.style.position = "absolute", v.style.top = "4px", v.style.bottom = "4px", v.style.left = "4px", v.style.right = "4px", i.appendChild(v), i = v;
    }
    i.appendChild(w), w.appendChild(f), u && w.appendChild(b);
  }), "";
}
function eh(r, e, t) {
  return r.getElement().style.backgroundColor = this.sanitizeHTML(r.getValue()), "";
}
function th(r, e, t) {
  return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>';
}
function Ah(r, e, t) {
  return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
}
function ih(r, e, t) {
  var A = r.getValue(), i = e.size || 15, s = i + "px", n, o, a = e.hasOwnProperty("onValue") ? e.onValue : !0, l = e.hasOwnProperty("offValue") ? e.offValue : !1, h = e.onTruthy ? A : A === a;
  return n = document.createElement("div"), n.classList.add("tabulator-toggle"), h ? (n.classList.add("tabulator-toggle-on"), n.style.flexDirection = "row-reverse", e.onColor && (n.style.background = e.onColor)) : e.offColor && (n.style.background = e.offColor), n.style.width = 2.5 * i + "px", n.style.borderRadius = s, e.clickable && n.addEventListener("click", (u) => {
    r.setValue(h ? l : a);
  }), o = document.createElement("div"), o.classList.add("tabulator-toggle-switch"), o.style.height = s, o.style.width = s, o.style.borderRadius = s, n.appendChild(o), n;
}
function sh(r, e, t) {
  var A = document.createElement("span"), i = r.getRow(), s = r.getTable();
  return i.watchPosition((n) => {
    e.relativeToPage && (n += s.modules.page.getPageSize() * (s.modules.page.getPage() - 1)), A.innerText = n;
  }), A;
}
function rh(r, e, t) {
  return r.getElement().classList.add("tabulator-row-handle"), "<div class='tabulator-row-handle-box'><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div></div>";
}
function nh(r, e, t) {
  var A, i, s;
  function n(o) {
    var a = o.getValue(), l = "plaintext";
    switch (typeof a) {
      case "boolean":
        l = "tickCross";
        break;
      case "string":
        a.includes(`
`) && (l = "textarea");
        break;
    }
    return l;
  }
  return A = e.formatterLookup ? e.formatterLookup(r) : n(r), e.paramsLookup && (s = typeof e.paramsLookup == "function" ? e.paramsLookup(A, r) : e.paramsLookup[A]), i = this.table.modules.format.lookupFormatter(A), i.call(this, r, s || {}, t);
}
function oh(r, e, t) {
  var A = e.delimiter || ",", i = r.getValue(), s = this.table, n;
  return e.valueMap && (typeof e.valueMap == "string" ? n = function(o) {
    return o.map((a) => ie.retrieveNestedData(s.options.nestedFieldSeparator, e.valueMap, a));
  } : n = e.valueMap), Array.isArray(i) ? (n && (i = n(i)), i.join(A)) : i;
}
function ah(r, e, t) {
  var A = e.indent || "	", i = typeof e.multiline > "u" ? !0 : e.multiline, s = e.replacer || null, n = r.getValue();
  return i && (r.getElement().style.whiteSpace = "pre-wrap"), JSON.stringify(n, s, A);
}
var lh = {
  plaintext: Pl,
  html: Vl,
  textarea: Nl,
  money: zl,
  link: Gl,
  image: Wl,
  tickCross: Xl,
  datetime: Jl,
  datetimediff: jl,
  lookup: Yl,
  star: Zl,
  traffic: $l,
  progress: ql,
  color: eh,
  buttonTick: th,
  buttonCross: Ah,
  toggle: ih,
  rownum: sh,
  handle: rh,
  adaptable: nh,
  array: oh,
  json: ah
};
const wt = class wt extends Y {
  constructor(e) {
    super(e), this.registerColumnOption("formatter"), this.registerColumnOption("formatterParams"), this.registerColumnOption("formatterPrint"), this.registerColumnOption("formatterPrintParams"), this.registerColumnOption("formatterClipboard"), this.registerColumnOption("formatterClipboardParams"), this.registerColumnOption("formatterHtmlOutput"), this.registerColumnOption("formatterHtmlOutputParams"), this.registerColumnOption("titleFormatter"), this.registerColumnOption("titleFormatterParams");
  }
  initialize() {
    this.subscribe("cell-format", this.formatValue.bind(this)), this.subscribe("cell-rendered", this.cellRendered.bind(this)), this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("column-format", this.formatHeader.bind(this));
  }
  //initialize column formatter
  initializeColumn(e) {
    e.modules.format = this.lookupTypeFormatter(e, ""), typeof e.definition.formatterPrint < "u" && (e.modules.format.print = this.lookupTypeFormatter(e, "Print")), typeof e.definition.formatterClipboard < "u" && (e.modules.format.clipboard = this.lookupTypeFormatter(e, "Clipboard")), typeof e.definition.formatterHtmlOutput < "u" && (e.modules.format.htmlOutput = this.lookupTypeFormatter(e, "HtmlOutput"));
  }
  lookupTypeFormatter(e, t) {
    var A = { params: e.definition["formatter" + t + "Params"] || {} }, i = e.definition["formatter" + t];
    return A.formatter = this.lookupFormatter(i), A;
  }
  lookupFormatter(e) {
    var t;
    switch (typeof e) {
      case "string":
        wt.formatters[e] ? t = wt.formatters[e] : (console.warn("Formatter Error - No such formatter found: ", e), t = wt.formatters.plaintext);
        break;
      case "function":
        t = e;
        break;
      default:
        t = wt.formatters.plaintext;
        break;
    }
    return t;
  }
  cellRendered(e) {
    e.modules.format && e.modules.format.renderedCallback && !e.modules.format.rendered && (e.modules.format.renderedCallback(), e.modules.format.rendered = !0);
  }
  //return a formatted value for a column header
  formatHeader(e, t, A) {
    var i, s, n, o;
    return e.definition.titleFormatter ? (i = this.lookupFormatter(e.definition.titleFormatter), n = (a) => {
      e.titleFormatterRendered = a;
    }, o = {
      getValue: function() {
        return t;
      },
      getElement: function() {
        return A;
      },
      getType: function() {
        return "header";
      },
      getColumn: function() {
        return e.getComponent();
      },
      getTable: () => this.table
    }, s = e.definition.titleFormatterParams || {}, s = typeof s == "function" ? s() : s, i.call(this, o, s, n)) : t;
  }
  //return a formatted value for a cell
  formatValue(e) {
    var t = e.getComponent(), A = typeof e.column.modules.format.params == "function" ? e.column.modules.format.params(t) : e.column.modules.format.params;
    function i(s) {
      e.modules.format || (e.modules.format = {}), e.modules.format.renderedCallback = s, e.modules.format.rendered = !1;
    }
    return e.column.modules.format.formatter.call(this, t, A, i);
  }
  formatExportValue(e, t) {
    var A = e.column.modules.format[t], i;
    if (A) {
      let s = function(n) {
        e.modules.format || (e.modules.format = {}), e.modules.format.renderedCallback = n, e.modules.format.rendered = !1;
      };
      return i = typeof A.params == "function" ? A.params(e.getComponent()) : A.params, A.formatter.call(this, e.getComponent(), i, s);
    } else
      return this.formatValue(e);
  }
  sanitizeHTML(e) {
    if (e) {
      var t = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;"
      };
      return String(e).replace(/[&<>"'`=/]/g, function(A) {
        return t[A];
      });
    } else
      return e;
  }
  emptyToSpace(e) {
    return e === null || typeof e > "u" || e === "" ? "&nbsp;" : e;
  }
};
U(wt, "moduleName", "format"), //load defaults
U(wt, "formatters", lh);
let Ks = wt;
class qn extends Y {
  constructor(e) {
    super(e), this.leftColumns = [], this.rightColumns = [], this.initializationMode = "left", this.active = !1, this.blocked = !0, this.registerColumnOption("frozen");
  }
  //reset initial state
  reset() {
    this.initializationMode = "left", this.leftColumns = [], this.rightColumns = [], this.active = !1;
  }
  initialize() {
    this.subscribe("cell-layout", this.layoutCell.bind(this)), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("column-width", this.layout.bind(this)), this.subscribe("row-layout-after", this.layoutRow.bind(this)), this.subscribe("table-layout", this.layout.bind(this)), this.subscribe("columns-loading", this.reset.bind(this)), this.subscribe("column-add", this.reinitializeColumns.bind(this)), this.subscribe("column-deleted", this.reinitializeColumns.bind(this)), this.subscribe("column-hide", this.reinitializeColumns.bind(this)), this.subscribe("column-show", this.reinitializeColumns.bind(this)), this.subscribe("columns-loaded", this.reinitializeColumns.bind(this)), this.subscribe("table-redraw", this.layout.bind(this)), this.subscribe("layout-refreshing", this.blockLayout.bind(this)), this.subscribe("layout-refreshed", this.unblockLayout.bind(this)), this.subscribe("scrollbar-vertical", this.adjustForScrollbar.bind(this));
  }
  blockLayout() {
    this.blocked = !0;
  }
  unblockLayout() {
    this.blocked = !1;
  }
  layoutCell(e) {
    this.layoutElement(e.element, e.column);
  }
  reinitializeColumns() {
    this.reset(), this.table.columnManager.columnsByIndex.forEach((e) => {
      this.initializeColumn(e);
    }), this.layout();
  }
  //initialize specific column
  initializeColumn(e) {
    var t = { margin: 0, edge: !1 };
    e.isGroup || (this.frozenCheck(e) ? (t.position = this.initializationMode, this.initializationMode == "left" ? this.leftColumns.push(e) : this.rightColumns.unshift(e), this.active = !0, e.modules.frozen = t) : this.initializationMode = "right");
  }
  frozenCheck(e) {
    return e.parent.isGroup && e.definition.frozen && console.warn("Frozen Column Error - Parent column group must be frozen, not individual columns or sub column groups"), e.parent.isGroup ? this.frozenCheck(e.parent) : e.definition.frozen;
  }
  //layout calculation rows
  layoutCalcRows() {
    this.table.modExists("columnCalcs") && (this.table.modules.columnCalcs.topInitialized && this.table.modules.columnCalcs.topRow && this.layoutRow(this.table.modules.columnCalcs.topRow), this.table.modules.columnCalcs.botInitialized && this.table.modules.columnCalcs.botRow && this.layoutRow(this.table.modules.columnCalcs.botRow), this.table.modExists("groupRows") && this.layoutGroupCalcs(this.table.modules.groupRows.getGroups()));
  }
  layoutGroupCalcs(e) {
    e.forEach((t) => {
      t.calcs.top && this.layoutRow(t.calcs.top), t.calcs.bottom && this.layoutRow(t.calcs.bottom), t.groupList && t.groupList.length && this.layoutGroupCalcs(t.groupList);
    });
  }
  //calculate column positions and layout headers
  layoutColumnPosition(e) {
    var t = [], A = 0, i = 0;
    this.leftColumns.forEach((s, n) => {
      if (s.modules.frozen.marginValue = A, s.modules.frozen.margin = s.modules.frozen.marginValue + "px", s.visible && (A += s.getWidth()), n == this.leftColumns.length - 1 ? s.modules.frozen.edge = !0 : s.modules.frozen.edge = !1, s.parent.isGroup) {
        var o = this.getColGroupParentElement(s);
        t.includes(o) || (this.layoutElement(o, s), t.push(o)), o.classList.toggle("tabulator-frozen-left", s.modules.frozen.edge && s.modules.frozen.position === "left"), o.classList.toggle("tabulator-frozen-right", s.modules.frozen.edge && s.modules.frozen.position === "right");
      } else
        this.layoutElement(s.getElement(), s);
      e && s.cells.forEach((a) => {
        this.layoutElement(a.getElement(!0), s);
      });
    }), this.rightColumns.forEach((s, n) => {
      s.modules.frozen.marginValue = i, s.modules.frozen.margin = s.modules.frozen.marginValue + "px", s.visible && (i += s.getWidth()), n == this.rightColumns.length - 1 ? s.modules.frozen.edge = !0 : s.modules.frozen.edge = !1, s.parent.isGroup ? this.layoutElement(this.getColGroupParentElement(s), s) : this.layoutElement(s.getElement(), s), e && s.cells.forEach((o) => {
        this.layoutElement(o.getElement(!0), s);
      });
    });
  }
  getColGroupParentElement(e) {
    return e.parent.isGroup ? this.getColGroupParentElement(e.parent) : e.getElement();
  }
  //layout columns appropriately
  layout() {
    this.active && !this.blocked && (this.layoutColumnPosition(), this.reinitializeRows(), this.layoutCalcRows());
  }
  reinitializeRows() {
    var e = this.table.rowManager.getVisibleRows(!0), t = this.table.rowManager.getRows().filter((A) => !e.includes(A));
    t.forEach((A) => {
      A.deinitialize();
    }), e.forEach((A) => {
      A.type === "row" && this.layoutRow(A);
    });
  }
  layoutRow(e) {
    this.table.options.layout === "fitDataFill" && this.rightColumns.length && (this.table.rowManager.getTableElement().style.minWidth = "calc(100% - " + this.rightMargin + ")"), this.leftColumns.forEach((t) => {
      var A = e.getCell(t);
      A && this.layoutElement(A.getElement(!0), t);
    }), this.rightColumns.forEach((t) => {
      var A = e.getCell(t);
      A && this.layoutElement(A.getElement(!0), t);
    });
  }
  layoutElement(e, t) {
    var A;
    t.modules.frozen && e && (e.style.position = "sticky", this.table.rtl ? A = t.modules.frozen.position === "left" ? "right" : "left" : A = t.modules.frozen.position, e.style[A] = t.modules.frozen.margin, e.classList.add("tabulator-frozen"), e.classList.toggle("tabulator-frozen-left", t.modules.frozen.edge && t.modules.frozen.position === "left"), e.classList.toggle("tabulator-frozen-right", t.modules.frozen.edge && t.modules.frozen.position === "right"));
  }
  adjustForScrollbar(e) {
    this.rightColumns.length && (this.table.columnManager.getContentsElement().style.width = "calc(100% - " + e + "px)");
  }
  getFrozenColumns() {
    return this.leftColumns.concat(this.rightColumns);
  }
  _calcSpace(e, t) {
    var A = 0;
    for (let i = 0; i < t; i++)
      e[i].visible && (A += e[i].getWidth());
    return A;
  }
}
U(qn, "moduleName", "frozenColumns");
class eo extends Y {
  constructor(e) {
    super(e), this.topElement = document.createElement("div"), this.rows = [], this.registerComponentFunction("row", "freeze", this.freezeRow.bind(this)), this.registerComponentFunction("row", "unfreeze", this.unfreezeRow.bind(this)), this.registerComponentFunction("row", "isFrozen", this.isRowFrozen.bind(this)), this.registerTableOption("frozenRowsField", "id"), this.registerTableOption("frozenRows", !1);
  }
  initialize() {
    var e = document.createDocumentFragment();
    this.rows = [], this.topElement.classList.add("tabulator-frozen-rows-holder"), e.appendChild(document.createElement("br")), e.appendChild(this.topElement), this.table.columnManager.getContentsElement().insertBefore(e, this.table.columnManager.headersElement.nextSibling), this.subscribe("row-deleting", this.detachRow.bind(this)), this.subscribe("rows-visible", this.visibleRows.bind(this)), this.registerDisplayHandler(this.getRows.bind(this), 10), this.table.options.frozenRows && (this.subscribe("data-processed", this.initializeRows.bind(this)), this.subscribe("row-added", this.initializeRow.bind(this)), this.subscribe("table-redrawing", this.resizeHolderWidth.bind(this)), this.subscribe("column-resized", this.resizeHolderWidth.bind(this)), this.subscribe("column-show", this.resizeHolderWidth.bind(this)), this.subscribe("column-hide", this.resizeHolderWidth.bind(this))), this.resizeHolderWidth();
  }
  resizeHolderWidth() {
    this.topElement.style.minWidth = this.table.columnManager.headersElement.offsetWidth + "px";
  }
  initializeRows() {
    this.table.rowManager.getRows().forEach((e) => {
      this.initializeRow(e);
    });
  }
  initializeRow(e) {
    var t = this.table.options.frozenRows, A = typeof t;
    A === "number" ? e.getPosition() && e.getPosition() + this.rows.length <= t && this.freezeRow(e) : A === "function" ? t.call(this.table, e.getComponent()) && this.freezeRow(e) : Array.isArray(t) && t.includes(e.data[this.options("frozenRowsField")]) && this.freezeRow(e);
  }
  isRowFrozen(e) {
    var t = this.rows.indexOf(e);
    return t > -1;
  }
  isFrozen() {
    return !!this.rows.length;
  }
  visibleRows(e, t) {
    return this.rows.forEach((A) => {
      t.push(A);
    }), t;
  }
  //filter frozen rows out of display data
  getRows(e) {
    var t = e.slice(0);
    return this.rows.forEach(function(A) {
      var i = t.indexOf(A);
      i > -1 && t.splice(i, 1);
    }), t;
  }
  freezeRow(e) {
    e.modules.frozen ? console.warn("Freeze Error - Row is already frozen") : (e.modules.frozen = !0, this.topElement.appendChild(e.getElement()), e.initialize(), e.normalizeHeight(), this.rows.push(e), this.refreshData(!1, "display"), this.table.rowManager.adjustTableSize(), this.styleRows());
  }
  unfreezeRow(e) {
    e.modules.frozen ? (e.modules.frozen = !1, this.detachRow(e), this.table.rowManager.adjustTableSize(), this.refreshData(!1, "display"), this.rows.length && this.styleRows()) : console.warn("Freeze Error - Row is already unfrozen");
  }
  detachRow(e) {
    var t = this.rows.indexOf(e);
    if (t > -1) {
      var A = e.getElement();
      A.parentNode && A.parentNode.removeChild(A), this.rows.splice(t, 1);
    }
  }
  styleRows(e) {
    this.rows.forEach((t, A) => {
      this.table.rowManager.styleRow(t, A);
    });
  }
}
U(eo, "moduleName", "frozenRows");
class hh {
  constructor(e) {
    return this._group = e, this.type = "GroupComponent", new Proxy(this, {
      get: function(t, A, i) {
        return typeof t[A] < "u" ? t[A] : t._group.groupManager.table.componentFunctionBinder.handle("group", t._group, A);
      }
    });
  }
  getKey() {
    return this._group.key;
  }
  getField() {
    return this._group.field;
  }
  getElement() {
    return this._group.element;
  }
  getRows() {
    return this._group.getRows(!0);
  }
  getSubGroups() {
    return this._group.getSubGroups(!0);
  }
  getParentGroup() {
    return this._group.parent ? this._group.parent.getComponent() : !1;
  }
  isVisible() {
    return this._group.visible;
  }
  show() {
    this._group.show();
  }
  hide() {
    this._group.hide();
  }
  toggle() {
    this._group.toggleVisibility();
  }
  scrollTo(e, t) {
    return this._group.groupManager.table.rowManager.scrollToRow(this._group, e, t);
  }
  _getSelf() {
    return this._group;
  }
  getTable() {
    return this._group.groupManager.table;
  }
}
class Zt {
  constructor(e, t, A, i, s, n, o) {
    this.groupManager = e, this.parent = t, this.key = i, this.level = A, this.field = s, this.hasSubGroups = A < e.groupIDLookups.length - 1, this.addRow = this.hasSubGroups ? this._addRowToGroup : this._addRow, this.type = "group", this.old = o, this.rows = [], this.groups = [], this.groupList = [], this.generator = n, this.element = !1, this.elementContents = !1, this.height = 0, this.outerHeight = 0, this.initialized = !1, this.calcs = {}, this.initialized = !1, this.modules = {}, this.arrowElement = !1, this.visible = o ? o.visible : typeof e.startOpen[A] < "u" ? e.startOpen[A] : e.startOpen[0], this.component = null, this.createElements(), this.addBindings(), this.createValueGroups();
  }
  wipe(e) {
    e || (this.groupList.length ? this.groupList.forEach(function(t) {
      t.wipe();
    }) : this.rows.forEach((t) => {
      t.modules && delete t.modules.group;
    })), this.element = !1, this.arrowElement = !1, this.elementContents = !1;
  }
  createElements() {
    var e = document.createElement("div");
    e.classList.add("tabulator-arrow"), this.element = document.createElement("div"), this.element.classList.add("tabulator-row"), this.element.classList.add("tabulator-group"), this.element.classList.add("tabulator-group-level-" + this.level), this.element.setAttribute("role", "rowgroup"), this.arrowElement = document.createElement("div"), this.arrowElement.classList.add("tabulator-group-toggle"), this.arrowElement.appendChild(e), this.groupManager.table.options.movableRows !== !1 && this.groupManager.table.modExists("moveRow") && this.groupManager.table.modules.moveRow.initializeGroupHeader(this);
  }
  createValueGroups() {
    var e = this.level + 1;
    this.groupManager.allowedValues && this.groupManager.allowedValues[e] && this.groupManager.allowedValues[e].forEach((t) => {
      this._createGroup(t, e);
    });
  }
  addBindings() {
    var e;
    this.groupManager.table.options.groupToggleElement && (e = this.groupManager.table.options.groupToggleElement == "arrow" ? this.arrowElement : this.element, e.addEventListener("click", (t) => {
      this.groupManager.table.options.groupToggleElement === "arrow" && (t.stopPropagation(), t.stopImmediatePropagation()), setTimeout(() => {
        this.toggleVisibility();
      });
    }));
  }
  _createGroup(e, t) {
    var A = t + "_" + e, i = new Zt(this.groupManager, this, t, e, this.groupManager.groupIDLookups[t].field, this.groupManager.headerGenerator[t] || this.groupManager.headerGenerator[0], this.old ? this.old.groups[A] : !1);
    this.groups[A] = i, this.groupList.push(i);
  }
  _addRowToGroup(e) {
    var t = this.level + 1;
    if (this.hasSubGroups) {
      var A = this.groupManager.groupIDLookups[t].func(e.getData()), i = t + "_" + A;
      this.groupManager.allowedValues && this.groupManager.allowedValues[t] ? this.groups[i] && this.groups[i].addRow(e) : (this.groups[i] || this._createGroup(A, t), this.groups[i].addRow(e));
    }
  }
  _addRow(e) {
    this.rows.push(e), e.modules.group = this;
  }
  insertRow(e, t, A) {
    var i = this.conformRowData({});
    e.updateData(i);
    var s = this.rows.indexOf(t);
    s > -1 ? A ? this.rows.splice(s + 1, 0, e) : this.rows.splice(s, 0, e) : A ? this.rows.push(e) : this.rows.unshift(e), e.modules.group = this, this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modules.columnCalcs.recalcGroup(this), this.groupManager.updateGroupRows(!0);
  }
  scrollHeader(e) {
    this.arrowElement && (this.arrowElement.style.marginLeft = e, this.groupList.forEach(function(t) {
      t.scrollHeader(e);
    }));
  }
  getRowIndex(e) {
  }
  //update row data to match grouping constraints
  conformRowData(e) {
    return this.field ? e[this.field] = this.key : console.warn("Data Conforming Error - Cannot conform row data to match new group as groupBy is a function"), this.parent && (e = this.parent.conformRowData(e)), e;
  }
  removeRow(e) {
    var t = this.rows.indexOf(e), A = e.getElement();
    t > -1 && this.rows.splice(t, 1), !this.groupManager.table.options.groupValues && !this.rows.length ? (this.parent ? this.parent.removeGroup(this) : this.groupManager.removeGroup(this), this.groupManager.updateGroupRows(!0)) : (A.parentNode && A.parentNode.removeChild(A), this.groupManager.blockRedraw || (this.generateGroupHeaderContents(), this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modules.columnCalcs.recalcGroup(this)));
  }
  removeGroup(e) {
    var t = e.level + "_" + e.key, A;
    this.groups[t] && (delete this.groups[t], A = this.groupList.indexOf(e), A > -1 && this.groupList.splice(A, 1), this.groupList.length || (this.parent ? this.parent.removeGroup(this) : this.groupManager.removeGroup(this)));
  }
  getHeadersAndRows() {
    var e = [];
    return e.push(this), this._visSet(), this.calcs.top && (this.calcs.top.detachElement(), this.calcs.top.deleteCells()), this.calcs.bottom && (this.calcs.bottom.detachElement(), this.calcs.bottom.deleteCells()), this.visible ? this.groupList.length ? this.groupList.forEach(function(t) {
      e = e.concat(t.getHeadersAndRows());
    }) : (this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.modules.columnCalcs.hasTopCalcs() && (this.calcs.top = this.groupManager.table.modules.columnCalcs.generateTopRow(this.rows), e.push(this.calcs.top)), e = e.concat(this.rows), this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.modules.columnCalcs.hasBottomCalcs() && (this.calcs.bottom = this.groupManager.table.modules.columnCalcs.generateBottomRow(this.rows), e.push(this.calcs.bottom))) : !this.groupList.length && this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && (this.groupManager.table.modules.columnCalcs.hasTopCalcs() && this.groupManager.table.options.groupClosedShowCalcs && (this.calcs.top = this.groupManager.table.modules.columnCalcs.generateTopRow(this.rows), e.push(this.calcs.top)), this.groupManager.table.modules.columnCalcs.hasBottomCalcs() && this.groupManager.table.options.groupClosedShowCalcs && (this.calcs.bottom = this.groupManager.table.modules.columnCalcs.generateBottomRow(this.rows), e.push(this.calcs.bottom))), e;
  }
  getData(e, t) {
    var A = [];
    return this._visSet(), (!e || e && this.visible) && this.rows.forEach((i) => {
      A.push(i.getData(t || "data"));
    }), A;
  }
  getRowCount() {
    var e = 0;
    return this.groupList.length ? this.groupList.forEach((t) => {
      e += t.getRowCount();
    }) : e = this.rows.length, e;
  }
  toggleVisibility() {
    this.visible ? this.hide() : this.show();
  }
  hide() {
    this.visible = !1, this.groupManager.table.rowManager.getRenderMode() == "basic" && !this.groupManager.table.options.pagination ? (this.element.classList.remove("tabulator-group-visible"), this.groupList.length ? this.groupList.forEach((e) => {
      var t = e.getHeadersAndRows();
      t.forEach((A) => {
        A.detachElement();
      });
    }) : this.rows.forEach((e) => {
      var t = e.getElement();
      t.parentNode.removeChild(t);
    }), this.groupManager.updateGroupRows(!0)) : this.groupManager.updateGroupRows(!0), this.groupManager.table.externalEvents.dispatch("groupVisibilityChanged", this.getComponent(), !1);
  }
  show() {
    if (this.visible = !0, this.groupManager.table.rowManager.getRenderMode() == "basic" && !this.groupManager.table.options.pagination) {
      this.element.classList.add("tabulator-group-visible");
      var e = this.generateElement();
      this.groupList.length ? this.groupList.forEach((t) => {
        var A = t.getHeadersAndRows();
        A.forEach((i) => {
          var s = i.getElement();
          e.parentNode.insertBefore(s, e.nextSibling), i.initialize(), e = s;
        });
      }) : this.rows.forEach((t) => {
        var A = t.getElement();
        e.parentNode.insertBefore(A, e.nextSibling), t.initialize(), e = A;
      }), this.groupManager.updateGroupRows(!0);
    } else
      this.groupManager.updateGroupRows(!0);
    this.groupManager.table.externalEvents.dispatch("groupVisibilityChanged", this.getComponent(), !0);
  }
  _visSet() {
    var e = [];
    typeof this.visible == "function" && (this.rows.forEach(function(t) {
      e.push(t.getData());
    }), this.visible = this.visible(this.key, this.getRowCount(), e, this.getComponent()));
  }
  getRowGroup(e) {
    var t = !1;
    return this.groupList.length ? this.groupList.forEach(function(A) {
      var i = A.getRowGroup(e);
      i && (t = i);
    }) : this.rows.find(function(A) {
      return A === e;
    }) && (t = this), t;
  }
  getSubGroups(e) {
    var t = [];
    return this.groupList.forEach(function(A) {
      t.push(e ? A.getComponent() : A);
    }), t;
  }
  getRows(e, t) {
    var A = [];
    return t && this.groupList.length ? this.groupList.forEach((i) => {
      A = A.concat(i.getRows(e, t));
    }) : this.rows.forEach(function(i) {
      A.push(e ? i.getComponent() : i);
    }), A;
  }
  generateGroupHeaderContents() {
    var e = [], t = this.getRows(!1, !0);
    for (t.forEach(function(A) {
      e.push(A.getData());
    }), this.elementContents = this.generator(this.key, this.getRowCount(), e, this.getComponent()); this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
    typeof this.elementContents == "string" ? this.element.innerHTML = this.elementContents : this.element.appendChild(this.elementContents), this.element.insertBefore(this.arrowElement, this.element.firstChild);
  }
  getPath(e = []) {
    return e.unshift(this.key), this.parent && this.parent.getPath(e), e;
  }
  ////////////// Standard Row Functions //////////////
  getElement() {
    return this.elementContents ? this.element : this.generateElement();
  }
  generateElement() {
    this.addBindings = !1, this._visSet(), this.visible ? this.element.classList.add("tabulator-group-visible") : this.element.classList.remove("tabulator-group-visible");
    for (var e = 0; e < this.element.childNodes.length; ++e)
      this.element.childNodes[e].parentNode.removeChild(this.element.childNodes[e]);
    return this.generateGroupHeaderContents(), this.element;
  }
  detachElement() {
    this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element);
  }
  //normalize the height of elements in the row
  normalizeHeight() {
    this.setHeight(this.element.clientHeight);
  }
  initialize(e) {
    (!this.initialized || e) && (this.normalizeHeight(), this.initialized = !0);
  }
  reinitialize() {
    this.initialized = !1, this.height = 0, ie.elVisible(this.element) && this.initialize(!0);
  }
  setHeight(e) {
    this.height != e && (this.height = e, this.outerHeight = this.element.offsetHeight);
  }
  //return rows outer height
  getHeight() {
    return this.outerHeight;
  }
  getGroup() {
    return this;
  }
  reinitializeHeight() {
  }
  calcHeight() {
  }
  setCellHeight() {
  }
  clearCellHeight() {
  }
  deinitializeHeight() {
  }
  rendered() {
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    return this.component || (this.component = new hh(this)), this.component;
  }
}
class to extends Y {
  constructor(e) {
    super(e), this.groupIDLookups = !1, this.startOpen = [function() {
      return !1;
    }], this.headerGenerator = [function() {
      return "";
    }], this.groupList = [], this.allowedValues = !1, this.groups = {}, this.displayHandler = this.getRows.bind(this), this.blockRedraw = !1, this.registerTableOption("groupBy", !1), this.registerTableOption("groupStartOpen", !0), this.registerTableOption("groupValues", !1), this.registerTableOption("groupUpdateOnCellEdit", !1), this.registerTableOption("groupHeader", !1), this.registerTableOption("groupHeaderPrint", null), this.registerTableOption("groupHeaderClipboard", null), this.registerTableOption("groupHeaderHtmlOutput", null), this.registerTableOption("groupHeaderDownload", null), this.registerTableOption("groupToggleElement", "arrow"), this.registerTableOption("groupClosedShowCalcs", !1), this.registerTableFunction("setGroupBy", this.setGroupBy.bind(this)), this.registerTableFunction("setGroupValues", this.setGroupValues.bind(this)), this.registerTableFunction("setGroupStartOpen", this.setGroupStartOpen.bind(this)), this.registerTableFunction("setGroupHeader", this.setGroupHeader.bind(this)), this.registerTableFunction("getGroups", this.userGetGroups.bind(this)), this.registerTableFunction("getGroupedData", this.userGetGroupedData.bind(this)), this.registerComponentFunction("row", "getGroup", this.rowGetGroup.bind(this));
  }
  //initialize group configuration
  initialize() {
    this.subscribe("table-destroy", this._blockRedrawing.bind(this)), this.subscribe("rows-wipe", this._blockRedrawing.bind(this)), this.subscribe("rows-wiped", this._restore_redrawing.bind(this)), this.table.options.groupBy && (this.table.options.groupUpdateOnCellEdit && (this.subscribe("cell-value-updated", this.cellUpdated.bind(this)), this.subscribe("row-data-changed", this.reassignRowToGroup.bind(this), 0)), this.subscribe("table-built", this.configureGroupSetup.bind(this)), this.subscribe("row-deleting", this.rowDeleting.bind(this)), this.subscribe("row-deleted", this.rowsUpdated.bind(this)), this.subscribe("scroll-horizontal", this.scrollHeaders.bind(this)), this.subscribe("rows-wipe", this.wipe.bind(this)), this.subscribe("rows-added", this.rowsUpdated.bind(this)), this.subscribe("row-moving", this.rowMoving.bind(this)), this.subscribe("row-adding-index", this.rowAddingIndex.bind(this)), this.subscribe("rows-sample", this.rowSample.bind(this)), this.subscribe("render-virtual-fill", this.virtualRenderFill.bind(this)), this.registerDisplayHandler(this.displayHandler, 20), this.initialized = !0);
  }
  _blockRedrawing() {
    this.blockRedraw = !0;
  }
  _restore_redrawing() {
    this.blockRedraw = !1;
  }
  configureGroupSetup() {
    if (this.table.options.groupBy) {
      var e = this.table.options.groupBy, t = this.table.options.groupStartOpen, A = this.table.options.groupHeader;
      if (this.allowedValues = this.table.options.groupValues, Array.isArray(e) && Array.isArray(A) && e.length > A.length && console.warn("Error creating group headers, groupHeader array is shorter than groupBy array"), this.headerGenerator = [function() {
        return "";
      }], this.startOpen = [function() {
        return !1;
      }], this.langBind("groups|item", (s, n) => {
        this.headerGenerator[0] = (o, a, l) => (typeof o > "u" ? "" : o) + "<span>(" + a + " " + (a === 1 ? s : n.groups.items) + ")</span>";
      }), this.groupIDLookups = [], e)
        this.table.modExists("columnCalcs") && this.table.options.columnCalcs != "table" && this.table.options.columnCalcs != "both" && this.table.modules.columnCalcs.removeCalcs();
      else if (this.table.modExists("columnCalcs") && this.table.options.columnCalcs != "group") {
        var i = this.table.columnManager.getRealColumns();
        i.forEach((s) => {
          s.definition.topCalc && this.table.modules.columnCalcs.initializeTopRow(), s.definition.bottomCalc && this.table.modules.columnCalcs.initializeBottomRow();
        });
      }
      Array.isArray(e) || (e = [e]), e.forEach((s, n) => {
        var o, a;
        typeof s == "function" ? o = s : (a = this.table.columnManager.getColumnByField(s), a ? o = function(l) {
          return a.getFieldValue(l);
        } : o = function(l) {
          return l[s];
        }), this.groupIDLookups.push({
          field: typeof s == "function" ? !1 : s,
          func: o,
          values: this.allowedValues ? this.allowedValues[n] : !1
        });
      }), t && (Array.isArray(t) || (t = [t]), t.forEach((s) => {
      }), this.startOpen = t), A && (this.headerGenerator = Array.isArray(A) ? A : [A]);
    } else
      this.groupList = [], this.groups = {};
  }
  rowSample(e, t) {
    if (this.table.options.groupBy) {
      var A = this.getGroups(!1)[0];
      t.push(A.getRows(!1)[0]);
    }
    return t;
  }
  virtualRenderFill() {
    var e = this.table.rowManager.tableElement, t = this.table.rowManager.getVisibleRows();
    if (this.table.options.groupBy)
      t = t.filter((A) => A.type !== "group"), e.style.minWidth = t.length ? "" : this.table.columnManager.getWidth() + "px";
    else
      return t;
  }
  rowAddingIndex(e, t, A) {
    if (this.table.options.groupBy) {
      this.assignRowToGroup(e);
      var i = e.modules.group.rows;
      return i.length > 1 && (!t || t && i.indexOf(t) == -1 ? A ? i[0] !== e && (t = i[0], this.table.rowManager.moveRowInArray(e.modules.group.rows, e, t, !A)) : i[i.length - 1] !== e && (t = i[i.length - 1], this.table.rowManager.moveRowInArray(e.modules.group.rows, e, t, !A)) : this.table.rowManager.moveRowInArray(e.modules.group.rows, e, t, !A)), t;
    }
  }
  trackChanges() {
    this.dispatch("group-changed");
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  setGroupBy(e) {
    this.table.options.groupBy = e, this.initialized || this.initialize(), this.configureGroupSetup(), !e && this.table.modExists("columnCalcs") && this.table.options.columnCalcs === !0 && this.table.modules.columnCalcs.reinitializeCalcs(), this.refreshData(), this.trackChanges();
  }
  setGroupValues(e) {
    this.table.options.groupValues = e, this.configureGroupSetup(), this.refreshData(), this.trackChanges();
  }
  setGroupStartOpen(e) {
    this.table.options.groupStartOpen = e, this.configureGroupSetup(), this.table.options.groupBy ? (this.refreshData(), this.trackChanges()) : console.warn("Grouping Update - cant refresh view, no groups have been set");
  }
  setGroupHeader(e) {
    this.table.options.groupHeader = e, this.configureGroupSetup(), this.table.options.groupBy ? (this.refreshData(), this.trackChanges()) : console.warn("Grouping Update - cant refresh view, no groups have been set");
  }
  userGetGroups(e) {
    return this.getGroups(!0);
  }
  // get grouped table data in the same format as getData()
  userGetGroupedData() {
    return this.table.options.groupBy ? this.getGroupedData() : this.getData();
  }
  ///////////////////////////////////////
  ///////// Component Functions /////////
  ///////////////////////////////////////
  rowGetGroup(e) {
    return e.modules.group ? e.modules.group.getComponent() : !1;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  rowMoving(e, t, A) {
    if (this.table.options.groupBy) {
      !A && t instanceof Zt && (t = this.table.rowManager.prevDisplayRow(e) || t);
      var i = t instanceof Zt ? t : t.modules.group, s = e instanceof Zt ? e : e.modules.group;
      i === s ? this.table.rowManager.moveRowInArray(i.rows, e, t, A) : (s && s.removeRow(e), i.insertRow(e, t, A));
    }
  }
  rowDeleting(e) {
    this.table.options.groupBy && e.modules.group && e.modules.group.removeRow(e);
  }
  rowsUpdated(e) {
    this.table.options.groupBy && this.updateGroupRows(!0);
  }
  cellUpdated(e) {
    this.table.options.groupBy && this.reassignRowToGroup(e.row);
  }
  //return appropriate rows with group headers
  getRows(e) {
    return this.table.options.groupBy && this.groupIDLookups.length ? (this.dispatchExternal("dataGrouping"), this.generateGroups(e), this.subscribedExternal("dataGrouped") && this.dispatchExternal("dataGrouped", this.getGroups(!0)), this.updateGroupRows()) : e.slice(0);
  }
  getGroups(e) {
    var t = [];
    return this.groupList.forEach(function(A) {
      t.push(e ? A.getComponent() : A);
    }), t;
  }
  getChildGroups(e) {
    var t = [];
    return e || (e = this), e.groupList.forEach((A) => {
      A.groupList.length ? t = t.concat(this.getChildGroups(A)) : t.push(A);
    }), t;
  }
  wipe() {
    this.table.options.groupBy && (this.groupList.forEach(function(e) {
      e.wipe();
    }), this.groupList = [], this.groups = {});
  }
  pullGroupListData(e) {
    var t = [];
    return e.forEach((A) => {
      var i = {};
      i.level = 0, i.rowCount = 0, i.headerContent = "";
      var s = [];
      A.hasSubGroups ? (s = this.pullGroupListData(A.groupList), i.level = A.level, i.rowCount = s.length - A.groupList.length, i.headerContent = A.generator(A.key, i.rowCount, A.rows, A), t.push(i), t = t.concat(s)) : (i.level = A.level, i.headerContent = A.generator(A.key, A.rows.length, A.rows, A), i.rowCount = A.getRows().length, t.push(i), A.getRows().forEach((n) => {
        t.push(n.getData("data"));
      }));
    }), t;
  }
  getGroupedData() {
    return this.pullGroupListData(this.groupList);
  }
  getRowGroup(e) {
    var t = !1;
    return this.options("dataTree") && (e = this.table.modules.dataTree.getTreeParentRoot(e)), this.groupList.forEach((A) => {
      var i = A.getRowGroup(e);
      i && (t = i);
    }), t;
  }
  countGroups() {
    return this.groupList.length;
  }
  generateGroups(e) {
    var t = this.groups;
    this.groups = {}, this.groupList = [], this.allowedValues && this.allowedValues[0] ? (this.allowedValues[0].forEach((A) => {
      this.createGroup(A, 0, t);
    }), e.forEach((A) => {
      this.assignRowToExistingGroup(A, t);
    })) : e.forEach((A) => {
      this.assignRowToGroup(A, t);
    }), Object.values(t).forEach((A) => {
      A.wipe(!0);
    });
  }
  createGroup(e, t, A) {
    var i = t + "_" + e, s;
    A = A || [], s = new Zt(this, !1, t, e, this.groupIDLookups[0].field, this.headerGenerator[0], A[i]), this.groups[i] = s, this.groupList.push(s);
  }
  assignRowToExistingGroup(e, t) {
    var A = this.groupIDLookups[0].func(e.getData()), i = "0_" + A;
    this.groups[i] && this.groups[i].addRow(e);
  }
  assignRowToGroup(e, t) {
    var A = this.groupIDLookups[0].func(e.getData()), i = !this.groups["0_" + A];
    return i && this.createGroup(A, 0, t), this.groups["0_" + A].addRow(e), !i;
  }
  reassignRowToGroup(e) {
    if (e.type === "row") {
      var t = e.modules.group, A = t.getPath(), i = this.getExpectedPath(e), s;
      s = A.length == i.length && A.every((n, o) => n === i[o]), s || (t.removeRow(e), this.assignRowToGroup(e, this.groups), this.refreshData(!0));
    }
  }
  getExpectedPath(e) {
    var t = [], A = e.getData();
    return this.groupIDLookups.forEach((i) => {
      t.push(i.func(A));
    }), t;
  }
  updateGroupRows(e) {
    var t = [];
    return this.blockRedraw || (this.groupList.forEach((A) => {
      t = t.concat(A.getHeadersAndRows());
    }), e && this.refreshData(!0)), t;
  }
  scrollHeaders(e) {
    this.table.options.groupBy && (this.table.options.renderHorizontal === "virtual" && (e -= this.table.columnManager.renderer.vDomPadLeft), e = e + "px", this.groupList.forEach((t) => {
      t.scrollHeader(e);
    }));
  }
  removeGroup(e) {
    var t = e.level + "_" + e.key, A;
    this.groups[t] && (delete this.groups[t], A = this.groupList.indexOf(e), A > -1 && this.groupList.splice(A, 1));
  }
  checkBasicModeGroupHeaderWidth() {
    var e = this.table.rowManager.tableElement, t = !0;
    this.table.rowManager.getDisplayRows().forEach((A, i) => {
      this.table.rowManager.styleRow(A, i), e.appendChild(A.getElement()), A.initialize(!0), A.type !== "group" && (t = !1);
    }), t ? e.style.minWidth = this.table.columnManager.getWidth() + "px" : e.style.minWidth = "";
  }
}
U(to, "moduleName", "groupRows");
var uh = {
  cellEdit: function(r) {
    r.component.setValueProcessData(r.data.oldValue), r.component.cellRendered();
  },
  rowAdd: function(r) {
    r.component.deleteActual(), this.table.rowManager.checkPlaceholder();
  },
  rowDelete: function(r) {
    var e = this.table.rowManager.addRowActual(r.data.data, r.data.pos, r.data.index);
    this.table.options.groupBy && this.table.modExists("groupRows") && this.table.modules.groupRows.updateGroupRows(!0), this._rebindRow(r.component, e), this.table.rowManager.checkPlaceholder();
  },
  rowMove: function(r) {
    var e = r.data.posFrom - r.data.posTo > 0;
    this.table.rowManager.moveRowActual(r.component, this.table.rowManager.getRowFromPosition(r.data.posFrom), e), this.table.rowManager.regenerateRowPositions(), this.table.rowManager.reRenderInPosition();
  }
}, ch = {
  cellEdit: function(r) {
    r.component.setValueProcessData(r.data.newValue), r.component.cellRendered();
  },
  rowAdd: function(r) {
    var e = this.table.rowManager.addRowActual(r.data.data, r.data.pos, r.data.index);
    this.table.options.groupBy && this.table.modExists("groupRows") && this.table.modules.groupRows.updateGroupRows(!0), this._rebindRow(r.component, e), this.table.rowManager.checkPlaceholder();
  },
  rowDelete: function(r) {
    r.component.deleteActual(), this.table.rowManager.checkPlaceholder();
  },
  rowMove: function(r) {
    this.table.rowManager.moveRowActual(r.component, this.table.rowManager.getRowFromPosition(r.data.posTo), r.data.after), this.table.rowManager.regenerateRowPositions(), this.table.rowManager.reRenderInPosition();
  }
}, dh = {
  undo: ["ctrl + 90", "meta + 90"],
  redo: ["ctrl + 89", "meta + 89"]
}, fh = {
  undo: function(r) {
    var e = !1;
    this.table.options.history && this.table.modExists("history") && this.table.modExists("edit") && (e = this.table.modules.edit.currentCell, e || (r.preventDefault(), this.table.modules.history.undo()));
  },
  redo: function(r) {
    var e = !1;
    this.table.options.history && this.table.modExists("history") && this.table.modExists("edit") && (e = this.table.modules.edit.currentCell, e || (r.preventDefault(), this.table.modules.history.redo()));
  }
}, gh = {
  keybindings: {
    bindings: dh,
    actions: fh
  }
};
const bt = class bt extends Y {
  constructor(e) {
    super(e), this.history = [], this.index = -1, this.registerTableOption("history", !1);
  }
  initialize() {
    this.table.options.history && (this.subscribe("cell-value-updated", this.cellUpdated.bind(this)), this.subscribe("cell-delete", this.clearComponentHistory.bind(this)), this.subscribe("row-delete", this.rowDeleted.bind(this)), this.subscribe("rows-wipe", this.clear.bind(this)), this.subscribe("row-added", this.rowAdded.bind(this)), this.subscribe("row-move", this.rowMoved.bind(this))), this.registerTableFunction("undo", this.undo.bind(this)), this.registerTableFunction("redo", this.redo.bind(this)), this.registerTableFunction("getHistoryUndoSize", this.getHistoryUndoSize.bind(this)), this.registerTableFunction("getHistoryRedoSize", this.getHistoryRedoSize.bind(this)), this.registerTableFunction("clearHistory", this.clear.bind(this));
  }
  rowMoved(e, t, A) {
    this.action("rowMove", e, { posFrom: e.getPosition(), posTo: t.getPosition(), to: t, after: A });
  }
  rowAdded(e, t, A, i) {
    this.action("rowAdd", e, { data: t, pos: A, index: i });
  }
  rowDeleted(e) {
    var t, A;
    this.table.options.groupBy ? (A = e.getComponent().getGroup()._getSelf().rows, t = A.indexOf(e), t && (t = A[t - 1])) : (t = e.table.rowManager.getRowIndex(e), t && (t = e.table.rowManager.rows[t - 1])), this.action("rowDelete", e, { data: e.getData(), pos: !t, index: t });
  }
  cellUpdated(e) {
    this.action("cellEdit", e, { oldValue: e.oldValue, newValue: e.value });
  }
  clear() {
    this.history = [], this.index = -1;
  }
  action(e, t, A) {
    this.history = this.history.slice(0, this.index + 1), this.history.push({
      type: e,
      component: t,
      data: A
    }), this.index++;
  }
  getHistoryUndoSize() {
    return this.index + 1;
  }
  getHistoryRedoSize() {
    return this.history.length - (this.index + 1);
  }
  clearComponentHistory(e) {
    var t = this.history.findIndex(function(A) {
      return A.component === e;
    });
    t > -1 && (this.history.splice(t, 1), t <= this.index && this.index--, this.clearComponentHistory(e));
  }
  undo() {
    if (this.index > -1) {
      let e = this.history[this.index];
      return bt.undoers[e.type].call(this, e), this.index--, this.dispatchExternal("historyUndo", e.type, e.component.getComponent(), e.data), !0;
    } else
      return console.warn(this.options("history") ? "History Undo Error - No more history to undo" : "History module not enabled"), !1;
  }
  redo() {
    if (this.history.length - 1 > this.index) {
      this.index++;
      let e = this.history[this.index];
      return bt.redoers[e.type].call(this, e), this.dispatchExternal("historyRedo", e.type, e.component.getComponent(), e.data), !0;
    } else
      return console.warn(this.options("history") ? "History Redo Error - No more history to redo" : "History module not enabled"), !1;
  }
  //rebind rows to new element after deletion
  _rebindRow(e, t) {
    this.history.forEach(function(A) {
      if (A.component instanceof He)
        A.component === e && (A.component = t);
      else if (A.component instanceof OA && A.component.row === e) {
        var i = A.component.column.getField();
        i && (A.component = t.getCell(i));
      }
    });
  }
};
U(bt, "moduleName", "history"), U(bt, "moduleExtensions", gh), //load defaults
U(bt, "undoers", uh), U(bt, "redoers", ch);
let Ps = bt;
class Ao extends Y {
  constructor(e) {
    super(e), this.fieldIndex = [], this.hasIndex = !1;
  }
  initialize() {
    this.tableElementCheck();
  }
  tableElementCheck() {
    this.table.originalElement && this.table.originalElement.tagName === "TABLE" && (this.table.originalElement.childNodes.length ? this.parseTable() : console.warn("Unable to parse data from empty table tag, Tabulator should be initialized on a div tag unless importing data from a table element."));
  }
  parseTable() {
    var e = this.table.originalElement, t = this.table.options, A = e.getElementsByTagName("th"), i = e.getElementsByTagName("tbody")[0], s = [];
    this.hasIndex = !1, this.dispatchExternal("htmlImporting"), i = i ? i.getElementsByTagName("tr") : [], this._extractOptions(e, t), A.length ? this._extractHeaders(A, i) : this._generateBlankHeaders(A, i);
    for (var n = 0; n < i.length; n++) {
      var o = i[n], a = o.getElementsByTagName("td"), l = {};
      this.hasIndex || (l[t.index] = n);
      for (var h = 0; h < a.length; h++) {
        var u = a[h];
        typeof this.fieldIndex[h] < "u" && (l[this.fieldIndex[h]] = u.innerHTML);
      }
      s.push(l);
    }
    t.data = s, this.dispatchExternal("htmlImported");
  }
  //extract tabulator attribute options
  _extractOptions(e, t, A) {
    var i = e.attributes, s = Object.keys(A || t), n = {};
    s.forEach((h) => {
      n[h.toLowerCase()] = h;
    });
    for (var o in i) {
      var a = i[o], l;
      a && typeof a == "object" && a.name && a.name.indexOf("tabulator-") === 0 && (l = a.name.replace("tabulator-", ""), typeof n[l] < "u" && (t[n[l]] = this._attribValue(a.value)));
    }
  }
  //get value of attribute
  _attribValue(e) {
    return e === "true" ? !0 : e === "false" ? !1 : e;
  }
  //find column if it has already been defined
  _findCol(e) {
    var t = this.table.options.columns.find((A) => A.title === e);
    return t || !1;
  }
  //extract column from headers
  _extractHeaders(e, t) {
    for (var A = 0; A < e.length; A++) {
      var i = e[A], s = !1, n = this._findCol(i.textContent), o;
      n ? s = !0 : n = { title: i.textContent.trim() }, n.field || (n.field = i.textContent.trim().toLowerCase().replaceAll(" ", "_")), o = i.getAttribute("width"), o && !n.width && (n.width = o), this._extractOptions(i, n, this.table.columnManager.optionsList.registeredDefaults), this.fieldIndex[A] = n.field, n.field == this.table.options.index && (this.hasIndex = !0), s || this.table.options.columns.push(n);
    }
  }
  //generate blank headers
  _generateBlankHeaders(e, t) {
    for (var A = 0; A < e.length; A++) {
      var i = e[A], s = { title: "", field: "col" + A };
      this.fieldIndex[A] = s.field;
      var n = i.getAttribute("width");
      n && (s.width = n), this.table.options.columns.push(s);
    }
  }
}
U(Ao, "moduleName", "htmlTableImport");
function ph(r) {
  var e = [], t = 0, A = 0, i = !1;
  for (let s = 0; s < r.length; s++) {
    let n = r[s], o = r[s + 1];
    if (e[t] || (e[t] = []), e[t][A] || (e[t][A] = ""), n == '"' && i && o == '"') {
      e[t][A] += n, s++;
      continue;
    }
    if (n == '"') {
      i = !i;
      continue;
    }
    if (n == "," && !i) {
      A++;
      continue;
    }
    if (n == "\r" && o == `
` && !i) {
      A = 0, t++, s++;
      continue;
    }
    if ((n == "\r" || n == `
`) && !i) {
      A = 0, t++;
      continue;
    }
    e[t][A] += n;
  }
  return e;
}
function mh(r) {
  try {
    return JSON.parse(r);
  } catch (e) {
    return console.warn("JSON Import Error - File contents is invalid JSON", e), Promise.reject();
  }
}
function wh(r) {
  return r;
}
function bh(r) {
  var e = this.dependencyRegistry.lookup("XLSX"), t = e.read(r), A = t.Sheets[t.SheetNames[0]];
  return e.utils.sheet_to_json(A, { header: 1 });
}
var Bh = {
  csv: ph,
  json: mh,
  array: wh,
  xlsx: bh
};
const LA = class LA extends Y {
  constructor(e) {
    super(e), this.registerTableOption("importFormat"), this.registerTableOption("importReader", "text"), this.registerTableOption("importHeaderTransform"), this.registerTableOption("importValueTransform"), this.registerTableOption("importDataValidator"), this.registerTableOption("importFileValidator");
  }
  initialize() {
    this.registerTableFunction("import", this.importFromFile.bind(this)), this.table.options.importFormat && (this.subscribe("data-loading", this.loadDataCheck.bind(this), 10), this.subscribe("data-load", this.loadData.bind(this), 10));
  }
  loadDataCheck(e) {
    return this.table.options.importFormat && (typeof e == "string" || Array.isArray(e) && e.length && Array.isArray(e));
  }
  loadData(e, t, A, i, s) {
    return this.importData(this.lookupImporter(), e).then(this.structureData.bind(this)).catch((n) => (console.error("Import Error:", n || "Unable to import data"), Promise.reject(n)));
  }
  lookupImporter(e) {
    var t;
    return e || (e = this.table.options.importFormat), typeof e == "string" ? t = LA.importers[e] : t = e, t || console.error("Import Error - Importer not found:", e), t;
  }
  importFromFile(e, t, A) {
    var i = this.lookupImporter(e);
    if (i)
      return this.pickFile(t, A).then(this.importData.bind(this, i)).then(this.structureData.bind(this)).then(this.mutateData.bind(this)).then(this.validateData.bind(this)).then(this.setData.bind(this)).catch((s) => (this.dispatch("import-error", s), this.dispatchExternal("importError", s), console.error("Import Error:", s || "Unable to import file"), this.table.dataLoader.alertError(), setTimeout(() => {
        this.table.dataLoader.clearAlert();
      }, 3e3), Promise.reject(s)));
  }
  pickFile(e, t) {
    return new Promise((A, i) => {
      var s = document.createElement("input");
      s.type = "file", s.accept = e, s.addEventListener("change", (n) => {
        var o = s.files[0], a = new FileReader(), l = this.validateFile(o);
        if (l === !0) {
          switch (this.dispatch("import-importing", s.files), this.dispatchExternal("importImporting", s.files), t || this.table.options.importReader) {
            case "buffer":
              a.readAsArrayBuffer(o);
              break;
            case "binary":
              a.readAsBinaryString(o);
              break;
            case "url":
              a.readAsDataURL(o);
              break;
            case "text":
            default:
              a.readAsText(o);
          }
          a.onload = (h) => {
            A(a.result);
          }, a.onerror = (h) => {
            console.warn("File Load Error - Unable to read file"), i(h);
          };
        } else
          i(l);
      }), this.dispatch("import-choose"), this.dispatchExternal("importChoose"), s.click();
    });
  }
  importData(e, t) {
    var A;
    return this.table.dataLoader.alertLoader(), new Promise((i, s) => {
      setTimeout(() => {
        A = e.call(this.table, t), A instanceof Promise || A ? i(A) : s();
      }, 10);
    });
  }
  structureData(e) {
    var t = [];
    return Array.isArray(e) && e.length && Array.isArray(e[0]) ? (this.table.options.autoColumns ? t = this.structureArrayToObject(e) : t = this.structureArrayToColumns(e), t) : e;
  }
  mutateData(e) {
    var t = [];
    return Array.isArray(e) ? e.forEach((A) => {
      t.push(this.table.modules.mutator.transformRow(A, "import"));
    }) : t = e, t;
  }
  transformHeader(e) {
    var t = [];
    if (this.table.options.importHeaderTransform)
      e.forEach((A) => {
        t.push(this.table.options.importHeaderTransform.call(this.table, A, e));
      });
    else
      return e;
    return t;
  }
  transformData(e) {
    var t = [];
    if (this.table.options.importValueTransform)
      e.forEach((A) => {
        t.push(this.table.options.importValueTransform.call(this.table, A, e));
      });
    else
      return e;
    return t;
  }
  structureArrayToObject(e) {
    var t = this.transformHeader(e.shift()), A = e.map((i) => {
      var s = {};
      return i = this.transformData(i), t.forEach((n, o) => {
        s[n] = i[o];
      }), s;
    });
    return A;
  }
  structureArrayToColumns(e) {
    var t = [], A = this.transformHeader(e[0]), i = this.table.getColumns();
    return i[0] && A[0] && i[0].getDefinition().title === A[0] && e.shift(), e.forEach((s) => {
      var n = {};
      s = this.transformData(s), s.forEach((o, a) => {
        var l = i[a];
        l && (n[l.getField()] = o);
      }), t.push(n);
    }), t;
  }
  validateFile(e) {
    return this.table.options.importFileValidator ? this.table.options.importFileValidator.call(this.table, e) : !0;
  }
  validateData(e) {
    var t;
    return this.table.options.importDataValidator ? (t = this.table.options.importDataValidator.call(this.table, e), t === !0 ? e : Promise.reject(t)) : e;
  }
  setData(e) {
    return this.dispatch("import-imported", e), this.dispatchExternal("importImported", e), this.table.dataLoader.clearAlert(), this.table.setData(e);
  }
};
U(LA, "moduleName", "import"), //load defaults
U(LA, "importers", Bh);
let Vs = LA;
class io extends Y {
  constructor(e) {
    super(e), this.eventMap = {
      //row events
      rowClick: "row-click",
      rowDblClick: "row-dblclick",
      rowContext: "row-contextmenu",
      rowMouseEnter: "row-mouseenter",
      rowMouseLeave: "row-mouseleave",
      rowMouseOver: "row-mouseover",
      rowMouseOut: "row-mouseout",
      rowMouseMove: "row-mousemove",
      rowMouseDown: "row-mousedown",
      rowMouseUp: "row-mouseup",
      rowTap: "row",
      rowDblTap: "row",
      rowTapHold: "row",
      //cell events
      cellClick: "cell-click",
      cellDblClick: "cell-dblclick",
      cellContext: "cell-contextmenu",
      cellMouseEnter: "cell-mouseenter",
      cellMouseLeave: "cell-mouseleave",
      cellMouseOver: "cell-mouseover",
      cellMouseOut: "cell-mouseout",
      cellMouseMove: "cell-mousemove",
      cellMouseDown: "cell-mousedown",
      cellMouseUp: "cell-mouseup",
      cellTap: "cell",
      cellDblTap: "cell",
      cellTapHold: "cell",
      //column header events
      headerClick: "column-click",
      headerDblClick: "column-dblclick",
      headerContext: "column-contextmenu",
      headerMouseEnter: "column-mouseenter",
      headerMouseLeave: "column-mouseleave",
      headerMouseOver: "column-mouseover",
      headerMouseOut: "column-mouseout",
      headerMouseMove: "column-mousemove",
      headerMouseDown: "column-mousedown",
      headerMouseUp: "column-mouseup",
      headerTap: "column",
      headerDblTap: "column",
      headerTapHold: "column",
      //group header
      groupClick: "group-click",
      groupDblClick: "group-dblclick",
      groupContext: "group-contextmenu",
      groupMouseEnter: "group-mouseenter",
      groupMouseLeave: "group-mouseleave",
      groupMouseOver: "group-mouseover",
      groupMouseOut: "group-mouseout",
      groupMouseMove: "group-mousemove",
      groupMouseDown: "group-mousedown",
      groupMouseUp: "group-mouseup",
      groupTap: "group",
      groupDblTap: "group",
      groupTapHold: "group"
    }, this.subscribers = {}, this.touchSubscribers = {}, this.columnSubscribers = {}, this.touchWatchers = {
      row: {
        tap: null,
        tapDbl: null,
        tapHold: null
      },
      cell: {
        tap: null,
        tapDbl: null,
        tapHold: null
      },
      column: {
        tap: null,
        tapDbl: null,
        tapHold: null
      },
      group: {
        tap: null,
        tapDbl: null,
        tapHold: null
      }
    }, this.registerColumnOption("headerClick"), this.registerColumnOption("headerDblClick"), this.registerColumnOption("headerContext"), this.registerColumnOption("headerMouseEnter"), this.registerColumnOption("headerMouseLeave"), this.registerColumnOption("headerMouseOver"), this.registerColumnOption("headerMouseOut"), this.registerColumnOption("headerMouseMove"), this.registerColumnOption("headerMouseDown"), this.registerColumnOption("headerMouseUp"), this.registerColumnOption("headerTap"), this.registerColumnOption("headerDblTap"), this.registerColumnOption("headerTapHold"), this.registerColumnOption("cellClick"), this.registerColumnOption("cellDblClick"), this.registerColumnOption("cellContext"), this.registerColumnOption("cellMouseEnter"), this.registerColumnOption("cellMouseLeave"), this.registerColumnOption("cellMouseOver"), this.registerColumnOption("cellMouseOut"), this.registerColumnOption("cellMouseMove"), this.registerColumnOption("cellMouseDown"), this.registerColumnOption("cellMouseUp"), this.registerColumnOption("cellTap"), this.registerColumnOption("cellDblTap"), this.registerColumnOption("cellTapHold");
  }
  initialize() {
    this.initializeExternalEvents(), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("cell-dblclick", this.cellContentsSelectionFixer.bind(this)), this.subscribe("scroll-horizontal", this.clearTouchWatchers.bind(this)), this.subscribe("scroll-vertical", this.clearTouchWatchers.bind(this));
  }
  clearTouchWatchers() {
    var e = Object.values(this.touchWatchers);
    e.forEach((t) => {
      for (let A in t)
        t[A] = null;
    });
  }
  cellContentsSelectionFixer(e, t) {
    var A;
    if (!(this.table.modExists("edit") && this.table.modules.edit.currentCell === t)) {
      e.preventDefault();
      try {
        document.selection ? (A = document.body.createTextRange(), A.moveToElementText(t.getElement()), A.select()) : window.getSelection && (A = document.createRange(), A.selectNode(t.getElement()), window.getSelection().removeAllRanges(), window.getSelection().addRange(A));
      } catch {
      }
    }
  }
  initializeExternalEvents() {
    for (let e in this.eventMap)
      this.subscriptionChangeExternal(e, this.subscriptionChanged.bind(this, e));
  }
  subscriptionChanged(e, t) {
    t ? this.subscribers[e] || (this.eventMap[e].includes("-") ? (this.subscribers[e] = this.handle.bind(this, e), this.subscribe(this.eventMap[e], this.subscribers[e])) : this.subscribeTouchEvents(e)) : this.eventMap[e].includes("-") ? this.subscribers[e] && !this.columnSubscribers[e] && !this.subscribedExternal(e) && (this.unsubscribe(this.eventMap[e], this.subscribers[e]), delete this.subscribers[e]) : this.unsubscribeTouchEvents(e);
  }
  subscribeTouchEvents(e) {
    var t = this.eventMap[e];
    this.touchSubscribers[t + "-touchstart"] || (this.touchSubscribers[t + "-touchstart"] = this.handleTouch.bind(this, t, "start"), this.touchSubscribers[t + "-touchend"] = this.handleTouch.bind(this, t, "end"), this.subscribe(t + "-touchstart", this.touchSubscribers[t + "-touchstart"]), this.subscribe(t + "-touchend", this.touchSubscribers[t + "-touchend"])), this.subscribers[e] = !0;
  }
  unsubscribeTouchEvents(e) {
    var t = !0, A = this.eventMap[e];
    if (this.subscribers[e] && !this.subscribedExternal(e)) {
      delete this.subscribers[e];
      for (let i in this.eventMap)
        this.eventMap[i] === A && this.subscribers[i] && (t = !1);
      t && (this.unsubscribe(A + "-touchstart", this.touchSubscribers[A + "-touchstart"]), this.unsubscribe(A + "-touchend", this.touchSubscribers[A + "-touchend"]), delete this.touchSubscribers[A + "-touchstart"], delete this.touchSubscribers[A + "-touchend"]);
    }
  }
  initializeColumn(e) {
    var t = e.definition;
    for (let A in this.eventMap)
      t[A] && (this.subscriptionChanged(A, !0), this.columnSubscribers[A] || (this.columnSubscribers[A] = []), this.columnSubscribers[A].push(e));
  }
  handle(e, t, A) {
    this.dispatchEvent(e, t, A);
  }
  handleTouch(e, t, A, i) {
    var s = this.touchWatchers[e];
    switch (e === "column" && (e = "header"), t) {
      case "start":
        s.tap = !0, clearTimeout(s.tapHold), s.tapHold = setTimeout(() => {
          clearTimeout(s.tapHold), s.tapHold = null, s.tap = null, clearTimeout(s.tapDbl), s.tapDbl = null, this.dispatchEvent(e + "TapHold", A, i);
        }, 1e3);
        break;
      case "end":
        s.tap && (s.tap = null, this.dispatchEvent(e + "Tap", A, i)), s.tapDbl ? (clearTimeout(s.tapDbl), s.tapDbl = null, this.dispatchEvent(e + "DblTap", A, i)) : s.tapDbl = setTimeout(() => {
          clearTimeout(s.tapDbl), s.tapDbl = null;
        }, 300), clearTimeout(s.tapHold), s.tapHold = null;
        break;
    }
  }
  dispatchEvent(e, t, A) {
    var i = A.getComponent(), s;
    this.columnSubscribers[e] && (A instanceof OA ? s = A.column.definition[e] : A instanceof St && (s = A.definition[e]), s && s(t, i)), this.dispatchExternal(e, t, i);
  }
}
U(io, "moduleName", "interaction");
var Ch = {
  navPrev: "shift + 9",
  navNext: 9,
  navUp: 38,
  navDown: 40,
  navLeft: 37,
  navRight: 39,
  scrollPageUp: 33,
  scrollPageDown: 34,
  scrollToStart: 36,
  scrollToEnd: 35
}, vh = {
  keyBlock: function(r) {
    r.stopPropagation(), r.preventDefault();
  },
  scrollPageUp: function(r) {
    var e = this.table.rowManager, t = e.scrollTop - e.element.clientHeight;
    r.preventDefault(), e.displayRowsCount && (t >= 0 ? e.element.scrollTop = t : e.scrollToRow(e.getDisplayRows()[0])), this.table.element.focus();
  },
  scrollPageDown: function(r) {
    var e = this.table.rowManager, t = e.scrollTop + e.element.clientHeight, A = e.element.scrollHeight;
    r.preventDefault(), e.displayRowsCount && (t <= A ? e.element.scrollTop = t : e.scrollToRow(e.getDisplayRows()[e.displayRowsCount - 1])), this.table.element.focus();
  },
  scrollToStart: function(r) {
    var e = this.table.rowManager;
    r.preventDefault(), e.displayRowsCount && e.scrollToRow(e.getDisplayRows()[0]), this.table.element.focus();
  },
  scrollToEnd: function(r) {
    var e = this.table.rowManager;
    r.preventDefault(), e.displayRowsCount && e.scrollToRow(e.getDisplayRows()[e.displayRowsCount - 1]), this.table.element.focus();
  },
  navPrev: function(r) {
    this.dispatch("keybinding-nav-prev", r);
  },
  navNext: function(r) {
    this.dispatch("keybinding-nav-next", r);
  },
  navLeft: function(r) {
    this.dispatch("keybinding-nav-left", r);
  },
  navRight: function(r) {
    this.dispatch("keybinding-nav-right", r);
  },
  navUp: function(r) {
    this.dispatch("keybinding-nav-up", r);
  },
  navDown: function(r) {
    this.dispatch("keybinding-nav-down", r);
  }
};
const Bt = class Bt extends Y {
  constructor(e) {
    super(e), this.watchKeys = null, this.pressedKeys = null, this.keyupBinding = !1, this.keydownBinding = !1, this.registerTableOption("keybindings", {}), this.registerTableOption("tabEndNewRow", !1);
  }
  initialize() {
    var e = this.table.options.keybindings, t = {};
    this.watchKeys = {}, this.pressedKeys = [], e !== !1 && (Object.assign(t, Bt.bindings), Object.assign(t, e), this.mapBindings(t), this.bindEvents()), this.subscribe("table-destroy", this.clearBindings.bind(this));
  }
  mapBindings(e) {
    for (let t in e)
      Bt.actions[t] ? e[t] && (typeof e[t] != "object" && (e[t] = [e[t]]), e[t].forEach((A) => {
        var i = Array.isArray(A) ? A : [A];
        i.forEach((s) => {
          this.mapBinding(t, s);
        });
      })) : console.warn("Key Binding Error - no such action:", t);
  }
  mapBinding(e, t) {
    var A = {
      action: Bt.actions[e],
      keys: [],
      ctrl: !1,
      shift: !1,
      meta: !1
    }, i = t.toString().toLowerCase().split(" ").join("").split("+");
    i.forEach((s) => {
      switch (s) {
        case "ctrl":
          A.ctrl = !0;
          break;
        case "shift":
          A.shift = !0;
          break;
        case "meta":
          A.meta = !0;
          break;
        default:
          s = isNaN(s) ? s.toUpperCase().charCodeAt(0) : parseInt(s), A.keys.push(s), this.watchKeys[s] || (this.watchKeys[s] = []), this.watchKeys[s].push(A);
      }
    });
  }
  bindEvents() {
    var e = this;
    this.keyupBinding = function(t) {
      var A = t.keyCode, i = e.watchKeys[A];
      i && (e.pressedKeys.push(A), i.forEach(function(s) {
        e.checkBinding(t, s);
      }));
    }, this.keydownBinding = function(t) {
      var A = t.keyCode, i = e.watchKeys[A];
      if (i) {
        var s = e.pressedKeys.indexOf(A);
        s > -1 && e.pressedKeys.splice(s, 1);
      }
    }, this.table.element.addEventListener("keydown", this.keyupBinding), this.table.element.addEventListener("keyup", this.keydownBinding);
  }
  clearBindings() {
    this.keyupBinding && this.table.element.removeEventListener("keydown", this.keyupBinding), this.keydownBinding && this.table.element.removeEventListener("keyup", this.keydownBinding);
  }
  checkBinding(e, t) {
    var A = !0;
    return e.ctrlKey == t.ctrl && e.shiftKey == t.shift && e.metaKey == t.meta ? (t.keys.forEach((i) => {
      var s = this.pressedKeys.indexOf(i);
      s == -1 && (A = !1);
    }), A && t.action.call(this, e), !0) : !1;
  }
};
U(Bt, "moduleName", "keybindings"), //load defaults
U(Bt, "bindings", Ch), U(Bt, "actions", vh);
let Ns = Bt;
class so extends Y {
  constructor(e) {
    super(e), this.menuContainer = null, this.nestedMenuBlock = !1, this.currentComponent = null, this.rootPopup = null, this.columnSubscribers = {}, this.registerTableOption("rowContextMenu", !1), this.registerTableOption("rowClickMenu", !1), this.registerTableOption("rowDblClickMenu", !1), this.registerTableOption("groupContextMenu", !1), this.registerTableOption("groupClickMenu", !1), this.registerTableOption("groupDblClickMenu", !1), this.registerColumnOption("headerContextMenu"), this.registerColumnOption("headerClickMenu"), this.registerColumnOption("headerDblClickMenu"), this.registerColumnOption("headerMenu"), this.registerColumnOption("headerMenuIcon"), this.registerColumnOption("contextMenu"), this.registerColumnOption("clickMenu"), this.registerColumnOption("dblClickMenu");
  }
  initialize() {
    this.deprecatedOptionsCheck(), this.initializeRowWatchers(), this.initializeGroupWatchers(), this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  deprecatedOptionsCheck() {
  }
  initializeRowWatchers() {
    this.table.options.rowContextMenu && (this.subscribe("row-contextmenu", this.loadMenuEvent.bind(this, this.table.options.rowContextMenu)), this.table.on("rowTapHold", this.loadMenuEvent.bind(this, this.table.options.rowContextMenu))), this.table.options.rowClickMenu && this.subscribe("row-click", this.loadMenuEvent.bind(this, this.table.options.rowClickMenu)), this.table.options.rowDblClickMenu && this.subscribe("row-dblclick", this.loadMenuEvent.bind(this, this.table.options.rowDblClickMenu));
  }
  initializeGroupWatchers() {
    this.table.options.groupContextMenu && (this.subscribe("group-contextmenu", this.loadMenuEvent.bind(this, this.table.options.groupContextMenu)), this.table.on("groupTapHold", this.loadMenuEvent.bind(this, this.table.options.groupContextMenu))), this.table.options.groupClickMenu && this.subscribe("group-click", this.loadMenuEvent.bind(this, this.table.options.groupClickMenu)), this.table.options.groupDblClickMenu && this.subscribe("group-dblclick", this.loadMenuEvent.bind(this, this.table.options.groupDblClickMenu));
  }
  initializeColumn(e) {
    var t = e.definition;
    t.headerContextMenu && !this.columnSubscribers.headerContextMenu && (this.columnSubscribers.headerContextMenu = this.loadMenuTableColumnEvent.bind(this, "headerContextMenu"), this.subscribe("column-contextmenu", this.columnSubscribers.headerContextMenu), this.table.on("headerTapHold", this.loadMenuTableColumnEvent.bind(this, "headerContextMenu"))), t.headerClickMenu && !this.columnSubscribers.headerClickMenu && (this.columnSubscribers.headerClickMenu = this.loadMenuTableColumnEvent.bind(this, "headerClickMenu"), this.subscribe("column-click", this.columnSubscribers.headerClickMenu)), t.headerDblClickMenu && !this.columnSubscribers.headerDblClickMenu && (this.columnSubscribers.headerDblClickMenu = this.loadMenuTableColumnEvent.bind(this, "headerDblClickMenu"), this.subscribe("column-dblclick", this.columnSubscribers.headerDblClickMenu)), t.headerMenu && this.initializeColumnHeaderMenu(e), t.contextMenu && !this.columnSubscribers.contextMenu && (this.columnSubscribers.contextMenu = this.loadMenuTableCellEvent.bind(this, "contextMenu"), this.subscribe("cell-contextmenu", this.columnSubscribers.contextMenu), this.table.on("cellTapHold", this.loadMenuTableCellEvent.bind(this, "contextMenu"))), t.clickMenu && !this.columnSubscribers.clickMenu && (this.columnSubscribers.clickMenu = this.loadMenuTableCellEvent.bind(this, "clickMenu"), this.subscribe("cell-click", this.columnSubscribers.clickMenu)), t.dblClickMenu && !this.columnSubscribers.dblClickMenu && (this.columnSubscribers.dblClickMenu = this.loadMenuTableCellEvent.bind(this, "dblClickMenu"), this.subscribe("cell-dblclick", this.columnSubscribers.dblClickMenu));
  }
  initializeColumnHeaderMenu(e) {
    var t = e.definition.headerMenuIcon, A;
    A = document.createElement("span"), A.classList.add("tabulator-header-popup-button"), t ? (typeof t == "function" && (t = t(e.getComponent())), t instanceof HTMLElement ? A.appendChild(t) : A.innerHTML = t) : A.innerHTML = "&vellip;", A.addEventListener("click", (i) => {
      i.stopPropagation(), i.preventDefault(), this.loadMenuEvent(e.definition.headerMenu, i, e);
    }), e.titleElement.insertBefore(A, e.titleElement.firstChild);
  }
  loadMenuTableCellEvent(e, t, A) {
    A._cell && (A = A._cell), A.column.definition[e] && this.loadMenuEvent(A.column.definition[e], t, A);
  }
  loadMenuTableColumnEvent(e, t, A) {
    A._column && (A = A._column), A.definition[e] && this.loadMenuEvent(A.definition[e], t, A);
  }
  loadMenuEvent(e, t, A) {
    A._group ? A = A._group : A._row && (A = A._row), e = typeof e == "function" ? e.call(this.table, t, A.getComponent()) : e, this.loadMenu(t, A, e);
  }
  loadMenu(e, t, A, i, s) {
    var n = !(e instanceof MouseEvent), o = document.createElement("div"), a;
    if (o.classList.add("tabulator-menu"), n || e.preventDefault(), !(!A || !A.length)) {
      if (i)
        a = s.child(o);
      else {
        if (this.nestedMenuBlock) {
          if (this.rootPopup)
            return;
        } else
          this.nestedMenuBlock = setTimeout(() => {
            this.nestedMenuBlock = !1;
          }, 100);
        this.rootPopup && this.rootPopup.hide(), this.rootPopup = a = this.popup(o);
      }
      A.forEach((l) => {
        var h = document.createElement("div"), u = l.label, c = l.disabled;
        l.separator ? h.classList.add("tabulator-menu-separator") : (h.classList.add("tabulator-menu-item"), typeof u == "function" && (u = u.call(this.table, t.getComponent())), u instanceof Node ? h.appendChild(u) : h.innerHTML = u, typeof c == "function" && (c = c.call(this.table, t.getComponent())), c ? (h.classList.add("tabulator-menu-item-disabled"), h.addEventListener("click", (f) => {
          f.stopPropagation();
        })) : l.menu && l.menu.length ? h.addEventListener("click", (f) => {
          f.stopPropagation(), this.loadMenu(f, t, l.menu, h, a);
        }) : l.action && h.addEventListener("click", (f) => {
          l.action(f, t.getComponent());
        }), l.menu && l.menu.length && h.classList.add("tabulator-menu-item-submenu")), o.appendChild(h);
      }), o.addEventListener("click", (l) => {
        this.rootPopup && this.rootPopup.hide();
      }), a.show(i || e), a === this.rootPopup && (this.rootPopup.hideOnBlur(() => {
        this.rootPopup = null, this.currentComponent && (this.dispatch("menu-closed", A, a), this.dispatchExternal("menuClosed", this.currentComponent.getComponent()), this.currentComponent = null);
      }), this.currentComponent = t, this.dispatch("menu-opened", A, a), this.dispatchExternal("menuOpened", t.getComponent()));
    }
  }
}
U(so, "moduleName", "menu");
class ro extends Y {
  constructor(e) {
    super(e), this.placeholderElement = this.createPlaceholderElement(), this.hoverElement = !1, this.checkTimeout = !1, this.checkPeriod = 250, this.moving = !1, this.toCol = !1, this.toColAfter = !1, this.startX = 0, this.autoScrollMargin = 40, this.autoScrollStep = 5, this.autoScrollTimeout = !1, this.touchMove = !1, this.moveHover = this.moveHover.bind(this), this.endMove = this.endMove.bind(this), this.registerTableOption("movableColumns", !1);
  }
  createPlaceholderElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-col"), e.classList.add("tabulator-col-placeholder"), e;
  }
  initialize() {
    this.table.options.movableColumns && (this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("alert-show", this.abortMove.bind(this)));
  }
  abortMove() {
    clearTimeout(this.checkTimeout);
  }
  initializeColumn(e) {
    var t = this, A = {}, i;
    !e.modules.frozen && !e.isGroup && !e.isRowHeader && (i = e.getElement(), A.mousemove = (function(s) {
      e.parent === t.moving.parent && ((t.touchMove ? s.touches[0].pageX : s.pageX) - ie.elOffset(i).left + t.table.columnManager.contentsElement.scrollLeft > e.getWidth() / 2 ? (t.toCol !== e || !t.toColAfter) && (i.parentNode.insertBefore(t.placeholderElement, i.nextSibling), t.moveColumn(e, !0)) : (t.toCol !== e || t.toColAfter) && (i.parentNode.insertBefore(t.placeholderElement, i), t.moveColumn(e, !1)));
    }).bind(t), i.addEventListener("mousedown", function(s) {
      t.touchMove = !1, s.which === 1 && (t.checkTimeout = setTimeout(function() {
        t.startMove(s, e);
      }, t.checkPeriod));
    }), i.addEventListener("mouseup", function(s) {
      s.which === 1 && t.checkTimeout && clearTimeout(t.checkTimeout);
    }), t.bindTouchEvents(e)), e.modules.moveColumn = A;
  }
  bindTouchEvents(e) {
    var t = e.getElement(), A = !1, i, s, n, o, a, l;
    t.addEventListener("touchstart", (h) => {
      this.checkTimeout = setTimeout(() => {
        this.touchMove = !0, i = e.nextColumn(), n = i ? i.getWidth() / 2 : 0, s = e.prevColumn(), o = s ? s.getWidth() / 2 : 0, a = 0, l = 0, A = !1, this.startMove(h, e);
      }, this.checkPeriod);
    }, { passive: !0 }), t.addEventListener("touchmove", (h) => {
      var u, c;
      this.moving && (this.moveHover(h), A || (A = h.touches[0].pageX), u = h.touches[0].pageX - A, u > 0 ? i && u - a > n && (c = i, c !== e && (A = h.touches[0].pageX, c.getElement().parentNode.insertBefore(this.placeholderElement, c.getElement().nextSibling), this.moveColumn(c, !0))) : s && -u - l > o && (c = s, c !== e && (A = h.touches[0].pageX, c.getElement().parentNode.insertBefore(this.placeholderElement, c.getElement()), this.moveColumn(c, !1))), c && (i = c.nextColumn(), a = n, n = i ? i.getWidth() / 2 : 0, s = c.prevColumn(), l = o, o = s ? s.getWidth() / 2 : 0));
    }, { passive: !0 }), t.addEventListener("touchend", (h) => {
      this.checkTimeout && clearTimeout(this.checkTimeout), this.moving && this.endMove(h);
    });
  }
  startMove(e, t) {
    var A = t.getElement(), i = this.table.columnManager.getContentsElement(), s = this.table.columnManager.getHeadersElement();
    this.table.modules.selectRange && this.table.modules.selectRange.columnSelection && this.table.modules.selectRange.mousedown && this.table.modules.selectRange.selecting === "column" || (this.moving = t, this.startX = (this.touchMove ? e.touches[0].pageX : e.pageX) - ie.elOffset(A).left, this.table.element.classList.add("tabulator-block-select"), this.placeholderElement.style.width = t.getWidth() + "px", this.placeholderElement.style.height = t.getHeight() + "px", A.parentNode.insertBefore(this.placeholderElement, A), A.parentNode.removeChild(A), this.hoverElement = A.cloneNode(!0), this.hoverElement.classList.add("tabulator-moving"), i.appendChild(this.hoverElement), this.hoverElement.style.left = "0", this.hoverElement.style.bottom = i.clientHeight - s.offsetHeight + "px", this.touchMove || (this._bindMouseMove(), document.body.addEventListener("mousemove", this.moveHover), document.body.addEventListener("mouseup", this.endMove)), this.moveHover(e), this.dispatch("column-moving", e, this.moving));
  }
  _bindMouseMove() {
    this.table.columnManager.columnsByIndex.forEach(function(e) {
      e.modules.moveColumn.mousemove && e.getElement().addEventListener("mousemove", e.modules.moveColumn.mousemove);
    });
  }
  _unbindMouseMove() {
    this.table.columnManager.columnsByIndex.forEach(function(e) {
      e.modules.moveColumn.mousemove && e.getElement().removeEventListener("mousemove", e.modules.moveColumn.mousemove);
    });
  }
  moveColumn(e, t) {
    var A = this.moving.getCells();
    this.toCol = e, this.toColAfter = t, t ? e.getCells().forEach(function(i, s) {
      var n = i.getElement(!0);
      n.parentNode && A[s] && n.parentNode.insertBefore(A[s].getElement(), n.nextSibling);
    }) : e.getCells().forEach(function(i, s) {
      var n = i.getElement(!0);
      n.parentNode && A[s] && n.parentNode.insertBefore(A[s].getElement(), n);
    });
  }
  endMove(e) {
    (e.which === 1 || this.touchMove) && (this._unbindMouseMove(), this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling), this.placeholderElement.parentNode.removeChild(this.placeholderElement), this.hoverElement.parentNode.removeChild(this.hoverElement), this.table.element.classList.remove("tabulator-block-select"), this.toCol && this.table.columnManager.moveColumnActual(this.moving, this.toCol, this.toColAfter), this.moving = !1, this.toCol = !1, this.toColAfter = !1, this.touchMove || (document.body.removeEventListener("mousemove", this.moveHover), document.body.removeEventListener("mouseup", this.endMove)));
  }
  moveHover(e) {
    var t = this.table.columnManager.getContentsElement(), A = t.scrollLeft, i = (this.touchMove ? e.touches[0].pageX : e.pageX) - ie.elOffset(t).left + A, s;
    this.hoverElement.style.left = i - this.startX + "px", i - A < this.autoScrollMargin && (this.autoScrollTimeout || (this.autoScrollTimeout = setTimeout(() => {
      s = Math.max(0, A - 5), this.table.rowManager.getElement().scrollLeft = s, this.autoScrollTimeout = !1;
    }, 1))), A + t.clientWidth - i < this.autoScrollMargin && (this.autoScrollTimeout || (this.autoScrollTimeout = setTimeout(() => {
      s = Math.min(t.clientWidth, A + 5), this.table.rowManager.getElement().scrollLeft = s, this.autoScrollTimeout = !1;
    }, 1)));
  }
}
U(ro, "moduleName", "moveColumn");
var Eh = {
  delete: function(r, e, t) {
    r.delete();
  }
}, yh = {
  insert: function(r, e, t) {
    return this.table.addRow(r.getData(), void 0, e), !0;
  },
  add: function(r, e, t) {
    return this.table.addRow(r.getData()), !0;
  },
  update: function(r, e, t) {
    return e ? (e.update(r.getData()), !0) : !1;
  },
  replace: function(r, e, t) {
    return e ? (this.table.addRow(r.getData(), void 0, e), e.delete(), !0) : !1;
  }
};
const It = class It extends Y {
  constructor(e) {
    super(e), this.placeholderElement = this.createPlaceholderElement(), this.hoverElement = !1, this.checkTimeout = !1, this.checkPeriod = 150, this.moving = !1, this.toRow = !1, this.toRowAfter = !1, this.hasHandle = !1, this.startY = 0, this.startX = 0, this.moveHover = this.moveHover.bind(this), this.endMove = this.endMove.bind(this), this.tableRowDropEvent = !1, this.touchMove = !1, this.connection = !1, this.connectionSelectorsTables = !1, this.connectionSelectorsElements = !1, this.connectionElements = [], this.connections = [], this.connectedTable = !1, this.connectedRow = !1, this.registerTableOption("movableRows", !1), this.registerTableOption("movableRowsConnectedTables", !1), this.registerTableOption("movableRowsConnectedElements", !1), this.registerTableOption("movableRowsSender", !1), this.registerTableOption("movableRowsReceiver", "insert"), this.registerColumnOption("rowHandle");
  }
  createPlaceholderElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-row"), e.classList.add("tabulator-row-placeholder"), e;
  }
  initialize() {
    this.table.options.movableRows && (this.connectionSelectorsTables = this.table.options.movableRowsConnectedTables, this.connectionSelectorsElements = this.table.options.movableRowsConnectedElements, this.connection = this.connectionSelectorsTables || this.connectionSelectorsElements, this.subscribe("cell-init", this.initializeCell.bind(this)), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("row-init", this.initializeRow.bind(this)));
  }
  initializeGroupHeader(e) {
    var t = this, A = {};
    A.mouseup = (function(i) {
      t.tableRowDrop(i, e);
    }).bind(t), A.mousemove = (function(i) {
      var s;
      i.pageY - ie.elOffset(e.element).top + t.table.rowManager.element.scrollTop > e.getHeight() / 2 ? (t.toRow !== e || !t.toRowAfter) && (s = e.getElement(), s.parentNode.insertBefore(t.placeholderElement, s.nextSibling), t.moveRow(e, !0)) : (t.toRow !== e || t.toRowAfter) && (s = e.getElement(), s.previousSibling && (s.parentNode.insertBefore(t.placeholderElement, s), t.moveRow(e, !1)));
    }).bind(t), e.modules.moveRow = A;
  }
  initializeRow(e) {
    var t = this, A = {}, i;
    A.mouseup = (function(s) {
      t.tableRowDrop(s, e);
    }).bind(t), A.mousemove = (function(s) {
      var n = e.getElement();
      s.pageY - ie.elOffset(n).top + t.table.rowManager.element.scrollTop > e.getHeight() / 2 ? (t.toRow !== e || !t.toRowAfter) && (n.parentNode.insertBefore(t.placeholderElement, n.nextSibling), t.moveRow(e, !0)) : (t.toRow !== e || t.toRowAfter) && (n.parentNode.insertBefore(t.placeholderElement, n), t.moveRow(e, !1));
    }).bind(t), this.hasHandle || (i = e.getElement(), i.addEventListener("mousedown", function(s) {
      s.which === 1 && (t.checkTimeout = setTimeout(function() {
        t.startMove(s, e);
      }, t.checkPeriod));
    }), i.addEventListener("mouseup", function(s) {
      s.which === 1 && t.checkTimeout && clearTimeout(t.checkTimeout);
    }), this.bindTouchEvents(e, e.getElement())), e.modules.moveRow = A;
  }
  initializeColumn(e) {
    e.definition.rowHandle && this.table.options.movableRows !== !1 && (this.hasHandle = !0);
  }
  initializeCell(e) {
    if (e.column.definition.rowHandle && this.table.options.movableRows !== !1) {
      var t = this, A = e.getElement(!0);
      A.addEventListener("mousedown", function(i) {
        i.which === 1 && (t.checkTimeout = setTimeout(function() {
          t.startMove(i, e.row);
        }, t.checkPeriod));
      }), A.addEventListener("mouseup", function(i) {
        i.which === 1 && t.checkTimeout && clearTimeout(t.checkTimeout);
      }), this.bindTouchEvents(e.row, A);
    }
  }
  bindTouchEvents(e, t) {
    var A = !1, i, s, n, o, a, l;
    t.addEventListener("touchstart", (h) => {
      this.checkTimeout = setTimeout(() => {
        this.touchMove = !0, i = e.nextRow(), n = i ? i.getHeight() / 2 : 0, s = e.prevRow(), o = s ? s.getHeight() / 2 : 0, a = 0, l = 0, A = !1, this.startMove(h, e);
      }, this.checkPeriod);
    }, { passive: !0 }), this.moving, this.toRow, this.toRowAfter, t.addEventListener("touchmove", (h) => {
      var u, c;
      this.moving && (h.preventDefault(), this.moveHover(h), A || (A = h.touches[0].pageY), u = h.touches[0].pageY - A, u > 0 ? i && u - a > n && (c = i, c !== e && (A = h.touches[0].pageY, c.getElement().parentNode.insertBefore(this.placeholderElement, c.getElement().nextSibling), this.moveRow(c, !0))) : s && -u - l > o && (c = s, c !== e && (A = h.touches[0].pageY, c.getElement().parentNode.insertBefore(this.placeholderElement, c.getElement()), this.moveRow(c, !1))), c && (i = c.nextRow(), a = n, n = i ? i.getHeight() / 2 : 0, s = c.prevRow(), l = o, o = s ? s.getHeight() / 2 : 0));
    }), t.addEventListener("touchend", (h) => {
      this.checkTimeout && clearTimeout(this.checkTimeout), this.moving && (this.endMove(h), this.touchMove = !1);
    });
  }
  _bindMouseMove() {
    this.table.rowManager.getDisplayRows().forEach((e) => {
      (e.type === "row" || e.type === "group") && e.modules.moveRow && e.modules.moveRow.mousemove && e.getElement().addEventListener("mousemove", e.modules.moveRow.mousemove);
    });
  }
  _unbindMouseMove() {
    this.table.rowManager.getDisplayRows().forEach((e) => {
      (e.type === "row" || e.type === "group") && e.modules.moveRow && e.modules.moveRow.mousemove && e.getElement().removeEventListener("mousemove", e.modules.moveRow.mousemove);
    });
  }
  startMove(e, t) {
    var A = t.getElement();
    this.setStartPosition(e, t), this.moving = t, this.table.element.classList.add("tabulator-block-select"), this.placeholderElement.style.width = t.getWidth() + "px", this.placeholderElement.style.height = t.getHeight() + "px", this.connection ? (this.table.element.classList.add("tabulator-movingrow-sending"), this.connectToTables(t)) : (A.parentNode.insertBefore(this.placeholderElement, A), A.parentNode.removeChild(A)), this.hoverElement = A.cloneNode(!0), this.hoverElement.classList.add("tabulator-moving"), this.connection ? (document.body.appendChild(this.hoverElement), this.hoverElement.style.left = "0", this.hoverElement.style.top = "0", this.hoverElement.style.width = this.table.element.clientWidth + "px", this.hoverElement.style.whiteSpace = "nowrap", this.hoverElement.style.overflow = "hidden", this.hoverElement.style.pointerEvents = "none") : (this.table.rowManager.getTableElement().appendChild(this.hoverElement), this.hoverElement.style.left = "0", this.hoverElement.style.top = "0", this._bindMouseMove()), document.body.addEventListener("mousemove", this.moveHover), document.body.addEventListener("mouseup", this.endMove), this.dispatchExternal("rowMoving", t.getComponent()), this.moveHover(e);
  }
  setStartPosition(e, t) {
    var A = this.touchMove ? e.touches[0].pageX : e.pageX, i = this.touchMove ? e.touches[0].pageY : e.pageY, s, n;
    s = t.getElement(), this.connection ? (n = s.getBoundingClientRect(), this.startX = n.left - A + window.pageXOffset, this.startY = n.top - i + window.pageYOffset) : this.startY = i - s.getBoundingClientRect().top;
  }
  endMove(e) {
    (!e || e.which === 1 || this.touchMove) && (this._unbindMouseMove(), this.connection || (this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling), this.placeholderElement.parentNode.removeChild(this.placeholderElement)), this.hoverElement.parentNode.removeChild(this.hoverElement), this.table.element.classList.remove("tabulator-block-select"), this.toRow ? this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter) : this.dispatchExternal("rowMoveCancelled", this.moving.getComponent()), this.moving = !1, this.toRow = !1, this.toRowAfter = !1, document.body.removeEventListener("mousemove", this.moveHover), document.body.removeEventListener("mouseup", this.endMove), this.connection && (this.table.element.classList.remove("tabulator-movingrow-sending"), this.disconnectFromTables()));
  }
  moveRow(e, t) {
    this.toRow = e, this.toRowAfter = t;
  }
  moveHover(e) {
    this.connection ? this.moveHoverConnections.call(this, e) : this.moveHoverTable.call(this, e);
  }
  moveHoverTable(e) {
    var t = this.table.rowManager.getElement(), A = t.scrollTop, i = (this.touchMove ? e.touches[0].pageY : e.pageY) - t.getBoundingClientRect().top + A;
    this.hoverElement.style.top = Math.min(i - this.startY, this.table.rowManager.element.scrollHeight - this.hoverElement.offsetHeight) + "px";
  }
  moveHoverConnections(e) {
    this.hoverElement.style.left = this.startX + (this.touchMove ? e.touches[0].pageX : e.pageX) + "px", this.hoverElement.style.top = this.startY + (this.touchMove ? e.touches[0].pageY : e.pageY) + "px";
  }
  elementRowDrop(e, t, A) {
    this.dispatchExternal("movableRowsElementDrop", e, t, A ? A.getComponent() : !1);
  }
  //establish connection with other tables
  connectToTables(e) {
    var t;
    this.connectionSelectorsTables && (t = this.commsConnections(this.connectionSelectorsTables), this.dispatchExternal("movableRowsSendingStart", t), this.commsSend(this.connectionSelectorsTables, "moveRow", "connect", {
      row: e
    })), this.connectionSelectorsElements && (this.connectionElements = [], Array.isArray(this.connectionSelectorsElements) || (this.connectionSelectorsElements = [this.connectionSelectorsElements]), this.connectionSelectorsElements.forEach((A) => {
      typeof A == "string" ? this.connectionElements = this.connectionElements.concat(Array.prototype.slice.call(document.querySelectorAll(A))) : this.connectionElements.push(A);
    }), this.connectionElements.forEach((A) => {
      var i = (s) => {
        this.elementRowDrop(s, A, this.moving);
      };
      A.addEventListener("mouseup", i), A.tabulatorElementDropEvent = i, A.classList.add("tabulator-movingrow-receiving");
    }));
  }
  //disconnect from other tables
  disconnectFromTables() {
    var e;
    this.connectionSelectorsTables && (e = this.commsConnections(this.connectionSelectorsTables), this.dispatchExternal("movableRowsSendingStop", e), this.commsSend(this.connectionSelectorsTables, "moveRow", "disconnect")), this.connectionElements.forEach((t) => {
      t.classList.remove("tabulator-movingrow-receiving"), t.removeEventListener("mouseup", t.tabulatorElementDropEvent), delete t.tabulatorElementDropEvent;
    });
  }
  //accept incomming connection
  connect(e, t) {
    return this.connectedTable ? (console.warn("Move Row Error - Table cannot accept connection, already connected to table:", this.connectedTable), !1) : (this.connectedTable = e, this.connectedRow = t, this.table.element.classList.add("tabulator-movingrow-receiving"), this.table.rowManager.getDisplayRows().forEach((A) => {
      A.type === "row" && A.modules.moveRow && A.modules.moveRow.mouseup && A.getElement().addEventListener("mouseup", A.modules.moveRow.mouseup);
    }), this.tableRowDropEvent = this.tableRowDrop.bind(this), this.table.element.addEventListener("mouseup", this.tableRowDropEvent), this.dispatchExternal("movableRowsReceivingStart", t, e), !0);
  }
  //close incoming connection
  disconnect(e) {
    e === this.connectedTable ? (this.connectedTable = !1, this.connectedRow = !1, this.table.element.classList.remove("tabulator-movingrow-receiving"), this.table.rowManager.getDisplayRows().forEach((t) => {
      t.type === "row" && t.modules.moveRow && t.modules.moveRow.mouseup && t.getElement().removeEventListener("mouseup", t.modules.moveRow.mouseup);
    }), this.table.element.removeEventListener("mouseup", this.tableRowDropEvent), this.dispatchExternal("movableRowsReceivingStop", e)) : console.warn("Move Row Error - trying to disconnect from non connected table");
  }
  dropComplete(e, t, A) {
    var i = !1;
    if (A) {
      switch (typeof this.table.options.movableRowsSender) {
        case "string":
          i = It.senders[this.table.options.movableRowsSender];
          break;
        case "function":
          i = this.table.options.movableRowsSender;
          break;
      }
      i ? i.call(this, this.moving ? this.moving.getComponent() : void 0, t ? t.getComponent() : void 0, e) : this.table.options.movableRowsSender && console.warn("Mover Row Error - no matching sender found:", this.table.options.movableRowsSender), this.dispatchExternal("movableRowsSent", this.moving.getComponent(), t ? t.getComponent() : void 0, e);
    } else
      this.dispatchExternal("movableRowsSentFailed", this.moving.getComponent(), t ? t.getComponent() : void 0, e);
    this.endMove();
  }
  tableRowDrop(e, t) {
    var A = !1, i = !1;
    switch (e.stopImmediatePropagation(), typeof this.table.options.movableRowsReceiver) {
      case "string":
        A = It.receivers[this.table.options.movableRowsReceiver];
        break;
      case "function":
        A = this.table.options.movableRowsReceiver;
        break;
    }
    A ? i = A.call(this, this.connectedRow.getComponent(), t ? t.getComponent() : void 0, this.connectedTable) : console.warn("Mover Row Error - no matching receiver found:", this.table.options.movableRowsReceiver), i ? this.dispatchExternal("movableRowsReceived", this.connectedRow.getComponent(), t ? t.getComponent() : void 0, this.connectedTable) : this.dispatchExternal("movableRowsReceivedFailed", this.connectedRow.getComponent(), t ? t.getComponent() : void 0, this.connectedTable), this.commsSend(this.connectedTable, "moveRow", "dropcomplete", {
      row: t,
      success: i
    });
  }
  commsReceived(e, t, A) {
    switch (t) {
      case "connect":
        return this.connect(e, A.row);
      case "disconnect":
        return this.disconnect(e);
      case "dropcomplete":
        return this.dropComplete(e, A.row, A.success);
    }
  }
};
U(It, "moduleName", "moveRow"), //load defaults
U(It, "senders", Eh), U(It, "receivers", yh);
let zs = It;
var Fh = {};
const tA = class tA extends Y {
  constructor(e) {
    super(e), this.allowedTypes = ["", "data", "edit", "clipboard", "import"], this.enabled = !0, this.registerColumnOption("mutator"), this.registerColumnOption("mutatorParams"), this.registerColumnOption("mutatorData"), this.registerColumnOption("mutatorDataParams"), this.registerColumnOption("mutatorEdit"), this.registerColumnOption("mutatorEditParams"), this.registerColumnOption("mutatorClipboard"), this.registerColumnOption("mutatorClipboardParams"), this.registerColumnOption("mutatorImport"), this.registerColumnOption("mutatorImportParams"), this.registerColumnOption("mutateLink");
  }
  initialize() {
    this.subscribe("cell-value-changing", this.transformCell.bind(this)), this.subscribe("cell-value-changed", this.mutateLink.bind(this)), this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("row-data-init-before", this.rowDataChanged.bind(this)), this.subscribe("row-data-changing", this.rowDataChanged.bind(this));
  }
  rowDataChanged(e, t, A) {
    return this.transformRow(t, "data", A);
  }
  //initialize column mutator
  initializeColumn(e) {
    var t = !1, A = {};
    this.allowedTypes.forEach((i) => {
      var s = "mutator" + (i.charAt(0).toUpperCase() + i.slice(1)), n;
      e.definition[s] && (n = this.lookupMutator(e.definition[s]), n && (t = !0, A[s] = {
        mutator: n,
        params: e.definition[s + "Params"] || {}
      }));
    }), t && (e.modules.mutate = A);
  }
  lookupMutator(e) {
    var t = !1;
    switch (typeof e) {
      case "string":
        tA.mutators[e] ? t = tA.mutators[e] : console.warn("Mutator Error - No such mutator found, ignoring: ", e);
        break;
      case "function":
        t = e;
        break;
    }
    return t;
  }
  //apply mutator to row
  transformRow(e, t, A) {
    var i = "mutator" + (t.charAt(0).toUpperCase() + t.slice(1)), s;
    return this.enabled && this.table.columnManager.traverse((n) => {
      var o, a, l;
      n.modules.mutate && (o = n.modules.mutate[i] || n.modules.mutate.mutator || !1, o && (s = n.getFieldValue(typeof A < "u" ? A : e), (t == "data" && !A || typeof s < "u") && (l = n.getComponent(), a = typeof o.params == "function" ? o.params(s, e, t, l) : o.params, n.setFieldValue(e, o.mutator(s, e, t, a, l)))));
    }), e;
  }
  //apply mutator to new cell value
  transformCell(e, t) {
    if (e.column.modules.mutate) {
      var A = e.column.modules.mutate.mutatorEdit || e.column.modules.mutate.mutator || !1, i = {};
      if (A)
        return i = Object.assign(i, e.row.getData()), e.column.setFieldValue(i, t), A.mutator(t, i, "edit", A.params, e.getComponent());
    }
    return t;
  }
  mutateLink(e) {
    var t = e.column.definition.mutateLink;
    t && (Array.isArray(t) || (t = [t]), t.forEach((A) => {
      var i = e.row.getCell(A);
      i && i.setValue(i.getValue(), !0, !0);
    }));
  }
  enable() {
    this.enabled = !0;
  }
  disable() {
    this.enabled = !1;
  }
};
U(tA, "moduleName", "mutator"), //load defaults
U(tA, "mutators", Fh);
let Gs = tA;
function Qh(r, e, t, A, i) {
  var s = document.createElement("span"), n = document.createElement("span"), o = document.createElement("span"), a = document.createElement("span"), l = document.createElement("span"), h = document.createElement("span");
  return this.table.modules.localize.langBind("pagination|counter|showing", (u) => {
    n.innerHTML = u;
  }), this.table.modules.localize.langBind("pagination|counter|of", (u) => {
    a.innerHTML = u;
  }), this.table.modules.localize.langBind("pagination|counter|rows", (u) => {
    h.innerHTML = u;
  }), A ? (o.innerHTML = " " + e + "-" + Math.min(e + r - 1, A) + " ", l.innerHTML = " " + A + " ", s.appendChild(n), s.appendChild(o), s.appendChild(a), s.appendChild(l), s.appendChild(h)) : (o.innerHTML = " 0 ", s.appendChild(n), s.appendChild(o), s.appendChild(h)), s;
}
function Uh(r, e, t, A, i) {
  var s = document.createElement("span"), n = document.createElement("span"), o = document.createElement("span"), a = document.createElement("span"), l = document.createElement("span"), h = document.createElement("span");
  return this.table.modules.localize.langBind("pagination|counter|showing", (u) => {
    n.innerHTML = u;
  }), o.innerHTML = " " + t + " ", this.table.modules.localize.langBind("pagination|counter|of", (u) => {
    a.innerHTML = u;
  }), l.innerHTML = " " + i + " ", this.table.modules.localize.langBind("pagination|counter|pages", (u) => {
    h.innerHTML = u;
  }), s.appendChild(n), s.appendChild(o), s.appendChild(a), s.appendChild(l), s.appendChild(h), s;
}
var Hh = {
  rows: Qh,
  pages: Uh
};
const IA = class IA extends Y {
  constructor(e) {
    super(e), this.mode = "local", this.progressiveLoad = !1, this.element = null, this.pageCounterElement = null, this.pageCounter = null, this.size = 0, this.page = 1, this.count = 5, this.max = 1, this.remoteRowCountEstimate = null, this.initialLoad = !0, this.dataChanging = !1, this.pageSizes = [], this.registerTableOption("pagination", !1), this.registerTableOption("paginationMode", "local"), this.registerTableOption("paginationSize", !1), this.registerTableOption("paginationInitialPage", 1), this.registerTableOption("paginationCounter", !1), this.registerTableOption("paginationCounterElement", !1), this.registerTableOption("paginationButtonCount", 5), this.registerTableOption("paginationSizeSelector", !1), this.registerTableOption("paginationElement", !1), this.registerTableOption("paginationAddRow", "page"), this.registerTableOption("paginationOutOfRange", !1), this.registerTableOption("progressiveLoad", !1), this.registerTableOption("progressiveLoadDelay", 0), this.registerTableOption("progressiveLoadScrollMargin", 0), this.registerTableFunction("setMaxPage", this.setMaxPage.bind(this)), this.registerTableFunction("setPage", this.setPage.bind(this)), this.registerTableFunction("setPageToRow", this.userSetPageToRow.bind(this)), this.registerTableFunction("setPageSize", this.userSetPageSize.bind(this)), this.registerTableFunction("getPageSize", this.getPageSize.bind(this)), this.registerTableFunction("previousPage", this.previousPage.bind(this)), this.registerTableFunction("nextPage", this.nextPage.bind(this)), this.registerTableFunction("getPage", this.getPage.bind(this)), this.registerTableFunction("getPageMax", this.getPageMax.bind(this)), this.registerComponentFunction("row", "pageTo", this.setPageToRow.bind(this));
  }
  initialize() {
    this.table.options.pagination ? (this.subscribe("row-deleted", this.rowsUpdated.bind(this)), this.subscribe("row-added", this.rowsUpdated.bind(this)), this.subscribe("data-processed", this.initialLoadComplete.bind(this)), this.subscribe("table-built", this.calculatePageSizes.bind(this)), this.subscribe("footer-redraw", this.footerRedraw.bind(this)), this.table.options.paginationAddRow == "page" && this.subscribe("row-adding-position", this.rowAddingPosition.bind(this)), this.table.options.paginationMode === "remote" && (this.subscribe("data-params", this.remotePageParams.bind(this)), this.subscribe("data-loaded", this._parseRemoteData.bind(this))), this.table.options.progressiveLoad && console.error("Progressive Load Error - Pagination and progressive load cannot be used at the same time"), this.registerDisplayHandler(this.restOnRenderBefore.bind(this), 40), this.registerDisplayHandler(this.getRows.bind(this), 50), this.createElements(), this.initializePageCounter(), this.initializePaginator()) : this.table.options.progressiveLoad && (this.subscribe("data-params", this.remotePageParams.bind(this)), this.subscribe("data-loaded", this._parseRemoteData.bind(this)), this.subscribe("table-built", this.calculatePageSizes.bind(this)), this.subscribe("data-processed", this.initialLoadComplete.bind(this)), this.initializeProgressive(this.table.options.progressiveLoad), this.table.options.progressiveLoad === "scroll" && this.subscribe("scroll-vertical", this.scrollVertical.bind(this)));
  }
  rowAddingPosition(e, t) {
    var A = this.table.rowManager, i = A.getDisplayRows(), s;
    return t ? i.length ? s = i[0] : A.activeRows.length && (s = A.activeRows[A.activeRows.length - 1], t = !1) : i.length && (s = i[i.length - 1], t = !(i.length < this.size)), { index: s, top: t };
  }
  calculatePageSizes() {
    var e, t;
    this.table.options.paginationSize ? this.size = this.table.options.paginationSize : (e = document.createElement("div"), e.classList.add("tabulator-row"), e.style.visibility = "hidden", t = document.createElement("div"), t.classList.add("tabulator-cell"), t.innerHTML = "Page Row Test", e.appendChild(t), this.table.rowManager.getTableElement().appendChild(e), this.size = Math.floor(this.table.rowManager.getElement().clientHeight / e.offsetHeight), this.table.rowManager.getTableElement().removeChild(e)), this.dispatchExternal("pageSizeChanged", this.size), this.generatePageSizeSelectList();
  }
  initialLoadComplete() {
    this.initialLoad = !1;
  }
  remotePageParams(e, t, A, i) {
    return this.initialLoad || (this.progressiveLoad && !A || !this.progressiveLoad && !this.dataChanging) && this.reset(!0), i.page = this.page, this.size && (i.size = this.size), i;
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  userSetPageToRow(e) {
    return this.table.options.pagination && (e = this.table.rowManager.findRow(e), e) ? this.setPageToRow(e) : Promise.reject();
  }
  userSetPageSize(e) {
    return this.table.options.pagination ? (this.setPageSize(e), this.setPage(1)) : !1;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  scrollVertical(e, t) {
    var A, i, s;
    !t && !this.table.dataLoader.loading && (A = this.table.rowManager.getElement(), i = A.scrollHeight - A.clientHeight - e, s = this.table.options.progressiveLoadScrollMargin || A.clientHeight * 2, i < s && this.nextPage().catch(() => {
    }));
  }
  restOnRenderBefore(e, t) {
    return t || this.mode === "local" && this.reset(), e;
  }
  rowsUpdated() {
    this.refreshData(!0, "all");
  }
  createElements() {
    var e;
    this.element = document.createElement("span"), this.element.classList.add("tabulator-paginator"), this.pagesElement = document.createElement("span"), this.pagesElement.classList.add("tabulator-pages"), e = document.createElement("button"), e.classList.add("tabulator-page"), e.setAttribute("type", "button"), e.setAttribute("role", "button"), e.setAttribute("aria-label", ""), e.setAttribute("title", ""), this.firstBut = e.cloneNode(!0), this.firstBut.setAttribute("data-page", "first"), this.prevBut = e.cloneNode(!0), this.prevBut.setAttribute("data-page", "prev"), this.nextBut = e.cloneNode(!0), this.nextBut.setAttribute("data-page", "next"), this.lastBut = e.cloneNode(!0), this.lastBut.setAttribute("data-page", "last"), this.table.options.paginationSizeSelector && (this.pageSizeSelect = document.createElement("select"), this.pageSizeSelect.classList.add("tabulator-page-size"));
  }
  generatePageSizeSelectList() {
    var e = [];
    if (this.pageSizeSelect) {
      if (Array.isArray(this.table.options.paginationSizeSelector))
        e = this.table.options.paginationSizeSelector, this.pageSizes = e, this.pageSizes.indexOf(this.size) == -1 && e.unshift(this.size);
      else if (this.pageSizes.indexOf(this.size) == -1) {
        e = [];
        for (let t = 1; t < 5; t++)
          e.push(this.size * t);
        this.pageSizes = e;
      } else
        e = this.pageSizes;
      for (; this.pageSizeSelect.firstChild; ) this.pageSizeSelect.removeChild(this.pageSizeSelect.firstChild);
      e.forEach((t) => {
        var A = document.createElement("option");
        A.value = t, t === !0 ? this.langBind("pagination|all", function(i) {
          A.innerHTML = i;
        }) : A.innerHTML = t, this.pageSizeSelect.appendChild(A);
      }), this.pageSizeSelect.value = this.size;
    }
  }
  initializePageCounter() {
    var e = this.table.options.paginationCounter, t = null;
    e && (typeof e == "function" ? t = e : t = IA.pageCounters[e], t ? (this.pageCounter = t, this.pageCounterElement = document.createElement("span"), this.pageCounterElement.classList.add("tabulator-page-counter")) : console.warn("Pagination Error - No such page counter found: ", e));
  }
  //setup pagination
  initializePaginator(e) {
    var t, A;
    e || (this.langBind("pagination|first", (i) => {
      this.firstBut.innerHTML = i;
    }), this.langBind("pagination|first_title", (i) => {
      this.firstBut.setAttribute("aria-label", i), this.firstBut.setAttribute("title", i);
    }), this.langBind("pagination|prev", (i) => {
      this.prevBut.innerHTML = i;
    }), this.langBind("pagination|prev_title", (i) => {
      this.prevBut.setAttribute("aria-label", i), this.prevBut.setAttribute("title", i);
    }), this.langBind("pagination|next", (i) => {
      this.nextBut.innerHTML = i;
    }), this.langBind("pagination|next_title", (i) => {
      this.nextBut.setAttribute("aria-label", i), this.nextBut.setAttribute("title", i);
    }), this.langBind("pagination|last", (i) => {
      this.lastBut.innerHTML = i;
    }), this.langBind("pagination|last_title", (i) => {
      this.lastBut.setAttribute("aria-label", i), this.lastBut.setAttribute("title", i);
    }), this.firstBut.addEventListener("click", () => {
      this.setPage(1);
    }), this.prevBut.addEventListener("click", () => {
      this.previousPage();
    }), this.nextBut.addEventListener("click", () => {
      this.nextPage();
    }), this.lastBut.addEventListener("click", () => {
      this.setPage(this.max);
    }), this.table.options.paginationElement && (this.element = this.table.options.paginationElement), this.pageSizeSelect && (t = document.createElement("label"), this.langBind("pagination|page_size", (i) => {
      this.pageSizeSelect.setAttribute("aria-label", i), this.pageSizeSelect.setAttribute("title", i), t.innerHTML = i;
    }), this.element.appendChild(t), this.element.appendChild(this.pageSizeSelect), this.pageSizeSelect.addEventListener("change", (i) => {
      this.setPageSize(this.pageSizeSelect.value == "true" ? !0 : this.pageSizeSelect.value), this.setPage(1);
    })), this.element.appendChild(this.firstBut), this.element.appendChild(this.prevBut), this.element.appendChild(this.pagesElement), this.element.appendChild(this.nextBut), this.element.appendChild(this.lastBut), this.table.options.paginationElement || (this.table.options.paginationCounter && (this.table.options.paginationCounterElement ? this.table.options.paginationCounterElement instanceof HTMLElement ? this.table.options.paginationCounterElement.appendChild(this.pageCounterElement) : typeof this.table.options.paginationCounterElement == "string" && (A = document.querySelector(this.table.options.paginationCounterElement), A ? A.appendChild(this.pageCounterElement) : console.warn("Pagination Error - Unable to find element matching paginationCounterElement selector:", this.table.options.paginationCounterElement)) : this.footerAppend(this.pageCounterElement)), this.footerAppend(this.element)), this.page = this.table.options.paginationInitialPage, this.count = this.table.options.paginationButtonCount), this.mode = this.table.options.paginationMode;
  }
  initializeProgressive(e) {
    this.initializePaginator(!0), this.mode = "progressive_" + e, this.progressiveLoad = !0;
  }
  trackChanges() {
    this.dispatch("page-changed");
  }
  //calculate maximum page from number of rows
  setMaxRows(e) {
    e ? this.max = this.size === !0 ? 1 : Math.ceil(e / this.size) : this.max = 1, this.page > this.max && (this.page = this.max);
  }
  //reset to first page without triggering action
  reset(e) {
    this.initialLoad || (this.mode == "local" || e) && (this.page = 1, this.trackChanges());
  }
  //set the maximum page
  setMaxPage(e) {
    e = parseInt(e), this.max = e || 1, this.page > this.max && (this.page = this.max, this.trigger());
  }
  //set current page number
  setPage(e) {
    switch (e) {
      case "first":
        return this.setPage(1);
      case "prev":
        return this.previousPage();
      case "next":
        return this.nextPage();
      case "last":
        return this.setPage(this.max);
    }
    return e = parseInt(e), e > 0 && e <= this.max || this.mode !== "local" ? (this.page = e, this.trackChanges(), this.trigger()) : (console.warn("Pagination Error - Requested page is out of range of 1 - " + this.max + ":", e), Promise.reject());
  }
  setPageToRow(e) {
    var t = this.displayRows(-1), A = t.indexOf(e);
    if (A > -1) {
      var i = this.size === !0 ? 1 : Math.ceil((A + 1) / this.size);
      return this.setPage(i);
    } else
      return console.warn("Pagination Error - Requested row is not visible"), Promise.reject();
  }
  setPageSize(e) {
    e !== !0 && (e = parseInt(e)), e > 0 && (this.size = e, this.dispatchExternal("pageSizeChanged", e)), this.pageSizeSelect && this.generatePageSizeSelectList(), this.trackChanges();
  }
  _setPageCounter(e, t, A) {
    var i;
    if (this.pageCounter)
      switch (this.mode === "remote" && (t = this.size, A = (this.page - 1) * this.size + 1, e = this.remoteRowCountEstimate), i = this.pageCounter.call(this, t, A, this.page, e, this.max), typeof i) {
        case "object":
          if (i instanceof Node) {
            for (; this.pageCounterElement.firstChild; ) this.pageCounterElement.removeChild(this.pageCounterElement.firstChild);
            this.pageCounterElement.appendChild(i);
          } else
            this.pageCounterElement.innerHTML = "", i != null && console.warn("Page Counter Error - Page Counter has returned a type of object, the only valid page counter object return is an instance of Node, the page counter returned:", i);
          break;
        case "undefined":
          this.pageCounterElement.innerHTML = "";
          break;
        default:
          this.pageCounterElement.innerHTML = i;
      }
  }
  //setup the pagination buttons
  _setPageButtons() {
    let e = Math.floor((this.count - 1) / 2), t = Math.ceil((this.count - 1) / 2), A = this.max - this.page + e + 1 < this.count ? this.max - this.count + 1 : Math.max(this.page - e, 1), i = this.page <= t ? Math.min(this.count, this.max) : Math.min(this.page + t, this.max);
    for (; this.pagesElement.firstChild; ) this.pagesElement.removeChild(this.pagesElement.firstChild);
    this.page == 1 ? (this.firstBut.disabled = !0, this.prevBut.disabled = !0) : (this.firstBut.disabled = !1, this.prevBut.disabled = !1), this.page == this.max ? (this.lastBut.disabled = !0, this.nextBut.disabled = !0) : (this.lastBut.disabled = !1, this.nextBut.disabled = !1);
    for (let s = A; s <= i; s++)
      s > 0 && s <= this.max && this.pagesElement.appendChild(this._generatePageButton(s));
    this.footerRedraw();
  }
  _generatePageButton(e) {
    var t = document.createElement("button");
    return t.classList.add("tabulator-page"), e == this.page && t.classList.add("active"), t.setAttribute("type", "button"), t.setAttribute("role", "button"), this.langBind("pagination|page_title", (A) => {
      t.setAttribute("aria-label", A + " " + e), t.setAttribute("title", A + " " + e);
    }), t.setAttribute("data-page", e), t.textContent = e, t.addEventListener("click", (A) => {
      this.setPage(e);
    }), t;
  }
  //previous page
  previousPage() {
    return this.page > 1 ? (this.page--, this.trackChanges(), this.trigger()) : (console.warn("Pagination Error - Previous page would be less than page 1:", 0), Promise.reject());
  }
  //next page
  nextPage() {
    return this.page < this.max ? (this.page++, this.trackChanges(), this.trigger()) : (this.progressiveLoad || console.warn("Pagination Error - Next page would be greater than maximum page of " + this.max + ":", this.max + 1), Promise.reject());
  }
  //return current page number
  getPage() {
    return this.page;
  }
  //return max page number
  getPageMax() {
    return this.max;
  }
  getPageSize(e) {
    return this.size;
  }
  getMode() {
    return this.mode;
  }
  //return appropriate rows for current page
  getRows(e) {
    var t = 0, A, i, s, n, o = e.filter((a) => a.type === "row");
    if (this.mode == "local") {
      A = [], this.setMaxRows(e.length), this.size === !0 ? (i = 0, s = e.length) : (i = this.size * (this.page - 1), s = i + parseInt(this.size)), this._setPageButtons();
      for (let a = i; a < s; a++) {
        let l = e[a];
        l && (A.push(l), l.type === "row" && (n || (n = l), t++));
      }
      return this._setPageCounter(o.length, t, n ? o.indexOf(n) + 1 : 0), A;
    } else
      return this._setPageButtons(), this._setPageCounter(o.length), e.slice(0);
  }
  trigger() {
    var e;
    switch (this.mode) {
      case "local":
        return e = this.table.rowManager.scrollLeft, this.refreshData(), this.table.rowManager.scrollHorizontal(e), this.dispatchExternal("pageLoaded", this.getPage()), Promise.resolve();
      case "remote":
        return this.dataChanging = !0, this.reloadData(null).finally(() => {
          this.dataChanging = !1;
        });
      case "progressive_load":
      case "progressive_scroll":
        return this.reloadData(null, !0);
      default:
        return console.warn("Pagination Error - no such pagination mode:", this.mode), Promise.reject();
    }
  }
  _parseRemoteData(e) {
    var t, A;
    if (typeof e.last_page > "u" && console.warn("Remote Pagination Error - Server response missing '" + (this.options("dataReceiveParams").last_page || "last_page") + "' property"), e.data)
      if (this.max = parseInt(e.last_page) || 1, this.remoteRowCountEstimate = typeof e.last_row < "u" ? e.last_row : e.last_page * this.size - (this.page == e.last_page ? this.size - e.data.length : 0), this.progressiveLoad) {
        switch (this.mode) {
          case "progressive_load":
            this.page == 1 ? this.table.rowManager.setData(e.data, !1, this.page == 1) : this.table.rowManager.addRows(e.data), this.page < this.max && setTimeout(() => {
              this.nextPage();
            }, this.table.options.progressiveLoadDelay);
            break;
          case "progressive_scroll":
            e = this.page === 1 ? e.data : this.table.rowManager.getData().concat(e.data), this.table.rowManager.setData(e, this.page !== 1, this.page == 1), t = this.table.options.progressiveLoadScrollMargin || this.table.rowManager.element.clientHeight * 2, this.table.rowManager.element.scrollHeight <= this.table.rowManager.element.clientHeight + t && this.page < this.max && setTimeout(() => {
              this.nextPage();
            });
            break;
        }
        return !1;
      } else {
        if (this.page > this.max && (console.warn("Remote Pagination Error - Server returned last page value lower than the current page"), A = this.options("paginationOutOfRange"), A))
          return this.setPage(typeof A == "function" ? A.call(this, this.page, this.max) : A);
        this.dispatchExternal("pageLoaded", this.getPage());
      }
    else
      console.warn("Remote Pagination Error - Server response missing '" + (this.options("dataReceiveParams").data || "data") + "' property");
    return e.data;
  }
  //handle the footer element being redrawn
  footerRedraw() {
    var e = this.table.footerManager.containerElement;
    Math.ceil(e.clientWidth) - e.scrollWidth < 0 ? this.pagesElement.style.display = "none" : (this.pagesElement.style.display = "", Math.ceil(e.clientWidth) - e.scrollWidth < 0 && (this.pagesElement.style.display = "none"));
  }
};
U(IA, "moduleName", "page"), //load defaults
U(IA, "pageCounters", Hh);
let Ws = IA;
var Rh = {
  local: function(r, e) {
    var t = localStorage.getItem(r + "-" + e);
    return t ? JSON.parse(t) : !1;
  },
  cookie: function(r, e) {
    var t = document.cookie, A = r + "-" + e, i = t.indexOf(A + "="), s, n;
    return i > -1 && (t = t.slice(i), s = t.indexOf(";"), s > -1 && (t = t.slice(0, s)), n = t.replace(A + "=", "")), n ? JSON.parse(n) : !1;
  }
}, xh = {
  local: function(r, e, t) {
    localStorage.setItem(r + "-" + e, JSON.stringify(t));
  },
  cookie: function(r, e, t) {
    var A = /* @__PURE__ */ new Date();
    A.setDate(A.getDate() + 1e4), document.cookie = r + "-" + e + "=" + JSON.stringify(t) + "; expires=" + A.toUTCString();
  }
};
const Ie = class Ie extends Y {
  constructor(e) {
    super(e), this.mode = "", this.id = "", this.defWatcherBlock = !1, this.config = {}, this.readFunc = !1, this.writeFunc = !1, this.registerTableOption("persistence", !1), this.registerTableOption("persistenceID", ""), this.registerTableOption("persistenceMode", !0), this.registerTableOption("persistenceReaderFunc", !1), this.registerTableOption("persistenceWriterFunc", !1);
  }
  // Test for whether localStorage is available for use.
  localStorageTest() {
    var e = "_tabulator_test";
    try {
      return window.localStorage.setItem(e, e), window.localStorage.removeItem(e), !0;
    } catch {
      return !1;
    }
  }
  //setup parameters
  initialize() {
    if (this.table.options.persistence) {
      var e = this.table.options.persistenceMode, t = this.table.options.persistenceID, A;
      this.mode = e !== !0 ? e : this.localStorageTest() ? "local" : "cookie", this.table.options.persistenceReaderFunc ? typeof this.table.options.persistenceReaderFunc == "function" ? this.readFunc = this.table.options.persistenceReaderFunc : Ie.readers[this.table.options.persistenceReaderFunc] ? this.readFunc = Ie.readers[this.table.options.persistenceReaderFunc] : console.warn("Persistence Read Error - invalid reader set", this.table.options.persistenceReaderFunc) : Ie.readers[this.mode] ? this.readFunc = Ie.readers[this.mode] : console.warn("Persistence Read Error - invalid reader set", this.mode), this.table.options.persistenceWriterFunc ? typeof this.table.options.persistenceWriterFunc == "function" ? this.writeFunc = this.table.options.persistenceWriterFunc : Ie.writers[this.table.options.persistenceWriterFunc] ? this.writeFunc = Ie.writers[this.table.options.persistenceWriterFunc] : console.warn("Persistence Write Error - invalid reader set", this.table.options.persistenceWriterFunc) : Ie.writers[this.mode] ? this.writeFunc = Ie.writers[this.mode] : console.warn("Persistence Write Error - invalid writer set", this.mode), this.id = "tabulator-" + (t || this.table.element.getAttribute("id") || ""), this.config = {
        sort: this.table.options.persistence === !0 || this.table.options.persistence.sort,
        filter: this.table.options.persistence === !0 || this.table.options.persistence.filter,
        headerFilter: this.table.options.persistence === !0 || this.table.options.persistence.headerFilter,
        group: this.table.options.persistence === !0 || this.table.options.persistence.group,
        page: this.table.options.persistence === !0 || this.table.options.persistence.page,
        columns: this.table.options.persistence === !0 ? ["title", "width", "visible"] : this.table.options.persistence.columns
      }, this.config.page && (A = this.retrieveData("page"), A && (typeof A.paginationSize < "u" && (this.config.page === !0 || this.config.page.size) && (this.table.options.paginationSize = A.paginationSize), typeof A.paginationInitialPage < "u" && (this.config.page === !0 || this.config.page.page) && (this.table.options.paginationInitialPage = A.paginationInitialPage))), this.config.group && (A = this.retrieveData("group"), A && (typeof A.groupBy < "u" && (this.config.group === !0 || this.config.group.groupBy) && (this.table.options.groupBy = A.groupBy), typeof A.groupStartOpen < "u" && (this.config.group === !0 || this.config.group.groupStartOpen) && (this.table.options.groupStartOpen = A.groupStartOpen), typeof A.groupHeader < "u" && (this.config.group === !0 || this.config.group.groupHeader) && (this.table.options.groupHeader = A.groupHeader))), this.config.columns && (this.table.options.columns = this.load("columns", this.table.options.columns), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("column-show", this.save.bind(this, "columns")), this.subscribe("column-hide", this.save.bind(this, "columns")), this.subscribe("column-moved", this.save.bind(this, "columns"))), this.subscribe("table-built", this.tableBuilt.bind(this), 0), this.subscribe("table-redraw", this.tableRedraw.bind(this)), this.subscribe("filter-changed", this.eventSave.bind(this, "filter")), this.subscribe("filter-changed", this.eventSave.bind(this, "headerFilter")), this.subscribe("sort-changed", this.eventSave.bind(this, "sort")), this.subscribe("group-changed", this.eventSave.bind(this, "group")), this.subscribe("page-changed", this.eventSave.bind(this, "page")), this.subscribe("column-resized", this.eventSave.bind(this, "columns")), this.subscribe("column-width", this.eventSave.bind(this, "columns")), this.subscribe("layout-refreshed", this.eventSave.bind(this, "columns"));
    }
    this.registerTableFunction("getColumnLayout", this.getColumnLayout.bind(this)), this.registerTableFunction("setColumnLayout", this.setColumnLayout.bind(this));
  }
  eventSave(e) {
    this.config[e] && this.save(e);
  }
  tableBuilt() {
    var e, t, A;
    this.config.sort && (e = this.load("sort"), e && (this.table.options.initialSort = e)), this.config.filter && (t = this.load("filter"), t && (this.table.options.initialFilter = t)), this.config.headerFilter && (A = this.load("headerFilter"), A && (this.table.options.initialHeaderFilter = A));
  }
  tableRedraw(e) {
    e && this.config.columns && this.save("columns");
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  getColumnLayout() {
    return this.parseColumns(this.table.columnManager.getColumns());
  }
  setColumnLayout(e) {
    return this.table.columnManager.setColumns(this.mergeDefinition(this.table.options.columns, e, !0)), !0;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  initializeColumn(e) {
    var t, A;
    this.config.columns && (this.defWatcherBlock = !0, t = e.getDefinition(), A = this.config.columns === !0 ? Object.keys(t) : this.config.columns, A.forEach((i) => {
      var s = Object.getOwnPropertyDescriptor(t, i), n = t[i];
      s && Object.defineProperty(t, i, {
        set: (o) => {
          n = o, this.defWatcherBlock || this.save("columns"), s.set && s.set(o);
        },
        get: () => (s.get && s.get(), n)
      });
    }), this.defWatcherBlock = !1);
  }
  //load saved definitions
  load(e, t) {
    var A = this.retrieveData(e);
    return t && (A = A ? this.mergeDefinition(t, A) : t), A;
  }
  //retrieve data from memory
  retrieveData(e) {
    return this.readFunc ? this.readFunc(this.id, e) : !1;
  }
  //merge old and new column definitions
  mergeDefinition(e, t, A) {
    var i = [];
    return t = t || [], t.forEach((s, n) => {
      var o = this._findColumn(e, s), a;
      o && (A ? a = Object.keys(s) : this.config.columns === !0 || this.config.columns == null ? (a = Object.keys(o), a.push("width")) : a = this.config.columns, a.forEach((l) => {
        l !== "columns" && typeof s[l] < "u" && (o[l] = s[l]);
      }), o.columns && (o.columns = this.mergeDefinition(o.columns, s.columns)), i.push(o));
    }), e.forEach((s, n) => {
      var o = this._findColumn(t, s);
      o || (i.length > n ? i.splice(n, 0, s) : i.push(s));
    }), i;
  }
  //find matching columns
  _findColumn(e, t) {
    var A = t.columns ? "group" : t.field ? "field" : "object";
    return e.find(function(i) {
      switch (A) {
        case "group":
          return i.title === t.title && i.columns.length === t.columns.length;
        case "field":
          return i.field === t.field;
        case "object":
          return i === t;
      }
    });
  }
  //save data
  save(e) {
    var t = {};
    switch (e) {
      case "columns":
        t = this.parseColumns(this.table.columnManager.getColumns());
        break;
      case "filter":
        t = this.table.modules.filter.getFilters();
        break;
      case "headerFilter":
        t = this.table.modules.filter.getHeaderFilters();
        break;
      case "sort":
        t = this.validateSorters(this.table.modules.sort.getSort());
        break;
      case "group":
        t = this.getGroupConfig();
        break;
      case "page":
        t = this.getPageConfig();
        break;
    }
    this.writeFunc && this.writeFunc(this.id, e, t);
  }
  //ensure sorters contain no function data
  validateSorters(e) {
    return e.forEach(function(t) {
      t.column = t.field, delete t.field;
    }), e;
  }
  getGroupConfig() {
    var e = {};
    return this.config.group && ((this.config.group === !0 || this.config.group.groupBy) && (e.groupBy = this.table.options.groupBy), (this.config.group === !0 || this.config.group.groupStartOpen) && (e.groupStartOpen = this.table.options.groupStartOpen), (this.config.group === !0 || this.config.group.groupHeader) && (e.groupHeader = this.table.options.groupHeader)), e;
  }
  getPageConfig() {
    var e = {};
    return this.config.page && ((this.config.page === !0 || this.config.page.size) && (e.paginationSize = this.table.modules.page.getPageSize()), (this.config.page === !0 || this.config.page.page) && (e.paginationInitialPage = this.table.modules.page.getPage())), e;
  }
  //parse columns for data to store
  parseColumns(e) {
    var t = [], A = ["headerContextMenu", "headerMenu", "contextMenu", "clickMenu"];
    return e.forEach((i) => {
      var s = {}, n = i.getDefinition(), o;
      i.isGroup ? (s.title = n.title, s.columns = this.parseColumns(i.getColumns())) : (s.field = i.getField(), this.config.columns === !0 || this.config.columns == null ? (o = Object.keys(n), o.push("width"), o.push("visible")) : o = this.config.columns, o.forEach((a) => {
        switch (a) {
          case "width":
            s.width = i.getWidth();
            break;
          case "visible":
            s.visible = i.visible;
            break;
          default:
            typeof n[a] != "function" && A.indexOf(a) === -1 && (s[a] = n[a]);
        }
      })), t.push(s);
    }), t;
  }
};
U(Ie, "moduleName", "persistence"), U(Ie, "moduleInitOrder", -10), //load defaults
U(Ie, "readers", Rh), U(Ie, "writers", xh);
let Xs = Ie;
class no extends Y {
  constructor(e) {
    super(e), this.columnSubscribers = {}, this.registerTableOption("rowContextPopup", !1), this.registerTableOption("rowClickPopup", !1), this.registerTableOption("rowDblClickPopup", !1), this.registerTableOption("groupContextPopup", !1), this.registerTableOption("groupClickPopup", !1), this.registerTableOption("groupDblClickPopup", !1), this.registerColumnOption("headerContextPopup"), this.registerColumnOption("headerClickPopup"), this.registerColumnOption("headerDblClickPopup"), this.registerColumnOption("headerPopup"), this.registerColumnOption("headerPopupIcon"), this.registerColumnOption("contextPopup"), this.registerColumnOption("clickPopup"), this.registerColumnOption("dblClickPopup"), this.registerComponentFunction("cell", "popup", this._componentPopupCall.bind(this)), this.registerComponentFunction("column", "popup", this._componentPopupCall.bind(this)), this.registerComponentFunction("row", "popup", this._componentPopupCall.bind(this)), this.registerComponentFunction("group", "popup", this._componentPopupCall.bind(this));
  }
  initialize() {
    this.initializeRowWatchers(), this.initializeGroupWatchers(), this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  _componentPopupCall(e, t, A) {
    this.loadPopupEvent(t, null, e, A);
  }
  initializeRowWatchers() {
    this.table.options.rowContextPopup && (this.subscribe("row-contextmenu", this.loadPopupEvent.bind(this, this.table.options.rowContextPopup)), this.table.on("rowTapHold", this.loadPopupEvent.bind(this, this.table.options.rowContextPopup))), this.table.options.rowClickPopup && this.subscribe("row-click", this.loadPopupEvent.bind(this, this.table.options.rowClickPopup)), this.table.options.rowDblClickPopup && this.subscribe("row-dblclick", this.loadPopupEvent.bind(this, this.table.options.rowDblClickPopup));
  }
  initializeGroupWatchers() {
    this.table.options.groupContextPopup && (this.subscribe("group-contextmenu", this.loadPopupEvent.bind(this, this.table.options.groupContextPopup)), this.table.on("groupTapHold", this.loadPopupEvent.bind(this, this.table.options.groupContextPopup))), this.table.options.groupClickPopup && this.subscribe("group-click", this.loadPopupEvent.bind(this, this.table.options.groupClickPopup)), this.table.options.groupDblClickPopup && this.subscribe("group-dblclick", this.loadPopupEvent.bind(this, this.table.options.groupDblClickPopup));
  }
  initializeColumn(e) {
    var t = e.definition;
    t.headerContextPopup && !this.columnSubscribers.headerContextPopup && (this.columnSubscribers.headerContextPopup = this.loadPopupTableColumnEvent.bind(this, "headerContextPopup"), this.subscribe("column-contextmenu", this.columnSubscribers.headerContextPopup), this.table.on("headerTapHold", this.loadPopupTableColumnEvent.bind(this, "headerContextPopup"))), t.headerClickPopup && !this.columnSubscribers.headerClickPopup && (this.columnSubscribers.headerClickPopup = this.loadPopupTableColumnEvent.bind(this, "headerClickPopup"), this.subscribe("column-click", this.columnSubscribers.headerClickPopup)), t.headerDblClickPopup && !this.columnSubscribers.headerDblClickPopup && (this.columnSubscribers.headerDblClickPopup = this.loadPopupTableColumnEvent.bind(this, "headerDblClickPopup"), this.subscribe("column-dblclick", this.columnSubscribers.headerDblClickPopup)), t.headerPopup && this.initializeColumnHeaderPopup(e), t.contextPopup && !this.columnSubscribers.contextPopup && (this.columnSubscribers.contextPopup = this.loadPopupTableCellEvent.bind(this, "contextPopup"), this.subscribe("cell-contextmenu", this.columnSubscribers.contextPopup), this.table.on("cellTapHold", this.loadPopupTableCellEvent.bind(this, "contextPopup"))), t.clickPopup && !this.columnSubscribers.clickPopup && (this.columnSubscribers.clickPopup = this.loadPopupTableCellEvent.bind(this, "clickPopup"), this.subscribe("cell-click", this.columnSubscribers.clickPopup)), t.dblClickPopup && !this.columnSubscribers.dblClickPopup && (this.columnSubscribers.dblClickPopup = this.loadPopupTableCellEvent.bind(this, "dblClickPopup"), this.subscribe("cell-click", this.columnSubscribers.dblClickPopup));
  }
  initializeColumnHeaderPopup(e) {
    var t = e.definition.headerPopupIcon, A;
    A = document.createElement("span"), A.classList.add("tabulator-header-popup-button"), t ? (typeof t == "function" && (t = t(e.getComponent())), t instanceof HTMLElement ? A.appendChild(t) : A.innerHTML = t) : A.innerHTML = "&vellip;", A.addEventListener("click", (i) => {
      i.stopPropagation(), i.preventDefault(), this.loadPopupEvent(e.definition.headerPopup, i, e);
    }), e.titleElement.insertBefore(A, e.titleElement.firstChild);
  }
  loadPopupTableCellEvent(e, t, A) {
    A._cell && (A = A._cell), A.column.definition[e] && this.loadPopupEvent(A.column.definition[e], t, A);
  }
  loadPopupTableColumnEvent(e, t, A) {
    A._column && (A = A._column), A.definition[e] && this.loadPopupEvent(A.definition[e], t, A);
  }
  loadPopupEvent(e, t, A, i) {
    var s;
    function n(o) {
      s = o;
    }
    A._group ? A = A._group : A._row && (A = A._row), e = typeof e == "function" ? e.call(this.table, t, A.getComponent(), n) : e, this.loadPopup(t, A, e, s, i);
  }
  loadPopup(e, t, A, i, s) {
    var n = !(e instanceof MouseEvent), o, a;
    A instanceof HTMLElement ? o = A : (o = document.createElement("div"), o.innerHTML = A), o.classList.add("tabulator-popup"), o.addEventListener("click", (l) => {
      l.stopPropagation();
    }), n || e.preventDefault(), a = this.popup(o), typeof i == "function" && a.renderCallback(i), e ? a.show(e) : a.show(t.getElement(), s || "center"), a.hideOnBlur(() => {
      this.dispatchExternal("popupClosed", t.getComponent());
    }), this.dispatchExternal("popupOpened", t.getComponent());
  }
}
U(no, "moduleName", "popup");
class oo extends Y {
  constructor(e) {
    super(e), this.element = !1, this.manualBlock = !1, this.beforeprintEventHandler = null, this.afterprintEventHandler = null, this.registerTableOption("printAsHtml", !1), this.registerTableOption("printFormatter", !1), this.registerTableOption("printHeader", !1), this.registerTableOption("printFooter", !1), this.registerTableOption("printStyled", !0), this.registerTableOption("printRowRange", "visible"), this.registerTableOption("printConfig", {}), this.registerColumnOption("print"), this.registerColumnOption("titlePrint");
  }
  initialize() {
    this.table.options.printAsHtml && (this.beforeprintEventHandler = this.replaceTable.bind(this), this.afterprintEventHandler = this.cleanup.bind(this), window.addEventListener("beforeprint", this.beforeprintEventHandler), window.addEventListener("afterprint", this.afterprintEventHandler), this.subscribe("table-destroy", this.destroy.bind(this))), this.registerTableFunction("print", this.printFullscreen.bind(this));
  }
  destroy() {
    this.table.options.printAsHtml && (window.removeEventListener("beforeprint", this.beforeprintEventHandler), window.removeEventListener("afterprint", this.afterprintEventHandler));
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  replaceTable() {
    this.manualBlock || (this.element = document.createElement("div"), this.element.classList.add("tabulator-print-table"), this.element.appendChild(this.table.modules.export.generateTable(this.table.options.printConfig, this.table.options.printStyled, this.table.options.printRowRange, "print")), this.table.element.style.display = "none", this.table.element.parentNode.insertBefore(this.element, this.table.element));
  }
  cleanup() {
    document.body.classList.remove("tabulator-print-fullscreen-hide"), this.element && this.element.parentNode && (this.element.parentNode.removeChild(this.element), this.table.element.style.display = "");
  }
  printFullscreen(e, t, A) {
    var i = window.scrollX, s = window.scrollY, n = document.createElement("div"), o = document.createElement("div"), a = this.table.modules.export.generateTable(typeof A < "u" ? A : this.table.options.printConfig, typeof t < "u" ? t : this.table.options.printStyled, e || this.table.options.printRowRange, "print"), l, h;
    this.manualBlock = !0, this.element = document.createElement("div"), this.element.classList.add("tabulator-print-fullscreen"), this.table.options.printHeader && (n.classList.add("tabulator-print-header"), l = typeof this.table.options.printHeader == "function" ? this.table.options.printHeader.call(this.table) : this.table.options.printHeader, typeof l == "string" ? n.innerHTML = l : n.appendChild(l), this.element.appendChild(n)), this.element.appendChild(a), this.table.options.printFooter && (o.classList.add("tabulator-print-footer"), h = typeof this.table.options.printFooter == "function" ? this.table.options.printFooter.call(this.table) : this.table.options.printFooter, typeof h == "string" ? o.innerHTML = h : o.appendChild(h), this.element.appendChild(o)), document.body.classList.add("tabulator-print-fullscreen-hide"), document.body.appendChild(this.element), this.table.options.printFormatter && this.table.options.printFormatter(this.element, a), window.print(), this.cleanup(), window.scrollTo(i, s), this.manualBlock = !1;
  }
}
U(oo, "moduleName", "print");
class ao extends Y {
  constructor(e) {
    super(e), this.data = !1, this.blocked = !1, this.origFuncs = {}, this.currentVersion = 0, this.registerTableOption("reactiveData", !1);
  }
  initialize() {
    this.table.options.reactiveData && (this.subscribe("cell-value-save-before", this.block.bind(this, "cellsave")), this.subscribe("cell-value-save-after", this.unblock.bind(this, "cellsave")), this.subscribe("row-data-save-before", this.block.bind(this, "rowsave")), this.subscribe("row-data-save-after", this.unblock.bind(this, "rowsave")), this.subscribe("row-data-init-after", this.watchRow.bind(this)), this.subscribe("data-processing", this.watchData.bind(this)), this.subscribe("table-destroy", this.unwatchData.bind(this)));
  }
  watchData(e) {
    var t = this, A;
    this.currentVersion++, A = this.currentVersion, this.unwatchData(), this.data = e, this.origFuncs.push = e.push, Object.defineProperty(this.data, "push", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var i = Array.from(arguments), s;
        return !t.blocked && A === t.currentVersion && (t.block("data-push"), i.forEach((n) => {
          t.table.rowManager.addRowActual(n, !1);
        }), s = t.origFuncs.push.apply(e, arguments), t.unblock("data-push")), s;
      }
    }), this.origFuncs.unshift = e.unshift, Object.defineProperty(this.data, "unshift", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var i = Array.from(arguments), s;
        return !t.blocked && A === t.currentVersion && (t.block("data-unshift"), i.forEach((n) => {
          t.table.rowManager.addRowActual(n, !0);
        }), s = t.origFuncs.unshift.apply(e, arguments), t.unblock("data-unshift")), s;
      }
    }), this.origFuncs.shift = e.shift, Object.defineProperty(this.data, "shift", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var i, s;
        return !t.blocked && A === t.currentVersion && (t.block("data-shift"), t.data.length && (i = t.table.rowManager.getRowFromDataObject(t.data[0]), i && i.deleteActual()), s = t.origFuncs.shift.call(e), t.unblock("data-shift")), s;
      }
    }), this.origFuncs.pop = e.pop, Object.defineProperty(this.data, "pop", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var i, s;
        return !t.blocked && A === t.currentVersion && (t.block("data-pop"), t.data.length && (i = t.table.rowManager.getRowFromDataObject(t.data[t.data.length - 1]), i && i.deleteActual()), s = t.origFuncs.pop.call(e), t.unblock("data-pop")), s;
      }
    }), this.origFuncs.splice = e.splice, Object.defineProperty(this.data, "splice", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var i = Array.from(arguments), s = i[0] < 0 ? e.length + i[0] : i[0], n = i[1], o = i[2] ? i.slice(2) : !1, a, l;
        if (!t.blocked && A === t.currentVersion) {
          if (t.block("data-splice"), o && (a = e[s] ? t.table.rowManager.getRowFromDataObject(e[s]) : !1, a ? o.forEach((u) => {
            t.table.rowManager.addRowActual(u, !0, a, !0);
          }) : (o = o.slice().reverse(), o.forEach((u) => {
            t.table.rowManager.addRowActual(u, !0, !1, !0);
          }))), n !== 0) {
            var h = e.slice(s, typeof i[1] > "u" ? i[1] : s + n);
            h.forEach((u, c) => {
              var f = t.table.rowManager.getRowFromDataObject(u);
              f && f.deleteActual(c !== h.length - 1);
            });
          }
          (o || n !== 0) && t.table.rowManager.reRenderInPosition(), l = t.origFuncs.splice.apply(e, arguments), t.unblock("data-splice");
        }
        return l;
      }
    });
  }
  unwatchData() {
    if (this.data !== !1)
      for (var e in this.origFuncs)
        Object.defineProperty(this.data, e, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: this.origFuncs.key
        });
  }
  watchRow(e) {
    var t = e.getData();
    for (var A in t)
      this.watchKey(e, t, A);
    this.table.options.dataTree && this.watchTreeChildren(e);
  }
  watchTreeChildren(e) {
    var t = this, A = e.getData()[this.table.options.dataTreeChildField], i = {};
    A && (i.push = A.push, Object.defineProperty(A, "push", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-push");
          var s = i.push.apply(A, arguments);
          this.rebuildTree(e), t.unblock("tree-push");
        }
        return s;
      }
    }), i.unshift = A.unshift, Object.defineProperty(A, "unshift", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-unshift");
          var s = i.unshift.apply(A, arguments);
          this.rebuildTree(e), t.unblock("tree-unshift");
        }
        return s;
      }
    }), i.shift = A.shift, Object.defineProperty(A, "shift", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-shift");
          var s = i.shift.call(A);
          this.rebuildTree(e), t.unblock("tree-shift");
        }
        return s;
      }
    }), i.pop = A.pop, Object.defineProperty(A, "pop", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-pop");
          var s = i.pop.call(A);
          this.rebuildTree(e), t.unblock("tree-pop");
        }
        return s;
      }
    }), i.splice = A.splice, Object.defineProperty(A, "splice", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-splice");
          var s = i.splice.apply(A, arguments);
          this.rebuildTree(e), t.unblock("tree-splice");
        }
        return s;
      }
    }));
  }
  rebuildTree(e) {
    this.table.modules.dataTree.initializeRow(e), this.table.modules.dataTree.layoutRow(e), this.table.rowManager.refreshActiveData("tree", !1, !0);
  }
  watchKey(e, t, A) {
    var i = this, s = Object.getOwnPropertyDescriptor(t, A), n = t[A], o = this.currentVersion;
    Object.defineProperty(t, A, {
      set: (a) => {
        if (n = a, !i.blocked && o === i.currentVersion) {
          i.block("key");
          var l = {};
          l[A] = a, e.updateData(l), i.unblock("key");
        }
        s.set && s.set(a);
      },
      get: () => (s.get && s.get(), n)
    });
  }
  unwatchRow(e) {
    var t = e.getData();
    for (var A in t)
      Object.defineProperty(t, A, {
        value: t[A]
      });
  }
  block(e) {
    this.blocked || (this.blocked = e);
  }
  unblock(e) {
    this.blocked === e && (this.blocked = !1);
  }
}
U(ao, "moduleName", "reactiveData");
class lo extends Y {
  constructor(e) {
    super(e), this.startColumn = !1, this.startX = !1, this.startWidth = !1, this.latestX = !1, this.handle = null, this.initialNextColumn = null, this.nextColumn = null, this.initialized = !1, this.registerColumnOption("resizable", !0), this.registerTableOption("resizableColumnFit", !1), this.registerTableOption("resizableColumnGuide", !1);
  }
  initialize() {
    this.subscribe("column-rendered", this.layoutColumnHeader.bind(this));
  }
  initializeEventWatchers() {
    this.initialized || (this.subscribe("cell-rendered", this.layoutCellHandles.bind(this)), this.subscribe("cell-delete", this.deInitializeComponent.bind(this)), this.subscribe("cell-height", this.resizeHandle.bind(this)), this.subscribe("column-moved", this.columnLayoutUpdated.bind(this)), this.subscribe("column-hide", this.deInitializeColumn.bind(this)), this.subscribe("column-show", this.columnLayoutUpdated.bind(this)), this.subscribe("column-width", this.columnWidthUpdated.bind(this)), this.subscribe("column-delete", this.deInitializeComponent.bind(this)), this.subscribe("column-height", this.resizeHandle.bind(this)), this.initialized = !0);
  }
  layoutCellHandles(e) {
    e.row.type === "row" && (this.deInitializeComponent(e), this.initializeColumn("cell", e, e.column, e.element));
  }
  layoutColumnHeader(e) {
    e.definition.resizable && (this.initializeEventWatchers(), this.deInitializeComponent(e), this.initializeColumn("header", e, e, e.element));
  }
  columnLayoutUpdated(e) {
    var t = e.prevColumn();
    this.reinitializeColumn(e), t && this.reinitializeColumn(t);
  }
  columnWidthUpdated(e) {
    e.modules.frozen && (this.table.modules.frozenColumns.leftColumns.includes(e) ? this.table.modules.frozenColumns.leftColumns.forEach((t) => {
      this.reinitializeColumn(t);
    }) : this.table.modules.frozenColumns.rightColumns.includes(e) && this.table.modules.frozenColumns.rightColumns.forEach((t) => {
      this.reinitializeColumn(t);
    }));
  }
  frozenColumnOffset(e) {
    var t = !1;
    return e.modules.frozen && (t = e.modules.frozen.marginValue, e.modules.frozen.position === "left" ? t += e.getWidth() - 3 : t && (t -= 3)), t !== !1 ? t + "px" : !1;
  }
  reinitializeColumn(e) {
    var t = this.frozenColumnOffset(e);
    e.cells.forEach((A) => {
      A.modules.resize && A.modules.resize.handleEl && (t && (A.modules.resize.handleEl.style[e.modules.frozen.position] = t, A.modules.resize.handleEl.style["z-index"] = 11), A.element.after(A.modules.resize.handleEl));
    }), e.modules.resize && e.modules.resize.handleEl && (t && (e.modules.resize.handleEl.style[e.modules.frozen.position] = t), e.element.after(e.modules.resize.handleEl));
  }
  initializeColumn(e, t, A, i) {
    var s = this, n = !1, o = A.definition.resizable, a = {}, l = A.getLastColumn();
    if (e === "header" && (n = A.definition.formatter == "textarea" || A.definition.variableHeight, a = { variableHeight: n }), (o === !0 || o == e) && this._checkResizability(l)) {
      var h = document.createElement("span");
      h.className = "tabulator-col-resize-handle", h.addEventListener("click", function(c) {
        c.stopPropagation();
      });
      var u = function(c) {
        s.startColumn = A, s.initialNextColumn = s.nextColumn = l.nextColumn(), s._mouseDown(c, l, h);
      };
      h.addEventListener("mousedown", u), h.addEventListener("touchstart", u, { passive: !0 }), h.addEventListener("dblclick", (c) => {
        var f = l.getWidth();
        c.stopPropagation(), l.reinitializeWidth(!0), f !== l.getWidth() && (s.dispatch("column-resized", l), s.dispatchExternal("columnResized", l.getComponent()));
      }), A.modules.frozen && (h.style.position = "sticky", h.style[A.modules.frozen.position] = this.frozenColumnOffset(A)), a.handleEl = h, i.parentNode && A.visible && i.after(h);
    }
    t.modules.resize = a;
  }
  deInitializeColumn(e) {
    this.deInitializeComponent(e), e.cells.forEach((t) => {
      this.deInitializeComponent(t);
    });
  }
  deInitializeComponent(e) {
    var t;
    e.modules.resize && (t = e.modules.resize.handleEl, t && t.parentElement && t.parentElement.removeChild(t));
  }
  resizeHandle(e, t) {
    e.modules.resize && e.modules.resize.handleEl && (e.modules.resize.handleEl.style.height = t);
  }
  resize(e, t) {
    var A = typeof e.clientX > "u" ? e.touches[0].clientX : e.clientX, i = A - this.startX, s = A - this.latestX, n, o;
    if (this.latestX = A, this.table.rtl && (i = -i, s = -s), n = t.width == t.minWidth || t.width == t.maxWidth, t.setWidth(this.startWidth + i), o = t.width == t.minWidth || t.width == t.maxWidth, s < 0 && (this.nextColumn = this.initialNextColumn), this.table.options.resizableColumnFit && this.nextColumn && !(n && o)) {
      let a = this.nextColumn.getWidth();
      s > 0 && a <= this.nextColumn.minWidth && (this.nextColumn = this.nextColumn.nextColumn()), this.nextColumn && this.nextColumn.setWidth(this.nextColumn.getWidth() - s);
    }
    this.table.columnManager.rerenderColumns(!0), !this.table.browserSlow && t.modules.resize && t.modules.resize.variableHeight && t.checkCellHeights();
  }
  calcGuidePosition(e, t, A) {
    var i = typeof e.clientX > "u" ? e.touches[0].clientX : e.clientX, s = A.getBoundingClientRect().x - this.table.element.getBoundingClientRect().x, n = this.table.element.getBoundingClientRect().x, o = t.element.getBoundingClientRect().left - n, a = i - this.startX, l = Math.max(s + a, o + t.minWidth);
    return t.maxWidth && (l = Math.min(l, o + t.maxWidth)), l;
  }
  _checkResizability(e) {
    return e.definition.resizable;
  }
  _mouseDown(e, t, A) {
    var i = this, s;
    this.dispatchExternal("columnResizing", t.getComponent()), i.table.options.resizableColumnGuide && (s = document.createElement("span"), s.classList.add("tabulator-col-resize-guide"), i.table.element.appendChild(s), setTimeout(() => {
      s.style.left = i.calcGuidePosition(e, t, A) + "px";
    })), i.table.element.classList.add("tabulator-block-select");
    function n(a) {
      i.table.options.resizableColumnGuide ? s.style.left = i.calcGuidePosition(a, t, A) + "px" : i.resize(a, t);
    }
    function o(a) {
      i.table.options.resizableColumnGuide && (i.resize(a, t), s.remove()), i.startColumn.modules.edit && (i.startColumn.modules.edit.blocked = !1), i.table.browserSlow && t.modules.resize && t.modules.resize.variableHeight && t.checkCellHeights(), document.body.removeEventListener("mouseup", o), document.body.removeEventListener("mousemove", n), A.removeEventListener("touchmove", n), A.removeEventListener("touchend", o), i.table.element.classList.remove("tabulator-block-select"), i.startWidth !== t.getWidth() && (i.table.columnManager.verticalAlignHeaders(), i.dispatch("column-resized", t), i.dispatchExternal("columnResized", t.getComponent()));
    }
    e.stopPropagation(), i.startColumn.modules.edit && (i.startColumn.modules.edit.blocked = !0), i.startX = typeof e.clientX > "u" ? e.touches[0].clientX : e.clientX, i.latestX = i.startX, i.startWidth = t.getWidth(), document.body.addEventListener("mousemove", n), document.body.addEventListener("mouseup", o), A.addEventListener("touchmove", n, { passive: !0 }), A.addEventListener("touchend", o);
  }
}
U(lo, "moduleName", "resizeColumns");
class ho extends Y {
  constructor(e) {
    super(e), this.startColumn = !1, this.startY = !1, this.startHeight = !1, this.handle = null, this.prevHandle = null, this.registerTableOption("resizableRows", !1), this.registerTableOption("resizableRowGuide", !1);
  }
  initialize() {
    this.table.options.resizableRows && this.subscribe("row-layout-after", this.initializeRow.bind(this));
  }
  initializeRow(e) {
    var t = this, A = e.getElement(), i = document.createElement("div");
    i.className = "tabulator-row-resize-handle";
    var s = document.createElement("div");
    s.className = "tabulator-row-resize-handle prev", i.addEventListener("click", function(a) {
      a.stopPropagation();
    });
    var n = function(a) {
      t.startRow = e, t._mouseDown(a, e, i);
    };
    i.addEventListener("mousedown", n), i.addEventListener("touchstart", n, { passive: !0 }), s.addEventListener("click", function(a) {
      a.stopPropagation();
    });
    var o = function(a) {
      var l = t.table.rowManager.prevDisplayRow(e);
      l && (t.startRow = l, t._mouseDown(a, l, s));
    };
    s.addEventListener("mousedown", o), s.addEventListener("touchstart", o, { passive: !0 }), A.appendChild(i), A.appendChild(s);
  }
  resize(e, t) {
    t.setHeight(this.startHeight + ((typeof e.screenY > "u" ? e.touches[0].screenY : e.screenY) - this.startY));
  }
  calcGuidePosition(e, t, A) {
    var i = typeof e.screenY > "u" ? e.touches[0].screenY : e.screenY, s = A.getBoundingClientRect().y - this.table.element.getBoundingClientRect().y, n = this.table.element.getBoundingClientRect().y, o = t.element.getBoundingClientRect().top - n, a = i - this.startY;
    return Math.max(s + a, o);
  }
  _mouseDown(e, t, A) {
    var i = this, s;
    i.dispatchExternal("rowResizing", t.getComponent()), i.table.options.resizableRowGuide && (s = document.createElement("span"), s.classList.add("tabulator-row-resize-guide"), i.table.element.appendChild(s), setTimeout(() => {
      s.style.top = i.calcGuidePosition(e, t, A) + "px";
    })), i.table.element.classList.add("tabulator-block-select");
    function n(a) {
      i.table.options.resizableRowGuide ? s.style.top = i.calcGuidePosition(a, t, A) + "px" : i.resize(a, t);
    }
    function o(a) {
      i.table.options.resizableRowGuide && (i.resize(a, t), s.remove()), document.body.removeEventListener("mouseup", n), document.body.removeEventListener("mousemove", n), A.removeEventListener("touchmove", n), A.removeEventListener("touchend", o), i.table.element.classList.remove("tabulator-block-select"), i.dispatchExternal("rowResized", t.getComponent());
    }
    e.stopPropagation(), i.startY = typeof e.screenY > "u" ? e.touches[0].screenY : e.screenY, i.startHeight = t.getHeight(), document.body.addEventListener("mousemove", n), document.body.addEventListener("mouseup", o), A.addEventListener("touchmove", n, { passive: !0 }), A.addEventListener("touchend", o);
  }
}
U(ho, "moduleName", "resizeRows");
class uo extends Y {
  constructor(e) {
    super(e), this.binding = !1, this.visibilityObserver = !1, this.resizeObserver = !1, this.containerObserver = !1, this.tableHeight = 0, this.tableWidth = 0, this.containerHeight = 0, this.containerWidth = 0, this.autoResize = !1, this.visible = !1, this.initialized = !1, this.initialRedraw = !1, this.registerTableOption("autoResize", !0);
  }
  initialize() {
    if (this.table.options.autoResize) {
      var e = this.table, t;
      this.tableHeight = e.element.clientHeight, this.tableWidth = e.element.clientWidth, e.element.parentNode && (this.containerHeight = e.element.parentNode.clientHeight, this.containerWidth = e.element.parentNode.clientWidth), typeof IntersectionObserver < "u" && typeof ResizeObserver < "u" && e.rowManager.getRenderMode() === "virtual" ? (this.initializeVisibilityObserver(), this.autoResize = !0, this.resizeObserver = new ResizeObserver((A) => {
        if (!e.browserMobile || e.browserMobile && (!e.modules.edit || e.modules.edit && !e.modules.edit.currentCell)) {
          var i = Math.floor(A[0].contentRect.height), s = Math.floor(A[0].contentRect.width);
          (this.tableHeight != i || this.tableWidth != s) && (this.tableHeight = i, this.tableWidth = s, e.element.parentNode && (this.containerHeight = e.element.parentNode.clientHeight, this.containerWidth = e.element.parentNode.clientWidth), this.redrawTable());
        }
      }), this.resizeObserver.observe(e.element), t = window.getComputedStyle(e.element), this.table.element.parentNode && !this.table.rowManager.fixedHeight && (t.getPropertyValue("max-height") || t.getPropertyValue("min-height")) && (this.containerObserver = new ResizeObserver((A) => {
        if (!e.browserMobile || e.browserMobile && (!e.modules.edit || e.modules.edit && !e.modules.edit.currentCell)) {
          var i = Math.floor(A[0].contentRect.height), s = Math.floor(A[0].contentRect.width);
          (this.containerHeight != i || this.containerWidth != s) && (this.containerHeight = i, this.containerWidth = s, this.tableHeight = e.element.clientHeight, this.tableWidth = e.element.clientWidth), this.redrawTable();
        }
      }), this.containerObserver.observe(this.table.element.parentNode)), this.subscribe("table-resize", this.tableResized.bind(this))) : (this.binding = function() {
        (!e.browserMobile || e.browserMobile && (!e.modules.edit || e.modules.edit && !e.modules.edit.currentCell)) && (e.columnManager.rerenderColumns(!0), e.redraw());
      }, window.addEventListener("resize", this.binding)), this.subscribe("table-destroy", this.clearBindings.bind(this));
    }
  }
  initializeVisibilityObserver() {
    this.visibilityObserver = new IntersectionObserver((e) => {
      this.visible = e[0].isIntersecting, this.initialized ? this.visible && (this.redrawTable(this.initialRedraw), this.initialRedraw = !1) : (this.initialized = !0, this.initialRedraw = !this.visible);
    }), this.visibilityObserver.observe(this.table.element);
  }
  redrawTable(e) {
    this.initialized && this.visible && (this.table.columnManager.rerenderColumns(!0), this.table.redraw(e));
  }
  tableResized() {
    this.table.rowManager.redraw();
  }
  clearBindings() {
    this.binding && window.removeEventListener("resize", this.binding), this.resizeObserver && this.resizeObserver.unobserve(this.table.element), this.visibilityObserver && this.visibilityObserver.unobserve(this.table.element), this.containerObserver && this.containerObserver.unobserve(this.table.element.parentNode);
  }
}
U(uo, "moduleName", "resizeTable");
function Th(r, e, t) {
  var A = document.createElement("div"), i = r.getRow()._row.modules.responsiveLayout;
  A.classList.add("tabulator-responsive-collapse-toggle"), A.innerHTML = `<svg class='tabulator-responsive-collapse-toggle-open' viewbox="0 0 24 24">
  <line x1="7" y1="12" x2="17" y2="12" fill="none" stroke-width="3" stroke-linecap="round" />
  <line y1="7" x1="12" y2="17" x2="12" fill="none" stroke-width="3" stroke-linecap="round" />
</svg>

<svg class='tabulator-responsive-collapse-toggle-close' viewbox="0 0 24 24">
  <line x1="7" y1="12" x2="17" y2="12"  fill="none" stroke-width="3" stroke-linecap="round" />
</svg>`, r.getElement().classList.add("tabulator-row-handle");
  function s(n) {
    var o = i.element;
    i.open = n, o && (i.open ? (A.classList.add("open"), o.style.display = "") : (A.classList.remove("open"), o.style.display = "none"));
  }
  return A.addEventListener("click", function(n) {
    n.stopImmediatePropagation(), s(!i.open), r.getTable().rowManager.adjustTableSize();
  }), s(i.open), A;
}
var Lh = {
  format: {
    formatters: {
      responsiveCollapse: Th
    }
  }
};
class Js extends Y {
  constructor(e) {
    super(e), this.columns = [], this.hiddenColumns = [], this.mode = "", this.index = 0, this.collapseFormatter = [], this.collapseStartOpen = !0, this.collapseHandleColumn = !1, this.registerTableOption("responsiveLayout", !1), this.registerTableOption("responsiveLayoutCollapseStartOpen", !0), this.registerTableOption("responsiveLayoutCollapseUseFormatters", !0), this.registerTableOption("responsiveLayoutCollapseFormatter", !1), this.registerColumnOption("responsive");
  }
  //generate responsive columns list
  initialize() {
    this.table.options.responsiveLayout && (this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("column-show", this.updateColumnVisibility.bind(this)), this.subscribe("column-hide", this.updateColumnVisibility.bind(this)), this.subscribe("columns-loaded", this.initializeResponsivity.bind(this)), this.subscribe("column-moved", this.initializeResponsivity.bind(this)), this.subscribe("column-add", this.initializeResponsivity.bind(this)), this.subscribe("column-delete", this.initializeResponsivity.bind(this)), this.subscribe("table-redrawing", this.tableRedraw.bind(this)), this.table.options.responsiveLayout === "collapse" && (this.subscribe("row-data-changed", this.generateCollapsedRowContent.bind(this)), this.subscribe("row-init", this.initializeRow.bind(this)), this.subscribe("row-layout", this.layoutRow.bind(this))));
  }
  tableRedraw(e) {
    ["fitColumns", "fitDataStretch"].indexOf(this.layoutMode()) === -1 && (e || this.update());
  }
  initializeResponsivity() {
    var e = [];
    this.mode = this.table.options.responsiveLayout, this.collapseFormatter = this.table.options.responsiveLayoutCollapseFormatter || this.formatCollapsedData, this.collapseStartOpen = this.table.options.responsiveLayoutCollapseStartOpen, this.hiddenColumns = [], this.collapseFormatter && (this.collapseFormatter = this.collapseFormatter.bind(this.table)), this.table.columnManager.columnsByIndex.forEach((t, A) => {
      t.modules.responsive && t.modules.responsive.order && t.modules.responsive.visible && (t.modules.responsive.index = A, e.push(t), !t.visible && this.mode === "collapse" && this.hiddenColumns.push(t));
    }), e = e.reverse(), e = e.sort((t, A) => {
      var i = A.modules.responsive.order - t.modules.responsive.order;
      return i || A.modules.responsive.index - t.modules.responsive.index;
    }), this.columns = e, this.mode === "collapse" && this.generateCollapsedContent();
    for (let t of this.table.columnManager.columnsByIndex)
      if (t.definition.formatter == "responsiveCollapse") {
        this.collapseHandleColumn = t;
        break;
      }
    this.collapseHandleColumn && (this.hiddenColumns.length ? this.collapseHandleColumn.show() : this.collapseHandleColumn.hide());
  }
  //define layout information
  initializeColumn(e) {
    var t = e.getDefinition();
    e.modules.responsive = { order: typeof t.responsive > "u" ? 1 : t.responsive, visible: t.visible !== !1 };
  }
  initializeRow(e) {
    var t;
    e.type !== "calc" && (t = document.createElement("div"), t.classList.add("tabulator-responsive-collapse"), e.modules.responsiveLayout = {
      element: t,
      open: this.collapseStartOpen
    }, this.collapseStartOpen || (t.style.display = "none"));
  }
  layoutRow(e) {
    var t = e.getElement();
    e.modules.responsiveLayout && (t.appendChild(e.modules.responsiveLayout.element), this.generateCollapsedRowContent(e));
  }
  //update column visibility
  updateColumnVisibility(e, t) {
    !t && e.modules.responsive && (e.modules.responsive.visible = e.visible, this.initializeResponsivity());
  }
  hideColumn(e) {
    var t = this.hiddenColumns.length;
    e.hide(!1, !0), this.mode === "collapse" && (this.hiddenColumns.unshift(e), this.generateCollapsedContent(), this.collapseHandleColumn && !t && this.collapseHandleColumn.show());
  }
  showColumn(e) {
    var t;
    e.show(!1, !0), e.setWidth(e.getWidth()), this.mode === "collapse" && (t = this.hiddenColumns.indexOf(e), t > -1 && this.hiddenColumns.splice(t, 1), this.generateCollapsedContent(), this.collapseHandleColumn && !this.hiddenColumns.length && this.collapseHandleColumn.hide());
  }
  //redraw columns to fit space
  update() {
    for (var e = !0; e; ) {
      let t = this.table.modules.layout.getMode() == "fitColumns" ? this.table.columnManager.getFlexBaseWidth() : this.table.columnManager.getWidth(), A = (this.table.options.headerVisible ? this.table.columnManager.element.clientWidth : this.table.element.clientWidth) - t;
      if (A < 0) {
        let i = this.columns[this.index];
        i ? (this.hideColumn(i), this.index++) : e = !1;
      } else {
        let i = this.columns[this.index - 1];
        i && A > 0 && A >= i.getWidth() ? (this.showColumn(i), this.index--) : e = !1;
      }
      this.table.rowManager.activeRowsCount || this.table.rowManager.renderEmptyScroll();
    }
  }
  generateCollapsedContent() {
    var e = this.table.rowManager.getDisplayRows();
    e.forEach((t) => {
      this.generateCollapsedRowContent(t);
    });
  }
  generateCollapsedRowContent(e) {
    var t, A;
    if (e.modules.responsiveLayout) {
      for (t = e.modules.responsiveLayout.element; t.firstChild; ) t.removeChild(t.firstChild);
      A = this.collapseFormatter(this.generateCollapsedRowData(e)), A && t.appendChild(A), e.calcHeight(!0);
    }
  }
  generateCollapsedRowData(e) {
    var t = e.getData(), A = [], i;
    return this.hiddenColumns.forEach((s) => {
      var n = s.getFieldValue(t);
      if (s.definition.title && s.field)
        if (s.modules.format && this.table.options.responsiveLayoutCollapseUseFormatters) {
          let o = function(a) {
            a();
          };
          i = {
            value: !1,
            data: {},
            getValue: function() {
              return n;
            },
            getData: function() {
              return t;
            },
            getType: function() {
              return "cell";
            },
            getElement: function() {
              return document.createElement("div");
            },
            getRow: function() {
              return e.getComponent();
            },
            getColumn: function() {
              return s.getComponent();
            },
            getTable: () => this.table
          }, A.push({
            field: s.field,
            title: s.definition.title,
            value: s.modules.format.formatter.call(this.table.modules.format, i, s.modules.format.params, o)
          });
        } else
          A.push({
            field: s.field,
            title: s.definition.title,
            value: n
          });
    }), A;
  }
  formatCollapsedData(e) {
    var t = document.createElement("table");
    return e.forEach((A) => {
      var i = document.createElement("tr"), s = document.createElement("td"), n = document.createElement("td"), o, a = document.createElement("strong");
      s.appendChild(a), this.modules.localize.bind("columns|" + A.field, function(l) {
        a.innerHTML = l || A.title;
      }), A.value instanceof Node ? (o = document.createElement("div"), o.appendChild(A.value), n.appendChild(o)) : n.innerHTML = A.value, i.appendChild(s), i.appendChild(n), t.appendChild(i);
    }), Object.keys(e).length ? t : "";
  }
}
U(Js, "moduleName", "responsiveLayout"), U(Js, "moduleExtensions", Lh);
function Ih(r, e, t) {
  var A = document.createElement("input"), i = !1;
  if (A.type = "checkbox", A.setAttribute("aria-label", "Select Row"), this.table.modExists("selectRow", !0))
    if (A.addEventListener("click", (n) => {
      n.stopPropagation();
    }), typeof r.getRow == "function") {
      var s = r.getRow();
      s instanceof Di ? (A.addEventListener("change", (n) => {
        this.table.options.selectableRowsRangeMode === "click" && i ? i = !1 : s.toggleSelect();
      }), this.table.options.selectableRowsRangeMode === "click" && A.addEventListener("click", (n) => {
        i = !0, this.table.modules.selectRow.handleComplexRowClick(s._row, n);
      }), A.checked = s.isSelected && s.isSelected(), this.table.modules.selectRow.registerRowSelectCheckbox(s, A)) : A = "";
    } else
      A.addEventListener("change", (n) => {
        this.table.modules.selectRow.selectedRows.length ? this.table.deselectRow() : this.table.selectRow(e.rowRange);
      }), this.table.modules.selectRow.registerHeaderSelectCheckbox(A);
  return A;
}
var Mh = {
  format: {
    formatters: {
      rowSelection: Ih
    }
  }
};
class js extends Y {
  constructor(e) {
    super(e), this.selecting = !1, this.lastClickedRow = !1, this.selectPrev = [], this.selectedRows = [], this.headerCheckboxElement = null, this.registerTableOption("selectableRows", "highlight"), this.registerTableOption("selectableRowsRangeMode", "drag"), this.registerTableOption("selectableRowsRollingSelection", !0), this.registerTableOption("selectableRowsPersistence", !0), this.registerTableOption("selectableRowsCheck", function(t, A) {
      return !0;
    }), this.registerTableFunction("selectRow", this.selectRows.bind(this)), this.registerTableFunction("deselectRow", this.deselectRows.bind(this)), this.registerTableFunction("toggleSelectRow", this.toggleRow.bind(this)), this.registerTableFunction("getSelectedRows", this.getSelectedRows.bind(this)), this.registerTableFunction("getSelectedData", this.getSelectedData.bind(this)), this.registerComponentFunction("row", "select", this.selectRows.bind(this)), this.registerComponentFunction("row", "deselect", this.deselectRows.bind(this)), this.registerComponentFunction("row", "toggleSelect", this.toggleRow.bind(this)), this.registerComponentFunction("row", "isSelected", this.isRowSelected.bind(this));
  }
  initialize() {
    this.deprecatedOptionsCheck(), this.table.options.selectableRows === "highlight" && this.table.options.selectableRange && (this.table.options.selectableRows = !1), this.table.options.selectableRows !== !1 && (this.subscribe("row-init", this.initializeRow.bind(this)), this.subscribe("row-deleting", this.rowDeleted.bind(this)), this.subscribe("rows-wipe", this.clearSelectionData.bind(this)), this.subscribe("rows-retrieve", this.rowRetrieve.bind(this)), this.table.options.selectableRows && !this.table.options.selectableRowsPersistence && this.subscribe("data-refreshing", this.deselectRows.bind(this)));
  }
  deprecatedOptionsCheck() {
  }
  rowRetrieve(e, t) {
    return e === "selected" ? this.selectedRows : t;
  }
  rowDeleted(e) {
    this._deselectRow(e, !0);
  }
  clearSelectionData(e) {
    var t = this.selectedRows.length;
    this.selecting = !1, this.lastClickedRow = !1, this.selectPrev = [], this.selectedRows = [], t && e !== !0 && this._rowSelectionChanged();
  }
  initializeRow(e) {
    var t = this, A = t.checkRowSelectability(e), i = e.getElement(), s = function() {
      setTimeout(function() {
        t.selecting = !1;
      }, 50), document.body.removeEventListener("mouseup", s);
    };
    e.modules.select = { selected: !1 }, i.classList.toggle("tabulator-selectable", A), i.classList.toggle("tabulator-unselectable", !A), t.checkRowSelectability(e) && t.table.options.selectableRows && t.table.options.selectableRows != "highlight" && (t.table.options.selectableRowsRangeMode === "click" ? i.addEventListener("click", this.handleComplexRowClick.bind(this, e)) : (i.addEventListener("click", function(n) {
      (!t.table.modExists("edit") || !t.table.modules.edit.getCurrentCell()) && t.table._clearSelection(), t.selecting || t.toggleRow(e);
    }), i.addEventListener("mousedown", function(n) {
      if (n.shiftKey)
        return t.table._clearSelection(), t.selecting = !0, t.selectPrev = [], document.body.addEventListener("mouseup", s), document.body.addEventListener("keyup", s), t.toggleRow(e), !1;
    }), i.addEventListener("mouseenter", function(n) {
      t.selecting && (t.table._clearSelection(), t.toggleRow(e), t.selectPrev[1] == e && t.toggleRow(t.selectPrev[0]));
    }), i.addEventListener("mouseout", function(n) {
      t.selecting && (t.table._clearSelection(), t.selectPrev.unshift(e));
    })));
  }
  handleComplexRowClick(e, t) {
    if (t.shiftKey) {
      this.table._clearSelection(), this.lastClickedRow = this.lastClickedRow || e;
      var A = this.table.rowManager.getDisplayRowIndex(this.lastClickedRow), i = this.table.rowManager.getDisplayRowIndex(e), s = A <= i ? A : i, n = A >= i ? A : i, o = this.table.rowManager.getDisplayRows().slice(0), a = o.splice(s, n - s + 1);
      t.ctrlKey || t.metaKey ? (a.forEach((l) => {
        l !== this.lastClickedRow && (this.table.options.selectableRows !== !0 && !this.isRowSelected(e) ? this.selectedRows.length < this.table.options.selectableRows && this.toggleRow(l) : this.toggleRow(l));
      }), this.lastClickedRow = e) : (this.deselectRows(void 0, !0), this.table.options.selectableRows !== !0 && a.length > this.table.options.selectableRows && (a = a.slice(0, this.table.options.selectableRows)), this.selectRows(a)), this.table._clearSelection();
    } else t.ctrlKey || t.metaKey ? (this.toggleRow(e), this.lastClickedRow = e) : (this.deselectRows(void 0, !0), this.selectRows(e), this.lastClickedRow = e);
  }
  checkRowSelectability(e) {
    return e && e.type === "row" ? this.table.options.selectableRowsCheck.call(this.table, e.getComponent()) : !1;
  }
  //toggle row selection
  toggleRow(e) {
    this.checkRowSelectability(e) && (e.modules.select && e.modules.select.selected ? this._deselectRow(e) : this._selectRow(e));
  }
  //select a number of rows
  selectRows(e) {
    var t = [], A, i;
    switch (typeof e) {
      case "undefined":
        A = this.table.rowManager.rows;
        break;
      case "number":
        A = this.table.rowManager.findRow(e);
        break;
      case "string":
        A = this.table.rowManager.findRow(e), A || (A = this.table.rowManager.getRows(e));
        break;
      default:
        A = e;
        break;
    }
    Array.isArray(A) ? A.length && (A.forEach((s) => {
      i = this._selectRow(s, !0, !0), i && t.push(i);
    }), this._rowSelectionChanged(!1, t)) : A && this._selectRow(A, !1, !0);
  }
  //select an individual row
  _selectRow(e, t, A) {
    if (!isNaN(this.table.options.selectableRows) && this.table.options.selectableRows !== !0 && !A && this.selectedRows.length >= this.table.options.selectableRows)
      if (this.table.options.selectableRowsRollingSelection)
        this._deselectRow(this.selectedRows[0]);
      else
        return !1;
    var i = this.table.rowManager.findRow(e);
    if (i) {
      if (this.selectedRows.indexOf(i) == -1)
        return i.getElement().classList.add("tabulator-selected"), i.modules.select || (i.modules.select = {}), i.modules.select.selected = !0, i.modules.select.checkboxEl && (i.modules.select.checkboxEl.checked = !0), this.selectedRows.push(i), this.table.options.dataTreeSelectPropagate && this.childRowSelection(i, !0), this.dispatchExternal("rowSelected", i.getComponent()), this._rowSelectionChanged(t, i), i;
    } else
      t || console.warn("Selection Error - No such row found, ignoring selection:" + e);
  }
  isRowSelected(e) {
    return this.selectedRows.indexOf(e) !== -1;
  }
  //deselect a number of rows
  deselectRows(e, t) {
    var A = [], i, s;
    switch (typeof e) {
      case "undefined":
        i = Object.assign([], this.selectedRows);
        break;
      case "number":
        i = this.table.rowManager.findRow(e);
        break;
      case "string":
        i = this.table.rowManager.findRow(e), i || (i = this.table.rowManager.getRows(e));
        break;
      default:
        i = e;
        break;
    }
    Array.isArray(i) ? i.length && (i.forEach((n) => {
      s = this._deselectRow(n, !0, !0), s && A.push(s);
    }), this._rowSelectionChanged(t, [], A)) : i && this._deselectRow(i, t, !0);
  }
  //deselect an individual row
  _deselectRow(e, t) {
    var A = this, i = A.table.rowManager.findRow(e), s, n;
    if (i) {
      if (s = A.selectedRows.findIndex(function(o) {
        return o == i;
      }), s > -1)
        return n = i.getElement(), n && n.classList.remove("tabulator-selected"), i.modules.select || (i.modules.select = {}), i.modules.select.selected = !1, i.modules.select.checkboxEl && (i.modules.select.checkboxEl.checked = !1), A.selectedRows.splice(s, 1), this.table.options.dataTreeSelectPropagate && this.childRowSelection(i, !1), this.dispatchExternal("rowDeselected", i.getComponent()), A._rowSelectionChanged(t, void 0, i), i;
    } else
      t || console.warn("Deselection Error - No such row found, ignoring selection:" + e);
  }
  getSelectedData() {
    var e = [];
    return this.selectedRows.forEach(function(t) {
      e.push(t.getData());
    }), e;
  }
  getSelectedRows() {
    var e = [];
    return this.selectedRows.forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  _rowSelectionChanged(e, t = [], A = []) {
    this.headerCheckboxElement && (this.selectedRows.length === 0 ? (this.headerCheckboxElement.checked = !1, this.headerCheckboxElement.indeterminate = !1) : this.table.rowManager.rows.length === this.selectedRows.length ? (this.headerCheckboxElement.checked = !0, this.headerCheckboxElement.indeterminate = !1) : (this.headerCheckboxElement.indeterminate = !0, this.headerCheckboxElement.checked = !1)), e || (Array.isArray(t) || (t = [t]), t = t.map((i) => i.getComponent()), Array.isArray(A) || (A = [A]), A = A.map((i) => i.getComponent()), this.dispatchExternal("rowSelectionChanged", this.getSelectedData(), this.getSelectedRows(), t, A));
  }
  registerRowSelectCheckbox(e, t) {
    e._row.modules.select || (e._row.modules.select = {}), e._row.modules.select.checkboxEl = t;
  }
  registerHeaderSelectCheckbox(e) {
    this.headerCheckboxElement = e;
  }
  childRowSelection(e, t) {
    var A = this.table.modules.dataTree.getChildren(e, !0, !0);
    if (t)
      for (let i of A)
        this._selectRow(i, !0);
    else
      for (let i of A)
        this._deselectRow(i, !0);
  }
}
U(js, "moduleName", "selectRow"), U(js, "moduleExtensions", Mh);
class Dh {
  constructor(e) {
    return this._range = e, new Proxy(this, {
      get: function(t, A, i) {
        return typeof t[A] < "u" ? t[A] : t._range.table.componentFunctionBinder.handle("range", t._range, A);
      }
    });
  }
  getElement() {
    return this._range.element;
  }
  getData() {
    return this._range.getData();
  }
  getCells() {
    return this._range.getCells(!0, !0);
  }
  getStructuredCells() {
    return this._range.getStructuredCells();
  }
  getRows() {
    return this._range.getRows().map((e) => e.getComponent());
  }
  getColumns() {
    return this._range.getColumns().map((e) => e.getComponent());
  }
  getBounds() {
    return this._range.getBounds();
  }
  getTopEdge() {
    return this._range.top;
  }
  getBottomEdge() {
    return this._range.bottom;
  }
  getLeftEdge() {
    return this._range.left;
  }
  getRightEdge() {
    return this._range.right;
  }
  setBounds(e, t) {
    this._range.destroyedGuard("setBounds") && this._range.setBounds(e && e._cell, t && t._cell);
  }
  setStartBound(e) {
    this._range.destroyedGuard("setStartBound") && (this._range.setEndBound(e && e._cell), this._range.rangeManager.layoutElement());
  }
  setEndBound(e) {
    this._range.destroyedGuard("setEndBound") && (this._range.setEndBound(e && e._cell), this._range.rangeManager.layoutElement());
  }
  clearValues() {
    this._range.destroyedGuard("clearValues") && this._range.clearValues();
  }
  remove() {
    this._range.destroyedGuard("remove") && this._range.destroy(!0);
  }
}
class Sh extends ye {
  constructor(e, t, A, i) {
    super(e), this.rangeManager = t, this.element = null, this.initialized = !1, this.initializing = {
      start: !1,
      end: !1
    }, this.destroyed = !1, this.top = 0, this.bottom = 0, this.left = 0, this.right = 0, this.table = e, this.start = { row: 0, col: 0 }, this.end = { row: 0, col: 0 }, this.rangeManager.rowHeader && (this.left = 1, this.right = 1, this.start.col = 1, this.end.col = 1), this.initElement(), setTimeout(() => {
      this.initBounds(A, i);
    });
  }
  initElement() {
    this.element = document.createElement("div"), this.element.classList.add("tabulator-range");
  }
  initBounds(e, t) {
    this._updateMinMax(), e && this.setBounds(e, t || e);
  }
  ///////////////////////////////////
  ///////   Boundary Setup    ///////
  ///////////////////////////////////
  setStart(e, t) {
    (this.start.row !== e || this.start.col !== t) && (this.start.row = e, this.start.col = t, this.initializing.start = !0, this._updateMinMax());
  }
  setEnd(e, t) {
    (this.end.row !== e || this.end.col !== t) && (this.end.row = e, this.end.col = t, this.initializing.end = !0, this._updateMinMax());
  }
  setBounds(e, t, A) {
    e && this.setStartBound(e), this.setEndBound(t || e), this.rangeManager.layoutElement(A);
  }
  setStartBound(e) {
    var t, A;
    e.type === "column" ? this.rangeManager.columnSelection && this.setStart(0, e.getPosition() - 1) : (t = e.row.position - 1, A = e.column.getPosition() - 1, e.column === this.rangeManager.rowHeader ? this.setStart(t, 1) : this.setStart(t, A));
  }
  setEndBound(e) {
    var t = this._getTableRows().length, A, i, s;
    e.type === "column" ? this.rangeManager.columnSelection && (this.rangeManager.selecting === "column" ? this.setEnd(t - 1, e.getPosition() - 1) : this.rangeManager.selecting === "cell" && this.setEnd(0, e.getPosition() - 1)) : (A = e.row.position - 1, i = e.column.getPosition() - 1, s = e.column === this.rangeManager.rowHeader, this.rangeManager.selecting === "row" ? this.setEnd(A, this._getTableColumns().length - 1) : this.rangeManager.selecting !== "row" && s ? this.setEnd(A, 0) : this.rangeManager.selecting === "column" ? this.setEnd(t - 1, i) : this.setEnd(A, i));
  }
  _updateMinMax() {
    this.top = Math.min(this.start.row, this.end.row), this.bottom = Math.max(this.start.row, this.end.row), this.left = Math.min(this.start.col, this.end.col), this.right = Math.max(this.start.col, this.end.col), this.initialized ? this.dispatchExternal("rangeChanged", this.getComponent()) : this.initializing.start && this.initializing.end && (this.initialized = !0, this.dispatchExternal("rangeAdded", this.getComponent()));
  }
  _getTableColumns() {
    return this.table.columnManager.getVisibleColumnsByIndex();
  }
  _getTableRows() {
    return this.table.rowManager.getDisplayRows().filter((e) => e.type === "row");
  }
  ///////////////////////////////////
  ///////      Rendering      ///////
  ///////////////////////////////////
  layout() {
    var e = this.table.rowManager.renderer.vDomTop, t = this.table.rowManager.renderer.vDomBottom, A = this.table.columnManager.renderer.leftCol, i = this.table.columnManager.renderer.rightCol, s, n, o, a, l, h, u, c, f, w;
    this.table.options.renderHorizontal === "virtual" && this.rangeManager.rowHeader && (i += 1), e == null && (e = 0), t == null && (t = 1 / 0), A == null && (A = 0), i == null && (i = 1 / 0), this.overlaps(A, e, i, t) && (s = Math.max(this.top, e), n = Math.min(this.bottom, t), o = Math.max(this.left, A), a = Math.min(this.right, i), l = this.rangeManager.getCell(s, o), h = this.rangeManager.getCell(n, a), u = l.getElement(), c = h.getElement(), f = l.row.getElement(), w = h.row.getElement(), this.element.classList.add("tabulator-range-active"), this.table.rtl ? (this.element.style.right = f.offsetWidth - u.offsetLeft - u.offsetWidth + "px", this.element.style.width = u.offsetLeft + u.offsetWidth - c.offsetLeft + "px") : (this.element.style.left = f.offsetLeft + u.offsetLeft + "px", this.element.style.width = c.offsetLeft + c.offsetWidth - u.offsetLeft + "px"), this.element.style.top = f.offsetTop + "px", this.element.style.height = w.offsetTop + w.offsetHeight - f.offsetTop + "px");
  }
  atTopLeft(e) {
    return e.row.position - 1 === this.top && e.column.getPosition() - 1 === this.left;
  }
  atBottomRight(e) {
    return e.row.position - 1 === this.bottom && e.column.getPosition() - 1 === this.right;
  }
  occupies(e) {
    return this.occupiesRow(e.row) && this.occupiesColumn(e.column);
  }
  occupiesRow(e) {
    return this.top <= e.position - 1 && e.position - 1 <= this.bottom;
  }
  occupiesColumn(e) {
    return this.left <= e.getPosition() - 1 && e.getPosition() - 1 <= this.right;
  }
  overlaps(e, t, A, i) {
    return !(this.left > A || e > this.right || this.top > i || t > this.bottom);
  }
  getData() {
    var e = [], t = this.getRows(), A = this.getColumns();
    return t.forEach((i) => {
      var s = i.getData(), n = {};
      A.forEach((o) => {
        n[o.field] = s[o.field];
      }), e.push(n);
    }), e;
  }
  getCells(e, t) {
    var A = [], i = this.getRows(), s = this.getColumns();
    return e ? A = i.map((n) => {
      var o = [];
      return n.getCells().forEach((a) => {
        s.includes(a.column) && o.push(t ? a.getComponent() : a);
      }), o;
    }) : i.forEach((n) => {
      n.getCells().forEach((o) => {
        s.includes(o.column) && A.push(t ? o.getComponent() : o);
      });
    }), A;
  }
  getStructuredCells() {
    return this.getCells(!0, !0);
  }
  getRows() {
    return this._getTableRows().slice(this.top, this.bottom + 1);
  }
  getColumns() {
    return this._getTableColumns().slice(this.left, this.right + 1);
  }
  clearValues() {
    var e = this.getCells(), t = this.table.options.selectableRangeClearCellsValue;
    this.table.blockRedraw(), e.forEach((A) => {
      A.setValue(t);
    }), this.table.restoreRedraw();
  }
  getBounds(e) {
    var t = this.getCells(!1, e), A = {
      start: null,
      end: null
    };
    return t.length ? (A.start = t[0], A.end = t[t.length - 1]) : console.warn("No bounds defined on range"), A;
  }
  getComponent() {
    return this.component || (this.component = new Dh(this)), this.component;
  }
  destroy(e) {
    this.destroyed = !0, this.element.remove(), e && this.rangeManager.rangeRemoved(this), this.initialized && this.dispatchExternal("rangeRemoved", this.getComponent());
  }
  destroyedGuard(e) {
    return this.destroyed && console.warn("You cannot call the " + e + " function on a destroyed range"), !this.destroyed;
  }
}
var kh = {
  rangeJumpUp: ["ctrl + 38", "meta + 38"],
  rangeJumpDown: ["ctrl + 40", "meta + 40"],
  rangeJumpLeft: ["ctrl + 37", "meta + 37"],
  rangeJumpRight: ["ctrl + 39", "meta + 39"],
  rangeExpandUp: "shift + 38",
  rangeExpandDown: "shift + 40",
  rangeExpandLeft: "shift + 37",
  rangeExpandRight: "shift + 39",
  rangeExpandJumpUp: ["ctrl + shift + 38", "meta + shift + 38"],
  rangeExpandJumpDown: ["ctrl + shift + 40", "meta + shift + 40"],
  rangeExpandJumpLeft: ["ctrl + shift + 37", "meta + shift + 37"],
  rangeExpandJumpRight: ["ctrl + shift + 39", "meta + shift + 39"]
}, _h = {
  rangeJumpLeft: function(r) {
    this.dispatch("keybinding-nav-range", r, "left", !0, !1);
  },
  rangeJumpRight: function(r) {
    this.dispatch("keybinding-nav-range", r, "right", !0, !1);
  },
  rangeJumpUp: function(r) {
    this.dispatch("keybinding-nav-range", r, "up", !0, !1);
  },
  rangeJumpDown: function(r) {
    this.dispatch("keybinding-nav-range", r, "down", !0, !1);
  },
  rangeExpandLeft: function(r) {
    this.dispatch("keybinding-nav-range", r, "left", !1, !0);
  },
  rangeExpandRight: function(r) {
    this.dispatch("keybinding-nav-range", r, "right", !1, !0);
  },
  rangeExpandUp: function(r) {
    this.dispatch("keybinding-nav-range", r, "up", !1, !0);
  },
  rangeExpandDown: function(r) {
    this.dispatch("keybinding-nav-range", r, "down", !1, !0);
  },
  rangeExpandJumpLeft: function(r) {
    this.dispatch("keybinding-nav-range", r, "left", !0, !0);
  },
  rangeExpandJumpRight: function(r) {
    this.dispatch("keybinding-nav-range", r, "right", !0, !0);
  },
  rangeExpandJumpUp: function(r) {
    this.dispatch("keybinding-nav-range", r, "up", !0, !0);
  },
  rangeExpandJumpDown: function(r) {
    this.dispatch("keybinding-nav-range", r, "down", !0, !0);
  }
}, Oh = {
  range: function(r) {
    var e = [], t = this.table.modules.selectRange.activeRange, A = !1, i, s, n, o, a;
    return a = r.length, t && (i = t.getBounds(), s = i.start, i.start === i.end && (A = !0), s && (e = this.table.rowManager.activeRows.slice(), n = e.indexOf(s.row), A ? o = r.length : o = e.indexOf(i.end.row) - n + 1, n > -1 && (this.table.blockRedraw(), e = e.slice(n, n + o), e.forEach((l, h) => {
      l.updateData(r[h % a]);
    }), this.table.restoreRedraw()))), e;
  }
}, Kh = {
  range: function(r) {
    var e = [], t = [], A = this.table.modules.selectRange.activeRange, i = !1, s, n, o, a, l;
    return A && (s = A.getBounds(), n = s.start, s.start === s.end && (i = !0), n && (r = r.split(`
`), r.forEach(function(h) {
      e.push(h.split("	"));
    }), e.length && (a = this.table.columnManager.getVisibleColumnsByIndex(), l = a.indexOf(n.column), l > -1))) ? (i ? o = e[0].length : o = a.indexOf(s.end.column) - l + 1, a = a.slice(l, l + o), e.forEach((h) => {
      var u = {}, c = h.length;
      a.forEach(function(f, w) {
        u[f.field] = h[w % c];
      }), t.push(u);
    }), t) : !1;
  }
}, Ph = {
  range: function() {
    var r = this.modules.selectRange.selectedColumns();
    return this.columnManager.rowHeader && r.unshift(this.columnManager.rowHeader), r;
  }
}, Vh = {
  range: function() {
    return this.modules.selectRange.selectedRows();
  }
}, Nh = {
  keybindings: {
    bindings: kh,
    actions: _h
  },
  clipboard: {
    pasteActions: Oh,
    pasteParsers: Kh
  },
  export: {
    columnLookups: Ph,
    rowLookups: Vh
  }
};
class Bi extends Y {
  constructor(e) {
    super(e), this.selecting = "cell", this.mousedown = !1, this.ranges = [], this.overlay = null, this.rowHeader = null, this.layoutChangeTimeout = null, this.columnSelection = !1, this.rowSelection = !1, this.maxRanges = 0, this.activeRange = !1, this.blockKeydown = !1, this.keyDownEvent = this._handleKeyDown.bind(this), this.mouseUpEvent = this._handleMouseUp.bind(this), this.registerTableOption("selectableRange", !1), this.registerTableOption("selectableRangeColumns", !1), this.registerTableOption("selectableRangeRows", !1), this.registerTableOption("selectableRangeClearCells", !1), this.registerTableOption("selectableRangeClearCellsValue", void 0), this.registerTableOption("selectableRangeAutoFocus", !0), this.registerTableFunction("getRangesData", this.getRangesData.bind(this)), this.registerTableFunction("getRanges", this.getRanges.bind(this)), this.registerTableFunction("addRange", this.addRangeFromComponent.bind(this)), this.registerComponentFunction("cell", "getRanges", this.cellGetRanges.bind(this)), this.registerComponentFunction("row", "getRanges", this.rowGetRanges.bind(this)), this.registerComponentFunction("column", "getRanges", this.colGetRanges.bind(this));
  }
  ///////////////////////////////////
  ///////    Initialization   ///////
  ///////////////////////////////////
  initialize() {
    this.options("selectableRange") && (this.options("selectableRows") ? console.warn("SelectRange functionality cannot be used in conjunction with row selection") : (this.maxRanges = this.options("selectableRange"), this.initializeTable(), this.initializeWatchers()), this.options("columns").findIndex((e) => e.frozen) > 0 && console.warn("Having frozen column in arbitrary position with selectRange option may result in unpredictable behavior."), this.options("columns").filter((e) => e.frozen) > 1 && console.warn("Having multiple frozen columns with selectRange option may result in unpredictable behavior."));
  }
  initializeTable() {
    this.overlay = document.createElement("div"), this.overlay.classList.add("tabulator-range-overlay"), this.rangeContainer = document.createElement("div"), this.rangeContainer.classList.add("tabulator-range-container"), this.activeRangeCellElement = document.createElement("div"), this.activeRangeCellElement.classList.add("tabulator-range-cell-active"), this.overlay.appendChild(this.rangeContainer), this.overlay.appendChild(this.activeRangeCellElement), this.table.rowManager.element.addEventListener("keydown", this.keyDownEvent), this.resetRanges(), this.table.rowManager.element.appendChild(this.overlay), this.table.columnManager.element.setAttribute("tabindex", 0), this.table.element.classList.add("tabulator-ranges");
  }
  initializeWatchers() {
    this.columnSelection = this.options("selectableRangeColumns"), this.rowSelection = this.options("selectableRangeRows"), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("column-mousedown", this.handleColumnMouseDown.bind(this)), this.subscribe("column-mousemove", this.handleColumnMouseMove.bind(this)), this.subscribe("column-resized", this.handleColumnResized.bind(this)), this.subscribe("column-moving", this.handleColumnMoving.bind(this)), this.subscribe("column-moved", this.handleColumnMoved.bind(this)), this.subscribe("column-width", this.layoutChange.bind(this)), this.subscribe("column-height", this.layoutChange.bind(this)), this.subscribe("column-resized", this.layoutChange.bind(this)), this.subscribe("columns-loaded", this.updateHeaderColumn.bind(this)), this.subscribe("cell-height", this.layoutChange.bind(this)), this.subscribe("cell-rendered", this.renderCell.bind(this)), this.subscribe("cell-mousedown", this.handleCellMouseDown.bind(this)), this.subscribe("cell-mousemove", this.handleCellMouseMove.bind(this)), this.subscribe("cell-click", this.handleCellClick.bind(this)), this.subscribe("cell-editing", this.handleEditingCell.bind(this)), this.subscribe("page-changed", this.redraw.bind(this)), this.subscribe("scroll-vertical", this.layoutChange.bind(this)), this.subscribe("scroll-horizontal", this.layoutChange.bind(this)), this.subscribe("data-destroy", this.tableDestroyed.bind(this)), this.subscribe("data-processed", this.resetRanges.bind(this)), this.subscribe("table-layout", this.layoutElement.bind(this)), this.subscribe("table-redraw", this.redraw.bind(this)), this.subscribe("table-destroy", this.tableDestroyed.bind(this)), this.subscribe("edit-editor-clear", this.finishEditingCell.bind(this)), this.subscribe("edit-blur", this.restoreFocus.bind(this)), this.subscribe("keybinding-nav-prev", this.keyNavigate.bind(this, "left")), this.subscribe("keybinding-nav-next", this.keyNavigate.bind(this, "right")), this.subscribe("keybinding-nav-left", this.keyNavigate.bind(this, "left")), this.subscribe("keybinding-nav-right", this.keyNavigate.bind(this, "right")), this.subscribe("keybinding-nav-up", this.keyNavigate.bind(this, "up")), this.subscribe("keybinding-nav-down", this.keyNavigate.bind(this, "down")), this.subscribe("keybinding-nav-range", this.keyNavigateRange.bind(this));
  }
  initializeColumn(e) {
    this.columnSelection && e.definition.headerSort && this.options("headerSortClickElement") !== "icon" && console.warn("Using column headerSort with selectableRangeColumns option may result in unpredictable behavior. Consider using headerSortClickElement: 'icon'."), e.modules.edit;
  }
  updateHeaderColumn() {
    var e;
    this.rowSelection && (this.rowHeader = this.table.columnManager.getVisibleColumnsByIndex()[0], this.rowHeader && (this.rowHeader.definition.cssClass = this.rowHeader.definition.cssClass + " tabulator-range-row-header", this.rowHeader.definition.headerSort && console.warn("Using column headerSort with selectableRangeRows option may result in unpredictable behavior"), this.rowHeader.definition.editor && console.warn("Using column editor with selectableRangeRows option may result in unpredictable behavior"))), this.table.modules.frozenColumns && this.table.modules.frozenColumns.active && (e = this.table.modules.frozenColumns.getFrozenColumns(), (e.length > 1 || e.length === 1 && e[0] !== this.rowHeader) && console.warn("Using frozen columns that are not the range header in combination with the selectRange option may result in unpredictable behavior"));
  }
  ///////////////////////////////////
  ///////   Table Functions   ///////
  ///////////////////////////////////
  getRanges() {
    return this.ranges.map((e) => e.getComponent());
  }
  getRangesData() {
    return this.ranges.map((e) => e.getData());
  }
  addRangeFromComponent(e, t) {
    return e = e ? e._cell : null, t = t ? t._cell : null, this.addRange(e, t);
  }
  ///////////////////////////////////
  /////// Component Functions ///////
  ///////////////////////////////////
  cellGetRanges(e) {
    var t = [];
    return e.column === this.rowHeader ? t = this.ranges.filter((A) => A.occupiesRow(e.row)) : t = this.ranges.filter((A) => A.occupies(e)), t.map((A) => A.getComponent());
  }
  rowGetRanges(e) {
    var t = this.ranges.filter((A) => A.occupiesRow(e));
    return t.map((A) => A.getComponent());
  }
  colGetRanges(e) {
    var t = this.ranges.filter((A) => A.occupiesColumn(e));
    return t.map((A) => A.getComponent());
  }
  ///////////////////////////////////
  ////////// Event Handlers /////////
  ///////////////////////////////////
  _handleMouseUp(e) {
    this.mousedown = !1, document.removeEventListener("mouseup", this.mouseUpEvent);
  }
  _handleKeyDown(e) {
    if (!this.blockKeydown && (!this.table.modules.edit || this.table.modules.edit && !this.table.modules.edit.currentCell)) {
      if (e.key === "Enter") {
        if (this.table.modules.edit && this.table.modules.edit.currentCell)
          return;
        this.table.modules.edit.editCell(this.getActiveCell()), e.preventDefault();
      }
      (e.key === "Backspace" || e.key === "Delete") && this.options("selectableRangeClearCells") && this.activeRange && this.activeRange.clearValues();
    }
  }
  initializeFocus(e) {
    var t;
    this.restoreFocus();
    try {
      document.selection ? (t = document.body.createTextRange(), t.moveToElementText(e.getElement()), t.select()) : window.getSelection && (t = document.createRange(), t.selectNode(e.getElement()), window.getSelection().removeAllRanges(), window.getSelection().addRange(t));
    } catch {
    }
  }
  restoreFocus(e) {
    return this.table.rowManager.element.focus(), !0;
  }
  ///////////////////////////////////
  ////// Column Functionality ///////
  ///////////////////////////////////
  handleColumnResized(e) {
    var t;
    this.selecting !== "column" && this.selecting !== "all" || (t = this.ranges.some((A) => A.occupiesColumn(e)), t && this.ranges.forEach((A) => {
      var i = A.getColumns(!0);
      i.forEach((s) => {
        s !== e && s.setWidth(e.width);
      });
    }));
  }
  handleColumnMoving(e, t) {
    this.resetRanges().setBounds(t), this.overlay.style.visibility = "hidden";
  }
  handleColumnMoved(e, t, A) {
    this.activeRange.setBounds(e), this.layoutElement();
  }
  handleColumnMouseDown(e, t) {
    e.button === 2 && (this.selecting === "column" || this.selecting === "all") && this.activeRange.occupiesColumn(t) || this.table.options.movableColumns && this.selecting === "column" && this.activeRange.occupiesColumn(t) || (this.mousedown = !0, document.addEventListener("mouseup", this.mouseUpEvent), this.newSelection(e, t));
  }
  handleColumnMouseMove(e, t) {
    t === this.rowHeader || !this.mousedown || this.selecting === "all" || this.activeRange.setBounds(!1, t, !0);
  }
  ///////////////////////////////////
  //////// Cell Functionality ///////
  ///////////////////////////////////
  renderCell(e) {
    var t = e.getElement(), A = this.ranges.findIndex((i) => i.occupies(e));
    t.classList.toggle("tabulator-range-selected", A !== -1), t.classList.toggle("tabulator-range-only-cell-selected", this.ranges.length === 1 && this.ranges[0].atTopLeft(e) && this.ranges[0].atBottomRight(e)), t.dataset.range = A;
  }
  handleCellMouseDown(e, t) {
    e.button === 2 && (this.activeRange.occupies(t) || (this.selecting === "row" || this.selecting === "all") && this.activeRange.occupiesRow(t.row)) || (this.mousedown = !0, document.addEventListener("mouseup", this.mouseUpEvent), this.newSelection(e, t));
  }
  handleCellMouseMove(e, t) {
    !this.mousedown || this.selecting === "all" || this.activeRange.setBounds(!1, t, !0);
  }
  handleCellClick(e, t) {
    this.initializeFocus(t);
  }
  handleEditingCell(e) {
    this.activeRange && this.activeRange.setBounds(e);
  }
  finishEditingCell() {
    this.blockKeydown = !0, this.table.rowManager.element.focus(), setTimeout(() => {
      this.blockKeydown = !1;
    }, 10);
  }
  ///////////////////////////////////
  ///////     Navigation      ///////
  ///////////////////////////////////
  keyNavigate(e, t) {
    this.navigate(!1, !1, e), t.preventDefault();
  }
  keyNavigateRange(e, t, A, i) {
    this.navigate(A, i, t), e.preventDefault();
  }
  navigate(e, t, A) {
    var i = !1, s, n, o, a, l, h, u, c, f, w, b;
    if (this.table.modules.edit && this.table.modules.edit.currentCell)
      return !1;
    if (this.ranges.length > 1 && (this.ranges = this.ranges.filter((v) => v === this.activeRange ? (v.setEnd(v.start.row, v.start.col), !0) : (v.destroy(), !1))), s = this.activeRange, o = {
      top: s.top,
      bottom: s.bottom,
      left: s.left,
      right: s.right
    }, n = t ? s.end : s.start, a = n.row, l = n.col, e)
      switch (A) {
        case "left":
          l = this.findJumpCellLeft(s.start.row, n.col);
          break;
        case "right":
          l = this.findJumpCellRight(s.start.row, n.col);
          break;
        case "up":
          a = this.findJumpCellUp(n.row, s.start.col);
          break;
        case "down":
          a = this.findJumpCellDown(n.row, s.start.col);
          break;
      }
    else {
      if (t && (this.selecting === "row" && (A === "left" || A === "right") || this.selecting === "column" && (A === "up" || A === "down")))
        return;
      switch (A) {
        case "left":
          l = Math.max(l - 1, 0);
          break;
        case "right":
          l = Math.min(l + 1, this.getTableColumns().length - 1);
          break;
        case "up":
          a = Math.max(a - 1, 0);
          break;
        case "down":
          a = Math.min(a + 1, this.getTableRows().length - 1);
          break;
      }
    }
    if (this.rowHeader && l === 0 && (l = 1), t || s.setStart(a, l), s.setEnd(a, l), t || (this.selecting = "cell"), i = o.top !== s.top || o.bottom !== s.bottom || o.left !== s.left || o.right !== s.right, i)
      return h = this.getRowByRangePos(s.end.row), u = this.getColumnByRangePos(s.end.col), c = h.getElement().getBoundingClientRect(), w = u.getElement().getBoundingClientRect(), f = this.table.rowManager.getElement().getBoundingClientRect(), b = this.table.columnManager.getElement().getBoundingClientRect(), c.top >= f.top && c.bottom <= f.bottom || (h.getElement().parentNode && u.getElement().parentNode ? this.autoScroll(s, h.getElement(), u.getElement()) : h.getComponent().scrollTo(void 0, !1)), w.left >= b.left + this.getRowHeaderWidth() && w.right <= b.right || (h.getElement().parentNode && u.getElement().parentNode ? this.autoScroll(s, h.getElement(), u.getElement()) : u.getComponent().scrollTo(void 0, !1)), this.layoutElement(), !0;
  }
  rangeRemoved(e) {
    this.ranges = this.ranges.filter((t) => t !== e), this.activeRange === e && (this.ranges.length ? this.activeRange = this.ranges[this.ranges.length - 1] : this.addRange()), this.layoutElement();
  }
  findJumpRow(e, t, A, i, s) {
    return A && (t = t.reverse()), this.findJumpItem(i, s, t, function(n) {
      return n.getData()[e.getField()];
    });
  }
  findJumpCol(e, t, A, i, s) {
    return A && (t = t.reverse()), this.findJumpItem(i, s, t, function(n) {
      return e.getData()[n.getField()];
    });
  }
  findJumpItem(e, t, A, i) {
    var s;
    for (let n of A) {
      let o = i(n);
      if (e) {
        if (s = n, o)
          break;
      } else if (t) {
        if (s = n, o)
          break;
      } else if (o)
        s = n;
      else
        break;
    }
    return s;
  }
  findJumpCellLeft(e, t) {
    var A = this.getRowByRangePos(e), i = this.getTableColumns(), s = this.isEmpty(A.getData()[i[t].getField()]), n = i[t - 1] ? this.isEmpty(A.getData()[i[t - 1].getField()]) : !1, o = this.rowHeader ? i.slice(1, t) : i.slice(0, t), a = this.findJumpCol(A, o, !0, s, n);
    return a ? a.getPosition() - 1 : t;
  }
  findJumpCellRight(e, t) {
    var A = this.getRowByRangePos(e), i = this.getTableColumns(), s = this.isEmpty(A.getData()[i[t].getField()]), n = i[t + 1] ? this.isEmpty(A.getData()[i[t + 1].getField()]) : !1, o = this.findJumpCol(A, i.slice(t + 1, i.length), !1, s, n);
    return o ? o.getPosition() - 1 : t;
  }
  findJumpCellUp(e, t) {
    var A = this.getColumnByRangePos(t), i = this.getTableRows(), s = this.isEmpty(i[e].getData()[A.getField()]), n = i[e - 1] ? this.isEmpty(i[e - 1].getData()[A.getField()]) : !1, o = this.findJumpRow(A, i.slice(0, e), !0, s, n);
    return o ? o.position - 1 : e;
  }
  findJumpCellDown(e, t) {
    var A = this.getColumnByRangePos(t), i = this.getTableRows(), s = this.isEmpty(i[e].getData()[A.getField()]), n = i[e + 1] ? this.isEmpty(i[e + 1].getData()[A.getField()]) : !1, o = this.findJumpRow(A, i.slice(e + 1, i.length), !1, s, n);
    return o ? o.position - 1 : e;
  }
  ///////////////////////////////////
  ///////      Selection      ///////
  ///////////////////////////////////
  newSelection(e, t) {
    var A;
    if (t.type === "column") {
      if (!this.columnSelection)
        return;
      if (t === this.rowHeader) {
        A = this.resetRanges(), this.selecting = "all";
        var i, s = this.getCell(-1, -1);
        this.rowHeader ? i = this.getCell(0, 1) : i = this.getCell(0, 0), A.setBounds(i, s);
        return;
      } else
        this.selecting = "column";
    } else t.column === this.rowHeader ? this.selecting = "row" : this.selecting = "cell";
    e.shiftKey ? this.activeRange.setBounds(!1, t) : e.ctrlKey ? this.addRange().setBounds(t) : this.resetRanges().setBounds(t);
  }
  autoScroll(e, t, A) {
    var i = this.table.rowManager.element, s, n, o, a;
    typeof t > "u" && (t = this.getRowByRangePos(e.end.row).getElement()), typeof A > "u" && (A = this.getColumnByRangePos(e.end.col).getElement()), s = {
      left: A.offsetLeft,
      right: A.offsetLeft + A.offsetWidth,
      top: t.offsetTop,
      bottom: t.offsetTop + t.offsetHeight
    }, n = {
      left: i.scrollLeft + this.getRowHeaderWidth(),
      right: Math.ceil(i.scrollLeft + i.clientWidth),
      top: i.scrollTop,
      bottom: i.scrollTop + i.offsetHeight - this.table.rowManager.scrollbarWidth
    }, o = n.left < s.left && s.left < n.right && n.left < s.right && s.right < n.right, a = n.top < s.top && s.top < n.bottom && n.top < s.bottom && s.bottom < n.bottom, o || (s.left < n.left ? i.scrollLeft = s.left - this.getRowHeaderWidth() : s.right > n.right && (i.scrollLeft = Math.min(s.right - i.clientWidth, s.left - this.getRowHeaderWidth()))), a || (s.top < n.top ? i.scrollTop = s.top : s.bottom > n.bottom && (i.scrollTop = s.bottom - i.clientHeight));
  }
  ///////////////////////////////////
  ///////       Layout        ///////
  ///////////////////////////////////
  layoutChange() {
    this.overlay.style.visibility = "hidden", clearTimeout(this.layoutChangeTimeout), this.layoutChangeTimeout = setTimeout(this.layoutRanges.bind(this), 200);
  }
  redraw(e) {
    e && (this.selecting = "cell", this.resetRanges(), this.layoutElement());
  }
  layoutElement(e) {
    var t;
    e ? t = this.table.rowManager.getVisibleRows(!0) : t = this.table.rowManager.getRows(), t.forEach((A) => {
      A.type === "row" && (this.layoutRow(A), A.cells.forEach((i) => this.renderCell(i)));
    }), this.getTableColumns().forEach((A) => {
      this.layoutColumn(A);
    }), this.layoutRanges();
  }
  layoutRow(e) {
    var t = e.getElement(), A = !1, i = this.ranges.some((s) => s.occupiesRow(e));
    this.selecting === "row" ? A = i : this.selecting === "all" && (A = !0), t.classList.toggle("tabulator-range-selected", A), t.classList.toggle("tabulator-range-highlight", i);
  }
  layoutColumn(e) {
    var t = e.getElement(), A = !1, i = this.ranges.some((s) => s.occupiesColumn(e));
    this.selecting === "column" ? A = i : this.selecting === "all" && (A = !0), t.classList.toggle("tabulator-range-selected", A), t.classList.toggle("tabulator-range-highlight", i);
  }
  layoutRanges() {
    var e, t, A;
    this.table.initialized && (e = this.getActiveCell(), e && (t = e.getElement(), A = e.row.getElement(), this.table.rtl ? this.activeRangeCellElement.style.right = A.offsetWidth - t.offsetLeft - t.offsetWidth + "px" : this.activeRangeCellElement.style.left = A.offsetLeft + t.offsetLeft + "px", this.activeRangeCellElement.style.top = A.offsetTop + "px", this.activeRangeCellElement.style.width = t.offsetWidth + "px", this.activeRangeCellElement.style.height = A.offsetHeight + "px", this.ranges.forEach((i) => i.layout()), this.overlay.style.visibility = "visible"));
  }
  ///////////////////////////////////
  ///////  Helper Functions   ///////
  ///////////////////////////////////	
  getCell(e, t) {
    var A;
    return t < 0 && (t = this.getTableColumns().length + t, t < 0) ? null : (e < 0 && (e = this.getTableRows().length + e), A = this.table.rowManager.getRowFromPosition(e + 1), A ? A.getCells(!1, !0).filter((i) => i.column.visible)[t] : null);
  }
  getActiveCell() {
    return this.getCell(this.activeRange.start.row, this.activeRange.start.col);
  }
  getRowByRangePos(e) {
    return this.getTableRows()[e];
  }
  getColumnByRangePos(e) {
    return this.getTableColumns()[e];
  }
  getTableRows() {
    return this.table.rowManager.getDisplayRows().filter((e) => e.type === "row");
  }
  getTableColumns() {
    return this.table.columnManager.getVisibleColumnsByIndex();
  }
  addRange(e, t) {
    var A;
    return this.maxRanges !== !0 && this.ranges.length >= this.maxRanges && this.ranges.shift().destroy(), A = new Sh(this.table, this, e, t), this.activeRange = A, this.ranges.push(A), this.rangeContainer.appendChild(A.element), A;
  }
  resetRanges() {
    var e, t, A;
    return this.ranges.forEach((i) => i.destroy()), this.ranges = [], e = this.addRange(), this.table.rowManager.activeRows.length && (A = this.table.rowManager.activeRows[0].cells.filter((i) => i.column.visible), t = A[this.rowHeader ? 1 : 0], t && (e.setBounds(t), this.options("selectableRangeAutoFocus") && this.initializeFocus(t))), e;
  }
  tableDestroyed() {
    document.removeEventListener("mouseup", this.mouseUpEvent), this.table.rowManager.element.removeEventListener("keydown", this.keyDownEvent);
  }
  selectedRows(e) {
    return e ? this.activeRange.getRows().map((t) => t.getComponent()) : this.activeRange.getRows();
  }
  selectedColumns(e) {
    return e ? this.activeRange.getColumns().map((t) => t.getComponent()) : this.activeRange.getColumns();
  }
  getRowHeaderWidth() {
    return this.rowHeader ? this.rowHeader.getElement().offsetWidth : 0;
  }
  isEmpty(e) {
    return e == null || e === "";
  }
}
U(Bi, "moduleName", "selectRange"), U(Bi, "moduleInitOrder", 1), U(Bi, "moduleExtensions", Nh);
function zh(r, e, t, A, i, s, n) {
  var o = n.alignEmptyValues, a = n.decimalSeparator, l = n.thousandSeparator, h = 0;
  if (r = String(r), e = String(e), l && (r = r.split(l).join(""), e = e.split(l).join("")), a && (r = r.split(a).join("."), e = e.split(a).join(".")), r = parseFloat(r), e = parseFloat(e), isNaN(r))
    h = isNaN(e) ? 0 : -1;
  else if (isNaN(e))
    h = 1;
  else
    return r - e;
  return (o === "top" && s === "desc" || o === "bottom" && s === "asc") && (h *= -1), h;
}
function Gh(r, e, t, A, i, s, n) {
  var o = n.alignEmptyValues, a = 0, l;
  if (!r)
    a = e ? -1 : 0;
  else if (!e)
    a = 1;
  else {
    switch (typeof n.locale) {
      case "boolean":
        n.locale && (l = this.langLocale());
        break;
      case "string":
        l = n.locale;
        break;
    }
    return String(r).toLowerCase().localeCompare(String(e).toLowerCase(), l);
  }
  return (o === "top" && s === "desc" || o === "bottom" && s === "asc") && (a *= -1), a;
}
function Qr(r, e, t, A, i, s, n) {
  var o = this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime"), a = n.format || "dd/MM/yyyy HH:mm:ss", l = n.alignEmptyValues, h = 0;
  if (typeof o < "u") {
    if (o.isDateTime(r) || (a === "iso" ? r = o.fromISO(String(r)) : r = o.fromFormat(String(r), a)), o.isDateTime(e) || (a === "iso" ? e = o.fromISO(String(e)) : e = o.fromFormat(String(e), a)), !r.isValid)
      h = e.isValid ? -1 : 0;
    else if (!e.isValid)
      h = 1;
    else
      return r - e;
    return (l === "top" && s === "desc" || l === "bottom" && s === "asc") && (h *= -1), h;
  } else
    console.error("Sort Error - 'datetime' sorter is dependant on luxon.js");
}
function Wh(r, e, t, A, i, s, n) {
  return n.format || (n.format = "dd/MM/yyyy"), Qr.call(this, r, e, t, A, i, s, n);
}
function Xh(r, e, t, A, i, s, n) {
  return n.format || (n.format = "HH:mm"), Qr.call(this, r, e, t, A, i, s, n);
}
function Jh(r, e, t, A, i, s, n) {
  var o = r === !0 || r === "true" || r === "True" || r === 1 ? 1 : 0, a = e === !0 || e === "true" || e === "True" || e === 1 ? 1 : 0;
  return o - a;
}
function jh(r, e, t, A, i, s, n) {
  var o = n.type || "length", a = n.alignEmptyValues, l = 0, h = this.table, u;
  n.valueMap && (typeof n.valueMap == "string" ? u = function(f) {
    return f.map((w) => ie.retrieveNestedData(h.options.nestedFieldSeparator, n.valueMap, w));
  } : u = n.valueMap);
  function c(f) {
    var w;
    switch (u && (f = u(f)), o) {
      case "length":
        w = f.length;
        break;
      case "sum":
        w = f.reduce(function(b, v) {
          return b + v;
        });
        break;
      case "max":
        w = Math.max.apply(null, f);
        break;
      case "min":
        w = Math.min.apply(null, f);
        break;
      case "avg":
        w = f.reduce(function(b, v) {
          return b + v;
        }) / f.length;
        break;
      case "string":
        w = f.join("");
        break;
    }
    return w;
  }
  if (!Array.isArray(r))
    l = Array.isArray(e) ? -1 : 0;
  else if (!Array.isArray(e))
    l = 1;
  else
    return o === "string" ? String(c(r)).toLowerCase().localeCompare(String(c(e)).toLowerCase()) : c(e) - c(r);
  return (a === "top" && s === "desc" || a === "bottom" && s === "asc") && (l *= -1), l;
}
function Yh(r, e, t, A, i, s, n) {
  var o = typeof r > "u" ? 0 : 1, a = typeof e > "u" ? 0 : 1;
  return o - a;
}
function Zh(r, e, t, A, i, s, n) {
  var o, a, l, h, u = 0, c, f = /(\d+)|(\D+)/g, w = /\d/, b = n.alignEmptyValues, v = 0;
  if (!r && r !== 0)
    v = !e && e !== 0 ? 0 : -1;
  else if (!e && e !== 0)
    v = 1;
  else {
    if (isFinite(r) && isFinite(e)) return r - e;
    if (o = String(r).toLowerCase(), a = String(e).toLowerCase(), o === a) return 0;
    if (!(w.test(o) && w.test(a))) return o > a ? 1 : -1;
    for (o = o.match(f), a = a.match(f), c = o.length > a.length ? a.length : o.length; u < c; )
      if (l = o[u], h = a[u++], l !== h)
        return isFinite(l) && isFinite(h) ? (l.charAt(0) === "0" && (l = "." + l), h.charAt(0) === "0" && (h = "." + h), l - h) : l > h ? 1 : -1;
    return o.length > a.length;
  }
  return (b === "top" && s === "desc" || b === "bottom" && s === "asc") && (v *= -1), v;
}
var $h = {
  number: zh,
  string: Gh,
  date: Wh,
  time: Xh,
  datetime: Qr,
  boolean: Jh,
  array: jh,
  exists: Yh,
  alphanum: Zh
};
const Mt = class Mt extends Y {
  constructor(e) {
    super(e), this.sortList = [], this.changed = !1, this.registerTableOption("sortMode", "local"), this.registerTableOption("initialSort", !1), this.registerTableOption("columnHeaderSortMulti", !0), this.registerTableOption("sortOrderReverse", !1), this.registerTableOption("headerSortElement", "<div class='tabulator-arrow'></div>"), this.registerTableOption("headerSortClickElement", "header"), this.registerColumnOption("sorter"), this.registerColumnOption("sorterParams"), this.registerColumnOption("headerSort", !0), this.registerColumnOption("headerSortStartingDir"), this.registerColumnOption("headerSortTristate");
  }
  initialize() {
    this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("table-built", this.tableBuilt.bind(this)), this.registerDataHandler(this.sort.bind(this), 20), this.registerTableFunction("setSort", this.userSetSort.bind(this)), this.registerTableFunction("getSorters", this.getSort.bind(this)), this.registerTableFunction("clearSort", this.clearSort.bind(this)), this.table.options.sortMode === "remote" && this.subscribe("data-params", this.remoteSortParams.bind(this));
  }
  tableBuilt() {
    this.table.options.initialSort && this.setSort(this.table.options.initialSort);
  }
  remoteSortParams(e, t, A, i) {
    var s = this.getSort();
    return s.forEach((n) => {
      delete n.column;
    }), i.sort = s, i;
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  userSetSort(e, t) {
    this.setSort(e, t), this.refreshSort();
  }
  clearSort() {
    this.clear(), this.refreshSort();
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  //initialize column header for sorting
  initializeColumn(e) {
    var t = !1, A, i;
    switch (typeof e.definition.sorter) {
      case "string":
        Mt.sorters[e.definition.sorter] ? t = Mt.sorters[e.definition.sorter] : console.warn("Sort Error - No such sorter found: ", e.definition.sorter);
        break;
      case "function":
        t = e.definition.sorter;
        break;
    }
    if (e.modules.sort = {
      sorter: t,
      dir: "none",
      params: e.definition.sorterParams || {},
      startingDir: e.definition.headerSortStartingDir || "asc",
      tristate: e.definition.headerSortTristate
    }, e.definition.headerSort !== !1) {
      switch (A = e.getElement(), A.classList.add("tabulator-sortable"), i = document.createElement("div"), i.classList.add("tabulator-col-sorter"), this.table.options.headerSortClickElement) {
        case "icon":
          i.classList.add("tabulator-col-sorter-element");
          break;
        case "header":
          A.classList.add("tabulator-col-sorter-element");
          break;
        default:
          A.classList.add("tabulator-col-sorter-element");
          break;
      }
      switch (this.table.options.headerSortElement) {
        case "function":
          break;
        case "object":
          i.appendChild(this.table.options.headerSortElement);
          break;
        default:
          i.innerHTML = this.table.options.headerSortElement;
      }
      e.titleHolderElement.appendChild(i), e.modules.sort.element = i, this.setColumnHeaderSortIcon(e, "none"), this.table.options.headerSortClickElement === "icon" && i.addEventListener("mousedown", (s) => {
        s.stopPropagation();
      }), (this.table.options.headerSortClickElement === "icon" ? i : A).addEventListener("click", (s) => {
        var n = "", o = [], a = !1;
        if (e.modules.sort) {
          if (e.modules.sort.tristate)
            e.modules.sort.dir == "none" ? n = e.modules.sort.startingDir : e.modules.sort.dir == e.modules.sort.startingDir ? n = e.modules.sort.dir == "asc" ? "desc" : "asc" : n = "none";
          else
            switch (e.modules.sort.dir) {
              case "asc":
                n = "desc";
                break;
              case "desc":
                n = "asc";
                break;
              default:
                n = e.modules.sort.startingDir;
            }
          this.table.options.columnHeaderSortMulti && (s.shiftKey || s.ctrlKey) ? (o = this.getSort(), a = o.findIndex((l) => l.field === e.getField()), a > -1 ? (o[a].dir = n, a = o.splice(a, 1)[0], n != "none" && o.push(a)) : n != "none" && o.push({ column: e, dir: n }), this.setSort(o)) : n == "none" ? this.clear() : this.setSort(e, n), this.refreshSort();
        }
      });
    }
  }
  refreshSort() {
    this.table.options.sortMode === "remote" ? this.reloadData(null, !1, !1) : this.refreshData(!0);
  }
  //check if the sorters have changed since last use
  hasChanged() {
    var e = this.changed;
    return this.changed = !1, e;
  }
  //return current sorters
  getSort() {
    var e = this, t = [];
    return e.sortList.forEach(function(A) {
      A.column && t.push({ column: A.column.getComponent(), field: A.column.getField(), dir: A.dir });
    }), t;
  }
  //change sort list and trigger sort
  setSort(e, t) {
    var A = this, i = [];
    Array.isArray(e) || (e = [{ column: e, dir: t }]), e.forEach(function(s) {
      var n;
      n = A.table.columnManager.findColumn(s.column), n ? (s.column = n, i.push(s), A.changed = !0) : console.warn("Sort Warning - Sort field does not exist and is being ignored: ", s.column);
    }), A.sortList = i, this.dispatch("sort-changed");
  }
  //clear sorters
  clear() {
    this.setSort([]);
  }
  //find appropriate sorter for column
  findSorter(e) {
    var t = this.table.rowManager.activeRows[0], A = "string", i, s;
    if (t && (t = t.getData(), i = e.getField(), i))
      switch (s = e.getFieldValue(t), typeof s) {
        case "undefined":
          A = "string";
          break;
        case "boolean":
          A = "boolean";
          break;
        default:
          !isNaN(s) && s !== "" ? A = "number" : s.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i) && (A = "alphanum");
          break;
      }
    return Mt.sorters[A];
  }
  //work through sort list sorting data
  sort(e, t) {
    var A = this, i = this.table.options.sortOrderReverse ? A.sortList.slice().reverse() : A.sortList, s = [], n = [];
    return this.subscribedExternal("dataSorting") && this.dispatchExternal("dataSorting", A.getSort()), t || A.clearColumnHeaders(), this.table.options.sortMode !== "remote" ? (i.forEach(function(o, a) {
      var l;
      o.column && (l = o.column.modules.sort, l && (l.sorter || (l.sorter = A.findSorter(o.column)), o.params = typeof l.params == "function" ? l.params(o.column.getComponent(), o.dir) : l.params, s.push(o)), t || A.setColumnHeader(o.column, o.dir));
    }), s.length && A._sortItems(e, s)) : t || i.forEach(function(o, a) {
      A.setColumnHeader(o.column, o.dir);
    }), this.subscribedExternal("dataSorted") && (e.forEach((o) => {
      n.push(o.getComponent());
    }), this.dispatchExternal("dataSorted", A.getSort(), n)), e;
  }
  //clear sort arrows on columns
  clearColumnHeaders() {
    this.table.columnManager.getRealColumns().forEach((e) => {
      e.modules.sort && (e.modules.sort.dir = "none", e.getElement().setAttribute("aria-sort", "none"), this.setColumnHeaderSortIcon(e, "none"));
    });
  }
  //set the column header sort direction
  setColumnHeader(e, t) {
    e.modules.sort.dir = t, e.getElement().setAttribute("aria-sort", t === "asc" ? "ascending" : "descending"), this.setColumnHeaderSortIcon(e, t);
  }
  setColumnHeaderSortIcon(e, t) {
    var A = e.modules.sort.element, i;
    if (e.definition.headerSort && typeof this.table.options.headerSortElement == "function") {
      for (; A.firstChild; ) A.removeChild(A.firstChild);
      i = this.table.options.headerSortElement.call(this.table, e.getComponent(), t), typeof i == "object" ? A.appendChild(i) : A.innerHTML = i;
    }
  }
  //sort each item in sort list
  _sortItems(e, t) {
    var A = t.length - 1;
    e.sort((i, s) => {
      for (var n, o = A; o >= 0; o--) {
        let a = t[o];
        if (n = this._sortRow(i, s, a.column, a.dir, a.params), n !== 0)
          break;
      }
      return n;
    });
  }
  //process individual rows for a sort function on active data
  _sortRow(e, t, A, i, s) {
    var n, o, a = i == "asc" ? e : t, l = i == "asc" ? t : e;
    return e = A.getFieldValue(a.getData()), t = A.getFieldValue(l.getData()), e = typeof e < "u" ? e : "", t = typeof t < "u" ? t : "", n = a.getComponent(), o = l.getComponent(), A.modules.sort.sorter.call(this, e, t, n, o, A.getComponent(), i, s);
  }
};
U(Mt, "moduleName", "sort"), //load defaults
U(Mt, "sorters", $h);
let Ys = Mt;
class qh {
  constructor(e, t) {
    this.columnCount = e, this.rowCount = t, this.columnString = [], this.columns = [], this.rows = [];
  }
  genColumns(e) {
    var t = Math.max(this.columnCount, Math.max(...e.map((A) => A.length)));
    this.columnString = [], this.columns = [];
    for (let A = 1; A <= t; A++)
      this.incrementChar(this.columnString.length - 1), this.columns.push(this.columnString.join(""));
    return this.columns;
  }
  genRows(e) {
    var t = Math.max(this.rowCount, e.length);
    this.rows = [];
    for (let A = 1; A <= t; A++)
      this.rows.push(A);
    return this.rows;
  }
  incrementChar(e) {
    let t = this.columnString[e];
    t ? t !== "Z" ? this.columnString[e] = String.fromCharCode(this.columnString[e].charCodeAt(0) + 1) : (this.columnString[e] = "A", e ? this.incrementChar(e - 1) : this.columnString.push("A")) : this.columnString.push("A");
  }
  setRowCount(e) {
    this.rowCount = e;
  }
  setColumnCount(e) {
    this.columnCount = e;
  }
}
class co {
  constructor(e) {
    return this._sheet = e, new Proxy(this, {
      get: function(t, A, i) {
        return typeof t[A] < "u" ? t[A] : t._sheet.table.componentFunctionBinder.handle("sheet", t._sheet, A);
      }
    });
  }
  getTitle() {
    return this._sheet.title;
  }
  getKey() {
    return this._sheet.key;
  }
  getDefinition() {
    return this._sheet.getDefinition();
  }
  getData() {
    return this._sheet.getData();
  }
  setData(e) {
    return this._sheet.setData(e);
  }
  clear() {
    return this._sheet.clear();
  }
  remove() {
    return this._sheet.remove();
  }
  active() {
    return this._sheet.active();
  }
  setTitle(e) {
    return this._sheet.setTitle(e);
  }
  setRows(e) {
    return this._sheet.setRows(e);
  }
  setColumns(e) {
    return this._sheet.setColumns(e);
  }
}
class Gr extends ye {
  constructor(e, t) {
    super(e.table), this.spreadsheetManager = e, this.definition = t, this.title = this.definition.title || "", this.key = this.definition.key || this.definition.title, this.rowCount = this.definition.rows, this.columnCount = this.definition.columns, this.data = this.definition.data || [], this.element = null, this.isActive = !1, this.grid = new qh(this.columnCount, this.rowCount), this.defaultColumnDefinition = { width: 100, headerHozAlign: "center", headerSort: !1 }, this.columnDefinition = Object.assign(this.defaultColumnDefinition, this.options("spreadsheetColumnDefinition")), this.columnDefs = [], this.rowDefs = [], this.columnFields = [], this.columns = [], this.rows = [], this.scrollTop = null, this.scrollLeft = null, this.initialize(), this.dispatchExternal("sheetAdded", this.getComponent());
  }
  ///////////////////////////////////
  ///////// Initialization //////////
  ///////////////////////////////////
  initialize() {
    this.initializeElement(), this.initializeColumns(), this.initializeRows();
  }
  reinitialize() {
    this.initializeColumns(), this.initializeRows();
  }
  initializeElement() {
    this.element = document.createElement("div"), this.element.classList.add("tabulator-spreadsheet-tab"), this.element.innerText = this.title, this.element.addEventListener("click", () => {
      this.spreadsheetManager.loadSheet(this);
    });
  }
  initializeColumns() {
    this.grid.setColumnCount(this.columnCount), this.columnFields = this.grid.genColumns(this.data), this.columnDefs = [], this.columnFields.forEach((e) => {
      var t = Object.assign({}, this.columnDefinition);
      t.field = e, t.title = e, this.columnDefs.push(t);
    });
  }
  initializeRows() {
    var e;
    this.grid.setRowCount(this.rowCount), e = this.grid.genRows(this.data), this.rowDefs = [], e.forEach((t, A) => {
      var i = { _id: t }, s = this.data[A];
      s && s.forEach((n, o) => {
        var a = this.columnFields[o];
        a && (i[a] = n);
      }), this.rowDefs.push(i);
    });
  }
  unload() {
    this.isActive = !1, this.scrollTop = this.table.rowManager.scrollTop, this.scrollLeft = this.table.rowManager.scrollLeft, this.data = this.getData(!0), this.element.classList.remove("tabulator-spreadsheet-tab-active");
  }
  load() {
    var e = !this.isActive;
    this.isActive = !0, this.table.blockRedraw(), this.table.setData([]), this.table.setColumns(this.columnDefs), this.table.setData(this.rowDefs), this.table.restoreRedraw(), e && this.scrollTop !== null && (this.table.rowManager.element.scrollLeft = this.scrollLeft, this.table.rowManager.element.scrollTop = this.scrollTop), this.element.classList.add("tabulator-spreadsheet-tab-active"), this.dispatchExternal("sheetLoaded", this.getComponent());
  }
  ///////////////////////////////////
  //////// Helper Functions /////////
  ///////////////////////////////////
  getComponent() {
    return new co(this);
  }
  getDefinition() {
    return {
      title: this.title,
      key: this.key,
      rows: this.rowCount,
      columns: this.columnCount,
      data: this.getData()
    };
  }
  getData(e) {
    var t = [], A, i, s;
    return this.rowDefs.forEach((n) => {
      var o = [];
      this.columnFields.forEach((a) => {
        o.push(n[a]);
      }), t.push(o);
    }), !e && !this.options("spreadsheetOutputFull") && (A = t.map((n) => n.findLastIndex((o) => typeof o < "u") + 1), i = Math.max(...A), s = A.findLastIndex((n) => n > 0) + 1, t = t.slice(0, s), t = t.map((n) => n.slice(0, i))), t;
  }
  setData(e) {
    this.data = e, this.reinitialize(), this.dispatchExternal("sheetUpdated", this.getComponent()), this.isActive && this.load();
  }
  clear() {
    this.setData([]);
  }
  setTitle(e) {
    this.title = e, this.element.innerText = e, this.dispatchExternal("sheetUpdated", this.getComponent());
  }
  setRows(e) {
    this.rowCount = e, this.initializeRows(), this.dispatchExternal("sheetUpdated", this.getComponent()), this.isActive && this.load();
  }
  setColumns(e) {
    this.columnCount = e, this.reinitialize(), this.dispatchExternal("sheetUpdated", this.getComponent()), this.isActive && this.load();
  }
  remove() {
    this.spreadsheetManager.removeSheet(this);
  }
  destroy() {
    this.element.parentNode && this.element.parentNode.removeChild(this.element), this.dispatchExternal("sheetRemoved", this.getComponent());
  }
  active() {
    this.spreadsheetManager.loadSheet(this);
  }
}
class fo extends Y {
  constructor(e) {
    super(e), this.sheets = [], this.element = null, this.registerTableOption("spreadsheet", !1), this.registerTableOption("spreadsheetRows", 50), this.registerTableOption("spreadsheetColumns", 50), this.registerTableOption("spreadsheetColumnDefinition", {}), this.registerTableOption("spreadsheetOutputFull", !1), this.registerTableOption("spreadsheetData", !1), this.registerTableOption("spreadsheetSheets", !1), this.registerTableOption("spreadsheetSheetTabs", !1), this.registerTableOption("spreadsheetSheetTabsElement", !1), this.registerTableFunction("setSheets", this.setSheets.bind(this)), this.registerTableFunction("addSheet", this.addSheet.bind(this)), this.registerTableFunction("getSheets", this.getSheets.bind(this)), this.registerTableFunction("getSheetDefinitions", this.getSheetDefinitions.bind(this)), this.registerTableFunction("setSheetData", this.setSheetData.bind(this)), this.registerTableFunction("getSheet", this.getSheet.bind(this)), this.registerTableFunction("getSheetData", this.getSheetData.bind(this)), this.registerTableFunction("clearSheet", this.clearSheet.bind(this)), this.registerTableFunction("removeSheet", this.removeSheetFunc.bind(this)), this.registerTableFunction("activeSheet", this.activeSheetFunc.bind(this));
  }
  ///////////////////////////////////
  ////// Module Initialization //////
  ///////////////////////////////////
  initialize() {
    this.options("spreadsheet") && (this.subscribe("table-initialized", this.tableInitialized.bind(this)), this.subscribe("data-loaded", this.loadRemoteData.bind(this)), this.table.options.index = "_id", this.options("spreadsheetData") && this.options("spreadsheetSheets") && (console.warn("You cannot use spreadsheetData and spreadsheetSheets at the same time, ignoring spreadsheetData"), this.table.options.spreadsheetData = !1), this.compatibilityCheck(), this.options("spreadsheetSheetTabs") && this.initializeTabset());
  }
  compatibilityCheck() {
    this.options("data") && console.warn("Do not use the data option when working with spreadsheets, use either spreadsheetData or spreadsheetSheets to pass data into the table"), this.options("pagination") && console.warn("The spreadsheet module is not compatible with the pagination module"), this.options("groupBy") && console.warn("The spreadsheet module is not compatible with the row grouping module"), this.options("responsiveCollapse") && console.warn("The spreadsheet module is not compatible with the responsive collapse module");
  }
  initializeTabset() {
    this.element = document.createElement("div"), this.element.classList.add("tabulator-spreadsheet-tabs");
    var e = this.options("spreadsheetSheetTabsElement");
    e && !(e instanceof HTMLElement) && (e = document.querySelector(e), e || console.warn("Unable to find element matching spreadsheetSheetTabsElement selector:", this.options("spreadsheetSheetTabsElement"))), e ? e.appendChild(this.element) : this.footerAppend(this.element);
  }
  tableInitialized() {
    this.sheets.length ? this.loadSheet(this.sheets[0]) : this.options("spreadsheetSheets") ? this.loadSheets(this.options("spreadsheetSheets")) : this.options("spreadsheetData") && this.loadData(this.options("spreadsheetData"));
  }
  ///////////////////////////////////
  /////////// Ajax Parsing //////////
  ///////////////////////////////////
  loadRemoteData(e, t, A) {
    return console.log("data", e, t, A), Array.isArray(e) ? (this.table.dataLoader.clearAlert(), this.dispatchExternal("dataLoaded", e), !e.length || Array.isArray(e[0]) ? this.loadData(e) : this.loadSheets(e)) : console.error(`Spreadsheet Loading Error - Unable to process remote data due to invalid data type 
Expecting: array 
Received: `, typeof e, `
Data:     `, e), !1;
  }
  ///////////////////////////////////
  ///////// Sheet Management ////////
  ///////////////////////////////////
  loadData(e) {
    var t = {
      data: e
    };
    this.loadSheet(this.newSheet(t));
  }
  destroySheets() {
    this.sheets.forEach((e) => {
      e.destroy();
    }), this.sheets = [], this.activeSheet = null;
  }
  loadSheets(e) {
    Array.isArray(e) || (e = []), this.destroySheets(), e.forEach((t) => {
      this.newSheet(t);
    }), this.loadSheet(this.sheets[0]);
  }
  loadSheet(e) {
    this.activeSheet !== e && (this.activeSheet && this.activeSheet.unload(), this.activeSheet = e, e.load());
  }
  newSheet(e = {}) {
    var t;
    return e.rows || (e.rows = this.options("spreadsheetRows")), e.columns || (e.columns = this.options("spreadsheetColumns")), t = new Gr(this, e), this.sheets.push(t), this.element && this.element.appendChild(t.element), t;
  }
  removeSheet(e) {
    var t = this.sheets.indexOf(e), A;
    this.sheets.length > 1 ? t > -1 && (this.sheets.splice(t, 1), e.destroy(), this.activeSheet === e && (A = this.sheets[t - 1] || this.sheets[0], A ? this.loadSheet(A) : this.activeSheet = null)) : console.warn("Unable to remove sheet, at least one sheet must be active");
  }
  lookupSheet(e) {
    return e ? e instanceof Gr ? e : e instanceof co ? e._sheet : this.sheets.find((t) => t.key === e) || !1 : this.activeSheet;
  }
  ///////////////////////////////////
  //////// Public Functions /////////
  ///////////////////////////////////
  setSheets(e) {
    return this.loadSheets(e), this.getSheets();
  }
  addSheet(e) {
    return this.newSheet(e).getComponent();
  }
  getSheetDefinitions() {
    return this.sheets.map((e) => e.getDefinition());
  }
  getSheets() {
    return this.sheets.map((e) => e.getComponent());
  }
  getSheet(e) {
    var t = this.lookupSheet(e);
    return t ? t.getComponent() : !1;
  }
  setSheetData(e, t) {
    e && !t && (t = e, e = !1);
    var A = this.lookupSheet(e);
    return A ? A.setData(t) : !1;
  }
  getSheetData(e) {
    var t = this.lookupSheet(e);
    return t ? t.getData() : !1;
  }
  clearSheet(e) {
    var t = this.lookupSheet(e);
    return t ? t.clear() : !1;
  }
  removeSheetFunc(e) {
    var t = this.lookupSheet(e);
    t && this.removeSheet(t);
  }
  activeSheetFunc(e) {
    var t = this.lookupSheet(e);
    return t ? this.loadSheet(t) : !1;
  }
}
U(fo, "moduleName", "spreadsheet");
class go extends Y {
  constructor(e) {
    super(e), this.tooltipSubscriber = null, this.headerSubscriber = null, this.timeout = null, this.popupInstance = null, this.registerTableOption("tooltipDelay", 300), this.registerColumnOption("tooltip"), this.registerColumnOption("headerTooltip");
  }
  initialize() {
    this.deprecatedOptionsCheck(), this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  deprecatedOptionsCheck() {
  }
  initializeColumn(e) {
    e.definition.headerTooltip && !this.headerSubscriber && (this.headerSubscriber = !0, this.subscribe("column-mousemove", this.mousemoveCheck.bind(this, "headerTooltip")), this.subscribe("column-mouseout", this.mouseoutCheck.bind(this, "headerTooltip"))), e.definition.tooltip && !this.tooltipSubscriber && (this.tooltipSubscriber = !0, this.subscribe("cell-mousemove", this.mousemoveCheck.bind(this, "tooltip")), this.subscribe("cell-mouseout", this.mouseoutCheck.bind(this, "tooltip")));
  }
  mousemoveCheck(e, t, A) {
    var i = e === "tooltip" ? A.column.definition.tooltip : A.definition.headerTooltip;
    i && (this.clearPopup(), this.timeout = setTimeout(this.loadTooltip.bind(this, t, A, i), this.table.options.tooltipDelay));
  }
  mouseoutCheck(e, t, A) {
    this.popupInstance || this.clearPopup();
  }
  clearPopup(e, t, A) {
    clearTimeout(this.timeout), this.timeout = null, this.popupInstance && this.popupInstance.hide();
  }
  loadTooltip(e, t, A) {
    var i, s, n;
    function o(a) {
      s = a;
    }
    typeof A == "function" && (A = A(e, t.getComponent(), o)), A instanceof HTMLElement ? i = A : (i = document.createElement("div"), A === !0 && (t instanceof OA ? A = t.value : t.definition.field ? this.langBind("columns|" + t.definition.field, (a) => {
      i.innerHTML = A = a || t.definition.title;
    }) : A = t.definition.title), i.innerHTML = A), (A || A === 0 || A === !1) && (i.classList.add("tabulator-tooltip"), i.addEventListener("mousemove", (a) => a.preventDefault()), this.popupInstance = this.popup(i), typeof s == "function" && this.popupInstance.renderCallback(s), n = this.popupInstance.containerEventCoords(e), this.popupInstance.show(n.x + 15, n.y + 15).hideOnBlur(() => {
      this.dispatchExternal("TooltipClosed", t.getComponent()), this.popupInstance = null;
    }), this.dispatchExternal("TooltipOpened", t.getComponent()));
  }
}
U(go, "moduleName", "tooltip");
var eu = {
  //is integer
  integer: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : (e = Number(e), !isNaN(e) && isFinite(e) && Math.floor(e) === e);
  },
  //is float
  float: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : (e = Number(e), !isNaN(e) && isFinite(e) && e % 1 !== 0);
  },
  //must be a number
  numeric: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : !isNaN(e);
  },
  //must be a string
  string: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : isNaN(e);
  },
  //must be alphanumeric
  alphanumeric: function(r, e, t) {
    if (e === "" || e === null || typeof e > "u")
      return !0;
    var A = new RegExp(/^[a-z0-9]+$/i);
    return A.test(e);
  },
  //maximum value
  max: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : parseFloat(e) <= t;
  },
  //minimum value
  min: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : parseFloat(e) >= t;
  },
  //starts with  value
  starts: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : String(e).toLowerCase().startsWith(String(t).toLowerCase());
  },
  //ends with  value
  ends: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : String(e).toLowerCase().endsWith(String(t).toLowerCase());
  },
  //minimum string length
  minLength: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : String(e).length >= t;
  },
  //maximum string length
  maxLength: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : String(e).length <= t;
  },
  //in provided value list
  in: function(r, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : (typeof t == "string" && (t = t.split("|")), t.indexOf(e) > -1);
  },
  //must match provided regex
  regex: function(r, e, t) {
    if (e === "" || e === null || typeof e > "u")
      return !0;
    var A = new RegExp(t);
    return A.test(e);
  },
  //value must be unique in this column
  unique: function(r, e, t) {
    if (e === "" || e === null || typeof e > "u")
      return !0;
    var A = !0, i = r.getData(), s = r.getColumn()._getSelf();
    return this.table.rowManager.rows.forEach(function(n) {
      var o = n.getData();
      o !== i && e == s.getFieldValue(o) && (A = !1);
    }), A;
  },
  //must have a value
  required: function(r, e, t) {
    return e !== "" && e !== null && typeof e < "u";
  }
};
const MA = class MA extends Y {
  constructor(e) {
    super(e), this.invalidCells = [], this.registerTableOption("validationMode", "blocking"), this.registerColumnOption("validator"), this.registerTableFunction("getInvalidCells", this.getInvalidCells.bind(this)), this.registerTableFunction("clearCellValidation", this.userClearCellValidation.bind(this)), this.registerTableFunction("validate", this.userValidate.bind(this)), this.registerComponentFunction("cell", "isValid", this.cellIsValid.bind(this)), this.registerComponentFunction("cell", "clearValidation", this.clearValidation.bind(this)), this.registerComponentFunction("cell", "validate", this.cellValidate.bind(this)), this.registerComponentFunction("column", "validate", this.columnValidate.bind(this)), this.registerComponentFunction("row", "validate", this.rowValidate.bind(this));
  }
  initialize() {
    this.subscribe("cell-delete", this.clearValidation.bind(this)), this.subscribe("column-layout", this.initializeColumnCheck.bind(this)), this.subscribe("edit-success", this.editValidate.bind(this)), this.subscribe("edit-editor-clear", this.editorClear.bind(this)), this.subscribe("edit-edited-clear", this.editedClear.bind(this));
  }
  ///////////////////////////////////
  ///////// Event Handling //////////
  ///////////////////////////////////
  editValidate(e, t, A) {
    var i = this.table.options.validationMode !== "manual" ? this.validate(e.column.modules.validate, e, t) : !0;
    return i !== !0 && setTimeout(() => {
      e.getElement().classList.add("tabulator-validation-fail"), this.dispatchExternal("validationFailed", e.getComponent(), t, i);
    }), i;
  }
  editorClear(e, t) {
    t && e.column.modules.validate && this.cellValidate(e), e.getElement().classList.remove("tabulator-validation-fail");
  }
  editedClear(e) {
    e.modules.validate && (e.modules.validate.invalid = !1);
  }
  ///////////////////////////////////
  ////////// Cell Functions /////////
  ///////////////////////////////////
  cellIsValid(e) {
    return e.modules.validate && e.modules.validate.invalid || !0;
  }
  cellValidate(e) {
    return this.validate(e.column.modules.validate, e, e.getValue());
  }
  ///////////////////////////////////
  ///////// Column Functions ////////
  ///////////////////////////////////
  columnValidate(e) {
    var t = [];
    return e.cells.forEach((A) => {
      this.cellValidate(A) !== !0 && t.push(A.getComponent());
    }), t.length ? t : !0;
  }
  ///////////////////////////////////
  ////////// Row Functions //////////
  ///////////////////////////////////
  rowValidate(e) {
    var t = [];
    return e.cells.forEach((A) => {
      this.cellValidate(A) !== !0 && t.push(A.getComponent());
    }), t.length ? t : !0;
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  userClearCellValidation(e) {
    e || (e = this.getInvalidCells()), Array.isArray(e) || (e = [e]), e.forEach((t) => {
      this.clearValidation(t._getSelf());
    });
  }
  userValidate(e) {
    var t = [];
    return this.table.rowManager.rows.forEach((A) => {
      A = A.getComponent();
      var i = A.validate();
      i !== !0 && (t = t.concat(i));
    }), t.length ? t : !0;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  initializeColumnCheck(e) {
    typeof e.definition.validator < "u" && this.initializeColumn(e);
  }
  //validate
  initializeColumn(e) {
    var t = this, A = [], i;
    e.definition.validator && (Array.isArray(e.definition.validator) ? e.definition.validator.forEach((s) => {
      i = t._extractValidator(s), i && A.push(i);
    }) : (i = this._extractValidator(e.definition.validator), i && A.push(i)), e.modules.validate = A.length ? A : !1);
  }
  _extractValidator(e) {
    var t, A, i;
    switch (typeof e) {
      case "string":
        return i = e.indexOf(":"), i > -1 ? (t = e.substring(0, i), A = e.substring(i + 1)) : t = e, this._buildValidator(t, A);
      case "function":
        return this._buildValidator(e);
      case "object":
        return this._buildValidator(e.type, e.parameters);
    }
  }
  _buildValidator(e, t) {
    var A = typeof e == "function" ? e : MA.validators[e];
    return A ? {
      type: typeof e == "function" ? "function" : e,
      func: A,
      params: t
    } : (console.warn("Validator Setup Error - No matching validator found:", e), !1);
  }
  validate(e, t, A) {
    var i = this, s = [], n = this.invalidCells.indexOf(t);
    return e && e.forEach((o) => {
      o.func.call(i, t.getComponent(), A, o.params) || s.push({
        type: o.type,
        parameters: o.params
      });
    }), t.modules.validate || (t.modules.validate = {}), s.length ? (t.modules.validate.invalid = s, this.table.options.validationMode !== "manual" && t.getElement().classList.add("tabulator-validation-fail"), n == -1 && this.invalidCells.push(t)) : (t.modules.validate.invalid = !1, t.getElement().classList.remove("tabulator-validation-fail"), n > -1 && this.invalidCells.splice(n, 1)), s.length ? s : !0;
  }
  getInvalidCells() {
    var e = [];
    return this.invalidCells.forEach((t) => {
      e.push(t.getComponent());
    }), e;
  }
  clearValidation(e) {
    var t;
    e.modules.validate && e.modules.validate.invalid && (e.getElement().classList.remove("tabulator-validation-fail"), e.modules.validate.invalid = !1, t = this.invalidCells.indexOf(e), t > -1 && this.invalidCells.splice(t, 1));
  }
};
U(MA, "moduleName", "validate"), //load defaults
U(MA, "validators", eu);
let Zs = MA;
var as = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccessorModule: xs,
  AjaxModule: Is,
  ClipboardModule: Ms,
  ColumnCalcsModule: Ds,
  DataTreeModule: $n,
  DownloadModule: Ss,
  EditModule: ks,
  ExportModule: _s,
  FilterModule: Os,
  FormatModule: Ks,
  FrozenColumnsModule: qn,
  FrozenRowsModule: eo,
  GroupRowsModule: to,
  HistoryModule: Ps,
  HtmlTableImportModule: Ao,
  ImportModule: Vs,
  InteractionModule: io,
  KeybindingsModule: Ns,
  MenuModule: so,
  MoveColumnsModule: ro,
  MoveRowsModule: zs,
  MutatorModule: Gs,
  PageModule: Ws,
  PersistenceModule: Xs,
  PopupModule: no,
  PrintModule: oo,
  ReactiveDataModule: ao,
  ResizeColumnsModule: lo,
  ResizeRowsModule: ho,
  ResizeTableModule: uo,
  ResponsiveLayoutModule: Js,
  SelectRangeModule: Bi,
  SelectRowModule: js,
  SortModule: Ys,
  SpreadsheetModule: fo,
  TooltipModule: go,
  ValidateModule: Zs
}), tu = {
  debugEventsExternal: !1,
  //flag to console log events
  debugEventsInternal: !1,
  //flag to console log events
  debugInvalidOptions: !0,
  //allow toggling of invalid option warnings
  debugInvalidComponentFuncs: !0,
  //allow toggling of invalid component warnings
  debugInitialization: !0,
  //allow toggling of pre initialization function call warnings
  debugDeprecation: !0,
  //allow toggling of deprecation warnings
  height: !1,
  //height of tabulator
  minHeight: !1,
  //minimum height of tabulator
  maxHeight: !1,
  //maximum height of tabulator
  columnHeaderVertAlign: "top",
  //vertical alignment of column headers
  popupContainer: !1,
  columns: [],
  //store for colum header info
  columnDefaults: {},
  //store column default props
  rowHeader: !1,
  data: !1,
  //default starting data
  autoColumns: !1,
  //build columns from data row structure
  autoColumnsDefinitions: !1,
  nestedFieldSeparator: ".",
  //separator for nested data
  footerElement: !1,
  //hold footer element
  index: "id",
  //filed for row index
  textDirection: "auto",
  addRowPos: "bottom",
  //position to insert blank rows, top|bottom
  headerVisible: !0,
  //hide header
  renderVertical: "virtual",
  renderHorizontal: "basic",
  renderVerticalBuffer: 0,
  // set virtual DOM buffer size
  scrollToRowPosition: "top",
  scrollToRowIfVisible: !0,
  scrollToColumnPosition: "left",
  scrollToColumnIfVisible: !0,
  rowFormatter: !1,
  rowFormatterPrint: null,
  rowFormatterClipboard: null,
  rowFormatterHtmlOutput: null,
  rowHeight: null,
  placeholder: !1,
  dataLoader: !0,
  dataLoaderLoading: !1,
  dataLoaderError: !1,
  dataLoaderErrorTimeout: 3e3,
  dataSendParams: {},
  dataReceiveParams: {},
  dependencies: {}
};
class po {
  constructor(e, t, A = {}) {
    this.table = e, this.msgType = t, this.registeredDefaults = Object.assign({}, A);
  }
  register(e, t) {
    this.registeredDefaults[e] = t;
  }
  generate(e, t = {}) {
    var A = Object.assign({}, this.registeredDefaults), i = this.table.options.debugInvalidOptions || t.debugInvalidOptions === !0;
    Object.assign(A, e);
    for (let s in t)
      A.hasOwnProperty(s) || (i && console.warn("Invalid " + this.msgType + " option:", s), A[s] = t.key);
    for (let s in A)
      s in t ? A[s] = t[s] : Array.isArray(A[s]) ? A[s] = Object.assign([], A[s]) : typeof A[s] == "object" && A[s] !== null ? A[s] = Object.assign({}, A[s]) : typeof A[s] > "u" && delete A[s];
    return A;
  }
}
let ki = class extends ye {
  constructor(e) {
    super(e), this.elementVertical = e.rowManager.element, this.elementHorizontal = e.columnManager.element, this.tableElement = e.rowManager.tableElement, this.verticalFillMode = "fit";
  }
  ///////////////////////////////////
  /////// Internal Bindings /////////
  ///////////////////////////////////
  initialize() {
  }
  clearRows() {
  }
  clearColumns() {
  }
  reinitializeColumnWidths(e) {
  }
  renderRows() {
  }
  renderColumns() {
  }
  rerenderRows(e) {
    e && e();
  }
  rerenderColumns(e, t) {
  }
  renderRowCells(e) {
  }
  rerenderRowCells(e, t) {
  }
  scrollColumns(e, t) {
  }
  scrollRows(e, t) {
  }
  resize() {
  }
  scrollToRow(e) {
  }
  scrollToRowNearestTop(e) {
  }
  visibleRows(e) {
    return [];
  }
  ///////////////////////////////////
  //////// Helper Functions /////////
  ///////////////////////////////////
  rows() {
    return this.table.rowManager.getDisplayRows();
  }
  styleRow(e, t) {
    var A = e.getElement();
    t % 2 ? (A.classList.add("tabulator-row-even"), A.classList.remove("tabulator-row-odd")) : (A.classList.add("tabulator-row-odd"), A.classList.remove("tabulator-row-even"));
  }
  ///////////////////////////////////
  /////// External Triggers /////////
  /////// (DO NOT OVERRIDE) /////////
  ///////////////////////////////////
  clear() {
    this.clearRows(), this.clearColumns();
  }
  render() {
    this.renderRows(), this.renderColumns();
  }
  rerender(e) {
    this.rerenderRows(), this.rerenderColumns();
  }
  scrollToRowPosition(e, t, A) {
    var i = this.rows().indexOf(e), s = e.getElement(), n = 0;
    return new Promise((o, a) => {
      if (i > -1) {
        if (typeof A > "u" && (A = this.table.options.scrollToRowIfVisible), !A && ie.elVisible(s) && (n = ie.elOffset(s).top - ie.elOffset(this.elementVertical).top, n > 0 && n < this.elementVertical.clientHeight - s.offsetHeight))
          return o(), !1;
        switch (typeof t > "u" && (t = this.table.options.scrollToRowPosition), t === "nearest" && (t = this.scrollToRowNearestTop(e) ? "top" : "bottom"), this.scrollToRow(e), t) {
          case "middle":
          case "center":
            this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight ? this.elementVertical.scrollTop = this.elementVertical.scrollTop + (s.offsetTop - this.elementVertical.scrollTop) - (this.elementVertical.scrollHeight - s.offsetTop) / 2 : this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight / 2;
            break;
          case "bottom":
            this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight ? this.elementVertical.scrollTop = this.elementVertical.scrollTop - (this.elementVertical.scrollHeight - s.offsetTop) + s.offsetHeight : this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight + s.offsetHeight;
            break;
          case "top":
            this.elementVertical.scrollTop = s.offsetTop;
            break;
        }
        o();
      } else
        console.warn("Scroll Error - Row not visible"), a("Scroll Error - Row not visible");
    });
  }
};
class Au extends ki {
  constructor(e) {
    super(e);
  }
  renderRowCells(e, t) {
    const A = document.createDocumentFragment();
    e.cells.forEach((i) => {
      A.appendChild(i.getElement());
    }), e.element.appendChild(A), t || e.cells.forEach((i) => {
      i.cellRendered();
    });
  }
  reinitializeColumnWidths(e) {
    e.forEach(function(t) {
      t.reinitializeWidth();
    });
  }
}
class iu extends ki {
  constructor(e) {
    super(e), this.leftCol = 0, this.rightCol = 0, this.scrollLeft = 0, this.vDomScrollPosLeft = 0, this.vDomScrollPosRight = 0, this.vDomPadLeft = 0, this.vDomPadRight = 0, this.fitDataColAvg = 0, this.windowBuffer = 200, this.visibleRows = null, this.initialized = !1, this.isFitData = !1, this.columns = [];
  }
  initialize() {
    this.compatibilityCheck(), this.layoutCheck(), this.vertScrollListen();
  }
  compatibilityCheck() {
    this.options("layout") == "fitDataTable" && console.warn("Horizontal Virtual DOM is not compatible with fitDataTable layout mode"), this.options("responsiveLayout") && console.warn("Horizontal Virtual DOM is not compatible with responsive columns"), this.options("rtl") && console.warn("Horizontal Virtual DOM is not currently compatible with RTL text direction");
  }
  layoutCheck() {
    this.isFitData = this.options("layout").startsWith("fitData");
  }
  vertScrollListen() {
    this.subscribe("scroll-vertical", this.clearVisRowCache.bind(this)), this.subscribe("data-refreshed", this.clearVisRowCache.bind(this));
  }
  clearVisRowCache() {
    this.visibleRows = null;
  }
  //////////////////////////////////////
  ///////// Public Functions ///////////
  //////////////////////////////////////
  renderColumns(e, t) {
    this.dataChange();
  }
  scrollColumns(e, t) {
    this.scrollLeft != e && (this.scrollLeft = e, this.scroll(e - (this.vDomScrollPosLeft + this.windowBuffer)));
  }
  calcWindowBuffer() {
    var e = this.elementVertical.clientWidth;
    this.table.columnManager.columnsByIndex.forEach((t) => {
      if (t.visible) {
        var A = t.getWidth();
        A > e && (e = A);
      }
    }), this.windowBuffer = e * 2;
  }
  rerenderColumns(e, t) {
    var A = {
      cols: this.columns,
      leftCol: this.leftCol,
      rightCol: this.rightCol
    }, i = 0;
    e && !this.initialized || (this.clear(), this.calcWindowBuffer(), this.scrollLeft = this.elementVertical.scrollLeft, this.vDomScrollPosLeft = this.scrollLeft - this.windowBuffer, this.vDomScrollPosRight = this.scrollLeft + this.elementVertical.clientWidth + this.windowBuffer, this.table.columnManager.columnsByIndex.forEach((s) => {
      var n = {}, o;
      s.visible && (s.modules.frozen || (o = s.getWidth(), n.leftPos = i, n.rightPos = i + o, n.width = o, this.isFitData && (n.fitDataCheck = s.modules.vdomHoz ? s.modules.vdomHoz.fitDataCheck : !0), i + o > this.vDomScrollPosLeft && i < this.vDomScrollPosRight ? (this.leftCol == -1 && (this.leftCol = this.columns.length, this.vDomPadLeft = i), this.rightCol = this.columns.length) : this.leftCol !== -1 && (this.vDomPadRight += o), this.columns.push(s), s.modules.vdomHoz = n, i += o));
    }), this.tableElement.style.paddingLeft = this.vDomPadLeft + "px", this.tableElement.style.paddingRight = this.vDomPadRight + "px", this.initialized = !0, t || (!e || this.reinitChanged(A)) && this.reinitializeRows(), this.elementVertical.scrollLeft = this.scrollLeft);
  }
  renderRowCells(e) {
    if (this.initialized)
      this.initializeRow(e);
    else {
      const t = document.createDocumentFragment();
      e.cells.forEach((A) => {
        t.appendChild(A.getElement());
      }), e.element.appendChild(t), e.cells.forEach((A) => {
        A.cellRendered();
      });
    }
  }
  rerenderRowCells(e, t) {
    this.reinitializeRow(e, t);
  }
  reinitializeColumnWidths(e) {
    for (let t = this.leftCol; t <= this.rightCol; t++) {
      let A = this.columns[t];
      A && A.reinitializeWidth();
    }
  }
  //////////////////////////////////////
  //////// Internal Rendering //////////
  //////////////////////////////////////
  deinitialize() {
    this.initialized = !1;
  }
  clear() {
    this.columns = [], this.leftCol = -1, this.rightCol = 0, this.vDomScrollPosLeft = 0, this.vDomScrollPosRight = 0, this.vDomPadLeft = 0, this.vDomPadRight = 0;
  }
  dataChange() {
    var e = !1, t, A;
    if (this.isFitData) {
      if (this.table.columnManager.columnsByIndex.forEach((i) => {
        !i.definition.width && i.visible && (e = !0);
      }), e && this.table.rowManager.getDisplayRows().length && (this.vDomScrollPosRight = this.scrollLeft + this.elementVertical.clientWidth + this.windowBuffer, t = this.chain("rows-sample", [1], [], () => this.table.rowManager.getDisplayRows())[0], t)) {
        A = t.getElement(), t.generateCells(), this.tableElement.appendChild(A);
        for (let i = 0; i < t.cells.length; i++) {
          let s = t.cells[i];
          A.appendChild(s.getElement()), s.column.reinitializeWidth();
        }
        A.parentNode.removeChild(A), this.rerenderColumns(!1, !0);
      }
    } else
      this.options("layout") === "fitColumns" && (this.layoutRefresh(), this.rerenderColumns(!1, !0));
  }
  reinitChanged(e) {
    var t = !0;
    return e.cols.length !== this.columns.length || e.leftCol !== this.leftCol || e.rightCol !== this.rightCol ? !0 : (e.cols.forEach((A, i) => {
      A !== this.columns[i] && (t = !1);
    }), !t);
  }
  reinitializeRows() {
    var e = this.getVisibleRows(), t = this.table.rowManager.getRows().filter((A) => !e.includes(A));
    e.forEach((A) => {
      this.reinitializeRow(A, !0);
    }), t.forEach((A) => {
      A.deinitialize();
    });
  }
  getVisibleRows() {
    return this.visibleRows || (this.visibleRows = this.table.rowManager.getVisibleRows()), this.visibleRows;
  }
  scroll(e) {
    this.vDomScrollPosLeft += e, this.vDomScrollPosRight += e, Math.abs(e) > this.windowBuffer / 2 ? this.rerenderColumns() : e > 0 ? (this.addColRight(), this.removeColLeft()) : (this.addColLeft(), this.removeColRight());
  }
  colPositionAdjust(e, t, A) {
    for (let i = e; i < t; i++) {
      let s = this.columns[i];
      s.modules.vdomHoz.leftPos += A, s.modules.vdomHoz.rightPos += A;
    }
  }
  addColRight() {
    for (var e = !1, t = !0; t; ) {
      let A = this.columns[this.rightCol + 1];
      A && A.modules.vdomHoz.leftPos <= this.vDomScrollPosRight ? (e = !0, this.getVisibleRows().forEach((i) => {
        if (i.type !== "group") {
          var s = i.getCell(A);
          i.getElement().insertBefore(s.getElement(), i.getCell(this.columns[this.rightCol]).getElement().nextSibling), s.cellRendered();
        }
      }), this.fitDataColActualWidthCheck(A), this.rightCol++, this.getVisibleRows().forEach((i) => {
        i.type !== "group" && (i.modules.vdomHoz.rightCol = this.rightCol);
      }), this.rightCol >= this.columns.length - 1 ? this.vDomPadRight = 0 : this.vDomPadRight -= A.getWidth()) : t = !1;
    }
    e && (this.tableElement.style.paddingRight = this.vDomPadRight + "px");
  }
  addColLeft() {
    for (var e = !1, t = !0; t; ) {
      let A = this.columns[this.leftCol - 1];
      if (A)
        if (A.modules.vdomHoz.rightPos >= this.vDomScrollPosLeft) {
          e = !0, this.getVisibleRows().forEach((s) => {
            if (s.type !== "group") {
              var n = s.getCell(A);
              s.getElement().insertBefore(n.getElement(), s.getCell(this.columns[this.leftCol]).getElement()), n.cellRendered();
            }
          }), this.leftCol--, this.getVisibleRows().forEach((s) => {
            s.type !== "group" && (s.modules.vdomHoz.leftCol = this.leftCol);
          }), this.leftCol <= 0 ? this.vDomPadLeft = 0 : this.vDomPadLeft -= A.getWidth();
          let i = this.fitDataColActualWidthCheck(A);
          i && (this.scrollLeft = this.elementVertical.scrollLeft = this.elementVertical.scrollLeft + i, this.vDomPadRight -= i);
        } else
          t = !1;
      else
        t = !1;
    }
    e && (this.tableElement.style.paddingLeft = this.vDomPadLeft + "px");
  }
  removeColRight() {
    for (var e = !1, t = !0; t; ) {
      let A = this.columns[this.rightCol];
      A && A.modules.vdomHoz.leftPos > this.vDomScrollPosRight ? (e = !0, this.getVisibleRows().forEach((i) => {
        if (i.type !== "group") {
          var s = i.getCell(A);
          try {
            i.getElement().removeChild(s.getElement());
          } catch (n) {
            console.warn("Could not removeColRight", n.message);
          }
        }
      }), this.vDomPadRight += A.getWidth(), this.rightCol--, this.getVisibleRows().forEach((i) => {
        i.type !== "group" && (i.modules.vdomHoz.rightCol = this.rightCol);
      })) : t = !1;
    }
    e && (this.tableElement.style.paddingRight = this.vDomPadRight + "px");
  }
  removeColLeft() {
    for (var e = !1, t = !0; t; ) {
      let A = this.columns[this.leftCol];
      A && A.modules.vdomHoz.rightPos < this.vDomScrollPosLeft ? (e = !0, this.getVisibleRows().forEach((i) => {
        if (i.type !== "group") {
          var s = i.getCell(A);
          try {
            i.getElement().removeChild(s.getElement());
          } catch (n) {
            console.warn("Could not removeColLeft", n.message);
          }
        }
      }), this.vDomPadLeft += A.getWidth(), this.leftCol++, this.getVisibleRows().forEach((i) => {
        i.type !== "group" && (i.modules.vdomHoz.leftCol = this.leftCol);
      })) : t = !1;
    }
    e && (this.tableElement.style.paddingLeft = this.vDomPadLeft + "px");
  }
  fitDataColActualWidthCheck(e) {
    var t, A;
    return e.modules.vdomHoz.fitDataCheck && (e.reinitializeWidth(), t = e.getWidth(), A = t - e.modules.vdomHoz.width, A && (e.modules.vdomHoz.rightPos += A, e.modules.vdomHoz.width = t, this.colPositionAdjust(this.columns.indexOf(e) + 1, this.columns.length, A)), e.modules.vdomHoz.fitDataCheck = !1), A;
  }
  initializeRow(e) {
    if (e.type !== "group") {
      e.modules.vdomHoz = {
        leftCol: this.leftCol,
        rightCol: this.rightCol
      }, this.table.modules.frozenColumns && this.table.modules.frozenColumns.leftColumns.forEach((t) => {
        this.appendCell(e, t);
      });
      for (let t = this.leftCol; t <= this.rightCol; t++)
        this.appendCell(e, this.columns[t]);
      this.table.modules.frozenColumns && this.table.modules.frozenColumns.rightColumns.forEach((t) => {
        this.appendCell(e, t);
      });
    }
  }
  appendCell(e, t) {
    if (t && t.visible) {
      let A = e.getCell(t);
      e.getElement().appendChild(A.getElement()), A.cellRendered();
    }
  }
  reinitializeRow(e, t) {
    if (e.type !== "group" && (t || !e.modules.vdomHoz || e.modules.vdomHoz.leftCol !== this.leftCol || e.modules.vdomHoz.rightCol !== this.rightCol)) {
      for (var A = e.getElement(); A.firstChild; ) A.removeChild(A.firstChild);
      this.initializeRow(e);
    }
  }
}
class su extends ye {
  constructor(e) {
    super(e), this.blockHozScrollEvent = !1, this.headersElement = null, this.contentsElement = null, this.rowHeader = null, this.element = null, this.columns = [], this.columnsByIndex = [], this.columnsByField = {}, this.scrollLeft = 0, this.optionsList = new po(this.table, "column definition", Zn), this.redrawBlock = !1, this.redrawBlockUpdate = null, this.renderer = null;
  }
  ////////////// Setup Functions /////////////////
  initialize() {
    this.initializeRenderer(), this.headersElement = this.createHeadersElement(), this.contentsElement = this.createHeaderContentsElement(), this.element = this.createHeaderElement(), this.contentsElement.insertBefore(this.headersElement, this.contentsElement.firstChild), this.element.insertBefore(this.contentsElement, this.element.firstChild), this.initializeScrollWheelWatcher(), this.subscribe("scroll-horizontal", this.scrollHorizontal.bind(this)), this.subscribe("scrollbar-vertical", this.padVerticalScrollbar.bind(this));
  }
  padVerticalScrollbar(e) {
    this.table.rtl ? this.headersElement.style.marginLeft = e + "px" : this.headersElement.style.marginRight = e + "px";
  }
  initializeRenderer() {
    var e, t = {
      virtual: iu,
      basic: Au
    };
    typeof this.table.options.renderHorizontal == "string" ? e = t[this.table.options.renderHorizontal] : e = this.table.options.renderHorizontal, e ? (this.renderer = new e(this.table, this.element, this.tableElement), this.renderer.initialize()) : console.error("Unable to find matching renderer:", this.table.options.renderHorizontal);
  }
  createHeadersElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-headers"), e.setAttribute("role", "row"), e;
  }
  createHeaderContentsElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-header-contents"), e.setAttribute("role", "rowgroup"), e;
  }
  createHeaderElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-header"), e.setAttribute("role", "rowgroup"), this.table.options.headerVisible || e.classList.add("tabulator-header-hidden"), e;
  }
  //return containing element
  getElement() {
    return this.element;
  }
  //return containing contents element
  getContentsElement() {
    return this.contentsElement;
  }
  //return header containing element
  getHeadersElement() {
    return this.headersElement;
  }
  //scroll horizontally to match table body
  scrollHorizontal(e) {
    this.contentsElement.scrollLeft = e, this.scrollLeft = e, this.renderer.scrollColumns(e);
  }
  initializeScrollWheelWatcher() {
    this.contentsElement.addEventListener("wheel", (e) => {
      var t;
      e.deltaX && (t = this.contentsElement.scrollLeft + e.deltaX, this.table.rowManager.scrollHorizontal(t), this.table.columnManager.scrollHorizontal(t));
    });
  }
  ///////////// Column Setup Functions /////////////
  generateColumnsFromRowData(e) {
    var t = [], A = {}, i = this.table.options.autoColumns === "full" ? e : [e[0]], s = this.table.options.autoColumnsDefinitions;
    if (e && e.length) {
      if (i.forEach((n) => {
        Object.keys(n).forEach((o, a) => {
          let l = n[o], h;
          A[o] ? A[o] !== !0 && typeof l < "u" && (A[o].sorter = this.calculateSorterFromValue(l), A[o] = !0) : (h = {
            field: o,
            title: o,
            sorter: this.calculateSorterFromValue(l)
          }, t.splice(a, 0, h), A[o] = typeof l > "u" ? h : !0);
        });
      }), s)
        switch (typeof s) {
          case "function":
            this.table.options.columns = s.call(this.table, t);
            break;
          case "object":
            Array.isArray(s) ? t.forEach((n) => {
              var o = s.find((a) => a.field === n.field);
              o && Object.assign(n, o);
            }) : t.forEach((n) => {
              s[n.field] && Object.assign(n, s[n.field]);
            }), this.table.options.columns = t;
            break;
        }
      else
        this.table.options.columns = t;
      this.setColumns(this.table.options.columns);
    }
  }
  calculateSorterFromValue(e) {
    var t;
    switch (typeof e) {
      case "undefined":
        t = "string";
        break;
      case "boolean":
        t = "boolean";
        break;
      case "number":
        t = "number";
        break;
      case "object":
        Array.isArray(e) ? t = "array" : t = "string";
        break;
      default:
        !isNaN(e) && e !== "" ? t = "number" : e.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i) ? t = "alphanum" : t = "string";
        break;
    }
    return t;
  }
  setColumns(e, t) {
    for (; this.headersElement.firstChild; ) this.headersElement.removeChild(this.headersElement.firstChild);
    this.columns = [], this.columnsByIndex = [], this.columnsByField = {}, this.dispatch("columns-loading"), this.dispatchExternal("columnsLoading"), this.table.options.rowHeader && (this.rowHeader = new St(this.table.options.rowHeader === !0 ? {} : this.table.options.rowHeader, this, !0), this.columns.push(this.rowHeader), this.headersElement.appendChild(this.rowHeader.getElement()), this.rowHeader.columnRendered()), e.forEach((A, i) => {
      this._addColumn(A);
    }), this._reIndexColumns(), this.dispatch("columns-loaded"), this.subscribedExternal("columnsLoaded") && this.dispatchExternal("columnsLoaded", this.getComponents()), this.rerenderColumns(!1, !0), this.redraw(!0);
  }
  _addColumn(e, t, A) {
    var i = new St(e, this), s = i.getElement(), n = A && this.findColumnIndex(A);
    if (t && this.rowHeader && (!A || A === this.rowHeader) && (t = !1, A = this.rowHeader, n = 0), A && n > -1) {
      var o = A.getTopColumn(), a = this.columns.indexOf(o), l = o.getElement();
      t ? (this.columns.splice(a, 0, i), l.parentNode.insertBefore(s, l)) : (this.columns.splice(a + 1, 0, i), l.parentNode.insertBefore(s, l.nextSibling));
    } else
      t ? (this.columns.unshift(i), this.headersElement.insertBefore(i.getElement(), this.headersElement.firstChild)) : (this.columns.push(i), this.headersElement.appendChild(i.getElement()));
    return i.columnRendered(), i;
  }
  registerColumnField(e) {
    e.definition.field && (this.columnsByField[e.definition.field] = e);
  }
  registerColumnPosition(e) {
    this.columnsByIndex.push(e);
  }
  _reIndexColumns() {
    this.columnsByIndex = [], this.columns.forEach(function(e) {
      e.reRegisterPosition();
    });
  }
  //ensure column headers take up the correct amount of space in column groups
  verticalAlignHeaders() {
    var e = 0;
    this.redrawBlock || (this.headersElement.style.height = "", this.columns.forEach((t) => {
      t.clearVerticalAlign();
    }), this.columns.forEach((t) => {
      var A = t.getHeight();
      A > e && (e = A);
    }), this.headersElement.style.height = e + "px", this.columns.forEach((t) => {
      t.verticalAlign(this.table.options.columnHeaderVertAlign, e);
    }), this.table.rowManager.adjustTableSize());
  }
  //////////////// Column Details /////////////////
  findColumn(e) {
    var t;
    if (typeof e == "object") {
      if (e instanceof St)
        return e;
      if (e instanceof Yn)
        return e._getSelf() || !1;
      if (typeof HTMLElement < "u" && e instanceof HTMLElement)
        return t = [], this.columns.forEach((i) => {
          t.push(i), t = t.concat(i.getColumns(!0));
        }), t.find((i) => i.element === e) || !1;
    } else
      return this.columnsByField[e] || !1;
    return !1;
  }
  getColumnByField(e) {
    return this.columnsByField[e];
  }
  getColumnsByFieldRoot(e) {
    var t = [];
    return Object.keys(this.columnsByField).forEach((A) => {
      var i = this.table.options.nestedFieldSeparator ? A.split(this.table.options.nestedFieldSeparator)[0] : A;
      i === e && t.push(this.columnsByField[A]);
    }), t;
  }
  getColumnByIndex(e) {
    return this.columnsByIndex[e];
  }
  getFirstVisibleColumn() {
    var e = this.columnsByIndex.findIndex((t) => t.visible);
    return e > -1 ? this.columnsByIndex[e] : !1;
  }
  getVisibleColumnsByIndex() {
    return this.columnsByIndex.filter((e) => e.visible);
  }
  getColumns() {
    return this.columns;
  }
  findColumnIndex(e) {
    return this.columnsByIndex.findIndex((t) => e === t);
  }
  //return all columns that are not groups
  getRealColumns() {
    return this.columnsByIndex;
  }
  //traverse across columns and call action
  traverse(e) {
    this.columnsByIndex.forEach((t, A) => {
      e(t, A);
    });
  }
  //get definitions of actual columns
  getDefinitions(e) {
    var t = [];
    return this.columnsByIndex.forEach((A) => {
      (!e || e && A.visible) && t.push(A.getDefinition());
    }), t;
  }
  //get full nested definition tree
  getDefinitionTree() {
    var e = [];
    return this.columns.forEach((t) => {
      e.push(t.getDefinition(!0));
    }), e;
  }
  getComponents(e) {
    var t = [], A = e ? this.columns : this.columnsByIndex;
    return A.forEach((i) => {
      t.push(i.getComponent());
    }), t;
  }
  getWidth() {
    var e = 0;
    return this.columnsByIndex.forEach((t) => {
      t.visible && (e += t.getWidth());
    }), e;
  }
  moveColumn(e, t, A) {
    t.element.parentNode.insertBefore(e.element, t.element), A && t.element.parentNode.insertBefore(t.element, e.element), this.moveColumnActual(e, t, A), this.verticalAlignHeaders(), this.table.rowManager.reinitialize();
  }
  moveColumnActual(e, t, A) {
    e.parent.isGroup ? this._moveColumnInArray(e.parent.columns, e, t, A) : this._moveColumnInArray(this.columns, e, t, A), this._moveColumnInArray(this.columnsByIndex, e, t, A, !0), this.rerenderColumns(!0), this.dispatch("column-moved", e, t, A), this.subscribedExternal("columnMoved") && this.dispatchExternal("columnMoved", e.getComponent(), this.table.columnManager.getComponents());
  }
  _moveColumnInArray(e, t, A, i, s) {
    var n = e.indexOf(t), o, a = [];
    n > -1 && (e.splice(n, 1), o = e.indexOf(A), o > -1 ? i && (o = o + 1) : o = n, e.splice(o, 0, t), s && (a = this.chain("column-moving-rows", [t, A, i], null, []) || [], a = a.concat(this.table.rowManager.rows), a.forEach(function(l) {
      if (l.cells.length) {
        var h = l.cells.splice(n, 1)[0];
        l.cells.splice(o, 0, h);
      }
    })));
  }
  scrollToColumn(e, t, A) {
    var i = 0, s = e.getLeftOffset(), n = 0, o = e.getElement();
    return new Promise((a, l) => {
      if (typeof t > "u" && (t = this.table.options.scrollToColumnPosition), typeof A > "u" && (A = this.table.options.scrollToColumnIfVisible), e.visible) {
        switch (t) {
          case "middle":
          case "center":
            n = -this.element.clientWidth / 2;
            break;
          case "right":
            n = o.clientWidth - this.headersElement.clientWidth;
            break;
        }
        if (!A && s > 0 && s + o.offsetWidth < this.element.clientWidth)
          return !1;
        i = s + n, i = Math.max(Math.min(i, this.table.rowManager.element.scrollWidth - this.table.rowManager.element.clientWidth), 0), this.table.rowManager.scrollHorizontal(i), this.scrollHorizontal(i), a();
      } else
        console.warn("Scroll Error - Column not visible"), l("Scroll Error - Column not visible");
    });
  }
  //////////////// Cell Management /////////////////
  generateCells(e) {
    var t = [];
    return this.columnsByIndex.forEach((A) => {
      t.push(A.generateCell(e));
    }), t;
  }
  //////////////// Column Management /////////////////
  getFlexBaseWidth() {
    var e = this.table.element.clientWidth, t = 0;
    return this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight && (e -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth), this.columnsByIndex.forEach(function(A) {
      var i, s, n;
      A.visible && (i = A.definition.width || 0, s = parseInt(A.minWidth), typeof i == "string" ? i.indexOf("%") > -1 ? n = e / 100 * parseInt(i) : n = parseInt(i) : n = i, t += n > s ? n : s);
    }), t;
  }
  addColumn(e, t, A) {
    return new Promise((i, s) => {
      var n = this._addColumn(e, t, A);
      this._reIndexColumns(), this.dispatch("column-add", e, t, A), this.layoutMode() != "fitColumns" && n.reinitializeWidth(), this.redraw(!0), this.table.rowManager.reinitialize(), this.rerenderColumns(), i(n);
    });
  }
  //remove column from system
  deregisterColumn(e) {
    var t = e.getField(), A;
    t && delete this.columnsByField[t], A = this.columnsByIndex.indexOf(e), A > -1 && this.columnsByIndex.splice(A, 1), A = this.columns.indexOf(e), A > -1 && this.columns.splice(A, 1), this.verticalAlignHeaders(), this.redraw();
  }
  rerenderColumns(e, t) {
    this.redrawBlock ? (e === !1 || e === !0 && this.redrawBlockUpdate === null) && (this.redrawBlockUpdate = e) : this.renderer.rerenderColumns(e, t);
  }
  blockRedraw() {
    this.redrawBlock = !0, this.redrawBlockUpdate = null;
  }
  restoreRedraw() {
    this.redrawBlock = !1, this.verticalAlignHeaders(), this.renderer.rerenderColumns(this.redrawBlockUpdate);
  }
  //redraw columns
  redraw(e) {
    ie.elVisible(this.element) && this.verticalAlignHeaders(), e && (this.table.rowManager.resetScroll(), this.table.rowManager.reinitialize()), this.confirm("table-redrawing", e) || this.layoutRefresh(e), this.dispatch("table-redraw", e), this.table.footerManager.redraw();
  }
}
class ru extends ki {
  constructor(e) {
    super(e), this.verticalFillMode = "fill", this.scrollTop = 0, this.scrollLeft = 0, this.scrollTop = 0, this.scrollLeft = 0;
  }
  clearRows() {
    for (var e = this.tableElement; e.firstChild; ) e.removeChild(e.firstChild);
    e.scrollTop = 0, e.scrollLeft = 0, e.style.minWidth = "", e.style.minHeight = "", e.style.display = "", e.style.visibility = "";
  }
  renderRows() {
    var e = this.tableElement, t = !0, A = document.createDocumentFragment(), i = this.rows();
    i.forEach((s, n) => {
      this.styleRow(s, n), s.initialize(!1, !0), s.type !== "group" && (t = !1), A.appendChild(s.getElement());
    }), e.appendChild(A), i.forEach((s) => {
      s.rendered(), s.heightInitialized || s.calcHeight(!0);
    }), i.forEach((s) => {
      s.heightInitialized || s.setCellHeight();
    }), t ? e.style.minWidth = this.table.columnManager.getWidth() + "px" : e.style.minWidth = "";
  }
  rerenderRows(e) {
    this.clearRows(), e && e(), this.renderRows(), this.rows().length || this.table.rowManager.tableEmpty();
  }
  scrollToRowNearestTop(e) {
    var t = ie.elOffset(e.getElement()).top;
    return !(Math.abs(this.elementVertical.scrollTop - t) > Math.abs(this.elementVertical.scrollTop + this.elementVertical.clientHeight - t));
  }
  scrollToRow(e) {
    var t = e.getElement();
    this.elementVertical.scrollTop = ie.elOffset(t).top - ie.elOffset(this.elementVertical).top + this.elementVertical.scrollTop;
  }
  visibleRows(e) {
    return this.rows();
  }
}
class nu extends ki {
  constructor(e) {
    super(e), this.verticalFillMode = "fill", this.scrollTop = 0, this.scrollLeft = 0, this.vDomRowHeight = 20, this.vDomTop = 0, this.vDomBottom = 0, this.vDomScrollPosTop = 0, this.vDomScrollPosBottom = 0, this.vDomTopPad = 0, this.vDomBottomPad = 0, this.vDomMaxRenderChain = 90, this.vDomWindowBuffer = 0, this.vDomWindowMinTotalRows = 20, this.vDomWindowMinMarginRows = 5, this.vDomTopNewRows = [], this.vDomBottomNewRows = [];
  }
  //////////////////////////////////////
  ///////// Public Functions ///////////
  //////////////////////////////////////
  clearRows() {
    for (var e = this.tableElement; e.firstChild; ) e.removeChild(e.firstChild);
    e.style.paddingTop = "", e.style.paddingBottom = "", e.style.minHeight = "", e.style.display = "", e.style.visibility = "", this.elementVertical.scrollTop = 0, this.elementVertical.scrollLeft = 0, this.scrollTop = 0, this.scrollLeft = 0, this.vDomTop = 0, this.vDomBottom = 0, this.vDomTopPad = 0, this.vDomBottomPad = 0, this.vDomScrollPosTop = 0, this.vDomScrollPosBottom = 0;
  }
  renderRows() {
    this._virtualRenderFill();
  }
  rerenderRows(e) {
    for (var t = this.elementVertical.scrollTop, A = !1, i = !1, s = this.table.rowManager.scrollLeft, n = this.rows(), o = this.vDomTop; o <= this.vDomBottom; o++)
      if (n[o]) {
        var a = t - n[o].getElement().offsetTop;
        if (i === !1 || Math.abs(a) < i)
          i = a, A = o;
        else
          break;
      }
    n.forEach((l) => {
      l.deinitializeHeight();
    }), e && e(), this.rows().length ? this._virtualRenderFill(A === !1 ? this.rows.length - 1 : A, !0, i || 0) : (this.clear(), this.table.rowManager.tableEmpty()), this.scrollColumns(s);
  }
  scrollColumns(e) {
    this.table.rowManager.scrollHorizontal(e);
  }
  scrollRows(e, t) {
    var A = e - this.vDomScrollPosTop, i = e - this.vDomScrollPosBottom, s = this.vDomWindowBuffer * 2, n = this.rows();
    if (this.scrollTop = e, -A > s || i > s) {
      var o = this.table.rowManager.scrollLeft;
      this._virtualRenderFill(Math.floor(this.elementVertical.scrollTop / this.elementVertical.scrollHeight * n.length)), this.scrollColumns(o);
    } else
      t ? (A < 0 && this._addTopRow(n, -A), i < 0 && (this.vDomScrollHeight - this.scrollTop > this.vDomWindowBuffer ? this._removeBottomRow(n, -i) : this.vDomScrollPosBottom = this.scrollTop)) : (i >= 0 && this._addBottomRow(n, i), A >= 0 && (this.scrollTop > this.vDomWindowBuffer ? this._removeTopRow(n, A) : this.vDomScrollPosTop = this.scrollTop));
  }
  resize() {
    this.vDomWindowBuffer = this.table.options.renderVerticalBuffer || this.elementVertical.clientHeight;
  }
  scrollToRowNearestTop(e) {
    var t = this.rows().indexOf(e);
    return !(Math.abs(this.vDomTop - t) > Math.abs(this.vDomBottom - t));
  }
  scrollToRow(e) {
    var t = this.rows().indexOf(e);
    t > -1 && this._virtualRenderFill(t, !0);
  }
  visibleRows(e) {
    var t = this.elementVertical.scrollTop, A = this.elementVertical.clientHeight + t, i = !1, s = 0, n = 0, o = this.rows();
    if (e)
      s = this.vDomTop, n = this.vDomBottom;
    else
      for (var a = this.vDomTop; a <= this.vDomBottom; a++)
        if (o[a])
          if (i)
            if (A - o[a].getElement().offsetTop >= 0)
              n = a;
            else
              break;
          else if (t - o[a].getElement().offsetTop >= 0)
            s = a;
          else if (i = !0, A - o[a].getElement().offsetTop >= 0)
            n = a;
          else
            break;
    return o.slice(s, n + 1);
  }
  //////////////////////////////////////
  //////// Internal Rendering //////////
  //////////////////////////////////////
  //full virtual render
  _virtualRenderFill(e, t, A) {
    var i = this.tableElement, s = this.elementVertical, n = 0, o = 0, a = 0, l = 0, h = 0, u = 0, c = this.rows(), f = c.length, w = 0, b, v, B = [], y = 0, D = 0, L = this.table.rowManager.fixedHeight, R = this.elementVertical.clientHeight, Q = this.table.options.rowHeight, W = !0;
    if (e = e || 0, A = A || 0, !e)
      this.clear();
    else {
      for (; i.firstChild; ) i.removeChild(i.firstChild);
      l = (f - e + 1) * this.vDomRowHeight, l < R && (e -= Math.ceil((R - l) / this.vDomRowHeight), e < 0 && (e = 0)), n = Math.min(Math.max(Math.floor(this.vDomWindowBuffer / this.vDomRowHeight), this.vDomWindowMinMarginRows), e), e -= n;
    }
    if (f && ie.elVisible(this.elementVertical)) {
      for (this.vDomTop = e, this.vDomBottom = e - 1, L || this.table.options.maxHeight ? (Q && (D = R / Q + this.vDomWindowBuffer / Q), D = Math.max(this.vDomWindowMinTotalRows, Math.ceil(D))) : D = f; (D == f || o <= R + this.vDomWindowBuffer || y < this.vDomWindowMinTotalRows) && this.vDomBottom < f - 1; ) {
        for (B = [], v = document.createDocumentFragment(), u = 0; u < D && this.vDomBottom < f - 1; )
          w = this.vDomBottom + 1, b = c[w], this.styleRow(b, w), b.initialize(!1, !0), !b.heightInitialized && !this.table.options.rowHeight && b.clearCellHeight(), v.appendChild(b.getElement()), B.push(b), this.vDomBottom++, u++;
        if (!B.length)
          break;
        i.appendChild(v), B.forEach((K) => {
          K.rendered(), K.heightInitialized || K.calcHeight(!0);
        }), B.forEach((K) => {
          K.heightInitialized || K.setCellHeight();
        }), B.forEach((K) => {
          a = K.getHeight(), y < n ? h += a : o += a, a > this.vDomWindowBuffer && (this.vDomWindowBuffer = a * 2), y++;
        }), W = this.table.rowManager.adjustTableSize(), R = this.elementVertical.clientHeight, W && (L || this.table.options.maxHeight) && (Q = o / y, D = Math.max(this.vDomWindowMinTotalRows, Math.ceil(R / Q + this.vDomWindowBuffer / Q)));
      }
      e ? (this.vDomTopPad = t ? this.vDomRowHeight * this.vDomTop + A : this.scrollTop - h, this.vDomBottomPad = this.vDomBottom == f - 1 ? 0 : Math.max(this.vDomScrollHeight - this.vDomTopPad - o - h, 0)) : (this.vDomTopPad = 0, this.vDomRowHeight = Math.floor((o + h) / y), this.vDomBottomPad = this.vDomRowHeight * (f - this.vDomBottom - 1), this.vDomScrollHeight = h + o + this.vDomBottomPad - R), i.style.paddingTop = this.vDomTopPad + "px", i.style.paddingBottom = this.vDomBottomPad + "px", t && (this.scrollTop = this.vDomTopPad + h + A - (this.elementVertical.scrollWidth > this.elementVertical.clientWidth ? this.elementVertical.offsetHeight - R : 0)), this.scrollTop = Math.min(this.scrollTop, this.elementVertical.scrollHeight - R), this.elementVertical.scrollWidth > this.elementVertical.clientWidth && t && (this.scrollTop += this.elementVertical.offsetHeight - R), this.vDomScrollPosTop = this.scrollTop, this.vDomScrollPosBottom = this.scrollTop, s.scrollTop = this.scrollTop, this.dispatch("render-virtual-fill");
    }
  }
  _addTopRow(e, t) {
    for (var A = this.tableElement, i = [], s = 0, n = this.vDomTop - 1, o = 0, a = !0; a; )
      if (this.vDomTop) {
        let l = e[n], h, u;
        l && o < this.vDomMaxRenderChain ? (h = l.getHeight() || this.vDomRowHeight, u = l.initialized, t >= h ? (this.styleRow(l, n), A.insertBefore(l.getElement(), A.firstChild), (!l.initialized || !l.heightInitialized) && i.push(l), l.initialize(), u || (h = l.getElement().offsetHeight, h > this.vDomWindowBuffer && (this.vDomWindowBuffer = h * 2)), t -= h, s += h, this.vDomTop--, n--, o++) : a = !1) : a = !1;
      } else
        a = !1;
    for (let l of i)
      l.clearCellHeight();
    this._quickNormalizeRowHeight(i), s && (this.vDomTopPad -= s, this.vDomTopPad < 0 && (this.vDomTopPad = n * this.vDomRowHeight), n < 1 && (this.vDomTopPad = 0), A.style.paddingTop = this.vDomTopPad + "px", this.vDomScrollPosTop -= s);
  }
  _removeTopRow(e, t) {
    for (var A = [], i = 0, s = 0, n = !0; n; ) {
      let o = e[this.vDomTop], a;
      o && s < this.vDomMaxRenderChain ? (a = o.getHeight() || this.vDomRowHeight, t >= a ? (this.vDomTop++, t -= a, i += a, A.push(o), s++) : n = !1) : n = !1;
    }
    for (let o of A) {
      let a = o.getElement();
      a.parentNode && a.parentNode.removeChild(a);
    }
    i && (this.vDomTopPad += i, this.tableElement.style.paddingTop = this.vDomTopPad + "px", this.vDomScrollPosTop += this.vDomTop ? i : i + this.vDomWindowBuffer);
  }
  _addBottomRow(e, t) {
    for (var A = this.tableElement, i = [], s = 0, n = this.vDomBottom + 1, o = 0, a = !0; a; ) {
      let l = e[n], h, u;
      l && o < this.vDomMaxRenderChain ? (h = l.getHeight() || this.vDomRowHeight, u = l.initialized, t >= h ? (this.styleRow(l, n), A.appendChild(l.getElement()), (!l.initialized || !l.heightInitialized) && i.push(l), l.initialize(), u || (h = l.getElement().offsetHeight, h > this.vDomWindowBuffer && (this.vDomWindowBuffer = h * 2)), t -= h, s += h, this.vDomBottom++, n++, o++) : a = !1) : a = !1;
    }
    for (let l of i)
      l.clearCellHeight();
    this._quickNormalizeRowHeight(i), s && (this.vDomBottomPad -= s, (this.vDomBottomPad < 0 || n == e.length - 1) && (this.vDomBottomPad = 0), A.style.paddingBottom = this.vDomBottomPad + "px", this.vDomScrollPosBottom += s);
  }
  _removeBottomRow(e, t) {
    for (var A = [], i = 0, s = 0, n = !0; n; ) {
      let o = e[this.vDomBottom], a;
      o && s < this.vDomMaxRenderChain ? (a = o.getHeight() || this.vDomRowHeight, t >= a ? (this.vDomBottom--, t -= a, i += a, A.push(o), s++) : n = !1) : n = !1;
    }
    for (let o of A) {
      let a = o.getElement();
      a.parentNode && a.parentNode.removeChild(a);
    }
    i && (this.vDomBottomPad += i, this.vDomBottomPad < 0 && (this.vDomBottomPad = 0), this.tableElement.style.paddingBottom = this.vDomBottomPad + "px", this.vDomScrollPosBottom -= i);
  }
  _quickNormalizeRowHeight(e) {
    for (let t of e)
      t.calcHeight();
    for (let t of e)
      t.setCellHeight();
  }
}
class ou extends ye {
  constructor(e) {
    super(e), this.element = this.createHolderElement(), this.tableElement = this.createTableElement(), this.heightFixer = this.createTableElement(), this.placeholder = null, this.placeholderContents = null, this.firstRender = !1, this.renderMode = "virtual", this.fixedHeight = !1, this.rows = [], this.activeRowsPipeline = [], this.activeRows = [], this.activeRowsCount = 0, this.displayRows = [], this.displayRowsCount = 0, this.scrollTop = 0, this.scrollLeft = 0, this.redrawBlock = !1, this.redrawBlockRestoreConfig = !1, this.redrawBlockRenderInPosition = !1, this.dataPipeline = [], this.displayPipeline = [], this.scrollbarWidth = 0, this.renderer = null;
  }
  //////////////// Setup Functions /////////////////
  createHolderElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-tableholder"), e.setAttribute("tabindex", 0), e;
  }
  createTableElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-table"), e.setAttribute("role", "rowgroup"), e;
  }
  initializePlaceholder() {
    var e = this.table.options.placeholder;
    if (typeof e == "function" && (e = e.call(this.table)), e = this.chain("placeholder", [e], e, e) || e, e) {
      let t = document.createElement("div");
      if (t.classList.add("tabulator-placeholder"), typeof e == "string") {
        let A = document.createElement("div");
        A.classList.add("tabulator-placeholder-contents"), A.innerHTML = e, t.appendChild(A), this.placeholderContents = A;
      } else typeof HTMLElement < "u" && e instanceof HTMLElement ? (t.appendChild(e), this.placeholderContents = e) : (console.warn("Invalid placeholder provided, must be string or HTML Element", e), this.el = null);
      this.placeholder = t;
    }
  }
  //return containing element
  getElement() {
    return this.element;
  }
  //return table element
  getTableElement() {
    return this.tableElement;
  }
  initialize() {
    this.initializePlaceholder(), this.initializeRenderer(), this.element.appendChild(this.tableElement), this.firstRender = !0, this.element.addEventListener("scroll", () => {
      var e = this.element.scrollLeft, t = this.scrollLeft > e, A = this.element.scrollTop, i = this.scrollTop > A;
      this.scrollLeft != e && (this.scrollLeft = e, this.dispatch("scroll-horizontal", e, t), this.dispatchExternal("scrollHorizontal", e, t), this._positionPlaceholder()), this.scrollTop != A && (this.scrollTop = A, this.renderer.scrollRows(A, i), this.dispatch("scroll-vertical", A, i), this.dispatchExternal("scrollVertical", A, i));
    });
  }
  ////////////////// Row Manipulation //////////////////
  findRow(e) {
    if (typeof e == "object") {
      if (e instanceof He)
        return e;
      if (e instanceof Di)
        return e._getSelf() || !1;
      if (typeof HTMLElement < "u" && e instanceof HTMLElement)
        return this.rows.find((A) => A.getElement() === e) || !1;
      if (e === null)
        return !1;
    } else return typeof e > "u" ? !1 : this.rows.find((A) => A.data[this.table.options.index] == e) || !1;
    return !1;
  }
  getRowFromDataObject(e) {
    var t = this.rows.find((A) => A.data === e);
    return t || !1;
  }
  getRowFromPosition(e) {
    return this.getDisplayRows().find((t) => t.type === "row" && t.getPosition() === e && t.isDisplayed());
  }
  scrollToRow(e, t, A) {
    return this.renderer.scrollToRowPosition(e, t, A);
  }
  ////////////////// Data Handling //////////////////
  setData(e, t, A) {
    return new Promise((i, s) => {
      t && this.getDisplayRows().length ? this.table.options.pagination ? this._setDataActual(e, !0) : this.reRenderInPosition(() => {
        this._setDataActual(e);
      }) : (this.table.options.autoColumns && A && this.table.initialized && this.table.columnManager.generateColumnsFromRowData(e), this.resetScroll(), this._setDataActual(e)), i();
    });
  }
  _setDataActual(e, t) {
    this.dispatchExternal("dataProcessing", e), this._wipeElements(), Array.isArray(e) ? (this.dispatch("data-processing", e), e.forEach((A, i) => {
      if (A && typeof A == "object") {
        var s = new He(A, this);
        this.rows.push(s);
      } else
        console.warn("Data Loading Warning - Invalid row data detected and ignored, expecting object but received:", A);
    }), this.refreshActiveData(!1, !1, t), this.dispatch("data-processed", e), this.dispatchExternal("dataProcessed", e)) : console.error(`Data Loading Error - Unable to process data due to invalid data type 
Expecting: array 
Received: `, typeof e, `
Data:     `, e);
  }
  _wipeElements() {
    this.dispatch("rows-wipe"), this.destroy(), this.adjustTableSize(), this.dispatch("rows-wiped");
  }
  destroy() {
    this.rows.forEach((e) => {
      e.wipe();
    }), this.rows = [], this.activeRows = [], this.activeRowsPipeline = [], this.activeRowsCount = 0, this.displayRows = [], this.displayRowsCount = 0;
  }
  deleteRow(e, t) {
    var A = this.rows.indexOf(e), i = this.activeRows.indexOf(e);
    i > -1 && this.activeRows.splice(i, 1), A > -1 && this.rows.splice(A, 1), this.setActiveRows(this.activeRows), this.displayRowIterator((s) => {
      var n = s.indexOf(e);
      n > -1 && s.splice(n, 1);
    }), t || this.reRenderInPosition(), this.regenerateRowPositions(), this.dispatchExternal("rowDeleted", e.getComponent()), this.displayRowsCount || this.tableEmpty(), this.subscribedExternal("dataChanged") && this.dispatchExternal("dataChanged", this.getData());
  }
  addRow(e, t, A, i) {
    var s = this.addRowActual(e, t, A, i);
    return s;
  }
  //add multiple rows
  addRows(e, t, A, i) {
    var s = [];
    return new Promise((n, o) => {
      t = this.findAddRowPos(t), Array.isArray(e) || (e = [e]), (typeof A > "u" && t || typeof A < "u" && !t) && e.reverse(), e.forEach((a, l) => {
        var h = this.addRow(a, t, A, !0);
        s.push(h), this.dispatch("row-added", h, a, t, A);
      }), this.refreshActiveData(i ? "displayPipeline" : !1, !1, !0), this.regenerateRowPositions(), this.displayRowsCount && this._clearPlaceholder(), n(s);
    });
  }
  findAddRowPos(e) {
    return typeof e > "u" && (e = this.table.options.addRowPos), e === "pos" && (e = !0), e === "bottom" && (e = !1), e;
  }
  addRowActual(e, t, A, i) {
    var s = e instanceof He ? e : new He(e || {}, this), n = this.findAddRowPos(t), o = -1, a, l;
    return A || (l = this.chain("row-adding-position", [s, n], null, { index: A, top: n }), A = l.index, n = l.top), typeof A < "u" && (A = this.findRow(A)), A = this.chain("row-adding-index", [s, A, n], null, A), A && (o = this.rows.indexOf(A)), A && o > -1 ? (a = this.activeRows.indexOf(A), this.displayRowIterator(function(h) {
      var u = h.indexOf(A);
      u > -1 && h.splice(n ? u : u + 1, 0, s);
    }), a > -1 && this.activeRows.splice(n ? a : a + 1, 0, s), this.rows.splice(n ? o : o + 1, 0, s)) : n ? (this.displayRowIterator(function(h) {
      h.unshift(s);
    }), this.activeRows.unshift(s), this.rows.unshift(s)) : (this.displayRowIterator(function(h) {
      h.push(s);
    }), this.activeRows.push(s), this.rows.push(s)), this.setActiveRows(this.activeRows), this.dispatchExternal("rowAdded", s.getComponent()), this.subscribedExternal("dataChanged") && this.dispatchExternal("dataChanged", this.table.rowManager.getData()), i || this.reRenderInPosition(), s;
  }
  moveRow(e, t, A) {
    this.dispatch("row-move", e, t, A), this.moveRowActual(e, t, A), this.regenerateRowPositions(), this.dispatch("row-moved", e, t, A), this.dispatchExternal("rowMoved", e.getComponent());
  }
  moveRowActual(e, t, A) {
    this.moveRowInArray(this.rows, e, t, A), this.moveRowInArray(this.activeRows, e, t, A), this.displayRowIterator((i) => {
      this.moveRowInArray(i, e, t, A);
    }), this.dispatch("row-moving", e, t, A);
  }
  moveRowInArray(e, t, A, i) {
    var s, n, o, a;
    if (t !== A && (s = e.indexOf(t), s > -1 && (e.splice(s, 1), n = e.indexOf(A), n > -1 ? i ? e.splice(n + 1, 0, t) : e.splice(n, 0, t) : e.splice(s, 0, t)), e === this.getDisplayRows())) {
      o = s < n ? s : n, a = n > s ? n : s + 1;
      for (let l = o; l <= a; l++)
        e[l] && this.styleRow(e[l], l);
    }
  }
  clearData() {
    this.setData([]);
  }
  getRowIndex(e) {
    return this.findRowIndex(e, this.rows);
  }
  getDisplayRowIndex(e) {
    var t = this.getDisplayRows().indexOf(e);
    return t > -1 ? t : !1;
  }
  nextDisplayRow(e, t) {
    var A = this.getDisplayRowIndex(e), i = !1;
    return A !== !1 && A < this.displayRowsCount - 1 && (i = this.getDisplayRows()[A + 1]), i && (!(i instanceof He) || i.type != "row") ? this.nextDisplayRow(i, t) : i;
  }
  prevDisplayRow(e, t) {
    var A = this.getDisplayRowIndex(e), i = !1;
    return A && (i = this.getDisplayRows()[A - 1]), t && i && (!(i instanceof He) || i.type != "row") ? this.prevDisplayRow(i, t) : i;
  }
  findRowIndex(e, t) {
    var A;
    return e = this.findRow(e), e && (A = t.indexOf(e), A > -1) ? A : !1;
  }
  getData(e, t) {
    var A = [], i = this.getRows(e);
    return i.forEach(function(s) {
      s.type == "row" && A.push(s.getData(t || "data"));
    }), A;
  }
  getComponents(e) {
    var t = [], A = this.getRows(e);
    return A.forEach(function(i) {
      t.push(i.getComponent());
    }), t;
  }
  getDataCount(e) {
    var t = this.getRows(e);
    return t.length;
  }
  scrollHorizontal(e) {
    this.scrollLeft = e, this.element.scrollLeft = e, this.dispatch("scroll-horizontal", e);
  }
  registerDataPipelineHandler(e, t) {
    typeof t < "u" ? (this.dataPipeline.push({ handler: e, priority: t }), this.dataPipeline.sort((A, i) => A.priority - i.priority)) : console.error("Data pipeline handlers must have a priority in order to be registered");
  }
  registerDisplayPipelineHandler(e, t) {
    typeof t < "u" ? (this.displayPipeline.push({ handler: e, priority: t }), this.displayPipeline.sort((A, i) => A.priority - i.priority)) : console.error("Display pipeline handlers must have a priority in order to be registered");
  }
  //set active data set
  refreshActiveData(e, t, A) {
    var i = this.table, s = "", n = 0, o = ["all", "dataPipeline", "display", "displayPipeline", "end"];
    if (!this.table.destroyed) {
      if (typeof e == "function")
        if (n = this.dataPipeline.findIndex((a) => a.handler === e), n > -1)
          s = "dataPipeline", t && (n == this.dataPipeline.length - 1 ? s = "display" : n++);
        else if (n = this.displayPipeline.findIndex((a) => a.handler === e), n > -1)
          s = "displayPipeline", t && (n == this.displayPipeline.length - 1 ? s = "end" : n++);
        else {
          console.error("Unable to refresh data, invalid handler provided", e);
          return;
        }
      else
        s = e || "all", n = 0;
      if (this.redrawBlock) {
        (!this.redrawBlockRestoreConfig || this.redrawBlockRestoreConfig && (this.redrawBlockRestoreConfig.stage === s && n < this.redrawBlockRestoreConfig.index || o.indexOf(s) < o.indexOf(this.redrawBlockRestoreConfig.stage))) && (this.redrawBlockRestoreConfig = {
          handler: e,
          skipStage: t,
          renderInPosition: A,
          stage: s,
          index: n
        });
        return;
      } else
        ie.elVisible(this.element) ? A ? this.reRenderInPosition(this.refreshPipelines.bind(this, e, s, n, A)) : (this.refreshPipelines(e, s, n, A), e || this.table.columnManager.renderer.renderColumns(), this.renderTable(), i.options.layoutColumnsOnNewData && this.table.columnManager.redraw(!0)) : this.refreshPipelines(e, s, n, A), this.dispatch("data-refreshed");
    }
  }
  refreshPipelines(e, t, A, i) {
    switch (this.dispatch("data-refreshing"), (!e || !this.activeRowsPipeline[0]) && (this.activeRowsPipeline[0] = this.rows.slice(0)), t) {
      case "all":
      case "dataPipeline":
        for (let s = A; s < this.dataPipeline.length; s++) {
          let n = this.dataPipeline[s].handler(this.activeRowsPipeline[s].slice(0));
          this.activeRowsPipeline[s + 1] = n || this.activeRowsPipeline[s].slice(0);
        }
        this.setActiveRows(this.activeRowsPipeline[this.dataPipeline.length]);
      case "display":
        A = 0, this.resetDisplayRows();
      case "displayPipeline":
        for (let s = A; s < this.displayPipeline.length; s++) {
          let n = this.displayPipeline[s].handler((s ? this.getDisplayRows(s - 1) : this.activeRows).slice(0), i);
          this.setDisplayRows(n || this.getDisplayRows(s - 1).slice(0), s);
        }
      case "end":
        this.regenerateRowPositions();
    }
    this.getDisplayRows().length && this._clearPlaceholder();
  }
  //regenerate row positions
  regenerateRowPositions() {
    var e = this.getDisplayRows(), t = 1;
    e.forEach((A) => {
      A.type === "row" && (A.setPosition(t), t++);
    });
  }
  setActiveRows(e) {
    this.activeRows = this.activeRows = Object.assign([], e), this.activeRowsCount = this.activeRows.length;
  }
  //reset display rows array
  resetDisplayRows() {
    this.displayRows = [], this.displayRows.push(this.activeRows.slice(0)), this.displayRowsCount = this.displayRows[0].length;
  }
  //set display row pipeline data
  setDisplayRows(e, t) {
    this.displayRows[t] = e, t == this.displayRows.length - 1 && (this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length);
  }
  getDisplayRows(e) {
    return typeof e > "u" ? this.displayRows.length ? this.displayRows[this.displayRows.length - 1] : [] : this.displayRows[e] || [];
  }
  getVisibleRows(e, t) {
    var A = Object.assign([], this.renderer.visibleRows(!t));
    return e && (A = this.chain("rows-visible", [t], A, A)), A;
  }
  //repeat action across display rows
  displayRowIterator(e) {
    this.activeRowsPipeline.forEach(e), this.displayRows.forEach(e), this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length;
  }
  //return only actual rows (not group headers etc)
  getRows(e) {
    var t = [];
    switch (e) {
      case "active":
        t = this.activeRows;
        break;
      case "display":
        t = this.table.rowManager.getDisplayRows();
        break;
      case "visible":
        t = this.getVisibleRows(!1, !0);
        break;
      default:
        t = this.chain("rows-retrieve", e, null, this.rows) || this.rows;
    }
    return t;
  }
  ///////////////// Table Rendering /////////////////
  //trigger rerender of table in current position
  reRenderInPosition(e) {
    this.redrawBlock ? e ? e() : this.redrawBlockRenderInPosition = !0 : (this.dispatchExternal("renderStarted"), this.renderer.rerenderRows(e), this.fixedHeight || this.adjustTableSize(), this.scrollBarCheck(), this.dispatchExternal("renderComplete"));
  }
  scrollBarCheck() {
    var e = 0;
    this.element.scrollHeight > this.element.clientHeight && (e = this.element.offsetWidth - this.element.clientWidth), e !== this.scrollbarWidth && (this.scrollbarWidth = e, this.dispatch("scrollbar-vertical", e));
  }
  initializeRenderer() {
    var e, t = {
      virtual: nu,
      basic: ru
    };
    typeof this.table.options.renderVertical == "string" ? e = t[this.table.options.renderVertical] : e = this.table.options.renderVertical, e ? (this.renderMode = this.table.options.renderVertical, this.renderer = new e(this.table, this.element, this.tableElement), this.renderer.initialize(), (this.table.element.clientHeight || this.table.options.height) && !(this.table.options.minHeight && this.table.options.maxHeight) ? this.fixedHeight = !0 : this.fixedHeight = !1) : console.error("Unable to find matching renderer:", this.table.options.renderVertical);
  }
  getRenderMode() {
    return this.renderMode;
  }
  renderTable() {
    this.dispatchExternal("renderStarted"), this.element.scrollTop = 0, this._clearTable(), this.displayRowsCount ? (this.renderer.renderRows(), this.firstRender && (this.firstRender = !1, this.fixedHeight || this.adjustTableSize(), this.layoutRefresh(!0))) : this.renderEmptyScroll(), this.fixedHeight || this.adjustTableSize(), this.dispatch("table-layout"), this.displayRowsCount || this._showPlaceholder(), this.scrollBarCheck(), this.dispatchExternal("renderComplete");
  }
  //show scrollbars on empty table div
  renderEmptyScroll() {
    this.placeholder ? this.tableElement.style.display = "none" : this.tableElement.style.minWidth = this.table.columnManager.getWidth() + "px";
  }
  _clearTable() {
    this._clearPlaceholder(), this.scrollTop = 0, this.scrollLeft = 0, this.renderer.clearRows();
  }
  tableEmpty() {
    this.renderEmptyScroll(), this._showPlaceholder();
  }
  checkPlaceholder() {
    this.displayRowsCount ? this._clearPlaceholder() : this.tableEmpty();
  }
  _showPlaceholder() {
    this.placeholder && (this.placeholder && this.placeholder.parentNode && this.placeholder.parentNode.removeChild(this.placeholder), this.initializePlaceholder(), this.placeholder.setAttribute("tabulator-render-mode", this.renderMode), this.getElement().appendChild(this.placeholder), this._positionPlaceholder(), this.adjustTableSize());
  }
  _clearPlaceholder() {
    this.placeholder && this.placeholder.parentNode && this.placeholder.parentNode.removeChild(this.placeholder), this.tableElement.style.minWidth = "", this.tableElement.style.display = "";
  }
  _positionPlaceholder() {
    this.placeholder && this.placeholder.parentNode && (this.placeholder.style.width = this.table.columnManager.getWidth() + "px", this.placeholderContents.style.width = this.table.rowManager.element.clientWidth + "px", this.placeholderContents.style.marginLeft = this.scrollLeft + "px");
  }
  styleRow(e, t) {
    var A = e.getElement();
    t % 2 ? (A.classList.add("tabulator-row-even"), A.classList.remove("tabulator-row-odd")) : (A.classList.add("tabulator-row-odd"), A.classList.remove("tabulator-row-even"));
  }
  //normalize height of active rows
  normalizeHeight(e) {
    this.activeRows.forEach(function(t) {
      t.normalizeHeight(e);
    });
  }
  //adjust the height of the table holder to fit in the Tabulator element
  adjustTableSize() {
    let e = this.element.clientHeight, t, A = !1;
    if (this.renderer.verticalFillMode === "fill") {
      let i = Math.floor(this.table.columnManager.getElement().getBoundingClientRect().height + (this.table.footerManager && this.table.footerManager.active && !this.table.footerManager.external ? this.table.footerManager.getElement().getBoundingClientRect().height : 0));
      if (this.fixedHeight) {
        t = isNaN(this.table.options.minHeight) ? this.table.options.minHeight : this.table.options.minHeight + "px";
        const s = "calc(100% - " + i + "px)";
        this.element.style.minHeight = t || "calc(100% - " + i + "px)", this.element.style.height = s, this.element.style.maxHeight = s;
      } else
        this.element.style.height = "", this.element.style.height = this.table.element.clientHeight - i + "px", this.element.scrollTop = this.scrollTop;
      this.renderer.resize(), !this.fixedHeight && e != this.element.clientHeight && (A = !0, this.subscribed("table-resize") ? this.dispatch("table-resize") : this.redraw()), this.scrollBarCheck();
    }
    return this._positionPlaceholder(), A;
  }
  //reinitialize all rows
  reinitialize() {
    this.rows.forEach(function(e) {
      e.reinitialize(!0);
    });
  }
  //prevent table from being redrawn
  blockRedraw() {
    this.redrawBlock = !0, this.redrawBlockRestoreConfig = !1;
  }
  //restore table redrawing
  restoreRedraw() {
    this.redrawBlock = !1, this.redrawBlockRestoreConfig ? (this.refreshActiveData(this.redrawBlockRestoreConfig.handler, this.redrawBlockRestoreConfig.skipStage, this.redrawBlockRestoreConfig.renderInPosition), this.redrawBlockRestoreConfig = !1) : this.redrawBlockRenderInPosition && this.reRenderInPosition(), this.redrawBlockRenderInPosition = !1;
  }
  //redraw table
  redraw(e) {
    this.adjustTableSize(), this.table.tableWidth = this.table.element.clientWidth, e ? this.renderTable() : (this.reRenderInPosition(), this.scrollHorizontal(this.scrollLeft));
  }
  resetScroll() {
    if (this.element.scrollLeft = 0, this.element.scrollTop = 0, this.table.browser === "ie") {
      var e = document.createEvent("Event");
      e.initEvent("scroll", !1, !0), this.element.dispatchEvent(e);
    } else
      this.element.dispatchEvent(new Event("scroll"));
  }
}
class au extends ye {
  constructor(e) {
    super(e), this.active = !1, this.element = this.createElement(), this.containerElement = this.createContainerElement(), this.external = !1;
  }
  initialize() {
    this.initializeElement();
  }
  createElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-footer"), e;
  }
  createContainerElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-footer-contents"), this.element.appendChild(e), e;
  }
  initializeElement() {
    if (this.table.options.footerElement)
      switch (typeof this.table.options.footerElement) {
        case "string":
          this.table.options.footerElement[0] === "<" ? this.containerElement.innerHTML = this.table.options.footerElement : (this.external = !0, this.containerElement = document.querySelector(this.table.options.footerElement));
          break;
        default:
          this.element = this.table.options.footerElement;
          break;
      }
  }
  getElement() {
    return this.element;
  }
  append(e) {
    this.activate(), this.containerElement.appendChild(e), this.table.rowManager.adjustTableSize();
  }
  prepend(e) {
    this.activate(), this.element.insertBefore(e, this.element.firstChild), this.table.rowManager.adjustTableSize();
  }
  remove(e) {
    e.parentNode.removeChild(e), this.deactivate();
  }
  deactivate(e) {
    (!this.element.firstChild || e) && (this.external || this.element.parentNode.removeChild(this.element), this.active = !1);
  }
  activate() {
    this.active || (this.active = !0, this.external || (this.table.element.appendChild(this.getElement()), this.table.element.style.display = ""));
  }
  redraw() {
    this.dispatch("footer-redraw");
  }
}
class lu extends ye {
  constructor(e) {
    super(e), this.el = null, this.abortClasses = ["tabulator-headers", "tabulator-table"], this.previousTargets = {}, this.listeners = [
      "click",
      "dblclick",
      "contextmenu",
      "mouseenter",
      "mouseleave",
      "mouseover",
      "mouseout",
      "mousemove",
      "mouseup",
      "mousedown",
      "touchstart",
      "touchend"
    ], this.componentMap = {
      "tabulator-cell": "cell",
      "tabulator-row": "row",
      "tabulator-group": "group",
      "tabulator-col": "column"
    }, this.pseudoTrackers = {
      row: {
        subscriber: null,
        target: null
      },
      cell: {
        subscriber: null,
        target: null
      },
      group: {
        subscriber: null,
        target: null
      },
      column: {
        subscriber: null,
        target: null
      }
    }, this.pseudoTracking = !1;
  }
  initialize() {
    this.el = this.table.element, this.buildListenerMap(), this.bindSubscriptionWatchers();
  }
  buildListenerMap() {
    var e = {};
    this.listeners.forEach((t) => {
      e[t] = {
        handler: null,
        components: []
      };
    }), this.listeners = e;
  }
  bindPseudoEvents() {
    Object.keys(this.pseudoTrackers).forEach((e) => {
      this.pseudoTrackers[e].subscriber = this.pseudoMouseEnter.bind(this, e), this.subscribe(e + "-mouseover", this.pseudoTrackers[e].subscriber);
    }), this.pseudoTracking = !0;
  }
  pseudoMouseEnter(e, t, A) {
    this.pseudoTrackers[e].target !== A && (this.pseudoTrackers[e].target && this.dispatch(e + "-mouseleave", t, this.pseudoTrackers[e].target), this.pseudoMouseLeave(e, t), this.pseudoTrackers[e].target = A, this.dispatch(e + "-mouseenter", t, A));
  }
  pseudoMouseLeave(e, t) {
    var A = Object.keys(this.pseudoTrackers), i = {
      row: ["cell"],
      cell: ["row"]
    };
    A = A.filter((s) => {
      var n = i[e];
      return s !== e && (!n || n && !n.includes(s));
    }), A.forEach((s) => {
      var n = this.pseudoTrackers[s].target;
      this.pseudoTrackers[s].target && (this.dispatch(s + "-mouseleave", t, n), this.pseudoTrackers[s].target = null);
    });
  }
  bindSubscriptionWatchers() {
    var e = Object.keys(this.listeners), t = Object.values(this.componentMap);
    for (let A of t)
      for (let i of e) {
        let s = A + "-" + i;
        this.subscriptionChange(s, this.subscriptionChanged.bind(this, A, i));
      }
    this.subscribe("table-destroy", this.clearWatchers.bind(this));
  }
  subscriptionChanged(e, t, A) {
    var i = this.listeners[t].components, s = i.indexOf(e), n = !1;
    A ? s === -1 && (i.push(e), n = !0) : this.subscribed(e + "-" + t) || s > -1 && (i.splice(s, 1), n = !0), (t === "mouseenter" || t === "mouseleave") && !this.pseudoTracking && this.bindPseudoEvents(), n && this.updateEventListeners();
  }
  updateEventListeners() {
    for (let e in this.listeners) {
      let t = this.listeners[e];
      t.components.length ? t.handler || (t.handler = this.track.bind(this, e), this.el.addEventListener(e, t.handler)) : t.handler && (this.el.removeEventListener(e, t.handler), t.handler = null);
    }
  }
  track(e, t) {
    var A = t.composedPath && t.composedPath() || t.path, i = this.findTargets(A);
    i = this.bindComponents(e, i), this.triggerEvents(e, t, i), this.pseudoTracking && (e == "mouseover" || e == "mouseleave") && !Object.keys(i).length && this.pseudoMouseLeave("none", t);
  }
  findTargets(e) {
    var t = {};
    let A = Object.keys(this.componentMap);
    for (let i of e) {
      let s = i.classList ? [...i.classList] : [];
      if (s.filter((a) => this.abortClasses.includes(a)).length)
        break;
      let o = s.filter((a) => A.includes(a));
      for (let a of o)
        t[this.componentMap[a]] || (t[this.componentMap[a]] = i);
    }
    return t.group && t.group === t.row && delete t.row, t;
  }
  bindComponents(e, t) {
    var A = Object.keys(t).reverse(), i = this.listeners[e], s = {}, n = {}, o = {};
    for (let a of A) {
      let l, h = t[a], u = this.previousTargets[a];
      if (u && u.target === h)
        l = u.component;
      else
        switch (a) {
          case "row":
          case "group":
            (i.components.includes("row") || i.components.includes("cell") || i.components.includes("group")) && (l = this.table.rowManager.getVisibleRows(!0).find((f) => f.getElement() === h), t.row && t.row.parentNode && t.row.parentNode.closest(".tabulator-row") && (t[a] = !1));
            break;
          case "column":
            i.components.includes("column") && (l = this.table.columnManager.findColumn(h));
            break;
          case "cell":
            i.components.includes("cell") && (s.row instanceof He ? l = s.row.findCell(h) : t.row && console.warn("Event Target Lookup Error - The row this cell is attached to cannot be found, has the table been reinitialized without being destroyed first?"));
            break;
        }
      l && (s[a] = l, o[a] = {
        target: h,
        component: l
      });
    }
    return this.previousTargets = o, Object.keys(t).forEach((a) => {
      let l = s[a];
      n[a] = l;
    }), n;
  }
  triggerEvents(e, t, A) {
    var i = this.listeners[e];
    for (let s in A)
      A[s] && i.components.includes(s) && this.dispatch(s + "-" + e, t, A[s]);
  }
  clearWatchers() {
    for (let e in this.listeners) {
      let t = this.listeners[e];
      t.handler && (this.el.removeEventListener(e, t.handler), t.handler = null);
    }
  }
}
class hu {
  constructor(e) {
    this.table = e, this.bindings = {};
  }
  bind(e, t, A) {
    this.bindings[e] || (this.bindings[e] = {}), this.bindings[e][t] ? console.warn("Unable to bind component handler, a matching function name is already bound", e, t, A) : this.bindings[e][t] = A;
  }
  handle(e, t, A) {
    if (this.bindings[e] && this.bindings[e][A] && typeof this.bindings[e][A].bind == "function")
      return this.bindings[e][A].bind(null, t);
    A !== "then" && typeof A == "string" && !A.startsWith("_") && this.table.options.debugInvalidComponentFuncs && console.error("The " + e + " component does not have a " + A + " function, have you checked that you have the correct Tabulator module installed?");
  }
}
class uu extends ye {
  constructor(e) {
    super(e), this.requestOrder = 0, this.loading = !1;
  }
  initialize() {
  }
  load(e, t, A, i, s, n) {
    var o = ++this.requestOrder;
    if (this.table.destroyed)
      return Promise.resolve();
    if (this.dispatchExternal("dataLoading", e), e && (e.indexOf("{") == 0 || e.indexOf("[") == 0) && (e = JSON.parse(e)), this.confirm("data-loading", [e, t, A, s])) {
      this.loading = !0, s || this.alertLoader(), t = this.chain("data-params", [e, A, s], t || {}, t || {}), t = this.mapParams(t, this.table.options.dataSendParams);
      var a = this.chain("data-load", [e, t, A, s], !1, Promise.resolve([]));
      return a.then((l) => {
        if (this.table.destroyed)
          console.warn("Data Load Response Blocked - Table has been destroyed");
        else {
          !Array.isArray(l) && typeof l == "object" && (l = this.mapParams(l, this.objectInvert(this.table.options.dataReceiveParams)));
          var h = this.chain("data-loaded", [l], null, l);
          o == this.requestOrder ? (this.clearAlert(), h !== !1 && (this.dispatchExternal("dataLoaded", h), this.table.rowManager.setData(h, i, typeof n > "u" ? !i : n))) : console.warn("Data Load Response Blocked - An active data load request was blocked by an attempt to change table data while the request was being made");
        }
      }).catch((l) => {
        console.error("Data Load Error: ", l), this.dispatchExternal("dataLoadError", l), s || this.alertError(), setTimeout(() => {
          this.clearAlert();
        }, this.table.options.dataLoaderErrorTimeout);
      }).finally(() => {
        this.loading = !1;
      });
    } else
      return this.dispatchExternal("dataLoaded", e), e || (e = []), this.table.rowManager.setData(e, i, typeof n > "u" ? !i : n), Promise.resolve();
  }
  mapParams(e, t) {
    var A = {};
    for (let i in e)
      A[t.hasOwnProperty(i) ? t[i] : i] = e[i];
    return A;
  }
  objectInvert(e) {
    var t = {};
    for (let A in e)
      t[e[A]] = A;
    return t;
  }
  blockActiveLoad() {
    this.requestOrder++;
  }
  alertLoader() {
    var e = typeof this.table.options.dataLoader == "function" ? this.table.options.dataLoader() : this.table.options.dataLoader;
    e && this.table.alertManager.alert(this.table.options.dataLoaderLoading || this.langText("data|loading"));
  }
  alertError() {
    this.table.alertManager.alert(this.table.options.dataLoaderError || this.langText("data|error"), "error");
  }
  clearAlert() {
    this.table.alertManager.clear();
  }
}
class cu {
  constructor(e, t, A) {
    this.table = e, this.events = {}, this.optionsList = t || {}, this.subscriptionNotifiers = {}, this.dispatch = A ? this._debugDispatch.bind(this) : this._dispatch.bind(this), this.debug = A;
  }
  subscriptionChange(e, t) {
    this.subscriptionNotifiers[e] || (this.subscriptionNotifiers[e] = []), this.subscriptionNotifiers[e].push(t), this.subscribed(e) && this._notifySubscriptionChange(e, !0);
  }
  subscribe(e, t) {
    this.events[e] || (this.events[e] = []), this.events[e].push(t), this._notifySubscriptionChange(e, !0);
  }
  unsubscribe(e, t) {
    var A;
    if (this.events[e])
      if (t)
        if (A = this.events[e].findIndex((i) => i === t), A > -1)
          this.events[e].splice(A, 1);
        else {
          console.warn("Cannot remove event, no matching event found:", e, t);
          return;
        }
      else
        delete this.events[e];
    else {
      console.warn("Cannot remove event, no events set on:", e);
      return;
    }
    this._notifySubscriptionChange(e, !1);
  }
  subscribed(e) {
    return this.events[e] && this.events[e].length;
  }
  _notifySubscriptionChange(e, t) {
    var A = this.subscriptionNotifiers[e];
    A && A.forEach((i) => {
      i(t);
    });
  }
  _dispatch() {
    var e = Array.from(arguments), t = e.shift(), A;
    return this.events[t] && this.events[t].forEach((i, s) => {
      let n = i.apply(this.table, e);
      s || (A = n);
    }), A;
  }
  _debugDispatch() {
    var e = Array.from(arguments), t = e[0];
    return e[0] = "ExternalEvent:" + e[0], (this.debug === !0 || this.debug.includes(t)) && console.log(...e), this._dispatch(...arguments);
  }
}
class du {
  constructor(e) {
    this.events = {}, this.subscriptionNotifiers = {}, this.dispatch = e ? this._debugDispatch.bind(this) : this._dispatch.bind(this), this.chain = e ? this._debugChain.bind(this) : this._chain.bind(this), this.confirm = e ? this._debugConfirm.bind(this) : this._confirm.bind(this), this.debug = e;
  }
  subscriptionChange(e, t) {
    this.subscriptionNotifiers[e] || (this.subscriptionNotifiers[e] = []), this.subscriptionNotifiers[e].push(t), this.subscribed(e) && this._notifySubscriptionChange(e, !0);
  }
  subscribe(e, t, A = 1e4) {
    this.events[e] || (this.events[e] = []), this.events[e].push({ callback: t, priority: A }), this.events[e].sort((i, s) => i.priority - s.priority), this._notifySubscriptionChange(e, !0);
  }
  unsubscribe(e, t) {
    var A;
    if (this.events[e]) {
      if (t)
        if (A = this.events[e].findIndex((i) => i.callback === t), A > -1)
          this.events[e].splice(A, 1);
        else {
          console.warn("Cannot remove event, no matching event found:", e, t);
          return;
        }
    } else {
      console.warn("Cannot remove event, no events set on:", e);
      return;
    }
    this._notifySubscriptionChange(e, !1);
  }
  subscribed(e) {
    return this.events[e] && this.events[e].length;
  }
  _chain(e, t, A, i) {
    var s = A;
    return Array.isArray(t) || (t = [t]), this.subscribed(e) ? (this.events[e].forEach((n, o) => {
      s = n.callback.apply(this, t.concat([s]));
    }), s) : typeof i == "function" ? i() : i;
  }
  _confirm(e, t) {
    var A = !1;
    return Array.isArray(t) || (t = [t]), this.subscribed(e) && this.events[e].forEach((i, s) => {
      i.callback.apply(this, t) && (A = !0);
    }), A;
  }
  _notifySubscriptionChange(e, t) {
    var A = this.subscriptionNotifiers[e];
    A && A.forEach((i) => {
      i(t);
    });
  }
  _dispatch() {
    var e = Array.from(arguments), t = e.shift();
    this.events[t] && this.events[t].forEach((A) => {
      A.callback.apply(this, e);
    });
  }
  _debugDispatch() {
    var e = Array.from(arguments), t = e[0];
    return e[0] = "InternalEvent:" + t, (this.debug === !0 || this.debug.includes(t)) && console.log(...e), this._dispatch(...arguments);
  }
  _debugChain() {
    var e = Array.from(arguments), t = e[0];
    return e[0] = "InternalEvent:" + t, (this.debug === !0 || this.debug.includes(t)) && console.log(...e), this._chain(...arguments);
  }
  _debugConfirm() {
    var e = Array.from(arguments), t = e[0];
    return e[0] = "InternalEvent:" + t, (this.debug === !0 || this.debug.includes(t)) && console.log(...e), this._confirm(...arguments);
  }
}
class fu extends ye {
  constructor(e) {
    super(e);
  }
  _warnUser() {
    this.options("debugDeprecation") && console.warn(...arguments);
  }
  check(e, t, A) {
    var i = "";
    return typeof this.options(e) < "u" ? (i = "Deprecated Setup Option - Use of the %c" + e + "%c option is now deprecated", t ? (i = i + ", Please use the %c" + t + "%c option instead", this._warnUser(i, "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;"), A && (this.table.options[t] = this.table.options[e])) : this._warnUser(i, "font-weight: bold;", "font-weight: normal;"), !1) : !0;
  }
  checkMsg(e, t) {
    return typeof this.options(e) < "u" ? (this._warnUser("%cDeprecated Setup Option - Use of the %c" + e + " %c option is now deprecated, " + t, "font-weight: normal;", "font-weight: bold;", "font-weight: normal;"), !1) : !0;
  }
  msg(e) {
    this._warnUser(e);
  }
}
class gu extends ye {
  constructor(e) {
    super(e), this.deps = {}, this.props = {};
  }
  initialize() {
    this.deps = Object.assign({}, this.options("dependencies"));
  }
  lookup(e, t, A) {
    if (Array.isArray(e)) {
      for (const s of e) {
        var i = this.lookup(s, t, !0);
        if (i)
          break;
      }
      if (i)
        return i;
      this.error(e);
    } else
      return t ? this.lookupProp(e, t, A) : this.lookupKey(e, A);
  }
  lookupProp(e, t, A) {
    var i;
    if (this.props[e] && this.props[e][t])
      return this.props[e][t];
    if (i = this.lookupKey(e, A), i)
      return this.props[e] || (this.props[e] = {}), this.props[e][t] = i[t] || i, this.props[e][t];
  }
  lookupKey(e, t) {
    var A;
    return this.deps[e] ? A = this.deps[e] : window[e] ? (this.deps[e] = window[e], A = this.deps[e]) : t || this.error(e), A;
  }
  error(e) {
    console.error("Unable to find dependency", e, "Please check documentation and ensure you have imported the required library into your project");
  }
}
function pu(r, e) {
  e && this.table.columnManager.renderer.reinitializeColumnWidths(r), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function Wr(r, e) {
  r.forEach(function(t) {
    t.reinitializeWidth();
  }), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function mu(r, e) {
  var t = 0, A = this.table.rowManager.element.clientWidth, i = 0, s = !1;
  r.forEach((n, o) => {
    n.widthFixed || n.reinitializeWidth(), (this.table.options.responsiveLayout ? n.modules.responsive.visible : n.visible) && (s = n), n.visible && (t += n.getWidth());
  }), s ? (i = A - t + s.getWidth(), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && (s.setWidth(0), this.table.modules.responsiveLayout.update()), i > 0 ? s.setWidth(i) : s.reinitializeWidth()) : this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function wu(r, e) {
  var t = this.table.rowManager.element.getBoundingClientRect().width, A = 0, i = 0, s = 0, n = 0, o = [], a = [], l = 0, h = 0, u = 0;
  function c(w) {
    var b;
    return typeof w == "string" ? w.indexOf("%") > -1 ? b = t / 100 * parseInt(w) : b = parseInt(w) : b = w, b;
  }
  function f(w, b, v, B) {
    var y = [], D = 0, L = 0, R = 0, Q = s, W = 0, K = 0, P = [];
    function oe(N) {
      return v * (N.column.definition.widthGrow || 1);
    }
    function S(N) {
      return c(N.width) - v * (N.column.definition.widthShrink || 0);
    }
    return w.forEach(function(N, q) {
      var J = B ? S(N) : oe(N);
      N.column.minWidth >= J ? y.push(N) : N.column.maxWidth && N.column.maxWidth < J ? (N.width = N.column.maxWidth, b -= N.column.maxWidth, Q -= B ? N.column.definition.widthShrink || 1 : N.column.definition.widthGrow || 1, Q && (v = Math.floor(b / Q))) : (P.push(N), K += B ? N.column.definition.widthShrink || 1 : N.column.definition.widthGrow || 1);
    }), y.length ? (y.forEach(function(N) {
      D += B ? N.width - N.column.minWidth : N.column.minWidth, N.width = N.column.minWidth;
    }), L = b - D, R = K ? Math.floor(L / K) : L, W = f(P, L, R, B)) : (W = K ? b - Math.floor(b / K) * K : b, P.forEach(function(N) {
      N.width = B ? S(N) : oe(N);
    })), W;
  }
  this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update(), this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight && (t -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth), r.forEach(function(w) {
    var b, v, B;
    w.visible && (b = w.definition.width, v = parseInt(w.minWidth), b ? (B = c(b), A += B > v ? B : v, w.definition.widthShrink && (a.push({
      column: w,
      width: B > v ? B : v
    }), l += w.definition.widthShrink)) : (o.push({
      column: w,
      width: 0
    }), s += w.definition.widthGrow || 1));
  }), i = t - A, n = Math.floor(i / s), u = f(o, i, n, !1), o.length && u > 0 && (o[o.length - 1].width += u), o.forEach(function(w) {
    i -= w.width;
  }), h = Math.abs(u) + i, h > 0 && l && (u = f(a, h, Math.floor(h / l), !0)), u && a.length && (a[a.length - 1].width -= u), o.forEach(function(w) {
    w.column.setWidth(w.width);
  }), a.forEach(function(w) {
    w.column.setWidth(w.width);
  });
}
var bu = {
  fitData: pu,
  fitDataFill: Wr,
  fitDataTable: Wr,
  fitDataStretch: mu,
  fitColumns: wu
};
const AA = class AA extends Y {
  constructor(e) {
    super(e, "layout"), this.mode = null, this.registerTableOption("layout", "fitData"), this.registerTableOption("layoutColumnsOnNewData", !1), this.registerColumnOption("widthGrow"), this.registerColumnOption("widthShrink");
  }
  //initialize layout system
  initialize() {
    var e = this.table.options.layout;
    AA.modes[e] ? this.mode = e : (console.warn("Layout Error - invalid mode set, defaulting to 'fitData' : " + e), this.mode = "fitData"), this.table.element.setAttribute("tabulator-layout", this.mode), this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  initializeColumn(e) {
    e.definition.widthGrow && (e.definition.widthGrow = Number(e.definition.widthGrow)), e.definition.widthShrink && (e.definition.widthShrink = Number(e.definition.widthShrink));
  }
  getMode() {
    return this.mode;
  }
  //trigger table layout
  layout(e) {
    var t = this.table.columnManager.columnsByIndex.find((A) => A.definition.variableHeight || A.definition.formatter === "textarea");
    this.dispatch("layout-refreshing"), AA.modes[this.mode].call(this, this.table.columnManager.columnsByIndex, e), t && this.table.rowManager.normalizeHeight(!0), this.dispatch("layout-refreshed");
  }
};
U(AA, "moduleName", "layout"), //load defaults
U(AA, "modes", bu);
let $s = AA;
var Bu = {
  default: {
    //hold default locale text
    groups: {
      item: "item",
      items: "items"
    },
    columns: {},
    data: {
      loading: "Loading",
      error: "Error"
    },
    pagination: {
      page_size: "Page Size",
      page_title: "Show Page",
      first: "First",
      first_title: "First Page",
      last: "Last",
      last_title: "Last Page",
      prev: "Prev",
      prev_title: "Prev Page",
      next: "Next",
      next_title: "Next Page",
      all: "All",
      counter: {
        showing: "Showing",
        of: "of",
        rows: "rows",
        pages: "pages"
      }
    },
    headerFilters: {
      default: "filter column...",
      columns: {}
    }
  }
};
const DA = class DA extends Y {
  constructor(e) {
    super(e), this.locale = "default", this.lang = !1, this.bindings = {}, this.langList = {}, this.registerTableOption("locale", !1), this.registerTableOption("langs", {});
  }
  initialize() {
    this.langList = ie.deepClone(DA.langs), this.table.options.columnDefaults.headerFilterPlaceholder !== !1 && this.setHeaderFilterPlaceholder(this.table.options.columnDefaults.headerFilterPlaceholder);
    for (let e in this.table.options.langs)
      this.installLang(e, this.table.options.langs[e]);
    this.setLocale(this.table.options.locale), this.registerTableFunction("setLocale", this.setLocale.bind(this)), this.registerTableFunction("getLocale", this.getLocale.bind(this)), this.registerTableFunction("getLang", this.getLang.bind(this));
  }
  //set header placeholder
  setHeaderFilterPlaceholder(e) {
    this.langList.default.headerFilters.default = e;
  }
  //setup a lang description object
  installLang(e, t) {
    this.langList[e] ? this._setLangProp(this.langList[e], t) : this.langList[e] = t;
  }
  _setLangProp(e, t) {
    for (let A in t)
      e[A] && typeof e[A] == "object" ? this._setLangProp(e[A], t[A]) : e[A] = t[A];
  }
  //set current locale
  setLocale(e) {
    e = e || "default";
    function t(A, i) {
      for (var s in A)
        typeof A[s] == "object" ? (i[s] || (i[s] = {}), t(A[s], i[s])) : i[s] = A[s];
    }
    if (e === !0 && navigator.language && (e = navigator.language.toLowerCase()), e && !this.langList[e]) {
      let A = e.split("-")[0];
      this.langList[A] ? (console.warn("Localization Error - Exact matching locale not found, using closest match: ", e, A), e = A) : (console.warn("Localization Error - Matching locale not found, using default: ", e), e = "default");
    }
    this.locale = e, this.lang = ie.deepClone(this.langList.default || {}), e != "default" && t(this.langList[e], this.lang), this.dispatchExternal("localized", this.locale, this.lang), this._executeBindings();
  }
  //get current locale
  getLocale(e) {
    return this.locale;
  }
  //get lang object for given local or current if none provided
  getLang(e) {
    return e ? this.langList[e] : this.lang;
  }
  //get text for current locale
  getText(e, t) {
    var A = t ? e + "|" + t : e, i = A.split("|"), s = this._getLangElement(i, this.locale);
    return s || "";
  }
  //traverse langs object and find localized copy
  _getLangElement(e, t) {
    var A = this.lang;
    return e.forEach(function(i) {
      var s;
      A && (s = A[i], typeof s < "u" ? A = s : A = !1);
    }), A;
  }
  //set update binding
  bind(e, t) {
    this.bindings[e] || (this.bindings[e] = []), this.bindings[e].push(t), t(this.getText(e), this.lang);
  }
  //iterate through bindings and trigger updates
  _executeBindings() {
    for (let e in this.bindings)
      this.bindings[e].forEach((t) => {
        t(this.getText(e), this.lang);
      });
  }
};
U(DA, "moduleName", "localize"), //load defaults
U(DA, "langs", Bu);
let qs = DA;
class mo extends Y {
  constructor(e) {
    super(e);
  }
  initialize() {
    this.registerTableFunction("tableComms", this.receive.bind(this));
  }
  getConnections(e) {
    var t = [], A;
    return A = this.table.constructor.registry.lookupTable(e), A.forEach((i) => {
      this.table !== i && t.push(i);
    }), t;
  }
  send(e, t, A, i) {
    var s = this.getConnections(e);
    s.forEach((n) => {
      n.tableComms(this.table.element, t, A, i);
    }), !s.length && e && console.warn("Table Connection Error - No tables matching selector found", e);
  }
  receive(e, t, A, i) {
    if (this.table.modExists(t))
      return this.table.modules[t].commsReceived(e, A, i);
    console.warn("Inter-table Comms Error - no such module:", t);
  }
}
U(mo, "moduleName", "comms");
var Cu = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CommsModule: mo,
  LayoutModule: $s,
  LocalizeModule: qs
});
const ke = class ke {
  static findTable(e) {
    var t = ke.registry.lookupTable(e, !0);
    return Array.isArray(t) && !t.length ? !1 : t;
  }
};
U(ke, "registry", {
  tables: [],
  register(e) {
    ke.registry.tables.push(e);
  },
  deregister(e) {
    var t = ke.registry.tables.indexOf(e);
    t > -1 && ke.registry.tables.splice(t, 1);
  },
  lookupTable(e, t) {
    var A = [], i, s;
    if (typeof e == "string") {
      if (i = document.querySelectorAll(e), i.length)
        for (var n = 0; n < i.length; n++)
          s = ke.registry.matchElement(i[n]), s && A.push(s);
    } else typeof HTMLElement < "u" && e instanceof HTMLElement || e instanceof ke ? (s = ke.registry.matchElement(e), s && A.push(s)) : Array.isArray(e) ? e.forEach(function(o) {
      A = A.concat(ke.registry.lookupTable(o));
    }) : t || console.warn("Table Connection Error - Invalid Selector", e);
    return A;
  },
  matchElement(e) {
    return ke.registry.tables.find(function(t) {
      return e instanceof ke ? t === e : t.element === e;
    });
  }
});
let er = ke;
const te = class te extends er {
  constructor() {
    super();
  }
  static initializeModuleBinder(e) {
    te.modulesRegistered || (te.modulesRegistered = !0, te._registerModules(Cu, !0), e && te._registerModules(e));
  }
  static _extendModule(e, t, A) {
    if (te.moduleBindings[e]) {
      var i = te.moduleBindings[e][t];
      if (i)
        if (typeof A == "object")
          for (let s in A)
            i[s] = A[s];
        else
          console.warn("Module Error - Invalid value type, it must be an object");
      else
        console.warn("Module Error - property does not exist:", t);
    } else
      console.warn("Module Error - module does not exist:", e);
  }
  static _registerModules(e, t) {
    var A = Object.values(e);
    t && A.forEach((i) => {
      i.prototype.moduleCore = !0;
    }), te._registerModule(A);
  }
  static _registerModule(e) {
    Array.isArray(e) || (e = [e]), e.forEach((t) => {
      te._registerModuleBinding(t), te._registerModuleExtensions(t);
    });
  }
  static _registerModuleBinding(e) {
    e.moduleName ? te.moduleBindings[e.moduleName] = e : console.error("Unable to bind module, no moduleName defined", e.moduleName);
  }
  static _registerModuleExtensions(e) {
    var t = e.moduleExtensions;
    if (e.moduleExtensions)
      for (let A in t) {
        let i = t[A];
        if (te.moduleBindings[A])
          for (let s in i)
            te._extendModule(A, s, i[s]);
        else {
          te.moduleExtensions[A] || (te.moduleExtensions[A] = {});
          for (let s in i)
            te.moduleExtensions[A][s] || (te.moduleExtensions[A][s] = {}), Object.assign(te.moduleExtensions[A][s], i[s]);
        }
      }
    te._extendModuleFromQueue(e);
  }
  static _extendModuleFromQueue(e) {
    var t = te.moduleExtensions[e.moduleName];
    if (t)
      for (let A in t)
        te._extendModule(e.moduleName, A, t[A]);
  }
  //ensure that module are bound to instantiated function
  _bindModules() {
    var e = [], t = [], A = [];
    this.modules = {};
    for (var i in te.moduleBindings) {
      let s = te.moduleBindings[i], n = new s(this);
      this.modules[i] = n, s.prototype.moduleCore ? this.modulesCore.push(n) : s.moduleInitOrder ? s.moduleInitOrder < 0 ? e.push(n) : t.push(n) : A.push(n);
    }
    e.sort((s, n) => s.moduleInitOrder > n.moduleInitOrder ? 1 : -1), t.sort((s, n) => s.moduleInitOrder > n.moduleInitOrder ? 1 : -1), this.modulesRegular = e.concat(A.concat(t));
  }
};
U(te, "moduleBindings", {}), U(te, "moduleExtensions", {}), U(te, "modulesRegistered", !1), U(te, "defaultModules", !1);
let tr = te;
class vu extends ye {
  constructor(e) {
    super(e), this.element = this._createAlertElement(), this.msgElement = this._createMsgElement(), this.type = null, this.element.appendChild(this.msgElement);
  }
  _createAlertElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-alert"), e;
  }
  _createMsgElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-alert-msg"), e.setAttribute("role", "alert"), e;
  }
  _typeClass() {
    return "tabulator-alert-state-" + this.type;
  }
  alert(e, t = "msg") {
    if (e) {
      for (this.clear(), this.dispatch("alert-show", t), this.type = t; this.msgElement.firstChild; ) this.msgElement.removeChild(this.msgElement.firstChild);
      this.msgElement.classList.add(this._typeClass()), typeof e == "function" && (e = e()), e instanceof HTMLElement ? this.msgElement.appendChild(e) : this.msgElement.innerHTML = e, this.table.element.appendChild(this.element);
    }
  }
  clear() {
    this.dispatch("alert-hide", this.type), this.element.parentNode && this.element.parentNode.removeChild(this.element), this.msgElement.classList.remove(this._typeClass());
  }
}
const rt = class rt extends tr {
  static extendModule() {
    rt.initializeModuleBinder(), rt._extendModule(...arguments);
  }
  static registerModule() {
    rt.initializeModuleBinder(), rt._registerModule(...arguments);
  }
  constructor(e, t, A) {
    super(), rt.initializeModuleBinder(A), this.options = {}, this.columnManager = null, this.rowManager = null, this.footerManager = null, this.alertManager = null, this.vdomHoz = null, this.externalEvents = null, this.eventBus = null, this.interactionMonitor = !1, this.browser = "", this.browserSlow = !1, this.browserMobile = !1, this.rtl = !1, this.originalElement = null, this.componentFunctionBinder = new hu(this), this.dataLoader = !1, this.modules = {}, this.modulesCore = [], this.modulesRegular = [], this.deprecationAdvisor = new fu(this), this.optionsList = new po(this, "table constructor"), this.dependencyRegistry = new gu(this), this.initialized = !1, this.destroyed = !1, this.initializeElement(e) && (this.initializeCoreSystems(t), setTimeout(() => {
      this._create();
    })), this.constructor.registry.register(this);
  }
  initializeElement(e) {
    return typeof HTMLElement < "u" && e instanceof HTMLElement ? (this.element = e, !0) : typeof e == "string" ? (this.element = document.querySelector(e), this.element ? !0 : (console.error("Tabulator Creation Error - no element found matching selector: ", e), !1)) : (console.error("Tabulator Creation Error - Invalid element provided:", e), !1);
  }
  initializeCoreSystems(e) {
    this.columnManager = new su(this), this.rowManager = new ou(this), this.footerManager = new au(this), this.dataLoader = new uu(this), this.alertManager = new vu(this), this._bindModules(), this.options = this.optionsList.generate(rt.defaultOptions, e), this._clearObjectPointers(), this._mapDeprecatedFunctionality(), this.externalEvents = new cu(this, this.options, this.options.debugEventsExternal), this.eventBus = new du(this.options.debugEventsInternal), this.interactionMonitor = new lu(this), this.dataLoader.initialize(), this.footerManager.initialize(), this.dependencyRegistry.initialize();
  }
  //convert deprecated functionality to new functions
  _mapDeprecatedFunctionality() {
  }
  _clearSelection() {
    this.element.classList.add("tabulator-block-select"), window.getSelection ? window.getSelection().empty ? window.getSelection().empty() : window.getSelection().removeAllRanges && window.getSelection().removeAllRanges() : document.selection && document.selection.empty(), this.element.classList.remove("tabulator-block-select");
  }
  //create table
  _create() {
    this.externalEvents.dispatch("tableBuilding"), this.eventBus.dispatch("table-building"), this._rtlCheck(), this._buildElement(), this._initializeTable(), this.initialized = !0, this._loadInitialData().finally(() => {
      this.eventBus.dispatch("table-initialized"), this.externalEvents.dispatch("tableBuilt");
    });
  }
  _rtlCheck() {
    var e = window.getComputedStyle(this.element);
    switch (this.options.textDirection) {
      case "auto":
        if (e.direction !== "rtl")
          break;
      case "rtl":
        this.element.classList.add("tabulator-rtl"), this.rtl = !0;
        break;
      case "ltr":
        this.element.classList.add("tabulator-ltr");
      default:
        this.rtl = !1;
    }
  }
  //clear pointers to objects in default config object
  _clearObjectPointers() {
    this.options.columns = this.options.columns.slice(0), Array.isArray(this.options.data) && !this.options.reactiveData && (this.options.data = this.options.data.slice(0));
  }
  //build tabulator element
  _buildElement() {
    var e = this.element, t = this.options, A;
    if (e.tagName === "TABLE") {
      this.originalElement = this.element, A = document.createElement("div");
      var i = e.attributes;
      for (var s in i)
        typeof i[s] == "object" && A.setAttribute(i[s].name, i[s].value);
      e.parentNode.replaceChild(A, e), this.element = e = A;
    }
    for (e.classList.add("tabulator"), e.setAttribute("role", "grid"); e.firstChild; ) e.removeChild(e.firstChild);
    t.height && (t.height = isNaN(t.height) ? t.height : t.height + "px", e.style.height = t.height), t.minHeight !== !1 && (t.minHeight = isNaN(t.minHeight) ? t.minHeight : t.minHeight + "px", e.style.minHeight = t.minHeight), t.maxHeight !== !1 && (t.maxHeight = isNaN(t.maxHeight) ? t.maxHeight : t.maxHeight + "px", e.style.maxHeight = t.maxHeight);
  }
  //initialize core systems and modules
  _initializeTable() {
    var e = this.element, t = this.options;
    this.interactionMonitor.initialize(), this.columnManager.initialize(), this.rowManager.initialize(), this._detectBrowser(), this.modulesCore.forEach((A) => {
      A.initialize();
    }), e.appendChild(this.columnManager.getElement()), e.appendChild(this.rowManager.getElement()), t.footerElement && this.footerManager.activate(), t.autoColumns && t.data && this.columnManager.generateColumnsFromRowData(this.options.data), this.modulesRegular.forEach((A) => {
      A.initialize();
    }), this.columnManager.setColumns(t.columns), this.eventBus.dispatch("table-built");
  }
  _loadInitialData() {
    return this.dataLoader.load(this.options.data).finally(() => {
      this.columnManager.verticalAlignHeaders();
    });
  }
  //deconstructor
  destroy() {
    var e = this.element;
    for (this.destroyed = !0, this.constructor.registry.deregister(this), this.eventBus.dispatch("table-destroy"), this.rowManager.destroy(); e.firstChild; ) e.removeChild(e.firstChild);
    e.classList.remove("tabulator"), this.externalEvents.dispatch("tableDestroyed");
  }
  _detectBrowser() {
    var e = navigator.userAgent || navigator.vendor || window.opera;
    e.indexOf("Trident") > -1 ? (this.browser = "ie", this.browserSlow = !0) : e.indexOf("Edge") > -1 ? (this.browser = "edge", this.browserSlow = !0) : e.indexOf("Firefox") > -1 ? (this.browser = "firefox", this.browserSlow = !1) : e.indexOf("Mac OS") > -1 ? (this.browser = "safari", this.browserSlow = !1) : (this.browser = "other", this.browserSlow = !1), this.browserMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(e.slice(0, 4));
  }
  initGuard(e, t) {
    var A, i;
    return this.options.debugInitialization && !this.initialized && (e || (A = new Error().stack.split(`
`), i = A[0] == "Error" ? A[2] : A[1], i[0] == " " ? e = i.trim().split(" ")[1].split(".")[1] : e = i.trim().split("@")[0]), console.warn("Table Not Initialized - Calling the " + e + " function before the table is initialized may result in inconsistent behavior, Please wait for the `tableBuilt` event before calling this function." + (t ? " " + t : ""))), this.initialized;
  }
  ////////////////// Data Handling //////////////////
  //block table redrawing
  blockRedraw() {
    this.initGuard(), this.eventBus.dispatch("redraw-blocking"), this.rowManager.blockRedraw(), this.columnManager.blockRedraw(), this.eventBus.dispatch("redraw-blocked");
  }
  //restore table redrawing
  restoreRedraw() {
    this.initGuard(), this.eventBus.dispatch("redraw-restoring"), this.rowManager.restoreRedraw(), this.columnManager.restoreRedraw(), this.eventBus.dispatch("redraw-restored");
  }
  //load data
  setData(e, t, A) {
    return this.initGuard(!1, "To set initial data please use the 'data' property in the table constructor."), this.dataLoader.load(e, t, A, !1);
  }
  //clear data
  clearData() {
    this.initGuard(), this.dataLoader.blockActiveLoad(), this.rowManager.clearData();
  }
  //get table data array
  getData(e) {
    return this.rowManager.getData(e);
  }
  //get table data array count
  getDataCount(e) {
    return this.rowManager.getDataCount(e);
  }
  //replace data, keeping table in position with same sort
  replaceData(e, t, A) {
    return this.initGuard(), this.dataLoader.load(e, t, A, !0, !0);
  }
  //update table data
  updateData(e) {
    var t = 0;
    return this.initGuard(), new Promise((A, i) => {
      this.dataLoader.blockActiveLoad(), typeof e == "string" && (e = JSON.parse(e)), e && e.length > 0 ? e.forEach((s) => {
        var n = this.rowManager.findRow(s[this.options.index]);
        n ? (t++, n.updateData(s).then(() => {
          t--, t || A();
        }).catch((o) => {
          i("Update Error - Unable to update row", s, o);
        })) : i("Update Error - Unable to find row", s);
      }) : (console.warn("Update Error - No data provided"), i("Update Error - No data provided"));
    });
  }
  addData(e, t, A) {
    return this.initGuard(), new Promise((i, s) => {
      this.dataLoader.blockActiveLoad(), typeof e == "string" && (e = JSON.parse(e)), e ? this.rowManager.addRows(e, t, A).then((n) => {
        var o = [];
        n.forEach(function(a) {
          o.push(a.getComponent());
        }), i(o);
      }) : (console.warn("Update Error - No data provided"), s("Update Error - No data provided"));
    });
  }
  //update table data
  updateOrAddData(e) {
    var t = [], A = 0;
    return this.initGuard(), new Promise((i, s) => {
      this.dataLoader.blockActiveLoad(), typeof e == "string" && (e = JSON.parse(e)), e && e.length > 0 ? e.forEach((n) => {
        var o = this.rowManager.findRow(n[this.options.index]);
        A++, o ? o.updateData(n).then(() => {
          A--, t.push(o.getComponent()), A || i(t);
        }) : this.rowManager.addRows(n).then((a) => {
          A--, t.push(a[0].getComponent()), A || i(t);
        });
      }) : (console.warn("Update Error - No data provided"), s("Update Error - No data provided"));
    });
  }
  //get row object
  getRow(e) {
    var t = this.rowManager.findRow(e);
    return t ? t.getComponent() : (console.warn("Find Error - No matching row found:", e), !1);
  }
  //get row object
  getRowFromPosition(e) {
    var t = this.rowManager.getRowFromPosition(e);
    return t ? t.getComponent() : (console.warn("Find Error - No matching row found:", e), !1);
  }
  //delete row from table
  deleteRow(e) {
    var t = [];
    this.initGuard(), Array.isArray(e) || (e = [e]);
    for (let A of e) {
      let i = this.rowManager.findRow(A, !0);
      if (i)
        t.push(i);
      else
        return console.error("Delete Error - No matching row found:", A), Promise.reject("Delete Error - No matching row found");
    }
    return t.sort((A, i) => this.rowManager.rows.indexOf(A) > this.rowManager.rows.indexOf(i) ? 1 : -1), t.forEach((A) => {
      A.delete();
    }), this.rowManager.reRenderInPosition(), Promise.resolve();
  }
  //add row to table
  addRow(e, t, A) {
    return this.initGuard(), typeof e == "string" && (e = JSON.parse(e)), this.rowManager.addRows(e, t, A, !0).then((i) => i[0].getComponent());
  }
  //update a row if it exists otherwise create it
  updateOrAddRow(e, t) {
    var A = this.rowManager.findRow(e);
    return this.initGuard(), typeof t == "string" && (t = JSON.parse(t)), A ? A.updateData(t).then(() => A.getComponent()) : this.rowManager.addRows(t).then((i) => i[0].getComponent());
  }
  //update row data
  updateRow(e, t) {
    var A = this.rowManager.findRow(e);
    return this.initGuard(), typeof t == "string" && (t = JSON.parse(t)), A ? A.updateData(t).then(() => Promise.resolve(A.getComponent())) : (console.warn("Update Error - No matching row found:", e), Promise.reject("Update Error - No matching row found"));
  }
  //scroll to row in DOM
  scrollToRow(e, t, A) {
    var i = this.rowManager.findRow(e);
    return i ? this.rowManager.scrollToRow(i, t, A) : (console.warn("Scroll Error - No matching row found:", e), Promise.reject("Scroll Error - No matching row found"));
  }
  moveRow(e, t, A) {
    var i = this.rowManager.findRow(e);
    this.initGuard(), i ? i.moveToRow(t, A) : console.warn("Move Error - No matching row found:", e);
  }
  getRows(e) {
    return this.rowManager.getComponents(e);
  }
  //get position of row in table
  getRowPosition(e) {
    var t = this.rowManager.findRow(e);
    return t ? t.getPosition() : (console.warn("Position Error - No matching row found:", e), !1);
  }
  /////////////// Column Functions  ///////////////
  setColumns(e) {
    this.initGuard(!1, "To set initial columns please use the 'columns' property in the table constructor"), this.columnManager.setColumns(e);
  }
  getColumns(e) {
    return this.columnManager.getComponents(e);
  }
  getColumn(e) {
    var t = this.columnManager.findColumn(e);
    return t ? t.getComponent() : (console.warn("Find Error - No matching column found:", e), !1);
  }
  getColumnDefinitions() {
    return this.columnManager.getDefinitionTree();
  }
  showColumn(e) {
    var t = this.columnManager.findColumn(e);
    if (this.initGuard(), t)
      t.show();
    else
      return console.warn("Column Show Error - No matching column found:", e), !1;
  }
  hideColumn(e) {
    var t = this.columnManager.findColumn(e);
    if (this.initGuard(), t)
      t.hide();
    else
      return console.warn("Column Hide Error - No matching column found:", e), !1;
  }
  toggleColumn(e) {
    var t = this.columnManager.findColumn(e);
    if (this.initGuard(), t)
      t.visible ? t.hide() : t.show();
    else
      return console.warn("Column Visibility Toggle Error - No matching column found:", e), !1;
  }
  addColumn(e, t, A) {
    var i = this.columnManager.findColumn(A);
    return this.initGuard(), this.columnManager.addColumn(e, t, i).then((s) => s.getComponent());
  }
  deleteColumn(e) {
    var t = this.columnManager.findColumn(e);
    return this.initGuard(), t ? t.delete() : (console.warn("Column Delete Error - No matching column found:", e), Promise.reject());
  }
  updateColumnDefinition(e, t) {
    var A = this.columnManager.findColumn(e);
    return this.initGuard(), A ? A.updateDefinition(t) : (console.warn("Column Update Error - No matching column found:", e), Promise.reject());
  }
  moveColumn(e, t, A) {
    var i = this.columnManager.findColumn(e), s = this.columnManager.findColumn(t);
    this.initGuard(), i ? s ? this.columnManager.moveColumn(i, s, A) : console.warn("Move Error - No matching column found:", s) : console.warn("Move Error - No matching column found:", e);
  }
  //scroll to column in DOM
  scrollToColumn(e, t, A) {
    return new Promise((i, s) => {
      var n = this.columnManager.findColumn(e);
      return n ? this.columnManager.scrollToColumn(n, t, A) : (console.warn("Scroll Error - No matching column found:", e), Promise.reject("Scroll Error - No matching column found"));
    });
  }
  //////////// General Public Functions ////////////
  //redraw list without updating data
  redraw(e) {
    this.initGuard(), this.columnManager.redraw(e), this.rowManager.redraw(e);
  }
  setHeight(e) {
    this.options.height = isNaN(e) ? e : e + "px", this.element.style.height = this.options.height, this.rowManager.initializeRenderer(), this.rowManager.redraw(!0);
  }
  //////////////////// Event Bus ///////////////////
  on(e, t) {
    this.externalEvents.subscribe(e, t);
  }
  off(e, t) {
    this.externalEvents.unsubscribe(e, t);
  }
  dispatchEvent() {
    var e = Array.from(arguments);
    e.shift(), this.externalEvents.dispatch(...arguments);
  }
  //////////////////// Alerts ///////////////////
  alert(e, t) {
    this.initGuard(), this.alertManager.alert(e, t);
  }
  clearAlert() {
    this.initGuard(), this.alertManager.clear();
  }
  ////////////// Extension Management //////////////
  modExists(e, t) {
    return this.modules[e] ? !0 : (t && console.error("Tabulator Module Not Installed: " + e), !1);
  }
  module(e) {
    var t = this.modules[e];
    return t || console.error("Tabulator module not installed: " + e), t;
  }
};
//default setup options
U(rt, "defaultOptions", tu);
let Ar = rt;
var fA = Ar;
class Eu extends fA {
  static extendModule() {
    fA.initializeModuleBinder(as), fA._extendModule(...arguments);
  }
  static registerModule() {
    fA.initializeModuleBinder(as), fA._registerModule(...arguments);
  }
  constructor(e, t, A) {
    super(e, t, as);
  }
}
var yu = Eu;
/*!
 * html2canvas 1.4.1 <https://html2canvas.hertzen.com>
 * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
/*! *****************************************************************************
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
var ir = function(r, e) {
  return ir = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, A) {
    t.__proto__ = A;
  } || function(t, A) {
    for (var i in A) Object.prototype.hasOwnProperty.call(A, i) && (t[i] = A[i]);
  }, ir(r, e);
};
function je(r, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  ir(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var sr = function() {
  return sr = Object.assign || function(e) {
    for (var t, A = 1, i = arguments.length; A < i; A++) {
      t = arguments[A];
      for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
    }
    return e;
  }, sr.apply(this, arguments);
};
function Te(r, e, t, A) {
  function i(s) {
    return s instanceof t ? s : new t(function(n) {
      n(s);
    });
  }
  return new (t || (t = Promise))(function(s, n) {
    function o(h) {
      try {
        l(A.next(h));
      } catch (u) {
        n(u);
      }
    }
    function a(h) {
      try {
        l(A.throw(h));
      } catch (u) {
        n(u);
      }
    }
    function l(h) {
      h.done ? s(h.value) : i(h.value).then(o, a);
    }
    l((A = A.apply(r, [])).next());
  });
}
function Ue(r, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, A, i, s, n;
  return n = { next: o(0), throw: o(1), return: o(2) }, typeof Symbol == "function" && (n[Symbol.iterator] = function() {
    return this;
  }), n;
  function o(l) {
    return function(h) {
      return a([l, h]);
    };
  }
  function a(l) {
    if (A) throw new TypeError("Generator is already executing.");
    for (; t; ) try {
      if (A = 1, i && (s = l[0] & 2 ? i.return : l[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, l[1])).done) return s;
      switch (i = 0, s && (l = [l[0] & 2, s.value]), l[0]) {
        case 0:
        case 1:
          s = l;
          break;
        case 4:
          return t.label++, { value: l[1], done: !1 };
        case 5:
          t.label++, i = l[1], l = [0];
          continue;
        case 7:
          l = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (l[0] === 6 || l[0] === 2)) {
            t = 0;
            continue;
          }
          if (l[0] === 3 && (!s || l[1] > s[0] && l[1] < s[3])) {
            t.label = l[1];
            break;
          }
          if (l[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = l;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(l);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      l = e.call(r, t);
    } catch (h) {
      l = [6, h], i = 0;
    } finally {
      A = s = 0;
    }
    if (l[0] & 5) throw l[1];
    return { value: l[0] ? l[1] : void 0, done: !0 };
  }
}
function ZA(r, e, t) {
  if (arguments.length === 2) for (var A = 0, i = e.length, s; A < i; A++)
    (s || !(A in e)) && (s || (s = Array.prototype.slice.call(e, 0, A)), s[A] = e[A]);
  return r.concat(s || e);
}
var ot = (
  /** @class */
  function() {
    function r(e, t, A, i) {
      this.left = e, this.top = t, this.width = A, this.height = i;
    }
    return r.prototype.add = function(e, t, A, i) {
      return new r(this.left + e, this.top + t, this.width + A, this.height + i);
    }, r.fromClientRect = function(e, t) {
      return new r(t.left + e.windowBounds.left, t.top + e.windowBounds.top, t.width, t.height);
    }, r.fromDOMRectList = function(e, t) {
      var A = Array.from(t).find(function(i) {
        return i.width !== 0;
      });
      return A ? new r(A.left + e.windowBounds.left, A.top + e.windowBounds.top, A.width, A.height) : r.EMPTY;
    }, r.EMPTY = new r(0, 0, 0, 0), r;
  }()
), _i = function(r, e) {
  return ot.fromClientRect(r, e.getBoundingClientRect());
}, Fu = function(r) {
  var e = r.body, t = r.documentElement;
  if (!e || !t)
    throw new Error("Unable to get document size");
  var A = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.offsetWidth, t.offsetWidth), Math.max(e.clientWidth, t.clientWidth)), i = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.offsetHeight, t.offsetHeight), Math.max(e.clientHeight, t.clientHeight));
  return new ot(0, 0, A, i);
}, Oi = function(r) {
  for (var e = [], t = 0, A = r.length; t < A; ) {
    var i = r.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < A) {
      var s = r.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, fe = function() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, r);
  var t = r.length;
  if (!t)
    return "";
  for (var A = [], i = -1, s = ""; ++i < t; ) {
    var n = r[i];
    n <= 65535 ? A.push(n) : (n -= 65536, A.push((n >> 10) + 55296, n % 1024 + 56320)), (i + 1 === t || A.length > 16384) && (s += String.fromCharCode.apply(String, A), A.length = 0);
  }
  return s;
}, Xr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Qu = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var $A = 0; $A < Xr.length; $A++)
  Qu[Xr.charCodeAt($A)] = $A;
var Jr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bA = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var qA = 0; qA < Jr.length; qA++)
  bA[Jr.charCodeAt(qA)] = qA;
var Uu = function(r) {
  var e = r.length * 0.75, t = r.length, A, i = 0, s, n, o, a;
  r[r.length - 1] === "=" && (e--, r[r.length - 2] === "=" && e--);
  var l = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), h = Array.isArray(l) ? l : new Uint8Array(l);
  for (A = 0; A < t; A += 4)
    s = bA[r.charCodeAt(A)], n = bA[r.charCodeAt(A + 1)], o = bA[r.charCodeAt(A + 2)], a = bA[r.charCodeAt(A + 3)], h[i++] = s << 2 | n >> 4, h[i++] = (n & 15) << 4 | o >> 2, h[i++] = (o & 3) << 6 | a & 63;
  return l;
}, Hu = function(r) {
  for (var e = r.length, t = [], A = 0; A < e; A += 2)
    t.push(r[A + 1] << 8 | r[A]);
  return t;
}, Ru = function(r) {
  for (var e = r.length, t = [], A = 0; A < e; A += 4)
    t.push(r[A + 3] << 24 | r[A + 2] << 16 | r[A + 1] << 8 | r[A]);
  return t;
}, kt = 5, Ur = 11, ls = 2, xu = Ur - kt, wo = 65536 >> kt, Tu = 1 << kt, hs = Tu - 1, Lu = 1024 >> kt, Iu = wo + Lu, Mu = Iu, Du = 32, Su = Mu + Du, ku = 65536 >> Ur, _u = 1 << xu, Ou = _u - 1, jr = function(r, e, t) {
  return r.slice ? r.slice(e, t) : new Uint16Array(Array.prototype.slice.call(r, e, t));
}, Ku = function(r, e, t) {
  return r.slice ? r.slice(e, t) : new Uint32Array(Array.prototype.slice.call(r, e, t));
}, Pu = function(r, e) {
  var t = Uu(r), A = Array.isArray(t) ? Ru(t) : new Uint32Array(t), i = Array.isArray(t) ? Hu(t) : new Uint16Array(t), s = 24, n = jr(i, s / 2, A[4] / 2), o = A[5] === 2 ? jr(i, (s + A[4]) / 2) : Ku(A, Math.ceil((s + A[4]) / 4));
  return new Vu(A[0], A[1], A[2], A[3], n, o);
}, Vu = (
  /** @class */
  function() {
    function r(e, t, A, i, s, n) {
      this.initialValue = e, this.errorValue = t, this.highStart = A, this.highValueIndex = i, this.index = s, this.data = n;
    }
    return r.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> kt], t = (t << ls) + (e & hs), this.data[t];
        if (e <= 65535)
          return t = this.index[wo + (e - 55296 >> kt)], t = (t << ls) + (e & hs), this.data[t];
        if (e < this.highStart)
          return t = Su - ku + (e >> Ur), t = this.index[t], t += e >> kt & Ou, t = this.index[t], t = (t << ls) + (e & hs), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, r;
  }()
), Yr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Nu = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var ei = 0; ei < Yr.length; ei++)
  Nu[Yr.charCodeAt(ei)] = ei;
var zu = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", Zr = 50, Gu = 1, bo = 2, Bo = 3, Wu = 4, Xu = 5, $r = 7, Co = 8, qr = 9, Ct = 10, rr = 11, en = 12, nr = 13, Ju = 14, BA = 15, or = 16, ti = 17, gA = 18, ju = 19, tn = 20, ar = 21, pA = 22, us = 23, Nt = 24, Se = 25, CA = 26, vA = 27, zt = 28, Yu = 29, Tt = 30, Zu = 31, Ai = 32, ii = 33, lr = 34, hr = 35, ur = 36, SA = 37, cr = 38, Ci = 39, vi = 40, cs = 41, vo = 42, $u = 43, qu = [9001, 65288], Eo = "!", $ = "×", si = "÷", dr = Pu(zu), At = [Tt, ur], fr = [Gu, bo, Bo, Xu], yo = [Ct, Co], An = [vA, CA], ec = fr.concat(yo), sn = [cr, Ci, vi, lr, hr], tc = [BA, nr], Ac = function(r, e) {
  e === void 0 && (e = "strict");
  var t = [], A = [], i = [];
  return r.forEach(function(s, n) {
    var o = dr.get(s);
    if (o > Zr ? (i.push(!0), o -= Zr) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(s) !== -1)
      return A.push(n), t.push(or);
    if (o === Wu || o === rr) {
      if (n === 0)
        return A.push(n), t.push(Tt);
      var a = t[n - 1];
      return ec.indexOf(a) === -1 ? (A.push(A[n - 1]), t.push(a)) : (A.push(n), t.push(Tt));
    }
    if (A.push(n), o === Zu)
      return t.push(e === "strict" ? ar : SA);
    if (o === vo || o === Yu)
      return t.push(Tt);
    if (o === $u)
      return s >= 131072 && s <= 196605 || s >= 196608 && s <= 262141 ? t.push(SA) : t.push(Tt);
    t.push(o);
  }), [A, t, i];
}, ds = function(r, e, t, A) {
  var i = A[t];
  if (Array.isArray(r) ? r.indexOf(i) !== -1 : r === i)
    for (var s = t; s <= A.length; ) {
      s++;
      var n = A[s];
      if (n === e)
        return !0;
      if (n !== Ct)
        break;
    }
  if (i === Ct)
    for (var s = t; s > 0; ) {
      s--;
      var o = A[s];
      if (Array.isArray(r) ? r.indexOf(o) !== -1 : r === o)
        for (var a = t; a <= A.length; ) {
          a++;
          var n = A[a];
          if (n === e)
            return !0;
          if (n !== Ct)
            break;
        }
      if (o !== Ct)
        break;
    }
  return !1;
}, rn = function(r, e) {
  for (var t = r; t >= 0; ) {
    var A = e[t];
    if (A === Ct)
      t--;
    else
      return A;
  }
  return 0;
}, ic = function(r, e, t, A, i) {
  if (t[A] === 0)
    return $;
  var s = A - 1;
  if (Array.isArray(i) && i[s] === !0)
    return $;
  var n = s - 1, o = s + 1, a = e[s], l = n >= 0 ? e[n] : 0, h = e[o];
  if (a === bo && h === Bo)
    return $;
  if (fr.indexOf(a) !== -1)
    return Eo;
  if (fr.indexOf(h) !== -1 || yo.indexOf(h) !== -1)
    return $;
  if (rn(s, e) === Co)
    return si;
  if (dr.get(r[s]) === rr || (a === Ai || a === ii) && dr.get(r[o]) === rr || a === $r || h === $r || a === qr || [Ct, nr, BA].indexOf(a) === -1 && h === qr || [ti, gA, ju, Nt, zt].indexOf(h) !== -1 || rn(s, e) === pA || ds(us, pA, s, e) || ds([ti, gA], ar, s, e) || ds(en, en, s, e))
    return $;
  if (a === Ct)
    return si;
  if (a === us || h === us)
    return $;
  if (h === or || a === or)
    return si;
  if ([nr, BA, ar].indexOf(h) !== -1 || a === Ju || l === ur && tc.indexOf(a) !== -1 || a === zt && h === ur || h === tn || At.indexOf(h) !== -1 && a === Se || At.indexOf(a) !== -1 && h === Se || a === vA && [SA, Ai, ii].indexOf(h) !== -1 || [SA, Ai, ii].indexOf(a) !== -1 && h === CA || At.indexOf(a) !== -1 && An.indexOf(h) !== -1 || An.indexOf(a) !== -1 && At.indexOf(h) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [vA, CA].indexOf(a) !== -1 && (h === Se || [pA, BA].indexOf(h) !== -1 && e[o + 1] === Se) || // ( OP | HY ) × NU
  [pA, BA].indexOf(a) !== -1 && h === Se || // NU ×	(NU | SY | IS)
  a === Se && [Se, zt, Nt].indexOf(h) !== -1)
    return $;
  if ([Se, zt, Nt, ti, gA].indexOf(h) !== -1)
    for (var u = s; u >= 0; ) {
      var c = e[u];
      if (c === Se)
        return $;
      if ([zt, Nt].indexOf(c) !== -1)
        u--;
      else
        break;
    }
  if ([vA, CA].indexOf(h) !== -1)
    for (var u = [ti, gA].indexOf(a) !== -1 ? n : s; u >= 0; ) {
      var c = e[u];
      if (c === Se)
        return $;
      if ([zt, Nt].indexOf(c) !== -1)
        u--;
      else
        break;
    }
  if (cr === a && [cr, Ci, lr, hr].indexOf(h) !== -1 || [Ci, lr].indexOf(a) !== -1 && [Ci, vi].indexOf(h) !== -1 || [vi, hr].indexOf(a) !== -1 && h === vi || sn.indexOf(a) !== -1 && [tn, CA].indexOf(h) !== -1 || sn.indexOf(h) !== -1 && a === vA || At.indexOf(a) !== -1 && At.indexOf(h) !== -1 || a === Nt && At.indexOf(h) !== -1 || At.concat(Se).indexOf(a) !== -1 && h === pA && qu.indexOf(r[o]) === -1 || At.concat(Se).indexOf(h) !== -1 && a === gA)
    return $;
  if (a === cs && h === cs) {
    for (var f = t[s], w = 1; f > 0 && (f--, e[f] === cs); )
      w++;
    if (w % 2 !== 0)
      return $;
  }
  return a === Ai && h === ii ? $ : si;
}, sc = function(r, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = Ac(r, e.lineBreak), A = t[0], i = t[1], s = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(o) {
    return [Se, Tt, vo].indexOf(o) !== -1 ? SA : o;
  }));
  var n = e.wordBreak === "keep-all" ? s.map(function(o, a) {
    return o && r[a] >= 19968 && r[a] <= 40959;
  }) : void 0;
  return [A, i, n];
}, rc = (
  /** @class */
  function() {
    function r(e, t, A, i) {
      this.codePoints = e, this.required = t === Eo, this.start = A, this.end = i;
    }
    return r.prototype.slice = function() {
      return fe.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, r;
  }()
), nc = function(r, e) {
  var t = Oi(r), A = sc(t, e), i = A[0], s = A[1], n = A[2], o = t.length, a = 0, l = 0;
  return {
    next: function() {
      if (l >= o)
        return { done: !0, value: null };
      for (var h = $; l < o && (h = ic(t, s, i, ++l, n)) === $; )
        ;
      if (h !== $ || l === o) {
        var u = new rc(t, h, a, l);
        return a = l, { value: u, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, oc = 1, ac = 2, KA = 4, nn = 8, Fi = 10, on = 47, QA = 92, lc = 9, hc = 32, ri = 34, mA = 61, uc = 35, cc = 36, dc = 37, ni = 39, oi = 40, wA = 41, fc = 95, Me = 45, gc = 33, pc = 60, mc = 62, wc = 64, bc = 91, Bc = 93, Cc = 61, vc = 123, ai = 63, Ec = 125, an = 124, yc = 126, Fc = 128, ln = 65533, fs = 42, Dt = 43, Qc = 44, Uc = 58, Hc = 59, kA = 46, Rc = 0, xc = 8, Tc = 11, Lc = 14, Ic = 31, Mc = 127, Ze = -1, Fo = 48, Qo = 97, Uo = 101, Dc = 102, Sc = 117, kc = 122, Ho = 65, Ro = 69, xo = 70, _c = 85, Oc = 90, Re = function(r) {
  return r >= Fo && r <= 57;
}, Kc = function(r) {
  return r >= 55296 && r <= 57343;
}, Gt = function(r) {
  return Re(r) || r >= Ho && r <= xo || r >= Qo && r <= Dc;
}, Pc = function(r) {
  return r >= Qo && r <= kc;
}, Vc = function(r) {
  return r >= Ho && r <= Oc;
}, Nc = function(r) {
  return Pc(r) || Vc(r);
}, zc = function(r) {
  return r >= Fc;
}, li = function(r) {
  return r === Fi || r === lc || r === hc;
}, Qi = function(r) {
  return Nc(r) || zc(r) || r === fc;
}, hn = function(r) {
  return Qi(r) || Re(r) || r === Me;
}, Gc = function(r) {
  return r >= Rc && r <= xc || r === Tc || r >= Lc && r <= Ic || r === Mc;
}, ft = function(r, e) {
  return r !== QA ? !1 : e !== Fi;
}, hi = function(r, e, t) {
  return r === Me ? Qi(e) || ft(e, t) : Qi(r) ? !0 : !!(r === QA && ft(r, e));
}, gs = function(r, e, t) {
  return r === Dt || r === Me ? Re(e) ? !0 : e === kA && Re(t) : Re(r === kA ? e : r);
}, Wc = function(r) {
  var e = 0, t = 1;
  (r[e] === Dt || r[e] === Me) && (r[e] === Me && (t = -1), e++);
  for (var A = []; Re(r[e]); )
    A.push(r[e++]);
  var i = A.length ? parseInt(fe.apply(void 0, A), 10) : 0;
  r[e] === kA && e++;
  for (var s = []; Re(r[e]); )
    s.push(r[e++]);
  var n = s.length, o = n ? parseInt(fe.apply(void 0, s), 10) : 0;
  (r[e] === Ro || r[e] === Uo) && e++;
  var a = 1;
  (r[e] === Dt || r[e] === Me) && (r[e] === Me && (a = -1), e++);
  for (var l = []; Re(r[e]); )
    l.push(r[e++]);
  var h = l.length ? parseInt(fe.apply(void 0, l), 10) : 0;
  return t * (i + o * Math.pow(10, -n)) * Math.pow(10, a * h);
}, Xc = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, Jc = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, jc = {
  type: 4
  /* COMMA_TOKEN */
}, Yc = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, Zc = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, $c = {
  type: 21
  /* COLUMN_TOKEN */
}, qc = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, ed = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, td = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, Ad = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, id = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, ui = {
  type: 23
  /* BAD_URL_TOKEN */
}, sd = {
  type: 1
  /* BAD_STRING_TOKEN */
}, rd = {
  type: 25
  /* CDO_TOKEN */
}, nd = {
  type: 24
  /* CDC_TOKEN */
}, od = {
  type: 26
  /* COLON_TOKEN */
}, ad = {
  type: 27
  /* SEMICOLON_TOKEN */
}, ld = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, hd = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, ud = {
  type: 31
  /* WHITESPACE_TOKEN */
}, gr = {
  type: 32
  /* EOF_TOKEN */
}, To = (
  /** @class */
  function() {
    function r() {
      this._value = [];
    }
    return r.prototype.write = function(e) {
      this._value = this._value.concat(Oi(e));
    }, r.prototype.read = function() {
      for (var e = [], t = this.consumeToken(); t !== gr; )
        e.push(t), t = this.consumeToken();
      return e;
    }, r.prototype.consumeToken = function() {
      var e = this.consumeCodePoint();
      switch (e) {
        case ri:
          return this.consumeStringToken(ri);
        case uc:
          var t = this.peekCodePoint(0), A = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (hn(t) || ft(A, i)) {
            var s = hi(t, A, i) ? ac : oc, n = this.consumeName();
            return { type: 5, value: n, flags: s };
          }
          break;
        case cc:
          if (this.peekCodePoint(0) === mA)
            return this.consumeCodePoint(), Yc;
          break;
        case ni:
          return this.consumeStringToken(ni);
        case oi:
          return Xc;
        case wA:
          return Jc;
        case fs:
          if (this.peekCodePoint(0) === mA)
            return this.consumeCodePoint(), id;
          break;
        case Dt:
          if (gs(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case Qc:
          return jc;
        case Me:
          var o = e, a = this.peekCodePoint(0), l = this.peekCodePoint(1);
          if (gs(o, a, l))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (hi(o, a, l))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (a === Me && l === mc)
            return this.consumeCodePoint(), this.consumeCodePoint(), nd;
          break;
        case kA:
          if (gs(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case on:
          if (this.peekCodePoint(0) === fs)
            for (this.consumeCodePoint(); ; ) {
              var h = this.consumeCodePoint();
              if (h === fs && (h = this.consumeCodePoint(), h === on))
                return this.consumeToken();
              if (h === Ze)
                return this.consumeToken();
            }
          break;
        case Uc:
          return od;
        case Hc:
          return ad;
        case pc:
          if (this.peekCodePoint(0) === gc && this.peekCodePoint(1) === Me && this.peekCodePoint(2) === Me)
            return this.consumeCodePoint(), this.consumeCodePoint(), rd;
          break;
        case wc:
          var u = this.peekCodePoint(0), c = this.peekCodePoint(1), f = this.peekCodePoint(2);
          if (hi(u, c, f)) {
            var n = this.consumeName();
            return { type: 7, value: n };
          }
          break;
        case bc:
          return ld;
        case QA:
          if (ft(e, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          break;
        case Bc:
          return hd;
        case Cc:
          if (this.peekCodePoint(0) === mA)
            return this.consumeCodePoint(), Zc;
          break;
        case vc:
          return td;
        case Ec:
          return Ad;
        case Sc:
        case _c:
          var w = this.peekCodePoint(0), b = this.peekCodePoint(1);
          return w === Dt && (Gt(b) || b === ai) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case an:
          if (this.peekCodePoint(0) === mA)
            return this.consumeCodePoint(), qc;
          if (this.peekCodePoint(0) === an)
            return this.consumeCodePoint(), $c;
          break;
        case yc:
          if (this.peekCodePoint(0) === mA)
            return this.consumeCodePoint(), ed;
          break;
        case Ze:
          return gr;
      }
      return li(e) ? (this.consumeWhiteSpace(), ud) : Re(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : Qi(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: fe(e) };
    }, r.prototype.consumeCodePoint = function() {
      var e = this._value.shift();
      return typeof e > "u" ? -1 : e;
    }, r.prototype.reconsumeCodePoint = function(e) {
      this._value.unshift(e);
    }, r.prototype.peekCodePoint = function(e) {
      return e >= this._value.length ? -1 : this._value[e];
    }, r.prototype.consumeUnicodeRangeToken = function() {
      for (var e = [], t = this.consumeCodePoint(); Gt(t) && e.length < 6; )
        e.push(t), t = this.consumeCodePoint();
      for (var A = !1; t === ai && e.length < 6; )
        e.push(t), t = this.consumeCodePoint(), A = !0;
      if (A) {
        var i = parseInt(fe.apply(void 0, e.map(function(a) {
          return a === ai ? Fo : a;
        })), 16), s = parseInt(fe.apply(void 0, e.map(function(a) {
          return a === ai ? xo : a;
        })), 16);
        return { type: 30, start: i, end: s };
      }
      var n = parseInt(fe.apply(void 0, e), 16);
      if (this.peekCodePoint(0) === Me && Gt(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var o = []; Gt(t) && o.length < 6; )
          o.push(t), t = this.consumeCodePoint();
        var s = parseInt(fe.apply(void 0, o), 16);
        return { type: 30, start: n, end: s };
      } else
        return { type: 30, start: n, end: n };
    }, r.prototype.consumeIdentLikeToken = function() {
      var e = this.consumeName();
      return e.toLowerCase() === "url" && this.peekCodePoint(0) === oi ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === oi ? (this.consumeCodePoint(), { type: 19, value: e }) : { type: 20, value: e };
    }, r.prototype.consumeUrlToken = function() {
      var e = [];
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === Ze)
        return { type: 22, value: "" };
      var t = this.peekCodePoint(0);
      if (t === ni || t === ri) {
        var A = this.consumeStringToken(this.consumeCodePoint());
        return A.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === Ze || this.peekCodePoint(0) === wA) ? (this.consumeCodePoint(), { type: 22, value: A.value }) : (this.consumeBadUrlRemnants(), ui);
      }
      for (; ; ) {
        var i = this.consumeCodePoint();
        if (i === Ze || i === wA)
          return { type: 22, value: fe.apply(void 0, e) };
        if (li(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === Ze || this.peekCodePoint(0) === wA ? (this.consumeCodePoint(), { type: 22, value: fe.apply(void 0, e) }) : (this.consumeBadUrlRemnants(), ui);
        if (i === ri || i === ni || i === oi || Gc(i))
          return this.consumeBadUrlRemnants(), ui;
        if (i === QA)
          if (ft(i, this.peekCodePoint(0)))
            e.push(this.consumeEscapedCodePoint());
          else
            return this.consumeBadUrlRemnants(), ui;
        else
          e.push(i);
      }
    }, r.prototype.consumeWhiteSpace = function() {
      for (; li(this.peekCodePoint(0)); )
        this.consumeCodePoint();
    }, r.prototype.consumeBadUrlRemnants = function() {
      for (; ; ) {
        var e = this.consumeCodePoint();
        if (e === wA || e === Ze)
          return;
        ft(e, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
      }
    }, r.prototype.consumeStringSlice = function(e) {
      for (var t = 5e4, A = ""; e > 0; ) {
        var i = Math.min(t, e);
        A += fe.apply(void 0, this._value.splice(0, i)), e -= i;
      }
      return this._value.shift(), A;
    }, r.prototype.consumeStringToken = function(e) {
      var t = "", A = 0;
      do {
        var i = this._value[A];
        if (i === Ze || i === void 0 || i === e)
          return t += this.consumeStringSlice(A), { type: 0, value: t };
        if (i === Fi)
          return this._value.splice(0, A), sd;
        if (i === QA) {
          var s = this._value[A + 1];
          s !== Ze && s !== void 0 && (s === Fi ? (t += this.consumeStringSlice(A), A = -1, this._value.shift()) : ft(i, s) && (t += this.consumeStringSlice(A), t += fe(this.consumeEscapedCodePoint()), A = -1));
        }
        A++;
      } while (!0);
    }, r.prototype.consumeNumber = function() {
      var e = [], t = KA, A = this.peekCodePoint(0);
      for ((A === Dt || A === Me) && e.push(this.consumeCodePoint()); Re(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      A = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (A === kA && Re(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = nn; Re(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      A = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var s = this.peekCodePoint(2);
      if ((A === Ro || A === Uo) && ((i === Dt || i === Me) && Re(s) || Re(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = nn; Re(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      return [Wc(e), t];
    }, r.prototype.consumeNumericToken = function() {
      var e = this.consumeNumber(), t = e[0], A = e[1], i = this.peekCodePoint(0), s = this.peekCodePoint(1), n = this.peekCodePoint(2);
      if (hi(i, s, n)) {
        var o = this.consumeName();
        return { type: 15, number: t, flags: A, unit: o };
      }
      return i === dc ? (this.consumeCodePoint(), { type: 16, number: t, flags: A }) : { type: 17, number: t, flags: A };
    }, r.prototype.consumeEscapedCodePoint = function() {
      var e = this.consumeCodePoint();
      if (Gt(e)) {
        for (var t = fe(e); Gt(this.peekCodePoint(0)) && t.length < 6; )
          t += fe(this.consumeCodePoint());
        li(this.peekCodePoint(0)) && this.consumeCodePoint();
        var A = parseInt(t, 16);
        return A === 0 || Kc(A) || A > 1114111 ? ln : A;
      }
      return e === Ze ? ln : e;
    }, r.prototype.consumeName = function() {
      for (var e = ""; ; ) {
        var t = this.consumeCodePoint();
        if (hn(t))
          e += fe(t);
        else if (ft(t, this.peekCodePoint(0)))
          e += fe(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), e;
      }
    }, r;
  }()
), Lo = (
  /** @class */
  function() {
    function r(e) {
      this._tokens = e;
    }
    return r.create = function(e) {
      var t = new To();
      return t.write(e), new r(t.read());
    }, r.parseValue = function(e) {
      return r.create(e).parseComponentValue();
    }, r.parseValues = function(e) {
      return r.create(e).parseComponentValues();
    }, r.prototype.parseComponentValue = function() {
      for (var e = this.consumeToken(); e.type === 31; )
        e = this.consumeToken();
      if (e.type === 32)
        throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
      this.reconsumeToken(e);
      var t = this.consumeComponentValue();
      do
        e = this.consumeToken();
      while (e.type === 31);
      if (e.type === 32)
        return t;
      throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
    }, r.prototype.parseComponentValues = function() {
      for (var e = []; ; ) {
        var t = this.consumeComponentValue();
        if (t.type === 32)
          return e;
        e.push(t), e.push();
      }
    }, r.prototype.consumeComponentValue = function() {
      var e = this.consumeToken();
      switch (e.type) {
        case 11:
        case 28:
        case 2:
          return this.consumeSimpleBlock(e.type);
        case 19:
          return this.consumeFunction(e);
      }
      return e;
    }, r.prototype.consumeSimpleBlock = function(e) {
      for (var t = { type: e, values: [] }, A = this.consumeToken(); ; ) {
        if (A.type === 32 || dd(A, e))
          return t;
        this.reconsumeToken(A), t.values.push(this.consumeComponentValue()), A = this.consumeToken();
      }
    }, r.prototype.consumeFunction = function(e) {
      for (var t = {
        name: e.value,
        values: [],
        type: 18
        /* FUNCTION */
      }; ; ) {
        var A = this.consumeToken();
        if (A.type === 32 || A.type === 3)
          return t;
        this.reconsumeToken(A), t.values.push(this.consumeComponentValue());
      }
    }, r.prototype.consumeToken = function() {
      var e = this._tokens.shift();
      return typeof e > "u" ? gr : e;
    }, r.prototype.reconsumeToken = function(e) {
      this._tokens.unshift(e);
    }, r;
  }()
), PA = function(r) {
  return r.type === 15;
}, rA = function(r) {
  return r.type === 17;
}, Ae = function(r) {
  return r.type === 20;
}, cd = function(r) {
  return r.type === 0;
}, pr = function(r, e) {
  return Ae(r) && r.value === e;
}, Io = function(r) {
  return r.type !== 31;
}, sA = function(r) {
  return r.type !== 31 && r.type !== 4;
}, $e = function(r) {
  var e = [], t = [];
  return r.forEach(function(A) {
    if (A.type === 4) {
      if (t.length === 0)
        throw new Error("Error parsing function args, zero tokens for arg");
      e.push(t), t = [];
      return;
    }
    A.type !== 31 && t.push(A);
  }), t.length && e.push(t), e;
}, dd = function(r, e) {
  return e === 11 && r.type === 12 || e === 28 && r.type === 29 ? !0 : e === 2 && r.type === 3;
}, Qt = function(r) {
  return r.type === 17 || r.type === 15;
}, ge = function(r) {
  return r.type === 16 || Qt(r);
}, Mo = function(r) {
  return r.length > 1 ? [r[0], r[1]] : [r[0]];
}, Ee = {
  type: 17,
  number: 0,
  flags: KA
}, Hr = {
  type: 16,
  number: 50,
  flags: KA
}, vt = {
  type: 16,
  number: 100,
  flags: KA
}, EA = function(r, e, t) {
  var A = r[0], i = r[1];
  return [ne(A, e), ne(typeof i < "u" ? i : A, t)];
}, ne = function(r, e) {
  if (r.type === 16)
    return r.number / 100 * e;
  if (PA(r))
    switch (r.unit) {
      case "rem":
      case "em":
        return 16 * r.number;
      case "px":
      default:
        return r.number;
    }
  return r.number;
}, Do = "deg", So = "grad", ko = "rad", _o = "turn", Ki = {
  name: "angle",
  parse: function(r, e) {
    if (e.type === 15)
      switch (e.unit) {
        case Do:
          return Math.PI * e.number / 180;
        case So:
          return Math.PI / 200 * e.number;
        case ko:
          return e.number;
        case _o:
          return Math.PI * 2 * e.number;
      }
    throw new Error("Unsupported angle type");
  }
}, Oo = function(r) {
  return r.type === 15 && (r.unit === Do || r.unit === So || r.unit === ko || r.unit === _o);
}, Ko = function(r) {
  var e = r.filter(Ae).map(function(t) {
    return t.value;
  }).join(" ");
  switch (e) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [Ee, Ee];
    case "to top":
    case "bottom":
      return Ve(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [Ee, vt];
    case "to right":
    case "left":
      return Ve(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [vt, vt];
    case "to bottom":
    case "top":
      return Ve(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [vt, Ee];
    case "to left":
    case "right":
      return Ve(270);
  }
  return 0;
}, Ve = function(r) {
  return Math.PI * r / 180;
}, yt = {
  name: "color",
  parse: function(r, e) {
    if (e.type === 18) {
      var t = fd[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported color function "' + e.name + '"');
      return t(r, e.values);
    }
    if (e.type === 5) {
      if (e.value.length === 3) {
        var A = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3);
        return Et(parseInt(A + A, 16), parseInt(i + i, 16), parseInt(s + s, 16), 1);
      }
      if (e.value.length === 4) {
        var A = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3), n = e.value.substring(3, 4);
        return Et(parseInt(A + A, 16), parseInt(i + i, 16), parseInt(s + s, 16), parseInt(n + n, 16) / 255);
      }
      if (e.value.length === 6) {
        var A = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6);
        return Et(parseInt(A, 16), parseInt(i, 16), parseInt(s, 16), 1);
      }
      if (e.value.length === 8) {
        var A = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6), n = e.value.substring(6, 8);
        return Et(parseInt(A, 16), parseInt(i, 16), parseInt(s, 16), parseInt(n, 16) / 255);
      }
    }
    if (e.type === 20) {
      var o = nt[e.value.toUpperCase()];
      if (typeof o < "u")
        return o;
    }
    return nt.TRANSPARENT;
  }
}, Ft = function(r) {
  return (255 & r) === 0;
}, Ce = function(r) {
  var e = 255 & r, t = 255 & r >> 8, A = 255 & r >> 16, i = 255 & r >> 24;
  return e < 255 ? "rgba(" + i + "," + A + "," + t + "," + e / 255 + ")" : "rgb(" + i + "," + A + "," + t + ")";
}, Et = function(r, e, t, A) {
  return (r << 24 | e << 16 | t << 8 | Math.round(A * 255) << 0) >>> 0;
}, un = function(r, e) {
  if (r.type === 17)
    return r.number;
  if (r.type === 16) {
    var t = e === 3 ? 1 : 255;
    return e === 3 ? r.number / 100 * t : Math.round(r.number / 100 * t);
  }
  return 0;
}, cn = function(r, e) {
  var t = e.filter(sA);
  if (t.length === 3) {
    var A = t.map(un), i = A[0], s = A[1], n = A[2];
    return Et(i, s, n, 1);
  }
  if (t.length === 4) {
    var o = t.map(un), i = o[0], s = o[1], n = o[2], a = o[3];
    return Et(i, s, n, a);
  }
  return 0;
};
function ps(r, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - r) * t * 6 + r : t < 1 / 2 ? e : t < 2 / 3 ? (e - r) * 6 * (2 / 3 - t) + r : r;
}
var dn = function(r, e) {
  var t = e.filter(sA), A = t[0], i = t[1], s = t[2], n = t[3], o = (A.type === 17 ? Ve(A.number) : Ki.parse(r, A)) / (Math.PI * 2), a = ge(i) ? i.number / 100 : 0, l = ge(s) ? s.number / 100 : 0, h = typeof n < "u" && ge(n) ? ne(n, 1) : 1;
  if (a === 0)
    return Et(l * 255, l * 255, l * 255, 1);
  var u = l <= 0.5 ? l * (a + 1) : l + a - l * a, c = l * 2 - u, f = ps(c, u, o + 1 / 3), w = ps(c, u, o), b = ps(c, u, o - 1 / 3);
  return Et(f * 255, w * 255, b * 255, h);
}, fd = {
  hsl: dn,
  hsla: dn,
  rgb: cn,
  rgba: cn
}, UA = function(r, e) {
  return yt.parse(r, Lo.create(e).parseComponentValue());
}, nt = {
  ALICEBLUE: 4042850303,
  ANTIQUEWHITE: 4209760255,
  AQUA: 16777215,
  AQUAMARINE: 2147472639,
  AZURE: 4043309055,
  BEIGE: 4126530815,
  BISQUE: 4293182719,
  BLACK: 255,
  BLANCHEDALMOND: 4293643775,
  BLUE: 65535,
  BLUEVIOLET: 2318131967,
  BROWN: 2771004159,
  BURLYWOOD: 3736635391,
  CADETBLUE: 1604231423,
  CHARTREUSE: 2147418367,
  CHOCOLATE: 3530104575,
  CORAL: 4286533887,
  CORNFLOWERBLUE: 1687547391,
  CORNSILK: 4294499583,
  CRIMSON: 3692313855,
  CYAN: 16777215,
  DARKBLUE: 35839,
  DARKCYAN: 9145343,
  DARKGOLDENROD: 3095837695,
  DARKGRAY: 2846468607,
  DARKGREEN: 6553855,
  DARKGREY: 2846468607,
  DARKKHAKI: 3182914559,
  DARKMAGENTA: 2332068863,
  DARKOLIVEGREEN: 1433087999,
  DARKORANGE: 4287365375,
  DARKORCHID: 2570243327,
  DARKRED: 2332033279,
  DARKSALMON: 3918953215,
  DARKSEAGREEN: 2411499519,
  DARKSLATEBLUE: 1211993087,
  DARKSLATEGRAY: 793726975,
  DARKSLATEGREY: 793726975,
  DARKTURQUOISE: 13554175,
  DARKVIOLET: 2483082239,
  DEEPPINK: 4279538687,
  DEEPSKYBLUE: 12582911,
  DIMGRAY: 1768516095,
  DIMGREY: 1768516095,
  DODGERBLUE: 512819199,
  FIREBRICK: 2988581631,
  FLORALWHITE: 4294635775,
  FORESTGREEN: 579543807,
  FUCHSIA: 4278255615,
  GAINSBORO: 3705462015,
  GHOSTWHITE: 4177068031,
  GOLD: 4292280575,
  GOLDENROD: 3668254975,
  GRAY: 2155905279,
  GREEN: 8388863,
  GREENYELLOW: 2919182335,
  GREY: 2155905279,
  HONEYDEW: 4043305215,
  HOTPINK: 4285117695,
  INDIANRED: 3445382399,
  INDIGO: 1258324735,
  IVORY: 4294963455,
  KHAKI: 4041641215,
  LAVENDER: 3873897215,
  LAVENDERBLUSH: 4293981695,
  LAWNGREEN: 2096890111,
  LEMONCHIFFON: 4294626815,
  LIGHTBLUE: 2916673279,
  LIGHTCORAL: 4034953471,
  LIGHTCYAN: 3774873599,
  LIGHTGOLDENRODYELLOW: 4210742015,
  LIGHTGRAY: 3553874943,
  LIGHTGREEN: 2431553791,
  LIGHTGREY: 3553874943,
  LIGHTPINK: 4290167295,
  LIGHTSALMON: 4288707327,
  LIGHTSEAGREEN: 548580095,
  LIGHTSKYBLUE: 2278488831,
  LIGHTSLATEGRAY: 2005441023,
  LIGHTSLATEGREY: 2005441023,
  LIGHTSTEELBLUE: 2965692159,
  LIGHTYELLOW: 4294959359,
  LIME: 16711935,
  LIMEGREEN: 852308735,
  LINEN: 4210091775,
  MAGENTA: 4278255615,
  MAROON: 2147483903,
  MEDIUMAQUAMARINE: 1724754687,
  MEDIUMBLUE: 52735,
  MEDIUMORCHID: 3126187007,
  MEDIUMPURPLE: 2473647103,
  MEDIUMSEAGREEN: 1018393087,
  MEDIUMSLATEBLUE: 2070474495,
  MEDIUMSPRINGGREEN: 16423679,
  MEDIUMTURQUOISE: 1221709055,
  MEDIUMVIOLETRED: 3340076543,
  MIDNIGHTBLUE: 421097727,
  MINTCREAM: 4127193855,
  MISTYROSE: 4293190143,
  MOCCASIN: 4293178879,
  NAVAJOWHITE: 4292783615,
  NAVY: 33023,
  OLDLACE: 4260751103,
  OLIVE: 2155872511,
  OLIVEDRAB: 1804477439,
  ORANGE: 4289003775,
  ORANGERED: 4282712319,
  ORCHID: 3664828159,
  PALEGOLDENROD: 4008225535,
  PALEGREEN: 2566625535,
  PALETURQUOISE: 2951671551,
  PALEVIOLETRED: 3681588223,
  PAPAYAWHIP: 4293907967,
  PEACHPUFF: 4292524543,
  PERU: 3448061951,
  PINK: 4290825215,
  PLUM: 3718307327,
  POWDERBLUE: 2967529215,
  PURPLE: 2147516671,
  REBECCAPURPLE: 1714657791,
  RED: 4278190335,
  ROSYBROWN: 3163525119,
  ROYALBLUE: 1097458175,
  SADDLEBROWN: 2336560127,
  SALMON: 4202722047,
  SANDYBROWN: 4104413439,
  SEAGREEN: 780883967,
  SEASHELL: 4294307583,
  SIENNA: 2689740287,
  SILVER: 3233857791,
  SKYBLUE: 2278484991,
  SLATEBLUE: 1784335871,
  SLATEGRAY: 1887473919,
  SLATEGREY: 1887473919,
  SNOW: 4294638335,
  SPRINGGREEN: 16744447,
  STEELBLUE: 1182971135,
  TAN: 3535047935,
  TEAL: 8421631,
  THISTLE: 3636451583,
  TOMATO: 4284696575,
  TRANSPARENT: 0,
  TURQUOISE: 1088475391,
  VIOLET: 4001558271,
  WHEAT: 4125012991,
  WHITE: 4294967295,
  WHITESMOKE: 4126537215,
  YELLOW: 4294902015,
  YELLOWGREEN: 2597139199
}, gd = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.map(function(t) {
      if (Ae(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, pd = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Pi = function(r, e) {
  var t = yt.parse(r, e[0]), A = e[1];
  return A && ge(A) ? { color: t, stop: A } : { color: t, stop: null };
}, fn = function(r, e) {
  var t = r[0], A = r[r.length - 1];
  t.stop === null && (t.stop = Ee), A.stop === null && (A.stop = vt);
  for (var i = [], s = 0, n = 0; n < r.length; n++) {
    var o = r[n].stop;
    if (o !== null) {
      var a = ne(o, e);
      a > s ? i.push(a) : i.push(s), s = a;
    } else
      i.push(null);
  }
  for (var l = null, n = 0; n < i.length; n++) {
    var h = i[n];
    if (h === null)
      l === null && (l = n);
    else if (l !== null) {
      for (var u = n - l, c = i[l - 1], f = (h - c) / (u + 1), w = 1; w <= u; w++)
        i[l + w - 1] = f * w;
      l = null;
    }
  }
  return r.map(function(b, v) {
    var B = b.color;
    return { color: B, stop: Math.max(Math.min(1, i[v] / e), 0) };
  });
}, md = function(r, e, t) {
  var A = e / 2, i = t / 2, s = ne(r[0], e) - A, n = i - ne(r[1], t);
  return (Math.atan2(n, s) + Math.PI * 2) % (Math.PI * 2);
}, wd = function(r, e, t) {
  var A = typeof r == "number" ? r : md(r, e, t), i = Math.abs(e * Math.sin(A)) + Math.abs(t * Math.cos(A)), s = e / 2, n = t / 2, o = i / 2, a = Math.sin(A - Math.PI / 2) * o, l = Math.cos(A - Math.PI / 2) * o;
  return [i, s - l, s + l, n - a, n + a];
}, Xe = function(r, e) {
  return Math.sqrt(r * r + e * e);
}, gn = function(r, e, t, A, i) {
  var s = [
    [0, 0],
    [0, e],
    [r, 0],
    [r, e]
  ];
  return s.reduce(function(n, o) {
    var a = o[0], l = o[1], h = Xe(t - a, A - l);
    return (i ? h < n.optimumDistance : h > n.optimumDistance) ? {
      optimumCorner: o,
      optimumDistance: h
    } : n;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, bd = function(r, e, t, A, i) {
  var s = 0, n = 0;
  switch (r.size) {
    case 0:
      r.shape === 0 ? s = n = Math.min(Math.abs(e), Math.abs(e - A), Math.abs(t), Math.abs(t - i)) : r.shape === 1 && (s = Math.min(Math.abs(e), Math.abs(e - A)), n = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (r.shape === 0)
        s = n = Math.min(Xe(e, t), Xe(e, t - i), Xe(e - A, t), Xe(e - A, t - i));
      else if (r.shape === 1) {
        var o = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - A)), a = gn(A, i, e, t, !0), l = a[0], h = a[1];
        s = Xe(l - e, (h - t) / o), n = o * s;
      }
      break;
    case 1:
      r.shape === 0 ? s = n = Math.max(Math.abs(e), Math.abs(e - A), Math.abs(t), Math.abs(t - i)) : r.shape === 1 && (s = Math.max(Math.abs(e), Math.abs(e - A)), n = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (r.shape === 0)
        s = n = Math.max(Xe(e, t), Xe(e, t - i), Xe(e - A, t), Xe(e - A, t - i));
      else if (r.shape === 1) {
        var o = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - A)), u = gn(A, i, e, t, !1), l = u[0], h = u[1];
        s = Xe(l - e, (h - t) / o), n = o * s;
      }
      break;
  }
  return Array.isArray(r.size) && (s = ne(r.size[0], A), n = r.size.length === 2 ? ne(r.size[1], i) : s), [s, n];
}, Bd = function(r, e) {
  var t = Ve(180), A = [];
  return $e(e).forEach(function(i, s) {
    if (s === 0) {
      var n = i[0];
      if (n.type === 20 && n.value === "to") {
        t = Ko(i);
        return;
      } else if (Oo(n)) {
        t = Ki.parse(r, n);
        return;
      }
    }
    var o = Pi(r, i);
    A.push(o);
  }), {
    angle: t,
    stops: A,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, ci = function(r, e) {
  var t = Ve(180), A = [];
  return $e(e).forEach(function(i, s) {
    if (s === 0) {
      var n = i[0];
      if (n.type === 20 && ["top", "left", "right", "bottom"].indexOf(n.value) !== -1) {
        t = Ko(i);
        return;
      } else if (Oo(n)) {
        t = (Ki.parse(r, n) + Ve(270)) % Ve(360);
        return;
      }
    }
    var o = Pi(r, i);
    A.push(o);
  }), {
    angle: t,
    stops: A,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, Cd = function(r, e) {
  var t = Ve(180), A = [], i = 1, s = 0, n = 3, o = [];
  return $e(e).forEach(function(a, l) {
    var h = a[0];
    if (l === 0) {
      if (Ae(h) && h.value === "linear") {
        i = 1;
        return;
      } else if (Ae(h) && h.value === "radial") {
        i = 2;
        return;
      }
    }
    if (h.type === 18) {
      if (h.name === "from") {
        var u = yt.parse(r, h.values[0]);
        A.push({ stop: Ee, color: u });
      } else if (h.name === "to") {
        var u = yt.parse(r, h.values[0]);
        A.push({ stop: vt, color: u });
      } else if (h.name === "color-stop") {
        var c = h.values.filter(sA);
        if (c.length === 2) {
          var u = yt.parse(r, c[1]), f = c[0];
          rA(f) && A.push({
            stop: { type: 16, number: f.number * 100, flags: f.flags },
            color: u
          });
        }
      }
    }
  }), i === 1 ? {
    angle: (t + Ve(180)) % Ve(360),
    stops: A,
    type: i
  } : { size: n, shape: s, stops: A, position: o, type: i };
}, Po = "closest-side", Vo = "farthest-side", No = "closest-corner", zo = "farthest-corner", Go = "circle", Wo = "ellipse", Xo = "cover", Jo = "contain", vd = function(r, e) {
  var t = 0, A = 3, i = [], s = [];
  return $e(e).forEach(function(n, o) {
    var a = !0;
    if (o === 0) {
      var l = !1;
      a = n.reduce(function(u, c) {
        if (l)
          if (Ae(c))
            switch (c.value) {
              case "center":
                return s.push(Hr), u;
              case "top":
              case "left":
                return s.push(Ee), u;
              case "right":
              case "bottom":
                return s.push(vt), u;
            }
          else (ge(c) || Qt(c)) && s.push(c);
        else if (Ae(c))
          switch (c.value) {
            case Go:
              return t = 0, !1;
            case Wo:
              return t = 1, !1;
            case "at":
              return l = !0, !1;
            case Po:
              return A = 0, !1;
            case Xo:
            case Vo:
              return A = 1, !1;
            case Jo:
            case No:
              return A = 2, !1;
            case zo:
              return A = 3, !1;
          }
        else if (Qt(c) || ge(c))
          return Array.isArray(A) || (A = []), A.push(c), !1;
        return u;
      }, a);
    }
    if (a) {
      var h = Pi(r, n);
      i.push(h);
    }
  }), {
    size: A,
    shape: t,
    stops: i,
    position: s,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, di = function(r, e) {
  var t = 0, A = 3, i = [], s = [];
  return $e(e).forEach(function(n, o) {
    var a = !0;
    if (o === 0 ? a = n.reduce(function(h, u) {
      if (Ae(u))
        switch (u.value) {
          case "center":
            return s.push(Hr), !1;
          case "top":
          case "left":
            return s.push(Ee), !1;
          case "right":
          case "bottom":
            return s.push(vt), !1;
        }
      else if (ge(u) || Qt(u))
        return s.push(u), !1;
      return h;
    }, a) : o === 1 && (a = n.reduce(function(h, u) {
      if (Ae(u))
        switch (u.value) {
          case Go:
            return t = 0, !1;
          case Wo:
            return t = 1, !1;
          case Jo:
          case Po:
            return A = 0, !1;
          case Vo:
            return A = 1, !1;
          case No:
            return A = 2, !1;
          case Xo:
          case zo:
            return A = 3, !1;
        }
      else if (Qt(u) || ge(u))
        return Array.isArray(A) || (A = []), A.push(u), !1;
      return h;
    }, a)), a) {
      var l = Pi(r, n);
      i.push(l);
    }
  }), {
    size: A,
    shape: t,
    stops: i,
    position: s,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, Ed = function(r) {
  return r.type === 1;
}, yd = function(r) {
  return r.type === 2;
}, Rr = {
  name: "image",
  parse: function(r, e) {
    if (e.type === 22) {
      var t = {
        url: e.value,
        type: 0
        /* URL */
      };
      return r.cache.addImage(e.value), t;
    }
    if (e.type === 18) {
      var A = jo[e.name];
      if (typeof A > "u")
        throw new Error('Attempting to parse an unsupported image function "' + e.name + '"');
      return A(r, e.values);
    }
    throw new Error("Unsupported image type " + e.type);
  }
};
function Fd(r) {
  return !(r.type === 20 && r.value === "none") && (r.type !== 18 || !!jo[r.name]);
}
var jo = {
  "linear-gradient": Bd,
  "-moz-linear-gradient": ci,
  "-ms-linear-gradient": ci,
  "-o-linear-gradient": ci,
  "-webkit-linear-gradient": ci,
  "radial-gradient": vd,
  "-moz-radial-gradient": di,
  "-ms-radial-gradient": di,
  "-o-radial-gradient": di,
  "-webkit-radial-gradient": di,
  "-webkit-gradient": Cd
}, Qd = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e.filter(function(A) {
      return sA(A) && Fd(A);
    }).map(function(A) {
      return Rr.parse(r, A);
    });
  }
}, Ud = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.map(function(t) {
      if (Ae(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, Hd = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    return $e(e).map(function(t) {
      return t.filter(ge);
    }).map(Mo);
  }
}, Rd = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return $e(e).map(function(t) {
      return t.filter(Ae).map(function(A) {
        return A.value;
      }).join(" ");
    }).map(xd);
  }
}, xd = function(r) {
  switch (r) {
    case "no-repeat":
      return 1;
    case "repeat-x":
    case "repeat no-repeat":
      return 2;
    case "repeat-y":
    case "no-repeat repeat":
      return 3;
    case "repeat":
    default:
      return 0;
  }
}, iA;
(function(r) {
  r.AUTO = "auto", r.CONTAIN = "contain", r.COVER = "cover";
})(iA || (iA = {}));
var Td = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return $e(e).map(function(t) {
      return t.filter(Ld);
    });
  }
}, Ld = function(r) {
  return Ae(r) || ge(r);
}, Vi = function(r) {
  return {
    name: "border-" + r + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, Id = Vi("top"), Md = Vi("right"), Dd = Vi("bottom"), Sd = Vi("left"), Ni = function(r) {
  return {
    name: "border-radius-" + r,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(e, t) {
      return Mo(t.filter(ge));
    }
  };
}, kd = Ni("top-left"), _d = Ni("top-right"), Od = Ni("bottom-right"), Kd = Ni("bottom-left"), zi = function(r) {
  return {
    name: "border-" + r + "-style",
    initialValue: "solid",
    prefix: !1,
    type: 2,
    parse: function(e, t) {
      switch (t) {
        case "none":
          return 0;
        case "dashed":
          return 2;
        case "dotted":
          return 3;
        case "double":
          return 4;
      }
      return 1;
    }
  };
}, Pd = zi("top"), Vd = zi("right"), Nd = zi("bottom"), zd = zi("left"), Gi = function(r) {
  return {
    name: "border-" + r + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(e, t) {
      return PA(t) ? t.number : 0;
    }
  };
}, Gd = Gi("top"), Wd = Gi("right"), Xd = Gi("bottom"), Jd = Gi("left"), jd = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Yd = {
  name: "direction",
  initialValue: "ltr",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "rtl":
        return 1;
      case "ltr":
      default:
        return 0;
    }
  }
}, Zd = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.filter(Ae).reduce(
      function(t, A) {
        return t | $d(A.value);
      },
      0
      /* NONE */
    );
  }
}, $d = function(r) {
  switch (r) {
    case "block":
    case "-webkit-box":
      return 2;
    case "inline":
      return 4;
    case "run-in":
      return 8;
    case "flow":
      return 16;
    case "flow-root":
      return 32;
    case "table":
      return 64;
    case "flex":
    case "-webkit-flex":
      return 128;
    case "grid":
    case "-ms-grid":
      return 256;
    case "ruby":
      return 512;
    case "subgrid":
      return 1024;
    case "list-item":
      return 2048;
    case "table-row-group":
      return 4096;
    case "table-header-group":
      return 8192;
    case "table-footer-group":
      return 16384;
    case "table-row":
      return 32768;
    case "table-cell":
      return 65536;
    case "table-column-group":
      return 131072;
    case "table-column":
      return 262144;
    case "table-caption":
      return 524288;
    case "ruby-base":
      return 1048576;
    case "ruby-text":
      return 2097152;
    case "ruby-base-container":
      return 4194304;
    case "ruby-text-container":
      return 8388608;
    case "contents":
      return 16777216;
    case "inline-block":
      return 33554432;
    case "inline-list-item":
      return 67108864;
    case "inline-table":
      return 134217728;
    case "inline-flex":
      return 268435456;
    case "inline-grid":
      return 536870912;
  }
  return 0;
}, qd = {
  name: "float",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "left":
        return 1;
      case "right":
        return 2;
      case "inline-start":
        return 3;
      case "inline-end":
        return 4;
    }
    return 0;
  }
}, ef = {
  name: "letter-spacing",
  initialValue: "0",
  prefix: !1,
  type: 0,
  parse: function(r, e) {
    return e.type === 20 && e.value === "normal" ? 0 : e.type === 17 || e.type === 15 ? e.number : 0;
  }
}, Ui;
(function(r) {
  r.NORMAL = "normal", r.STRICT = "strict";
})(Ui || (Ui = {}));
var tf = {
  name: "line-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "strict":
        return Ui.STRICT;
      case "normal":
      default:
        return Ui.NORMAL;
    }
  }
}, Af = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, pn = function(r, e) {
  return Ae(r) && r.value === "normal" ? 1.2 * e : r.type === 17 ? e * r.number : ge(r) ? ne(r, e) : e;
}, sf = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(r, e) {
    return e.type === 20 && e.value === "none" ? null : Rr.parse(r, e);
  }
}, rf = {
  name: "list-style-position",
  initialValue: "outside",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "inside":
        return 0;
      case "outside":
      default:
        return 1;
    }
  }
}, mr = {
  name: "list-style-type",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "disc":
        return 0;
      case "circle":
        return 1;
      case "square":
        return 2;
      case "decimal":
        return 3;
      case "cjk-decimal":
        return 4;
      case "decimal-leading-zero":
        return 5;
      case "lower-roman":
        return 6;
      case "upper-roman":
        return 7;
      case "lower-greek":
        return 8;
      case "lower-alpha":
        return 9;
      case "upper-alpha":
        return 10;
      case "arabic-indic":
        return 11;
      case "armenian":
        return 12;
      case "bengali":
        return 13;
      case "cambodian":
        return 14;
      case "cjk-earthly-branch":
        return 15;
      case "cjk-heavenly-stem":
        return 16;
      case "cjk-ideographic":
        return 17;
      case "devanagari":
        return 18;
      case "ethiopic-numeric":
        return 19;
      case "georgian":
        return 20;
      case "gujarati":
        return 21;
      case "gurmukhi":
        return 22;
      case "hebrew":
        return 22;
      case "hiragana":
        return 23;
      case "hiragana-iroha":
        return 24;
      case "japanese-formal":
        return 25;
      case "japanese-informal":
        return 26;
      case "kannada":
        return 27;
      case "katakana":
        return 28;
      case "katakana-iroha":
        return 29;
      case "khmer":
        return 30;
      case "korean-hangul-formal":
        return 31;
      case "korean-hanja-formal":
        return 32;
      case "korean-hanja-informal":
        return 33;
      case "lao":
        return 34;
      case "lower-armenian":
        return 35;
      case "malayalam":
        return 36;
      case "mongolian":
        return 37;
      case "myanmar":
        return 38;
      case "oriya":
        return 39;
      case "persian":
        return 40;
      case "simp-chinese-formal":
        return 41;
      case "simp-chinese-informal":
        return 42;
      case "tamil":
        return 43;
      case "telugu":
        return 44;
      case "thai":
        return 45;
      case "tibetan":
        return 46;
      case "trad-chinese-formal":
        return 47;
      case "trad-chinese-informal":
        return 48;
      case "upper-armenian":
        return 49;
      case "disclosure-open":
        return 50;
      case "disclosure-closed":
        return 51;
      case "none":
      default:
        return -1;
    }
  }
}, Wi = function(r) {
  return {
    name: "margin-" + r,
    initialValue: "0",
    prefix: !1,
    type: 4
    /* TOKEN_VALUE */
  };
}, nf = Wi("top"), of = Wi("right"), af = Wi("bottom"), lf = Wi("left"), hf = {
  name: "overflow",
  initialValue: "visible",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.filter(Ae).map(function(t) {
      switch (t.value) {
        case "hidden":
          return 1;
        case "scroll":
          return 2;
        case "clip":
          return 3;
        case "auto":
          return 4;
        case "visible":
        default:
          return 0;
      }
    });
  }
}, uf = {
  name: "overflow-wrap",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "break-word":
        return "break-word";
      case "normal":
      default:
        return "normal";
    }
  }
}, Xi = function(r) {
  return {
    name: "padding-" + r,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, cf = Xi("top"), df = Xi("right"), ff = Xi("bottom"), gf = Xi("left"), pf = {
  name: "text-align",
  initialValue: "left",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "right":
        return 2;
      case "center":
      case "justify":
        return 1;
      case "left":
      default:
        return 0;
    }
  }
}, mf = {
  name: "position",
  initialValue: "static",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "relative":
        return 1;
      case "absolute":
        return 2;
      case "fixed":
        return 3;
      case "sticky":
        return 4;
    }
    return 0;
  }
}, wf = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    return e.length === 1 && pr(e[0], "none") ? [] : $e(e).map(function(t) {
      for (var A = {
        color: nt.TRANSPARENT,
        offsetX: Ee,
        offsetY: Ee,
        blur: Ee
      }, i = 0, s = 0; s < t.length; s++) {
        var n = t[s];
        Qt(n) ? (i === 0 ? A.offsetX = n : i === 1 ? A.offsetY = n : A.blur = n, i++) : A.color = yt.parse(r, n);
      }
      return A;
    });
  }
}, bf = {
  name: "text-transform",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "uppercase":
        return 2;
      case "lowercase":
        return 1;
      case "capitalize":
        return 3;
    }
    return 0;
  }
}, Bf = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(r, e) {
    if (e.type === 20 && e.value === "none")
      return null;
    if (e.type === 18) {
      var t = Ef[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + e.name + '"');
      return t(e.values);
    }
    return null;
  }
}, Cf = function(r) {
  var e = r.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return e.length === 6 ? e : null;
}, vf = function(r) {
  var e = r.filter(function(a) {
    return a.type === 17;
  }).map(function(a) {
    return a.number;
  }), t = e[0], A = e[1];
  e[2], e[3];
  var i = e[4], s = e[5];
  e[6], e[7], e[8], e[9], e[10], e[11];
  var n = e[12], o = e[13];
  return e[14], e[15], e.length === 16 ? [t, A, i, s, n, o] : null;
}, Ef = {
  matrix: Cf,
  matrix3d: vf
}, mn = {
  type: 16,
  number: 50,
  flags: KA
}, yf = [mn, mn], Ff = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(r, e) {
    var t = e.filter(ge);
    return t.length !== 2 ? yf : [t[0], t[1]];
  }
}, Qf = {
  name: "visible",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "hidden":
        return 1;
      case "collapse":
        return 2;
      case "visible":
      default:
        return 0;
    }
  }
}, HA;
(function(r) {
  r.NORMAL = "normal", r.BREAK_ALL = "break-all", r.KEEP_ALL = "keep-all";
})(HA || (HA = {}));
var Uf = {
  name: "word-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "break-all":
        return HA.BREAK_ALL;
      case "keep-all":
        return HA.KEEP_ALL;
      case "normal":
      default:
        return HA.NORMAL;
    }
  }
}, Hf = {
  name: "z-index",
  initialValue: "auto",
  prefix: !1,
  type: 0,
  parse: function(r, e) {
    if (e.type === 20)
      return { auto: !0, order: 0 };
    if (rA(e))
      return { auto: !1, order: e.number };
    throw new Error("Invalid z-index number parsed");
  }
}, Yo = {
  name: "time",
  parse: function(r, e) {
    if (e.type === 15)
      switch (e.unit.toLowerCase()) {
        case "s":
          return 1e3 * e.number;
        case "ms":
          return e.number;
      }
    throw new Error("Unsupported time type");
  }
}, Rf = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(r, e) {
    return rA(e) ? e.number : 1;
  }
}, xf = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Tf = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.filter(Ae).map(function(t) {
      switch (t.value) {
        case "underline":
          return 1;
        case "overline":
          return 2;
        case "line-through":
          return 3;
        case "none":
          return 4;
      }
      return 0;
    }).filter(function(t) {
      return t !== 0;
    });
  }
}, Lf = {
  name: "font-family",
  initialValue: "",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    var t = [], A = [];
    return e.forEach(function(i) {
      switch (i.type) {
        case 20:
        case 0:
          t.push(i.value);
          break;
        case 17:
          t.push(i.number.toString());
          break;
        case 4:
          A.push(t.join(" ")), t.length = 0;
          break;
      }
    }), t.length && A.push(t.join(" ")), A.map(function(i) {
      return i.indexOf(" ") === -1 ? i : "'" + i + "'";
    });
  }
}, If = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, Mf = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(r, e) {
    if (rA(e))
      return e.number;
    if (Ae(e))
      switch (e.value) {
        case "bold":
          return 700;
        case "normal":
        default:
          return 400;
      }
    return 400;
  }
}, Df = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    return e.filter(Ae).map(function(t) {
      return t.value;
    });
  }
}, Sf = {
  name: "font-style",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "oblique":
        return "oblique";
      case "italic":
        return "italic";
      case "normal":
      default:
        return "normal";
    }
  }
}, we = function(r, e) {
  return (r & e) !== 0;
}, kf = {
  name: "content",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e;
  }
}, _f = {
  name: "counter-increment",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(r, e) {
    if (e.length === 0)
      return null;
    var t = e[0];
    if (t.type === 20 && t.value === "none")
      return null;
    for (var A = [], i = e.filter(Io), s = 0; s < i.length; s++) {
      var n = i[s], o = i[s + 1];
      if (n.type === 20) {
        var a = o && rA(o) ? o.number : 1;
        A.push({ counter: n.value, increment: a });
      }
    }
    return A;
  }
}, Of = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(r, e) {
    if (e.length === 0)
      return [];
    for (var t = [], A = e.filter(Io), i = 0; i < A.length; i++) {
      var s = A[i], n = A[i + 1];
      if (Ae(s) && s.value !== "none") {
        var o = n && rA(n) ? n.number : 0;
        t.push({ counter: s.value, reset: o });
      }
    }
    return t;
  }
}, Kf = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.filter(PA).map(function(t) {
      return Yo.parse(r, t);
    });
  }
}, Pf = {
  name: "quotes",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(r, e) {
    if (e.length === 0)
      return null;
    var t = e[0];
    if (t.type === 20 && t.value === "none")
      return null;
    var A = [], i = e.filter(cd);
    if (i.length % 2 !== 0)
      return null;
    for (var s = 0; s < i.length; s += 2) {
      var n = i[s].value, o = i[s + 1].value;
      A.push({ open: n, close: o });
    }
    return A;
  }
}, wn = function(r, e, t) {
  if (!r)
    return "";
  var A = r[Math.min(e, r.length - 1)];
  return A ? t ? A.open : A.close : "";
}, Vf = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    return e.length === 1 && pr(e[0], "none") ? [] : $e(e).map(function(t) {
      for (var A = {
        color: 255,
        offsetX: Ee,
        offsetY: Ee,
        blur: Ee,
        spread: Ee,
        inset: !1
      }, i = 0, s = 0; s < t.length; s++) {
        var n = t[s];
        pr(n, "inset") ? A.inset = !0 : Qt(n) ? (i === 0 ? A.offsetX = n : i === 1 ? A.offsetY = n : i === 2 ? A.blur = n : A.spread = n, i++) : A.color = yt.parse(r, n);
      }
      return A;
    });
  }
}, Nf = {
  name: "paint-order",
  initialValue: "normal",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    var t = [
      0,
      1,
      2
      /* MARKERS */
    ], A = [];
    return e.filter(Ae).forEach(function(i) {
      switch (i.value) {
        case "stroke":
          A.push(
            1
            /* STROKE */
          );
          break;
        case "fill":
          A.push(
            0
            /* FILL */
          );
          break;
        case "markers":
          A.push(
            2
            /* MARKERS */
          );
          break;
      }
    }), t.forEach(function(i) {
      A.indexOf(i) === -1 && A.push(i);
    }), A;
  }
}, zf = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, Gf = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(r, e) {
    return PA(e) ? e.number : 0;
  }
}, Wf = (
  /** @class */
  function() {
    function r(e, t) {
      var A, i;
      this.animationDuration = T(e, Kf, t.animationDuration), this.backgroundClip = T(e, gd, t.backgroundClip), this.backgroundColor = T(e, pd, t.backgroundColor), this.backgroundImage = T(e, Qd, t.backgroundImage), this.backgroundOrigin = T(e, Ud, t.backgroundOrigin), this.backgroundPosition = T(e, Hd, t.backgroundPosition), this.backgroundRepeat = T(e, Rd, t.backgroundRepeat), this.backgroundSize = T(e, Td, t.backgroundSize), this.borderTopColor = T(e, Id, t.borderTopColor), this.borderRightColor = T(e, Md, t.borderRightColor), this.borderBottomColor = T(e, Dd, t.borderBottomColor), this.borderLeftColor = T(e, Sd, t.borderLeftColor), this.borderTopLeftRadius = T(e, kd, t.borderTopLeftRadius), this.borderTopRightRadius = T(e, _d, t.borderTopRightRadius), this.borderBottomRightRadius = T(e, Od, t.borderBottomRightRadius), this.borderBottomLeftRadius = T(e, Kd, t.borderBottomLeftRadius), this.borderTopStyle = T(e, Pd, t.borderTopStyle), this.borderRightStyle = T(e, Vd, t.borderRightStyle), this.borderBottomStyle = T(e, Nd, t.borderBottomStyle), this.borderLeftStyle = T(e, zd, t.borderLeftStyle), this.borderTopWidth = T(e, Gd, t.borderTopWidth), this.borderRightWidth = T(e, Wd, t.borderRightWidth), this.borderBottomWidth = T(e, Xd, t.borderBottomWidth), this.borderLeftWidth = T(e, Jd, t.borderLeftWidth), this.boxShadow = T(e, Vf, t.boxShadow), this.color = T(e, jd, t.color), this.direction = T(e, Yd, t.direction), this.display = T(e, Zd, t.display), this.float = T(e, qd, t.cssFloat), this.fontFamily = T(e, Lf, t.fontFamily), this.fontSize = T(e, If, t.fontSize), this.fontStyle = T(e, Sf, t.fontStyle), this.fontVariant = T(e, Df, t.fontVariant), this.fontWeight = T(e, Mf, t.fontWeight), this.letterSpacing = T(e, ef, t.letterSpacing), this.lineBreak = T(e, tf, t.lineBreak), this.lineHeight = T(e, Af, t.lineHeight), this.listStyleImage = T(e, sf, t.listStyleImage), this.listStylePosition = T(e, rf, t.listStylePosition), this.listStyleType = T(e, mr, t.listStyleType), this.marginTop = T(e, nf, t.marginTop), this.marginRight = T(e, of, t.marginRight), this.marginBottom = T(e, af, t.marginBottom), this.marginLeft = T(e, lf, t.marginLeft), this.opacity = T(e, Rf, t.opacity);
      var s = T(e, hf, t.overflow);
      this.overflowX = s[0], this.overflowY = s[s.length > 1 ? 1 : 0], this.overflowWrap = T(e, uf, t.overflowWrap), this.paddingTop = T(e, cf, t.paddingTop), this.paddingRight = T(e, df, t.paddingRight), this.paddingBottom = T(e, ff, t.paddingBottom), this.paddingLeft = T(e, gf, t.paddingLeft), this.paintOrder = T(e, Nf, t.paintOrder), this.position = T(e, mf, t.position), this.textAlign = T(e, pf, t.textAlign), this.textDecorationColor = T(e, xf, (A = t.textDecorationColor) !== null && A !== void 0 ? A : t.color), this.textDecorationLine = T(e, Tf, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = T(e, wf, t.textShadow), this.textTransform = T(e, bf, t.textTransform), this.transform = T(e, Bf, t.transform), this.transformOrigin = T(e, Ff, t.transformOrigin), this.visibility = T(e, Qf, t.visibility), this.webkitTextStrokeColor = T(e, zf, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = T(e, Gf, t.webkitTextStrokeWidth), this.wordBreak = T(e, Uf, t.wordBreak), this.zIndex = T(e, Hf, t.zIndex);
    }
    return r.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    }, r.prototype.isTransparent = function() {
      return Ft(this.backgroundColor);
    }, r.prototype.isTransformed = function() {
      return this.transform !== null;
    }, r.prototype.isPositioned = function() {
      return this.position !== 0;
    }, r.prototype.isPositionedWithZIndex = function() {
      return this.isPositioned() && !this.zIndex.auto;
    }, r.prototype.isFloating = function() {
      return this.float !== 0;
    }, r.prototype.isInlineLevel = function() {
      return we(
        this.display,
        4
        /* INLINE */
      ) || we(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || we(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || we(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || we(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || we(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    }, r;
  }()
), Xf = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.content = T(e, kf, t.content), this.quotes = T(e, Pf, t.quotes);
    }
    return r;
  }()
), bn = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.counterIncrement = T(e, _f, t.counterIncrement), this.counterReset = T(e, Of, t.counterReset);
    }
    return r;
  }()
), T = function(r, e, t) {
  var A = new To(), i = t !== null && typeof t < "u" ? t.toString() : e.initialValue;
  A.write(i);
  var s = new Lo(A.read());
  switch (e.type) {
    case 2:
      var n = s.parseComponentValue();
      return e.parse(r, Ae(n) ? n.value : e.initialValue);
    case 0:
      return e.parse(r, s.parseComponentValue());
    case 1:
      return e.parse(r, s.parseComponentValues());
    case 4:
      return s.parseComponentValue();
    case 3:
      switch (e.format) {
        case "angle":
          return Ki.parse(r, s.parseComponentValue());
        case "color":
          return yt.parse(r, s.parseComponentValue());
        case "image":
          return Rr.parse(r, s.parseComponentValue());
        case "length":
          var o = s.parseComponentValue();
          return Qt(o) ? o : Ee;
        case "length-percentage":
          var a = s.parseComponentValue();
          return ge(a) ? a : Ee;
        case "time":
          return Yo.parse(r, s.parseComponentValue());
      }
      break;
  }
}, Jf = "data-html2canvas-debug", jf = function(r) {
  var e = r.getAttribute(Jf);
  switch (e) {
    case "all":
      return 1;
    case "clone":
      return 2;
    case "parse":
      return 3;
    case "render":
      return 4;
    default:
      return 0;
  }
}, wr = function(r, e) {
  var t = jf(r);
  return t === 1 || e === t;
}, qe = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      if (this.context = e, this.textNodes = [], this.elements = [], this.flags = 0, wr(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new Wf(e, window.getComputedStyle(t, null)), Cr(t) && (this.styles.animationDuration.some(function(A) {
        return A > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = _i(this.context, t), wr(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return r;
  }()
), Yf = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", Bn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", yA = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var fi = 0; fi < Bn.length; fi++)
  yA[Bn.charCodeAt(fi)] = fi;
var Zf = function(r) {
  var e = r.length * 0.75, t = r.length, A, i = 0, s, n, o, a;
  r[r.length - 1] === "=" && (e--, r[r.length - 2] === "=" && e--);
  var l = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), h = Array.isArray(l) ? l : new Uint8Array(l);
  for (A = 0; A < t; A += 4)
    s = yA[r.charCodeAt(A)], n = yA[r.charCodeAt(A + 1)], o = yA[r.charCodeAt(A + 2)], a = yA[r.charCodeAt(A + 3)], h[i++] = s << 2 | n >> 4, h[i++] = (n & 15) << 4 | o >> 2, h[i++] = (o & 3) << 6 | a & 63;
  return l;
}, $f = function(r) {
  for (var e = r.length, t = [], A = 0; A < e; A += 2)
    t.push(r[A + 1] << 8 | r[A]);
  return t;
}, qf = function(r) {
  for (var e = r.length, t = [], A = 0; A < e; A += 4)
    t.push(r[A + 3] << 24 | r[A + 2] << 16 | r[A + 1] << 8 | r[A]);
  return t;
}, _t = 5, xr = 11, ms = 2, eg = xr - _t, Zo = 65536 >> _t, tg = 1 << _t, ws = tg - 1, Ag = 1024 >> _t, ig = Zo + Ag, sg = ig, rg = 32, ng = sg + rg, og = 65536 >> xr, ag = 1 << eg, lg = ag - 1, Cn = function(r, e, t) {
  return r.slice ? r.slice(e, t) : new Uint16Array(Array.prototype.slice.call(r, e, t));
}, hg = function(r, e, t) {
  return r.slice ? r.slice(e, t) : new Uint32Array(Array.prototype.slice.call(r, e, t));
}, ug = function(r, e) {
  var t = Zf(r), A = Array.isArray(t) ? qf(t) : new Uint32Array(t), i = Array.isArray(t) ? $f(t) : new Uint16Array(t), s = 24, n = Cn(i, s / 2, A[4] / 2), o = A[5] === 2 ? Cn(i, (s + A[4]) / 2) : hg(A, Math.ceil((s + A[4]) / 4));
  return new cg(A[0], A[1], A[2], A[3], n, o);
}, cg = (
  /** @class */
  function() {
    function r(e, t, A, i, s, n) {
      this.initialValue = e, this.errorValue = t, this.highStart = A, this.highValueIndex = i, this.index = s, this.data = n;
    }
    return r.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> _t], t = (t << ms) + (e & ws), this.data[t];
        if (e <= 65535)
          return t = this.index[Zo + (e - 55296 >> _t)], t = (t << ms) + (e & ws), this.data[t];
        if (e < this.highStart)
          return t = ng - og + (e >> xr), t = this.index[t], t += e >> _t & lg, t = this.index[t], t = (t << ms) + (e & ws), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, r;
  }()
), vn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", dg = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var gi = 0; gi < vn.length; gi++)
  dg[vn.charCodeAt(gi)] = gi;
var fg = 1, bs = 2, Bs = 3, En = 4, yn = 5, gg = 7, Fn = 8, Cs = 9, vs = 10, Qn = 11, Un = 12, Hn = 13, Rn = 14, Es = 15, pg = function(r) {
  for (var e = [], t = 0, A = r.length; t < A; ) {
    var i = r.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < A) {
      var s = r.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, mg = function() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, r);
  var t = r.length;
  if (!t)
    return "";
  for (var A = [], i = -1, s = ""; ++i < t; ) {
    var n = r[i];
    n <= 65535 ? A.push(n) : (n -= 65536, A.push((n >> 10) + 55296, n % 1024 + 56320)), (i + 1 === t || A.length > 16384) && (s += String.fromCharCode.apply(String, A), A.length = 0);
  }
  return s;
}, wg = ug(Yf), Ke = "×", ys = "÷", bg = function(r) {
  return wg.get(r);
}, Bg = function(r, e, t) {
  var A = t - 2, i = e[A], s = e[t - 1], n = e[t];
  if (s === bs && n === Bs)
    return Ke;
  if (s === bs || s === Bs || s === En || n === bs || n === Bs || n === En)
    return ys;
  if (s === Fn && [Fn, Cs, Qn, Un].indexOf(n) !== -1 || (s === Qn || s === Cs) && (n === Cs || n === vs) || (s === Un || s === vs) && n === vs || n === Hn || n === yn || n === gg || s === fg)
    return Ke;
  if (s === Hn && n === Rn) {
    for (; i === yn; )
      i = e[--A];
    if (i === Rn)
      return Ke;
  }
  if (s === Es && n === Es) {
    for (var o = 0; i === Es; )
      o++, i = e[--A];
    if (o % 2 === 0)
      return Ke;
  }
  return ys;
}, Cg = function(r) {
  var e = pg(r), t = e.length, A = 0, i = 0, s = e.map(bg);
  return {
    next: function() {
      if (A >= t)
        return { done: !0, value: null };
      for (var n = Ke; A < t && (n = Bg(e, s, ++A)) === Ke; )
        ;
      if (n !== Ke || A === t) {
        var o = mg.apply(null, e.slice(i, A));
        return i = A, { value: o, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, vg = function(r) {
  for (var e = Cg(r), t = [], A; !(A = e.next()).done; )
    A.value && t.push(A.value.slice());
  return t;
}, Eg = function(r) {
  var e = 123;
  if (r.createRange) {
    var t = r.createRange();
    if (t.getBoundingClientRect) {
      var A = r.createElement("boundtest");
      A.style.height = e + "px", A.style.display = "block", r.body.appendChild(A), t.selectNode(A);
      var i = t.getBoundingClientRect(), s = Math.round(i.height);
      if (r.body.removeChild(A), s === e)
        return !0;
    }
  }
  return !1;
}, yg = function(r) {
  var e = r.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", r.body.appendChild(e);
  var t = r.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var A = e.firstChild, i = Oi(A.data).map(function(a) {
    return fe(a);
  }), s = 0, n = {}, o = i.every(function(a, l) {
    t.setStart(A, s), t.setEnd(A, s + a.length);
    var h = t.getBoundingClientRect();
    s += a.length;
    var u = h.x > n.x || h.y > n.y;
    return n = h, l === 0 ? !0 : u;
  });
  return r.body.removeChild(e), o;
}, Fg = function() {
  return typeof new Image().crossOrigin < "u";
}, Qg = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, Ug = function(r) {
  var e = new Image(), t = r.createElement("canvas"), A = t.getContext("2d");
  if (!A)
    return !1;
  e.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
  try {
    A.drawImage(e, 0, 0), t.toDataURL();
  } catch {
    return !1;
  }
  return !0;
}, xn = function(r) {
  return r[0] === 0 && r[1] === 255 && r[2] === 0 && r[3] === 255;
}, Hg = function(r) {
  var e = r.createElement("canvas"), t = 100;
  e.width = t, e.height = t;
  var A = e.getContext("2d");
  if (!A)
    return Promise.reject(!1);
  A.fillStyle = "rgb(0, 255, 0)", A.fillRect(0, 0, t, t);
  var i = new Image(), s = e.toDataURL();
  i.src = s;
  var n = br(t, t, 0, 0, i);
  return A.fillStyle = "red", A.fillRect(0, 0, t, t), Tn(n).then(function(o) {
    A.drawImage(o, 0, 0);
    var a = A.getImageData(0, 0, t, t).data;
    A.fillStyle = "red", A.fillRect(0, 0, t, t);
    var l = r.createElement("div");
    return l.style.backgroundImage = "url(" + s + ")", l.style.height = t + "px", xn(a) ? Tn(br(t, t, 0, 0, l)) : Promise.reject(!1);
  }).then(function(o) {
    return A.drawImage(o, 0, 0), xn(A.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, br = function(r, e, t, A, i) {
  var s = "http://www.w3.org/2000/svg", n = document.createElementNS(s, "svg"), o = document.createElementNS(s, "foreignObject");
  return n.setAttributeNS(null, "width", r.toString()), n.setAttributeNS(null, "height", e.toString()), o.setAttributeNS(null, "width", "100%"), o.setAttributeNS(null, "height", "100%"), o.setAttributeNS(null, "x", t.toString()), o.setAttributeNS(null, "y", A.toString()), o.setAttributeNS(null, "externalResourcesRequired", "true"), n.appendChild(o), o.appendChild(i), n;
}, Tn = function(r) {
  return new Promise(function(e, t) {
    var A = new Image();
    A.onload = function() {
      return e(A);
    }, A.onerror = t, A.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(r));
  });
}, ve = {
  get SUPPORT_RANGE_BOUNDS() {
    var r = Eg(document);
    return Object.defineProperty(ve, "SUPPORT_RANGE_BOUNDS", { value: r }), r;
  },
  get SUPPORT_WORD_BREAKING() {
    var r = ve.SUPPORT_RANGE_BOUNDS && yg(document);
    return Object.defineProperty(ve, "SUPPORT_WORD_BREAKING", { value: r }), r;
  },
  get SUPPORT_SVG_DRAWING() {
    var r = Ug(document);
    return Object.defineProperty(ve, "SUPPORT_SVG_DRAWING", { value: r }), r;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var r = typeof Array.from == "function" && typeof window.fetch == "function" ? Hg(document) : Promise.resolve(!1);
    return Object.defineProperty(ve, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: r }), r;
  },
  get SUPPORT_CORS_IMAGES() {
    var r = Fg();
    return Object.defineProperty(ve, "SUPPORT_CORS_IMAGES", { value: r }), r;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var r = Qg();
    return Object.defineProperty(ve, "SUPPORT_RESPONSE_TYPE", { value: r }), r;
  },
  get SUPPORT_CORS_XHR() {
    var r = "withCredentials" in new XMLHttpRequest();
    return Object.defineProperty(ve, "SUPPORT_CORS_XHR", { value: r }), r;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var r = !!(typeof Intl < "u" && Intl.Segmenter);
    return Object.defineProperty(ve, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: r }), r;
  }
}, RA = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.text = e, this.bounds = t;
    }
    return r;
  }()
), Rg = function(r, e, t, A) {
  var i = Lg(e, t), s = [], n = 0;
  return i.forEach(function(o) {
    if (t.textDecorationLine.length || o.trim().length > 0)
      if (ve.SUPPORT_RANGE_BOUNDS) {
        var a = Ln(A, n, o.length).getClientRects();
        if (a.length > 1) {
          var l = Tr(o), h = 0;
          l.forEach(function(c) {
            s.push(new RA(c, ot.fromDOMRectList(r, Ln(A, h + n, c.length).getClientRects()))), h += c.length;
          });
        } else
          s.push(new RA(o, ot.fromDOMRectList(r, a)));
      } else {
        var u = A.splitText(o.length);
        s.push(new RA(o, xg(r, A))), A = u;
      }
    else ve.SUPPORT_RANGE_BOUNDS || (A = A.splitText(o.length));
    n += o.length;
  }), s;
}, xg = function(r, e) {
  var t = e.ownerDocument;
  if (t) {
    var A = t.createElement("html2canvaswrapper");
    A.appendChild(e.cloneNode(!0));
    var i = e.parentNode;
    if (i) {
      i.replaceChild(A, e);
      var s = _i(r, A);
      return A.firstChild && i.replaceChild(A.firstChild, A), s;
    }
  }
  return ot.EMPTY;
}, Ln = function(r, e, t) {
  var A = r.ownerDocument;
  if (!A)
    throw new Error("Node has no owner document");
  var i = A.createRange();
  return i.setStart(r, e), i.setEnd(r, e + t), i;
}, Tr = function(r) {
  if (ve.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var e = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(e.segment(r)).map(function(t) {
      return t.segment;
    });
  }
  return vg(r);
}, Tg = function(r, e) {
  if (ve.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(r)).map(function(A) {
      return A.segment;
    });
  }
  return Mg(r, e);
}, Lg = function(r, e) {
  return e.letterSpacing !== 0 ? Tr(r) : Tg(r, e);
}, Ig = [32, 160, 4961, 65792, 65793, 4153, 4241], Mg = function(r, e) {
  for (var t = nc(r, {
    lineBreak: e.lineBreak,
    wordBreak: e.overflowWrap === "break-word" ? "break-word" : e.wordBreak
  }), A = [], i, s = function() {
    if (i.value) {
      var n = i.value.slice(), o = Oi(n), a = "";
      o.forEach(function(l) {
        Ig.indexOf(l) === -1 ? a += fe(l) : (a.length && A.push(a), A.push(fe(l)), a = "");
      }), a.length && A.push(a);
    }
  }; !(i = t.next()).done; )
    s();
  return A;
}, Dg = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t, A) {
      this.text = Sg(t.data, A.textTransform), this.textBounds = Rg(e, this.text, A, t);
    }
    return r;
  }()
), Sg = function(r, e) {
  switch (e) {
    case 1:
      return r.toLowerCase();
    case 3:
      return r.replace(kg, _g);
    case 2:
      return r.toUpperCase();
    default:
      return r;
  }
}, kg = /(^|\s|:|-|\(|\))([a-z])/g, _g = function(r, e, t) {
  return r.length > 0 ? e + t.toUpperCase() : r;
}, $o = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.src = A.currentSrc || A.src, i.intrinsicWidth = A.naturalWidth, i.intrinsicHeight = A.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return e;
  }(qe)
), qo = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.canvas = A, i.intrinsicWidth = A.width, i.intrinsicHeight = A.height, i;
    }
    return e;
  }(qe)
), ea = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this, s = new XMLSerializer(), n = _i(t, A);
      return A.setAttribute("width", n.width + "px"), A.setAttribute("height", n.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(A)), i.intrinsicWidth = A.width.baseVal.value, i.intrinsicHeight = A.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return e;
  }(qe)
), ta = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.value = A.value, i;
    }
    return e;
  }(qe)
), Br = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.start = A.start, i.reversed = typeof A.reversed == "boolean" && A.reversed === !0, i;
    }
    return e;
  }(qe)
), Og = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], Kg = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], Pg = function(r) {
  return r.width > r.height ? new ot(r.left + (r.width - r.height) / 2, r.top, r.height, r.height) : r.width < r.height ? new ot(r.left, r.top + (r.height - r.width) / 2, r.width, r.width) : r;
}, Vg = function(r) {
  var e = r.type === Ng ? new Array(r.value.length + 1).join("•") : r.value;
  return e.length === 0 ? r.placeholder || "" : e;
}, Hi = "checkbox", Ri = "radio", Ng = "password", In = 707406591, Lr = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      switch (i.type = A.type.toLowerCase(), i.checked = A.checked, i.value = Vg(A), (i.type === Hi || i.type === Ri) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = Pg(i.bounds)), i.type) {
        case Hi:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = Og;
          break;
        case Ri:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = Kg;
          break;
      }
      return i;
    }
    return e;
  }(qe)
), Aa = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this, s = A.options[A.selectedIndex || 0];
      return i.value = s && s.text || "", i;
    }
    return e;
  }(qe)
), ia = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.value = A.value, i;
    }
    return e;
  }(qe)
), sa = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      i.src = A.src, i.width = parseInt(A.width, 10) || 0, i.height = parseInt(A.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (A.contentWindow && A.contentWindow.document && A.contentWindow.document.documentElement) {
          i.tree = na(t, A.contentWindow.document.documentElement);
          var s = A.contentWindow.document.documentElement ? UA(t, getComputedStyle(A.contentWindow.document.documentElement).backgroundColor) : nt.TRANSPARENT, n = A.contentWindow.document.body ? UA(t, getComputedStyle(A.contentWindow.document.body).backgroundColor) : nt.TRANSPARENT;
          i.backgroundColor = Ft(s) ? Ft(n) ? i.styles.backgroundColor : n : s;
        }
      } catch {
      }
      return i;
    }
    return e;
  }(qe)
), zg = ["OL", "UL", "MENU"], Ei = function(r, e, t, A) {
  for (var i = e.firstChild, s = void 0; i; i = s)
    if (s = i.nextSibling, oa(i) && i.data.trim().length > 0)
      t.textNodes.push(new Dg(r, i, t.styles));
    else if ($t(i))
      if (ua(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(o) {
          return Ei(r, o, t, A);
        });
      else {
        var n = ra(r, i);
        n.styles.isVisible() && (Gg(i, n, A) ? n.flags |= 4 : Wg(n.styles) && (n.flags |= 2), zg.indexOf(i.tagName) !== -1 && (n.flags |= 8), t.elements.push(n), i.slot, i.shadowRoot ? Ei(r, i.shadowRoot, n, A) : !xi(i) && !aa(i) && !Ti(i) && Ei(r, i, n, A));
      }
}, ra = function(r, e) {
  return vr(e) ? new $o(r, e) : la(e) ? new qo(r, e) : aa(e) ? new ea(r, e) : Xg(e) ? new ta(r, e) : Jg(e) ? new Br(r, e) : jg(e) ? new Lr(r, e) : Ti(e) ? new Aa(r, e) : xi(e) ? new ia(r, e) : ha(e) ? new sa(r, e) : new qe(r, e);
}, na = function(r, e) {
  var t = ra(r, e);
  return t.flags |= 4, Ei(r, e, t, t), t;
}, Gg = function(r, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || Ir(r) && t.styles.isTransparent();
}, Wg = function(r) {
  return r.isPositioned() || r.isFloating();
}, oa = function(r) {
  return r.nodeType === Node.TEXT_NODE;
}, $t = function(r) {
  return r.nodeType === Node.ELEMENT_NODE;
}, Cr = function(r) {
  return $t(r) && typeof r.style < "u" && !yi(r);
}, yi = function(r) {
  return typeof r.className == "object";
}, Xg = function(r) {
  return r.tagName === "LI";
}, Jg = function(r) {
  return r.tagName === "OL";
}, jg = function(r) {
  return r.tagName === "INPUT";
}, Yg = function(r) {
  return r.tagName === "HTML";
}, aa = function(r) {
  return r.tagName === "svg";
}, Ir = function(r) {
  return r.tagName === "BODY";
}, la = function(r) {
  return r.tagName === "CANVAS";
}, Mn = function(r) {
  return r.tagName === "VIDEO";
}, vr = function(r) {
  return r.tagName === "IMG";
}, ha = function(r) {
  return r.tagName === "IFRAME";
}, Dn = function(r) {
  return r.tagName === "STYLE";
}, Zg = function(r) {
  return r.tagName === "SCRIPT";
}, xi = function(r) {
  return r.tagName === "TEXTAREA";
}, Ti = function(r) {
  return r.tagName === "SELECT";
}, ua = function(r) {
  return r.tagName === "SLOT";
}, Sn = function(r) {
  return r.tagName.indexOf("-") > 0;
}, $g = (
  /** @class */
  function() {
    function r() {
      this.counters = {};
    }
    return r.prototype.getCounterValue = function(e) {
      var t = this.counters[e];
      return t && t.length ? t[t.length - 1] : 1;
    }, r.prototype.getCounterValues = function(e) {
      var t = this.counters[e];
      return t || [];
    }, r.prototype.pop = function(e) {
      var t = this;
      e.forEach(function(A) {
        return t.counters[A].pop();
      });
    }, r.prototype.parse = function(e) {
      var t = this, A = e.counterIncrement, i = e.counterReset, s = !0;
      A !== null && A.forEach(function(o) {
        var a = t.counters[o.counter];
        a && o.increment !== 0 && (s = !1, a.length || a.push(1), a[Math.max(0, a.length - 1)] += o.increment);
      });
      var n = [];
      return s && i.forEach(function(o) {
        var a = t.counters[o.counter];
        n.push(o.counter), a || (a = t.counters[o.counter] = []), a.push(o.reset);
      }), n;
    }, r;
  }()
), kn = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, _n = {
  integers: [
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "Ք",
    "Փ",
    "Ւ",
    "Ց",
    "Ր",
    "Տ",
    "Վ",
    "Ս",
    "Ռ",
    "Ջ",
    "Պ",
    "Չ",
    "Ո",
    "Շ",
    "Ն",
    "Յ",
    "Մ",
    "Ճ",
    "Ղ",
    "Ձ",
    "Հ",
    "Կ",
    "Ծ",
    "Խ",
    "Լ",
    "Ի",
    "Ժ",
    "Թ",
    "Ը",
    "Է",
    "Զ",
    "Ե",
    "Դ",
    "Գ",
    "Բ",
    "Ա"
  ]
}, qg = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    19,
    18,
    17,
    16,
    15,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "י׳",
    "ט׳",
    "ח׳",
    "ז׳",
    "ו׳",
    "ה׳",
    "ד׳",
    "ג׳",
    "ב׳",
    "א׳",
    "ת",
    "ש",
    "ר",
    "ק",
    "צ",
    "פ",
    "ע",
    "ס",
    "נ",
    "מ",
    "ל",
    "כ",
    "יט",
    "יח",
    "יז",
    "טז",
    "טו",
    "י",
    "ט",
    "ח",
    "ז",
    "ו",
    "ה",
    "ד",
    "ג",
    "ב",
    "א"
  ]
}, ep = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "ჵ",
    "ჰ",
    "ჯ",
    "ჴ",
    "ხ",
    "ჭ",
    "წ",
    "ძ",
    "ც",
    "ჩ",
    "შ",
    "ყ",
    "ღ",
    "ქ",
    "ფ",
    "ჳ",
    "ტ",
    "ს",
    "რ",
    "ჟ",
    "პ",
    "ო",
    "ჲ",
    "ნ",
    "მ",
    "ლ",
    "კ",
    "ი",
    "თ",
    "ჱ",
    "ზ",
    "ვ",
    "ე",
    "დ",
    "გ",
    "ბ",
    "ა"
  ]
}, Wt = function(r, e, t, A, i, s) {
  return r < e || r > t ? _A(r, i, s.length > 0) : A.integers.reduce(function(n, o, a) {
    for (; r >= o; )
      r -= o, n += A.values[a];
    return n;
  }, "") + s;
}, ca = function(r, e, t, A) {
  var i = "";
  do
    t || r--, i = A(r) + i, r /= e;
  while (r * e >= e);
  return i;
}, de = function(r, e, t, A, i) {
  var s = t - e + 1;
  return (r < 0 ? "-" : "") + (ca(Math.abs(r), s, A, function(n) {
    return fe(Math.floor(n % s) + e);
  }) + i);
}, xt = function(r, e, t) {
  t === void 0 && (t = ". ");
  var A = e.length;
  return ca(Math.abs(r), A, !1, function(i) {
    return e[Math.floor(i % A)];
  }) + t;
}, jt = 1, ct = 2, dt = 4, FA = 8, it = function(r, e, t, A, i, s) {
  if (r < -9999 || r > 9999)
    return _A(r, 4, i.length > 0);
  var n = Math.abs(r), o = i;
  if (n === 0)
    return e[0] + o;
  for (var a = 0; n > 0 && a <= 4; a++) {
    var l = n % 10;
    l === 0 && we(s, jt) && o !== "" ? o = e[l] + o : l > 1 || l === 1 && a === 0 || l === 1 && a === 1 && we(s, ct) || l === 1 && a === 1 && we(s, dt) && r > 100 || l === 1 && a > 1 && we(s, FA) ? o = e[l] + (a > 0 ? t[a - 1] : "") + o : l === 1 && a > 0 && (o = t[a - 1] + o), n = Math.floor(n / 10);
  }
  return (r < 0 ? A : "") + o;
}, On = "十百千萬", Kn = "拾佰仟萬", Pn = "マイナス", Fs = "마이너스", _A = function(r, e, t) {
  var A = t ? ". " : "", i = t ? "、" : "", s = t ? ", " : "", n = t ? " " : "";
  switch (e) {
    case 0:
      return "•" + n;
    case 1:
      return "◦" + n;
    case 2:
      return "◾" + n;
    case 5:
      var o = de(r, 48, 57, !0, A);
      return o.length < 4 ? "0" + o : o;
    case 4:
      return xt(r, "〇一二三四五六七八九", i);
    case 6:
      return Wt(r, 1, 3999, kn, 3, A).toLowerCase();
    case 7:
      return Wt(r, 1, 3999, kn, 3, A);
    case 8:
      return de(r, 945, 969, !1, A);
    case 9:
      return de(r, 97, 122, !1, A);
    case 10:
      return de(r, 65, 90, !1, A);
    case 11:
      return de(r, 1632, 1641, !0, A);
    case 12:
    case 49:
      return Wt(r, 1, 9999, _n, 3, A);
    case 35:
      return Wt(r, 1, 9999, _n, 3, A).toLowerCase();
    case 13:
      return de(r, 2534, 2543, !0, A);
    case 14:
    case 30:
      return de(r, 6112, 6121, !0, A);
    case 15:
      return xt(r, "子丑寅卯辰巳午未申酉戌亥", i);
    case 16:
      return xt(r, "甲乙丙丁戊己庚辛壬癸", i);
    case 17:
    case 48:
      return it(r, "零一二三四五六七八九", On, "負", i, ct | dt | FA);
    case 47:
      return it(r, "零壹貳參肆伍陸柒捌玖", Kn, "負", i, jt | ct | dt | FA);
    case 42:
      return it(r, "零一二三四五六七八九", On, "负", i, ct | dt | FA);
    case 41:
      return it(r, "零壹贰叁肆伍陆柒捌玖", Kn, "负", i, jt | ct | dt | FA);
    case 26:
      return it(r, "〇一二三四五六七八九", "十百千万", Pn, i, 0);
    case 25:
      return it(r, "零壱弐参四伍六七八九", "拾百千万", Pn, i, jt | ct | dt);
    case 31:
      return it(r, "영일이삼사오육칠팔구", "십백천만", Fs, s, jt | ct | dt);
    case 33:
      return it(r, "零一二三四五六七八九", "十百千萬", Fs, s, 0);
    case 32:
      return it(r, "零壹貳參四五六七八九", "拾百千", Fs, s, jt | ct | dt);
    case 18:
      return de(r, 2406, 2415, !0, A);
    case 20:
      return Wt(r, 1, 19999, ep, 3, A);
    case 21:
      return de(r, 2790, 2799, !0, A);
    case 22:
      return de(r, 2662, 2671, !0, A);
    case 22:
      return Wt(r, 1, 10999, qg, 3, A);
    case 23:
      return xt(r, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return xt(r, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return de(r, 3302, 3311, !0, A);
    case 28:
      return xt(r, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", i);
    case 29:
      return xt(r, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", i);
    case 34:
      return de(r, 3792, 3801, !0, A);
    case 37:
      return de(r, 6160, 6169, !0, A);
    case 38:
      return de(r, 4160, 4169, !0, A);
    case 39:
      return de(r, 2918, 2927, !0, A);
    case 40:
      return de(r, 1776, 1785, !0, A);
    case 43:
      return de(r, 3046, 3055, !0, A);
    case 44:
      return de(r, 3174, 3183, !0, A);
    case 45:
      return de(r, 3664, 3673, !0, A);
    case 46:
      return de(r, 3872, 3881, !0, A);
    case 3:
    default:
      return de(r, 48, 57, !0, A);
  }
}, da = "data-html2canvas-ignore", Vn = (
  /** @class */
  function() {
    function r(e, t, A) {
      if (this.context = e, this.options = A, this.scrolledElements = [], this.referenceElement = t, this.counters = new $g(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return r.prototype.toIFrame = function(e, t) {
      var A = this, i = tp(e, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var s = e.defaultView.pageXOffset, n = e.defaultView.pageYOffset, o = i.contentWindow, a = o.document, l = sp(i).then(function() {
        return Te(A, void 0, void 0, function() {
          var h, u;
          return Ue(this, function(c) {
            switch (c.label) {
              case 0:
                return this.scrolledElements.forEach(ap), o && (o.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (o.scrollY !== t.top || o.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(o.scrollX - t.left, o.scrollY - t.top, 0, 0))), h = this.options.onclone, u = this.clonedReferenceElement, typeof u > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : a.fonts && a.fonts.ready ? [4, a.fonts.ready] : [3, 2];
              case 1:
                c.sent(), c.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, ip(a)] : [3, 4];
              case 3:
                c.sent(), c.label = 4;
              case 4:
                return typeof h == "function" ? [2, Promise.resolve().then(function() {
                  return h(a, u);
                }).then(function() {
                  return i;
                })] : [2, i];
            }
          });
        });
      });
      return a.open(), a.write(np(document.doctype) + "<html></html>"), op(this.referenceElement.ownerDocument, s, n), a.replaceChild(a.adoptNode(this.documentElement), a.documentElement), a.close(), l;
    }, r.prototype.createElementClone = function(e) {
      if (wr(
        e,
        2
        /* CLONE */
      ))
        debugger;
      if (la(e))
        return this.createCanvasClone(e);
      if (Mn(e))
        return this.createVideoClone(e);
      if (Dn(e))
        return this.createStyleClone(e);
      var t = e.cloneNode(!1);
      return vr(t) && (vr(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), Sn(t) ? this.createCustomElementClone(t) : t;
    }, r.prototype.createCustomElementClone = function(e) {
      var t = document.createElement("html2canvascustomelement");
      return Qs(e.style, t), t;
    }, r.prototype.createStyleClone = function(e) {
      try {
        var t = e.sheet;
        if (t && t.cssRules) {
          var A = [].slice.call(t.cssRules, 0).reduce(function(s, n) {
            return n && typeof n.cssText == "string" ? s + n.cssText : s;
          }, ""), i = e.cloneNode(!1);
          return i.textContent = A, i;
        }
      } catch (s) {
        if (this.context.logger.error("Unable to access cssRules property", s), s.name !== "SecurityError")
          throw s;
      }
      return e.cloneNode(!1);
    }, r.prototype.createCanvasClone = function(e) {
      var t;
      if (this.options.inlineImages && e.ownerDocument) {
        var A = e.ownerDocument.createElement("img");
        try {
          return A.src = e.toDataURL(), A;
        } catch {
          this.context.logger.info("Unable to inline canvas contents, canvas is tainted", e);
        }
      }
      var i = e.cloneNode(!1);
      try {
        i.width = e.width, i.height = e.height;
        var s = e.getContext("2d"), n = i.getContext("2d");
        if (n)
          if (!this.options.allowTaint && s)
            n.putImageData(s.getImageData(0, 0, e.width, e.height), 0, 0);
          else {
            var o = (t = e.getContext("webgl2")) !== null && t !== void 0 ? t : e.getContext("webgl");
            if (o) {
              var a = o.getContextAttributes();
              (a == null ? void 0 : a.preserveDrawingBuffer) === !1 && this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", e);
            }
            n.drawImage(e, 0, 0);
          }
        return i;
      } catch {
        this.context.logger.info("Unable to clone canvas as it is tainted", e);
      }
      return i;
    }, r.prototype.createVideoClone = function(e) {
      var t = e.ownerDocument.createElement("canvas");
      t.width = e.offsetWidth, t.height = e.offsetHeight;
      var A = t.getContext("2d");
      try {
        return A && (A.drawImage(e, 0, 0, t.width, t.height), this.options.allowTaint || A.getImageData(0, 0, t.width, t.height)), t;
      } catch {
        this.context.logger.info("Unable to clone video as it is tainted", e);
      }
      var i = e.ownerDocument.createElement("canvas");
      return i.width = e.offsetWidth, i.height = e.offsetHeight, i;
    }, r.prototype.appendChildNode = function(e, t, A) {
      (!$t(t) || !Zg(t) && !t.hasAttribute(da) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !$t(t) || !Dn(t)) && e.appendChild(this.cloneNode(t, A));
    }, r.prototype.cloneChildNodes = function(e, t, A) {
      for (var i = this, s = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; s; s = s.nextSibling)
        if ($t(s) && ua(s) && typeof s.assignedNodes == "function") {
          var n = s.assignedNodes();
          n.length && n.forEach(function(o) {
            return i.appendChildNode(t, o, A);
          });
        } else
          this.appendChildNode(t, s, A);
    }, r.prototype.cloneNode = function(e, t) {
      if (oa(e))
        return document.createTextNode(e.data);
      if (!e.ownerDocument)
        return e.cloneNode(!1);
      var A = e.ownerDocument.defaultView;
      if (A && $t(e) && (Cr(e) || yi(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var s = A.getComputedStyle(e), n = A.getComputedStyle(e, ":before"), o = A.getComputedStyle(e, ":after");
        this.referenceElement === e && Cr(i) && (this.clonedReferenceElement = i), Ir(i) && up(i);
        var a = this.counters.parse(new bn(this.context, s)), l = this.resolvePseudoContent(e, i, n, xA.BEFORE);
        Sn(e) && (t = !0), Mn(e) || this.cloneChildNodes(e, i, t), l && i.insertBefore(l, i.firstChild);
        var h = this.resolvePseudoContent(e, i, o, xA.AFTER);
        return h && i.appendChild(h), this.counters.pop(a), (s && (this.options.copyStyles || yi(e)) && !ha(e) || t) && Qs(s, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (xi(e) || Ti(e)) && (xi(i) || Ti(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, r.prototype.resolvePseudoContent = function(e, t, A, i) {
      var s = this;
      if (A) {
        var n = A.content, o = t.ownerDocument;
        if (!(!o || !n || n === "none" || n === "-moz-alt-content" || A.display === "none")) {
          this.counters.parse(new bn(this.context, A));
          var a = new Xf(this.context, A), l = o.createElement("html2canvaspseudoelement");
          Qs(A, l), a.content.forEach(function(u) {
            if (u.type === 0)
              l.appendChild(o.createTextNode(u.value));
            else if (u.type === 22) {
              var c = o.createElement("img");
              c.src = u.value, c.style.opacity = "1", l.appendChild(c);
            } else if (u.type === 18) {
              if (u.name === "attr") {
                var f = u.values.filter(Ae);
                f.length && l.appendChild(o.createTextNode(e.getAttribute(f[0].value) || ""));
              } else if (u.name === "counter") {
                var w = u.values.filter(sA), b = w[0], v = w[1];
                if (b && Ae(b)) {
                  var B = s.counters.getCounterValue(b.value), y = v && Ae(v) ? mr.parse(s.context, v.value) : 3;
                  l.appendChild(o.createTextNode(_A(B, y, !1)));
                }
              } else if (u.name === "counters") {
                var D = u.values.filter(sA), b = D[0], L = D[1], v = D[2];
                if (b && Ae(b)) {
                  var R = s.counters.getCounterValues(b.value), Q = v && Ae(v) ? mr.parse(s.context, v.value) : 3, W = L && L.type === 0 ? L.value : "", K = R.map(function(S) {
                    return _A(S, Q, !1);
                  }).join(W);
                  l.appendChild(o.createTextNode(K));
                }
              }
            } else if (u.type === 20)
              switch (u.value) {
                case "open-quote":
                  l.appendChild(o.createTextNode(wn(a.quotes, s.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  l.appendChild(o.createTextNode(wn(a.quotes, --s.quoteDepth, !1)));
                  break;
                default:
                  l.appendChild(o.createTextNode(u.value));
              }
          }), l.className = Er + " " + yr;
          var h = i === xA.BEFORE ? " " + Er : " " + yr;
          return yi(t) ? t.className.baseValue += h : t.className += h, l;
        }
      }
    }, r.destroy = function(e) {
      return e.parentNode ? (e.parentNode.removeChild(e), !0) : !1;
    }, r;
  }()
), xA;
(function(r) {
  r[r.BEFORE = 0] = "BEFORE", r[r.AFTER = 1] = "AFTER";
})(xA || (xA = {}));
var tp = function(r, e) {
  var t = r.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = e.width.toString(), t.height = e.height.toString(), t.scrolling = "no", t.setAttribute(da, "true"), r.body.appendChild(t), t;
}, Ap = function(r) {
  return new Promise(function(e) {
    if (r.complete) {
      e();
      return;
    }
    if (!r.src) {
      e();
      return;
    }
    r.onload = e, r.onerror = e;
  });
}, ip = function(r) {
  return Promise.all([].slice.call(r.images, 0).map(Ap));
}, sp = function(r) {
  return new Promise(function(e, t) {
    var A = r.contentWindow;
    if (!A)
      return t("No window assigned for iframe");
    var i = A.document;
    A.onload = r.onload = function() {
      A.onload = r.onload = null;
      var s = setInterval(function() {
        i.body.childNodes.length > 0 && i.readyState === "complete" && (clearInterval(s), e(r));
      }, 50);
    };
  });
}, rp = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], Qs = function(r, e) {
  for (var t = r.length - 1; t >= 0; t--) {
    var A = r.item(t);
    rp.indexOf(A) === -1 && e.style.setProperty(A, r.getPropertyValue(A));
  }
  return e;
}, np = function(r) {
  var e = "";
  return r && (e += "<!DOCTYPE ", r.name && (e += r.name), r.internalSubset && (e += r.internalSubset), r.publicId && (e += '"' + r.publicId + '"'), r.systemId && (e += '"' + r.systemId + '"'), e += ">"), e;
}, op = function(r, e, t) {
  r && r.defaultView && (e !== r.defaultView.pageXOffset || t !== r.defaultView.pageYOffset) && r.defaultView.scrollTo(e, t);
}, ap = function(r) {
  var e = r[0], t = r[1], A = r[2];
  e.scrollLeft = t, e.scrollTop = A;
}, lp = ":before", hp = ":after", Er = "___html2canvas___pseudoelement_before", yr = "___html2canvas___pseudoelement_after", Nn = `{
    content: "" !important;
    display: none !important;
}`, up = function(r) {
  cp(r, "." + Er + lp + Nn + `
         .` + yr + hp + Nn);
}, cp = function(r, e) {
  var t = r.ownerDocument;
  if (t) {
    var A = t.createElement("style");
    A.textContent = e, r.appendChild(A);
  }
}, fa = (
  /** @class */
  function() {
    function r() {
    }
    return r.getOrigin = function(e) {
      var t = r._link;
      return t ? (t.href = e, t.href = t.href, t.protocol + t.hostname + t.port) : "about:blank";
    }, r.isSameOrigin = function(e) {
      return r.getOrigin(e) === r._origin;
    }, r.setContext = function(e) {
      r._link = e.document.createElement("a"), r._origin = r.getOrigin(e.location.href);
    }, r._origin = "about:blank", r;
  }()
), dp = (
  /** @class */
  function() {
    function r(e, t) {
      this.context = e, this._options = t, this._cache = {};
    }
    return r.prototype.addImage = function(e) {
      var t = Promise.resolve();
      return this.has(e) || (Hs(e) || mp(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, r.prototype.match = function(e) {
      return this._cache[e];
    }, r.prototype.loadImage = function(e) {
      return Te(this, void 0, void 0, function() {
        var t, A, i, s, n = this;
        return Ue(this, function(o) {
          switch (o.label) {
            case 0:
              return t = fa.isSameOrigin(e), A = !Us(e) && this._options.useCORS === !0 && ve.SUPPORT_CORS_IMAGES && !t, i = !Us(e) && !t && !Hs(e) && typeof this._options.proxy == "string" && ve.SUPPORT_CORS_XHR && !A, !t && this._options.allowTaint === !1 && !Us(e) && !Hs(e) && !i && !A ? [
                2
                /*return*/
              ] : (s = e, i ? [4, this.proxy(s)] : [3, 2]);
            case 1:
              s = o.sent(), o.label = 2;
            case 2:
              return this.context.logger.debug("Added image " + e.substring(0, 256)), [4, new Promise(function(a, l) {
                var h = new Image();
                h.onload = function() {
                  return a(h);
                }, h.onerror = l, (wp(s) || A) && (h.crossOrigin = "anonymous"), h.src = s, h.complete === !0 && setTimeout(function() {
                  return a(h);
                }, 500), n._options.imageTimeout > 0 && setTimeout(function() {
                  return l("Timed out (" + n._options.imageTimeout + "ms) loading image");
                }, n._options.imageTimeout);
              })];
            case 3:
              return [2, o.sent()];
          }
        });
      });
    }, r.prototype.has = function(e) {
      return typeof this._cache[e] < "u";
    }, r.prototype.keys = function() {
      return Promise.resolve(Object.keys(this._cache));
    }, r.prototype.proxy = function(e) {
      var t = this, A = this._options.proxy;
      if (!A)
        throw new Error("No proxy defined");
      var i = e.substring(0, 256);
      return new Promise(function(s, n) {
        var o = ve.SUPPORT_RESPONSE_TYPE ? "blob" : "text", a = new XMLHttpRequest();
        a.onload = function() {
          if (a.status === 200)
            if (o === "text")
              s(a.response);
            else {
              var u = new FileReader();
              u.addEventListener("load", function() {
                return s(u.result);
              }, !1), u.addEventListener("error", function(c) {
                return n(c);
              }, !1), u.readAsDataURL(a.response);
            }
          else
            n("Failed to proxy resource " + i + " with status code " + a.status);
        }, a.onerror = n;
        var l = A.indexOf("?") > -1 ? "&" : "?";
        if (a.open("GET", "" + A + l + "url=" + encodeURIComponent(e) + "&responseType=" + o), o !== "text" && a instanceof XMLHttpRequest && (a.responseType = o), t._options.imageTimeout) {
          var h = t._options.imageTimeout;
          a.timeout = h, a.ontimeout = function() {
            return n("Timed out (" + h + "ms) proxying " + i);
          };
        }
        a.send();
      });
    }, r;
  }()
), fp = /^data:image\/svg\+xml/i, gp = /^data:image\/.*;base64,/i, pp = /^data:image\/.*/i, mp = function(r) {
  return ve.SUPPORT_SVG_DRAWING || !bp(r);
}, Us = function(r) {
  return pp.test(r);
}, wp = function(r) {
  return gp.test(r);
}, Hs = function(r) {
  return r.substr(0, 4) === "blob";
}, bp = function(r) {
  return r.substr(-3).toLowerCase() === "svg" || fp.test(r);
}, x = (
  /** @class */
  function() {
    function r(e, t) {
      this.type = 0, this.x = e, this.y = t;
    }
    return r.prototype.add = function(e, t) {
      return new r(this.x + e, this.y + t);
    }, r;
  }()
), Xt = function(r, e, t) {
  return new x(r.x + (e.x - r.x) * t, r.y + (e.y - r.y) * t);
}, pi = (
  /** @class */
  function() {
    function r(e, t, A, i) {
      this.type = 1, this.start = e, this.startControl = t, this.endControl = A, this.end = i;
    }
    return r.prototype.subdivide = function(e, t) {
      var A = Xt(this.start, this.startControl, e), i = Xt(this.startControl, this.endControl, e), s = Xt(this.endControl, this.end, e), n = Xt(A, i, e), o = Xt(i, s, e), a = Xt(n, o, e);
      return t ? new r(this.start, A, n, a) : new r(a, o, s, this.end);
    }, r.prototype.add = function(e, t) {
      return new r(this.start.add(e, t), this.startControl.add(e, t), this.endControl.add(e, t), this.end.add(e, t));
    }, r.prototype.reverse = function() {
      return new r(this.end, this.endControl, this.startControl, this.start);
    }, r;
  }()
), Pe = function(r) {
  return r.type === 1;
}, Bp = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      var t = e.styles, A = e.bounds, i = EA(t.borderTopLeftRadius, A.width, A.height), s = i[0], n = i[1], o = EA(t.borderTopRightRadius, A.width, A.height), a = o[0], l = o[1], h = EA(t.borderBottomRightRadius, A.width, A.height), u = h[0], c = h[1], f = EA(t.borderBottomLeftRadius, A.width, A.height), w = f[0], b = f[1], v = [];
      v.push((s + a) / A.width), v.push((w + u) / A.width), v.push((n + b) / A.height), v.push((l + c) / A.height);
      var B = Math.max.apply(Math, v);
      B > 1 && (s /= B, n /= B, a /= B, l /= B, u /= B, c /= B, w /= B, b /= B);
      var y = A.width - a, D = A.height - c, L = A.width - u, R = A.height - b, Q = t.borderTopWidth, W = t.borderRightWidth, K = t.borderBottomWidth, P = t.borderLeftWidth, oe = ne(t.paddingTop, e.bounds.width), S = ne(t.paddingRight, e.bounds.width), N = ne(t.paddingBottom, e.bounds.width), q = ne(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = s > 0 || n > 0 ? ae(A.left + P / 3, A.top + Q / 3, s - P / 3, n - Q / 3, ee.TOP_LEFT) : new x(A.left + P / 3, A.top + Q / 3), this.topRightBorderDoubleOuterBox = s > 0 || n > 0 ? ae(A.left + y, A.top + Q / 3, a - W / 3, l - Q / 3, ee.TOP_RIGHT) : new x(A.left + A.width - W / 3, A.top + Q / 3), this.bottomRightBorderDoubleOuterBox = u > 0 || c > 0 ? ae(A.left + L, A.top + D, u - W / 3, c - K / 3, ee.BOTTOM_RIGHT) : new x(A.left + A.width - W / 3, A.top + A.height - K / 3), this.bottomLeftBorderDoubleOuterBox = w > 0 || b > 0 ? ae(A.left + P / 3, A.top + R, w - P / 3, b - K / 3, ee.BOTTOM_LEFT) : new x(A.left + P / 3, A.top + A.height - K / 3), this.topLeftBorderDoubleInnerBox = s > 0 || n > 0 ? ae(A.left + P * 2 / 3, A.top + Q * 2 / 3, s - P * 2 / 3, n - Q * 2 / 3, ee.TOP_LEFT) : new x(A.left + P * 2 / 3, A.top + Q * 2 / 3), this.topRightBorderDoubleInnerBox = s > 0 || n > 0 ? ae(A.left + y, A.top + Q * 2 / 3, a - W * 2 / 3, l - Q * 2 / 3, ee.TOP_RIGHT) : new x(A.left + A.width - W * 2 / 3, A.top + Q * 2 / 3), this.bottomRightBorderDoubleInnerBox = u > 0 || c > 0 ? ae(A.left + L, A.top + D, u - W * 2 / 3, c - K * 2 / 3, ee.BOTTOM_RIGHT) : new x(A.left + A.width - W * 2 / 3, A.top + A.height - K * 2 / 3), this.bottomLeftBorderDoubleInnerBox = w > 0 || b > 0 ? ae(A.left + P * 2 / 3, A.top + R, w - P * 2 / 3, b - K * 2 / 3, ee.BOTTOM_LEFT) : new x(A.left + P * 2 / 3, A.top + A.height - K * 2 / 3), this.topLeftBorderStroke = s > 0 || n > 0 ? ae(A.left + P / 2, A.top + Q / 2, s - P / 2, n - Q / 2, ee.TOP_LEFT) : new x(A.left + P / 2, A.top + Q / 2), this.topRightBorderStroke = s > 0 || n > 0 ? ae(A.left + y, A.top + Q / 2, a - W / 2, l - Q / 2, ee.TOP_RIGHT) : new x(A.left + A.width - W / 2, A.top + Q / 2), this.bottomRightBorderStroke = u > 0 || c > 0 ? ae(A.left + L, A.top + D, u - W / 2, c - K / 2, ee.BOTTOM_RIGHT) : new x(A.left + A.width - W / 2, A.top + A.height - K / 2), this.bottomLeftBorderStroke = w > 0 || b > 0 ? ae(A.left + P / 2, A.top + R, w - P / 2, b - K / 2, ee.BOTTOM_LEFT) : new x(A.left + P / 2, A.top + A.height - K / 2), this.topLeftBorderBox = s > 0 || n > 0 ? ae(A.left, A.top, s, n, ee.TOP_LEFT) : new x(A.left, A.top), this.topRightBorderBox = a > 0 || l > 0 ? ae(A.left + y, A.top, a, l, ee.TOP_RIGHT) : new x(A.left + A.width, A.top), this.bottomRightBorderBox = u > 0 || c > 0 ? ae(A.left + L, A.top + D, u, c, ee.BOTTOM_RIGHT) : new x(A.left + A.width, A.top + A.height), this.bottomLeftBorderBox = w > 0 || b > 0 ? ae(A.left, A.top + R, w, b, ee.BOTTOM_LEFT) : new x(A.left, A.top + A.height), this.topLeftPaddingBox = s > 0 || n > 0 ? ae(A.left + P, A.top + Q, Math.max(0, s - P), Math.max(0, n - Q), ee.TOP_LEFT) : new x(A.left + P, A.top + Q), this.topRightPaddingBox = a > 0 || l > 0 ? ae(A.left + Math.min(y, A.width - W), A.top + Q, y > A.width + W ? 0 : Math.max(0, a - W), Math.max(0, l - Q), ee.TOP_RIGHT) : new x(A.left + A.width - W, A.top + Q), this.bottomRightPaddingBox = u > 0 || c > 0 ? ae(A.left + Math.min(L, A.width - P), A.top + Math.min(D, A.height - K), Math.max(0, u - W), Math.max(0, c - K), ee.BOTTOM_RIGHT) : new x(A.left + A.width - W, A.top + A.height - K), this.bottomLeftPaddingBox = w > 0 || b > 0 ? ae(A.left + P, A.top + Math.min(R, A.height - K), Math.max(0, w - P), Math.max(0, b - K), ee.BOTTOM_LEFT) : new x(A.left + P, A.top + A.height - K), this.topLeftContentBox = s > 0 || n > 0 ? ae(A.left + P + q, A.top + Q + oe, Math.max(0, s - (P + q)), Math.max(0, n - (Q + oe)), ee.TOP_LEFT) : new x(A.left + P + q, A.top + Q + oe), this.topRightContentBox = a > 0 || l > 0 ? ae(A.left + Math.min(y, A.width + P + q), A.top + Q + oe, y > A.width + P + q ? 0 : a - P + q, l - (Q + oe), ee.TOP_RIGHT) : new x(A.left + A.width - (W + S), A.top + Q + oe), this.bottomRightContentBox = u > 0 || c > 0 ? ae(A.left + Math.min(L, A.width - (P + q)), A.top + Math.min(D, A.height + Q + oe), Math.max(0, u - (W + S)), c - (K + N), ee.BOTTOM_RIGHT) : new x(A.left + A.width - (W + S), A.top + A.height - (K + N)), this.bottomLeftContentBox = w > 0 || b > 0 ? ae(A.left + P + q, A.top + R, Math.max(0, w - (P + q)), b - (K + N), ee.BOTTOM_LEFT) : new x(A.left + P + q, A.top + A.height - (K + N));
    }
    return r;
  }()
), ee;
(function(r) {
  r[r.TOP_LEFT = 0] = "TOP_LEFT", r[r.TOP_RIGHT = 1] = "TOP_RIGHT", r[r.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", r[r.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(ee || (ee = {}));
var ae = function(r, e, t, A, i) {
  var s = 4 * ((Math.sqrt(2) - 1) / 3), n = t * s, o = A * s, a = r + t, l = e + A;
  switch (i) {
    case ee.TOP_LEFT:
      return new pi(new x(r, l), new x(r, l - o), new x(a - n, e), new x(a, e));
    case ee.TOP_RIGHT:
      return new pi(new x(r, e), new x(r + n, e), new x(a, l - o), new x(a, l));
    case ee.BOTTOM_RIGHT:
      return new pi(new x(a, e), new x(a, e + o), new x(r + n, l), new x(r, l));
    case ee.BOTTOM_LEFT:
    default:
      return new pi(new x(a, l), new x(a - n, l), new x(r, e + o), new x(r, e));
  }
}, Li = function(r) {
  return [r.topLeftBorderBox, r.topRightBorderBox, r.bottomRightBorderBox, r.bottomLeftBorderBox];
}, Cp = function(r) {
  return [
    r.topLeftContentBox,
    r.topRightContentBox,
    r.bottomRightContentBox,
    r.bottomLeftContentBox
  ];
}, Ii = function(r) {
  return [
    r.topLeftPaddingBox,
    r.topRightPaddingBox,
    r.bottomRightPaddingBox,
    r.bottomLeftPaddingBox
  ];
}, vp = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t, A) {
      this.offsetX = e, this.offsetY = t, this.matrix = A, this.type = 0, this.target = 6;
    }
    return r;
  }()
), mi = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.path = e, this.target = t, this.type = 1;
    }
    return r;
  }()
), Ep = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.opacity = e, this.type = 2, this.target = 6;
    }
    return r;
  }()
), yp = function(r) {
  return r.type === 0;
}, ga = function(r) {
  return r.type === 1;
}, Fp = function(r) {
  return r.type === 2;
}, zn = function(r, e) {
  return r.length === e.length ? r.some(function(t, A) {
    return t === e[A];
  }) : !1;
}, Qp = function(r, e, t, A, i) {
  return r.map(function(s, n) {
    switch (n) {
      case 0:
        return s.add(e, t);
      case 1:
        return s.add(e + A, t);
      case 2:
        return s.add(e + A, t + i);
      case 3:
        return s.add(e, t + i);
    }
    return s;
  });
}, pa = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.element = e, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return r;
  }()
), ma = (
  /** @class */
  function() {
    function r(e, t) {
      if (this.container = e, this.parent = t, this.effects = [], this.curves = new Bp(this.container), this.container.styles.opacity < 1 && this.effects.push(new Ep(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var A = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, s = this.container.styles.transform;
        this.effects.push(new vp(A, i, s));
      }
      if (this.container.styles.overflowX !== 0) {
        var n = Li(this.curves), o = Ii(this.curves);
        zn(n, o) ? this.effects.push(new mi(
          n,
          6
          /* CONTENT */
        )) : (this.effects.push(new mi(
          n,
          2
          /* BACKGROUND_BORDERS */
        )), this.effects.push(new mi(
          o,
          4
          /* CONTENT */
        )));
      }
    }
    return r.prototype.getEffects = function(e) {
      for (var t = [
        2,
        3
        /* FIXED */
      ].indexOf(this.container.styles.position) === -1, A = this.parent, i = this.effects.slice(0); A; ) {
        var s = A.effects.filter(function(a) {
          return !ga(a);
        });
        if (t || A.container.styles.position !== 0 || !A.parent) {
          if (i.unshift.apply(i, s), t = [
            2,
            3
            /* FIXED */
          ].indexOf(A.container.styles.position) === -1, A.container.styles.overflowX !== 0) {
            var n = Li(A.curves), o = Ii(A.curves);
            zn(n, o) || i.unshift(new mi(
              o,
              6
              /* CONTENT */
            ));
          }
        } else
          i.unshift.apply(i, s);
        A = A.parent;
      }
      return i.filter(function(a) {
        return we(a.target, e);
      });
    }, r;
  }()
), Fr = function(r, e, t, A) {
  r.container.elements.forEach(function(i) {
    var s = we(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), n = we(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), o = new ma(i, r);
    we(
      i.styles.display,
      2048
      /* LIST_ITEM */
    ) && A.push(o);
    var a = we(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : A;
    if (s || n) {
      var l = s || i.styles.isPositioned() ? t : e, h = new pa(o);
      if (i.styles.isPositioned() || i.styles.opacity < 1 || i.styles.isTransformed()) {
        var u = i.styles.zIndex.order;
        if (u < 0) {
          var c = 0;
          l.negativeZIndex.some(function(w, b) {
            return u > w.element.container.styles.zIndex.order ? (c = b, !1) : c > 0;
          }), l.negativeZIndex.splice(c, 0, h);
        } else if (u > 0) {
          var f = 0;
          l.positiveZIndex.some(function(w, b) {
            return u >= w.element.container.styles.zIndex.order ? (f = b + 1, !1) : f > 0;
          }), l.positiveZIndex.splice(f, 0, h);
        } else
          l.zeroOrAutoZIndexOrTransformedOrOpacity.push(h);
      } else
        i.styles.isFloating() ? l.nonPositionedFloats.push(h) : l.nonPositionedInlineLevel.push(h);
      Fr(o, h, s ? h : t, a);
    } else
      i.styles.isInlineLevel() ? e.inlineLevel.push(o) : e.nonInlineLevel.push(o), Fr(o, e, t, a);
    we(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && wa(i, a);
  });
}, wa = function(r, e) {
  for (var t = r instanceof Br ? r.start : 1, A = r instanceof Br ? r.reversed : !1, i = 0; i < e.length; i++) {
    var s = e[i];
    s.container instanceof ta && typeof s.container.value == "number" && s.container.value !== 0 && (t = s.container.value), s.listValue = _A(t, s.container.styles.listStyleType, !0), t += A ? -1 : 1;
  }
}, Up = function(r) {
  var e = new ma(r, null), t = new pa(e), A = [];
  return Fr(e, t, t, A), wa(e.container, A), t;
}, Gn = function(r, e) {
  switch (e) {
    case 0:
      return Ne(r.topLeftBorderBox, r.topLeftPaddingBox, r.topRightBorderBox, r.topRightPaddingBox);
    case 1:
      return Ne(r.topRightBorderBox, r.topRightPaddingBox, r.bottomRightBorderBox, r.bottomRightPaddingBox);
    case 2:
      return Ne(r.bottomRightBorderBox, r.bottomRightPaddingBox, r.bottomLeftBorderBox, r.bottomLeftPaddingBox);
    case 3:
    default:
      return Ne(r.bottomLeftBorderBox, r.bottomLeftPaddingBox, r.topLeftBorderBox, r.topLeftPaddingBox);
  }
}, Hp = function(r, e) {
  switch (e) {
    case 0:
      return Ne(r.topLeftBorderBox, r.topLeftBorderDoubleOuterBox, r.topRightBorderBox, r.topRightBorderDoubleOuterBox);
    case 1:
      return Ne(r.topRightBorderBox, r.topRightBorderDoubleOuterBox, r.bottomRightBorderBox, r.bottomRightBorderDoubleOuterBox);
    case 2:
      return Ne(r.bottomRightBorderBox, r.bottomRightBorderDoubleOuterBox, r.bottomLeftBorderBox, r.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
      return Ne(r.bottomLeftBorderBox, r.bottomLeftBorderDoubleOuterBox, r.topLeftBorderBox, r.topLeftBorderDoubleOuterBox);
  }
}, Rp = function(r, e) {
  switch (e) {
    case 0:
      return Ne(r.topLeftBorderDoubleInnerBox, r.topLeftPaddingBox, r.topRightBorderDoubleInnerBox, r.topRightPaddingBox);
    case 1:
      return Ne(r.topRightBorderDoubleInnerBox, r.topRightPaddingBox, r.bottomRightBorderDoubleInnerBox, r.bottomRightPaddingBox);
    case 2:
      return Ne(r.bottomRightBorderDoubleInnerBox, r.bottomRightPaddingBox, r.bottomLeftBorderDoubleInnerBox, r.bottomLeftPaddingBox);
    case 3:
    default:
      return Ne(r.bottomLeftBorderDoubleInnerBox, r.bottomLeftPaddingBox, r.topLeftBorderDoubleInnerBox, r.topLeftPaddingBox);
  }
}, xp = function(r, e) {
  switch (e) {
    case 0:
      return wi(r.topLeftBorderStroke, r.topRightBorderStroke);
    case 1:
      return wi(r.topRightBorderStroke, r.bottomRightBorderStroke);
    case 2:
      return wi(r.bottomRightBorderStroke, r.bottomLeftBorderStroke);
    case 3:
    default:
      return wi(r.bottomLeftBorderStroke, r.topLeftBorderStroke);
  }
}, wi = function(r, e) {
  var t = [];
  return Pe(r) ? t.push(r.subdivide(0.5, !1)) : t.push(r), Pe(e) ? t.push(e.subdivide(0.5, !0)) : t.push(e), t;
}, Ne = function(r, e, t, A) {
  var i = [];
  return Pe(r) ? i.push(r.subdivide(0.5, !1)) : i.push(r), Pe(t) ? i.push(t.subdivide(0.5, !0)) : i.push(t), Pe(A) ? i.push(A.subdivide(0.5, !0).reverse()) : i.push(A), Pe(e) ? i.push(e.subdivide(0.5, !1).reverse()) : i.push(e), i;
}, ba = function(r) {
  var e = r.bounds, t = r.styles;
  return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, Mi = function(r) {
  var e = r.styles, t = r.bounds, A = ne(e.paddingLeft, t.width), i = ne(e.paddingRight, t.width), s = ne(e.paddingTop, t.width), n = ne(e.paddingBottom, t.width);
  return t.add(A + e.borderLeftWidth, s + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + A + i), -(e.borderTopWidth + e.borderBottomWidth + s + n));
}, Tp = function(r, e) {
  return r === 0 ? e.bounds : r === 2 ? Mi(e) : ba(e);
}, Lp = function(r, e) {
  return r === 0 ? e.bounds : r === 2 ? Mi(e) : ba(e);
}, Rs = function(r, e, t) {
  var A = Tp(Yt(r.styles.backgroundOrigin, e), r), i = Lp(Yt(r.styles.backgroundClip, e), r), s = Ip(Yt(r.styles.backgroundSize, e), t, A), n = s[0], o = s[1], a = EA(Yt(r.styles.backgroundPosition, e), A.width - n, A.height - o), l = Mp(Yt(r.styles.backgroundRepeat, e), a, s, A, i), h = Math.round(A.left + a[0]), u = Math.round(A.top + a[1]);
  return [l, h, u, n, o];
}, Jt = function(r) {
  return Ae(r) && r.value === iA.AUTO;
}, bi = function(r) {
  return typeof r == "number";
}, Ip = function(r, e, t) {
  var A = e[0], i = e[1], s = e[2], n = r[0], o = r[1];
  if (!n)
    return [0, 0];
  if (ge(n) && o && ge(o))
    return [ne(n, t.width), ne(o, t.height)];
  var a = bi(s);
  if (Ae(n) && (n.value === iA.CONTAIN || n.value === iA.COVER)) {
    if (bi(s)) {
      var l = t.width / t.height;
      return l < s != (n.value === iA.COVER) ? [t.width, t.width / s] : [t.height * s, t.height];
    }
    return [t.width, t.height];
  }
  var h = bi(A), u = bi(i), c = h || u;
  if (Jt(n) && (!o || Jt(o))) {
    if (h && u)
      return [A, i];
    if (!a && !c)
      return [t.width, t.height];
    if (c && a) {
      var f = h ? A : i * s, w = u ? i : A / s;
      return [f, w];
    }
    var b = h ? A : t.width, v = u ? i : t.height;
    return [b, v];
  }
  if (a) {
    var B = 0, y = 0;
    return ge(n) ? B = ne(n, t.width) : ge(o) && (y = ne(o, t.height)), Jt(n) ? B = y * s : (!o || Jt(o)) && (y = B / s), [B, y];
  }
  var D = null, L = null;
  if (ge(n) ? D = ne(n, t.width) : o && ge(o) && (L = ne(o, t.height)), D !== null && (!o || Jt(o)) && (L = h && u ? D / A * i : t.height), L !== null && Jt(n) && (D = h && u ? L / i * A : t.width), D !== null && L !== null)
    return [D, L];
  throw new Error("Unable to calculate background-size for element");
}, Yt = function(r, e) {
  var t = r[e];
  return typeof t > "u" ? r[0] : t;
}, Mp = function(r, e, t, A, i) {
  var s = e[0], n = e[1], o = t[0], a = t[1];
  switch (r) {
    case 2:
      return [
        new x(Math.round(A.left), Math.round(A.top + n)),
        new x(Math.round(A.left + A.width), Math.round(A.top + n)),
        new x(Math.round(A.left + A.width), Math.round(a + A.top + n)),
        new x(Math.round(A.left), Math.round(a + A.top + n))
      ];
    case 3:
      return [
        new x(Math.round(A.left + s), Math.round(A.top)),
        new x(Math.round(A.left + s + o), Math.round(A.top)),
        new x(Math.round(A.left + s + o), Math.round(A.height + A.top)),
        new x(Math.round(A.left + s), Math.round(A.height + A.top))
      ];
    case 1:
      return [
        new x(Math.round(A.left + s), Math.round(A.top + n)),
        new x(Math.round(A.left + s + o), Math.round(A.top + n)),
        new x(Math.round(A.left + s + o), Math.round(A.top + n + a)),
        new x(Math.round(A.left + s), Math.round(A.top + n + a))
      ];
    default:
      return [
        new x(Math.round(i.left), Math.round(i.top)),
        new x(Math.round(i.left + i.width), Math.round(i.top)),
        new x(Math.round(i.left + i.width), Math.round(i.height + i.top)),
        new x(Math.round(i.left), Math.round(i.height + i.top))
      ];
  }
}, Dp = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", Wn = "Hidden Text", Sp = (
  /** @class */
  function() {
    function r(e) {
      this._data = {}, this._document = e;
    }
    return r.prototype.parseMetrics = function(e, t) {
      var A = this._document.createElement("div"), i = this._document.createElement("img"), s = this._document.createElement("span"), n = this._document.body;
      A.style.visibility = "hidden", A.style.fontFamily = e, A.style.fontSize = t, A.style.margin = "0", A.style.padding = "0", A.style.whiteSpace = "nowrap", n.appendChild(A), i.src = Dp, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", s.style.fontFamily = e, s.style.fontSize = t, s.style.margin = "0", s.style.padding = "0", s.appendChild(this._document.createTextNode(Wn)), A.appendChild(s), A.appendChild(i);
      var o = i.offsetTop - s.offsetTop + 2;
      A.removeChild(s), A.appendChild(this._document.createTextNode(Wn)), A.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var a = i.offsetTop - A.offsetTop + 2;
      return n.removeChild(A), { baseline: o, middle: a };
    }, r.prototype.getMetrics = function(e, t) {
      var A = e + " " + t;
      return typeof this._data[A] > "u" && (this._data[A] = this.parseMetrics(e, t)), this._data[A];
    }, r;
  }()
), Ba = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.context = e, this.options = t;
    }
    return r;
  }()
), kp = 1e4, _p = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i._activeEffects = [], i.canvas = A.canvas ? A.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), A.canvas || (i.canvas.width = Math.floor(A.width * A.scale), i.canvas.height = Math.floor(A.height * A.scale), i.canvas.style.width = A.width + "px", i.canvas.style.height = A.height + "px"), i.fontMetrics = new Sp(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-A.x, -A.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + A.width + "x" + A.height + ") with scale " + A.scale), i;
    }
    return e.prototype.applyEffects = function(t) {
      for (var A = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return A.applyEffect(i);
      });
    }, e.prototype.applyEffect = function(t) {
      this.ctx.save(), Fp(t) && (this.ctx.globalAlpha = t.opacity), yp(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), ga(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, e.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, e.prototype.renderStack = function(t) {
      return Te(this, void 0, void 0, function() {
        var A;
        return Ue(this, function(i) {
          switch (i.label) {
            case 0:
              return A = t.element.container.styles, A.isVisible() ? [4, this.renderStackContent(t)] : [3, 2];
            case 1:
              i.sent(), i.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNode = function(t) {
      return Te(this, void 0, void 0, function() {
        return Ue(this, function(A) {
          switch (A.label) {
            case 0:
              if (we(
                t.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return t.container.styles.isVisible() ? [4, this.renderNodeBackgroundAndBorders(t)] : [3, 3];
            case 1:
              return A.sent(), [4, this.renderNodeContent(t)];
            case 2:
              A.sent(), A.label = 3;
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderTextWithLetterSpacing = function(t, A, i) {
      var s = this;
      if (A === 0)
        this.ctx.fillText(t.text, t.bounds.left, t.bounds.top + i);
      else {
        var n = Tr(t.text);
        n.reduce(function(o, a) {
          return s.ctx.fillText(a, o, t.bounds.top + i), o + s.ctx.measureText(a).width;
        }, t.bounds.left);
      }
    }, e.prototype.createFontStyle = function(t) {
      var A = t.fontVariant.filter(function(n) {
        return n === "normal" || n === "small-caps";
      }).join(""), i = Np(t.fontFamily).join(", "), s = PA(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, A, t.fontWeight, s, i].join(" "),
        i,
        s
      ];
    }, e.prototype.renderTextNode = function(t, A) {
      return Te(this, void 0, void 0, function() {
        var i, s, n, o, a, l, h, u, c = this;
        return Ue(this, function(f) {
          return i = this.createFontStyle(A), s = i[0], n = i[1], o = i[2], this.ctx.font = s, this.ctx.direction = A.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", a = this.fontMetrics.getMetrics(n, o), l = a.baseline, h = a.middle, u = A.paintOrder, t.textBounds.forEach(function(w) {
            u.forEach(function(b) {
              switch (b) {
                case 0:
                  c.ctx.fillStyle = Ce(A.color), c.renderTextWithLetterSpacing(w, A.letterSpacing, l);
                  var v = A.textShadow;
                  v.length && w.text.trim().length && (v.slice(0).reverse().forEach(function(B) {
                    c.ctx.shadowColor = Ce(B.color), c.ctx.shadowOffsetX = B.offsetX.number * c.options.scale, c.ctx.shadowOffsetY = B.offsetY.number * c.options.scale, c.ctx.shadowBlur = B.blur.number, c.renderTextWithLetterSpacing(w, A.letterSpacing, l);
                  }), c.ctx.shadowColor = "", c.ctx.shadowOffsetX = 0, c.ctx.shadowOffsetY = 0, c.ctx.shadowBlur = 0), A.textDecorationLine.length && (c.ctx.fillStyle = Ce(A.textDecorationColor || A.color), A.textDecorationLine.forEach(function(B) {
                    switch (B) {
                      case 1:
                        c.ctx.fillRect(w.bounds.left, Math.round(w.bounds.top + l), w.bounds.width, 1);
                        break;
                      case 2:
                        c.ctx.fillRect(w.bounds.left, Math.round(w.bounds.top), w.bounds.width, 1);
                        break;
                      case 3:
                        c.ctx.fillRect(w.bounds.left, Math.ceil(w.bounds.top + h), w.bounds.width, 1);
                        break;
                    }
                  }));
                  break;
                case 1:
                  A.webkitTextStrokeWidth && w.text.trim().length && (c.ctx.strokeStyle = Ce(A.webkitTextStrokeColor), c.ctx.lineWidth = A.webkitTextStrokeWidth, c.ctx.lineJoin = window.chrome ? "miter" : "round", c.ctx.strokeText(w.text, w.bounds.left, w.bounds.top + l)), c.ctx.strokeStyle = "", c.ctx.lineWidth = 0, c.ctx.lineJoin = "miter";
                  break;
              }
            });
          }), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderReplacedElement = function(t, A, i) {
      if (i && t.intrinsicWidth > 0 && t.intrinsicHeight > 0) {
        var s = Mi(t), n = Ii(A);
        this.path(n), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(i, 0, 0, t.intrinsicWidth, t.intrinsicHeight, s.left, s.top, s.width, s.height), this.ctx.restore();
      }
    }, e.prototype.renderNodeContent = function(t) {
      return Te(this, void 0, void 0, function() {
        var A, i, s, n, o, a, y, y, l, h, u, c, L, f, w, R, b, v, B, y, D, L, R;
        return Ue(this, function(Q) {
          switch (Q.label) {
            case 0:
              this.applyEffects(t.getEffects(
                4
                /* CONTENT */
              )), A = t.container, i = t.curves, s = A.styles, n = 0, o = A.textNodes, Q.label = 1;
            case 1:
              return n < o.length ? (a = o[n], [4, this.renderTextNode(a, s)]) : [3, 4];
            case 2:
              Q.sent(), Q.label = 3;
            case 3:
              return n++, [3, 1];
            case 4:
              if (!(A instanceof $o)) return [3, 8];
              Q.label = 5;
            case 5:
              return Q.trys.push([5, 7, , 8]), [4, this.context.cache.match(A.src)];
            case 6:
              return y = Q.sent(), this.renderReplacedElement(A, i, y), [3, 8];
            case 7:
              return Q.sent(), this.context.logger.error("Error loading image " + A.src), [3, 8];
            case 8:
              if (A instanceof qo && this.renderReplacedElement(A, i, A.canvas), !(A instanceof ea)) return [3, 12];
              Q.label = 9;
            case 9:
              return Q.trys.push([9, 11, , 12]), [4, this.context.cache.match(A.svg)];
            case 10:
              return y = Q.sent(), this.renderReplacedElement(A, i, y), [3, 12];
            case 11:
              return Q.sent(), this.context.logger.error("Error loading svg " + A.svg.substring(0, 255)), [3, 12];
            case 12:
              return A instanceof sa && A.tree ? (l = new e(this.context, {
                scale: this.options.scale,
                backgroundColor: A.backgroundColor,
                x: 0,
                y: 0,
                width: A.width,
                height: A.height
              }), [4, l.render(A.tree)]) : [3, 14];
            case 13:
              h = Q.sent(), A.width && A.height && this.ctx.drawImage(h, 0, 0, A.width, A.height, A.bounds.left, A.bounds.top, A.bounds.width, A.bounds.height), Q.label = 14;
            case 14:
              if (A instanceof Lr && (u = Math.min(A.bounds.width, A.bounds.height), A.type === Hi ? A.checked && (this.ctx.save(), this.path([
                new x(A.bounds.left + u * 0.39363, A.bounds.top + u * 0.79),
                new x(A.bounds.left + u * 0.16, A.bounds.top + u * 0.5549),
                new x(A.bounds.left + u * 0.27347, A.bounds.top + u * 0.44071),
                new x(A.bounds.left + u * 0.39694, A.bounds.top + u * 0.5649),
                new x(A.bounds.left + u * 0.72983, A.bounds.top + u * 0.23),
                new x(A.bounds.left + u * 0.84, A.bounds.top + u * 0.34085),
                new x(A.bounds.left + u * 0.39363, A.bounds.top + u * 0.79)
              ]), this.ctx.fillStyle = Ce(In), this.ctx.fill(), this.ctx.restore()) : A.type === Ri && A.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(A.bounds.left + u / 2, A.bounds.top + u / 2, u / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = Ce(In), this.ctx.fill(), this.ctx.restore())), Op(A) && A.value.length) {
                switch (c = this.createFontStyle(s), L = c[0], f = c[1], w = this.fontMetrics.getMetrics(L, f).baseline, this.ctx.font = L, this.ctx.fillStyle = Ce(s.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = Pp(A.styles.textAlign), R = Mi(A), b = 0, A.styles.textAlign) {
                  case 1:
                    b += R.width / 2;
                    break;
                  case 2:
                    b += R.width;
                    break;
                }
                v = R.add(b, 0, 0, -R.height / 2 + 1), this.ctx.save(), this.path([
                  new x(R.left, R.top),
                  new x(R.left + R.width, R.top),
                  new x(R.left + R.width, R.top + R.height),
                  new x(R.left, R.top + R.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new RA(A.value, v), s.letterSpacing, w), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!we(
                A.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (A.styles.listStyleImage === null) return [3, 19];
              if (B = A.styles.listStyleImage, B.type !== 0) return [3, 18];
              y = void 0, D = B.url, Q.label = 15;
            case 15:
              return Q.trys.push([15, 17, , 18]), [4, this.context.cache.match(D)];
            case 16:
              return y = Q.sent(), this.ctx.drawImage(y, A.bounds.left - (y.width + 10), A.bounds.top), [3, 18];
            case 17:
              return Q.sent(), this.context.logger.error("Error loading list-style-image " + D), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && A.styles.listStyleType !== -1 && (L = this.createFontStyle(s)[0], this.ctx.font = L, this.ctx.fillStyle = Ce(s.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", R = new ot(A.bounds.left, A.bounds.top + ne(A.styles.paddingTop, A.bounds.width), A.bounds.width, pn(s.lineHeight, s.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new RA(t.listValue, R), s.letterSpacing, pn(s.lineHeight, s.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), Q.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderStackContent = function(t) {
      return Te(this, void 0, void 0, function() {
        var A, i, B, s, n, B, o, a, B, l, h, B, u, c, B, f, w, B, b, v, B;
        return Ue(this, function(y) {
          switch (y.label) {
            case 0:
              if (we(
                t.element.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return [4, this.renderNodeBackgroundAndBorders(t.element)];
            case 1:
              y.sent(), A = 0, i = t.negativeZIndex, y.label = 2;
            case 2:
              return A < i.length ? (B = i[A], [4, this.renderStack(B)]) : [3, 5];
            case 3:
              y.sent(), y.label = 4;
            case 4:
              return A++, [3, 2];
            case 5:
              return [4, this.renderNodeContent(t.element)];
            case 6:
              y.sent(), s = 0, n = t.nonInlineLevel, y.label = 7;
            case 7:
              return s < n.length ? (B = n[s], [4, this.renderNode(B)]) : [3, 10];
            case 8:
              y.sent(), y.label = 9;
            case 9:
              return s++, [3, 7];
            case 10:
              o = 0, a = t.nonPositionedFloats, y.label = 11;
            case 11:
              return o < a.length ? (B = a[o], [4, this.renderStack(B)]) : [3, 14];
            case 12:
              y.sent(), y.label = 13;
            case 13:
              return o++, [3, 11];
            case 14:
              l = 0, h = t.nonPositionedInlineLevel, y.label = 15;
            case 15:
              return l < h.length ? (B = h[l], [4, this.renderStack(B)]) : [3, 18];
            case 16:
              y.sent(), y.label = 17;
            case 17:
              return l++, [3, 15];
            case 18:
              u = 0, c = t.inlineLevel, y.label = 19;
            case 19:
              return u < c.length ? (B = c[u], [4, this.renderNode(B)]) : [3, 22];
            case 20:
              y.sent(), y.label = 21;
            case 21:
              return u++, [3, 19];
            case 22:
              f = 0, w = t.zeroOrAutoZIndexOrTransformedOrOpacity, y.label = 23;
            case 23:
              return f < w.length ? (B = w[f], [4, this.renderStack(B)]) : [3, 26];
            case 24:
              y.sent(), y.label = 25;
            case 25:
              return f++, [3, 23];
            case 26:
              b = 0, v = t.positiveZIndex, y.label = 27;
            case 27:
              return b < v.length ? (B = v[b], [4, this.renderStack(B)]) : [3, 30];
            case 28:
              y.sent(), y.label = 29;
            case 29:
              return b++, [3, 27];
            case 30:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.mask = function(t) {
      this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.lineTo(this.canvas.width, 0), this.ctx.lineTo(this.canvas.width, this.canvas.height), this.ctx.lineTo(0, this.canvas.height), this.ctx.lineTo(0, 0), this.formatPath(t.slice(0).reverse()), this.ctx.closePath();
    }, e.prototype.path = function(t) {
      this.ctx.beginPath(), this.formatPath(t), this.ctx.closePath();
    }, e.prototype.formatPath = function(t) {
      var A = this;
      t.forEach(function(i, s) {
        var n = Pe(i) ? i.start : i;
        s === 0 ? A.ctx.moveTo(n.x, n.y) : A.ctx.lineTo(n.x, n.y), Pe(i) && A.ctx.bezierCurveTo(i.startControl.x, i.startControl.y, i.endControl.x, i.endControl.y, i.end.x, i.end.y);
      });
    }, e.prototype.renderRepeat = function(t, A, i, s) {
      this.path(t), this.ctx.fillStyle = A, this.ctx.translate(i, s), this.ctx.fill(), this.ctx.translate(-i, -s);
    }, e.prototype.resizeImage = function(t, A, i) {
      var s;
      if (t.width === A && t.height === i)
        return t;
      var n = (s = this.canvas.ownerDocument) !== null && s !== void 0 ? s : document, o = n.createElement("canvas");
      o.width = Math.max(1, A), o.height = Math.max(1, i);
      var a = o.getContext("2d");
      return a.drawImage(t, 0, 0, t.width, t.height, 0, 0, A, i), o;
    }, e.prototype.renderBackgroundImage = function(t) {
      return Te(this, void 0, void 0, function() {
        var A, i, s, n, o, a;
        return Ue(this, function(l) {
          switch (l.label) {
            case 0:
              A = t.styles.backgroundImage.length - 1, i = function(h) {
                var u, c, f, oe, he, ue, q, J, K, w, oe, he, ue, q, J, b, v, B, y, D, L, R, Q, W, K, P, oe, S, N, q, J, Z, he, ue, et, pe, _e, tt, Oe, ze, be, De;
                return Ue(this, function(at) {
                  switch (at.label) {
                    case 0:
                      if (h.type !== 0) return [3, 5];
                      u = void 0, c = h.url, at.label = 1;
                    case 1:
                      return at.trys.push([1, 3, , 4]), [4, s.context.cache.match(c)];
                    case 2:
                      return u = at.sent(), [3, 4];
                    case 3:
                      return at.sent(), s.context.logger.error("Error loading background-image " + c), [3, 4];
                    case 4:
                      return u && (f = Rs(t, A, [
                        u.width,
                        u.height,
                        u.width / u.height
                      ]), oe = f[0], he = f[1], ue = f[2], q = f[3], J = f[4], K = s.ctx.createPattern(s.resizeImage(u, q, J), "repeat"), s.renderRepeat(oe, K, he, ue)), [3, 6];
                    case 5:
                      Ed(h) ? (w = Rs(t, A, [null, null, null]), oe = w[0], he = w[1], ue = w[2], q = w[3], J = w[4], b = wd(h.angle, q, J), v = b[0], B = b[1], y = b[2], D = b[3], L = b[4], R = document.createElement("canvas"), R.width = q, R.height = J, Q = R.getContext("2d"), W = Q.createLinearGradient(B, D, y, L), fn(h.stops, v).forEach(function(ce) {
                        return W.addColorStop(ce.stop, Ce(ce.color));
                      }), Q.fillStyle = W, Q.fillRect(0, 0, q, J), q > 0 && J > 0 && (K = s.ctx.createPattern(R, "repeat"), s.renderRepeat(oe, K, he, ue))) : yd(h) && (P = Rs(t, A, [
                        null,
                        null,
                        null
                      ]), oe = P[0], S = P[1], N = P[2], q = P[3], J = P[4], Z = h.position.length === 0 ? [Hr] : h.position, he = ne(Z[0], q), ue = ne(Z[Z.length - 1], J), et = bd(h, he, ue, q, J), pe = et[0], _e = et[1], pe > 0 && _e > 0 && (tt = s.ctx.createRadialGradient(S + he, N + ue, 0, S + he, N + ue, pe), fn(h.stops, pe * 2).forEach(function(ce) {
                        return tt.addColorStop(ce.stop, Ce(ce.color));
                      }), s.path(oe), s.ctx.fillStyle = tt, pe !== _e ? (Oe = t.bounds.left + 0.5 * t.bounds.width, ze = t.bounds.top + 0.5 * t.bounds.height, be = _e / pe, De = 1 / be, s.ctx.save(), s.ctx.translate(Oe, ze), s.ctx.transform(1, 0, 0, be, 0, 0), s.ctx.translate(-Oe, -ze), s.ctx.fillRect(S, De * (N - ze) + ze, q, J * De), s.ctx.restore()) : s.ctx.fill())), at.label = 6;
                    case 6:
                      return A--, [
                        2
                        /*return*/
                      ];
                  }
                });
              }, s = this, n = 0, o = t.styles.backgroundImage.slice(0).reverse(), l.label = 1;
            case 1:
              return n < o.length ? (a = o[n], [5, i(a)]) : [3, 4];
            case 2:
              l.sent(), l.label = 3;
            case 3:
              return n++, [3, 1];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderSolidBorder = function(t, A, i) {
      return Te(this, void 0, void 0, function() {
        return Ue(this, function(s) {
          return this.path(Gn(i, A)), this.ctx.fillStyle = Ce(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, A, i, s) {
      return Te(this, void 0, void 0, function() {
        var n, o;
        return Ue(this, function(a) {
          switch (a.label) {
            case 0:
              return A < 3 ? [4, this.renderSolidBorder(t, i, s)] : [3, 2];
            case 1:
              return a.sent(), [
                2
                /*return*/
              ];
            case 2:
              return n = Hp(s, i), this.path(n), this.ctx.fillStyle = Ce(t), this.ctx.fill(), o = Rp(s, i), this.path(o), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return Te(this, void 0, void 0, function() {
        var A, i, s, n, o, a, l, h, u = this;
        return Ue(this, function(c) {
          switch (c.label) {
            case 0:
              return this.applyEffects(t.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), A = t.container.styles, i = !Ft(A.backgroundColor) || A.backgroundImage.length, s = [
                { style: A.borderTopStyle, color: A.borderTopColor, width: A.borderTopWidth },
                { style: A.borderRightStyle, color: A.borderRightColor, width: A.borderRightWidth },
                { style: A.borderBottomStyle, color: A.borderBottomColor, width: A.borderBottomWidth },
                { style: A.borderLeftStyle, color: A.borderLeftColor, width: A.borderLeftWidth }
              ], n = Kp(Yt(A.backgroundClip, 0), t.curves), i || A.boxShadow.length ? (this.ctx.save(), this.path(n), this.ctx.clip(), Ft(A.backgroundColor) || (this.ctx.fillStyle = Ce(A.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              c.sent(), this.ctx.restore(), A.boxShadow.slice(0).reverse().forEach(function(f) {
                u.ctx.save();
                var w = Li(t.curves), b = f.inset ? 0 : kp, v = Qp(w, -b + (f.inset ? 1 : -1) * f.spread.number, (f.inset ? 1 : -1) * f.spread.number, f.spread.number * (f.inset ? -2 : 2), f.spread.number * (f.inset ? -2 : 2));
                f.inset ? (u.path(w), u.ctx.clip(), u.mask(v)) : (u.mask(w), u.ctx.clip(), u.path(v)), u.ctx.shadowOffsetX = f.offsetX.number + b, u.ctx.shadowOffsetY = f.offsetY.number, u.ctx.shadowColor = Ce(f.color), u.ctx.shadowBlur = f.blur.number, u.ctx.fillStyle = f.inset ? Ce(f.color) : "rgba(0,0,0,1)", u.ctx.fill(), u.ctx.restore();
              }), c.label = 2;
            case 2:
              o = 0, a = 0, l = s, c.label = 3;
            case 3:
              return a < l.length ? (h = l[a], h.style !== 0 && !Ft(h.color) && h.width > 0 ? h.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
                h.color,
                h.width,
                o,
                t.curves,
                2
                /* DASHED */
              )] : [3, 11]) : [3, 13];
            case 4:
              return c.sent(), [3, 11];
            case 5:
              return h.style !== 3 ? [3, 7] : [4, this.renderDashedDottedBorder(
                h.color,
                h.width,
                o,
                t.curves,
                3
                /* DOTTED */
              )];
            case 6:
              return c.sent(), [3, 11];
            case 7:
              return h.style !== 4 ? [3, 9] : [4, this.renderDoubleBorder(h.color, h.width, o, t.curves)];
            case 8:
              return c.sent(), [3, 11];
            case 9:
              return [4, this.renderSolidBorder(h.color, o, t.curves)];
            case 10:
              c.sent(), c.label = 11;
            case 11:
              o++, c.label = 12;
            case 12:
              return a++, [3, 3];
            case 13:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderDashedDottedBorder = function(t, A, i, s, n) {
      return Te(this, void 0, void 0, function() {
        var o, a, l, h, u, c, f, w, b, v, B, y, D, L, R, Q, R, Q;
        return Ue(this, function(W) {
          return this.ctx.save(), o = xp(s, i), a = Gn(s, i), n === 2 && (this.path(a), this.ctx.clip()), Pe(a[0]) ? (l = a[0].start.x, h = a[0].start.y) : (l = a[0].x, h = a[0].y), Pe(a[1]) ? (u = a[1].end.x, c = a[1].end.y) : (u = a[1].x, c = a[1].y), i === 0 || i === 2 ? f = Math.abs(l - u) : f = Math.abs(h - c), this.ctx.beginPath(), n === 3 ? this.formatPath(o) : this.formatPath(a.slice(0, 2)), w = A < 3 ? A * 3 : A * 2, b = A < 3 ? A * 2 : A, n === 3 && (w = A, b = A), v = !0, f <= w * 2 ? v = !1 : f <= w * 2 + b ? (B = f / (2 * w + b), w *= B, b *= B) : (y = Math.floor((f + b) / (w + b)), D = (f - y * w) / (y - 1), L = (f - (y + 1) * w) / y, b = L <= 0 || Math.abs(b - D) < Math.abs(b - L) ? D : L), v && (n === 3 ? this.ctx.setLineDash([0, w + b]) : this.ctx.setLineDash([w, b])), n === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = A) : this.ctx.lineWidth = A * 2 + 1.1, this.ctx.strokeStyle = Ce(t), this.ctx.stroke(), this.ctx.setLineDash([]), n === 2 && (Pe(a[0]) && (R = a[3], Q = a[0], this.ctx.beginPath(), this.formatPath([new x(R.end.x, R.end.y), new x(Q.start.x, Q.start.y)]), this.ctx.stroke()), Pe(a[1]) && (R = a[1], Q = a[2], this.ctx.beginPath(), this.formatPath([new x(R.end.x, R.end.y), new x(Q.start.x, Q.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.render = function(t) {
      return Te(this, void 0, void 0, function() {
        var A;
        return Ue(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = Ce(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), A = Up(t), [4, this.renderStack(A)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Ba)
), Op = function(r) {
  return r instanceof ia || r instanceof Aa ? !0 : r instanceof Lr && r.type !== Ri && r.type !== Hi;
}, Kp = function(r, e) {
  switch (r) {
    case 0:
      return Li(e);
    case 2:
      return Cp(e);
    case 1:
    default:
      return Ii(e);
  }
}, Pp = function(r) {
  switch (r) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, Vp = ["-apple-system", "system-ui"], Np = function(r) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? r.filter(function(e) {
    return Vp.indexOf(e) === -1;
  }) : r;
}, zp = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.canvas = A.canvas ? A.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), i.options = A, i.canvas.width = Math.floor(A.width * A.scale), i.canvas.height = Math.floor(A.height * A.scale), i.canvas.style.width = A.width + "px", i.canvas.style.height = A.height + "px", i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-A.x, -A.y), i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + A.width + "x" + A.height + " at " + A.x + "," + A.y + ") with scale " + A.scale), i;
    }
    return e.prototype.render = function(t) {
      return Te(this, void 0, void 0, function() {
        var A, i;
        return Ue(this, function(s) {
          switch (s.label) {
            case 0:
              return A = br(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, Gp(A)];
            case 1:
              return i = s.sent(), this.options.backgroundColor && (this.ctx.fillStyle = Ce(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Ba)
), Gp = function(r) {
  return new Promise(function(e, t) {
    var A = new Image();
    A.onload = function() {
      e(A);
    }, A.onerror = t, A.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(r));
  });
}, Wp = (
  /** @class */
  function() {
    function r(e) {
      var t = e.id, A = e.enabled;
      this.id = t, this.enabled = A, this.start = Date.now();
    }
    return r.prototype.debug = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.debug == "function" ? console.debug.apply(console, ZA([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, r.prototype.getTime = function() {
      return Date.now() - this.start;
    }, r.prototype.info = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && typeof window < "u" && window.console && typeof console.info == "function" && console.info.apply(console, ZA([this.id, this.getTime() + "ms"], e));
    }, r.prototype.warn = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.warn == "function" ? console.warn.apply(console, ZA([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, r.prototype.error = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.error == "function" ? console.error.apply(console, ZA([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, r.instances = {}, r;
  }()
), Xp = (
  /** @class */
  function() {
    function r(e, t) {
      var A;
      this.windowBounds = t, this.instanceName = "#" + r.instanceCount++, this.logger = new Wp({ id: this.instanceName, enabled: e.logging }), this.cache = (A = e.cache) !== null && A !== void 0 ? A : new dp(this, e);
    }
    return r.instanceCount = 1, r;
  }()
), Jp = function(r, e) {
  return e === void 0 && (e = {}), jp(r, e);
};
typeof window < "u" && fa.setContext(window);
var jp = function(r, e) {
  return Te(void 0, void 0, void 0, function() {
    var t, A, i, s, n, o, a, l, h, u, c, f, w, b, v, B, y, D, L, R, W, Q, W, K, P, oe, S, N, q, J, Z, he, ue, et, pe, _e, tt, Oe, ze, be;
    return Ue(this, function(De) {
      switch (De.label) {
        case 0:
          if (!r || typeof r != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (t = r.ownerDocument, !t)
            throw new Error("Element is not attached to a Document");
          if (A = t.defaultView, !A)
            throw new Error("Document is not attached to a Window");
          return i = {
            allowTaint: (K = e.allowTaint) !== null && K !== void 0 ? K : !1,
            imageTimeout: (P = e.imageTimeout) !== null && P !== void 0 ? P : 15e3,
            proxy: e.proxy,
            useCORS: (oe = e.useCORS) !== null && oe !== void 0 ? oe : !1
          }, s = sr({ logging: (S = e.logging) !== null && S !== void 0 ? S : !0, cache: e.cache }, i), n = {
            windowWidth: (N = e.windowWidth) !== null && N !== void 0 ? N : A.innerWidth,
            windowHeight: (q = e.windowHeight) !== null && q !== void 0 ? q : A.innerHeight,
            scrollX: (J = e.scrollX) !== null && J !== void 0 ? J : A.pageXOffset,
            scrollY: (Z = e.scrollY) !== null && Z !== void 0 ? Z : A.pageYOffset
          }, o = new ot(n.scrollX, n.scrollY, n.windowWidth, n.windowHeight), a = new Xp(s, o), l = (he = e.foreignObjectRendering) !== null && he !== void 0 ? he : !1, h = {
            allowTaint: (ue = e.allowTaint) !== null && ue !== void 0 ? ue : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: l,
            copyStyles: l
          }, a.logger.debug("Starting document clone with size " + o.width + "x" + o.height + " scrolled to " + -o.left + "," + -o.top), u = new Vn(a, r, h), c = u.clonedReferenceElement, c ? [4, u.toIFrame(t, o)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return f = De.sent(), w = Ir(c) || Yg(c) ? Fu(c.ownerDocument) : _i(a, c), b = w.width, v = w.height, B = w.left, y = w.top, D = Yp(a, c, e.backgroundColor), L = {
            canvas: e.canvas,
            backgroundColor: D,
            scale: (pe = (et = e.scale) !== null && et !== void 0 ? et : A.devicePixelRatio) !== null && pe !== void 0 ? pe : 1,
            x: ((_e = e.x) !== null && _e !== void 0 ? _e : 0) + B,
            y: ((tt = e.y) !== null && tt !== void 0 ? tt : 0) + y,
            width: (Oe = e.width) !== null && Oe !== void 0 ? Oe : Math.ceil(b),
            height: (ze = e.height) !== null && ze !== void 0 ? ze : Math.ceil(v)
          }, l ? (a.logger.debug("Document cloned, using foreign object rendering"), W = new zp(a, L), [4, W.render(c)]) : [3, 3];
        case 2:
          return R = De.sent(), [3, 5];
        case 3:
          return a.logger.debug("Document cloned, element located at " + B + "," + y + " with size " + b + "x" + v + " using computed rendering"), a.logger.debug("Starting DOM parsing"), Q = na(a, c), D === Q.styles.backgroundColor && (Q.styles.backgroundColor = nt.TRANSPARENT), a.logger.debug("Starting renderer for element at " + L.x + "," + L.y + " with size " + L.width + "x" + L.height), W = new _p(a, L), [4, W.render(Q)];
        case 4:
          R = De.sent(), De.label = 5;
        case 5:
          return (!((be = e.removeContainer) !== null && be !== void 0) || be) && (Vn.destroy(f) || a.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), a.logger.debug("Finished rendering"), [2, R];
      }
    });
  });
}, Yp = function(r, e, t) {
  var A = e.ownerDocument, i = A.documentElement ? UA(r, getComputedStyle(A.documentElement).backgroundColor) : nt.TRANSPARENT, s = A.body ? UA(r, getComputedStyle(A.body).backgroundColor) : nt.TRANSPARENT, n = typeof t == "string" ? UA(r, t) : t === null ? nt.TRANSPARENT : 4294967295;
  return e === A.documentElement ? Ft(i) ? Ft(s) ? n : s : i : n;
};
const Zp = { class: "positions-card" }, $p = {
  key: 0,
  class: "loading"
}, qp = {
  key: 1,
  class: "error"
}, em = {
  key: 2,
  class: "positions-container"
}, tm = { class: "positions-header" }, Am = { key: 1 }, im = { class: "positions-tools" }, sm = { class: "positions-count" }, rm = ["disabled"], nm = {
  key: 0,
  class: "screenshot-spinner"
}, om = { key: 1 }, am = { class: "popup-list" }, lm = ["onDragstart", "onDrop"], hm = ["value"], um = {
  key: 0,
  style: { "font-size": "11px", color: "#888", "font-style": "italic", display: "inline-block" }
}, cm = ["onClick"], dm = {
  class: "move-icons",
  style: { display: "flex", "flex-direction": "column", "margin-left": "8px" }
}, fm = ["onClick", "disabled"], gm = ["onClick", "disabled"], pm = ["value"], mm = { class: "popup-actions" }, wm = {
  key: 0,
  class: "filters-bar"
}, bm = { class: "filters-tags" }, Bm = ["onClick"], Cm = { class: "toast-container" }, vm = ["onClick"], Em = { class: "toast-icon" }, ym = { key: 0 }, Fm = { key: 1 }, Qm = { key: 2 }, Um = { key: 3 }, Hm = { class: "toast-content" }, Rm = { class: "toast-title" }, xm = {
  key: 0,
  class: "toast-message"
}, Tm = ["onClick"], Lm = {
  key: 3,
  class: "rename-dialog-backdrop"
}, Im = { class: "rename-dialog" }, Mm = ["placeholder"], Dm = { class: "dialog-actions" }, Sm = {
  key: 4,
  class: "rename-dialog-backdrop"
}, km = { class: "rename-dialog" }, _m = {
  key: 5,
  class: "screenshots-modal"
}, Om = { class: "modal-content" }, Km = {
  key: 0,
  class: "screenshots-loading"
}, Pm = {
  key: 1,
  class: "screenshots-empty"
}, Vm = {
  key: 2,
  class: "screenshots-list-vertical"
}, Nm = ["onClick"], zm = ["src", "alt"], Gm = { class: "screenshot-list-meta" }, Wm = { key: 0 }, Xm = {
  key: 1,
  style: { color: "#666", "font-style": "italic", display: "block" }
}, Jm = { style: { display: "flex", gap: "8px", "margin-top": "6px" } }, jm = ["href", "download"], Ym = ["onClick"], Zm = ["onClick"], $m = { class: "dialog-actions" }, qm = { class: "screenshot-preview-content" }, ew = ["src"], tw = { class: "screenshot-preview-meta" }, Aw = ["href", "download"], iw = {
  key: 6,
  class: "rename-dialog-backdrop"
}, sw = { class: "rename-dialog" }, rw = {
  class: "dialog-actions",
  style: { "justify-content": "flex-start" }
}, nw = {
  key: 7,
  class: "rename-dialog-backdrop"
}, ow = { class: "rename-dialog" }, aw = { class: "dialog-actions" }, lw = { class: "modal-body" }, hw = {
  key: 0,
  class: "loading-state"
}, uw = {
  key: 1,
  class: "error-state"
}, cw = {
  key: 2,
  class: "no-data-state"
}, dw = { key: 3 }, fw = { class: "margin-impact-table" }, gw = { key: 0 }, pw = { key: 1 }, mw = { key: 2 }, ww = /* @__PURE__ */ Ga({
  __name: "Positions",
  props: {
    accountId: { default: "demo" },
    highlightPnL: { type: Boolean, default: !1 },
    onRowClick: {},
    showHeaderLink: { type: Boolean, default: !1 },
    userId: { default: null }
  },
  emits: ["row-click", "minimize"],
  setup(r, { emit: e }) {
    const t = r, A = e, i = j(null), s = j(null), n = ["qty", "avgPrice", "price", "market_value", "unrealized_pnl", "computed_cash_flow_on_entry", "computed_cash_flow_on_exercise"], o = $a(t.accountId, t.userId), a = ns(() => {
      const p = o.data.value || [];
      return p.length ? p.map((d) => {
        const H = { ...d };
        for (const O of n) {
          const _ = H[O];
          if (typeof _ == "number" && Number.isFinite(_)) {
            const g = _ % 1;
            (Math.abs(_) * 1 / 100 > g || _ == 0) && (H[O] = Math.trunc(_));
          }
        }
        return H;
      }) : [];
    }), l = qa();
    el();
    const h = j(null);
    let u = null;
    const c = j([]), f = j([]), w = j(!1), b = j([]), v = [
      { field: "legal_entity", label: "Account" },
      { field: "thesis", label: "Thesis" },
      { field: "symbol", label: "Financial Instrument" },
      { field: "asset_class", label: "Asset Class" },
      { field: "conid", label: "Conid" },
      { field: "undConid", label: "Underlying Conid" },
      { field: "multiplier", label: "Multiplier" },
      { field: "qty", label: "Qty" },
      { field: "avgPrice", label: "Avg Price" },
      { field: "price", label: "Market Price" },
      { field: "market_price", label: "Ul CM Price" },
      { field: "instrument_market_price", label: "Instrument current market price" },
      { field: "market_value", label: "Market Value" },
      { field: "unrealized_pnl", label: "P&L Unrealized" },
      { field: "be_price_pnl", label: "Break even price P&L (computed)" },
      { field: "computed_cash_flow_on_entry", label: "Entry cash flow" },
      { field: "computed_cash_flow_on_exercise", label: "If exercised cash flow" },
      { field: "entry_exercise_cash_flow_pct", label: "(Entry / If exercised) cash flow (computed)" },
      { field: "computed_be_price", label: "BE Price" }
    ], B = j({});
    function y() {
      const d = new URL(window.location.href).searchParams.get("position_col_renames");
      if (!d) return {};
      try {
        const H = d.split("-and-"), O = {};
        return H.forEach((_) => {
          const [g, ...m] = _.split(":");
          g && m.length && (O[g] = decodeURIComponent(m.join(":")));
        }), O;
      } catch {
        return {};
      }
    }
    function D(p) {
      const d = new URL(window.location.href), H = Object.entries(p).filter(([O, _]) => _ && _.trim()).map(([O, _]) => `${O}:${encodeURIComponent(_)}`).join("-and-");
      H ? d.searchParams.set("position_col_renames", H) : d.searchParams.delete("position_col_renames"), window.history.replaceState({}, "", d.toString());
    }
    const L = j(!1), R = j(null), Q = j("");
    function W(p, d) {
      R.value = p, Q.value = d, L.value = !0;
    }
    function K() {
      R.value && (B.value = {
        ...B.value,
        [R.value]: Q.value.trim()
      }, D(B.value), L.value = !1, ut(() => lt()));
    }
    function P() {
      L.value = !1;
    }
    function oe() {
      const d = new URL(window.location.href).searchParams.get("position_cols");
      if (!d)
        return v.map((_) => _.field).filter((_) => !["asset_class", "conid", "undConid", "multiplier", "qty"].includes(_));
      const H = d.split("-and-").map((_) => _.trim()).filter(Boolean), O = new Set(v.map((_) => _.field));
      return H.filter((_) => O.has(_));
    }
    const S = j(oe());
    function N() {
      const d = new URL(window.location.href).searchParams.get("position_col_widths");
      if (!d) return {};
      try {
        const H = d.split("-and-"), O = {};
        return H.forEach((_) => {
          const [g, m] = _.split(":");
          g && m && (O[g] = parseInt(m));
        }), O;
      } catch (H) {
        return console.warn("Error parsing column widths from URL:", H), {};
      }
    }
    function q(p) {
      const d = new URL(window.location.href), H = Object.entries(p).filter(([O, _]) => _ > 0).map(([O, _]) => `${O}:${_}`).join("-and-");
      H ? d.searchParams.set("position_col_widths", H) : d.searchParams.delete("position_col_widths"), window.history.replaceState({}, "", d.toString());
    }
    const J = j(N());
    function Z(p) {
      return p == null || !Number.isFinite(p) ? "" : p % 1 == 0 ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(p) : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(p);
    }
    function he(p) {
      return p == null || !Number.isFinite(p) ? "" : new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(p);
    }
    function ue(p) {
      if (!p) return [];
      const d = String(p), H = d.match(/^([A-Z]+)\b/), O = (H == null ? void 0 : H[1]) ?? "", _ = d.match(/\s([CP])\b/), g = (_ == null ? void 0 : _[1]) ?? "", m = d.match(/\s(\d+(?:\.\d+)?)\s+[CP]\b/), C = (m == null ? void 0 : m[1]) ?? "", F = d.match(/\b(\d{6})[CP]/), I = F ? et(F[1]) : "";
      return [O, I, C, g].filter(Boolean);
    }
    function et(p) {
      if (!p || p.length !== 6) return "";
      const d = p.substring(0, 2), H = p.substring(2, 4), O = p.substring(4, 6);
      return `20${d}-${H}-${O}`;
    }
    const pe = tl(), _e = il();
    async function tt(p, d) {
      try {
        if (d) {
          const { error: H } = await pe.schema("hf").from("positionsAndThesisConnection").upsert({
            symbol_root: p,
            thesis_id: d,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }, {
            onConflict: "symbol_root,thesis_id"
          });
          if (H) throw H;
        } else {
          const { error: H } = await pe.schema("hf").from("positionsAndThesisConnection").delete().eq("symbol_root", p);
          if (H) throw H;
        }
        await Promise.all([
          _e.invalidateQueries({ queryKey: ["positions"] }),
          _e.invalidateQueries({ queryKey: ["thesisConnections"] })
        ]), be("success", "Thesis Updated", `All ${p} positions have been updated`);
      } catch (H) {
        throw console.error("Error updating thesis connection:", H), be("error", "Error", `Failed to update thesis: ${H.message}`), H;
      }
    }
    const Oe = j([]);
    let ze = 0;
    function be(p, d, H) {
      const O = ze++;
      Oe.value.push({ id: O, type: p, title: d, message: H }), setTimeout(() => De(O), 5e3);
    }
    function De(p) {
      const d = Oe.value.findIndex((H) => H.id === p);
      d !== -1 && Oe.value.splice(d, 1);
    }
    function at(p) {
      if (!p)
        return "⏱️ Last Updated: Not available";
      try {
        const d = new Date(p), H = Intl.DateTimeFormat().resolvedOptions().timeZone, _ = {
          "Asia/Kolkata": "IST",
          "Asia/Calcutta": "IST",
          "America/New_York": d.getMonth() >= 2 && d.getMonth() < 10 ? "EDT" : "EST",
          "America/Los_Angeles": d.getMonth() >= 2 && d.getMonth() < 10 ? "PDT" : "PST",
          "America/Chicago": d.getMonth() >= 2 && d.getMonth() < 10 ? "CDT" : "CST",
          "America/Denver": d.getMonth() >= 2 && d.getMonth() < 10 ? "MDT" : "MST",
          "Europe/London": d.getMonth() >= 2 && d.getMonth() < 9 ? "BST" : "GMT",
          "Europe/Paris": d.getMonth() >= 2 && d.getMonth() < 9 ? "CEST" : "CET",
          "Australia/Sydney": d.getMonth() >= 9 || d.getMonth() < 3 ? "AEDT" : "AEST"
        }[H] || H, g = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: H
        }), m = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: !0,
          timeZone: H
        });
        return `⏱️ Last Updated: ${g} at ${m} ${_}`;
      } catch {
        return `⏱️ Last Updated: ${p}`;
      }
    }
    function ce() {
      return [
        {
          label: "Margin Impact",
          action: (p, d) => {
            const H = d.getRow().getData();
            Qa(H);
          }
        },
        {
          separator: !0
        },
        {
          label: (p) => {
            const d = p.getData();
            return at(d.fetched_at);
          },
          action: () => {
          },
          disabled: !0
        },
        {
          separator: !0
        }
      ];
    }
    function Ca(p) {
      const d = S.value.indexOf(p);
      d > -1 && (S.value.splice(d, 1), _r(S.value), ut(() => {
        lt();
      }));
    }
    const nA = j(!1);
    function lt() {
      if (!h.value) return;
      if (u) {
        try {
          u.destroy();
        } catch {
        }
        u = null;
      }
      nA.value = !1;
      const p = !w.value, d = /* @__PURE__ */ new Map();
      [
        // Copy all your column objects here, as in your current columns array
        // (You can copy-paste from your current columns array, no changes needed)
        // ...START COPY...
        {
          title: "Account",
          field: "legal_entity",
          minWidth: 80,
          width: J.value.legal_entity || void 0,
          frozen: !0,
          visible: S.value.includes("legal_entity"),
          bottomCalc: p ? () => "All Accounts" : void 0,
          bottomCalcFormatter: p ? () => "All Accounts" : void 0,
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("legal_entity")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getRow().getData();
            if (m != null && m._isThesisGroup)
              return g.getValue() || "";
            const C = g.getValue();
            return typeof C == "object" && C !== null ? C.name || C.id || "" : C || "";
          },
          cellClick: (g, m) => {
            var I;
            if ((I = m.getRow().getData()) != null && I._isThesisGroup) return;
            const C = m.getValue(), F = typeof C == "object" && C !== null ? C.name || C.id : C;
            es("legal_entity", F);
          },
          contextMenu: [
            ...ce()
          ]
        },
        {
          title: "Financial Instrument",
          field: "symbol",
          minWidth: 200,
          width: J.value.symbol || void 0,
          // ADD THIS LINE
          frozen: !0,
          visible: S.value.includes("symbol"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("symbol")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getRow().getData();
            if (m != null && m._isThesisGroup) {
              const I = "#495057", X = g.getValue() || "";
              return `<span style="font-weight: 600; color: ${I};">${X}</span>`;
            }
            const C = ue(g.getValue()), F = new Set(c.value);
            return C.map((I) => `<span class="${F.has(I) ? "fi-tag fi-tag-selected" : "fi-tag"}">${I}</span>`).join(" ");
          },
          cellClick: (g, m) => {
            var X;
            const C = m.getRow().getData();
            if (C != null && C._isThesisGroup) return;
            const I = g.target.closest(".fi-tag");
            if (I) {
              const se = (X = I.textContent) == null ? void 0 : X.trim();
              se && es("symbol", se);
            }
          },
          contextMenu: ce()
        },
        {
          title: "Thesis",
          field: "thesis",
          minWidth: 80,
          width: J.value.thesis || void 0,
          // ADD THIS LINE
          visible: S.value.includes("thesis"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("thesis")}</span>
        </div>`,
          formatter: (g) => {
            try {
              const m = g.getRow().getData();
              if (m != null && m._isThesisGroup) return "";
              const C = g.getValue();
              return C ? `<span class="${f.value.includes(C.title) ? "thesis-tag thesis-tag-selected" : "thesis-tag"}" title="${C.description || ""}">${C.title}</span>` : '<span style="color: #6c757d; font-style: italic;">No thesis</span>';
            } catch (m) {
              return console.warn("Thesis formatter error:", m), '<span style="color: #6c757d; font-style: italic;">Error</span>';
            }
          },
          accessor: (g) => (g == null ? void 0 : g.id) || "",
          editor: "list",
          editorParams: (g) => {
            try {
              const m = { "": "No thesis" };
              (l.data.value || []).forEach((X) => {
                m[X.id] = X.title;
              });
              const F = g.getRow().getData().thesis, I = (F == null ? void 0 : F.id) || "";
              return {
                values: m,
                defaultValue: I,
                clearable: !0,
                verticalNavigation: "editor"
              };
            } catch (m) {
              return console.warn("Thesis editor params error:", m), { values: { "": "No thesis" } };
            }
          },
          mutator: (g, m, C) => {
            try {
              if (typeof g == "object" && g !== null)
                return g;
              if (typeof g == "string") {
                if (!g) return null;
                const F = (l.data.value || []).find((I) => I.id === g);
                return F ? { id: F.id, title: F.title, description: F.description } : null;
              }
              return null;
            } catch (F) {
              return console.warn("Thesis mutator error:", F), null;
            }
          },
          cellEdited: async (g) => {
            try {
              const m = g.getValue(), C = (m == null ? void 0 : m.id) || null, F = g.getRow().getData(), I = F == null ? void 0 : F.symbol;
              if (!I) return;
              const X = Al(I);
              if (!X) return;
              await tt(X, C);
            } catch (m) {
              console.error("Failed to update thesis:", m);
              try {
                g.restoreOldValue();
              } catch (C) {
                console.warn("Could not revert cell value:", C);
              }
            }
          },
          cellClick: (g, m) => {
            try {
              const C = m.getRow().getData();
              if (C != null && C._isThesisGroup) return;
              g.detail === 1 && setTimeout(() => handleThesisCellFilterClick(m), 200);
            } catch (C) {
              console.warn("Thesis cell click error:", C);
            }
          },
          cellDblClick: (g, m) => {
            try {
              const C = m.getRow().getData();
              C != null && C._isThesisGroup || m.edit();
            } catch (C) {
              console.warn("Thesis cell double click error:", C);
            }
          },
          contextMenu: ce()
        },
        {
          title: "Asset Class",
          field: "asset_class",
          minWidth: 80,
          width: J.value.asset_class || void 0,
          visible: S.value.includes("asset_class"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("asset_class")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getRow().getData();
            return m != null && m._isThesisGroup ? "" : g.getValue() || "";
          },
          cellClick: (g, m) => {
            const C = m.getRow().getData();
            if (C != null && C._isThesisGroup) return;
            const F = m.getValue();
            es("asset_class", F);
          },
          contextMenu: ce()
        },
        {
          title: "Conid",
          field: "conid",
          minWidth: 80,
          width: J.value.conid || void 0,
          // ADD THIS LINE
          visible: S.value.includes("conid"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("conid")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getRow().getData();
            return m != null && m._isThesisGroup ? "" : g.getValue() || "";
          },
          contextMenu: ce()
        },
        {
          title: "Underlying Conid",
          field: "undConid",
          minWidth: 80,
          width: J.value.undConid || void 0,
          // ADD THIS LINE
          visible: S.value.includes("undConid"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("undConid")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getRow().getData();
            return m != null && m._isThesisGroup ? "" : g.getValue() || "";
          },
          contextMenu: ce()
        },
        {
          title: "Multiplier",
          field: "multiplier",
          minWidth: 80,
          width: J.value.multiplier || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("multiplier"),
          // Set bottom calc during initialization
          bottomCalc: p ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatNumber(cell.getValue()) : undefined,
          bottomCalcFormatter: p ? (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${he(m)}</span>`;
          } : void 0,
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("multiplier")}</span>
        </div>`,
          formatter: (g) => {
            var m;
            return (m = g.getRow().getData()) != null && m._isThesisGroup ? "" : he(g.getValue());
          },
          contextMenu: ce()
        },
        {
          title: "Qty",
          field: "qty",
          minWidth: 70,
          width: J.value.qty || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("qty"),
          // Set bottom calc during initialization
          bottomCalc: p ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatNumber(cell.getValue()) : undefined,
          bottomCalcFormatter: p ? (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${he(m)}</span>`;
          } : void 0,
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("qty")}</span>
        </div>`,
          formatter: (g) => {
            var m;
            return (m = g.getRow().getData()) != null && m._isThesisGroup, he(g.getValue());
          },
          contextMenu: ce()
        },
        {
          title: "Avg Price",
          field: "avgPrice",
          minWidth: 80,
          width: J.value.avgPrice || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("avgPrice"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("avgPrice")}</span>
        </div>`,
          formatter: (g) => {
            var m;
            return (m = g.getRow().getData()) != null && m._isThesisGroup ? "" : Z(g.getValue());
          },
          contextMenu: ce()
        },
        {
          title: "Market Price",
          field: "price",
          minWidth: 80,
          width: J.value.price || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("price"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("price")}</span>
        </div>`,
          formatter: (g) => {
            var m;
            return (m = g.getRow().getData()) != null && m._isThesisGroup ? "" : Z(g.getValue());
          },
          contextMenu: ce()
        },
        {
          title: "Ul CM Price",
          field: "market_price",
          minWidth: 80,
          width: J.value.market_price || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("market_price"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("market_price")}</span>
        </div>`,
          formatter: (g) => {
            var F;
            if ((F = g.getRow().getData()) != null && F._isThesisGroup) return "";
            if (g.getRow().getData().asset_class === "STK")
              return '<span style="color:#aaa;font-style:italic;">Not applicable</span>';
            const C = g.getValue();
            return C == null ? "-" : Z(C);
          },
          contextMenu: [
            {
              label: (g) => {
                const C = g.getData().market_price_fetched_at;
                if (!C)
                  return "⏱️ Last Updated: Not available";
                try {
                  const F = new Date(C), I = Intl.DateTimeFormat().resolvedOptions().timeZone, se = {
                    "Asia/Kolkata": "IST",
                    "Asia/Calcutta": "IST",
                    "America/New_York": F.getMonth() >= 2 && F.getMonth() < 10 ? "EDT" : "EST",
                    "America/Los_Angeles": F.getMonth() >= 2 && F.getMonth() < 10 ? "PDT" : "PST",
                    "America/Chicago": F.getMonth() >= 2 && F.getMonth() < 10 ? "CDT" : "CST",
                    "America/Denver": F.getMonth() >= 2 && F.getMonth() < 10 ? "MDT" : "MST",
                    "Europe/London": F.getMonth() >= 2 && F.getMonth() < 9 ? "BST" : "GMT",
                    "Europe/Paris": F.getMonth() >= 2 && F.getMonth() < 9 ? "CEST" : "CET",
                    "Australia/Sydney": F.getMonth() >= 9 || F.getMonth() < 3 ? "AEDT" : "AEST"
                  }[I] || I, M = F.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: I
                  }), k = F.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: !0,
                    timeZone: I
                  });
                  return `⏱️ Last Updated: ${M} at ${k} ${se}`;
                } catch {
                  return `⏱️ Last Updated: ${C}`;
                }
              },
              action: () => {
              },
              disabled: !0
            },
            {
              separator: !0
            }
          ]
        },
        {
          title: "Instrument current market price",
          field: "instrument_market_price",
          minWidth: 80,
          width: J.value.instrument_market_price || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("instrument_market_price"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("instrument_market_price")}</span>
        </div>`,
          formatter: (g) => {
            var F;
            if ((F = g.getRow().getData()) != null && F._isThesisGroup) return "";
            const m = g.getRow().getData();
            let C = null;
            return m.asset_class === "OPT" ? C = m.option_market_price : (m.asset_class === "STK" || m.asset_class === "FUND") && (C = m.market_price), C == null ? "-" : Z(C);
          },
          contextMenu: [
            {
              label: (g) => {
                const C = g.getData().market_price_fetched_at;
                if (!C)
                  return "⏱️ Last Updated: Not available";
                try {
                  const F = new Date(C), I = Intl.DateTimeFormat().resolvedOptions().timeZone, se = {
                    "Asia/Kolkata": "IST",
                    "Asia/Calcutta": "IST",
                    "America/New_York": F.getMonth() >= 2 && F.getMonth() < 10 ? "EDT" : "EST",
                    "America/Los_Angeles": F.getMonth() >= 2 && F.getMonth() < 10 ? "PDT" : "PST",
                    "America/Chicago": F.getMonth() >= 2 && F.getMonth() < 10 ? "CDT" : "CST",
                    "America/Denver": F.getMonth() >= 2 && F.getMonth() < 10 ? "MDT" : "MST",
                    "Europe/London": F.getMonth() >= 2 && F.getMonth() < 9 ? "BST" : "GMT",
                    "Europe/Paris": F.getMonth() >= 2 && F.getMonth() < 9 ? "CEST" : "CET",
                    "Australia/Sydney": F.getMonth() >= 9 || F.getMonth() < 3 ? "AEDT" : "AEST"
                  }[I] || I, M = F.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: I
                  }), k = F.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: !0,
                    timeZone: I
                  });
                  return `⏱️ Last Updated: ${M} at ${k} ${se}`;
                } catch {
                  return `⏱️ Last Updated: ${C}`;
                }
              },
              action: () => {
              },
              disabled: !0
            },
            {
              separator: !0
            }
          ]
        },
        {
          title: "Market Value",
          field: "market_value",
          minWidth: 80,
          width: J.value.market_value || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("market_value"),
          // Set bottom calc during initialization
          bottomCalc: p ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
          bottomCalcFormatter: p ? (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Z(m)}</span>`;
          } : void 0,
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("market_value")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getRow().getData();
            return m != null && m._isThesisGroup, Z(g.getValue());
          },
          contextMenu: ce()
        },
        {
          title: "P&L Unrealized",
          field: "unrealized_pnl",
          minWidth: 80,
          width: J.value.unrealized_pnl || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("unrealized_pnl"),
          // Set bottom calc during initialization
          bottomCalc: p ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
          bottomCalcFormatter: p ? (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Z(m)}</span>`;
          } : void 0,
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("unrealized_pnl")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Z(m)}</span>`;
          },
          contextMenu: ce()
        },
        // ...inside columns array, after 'unrealized_pnl' column...
        {
          title: "Break even price P&L",
          field: "be_price_pnl",
          minWidth: 80,
          width: J.value.be_price_pnl || void 0,
          hozAlign: "right",
          visible: S.value.includes("be_price_pnl"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("be_price_pnl")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getRow().getData();
            if (m.asset_class === "OPT" && m.symbol && m.symbol.includes("P")) {
              const C = m.market_price, F = m.computed_be_price;
              let I = m.qty;
              const X = m.multiplier, M = ue(m.symbol)[2], k = M ? parseFloat(M) : null;
              if (I = Math.abs(I), C != null && F !== null && F !== void 0 && I !== null && I !== void 0 && X !== null && X !== void 0 && k !== null && !isNaN(k)) {
                const re = (Math.min(C, k) - F) * I * X, Be = Math.abs(re), Ut = Math.abs(re % 1);
                let Ht;
                Be === 0 || Ut < Be * 0.01 ? Ht = Z(Math.trunc(re)) : Ht = Z(re);
                let Ge = "";
                return re > 0 ? Ge = "pnl-positive" : re < 0 ? Ge = "pnl-negative" : Ge = "pnl-zero", `<span class="${Ge}">${Ht}</span>`;
              }
            }
            return '<span style="color:#aaa;font-style:italic;">Not applicable</span>';
          },
          bottomCalc: p ? (g, m) => {
            let C = 0;
            for (const F of m)
              if (F.asset_class === "OPT" && F.symbol && F.symbol.includes("P")) {
                const I = F.market_price, X = F.computed_be_price;
                let se = F.qty;
                const M = F.multiplier, V = ue(F.symbol)[2], re = V ? parseFloat(V) : null;
                if (se = Math.abs(se), I != null && X !== null && X !== void 0 && se !== null && se !== void 0 && M !== null && M !== void 0 && re !== null && !isNaN(re)) {
                  const Ut = (Math.min(I, re) - X) * se * M;
                  C += Ut;
                }
              }
            return C;
          } : !1,
          bottomCalcFormatter: p ? (g) => {
            const m = g.getValue(), C = Math.abs(m), F = Math.abs(m % 1);
            let I;
            C === 0 || F < C * 0.01 ? I = Z(Math.trunc(m)) : I = Z(m);
            let X = "";
            return m > 0 ? X = "pnl-positive" : m < 0 ? X = "pnl-negative" : X = "pnl-zero", `<span class="${X}">${I}</span>`;
          } : void 0,
          // --- CONTEXT MENU FOR FULL DECIMAL CALCULATION ---
          contextMenu: [
            {
              label: (g) => {
                const m = g.getData();
                if (m.asset_class === "OPT" && m.symbol && m.symbol.includes("P")) {
                  const C = m.market_price, F = m.computed_be_price;
                  let I = m.qty;
                  const X = m.multiplier, M = ue(m.symbol)[2], k = M ? parseFloat(M) : null;
                  if (I = Math.abs(I), C != null && F !== null && F !== void 0 && I !== null && I !== void 0 && X !== null && X !== void 0 && k !== null && !isNaN(k)) {
                    const V = Math.min(C, k), re = (V - F) * I * X;
                    return [
                      "Calculation: (min(Market Price, Strike Price) - BE Price) × |Qty| × Multiplier",
                      `= (min(${Z(C)}, ${Z(k)}) - ${Z(F)}) × ${I} × ${X}`,
                      `= (${Z(V)} - ${Z(F)}) × ${I} × ${X}`,
                      `= ${Z(V - F)} × ${I} × ${X}`,
                      `= ${Z((V - F) * I)} × ${X}`,
                      `<b>= ${Z(re)}</b> <span style="color:#888">(full decimal)</span>`
                    ].join("<br>");
                  }
                }
                return "Not applicable for this row";
              },
              action: () => {
              },
              disabled: !0
            },
            { separator: !0 }
          ]
        },
        {
          title: "Entry cash flow",
          field: "computed_cash_flow_on_entry",
          minWidth: 80,
          width: J.value.computed_cash_flow_on_entry || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("computed_cash_flow_on_entry"),
          // Set bottom calc during initialization
          bottomCalc: p ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
          bottomCalcFormatter: p ? (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Z(m)}</span>`;
          } : void 0,
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("computed_cash_flow_on_entry")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Z(m)}</span>`;
          },
          contextMenu: ce()
        },
        {
          title: "If exercised cash flow",
          field: "computed_cash_flow_on_exercise",
          minWidth: 80,
          width: J.value.computed_cash_flow_on_exercise || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("computed_cash_flow_on_exercise"),
          // Set bottom calc during initialization
          bottomCalc: p ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
          bottomCalcFormatter: p ? (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Z(m)}</span>`;
          } : void 0,
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("computed_cash_flow_on_exercise")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getValue();
            let C = "";
            return m > 0 ? C = "pnl-positive" : m < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Z(m)}</span>`;
          },
          contextMenu: ce()
        },
        {
          title: "(Entry / If exercised) cash flow",
          field: "entry_exercise_cash_flow_pct",
          minWidth: 100,
          width: J.value.entry_exercise_cash_flow_pct || void 0,
          hozAlign: "right",
          visible: S.value.includes("entry_exercise_cash_flow_pct"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("entry_exercise_cash_flow_pct")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getRow().getData();
            if (m.asset_class === "OPT" && m.computed_cash_flow_on_entry != null && m.computed_cash_flow_on_exercise != null && m.computed_cash_flow_on_exercise !== 0) {
              const C = m.computed_cash_flow_on_entry / m.computed_cash_flow_on_exercise * 100;
              return `<span>${Math.abs(C.toFixed(2)) + "%"}</span>`;
            }
            return '<span style="color:#aaa;font-style:italic;">Not applicable</span>';
          },
          bottomCalc: !1,
          //contextMenu: createFetchedAtContextMenu(),
          contextMenu: [
            {
              label: (g) => {
                const m = g.getData();
                if (m.asset_class === "OPT" && m.computed_cash_flow_on_entry != null && m.computed_cash_flow_on_exercise != null && m.computed_cash_flow_on_exercise !== 0) {
                  const C = m.computed_cash_flow_on_entry / m.computed_cash_flow_on_exercise * 100;
                  return [
                    "Calculation: (Entry cash flow / If exercised cash flow) × 100",
                    `= (${Z(m.computed_cash_flow_on_entry)} / ${Z(m.computed_cash_flow_on_exercise)}) × 100`,
                    `= ${C.toFixed(2)}%`
                  ].join("<br>");
                }
                return "Not applicable for this row";
              },
              action: () => {
              },
              disabled: !0
            },
            { separator: !0 }
          ]
        },
        {
          title: "BE Price",
          field: "computed_be_price",
          minWidth: 80,
          width: J.value.computed_be_price || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: S.value.includes("computed_be_price"),
          titleFormatter: (g) => `<div class="header-with-close">
          <span>${me("computed_be_price")}</span>
        </div>`,
          formatter: (g) => {
            const m = g.getValue();
            return m == null ? "-" : he(m);
          },
          contextMenu: ce()
        }
      ].forEach((g) => d.set(g.field, g));
      const O = S.value.map((g) => d.get(g)).filter(Boolean), _ = {
        data: Ot.value,
        columns: O,
        layout: "fitColumns",
        height: "100%",
        renderHorizontal: "basic",
        renderVertical: "basic",
        placeholder: "No positions available",
        columnDefaults: {
          resizable: !0,
          headerSort: !0,
          vertAlign: "middle"
        },
        virtualDom: !1,
        pagination: !1,
        paginationSize: 100,
        paginationSizeSelector: [100, 200, 500],
        rowFormatter: (g) => {
          try {
            const m = g.getData(), C = g.getElement();
            m != null && m._isThesisGroup && C && (C.style.backgroundColor = "#f8f9fa", C.style.fontWeight = "bold", C.style.borderTop = "2px solid #dee2e6");
          } catch (m) {
            console.warn("Row formatter error:", m);
          }
        },
        rowClick: (g, m) => {
          try {
            const C = m.getData();
            C._isThesisGroup || (A("row-click", C), t.onRowClick && t.onRowClick(C));
          } catch (C) {
            console.warn("Row click error:", C);
          }
        },
        movableColumns: !0
      };
      w.value && (_.dataTree = !0, _.dataTreeChildField = "_children", _.dataTreeStartExpanded = !0, _.dataTreeChildIndent = 20, _.dataTreeElementColumn = "symbol", _.pagination = !1);
      try {
        u = new yu(h.value, _), u.on("columnResized", (g) => {
          const m = g.getField(), C = g.getWidth();
          J.value[m] = C, q(J.value);
        }), u.on("tableBuilt", () => {
          var F, I;
          const g = (F = h.value) == null ? void 0 : F.querySelectorAll(".header-close-btn");
          g == null || g.forEach((X) => {
            X.addEventListener("click", (se) => {
              se.stopPropagation();
              const M = se.target.getAttribute("data-field");
              M && Ca(M);
            });
          });
          const m = u.getColumn("computed_be_price");
          if (m) {
            const X = m.getWidth();
            m.updateDefinition({
              title: X >= 140 ? "Break even price" : "BE Price"
            }), u.redraw(!0);
          }
          const C = (I = h.value) == null ? void 0 : I.querySelectorAll(".header-rename-btn");
          C == null || C.forEach((X) => {
            X.addEventListener("click", (se) => {
              se.stopPropagation();
              const M = se.target.getAttribute("data-field");
              if (M) {
                const k = v.find((V) => V.field === M);
                W(M, B.value[M] || ((k == null ? void 0 : k.label) ?? M));
              }
            });
          }), hA();
        }), u.on("dataFiltered", function() {
          hA();
        }), nA.value = !0, setTimeout(() => {
          Fe(), qi(), hA();
        }, 50);
      } catch (g) {
        console.error("Error creating Tabulator:", g);
      }
    }
    const Ot = ns(() => w.value ? va.value : a.value || []), va = ns(() => {
      if (!w.value || !a.value || !l.data.value)
        return a.value || [];
      let p = a.value.filter((M) => M.thesis && M.thesis.id);
      i.value && (p = p.filter((M) => (typeof M.legal_entity == "object" && M.legal_entity !== null ? M.legal_entity.name || M.legal_entity.id : M.legal_entity) === i.value)), p = p.filter((M) => {
        if (c.value.length > 0) {
          const k = M.symbol;
          if (!k) return !1;
          const V = ue(k);
          if (!c.value.every((Be) => V.includes(Be))) return !1;
        }
        if (f.value.length > 0) {
          const k = M.thesis;
          if (!k || !k.title || !f.value.includes(k.title)) return !1;
        }
        return !0;
      });
      const d = /* @__PURE__ */ new Map();
      (l.data.value || []).forEach((M) => {
        d.set(M.id, { ...M });
      });
      const H = /* @__PURE__ */ new Map();
      p.forEach((M) => {
        const k = M.thesis.id;
        H.has(k) || H.set(k, []), H.get(k).push(M);
      });
      const O = /* @__PURE__ */ new Map();
      function _(M, k = []) {
        const V = d.get(M);
        if (!V) return null;
        const re = {
          id: `thesis-${M}`,
          _isThesisGroup: !0,
          thesis: V,
          symbol: `📋 ${V.title}`,
          legal_entity: `${k.length} position${k.length !== 1 ? "s" : ""}`,
          _children: k.map((Be) => ({
            ...Be,
            id: `pos-${Be.conid}-${Be.internal_account_id}`
          }))
        };
        for (const Be of n)
          re[Be] = k.reduce((Ut, Ht) => {
            const Ge = Ht[Be];
            return Ut + (typeof Ge == "number" && Number.isFinite(Ge) ? Ge : 0);
          }, 0);
        return re;
      }
      function g(M, k) {
        for (const V of n) {
          const re = M[V] || 0, Be = k[V] || 0;
          M[V] = re + Be;
        }
      }
      H.forEach((M, k) => {
        const V = _(k, M);
        V && O.set(k, V);
      });
      const m = new Set(O.keys());
      function C(M) {
        const k = d.get(M);
        if (!k || !k.parent_thesis_id) return;
        const V = k.parent_thesis_id;
        if (!O.has(V)) {
          const re = _(V, []);
          re && O.set(V, re);
        }
        C(V);
      }
      m.forEach((M) => {
        C(M);
      });
      const F = /* @__PURE__ */ new Map();
      O.forEach((M, k) => {
        const V = d.get(k);
        V && V.parent_thesis_id && O.has(V.parent_thesis_id) && (F.has(V.parent_thesis_id) || F.set(V.parent_thesis_id, []), F.get(V.parent_thesis_id).push(M));
      });
      const I = /* @__PURE__ */ new Set();
      function X(M) {
        if (I.has(M)) return;
        I.add(M);
        const k = O.get(M);
        if (!k) return;
        const V = F.get(M) || [];
        if (V.forEach((re) => {
          X(re.thesis.id);
        }), V.length > 0) {
          const re = k._children.length + V.reduce((Be, Ut) => {
            var Ge;
            const Ht = ((Ge = Ut.legal_entity.match(/\d+/)) == null ? void 0 : Ge[0]) || "0";
            return Be + parseInt(Ht);
          }, 0);
          k.legal_entity = `${re} position${re !== 1 ? "s" : ""}`, V.forEach((Be) => {
            g(k, Be);
          }), k._children = [...k._children, ...V];
        }
      }
      O.forEach((M, k) => {
        const V = d.get(k);
        V && !V.parent_thesis_id && X(k);
      });
      const se = [];
      return O.forEach((M, k) => {
        const V = d.get(k);
        V && !V.parent_thesis_id && se.push(M);
      }), se;
    });
    function Fe() {
      if (!(!u || !nA.value))
        try {
          w.value ? u.replaceData(Ot.value) : (u.replaceData(Ot.value), u.clearFilter(), u.setFilter((p) => {
            if (!p || i.value && (typeof p.legal_entity == "object" && p.legal_entity !== null ? p.legal_entity.name || p.legal_entity.id : p.legal_entity) !== i.value || s.value && p.asset_class !== s.value)
              return !1;
            if (c.value.length > 0) {
              const d = p.symbol;
              if (!d) return !1;
              const H = ue(d);
              if (!c.value.every((_) => H.includes(_))) return !1;
            }
            if (f.value.length > 0) {
              const d = p.thesis;
              if (!d || !d.title || !f.value.includes(d.title)) return !1;
            }
            return !0;
          })), Ea(), ut(() => {
            u && qi(), hA();
          });
        } catch (p) {
          console.warn("Error in updateFilters:", p);
        }
    }
    function Ea() {
      const p = [];
      i.value && p.push({ field: "legal_entity", value: i.value }), s.value && p.push({ field: "asset_class", value: s.value }), c.value.length > 0 && p.push({ field: "symbol", value: c.value.join(", ") }), f.value.length > 0 && p.push({ field: "thesis", value: f.value.join(", ") }), b.value = p;
    }
    function ya(p) {
      if (p === "symbol")
        c.value = [];
      else if (p === "thesis")
        f.value = [];
      else if (p === "legal_entity") {
        i.value = null;
        const d = new URL(window.location.href);
        d.searchParams.delete("all_cts_clientId"), window.history.replaceState({}, "", d.toString()), Le && Le.emit("account-filter-changed", {
          accountId: null,
          source: "positions"
        });
      } else p === "asset_class" && (s.value = null);
      Fe();
    }
    function Fa() {
      c.value = [], f.value = [], i.value = null, s.value = null;
      const p = new URL(window.location.href);
      p.searchParams.delete("all_cts_clientId"), p.searchParams.delete("all_cts_fi"), p.searchParams.delete("all_cts_thesis"), p.searchParams.delete("fac"), window.history.replaceState({}, "", p.toString()), Le && Le.emit("account-filter-changed", {
        accountId: null,
        source: "positions"
      }), Fe();
    }
    const oA = j(!1), Ji = j(null), ji = j(null), Yi = j(!1), Mr = j(null), Qe = j(null), Zi = j(!1), aA = j(null);
    async function Qa(p) {
      Mr.value = p, Yi.value = !0, Qe.value = null, aA.value = null, Zi.value = !0;
      try {
        const d = p.internal_account_id, H = p.conid, O = Math.abs(p.qty), _ = p.qty > 0 ? "SELL" : "BUY", { data: g, error: m } = await pe.schema("hf").from("user_accounts_master").select("broker_account_id, api_url").eq("internal_account_id", d).single();
        if (m || !g)
          throw new Error(`Account not found: ${(m == null ? void 0 : m.message) || "No account data"}`);
        const C = g.broker_account_id, I = `${g.api_url}/api/margin-impact?conid=${H}&side=${_}&quantity=${O}&account_id=${C}`, se = await (await fetch(I)).json();
        Qe.value = se;
      } catch (d) {
        aA.value = d.message;
      } finally {
        Zi.value = !1;
      }
    }
    function Dr() {
      Yi.value = !1, Mr.value = null, Qe.value = null, aA.value = null;
    }
    function Ua() {
      oA.value = !oA.value;
    }
    function Sr() {
      oA.value = !1;
    }
    function kr(p) {
      oA.value && ji.value && Ji.value && !ji.value.contains(p.target) && !Ji.value.contains(p.target) && Sr();
    }
    const Kt = j(!1);
    Ye([() => o.isSuccess.value, h], async ([p, d]) => {
      p && d && !Kt.value && (await ut(), console.log("🚀 Initializing Tabulator with data:", Ot.value.length, "rows"), lt(), Kt.value = !0);
    }, { immediate: !0 }), Ye(Ot, async (p) => {
      if (!(!u || !p))
        try {
          w.value && !u.options.dataTree || !w.value && u.options.dataTree ? lt() : u.replaceData(p), await ut(), qi();
        } catch (d) {
          console.warn("Error updating table data:", d);
          try {
            lt();
          } catch (H) {
            console.error("Failed to rebuild table:", H);
          }
        }
    }, { deep: !0 }), Ye(S, async (p) => {
      if (_r(p), !!u)
        try {
          lt();
        } catch (d) {
          console.warn("Error updating column visibility:", d);
        }
    }, { deep: !0 }), Ye(c, () => {
      $i(), u && nA.value && (Fe(), u.redraw(!0));
    }, { deep: !0 }), Ye(f, () => {
      $i(), Fe(), u && u.redraw(!0);
    }, { deep: !0 }), Ye(s, () => {
      $i(), Fe(), u && u.redraw(!0);
    }), Ye(w, async (p) => {
      Ra(p), u && (u.destroy(), u = null), await ut(), lt();
    });
    function _r(p) {
      const d = new URL(window.location.href);
      d.searchParams.set("position_cols", p.join("-and-")), window.history.replaceState({}, "", d.toString());
    }
    function Or() {
      const p = new URL(window.location.href), d = p.searchParams.get("all_cts_fi"), H = d ? d.split("-and-").join(",") : void 0, O = p.searchParams.get("fac") || void 0, _ = p.searchParams.get("all_cts_clientId") || void 0, g = p.searchParams.get("all_cts_thesis"), m = g ? g.split("-and-").join(",") : void 0;
      return { symbol: H, asset_class: O, legal_entity: _, thesis: m };
    }
    function $i() {
      const p = new URL(window.location.href);
      c.value.length > 0 ? p.searchParams.set("all_cts_fi", c.value.join("-and-")) : p.searchParams.delete("all_cts_fi"), f.value.length > 0 ? p.searchParams.set("all_cts_thesis", f.value.join("-and-")) : p.searchParams.delete("all_cts_thesis"), s.value ? p.searchParams.set("fac", s.value) : p.searchParams.delete("fac"), window.history.replaceState({}, "", p.toString());
    }
    function Ha() {
      return new URL(window.location.href).searchParams.get("group_by_thesis") === "true";
    }
    function Ra(p) {
      const d = new URL(window.location.href);
      p ? d.searchParams.set("group_by_thesis", "true") : d.searchParams.delete("group_by_thesis"), window.history.replaceState({}, "", d.toString());
    }
    const Le = Wa("eventBus");
    Xa(async () => {
      document.addEventListener("click", kr);
      const p = Or();
      p.symbol && (c.value = p.symbol.split(",").map((d) => d.trim())), p.thesis && (f.value = p.thesis.split(",").map((d) => d.trim())), p.legal_entity && (i.value = p.legal_entity), p.asset_class && (s.value = p.asset_class), B.value = y(), w.value = Ha(), o.isSuccess.value && h.value && !Kt.value && (await ut(), console.log("🚀 Initializing Tabulator on mount with data:", Ot.value.length, "rows"), lt(), Kt.value = !0), Fe(), Le && (Le.on("account-filter-changed", Kr), Le.on("symbol-filter-changed", Pr)), ut(() => {
        hA();
      });
    }), Ja(() => {
      document.removeEventListener("click", kr), u && u.destroy(), Le && (Le.off("account-filter-changed", Kr), Le.off("symbol-filter-changed", Pr));
    });
    function Kr(p) {
      if (console.log("📍 [Positions] Received account filter:", p), p.source === "positions") return;
      i.value = p.accountId;
      const d = new URL(window.location.href);
      p.accountId ? d.searchParams.set("all_cts_clientId", p.accountId) : d.searchParams.delete("all_cts_clientId"), window.history.replaceState({}, "", d.toString()), Fe();
    }
    function Pr(p) {
      if (console.log("📍 [Positions] Received symbol filter:", p), p.source === "positions") return;
      c.value = p.symbolTags;
      const d = new URL(window.location.href);
      p.symbolTags.length > 0 ? d.searchParams.set("all_cts_fi", p.symbolTags.join("-and-")) : d.searchParams.delete("all_cts_fi"), window.history.replaceState({}, "", d.toString()), Fe();
    }
    function xa() {
      typeof window < "u" && window.$router ? window.$router.push("/positions") : window.location.href = "/positions";
    }
    function qi() {
      if (!(!u || !nA.value))
        try {
          u.redraw();
        } catch (p) {
          console.warn("Error in toggleBottomCalc:", p);
        }
    }
    function es(p, d) {
      if (p === "symbol") {
        const H = String(d).trim(), O = c.value.indexOf(H);
        O >= 0 ? c.value.splice(O, 1) : c.value.push(H), Fe(), Le && Le.emit("symbol-filter-changed", {
          symbolTags: c.value,
          source: "positions"
        });
        return;
      } else if (p === "thesis") {
        const H = (d == null ? void 0 : d.title) || String(d), O = f.value.indexOf(H);
        O >= 0 ? f.value.splice(O, 1) : f.value.push(H), Fe();
        return;
      } else if (p === "legal_entity") {
        const H = String(d);
        i.value = H;
        const O = new URL(window.location.href);
        O.searchParams.set("all_cts_clientId", H), window.history.replaceState({}, "", O.toString()), Fe(), Le && Le.emit("account-filter-changed", {
          accountId: H,
          source: "positions"
        });
        return;
      } else if (p === "asset_class") {
        const H = String(d);
        s.value = H, Fe();
        return;
      }
    }
    const lA = j(null);
    function Ta(p) {
      lA.value = p;
    }
    function La(p) {
      p.preventDefault();
    }
    function Ia(p) {
      if (lA.value === null || lA.value === p) return;
      const d = [...S.value], [H] = d.splice(lA.value, 1);
      d.splice(p, 0, H), S.value = d, lA.value = null;
    }
    function Ma(p) {
      if (p <= 0) return;
      const d = [...S.value];
      [d[p - 1], d[p]] = [d[p], d[p - 1]], S.value = d;
    }
    function Da(p) {
      if (p >= S.value.length - 1) return;
      const d = [...S.value];
      [d[p], d[p + 1]] = [d[p + 1], d[p]], S.value = d;
    }
    Ye(
      [() => o.isSuccess.value, i, c, f, w],
      async ([p]) => {
        p && Kt.value && (Fe(), u && u.redraw(!0));
      },
      { immediate: !0 }
    ), Ye([() => o.isSuccess.value, Kt], ([p, d]) => {
      p && d && Fe();
    }), window.addEventListener("popstate", () => {
      const p = Or();
      c.value = p.symbol ? p.symbol.split(",").map((d) => d.trim()) : [], f.value = p.thesis ? p.thesis.split(",").map((d) => d.trim()) : [], i.value = p.legal_entity || null, B.value = y(), Fe();
    });
    function me(p) {
      const d = v.find((H) => H.field === p);
      return B.value[p] || ((d == null ? void 0 : d.label) ?? p);
    }
    const ts = j(!1), As = j(null), Sa = j(""), VA = j("");
    async function ka() {
      if (console.log("Saving account alias:", t.userId, "for account ID:", As.value), !(!t.userId || !As.value))
        try {
          const { error: p } = await pe.schema("hf").from("user_account_alias").upsert({
            user_id: t.userId,
            internal_account_id: As.value,
            alias: VA.value,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }, { onConflict: "user_id,internal_account_id" });
          if (p) throw p;
          ts.value = !1, await _e.invalidateQueries({ queryKey: ["positions"] }), be("success", "Account renamed", `Account name updated to "${VA.value}"`);
        } catch (p) {
          be("error", "Rename failed", p.message);
        }
    }
    const is = j(0);
    function hA() {
      if (!u) {
        is.value = 0;
        return;
      }
      const p = u.rowManager.getDisplayRows().filter((d) => d.type === "row");
      is.value = p.length;
    }
    const NA = j(!1), zA = j([]), ht = j(null), ss = j(!1), GA = j(!1), uA = j(!1), cA = j(""), WA = j(!1), XA = j(""), rs = j(null);
    function _a() {
      cA.value = "", uA.value = !0;
    }
    async function Oa() {
      if (!h.value) {
        uA.value = !1;
        return;
      }
      uA.value = !1, GA.value = !0;
      try {
        const d = (await Jp(h.value)).toDataURL("image/png"), { error: H } = await pe.schema("hf").from("position_screenshots").insert([{
          user_id: t.userId,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          image_data: d.replace(/^data:image\/png;base64,/, ""),
          name: cA.value ? cA.value.trim() : null,
          archived: !1,
          meta: {
            filters: {
              account: i.value,
              assetClass: s.value,
              symbolTags: c.value,
              thesisTags: f.value,
              columns: S.value
            }
          }
        }]);
        if (H) throw H;
        be("success", "Screenshot saved!"), JA();
      } catch (p) {
        be("error", "Screenshot failed", p.message);
      } finally {
        GA.value = !1;
      }
    }
    async function Ka(p) {
      try {
        const { error: d } = await pe.schema("hf").from("position_screenshots").update({ archived: !0 }).eq("id", p);
        if (d) throw d;
        be("success", "Screenshot archived"), JA();
      } catch (d) {
        be("error", "Archive failed", d.message);
      }
    }
    async function JA() {
      if (!t.userId) {
        zA.value = [];
        return;
      }
      ss.value = !0;
      const { data: p, error: d } = await pe.schema("hf").from("position_screenshots").select("*").eq("user_id", t.userId).eq("archived", !1).order("created_at", { ascending: !1 }).limit(20);
      d || (zA.value = p || []), ss.value = !1;
    }
    function Pa(p) {
      rs.value = p.id, XA.value = p.name || "", WA.value = !0;
    }
    async function Va() {
      if (rs.value)
        try {
          const { error: p } = await pe.schema("hf").from("position_screenshots").update({ name: XA.value }).eq("id", rs.value);
          if (p) throw p;
          WA.value = !1, be("success", "Screenshot renamed"), JA();
        } catch (p) {
          be("error", "Rename failed", p.message);
        }
    }
    return Ye(NA, (p) => {
      p && JA();
    }), (p, d) => {
      var H, O, _;
      return G(), z(Pt, null, [
        E("div", Zp, [
          jA(o).isLoading.value ? (G(), z("div", $p, [...d[19] || (d[19] = [
            E("div", { class: "loading-spinner" }, null, -1),
            Rt(" Loading positions... ", -1)
          ])])) : jA(o).isError.value ? (G(), z("div", qp, [
            d[20] || (d[20] = E("h3", null, "Error loading positions", -1)),
            E("p", null, le(jA(o).error.value), 1)
          ])) : jA(o).isSuccess.value ? (G(), z("div", em, [
            E("div", tm, [
              E("h2", null, [
                r.showHeaderLink ? (G(), z("span", {
                  key: 0,
                  class: "positions-link",
                  onClick: xa
                }, "Positions")) : (G(), z("span", Am, "Positions"))
              ]),
              E("div", im, [
                E("div", sm, le(is.value) + " positions", 1),
                E("button", {
                  onClick: _a,
                  class: "screenshot-btn",
                  title: "Take Screenshot",
                  disabled: GA.value
                }, [
                  GA.value ? (G(), z("span", nm)) : (G(), z("span", om, "📸"))
                ], 8, rm),
                E("button", {
                  onClick: d[0] || (d[0] = (g) => NA.value = !0),
                  class: "screenshot-btn",
                  title: "See Old Screenshots"
                }, "🖼️"),
                E("button", {
                  class: Vr(["thesis-group-btn", { active: w.value }]),
                  onClick: d[1] || (d[1] = (g) => w.value = !w.value),
                  title: "Group positions by thesis"
                }, [
                  d[21] || (d[21] = E("span", { class: "icon" }, "📊", -1)),
                  Rt(" " + le(w.value ? "Ungroup" : "Group by Thesis"), 1)
                ], 2),
                E("button", {
                  ref_key: "columnsBtnRef",
                  ref: Ji,
                  class: "columns-btn",
                  onClick: We(Ua, ["stop"])
                }, [...d[22] || (d[22] = [
                  E("svg", {
                    class: "icon",
                    viewBox: "0 0 24 24",
                    width: "18",
                    height: "18"
                  }, [
                    E("path", {
                      fill: "currentColor",
                      d: "M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.21-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.22-.22-.39-.44-.39h-3.84c-.22 0-.41.16-.44.39l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c.04.31.06.63.06.94s-.02.63-.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.21.37.3.59.22l2.39.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.22.22.39.44.39h3.84c.22 0 .41-.16.44-.39l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.03-1.58ZM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5Z"
                    })
                  ], -1)
                ])], 512),
                E("button", {
                  onClick: d[2] || (d[2] = (g) => A("minimize")),
                  class: "minimize-button",
                  title: "Minimize Positions"
                }, " − "),
                oA.value ? (G(), z("div", {
                  key: 0,
                  ref_key: "columnsPopupRef",
                  ref: ji,
                  class: "columns-popup",
                  onClick: d[6] || (d[6] = We(() => {
                  }, ["stop"]))
                }, [
                  d[23] || (d[23] = E("div", { class: "popup-header" }, "Columns", -1)),
                  E("div", am, [
                    (G(!0), z(Pt, null, dA(S.value.map((g) => v.find((m) => m.field === g)).filter(Boolean), (g, m) => (G(), z("label", {
                      key: g.field,
                      class: "popup-item",
                      draggable: "true",
                      onDragstart: (C) => Ta(m),
                      onDragover: La,
                      onDrop: (C) => Ia(m),
                      style: { "align-items": "center" }
                    }, [
                      Vt(E("input", {
                        type: "checkbox",
                        value: g.field,
                        "onUpdate:modelValue": d[3] || (d[3] = (C) => S.value = C)
                      }, null, 8, hm), [
                        [Nr, S.value]
                      ]),
                      E("span", null, [
                        Rt(le(B.value[g.field] || g.label) + " ", 1),
                        B.value[g.field] ? (G(), z("span", um, " (" + le(g.label) + ") ", 1)) : xe("", !0)
                      ]),
                      E("button", {
                        class: "col-rename-btn",
                        type: "button",
                        onClick: We((C) => W(g.field, B.value[g.field] || g.label), ["stop"]),
                        title: "Rename column",
                        style: { "margin-left": "6px", "font-size": "13px", background: "none", border: "none", color: "#888", cursor: "pointer" }
                      }, "✎", 8, cm),
                      E("span", dm, [
                        E("button", {
                          type: "button",
                          onClick: We((C) => Ma(m), ["stop"]),
                          disabled: m === 0,
                          title: "Move up",
                          style: { background: "none", border: "none", cursor: "pointer", padding: "0", "margin-bottom": "2px" }
                        }, " ▲ ", 8, fm),
                        E("button", {
                          type: "button",
                          onClick: We((C) => Da(m), ["stop"]),
                          disabled: m === S.value.length - 1,
                          title: "Move down",
                          style: { background: "none", border: "none", cursor: "pointer", padding: "0" }
                        }, " ▼ ", 8, gm)
                      ])
                    ], 40, lm))), 128)),
                    (G(!0), z(Pt, null, dA(v.filter((g) => !S.value.includes(g.field)), (g) => (G(), z("label", {
                      key: g.field,
                      class: "popup-item"
                    }, [
                      Vt(E("input", {
                        type: "checkbox",
                        value: g.field,
                        "onUpdate:modelValue": d[4] || (d[4] = (m) => S.value = m)
                      }, null, 8, pm), [
                        [Nr, S.value]
                      ]),
                      E("span", null, le(g.label), 1)
                    ]))), 128))
                  ]),
                  E("div", mm, [
                    E("button", {
                      class: "btn btn-clear",
                      onClick: d[5] || (d[5] = (g) => S.value = v.map((m) => m.field))
                    }, "Show All"),
                    E("button", {
                      class: "btn",
                      onClick: Sr
                    }, "Done")
                  ])
                ], 512)) : xe("", !0)
              ])
            ]),
            b.value.length ? (G(), z("div", wm, [
              d[24] || (d[24] = E("span", { class: "filters-label" }, "Filtered by:", -1)),
              E("div", bm, [
                (G(!0), z(Pt, null, dA(b.value, (g) => (G(), z("span", {
                  key: `${g.field}-${g.value}`,
                  class: "filter-tag"
                }, [
                  E("strong", null, le(g.field === "symbol" ? "Financial Instrument" : g.field === "legal_entity" ? "Account" : g.field === "thesis" ? "Thesis" : "Asset Class") + ":", 1),
                  Rt(" " + le(g.value) + " ", 1),
                  E("button", {
                    class: "tag-clear",
                    onClick: (m) => ya(g.field)
                  }, "✕", 8, Bm)
                ]))), 128)),
                E("button", {
                  class: "btn btn-clear-all",
                  onClick: Fa
                }, "Clear all")
              ])
            ])) : xe("", !0),
            E("div", {
              ref_key: "tableDiv",
              ref: h,
              class: "positions-grid"
            }, null, 512)
          ])) : xe("", !0),
          E("div", Cm, [
            ja(Ya, {
              name: "toast",
              tag: "div"
            }, {
              default: Za(() => [
                (G(!0), z(Pt, null, dA(Oe.value, (g) => (G(), z("div", {
                  key: g.id,
                  class: Vr(["toast", `toast-${g.type}`]),
                  onClick: (m) => De(g.id)
                }, [
                  E("div", Em, [
                    g.type === "success" ? (G(), z("span", ym, "✅")) : g.type === "error" ? (G(), z("span", Fm, "❌")) : g.type === "warning" ? (G(), z("span", Qm, "⚠️")) : (G(), z("span", Um, "ℹ️"))
                  ]),
                  E("div", Hm, [
                    E("div", Rm, le(g.title), 1),
                    g.message ? (G(), z("div", xm, le(g.message), 1)) : xe("", !0)
                  ]),
                  E("button", {
                    class: "toast-close",
                    onClick: We((m) => De(g.id), ["stop"])
                  }, "×", 8, Tm)
                ], 10, vm))), 128))
              ]),
              _: 1
            })
          ]),
          ts.value ? (G(), z("div", Lm, [
            E("div", Im, [
              d[25] || (d[25] = E("h3", null, "Rename Account", -1)),
              Vt(E("input", {
                "onUpdate:modelValue": d[7] || (d[7] = (g) => VA.value = g),
                placeholder: Sa.value
              }, null, 8, Mm), [
                [YA, VA.value]
              ]),
              E("div", Dm, [
                E("button", { onClick: ka }, "Save"),
                E("button", {
                  onClick: d[8] || (d[8] = (g) => ts.value = !1)
                }, "Cancel")
              ])
            ])
          ])) : xe("", !0),
          L.value ? (G(), z("div", Sm, [
            E("div", km, [
              d[26] || (d[26] = E("h3", null, "Rename Column", -1)),
              Vt(E("input", {
                "onUpdate:modelValue": d[9] || (d[9] = (g) => Q.value = g),
                placeholder: "Column name"
              }, null, 512), [
                [YA, Q.value]
              ]),
              E("div", { class: "dialog-actions" }, [
                E("button", { onClick: K }, "Save"),
                E("button", { onClick: P }, "Cancel")
              ])
            ])
          ])) : xe("", !0),
          NA.value ? (G(), z("div", _m, [
            E("div", Om, [
              d[28] || (d[28] = E("h3", { class: "screenshots-title" }, "Past Screenshots", -1)),
              ss.value ? (G(), z("div", Km, "Loading screenshots...")) : zA.value.length === 0 ? (G(), z("div", Pm, "No screenshots yet.")) : (G(), z("div", Vm, [
                (G(!0), z(Pt, null, dA(zA.value, (g) => (G(), z("div", {
                  key: g.id,
                  class: "screenshot-list-item",
                  onClick: (m) => ht.value = g
                }, [
                  E("img", {
                    src: `data:image/png;base64,${g.image_data}`,
                    class: "screenshot-thumb",
                    alt: `Screenshot taken at ${new Date(g.created_at).toLocaleString()}`
                  }, null, 8, zm),
                  E("div", Gm, [
                    g.name ? (G(), z("strong", Wm, le(g.name), 1)) : (G(), z("span", Xm, "(Unnamed)")),
                    E("span", null, [
                      Rt(le(new Date(g.created_at).toLocaleString("en-US", {
                        timeZone: "America/Los_Angeles",
                        dateStyle: "medium",
                        timeStyle: "short"
                      })) + " ", 1),
                      d[27] || (d[27] = E("span", { style: { color: "#888", "font-size": "12px" } }, "PST", -1))
                    ]),
                    E("div", Jm, [
                      E("a", {
                        href: `data:image/png;base64,${g.image_data}`,
                        download: `positions-screenshot-${g.id}.png`,
                        class: "screenshot-download-link",
                        onClick: d[10] || (d[10] = We(() => {
                        }, ["stop"]))
                      }, "⬇️", 8, jm),
                      E("button", {
                        class: "screenshot-archive-btn",
                        onClick: We((m) => Ka(g.id), ["stop"]),
                        title: "Archive screenshot",
                        style: { background: "none", border: "1px solid #e9ecef", padding: "4px 8px", "border-radius": "6px", cursor: "pointer" }
                      }, " 🗄️ ", 8, Ym),
                      E("button", {
                        class: "screenshot-rename-btn",
                        onClick: We((m) => Pa(g), ["stop"]),
                        title: "Rename screenshot",
                        style: { background: "none", border: "1px solid #e9ecef", padding: "4px 8px", "border-radius": "6px", cursor: "pointer" }
                      }, " ✏️ ", 8, Zm)
                    ])
                  ])
                ], 8, Nm))), 128))
              ])),
              E("div", $m, [
                E("button", {
                  onClick: d[11] || (d[11] = (g) => NA.value = !1),
                  class: "screenshots-close"
                }, "Close")
              ])
            ]),
            ht.value ? (G(), z("div", {
              key: 0,
              class: "screenshot-preview-modal",
              onClick: d[13] || (d[13] = We((g) => ht.value = null, ["self"]))
            }, [
              E("div", qm, [
                E("img", {
                  src: `data:image/png;base64,${ht.value.image_data}`,
                  class: "screenshot-full-img"
                }, null, 8, ew),
                E("div", tw, [
                  E("span", null, [
                    Rt(le(new Date(ht.value.created_at).toLocaleString("en-US", {
                      timeZone: "America/Los_Angeles",
                      dateStyle: "medium",
                      timeStyle: "short"
                    })) + " ", 1),
                    d[29] || (d[29] = E("span", { style: { color: "#888", "font-size": "12px" } }, "PST", -1))
                  ]),
                  E("a", {
                    href: `data:image/png;base64,${ht.value.image_data}`,
                    download: `positions-screenshot-${ht.value.id}.png`,
                    class: "screenshot-download-link"
                  }, "⬇️ Download", 8, Aw),
                  E("button", {
                    onClick: d[12] || (d[12] = (g) => ht.value = null),
                    class: "screenshot-preview-close"
                  }, "Close")
                ])
              ])
            ])) : xe("", !0)
          ])) : xe("", !0),
          uA.value ? (G(), z("div", iw, [
            E("div", sw, [
              d[30] || (d[30] = E("h3", null, "Name screenshot", -1)),
              Vt(E("input", {
                "onUpdate:modelValue": d[14] || (d[14] = (g) => cA.value = g),
                placeholder: "Enter a name (optional)"
              }, null, 512), [
                [YA, cA.value]
              ]),
              E("div", rw, [
                E("button", { onClick: Oa }, "Save & Capture"),
                E("button", {
                  onClick: d[15] || (d[15] = (g) => uA.value = !1)
                }, "Cancel")
              ])
            ])
          ])) : xe("", !0),
          WA.value ? (G(), z("div", nw, [
            E("div", ow, [
              d[31] || (d[31] = E("h3", null, "Rename Screenshot", -1)),
              Vt(E("input", {
                "onUpdate:modelValue": d[16] || (d[16] = (g) => XA.value = g),
                placeholder: "Enter new name"
              }, null, 512), [
                [YA, XA.value]
              ]),
              E("div", aw, [
                E("button", { onClick: Va }, "Save"),
                E("button", {
                  onClick: d[17] || (d[17] = (g) => WA.value = !1)
                }, "Cancel")
              ])
            ])
          ])) : xe("", !0)
        ]),
        Yi.value ? (G(), z("div", {
          key: 0,
          class: "modal-overlay",
          onClick: Dr
        }, [
          E("div", {
            class: "modal-content",
            onClick: d[18] || (d[18] = We(() => {
            }, ["stop"]))
          }, [
            E("div", { class: "modal-header" }, [
              d[32] || (d[32] = E("h3", null, "Margin Impact", -1)),
              E("button", {
                class: "modal-close",
                onClick: Dr
              }, "×")
            ]),
            E("div", lw, [
              d[38] || (d[38] = E("p", null, "Closing out this position would have the following impact on your margin requirements:", -1)),
              Zi.value ? (G(), z("div", hw, [...d[33] || (d[33] = [
                E("div", { class: "loading-spinner" }, null, -1),
                Rt(" Loading margin impact data... ", -1)
              ])])) : aA.value ? (G(), z("div", uw, " Error loading margin impact: " + le(aA.value), 1)) : Qe.value ? (G(), z("div", dw, [
                E("table", fw, [
                  d[37] || (d[37] = E("thead", null, [
                    E("tr", null, [
                      E("th", null, "Account Metric"),
                      E("th", null, "Current"),
                      E("th", null, "Change"),
                      E("th", null, "Post-Trade")
                    ])
                  ], -1)),
                  E("tbody", null, [
                    (H = Qe.value.margin_impact) != null && H.equity_with_loan ? (G(), z("tr", gw, [
                      d[34] || (d[34] = E("td", null, "Equity with Loan", -1)),
                      E("td", null, le(Qe.value.margin_impact.equity_with_loan.current), 1),
                      E("td", null, le(Qe.value.margin_impact.equity_with_loan.change), 1),
                      E("td", null, le(Qe.value.margin_impact.equity_with_loan.post_trade), 1)
                    ])) : xe("", !0),
                    (O = Qe.value.margin_impact) != null && O.initial_margin ? (G(), z("tr", pw, [
                      d[35] || (d[35] = E("td", null, "Initial Margin", -1)),
                      E("td", null, le(Qe.value.margin_impact.initial_margin.current), 1),
                      E("td", null, le(Qe.value.margin_impact.initial_margin.change), 1),
                      E("td", null, le(Qe.value.margin_impact.initial_margin.post_trade), 1)
                    ])) : xe("", !0),
                    (_ = Qe.value.margin_impact) != null && _.maintenance_margin ? (G(), z("tr", mw, [
                      d[36] || (d[36] = E("td", null, "Maintenance Margin", -1)),
                      E("td", null, le(Qe.value.margin_impact.maintenance_margin.current), 1),
                      E("td", null, le(Qe.value.margin_impact.maintenance_margin.change), 1),
                      E("td", null, le(Qe.value.margin_impact.maintenance_margin.post_trade), 1)
                    ])) : xe("", !0)
                  ])
                ])
              ])) : (G(), z("div", cw, " No margin impact data available "))
            ])
          ])
        ])) : xe("", !0)
      ], 64);
    };
  }
}), bw = (r, e) => {
  const t = r.__vccOpts || r;
  for (const [A, i] of e)
    t[A] = i;
  return t;
}, Qw = /* @__PURE__ */ bw(ww, [["__scopeId", "data-v-00091bdb"]]);
export {
  Qw as Positions,
  Qw as default
};
