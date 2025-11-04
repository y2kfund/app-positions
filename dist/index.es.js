var xl = Object.defineProperty;
var Rl = (r, e, t) => e in r ? xl(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var x = (r, e, t) => Rl(r, typeof e != "symbol" ? e + "" : e, t);
import { inject as Zs, defineComponent as Tl, ref as J, computed as AA, watch as Ge, nextTick as vt, onMounted as Ll, onBeforeUnmount as Il, createElementBlock as K, openBlock as V, Fragment as ht, createElementVNode as E, createCommentVNode as ge, unref as Et, createTextVNode as ut, toDisplayString as te, withDirectives as ct, vModelText as Nt, normalizeClass as gi, withModifiers as Ve, renderList as yt, vModelCheckbox as mn, createVNode as Ml, TransitionGroup as Sl, withCtx as Dl } from "vue";
import { useSymbolCommentsQuery as kl, usePositionsQuery as _l, generateCommentKey as wn, useThesisQuery as Ol, useThesisConnectionsQuery as Pl, useSupabase as Kl, usePositionTradeMappingsQuery as Vl, extractSymbolRoot as Nl, upsertSymbolComment as zl, generatePositionMappingKey as Gl, savePositionTradeMappings as Wl } from "@y2kfund/core";
import { useQueryClient as Eo, useQuery as Xl } from "@tanstack/vue-query";
class Ue {
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
class ae {
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
let Jl = class yo extends Ue {
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
      let s = ae.elOffset(this.container);
      A -= s.left, i -= s.top;
    }
    return { x: A, y: i };
  }
  elementPositionCoords(e, t = "right") {
    var A = ae.elOffset(e), i, s, n;
    switch (this.container !== document.body && (i = ae.elOffset(this.container), A.left -= i.left, A.top -= i.top), t) {
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
    return this.childPopup && this.childPopup.hide(), this.childPopup = new yo(this.table, e, this), this.childPopup;
  }
};
class q extends Ue {
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
    return new Jl(this.table, e, t);
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
var jl = {
  rownum: function(r, e, t, A, i, s) {
    return s.getPosition();
  }
};
const dA = class dA extends q {
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
        dA.accessors[e] ? t = dA.accessors[e] : console.warn("Accessor Error - No such accessor found, ignoring: ", e);
        break;
      case "function":
        t = e;
        break;
    }
    return t;
  }
  //apply accessor to row
  transformRow(e, t) {
    var A = "accessor" + (t.charAt(0).toUpperCase() + t.slice(1)), i = e.getComponent(), s = ae.deepClone(e.data || {});
    return this.table.columnManager.traverse(function(n) {
      var o, a, l, h;
      n.modules.accessor && (a = n.modules.accessor[A] || n.modules.accessor.accessor || !1, a && (o = n.getFieldValue(s), o != "undefined" && (h = n.getComponent(), l = typeof a.params == "function" ? a.params(o, s, t, h, i) : a.params, n.setFieldValue(s, a.accessor(o, s, t, l, h, i)))));
    }), s;
  }
};
x(dA, "moduleName", "accessor"), //load defaults
x(dA, "accessors", jl);
let $s = dA;
var Yl = {
  method: "GET"
};
function qs(r, e) {
  var t = [];
  if (e = e || "", Array.isArray(r))
    r.forEach((i, s) => {
      t = t.concat(qs(i, e ? e + "[" + s + "]" : s));
    });
  else if (typeof r == "object")
    for (var A in r)
      t = t.concat(qs(r[A], e ? e + "[" + A + "]" : A));
  else
    t.push({ key: e, value: r });
  return t;
}
function Zl(r) {
  var e = qs(r), t = [];
  return e.forEach(function(A) {
    t.push(encodeURIComponent(A.key) + "=" + encodeURIComponent(A.value));
  }), t.join("&");
}
function Fo(r, e, t) {
  return r && t && Object.keys(t).length && (!e.method || e.method.toLowerCase() == "get") && (e.method = "get", r += (r.includes("?") ? "&" : "?") + Zl(t)), r;
}
function $l(r, e, t) {
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
function er(r, e) {
  var t = [];
  if (e = e || "", Array.isArray(r))
    r.forEach((i, s) => {
      t = t.concat(er(i, e ? e + "[" + s + "]" : s));
    });
  else if (typeof r == "object")
    for (var A in r)
      t = t.concat(er(r[A], e ? e + "[" + A + "]" : A));
  else
    t.push({ key: e, value: r });
  return t;
}
var ql = {
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
      var A = er(t), i = new FormData();
      return A.forEach(function(s) {
        i.append(s.key, s.value);
      }), i;
    }
  }
};
const $e = class $e extends q {
  constructor(e) {
    super(e), this.config = {}, this.url = "", this.urlGenerator = !1, this.params = !1, this.loaderPromise = !1, this.registerTableOption("ajaxURL", !1), this.registerTableOption("ajaxURLGenerator", !1), this.registerTableOption("ajaxParams", {}), this.registerTableOption("ajaxConfig", "get"), this.registerTableOption("ajaxContentType", "form"), this.registerTableOption("ajaxRequestFunc", !1), this.registerTableOption("ajaxRequesting", function() {
    }), this.registerTableOption("ajaxResponse", !1), this.contentTypeFormatters = $e.contentTypeFormatters;
  }
  //initialize setup options
  initialize() {
    this.loaderPromise = this.table.options.ajaxRequestFunc || $e.defaultLoaderPromise, this.urlGenerator = this.table.options.ajaxURLGenerator || $e.defaultURLGenerator, this.table.options.ajaxURL && this.setUrl(this.table.options.ajaxURL), this.setDefaultConfig(this.table.options.ajaxConfig), this.registerTableFunction("getAjaxUrl", this.getUrl.bind(this)), this.subscribe("data-loading", this.requestDataCheck.bind(this)), this.subscribe("data-params", this.requestParams.bind(this)), this.subscribe("data-load", this.requestData.bind(this));
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
    this.config = Object.assign({}, $e.defaultConfig), typeof e == "string" ? this.config.method = e : Object.assign(this.config, e);
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
x($e, "moduleName", "ajax"), //load defaults
x($e, "defaultConfig", Yl), x($e, "defaultURLGenerator", Fo), x($e, "defaultLoaderPromise", $l), x($e, "contentTypeFormatters", ql);
let tr = $e;
var eh = {
  replace: function(r) {
    return this.table.setData(r);
  },
  update: function(r) {
    return this.table.updateOrAddData(r);
  },
  insert: function(r) {
    return this.table.addData(r);
  }
}, th = {
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
}, Ah = {
  copyToClipboard: ["ctrl + 67", "meta + 67"]
}, ih = {
  copyToClipboard: function(r) {
    this.table.modules.edit.currentCell || this.table.modExists("clipboard", !0) && this.table.modules.clipboard.copy(!1, !0);
  }
}, sh = {
  keybindings: {
    bindings: Ah,
    actions: ih
  }
};
const Ht = class Ht extends q {
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
        this.pasteAction = Ht.pasteActions[e], this.pasteAction || console.warn("Clipboard Error - No such paste action found:", e);
        break;
      case "function":
        this.pasteAction = e;
        break;
    }
  }
  setPasteParser(e) {
    switch (typeof e) {
      case "string":
        this.pasteParser = Ht.pasteParsers[e], this.pasteParser || console.warn("Clipboard Error - No such paste parser found:", e);
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
x(Ht, "moduleName", "clipboard"), x(Ht, "moduleExtensions", sh), //load defaults
x(Ht, "pasteActions", eh), x(Ht, "pasteParsers", th);
let Ar = Ht;
class rh {
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
class Qo {
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
class qA extends Ue {
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
    return this.component || (this.component = new Qo(this)), this.component;
  }
}
class Uo {
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
var Ho = {
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
const Wt = class Wt extends Ue {
  constructor(e, t, A) {
    super(t.table), this.definition = e, this.parent = t, this.type = "column", this.columns = [], this.cells = [], this.isGroup = !1, this.isRowHeader = A, this.element = this.createElement(), this.contentElement = !1, this.titleHolderElement = !1, this.titleElement = !1, this.groupElement = this.createGroupElement(), this.hozAlign = "", this.vertAlign = "", this.field = "", this.fieldStructure = "", this.getFieldValue = "", this.setFieldValue = "", this.titleDownload = null, this.titleFormatterRendered = !1, this.mapDefinitions(), this.setField(this.definition.field), this.modules = {}, this.width = null, this.widthStyled = "", this.maxWidth = null, this.maxWidthStyled = "", this.maxInitialWidth = null, this.minWidth = null, this.minWidthStyled = "", this.widthFixed = !1, this.visible = !0, this.component = null, this.definition.columns ? (this.isGroup = !0, this.definition.columns.forEach((i, s) => {
      var n = new Wt(i, this);
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
    this.definition = this.table.columnManager.optionsList.generate(Wt.defaultOptionList, this.definition);
  }
  checkDefinition() {
    Object.keys(this.definition).forEach((e) => {
      Wt.defaultOptionList.indexOf(e) === -1 && console.warn("Invalid column definition option in '" + (this.field || this.definition.title) + "' column:", e);
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
    var t = new qA(this, e);
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
    return this.component || (this.component = new Uo(this)), this.component;
  }
  getPosition() {
    return this.table.columnManager.getVisibleColumnsByIndex().indexOf(this) + 1;
  }
  getParentComponent() {
    return this.parent instanceof Wt ? this.parent.getComponent() : !1;
  }
};
x(Wt, "defaultOptionList", Ho);
let Yt = Wt;
class es {
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
class Ie extends Ue {
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
    var t = this.element && ae.elVisible(this.element), A = {}, i;
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
    return this.component || (this.component = new es(this)), this.component;
  }
}
var nh = {
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
const xt = class xt extends q {
  constructor(e) {
    super(e), this.topCalcs = [], this.botCalcs = [], this.genColumn = !1, this.topElement = this.createElement(), this.botElement = this.createElement(), this.topRow = !1, this.botRow = !1, this.topInitialized = !1, this.botInitialized = !1, this.blocked = !1, this.recalcAfterBlock = !1, this.registerTableOption("columnCalcs", !0), this.registerColumnOption("topCalc"), this.registerColumnOption("topCalcParams"), this.registerColumnOption("topCalcFormatter"), this.registerColumnOption("topCalcFormatterParams"), this.registerColumnOption("bottomCalc"), this.registerColumnOption("bottomCalcParams"), this.registerColumnOption("bottomCalcFormatter"), this.registerColumnOption("bottomCalcFormatterParams");
  }
  createElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-calcs-holder"), e;
  }
  initialize() {
    this.genColumn = new Yt({ field: "value" }, this), this.subscribe("cell-value-changed", this.cellValueChanged.bind(this)), this.subscribe("column-init", this.initializeColumnCheck.bind(this)), this.subscribe("row-deleted", this.rowsUpdated.bind(this)), this.subscribe("scroll-horizontal", this.scrollHorizontal.bind(this)), this.subscribe("row-added", this.rowsUpdated.bind(this)), this.subscribe("column-moved", this.recalcActiveRows.bind(this)), this.subscribe("column-add", this.recalcActiveRows.bind(this)), this.subscribe("data-refreshed", this.recalcActiveRowsRefresh.bind(this)), this.subscribe("table-redraw", this.tableRedraw.bind(this)), this.subscribe("rows-visible", this.visibleRows.bind(this)), this.subscribe("scrollbar-vertical", this.adjustForScrollbar.bind(this)), this.subscribe("redraw-blocked", this.blockRedraw.bind(this)), this.subscribe("redraw-restored", this.restoreRedraw.bind(this)), this.subscribe("table-redrawing", this.resizeHolderWidth.bind(this)), this.subscribe("column-resized", this.resizeHolderWidth.bind(this)), this.subscribe("column-show", this.resizeHolderWidth.bind(this)), this.subscribe("column-hide", this.resizeHolderWidth.bind(this)), this.registerTableFunction("getCalcResults", this.getResults.bind(this)), this.registerTableFunction("recalc", this.userRecalc.bind(this)), this.resizeHolderWidth();
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
          xt.calculations[t.topCalc] ? A.topCalc = xt.calculations[t.topCalc] : console.warn("Column Calc Error - No such calculation found, ignoring: ", t.topCalc);
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
          xt.calculations[t.bottomCalc] ? A.botCalc = xt.calculations[t.bottomCalc] : console.warn("Column Calc Error - No such calculation found, ignoring: ", t.bottomCalc);
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
    return this.table.modExists("mutator") && this.table.modules.mutator.disable(), i = new Ie(A, this, "calc"), this.table.modExists("mutator") && this.table.modules.mutator.enable(), i.getElement().classList.add("tabulator-calcs", "tabulator-calcs-" + e), i.component = !1, i.getComponent = () => (i.component || (i.component = new rh(i)), i.component), i.generateCells = () => {
      var s = [];
      this.table.columnManager.columnsByIndex.forEach((n) => {
        this.genColumn.setField(n.getField()), this.genColumn.hozAlign = n.hozAlign, n.definition[e + "CalcFormatter"] && this.table.modExists("format") ? this.genColumn.modules.format = {
          formatter: this.table.modules.format.lookupFormatter(n.definition[e + "CalcFormatter"]),
          params: n.definition[e + "CalcFormatterParams"] || {}
        } : this.genColumn.modules.format = {
          formatter: this.table.modules.format.lookupFormatter("plaintext"),
          params: {}
        }, this.genColumn.definition.cssClass = n.definition.cssClass;
        var o = new qA(this.genColumn, i);
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
x(xt, "moduleName", "columnCalcs"), //load defaults
x(xt, "calculations", nh);
let ir = xt;
class xo extends q {
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
      t.push(A), A instanceof Ie && (A.create(), s = A.modules.dataTree, !s.index && s.children !== !1 && (n = this.getChildren(A, !1, !0), n.forEach((o) => {
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
      var s = new Ie(i || {}, this.table.rowManager);
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
      s instanceof Ie && A.push(s);
    })), A;
  }
  rowDeleting(e) {
    var t = e.modules.dataTree;
    t && t.children && Array.isArray(t.children) && t.children.forEach((A) => {
      A instanceof Ie && A.wipe();
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
    return typeof e == "object" ? e instanceof Ie ? A = e.data : e instanceof es ? A = e._getSelf().data : typeof HTMLElement < "u" && e instanceof HTMLElement ? t.modules.dataTree && (A = t.modules.dataTree.children.find((i) => i instanceof Ie ? i.element === e : !1), A && (A = A.data)) : e === null && (A = !1) : typeof e > "u" ? A = !1 : A = t.data[this.field].find((i) => i.data[this.table.options.index] == e), A && (Array.isArray(t.data[this.field]) && (A = t.data[this.field].indexOf(A)), A == -1 && (A = !1)), A;
  }
  getTreeChildren(e, t, A) {
    var i = e.modules.dataTree, s = [];
    return i && i.children && (Array.isArray(i.children) || (i.children = this.generateChildren(e)), i.children.forEach((n) => {
      n instanceof Ie && (s.push(t ? n.getComponent() : n), A && this.getTreeChildren(n, t, A).forEach((o) => {
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
x(xo, "moduleName", "dataTree");
function oh(r, e = {}, t) {
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
function ah(r, e, t) {
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
function lh(r, e = {}, t) {
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
  a.orientation || (a.orientation = e.orientation || "landscape"), a.unit || (a.unit = "pt"), r.forEach((g) => {
    switch (g.type) {
      case "header":
        A.push(c(g));
        break;
      case "group":
        i.push(c(g, n));
        break;
      case "calc":
        i.push(c(g, o));
        break;
      case "row":
        i.push(c(g));
        break;
    }
  });
  function c(g, w) {
    var B = [];
    return g.columns.forEach((v) => {
      var b;
      if (v) {
        switch (typeof v.value) {
          case "object":
            v.value = v.value !== null ? JSON.stringify(v.value) : "";
            break;
          case "undefined":
            v.value = "";
            break;
        }
        b = {
          content: v.value,
          colSpan: v.width,
          rowSpan: v.height
        }, w && (b.styles = w), B.push(b);
      }
    }), B;
  }
  h = this.dependencyRegistry.lookup("jspdf", "jsPDF"), u = new h(a), e.autoTable && (typeof e.autoTable == "function" ? s = e.autoTable(u) || {} : s = e.autoTable), l && (s.didDrawPage = function(g) {
    u.text(l, 40, 30);
  }), s.head = A, s.body = i, u.autoTable(s), e.documentProcessing && e.documentProcessing(u), t(u.output("arraybuffer"), "application/pdf");
}
function hh(r, e, t) {
  var A = this, i = e.sheetName || "Sheet1", s = this.dependencyRegistry.lookup("XLSX"), n = s.utils.book_new(), o = new Ue(this), a = "compress" in e ? e.compress : !0, l = e.writeOptions || { bookType: "xlsx", bookSST: !0, compression: a }, h;
  l.type = "binary", n.SheetNames = [], n.Sheets = {};
  function u() {
    var w = [], B = [], v = {}, b = { s: { c: 0, r: 0 }, e: { c: r[0] ? r[0].columns.reduce((F, L) => F + (L && L.width ? L.width : 1), 0) : 0, r: r.length } };
    return r.forEach((F, L) => {
      var P = [];
      F.columns.forEach(function(R, H) {
        R ? (P.push(!(R.value instanceof Date) && typeof R.value == "object" ? JSON.stringify(R.value) : R.value), (R.width > 1 || R.height > -1) && (R.height > 1 || R.width > 1) && B.push({ s: { r: L, c: H }, e: { r: L + R.height - 1, c: H + R.width - 1 } })) : P.push("");
      }), w.push(P);
    }), s.utils.sheet_add_aoa(v, w), v["!ref"] = s.utils.encode_range(b), B.length && (v["!merges"] = B), v;
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
  function g(w) {
    for (var B = new ArrayBuffer(w.length), v = new Uint8Array(B), b = 0; b != w.length; ++b) v[b] = w.charCodeAt(b) & 255;
    return B;
  }
  h = s.write(n, l), t(g(h), "application/octet-stream");
}
function uh(r, e, t) {
  this.modExists("export", !0) && t(this.modules.export.generateHTMLTable(r), "text/html");
}
function ch(r, e, t) {
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
var dh = {
  csv: oh,
  json: ah,
  jsonLines: ch,
  pdf: lh,
  xlsx: hh,
  html: uh
};
const fA = class fA extends q {
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
    if (typeof e == "function" ? n = e : fA.downloaders[e] ? n = fA.downloaders[e] : console.warn("Download Error - No such download type found: ", e), n) {
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
x(fA, "moduleName", "download"), //load defaults
x(fA, "downloaders", dh);
let sr = fA;
function ts(r, e) {
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
function fh(r, e, t, A, i) {
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
  }), i.mask && ts(n, i), n;
}
function gh(r, e, t, A, i) {
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
  }), i.mask && ts(a, i), a;
}
function ph(r, e, t, A, i) {
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
  }), i.mask && ts(o, i), o;
}
function mh(r, e, t, A, i) {
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
function wh(r, e, t, A, i) {
  var s = i.format, n = i.verticalNavigation || "editor", o = s ? window.DateTime || luxon.DateTime : null, a = r.getValue(), l = document.createElement("input");
  function h(c) {
    var g;
    return o.isDateTime(c) ? g = c : s === "iso" ? g = o.fromISO(String(c)) : g = o.fromFormat(String(c), s), g.toFormat("yyyy-MM-dd");
  }
  if (l.type = "date", l.style.padding = "4px", l.style.width = "100%", l.style.boxSizing = "border-box", i.max && l.setAttribute("max", s ? h(i.max) : i.max), i.min && l.setAttribute("min", s ? h(i.min) : i.min), i.elementAttributes && typeof i.elementAttributes == "object")
    for (let c in i.elementAttributes)
      c.charAt(0) == "+" ? (c = c.slice(1), l.setAttribute(c, l.getAttribute(c) + i.elementAttributes["+" + c])) : l.setAttribute(c, i.elementAttributes[c]);
  a = typeof a < "u" ? a : "", s && (o ? a = h(a) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), l.value = a, e(function() {
    r.getType() === "cell" && (l.focus({ preventScroll: !0 }), l.style.height = "100%", i.selectContents && l.select());
  });
  function u() {
    var c = l.value, g;
    if ((a === null || typeof a > "u") && c !== "" || c !== a) {
      if (c && s)
        switch (g = o.fromFormat(String(c), "yyyy-MM-dd"), s) {
          case !0:
            c = g;
            break;
          case "iso":
            c = g.toISO();
            break;
          default:
            c = g.toFormat(s);
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
function bh(r, e, t, A, i) {
  var s = i.format, n = i.verticalNavigation || "editor", o = s ? window.DateTime || luxon.DateTime : null, a, l = r.getValue(), h = document.createElement("input");
  if (h.type = "time", h.style.padding = "4px", h.style.width = "100%", h.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let c in i.elementAttributes)
      c.charAt(0) == "+" ? (c = c.slice(1), h.setAttribute(c, h.getAttribute(c) + i.elementAttributes["+" + c])) : h.setAttribute(c, i.elementAttributes[c]);
  l = typeof l < "u" ? l : "", s && (o ? (o.isDateTime(l) ? a = l : s === "iso" ? a = o.fromISO(String(l)) : a = o.fromFormat(String(l), s), l = a.toFormat("HH:mm")) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), h.value = l, e(function() {
    r.getType() == "cell" && (h.focus({ preventScroll: !0 }), h.style.height = "100%", i.selectContents && h.select());
  });
  function u() {
    var c = h.value, g;
    if ((l === null || typeof l > "u") && c !== "" || c !== l) {
      if (c && s)
        switch (g = o.fromFormat(String(c), "hh:mm"), s) {
          case !0:
            c = g;
            break;
          case "iso":
            c = g.toISO();
            break;
          default:
            c = g.toFormat(s);
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
function Bh(r, e, t, A, i) {
  var s = i.format, n = i.verticalNavigation || "editor", o = s ? this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime") : null, a, l = r.getValue(), h = document.createElement("input");
  if (h.type = "datetime-local", h.style.padding = "4px", h.style.width = "100%", h.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let c in i.elementAttributes)
      c.charAt(0) == "+" ? (c = c.slice(1), h.setAttribute(c, h.getAttribute(c) + i.elementAttributes["+" + c])) : h.setAttribute(c, i.elementAttributes[c]);
  l = typeof l < "u" ? l : "", s && (o ? (o.isDateTime(l) ? a = l : s === "iso" ? a = o.fromISO(String(l)) : a = o.fromFormat(String(l), s), l = a.toFormat("yyyy-MM-dd") + "T" + a.toFormat("HH:mm")) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), h.value = l, e(function() {
    r.getType() === "cell" && (h.focus({ preventScroll: !0 }), h.style.height = "100%", i.selectContents && h.select());
  });
  function u() {
    var c = h.value, g;
    if ((l === null || typeof l > "u") && c !== "" || c !== l) {
      if (c && s)
        switch (g = o.fromISO(String(c)), s) {
          case !0:
            c = g;
            break;
          case "iso":
            c = g.toISO();
            break;
          default:
            c = g.toFormat(s);
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
let Ch = class {
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
    return this.params.mask && ts(t, this.params), this._bindInputEvents(t), t;
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
    return e = Fo(e, {}, A), fetch(e).then((i) => i.ok ? i.json().catch((s) => (console.warn("List Ajax Load Error - Invalid JSON returned", s), Promise.reject(s))) : (console.error("List Ajax Load Error - Connection Error: " + i.status, i.statusText), Promise.reject(i))).catch((i) => (console.error("List Ajax Load Error - Connection Error: ", i), Promise.reject(i)));
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
function vh(r, e, t, A, i) {
  var s = new Ch(this, r, e, t, A, i);
  return s.input;
}
function Eh(r, e, t, A, i) {
  var s = this, n = r.getElement(), o = r.getValue(), a = n.getElementsByTagName("svg").length || 5, l = n.getElementsByTagName("svg")[0] ? n.getElementsByTagName("svg")[0].getAttribute("width") : 14, h = [], u = document.createElement("div"), c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  function g(b) {
    h.forEach(function(F, L) {
      L < b ? (s.table.browser == "ie" ? F.setAttribute("class", "tabulator-star-active") : F.classList.replace("tabulator-star-inactive", "tabulator-star-active"), F.innerHTML = '<polygon fill="#488CE9" stroke="#014AAE" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>') : (s.table.browser == "ie" ? F.setAttribute("class", "tabulator-star-inactive") : F.classList.replace("tabulator-star-active", "tabulator-star-inactive"), F.innerHTML = '<polygon fill="#010155" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>');
    });
  }
  function w(b) {
    var F = document.createElement("span"), L = c.cloneNode(!0);
    h.push(L), F.addEventListener("mouseenter", function(P) {
      P.stopPropagation(), P.stopImmediatePropagation(), g(b);
    }), F.addEventListener("mousemove", function(P) {
      P.stopPropagation(), P.stopImmediatePropagation();
    }), F.addEventListener("click", function(P) {
      P.stopPropagation(), P.stopImmediatePropagation(), t(b), n.blur();
    }), F.appendChild(L), u.appendChild(F);
  }
  function B(b) {
    o = b, g(b);
  }
  if (n.style.whiteSpace = "nowrap", n.style.overflow = "hidden", n.style.textOverflow = "ellipsis", u.style.verticalAlign = "middle", u.style.display = "inline-block", u.style.padding = "4px", c.setAttribute("width", l), c.setAttribute("height", l), c.setAttribute("viewBox", "0 0 512 512"), c.setAttribute("xml:space", "preserve"), c.style.padding = "0 1px", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let b in i.elementAttributes)
      b.charAt(0) == "+" ? (b = b.slice(1), u.setAttribute(b, u.getAttribute(b) + i.elementAttributes["+" + b])) : u.setAttribute(b, i.elementAttributes[b]);
  for (var v = 1; v <= a; v++)
    w(v);
  return o = Math.min(parseInt(o), a), g(o), u.addEventListener("mousemove", function(b) {
    g(0);
  }), u.addEventListener("click", function(b) {
    t(0);
  }), n.addEventListener("blur", function(b) {
    A();
  }), n.addEventListener("keydown", function(b) {
    switch (b.keyCode) {
      case 39:
        B(o + 1);
        break;
      case 37:
        B(o - 1);
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
function yh(r, e, t, A, i) {
  var s = r.getElement(), n = typeof i.max > "u" ? s.getElementsByTagName("div")[0] && s.getElementsByTagName("div")[0].getAttribute("max") || 100 : i.max, o = typeof i.min > "u" ? s.getElementsByTagName("div")[0] && s.getElementsByTagName("div")[0].getAttribute("min") || 0 : i.min, a = (n - o) / 100, l = r.getValue() || 0, h = document.createElement("div"), u = document.createElement("div"), c, g;
  function w() {
    var B = window.getComputedStyle(s, null), v = a * Math.round(u.offsetWidth / ((s.clientWidth - parseInt(B.getPropertyValue("padding-left")) - parseInt(B.getPropertyValue("padding-right"))) / 100)) + o;
    t(v), s.setAttribute("aria-valuenow", v), s.setAttribute("aria-label", l);
  }
  if (h.style.position = "absolute", h.style.right = "0", h.style.top = "0", h.style.bottom = "0", h.style.width = "5px", h.classList.add("tabulator-progress-handle"), u.style.display = "inline-block", u.style.position = "relative", u.style.height = "100%", u.style.backgroundColor = "#488CE9", u.style.maxWidth = "100%", u.style.minWidth = "0%", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let B in i.elementAttributes)
      B.charAt(0) == "+" ? (B = B.slice(1), u.setAttribute(B, u.getAttribute(B) + i.elementAttributes["+" + B])) : u.setAttribute(B, i.elementAttributes[B]);
  return s.style.padding = "4px 4px", l = Math.min(parseFloat(l), n), l = Math.max(parseFloat(l), o), l = Math.round((l - o) / a), u.style.width = l + "%", s.setAttribute("aria-valuemin", o), s.setAttribute("aria-valuemax", n), u.appendChild(h), h.addEventListener("mousedown", function(B) {
    c = B.screenX, g = u.offsetWidth;
  }), h.addEventListener("mouseover", function() {
    h.style.cursor = "ew-resize";
  }), s.addEventListener("mousemove", function(B) {
    c && (u.style.width = g + B.screenX - c + "px");
  }), s.addEventListener("mouseup", function(B) {
    c && (B.stopPropagation(), B.stopImmediatePropagation(), c = !1, g = !1, w());
  }), s.addEventListener("keydown", function(B) {
    switch (B.keyCode) {
      case 39:
        B.preventDefault(), u.style.width = u.clientWidth + s.clientWidth / 100 + "px";
        break;
      case 37:
        B.preventDefault(), u.style.width = u.clientWidth - s.clientWidth / 100 + "px";
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
function Fh(r, e, t, A, i) {
  var s = r.getValue(), n = document.createElement("input"), o = i.tristate, a = typeof i.indeterminateValue > "u" ? null : i.indeterminateValue, l = !1, h = Object.keys(i).includes("trueValue"), u = Object.keys(i).includes("falseValue");
  if (n.setAttribute("type", "checkbox"), n.style.marginTop = "5px", n.style.boxSizing = "border-box", i.elementAttributes && typeof i.elementAttributes == "object")
    for (let g in i.elementAttributes)
      g.charAt(0) == "+" ? (g = g.slice(1), n.setAttribute(g, n.getAttribute(g) + i.elementAttributes["+" + g])) : n.setAttribute(g, i.elementAttributes[g]);
  n.value = s, o && (typeof s > "u" || s === a || s === "") && (l = !0, n.indeterminate = !0), this.table.browser != "firefox" && this.table.browser != "safari" && e(function() {
    r.getType() === "cell" && n.focus({ preventScroll: !0 });
  }), n.checked = h ? s === i.trueValue : s === !0 || s === "true" || s === "True" || s === 1;
  function c(g) {
    var w = n.checked;
    return h && w ? w = i.trueValue : u && !w && (w = i.falseValue), o ? g ? l ? a : w : n.checked && !l ? (n.checked = !1, n.indeterminate = !0, l = !0, a) : (l = !1, w) : w;
  }
  return n.addEventListener("change", function(g) {
    t(c());
  }), n.addEventListener("blur", function(g) {
    t(c(!0));
  }), n.addEventListener("keydown", function(g) {
    g.keyCode == 13 && t(c()), g.keyCode == 27 && A();
  }), n;
}
function Qh(r, e, t, A, i) {
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
var Uh = {
  input: fh,
  textarea: gh,
  number: ph,
  range: mh,
  date: wh,
  time: bh,
  datetime: Bh,
  list: vh,
  star: Eh,
  progress: yh,
  tickCross: Fh,
  adaptable: Qh
};
const GA = class GA extends q {
  constructor(e) {
    super(e), this.currentCell = !1, this.mouseClick = !1, this.recursionBlock = !1, this.invalidEdit = !1, this.editedCells = [], this.convertEmptyValues = !1, this.editors = GA.editors, this.registerTableOption("editTriggerEvent", "focus"), this.registerTableOption("editorEmptyValue"), this.registerTableOption("editorEmptyValueFunc", this.emptyValueCheck.bind(this)), this.registerColumnOption("editable"), this.registerColumnOption("editor"), this.registerColumnOption("editorParams"), this.registerColumnOption("editorEmptyValue"), this.registerColumnOption("editorEmptyValueFunc"), this.registerColumnOption("cellEditing"), this.registerColumnOption("cellEdited"), this.registerColumnOption("cellEditCancelled"), this.registerTableFunction("getEditedCells", this.getEditedCells.bind(this)), this.registerTableFunction("clearCellEdited", this.clearCellEdited.bind(this)), this.registerTableFunction("navigatePrev", this.navigatePrev.bind(this)), this.registerTableFunction("navigateNext", this.navigateNext.bind(this)), this.registerTableFunction("navigateLeft", this.navigateLeft.bind(this)), this.registerTableFunction("navigateRight", this.navigateRight.bind(this)), this.registerTableFunction("navigateUp", this.navigateUp.bind(this)), this.registerTableFunction("navigateDown", this.navigateDown.bind(this)), this.registerComponentFunction("cell", "isEdited", this.cellIsEdited.bind(this)), this.registerComponentFunction("cell", "clearEdited", this.clearEdited.bind(this)), this.registerComponentFunction("cell", "edit", this.editCell.bind(this)), this.registerComponentFunction("cell", "cancelEdit", this.cellCancelEdit.bind(this)), this.registerComponentFunction("cell", "navigatePrev", this.navigatePrev.bind(this)), this.registerComponentFunction("cell", "navigateNext", this.navigateNext.bind(this)), this.registerComponentFunction("cell", "navigateLeft", this.navigateLeft.bind(this)), this.registerComponentFunction("cell", "navigateRight", this.navigateRight.bind(this)), this.registerComponentFunction("cell", "navigateUp", this.navigateUp.bind(this)), this.registerComponentFunction("cell", "navigateDown", this.navigateDown.bind(this));
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
        if (s.column.modules.edit && ae.elVisible(s.getElement()) && this.allowEdit(s)) {
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
        if (s.column.modules.edit && ae.elVisible(s.getElement()) && this.allowEdit(s)) {
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
    function c(b) {
      if (i.currentCell === e && !a) {
        var F = i.chain("edit-success", [e, b], !0, !0);
        return F === !0 || i.table.options.validationMode === "highlight" ? (a = !0, i.clearEditor(), e.modules.edit || (e.modules.edit = {}), e.modules.edit.edited = !0, i.editedCells.indexOf(e) == -1 && i.editedCells.push(e), b = i.transformEmptyValues(b, e), e.setValue(b, !0), F === !0) : (a = !0, i.invalidEdit = !0, i.focusCellNoEvent(e, !0), n(), setTimeout(() => {
          a = !1;
        }, 10), !1);
      }
    }
    function g() {
      i.currentCell === e && !a && i.cancelEdit();
    }
    function w(b) {
      n = b;
    }
    if (e.column.modules.edit.blocked)
      return this.mouseClick = !1, this.blur(o), !1;
    if (t && t.stopPropagation(), s = this.allowEdit(e), s || A) {
      if (i.cancelEdit(), i.currentCell = e, this.focusScrollAdjust(e), h = e.getComponent(), this.mouseClick && (this.mouseClick = !1, e.column.definition.cellClick && e.column.definition.cellClick.call(this.table, t, h)), e.column.definition.cellEditing && e.column.definition.cellEditing.call(this.table, h), this.dispatch("cell-editing", e), this.dispatchExternal("cellEditing", h), u = typeof e.column.modules.edit.params == "function" ? e.column.modules.edit.params(h) : e.column.modules.edit.params, l = e.column.modules.edit.editor.call(i, h, w, c, g, u), this.currentCell && l !== !1)
        if (l instanceof Node) {
          for (o.classList.add("tabulator-editing"), e.row.getElement().classList.add("tabulator-editing"), e.table.element.classList.add("tabulator-editing"); o.firstChild; ) o.removeChild(o.firstChild);
          o.appendChild(l), n();
          for (var B = o.children, v = 0; v < B.length; v++)
            B[v].addEventListener("click", function(b) {
              b.stopPropagation();
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
x(GA, "moduleName", "edit"), //load defaults
x(GA, "editors", Uh);
let rr = GA;
class bn {
  constructor(e, t, A, i) {
    this.type = e, this.columns = t, this.component = A || !1, this.indent = i || 0;
  }
}
class Hs {
  constructor(e, t, A, i, s) {
    this.value = e, this.component = t || !1, this.width = A, this.height = i, this.depth = s;
  }
}
var Hh = {}, xh = {
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
const Rt = class Rt extends q {
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
    return this.cloneTableStyle = t, this.config = e || {}, this.colVisProp = i, this.colVisPropAttach = this.colVisProp.charAt(0).toUpperCase() + this.colVisProp.slice(1), a = Rt.columnLookups[A], a && (o = a.call(this.table), o = o.filter((l) => this.columnVisCheck(l))), s = this.config.columnHeaders !== !1 ? this.headersToExportRows(this.generateColumnGroupHeaders(o)) : [], o && (o = o.map((l) => l.getComponent())), n = this.bodyToExportRows(this.rowLookup(A), o), s.concat(n);
  }
  generateTable(e, t, A, i) {
    var s = this.generateExportList(e, t, A, i);
    return this.generateTableElement(s);
  }
  rowLookup(e) {
    var t = [], A;
    return typeof e == "function" ? e.call(this.table).forEach((i) => {
      i = this.table.rowManager.findRow(i), i && t.push(i);
    }) : (A = Rt.rowLookups[e] || Rt.rowLookups.active, t = A.call(this.table)), Object.assign([], t);
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
          o.push(new Hs(l, a.column.getComponent(), a.width, a.height, a.depth));
        } else
          o.push(null);
      }), i.push(new bn("header", o));
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
          a = i.level, o.push(new Hs(i.key, i.getComponent(), t.length, 1));
          break;
        case "calc":
        case "row":
          t.forEach((l) => {
            o.push(new Hs(l._column.getFieldValue(n), l, 1, 1));
          }), this.table.options.dataTree && this.config.dataTree !== !1 && (a = i.modules.dataTree.index);
          break;
      }
      A.push(new bn(i.type, o, i.getComponent(), a));
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
        var o = document.createElement("td"), a = s.component._column, l = this.table, h = l.columnManager.findColumnIndex(a), u = s.value, c, g, w = {
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
        }, B = a.definition.cssClass ? a.definition.cssClass.split(" ") : [];
        if (B.forEach(function(v) {
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
        u instanceof Node ? o.appendChild(u) : o.innerHTML = u, g = ["padding-top", "padding-left", "padding-right", "padding-bottom", "border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "text-align"], a.isRowHeader ? (c = A.styleRowHeader, g.push("background-color")) : c = A.styleCells && A.styleCells[h] ? A.styleCells[h] : A.firstCell, c && (this.mapElementStyles(c, o, g), a.definition.align && (o.style.textAlign = a.definition.align)), this.table.options.dataTree && this.config.dataTree !== !1 && (t.treeElementField && t.treeElementField == a.field || !t.treeElementField && n == 0) && (e.component._row.modules.dataTree.controlEl && o.insertBefore(e.component._row.modules.dataTree.controlEl.cloneNode(!0), o.firstChild), e.component._row.modules.dataTree.branchEl && o.insertBefore(e.component._row.modules.dataTree.branchEl.cloneNode(!0), o.firstChild)), i.appendChild(o), w.modules.format && w.modules.format.renderedCallback && w.modules.format.renderedCallback();
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
x(Rt, "moduleName", "export"), x(Rt, "columnLookups", Hh), x(Rt, "rowLookups", xh);
let nr = Rt;
var Rh = {
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
const gt = class gt extends q {
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
              gt.filters[e.definition.headerFilterFunc] ? (a = e.definition.headerFilterFunc, h = function(u) {
                var c = e.definition.headerFilterFuncParams || {}, g = e.getFieldValue(u);
                return c = typeof c == "function" ? c(n, g, u) : c, gt.filters[e.definition.headerFilterFunc](n, g, u, c);
              }) : console.warn("Header Filter Error - Matching filter function not found: ", e.definition.headerFilterFunc);
              break;
            case "function":
              h = function(u) {
                var c = e.definition.headerFilterFuncParams || {}, g = e.getFieldValue(u);
                return c = typeof c == "function" ? c(n, g, u) : c, e.definition.headerFilterFunc(n, g, u, c);
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
    var i = this, s = e.modules.filter.success, n = e.getField(), o, a, l, h, u, c, g, w;
    e.modules.filter.value = t;
    function B() {
    }
    function v(b) {
      w = b;
    }
    if (e.modules.filter.headerElement && e.modules.filter.headerElement.parentNode && e.contentElement.removeChild(e.modules.filter.headerElement.parentNode), n) {
      switch (e.modules.filter.emptyFunc = e.definition.headerFilterEmptyCheck || function(b) {
        return !b && b !== 0;
      }, o = document.createElement("div"), o.classList.add("tabulator-header-filter"), typeof e.definition.headerFilter) {
        case "string":
          i.table.modules.edit.editors[e.definition.headerFilter] ? (a = i.table.modules.edit.editors[e.definition.headerFilter], (e.definition.headerFilter === "tick" || e.definition.headerFilter === "tickCross") && !e.definition.headerFilterEmptyCheck && (e.modules.filter.emptyFunc = function(b) {
            return b !== !0 && b !== !1;
          })) : console.warn("Filter Error - Cannot build header filter, No such editor found: ", e.definition.editor);
          break;
        case "function":
          a = e.definition.headerFilter;
          break;
        case "boolean":
          e.modules.edit && e.modules.edit.editor ? a = e.modules.edit.editor : e.definition.formatter && i.table.modules.edit.editors[e.definition.formatter] ? (a = i.table.modules.edit.editors[e.definition.formatter], (e.definition.formatter === "tick" || e.definition.formatter === "tickCross") && !e.definition.headerFilterEmptyCheck && (e.modules.filter.emptyFunc = function(b) {
            return b !== !0 && b !== !1;
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
        }, g = e.definition.headerFilterParams || {}, g = typeof g == "function" ? g.call(i.table, h) : g, l = a.call(this.table.modules.edit, h, v, s, B, g), !l) {
          console.warn("Filter Error - Cannot add filter to " + n + " column, editor returned a value of false");
          return;
        }
        if (!(l instanceof Node)) {
          console.warn("Filter Error - Cannot add filter to " + n + " column, editor should return an instance of Node, the editor returned:", l);
          return;
        }
        i.langBind("headerFilters|columns|" + e.definition.field, function(b) {
          l.setAttribute("placeholder", typeof b < "u" && b ? b : e.definition.headerFilterPlaceholder || i.langText("headerFilters|default"));
        }), l.addEventListener("click", function(b) {
          b.stopPropagation(), l.focus();
        }), l.addEventListener("focus", (b) => {
          var F = this.table.columnManager.contentsElement.scrollLeft, L = this.table.rowManager.element.scrollLeft;
          F !== L && (this.table.rowManager.scrollHorizontal(F), this.table.columnManager.scrollHorizontal(F));
        }), u = !1, c = function(b) {
          u && clearTimeout(u), u = setTimeout(function() {
            s(l.value);
          }, i.table.options.headerFilterLiveFilterDelay);
        }, e.modules.filter.headerElement = l, e.modules.filter.attrType = l.hasAttribute("type") ? l.getAttribute("type").toLowerCase() : "", e.modules.filter.tagType = l.tagName.toLowerCase(), e.definition.headerFilterLiveFilter !== !1 && (e.definition.headerFilter === "autocomplete" || e.definition.headerFilter === "tickCross" || (e.definition.editor === "autocomplete" || e.definition.editor === "tickCross") && e.definition.headerFilter === !0 || (l.addEventListener("keyup", c), l.addEventListener("search", c), e.modules.filter.attrType == "number" && l.addEventListener("change", function(b) {
          s(l.value);
        }), e.modules.filter.attrType == "text" && this.table.browser !== "ie" && l.setAttribute("type", "search")), (e.modules.filter.tagType == "input" || e.modules.filter.tagType == "select" || e.modules.filter.tagType == "textarea") && l.addEventListener("mousedown", function(b) {
          b.stopPropagation();
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
    } : gt.filters[e.type] ? (t = this.table.columnManager.getColumnByField(e.field), t ? A = function(i) {
      return gt.filters[e.type](e.value, t.getFieldValue(i), i, e.params || {});
    } : A = function(i) {
      return gt.filters[e.type](e.value, i[e.field], i, e.params || {});
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
x(gt, "moduleName", "filter"), //load defaults
x(gt, "filters", Rh);
let or = gt;
function Th(r, e, t) {
  return this.emptyToSpace(this.sanitizeHTML(r.getValue()));
}
function Lh(r, e, t) {
  return r.getValue();
}
function Ih(r, e, t) {
  return r.getElement().style.whiteSpace = "pre-wrap", this.emptyToSpace(this.sanitizeHTML(r.getValue()));
}
function Mh(r, e, t) {
  var A = parseFloat(r.getValue()), i = "", s, n, o, a, l, h = e.decimal || ".", u = e.thousand || ",", c = e.negativeSign || "-", g = e.symbol || "", w = !!e.symbolAfter, B = typeof e.precision < "u" ? e.precision : 2;
  if (isNaN(A))
    return this.emptyToSpace(this.sanitizeHTML(r.getValue()));
  if (A < 0 && (A = Math.abs(A), i = c), s = B !== !1 ? A.toFixed(B) : A, s = String(s).split("."), n = s[0], o = s.length > 1 ? h + s[1] : "", e.thousand !== !1)
    for (a = /(\d+)(\d{3})/; a.test(n); )
      n = n.replace(a, "$1" + u + "$2");
  return l = n + o, i === !0 ? (l = "(" + l + ")", w ? l + g : g + l) : w ? i + l + g : i + g + l;
}
function Sh(r, e, t) {
  var A = r.getValue(), i = e.urlPrefix || "", s = e.download, n = A, o = document.createElement("a"), a;
  function l(h, u) {
    var c = h.shift(), g = u[c];
    return h.length && typeof g == "object" ? l(h, g) : g;
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
    if (e.urlField && (a = r.getData(), A = ae.retrieveNestedData(this.table.options.nestedFieldSeparator, e.urlField, a)), e.url)
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
function Dh(r, e, t) {
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
function kh(r, e, t) {
  var A = r.getValue(), i = r.getElement(), s = e.allowEmpty, n = e.allowTruthy, o = Object.keys(e).includes("trueValue"), a = typeof e.tickElement < "u" ? e.tickElement : '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>', l = typeof e.crossElement < "u" ? e.crossElement : '<svg enable-background="new 0 0 24 24" height="14" width="14"  viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
  return o && A === e.trueValue || !o && (n && A || A === !0 || A === "true" || A === "True" || A === 1 || A === "1") ? (i.setAttribute("aria-checked", !0), a || "") : s && (A === "null" || A === "" || A === null || typeof A > "u") ? (i.setAttribute("aria-checked", "mixed"), "") : (i.setAttribute("aria-checked", !1), l || "");
}
function _h(r, e, t) {
  var A = this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime"), i = e.inputFormat || "yyyy-MM-dd HH:mm:ss", s = e.outputFormat || "dd/MM/yyyy HH:mm:ss", n = typeof e.invalidPlaceholder < "u" ? e.invalidPlaceholder : "", o = r.getValue();
  if (typeof A < "u") {
    var a;
    return A.isDateTime(o) ? a = o : i === "iso" ? a = A.fromISO(String(o)) : a = A.fromFormat(String(o), i), a.isValid ? (e.timezone && (a = a.setZone(e.timezone)), a.toFormat(s)) : n === !0 || !o ? o : typeof n == "function" ? n(o) : n;
  } else
    console.error("Format Error - 'datetime' formatter is dependant on luxon.js");
}
function Oh(r, e, t) {
  var A = this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime"), i = e.inputFormat || "yyyy-MM-dd HH:mm:ss", s = typeof e.invalidPlaceholder < "u" ? e.invalidPlaceholder : "", n = typeof e.suffix < "u" ? e.suffix : !1, o = typeof e.unit < "u" ? e.unit : "days", a = typeof e.humanize < "u" ? e.humanize : !1, l = typeof e.date < "u" ? e.date : A.now(), h = r.getValue();
  if (typeof A < "u") {
    var u;
    return A.isDateTime(h) ? u = h : i === "iso" ? u = A.fromISO(String(h)) : u = A.fromFormat(String(h), i), u.isValid ? a ? u.diff(l, o).toHuman() + (n ? " " + n : "") : parseInt(u.diff(l, o)[o]) + (n ? " " + n : "") : s === !0 ? h : typeof s == "function" ? s(h) : s;
  } else
    console.error("Format Error - 'datetimediff' formatter is dependant on luxon.js");
}
function Ph(r, e, t) {
  var A = r.getValue();
  return typeof e[A] > "u" ? (console.warn("Missing display value for " + A), A) : e[A];
}
function Kh(r, e, t) {
  var A = r.getValue(), i = r.getElement(), s = e && e.stars ? e.stars : 5, n = document.createElement("span"), o = document.createElementNS("http://www.w3.org/2000/svg", "svg"), a = '<polygon fill="#FFEA00" stroke="#C1AB60" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>', l = '<polygon fill="#D2D2D2" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';
  n.style.verticalAlign = "middle", o.setAttribute("width", "14"), o.setAttribute("height", "14"), o.setAttribute("viewBox", "0 0 512 512"), o.setAttribute("xml:space", "preserve"), o.style.padding = "0 1px", A = A && !isNaN(A) ? parseInt(A) : 0, A = Math.max(0, Math.min(A, s));
  for (var h = 1; h <= s; h++) {
    var u = o.cloneNode(!0);
    u.innerHTML = h <= A ? a : l, n.appendChild(u);
  }
  return i.style.whiteSpace = "nowrap", i.style.overflow = "hidden", i.style.textOverflow = "ellipsis", i.setAttribute("aria-label", A), n;
}
function Vh(r, e, t) {
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
function Nh(r, e = {}, t) {
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
        let v = 100 / e.color.length, b = Math.floor(l / v);
        b = Math.min(b, e.color.length - 1), b = Math.max(b, 0), h = e.color[b];
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
        let v = 100 / e.legendColor.length, b = Math.floor(l / v);
        b = Math.min(b, e.legendColor.length - 1), b = Math.max(b, 0), c = e.legendColor[b];
      }
      break;
    default:
      c = "#000";
  }
  i.style.minWidth = "30px", i.style.position = "relative", i.setAttribute("aria-label", l);
  var g = document.createElement("div");
  g.style.display = "inline-block", g.style.width = l + "%", g.style.backgroundColor = h, g.style.height = "100%", g.setAttribute("data-max", s), g.setAttribute("data-min", n);
  var w = document.createElement("div");
  if (w.style.position = "relative", w.style.width = "100%", w.style.height = "100%", u) {
    var B = document.createElement("div");
    B.style.position = "absolute", B.style.top = 0, B.style.left = 0, B.style.textAlign = o, B.style.width = "100%", B.style.color = c, B.innerHTML = u;
  }
  return t(function() {
    if (!(r instanceof Qo)) {
      var v = document.createElement("div");
      v.style.position = "absolute", v.style.top = "4px", v.style.bottom = "4px", v.style.left = "4px", v.style.right = "4px", i.appendChild(v), i = v;
    }
    i.appendChild(w), w.appendChild(g), u && w.appendChild(B);
  }), "";
}
function zh(r, e, t) {
  return r.getElement().style.backgroundColor = this.sanitizeHTML(r.getValue()), "";
}
function Gh(r, e, t) {
  return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>';
}
function Wh(r, e, t) {
  return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
}
function Xh(r, e, t) {
  var A = r.getValue(), i = e.size || 15, s = i + "px", n, o, a = e.hasOwnProperty("onValue") ? e.onValue : !0, l = e.hasOwnProperty("offValue") ? e.offValue : !1, h = e.onTruthy ? A : A === a;
  return n = document.createElement("div"), n.classList.add("tabulator-toggle"), h ? (n.classList.add("tabulator-toggle-on"), n.style.flexDirection = "row-reverse", e.onColor && (n.style.background = e.onColor)) : e.offColor && (n.style.background = e.offColor), n.style.width = 2.5 * i + "px", n.style.borderRadius = s, e.clickable && n.addEventListener("click", (u) => {
    r.setValue(h ? l : a);
  }), o = document.createElement("div"), o.classList.add("tabulator-toggle-switch"), o.style.height = s, o.style.width = s, o.style.borderRadius = s, n.appendChild(o), n;
}
function Jh(r, e, t) {
  var A = document.createElement("span"), i = r.getRow(), s = r.getTable();
  return i.watchPosition((n) => {
    e.relativeToPage && (n += s.modules.page.getPageSize() * (s.modules.page.getPage() - 1)), A.innerText = n;
  }), A;
}
function jh(r, e, t) {
  return r.getElement().classList.add("tabulator-row-handle"), "<div class='tabulator-row-handle-box'><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div></div>";
}
function Yh(r, e, t) {
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
function Zh(r, e, t) {
  var A = e.delimiter || ",", i = r.getValue(), s = this.table, n;
  return e.valueMap && (typeof e.valueMap == "string" ? n = function(o) {
    return o.map((a) => ae.retrieveNestedData(s.options.nestedFieldSeparator, e.valueMap, a));
  } : n = e.valueMap), Array.isArray(i) ? (n && (i = n(i)), i.join(A)) : i;
}
function $h(r, e, t) {
  var A = e.indent || "	", i = typeof e.multiline > "u" ? !0 : e.multiline, s = e.replacer || null, n = r.getValue();
  return i && (r.getElement().style.whiteSpace = "pre-wrap"), JSON.stringify(n, s, A);
}
var qh = {
  plaintext: Th,
  html: Lh,
  textarea: Ih,
  money: Mh,
  link: Sh,
  image: Dh,
  tickCross: kh,
  datetime: _h,
  datetimediff: Oh,
  lookup: Ph,
  star: Kh,
  traffic: Vh,
  progress: Nh,
  color: zh,
  buttonTick: Gh,
  buttonCross: Wh,
  toggle: Xh,
  rownum: Jh,
  handle: jh,
  adaptable: Yh,
  array: Zh,
  json: $h
};
const Tt = class Tt extends q {
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
        Tt.formatters[e] ? t = Tt.formatters[e] : (console.warn("Formatter Error - No such formatter found: ", e), t = Tt.formatters.plaintext);
        break;
      case "function":
        t = e;
        break;
      default:
        t = Tt.formatters.plaintext;
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
x(Tt, "moduleName", "format"), //load defaults
x(Tt, "formatters", qh);
let ar = Tt;
class Ro extends q {
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
x(Ro, "moduleName", "frozenColumns");
class To extends q {
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
x(To, "moduleName", "frozenRows");
class eu {
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
class uA {
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
    var A = t + "_" + e, i = new uA(this.groupManager, this, t, e, this.groupManager.groupIDLookups[t].field, this.groupManager.headerGenerator[t] || this.groupManager.headerGenerator[0], this.old ? this.old.groups[A] : !1);
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
    this.initialized = !1, this.height = 0, ae.elVisible(this.element) && this.initialize(!0);
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
    return this.component || (this.component = new eu(this)), this.component;
  }
}
class Lo extends q {
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
      !A && t instanceof uA && (t = this.table.rowManager.prevDisplayRow(e) || t);
      var i = t instanceof uA ? t : t.modules.group, s = e instanceof uA ? e : e.modules.group;
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
    A = A || [], s = new uA(this, !1, t, e, this.groupIDLookups[0].field, this.headerGenerator[0], A[i]), this.groups[i] = s, this.groupList.push(s);
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
x(Lo, "moduleName", "groupRows");
var tu = {
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
}, Au = {
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
}, iu = {
  undo: ["ctrl + 90", "meta + 90"],
  redo: ["ctrl + 89", "meta + 89"]
}, su = {
  undo: function(r) {
    var e = !1;
    this.table.options.history && this.table.modExists("history") && this.table.modExists("edit") && (e = this.table.modules.edit.currentCell, e || (r.preventDefault(), this.table.modules.history.undo()));
  },
  redo: function(r) {
    var e = !1;
    this.table.options.history && this.table.modExists("history") && this.table.modExists("edit") && (e = this.table.modules.edit.currentCell, e || (r.preventDefault(), this.table.modules.history.redo()));
  }
}, ru = {
  keybindings: {
    bindings: iu,
    actions: su
  }
};
const Lt = class Lt extends q {
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
      return Lt.undoers[e.type].call(this, e), this.index--, this.dispatchExternal("historyUndo", e.type, e.component.getComponent(), e.data), !0;
    } else
      return console.warn(this.options("history") ? "History Undo Error - No more history to undo" : "History module not enabled"), !1;
  }
  redo() {
    if (this.history.length - 1 > this.index) {
      this.index++;
      let e = this.history[this.index];
      return Lt.redoers[e.type].call(this, e), this.dispatchExternal("historyRedo", e.type, e.component.getComponent(), e.data), !0;
    } else
      return console.warn(this.options("history") ? "History Redo Error - No more history to redo" : "History module not enabled"), !1;
  }
  //rebind rows to new element after deletion
  _rebindRow(e, t) {
    this.history.forEach(function(A) {
      if (A.component instanceof Ie)
        A.component === e && (A.component = t);
      else if (A.component instanceof qA && A.component.row === e) {
        var i = A.component.column.getField();
        i && (A.component = t.getCell(i));
      }
    });
  }
};
x(Lt, "moduleName", "history"), x(Lt, "moduleExtensions", ru), //load defaults
x(Lt, "undoers", tu), x(Lt, "redoers", Au);
let lr = Lt;
class Io extends q {
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
x(Io, "moduleName", "htmlTableImport");
function nu(r) {
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
function ou(r) {
  try {
    return JSON.parse(r);
  } catch (e) {
    return console.warn("JSON Import Error - File contents is invalid JSON", e), Promise.reject();
  }
}
function au(r) {
  return r;
}
function lu(r) {
  var e = this.dependencyRegistry.lookup("XLSX"), t = e.read(r), A = t.Sheets[t.SheetNames[0]];
  return e.utils.sheet_to_json(A, { header: 1 });
}
var hu = {
  csv: nu,
  json: ou,
  array: au,
  xlsx: lu
};
const WA = class WA extends q {
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
    return e || (e = this.table.options.importFormat), typeof e == "string" ? t = WA.importers[e] : t = e, t || console.error("Import Error - Importer not found:", e), t;
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
x(WA, "moduleName", "import"), //load defaults
x(WA, "importers", hu);
let hr = WA;
class Mo extends q {
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
    this.columnSubscribers[e] && (A instanceof qA ? s = A.column.definition[e] : A instanceof Yt && (s = A.definition[e]), s && s(t, i)), this.dispatchExternal(e, t, i);
  }
}
x(Mo, "moduleName", "interaction");
var uu = {
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
}, cu = {
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
const It = class It extends q {
  constructor(e) {
    super(e), this.watchKeys = null, this.pressedKeys = null, this.keyupBinding = !1, this.keydownBinding = !1, this.registerTableOption("keybindings", {}), this.registerTableOption("tabEndNewRow", !1);
  }
  initialize() {
    var e = this.table.options.keybindings, t = {};
    this.watchKeys = {}, this.pressedKeys = [], e !== !1 && (Object.assign(t, It.bindings), Object.assign(t, e), this.mapBindings(t), this.bindEvents()), this.subscribe("table-destroy", this.clearBindings.bind(this));
  }
  mapBindings(e) {
    for (let t in e)
      It.actions[t] ? e[t] && (typeof e[t] != "object" && (e[t] = [e[t]]), e[t].forEach((A) => {
        var i = Array.isArray(A) ? A : [A];
        i.forEach((s) => {
          this.mapBinding(t, s);
        });
      })) : console.warn("Key Binding Error - no such action:", t);
  }
  mapBinding(e, t) {
    var A = {
      action: It.actions[e],
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
x(It, "moduleName", "keybindings"), //load defaults
x(It, "bindings", uu), x(It, "actions", cu);
let ur = It;
class So extends q {
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
        l.separator ? h.classList.add("tabulator-menu-separator") : (h.classList.add("tabulator-menu-item"), typeof u == "function" && (u = u.call(this.table, t.getComponent())), u instanceof Node ? h.appendChild(u) : h.innerHTML = u, typeof c == "function" && (c = c.call(this.table, t.getComponent())), c ? (h.classList.add("tabulator-menu-item-disabled"), h.addEventListener("click", (g) => {
          g.stopPropagation();
        })) : l.menu && l.menu.length ? h.addEventListener("click", (g) => {
          g.stopPropagation(), this.loadMenu(g, t, l.menu, h, a);
        }) : l.action && h.addEventListener("click", (g) => {
          l.action(g, t.getComponent());
        }), l.menu && l.menu.length && h.classList.add("tabulator-menu-item-submenu")), o.appendChild(h);
      }), o.addEventListener("click", (l) => {
        this.rootPopup && this.rootPopup.hide();
      }), a.show(i || e), a === this.rootPopup && (this.rootPopup.hideOnBlur(() => {
        this.rootPopup = null, this.currentComponent && (this.dispatch("menu-closed", A, a), this.dispatchExternal("menuClosed", this.currentComponent.getComponent()), this.currentComponent = null);
      }), this.currentComponent = t, this.dispatch("menu-opened", A, a), this.dispatchExternal("menuOpened", t.getComponent()));
    }
  }
}
x(So, "moduleName", "menu");
class Do extends q {
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
      e.parent === t.moving.parent && ((t.touchMove ? s.touches[0].pageX : s.pageX) - ae.elOffset(i).left + t.table.columnManager.contentsElement.scrollLeft > e.getWidth() / 2 ? (t.toCol !== e || !t.toColAfter) && (i.parentNode.insertBefore(t.placeholderElement, i.nextSibling), t.moveColumn(e, !0)) : (t.toCol !== e || t.toColAfter) && (i.parentNode.insertBefore(t.placeholderElement, i), t.moveColumn(e, !1)));
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
    this.table.modules.selectRange && this.table.modules.selectRange.columnSelection && this.table.modules.selectRange.mousedown && this.table.modules.selectRange.selecting === "column" || (this.moving = t, this.startX = (this.touchMove ? e.touches[0].pageX : e.pageX) - ae.elOffset(A).left, this.table.element.classList.add("tabulator-block-select"), this.placeholderElement.style.width = t.getWidth() + "px", this.placeholderElement.style.height = t.getHeight() + "px", A.parentNode.insertBefore(this.placeholderElement, A), A.parentNode.removeChild(A), this.hoverElement = A.cloneNode(!0), this.hoverElement.classList.add("tabulator-moving"), i.appendChild(this.hoverElement), this.hoverElement.style.left = "0", this.hoverElement.style.bottom = i.clientHeight - s.offsetHeight + "px", this.touchMove || (this._bindMouseMove(), document.body.addEventListener("mousemove", this.moveHover), document.body.addEventListener("mouseup", this.endMove)), this.moveHover(e), this.dispatch("column-moving", e, this.moving));
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
    var t = this.table.columnManager.getContentsElement(), A = t.scrollLeft, i = (this.touchMove ? e.touches[0].pageX : e.pageX) - ae.elOffset(t).left + A, s;
    this.hoverElement.style.left = i - this.startX + "px", i - A < this.autoScrollMargin && (this.autoScrollTimeout || (this.autoScrollTimeout = setTimeout(() => {
      s = Math.max(0, A - 5), this.table.rowManager.getElement().scrollLeft = s, this.autoScrollTimeout = !1;
    }, 1))), A + t.clientWidth - i < this.autoScrollMargin && (this.autoScrollTimeout || (this.autoScrollTimeout = setTimeout(() => {
      s = Math.min(t.clientWidth, A + 5), this.table.rowManager.getElement().scrollLeft = s, this.autoScrollTimeout = !1;
    }, 1)));
  }
}
x(Do, "moduleName", "moveColumn");
var du = {
  delete: function(r, e, t) {
    r.delete();
  }
}, fu = {
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
const Xt = class Xt extends q {
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
      i.pageY - ae.elOffset(e.element).top + t.table.rowManager.element.scrollTop > e.getHeight() / 2 ? (t.toRow !== e || !t.toRowAfter) && (s = e.getElement(), s.parentNode.insertBefore(t.placeholderElement, s.nextSibling), t.moveRow(e, !0)) : (t.toRow !== e || t.toRowAfter) && (s = e.getElement(), s.previousSibling && (s.parentNode.insertBefore(t.placeholderElement, s), t.moveRow(e, !1)));
    }).bind(t), e.modules.moveRow = A;
  }
  initializeRow(e) {
    var t = this, A = {}, i;
    A.mouseup = (function(s) {
      t.tableRowDrop(s, e);
    }).bind(t), A.mousemove = (function(s) {
      var n = e.getElement();
      s.pageY - ae.elOffset(n).top + t.table.rowManager.element.scrollTop > e.getHeight() / 2 ? (t.toRow !== e || !t.toRowAfter) && (n.parentNode.insertBefore(t.placeholderElement, n.nextSibling), t.moveRow(e, !0)) : (t.toRow !== e || t.toRowAfter) && (n.parentNode.insertBefore(t.placeholderElement, n), t.moveRow(e, !1));
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
          i = Xt.senders[this.table.options.movableRowsSender];
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
        A = Xt.receivers[this.table.options.movableRowsReceiver];
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
x(Xt, "moduleName", "moveRow"), //load defaults
x(Xt, "senders", du), x(Xt, "receivers", fu);
let cr = Xt;
var gu = {};
const gA = class gA extends q {
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
        gA.mutators[e] ? t = gA.mutators[e] : console.warn("Mutator Error - No such mutator found, ignoring: ", e);
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
x(gA, "moduleName", "mutator"), //load defaults
x(gA, "mutators", gu);
let dr = gA;
function pu(r, e, t, A, i) {
  var s = document.createElement("span"), n = document.createElement("span"), o = document.createElement("span"), a = document.createElement("span"), l = document.createElement("span"), h = document.createElement("span");
  return this.table.modules.localize.langBind("pagination|counter|showing", (u) => {
    n.innerHTML = u;
  }), this.table.modules.localize.langBind("pagination|counter|of", (u) => {
    a.innerHTML = u;
  }), this.table.modules.localize.langBind("pagination|counter|rows", (u) => {
    h.innerHTML = u;
  }), A ? (o.innerHTML = " " + e + "-" + Math.min(e + r - 1, A) + " ", l.innerHTML = " " + A + " ", s.appendChild(n), s.appendChild(o), s.appendChild(a), s.appendChild(l), s.appendChild(h)) : (o.innerHTML = " 0 ", s.appendChild(n), s.appendChild(o), s.appendChild(h)), s;
}
function mu(r, e, t, A, i) {
  var s = document.createElement("span"), n = document.createElement("span"), o = document.createElement("span"), a = document.createElement("span"), l = document.createElement("span"), h = document.createElement("span");
  return this.table.modules.localize.langBind("pagination|counter|showing", (u) => {
    n.innerHTML = u;
  }), o.innerHTML = " " + t + " ", this.table.modules.localize.langBind("pagination|counter|of", (u) => {
    a.innerHTML = u;
  }), l.innerHTML = " " + i + " ", this.table.modules.localize.langBind("pagination|counter|pages", (u) => {
    h.innerHTML = u;
  }), s.appendChild(n), s.appendChild(o), s.appendChild(a), s.appendChild(l), s.appendChild(h), s;
}
var wu = {
  rows: pu,
  pages: mu
};
const XA = class XA extends q {
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
    e && (typeof e == "function" ? t = e : t = XA.pageCounters[e], t ? (this.pageCounter = t, this.pageCounterElement = document.createElement("span"), this.pageCounterElement.classList.add("tabulator-page-counter")) : console.warn("Pagination Error - No such page counter found: ", e));
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
x(XA, "moduleName", "page"), //load defaults
x(XA, "pageCounters", wu);
let fr = XA;
var bu = {
  local: function(r, e) {
    var t = localStorage.getItem(r + "-" + e);
    return t ? JSON.parse(t) : !1;
  },
  cookie: function(r, e) {
    var t = document.cookie, A = r + "-" + e, i = t.indexOf(A + "="), s, n;
    return i > -1 && (t = t.slice(i), s = t.indexOf(";"), s > -1 && (t = t.slice(0, s)), n = t.replace(A + "=", "")), n ? JSON.parse(n) : !1;
  }
}, Bu = {
  local: function(r, e, t) {
    localStorage.setItem(r + "-" + e, JSON.stringify(t));
  },
  cookie: function(r, e, t) {
    var A = /* @__PURE__ */ new Date();
    A.setDate(A.getDate() + 1e4), document.cookie = r + "-" + e + "=" + JSON.stringify(t) + "; expires=" + A.toUTCString();
  }
};
const Pe = class Pe extends q {
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
      this.mode = e !== !0 ? e : this.localStorageTest() ? "local" : "cookie", this.table.options.persistenceReaderFunc ? typeof this.table.options.persistenceReaderFunc == "function" ? this.readFunc = this.table.options.persistenceReaderFunc : Pe.readers[this.table.options.persistenceReaderFunc] ? this.readFunc = Pe.readers[this.table.options.persistenceReaderFunc] : console.warn("Persistence Read Error - invalid reader set", this.table.options.persistenceReaderFunc) : Pe.readers[this.mode] ? this.readFunc = Pe.readers[this.mode] : console.warn("Persistence Read Error - invalid reader set", this.mode), this.table.options.persistenceWriterFunc ? typeof this.table.options.persistenceWriterFunc == "function" ? this.writeFunc = this.table.options.persistenceWriterFunc : Pe.writers[this.table.options.persistenceWriterFunc] ? this.writeFunc = Pe.writers[this.table.options.persistenceWriterFunc] : console.warn("Persistence Write Error - invalid reader set", this.table.options.persistenceWriterFunc) : Pe.writers[this.mode] ? this.writeFunc = Pe.writers[this.mode] : console.warn("Persistence Write Error - invalid writer set", this.mode), this.id = "tabulator-" + (t || this.table.element.getAttribute("id") || ""), this.config = {
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
x(Pe, "moduleName", "persistence"), x(Pe, "moduleInitOrder", -10), //load defaults
x(Pe, "readers", bu), x(Pe, "writers", Bu);
let gr = Pe;
class ko extends q {
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
x(ko, "moduleName", "popup");
class _o extends q {
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
x(_o, "moduleName", "print");
class Oo extends q {
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
              var g = t.table.rowManager.getRowFromDataObject(u);
              g && g.deleteActual(c !== h.length - 1);
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
x(Oo, "moduleName", "reactiveData");
class Po extends q {
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
        var g = l.getWidth();
        c.stopPropagation(), l.reinitializeWidth(!0), g !== l.getWidth() && (s.dispatch("column-resized", l), s.dispatchExternal("columnResized", l.getComponent()));
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
x(Po, "moduleName", "resizeColumns");
class Ko extends q {
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
x(Ko, "moduleName", "resizeRows");
class Vo extends q {
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
x(Vo, "moduleName", "resizeTable");
function Cu(r, e, t) {
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
var vu = {
  format: {
    formatters: {
      responsiveCollapse: Cu
    }
  }
};
class pr extends q {
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
x(pr, "moduleName", "responsiveLayout"), x(pr, "moduleExtensions", vu);
function Eu(r, e, t) {
  var A = document.createElement("input"), i = !1;
  if (A.type = "checkbox", A.setAttribute("aria-label", "Select Row"), this.table.modExists("selectRow", !0))
    if (A.addEventListener("click", (n) => {
      n.stopPropagation();
    }), typeof r.getRow == "function") {
      var s = r.getRow();
      s instanceof es ? (A.addEventListener("change", (n) => {
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
var yu = {
  format: {
    formatters: {
      rowSelection: Eu
    }
  }
};
class mr extends q {
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
x(mr, "moduleName", "selectRow"), x(mr, "moduleExtensions", yu);
class Fu {
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
class Qu extends Ue {
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
    var e = this.table.rowManager.renderer.vDomTop, t = this.table.rowManager.renderer.vDomBottom, A = this.table.columnManager.renderer.leftCol, i = this.table.columnManager.renderer.rightCol, s, n, o, a, l, h, u, c, g, w;
    this.table.options.renderHorizontal === "virtual" && this.rangeManager.rowHeader && (i += 1), e == null && (e = 0), t == null && (t = 1 / 0), A == null && (A = 0), i == null && (i = 1 / 0), this.overlaps(A, e, i, t) && (s = Math.max(this.top, e), n = Math.min(this.bottom, t), o = Math.max(this.left, A), a = Math.min(this.right, i), l = this.rangeManager.getCell(s, o), h = this.rangeManager.getCell(n, a), u = l.getElement(), c = h.getElement(), g = l.row.getElement(), w = h.row.getElement(), this.element.classList.add("tabulator-range-active"), this.table.rtl ? (this.element.style.right = g.offsetWidth - u.offsetLeft - u.offsetWidth + "px", this.element.style.width = u.offsetLeft + u.offsetWidth - c.offsetLeft + "px") : (this.element.style.left = g.offsetLeft + u.offsetLeft + "px", this.element.style.width = c.offsetLeft + c.offsetWidth - u.offsetLeft + "px"), this.element.style.top = g.offsetTop + "px", this.element.style.height = w.offsetTop + w.offsetHeight - g.offsetTop + "px");
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
    return this.component || (this.component = new Fu(this)), this.component;
  }
  destroy(e) {
    this.destroyed = !0, this.element.remove(), e && this.rangeManager.rangeRemoved(this), this.initialized && this.dispatchExternal("rangeRemoved", this.getComponent());
  }
  destroyedGuard(e) {
    return this.destroyed && console.warn("You cannot call the " + e + " function on a destroyed range"), !this.destroyed;
  }
}
var Uu = {
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
}, Hu = {
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
}, xu = {
  range: function(r) {
    var e = [], t = this.table.modules.selectRange.activeRange, A = !1, i, s, n, o, a;
    return a = r.length, t && (i = t.getBounds(), s = i.start, i.start === i.end && (A = !0), s && (e = this.table.rowManager.activeRows.slice(), n = e.indexOf(s.row), A ? o = r.length : o = e.indexOf(i.end.row) - n + 1, n > -1 && (this.table.blockRedraw(), e = e.slice(n, n + o), e.forEach((l, h) => {
      l.updateData(r[h % a]);
    }), this.table.restoreRedraw()))), e;
  }
}, Ru = {
  range: function(r) {
    var e = [], t = [], A = this.table.modules.selectRange.activeRange, i = !1, s, n, o, a, l;
    return A && (s = A.getBounds(), n = s.start, s.start === s.end && (i = !0), n && (r = r.split(`
`), r.forEach(function(h) {
      e.push(h.split("	"));
    }), e.length && (a = this.table.columnManager.getVisibleColumnsByIndex(), l = a.indexOf(n.column), l > -1))) ? (i ? o = e[0].length : o = a.indexOf(s.end.column) - l + 1, a = a.slice(l, l + o), e.forEach((h) => {
      var u = {}, c = h.length;
      a.forEach(function(g, w) {
        u[g.field] = h[w % c];
      }), t.push(u);
    }), t) : !1;
  }
}, Tu = {
  range: function() {
    var r = this.modules.selectRange.selectedColumns();
    return this.columnManager.rowHeader && r.unshift(this.columnManager.rowHeader), r;
  }
}, Lu = {
  range: function() {
    return this.modules.selectRange.selectedRows();
  }
}, Iu = {
  keybindings: {
    bindings: Uu,
    actions: Hu
  },
  clipboard: {
    pasteActions: xu,
    pasteParsers: Ru
  },
  export: {
    columnLookups: Tu,
    rowLookups: Lu
  }
};
class Oi extends q {
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
    var i = !1, s, n, o, a, l, h, u, c, g, w, B;
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
      return h = this.getRowByRangePos(s.end.row), u = this.getColumnByRangePos(s.end.col), c = h.getElement().getBoundingClientRect(), w = u.getElement().getBoundingClientRect(), g = this.table.rowManager.getElement().getBoundingClientRect(), B = this.table.columnManager.getElement().getBoundingClientRect(), c.top >= g.top && c.bottom <= g.bottom || (h.getElement().parentNode && u.getElement().parentNode ? this.autoScroll(s, h.getElement(), u.getElement()) : h.getComponent().scrollTo(void 0, !1)), w.left >= B.left + this.getRowHeaderWidth() && w.right <= B.right || (h.getElement().parentNode && u.getElement().parentNode ? this.autoScroll(s, h.getElement(), u.getElement()) : u.getComponent().scrollTo(void 0, !1)), this.layoutElement(), !0;
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
    return this.maxRanges !== !0 && this.ranges.length >= this.maxRanges && this.ranges.shift().destroy(), A = new Qu(this.table, this, e, t), this.activeRange = A, this.ranges.push(A), this.rangeContainer.appendChild(A.element), A;
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
x(Oi, "moduleName", "selectRange"), x(Oi, "moduleInitOrder", 1), x(Oi, "moduleExtensions", Iu);
function Mu(r, e, t, A, i, s, n) {
  var o = n.alignEmptyValues, a = n.decimalSeparator, l = n.thousandSeparator, h = 0;
  if (r = String(r), e = String(e), l && (r = r.split(l).join(""), e = e.split(l).join("")), a && (r = r.split(a).join("."), e = e.split(a).join(".")), r = parseFloat(r), e = parseFloat(e), isNaN(r))
    h = isNaN(e) ? 0 : -1;
  else if (isNaN(e))
    h = 1;
  else
    return r - e;
  return (o === "top" && s === "desc" || o === "bottom" && s === "asc") && (h *= -1), h;
}
function Su(r, e, t, A, i, s, n) {
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
function Jr(r, e, t, A, i, s, n) {
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
function Du(r, e, t, A, i, s, n) {
  return n.format || (n.format = "dd/MM/yyyy"), Jr.call(this, r, e, t, A, i, s, n);
}
function ku(r, e, t, A, i, s, n) {
  return n.format || (n.format = "HH:mm"), Jr.call(this, r, e, t, A, i, s, n);
}
function _u(r, e, t, A, i, s, n) {
  var o = r === !0 || r === "true" || r === "True" || r === 1 ? 1 : 0, a = e === !0 || e === "true" || e === "True" || e === 1 ? 1 : 0;
  return o - a;
}
function Ou(r, e, t, A, i, s, n) {
  var o = n.type || "length", a = n.alignEmptyValues, l = 0, h = this.table, u;
  n.valueMap && (typeof n.valueMap == "string" ? u = function(g) {
    return g.map((w) => ae.retrieveNestedData(h.options.nestedFieldSeparator, n.valueMap, w));
  } : u = n.valueMap);
  function c(g) {
    var w;
    switch (u && (g = u(g)), o) {
      case "length":
        w = g.length;
        break;
      case "sum":
        w = g.reduce(function(B, v) {
          return B + v;
        });
        break;
      case "max":
        w = Math.max.apply(null, g);
        break;
      case "min":
        w = Math.min.apply(null, g);
        break;
      case "avg":
        w = g.reduce(function(B, v) {
          return B + v;
        }) / g.length;
        break;
      case "string":
        w = g.join("");
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
function Pu(r, e, t, A, i, s, n) {
  var o = typeof r > "u" ? 0 : 1, a = typeof e > "u" ? 0 : 1;
  return o - a;
}
function Ku(r, e, t, A, i, s, n) {
  var o, a, l, h, u = 0, c, g = /(\d+)|(\D+)/g, w = /\d/, B = n.alignEmptyValues, v = 0;
  if (!r && r !== 0)
    v = !e && e !== 0 ? 0 : -1;
  else if (!e && e !== 0)
    v = 1;
  else {
    if (isFinite(r) && isFinite(e)) return r - e;
    if (o = String(r).toLowerCase(), a = String(e).toLowerCase(), o === a) return 0;
    if (!(w.test(o) && w.test(a))) return o > a ? 1 : -1;
    for (o = o.match(g), a = a.match(g), c = o.length > a.length ? a.length : o.length; u < c; )
      if (l = o[u], h = a[u++], l !== h)
        return isFinite(l) && isFinite(h) ? (l.charAt(0) === "0" && (l = "." + l), h.charAt(0) === "0" && (h = "." + h), l - h) : l > h ? 1 : -1;
    return o.length > a.length;
  }
  return (B === "top" && s === "desc" || B === "bottom" && s === "asc") && (v *= -1), v;
}
var Vu = {
  number: Mu,
  string: Su,
  date: Du,
  time: ku,
  datetime: Jr,
  boolean: _u,
  array: Ou,
  exists: Pu,
  alphanum: Ku
};
const Jt = class Jt extends q {
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
        Jt.sorters[e.definition.sorter] ? t = Jt.sorters[e.definition.sorter] : console.warn("Sort Error - No such sorter found: ", e.definition.sorter);
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
    return Jt.sorters[A];
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
x(Jt, "moduleName", "sort"), //load defaults
x(Jt, "sorters", Vu);
let wr = Jt;
class Nu {
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
class No {
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
class Bn extends Ue {
  constructor(e, t) {
    super(e.table), this.spreadsheetManager = e, this.definition = t, this.title = this.definition.title || "", this.key = this.definition.key || this.definition.title, this.rowCount = this.definition.rows, this.columnCount = this.definition.columns, this.data = this.definition.data || [], this.element = null, this.isActive = !1, this.grid = new Nu(this.columnCount, this.rowCount), this.defaultColumnDefinition = { width: 100, headerHozAlign: "center", headerSort: !1 }, this.columnDefinition = Object.assign(this.defaultColumnDefinition, this.options("spreadsheetColumnDefinition")), this.columnDefs = [], this.rowDefs = [], this.columnFields = [], this.columns = [], this.rows = [], this.scrollTop = null, this.scrollLeft = null, this.initialize(), this.dispatchExternal("sheetAdded", this.getComponent());
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
    return new No(this);
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
class zo extends q {
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
    return e.rows || (e.rows = this.options("spreadsheetRows")), e.columns || (e.columns = this.options("spreadsheetColumns")), t = new Bn(this, e), this.sheets.push(t), this.element && this.element.appendChild(t.element), t;
  }
  removeSheet(e) {
    var t = this.sheets.indexOf(e), A;
    this.sheets.length > 1 ? t > -1 && (this.sheets.splice(t, 1), e.destroy(), this.activeSheet === e && (A = this.sheets[t - 1] || this.sheets[0], A ? this.loadSheet(A) : this.activeSheet = null)) : console.warn("Unable to remove sheet, at least one sheet must be active");
  }
  lookupSheet(e) {
    return e ? e instanceof Bn ? e : e instanceof No ? e._sheet : this.sheets.find((t) => t.key === e) || !1 : this.activeSheet;
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
x(zo, "moduleName", "spreadsheet");
class Go extends q {
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
    typeof A == "function" && (A = A(e, t.getComponent(), o)), A instanceof HTMLElement ? i = A : (i = document.createElement("div"), A === !0 && (t instanceof qA ? A = t.value : t.definition.field ? this.langBind("columns|" + t.definition.field, (a) => {
      i.innerHTML = A = a || t.definition.title;
    }) : A = t.definition.title), i.innerHTML = A), (A || A === 0 || A === !1) && (i.classList.add("tabulator-tooltip"), i.addEventListener("mousemove", (a) => a.preventDefault()), this.popupInstance = this.popup(i), typeof s == "function" && this.popupInstance.renderCallback(s), n = this.popupInstance.containerEventCoords(e), this.popupInstance.show(n.x + 15, n.y + 15).hideOnBlur(() => {
      this.dispatchExternal("TooltipClosed", t.getComponent()), this.popupInstance = null;
    }), this.dispatchExternal("TooltipOpened", t.getComponent()));
  }
}
x(Go, "moduleName", "tooltip");
var zu = {
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
const JA = class JA extends q {
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
    var A = typeof e == "function" ? e : JA.validators[e];
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
x(JA, "moduleName", "validate"), //load defaults
x(JA, "validators", zu);
let br = JA;
var xs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccessorModule: $s,
  AjaxModule: tr,
  ClipboardModule: Ar,
  ColumnCalcsModule: ir,
  DataTreeModule: xo,
  DownloadModule: sr,
  EditModule: rr,
  ExportModule: nr,
  FilterModule: or,
  FormatModule: ar,
  FrozenColumnsModule: Ro,
  FrozenRowsModule: To,
  GroupRowsModule: Lo,
  HistoryModule: lr,
  HtmlTableImportModule: Io,
  ImportModule: hr,
  InteractionModule: Mo,
  KeybindingsModule: ur,
  MenuModule: So,
  MoveColumnsModule: Do,
  MoveRowsModule: cr,
  MutatorModule: dr,
  PageModule: fr,
  PersistenceModule: gr,
  PopupModule: ko,
  PrintModule: _o,
  ReactiveDataModule: Oo,
  ResizeColumnsModule: Po,
  ResizeRowsModule: Ko,
  ResizeTableModule: Vo,
  ResponsiveLayoutModule: pr,
  SelectRangeModule: Oi,
  SelectRowModule: mr,
  SortModule: wr,
  SpreadsheetModule: zo,
  TooltipModule: Go,
  ValidateModule: br
}), Gu = {
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
class Wo {
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
let As = class extends Ue {
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
        if (typeof A > "u" && (A = this.table.options.scrollToRowIfVisible), !A && ae.elVisible(s) && (n = ae.elOffset(s).top - ae.elOffset(this.elementVertical).top, n > 0 && n < this.elementVertical.clientHeight - s.offsetHeight))
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
class Wu extends As {
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
class Xu extends As {
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
class Ju extends Ue {
  constructor(e) {
    super(e), this.blockHozScrollEvent = !1, this.headersElement = null, this.contentsElement = null, this.rowHeader = null, this.element = null, this.columns = [], this.columnsByIndex = [], this.columnsByField = {}, this.scrollLeft = 0, this.optionsList = new Wo(this.table, "column definition", Ho), this.redrawBlock = !1, this.redrawBlockUpdate = null, this.renderer = null;
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
      virtual: Xu,
      basic: Wu
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
    this.columns = [], this.columnsByIndex = [], this.columnsByField = {}, this.dispatch("columns-loading"), this.dispatchExternal("columnsLoading"), this.table.options.rowHeader && (this.rowHeader = new Yt(this.table.options.rowHeader === !0 ? {} : this.table.options.rowHeader, this, !0), this.columns.push(this.rowHeader), this.headersElement.appendChild(this.rowHeader.getElement()), this.rowHeader.columnRendered()), e.forEach((A, i) => {
      this._addColumn(A);
    }), this._reIndexColumns(), this.dispatch("columns-loaded"), this.subscribedExternal("columnsLoaded") && this.dispatchExternal("columnsLoaded", this.getComponents()), this.rerenderColumns(!1, !0), this.redraw(!0);
  }
  _addColumn(e, t, A) {
    var i = new Yt(e, this), s = i.getElement(), n = A && this.findColumnIndex(A);
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
      if (e instanceof Yt)
        return e;
      if (e instanceof Uo)
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
    ae.elVisible(this.element) && this.verticalAlignHeaders(), e && (this.table.rowManager.resetScroll(), this.table.rowManager.reinitialize()), this.confirm("table-redrawing", e) || this.layoutRefresh(e), this.dispatch("table-redraw", e), this.table.footerManager.redraw();
  }
}
class ju extends As {
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
    var t = ae.elOffset(e.getElement()).top;
    return !(Math.abs(this.elementVertical.scrollTop - t) > Math.abs(this.elementVertical.scrollTop + this.elementVertical.clientHeight - t));
  }
  scrollToRow(e) {
    var t = e.getElement();
    this.elementVertical.scrollTop = ae.elOffset(t).top - ae.elOffset(this.elementVertical).top + this.elementVertical.scrollTop;
  }
  visibleRows(e) {
    return this.rows();
  }
}
class Yu extends As {
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
    var i = this.tableElement, s = this.elementVertical, n = 0, o = 0, a = 0, l = 0, h = 0, u = 0, c = this.rows(), g = c.length, w = 0, B, v, b = [], F = 0, L = 0, P = this.table.rowManager.fixedHeight, R = this.elementVertical.clientHeight, H = this.table.options.rowHeight, Z = !0;
    if (e = e || 0, A = A || 0, !e)
      this.clear();
    else {
      for (; i.firstChild; ) i.removeChild(i.firstChild);
      l = (g - e + 1) * this.vDomRowHeight, l < R && (e -= Math.ceil((R - l) / this.vDomRowHeight), e < 0 && (e = 0)), n = Math.min(Math.max(Math.floor(this.vDomWindowBuffer / this.vDomRowHeight), this.vDomWindowMinMarginRows), e), e -= n;
    }
    if (g && ae.elVisible(this.elementVertical)) {
      for (this.vDomTop = e, this.vDomBottom = e - 1, P || this.table.options.maxHeight ? (H && (L = R / H + this.vDomWindowBuffer / H), L = Math.max(this.vDomWindowMinTotalRows, Math.ceil(L))) : L = g; (L == g || o <= R + this.vDomWindowBuffer || F < this.vDomWindowMinTotalRows) && this.vDomBottom < g - 1; ) {
        for (b = [], v = document.createDocumentFragment(), u = 0; u < L && this.vDomBottom < g - 1; )
          w = this.vDomBottom + 1, B = c[w], this.styleRow(B, w), B.initialize(!1, !0), !B.heightInitialized && !this.table.options.rowHeight && B.clearCellHeight(), v.appendChild(B.getElement()), b.push(B), this.vDomBottom++, u++;
        if (!b.length)
          break;
        i.appendChild(v), b.forEach((z) => {
          z.rendered(), z.heightInitialized || z.calcHeight(!0);
        }), b.forEach((z) => {
          z.heightInitialized || z.setCellHeight();
        }), b.forEach((z) => {
          a = z.getHeight(), F < n ? h += a : o += a, a > this.vDomWindowBuffer && (this.vDomWindowBuffer = a * 2), F++;
        }), Z = this.table.rowManager.adjustTableSize(), R = this.elementVertical.clientHeight, Z && (P || this.table.options.maxHeight) && (H = o / F, L = Math.max(this.vDomWindowMinTotalRows, Math.ceil(R / H + this.vDomWindowBuffer / H)));
      }
      e ? (this.vDomTopPad = t ? this.vDomRowHeight * this.vDomTop + A : this.scrollTop - h, this.vDomBottomPad = this.vDomBottom == g - 1 ? 0 : Math.max(this.vDomScrollHeight - this.vDomTopPad - o - h, 0)) : (this.vDomTopPad = 0, this.vDomRowHeight = Math.floor((o + h) / F), this.vDomBottomPad = this.vDomRowHeight * (g - this.vDomBottom - 1), this.vDomScrollHeight = h + o + this.vDomBottomPad - R), i.style.paddingTop = this.vDomTopPad + "px", i.style.paddingBottom = this.vDomBottomPad + "px", t && (this.scrollTop = this.vDomTopPad + h + A - (this.elementVertical.scrollWidth > this.elementVertical.clientWidth ? this.elementVertical.offsetHeight - R : 0)), this.scrollTop = Math.min(this.scrollTop, this.elementVertical.scrollHeight - R), this.elementVertical.scrollWidth > this.elementVertical.clientWidth && t && (this.scrollTop += this.elementVertical.offsetHeight - R), this.vDomScrollPosTop = this.scrollTop, this.vDomScrollPosBottom = this.scrollTop, s.scrollTop = this.scrollTop, this.dispatch("render-virtual-fill");
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
class Zu extends Ue {
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
      if (e instanceof Ie)
        return e;
      if (e instanceof es)
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
        var s = new Ie(A, this);
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
    var s = e instanceof Ie ? e : new Ie(e || {}, this), n = this.findAddRowPos(t), o = -1, a, l;
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
    return A !== !1 && A < this.displayRowsCount - 1 && (i = this.getDisplayRows()[A + 1]), i && (!(i instanceof Ie) || i.type != "row") ? this.nextDisplayRow(i, t) : i;
  }
  prevDisplayRow(e, t) {
    var A = this.getDisplayRowIndex(e), i = !1;
    return A && (i = this.getDisplayRows()[A - 1]), t && i && (!(i instanceof Ie) || i.type != "row") ? this.prevDisplayRow(i, t) : i;
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
        ae.elVisible(this.element) ? A ? this.reRenderInPosition(this.refreshPipelines.bind(this, e, s, n, A)) : (this.refreshPipelines(e, s, n, A), e || this.table.columnManager.renderer.renderColumns(), this.renderTable(), i.options.layoutColumnsOnNewData && this.table.columnManager.redraw(!0)) : this.refreshPipelines(e, s, n, A), this.dispatch("data-refreshed");
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
      virtual: Yu,
      basic: ju
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
class $u extends Ue {
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
class qu extends Ue {
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
            (i.components.includes("row") || i.components.includes("cell") || i.components.includes("group")) && (l = this.table.rowManager.getVisibleRows(!0).find((g) => g.getElement() === h), t.row && t.row.parentNode && t.row.parentNode.closest(".tabulator-row") && (t[a] = !1));
            break;
          case "column":
            i.components.includes("column") && (l = this.table.columnManager.findColumn(h));
            break;
          case "cell":
            i.components.includes("cell") && (s.row instanceof Ie ? l = s.row.findCell(h) : t.row && console.warn("Event Target Lookup Error - The row this cell is attached to cannot be found, has the table been reinitialized without being destroyed first?"));
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
class ec {
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
class tc extends Ue {
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
class Ac {
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
class ic {
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
class sc extends Ue {
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
class rc extends Ue {
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
function nc(r, e) {
  e && this.table.columnManager.renderer.reinitializeColumnWidths(r), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function Cn(r, e) {
  r.forEach(function(t) {
    t.reinitializeWidth();
  }), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function oc(r, e) {
  var t = 0, A = this.table.rowManager.element.clientWidth, i = 0, s = !1;
  r.forEach((n, o) => {
    n.widthFixed || n.reinitializeWidth(), (this.table.options.responsiveLayout ? n.modules.responsive.visible : n.visible) && (s = n), n.visible && (t += n.getWidth());
  }), s ? (i = A - t + s.getWidth(), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && (s.setWidth(0), this.table.modules.responsiveLayout.update()), i > 0 ? s.setWidth(i) : s.reinitializeWidth()) : this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function ac(r, e) {
  var t = this.table.rowManager.element.getBoundingClientRect().width, A = 0, i = 0, s = 0, n = 0, o = [], a = [], l = 0, h = 0, u = 0;
  function c(w) {
    var B;
    return typeof w == "string" ? w.indexOf("%") > -1 ? B = t / 100 * parseInt(w) : B = parseInt(w) : B = w, B;
  }
  function g(w, B, v, b) {
    var F = [], L = 0, P = 0, R = 0, H = s, Z = 0, z = 0, X = [];
    function le(j) {
      return v * (j.column.definition.widthGrow || 1);
    }
    function Be(j) {
      return c(j.width) - v * (j.column.definition.widthShrink || 0);
    }
    return w.forEach(function(j, ie) {
      var ce = b ? Be(j) : le(j);
      j.column.minWidth >= ce ? F.push(j) : j.column.maxWidth && j.column.maxWidth < ce ? (j.width = j.column.maxWidth, B -= j.column.maxWidth, H -= b ? j.column.definition.widthShrink || 1 : j.column.definition.widthGrow || 1, H && (v = Math.floor(B / H))) : (X.push(j), z += b ? j.column.definition.widthShrink || 1 : j.column.definition.widthGrow || 1);
    }), F.length ? (F.forEach(function(j) {
      L += b ? j.width - j.column.minWidth : j.column.minWidth, j.width = j.column.minWidth;
    }), P = B - L, R = z ? Math.floor(P / z) : P, Z = g(X, P, R, b)) : (Z = z ? B - Math.floor(B / z) * z : B, X.forEach(function(j) {
      j.width = b ? Be(j) : le(j);
    })), Z;
  }
  this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update(), this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight && (t -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth), r.forEach(function(w) {
    var B, v, b;
    w.visible && (B = w.definition.width, v = parseInt(w.minWidth), B ? (b = c(B), A += b > v ? b : v, w.definition.widthShrink && (a.push({
      column: w,
      width: b > v ? b : v
    }), l += w.definition.widthShrink)) : (o.push({
      column: w,
      width: 0
    }), s += w.definition.widthGrow || 1));
  }), i = t - A, n = Math.floor(i / s), u = g(o, i, n, !1), o.length && u > 0 && (o[o.length - 1].width += u), o.forEach(function(w) {
    i -= w.width;
  }), h = Math.abs(u) + i, h > 0 && l && (u = g(a, h, Math.floor(h / l), !0)), u && a.length && (a[a.length - 1].width -= u), o.forEach(function(w) {
    w.column.setWidth(w.width);
  }), a.forEach(function(w) {
    w.column.setWidth(w.width);
  });
}
var lc = {
  fitData: nc,
  fitDataFill: Cn,
  fitDataTable: Cn,
  fitDataStretch: oc,
  fitColumns: ac
};
const pA = class pA extends q {
  constructor(e) {
    super(e, "layout"), this.mode = null, this.registerTableOption("layout", "fitData"), this.registerTableOption("layoutColumnsOnNewData", !1), this.registerColumnOption("widthGrow"), this.registerColumnOption("widthShrink");
  }
  //initialize layout system
  initialize() {
    var e = this.table.options.layout;
    pA.modes[e] ? this.mode = e : (console.warn("Layout Error - invalid mode set, defaulting to 'fitData' : " + e), this.mode = "fitData"), this.table.element.setAttribute("tabulator-layout", this.mode), this.subscribe("column-init", this.initializeColumn.bind(this));
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
    this.dispatch("layout-refreshing"), pA.modes[this.mode].call(this, this.table.columnManager.columnsByIndex, e), t && this.table.rowManager.normalizeHeight(!0), this.dispatch("layout-refreshed");
  }
};
x(pA, "moduleName", "layout"), //load defaults
x(pA, "modes", lc);
let Br = pA;
var hc = {
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
const jA = class jA extends q {
  constructor(e) {
    super(e), this.locale = "default", this.lang = !1, this.bindings = {}, this.langList = {}, this.registerTableOption("locale", !1), this.registerTableOption("langs", {});
  }
  initialize() {
    this.langList = ae.deepClone(jA.langs), this.table.options.columnDefaults.headerFilterPlaceholder !== !1 && this.setHeaderFilterPlaceholder(this.table.options.columnDefaults.headerFilterPlaceholder);
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
    this.locale = e, this.lang = ae.deepClone(this.langList.default || {}), e != "default" && t(this.langList[e], this.lang), this.dispatchExternal("localized", this.locale, this.lang), this._executeBindings();
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
x(jA, "moduleName", "localize"), //load defaults
x(jA, "langs", hc);
let Cr = jA;
class Xo extends q {
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
x(Xo, "moduleName", "comms");
var uc = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CommsModule: Xo,
  LayoutModule: Br,
  LocalizeModule: Cr
});
const ze = class ze {
  static findTable(e) {
    var t = ze.registry.lookupTable(e, !0);
    return Array.isArray(t) && !t.length ? !1 : t;
  }
};
x(ze, "registry", {
  tables: [],
  register(e) {
    ze.registry.tables.push(e);
  },
  deregister(e) {
    var t = ze.registry.tables.indexOf(e);
    t > -1 && ze.registry.tables.splice(t, 1);
  },
  lookupTable(e, t) {
    var A = [], i, s;
    if (typeof e == "string") {
      if (i = document.querySelectorAll(e), i.length)
        for (var n = 0; n < i.length; n++)
          s = ze.registry.matchElement(i[n]), s && A.push(s);
    } else typeof HTMLElement < "u" && e instanceof HTMLElement || e instanceof ze ? (s = ze.registry.matchElement(e), s && A.push(s)) : Array.isArray(e) ? e.forEach(function(o) {
      A = A.concat(ze.registry.lookupTable(o));
    }) : t || console.warn("Table Connection Error - Invalid Selector", e);
    return A;
  },
  matchElement(e) {
    return ze.registry.tables.find(function(t) {
      return e instanceof ze ? t === e : t.element === e;
    });
  }
});
let vr = ze;
const ne = class ne extends vr {
  constructor() {
    super();
  }
  static initializeModuleBinder(e) {
    ne.modulesRegistered || (ne.modulesRegistered = !0, ne._registerModules(uc, !0), e && ne._registerModules(e));
  }
  static _extendModule(e, t, A) {
    if (ne.moduleBindings[e]) {
      var i = ne.moduleBindings[e][t];
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
    }), ne._registerModule(A);
  }
  static _registerModule(e) {
    Array.isArray(e) || (e = [e]), e.forEach((t) => {
      ne._registerModuleBinding(t), ne._registerModuleExtensions(t);
    });
  }
  static _registerModuleBinding(e) {
    e.moduleName ? ne.moduleBindings[e.moduleName] = e : console.error("Unable to bind module, no moduleName defined", e.moduleName);
  }
  static _registerModuleExtensions(e) {
    var t = e.moduleExtensions;
    if (e.moduleExtensions)
      for (let A in t) {
        let i = t[A];
        if (ne.moduleBindings[A])
          for (let s in i)
            ne._extendModule(A, s, i[s]);
        else {
          ne.moduleExtensions[A] || (ne.moduleExtensions[A] = {});
          for (let s in i)
            ne.moduleExtensions[A][s] || (ne.moduleExtensions[A][s] = {}), Object.assign(ne.moduleExtensions[A][s], i[s]);
        }
      }
    ne._extendModuleFromQueue(e);
  }
  static _extendModuleFromQueue(e) {
    var t = ne.moduleExtensions[e.moduleName];
    if (t)
      for (let A in t)
        ne._extendModule(e.moduleName, A, t[A]);
  }
  //ensure that module are bound to instantiated function
  _bindModules() {
    var e = [], t = [], A = [];
    this.modules = {};
    for (var i in ne.moduleBindings) {
      let s = ne.moduleBindings[i], n = new s(this);
      this.modules[i] = n, s.prototype.moduleCore ? this.modulesCore.push(n) : s.moduleInitOrder ? s.moduleInitOrder < 0 ? e.push(n) : t.push(n) : A.push(n);
    }
    e.sort((s, n) => s.moduleInitOrder > n.moduleInitOrder ? 1 : -1), t.sort((s, n) => s.moduleInitOrder > n.moduleInitOrder ? 1 : -1), this.modulesRegular = e.concat(A.concat(t));
  }
};
x(ne, "moduleBindings", {}), x(ne, "moduleExtensions", {}), x(ne, "modulesRegistered", !1), x(ne, "defaultModules", !1);
let Er = ne;
class cc extends Ue {
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
const pt = class pt extends Er {
  static extendModule() {
    pt.initializeModuleBinder(), pt._extendModule(...arguments);
  }
  static registerModule() {
    pt.initializeModuleBinder(), pt._registerModule(...arguments);
  }
  constructor(e, t, A) {
    super(), pt.initializeModuleBinder(A), this.options = {}, this.columnManager = null, this.rowManager = null, this.footerManager = null, this.alertManager = null, this.vdomHoz = null, this.externalEvents = null, this.eventBus = null, this.interactionMonitor = !1, this.browser = "", this.browserSlow = !1, this.browserMobile = !1, this.rtl = !1, this.originalElement = null, this.componentFunctionBinder = new ec(this), this.dataLoader = !1, this.modules = {}, this.modulesCore = [], this.modulesRegular = [], this.deprecationAdvisor = new sc(this), this.optionsList = new Wo(this, "table constructor"), this.dependencyRegistry = new rc(this), this.initialized = !1, this.destroyed = !1, this.initializeElement(e) && (this.initializeCoreSystems(t), setTimeout(() => {
      this._create();
    })), this.constructor.registry.register(this);
  }
  initializeElement(e) {
    return typeof HTMLElement < "u" && e instanceof HTMLElement ? (this.element = e, !0) : typeof e == "string" ? (this.element = document.querySelector(e), this.element ? !0 : (console.error("Tabulator Creation Error - no element found matching selector: ", e), !1)) : (console.error("Tabulator Creation Error - Invalid element provided:", e), !1);
  }
  initializeCoreSystems(e) {
    this.columnManager = new Ju(this), this.rowManager = new Zu(this), this.footerManager = new $u(this), this.dataLoader = new tc(this), this.alertManager = new cc(this), this._bindModules(), this.options = this.optionsList.generate(pt.defaultOptions, e), this._clearObjectPointers(), this._mapDeprecatedFunctionality(), this.externalEvents = new Ac(this, this.options, this.options.debugEventsExternal), this.eventBus = new ic(this.options.debugEventsInternal), this.interactionMonitor = new qu(this), this.dataLoader.initialize(), this.footerManager.initialize(), this.dependencyRegistry.initialize();
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
x(pt, "defaultOptions", Gu);
let yr = pt;
var HA = yr;
class dc extends HA {
  static extendModule() {
    HA.initializeModuleBinder(xs), HA._extendModule(...arguments);
  }
  static registerModule() {
    HA.initializeModuleBinder(xs), HA._registerModule(...arguments);
  }
  constructor(e, t, A) {
    super(e, t, xs);
  }
}
var vn = dc;
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
var Fr = function(r, e) {
  return Fr = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, A) {
    t.__proto__ = A;
  } || function(t, A) {
    for (var i in A) Object.prototype.hasOwnProperty.call(A, i) && (t[i] = A[i]);
  }, Fr(r, e);
};
function qe(r, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Fr(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Qr = function() {
  return Qr = Object.assign || function(e) {
    for (var t, A = 1, i = arguments.length; A < i; A++) {
      t = arguments[A];
      for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
    }
    return e;
  }, Qr.apply(this, arguments);
};
function De(r, e, t, A) {
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
function Le(r, e) {
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
function pi(r, e, t) {
  if (arguments.length === 2) for (var A = 0, i = e.length, s; A < i; A++)
    (s || !(A in e)) && (s || (s = Array.prototype.slice.call(e, 0, A)), s[A] = e[A]);
  return r.concat(s || e);
}
var wt = (
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
), is = function(r, e) {
  return wt.fromClientRect(r, e.getBoundingClientRect());
}, fc = function(r) {
  var e = r.body, t = r.documentElement;
  if (!e || !t)
    throw new Error("Unable to get document size");
  var A = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.offsetWidth, t.offsetWidth), Math.max(e.clientWidth, t.clientWidth)), i = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.offsetHeight, t.offsetHeight), Math.max(e.clientHeight, t.clientHeight));
  return new wt(0, 0, A, i);
}, ss = function(r) {
  for (var e = [], t = 0, A = r.length; t < A; ) {
    var i = r.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < A) {
      var s = r.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, me = function() {
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
}, En = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", gc = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var mi = 0; mi < En.length; mi++)
  gc[En.charCodeAt(mi)] = mi;
var yn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", IA = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var wi = 0; wi < yn.length; wi++)
  IA[yn.charCodeAt(wi)] = wi;
var pc = function(r) {
  var e = r.length * 0.75, t = r.length, A, i = 0, s, n, o, a;
  r[r.length - 1] === "=" && (e--, r[r.length - 2] === "=" && e--);
  var l = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), h = Array.isArray(l) ? l : new Uint8Array(l);
  for (A = 0; A < t; A += 4)
    s = IA[r.charCodeAt(A)], n = IA[r.charCodeAt(A + 1)], o = IA[r.charCodeAt(A + 2)], a = IA[r.charCodeAt(A + 3)], h[i++] = s << 2 | n >> 4, h[i++] = (n & 15) << 4 | o >> 2, h[i++] = (o & 3) << 6 | a & 63;
  return l;
}, mc = function(r) {
  for (var e = r.length, t = [], A = 0; A < e; A += 2)
    t.push(r[A + 1] << 8 | r[A]);
  return t;
}, wc = function(r) {
  for (var e = r.length, t = [], A = 0; A < e; A += 4)
    t.push(r[A + 3] << 24 | r[A + 2] << 16 | r[A + 1] << 8 | r[A]);
  return t;
}, Zt = 5, jr = 11, Rs = 2, bc = jr - Zt, Jo = 65536 >> Zt, Bc = 1 << Zt, Ts = Bc - 1, Cc = 1024 >> Zt, vc = Jo + Cc, Ec = vc, yc = 32, Fc = Ec + yc, Qc = 65536 >> jr, Uc = 1 << bc, Hc = Uc - 1, Fn = function(r, e, t) {
  return r.slice ? r.slice(e, t) : new Uint16Array(Array.prototype.slice.call(r, e, t));
}, xc = function(r, e, t) {
  return r.slice ? r.slice(e, t) : new Uint32Array(Array.prototype.slice.call(r, e, t));
}, Rc = function(r, e) {
  var t = pc(r), A = Array.isArray(t) ? wc(t) : new Uint32Array(t), i = Array.isArray(t) ? mc(t) : new Uint16Array(t), s = 24, n = Fn(i, s / 2, A[4] / 2), o = A[5] === 2 ? Fn(i, (s + A[4]) / 2) : xc(A, Math.ceil((s + A[4]) / 4));
  return new Tc(A[0], A[1], A[2], A[3], n, o);
}, Tc = (
  /** @class */
  function() {
    function r(e, t, A, i, s, n) {
      this.initialValue = e, this.errorValue = t, this.highStart = A, this.highValueIndex = i, this.index = s, this.data = n;
    }
    return r.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> Zt], t = (t << Rs) + (e & Ts), this.data[t];
        if (e <= 65535)
          return t = this.index[Jo + (e - 55296 >> Zt)], t = (t << Rs) + (e & Ts), this.data[t];
        if (e < this.highStart)
          return t = Fc - Qc + (e >> jr), t = this.index[t], t += e >> Zt & Hc, t = this.index[t], t = (t << Rs) + (e & Ts), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, r;
  }()
), Qn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Lc = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var bi = 0; bi < Qn.length; bi++)
  Lc[Qn.charCodeAt(bi)] = bi;
var Ic = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", Un = 50, Mc = 1, jo = 2, Yo = 3, Sc = 4, Dc = 5, Hn = 7, Zo = 8, xn = 9, Mt = 10, Ur = 11, Rn = 12, Hr = 13, kc = 14, MA = 15, xr = 16, Bi = 17, xA = 18, _c = 19, Tn = 20, Rr = 21, RA = 22, Ls = 23, iA = 24, Ne = 25, SA = 26, DA = 27, sA = 28, Oc = 29, Gt = 30, Pc = 31, Ci = 32, vi = 33, Tr = 34, Lr = 35, Ir = 36, YA = 37, Mr = 38, Pi = 39, Ki = 40, Is = 41, $o = 42, Kc = 43, Vc = [9001, 65288], qo = "!", Ae = "×", Ei = "÷", Sr = Rc(Ic), dt = [Gt, Ir], Dr = [Mc, jo, Yo, Dc], ea = [Mt, Zo], Ln = [DA, SA], Nc = Dr.concat(ea), In = [Mr, Pi, Ki, Tr, Lr], zc = [MA, Hr], Gc = function(r, e) {
  e === void 0 && (e = "strict");
  var t = [], A = [], i = [];
  return r.forEach(function(s, n) {
    var o = Sr.get(s);
    if (o > Un ? (i.push(!0), o -= Un) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(s) !== -1)
      return A.push(n), t.push(xr);
    if (o === Sc || o === Ur) {
      if (n === 0)
        return A.push(n), t.push(Gt);
      var a = t[n - 1];
      return Nc.indexOf(a) === -1 ? (A.push(A[n - 1]), t.push(a)) : (A.push(n), t.push(Gt));
    }
    if (A.push(n), o === Pc)
      return t.push(e === "strict" ? Rr : YA);
    if (o === $o || o === Oc)
      return t.push(Gt);
    if (o === Kc)
      return s >= 131072 && s <= 196605 || s >= 196608 && s <= 262141 ? t.push(YA) : t.push(Gt);
    t.push(o);
  }), [A, t, i];
}, Ms = function(r, e, t, A) {
  var i = A[t];
  if (Array.isArray(r) ? r.indexOf(i) !== -1 : r === i)
    for (var s = t; s <= A.length; ) {
      s++;
      var n = A[s];
      if (n === e)
        return !0;
      if (n !== Mt)
        break;
    }
  if (i === Mt)
    for (var s = t; s > 0; ) {
      s--;
      var o = A[s];
      if (Array.isArray(r) ? r.indexOf(o) !== -1 : r === o)
        for (var a = t; a <= A.length; ) {
          a++;
          var n = A[a];
          if (n === e)
            return !0;
          if (n !== Mt)
            break;
        }
      if (o !== Mt)
        break;
    }
  return !1;
}, Mn = function(r, e) {
  for (var t = r; t >= 0; ) {
    var A = e[t];
    if (A === Mt)
      t--;
    else
      return A;
  }
  return 0;
}, Wc = function(r, e, t, A, i) {
  if (t[A] === 0)
    return Ae;
  var s = A - 1;
  if (Array.isArray(i) && i[s] === !0)
    return Ae;
  var n = s - 1, o = s + 1, a = e[s], l = n >= 0 ? e[n] : 0, h = e[o];
  if (a === jo && h === Yo)
    return Ae;
  if (Dr.indexOf(a) !== -1)
    return qo;
  if (Dr.indexOf(h) !== -1 || ea.indexOf(h) !== -1)
    return Ae;
  if (Mn(s, e) === Zo)
    return Ei;
  if (Sr.get(r[s]) === Ur || (a === Ci || a === vi) && Sr.get(r[o]) === Ur || a === Hn || h === Hn || a === xn || [Mt, Hr, MA].indexOf(a) === -1 && h === xn || [Bi, xA, _c, iA, sA].indexOf(h) !== -1 || Mn(s, e) === RA || Ms(Ls, RA, s, e) || Ms([Bi, xA], Rr, s, e) || Ms(Rn, Rn, s, e))
    return Ae;
  if (a === Mt)
    return Ei;
  if (a === Ls || h === Ls)
    return Ae;
  if (h === xr || a === xr)
    return Ei;
  if ([Hr, MA, Rr].indexOf(h) !== -1 || a === kc || l === Ir && zc.indexOf(a) !== -1 || a === sA && h === Ir || h === Tn || dt.indexOf(h) !== -1 && a === Ne || dt.indexOf(a) !== -1 && h === Ne || a === DA && [YA, Ci, vi].indexOf(h) !== -1 || [YA, Ci, vi].indexOf(a) !== -1 && h === SA || dt.indexOf(a) !== -1 && Ln.indexOf(h) !== -1 || Ln.indexOf(a) !== -1 && dt.indexOf(h) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [DA, SA].indexOf(a) !== -1 && (h === Ne || [RA, MA].indexOf(h) !== -1 && e[o + 1] === Ne) || // ( OP | HY ) × NU
  [RA, MA].indexOf(a) !== -1 && h === Ne || // NU ×	(NU | SY | IS)
  a === Ne && [Ne, sA, iA].indexOf(h) !== -1)
    return Ae;
  if ([Ne, sA, iA, Bi, xA].indexOf(h) !== -1)
    for (var u = s; u >= 0; ) {
      var c = e[u];
      if (c === Ne)
        return Ae;
      if ([sA, iA].indexOf(c) !== -1)
        u--;
      else
        break;
    }
  if ([DA, SA].indexOf(h) !== -1)
    for (var u = [Bi, xA].indexOf(a) !== -1 ? n : s; u >= 0; ) {
      var c = e[u];
      if (c === Ne)
        return Ae;
      if ([sA, iA].indexOf(c) !== -1)
        u--;
      else
        break;
    }
  if (Mr === a && [Mr, Pi, Tr, Lr].indexOf(h) !== -1 || [Pi, Tr].indexOf(a) !== -1 && [Pi, Ki].indexOf(h) !== -1 || [Ki, Lr].indexOf(a) !== -1 && h === Ki || In.indexOf(a) !== -1 && [Tn, SA].indexOf(h) !== -1 || In.indexOf(h) !== -1 && a === DA || dt.indexOf(a) !== -1 && dt.indexOf(h) !== -1 || a === iA && dt.indexOf(h) !== -1 || dt.concat(Ne).indexOf(a) !== -1 && h === RA && Vc.indexOf(r[o]) === -1 || dt.concat(Ne).indexOf(h) !== -1 && a === xA)
    return Ae;
  if (a === Is && h === Is) {
    for (var g = t[s], w = 1; g > 0 && (g--, e[g] === Is); )
      w++;
    if (w % 2 !== 0)
      return Ae;
  }
  return a === Ci && h === vi ? Ae : Ei;
}, Xc = function(r, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = Gc(r, e.lineBreak), A = t[0], i = t[1], s = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(o) {
    return [Ne, Gt, $o].indexOf(o) !== -1 ? YA : o;
  }));
  var n = e.wordBreak === "keep-all" ? s.map(function(o, a) {
    return o && r[a] >= 19968 && r[a] <= 40959;
  }) : void 0;
  return [A, i, n];
}, Jc = (
  /** @class */
  function() {
    function r(e, t, A, i) {
      this.codePoints = e, this.required = t === qo, this.start = A, this.end = i;
    }
    return r.prototype.slice = function() {
      return me.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, r;
  }()
), jc = function(r, e) {
  var t = ss(r), A = Xc(t, e), i = A[0], s = A[1], n = A[2], o = t.length, a = 0, l = 0;
  return {
    next: function() {
      if (l >= o)
        return { done: !0, value: null };
      for (var h = Ae; l < o && (h = Wc(t, s, i, ++l, n)) === Ae; )
        ;
      if (h !== Ae || l === o) {
        var u = new Jc(t, h, a, l);
        return a = l, { value: u, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, Yc = 1, Zc = 2, ei = 4, Sn = 8, zi = 10, Dn = 47, PA = 92, $c = 9, qc = 32, yi = 34, TA = 61, ed = 35, td = 36, Ad = 37, Fi = 39, Qi = 40, LA = 41, id = 95, Ke = 45, sd = 33, rd = 60, nd = 62, od = 64, ad = 91, ld = 93, hd = 61, ud = 123, Ui = 63, cd = 125, kn = 124, dd = 126, fd = 128, _n = 65533, Ss = 42, jt = 43, gd = 44, pd = 58, md = 59, ZA = 46, wd = 0, bd = 8, Bd = 11, Cd = 14, vd = 31, Ed = 127, it = -1, ta = 48, Aa = 97, ia = 101, yd = 102, Fd = 117, Qd = 122, sa = 65, ra = 69, na = 70, Ud = 85, Hd = 90, Me = function(r) {
  return r >= ta && r <= 57;
}, xd = function(r) {
  return r >= 55296 && r <= 57343;
}, rA = function(r) {
  return Me(r) || r >= sa && r <= na || r >= Aa && r <= yd;
}, Rd = function(r) {
  return r >= Aa && r <= Qd;
}, Td = function(r) {
  return r >= sa && r <= Hd;
}, Ld = function(r) {
  return Rd(r) || Td(r);
}, Id = function(r) {
  return r >= fd;
}, Hi = function(r) {
  return r === zi || r === $c || r === qc;
}, Gi = function(r) {
  return Ld(r) || Id(r) || r === id;
}, On = function(r) {
  return Gi(r) || Me(r) || r === Ke;
}, Md = function(r) {
  return r >= wd && r <= bd || r === Bd || r >= Cd && r <= vd || r === Ed;
}, Ut = function(r, e) {
  return r !== PA ? !1 : e !== zi;
}, xi = function(r, e, t) {
  return r === Ke ? Gi(e) || Ut(e, t) : Gi(r) ? !0 : !!(r === PA && Ut(r, e));
}, Ds = function(r, e, t) {
  return r === jt || r === Ke ? Me(e) ? !0 : e === ZA && Me(t) : Me(r === ZA ? e : r);
}, Sd = function(r) {
  var e = 0, t = 1;
  (r[e] === jt || r[e] === Ke) && (r[e] === Ke && (t = -1), e++);
  for (var A = []; Me(r[e]); )
    A.push(r[e++]);
  var i = A.length ? parseInt(me.apply(void 0, A), 10) : 0;
  r[e] === ZA && e++;
  for (var s = []; Me(r[e]); )
    s.push(r[e++]);
  var n = s.length, o = n ? parseInt(me.apply(void 0, s), 10) : 0;
  (r[e] === ra || r[e] === ia) && e++;
  var a = 1;
  (r[e] === jt || r[e] === Ke) && (r[e] === Ke && (a = -1), e++);
  for (var l = []; Me(r[e]); )
    l.push(r[e++]);
  var h = l.length ? parseInt(me.apply(void 0, l), 10) : 0;
  return t * (i + o * Math.pow(10, -n)) * Math.pow(10, a * h);
}, Dd = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, kd = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, _d = {
  type: 4
  /* COMMA_TOKEN */
}, Od = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, Pd = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, Kd = {
  type: 21
  /* COLUMN_TOKEN */
}, Vd = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, Nd = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, zd = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, Gd = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, Wd = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Ri = {
  type: 23
  /* BAD_URL_TOKEN */
}, Xd = {
  type: 1
  /* BAD_STRING_TOKEN */
}, Jd = {
  type: 25
  /* CDO_TOKEN */
}, jd = {
  type: 24
  /* CDC_TOKEN */
}, Yd = {
  type: 26
  /* COLON_TOKEN */
}, Zd = {
  type: 27
  /* SEMICOLON_TOKEN */
}, $d = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, qd = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, ef = {
  type: 31
  /* WHITESPACE_TOKEN */
}, kr = {
  type: 32
  /* EOF_TOKEN */
}, oa = (
  /** @class */
  function() {
    function r() {
      this._value = [];
    }
    return r.prototype.write = function(e) {
      this._value = this._value.concat(ss(e));
    }, r.prototype.read = function() {
      for (var e = [], t = this.consumeToken(); t !== kr; )
        e.push(t), t = this.consumeToken();
      return e;
    }, r.prototype.consumeToken = function() {
      var e = this.consumeCodePoint();
      switch (e) {
        case yi:
          return this.consumeStringToken(yi);
        case ed:
          var t = this.peekCodePoint(0), A = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (On(t) || Ut(A, i)) {
            var s = xi(t, A, i) ? Zc : Yc, n = this.consumeName();
            return { type: 5, value: n, flags: s };
          }
          break;
        case td:
          if (this.peekCodePoint(0) === TA)
            return this.consumeCodePoint(), Od;
          break;
        case Fi:
          return this.consumeStringToken(Fi);
        case Qi:
          return Dd;
        case LA:
          return kd;
        case Ss:
          if (this.peekCodePoint(0) === TA)
            return this.consumeCodePoint(), Wd;
          break;
        case jt:
          if (Ds(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case gd:
          return _d;
        case Ke:
          var o = e, a = this.peekCodePoint(0), l = this.peekCodePoint(1);
          if (Ds(o, a, l))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (xi(o, a, l))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (a === Ke && l === nd)
            return this.consumeCodePoint(), this.consumeCodePoint(), jd;
          break;
        case ZA:
          if (Ds(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case Dn:
          if (this.peekCodePoint(0) === Ss)
            for (this.consumeCodePoint(); ; ) {
              var h = this.consumeCodePoint();
              if (h === Ss && (h = this.consumeCodePoint(), h === Dn))
                return this.consumeToken();
              if (h === it)
                return this.consumeToken();
            }
          break;
        case pd:
          return Yd;
        case md:
          return Zd;
        case rd:
          if (this.peekCodePoint(0) === sd && this.peekCodePoint(1) === Ke && this.peekCodePoint(2) === Ke)
            return this.consumeCodePoint(), this.consumeCodePoint(), Jd;
          break;
        case od:
          var u = this.peekCodePoint(0), c = this.peekCodePoint(1), g = this.peekCodePoint(2);
          if (xi(u, c, g)) {
            var n = this.consumeName();
            return { type: 7, value: n };
          }
          break;
        case ad:
          return $d;
        case PA:
          if (Ut(e, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          break;
        case ld:
          return qd;
        case hd:
          if (this.peekCodePoint(0) === TA)
            return this.consumeCodePoint(), Pd;
          break;
        case ud:
          return zd;
        case cd:
          return Gd;
        case Fd:
        case Ud:
          var w = this.peekCodePoint(0), B = this.peekCodePoint(1);
          return w === jt && (rA(B) || B === Ui) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case kn:
          if (this.peekCodePoint(0) === TA)
            return this.consumeCodePoint(), Vd;
          if (this.peekCodePoint(0) === kn)
            return this.consumeCodePoint(), Kd;
          break;
        case dd:
          if (this.peekCodePoint(0) === TA)
            return this.consumeCodePoint(), Nd;
          break;
        case it:
          return kr;
      }
      return Hi(e) ? (this.consumeWhiteSpace(), ef) : Me(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : Gi(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: me(e) };
    }, r.prototype.consumeCodePoint = function() {
      var e = this._value.shift();
      return typeof e > "u" ? -1 : e;
    }, r.prototype.reconsumeCodePoint = function(e) {
      this._value.unshift(e);
    }, r.prototype.peekCodePoint = function(e) {
      return e >= this._value.length ? -1 : this._value[e];
    }, r.prototype.consumeUnicodeRangeToken = function() {
      for (var e = [], t = this.consumeCodePoint(); rA(t) && e.length < 6; )
        e.push(t), t = this.consumeCodePoint();
      for (var A = !1; t === Ui && e.length < 6; )
        e.push(t), t = this.consumeCodePoint(), A = !0;
      if (A) {
        var i = parseInt(me.apply(void 0, e.map(function(a) {
          return a === Ui ? ta : a;
        })), 16), s = parseInt(me.apply(void 0, e.map(function(a) {
          return a === Ui ? na : a;
        })), 16);
        return { type: 30, start: i, end: s };
      }
      var n = parseInt(me.apply(void 0, e), 16);
      if (this.peekCodePoint(0) === Ke && rA(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var o = []; rA(t) && o.length < 6; )
          o.push(t), t = this.consumeCodePoint();
        var s = parseInt(me.apply(void 0, o), 16);
        return { type: 30, start: n, end: s };
      } else
        return { type: 30, start: n, end: n };
    }, r.prototype.consumeIdentLikeToken = function() {
      var e = this.consumeName();
      return e.toLowerCase() === "url" && this.peekCodePoint(0) === Qi ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === Qi ? (this.consumeCodePoint(), { type: 19, value: e }) : { type: 20, value: e };
    }, r.prototype.consumeUrlToken = function() {
      var e = [];
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === it)
        return { type: 22, value: "" };
      var t = this.peekCodePoint(0);
      if (t === Fi || t === yi) {
        var A = this.consumeStringToken(this.consumeCodePoint());
        return A.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === it || this.peekCodePoint(0) === LA) ? (this.consumeCodePoint(), { type: 22, value: A.value }) : (this.consumeBadUrlRemnants(), Ri);
      }
      for (; ; ) {
        var i = this.consumeCodePoint();
        if (i === it || i === LA)
          return { type: 22, value: me.apply(void 0, e) };
        if (Hi(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === it || this.peekCodePoint(0) === LA ? (this.consumeCodePoint(), { type: 22, value: me.apply(void 0, e) }) : (this.consumeBadUrlRemnants(), Ri);
        if (i === yi || i === Fi || i === Qi || Md(i))
          return this.consumeBadUrlRemnants(), Ri;
        if (i === PA)
          if (Ut(i, this.peekCodePoint(0)))
            e.push(this.consumeEscapedCodePoint());
          else
            return this.consumeBadUrlRemnants(), Ri;
        else
          e.push(i);
      }
    }, r.prototype.consumeWhiteSpace = function() {
      for (; Hi(this.peekCodePoint(0)); )
        this.consumeCodePoint();
    }, r.prototype.consumeBadUrlRemnants = function() {
      for (; ; ) {
        var e = this.consumeCodePoint();
        if (e === LA || e === it)
          return;
        Ut(e, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
      }
    }, r.prototype.consumeStringSlice = function(e) {
      for (var t = 5e4, A = ""; e > 0; ) {
        var i = Math.min(t, e);
        A += me.apply(void 0, this._value.splice(0, i)), e -= i;
      }
      return this._value.shift(), A;
    }, r.prototype.consumeStringToken = function(e) {
      var t = "", A = 0;
      do {
        var i = this._value[A];
        if (i === it || i === void 0 || i === e)
          return t += this.consumeStringSlice(A), { type: 0, value: t };
        if (i === zi)
          return this._value.splice(0, A), Xd;
        if (i === PA) {
          var s = this._value[A + 1];
          s !== it && s !== void 0 && (s === zi ? (t += this.consumeStringSlice(A), A = -1, this._value.shift()) : Ut(i, s) && (t += this.consumeStringSlice(A), t += me(this.consumeEscapedCodePoint()), A = -1));
        }
        A++;
      } while (!0);
    }, r.prototype.consumeNumber = function() {
      var e = [], t = ei, A = this.peekCodePoint(0);
      for ((A === jt || A === Ke) && e.push(this.consumeCodePoint()); Me(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      A = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (A === ZA && Me(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = Sn; Me(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      A = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var s = this.peekCodePoint(2);
      if ((A === ra || A === ia) && ((i === jt || i === Ke) && Me(s) || Me(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = Sn; Me(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      return [Sd(e), t];
    }, r.prototype.consumeNumericToken = function() {
      var e = this.consumeNumber(), t = e[0], A = e[1], i = this.peekCodePoint(0), s = this.peekCodePoint(1), n = this.peekCodePoint(2);
      if (xi(i, s, n)) {
        var o = this.consumeName();
        return { type: 15, number: t, flags: A, unit: o };
      }
      return i === Ad ? (this.consumeCodePoint(), { type: 16, number: t, flags: A }) : { type: 17, number: t, flags: A };
    }, r.prototype.consumeEscapedCodePoint = function() {
      var e = this.consumeCodePoint();
      if (rA(e)) {
        for (var t = me(e); rA(this.peekCodePoint(0)) && t.length < 6; )
          t += me(this.consumeCodePoint());
        Hi(this.peekCodePoint(0)) && this.consumeCodePoint();
        var A = parseInt(t, 16);
        return A === 0 || xd(A) || A > 1114111 ? _n : A;
      }
      return e === it ? _n : e;
    }, r.prototype.consumeName = function() {
      for (var e = ""; ; ) {
        var t = this.consumeCodePoint();
        if (On(t))
          e += me(t);
        else if (Ut(t, this.peekCodePoint(0)))
          e += me(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), e;
      }
    }, r;
  }()
), aa = (
  /** @class */
  function() {
    function r(e) {
      this._tokens = e;
    }
    return r.create = function(e) {
      var t = new oa();
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
        if (A.type === 32 || Af(A, e))
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
      return typeof e > "u" ? kr : e;
    }, r.prototype.reconsumeToken = function(e) {
      this._tokens.unshift(e);
    }, r;
  }()
), ti = function(r) {
  return r.type === 15;
}, bA = function(r) {
  return r.type === 17;
}, oe = function(r) {
  return r.type === 20;
}, tf = function(r) {
  return r.type === 0;
}, _r = function(r, e) {
  return oe(r) && r.value === e;
}, la = function(r) {
  return r.type !== 31;
}, wA = function(r) {
  return r.type !== 31 && r.type !== 4;
}, st = function(r) {
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
}, Af = function(r, e) {
  return e === 11 && r.type === 12 || e === 28 && r.type === 29 ? !0 : e === 2 && r.type === 3;
}, Ot = function(r) {
  return r.type === 17 || r.type === 15;
}, be = function(r) {
  return r.type === 16 || Ot(r);
}, ha = function(r) {
  return r.length > 1 ? [r[0], r[1]] : [r[0]];
}, Qe = {
  type: 17,
  number: 0,
  flags: ei
}, Yr = {
  type: 16,
  number: 50,
  flags: ei
}, St = {
  type: 16,
  number: 100,
  flags: ei
}, kA = function(r, e, t) {
  var A = r[0], i = r[1];
  return [ue(A, e), ue(typeof i < "u" ? i : A, t)];
}, ue = function(r, e) {
  if (r.type === 16)
    return r.number / 100 * e;
  if (ti(r))
    switch (r.unit) {
      case "rem":
      case "em":
        return 16 * r.number;
      case "px":
      default:
        return r.number;
    }
  return r.number;
}, ua = "deg", ca = "grad", da = "rad", fa = "turn", rs = {
  name: "angle",
  parse: function(r, e) {
    if (e.type === 15)
      switch (e.unit) {
        case ua:
          return Math.PI * e.number / 180;
        case ca:
          return Math.PI / 200 * e.number;
        case da:
          return e.number;
        case fa:
          return Math.PI * 2 * e.number;
      }
    throw new Error("Unsupported angle type");
  }
}, ga = function(r) {
  return r.type === 15 && (r.unit === ua || r.unit === ca || r.unit === da || r.unit === fa);
}, pa = function(r) {
  var e = r.filter(oe).map(function(t) {
    return t.value;
  }).join(" ");
  switch (e) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [Qe, Qe];
    case "to top":
    case "bottom":
      return Je(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [Qe, St];
    case "to right":
    case "left":
      return Je(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [St, St];
    case "to bottom":
    case "top":
      return Je(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [St, Qe];
    case "to left":
    case "right":
      return Je(270);
  }
  return 0;
}, Je = function(r) {
  return Math.PI * r / 180;
}, kt = {
  name: "color",
  parse: function(r, e) {
    if (e.type === 18) {
      var t = sf[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported color function "' + e.name + '"');
      return t(r, e.values);
    }
    if (e.type === 5) {
      if (e.value.length === 3) {
        var A = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3);
        return Dt(parseInt(A + A, 16), parseInt(i + i, 16), parseInt(s + s, 16), 1);
      }
      if (e.value.length === 4) {
        var A = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3), n = e.value.substring(3, 4);
        return Dt(parseInt(A + A, 16), parseInt(i + i, 16), parseInt(s + s, 16), parseInt(n + n, 16) / 255);
      }
      if (e.value.length === 6) {
        var A = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6);
        return Dt(parseInt(A, 16), parseInt(i, 16), parseInt(s, 16), 1);
      }
      if (e.value.length === 8) {
        var A = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6), n = e.value.substring(6, 8);
        return Dt(parseInt(A, 16), parseInt(i, 16), parseInt(s, 16), parseInt(n, 16) / 255);
      }
    }
    if (e.type === 20) {
      var o = mt[e.value.toUpperCase()];
      if (typeof o < "u")
        return o;
    }
    return mt.TRANSPARENT;
  }
}, _t = function(r) {
  return (255 & r) === 0;
}, ye = function(r) {
  var e = 255 & r, t = 255 & r >> 8, A = 255 & r >> 16, i = 255 & r >> 24;
  return e < 255 ? "rgba(" + i + "," + A + "," + t + "," + e / 255 + ")" : "rgb(" + i + "," + A + "," + t + ")";
}, Dt = function(r, e, t, A) {
  return (r << 24 | e << 16 | t << 8 | Math.round(A * 255) << 0) >>> 0;
}, Pn = function(r, e) {
  if (r.type === 17)
    return r.number;
  if (r.type === 16) {
    var t = e === 3 ? 1 : 255;
    return e === 3 ? r.number / 100 * t : Math.round(r.number / 100 * t);
  }
  return 0;
}, Kn = function(r, e) {
  var t = e.filter(wA);
  if (t.length === 3) {
    var A = t.map(Pn), i = A[0], s = A[1], n = A[2];
    return Dt(i, s, n, 1);
  }
  if (t.length === 4) {
    var o = t.map(Pn), i = o[0], s = o[1], n = o[2], a = o[3];
    return Dt(i, s, n, a);
  }
  return 0;
};
function ks(r, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - r) * t * 6 + r : t < 1 / 2 ? e : t < 2 / 3 ? (e - r) * 6 * (2 / 3 - t) + r : r;
}
var Vn = function(r, e) {
  var t = e.filter(wA), A = t[0], i = t[1], s = t[2], n = t[3], o = (A.type === 17 ? Je(A.number) : rs.parse(r, A)) / (Math.PI * 2), a = be(i) ? i.number / 100 : 0, l = be(s) ? s.number / 100 : 0, h = typeof n < "u" && be(n) ? ue(n, 1) : 1;
  if (a === 0)
    return Dt(l * 255, l * 255, l * 255, 1);
  var u = l <= 0.5 ? l * (a + 1) : l + a - l * a, c = l * 2 - u, g = ks(c, u, o + 1 / 3), w = ks(c, u, o), B = ks(c, u, o - 1 / 3);
  return Dt(g * 255, w * 255, B * 255, h);
}, sf = {
  hsl: Vn,
  hsla: Vn,
  rgb: Kn,
  rgba: Kn
}, KA = function(r, e) {
  return kt.parse(r, aa.create(e).parseComponentValue());
}, mt = {
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
}, rf = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.map(function(t) {
      if (oe(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, nf = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, ns = function(r, e) {
  var t = kt.parse(r, e[0]), A = e[1];
  return A && be(A) ? { color: t, stop: A } : { color: t, stop: null };
}, Nn = function(r, e) {
  var t = r[0], A = r[r.length - 1];
  t.stop === null && (t.stop = Qe), A.stop === null && (A.stop = St);
  for (var i = [], s = 0, n = 0; n < r.length; n++) {
    var o = r[n].stop;
    if (o !== null) {
      var a = ue(o, e);
      a > s ? i.push(a) : i.push(s), s = a;
    } else
      i.push(null);
  }
  for (var l = null, n = 0; n < i.length; n++) {
    var h = i[n];
    if (h === null)
      l === null && (l = n);
    else if (l !== null) {
      for (var u = n - l, c = i[l - 1], g = (h - c) / (u + 1), w = 1; w <= u; w++)
        i[l + w - 1] = g * w;
      l = null;
    }
  }
  return r.map(function(B, v) {
    var b = B.color;
    return { color: b, stop: Math.max(Math.min(1, i[v] / e), 0) };
  });
}, of = function(r, e, t) {
  var A = e / 2, i = t / 2, s = ue(r[0], e) - A, n = i - ue(r[1], t);
  return (Math.atan2(n, s) + Math.PI * 2) % (Math.PI * 2);
}, af = function(r, e, t) {
  var A = typeof r == "number" ? r : of(r, e, t), i = Math.abs(e * Math.sin(A)) + Math.abs(t * Math.cos(A)), s = e / 2, n = t / 2, o = i / 2, a = Math.sin(A - Math.PI / 2) * o, l = Math.cos(A - Math.PI / 2) * o;
  return [i, s - l, s + l, n - a, n + a];
}, Ze = function(r, e) {
  return Math.sqrt(r * r + e * e);
}, zn = function(r, e, t, A, i) {
  var s = [
    [0, 0],
    [0, e],
    [r, 0],
    [r, e]
  ];
  return s.reduce(function(n, o) {
    var a = o[0], l = o[1], h = Ze(t - a, A - l);
    return (i ? h < n.optimumDistance : h > n.optimumDistance) ? {
      optimumCorner: o,
      optimumDistance: h
    } : n;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, lf = function(r, e, t, A, i) {
  var s = 0, n = 0;
  switch (r.size) {
    case 0:
      r.shape === 0 ? s = n = Math.min(Math.abs(e), Math.abs(e - A), Math.abs(t), Math.abs(t - i)) : r.shape === 1 && (s = Math.min(Math.abs(e), Math.abs(e - A)), n = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (r.shape === 0)
        s = n = Math.min(Ze(e, t), Ze(e, t - i), Ze(e - A, t), Ze(e - A, t - i));
      else if (r.shape === 1) {
        var o = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - A)), a = zn(A, i, e, t, !0), l = a[0], h = a[1];
        s = Ze(l - e, (h - t) / o), n = o * s;
      }
      break;
    case 1:
      r.shape === 0 ? s = n = Math.max(Math.abs(e), Math.abs(e - A), Math.abs(t), Math.abs(t - i)) : r.shape === 1 && (s = Math.max(Math.abs(e), Math.abs(e - A)), n = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (r.shape === 0)
        s = n = Math.max(Ze(e, t), Ze(e, t - i), Ze(e - A, t), Ze(e - A, t - i));
      else if (r.shape === 1) {
        var o = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - A)), u = zn(A, i, e, t, !1), l = u[0], h = u[1];
        s = Ze(l - e, (h - t) / o), n = o * s;
      }
      break;
  }
  return Array.isArray(r.size) && (s = ue(r.size[0], A), n = r.size.length === 2 ? ue(r.size[1], i) : s), [s, n];
}, hf = function(r, e) {
  var t = Je(180), A = [];
  return st(e).forEach(function(i, s) {
    if (s === 0) {
      var n = i[0];
      if (n.type === 20 && n.value === "to") {
        t = pa(i);
        return;
      } else if (ga(n)) {
        t = rs.parse(r, n);
        return;
      }
    }
    var o = ns(r, i);
    A.push(o);
  }), {
    angle: t,
    stops: A,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, Ti = function(r, e) {
  var t = Je(180), A = [];
  return st(e).forEach(function(i, s) {
    if (s === 0) {
      var n = i[0];
      if (n.type === 20 && ["top", "left", "right", "bottom"].indexOf(n.value) !== -1) {
        t = pa(i);
        return;
      } else if (ga(n)) {
        t = (rs.parse(r, n) + Je(270)) % Je(360);
        return;
      }
    }
    var o = ns(r, i);
    A.push(o);
  }), {
    angle: t,
    stops: A,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, uf = function(r, e) {
  var t = Je(180), A = [], i = 1, s = 0, n = 3, o = [];
  return st(e).forEach(function(a, l) {
    var h = a[0];
    if (l === 0) {
      if (oe(h) && h.value === "linear") {
        i = 1;
        return;
      } else if (oe(h) && h.value === "radial") {
        i = 2;
        return;
      }
    }
    if (h.type === 18) {
      if (h.name === "from") {
        var u = kt.parse(r, h.values[0]);
        A.push({ stop: Qe, color: u });
      } else if (h.name === "to") {
        var u = kt.parse(r, h.values[0]);
        A.push({ stop: St, color: u });
      } else if (h.name === "color-stop") {
        var c = h.values.filter(wA);
        if (c.length === 2) {
          var u = kt.parse(r, c[1]), g = c[0];
          bA(g) && A.push({
            stop: { type: 16, number: g.number * 100, flags: g.flags },
            color: u
          });
        }
      }
    }
  }), i === 1 ? {
    angle: (t + Je(180)) % Je(360),
    stops: A,
    type: i
  } : { size: n, shape: s, stops: A, position: o, type: i };
}, ma = "closest-side", wa = "farthest-side", ba = "closest-corner", Ba = "farthest-corner", Ca = "circle", va = "ellipse", Ea = "cover", ya = "contain", cf = function(r, e) {
  var t = 0, A = 3, i = [], s = [];
  return st(e).forEach(function(n, o) {
    var a = !0;
    if (o === 0) {
      var l = !1;
      a = n.reduce(function(u, c) {
        if (l)
          if (oe(c))
            switch (c.value) {
              case "center":
                return s.push(Yr), u;
              case "top":
              case "left":
                return s.push(Qe), u;
              case "right":
              case "bottom":
                return s.push(St), u;
            }
          else (be(c) || Ot(c)) && s.push(c);
        else if (oe(c))
          switch (c.value) {
            case Ca:
              return t = 0, !1;
            case va:
              return t = 1, !1;
            case "at":
              return l = !0, !1;
            case ma:
              return A = 0, !1;
            case Ea:
            case wa:
              return A = 1, !1;
            case ya:
            case ba:
              return A = 2, !1;
            case Ba:
              return A = 3, !1;
          }
        else if (Ot(c) || be(c))
          return Array.isArray(A) || (A = []), A.push(c), !1;
        return u;
      }, a);
    }
    if (a) {
      var h = ns(r, n);
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
}, Li = function(r, e) {
  var t = 0, A = 3, i = [], s = [];
  return st(e).forEach(function(n, o) {
    var a = !0;
    if (o === 0 ? a = n.reduce(function(h, u) {
      if (oe(u))
        switch (u.value) {
          case "center":
            return s.push(Yr), !1;
          case "top":
          case "left":
            return s.push(Qe), !1;
          case "right":
          case "bottom":
            return s.push(St), !1;
        }
      else if (be(u) || Ot(u))
        return s.push(u), !1;
      return h;
    }, a) : o === 1 && (a = n.reduce(function(h, u) {
      if (oe(u))
        switch (u.value) {
          case Ca:
            return t = 0, !1;
          case va:
            return t = 1, !1;
          case ya:
          case ma:
            return A = 0, !1;
          case wa:
            return A = 1, !1;
          case ba:
            return A = 2, !1;
          case Ea:
          case Ba:
            return A = 3, !1;
        }
      else if (Ot(u) || be(u))
        return Array.isArray(A) || (A = []), A.push(u), !1;
      return h;
    }, a)), a) {
      var l = ns(r, n);
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
}, df = function(r) {
  return r.type === 1;
}, ff = function(r) {
  return r.type === 2;
}, Zr = {
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
      var A = Fa[e.name];
      if (typeof A > "u")
        throw new Error('Attempting to parse an unsupported image function "' + e.name + '"');
      return A(r, e.values);
    }
    throw new Error("Unsupported image type " + e.type);
  }
};
function gf(r) {
  return !(r.type === 20 && r.value === "none") && (r.type !== 18 || !!Fa[r.name]);
}
var Fa = {
  "linear-gradient": hf,
  "-moz-linear-gradient": Ti,
  "-ms-linear-gradient": Ti,
  "-o-linear-gradient": Ti,
  "-webkit-linear-gradient": Ti,
  "radial-gradient": cf,
  "-moz-radial-gradient": Li,
  "-ms-radial-gradient": Li,
  "-o-radial-gradient": Li,
  "-webkit-radial-gradient": Li,
  "-webkit-gradient": uf
}, pf = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e.filter(function(A) {
      return wA(A) && gf(A);
    }).map(function(A) {
      return Zr.parse(r, A);
    });
  }
}, mf = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.map(function(t) {
      if (oe(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, wf = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    return st(e).map(function(t) {
      return t.filter(be);
    }).map(ha);
  }
}, bf = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return st(e).map(function(t) {
      return t.filter(oe).map(function(A) {
        return A.value;
      }).join(" ");
    }).map(Bf);
  }
}, Bf = function(r) {
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
}, mA;
(function(r) {
  r.AUTO = "auto", r.CONTAIN = "contain", r.COVER = "cover";
})(mA || (mA = {}));
var Cf = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return st(e).map(function(t) {
      return t.filter(vf);
    });
  }
}, vf = function(r) {
  return oe(r) || be(r);
}, os = function(r) {
  return {
    name: "border-" + r + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, Ef = os("top"), yf = os("right"), Ff = os("bottom"), Qf = os("left"), as = function(r) {
  return {
    name: "border-radius-" + r,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(e, t) {
      return ha(t.filter(be));
    }
  };
}, Uf = as("top-left"), Hf = as("top-right"), xf = as("bottom-right"), Rf = as("bottom-left"), ls = function(r) {
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
}, Tf = ls("top"), Lf = ls("right"), If = ls("bottom"), Mf = ls("left"), hs = function(r) {
  return {
    name: "border-" + r + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(e, t) {
      return ti(t) ? t.number : 0;
    }
  };
}, Sf = hs("top"), Df = hs("right"), kf = hs("bottom"), _f = hs("left"), Of = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Pf = {
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
}, Kf = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.filter(oe).reduce(
      function(t, A) {
        return t | Vf(A.value);
      },
      0
      /* NONE */
    );
  }
}, Vf = function(r) {
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
}, Nf = {
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
}, zf = {
  name: "letter-spacing",
  initialValue: "0",
  prefix: !1,
  type: 0,
  parse: function(r, e) {
    return e.type === 20 && e.value === "normal" ? 0 : e.type === 17 || e.type === 15 ? e.number : 0;
  }
}, Wi;
(function(r) {
  r.NORMAL = "normal", r.STRICT = "strict";
})(Wi || (Wi = {}));
var Gf = {
  name: "line-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "strict":
        return Wi.STRICT;
      case "normal":
      default:
        return Wi.NORMAL;
    }
  }
}, Wf = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, Gn = function(r, e) {
  return oe(r) && r.value === "normal" ? 1.2 * e : r.type === 17 ? e * r.number : be(r) ? ue(r, e) : e;
}, Xf = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(r, e) {
    return e.type === 20 && e.value === "none" ? null : Zr.parse(r, e);
  }
}, Jf = {
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
}, Or = {
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
}, us = function(r) {
  return {
    name: "margin-" + r,
    initialValue: "0",
    prefix: !1,
    type: 4
    /* TOKEN_VALUE */
  };
}, jf = us("top"), Yf = us("right"), Zf = us("bottom"), $f = us("left"), qf = {
  name: "overflow",
  initialValue: "visible",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.filter(oe).map(function(t) {
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
}, eg = {
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
}, cs = function(r) {
  return {
    name: "padding-" + r,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, tg = cs("top"), Ag = cs("right"), ig = cs("bottom"), sg = cs("left"), rg = {
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
}, ng = {
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
}, og = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    return e.length === 1 && _r(e[0], "none") ? [] : st(e).map(function(t) {
      for (var A = {
        color: mt.TRANSPARENT,
        offsetX: Qe,
        offsetY: Qe,
        blur: Qe
      }, i = 0, s = 0; s < t.length; s++) {
        var n = t[s];
        Ot(n) ? (i === 0 ? A.offsetX = n : i === 1 ? A.offsetY = n : A.blur = n, i++) : A.color = kt.parse(r, n);
      }
      return A;
    });
  }
}, ag = {
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
}, lg = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(r, e) {
    if (e.type === 20 && e.value === "none")
      return null;
    if (e.type === 18) {
      var t = cg[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + e.name + '"');
      return t(e.values);
    }
    return null;
  }
}, hg = function(r) {
  var e = r.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return e.length === 6 ? e : null;
}, ug = function(r) {
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
}, cg = {
  matrix: hg,
  matrix3d: ug
}, Wn = {
  type: 16,
  number: 50,
  flags: ei
}, dg = [Wn, Wn], fg = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(r, e) {
    var t = e.filter(be);
    return t.length !== 2 ? dg : [t[0], t[1]];
  }
}, gg = {
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
}, VA;
(function(r) {
  r.NORMAL = "normal", r.BREAK_ALL = "break-all", r.KEEP_ALL = "keep-all";
})(VA || (VA = {}));
var pg = {
  name: "word-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(r, e) {
    switch (e) {
      case "break-all":
        return VA.BREAK_ALL;
      case "keep-all":
        return VA.KEEP_ALL;
      case "normal":
      default:
        return VA.NORMAL;
    }
  }
}, mg = {
  name: "z-index",
  initialValue: "auto",
  prefix: !1,
  type: 0,
  parse: function(r, e) {
    if (e.type === 20)
      return { auto: !0, order: 0 };
    if (bA(e))
      return { auto: !1, order: e.number };
    throw new Error("Invalid z-index number parsed");
  }
}, Qa = {
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
}, wg = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(r, e) {
    return bA(e) ? e.number : 1;
  }
}, bg = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Bg = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.filter(oe).map(function(t) {
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
}, Cg = {
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
}, vg = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, Eg = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(r, e) {
    if (bA(e))
      return e.number;
    if (oe(e))
      switch (e.value) {
        case "bold":
          return 700;
        case "normal":
        default:
          return 400;
      }
    return 400;
  }
}, yg = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    return e.filter(oe).map(function(t) {
      return t.value;
    });
  }
}, Fg = {
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
}, ve = function(r, e) {
  return (r & e) !== 0;
}, Qg = {
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
}, Ug = {
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
    for (var A = [], i = e.filter(la), s = 0; s < i.length; s++) {
      var n = i[s], o = i[s + 1];
      if (n.type === 20) {
        var a = o && bA(o) ? o.number : 1;
        A.push({ counter: n.value, increment: a });
      }
    }
    return A;
  }
}, Hg = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(r, e) {
    if (e.length === 0)
      return [];
    for (var t = [], A = e.filter(la), i = 0; i < A.length; i++) {
      var s = A[i], n = A[i + 1];
      if (oe(s) && s.value !== "none") {
        var o = n && bA(n) ? n.number : 0;
        t.push({ counter: s.value, reset: o });
      }
    }
    return t;
  }
}, xg = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(r, e) {
    return e.filter(ti).map(function(t) {
      return Qa.parse(r, t);
    });
  }
}, Rg = {
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
    var A = [], i = e.filter(tf);
    if (i.length % 2 !== 0)
      return null;
    for (var s = 0; s < i.length; s += 2) {
      var n = i[s].value, o = i[s + 1].value;
      A.push({ open: n, close: o });
    }
    return A;
  }
}, Xn = function(r, e, t) {
  if (!r)
    return "";
  var A = r[Math.min(e, r.length - 1)];
  return A ? t ? A.open : A.close : "";
}, Tg = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(r, e) {
    return e.length === 1 && _r(e[0], "none") ? [] : st(e).map(function(t) {
      for (var A = {
        color: 255,
        offsetX: Qe,
        offsetY: Qe,
        blur: Qe,
        spread: Qe,
        inset: !1
      }, i = 0, s = 0; s < t.length; s++) {
        var n = t[s];
        _r(n, "inset") ? A.inset = !0 : Ot(n) ? (i === 0 ? A.offsetX = n : i === 1 ? A.offsetY = n : i === 2 ? A.blur = n : A.spread = n, i++) : A.color = kt.parse(r, n);
      }
      return A;
    });
  }
}, Lg = {
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
    return e.filter(oe).forEach(function(i) {
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
}, Ig = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, Mg = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(r, e) {
    return ti(e) ? e.number : 0;
  }
}, Sg = (
  /** @class */
  function() {
    function r(e, t) {
      var A, i;
      this.animationDuration = D(e, xg, t.animationDuration), this.backgroundClip = D(e, rf, t.backgroundClip), this.backgroundColor = D(e, nf, t.backgroundColor), this.backgroundImage = D(e, pf, t.backgroundImage), this.backgroundOrigin = D(e, mf, t.backgroundOrigin), this.backgroundPosition = D(e, wf, t.backgroundPosition), this.backgroundRepeat = D(e, bf, t.backgroundRepeat), this.backgroundSize = D(e, Cf, t.backgroundSize), this.borderTopColor = D(e, Ef, t.borderTopColor), this.borderRightColor = D(e, yf, t.borderRightColor), this.borderBottomColor = D(e, Ff, t.borderBottomColor), this.borderLeftColor = D(e, Qf, t.borderLeftColor), this.borderTopLeftRadius = D(e, Uf, t.borderTopLeftRadius), this.borderTopRightRadius = D(e, Hf, t.borderTopRightRadius), this.borderBottomRightRadius = D(e, xf, t.borderBottomRightRadius), this.borderBottomLeftRadius = D(e, Rf, t.borderBottomLeftRadius), this.borderTopStyle = D(e, Tf, t.borderTopStyle), this.borderRightStyle = D(e, Lf, t.borderRightStyle), this.borderBottomStyle = D(e, If, t.borderBottomStyle), this.borderLeftStyle = D(e, Mf, t.borderLeftStyle), this.borderTopWidth = D(e, Sf, t.borderTopWidth), this.borderRightWidth = D(e, Df, t.borderRightWidth), this.borderBottomWidth = D(e, kf, t.borderBottomWidth), this.borderLeftWidth = D(e, _f, t.borderLeftWidth), this.boxShadow = D(e, Tg, t.boxShadow), this.color = D(e, Of, t.color), this.direction = D(e, Pf, t.direction), this.display = D(e, Kf, t.display), this.float = D(e, Nf, t.cssFloat), this.fontFamily = D(e, Cg, t.fontFamily), this.fontSize = D(e, vg, t.fontSize), this.fontStyle = D(e, Fg, t.fontStyle), this.fontVariant = D(e, yg, t.fontVariant), this.fontWeight = D(e, Eg, t.fontWeight), this.letterSpacing = D(e, zf, t.letterSpacing), this.lineBreak = D(e, Gf, t.lineBreak), this.lineHeight = D(e, Wf, t.lineHeight), this.listStyleImage = D(e, Xf, t.listStyleImage), this.listStylePosition = D(e, Jf, t.listStylePosition), this.listStyleType = D(e, Or, t.listStyleType), this.marginTop = D(e, jf, t.marginTop), this.marginRight = D(e, Yf, t.marginRight), this.marginBottom = D(e, Zf, t.marginBottom), this.marginLeft = D(e, $f, t.marginLeft), this.opacity = D(e, wg, t.opacity);
      var s = D(e, qf, t.overflow);
      this.overflowX = s[0], this.overflowY = s[s.length > 1 ? 1 : 0], this.overflowWrap = D(e, eg, t.overflowWrap), this.paddingTop = D(e, tg, t.paddingTop), this.paddingRight = D(e, Ag, t.paddingRight), this.paddingBottom = D(e, ig, t.paddingBottom), this.paddingLeft = D(e, sg, t.paddingLeft), this.paintOrder = D(e, Lg, t.paintOrder), this.position = D(e, ng, t.position), this.textAlign = D(e, rg, t.textAlign), this.textDecorationColor = D(e, bg, (A = t.textDecorationColor) !== null && A !== void 0 ? A : t.color), this.textDecorationLine = D(e, Bg, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = D(e, og, t.textShadow), this.textTransform = D(e, ag, t.textTransform), this.transform = D(e, lg, t.transform), this.transformOrigin = D(e, fg, t.transformOrigin), this.visibility = D(e, gg, t.visibility), this.webkitTextStrokeColor = D(e, Ig, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = D(e, Mg, t.webkitTextStrokeWidth), this.wordBreak = D(e, pg, t.wordBreak), this.zIndex = D(e, mg, t.zIndex);
    }
    return r.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    }, r.prototype.isTransparent = function() {
      return _t(this.backgroundColor);
    }, r.prototype.isTransformed = function() {
      return this.transform !== null;
    }, r.prototype.isPositioned = function() {
      return this.position !== 0;
    }, r.prototype.isPositionedWithZIndex = function() {
      return this.isPositioned() && !this.zIndex.auto;
    }, r.prototype.isFloating = function() {
      return this.float !== 0;
    }, r.prototype.isInlineLevel = function() {
      return ve(
        this.display,
        4
        /* INLINE */
      ) || ve(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || ve(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || ve(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || ve(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || ve(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    }, r;
  }()
), Dg = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.content = D(e, Qg, t.content), this.quotes = D(e, Rg, t.quotes);
    }
    return r;
  }()
), Jn = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.counterIncrement = D(e, Ug, t.counterIncrement), this.counterReset = D(e, Hg, t.counterReset);
    }
    return r;
  }()
), D = function(r, e, t) {
  var A = new oa(), i = t !== null && typeof t < "u" ? t.toString() : e.initialValue;
  A.write(i);
  var s = new aa(A.read());
  switch (e.type) {
    case 2:
      var n = s.parseComponentValue();
      return e.parse(r, oe(n) ? n.value : e.initialValue);
    case 0:
      return e.parse(r, s.parseComponentValue());
    case 1:
      return e.parse(r, s.parseComponentValues());
    case 4:
      return s.parseComponentValue();
    case 3:
      switch (e.format) {
        case "angle":
          return rs.parse(r, s.parseComponentValue());
        case "color":
          return kt.parse(r, s.parseComponentValue());
        case "image":
          return Zr.parse(r, s.parseComponentValue());
        case "length":
          var o = s.parseComponentValue();
          return Ot(o) ? o : Qe;
        case "length-percentage":
          var a = s.parseComponentValue();
          return be(a) ? a : Qe;
        case "time":
          return Qa.parse(r, s.parseComponentValue());
      }
      break;
  }
}, kg = "data-html2canvas-debug", _g = function(r) {
  var e = r.getAttribute(kg);
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
}, Pr = function(r, e) {
  var t = _g(r);
  return t === 1 || e === t;
}, rt = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      if (this.context = e, this.textNodes = [], this.elements = [], this.flags = 0, Pr(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new Sg(e, window.getComputedStyle(t, null)), Nr(t) && (this.styles.animationDuration.some(function(A) {
        return A > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = is(this.context, t), Pr(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return r;
  }()
), Og = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", jn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", _A = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Ii = 0; Ii < jn.length; Ii++)
  _A[jn.charCodeAt(Ii)] = Ii;
var Pg = function(r) {
  var e = r.length * 0.75, t = r.length, A, i = 0, s, n, o, a;
  r[r.length - 1] === "=" && (e--, r[r.length - 2] === "=" && e--);
  var l = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), h = Array.isArray(l) ? l : new Uint8Array(l);
  for (A = 0; A < t; A += 4)
    s = _A[r.charCodeAt(A)], n = _A[r.charCodeAt(A + 1)], o = _A[r.charCodeAt(A + 2)], a = _A[r.charCodeAt(A + 3)], h[i++] = s << 2 | n >> 4, h[i++] = (n & 15) << 4 | o >> 2, h[i++] = (o & 3) << 6 | a & 63;
  return l;
}, Kg = function(r) {
  for (var e = r.length, t = [], A = 0; A < e; A += 2)
    t.push(r[A + 1] << 8 | r[A]);
  return t;
}, Vg = function(r) {
  for (var e = r.length, t = [], A = 0; A < e; A += 4)
    t.push(r[A + 3] << 24 | r[A + 2] << 16 | r[A + 1] << 8 | r[A]);
  return t;
}, $t = 5, $r = 11, _s = 2, Ng = $r - $t, Ua = 65536 >> $t, zg = 1 << $t, Os = zg - 1, Gg = 1024 >> $t, Wg = Ua + Gg, Xg = Wg, Jg = 32, jg = Xg + Jg, Yg = 65536 >> $r, Zg = 1 << Ng, $g = Zg - 1, Yn = function(r, e, t) {
  return r.slice ? r.slice(e, t) : new Uint16Array(Array.prototype.slice.call(r, e, t));
}, qg = function(r, e, t) {
  return r.slice ? r.slice(e, t) : new Uint32Array(Array.prototype.slice.call(r, e, t));
}, ep = function(r, e) {
  var t = Pg(r), A = Array.isArray(t) ? Vg(t) : new Uint32Array(t), i = Array.isArray(t) ? Kg(t) : new Uint16Array(t), s = 24, n = Yn(i, s / 2, A[4] / 2), o = A[5] === 2 ? Yn(i, (s + A[4]) / 2) : qg(A, Math.ceil((s + A[4]) / 4));
  return new tp(A[0], A[1], A[2], A[3], n, o);
}, tp = (
  /** @class */
  function() {
    function r(e, t, A, i, s, n) {
      this.initialValue = e, this.errorValue = t, this.highStart = A, this.highValueIndex = i, this.index = s, this.data = n;
    }
    return r.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> $t], t = (t << _s) + (e & Os), this.data[t];
        if (e <= 65535)
          return t = this.index[Ua + (e - 55296 >> $t)], t = (t << _s) + (e & Os), this.data[t];
        if (e < this.highStart)
          return t = jg - Yg + (e >> $r), t = this.index[t], t += e >> $t & $g, t = this.index[t], t = (t << _s) + (e & Os), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, r;
  }()
), Zn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ap = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Mi = 0; Mi < Zn.length; Mi++)
  Ap[Zn.charCodeAt(Mi)] = Mi;
var ip = 1, Ps = 2, Ks = 3, $n = 4, qn = 5, sp = 7, eo = 8, Vs = 9, Ns = 10, to = 11, Ao = 12, io = 13, so = 14, zs = 15, rp = function(r) {
  for (var e = [], t = 0, A = r.length; t < A; ) {
    var i = r.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < A) {
      var s = r.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, np = function() {
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
}, op = ep(Og), We = "×", Gs = "÷", ap = function(r) {
  return op.get(r);
}, lp = function(r, e, t) {
  var A = t - 2, i = e[A], s = e[t - 1], n = e[t];
  if (s === Ps && n === Ks)
    return We;
  if (s === Ps || s === Ks || s === $n || n === Ps || n === Ks || n === $n)
    return Gs;
  if (s === eo && [eo, Vs, to, Ao].indexOf(n) !== -1 || (s === to || s === Vs) && (n === Vs || n === Ns) || (s === Ao || s === Ns) && n === Ns || n === io || n === qn || n === sp || s === ip)
    return We;
  if (s === io && n === so) {
    for (; i === qn; )
      i = e[--A];
    if (i === so)
      return We;
  }
  if (s === zs && n === zs) {
    for (var o = 0; i === zs; )
      o++, i = e[--A];
    if (o % 2 === 0)
      return We;
  }
  return Gs;
}, hp = function(r) {
  var e = rp(r), t = e.length, A = 0, i = 0, s = e.map(ap);
  return {
    next: function() {
      if (A >= t)
        return { done: !0, value: null };
      for (var n = We; A < t && (n = lp(e, s, ++A)) === We; )
        ;
      if (n !== We || A === t) {
        var o = np.apply(null, e.slice(i, A));
        return i = A, { value: o, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, up = function(r) {
  for (var e = hp(r), t = [], A; !(A = e.next()).done; )
    A.value && t.push(A.value.slice());
  return t;
}, cp = function(r) {
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
}, dp = function(r) {
  var e = r.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", r.body.appendChild(e);
  var t = r.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var A = e.firstChild, i = ss(A.data).map(function(a) {
    return me(a);
  }), s = 0, n = {}, o = i.every(function(a, l) {
    t.setStart(A, s), t.setEnd(A, s + a.length);
    var h = t.getBoundingClientRect();
    s += a.length;
    var u = h.x > n.x || h.y > n.y;
    return n = h, l === 0 ? !0 : u;
  });
  return r.body.removeChild(e), o;
}, fp = function() {
  return typeof new Image().crossOrigin < "u";
}, gp = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, pp = function(r) {
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
}, ro = function(r) {
  return r[0] === 0 && r[1] === 255 && r[2] === 0 && r[3] === 255;
}, mp = function(r) {
  var e = r.createElement("canvas"), t = 100;
  e.width = t, e.height = t;
  var A = e.getContext("2d");
  if (!A)
    return Promise.reject(!1);
  A.fillStyle = "rgb(0, 255, 0)", A.fillRect(0, 0, t, t);
  var i = new Image(), s = e.toDataURL();
  i.src = s;
  var n = Kr(t, t, 0, 0, i);
  return A.fillStyle = "red", A.fillRect(0, 0, t, t), no(n).then(function(o) {
    A.drawImage(o, 0, 0);
    var a = A.getImageData(0, 0, t, t).data;
    A.fillStyle = "red", A.fillRect(0, 0, t, t);
    var l = r.createElement("div");
    return l.style.backgroundImage = "url(" + s + ")", l.style.height = t + "px", ro(a) ? no(Kr(t, t, 0, 0, l)) : Promise.reject(!1);
  }).then(function(o) {
    return A.drawImage(o, 0, 0), ro(A.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Kr = function(r, e, t, A, i) {
  var s = "http://www.w3.org/2000/svg", n = document.createElementNS(s, "svg"), o = document.createElementNS(s, "foreignObject");
  return n.setAttributeNS(null, "width", r.toString()), n.setAttributeNS(null, "height", e.toString()), o.setAttributeNS(null, "width", "100%"), o.setAttributeNS(null, "height", "100%"), o.setAttributeNS(null, "x", t.toString()), o.setAttributeNS(null, "y", A.toString()), o.setAttributeNS(null, "externalResourcesRequired", "true"), n.appendChild(o), o.appendChild(i), n;
}, no = function(r) {
  return new Promise(function(e, t) {
    var A = new Image();
    A.onload = function() {
      return e(A);
    }, A.onerror = t, A.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(r));
  });
}, Fe = {
  get SUPPORT_RANGE_BOUNDS() {
    var r = cp(document);
    return Object.defineProperty(Fe, "SUPPORT_RANGE_BOUNDS", { value: r }), r;
  },
  get SUPPORT_WORD_BREAKING() {
    var r = Fe.SUPPORT_RANGE_BOUNDS && dp(document);
    return Object.defineProperty(Fe, "SUPPORT_WORD_BREAKING", { value: r }), r;
  },
  get SUPPORT_SVG_DRAWING() {
    var r = pp(document);
    return Object.defineProperty(Fe, "SUPPORT_SVG_DRAWING", { value: r }), r;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var r = typeof Array.from == "function" && typeof window.fetch == "function" ? mp(document) : Promise.resolve(!1);
    return Object.defineProperty(Fe, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: r }), r;
  },
  get SUPPORT_CORS_IMAGES() {
    var r = fp();
    return Object.defineProperty(Fe, "SUPPORT_CORS_IMAGES", { value: r }), r;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var r = gp();
    return Object.defineProperty(Fe, "SUPPORT_RESPONSE_TYPE", { value: r }), r;
  },
  get SUPPORT_CORS_XHR() {
    var r = "withCredentials" in new XMLHttpRequest();
    return Object.defineProperty(Fe, "SUPPORT_CORS_XHR", { value: r }), r;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var r = !!(typeof Intl < "u" && Intl.Segmenter);
    return Object.defineProperty(Fe, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: r }), r;
  }
}, NA = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.text = e, this.bounds = t;
    }
    return r;
  }()
), wp = function(r, e, t, A) {
  var i = Cp(e, t), s = [], n = 0;
  return i.forEach(function(o) {
    if (t.textDecorationLine.length || o.trim().length > 0)
      if (Fe.SUPPORT_RANGE_BOUNDS) {
        var a = oo(A, n, o.length).getClientRects();
        if (a.length > 1) {
          var l = qr(o), h = 0;
          l.forEach(function(c) {
            s.push(new NA(c, wt.fromDOMRectList(r, oo(A, h + n, c.length).getClientRects()))), h += c.length;
          });
        } else
          s.push(new NA(o, wt.fromDOMRectList(r, a)));
      } else {
        var u = A.splitText(o.length);
        s.push(new NA(o, bp(r, A))), A = u;
      }
    else Fe.SUPPORT_RANGE_BOUNDS || (A = A.splitText(o.length));
    n += o.length;
  }), s;
}, bp = function(r, e) {
  var t = e.ownerDocument;
  if (t) {
    var A = t.createElement("html2canvaswrapper");
    A.appendChild(e.cloneNode(!0));
    var i = e.parentNode;
    if (i) {
      i.replaceChild(A, e);
      var s = is(r, A);
      return A.firstChild && i.replaceChild(A.firstChild, A), s;
    }
  }
  return wt.EMPTY;
}, oo = function(r, e, t) {
  var A = r.ownerDocument;
  if (!A)
    throw new Error("Node has no owner document");
  var i = A.createRange();
  return i.setStart(r, e), i.setEnd(r, e + t), i;
}, qr = function(r) {
  if (Fe.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var e = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(e.segment(r)).map(function(t) {
      return t.segment;
    });
  }
  return up(r);
}, Bp = function(r, e) {
  if (Fe.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(r)).map(function(A) {
      return A.segment;
    });
  }
  return Ep(r, e);
}, Cp = function(r, e) {
  return e.letterSpacing !== 0 ? qr(r) : Bp(r, e);
}, vp = [32, 160, 4961, 65792, 65793, 4153, 4241], Ep = function(r, e) {
  for (var t = jc(r, {
    lineBreak: e.lineBreak,
    wordBreak: e.overflowWrap === "break-word" ? "break-word" : e.wordBreak
  }), A = [], i, s = function() {
    if (i.value) {
      var n = i.value.slice(), o = ss(n), a = "";
      o.forEach(function(l) {
        vp.indexOf(l) === -1 ? a += me(l) : (a.length && A.push(a), A.push(me(l)), a = "");
      }), a.length && A.push(a);
    }
  }; !(i = t.next()).done; )
    s();
  return A;
}, yp = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t, A) {
      this.text = Fp(t.data, A.textTransform), this.textBounds = wp(e, this.text, A, t);
    }
    return r;
  }()
), Fp = function(r, e) {
  switch (e) {
    case 1:
      return r.toLowerCase();
    case 3:
      return r.replace(Qp, Up);
    case 2:
      return r.toUpperCase();
    default:
      return r;
  }
}, Qp = /(^|\s|:|-|\(|\))([a-z])/g, Up = function(r, e, t) {
  return r.length > 0 ? e + t.toUpperCase() : r;
}, Ha = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.src = A.currentSrc || A.src, i.intrinsicWidth = A.naturalWidth, i.intrinsicHeight = A.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return e;
  }(rt)
), xa = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.canvas = A, i.intrinsicWidth = A.width, i.intrinsicHeight = A.height, i;
    }
    return e;
  }(rt)
), Ra = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this, s = new XMLSerializer(), n = is(t, A);
      return A.setAttribute("width", n.width + "px"), A.setAttribute("height", n.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(A)), i.intrinsicWidth = A.width.baseVal.value, i.intrinsicHeight = A.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return e;
  }(rt)
), Ta = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.value = A.value, i;
    }
    return e;
  }(rt)
), Vr = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.start = A.start, i.reversed = typeof A.reversed == "boolean" && A.reversed === !0, i;
    }
    return e;
  }(rt)
), Hp = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], xp = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], Rp = function(r) {
  return r.width > r.height ? new wt(r.left + (r.width - r.height) / 2, r.top, r.height, r.height) : r.width < r.height ? new wt(r.left, r.top + (r.height - r.width) / 2, r.width, r.width) : r;
}, Tp = function(r) {
  var e = r.type === Lp ? new Array(r.value.length + 1).join("•") : r.value;
  return e.length === 0 ? r.placeholder || "" : e;
}, Xi = "checkbox", Ji = "radio", Lp = "password", ao = 707406591, en = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      switch (i.type = A.type.toLowerCase(), i.checked = A.checked, i.value = Tp(A), (i.type === Xi || i.type === Ji) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = Rp(i.bounds)), i.type) {
        case Xi:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = Hp;
          break;
        case Ji:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = xp;
          break;
      }
      return i;
    }
    return e;
  }(rt)
), La = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this, s = A.options[A.selectedIndex || 0];
      return i.value = s && s.text || "", i;
    }
    return e;
  }(rt)
), Ia = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.value = A.value, i;
    }
    return e;
  }(rt)
), Ma = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      i.src = A.src, i.width = parseInt(A.width, 10) || 0, i.height = parseInt(A.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (A.contentWindow && A.contentWindow.document && A.contentWindow.document.documentElement) {
          i.tree = Da(t, A.contentWindow.document.documentElement);
          var s = A.contentWindow.document.documentElement ? KA(t, getComputedStyle(A.contentWindow.document.documentElement).backgroundColor) : mt.TRANSPARENT, n = A.contentWindow.document.body ? KA(t, getComputedStyle(A.contentWindow.document.body).backgroundColor) : mt.TRANSPARENT;
          i.backgroundColor = _t(s) ? _t(n) ? i.styles.backgroundColor : n : s;
        }
      } catch {
      }
      return i;
    }
    return e;
  }(rt)
), Ip = ["OL", "UL", "MENU"], Vi = function(r, e, t, A) {
  for (var i = e.firstChild, s = void 0; i; i = s)
    if (s = i.nextSibling, ka(i) && i.data.trim().length > 0)
      t.textNodes.push(new yp(r, i, t.styles));
    else if (cA(i))
      if (Ka(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(o) {
          return Vi(r, o, t, A);
        });
      else {
        var n = Sa(r, i);
        n.styles.isVisible() && (Mp(i, n, A) ? n.flags |= 4 : Sp(n.styles) && (n.flags |= 2), Ip.indexOf(i.tagName) !== -1 && (n.flags |= 8), t.elements.push(n), i.slot, i.shadowRoot ? Vi(r, i.shadowRoot, n, A) : !ji(i) && !_a(i) && !Yi(i) && Vi(r, i, n, A));
      }
}, Sa = function(r, e) {
  return zr(e) ? new Ha(r, e) : Oa(e) ? new xa(r, e) : _a(e) ? new Ra(r, e) : Dp(e) ? new Ta(r, e) : kp(e) ? new Vr(r, e) : _p(e) ? new en(r, e) : Yi(e) ? new La(r, e) : ji(e) ? new Ia(r, e) : Pa(e) ? new Ma(r, e) : new rt(r, e);
}, Da = function(r, e) {
  var t = Sa(r, e);
  return t.flags |= 4, Vi(r, e, t, t), t;
}, Mp = function(r, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || tn(r) && t.styles.isTransparent();
}, Sp = function(r) {
  return r.isPositioned() || r.isFloating();
}, ka = function(r) {
  return r.nodeType === Node.TEXT_NODE;
}, cA = function(r) {
  return r.nodeType === Node.ELEMENT_NODE;
}, Nr = function(r) {
  return cA(r) && typeof r.style < "u" && !Ni(r);
}, Ni = function(r) {
  return typeof r.className == "object";
}, Dp = function(r) {
  return r.tagName === "LI";
}, kp = function(r) {
  return r.tagName === "OL";
}, _p = function(r) {
  return r.tagName === "INPUT";
}, Op = function(r) {
  return r.tagName === "HTML";
}, _a = function(r) {
  return r.tagName === "svg";
}, tn = function(r) {
  return r.tagName === "BODY";
}, Oa = function(r) {
  return r.tagName === "CANVAS";
}, lo = function(r) {
  return r.tagName === "VIDEO";
}, zr = function(r) {
  return r.tagName === "IMG";
}, Pa = function(r) {
  return r.tagName === "IFRAME";
}, ho = function(r) {
  return r.tagName === "STYLE";
}, Pp = function(r) {
  return r.tagName === "SCRIPT";
}, ji = function(r) {
  return r.tagName === "TEXTAREA";
}, Yi = function(r) {
  return r.tagName === "SELECT";
}, Ka = function(r) {
  return r.tagName === "SLOT";
}, uo = function(r) {
  return r.tagName.indexOf("-") > 0;
}, Kp = (
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
), co = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, fo = {
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
}, Vp = {
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
}, Np = {
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
}, nA = function(r, e, t, A, i, s) {
  return r < e || r > t ? $A(r, i, s.length > 0) : A.integers.reduce(function(n, o, a) {
    for (; r >= o; )
      r -= o, n += A.values[a];
    return n;
  }, "") + s;
}, Va = function(r, e, t, A) {
  var i = "";
  do
    t || r--, i = A(r) + i, r /= e;
  while (r * e >= e);
  return i;
}, pe = function(r, e, t, A, i) {
  var s = t - e + 1;
  return (r < 0 ? "-" : "") + (Va(Math.abs(r), s, A, function(n) {
    return me(Math.floor(n % s) + e);
  }) + i);
}, zt = function(r, e, t) {
  t === void 0 && (t = ". ");
  var A = e.length;
  return Va(Math.abs(r), A, !1, function(i) {
    return e[Math.floor(i % A)];
  }) + t;
}, lA = 1, Ft = 2, Qt = 4, OA = 8, ft = function(r, e, t, A, i, s) {
  if (r < -9999 || r > 9999)
    return $A(r, 4, i.length > 0);
  var n = Math.abs(r), o = i;
  if (n === 0)
    return e[0] + o;
  for (var a = 0; n > 0 && a <= 4; a++) {
    var l = n % 10;
    l === 0 && ve(s, lA) && o !== "" ? o = e[l] + o : l > 1 || l === 1 && a === 0 || l === 1 && a === 1 && ve(s, Ft) || l === 1 && a === 1 && ve(s, Qt) && r > 100 || l === 1 && a > 1 && ve(s, OA) ? o = e[l] + (a > 0 ? t[a - 1] : "") + o : l === 1 && a > 0 && (o = t[a - 1] + o), n = Math.floor(n / 10);
  }
  return (r < 0 ? A : "") + o;
}, go = "十百千萬", po = "拾佰仟萬", mo = "マイナス", Ws = "마이너스", $A = function(r, e, t) {
  var A = t ? ". " : "", i = t ? "、" : "", s = t ? ", " : "", n = t ? " " : "";
  switch (e) {
    case 0:
      return "•" + n;
    case 1:
      return "◦" + n;
    case 2:
      return "◾" + n;
    case 5:
      var o = pe(r, 48, 57, !0, A);
      return o.length < 4 ? "0" + o : o;
    case 4:
      return zt(r, "〇一二三四五六七八九", i);
    case 6:
      return nA(r, 1, 3999, co, 3, A).toLowerCase();
    case 7:
      return nA(r, 1, 3999, co, 3, A);
    case 8:
      return pe(r, 945, 969, !1, A);
    case 9:
      return pe(r, 97, 122, !1, A);
    case 10:
      return pe(r, 65, 90, !1, A);
    case 11:
      return pe(r, 1632, 1641, !0, A);
    case 12:
    case 49:
      return nA(r, 1, 9999, fo, 3, A);
    case 35:
      return nA(r, 1, 9999, fo, 3, A).toLowerCase();
    case 13:
      return pe(r, 2534, 2543, !0, A);
    case 14:
    case 30:
      return pe(r, 6112, 6121, !0, A);
    case 15:
      return zt(r, "子丑寅卯辰巳午未申酉戌亥", i);
    case 16:
      return zt(r, "甲乙丙丁戊己庚辛壬癸", i);
    case 17:
    case 48:
      return ft(r, "零一二三四五六七八九", go, "負", i, Ft | Qt | OA);
    case 47:
      return ft(r, "零壹貳參肆伍陸柒捌玖", po, "負", i, lA | Ft | Qt | OA);
    case 42:
      return ft(r, "零一二三四五六七八九", go, "负", i, Ft | Qt | OA);
    case 41:
      return ft(r, "零壹贰叁肆伍陆柒捌玖", po, "负", i, lA | Ft | Qt | OA);
    case 26:
      return ft(r, "〇一二三四五六七八九", "十百千万", mo, i, 0);
    case 25:
      return ft(r, "零壱弐参四伍六七八九", "拾百千万", mo, i, lA | Ft | Qt);
    case 31:
      return ft(r, "영일이삼사오육칠팔구", "십백천만", Ws, s, lA | Ft | Qt);
    case 33:
      return ft(r, "零一二三四五六七八九", "十百千萬", Ws, s, 0);
    case 32:
      return ft(r, "零壹貳參四五六七八九", "拾百千", Ws, s, lA | Ft | Qt);
    case 18:
      return pe(r, 2406, 2415, !0, A);
    case 20:
      return nA(r, 1, 19999, Np, 3, A);
    case 21:
      return pe(r, 2790, 2799, !0, A);
    case 22:
      return pe(r, 2662, 2671, !0, A);
    case 22:
      return nA(r, 1, 10999, Vp, 3, A);
    case 23:
      return zt(r, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return zt(r, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return pe(r, 3302, 3311, !0, A);
    case 28:
      return zt(r, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", i);
    case 29:
      return zt(r, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", i);
    case 34:
      return pe(r, 3792, 3801, !0, A);
    case 37:
      return pe(r, 6160, 6169, !0, A);
    case 38:
      return pe(r, 4160, 4169, !0, A);
    case 39:
      return pe(r, 2918, 2927, !0, A);
    case 40:
      return pe(r, 1776, 1785, !0, A);
    case 43:
      return pe(r, 3046, 3055, !0, A);
    case 44:
      return pe(r, 3174, 3183, !0, A);
    case 45:
      return pe(r, 3664, 3673, !0, A);
    case 46:
      return pe(r, 3872, 3881, !0, A);
    case 3:
    default:
      return pe(r, 48, 57, !0, A);
  }
}, Na = "data-html2canvas-ignore", wo = (
  /** @class */
  function() {
    function r(e, t, A) {
      if (this.context = e, this.options = A, this.scrolledElements = [], this.referenceElement = t, this.counters = new Kp(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return r.prototype.toIFrame = function(e, t) {
      var A = this, i = zp(e, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var s = e.defaultView.pageXOffset, n = e.defaultView.pageYOffset, o = i.contentWindow, a = o.document, l = Xp(i).then(function() {
        return De(A, void 0, void 0, function() {
          var h, u;
          return Le(this, function(c) {
            switch (c.label) {
              case 0:
                return this.scrolledElements.forEach(Zp), o && (o.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (o.scrollY !== t.top || o.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(o.scrollX - t.left, o.scrollY - t.top, 0, 0))), h = this.options.onclone, u = this.clonedReferenceElement, typeof u > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : a.fonts && a.fonts.ready ? [4, a.fonts.ready] : [3, 2];
              case 1:
                c.sent(), c.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, Wp(a)] : [3, 4];
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
      return a.open(), a.write(jp(document.doctype) + "<html></html>"), Yp(this.referenceElement.ownerDocument, s, n), a.replaceChild(a.adoptNode(this.documentElement), a.documentElement), a.close(), l;
    }, r.prototype.createElementClone = function(e) {
      if (Pr(
        e,
        2
        /* CLONE */
      ))
        debugger;
      if (Oa(e))
        return this.createCanvasClone(e);
      if (lo(e))
        return this.createVideoClone(e);
      if (ho(e))
        return this.createStyleClone(e);
      var t = e.cloneNode(!1);
      return zr(t) && (zr(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), uo(t) ? this.createCustomElementClone(t) : t;
    }, r.prototype.createCustomElementClone = function(e) {
      var t = document.createElement("html2canvascustomelement");
      return Xs(e.style, t), t;
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
      (!cA(t) || !Pp(t) && !t.hasAttribute(Na) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !cA(t) || !ho(t)) && e.appendChild(this.cloneNode(t, A));
    }, r.prototype.cloneChildNodes = function(e, t, A) {
      for (var i = this, s = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; s; s = s.nextSibling)
        if (cA(s) && Ka(s) && typeof s.assignedNodes == "function") {
          var n = s.assignedNodes();
          n.length && n.forEach(function(o) {
            return i.appendChildNode(t, o, A);
          });
        } else
          this.appendChildNode(t, s, A);
    }, r.prototype.cloneNode = function(e, t) {
      if (ka(e))
        return document.createTextNode(e.data);
      if (!e.ownerDocument)
        return e.cloneNode(!1);
      var A = e.ownerDocument.defaultView;
      if (A && cA(e) && (Nr(e) || Ni(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var s = A.getComputedStyle(e), n = A.getComputedStyle(e, ":before"), o = A.getComputedStyle(e, ":after");
        this.referenceElement === e && Nr(i) && (this.clonedReferenceElement = i), tn(i) && em(i);
        var a = this.counters.parse(new Jn(this.context, s)), l = this.resolvePseudoContent(e, i, n, zA.BEFORE);
        uo(e) && (t = !0), lo(e) || this.cloneChildNodes(e, i, t), l && i.insertBefore(l, i.firstChild);
        var h = this.resolvePseudoContent(e, i, o, zA.AFTER);
        return h && i.appendChild(h), this.counters.pop(a), (s && (this.options.copyStyles || Ni(e)) && !Pa(e) || t) && Xs(s, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (ji(e) || Yi(e)) && (ji(i) || Yi(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, r.prototype.resolvePseudoContent = function(e, t, A, i) {
      var s = this;
      if (A) {
        var n = A.content, o = t.ownerDocument;
        if (!(!o || !n || n === "none" || n === "-moz-alt-content" || A.display === "none")) {
          this.counters.parse(new Jn(this.context, A));
          var a = new Dg(this.context, A), l = o.createElement("html2canvaspseudoelement");
          Xs(A, l), a.content.forEach(function(u) {
            if (u.type === 0)
              l.appendChild(o.createTextNode(u.value));
            else if (u.type === 22) {
              var c = o.createElement("img");
              c.src = u.value, c.style.opacity = "1", l.appendChild(c);
            } else if (u.type === 18) {
              if (u.name === "attr") {
                var g = u.values.filter(oe);
                g.length && l.appendChild(o.createTextNode(e.getAttribute(g[0].value) || ""));
              } else if (u.name === "counter") {
                var w = u.values.filter(wA), B = w[0], v = w[1];
                if (B && oe(B)) {
                  var b = s.counters.getCounterValue(B.value), F = v && oe(v) ? Or.parse(s.context, v.value) : 3;
                  l.appendChild(o.createTextNode($A(b, F, !1)));
                }
              } else if (u.name === "counters") {
                var L = u.values.filter(wA), B = L[0], P = L[1], v = L[2];
                if (B && oe(B)) {
                  var R = s.counters.getCounterValues(B.value), H = v && oe(v) ? Or.parse(s.context, v.value) : 3, Z = P && P.type === 0 ? P.value : "", z = R.map(function(Be) {
                    return $A(Be, H, !1);
                  }).join(Z);
                  l.appendChild(o.createTextNode(z));
                }
              }
            } else if (u.type === 20)
              switch (u.value) {
                case "open-quote":
                  l.appendChild(o.createTextNode(Xn(a.quotes, s.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  l.appendChild(o.createTextNode(Xn(a.quotes, --s.quoteDepth, !1)));
                  break;
                default:
                  l.appendChild(o.createTextNode(u.value));
              }
          }), l.className = Gr + " " + Wr;
          var h = i === zA.BEFORE ? " " + Gr : " " + Wr;
          return Ni(t) ? t.className.baseValue += h : t.className += h, l;
        }
      }
    }, r.destroy = function(e) {
      return e.parentNode ? (e.parentNode.removeChild(e), !0) : !1;
    }, r;
  }()
), zA;
(function(r) {
  r[r.BEFORE = 0] = "BEFORE", r[r.AFTER = 1] = "AFTER";
})(zA || (zA = {}));
var zp = function(r, e) {
  var t = r.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = e.width.toString(), t.height = e.height.toString(), t.scrolling = "no", t.setAttribute(Na, "true"), r.body.appendChild(t), t;
}, Gp = function(r) {
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
}, Wp = function(r) {
  return Promise.all([].slice.call(r.images, 0).map(Gp));
}, Xp = function(r) {
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
}, Jp = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], Xs = function(r, e) {
  for (var t = r.length - 1; t >= 0; t--) {
    var A = r.item(t);
    Jp.indexOf(A) === -1 && e.style.setProperty(A, r.getPropertyValue(A));
  }
  return e;
}, jp = function(r) {
  var e = "";
  return r && (e += "<!DOCTYPE ", r.name && (e += r.name), r.internalSubset && (e += r.internalSubset), r.publicId && (e += '"' + r.publicId + '"'), r.systemId && (e += '"' + r.systemId + '"'), e += ">"), e;
}, Yp = function(r, e, t) {
  r && r.defaultView && (e !== r.defaultView.pageXOffset || t !== r.defaultView.pageYOffset) && r.defaultView.scrollTo(e, t);
}, Zp = function(r) {
  var e = r[0], t = r[1], A = r[2];
  e.scrollLeft = t, e.scrollTop = A;
}, $p = ":before", qp = ":after", Gr = "___html2canvas___pseudoelement_before", Wr = "___html2canvas___pseudoelement_after", bo = `{
    content: "" !important;
    display: none !important;
}`, em = function(r) {
  tm(r, "." + Gr + $p + bo + `
         .` + Wr + qp + bo);
}, tm = function(r, e) {
  var t = r.ownerDocument;
  if (t) {
    var A = t.createElement("style");
    A.textContent = e, r.appendChild(A);
  }
}, za = (
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
), Am = (
  /** @class */
  function() {
    function r(e, t) {
      this.context = e, this._options = t, this._cache = {};
    }
    return r.prototype.addImage = function(e) {
      var t = Promise.resolve();
      return this.has(e) || (js(e) || nm(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, r.prototype.match = function(e) {
      return this._cache[e];
    }, r.prototype.loadImage = function(e) {
      return De(this, void 0, void 0, function() {
        var t, A, i, s, n = this;
        return Le(this, function(o) {
          switch (o.label) {
            case 0:
              return t = za.isSameOrigin(e), A = !Js(e) && this._options.useCORS === !0 && Fe.SUPPORT_CORS_IMAGES && !t, i = !Js(e) && !t && !js(e) && typeof this._options.proxy == "string" && Fe.SUPPORT_CORS_XHR && !A, !t && this._options.allowTaint === !1 && !Js(e) && !js(e) && !i && !A ? [
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
                }, h.onerror = l, (om(s) || A) && (h.crossOrigin = "anonymous"), h.src = s, h.complete === !0 && setTimeout(function() {
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
        var o = Fe.SUPPORT_RESPONSE_TYPE ? "blob" : "text", a = new XMLHttpRequest();
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
), im = /^data:image\/svg\+xml/i, sm = /^data:image\/.*;base64,/i, rm = /^data:image\/.*/i, nm = function(r) {
  return Fe.SUPPORT_SVG_DRAWING || !am(r);
}, Js = function(r) {
  return rm.test(r);
}, om = function(r) {
  return sm.test(r);
}, js = function(r) {
  return r.substr(0, 4) === "blob";
}, am = function(r) {
  return r.substr(-3).toLowerCase() === "svg" || im.test(r);
}, S = (
  /** @class */
  function() {
    function r(e, t) {
      this.type = 0, this.x = e, this.y = t;
    }
    return r.prototype.add = function(e, t) {
      return new r(this.x + e, this.y + t);
    }, r;
  }()
), oA = function(r, e, t) {
  return new S(r.x + (e.x - r.x) * t, r.y + (e.y - r.y) * t);
}, Si = (
  /** @class */
  function() {
    function r(e, t, A, i) {
      this.type = 1, this.start = e, this.startControl = t, this.endControl = A, this.end = i;
    }
    return r.prototype.subdivide = function(e, t) {
      var A = oA(this.start, this.startControl, e), i = oA(this.startControl, this.endControl, e), s = oA(this.endControl, this.end, e), n = oA(A, i, e), o = oA(i, s, e), a = oA(n, o, e);
      return t ? new r(this.start, A, n, a) : new r(a, o, s, this.end);
    }, r.prototype.add = function(e, t) {
      return new r(this.start.add(e, t), this.startControl.add(e, t), this.endControl.add(e, t), this.end.add(e, t));
    }, r.prototype.reverse = function() {
      return new r(this.end, this.endControl, this.startControl, this.start);
    }, r;
  }()
), Xe = function(r) {
  return r.type === 1;
}, lm = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      var t = e.styles, A = e.bounds, i = kA(t.borderTopLeftRadius, A.width, A.height), s = i[0], n = i[1], o = kA(t.borderTopRightRadius, A.width, A.height), a = o[0], l = o[1], h = kA(t.borderBottomRightRadius, A.width, A.height), u = h[0], c = h[1], g = kA(t.borderBottomLeftRadius, A.width, A.height), w = g[0], B = g[1], v = [];
      v.push((s + a) / A.width), v.push((w + u) / A.width), v.push((n + B) / A.height), v.push((l + c) / A.height);
      var b = Math.max.apply(Math, v);
      b > 1 && (s /= b, n /= b, a /= b, l /= b, u /= b, c /= b, w /= b, B /= b);
      var F = A.width - a, L = A.height - c, P = A.width - u, R = A.height - B, H = t.borderTopWidth, Z = t.borderRightWidth, z = t.borderBottomWidth, X = t.borderLeftWidth, le = ue(t.paddingTop, e.bounds.width), Be = ue(t.paddingRight, e.bounds.width), j = ue(t.paddingBottom, e.bounds.width), ie = ue(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = s > 0 || n > 0 ? fe(A.left + X / 3, A.top + H / 3, s - X / 3, n - H / 3, re.TOP_LEFT) : new S(A.left + X / 3, A.top + H / 3), this.topRightBorderDoubleOuterBox = s > 0 || n > 0 ? fe(A.left + F, A.top + H / 3, a - Z / 3, l - H / 3, re.TOP_RIGHT) : new S(A.left + A.width - Z / 3, A.top + H / 3), this.bottomRightBorderDoubleOuterBox = u > 0 || c > 0 ? fe(A.left + P, A.top + L, u - Z / 3, c - z / 3, re.BOTTOM_RIGHT) : new S(A.left + A.width - Z / 3, A.top + A.height - z / 3), this.bottomLeftBorderDoubleOuterBox = w > 0 || B > 0 ? fe(A.left + X / 3, A.top + R, w - X / 3, B - z / 3, re.BOTTOM_LEFT) : new S(A.left + X / 3, A.top + A.height - z / 3), this.topLeftBorderDoubleInnerBox = s > 0 || n > 0 ? fe(A.left + X * 2 / 3, A.top + H * 2 / 3, s - X * 2 / 3, n - H * 2 / 3, re.TOP_LEFT) : new S(A.left + X * 2 / 3, A.top + H * 2 / 3), this.topRightBorderDoubleInnerBox = s > 0 || n > 0 ? fe(A.left + F, A.top + H * 2 / 3, a - Z * 2 / 3, l - H * 2 / 3, re.TOP_RIGHT) : new S(A.left + A.width - Z * 2 / 3, A.top + H * 2 / 3), this.bottomRightBorderDoubleInnerBox = u > 0 || c > 0 ? fe(A.left + P, A.top + L, u - Z * 2 / 3, c - z * 2 / 3, re.BOTTOM_RIGHT) : new S(A.left + A.width - Z * 2 / 3, A.top + A.height - z * 2 / 3), this.bottomLeftBorderDoubleInnerBox = w > 0 || B > 0 ? fe(A.left + X * 2 / 3, A.top + R, w - X * 2 / 3, B - z * 2 / 3, re.BOTTOM_LEFT) : new S(A.left + X * 2 / 3, A.top + A.height - z * 2 / 3), this.topLeftBorderStroke = s > 0 || n > 0 ? fe(A.left + X / 2, A.top + H / 2, s - X / 2, n - H / 2, re.TOP_LEFT) : new S(A.left + X / 2, A.top + H / 2), this.topRightBorderStroke = s > 0 || n > 0 ? fe(A.left + F, A.top + H / 2, a - Z / 2, l - H / 2, re.TOP_RIGHT) : new S(A.left + A.width - Z / 2, A.top + H / 2), this.bottomRightBorderStroke = u > 0 || c > 0 ? fe(A.left + P, A.top + L, u - Z / 2, c - z / 2, re.BOTTOM_RIGHT) : new S(A.left + A.width - Z / 2, A.top + A.height - z / 2), this.bottomLeftBorderStroke = w > 0 || B > 0 ? fe(A.left + X / 2, A.top + R, w - X / 2, B - z / 2, re.BOTTOM_LEFT) : new S(A.left + X / 2, A.top + A.height - z / 2), this.topLeftBorderBox = s > 0 || n > 0 ? fe(A.left, A.top, s, n, re.TOP_LEFT) : new S(A.left, A.top), this.topRightBorderBox = a > 0 || l > 0 ? fe(A.left + F, A.top, a, l, re.TOP_RIGHT) : new S(A.left + A.width, A.top), this.bottomRightBorderBox = u > 0 || c > 0 ? fe(A.left + P, A.top + L, u, c, re.BOTTOM_RIGHT) : new S(A.left + A.width, A.top + A.height), this.bottomLeftBorderBox = w > 0 || B > 0 ? fe(A.left, A.top + R, w, B, re.BOTTOM_LEFT) : new S(A.left, A.top + A.height), this.topLeftPaddingBox = s > 0 || n > 0 ? fe(A.left + X, A.top + H, Math.max(0, s - X), Math.max(0, n - H), re.TOP_LEFT) : new S(A.left + X, A.top + H), this.topRightPaddingBox = a > 0 || l > 0 ? fe(A.left + Math.min(F, A.width - Z), A.top + H, F > A.width + Z ? 0 : Math.max(0, a - Z), Math.max(0, l - H), re.TOP_RIGHT) : new S(A.left + A.width - Z, A.top + H), this.bottomRightPaddingBox = u > 0 || c > 0 ? fe(A.left + Math.min(P, A.width - X), A.top + Math.min(L, A.height - z), Math.max(0, u - Z), Math.max(0, c - z), re.BOTTOM_RIGHT) : new S(A.left + A.width - Z, A.top + A.height - z), this.bottomLeftPaddingBox = w > 0 || B > 0 ? fe(A.left + X, A.top + Math.min(R, A.height - z), Math.max(0, w - X), Math.max(0, B - z), re.BOTTOM_LEFT) : new S(A.left + X, A.top + A.height - z), this.topLeftContentBox = s > 0 || n > 0 ? fe(A.left + X + ie, A.top + H + le, Math.max(0, s - (X + ie)), Math.max(0, n - (H + le)), re.TOP_LEFT) : new S(A.left + X + ie, A.top + H + le), this.topRightContentBox = a > 0 || l > 0 ? fe(A.left + Math.min(F, A.width + X + ie), A.top + H + le, F > A.width + X + ie ? 0 : a - X + ie, l - (H + le), re.TOP_RIGHT) : new S(A.left + A.width - (Z + Be), A.top + H + le), this.bottomRightContentBox = u > 0 || c > 0 ? fe(A.left + Math.min(P, A.width - (X + ie)), A.top + Math.min(L, A.height + H + le), Math.max(0, u - (Z + Be)), c - (z + j), re.BOTTOM_RIGHT) : new S(A.left + A.width - (Z + Be), A.top + A.height - (z + j)), this.bottomLeftContentBox = w > 0 || B > 0 ? fe(A.left + X + ie, A.top + R, Math.max(0, w - (X + ie)), B - (z + j), re.BOTTOM_LEFT) : new S(A.left + X + ie, A.top + A.height - (z + j));
    }
    return r;
  }()
), re;
(function(r) {
  r[r.TOP_LEFT = 0] = "TOP_LEFT", r[r.TOP_RIGHT = 1] = "TOP_RIGHT", r[r.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", r[r.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(re || (re = {}));
var fe = function(r, e, t, A, i) {
  var s = 4 * ((Math.sqrt(2) - 1) / 3), n = t * s, o = A * s, a = r + t, l = e + A;
  switch (i) {
    case re.TOP_LEFT:
      return new Si(new S(r, l), new S(r, l - o), new S(a - n, e), new S(a, e));
    case re.TOP_RIGHT:
      return new Si(new S(r, e), new S(r + n, e), new S(a, l - o), new S(a, l));
    case re.BOTTOM_RIGHT:
      return new Si(new S(a, e), new S(a, e + o), new S(r + n, l), new S(r, l));
    case re.BOTTOM_LEFT:
    default:
      return new Si(new S(a, l), new S(a - n, l), new S(r, e + o), new S(r, e));
  }
}, Zi = function(r) {
  return [r.topLeftBorderBox, r.topRightBorderBox, r.bottomRightBorderBox, r.bottomLeftBorderBox];
}, hm = function(r) {
  return [
    r.topLeftContentBox,
    r.topRightContentBox,
    r.bottomRightContentBox,
    r.bottomLeftContentBox
  ];
}, $i = function(r) {
  return [
    r.topLeftPaddingBox,
    r.topRightPaddingBox,
    r.bottomRightPaddingBox,
    r.bottomLeftPaddingBox
  ];
}, um = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t, A) {
      this.offsetX = e, this.offsetY = t, this.matrix = A, this.type = 0, this.target = 6;
    }
    return r;
  }()
), Di = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.path = e, this.target = t, this.type = 1;
    }
    return r;
  }()
), cm = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.opacity = e, this.type = 2, this.target = 6;
    }
    return r;
  }()
), dm = function(r) {
  return r.type === 0;
}, Ga = function(r) {
  return r.type === 1;
}, fm = function(r) {
  return r.type === 2;
}, Bo = function(r, e) {
  return r.length === e.length ? r.some(function(t, A) {
    return t === e[A];
  }) : !1;
}, gm = function(r, e, t, A, i) {
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
}, Wa = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.element = e, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return r;
  }()
), Xa = (
  /** @class */
  function() {
    function r(e, t) {
      if (this.container = e, this.parent = t, this.effects = [], this.curves = new lm(this.container), this.container.styles.opacity < 1 && this.effects.push(new cm(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var A = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, s = this.container.styles.transform;
        this.effects.push(new um(A, i, s));
      }
      if (this.container.styles.overflowX !== 0) {
        var n = Zi(this.curves), o = $i(this.curves);
        Bo(n, o) ? this.effects.push(new Di(
          n,
          6
          /* CONTENT */
        )) : (this.effects.push(new Di(
          n,
          2
          /* BACKGROUND_BORDERS */
        )), this.effects.push(new Di(
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
          return !Ga(a);
        });
        if (t || A.container.styles.position !== 0 || !A.parent) {
          if (i.unshift.apply(i, s), t = [
            2,
            3
            /* FIXED */
          ].indexOf(A.container.styles.position) === -1, A.container.styles.overflowX !== 0) {
            var n = Zi(A.curves), o = $i(A.curves);
            Bo(n, o) || i.unshift(new Di(
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
        return ve(a.target, e);
      });
    }, r;
  }()
), Xr = function(r, e, t, A) {
  r.container.elements.forEach(function(i) {
    var s = ve(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), n = ve(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), o = new Xa(i, r);
    ve(
      i.styles.display,
      2048
      /* LIST_ITEM */
    ) && A.push(o);
    var a = ve(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : A;
    if (s || n) {
      var l = s || i.styles.isPositioned() ? t : e, h = new Wa(o);
      if (i.styles.isPositioned() || i.styles.opacity < 1 || i.styles.isTransformed()) {
        var u = i.styles.zIndex.order;
        if (u < 0) {
          var c = 0;
          l.negativeZIndex.some(function(w, B) {
            return u > w.element.container.styles.zIndex.order ? (c = B, !1) : c > 0;
          }), l.negativeZIndex.splice(c, 0, h);
        } else if (u > 0) {
          var g = 0;
          l.positiveZIndex.some(function(w, B) {
            return u >= w.element.container.styles.zIndex.order ? (g = B + 1, !1) : g > 0;
          }), l.positiveZIndex.splice(g, 0, h);
        } else
          l.zeroOrAutoZIndexOrTransformedOrOpacity.push(h);
      } else
        i.styles.isFloating() ? l.nonPositionedFloats.push(h) : l.nonPositionedInlineLevel.push(h);
      Xr(o, h, s ? h : t, a);
    } else
      i.styles.isInlineLevel() ? e.inlineLevel.push(o) : e.nonInlineLevel.push(o), Xr(o, e, t, a);
    ve(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && Ja(i, a);
  });
}, Ja = function(r, e) {
  for (var t = r instanceof Vr ? r.start : 1, A = r instanceof Vr ? r.reversed : !1, i = 0; i < e.length; i++) {
    var s = e[i];
    s.container instanceof Ta && typeof s.container.value == "number" && s.container.value !== 0 && (t = s.container.value), s.listValue = $A(t, s.container.styles.listStyleType, !0), t += A ? -1 : 1;
  }
}, pm = function(r) {
  var e = new Xa(r, null), t = new Wa(e), A = [];
  return Xr(e, t, t, A), Ja(e.container, A), t;
}, Co = function(r, e) {
  switch (e) {
    case 0:
      return je(r.topLeftBorderBox, r.topLeftPaddingBox, r.topRightBorderBox, r.topRightPaddingBox);
    case 1:
      return je(r.topRightBorderBox, r.topRightPaddingBox, r.bottomRightBorderBox, r.bottomRightPaddingBox);
    case 2:
      return je(r.bottomRightBorderBox, r.bottomRightPaddingBox, r.bottomLeftBorderBox, r.bottomLeftPaddingBox);
    case 3:
    default:
      return je(r.bottomLeftBorderBox, r.bottomLeftPaddingBox, r.topLeftBorderBox, r.topLeftPaddingBox);
  }
}, mm = function(r, e) {
  switch (e) {
    case 0:
      return je(r.topLeftBorderBox, r.topLeftBorderDoubleOuterBox, r.topRightBorderBox, r.topRightBorderDoubleOuterBox);
    case 1:
      return je(r.topRightBorderBox, r.topRightBorderDoubleOuterBox, r.bottomRightBorderBox, r.bottomRightBorderDoubleOuterBox);
    case 2:
      return je(r.bottomRightBorderBox, r.bottomRightBorderDoubleOuterBox, r.bottomLeftBorderBox, r.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
      return je(r.bottomLeftBorderBox, r.bottomLeftBorderDoubleOuterBox, r.topLeftBorderBox, r.topLeftBorderDoubleOuterBox);
  }
}, wm = function(r, e) {
  switch (e) {
    case 0:
      return je(r.topLeftBorderDoubleInnerBox, r.topLeftPaddingBox, r.topRightBorderDoubleInnerBox, r.topRightPaddingBox);
    case 1:
      return je(r.topRightBorderDoubleInnerBox, r.topRightPaddingBox, r.bottomRightBorderDoubleInnerBox, r.bottomRightPaddingBox);
    case 2:
      return je(r.bottomRightBorderDoubleInnerBox, r.bottomRightPaddingBox, r.bottomLeftBorderDoubleInnerBox, r.bottomLeftPaddingBox);
    case 3:
    default:
      return je(r.bottomLeftBorderDoubleInnerBox, r.bottomLeftPaddingBox, r.topLeftBorderDoubleInnerBox, r.topLeftPaddingBox);
  }
}, bm = function(r, e) {
  switch (e) {
    case 0:
      return ki(r.topLeftBorderStroke, r.topRightBorderStroke);
    case 1:
      return ki(r.topRightBorderStroke, r.bottomRightBorderStroke);
    case 2:
      return ki(r.bottomRightBorderStroke, r.bottomLeftBorderStroke);
    case 3:
    default:
      return ki(r.bottomLeftBorderStroke, r.topLeftBorderStroke);
  }
}, ki = function(r, e) {
  var t = [];
  return Xe(r) ? t.push(r.subdivide(0.5, !1)) : t.push(r), Xe(e) ? t.push(e.subdivide(0.5, !0)) : t.push(e), t;
}, je = function(r, e, t, A) {
  var i = [];
  return Xe(r) ? i.push(r.subdivide(0.5, !1)) : i.push(r), Xe(t) ? i.push(t.subdivide(0.5, !0)) : i.push(t), Xe(A) ? i.push(A.subdivide(0.5, !0).reverse()) : i.push(A), Xe(e) ? i.push(e.subdivide(0.5, !1).reverse()) : i.push(e), i;
}, ja = function(r) {
  var e = r.bounds, t = r.styles;
  return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, qi = function(r) {
  var e = r.styles, t = r.bounds, A = ue(e.paddingLeft, t.width), i = ue(e.paddingRight, t.width), s = ue(e.paddingTop, t.width), n = ue(e.paddingBottom, t.width);
  return t.add(A + e.borderLeftWidth, s + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + A + i), -(e.borderTopWidth + e.borderBottomWidth + s + n));
}, Bm = function(r, e) {
  return r === 0 ? e.bounds : r === 2 ? qi(e) : ja(e);
}, Cm = function(r, e) {
  return r === 0 ? e.bounds : r === 2 ? qi(e) : ja(e);
}, Ys = function(r, e, t) {
  var A = Bm(hA(r.styles.backgroundOrigin, e), r), i = Cm(hA(r.styles.backgroundClip, e), r), s = vm(hA(r.styles.backgroundSize, e), t, A), n = s[0], o = s[1], a = kA(hA(r.styles.backgroundPosition, e), A.width - n, A.height - o), l = Em(hA(r.styles.backgroundRepeat, e), a, s, A, i), h = Math.round(A.left + a[0]), u = Math.round(A.top + a[1]);
  return [l, h, u, n, o];
}, aA = function(r) {
  return oe(r) && r.value === mA.AUTO;
}, _i = function(r) {
  return typeof r == "number";
}, vm = function(r, e, t) {
  var A = e[0], i = e[1], s = e[2], n = r[0], o = r[1];
  if (!n)
    return [0, 0];
  if (be(n) && o && be(o))
    return [ue(n, t.width), ue(o, t.height)];
  var a = _i(s);
  if (oe(n) && (n.value === mA.CONTAIN || n.value === mA.COVER)) {
    if (_i(s)) {
      var l = t.width / t.height;
      return l < s != (n.value === mA.COVER) ? [t.width, t.width / s] : [t.height * s, t.height];
    }
    return [t.width, t.height];
  }
  var h = _i(A), u = _i(i), c = h || u;
  if (aA(n) && (!o || aA(o))) {
    if (h && u)
      return [A, i];
    if (!a && !c)
      return [t.width, t.height];
    if (c && a) {
      var g = h ? A : i * s, w = u ? i : A / s;
      return [g, w];
    }
    var B = h ? A : t.width, v = u ? i : t.height;
    return [B, v];
  }
  if (a) {
    var b = 0, F = 0;
    return be(n) ? b = ue(n, t.width) : be(o) && (F = ue(o, t.height)), aA(n) ? b = F * s : (!o || aA(o)) && (F = b / s), [b, F];
  }
  var L = null, P = null;
  if (be(n) ? L = ue(n, t.width) : o && be(o) && (P = ue(o, t.height)), L !== null && (!o || aA(o)) && (P = h && u ? L / A * i : t.height), P !== null && aA(n) && (L = h && u ? P / i * A : t.width), L !== null && P !== null)
    return [L, P];
  throw new Error("Unable to calculate background-size for element");
}, hA = function(r, e) {
  var t = r[e];
  return typeof t > "u" ? r[0] : t;
}, Em = function(r, e, t, A, i) {
  var s = e[0], n = e[1], o = t[0], a = t[1];
  switch (r) {
    case 2:
      return [
        new S(Math.round(A.left), Math.round(A.top + n)),
        new S(Math.round(A.left + A.width), Math.round(A.top + n)),
        new S(Math.round(A.left + A.width), Math.round(a + A.top + n)),
        new S(Math.round(A.left), Math.round(a + A.top + n))
      ];
    case 3:
      return [
        new S(Math.round(A.left + s), Math.round(A.top)),
        new S(Math.round(A.left + s + o), Math.round(A.top)),
        new S(Math.round(A.left + s + o), Math.round(A.height + A.top)),
        new S(Math.round(A.left + s), Math.round(A.height + A.top))
      ];
    case 1:
      return [
        new S(Math.round(A.left + s), Math.round(A.top + n)),
        new S(Math.round(A.left + s + o), Math.round(A.top + n)),
        new S(Math.round(A.left + s + o), Math.round(A.top + n + a)),
        new S(Math.round(A.left + s), Math.round(A.top + n + a))
      ];
    default:
      return [
        new S(Math.round(i.left), Math.round(i.top)),
        new S(Math.round(i.left + i.width), Math.round(i.top)),
        new S(Math.round(i.left + i.width), Math.round(i.height + i.top)),
        new S(Math.round(i.left), Math.round(i.height + i.top))
      ];
  }
}, ym = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", vo = "Hidden Text", Fm = (
  /** @class */
  function() {
    function r(e) {
      this._data = {}, this._document = e;
    }
    return r.prototype.parseMetrics = function(e, t) {
      var A = this._document.createElement("div"), i = this._document.createElement("img"), s = this._document.createElement("span"), n = this._document.body;
      A.style.visibility = "hidden", A.style.fontFamily = e, A.style.fontSize = t, A.style.margin = "0", A.style.padding = "0", A.style.whiteSpace = "nowrap", n.appendChild(A), i.src = ym, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", s.style.fontFamily = e, s.style.fontSize = t, s.style.margin = "0", s.style.padding = "0", s.appendChild(this._document.createTextNode(vo)), A.appendChild(s), A.appendChild(i);
      var o = i.offsetTop - s.offsetTop + 2;
      A.removeChild(s), A.appendChild(this._document.createTextNode(vo)), A.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var a = i.offsetTop - A.offsetTop + 2;
      return n.removeChild(A), { baseline: o, middle: a };
    }, r.prototype.getMetrics = function(e, t) {
      var A = e + " " + t;
      return typeof this._data[A] > "u" && (this._data[A] = this.parseMetrics(e, t)), this._data[A];
    }, r;
  }()
), Ya = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.context = e, this.options = t;
    }
    return r;
  }()
), Qm = 1e4, Um = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i._activeEffects = [], i.canvas = A.canvas ? A.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), A.canvas || (i.canvas.width = Math.floor(A.width * A.scale), i.canvas.height = Math.floor(A.height * A.scale), i.canvas.style.width = A.width + "px", i.canvas.style.height = A.height + "px"), i.fontMetrics = new Fm(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-A.x, -A.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + A.width + "x" + A.height + ") with scale " + A.scale), i;
    }
    return e.prototype.applyEffects = function(t) {
      for (var A = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return A.applyEffect(i);
      });
    }, e.prototype.applyEffect = function(t) {
      this.ctx.save(), fm(t) && (this.ctx.globalAlpha = t.opacity), dm(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), Ga(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, e.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, e.prototype.renderStack = function(t) {
      return De(this, void 0, void 0, function() {
        var A;
        return Le(this, function(i) {
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
      return De(this, void 0, void 0, function() {
        return Le(this, function(A) {
          switch (A.label) {
            case 0:
              if (ve(
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
        var n = qr(t.text);
        n.reduce(function(o, a) {
          return s.ctx.fillText(a, o, t.bounds.top + i), o + s.ctx.measureText(a).width;
        }, t.bounds.left);
      }
    }, e.prototype.createFontStyle = function(t) {
      var A = t.fontVariant.filter(function(n) {
        return n === "normal" || n === "small-caps";
      }).join(""), i = Lm(t.fontFamily).join(", "), s = ti(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, A, t.fontWeight, s, i].join(" "),
        i,
        s
      ];
    }, e.prototype.renderTextNode = function(t, A) {
      return De(this, void 0, void 0, function() {
        var i, s, n, o, a, l, h, u, c = this;
        return Le(this, function(g) {
          return i = this.createFontStyle(A), s = i[0], n = i[1], o = i[2], this.ctx.font = s, this.ctx.direction = A.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", a = this.fontMetrics.getMetrics(n, o), l = a.baseline, h = a.middle, u = A.paintOrder, t.textBounds.forEach(function(w) {
            u.forEach(function(B) {
              switch (B) {
                case 0:
                  c.ctx.fillStyle = ye(A.color), c.renderTextWithLetterSpacing(w, A.letterSpacing, l);
                  var v = A.textShadow;
                  v.length && w.text.trim().length && (v.slice(0).reverse().forEach(function(b) {
                    c.ctx.shadowColor = ye(b.color), c.ctx.shadowOffsetX = b.offsetX.number * c.options.scale, c.ctx.shadowOffsetY = b.offsetY.number * c.options.scale, c.ctx.shadowBlur = b.blur.number, c.renderTextWithLetterSpacing(w, A.letterSpacing, l);
                  }), c.ctx.shadowColor = "", c.ctx.shadowOffsetX = 0, c.ctx.shadowOffsetY = 0, c.ctx.shadowBlur = 0), A.textDecorationLine.length && (c.ctx.fillStyle = ye(A.textDecorationColor || A.color), A.textDecorationLine.forEach(function(b) {
                    switch (b) {
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
                  A.webkitTextStrokeWidth && w.text.trim().length && (c.ctx.strokeStyle = ye(A.webkitTextStrokeColor), c.ctx.lineWidth = A.webkitTextStrokeWidth, c.ctx.lineJoin = window.chrome ? "miter" : "round", c.ctx.strokeText(w.text, w.bounds.left, w.bounds.top + l)), c.ctx.strokeStyle = "", c.ctx.lineWidth = 0, c.ctx.lineJoin = "miter";
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
        var s = qi(t), n = $i(A);
        this.path(n), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(i, 0, 0, t.intrinsicWidth, t.intrinsicHeight, s.left, s.top, s.width, s.height), this.ctx.restore();
      }
    }, e.prototype.renderNodeContent = function(t) {
      return De(this, void 0, void 0, function() {
        var A, i, s, n, o, a, F, F, l, h, u, c, P, g, w, R, B, v, b, F, L, P, R;
        return Le(this, function(H) {
          switch (H.label) {
            case 0:
              this.applyEffects(t.getEffects(
                4
                /* CONTENT */
              )), A = t.container, i = t.curves, s = A.styles, n = 0, o = A.textNodes, H.label = 1;
            case 1:
              return n < o.length ? (a = o[n], [4, this.renderTextNode(a, s)]) : [3, 4];
            case 2:
              H.sent(), H.label = 3;
            case 3:
              return n++, [3, 1];
            case 4:
              if (!(A instanceof Ha)) return [3, 8];
              H.label = 5;
            case 5:
              return H.trys.push([5, 7, , 8]), [4, this.context.cache.match(A.src)];
            case 6:
              return F = H.sent(), this.renderReplacedElement(A, i, F), [3, 8];
            case 7:
              return H.sent(), this.context.logger.error("Error loading image " + A.src), [3, 8];
            case 8:
              if (A instanceof xa && this.renderReplacedElement(A, i, A.canvas), !(A instanceof Ra)) return [3, 12];
              H.label = 9;
            case 9:
              return H.trys.push([9, 11, , 12]), [4, this.context.cache.match(A.svg)];
            case 10:
              return F = H.sent(), this.renderReplacedElement(A, i, F), [3, 12];
            case 11:
              return H.sent(), this.context.logger.error("Error loading svg " + A.svg.substring(0, 255)), [3, 12];
            case 12:
              return A instanceof Ma && A.tree ? (l = new e(this.context, {
                scale: this.options.scale,
                backgroundColor: A.backgroundColor,
                x: 0,
                y: 0,
                width: A.width,
                height: A.height
              }), [4, l.render(A.tree)]) : [3, 14];
            case 13:
              h = H.sent(), A.width && A.height && this.ctx.drawImage(h, 0, 0, A.width, A.height, A.bounds.left, A.bounds.top, A.bounds.width, A.bounds.height), H.label = 14;
            case 14:
              if (A instanceof en && (u = Math.min(A.bounds.width, A.bounds.height), A.type === Xi ? A.checked && (this.ctx.save(), this.path([
                new S(A.bounds.left + u * 0.39363, A.bounds.top + u * 0.79),
                new S(A.bounds.left + u * 0.16, A.bounds.top + u * 0.5549),
                new S(A.bounds.left + u * 0.27347, A.bounds.top + u * 0.44071),
                new S(A.bounds.left + u * 0.39694, A.bounds.top + u * 0.5649),
                new S(A.bounds.left + u * 0.72983, A.bounds.top + u * 0.23),
                new S(A.bounds.left + u * 0.84, A.bounds.top + u * 0.34085),
                new S(A.bounds.left + u * 0.39363, A.bounds.top + u * 0.79)
              ]), this.ctx.fillStyle = ye(ao), this.ctx.fill(), this.ctx.restore()) : A.type === Ji && A.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(A.bounds.left + u / 2, A.bounds.top + u / 2, u / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = ye(ao), this.ctx.fill(), this.ctx.restore())), Hm(A) && A.value.length) {
                switch (c = this.createFontStyle(s), P = c[0], g = c[1], w = this.fontMetrics.getMetrics(P, g).baseline, this.ctx.font = P, this.ctx.fillStyle = ye(s.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = Rm(A.styles.textAlign), R = qi(A), B = 0, A.styles.textAlign) {
                  case 1:
                    B += R.width / 2;
                    break;
                  case 2:
                    B += R.width;
                    break;
                }
                v = R.add(B, 0, 0, -R.height / 2 + 1), this.ctx.save(), this.path([
                  new S(R.left, R.top),
                  new S(R.left + R.width, R.top),
                  new S(R.left + R.width, R.top + R.height),
                  new S(R.left, R.top + R.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new NA(A.value, v), s.letterSpacing, w), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!ve(
                A.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (A.styles.listStyleImage === null) return [3, 19];
              if (b = A.styles.listStyleImage, b.type !== 0) return [3, 18];
              F = void 0, L = b.url, H.label = 15;
            case 15:
              return H.trys.push([15, 17, , 18]), [4, this.context.cache.match(L)];
            case 16:
              return F = H.sent(), this.ctx.drawImage(F, A.bounds.left - (F.width + 10), A.bounds.top), [3, 18];
            case 17:
              return H.sent(), this.context.logger.error("Error loading list-style-image " + L), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && A.styles.listStyleType !== -1 && (P = this.createFontStyle(s)[0], this.ctx.font = P, this.ctx.fillStyle = ye(s.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", R = new wt(A.bounds.left, A.bounds.top + ue(A.styles.paddingTop, A.bounds.width), A.bounds.width, Gn(s.lineHeight, s.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new NA(t.listValue, R), s.letterSpacing, Gn(s.lineHeight, s.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), H.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderStackContent = function(t) {
      return De(this, void 0, void 0, function() {
        var A, i, b, s, n, b, o, a, b, l, h, b, u, c, b, g, w, b, B, v, b;
        return Le(this, function(F) {
          switch (F.label) {
            case 0:
              if (ve(
                t.element.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return [4, this.renderNodeBackgroundAndBorders(t.element)];
            case 1:
              F.sent(), A = 0, i = t.negativeZIndex, F.label = 2;
            case 2:
              return A < i.length ? (b = i[A], [4, this.renderStack(b)]) : [3, 5];
            case 3:
              F.sent(), F.label = 4;
            case 4:
              return A++, [3, 2];
            case 5:
              return [4, this.renderNodeContent(t.element)];
            case 6:
              F.sent(), s = 0, n = t.nonInlineLevel, F.label = 7;
            case 7:
              return s < n.length ? (b = n[s], [4, this.renderNode(b)]) : [3, 10];
            case 8:
              F.sent(), F.label = 9;
            case 9:
              return s++, [3, 7];
            case 10:
              o = 0, a = t.nonPositionedFloats, F.label = 11;
            case 11:
              return o < a.length ? (b = a[o], [4, this.renderStack(b)]) : [3, 14];
            case 12:
              F.sent(), F.label = 13;
            case 13:
              return o++, [3, 11];
            case 14:
              l = 0, h = t.nonPositionedInlineLevel, F.label = 15;
            case 15:
              return l < h.length ? (b = h[l], [4, this.renderStack(b)]) : [3, 18];
            case 16:
              F.sent(), F.label = 17;
            case 17:
              return l++, [3, 15];
            case 18:
              u = 0, c = t.inlineLevel, F.label = 19;
            case 19:
              return u < c.length ? (b = c[u], [4, this.renderNode(b)]) : [3, 22];
            case 20:
              F.sent(), F.label = 21;
            case 21:
              return u++, [3, 19];
            case 22:
              g = 0, w = t.zeroOrAutoZIndexOrTransformedOrOpacity, F.label = 23;
            case 23:
              return g < w.length ? (b = w[g], [4, this.renderStack(b)]) : [3, 26];
            case 24:
              F.sent(), F.label = 25;
            case 25:
              return g++, [3, 23];
            case 26:
              B = 0, v = t.positiveZIndex, F.label = 27;
            case 27:
              return B < v.length ? (b = v[B], [4, this.renderStack(b)]) : [3, 30];
            case 28:
              F.sent(), F.label = 29;
            case 29:
              return B++, [3, 27];
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
        var n = Xe(i) ? i.start : i;
        s === 0 ? A.ctx.moveTo(n.x, n.y) : A.ctx.lineTo(n.x, n.y), Xe(i) && A.ctx.bezierCurveTo(i.startControl.x, i.startControl.y, i.endControl.x, i.endControl.y, i.end.x, i.end.y);
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
      return De(this, void 0, void 0, function() {
        var A, i, s, n, o, a;
        return Le(this, function(l) {
          switch (l.label) {
            case 0:
              A = t.styles.backgroundImage.length - 1, i = function(h) {
                var u, c, g, le, He, xe, ie, ce, z, w, le, He, xe, ie, ce, B, v, b, F, L, P, R, H, Z, z, X, le, Be, j, ie, ce, Ye, He, xe, nt, G, et, ot, se, Y, Se, Ce;
                return Le(this, function(tt) {
                  switch (tt.label) {
                    case 0:
                      if (h.type !== 0) return [3, 5];
                      u = void 0, c = h.url, tt.label = 1;
                    case 1:
                      return tt.trys.push([1, 3, , 4]), [4, s.context.cache.match(c)];
                    case 2:
                      return u = tt.sent(), [3, 4];
                    case 3:
                      return tt.sent(), s.context.logger.error("Error loading background-image " + c), [3, 4];
                    case 4:
                      return u && (g = Ys(t, A, [
                        u.width,
                        u.height,
                        u.width / u.height
                      ]), le = g[0], He = g[1], xe = g[2], ie = g[3], ce = g[4], z = s.ctx.createPattern(s.resizeImage(u, ie, ce), "repeat"), s.renderRepeat(le, z, He, xe)), [3, 6];
                    case 5:
                      df(h) ? (w = Ys(t, A, [null, null, null]), le = w[0], He = w[1], xe = w[2], ie = w[3], ce = w[4], B = af(h.angle, ie, ce), v = B[0], b = B[1], F = B[2], L = B[3], P = B[4], R = document.createElement("canvas"), R.width = ie, R.height = ce, H = R.getContext("2d"), Z = H.createLinearGradient(b, L, F, P), Nn(h.stops, v).forEach(function(bt) {
                        return Z.addColorStop(bt.stop, ye(bt.color));
                      }), H.fillStyle = Z, H.fillRect(0, 0, ie, ce), ie > 0 && ce > 0 && (z = s.ctx.createPattern(R, "repeat"), s.renderRepeat(le, z, He, xe))) : ff(h) && (X = Ys(t, A, [
                        null,
                        null,
                        null
                      ]), le = X[0], Be = X[1], j = X[2], ie = X[3], ce = X[4], Ye = h.position.length === 0 ? [Yr] : h.position, He = ue(Ye[0], ie), xe = ue(Ye[Ye.length - 1], ce), nt = lf(h, He, xe, ie, ce), G = nt[0], et = nt[1], G > 0 && et > 0 && (ot = s.ctx.createRadialGradient(Be + He, j + xe, 0, Be + He, j + xe, G), Nn(h.stops, G * 2).forEach(function(bt) {
                        return ot.addColorStop(bt.stop, ye(bt.color));
                      }), s.path(le), s.ctx.fillStyle = ot, G !== et ? (se = t.bounds.left + 0.5 * t.bounds.width, Y = t.bounds.top + 0.5 * t.bounds.height, Se = et / G, Ce = 1 / Se, s.ctx.save(), s.ctx.translate(se, Y), s.ctx.transform(1, 0, 0, Se, 0, 0), s.ctx.translate(-se, -Y), s.ctx.fillRect(Be, Ce * (j - Y) + Y, ie, ce * Ce), s.ctx.restore()) : s.ctx.fill())), tt.label = 6;
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
      return De(this, void 0, void 0, function() {
        return Le(this, function(s) {
          return this.path(Co(i, A)), this.ctx.fillStyle = ye(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, A, i, s) {
      return De(this, void 0, void 0, function() {
        var n, o;
        return Le(this, function(a) {
          switch (a.label) {
            case 0:
              return A < 3 ? [4, this.renderSolidBorder(t, i, s)] : [3, 2];
            case 1:
              return a.sent(), [
                2
                /*return*/
              ];
            case 2:
              return n = mm(s, i), this.path(n), this.ctx.fillStyle = ye(t), this.ctx.fill(), o = wm(s, i), this.path(o), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return De(this, void 0, void 0, function() {
        var A, i, s, n, o, a, l, h, u = this;
        return Le(this, function(c) {
          switch (c.label) {
            case 0:
              return this.applyEffects(t.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), A = t.container.styles, i = !_t(A.backgroundColor) || A.backgroundImage.length, s = [
                { style: A.borderTopStyle, color: A.borderTopColor, width: A.borderTopWidth },
                { style: A.borderRightStyle, color: A.borderRightColor, width: A.borderRightWidth },
                { style: A.borderBottomStyle, color: A.borderBottomColor, width: A.borderBottomWidth },
                { style: A.borderLeftStyle, color: A.borderLeftColor, width: A.borderLeftWidth }
              ], n = xm(hA(A.backgroundClip, 0), t.curves), i || A.boxShadow.length ? (this.ctx.save(), this.path(n), this.ctx.clip(), _t(A.backgroundColor) || (this.ctx.fillStyle = ye(A.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              c.sent(), this.ctx.restore(), A.boxShadow.slice(0).reverse().forEach(function(g) {
                u.ctx.save();
                var w = Zi(t.curves), B = g.inset ? 0 : Qm, v = gm(w, -B + (g.inset ? 1 : -1) * g.spread.number, (g.inset ? 1 : -1) * g.spread.number, g.spread.number * (g.inset ? -2 : 2), g.spread.number * (g.inset ? -2 : 2));
                g.inset ? (u.path(w), u.ctx.clip(), u.mask(v)) : (u.mask(w), u.ctx.clip(), u.path(v)), u.ctx.shadowOffsetX = g.offsetX.number + B, u.ctx.shadowOffsetY = g.offsetY.number, u.ctx.shadowColor = ye(g.color), u.ctx.shadowBlur = g.blur.number, u.ctx.fillStyle = g.inset ? ye(g.color) : "rgba(0,0,0,1)", u.ctx.fill(), u.ctx.restore();
              }), c.label = 2;
            case 2:
              o = 0, a = 0, l = s, c.label = 3;
            case 3:
              return a < l.length ? (h = l[a], h.style !== 0 && !_t(h.color) && h.width > 0 ? h.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
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
      return De(this, void 0, void 0, function() {
        var o, a, l, h, u, c, g, w, B, v, b, F, L, P, R, H, R, H;
        return Le(this, function(Z) {
          return this.ctx.save(), o = bm(s, i), a = Co(s, i), n === 2 && (this.path(a), this.ctx.clip()), Xe(a[0]) ? (l = a[0].start.x, h = a[0].start.y) : (l = a[0].x, h = a[0].y), Xe(a[1]) ? (u = a[1].end.x, c = a[1].end.y) : (u = a[1].x, c = a[1].y), i === 0 || i === 2 ? g = Math.abs(l - u) : g = Math.abs(h - c), this.ctx.beginPath(), n === 3 ? this.formatPath(o) : this.formatPath(a.slice(0, 2)), w = A < 3 ? A * 3 : A * 2, B = A < 3 ? A * 2 : A, n === 3 && (w = A, B = A), v = !0, g <= w * 2 ? v = !1 : g <= w * 2 + B ? (b = g / (2 * w + B), w *= b, B *= b) : (F = Math.floor((g + B) / (w + B)), L = (g - F * w) / (F - 1), P = (g - (F + 1) * w) / F, B = P <= 0 || Math.abs(B - L) < Math.abs(B - P) ? L : P), v && (n === 3 ? this.ctx.setLineDash([0, w + B]) : this.ctx.setLineDash([w, B])), n === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = A) : this.ctx.lineWidth = A * 2 + 1.1, this.ctx.strokeStyle = ye(t), this.ctx.stroke(), this.ctx.setLineDash([]), n === 2 && (Xe(a[0]) && (R = a[3], H = a[0], this.ctx.beginPath(), this.formatPath([new S(R.end.x, R.end.y), new S(H.start.x, H.start.y)]), this.ctx.stroke()), Xe(a[1]) && (R = a[1], H = a[2], this.ctx.beginPath(), this.formatPath([new S(R.end.x, R.end.y), new S(H.start.x, H.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.render = function(t) {
      return De(this, void 0, void 0, function() {
        var A;
        return Le(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = ye(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), A = pm(t), [4, this.renderStack(A)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Ya)
), Hm = function(r) {
  return r instanceof Ia || r instanceof La ? !0 : r instanceof en && r.type !== Ji && r.type !== Xi;
}, xm = function(r, e) {
  switch (r) {
    case 0:
      return Zi(e);
    case 2:
      return hm(e);
    case 1:
    default:
      return $i(e);
  }
}, Rm = function(r) {
  switch (r) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, Tm = ["-apple-system", "system-ui"], Lm = function(r) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? r.filter(function(e) {
    return Tm.indexOf(e) === -1;
  }) : r;
}, Im = (
  /** @class */
  function(r) {
    qe(e, r);
    function e(t, A) {
      var i = r.call(this, t, A) || this;
      return i.canvas = A.canvas ? A.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), i.options = A, i.canvas.width = Math.floor(A.width * A.scale), i.canvas.height = Math.floor(A.height * A.scale), i.canvas.style.width = A.width + "px", i.canvas.style.height = A.height + "px", i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-A.x, -A.y), i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + A.width + "x" + A.height + " at " + A.x + "," + A.y + ") with scale " + A.scale), i;
    }
    return e.prototype.render = function(t) {
      return De(this, void 0, void 0, function() {
        var A, i;
        return Le(this, function(s) {
          switch (s.label) {
            case 0:
              return A = Kr(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, Mm(A)];
            case 1:
              return i = s.sent(), this.options.backgroundColor && (this.ctx.fillStyle = ye(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Ya)
), Mm = function(r) {
  return new Promise(function(e, t) {
    var A = new Image();
    A.onload = function() {
      e(A);
    }, A.onerror = t, A.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(r));
  });
}, Sm = (
  /** @class */
  function() {
    function r(e) {
      var t = e.id, A = e.enabled;
      this.id = t, this.enabled = A, this.start = Date.now();
    }
    return r.prototype.debug = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.debug == "function" ? console.debug.apply(console, pi([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, r.prototype.getTime = function() {
      return Date.now() - this.start;
    }, r.prototype.info = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && typeof window < "u" && window.console && typeof console.info == "function" && console.info.apply(console, pi([this.id, this.getTime() + "ms"], e));
    }, r.prototype.warn = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.warn == "function" ? console.warn.apply(console, pi([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, r.prototype.error = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.error == "function" ? console.error.apply(console, pi([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, r.instances = {}, r;
  }()
), Dm = (
  /** @class */
  function() {
    function r(e, t) {
      var A;
      this.windowBounds = t, this.instanceName = "#" + r.instanceCount++, this.logger = new Sm({ id: this.instanceName, enabled: e.logging }), this.cache = (A = e.cache) !== null && A !== void 0 ? A : new Am(this, e);
    }
    return r.instanceCount = 1, r;
  }()
), km = function(r, e) {
  return e === void 0 && (e = {}), _m(r, e);
};
typeof window < "u" && za.setContext(window);
var _m = function(r, e) {
  return De(void 0, void 0, void 0, function() {
    var t, A, i, s, n, o, a, l, h, u, c, g, w, B, v, b, F, L, P, R, Z, H, Z, z, X, le, Be, j, ie, ce, Ye, He, xe, nt, G, et, ot, se, Y, Se;
    return Le(this, function(Ce) {
      switch (Ce.label) {
        case 0:
          if (!r || typeof r != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (t = r.ownerDocument, !t)
            throw new Error("Element is not attached to a Document");
          if (A = t.defaultView, !A)
            throw new Error("Document is not attached to a Window");
          return i = {
            allowTaint: (z = e.allowTaint) !== null && z !== void 0 ? z : !1,
            imageTimeout: (X = e.imageTimeout) !== null && X !== void 0 ? X : 15e3,
            proxy: e.proxy,
            useCORS: (le = e.useCORS) !== null && le !== void 0 ? le : !1
          }, s = Qr({ logging: (Be = e.logging) !== null && Be !== void 0 ? Be : !0, cache: e.cache }, i), n = {
            windowWidth: (j = e.windowWidth) !== null && j !== void 0 ? j : A.innerWidth,
            windowHeight: (ie = e.windowHeight) !== null && ie !== void 0 ? ie : A.innerHeight,
            scrollX: (ce = e.scrollX) !== null && ce !== void 0 ? ce : A.pageXOffset,
            scrollY: (Ye = e.scrollY) !== null && Ye !== void 0 ? Ye : A.pageYOffset
          }, o = new wt(n.scrollX, n.scrollY, n.windowWidth, n.windowHeight), a = new Dm(s, o), l = (He = e.foreignObjectRendering) !== null && He !== void 0 ? He : !1, h = {
            allowTaint: (xe = e.allowTaint) !== null && xe !== void 0 ? xe : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: l,
            copyStyles: l
          }, a.logger.debug("Starting document clone with size " + o.width + "x" + o.height + " scrolled to " + -o.left + "," + -o.top), u = new wo(a, r, h), c = u.clonedReferenceElement, c ? [4, u.toIFrame(t, o)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return g = Ce.sent(), w = tn(c) || Op(c) ? fc(c.ownerDocument) : is(a, c), B = w.width, v = w.height, b = w.left, F = w.top, L = Om(a, c, e.backgroundColor), P = {
            canvas: e.canvas,
            backgroundColor: L,
            scale: (G = (nt = e.scale) !== null && nt !== void 0 ? nt : A.devicePixelRatio) !== null && G !== void 0 ? G : 1,
            x: ((et = e.x) !== null && et !== void 0 ? et : 0) + b,
            y: ((ot = e.y) !== null && ot !== void 0 ? ot : 0) + F,
            width: (se = e.width) !== null && se !== void 0 ? se : Math.ceil(B),
            height: (Y = e.height) !== null && Y !== void 0 ? Y : Math.ceil(v)
          }, l ? (a.logger.debug("Document cloned, using foreign object rendering"), Z = new Im(a, P), [4, Z.render(c)]) : [3, 3];
        case 2:
          return R = Ce.sent(), [3, 5];
        case 3:
          return a.logger.debug("Document cloned, element located at " + b + "," + F + " with size " + B + "x" + v + " using computed rendering"), a.logger.debug("Starting DOM parsing"), H = Da(a, c), L === H.styles.backgroundColor && (H.styles.backgroundColor = mt.TRANSPARENT), a.logger.debug("Starting renderer for element at " + P.x + "," + P.y + " with size " + P.width + "x" + P.height), Z = new Um(a, P), [4, Z.render(H)];
        case 4:
          R = Ce.sent(), Ce.label = 5;
        case 5:
          return (!((Se = e.removeContainer) !== null && Se !== void 0) || Se) && (wo.destroy(g) || a.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), a.logger.debug("Finished rendering"), [2, R];
      }
    });
  });
}, Om = function(r, e, t) {
  var A = e.ownerDocument, i = A.documentElement ? KA(r, getComputedStyle(A.documentElement).backgroundColor) : mt.TRANSPARENT, s = A.body ? KA(r, getComputedStyle(A.body).backgroundColor) : mt.TRANSPARENT, n = typeof t == "string" ? KA(r, t) : t === null ? mt.TRANSPARENT : 4294967295;
  return e === A.documentElement ? _t(i) ? _t(s) ? n : s : i : n;
};
const Pm = Symbol.for("y2kfund.supabase"), Km = {
  positions: (r, e) => ["positions", r, e],
  trades: (r) => ["trades", r],
  cashTransactions: (r) => ["cashTransactions", r],
  transfers: (r) => ["transfers", r],
  nlvMargin: (r, e) => ["nlvMargin", r, e],
  thesis: () => ["thesis"],
  thesisConnections: () => ["thesisConnections"],
  userAccountAccess: (r) => ["userAccountAccess", r]
};
function Vm() {
  const r = Zs(Pm, null);
  if (!r) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return r;
}
async function Nm(r, e) {
  if (!e)
    return console.log("⚠️ No userId provided, showing all positions"), [];
  try {
    console.log("👤 Fetching accessible accounts for user:", e);
    const { data: t, error: A } = await r.schema("hf").from("user_account_access").select("internal_account_id").eq("user_id", e).eq("is_active", !0);
    if (A)
      return console.error("❌ Error fetching user account access:", A), [];
    if (!t || t.length === 0)
      return console.log("⚠️ No account access found for user, showing all positions"), [];
    const i = t.map((s) => s.internal_account_id);
    return console.log("✅ User has access to accounts:", i), i;
  } catch (t) {
    return console.error("❌ Exception fetching account access:", t), [];
  }
}
function zm(r, e) {
  const t = Vm(), A = Km.trades(r), i = Eo(), s = Xl({
    queryKey: A,
    queryFn: async () => {
      var o, a;
      const l = await Nm(t, e);
      console.log("🔍 Querying trades with config:", {
        accountId: r,
        schema: "hf",
        table: "trades",
        userId: e || "none",
        accessibleAccountIds: l.length > 0 ? l : "all"
      });
      const h = await t.schema("hf").from("trades").select("fetched_at").order("fetched_at", { ascending: !1 }).limit(1);
      if (h.error)
        throw console.error("❌ Max fetched_at query error:", h.error), h.error;
      if (!h.data || h.data.length === 0)
        return console.log("⚠️ No trades found in database"), [];
      const u = h.data[0].fetched_at;
      console.log("📅 Latest fetched_at:", u);
      let c = t.schema("hf").from("trades").select(`
          id,
          "accountId",
          internal_account_id,
          symbol,
          "assetCategory",
          quantity,
          "tradePrice",
          "buySell",
          "tradeDate",
          "settleDateTarget",
          "ibCommission",
          fetched_at,
          description,
          currency,
          "netCash",
          proceeds,
          "fifoPnlRealized",
          "openCloseIndicator",
          "multiplier",
          "mtmPnl",
          "closePrice",
          underlyingSymbol,
          "putCall",
          strike,
          expiry,
          "tradeID",
          conid,
          "underlyingConid",
          "tradeMoney"
        `).eq("fetched_at", u);
      l.length > 0 ? (console.log("🔒 Applying access filter for accounts:", l), c = c.in("internal_account_id", l)) : console.log("🔓 No access filter applied - showing all trades"), c = c.order('"tradeDate"', { ascending: !1 });
      const [g, w, B] = await Promise.all([
        c,
        t.schema("hf").from("user_accounts_master").select("internal_account_id, legal_entity"),
        e ? t.schema("hf").from("user_account_alias").select("internal_account_id, alias").eq("user_id", e) : { data: [], error: null }
      ]);
      if (g.error)
        throw console.error("❌ Trades query error:", g.error), g.error;
      if (w.error)
        throw console.error("❌ Accounts query error:", w.error), w.error;
      console.log("✅ Trades query success:", {
        latestFetchedAt: u,
        tradesCount: (o = g.data) == null ? void 0 : o.length,
        accountsCount: (a = w.data) == null ? void 0 : a.length,
        filtered: l.length > 0,
        accessibleAccounts: l.length > 0 ? l : "all"
      });
      const v = new Map(
        (w.data || []).map((F) => [F.internal_account_id, F.legal_entity])
      ), b = new Map(
        (B.data || []).map((F) => [F.internal_account_id, F.alias])
      );
      return (g.data || []).map((F) => {
        let L = v.get(F.internal_account_id) || void 0;
        return b.has(F.internal_account_id) && (L = b.get(F.internal_account_id)), {
          ...F,
          legal_entity: L
        };
      });
    },
    staleTime: 6e4
  }), n = t.channel(`trades:${r}`).on(
    "postgres_changes",
    {
      schema: "hf",
      table: "trades",
      event: "*"
    },
    () => i.invalidateQueries({ queryKey: A })
  ).subscribe();
  return {
    ...s,
    _cleanup: () => {
      var o;
      (o = n == null ? void 0 : n.unsubscribe) == null || o.call(n);
    }
  };
}
const Gm = { class: "positions-card" }, Wm = {
  key: 0,
  class: "loading"
}, Xm = {
  key: 1,
  class: "error"
}, Jm = {
  key: 2,
  class: "positions-container"
}, jm = { class: "positions-header" }, Ym = { key: 1 }, Zm = { class: "positions-date-picker" }, $m = ["max"], qm = {
  key: 1,
  style: { "margin-left": "0.7em", color: "#888" }
}, ew = { class: "positions-tools" }, tw = { class: "positions-count" }, Aw = ["disabled"], iw = {
  key: 0,
  class: "screenshot-spinner"
}, sw = { key: 1 }, rw = { class: "popup-list" }, nw = ["onDragstart", "onDrop"], ow = ["value"], aw = {
  key: 0,
  style: { "font-size": "11px", color: "#888", "font-style": "italic", display: "inline-block" }
}, lw = ["onClick"], hw = {
  class: "move-icons",
  style: { display: "flex", "flex-direction": "column", "margin-left": "8px" }
}, uw = ["onClick", "disabled"], cw = ["onClick", "disabled"], dw = ["value"], fw = { class: "popup-actions" }, gw = {
  key: 0,
  class: "filters-bar"
}, pw = { class: "filters-tags" }, mw = ["onClick"], ww = { class: "toast-container" }, bw = ["onClick"], Bw = { class: "toast-icon" }, Cw = { key: 0 }, vw = { key: 1 }, Ew = { key: 2 }, yw = { key: 3 }, Fw = { class: "toast-content" }, Qw = { class: "toast-title" }, Uw = {
  key: 0,
  class: "toast-message"
}, Hw = ["onClick"], xw = {
  key: 3,
  class: "rename-dialog-backdrop"
}, Rw = { class: "rename-dialog" }, Tw = ["placeholder"], Lw = { class: "dialog-actions" }, Iw = {
  key: 4,
  class: "rename-dialog-backdrop"
}, Mw = { class: "rename-dialog" }, Sw = {
  key: 5,
  class: "screenshots-modal"
}, Dw = { class: "modal-content" }, kw = {
  key: 0,
  class: "screenshots-loading"
}, _w = {
  key: 1,
  class: "screenshots-empty"
}, Ow = {
  key: 2,
  class: "screenshots-list-vertical"
}, Pw = ["onClick"], Kw = ["src", "alt"], Vw = { class: "screenshot-list-meta" }, Nw = { key: 0 }, zw = {
  key: 1,
  style: { color: "#666", "font-style": "italic", display: "block" }
}, Gw = { style: { display: "flex", gap: "8px", "margin-top": "6px" } }, Ww = ["href", "download"], Xw = ["onClick"], Jw = ["onClick"], jw = { class: "dialog-actions" }, Yw = { class: "screenshot-preview-content" }, Zw = ["src"], $w = { class: "screenshot-preview-meta" }, qw = ["href", "download"], eb = {
  key: 6,
  class: "rename-dialog-backdrop"
}, tb = { class: "rename-dialog" }, Ab = {
  class: "dialog-actions",
  style: { "justify-content": "flex-start" }
}, ib = {
  key: 7,
  class: "rename-dialog-backdrop"
}, sb = { class: "rename-dialog" }, rb = { class: "dialog-actions" }, nb = { class: "modal-body" }, ob = {
  key: 0,
  class: "loading-state"
}, ab = {
  key: 1,
  class: "error-state"
}, lb = {
  key: 2,
  class: "no-data-state"
}, hb = { key: 3 }, ub = { class: "margin-impact-table" }, cb = { key: 0 }, db = { key: 1 }, fb = { key: 2 }, gb = {
  key: 1,
  class: "rename-dialog-backdrop"
}, pb = { class: "rename-dialog" }, mb = { class: "dialog-actions" }, wb = { class: "modal-header" }, bb = { class: "modal-body" }, Bb = {
  key: 0,
  class: "position-info"
}, Cb = { class: "trade-search" }, vb = {
  key: 1,
  class: "loading-state"
}, Eb = {
  key: 2,
  class: "error-state"
}, yb = {
  key: 3,
  class: "trades-list"
}, Fb = ["onClick"], Qb = ["checked", "onClick"], Ub = {
  key: 1,
  style: { color: "#dc3545", "font-size": "0.75rem" }
}, Hb = { class: "trade-details" }, xb = { class: "trade-primary" }, Rb = {
  key: 0,
  style: { color: "#6c757d", "font-size": "0.75rem", "margin-left": "0.5rem" }
}, Tb = { class: "trade-secondary" }, Lb = { class: "modal-footer" }, Ib = ["disabled"], Mb = { key: 0 }, Sb = { key: 1 }, Db = /* @__PURE__ */ Tl({
  __name: "Positions",
  props: {
    accountId: { default: "demo" },
    highlightPnL: { type: Boolean, default: !1 },
    onRowClick: {},
    showHeaderLink: { type: Boolean, default: !1 },
    userId: { default: null },
    window: { default: null }
  },
  emits: ["row-click", "minimize", "maximize"],
  setup(r, { emit: e }) {
    const t = r, A = e, i = J(null), s = J(null), n = ["qty", "avgPrice", "price", "market_value", "unrealized_pnl", "computed_cash_flow_on_entry", "computed_cash_flow_on_exercise"], o = t.window || Zs("positions", null), a = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), l = J(null);
    function h() {
      l.value = null;
    }
    const u = t.userId ? kl(t.userId) : null, c = _l(t.accountId, t.userId, l), g = AA(() => {
      const f = c.data.value || [];
      return f.length ? f.map((d) => {
        const Q = { ...d };
        for (const k of n) {
          const y = Q[k];
          if (typeof y == "number" && Number.isFinite(y)) {
            const m = y % 1;
            (Math.abs(y) * 1 / 100 > m || y == 0) && (Q[k] = Math.trunc(y));
          }
        }
        const O = wn({
          internal_account_id: Q.internal_account_id,
          symbol: Q.symbol,
          qty: Q.qty,
          asset_class: Q.asset_class,
          conid: Q.conid
        });
        return Q.symbol_comment = Z.value.get(O) || "", Q;
      }) : [];
    }), w = Ol();
    Pl();
    const B = J(null);
    let v = null;
    const b = J([]), F = J([]), L = J(!1), P = J([]), R = [
      { field: "legal_entity", label: "Account" },
      { field: "thesis", label: "Thesis" },
      { field: "symbol", label: "Financial Instrument" },
      { field: "symbol_comment", label: "Comment" },
      { field: "expiry_date", label: "Expiry date" },
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
      { field: "computed_be_price", label: "BE Price" },
      { field: "maintenance_margin_change", label: "Maintenance Margin Change" }
    ], H = J({}), Z = AA(() => {
      const f = /* @__PURE__ */ new Map();
      if (u != null && u.data.value)
        for (const d of u.data.value)
          f.set(d.comment_key, d.comment);
      return f;
    }), z = J(/* @__PURE__ */ new Set());
    function X(f) {
      if (z.value.has(f) ? z.value.delete(f) : z.value.add(f), v) {
        const d = v.getRows();
        for (const Q of d) {
          const O = Q.getData();
          if (O && !O._isThesisGroup && EA(O) === f) {
            Q.reformat();
            break;
          }
        }
      }
    }
    function le() {
      const d = new URL(window.location.href).searchParams.get(`${o}_position_col_renames`);
      if (!d) return {};
      try {
        const Q = d.split("-and-"), O = {};
        return Q.forEach((k) => {
          const [y, ...m] = k.split(":");
          y && m.length && (O[y] = decodeURIComponent(m.join(":")));
        }), O;
      } catch {
        return {};
      }
    }
    function Be(f) {
      const d = new URL(window.location.href), Q = Object.entries(f).filter(([O, k]) => k && k.trim()).map(([O, k]) => `${O}:${encodeURIComponent(k)}`).join("-and-");
      Q ? d.searchParams.set(`${o}_position_col_renames`, Q) : d.searchParams.delete(`${o}_position_col_renames`), window.history.replaceState({}, "", d.toString());
    }
    const j = J(!1), ie = J(null), ce = J("");
    function Ye(f, d) {
      ie.value = f, ce.value = d, j.value = !0;
    }
    function He() {
      ie.value && (H.value = {
        ...H.value,
        [ie.value]: ce.value.trim()
      }, Be(H.value), j.value = !1, vt(() => at()));
    }
    function xe() {
      j.value = !1;
    }
    function nt() {
      const d = new URL(window.location.href).searchParams.get(`${o}_position_cols`);
      if (!d)
        return R.map((k) => k.field).filter((k) => !["asset_class", "conid", "undConid", "multiplier", "qty"].includes(k));
      const Q = d.split("-and-").map((k) => k.trim()).filter(Boolean), O = new Set(R.map((k) => k.field));
      return Q.filter((k) => O.has(k));
    }
    const G = J(nt());
    function et() {
      const d = new URL(window.location.href).searchParams.get(`${o}_position_col_widths`);
      if (!d) return {};
      try {
        const Q = d.split("-and-"), O = {};
        return Q.forEach((k) => {
          const [y, m] = k.split(":");
          y && m && (O[y] = parseInt(m));
        }), O;
      } catch (Q) {
        return console.warn("Error parsing column widths from URL:", Q), {};
      }
    }
    function ot(f) {
      const d = new URL(window.location.href), Q = Object.entries(f).filter(([O, k]) => k > 0).map(([O, k]) => `${O}:${k}`).join("-and-");
      Q ? d.searchParams.set(`${o}_position_col_widths`, Q) : d.searchParams.delete(`${o}_position_col_widths`), window.history.replaceState({}, "", d.toString());
    }
    const se = J(et());
    function Y(f) {
      return f == null || !Number.isFinite(f) ? "" : f % 1 == 0 ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(f) : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(f);
    }
    function Se(f) {
      return f == null || !Number.isFinite(f) ? "" : new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(f);
    }
    function Ce(f) {
      if (!f) return [];
      const d = String(f), Q = d.match(/^([A-Z]+)\b/), O = (Q == null ? void 0 : Q[1]) ?? "", k = d.match(/\s([CP])\b/), y = (k == null ? void 0 : k[1]) ?? "", m = d.match(/\s(\d+(?:\.\d+)?)\s+[CP]\b/), p = (m == null ? void 0 : m[1]) ?? "", C = d.match(/\b(\d{6})[CP]/), U = C ? bt(C[1]) : "";
      return [O, U, p, y].filter(Boolean);
    }
    function tt(f) {
      var U;
      if (!f) return [];
      const d = String(f).trim(), Q = d.match(/^([A-Z]+)\s*/), O = (Q == null ? void 0 : Q[1]) ?? "", k = d.slice(((U = Q == null ? void 0 : Q[0]) == null ? void 0 : U.length) || 0), y = k.match(/(\d{6})([CP])/);
      let m = "", p = "", C = "";
      if (y) {
        m = bt(y[1]), p = y[2];
        const W = k.slice(y[0].length).match(/(\d+)/);
        W && (C = (parseInt(W[1], 10) / 1e3).toString());
      }
      return [O, m, C, p].filter(Boolean);
    }
    function bt(f) {
      if (!f || f.length !== 6) return "";
      const d = f.substring(0, 2), Q = f.substring(2, 4), O = f.substring(4, 6);
      return `20${d}-${Q}-${O}`;
    }
    const At = Kl(), Ai = Eo();
    async function Za(f, d) {
      try {
        if (d) {
          const { error: Q } = await At.schema("hf").from("positionsAndThesisConnection").upsert({
            symbol_root: f,
            thesis_id: d,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }, {
            onConflict: "symbol_root,thesis_id"
          });
          if (Q) throw Q;
        } else {
          const { error: Q } = await At.schema("hf").from("positionsAndThesisConnection").delete().eq("symbol_root", f);
          if (Q) throw Q;
        }
        await Promise.all([
          Ai.invalidateQueries({ queryKey: ["positions"] }),
          Ai.invalidateQueries({ queryKey: ["thesisConnections"] })
        ]), ke("success", "Thesis Updated", `All ${f} positions have been updated`);
      } catch (Q) {
        throw console.error("Error updating thesis connection:", Q), ke("error", "Error", `Failed to update thesis: ${Q.message}`), Q;
      }
    }
    const ii = J([]);
    let $a = 0;
    function ke(f, d, Q) {
      const O = $a++;
      ii.value.push({ id: O, type: f, title: d, message: Q }), setTimeout(() => ds(O), 5e3);
    }
    function ds(f) {
      const d = ii.value.findIndex((Q) => Q.id === f);
      d !== -1 && ii.value.splice(d, 1);
    }
    function qa(f) {
      if (!f)
        return "⏱️ Last Updated: Not available";
      try {
        const d = new Date(f), Q = Intl.DateTimeFormat().resolvedOptions().timeZone, k = {
          "Asia/Kolkata": "IST",
          "Asia/Calcutta": "IST",
          "America/New_York": d.getMonth() >= 2 && d.getMonth() < 10 ? "EDT" : "EST",
          "America/Los_Angeles": d.getMonth() >= 2 && d.getMonth() < 10 ? "PDT" : "PST",
          "America/Chicago": d.getMonth() >= 2 && d.getMonth() < 10 ? "CDT" : "CST",
          "America/Denver": d.getMonth() >= 2 && d.getMonth() < 10 ? "MDT" : "MST",
          "Europe/London": d.getMonth() >= 2 && d.getMonth() < 9 ? "BST" : "GMT",
          "Europe/Paris": d.getMonth() >= 2 && d.getMonth() < 9 ? "CEST" : "CET",
          "Australia/Sydney": d.getMonth() >= 9 || d.getMonth() < 3 ? "AEDT" : "AEST"
        }[Q] || Q, y = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: Q
        }), m = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: !0,
          timeZone: Q
        });
        return `⏱️ Last Updated: ${y} at ${m} ${k}`;
      } catch {
        return `⏱️ Last Updated: ${f}`;
      }
    }
    function Ee() {
      return [
        {
          label: "Margin Impact",
          action: (f, d) => {
            const Q = d.getRow().getData();
            rl(Q);
          }
        },
        {
          separator: !0
        },
        {
          label: (f) => {
            const d = f.getData();
            return qa(d.fetched_at);
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
    function el(f) {
      const d = G.value.indexOf(f);
      d > -1 && (G.value.splice(d, 1), un(G.value), vt(() => {
        at();
      }));
    }
    function An(f, d) {
      const Q = new URL(window.location.href);
      Q.searchParams.set(`${o}_positions_sort`, `${f}:${d}`), window.history.replaceState({}, "", Q.toString());
    }
    function sn() {
      const d = new URL(window.location.href).searchParams.get(`${o}_positions_sort`);
      if (!d) return null;
      const [Q, O] = d.split(":");
      return Q && (O === "asc" || O === "desc") ? { field: Q, dir: O } : null;
    }
    const BA = J(!1);
    function at() {
      if (!B.value) return;
      if (v) {
        try {
          v.destroy();
        } catch {
        }
        v = null;
      }
      BA.value = !1;
      const f = !L.value, d = /* @__PURE__ */ new Map();
      [
        // Copy all your column objects here, as in your current columns array
        // (You can copy-paste from your current columns array, no changes needed)
        // ...START COPY...
        {
          title: "Account",
          field: "legal_entity",
          minWidth: 80,
          width: se.value.legal_entity || void 0,
          frozen: !0,
          visible: G.value.includes("legal_entity"),
          bottomCalc: f ? () => "All Accounts" : void 0,
          bottomCalcFormatter: f ? () => "All Accounts" : void 0,
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("legal_entity")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            if (p != null && p._isThesisGroup || p != null && p._isTrade)
              return m.getValue() || "";
            const C = m.getValue(), U = typeof C == "object" && C !== null ? C.name || C.id : C, I = EA(p), W = ws.value.get(I), M = W && W.size > 0, T = z.value.has(I);
            return `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${M ? `<span class="expand-arrow ${T ? "expanded" : ""}" data-position-key="${I}" title="${T ? "Collapse" : "Expand"} trades">
              ${T ? "▼" : "▶"}
            </span>` : '<span class="expand-arrow">&nbsp;</span>'}
            <button 
              class="attach-trades-btn" 
              title="Attach trades"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span>${U}</span>
            ${M ? `<span class="trade-count">(${W.size})</span>` : ""}
          </div>
        `;
          },
          cellClick: (m, p) => {
            const C = p.getRow().getData();
            if (C != null && C._isThesisGroup || C != null && C._isTrade) return;
            const U = m.target, I = U.closest(".expand-arrow");
            if (I) {
              m.stopPropagation();
              const _ = I.getAttribute("data-position-key");
              _ && X(_);
              return;
            }
            if (U.closest(".attach-trades-btn")) {
              m.stopPropagation(), al(C);
              return;
            }
            const M = p.getValue(), T = typeof M == "object" && M !== null ? M.name || M.id : M;
            vs("legal_entity", T);
          },
          contextMenu: [
            ...Ee()
          ]
        },
        {
          title: "Financial Instrument",
          field: "symbol",
          minWidth: 200,
          width: se.value.symbol || void 0,
          // ADD THIS LINE
          frozen: !0,
          visible: G.value.includes("symbol"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("symbol")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            if (p != null && p._isThesisGroup) {
              const I = "#495057", W = m.getValue() || "";
              return `<span style="font-weight: 600; color: ${I};">${W}</span>`;
            }
            const C = Ce(m.getValue()), U = new Set(b.value);
            return C.map((I) => `<span class="${U.has(I) ? "fi-tag fi-tag-selected" : "fi-tag"}">${I}</span>`).join(" ");
          },
          cellClick: (m, p) => {
            var W;
            const C = p.getRow().getData();
            if (C != null && C._isThesisGroup) return;
            const I = m.target.closest(".fi-tag");
            if (I) {
              const M = (W = I.textContent) == null ? void 0 : W.trim();
              M && vs("symbol", M);
            }
          },
          contextMenu: Ee()
        },
        {
          title: "Expiry date",
          field: "expiry_date",
          minWidth: 110,
          width: se.value.expiry_date || void 0,
          hozAlign: "center",
          visible: G.value.includes("expiry_date"),
          sorter: (m, p, C, U, I, W, M) => {
            const T = (N) => N.asset_class === "OPT" && Ce(N.symbol)[1] || "", _ = T(C.getData()), ee = T(U.getData());
            return _ < ee ? -1 : _ > ee ? 1 : 0;
          },
          titleFormatter: (m) => `<div class="header-with-close">
          <span>Expiry date</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            if (p.asset_class === "OPT") {
              const U = Ce(p.symbol)[1] || "";
              return U || '<span style="color:#aaa;font-style:italic;">Unknown</span>';
            }
            return '<span style="color:#aaa;font-style:italic;">Not applicable</span>';
          },
          contextMenu: Ee()
        },
        {
          title: "Thesis",
          field: "thesis",
          minWidth: 80,
          width: se.value.thesis || void 0,
          // ADD THIS LINE
          visible: G.value.includes("thesis"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("thesis")}</span>
        </div>`,
          formatter: (m) => {
            try {
              const p = m.getRow().getData();
              if (p != null && p._isThesisGroup) return "";
              const C = m.getValue();
              return C ? `<span class="${F.value.includes(C.title) ? "thesis-tag thesis-tag-selected" : "thesis-tag"}" title="${C.description || ""}">${C.title}</span>` : '<span style="color: #6c757d; font-style: italic;">No thesis</span>';
            } catch (p) {
              return console.warn("Thesis formatter error:", p), '<span style="color: #6c757d; font-style: italic;">Error</span>';
            }
          },
          accessor: (m) => (m == null ? void 0 : m.id) || "",
          editor: "list",
          editorParams: (m) => {
            try {
              const p = { "": "No thesis" };
              (w.data.value || []).forEach((W) => {
                p[W.id] = W.title;
              });
              const U = m.getRow().getData().thesis, I = (U == null ? void 0 : U.id) || "";
              return {
                values: p,
                defaultValue: I,
                clearable: !0,
                verticalNavigation: "editor"
              };
            } catch (p) {
              return console.warn("Thesis editor params error:", p), { values: { "": "No thesis" } };
            }
          },
          mutator: (m, p, C) => {
            try {
              if (typeof m == "object" && m !== null)
                return m;
              if (typeof m == "string") {
                if (!m) return null;
                const U = (w.data.value || []).find((I) => I.id === m);
                return U ? { id: U.id, title: U.title, description: U.description } : null;
              }
              return null;
            } catch (U) {
              return console.warn("Thesis mutator error:", U), null;
            }
          },
          cellEdited: async (m) => {
            try {
              const p = m.getValue(), C = (p == null ? void 0 : p.id) || null, U = m.getRow().getData(), I = U == null ? void 0 : U.symbol;
              if (!I) return;
              const W = Nl(I);
              if (!W) return;
              await Za(W, C);
            } catch (p) {
              console.error("Failed to update thesis:", p);
              try {
                m.restoreOldValue();
              } catch (C) {
                console.warn("Could not revert cell value:", C);
              }
            }
          },
          cellClick: (m, p) => {
            try {
              const C = p.getRow().getData();
              if (C != null && C._isThesisGroup) return;
              m.detail === 1 && setTimeout(() => handleThesisCellFilterClick(p), 200);
            } catch (C) {
              console.warn("Thesis cell click error:", C);
            }
          },
          cellDblClick: (m, p) => {
            try {
              const C = p.getRow().getData();
              C != null && C._isThesisGroup || p.edit();
            } catch (C) {
              console.warn("Thesis cell double click error:", C);
            }
          },
          contextMenu: Ee()
        },
        {
          title: "Comment",
          field: "symbol_comment",
          minWidth: 120,
          width: se.value.symbol_comment || void 0,
          visible: G.value.includes("symbol_comment"),
          editor: "input",
          titleFormatter: (m) => '<div class="header-with-close"><span>Comment</span></div>',
          formatter: (m) => m.getValue() || "",
          cellEdited: async (m) => {
            var I;
            const p = m.getRow().getData(), C = wn({
              internal_account_id: p.internal_account_id,
              symbol: p.symbol,
              qty: p.qty,
              asset_class: p.asset_class,
              conid: p.conid
            }), U = m.getValue();
            if (C && t.userId)
              try {
                await zl(At, C, t.userId, U), await ((I = u == null ? void 0 : u.refetch) == null ? void 0 : I.call(u)), m.getRow().getTable().redraw(!0), ke("success", "Comment saved");
              } catch (W) {
                ke("error", "Failed to save comment", W.message);
              }
          },
          cellClick: (m, p) => {
            var C;
            (C = p.getRow().getData()) != null && C._isThesisGroup || p.edit();
          },
          contextMenu: Ee()
        },
        {
          title: "Asset Class",
          field: "asset_class",
          minWidth: 80,
          width: se.value.asset_class || void 0,
          visible: G.value.includes("asset_class"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("asset_class")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            return p != null && p._isThesisGroup ? "" : m.getValue() || "";
          },
          cellClick: (m, p) => {
            const C = p.getRow().getData();
            if (C != null && C._isThesisGroup) return;
            const U = p.getValue();
            vs("asset_class", U);
          },
          contextMenu: Ee()
        },
        {
          title: "Conid",
          field: "conid",
          minWidth: 80,
          width: se.value.conid || void 0,
          // ADD THIS LINE
          visible: G.value.includes("conid"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("conid")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            return p != null && p._isThesisGroup ? "" : m.getValue() || "";
          },
          contextMenu: Ee()
        },
        {
          title: "Underlying Conid",
          field: "undConid",
          minWidth: 80,
          width: se.value.undConid || void 0,
          // ADD THIS LINE
          visible: G.value.includes("undConid"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("undConid")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            return p != null && p._isThesisGroup ? "" : m.getValue() || "";
          },
          contextMenu: Ee()
        },
        {
          title: "Multiplier",
          field: "multiplier",
          minWidth: 80,
          width: se.value.multiplier || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("multiplier"),
          // Set bottom calc during initialization
          bottomCalc: f ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatNumber(cell.getValue()) : undefined,
          bottomCalcFormatter: f ? (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Se(p)}</span>`;
          } : void 0,
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("multiplier")}</span>
        </div>`,
          formatter: (m) => {
            var p;
            return (p = m.getRow().getData()) != null && p._isThesisGroup ? "" : Se(m.getValue());
          },
          contextMenu: Ee()
        },
        {
          title: "Qty",
          field: "qty",
          minWidth: 70,
          width: se.value.qty || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("qty"),
          sorter: "number",
          // Set bottom calc during initialization
          bottomCalc: f ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatNumber(cell.getValue()) : undefined,
          bottomCalcFormatter: f ? (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Se(p)}</span>`;
          } : void 0,
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("qty")}</span>
        </div>`,
          formatter: (m) => {
            var p;
            return (p = m.getRow().getData()) != null && p._isThesisGroup, Se(m.getValue());
          },
          contextMenu: Ee()
        },
        {
          title: "Avg Price",
          field: "avgPrice",
          minWidth: 80,
          width: se.value.avgPrice || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("avgPrice"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("avgPrice")}</span>
        </div>`,
          formatter: (m) => {
            var p;
            return (p = m.getRow().getData()) != null && p._isThesisGroup ? "" : Y(m.getValue());
          },
          contextMenu: Ee()
        },
        {
          title: "Market Price",
          field: "price",
          minWidth: 80,
          width: se.value.price || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("price"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("price")}</span>
        </div>`,
          formatter: (m) => {
            var p;
            return (p = m.getRow().getData()) != null && p._isThesisGroup ? "" : Y(m.getValue());
          },
          contextMenu: Ee()
        },
        {
          title: "Ul CM Price",
          field: "market_price",
          minWidth: 80,
          width: se.value.market_price || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("market_price"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("market_price")}</span>
        </div>`,
          formatter: (m) => {
            var U;
            if ((U = m.getRow().getData()) != null && U._isThesisGroup) return "";
            if (m.getRow().getData().asset_class === "STK")
              return '<span style="color:#aaa;font-style:italic;">Not applicable</span>';
            const C = m.getValue();
            return C == null ? "-" : Y(C);
          },
          contextMenu: [
            {
              label: (m) => {
                const C = m.getData().market_price_fetched_at;
                if (!C)
                  return "⏱️ Last Updated: Not available";
                try {
                  const U = new Date(C), I = Intl.DateTimeFormat().resolvedOptions().timeZone, M = {
                    "Asia/Kolkata": "IST",
                    "Asia/Calcutta": "IST",
                    "America/New_York": U.getMonth() >= 2 && U.getMonth() < 10 ? "EDT" : "EST",
                    "America/Los_Angeles": U.getMonth() >= 2 && U.getMonth() < 10 ? "PDT" : "PST",
                    "America/Chicago": U.getMonth() >= 2 && U.getMonth() < 10 ? "CDT" : "CST",
                    "America/Denver": U.getMonth() >= 2 && U.getMonth() < 10 ? "MDT" : "MST",
                    "Europe/London": U.getMonth() >= 2 && U.getMonth() < 9 ? "BST" : "GMT",
                    "Europe/Paris": U.getMonth() >= 2 && U.getMonth() < 9 ? "CEST" : "CET",
                    "Australia/Sydney": U.getMonth() >= 9 || U.getMonth() < 3 ? "AEDT" : "AEST"
                  }[I] || I, T = U.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: I
                  }), _ = U.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: !0,
                    timeZone: I
                  });
                  return `⏱️ Last Updated: ${T} at ${_} ${M}`;
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
          width: se.value.instrument_market_price || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("instrument_market_price"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("instrument_market_price")}</span>
        </div>`,
          formatter: (m) => {
            var U;
            if ((U = m.getRow().getData()) != null && U._isThesisGroup) return "";
            const p = m.getRow().getData();
            let C = null;
            return p.asset_class === "OPT" ? C = p.option_market_price : (p.asset_class === "STK" || p.asset_class === "FUND") && (C = p.market_price), C == null ? "-" : Y(C);
          },
          contextMenu: [
            {
              label: (m) => {
                const C = m.getData().market_price_fetched_at;
                if (!C)
                  return "⏱️ Last Updated: Not available";
                try {
                  const U = new Date(C), I = Intl.DateTimeFormat().resolvedOptions().timeZone, M = {
                    "Asia/Kolkata": "IST",
                    "Asia/Calcutta": "IST",
                    "America/New_York": U.getMonth() >= 2 && U.getMonth() < 10 ? "EDT" : "EST",
                    "America/Los_Angeles": U.getMonth() >= 2 && U.getMonth() < 10 ? "PDT" : "PST",
                    "America/Chicago": U.getMonth() >= 2 && U.getMonth() < 10 ? "CDT" : "CST",
                    "America/Denver": U.getMonth() >= 2 && U.getMonth() < 10 ? "MDT" : "MST",
                    "Europe/London": U.getMonth() >= 2 && U.getMonth() < 9 ? "BST" : "GMT",
                    "Europe/Paris": U.getMonth() >= 2 && U.getMonth() < 9 ? "CEST" : "CET",
                    "Australia/Sydney": U.getMonth() >= 9 || U.getMonth() < 3 ? "AEDT" : "AEST"
                  }[I] || I, T = U.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: I
                  }), _ = U.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: !0,
                    timeZone: I
                  });
                  return `⏱️ Last Updated: ${T} at ${_} ${M}`;
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
          width: se.value.market_value || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("market_value"),
          // Set bottom calc during initialization
          bottomCalc: f ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
          bottomCalcFormatter: f ? (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Y(p)}</span>`;
          } : void 0,
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("market_value")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            return p != null && p._isThesisGroup, Y(m.getValue());
          },
          contextMenu: Ee()
        },
        {
          title: "P&L Unrealized",
          field: "unrealized_pnl",
          minWidth: 80,
          width: se.value.unrealized_pnl || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("unrealized_pnl"),
          // Set bottom calc during initialization
          bottomCalc: f ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
          bottomCalcFormatter: f ? (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Y(p)}</span>`;
          } : void 0,
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("unrealized_pnl")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Y(p)}</span>`;
          },
          contextMenu: Ee()
        },
        // ...inside columns array, after 'unrealized_pnl' column...
        {
          title: "Break even price P&L",
          field: "be_price_pnl",
          minWidth: 80,
          width: se.value.be_price_pnl || void 0,
          hozAlign: "right",
          visible: G.value.includes("be_price_pnl"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("be_price_pnl")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            if (p.asset_class === "OPT" && p.symbol && p.symbol.includes("P")) {
              const C = p.market_price, U = p.computed_be_price;
              let I = p.qty;
              const W = p.multiplier, T = Ce(p.symbol)[2], _ = T ? parseFloat(T) : null;
              if (I = Math.abs(I), C != null && U !== null && U !== void 0 && I !== null && I !== void 0 && W !== null && W !== void 0 && _ !== null && !isNaN(_)) {
                const N = (Math.min(C, _) - U) * I * W, $ = Math.abs(N), he = Math.abs(N % 1);
                let de;
                $ === 0 || he < $ * 0.01 ? de = Y(Math.trunc(N)) : de = Y(N);
                let Oe = "";
                return N > 0 ? Oe = "pnl-positive" : N < 0 ? Oe = "pnl-negative" : Oe = "pnl-zero", `<span class="${Oe}">${de}</span>`;
              }
            }
            return '<span style="color:#aaa;font-style:italic;">Not applicable</span>';
          },
          bottomCalc: f ? (m, p) => {
            let C = 0;
            for (const U of p)
              if (U.asset_class === "OPT" && U.symbol && U.symbol.includes("P")) {
                const I = U.market_price, W = U.computed_be_price;
                let M = U.qty;
                const T = U.multiplier, ee = Ce(U.symbol)[2], N = ee ? parseFloat(ee) : null;
                if (M = Math.abs(M), I != null && W !== null && W !== void 0 && M !== null && M !== void 0 && T !== null && T !== void 0 && N !== null && !isNaN(N)) {
                  const he = (Math.min(I, N) - W) * M * T;
                  C += he;
                }
              }
            return C;
          } : !1,
          bottomCalcFormatter: f ? (m) => {
            const p = m.getValue(), C = Math.abs(p), U = Math.abs(p % 1);
            let I;
            C === 0 || U < C * 0.01 ? I = Y(Math.trunc(p)) : I = Y(p);
            let W = "";
            return p > 0 ? W = "pnl-positive" : p < 0 ? W = "pnl-negative" : W = "pnl-zero", `<span class="${W}">${I}</span>`;
          } : void 0,
          // --- CONTEXT MENU FOR FULL DECIMAL CALCULATION ---
          contextMenu: [
            {
              label: (m) => {
                const p = m.getData();
                if (p.asset_class === "OPT" && p.symbol && p.symbol.includes("P")) {
                  const C = p.market_price, U = p.computed_be_price;
                  let I = p.qty;
                  const W = p.multiplier, T = Ce(p.symbol)[2], _ = T ? parseFloat(T) : null;
                  if (I = Math.abs(I), C != null && U !== null && U !== void 0 && I !== null && I !== void 0 && W !== null && W !== void 0 && _ !== null && !isNaN(_)) {
                    const ee = Math.min(C, _), N = (ee - U) * I * W;
                    return [
                      "Calculation: (min(Market Price, Strike Price) - BE Price) × |Qty| × Multiplier",
                      `= (min(${Y(C)}, ${Y(_)}) - ${Y(U)}) × ${I} × ${W}`,
                      `= (${Y(ee)} - ${Y(U)}) × ${I} × ${W}`,
                      `= ${Y(ee - U)} × ${I} × ${W}`,
                      `= ${Y((ee - U) * I)} × ${W}`,
                      `<b>= ${Y(N)}</b> <span style="color:#888">(full decimal)</span>`
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
          width: se.value.computed_cash_flow_on_entry || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("computed_cash_flow_on_entry"),
          // Set bottom calc during initialization
          bottomCalc: f ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
          bottomCalcFormatter: f ? (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Y(p)}</span>`;
          } : void 0,
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("computed_cash_flow_on_entry")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Y(p)}</span>`;
          },
          contextMenu: Ee()
        },
        {
          title: "If exercised cash flow",
          field: "computed_cash_flow_on_exercise",
          minWidth: 80,
          width: se.value.computed_cash_flow_on_exercise || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("computed_cash_flow_on_exercise"),
          // Set bottom calc during initialization
          bottomCalc: f ? "sum" : void 0,
          //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
          bottomCalcFormatter: f ? (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Y(p)}</span>`;
          } : void 0,
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("computed_cash_flow_on_exercise")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getValue();
            let C = "";
            return p > 0 ? C = "pnl-positive" : p < 0 ? C = "pnl-negative" : C = "pnl-zero", `<span class="${C}">${Y(p)}</span>`;
          },
          contextMenu: Ee()
        },
        {
          title: "(Entry / If exercised) cash flow",
          field: "entry_exercise_cash_flow_pct",
          minWidth: 100,
          width: se.value.entry_exercise_cash_flow_pct || void 0,
          hozAlign: "right",
          visible: G.value.includes("entry_exercise_cash_flow_pct"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("entry_exercise_cash_flow_pct")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getRow().getData();
            if (p.asset_class === "OPT" && p.computed_cash_flow_on_entry != null && p.computed_cash_flow_on_exercise != null && p.computed_cash_flow_on_exercise !== 0) {
              const C = p.computed_cash_flow_on_entry / p.computed_cash_flow_on_exercise * 100;
              return `<span>${Math.abs(C.toFixed(2)) + "%"}</span>`;
            }
            return '<span style="color:#aaa;font-style:italic;">Not applicable</span>';
          },
          bottomCalc: !1,
          //contextMenu: createFetchedAtContextMenu(),
          contextMenu: [
            {
              label: (m) => {
                const p = m.getData();
                if (p.asset_class === "OPT" && p.computed_cash_flow_on_entry != null && p.computed_cash_flow_on_exercise != null && p.computed_cash_flow_on_exercise !== 0) {
                  const C = p.computed_cash_flow_on_entry / p.computed_cash_flow_on_exercise * 100;
                  return [
                    "Calculation: (Entry cash flow / If exercised cash flow) × 100",
                    `= (${Y(p.computed_cash_flow_on_entry)} / ${Y(p.computed_cash_flow_on_exercise)}) × 100`,
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
          width: se.value.computed_be_price || void 0,
          // ADD THIS LINE
          hozAlign: "right",
          visible: G.value.includes("computed_be_price"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("computed_be_price")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getValue();
            return p == null ? "-" : Se(p);
          },
          contextMenu: Ee()
        },
        {
          title: "Maintenance Margin Change",
          field: "maintenance_margin_change",
          minWidth: 180,
          width: se.value.maintenance_margin_change || void 0,
          hozAlign: "right",
          visible: G.value.includes("maintenance_margin_change"),
          titleFormatter: (m) => `<div class="header-with-close">
          <span>${we("maintenance_margin_change")}</span>
        </div>`,
          formatter: (m) => {
            const p = m.getValue();
            if (p == null || p === "") return "-";
            const C = parseFloat(p.replace(/,/g, ""));
            return Y(C);
          },
          contextMenu: Ee()
        }
      ].forEach((m) => d.set(m.field, m));
      const O = G.value.map((m) => d.get(m)).filter(Boolean), k = {
        data: qt.value,
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
        rowFormatter: (m) => {
          try {
            const p = m.getData(), C = m.getElement();
            if (p != null && p._isThesisGroup && C) {
              C.style.backgroundColor = "#f8f9fa", C.style.fontWeight = "bold", C.style.borderTop = "2px solid #dee2e6";
              return;
            }
            if (!L.value && p && !p._isThesisGroup) {
              const U = EA(p), I = ws.value.get(U);
              if (z.value.has(U) && I && I.size > 0) {
                const M = (eA.data.value || []).filter((T) => T.tradeID && I.has(T.tradeID));
                if (M.length > 0) {
                  const T = document.createElement("div");
                  T.style.boxSizing = "border-box", T.style.padding = "10px 30px", T.style.borderTop = "1px solid #dee2e6", T.style.borderBottom = "1px solid #dee2e6", T.style.background = "#f8f9fa";
                  const _ = document.createElement("div");
                  T.appendChild(_), C.appendChild(T);
                  const ee = new vn(_, {
                    data: M,
                    layout: "fitDataStretch",
                    initialSort: [
                      { column: "tradeDate", dir: "desc" }
                    ],
                    columns: [
                      {
                        title: "Side",
                        field: "buySell",
                        width: 80,
                        formatter: (N) => {
                          const $ = N.getValue();
                          return $ === "BUY" ? '<span style="color: #28a745; font-weight: bold;">BUY</span>' : $ === "SELL" ? '<span style="color: #dc3545; font-weight: bold;">SELL</span>' : $;
                        }
                      },
                      {
                        title: "Open/Close",
                        field: "openCloseIndicator",
                        width: 100,
                        formatter: (N) => {
                          const $ = N.getValue();
                          return $ === "O" ? '<span style="color: #17a2b8; font-weight: bold;">OPEN</span>' : $ === "C" ? '<span style="color: #6f42c1; font-weight: bold;">CLOSE</span>' : $;
                        }
                      },
                      {
                        title: "Symbol",
                        field: "symbol",
                        width: 150,
                        formatter: (N) => {
                          const $ = N.getValue();
                          if (!$) return '<span style="color: #6c757d; font-style: italic;">N/A</span>';
                          const he = tt($), de = b.value;
                          return he.map((Oe) => {
                            const fi = de.includes(Oe);
                            return `<span class="fi-tag" data-tag="${Oe}">${Oe}</span>`;
                          }).join(" ");
                        }
                      },
                      {
                        title: "Asset Class",
                        field: "assetCategory",
                        width: 120
                      },
                      {
                        title: "Quantity",
                        field: "quantity",
                        width: 100,
                        hozAlign: "right",
                        formatter: (N) => {
                          const $ = N.getRow().getData(), he = parseFloat(($ == null ? void 0 : $.quantity) || 0) || 0, de = parseFloat(($ == null ? void 0 : $.multiplier) || 1) || 1, Oe = he * de;
                          return Se(Oe);
                        }
                      },
                      {
                        title: "Price",
                        field: "tradePrice",
                        width: 100,
                        hozAlign: "right",
                        formatter: (N) => Y(parseFloat(N.getValue()))
                      },
                      {
                        title: "Trade Date",
                        field: "tradeDate",
                        width: 120,
                        hozAlign: "center",
                        formatter: (N) => {
                          const $ = N.getValue();
                          if (!$) return "";
                          const he = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(String($).trim());
                          let de;
                          if (he) {
                            const Oe = Number(he[1]), fi = Number(he[2]) - 1;
                            let Vt = Number(he[3]);
                            Vt < 100 && (Vt += 2e3), de = new Date(Vt, fi, Oe);
                          } else if (de = new Date($), isNaN(de.getTime())) return String($);
                          return de.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                        }
                      },
                      {
                        title: "Settle Date",
                        field: "settleDateTarget",
                        width: 120,
                        hozAlign: "center",
                        formatter: (N) => {
                          const $ = N.getValue();
                          if (!$) return "";
                          const he = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(String($).trim());
                          let de;
                          if (he) {
                            const Oe = Number(he[1]), fi = Number(he[2]) - 1;
                            let Vt = Number(he[3]);
                            Vt < 100 && (Vt += 2e3), de = new Date(Vt, fi, Oe);
                          } else if (de = new Date($), isNaN(de.getTime())) return String($);
                          return de.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                        }
                      },
                      {
                        title: "Total Premium",
                        field: "tradeMoney",
                        width: 120,
                        hozAlign: "right",
                        formatter: (N) => Y(parseFloat(N.getValue() || "0"))
                      },
                      {
                        title: "Net Cash",
                        field: "netCash",
                        width: 120,
                        hozAlign: "right",
                        formatter: (N) => Y(parseFloat(N.getValue() || "0"))
                      },
                      {
                        title: "Commission",
                        field: "ibCommission",
                        width: 100,
                        hozAlign: "right",
                        formatter: (N) => `<span style="color: #dc3545; font-weight: 600;">${Y(parseFloat(N.getValue() || "0"))}</span>`
                      },
                      {
                        title: "FIFO Realized",
                        field: "fifoPnlRealized",
                        width: 120,
                        hozAlign: "right",
                        formatter: (N) => {
                          const $ = parseFloat(N.getValue() || "0");
                          let he = "";
                          return $ > 0 ? he = "pnl-positive" : $ < 0 ? he = "pnl-negative" : he = "pnl-zero", `<span class="${he}" style="font-weight: 600;">${Y($)}</span>`;
                        }
                      },
                      {
                        title: "MTM PnL",
                        field: "mtmPnl",
                        width: 100,
                        hozAlign: "right",
                        formatter: (N) => Y(parseFloat(N.getValue() || "0"))
                      },
                      {
                        title: "Close Price",
                        field: "closePrice",
                        width: 100,
                        hozAlign: "right",
                        formatter: (N) => Y(parseFloat(N.getValue() || "0"))
                      },
                      {
                        title: "Trade ID",
                        field: "tradeID",
                        width: 150,
                        formatter: (N) => `<span style="font-size: 0.75rem; color: #6c757d;">${N.getValue()}</span>`
                      }
                    ]
                  });
                }
              }
            }
          } catch (p) {
            console.warn("Row formatter error:", p);
          }
        },
        rowClick: (m, p) => {
          try {
            const C = p.getData();
            C._isThesisGroup || (A("row-click", C), t.onRowClick && t.onRowClick(C));
          } catch (C) {
            console.warn("Row click error:", C);
          }
        },
        sortChanged: (m) => {
          if (m && m.length > 0) {
            const { field: p, dir: C } = m[0];
            An(p, C);
          } else {
            const p = new URL(window.location.href);
            p.searchParams.delete(`${o}_positions_sort`), window.history.replaceState({}, "", p.toString());
          }
        },
        movableColumns: !0
      }, y = sn();
      y && (k.initialSort = [
        { column: y.field, dir: y.dir }
      ]), L.value && (k.dataTree = !0, k.dataTreeChildField = "_children", k.dataTreeStartExpanded = !0, k.dataTreeChildIndent = 20, k.dataTreeElementColumn = "symbol", k.pagination = !1);
      try {
        v = new vn(B.value, k), v.on("columnResized", (m) => {
          const p = m.getField(), C = m.getWidth();
          se.value[p] = C, ot(se.value);
        }), v.on("tableBuilt", () => {
          var I, W, M;
          const m = (I = B.value) == null ? void 0 : I.querySelectorAll(".header-close-btn");
          m == null || m.forEach((T) => {
            T.addEventListener("click", (_) => {
              _.stopPropagation();
              const ee = _.target.getAttribute("data-field");
              ee && el(ee);
            });
          });
          const p = v.getColumn("computed_be_price");
          if (p) {
            const T = p.getWidth();
            p.updateDefinition({
              title: T >= 140 ? "Break even price" : "BE Price"
            }), v.redraw(!0);
          }
          const C = (W = B.value) == null ? void 0 : W.querySelectorAll(".header-rename-btn");
          C == null || C.forEach((T) => {
            T.addEventListener("click", (_) => {
              _.stopPropagation();
              const ee = _.target.getAttribute("data-field");
              if (ee) {
                const N = R.find(($) => $.field === ee);
                Ye(ee, H.value[ee] || ((N == null ? void 0 : N.label) ?? ee));
              }
            });
          });
          const U = (M = B.value) == null ? void 0 : M.querySelectorAll(".tabulator-col");
          U == null || U.forEach((T) => {
            T.addEventListener("click", (_) => {
              const ee = v.getSorters()[0];
              ee && An(ee.field, ee.dir);
            });
          }), FA();
        }), v.on("dataFiltered", function() {
          FA();
        }), BA.value = !0, setTimeout(() => {
          Re(), Cs(), FA();
        }, 50);
      } catch (m) {
        console.error("Error creating Tabulator:", m);
      }
    }
    const qt = AA(() => L.value ? tl.value : g.value), tl = AA(() => {
      if (!L.value || !g.value || !w.data.value)
        return g.value || [];
      let f = g.value.filter((M) => M.thesis && M.thesis.id);
      i.value && (f = f.filter((M) => (typeof M.legal_entity == "object" && M.legal_entity !== null ? M.legal_entity.name || M.legal_entity.id : M.legal_entity) === i.value)), f = f.filter((M) => {
        if (b.value.length > 0) {
          const T = M.symbol;
          if (!T) return !1;
          const _ = Ce(T);
          if (!b.value.every((N) => _.includes(N))) return !1;
        }
        if (F.value.length > 0) {
          const T = M.thesis;
          if (!T || !T.title || !F.value.includes(T.title)) return !1;
        }
        return !0;
      });
      const d = /* @__PURE__ */ new Map();
      (w.data.value || []).forEach((M) => {
        d.set(M.id, { ...M });
      });
      const Q = /* @__PURE__ */ new Map();
      f.forEach((M) => {
        const T = M.thesis.id;
        Q.has(T) || Q.set(T, []), Q.get(T).push(M);
      });
      const O = /* @__PURE__ */ new Map();
      function k(M, T = []) {
        const _ = d.get(M);
        if (!_) return null;
        const ee = {
          id: `thesis-${M}`,
          _isThesisGroup: !0,
          thesis: _,
          symbol: `📋 ${_.title}`,
          legal_entity: `${T.length} position${T.length !== 1 ? "s" : ""}`,
          _children: T.map((N) => ({
            ...N,
            id: `pos-${N.conid}-${N.internal_account_id}`
          }))
        };
        for (const N of n)
          ee[N] = T.reduce(($, he) => {
            const de = he[N];
            return $ + (typeof de == "number" && Number.isFinite(de) ? de : 0);
          }, 0);
        return ee;
      }
      function y(M, T) {
        for (const _ of n) {
          const ee = M[_] || 0, N = T[_] || 0;
          M[_] = ee + N;
        }
      }
      Q.forEach((M, T) => {
        const _ = k(T, M);
        _ && O.set(T, _);
      });
      const m = new Set(O.keys());
      function p(M) {
        const T = d.get(M);
        if (!T || !T.parent_thesis_id) return;
        const _ = T.parent_thesis_id;
        if (!O.has(_)) {
          const ee = k(_, []);
          ee && O.set(_, ee);
        }
        p(_);
      }
      m.forEach((M) => {
        p(M);
      });
      const C = /* @__PURE__ */ new Map();
      O.forEach((M, T) => {
        const _ = d.get(T);
        _ && _.parent_thesis_id && O.has(_.parent_thesis_id) && (C.has(_.parent_thesis_id) || C.set(_.parent_thesis_id, []), C.get(_.parent_thesis_id).push(M));
      });
      const U = /* @__PURE__ */ new Set();
      function I(M) {
        if (U.has(M)) return;
        U.add(M);
        const T = O.get(M);
        if (!T) return;
        const _ = C.get(M) || [];
        if (_.forEach((ee) => {
          I(ee.thesis.id);
        }), _.length > 0) {
          const ee = T._children.length + _.reduce((N, $) => {
            var de;
            const he = ((de = $.legal_entity.match(/\d+/)) == null ? void 0 : de[0]) || "0";
            return N + parseInt(he);
          }, 0);
          T.legal_entity = `${ee} position${ee !== 1 ? "s" : ""}`, _.forEach((N) => {
            y(T, N);
          }), T._children = [...T._children, ..._];
        }
      }
      O.forEach((M, T) => {
        const _ = d.get(T);
        _ && !_.parent_thesis_id && I(T);
      });
      const W = [];
      return O.forEach((M, T) => {
        const _ = d.get(T);
        _ && !_.parent_thesis_id && W.push(M);
      }), W;
    });
    function Re() {
      if (!(!v || !BA.value))
        try {
          L.value ? v.replaceData(qt.value) : (v.replaceData(qt.value), v.clearFilter(), v.setFilter((f) => {
            if (!f || i.value && (typeof f.legal_entity == "object" && f.legal_entity !== null ? f.legal_entity.name || f.legal_entity.id : f.legal_entity) !== i.value || s.value && f.asset_class !== s.value)
              return !1;
            if (b.value.length > 0) {
              const d = f.symbol;
              if (!d) return !1;
              const Q = Ce(d);
              if (!b.value.every((k) => Q.includes(k))) return !1;
            }
            if (F.value.length > 0) {
              const d = f.thesis;
              if (!d || !d.title || !F.value.includes(d.title)) return !1;
            }
            return !0;
          })), Al(), vt(() => {
            v && Cs(), FA();
          });
        } catch (f) {
          console.warn("Error in updateFilters:", f);
        }
    }
    function Al() {
      const f = [];
      i.value && f.push({ field: "legal_entity", value: i.value }), s.value && f.push({ field: "asset_class", value: s.value }), b.value.length > 0 && f.push({ field: "symbol", value: b.value.join(", ") }), F.value.length > 0 && f.push({ field: "thesis", value: F.value.join(", ") }), P.value = f;
    }
    function il(f) {
      if (f === "symbol")
        b.value = [];
      else if (f === "thesis")
        F.value = [];
      else if (f === "legal_entity") {
        i.value = null;
        const d = new URL(window.location.href);
        d.searchParams.delete(`${o}_all_cts_clientId`), window.history.replaceState({}, "", d.toString()), _e && _e.emit("account-filter-changed", {
          accountId: null,
          source: "positions"
        });
      } else f === "asset_class" && (s.value = null);
      Re();
    }
    function sl() {
      b.value = [], F.value = [], i.value = null, s.value = null;
      const f = new URL(window.location.href);
      f.searchParams.delete(`${o}_all_cts_clientId`), f.searchParams.delete(`${o}_all_cts_fi`), f.searchParams.delete(`${o}_all_cts_thesis`), f.searchParams.delete(`${o}_fac`), window.history.replaceState({}, "", f.toString()), _e && _e.emit("account-filter-changed", {
        accountId: null,
        source: "positions"
      }), Re();
    }
    const CA = J(!1), fs = J(null), gs = J(null), ps = J(!1), rn = J(null), Te = J(null), ms = J(!1), vA = J(null);
    async function rl(f) {
      rn.value = f, ps.value = !0, Te.value = null, vA.value = null, ms.value = !0;
      try {
        const d = f.internal_account_id, Q = f.conid, O = Math.abs(f.qty), k = f.qty > 0 ? "SELL" : "BUY", { data: y, error: m } = await At.schema("hf").from("user_accounts_master").select("broker_account_id, api_url").eq("internal_account_id", d).single();
        if (m || !y)
          throw new Error(`Account not found: ${(m == null ? void 0 : m.message) || "No account data"}`);
        const p = y.broker_account_id, U = `${y.api_url}/api/margin-impact?conid=${Q}&side=${k}&quantity=${O}&account_id=${p}`, W = await (await fetch(U)).json();
        Te.value = W;
      } catch (d) {
        vA.value = d.message;
      } finally {
        ms.value = !1;
      }
    }
    function nn() {
      ps.value = !1, rn.value = null, Te.value = null, vA.value = null;
    }
    function nl() {
      CA.value = !CA.value;
    }
    function on() {
      CA.value = !1;
    }
    function an(f) {
      CA.value && gs.value && fs.value && !gs.value.contains(f.target) && !fs.value.contains(f.target) && on();
    }
    const Bt = J(!1), Pt = J(null), si = J(""), lt = J(/* @__PURE__ */ new Set()), eA = zm(t.accountId, t.userId), ol = AA(() => {
      if (!eA.data.value) return [];
      const f = si.value.toLowerCase().trim();
      if (!f) return eA.data.value;
      const d = f.split(",").map((Q) => Q.trim()).filter(Boolean);
      return eA.data.value.filter((Q) => {
        const O = tt(Q.symbol).map((k) => k.toLowerCase());
        return d.every((k) => O.some((y) => y.includes(k)) || Q.symbol.toLowerCase().includes(k) || Q.assetCategory.toLowerCase().includes(k) || Q.buySell.toLowerCase().includes(k) || Q.tradeDate.includes(k) || Q.description && Q.description.toLowerCase().includes(k) || Q.tradeID && Q.tradeID.toLowerCase().includes(k));
      });
    }), ln = Vl(t.userId), ws = AA(() => ln.data.value || /* @__PURE__ */ new Map());
    function EA(f) {
      return Gl({
        internal_account_id: f.internal_account_id,
        symbol: f.symbol,
        qty: f.qty,
        asset_class: f.asset_class,
        conid: f.conid
      });
    }
    function al(f) {
      Pt.value = f, si.value = "";
      const d = EA(f);
      lt.value = new Set(ws.value.get(d) || []), Bt.value = !0;
    }
    function hn(f) {
      lt.value.has(f) ? lt.value.delete(f) : lt.value.add(f);
    }
    const bs = J(!1);
    async function ll() {
      if (!Pt.value || !t.userId) return;
      if (bs.value) {
        console.log("⚠️ Save already in progress, skipping...");
        return;
      }
      const f = EA(Pt.value);
      try {
        await Wl(
          At,
          t.userId,
          f,
          lt.value
        ), await Ai.invalidateQueries({ queryKey: ["positionTradeMappings"] }), await ln.refetch(), Bt.value = !1, at(), ke("success", "Trades Attached", `${lt.value.size} trade(s) attached to position`);
      } catch (d) {
        console.error("Error saving trade mappings:", d), ke("error", "Failed to Save", d.message);
      }
    }
    const tA = J(!1);
    Ge([() => c.isSuccess.value, B], async ([f, d]) => {
      f && d && !tA.value && (await vt(), console.log("🚀 Initializing Tabulator with data:", qt.value.length, "rows"), at(), tA.value = !0);
    }, { immediate: !0 }), Ge(qt, async (f) => {
      if (!(!v || !f))
        try {
          L.value && !v.options.dataTree || !L.value && v.options.dataTree ? at() : v.replaceData(f), await vt(), Cs();
        } catch (d) {
          console.warn("Error updating table data:", d);
          try {
            at();
          } catch (Q) {
            console.error("Failed to rebuild table:", Q);
          }
        }
    }, { deep: !0 }), Ge(G, async (f) => {
      if (un(f), !!v)
        try {
          at();
        } catch (d) {
          console.warn("Error updating column visibility:", d);
        }
    }, { deep: !0 }), Ge(b, () => {
      Bs(), v && BA.value && (Re(), v.redraw(!0));
    }, { deep: !0 }), Ge(F, () => {
      Bs(), Re(), v && v.redraw(!0);
    }, { deep: !0 }), Ge(s, () => {
      Bs(), Re(), v && v.redraw(!0);
    }), Ge(L, async (f) => {
      ul(f), v && (v.destroy(), v = null), await vt(), at();
    });
    function un(f) {
      const d = new URL(window.location.href);
      d.searchParams.set(`${o}_position_cols`, f.join("-and-")), window.history.replaceState({}, "", d.toString());
    }
    function cn() {
      const f = new URL(window.location.href), d = f.searchParams.get(`${o}_all_cts_fi`), Q = d ? d.split("-and-").join(",") : void 0, O = f.searchParams.get(`${o}_fac`) || void 0, k = f.searchParams.get(`${o}_all_cts_clientId`) || void 0, y = f.searchParams.get(`${o}_all_cts_thesis`), m = y ? y.split("-and-").join(",") : void 0;
      return { symbol: Q, asset_class: O, legal_entity: k, thesis: m };
    }
    function Bs() {
      const f = new URL(window.location.href);
      b.value.length > 0 ? f.searchParams.set(`${o}_all_cts_fi`, b.value.join("-and-")) : f.searchParams.delete(`${o}_all_cts_fi`), F.value.length > 0 ? f.searchParams.set(`${o}_all_cts_thesis`, F.value.join("-and-")) : f.searchParams.delete(`${o}_all_cts_thesis`), s.value ? f.searchParams.set(`${o}_fac`, s.value) : f.searchParams.delete(`${o}_fac`), window.history.replaceState({}, "", f.toString());
    }
    function hl() {
      return new URL(window.location.href).searchParams.get(`${o}_group_by_thesis`) === "true";
    }
    function ul(f) {
      const d = new URL(window.location.href);
      f ? d.searchParams.set(`${o}_group_by_thesis`, "true") : d.searchParams.delete(`${o}_group_by_thesis`), window.history.replaceState({}, "", d.toString());
    }
    const _e = Zs("eventBus"), Kt = J("Positions"), ri = J(!1), ni = J("");
    function dn() {
      return new URL(window.location.href).searchParams.get(`${o}_positions_app_name`) || "Positions";
    }
    function cl(f) {
      const d = new URL(window.location.href);
      f && f.trim() && f !== "Positions" ? d.searchParams.set(`${o}_positions_app_name`, f.trim()) : d.searchParams.delete(`${o}_positions_app_name`), window.history.replaceState({}, "", d.toString());
    }
    function dl() {
      ni.value = Kt.value, ri.value = !0;
    }
    function fl() {
      Kt.value = ni.value.trim() || "Positions", cl(Kt.value), ri.value = !1;
    }
    function fn(f) {
      f.key === "Escape" && Bt.value && (Bt.value = !1);
    }
    Ll(async () => {
      document.addEventListener("click", an), document.addEventListener("keydown", fn), Kt.value = dn(), console.log("📍 [Positions] Mounted component, initializing filters from URL", t);
      const f = cn();
      f.symbol && (b.value = f.symbol.split(",").map((d) => d.trim())), f.thesis && (F.value = f.thesis.split(",").map((d) => d.trim())), f.legal_entity && (i.value = f.legal_entity), f.asset_class && (s.value = f.asset_class), H.value = le(), L.value = hl(), c.isSuccess.value && B.value && !tA.value && (await vt(), console.log("🚀 Initializing Tabulator on mount with data:", qt.value.length, "rows"), at(), tA.value = !0), Re(), _e && (_e.on("account-filter-changed", gn), _e.on("symbol-filter-changed", pn)), vt(() => {
        FA();
      });
    }), Il(() => {
      document.removeEventListener("click", an), document.removeEventListener("keydown", fn), v && v.destroy(), _e && (_e.off("account-filter-changed", gn), _e.off("symbol-filter-changed", pn));
    });
    function gn(f) {
      if (console.log("📍 [Positions] Received account filter:", f), f.source === "positions") return;
      i.value = f.accountId;
      const d = new URL(window.location.href);
      f.accountId ? d.searchParams.set(`${o}_all_cts_clientId`, f.accountId) : d.searchParams.delete(`${o}_all_cts_clientId`), window.history.replaceState({}, "", d.toString()), Re();
    }
    function pn(f) {
      if (console.log("📍 [Positions] Received symbol filter:", f), f.source === "positions") return;
      b.value = f.symbolTags;
      const d = new URL(window.location.href);
      f.symbolTags.length > 0 ? d.searchParams.set(`${o}_all_cts_fi`, f.symbolTags.join("-and-")) : d.searchParams.delete(`${o}_all_cts_fi`), window.history.replaceState({}, "", d.toString()), Re();
    }
    function gl() {
      typeof window < "u" && window.$router ? window.$router.push("/positions") : window.location.href = "/positions";
    }
    function Cs() {
      if (!(!v || !BA.value))
        try {
          v.redraw();
        } catch (f) {
          console.warn("Error in toggleBottomCalc:", f);
        }
    }
    function vs(f, d) {
      if (f === "symbol") {
        const Q = String(d).trim(), O = b.value.indexOf(Q);
        O >= 0 ? b.value.splice(O, 1) : b.value.push(Q), Re(), _e && _e.emit("symbol-filter-changed", {
          symbolTags: b.value,
          source: "positions"
        });
        return;
      } else if (f === "thesis") {
        const Q = (d == null ? void 0 : d.title) || String(d), O = F.value.indexOf(Q);
        O >= 0 ? F.value.splice(O, 1) : F.value.push(Q), Re();
        return;
      } else if (f === "legal_entity") {
        const Q = String(d);
        i.value = Q;
        const O = new URL(window.location.href);
        O.searchParams.set(`${o}_all_cts_clientId`, Q), window.history.replaceState({}, "", O.toString()), Re(), _e && _e.emit("account-filter-changed", {
          accountId: Q,
          source: "positions"
        });
        return;
      } else if (f === "asset_class") {
        const Q = String(d);
        s.value = Q, Re();
        return;
      }
    }
    const yA = J(null);
    function pl(f) {
      yA.value = f;
    }
    function ml(f) {
      f.preventDefault();
    }
    function wl(f) {
      if (yA.value === null || yA.value === f) return;
      const d = [...G.value], [Q] = d.splice(yA.value, 1);
      d.splice(f, 0, Q), G.value = d, yA.value = null;
    }
    function bl(f) {
      if (f <= 0) return;
      const d = [...G.value];
      [d[f - 1], d[f]] = [d[f], d[f - 1]], G.value = d;
    }
    function Bl(f) {
      if (f >= G.value.length - 1) return;
      const d = [...G.value];
      [d[f], d[f + 1]] = [d[f + 1], d[f]], G.value = d;
    }
    Ge(
      [() => c.isSuccess.value, i, b, F, L],
      async ([f]) => {
        f && tA.value && (Re(), v && v.redraw(!0));
      },
      { immediate: !0 }
    ), Ge([() => c.isSuccess.value, tA], ([f, d]) => {
      f && d && Re();
    }), window.addEventListener("popstate", () => {
      const f = cn();
      b.value = f.symbol ? f.symbol.split(",").map((Q) => Q.trim()) : [], F.value = f.thesis ? f.thesis.split(",").map((Q) => Q.trim()) : [], i.value = f.legal_entity || null, H.value = le(), Re();
      const d = sn();
      v && d && v.setSort(d.field, d.dir), Kt.value = dn();
    });
    function we(f) {
      const d = R.find((Q) => Q.field === f);
      return H.value[f] || ((d == null ? void 0 : d.label) ?? f);
    }
    const Es = J(!1), ys = J(null), Cl = J(""), oi = J("");
    async function vl() {
      if (console.log("Saving account alias:", t.userId, "for account ID:", ys.value), !(!t.userId || !ys.value))
        try {
          const { error: f } = await At.schema("hf").from("user_account_alias").upsert({
            user_id: t.userId,
            internal_account_id: ys.value,
            alias: oi.value,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }, { onConflict: "user_id,internal_account_id" });
          if (f) throw f;
          Es.value = !1, await Ai.invalidateQueries({ queryKey: ["positions"] }), ke("success", "Account renamed", `Account name updated to "${oi.value}"`);
        } catch (f) {
          ke("error", "Rename failed", f.message);
        }
    }
    const Fs = J(0);
    function FA() {
      if (!v) {
        Fs.value = 0;
        return;
      }
      const f = v.rowManager.getDisplayRows().filter((d) => d.type === "row");
      Fs.value = f.length;
    }
    const ai = J(!1), li = J([]), Ct = J(null), Qs = J(!1), hi = J(!1), QA = J(!1), UA = J(""), ui = J(!1), ci = J(""), Us = J(null);
    function El() {
      UA.value = "", QA.value = !0;
    }
    async function yl() {
      if (!B.value) {
        QA.value = !1;
        return;
      }
      QA.value = !1, hi.value = !0;
      try {
        const d = (await km(B.value)).toDataURL("image/png"), { error: Q } = await At.schema("hf").from("position_screenshots").insert([{
          user_id: t.userId,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          image_data: d.replace(/^data:image\/png;base64,/, ""),
          name: UA.value ? UA.value.trim() : null,
          archived: !1,
          meta: {
            filters: {
              account: i.value,
              assetClass: s.value,
              symbolTags: b.value,
              thesisTags: F.value,
              columns: G.value
            }
          }
        }]);
        if (Q) throw Q;
        ke("success", "Screenshot saved!"), di();
      } catch (f) {
        ke("error", "Screenshot failed", f.message);
      } finally {
        hi.value = !1;
      }
    }
    async function Fl(f) {
      try {
        const { error: d } = await At.schema("hf").from("position_screenshots").update({ archived: !0 }).eq("id", f);
        if (d) throw d;
        ke("success", "Screenshot archived"), di();
      } catch (d) {
        ke("error", "Archive failed", d.message);
      }
    }
    async function di() {
      if (!t.userId) {
        li.value = [];
        return;
      }
      Qs.value = !0;
      const { data: f, error: d } = await At.schema("hf").from("position_screenshots").select("*").eq("user_id", t.userId).eq("archived", !1).order("created_at", { ascending: !1 }).limit(20);
      d || (li.value = f || []), Qs.value = !1;
    }
    function Ql(f) {
      Us.value = f.id, ci.value = f.name || "", ui.value = !0;
    }
    async function Ul() {
      if (Us.value)
        try {
          const { error: f } = await At.schema("hf").from("position_screenshots").update({ name: ci.value }).eq("id", Us.value);
          if (f) throw f;
          ui.value = !1, ke("success", "Screenshot renamed"), di();
        } catch (f) {
          ke("error", "Rename failed", f.message);
        }
    }
    function Hl(f) {
      if (!f) return "";
      const d = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(String(f).trim());
      let Q;
      if (d) {
        const m = parseInt(d[1]), p = parseInt(d[2]) - 1;
        let C = parseInt(d[3]);
        C < 100 && (C = 2e3 + C), Q = new Date(C, p, m);
      } else if (Q = new Date(f), isNaN(Q.getTime())) return String(f);
      const O = Q.getFullYear(), k = (Q.getMonth() + 1).toString().padStart(2, "0"), y = Q.getDate().toString().padStart(2, "0");
      return `${O}-${k}-${y}`;
    }
    return Ge(ai, (f) => {
      f && di();
    }), Ge(l, () => {
      c.refetch && c.refetch();
    }), Ge(z, () => {
      v && v.redraw(!0);
    }, { deep: !0 }), (f, d) => {
      var Q, O, k;
      return V(), K(ht, null, [
        E("div", Gm, [
          Et(c).isLoading.value ? (V(), K("div", Wm, [...d[28] || (d[28] = [
            E("div", { class: "loading-spinner" }, null, -1),
            ut(" Loading positions... ", -1)
          ])])) : Et(c).isError.value ? (V(), K("div", Xm, [
            d[29] || (d[29] = E("h3", null, "Error loading positions", -1)),
            E("p", null, te(Et(c).error.value), 1)
          ])) : Et(c).isSuccess.value ? (V(), K("div", Jm, [
            E("div", jm, [
              E("h2", null, [
                r.showHeaderLink ? (V(), K("span", {
                  key: 0,
                  class: "positions-link",
                  onClick: gl
                }, te(Kt.value), 1)) : (V(), K("span", Ym, te(Kt.value), 1)),
                E("button", {
                  class: "appname-rename-btn",
                  onClick: dl,
                  title: "Rename app",
                  style: { width: "auto", padding: "2px 7px", "font-size": "13px", background: "none", border: "none", color: "#888", cursor: "pointer" }
                }, "✎")
              ]),
              E("div", Zm, [
                d[30] || (d[30] = E("label", { for: "asOfDate" }, "As of:", -1)),
                ct(E("input", {
                  id: "asOfDate",
                  type: "date",
                  "onUpdate:modelValue": d[0] || (d[0] = (y) => l.value = y),
                  max: Et(a),
                  style: { "margin-left": "0.5em" }
                }, null, 8, $m), [
                  [Nt, l.value]
                ]),
                l.value ? (V(), K("button", {
                  key: 0,
                  onClick: h,
                  style: { "margin-left": "0.5em" }
                }, "Clear")) : ge("", !0),
                Et(c).isFetching.value ? (V(), K("span", qm, "Loading...")) : ge("", !0)
              ]),
              E("div", ew, [
                E("div", tw, te(Fs.value) + " positions", 1),
                E("button", {
                  onClick: El,
                  class: "screenshot-btn",
                  title: "Take Screenshot",
                  disabled: hi.value
                }, [
                  hi.value ? (V(), K("span", iw)) : (V(), K("span", sw, "📸"))
                ], 8, Aw),
                E("button", {
                  onClick: d[1] || (d[1] = (y) => ai.value = !0),
                  class: "screenshot-btn",
                  title: "See Old Screenshots"
                }, "🖼️"),
                E("button", {
                  class: gi(["thesis-group-btn", { active: L.value }]),
                  onClick: d[2] || (d[2] = (y) => L.value = !L.value),
                  title: "Group positions by thesis"
                }, [
                  d[31] || (d[31] = E("span", { class: "icon" }, "📊", -1)),
                  ut(" " + te(L.value ? "Ungroup" : "Group by Thesis"), 1)
                ], 2),
                E("button", {
                  ref_key: "columnsBtnRef",
                  ref: fs,
                  class: "columns-btn",
                  onClick: Ve(nl, ["stop"])
                }, [...d[32] || (d[32] = [
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
                  onClick: d[3] || (d[3] = (y) => A("maximize")),
                  class: "minimize-button",
                  title: "Maximize"
                }, " ⤢ "),
                E("button", {
                  onClick: d[4] || (d[4] = (y) => A("minimize")),
                  class: "minimize-button",
                  title: "Close"
                }, " X "),
                CA.value ? (V(), K("div", {
                  key: 0,
                  ref_key: "columnsPopupRef",
                  ref: gs,
                  class: "columns-popup",
                  onClick: d[8] || (d[8] = Ve(() => {
                  }, ["stop"]))
                }, [
                  d[33] || (d[33] = E("div", { class: "popup-header" }, "Columns", -1)),
                  E("div", rw, [
                    (V(!0), K(ht, null, yt(G.value.map((y) => R.find((m) => m.field === y)).filter(Boolean), (y, m) => (V(), K("label", {
                      key: y.field,
                      class: "popup-item",
                      draggable: "true",
                      onDragstart: (p) => pl(m),
                      onDragover: ml,
                      onDrop: (p) => wl(m),
                      style: { "align-items": "center" }
                    }, [
                      ct(E("input", {
                        type: "checkbox",
                        value: y.field,
                        "onUpdate:modelValue": d[5] || (d[5] = (p) => G.value = p)
                      }, null, 8, ow), [
                        [mn, G.value]
                      ]),
                      E("span", null, [
                        ut(te(H.value[y.field] || y.label) + " ", 1),
                        H.value[y.field] ? (V(), K("span", aw, " (" + te(y.label) + ") ", 1)) : ge("", !0)
                      ]),
                      E("button", {
                        class: "col-rename-btn",
                        type: "button",
                        onClick: Ve((p) => Ye(y.field, H.value[y.field] || y.label), ["stop"]),
                        title: "Rename column",
                        style: { "margin-left": "6px", "font-size": "13px", background: "none", border: "none", color: "#888", cursor: "pointer" }
                      }, "✎", 8, lw),
                      E("span", hw, [
                        E("button", {
                          type: "button",
                          onClick: Ve((p) => bl(m), ["stop"]),
                          disabled: m === 0,
                          title: "Move up",
                          style: { background: "none", border: "none", cursor: "pointer", padding: "0", "margin-bottom": "2px" }
                        }, " ▲ ", 8, uw),
                        E("button", {
                          type: "button",
                          onClick: Ve((p) => Bl(m), ["stop"]),
                          disabled: m === G.value.length - 1,
                          title: "Move down",
                          style: { background: "none", border: "none", cursor: "pointer", padding: "0" }
                        }, " ▼ ", 8, cw)
                      ])
                    ], 40, nw))), 128)),
                    (V(!0), K(ht, null, yt(R.filter((y) => !G.value.includes(y.field)), (y) => (V(), K("label", {
                      key: y.field,
                      class: "popup-item"
                    }, [
                      ct(E("input", {
                        type: "checkbox",
                        value: y.field,
                        "onUpdate:modelValue": d[6] || (d[6] = (m) => G.value = m)
                      }, null, 8, dw), [
                        [mn, G.value]
                      ]),
                      E("span", null, te(y.label), 1)
                    ]))), 128))
                  ]),
                  E("div", fw, [
                    E("button", {
                      class: "btn btn-clear",
                      onClick: d[7] || (d[7] = (y) => G.value = R.map((m) => m.field))
                    }, "Show All"),
                    E("button", {
                      class: "btn",
                      onClick: on
                    }, "Done")
                  ])
                ], 512)) : ge("", !0)
              ])
            ]),
            P.value.length ? (V(), K("div", gw, [
              d[34] || (d[34] = E("span", { class: "filters-label" }, "Filtered by:", -1)),
              E("div", pw, [
                (V(!0), K(ht, null, yt(P.value, (y) => (V(), K("span", {
                  key: `${y.field}-${y.value}`,
                  class: "filter-tag"
                }, [
                  E("strong", null, te(y.field === "symbol" ? "Financial Instrument" : y.field === "legal_entity" ? "Account" : y.field === "thesis" ? "Thesis" : "Asset Class") + ":", 1),
                  ut(" " + te(y.value) + " ", 1),
                  E("button", {
                    class: "tag-clear",
                    onClick: (m) => il(y.field)
                  }, "✕", 8, mw)
                ]))), 128)),
                E("button", {
                  class: "btn btn-clear-all",
                  onClick: sl
                }, "Clear all")
              ])
            ])) : ge("", !0),
            E("div", {
              ref_key: "tableDiv",
              ref: B,
              class: "positions-grid"
            }, null, 512)
          ])) : ge("", !0),
          E("div", ww, [
            Ml(Sl, {
              name: "toast",
              tag: "div"
            }, {
              default: Dl(() => [
                (V(!0), K(ht, null, yt(ii.value, (y) => (V(), K("div", {
                  key: y.id,
                  class: gi(["toast", `toast-${y.type}`]),
                  onClick: (m) => ds(y.id)
                }, [
                  E("div", Bw, [
                    y.type === "success" ? (V(), K("span", Cw, "✅")) : y.type === "error" ? (V(), K("span", vw, "❌")) : y.type === "warning" ? (V(), K("span", Ew, "⚠️")) : (V(), K("span", yw, "ℹ️"))
                  ]),
                  E("div", Fw, [
                    E("div", Qw, te(y.title), 1),
                    y.message ? (V(), K("div", Uw, te(y.message), 1)) : ge("", !0)
                  ]),
                  E("button", {
                    class: "toast-close",
                    onClick: Ve((m) => ds(y.id), ["stop"])
                  }, "×", 8, Hw)
                ], 10, bw))), 128))
              ]),
              _: 1
            })
          ]),
          Es.value ? (V(), K("div", xw, [
            E("div", Rw, [
              d[35] || (d[35] = E("h3", null, "Rename Account", -1)),
              ct(E("input", {
                "onUpdate:modelValue": d[9] || (d[9] = (y) => oi.value = y),
                placeholder: Cl.value
              }, null, 8, Tw), [
                [Nt, oi.value]
              ]),
              E("div", Lw, [
                E("button", { onClick: vl }, "Save"),
                E("button", {
                  onClick: d[10] || (d[10] = (y) => Es.value = !1)
                }, "Cancel")
              ])
            ])
          ])) : ge("", !0),
          j.value ? (V(), K("div", Iw, [
            E("div", Mw, [
              d[36] || (d[36] = E("h3", null, "Rename Column", -1)),
              ct(E("input", {
                "onUpdate:modelValue": d[11] || (d[11] = (y) => ce.value = y),
                placeholder: "Column name"
              }, null, 512), [
                [Nt, ce.value]
              ]),
              E("div", { class: "dialog-actions" }, [
                E("button", { onClick: He }, "Save"),
                E("button", { onClick: xe }, "Cancel")
              ])
            ])
          ])) : ge("", !0),
          ai.value ? (V(), K("div", Sw, [
            E("div", Dw, [
              d[38] || (d[38] = E("h3", { class: "screenshots-title" }, "Past Screenshots", -1)),
              Qs.value ? (V(), K("div", kw, "Loading screenshots...")) : li.value.length === 0 ? (V(), K("div", _w, "No screenshots yet.")) : (V(), K("div", Ow, [
                (V(!0), K(ht, null, yt(li.value, (y) => (V(), K("div", {
                  key: y.id,
                  class: "screenshot-list-item",
                  onClick: (m) => Ct.value = y
                }, [
                  E("img", {
                    src: `data:image/png;base64,${y.image_data}`,
                    class: "screenshot-thumb",
                    alt: `Screenshot taken at ${new Date(y.created_at).toLocaleString()}`
                  }, null, 8, Kw),
                  E("div", Vw, [
                    y.name ? (V(), K("strong", Nw, te(y.name), 1)) : (V(), K("span", zw, "(Unnamed)")),
                    E("span", null, [
                      ut(te(new Date(y.created_at).toLocaleString("en-US", {
                        timeZone: "America/Los_Angeles",
                        dateStyle: "medium",
                        timeStyle: "short"
                      })) + " ", 1),
                      d[37] || (d[37] = E("span", { style: { color: "#888", "font-size": "12px" } }, "PST", -1))
                    ]),
                    E("div", Gw, [
                      E("a", {
                        href: `data:image/png;base64,${y.image_data}`,
                        download: `positions-screenshot-${y.id}.png`,
                        class: "screenshot-download-link",
                        onClick: d[12] || (d[12] = Ve(() => {
                        }, ["stop"]))
                      }, "⬇️", 8, Ww),
                      E("button", {
                        class: "screenshot-archive-btn",
                        onClick: Ve((m) => Fl(y.id), ["stop"]),
                        title: "Archive screenshot",
                        style: { background: "none", border: "1px solid #e9ecef", padding: "4px 8px", "border-radius": "6px", cursor: "pointer" }
                      }, " 🗄️ ", 8, Xw),
                      E("button", {
                        class: "screenshot-rename-btn",
                        onClick: Ve((m) => Ql(y), ["stop"]),
                        title: "Rename screenshot",
                        style: { background: "none", border: "1px solid #e9ecef", padding: "4px 8px", "border-radius": "6px", cursor: "pointer" }
                      }, " ✏️ ", 8, Jw)
                    ])
                  ])
                ], 8, Pw))), 128))
              ])),
              E("div", jw, [
                E("button", {
                  onClick: d[13] || (d[13] = (y) => ai.value = !1),
                  class: "screenshots-close"
                }, "Close")
              ])
            ]),
            Ct.value ? (V(), K("div", {
              key: 0,
              class: "screenshot-preview-modal",
              onClick: d[15] || (d[15] = Ve((y) => Ct.value = null, ["self"]))
            }, [
              E("div", Yw, [
                E("img", {
                  src: `data:image/png;base64,${Ct.value.image_data}`,
                  class: "screenshot-full-img"
                }, null, 8, Zw),
                E("div", $w, [
                  E("span", null, [
                    ut(te(new Date(Ct.value.created_at).toLocaleString("en-US", {
                      timeZone: "America/Los_Angeles",
                      dateStyle: "medium",
                      timeStyle: "short"
                    })) + " ", 1),
                    d[39] || (d[39] = E("span", { style: { color: "#888", "font-size": "12px" } }, "PST", -1))
                  ]),
                  E("a", {
                    href: `data:image/png;base64,${Ct.value.image_data}`,
                    download: `positions-screenshot-${Ct.value.id}.png`,
                    class: "screenshot-download-link"
                  }, "⬇️ Download", 8, qw),
                  E("button", {
                    onClick: d[14] || (d[14] = (y) => Ct.value = null),
                    class: "screenshot-preview-close"
                  }, "Close")
                ])
              ])
            ])) : ge("", !0)
          ])) : ge("", !0),
          QA.value ? (V(), K("div", eb, [
            E("div", tb, [
              d[40] || (d[40] = E("h3", null, "Name screenshot", -1)),
              ct(E("input", {
                "onUpdate:modelValue": d[16] || (d[16] = (y) => UA.value = y),
                placeholder: "Enter a name (optional)"
              }, null, 512), [
                [Nt, UA.value]
              ]),
              E("div", Ab, [
                E("button", { onClick: yl }, "Save & Capture"),
                E("button", {
                  onClick: d[17] || (d[17] = (y) => QA.value = !1)
                }, "Cancel")
              ])
            ])
          ])) : ge("", !0),
          ui.value ? (V(), K("div", ib, [
            E("div", sb, [
              d[41] || (d[41] = E("h3", null, "Rename Screenshot", -1)),
              ct(E("input", {
                "onUpdate:modelValue": d[18] || (d[18] = (y) => ci.value = y),
                placeholder: "Enter new name"
              }, null, 512), [
                [Nt, ci.value]
              ]),
              E("div", rb, [
                E("button", { onClick: Ul }, "Save"),
                E("button", {
                  onClick: d[19] || (d[19] = (y) => ui.value = !1)
                }, "Cancel")
              ])
            ])
          ])) : ge("", !0)
        ]),
        ps.value ? (V(), K("div", {
          key: 0,
          class: "modal-overlay",
          onClick: nn
        }, [
          E("div", {
            class: "modal-content",
            onClick: d[20] || (d[20] = Ve(() => {
            }, ["stop"]))
          }, [
            E("div", { class: "modal-header" }, [
              d[42] || (d[42] = E("h3", null, "Margin Impact", -1)),
              E("button", {
                class: "modal-close",
                onClick: nn
              }, "×")
            ]),
            E("div", nb, [
              d[48] || (d[48] = E("p", null, "Closing out this position would have the following impact on your margin requirements:", -1)),
              ms.value ? (V(), K("div", ob, [...d[43] || (d[43] = [
                E("div", { class: "loading-spinner" }, null, -1),
                ut(" Loading margin impact data... ", -1)
              ])])) : vA.value ? (V(), K("div", ab, " Error loading margin impact: " + te(vA.value), 1)) : Te.value ? (V(), K("div", hb, [
                E("table", ub, [
                  d[47] || (d[47] = E("thead", null, [
                    E("tr", null, [
                      E("th", null, "Account Metric"),
                      E("th", null, "Current"),
                      E("th", null, "Change"),
                      E("th", null, "Post-Trade")
                    ])
                  ], -1)),
                  E("tbody", null, [
                    (Q = Te.value.margin_impact) != null && Q.equity_with_loan ? (V(), K("tr", cb, [
                      d[44] || (d[44] = E("td", null, "Equity with Loan", -1)),
                      E("td", null, te(Te.value.margin_impact.equity_with_loan.current), 1),
                      E("td", null, te(Te.value.margin_impact.equity_with_loan.change), 1),
                      E("td", null, te(Te.value.margin_impact.equity_with_loan.post_trade), 1)
                    ])) : ge("", !0),
                    (O = Te.value.margin_impact) != null && O.initial_margin ? (V(), K("tr", db, [
                      d[45] || (d[45] = E("td", null, "Initial Margin", -1)),
                      E("td", null, te(Te.value.margin_impact.initial_margin.current), 1),
                      E("td", null, te(Te.value.margin_impact.initial_margin.change), 1),
                      E("td", null, te(Te.value.margin_impact.initial_margin.post_trade), 1)
                    ])) : ge("", !0),
                    (k = Te.value.margin_impact) != null && k.maintenance_margin ? (V(), K("tr", fb, [
                      d[46] || (d[46] = E("td", null, "Maintenance Margin", -1)),
                      E("td", null, te(Te.value.margin_impact.maintenance_margin.current), 1),
                      E("td", null, te(Te.value.margin_impact.maintenance_margin.change), 1),
                      E("td", null, te(Te.value.margin_impact.maintenance_margin.post_trade), 1)
                    ])) : ge("", !0)
                  ])
                ])
              ])) : (V(), K("div", lb, " No margin impact data available "))
            ])
          ])
        ])) : ge("", !0),
        ri.value ? (V(), K("div", gb, [
          E("div", pb, [
            d[49] || (d[49] = E("h3", null, "Rename App", -1)),
            ct(E("input", {
              "onUpdate:modelValue": d[21] || (d[21] = (y) => ni.value = y),
              placeholder: "App name"
            }, null, 512), [
              [Nt, ni.value]
            ]),
            E("div", mb, [
              E("button", { onClick: fl }, "Save"),
              E("button", {
                onClick: d[22] || (d[22] = (y) => ri.value = !1)
              }, "Cancel")
            ])
          ])
        ])) : ge("", !0),
        Bt.value ? (V(), K("div", {
          key: 2,
          class: "modal-overlay",
          onClick: d[27] || (d[27] = (y) => Bt.value = !1)
        }, [
          E("div", {
            class: "modal-content trade-attach-modal",
            onClick: d[26] || (d[26] = Ve(() => {
            }, ["stop"]))
          }, [
            E("div", wb, [
              d[50] || (d[50] = E("h3", null, "Attach Trades to Position", -1)),
              E("button", {
                class: "modal-close",
                onClick: d[23] || (d[23] = (y) => Bt.value = !1)
              }, "×")
            ]),
            E("div", bb, [
              Pt.value ? (V(), K("div", Bb, [
                d[51] || (d[51] = E("strong", null, "Position: ", -1)),
                (V(!0), K(ht, null, yt(Ce(Pt.value.symbol), (y) => (V(), K("span", {
                  key: y,
                  class: "fi-tag position-tag"
                }, te(y), 1))), 128)),
                ut(" • (Qty: " + te(Pt.value.qty) + " . Avg price: " + te(Y(Pt.value.avgPrice)) + ") ", 1)
              ])) : ge("", !0),
              E("div", Cb, [
                ct(E("input", {
                  "onUpdate:modelValue": d[24] || (d[24] = (y) => si.value = y),
                  type: "text",
                  placeholder: "Search trades (e.g., 'META, BUY' or 'OPT, 31-OCT-2025')...",
                  class: "search-input"
                }, null, 512), [
                  [Nt, si.value]
                ]),
                d[52] || (d[52] = E("div", { class: "search-hint" }, " 💡 Use commas to search multiple terms. All terms must match. ", -1))
              ]),
              Et(eA).isLoading.value ? (V(), K("div", vb, [...d[53] || (d[53] = [
                E("div", { class: "loading-spinner" }, null, -1),
                ut(" Loading trades... ", -1)
              ])])) : Et(eA).isError.value ? (V(), K("div", Eb, " Error loading trades ")) : (V(), K("div", yb, [
                (V(!0), K(ht, null, yt(ol.value, (y) => (V(), K("div", {
                  key: y.tradeID || y.id,
                  class: gi(["trade-item", { selected: y.tradeID && lt.value.has(y.tradeID) }]),
                  onClick: (m) => y.tradeID && hn(y.tradeID)
                }, [
                  y.tradeID ? (V(), K("input", {
                    key: 0,
                    type: "checkbox",
                    checked: lt.value.has(y.tradeID),
                    onClick: Ve((m) => hn(y.tradeID), ["stop"])
                  }, null, 8, Qb)) : (V(), K("span", Ub, "⚠️")),
                  E("div", Hb, [
                    E("div", xb, [
                      E("strong", null, [
                        (V(!0), K(ht, null, yt(tt(y.symbol), (m) => (V(), K("span", {
                          key: m,
                          class: "fi-tag position-tag"
                        }, te(m), 1))), 128))
                      ]),
                      E("span", {
                        class: gi(["trade-side", y.buySell.toLowerCase()])
                      }, te(y.buySell), 3),
                      E("span", null, "Qty: " + te(y.quantity) + " . Avg price: " + te(Y(parseFloat(y.tradePrice))), 1),
                      y.tradeID ? (V(), K("span", Rb, " ID: " + te(y.tradeID), 1)) : ge("", !0)
                    ]),
                    E("div", Tb, te(y.assetCategory) + " • Trade date: " + te(Hl(y.tradeDate)) + " • Commission: " + te(Y(parseFloat(y.ibCommission))), 1)
                  ])
                ], 10, Fb))), 128))
              ]))
            ]),
            E("div", Lb, [
              E("button", {
                class: "btn btn-secondary",
                onClick: d[25] || (d[25] = (y) => Bt.value = !1)
              }, "Cancel"),
              E("button", {
                class: "btn btn-primary",
                onClick: ll,
                disabled: bs.value
              }, [
                bs.value ? (V(), K("span", Mb, "Saving...")) : (V(), K("span", Sb, "Attach " + te(lt.value.size) + " Trade(s)", 1))
              ], 8, Ib)
            ])
          ])
        ])) : ge("", !0)
      ], 64);
    };
  }
}), kb = (r, e) => {
  const t = r.__vccOpts || r;
  for (const [A, i] of e)
    t[A] = i;
  return t;
}, zb = /* @__PURE__ */ kb(Db, [["__scopeId", "data-v-fcfc57b8"]]);
export {
  zb as Positions,
  zb as default
};
