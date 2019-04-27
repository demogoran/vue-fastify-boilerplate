(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./client/js/utils/console.js":
/*!************************************!*\
  !*** ./client/js/utils/console.js ***!
  \************************************/
/*! exports provided: Console */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Console", function() { return Console; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);


var Console =
/*#__PURE__*/
function () {
  function Console() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Console);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Console, [{
    key: "log",
    value: function log(data) {
      if (true) console.log(data); //eslint-disable-line
    }
  }, {
    key: "error",
    value: function error(data) {
      if (true) console.error(data); //eslint-disable-line
    }
  }, {
    key: "warn",
    value: function warn(data) {
      if (true) console.warn(data); //eslint-disable-line
    }
  }]);

  return Console;
}();

/***/ }),

/***/ "./client/js/utils/helpers.js":
/*!************************************!*\
  !*** ./client/js/utils/helpers.js ***!
  \************************************/
/*! exports provided: fetchJSON, handleSave */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchJSON", function() { return fetchJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleSave", function() { return handleSave; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./console */ "./client/js/utils/console.js");



var fetchJSON =
/*#__PURE__*/
function () {
  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(url) {
    var method,
        body,
        o,
        options,
        jwt,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            method = _args.length > 1 && _args[1] !== undefined ? _args[1] : "GET";
            body = _args.length > 2 ? _args[2] : undefined;
            o = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            options = Object.assign({}, o);
            jwt = localStorage.getItem('jwtToken');

            if (!options.headers) {
              options.headers = {};
            }

            options['method'] = method;
            options.headers['Content-Type'] = 'application/json';

            if (body) {
              options['body'] = body;
            }

            if (jwt) {
              options.headers['Authorization'] = "Bearer ".concat(jwt);
            }

            if (typeof options.body !== "string") {
              options.body = JSON.stringify(options.body);
            }

            _context.next = 13;
            return fetch(url, options).then(function (x) {
              return x.json();
            }).then(function (x) {
              if (x.setJWTToken) {
                localStorage.setItem('jwtToken', x.setJWTToken);
              }

              if (x.resetJWTToken) {
                localStorage.removeItem('jwtToken');
              }

              return x;
            });

          case 13:
            return _context.abrupt("return", _context.sent);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchJSON(_x) {
    return _ref.apply(this, arguments);
  };
}();
var handleSave = function handleSave(fieldsToLoad) {
  var watch = {};
  fieldsToLoad.forEach(function (key) {
    watch[key] = function (newObj, oldObj) {
      _console__WEBPACK_IMPORTED_MODULE_2__["Console"].log("".concat(key, " changed"), oldObj, newObj);
      localStorage.setItem(key, JSON.stringify(newObj));
    };
  });
  _console__WEBPACK_IMPORTED_MODULE_2__["Console"].log(watch);
  return {
    watch: watch,
    mounted: function mounted() {
      var _this = this;

      _console__WEBPACK_IMPORTED_MODULE_2__["Console"].log("App mounted for localStorage!");
      fieldsToLoad.forEach(function (key) {
        try {
          var storageField = localStorage.getItem(key);
          if (storageField) _this[key] = JSON.parse(storageField);
        } catch (ex) {
          _console__WEBPACK_IMPORTED_MODULE_2__["Console"].log("Extracting error", ex);
        }
      });
    }
  };
};

/***/ }),

/***/ "./client/templates/MainPage.vue":
/*!***************************************!*\
  !*** ./client/templates/MainPage.vue ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MainPage_vue_vue_type_template_id_0a20b844___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MainPage.vue?vue&type=template&id=0a20b844& */ "./client/templates/MainPage.vue?vue&type=template&id=0a20b844&");
/* harmony import */ var _MainPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MainPage.vue?vue&type=script&lang=js& */ "./client/templates/MainPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _MainPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MainPage.vue?vue&type=style&index=0&lang=scss& */ "./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _MainPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _MainPage_vue_vue_type_template_id_0a20b844___WEBPACK_IMPORTED_MODULE_0__["render"],
  _MainPage_vue_vue_type_template_id_0a20b844___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "client/templates/MainPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./client/templates/MainPage.vue?vue&type=script&lang=js&":
/*!****************************************************************!*\
  !*** ./client/templates/MainPage.vue?vue&type=script&lang=js& ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--0!../../node_modules/vue-loader/lib??vue-loader-options!./MainPage.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./client/templates/MainPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss&":
/*!*************************************************************************!*\
  !*** ./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss& ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/src??postcss!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib??vue-loader-options!./MainPage.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/index.js?!./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./client/templates/MainPage.vue?vue&type=template&id=0a20b844&":
/*!**********************************************************************!*\
  !*** ./client/templates/MainPage.vue?vue&type=template&id=0a20b844& ***!
  \**********************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_template_id_0a20b844___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./MainPage.vue?vue&type=template&id=0a20b844& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./client/templates/MainPage.vue?vue&type=template&id=0a20b844&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_template_id_0a20b844___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MainPage_vue_vue_type_template_id_0a20b844___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./client/templates/MainPage.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--0!./node_modules/vue-loader/lib??vue-loader-options!./client/templates/MainPage.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _js_utils_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../js/utils/helpers.js */ "./client/js/utils/helpers.js");


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var sortByImage = function sortByImage(a, b) {
  if (!a.artwork_url) return 1;
  if (!b.artwork_url) return -1;
  return 0;
};

/* harmony default export */ __webpack_exports__["default"] = ({
  mixins: [Object(_js_utils_helpers_js__WEBPACK_IMPORTED_MODULE_2__["handleSave"])(["audioInfo", "searchStr"])],
  data: function data() {
    return {
      alertContent: "",
      searchStr: "Skillet",
      audioInfo: {
        Tracks: [],
        People: [],
        Playlists: []
      },
      currentTrack: null
    };
  },
  methods: {
    search: function () {
      var _search = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var response, kinds;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Object(_js_utils_helpers_js__WEBPACK_IMPORTED_MODULE_2__["fetchJSON"])("/api/music/search", "post", {
                  q: this.searchStr
                });

              case 2:
                response = _context.sent;
                kinds = response === null || response === void 0 ? void 0 : response.result;

                if (!(response.error || !kinds)) {
                  _context.next = 7;
                  break;
                }

                console.log(response.errorMessage);
                return _context.abrupt("return");

              case 7:
                this.audioInfo = {
                  Tracks: kinds.track.sort(sortByImage),
                  People: kinds.user.sort(sortByImage),
                  Playlists: kinds.playlist.sort(sortByImage)
                };
                console.log(this.audioInfo);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function search() {
        return _search.apply(this, arguments);
      }

      return search;
    }(),
    playCurrent: function playCurrent(currentUrl) {
      if (!currentUrl) return;
      this.currentTrack = currentUrl;
    },
    imgFallback: function imgFallback(event) {
      event.target.src = "img/notfound.jfif";
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/index.js?!./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??postcss!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib??vue-loader-options!./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".playerTabs {\n  width: 100%;\n}\n.playerTabs .playerRow {\n    display: flex;\n    flex-direction: row !important;\n}\n.playerTabs .playerRow .playerDescription {\n      flex: 1 0;\n}\n.playerTabs .playerRow .playerThumbImage {\n      flex: 0;\n}\n", ""]);



/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/index.js?!./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??postcss!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib??vue-loader-options!./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/src??postcss!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib??vue-loader-options!./MainPage.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/index.js?!./client/templates/MainPage.vue?vue&type=style&index=0&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./client/templates/MainPage.vue?vue&type=template&id=0a20b844&":
/*!****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./client/templates/MainPage.vue?vue&type=template&id=0a20b844& ***!
  \****************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "b-container",
    { staticClass: "playerContainer" },
    [
      _c("b-row", [_c("b-col", [_c("h3", [_vm._v("Player")])])], 1),
      _vm._v(" "),
      _c(
        "b-row",
        [
          _c(
            "b-input-group",
            { staticClass: "mt-3", attrs: { prepend: _vm.$t("Search track") } },
            [
              _c("b-form-input", {
                model: {
                  value: _vm.searchStr,
                  callback: function($$v) {
                    _vm.searchStr = $$v
                  },
                  expression: "searchStr"
                }
              }),
              _vm._v(" "),
              _c(
                "b-button",
                {
                  attrs: { variant: "info" },
                  on: {
                    click: function($event) {
                      return _vm.search()
                    }
                  }
                },
                [_vm._v(_vm._s(_vm.$t("Search")))]
              )
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c("b-row", [
        _c("audio", { attrs: { src: _vm.currentTrack, controls: "controls" } })
      ]),
      _vm._v(" "),
      _c(
        "b-row",
        [
          _c(
            "b-tabs",
            {
              staticClass: "playerTabs",
              attrs: { pills: "", card: "", vertical: "" }
            },
            _vm._l(_vm.audioInfo, function(contentTabValue, contentTabKey) {
              return _c(
                "b-tab",
                {
                  key: contentTabKey,
                  class: {
                    active:
                      Object.keys(_vm.audioInfo).indexOf(contentTabKey) === 0
                  },
                  attrs: { title: contentTabKey }
                },
                [
                  _c(
                    "b-list-group",
                    _vm._l(contentTabValue, function(item, index) {
                      return _c(
                        "b-list-group-item",
                        {
                          key: index,
                          class:
                            "flex-column align-items-start playerRow " +
                            (index === 0 ? "active" : ""),
                          attrs: { href: item.permalink_url },
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              return _vm.playCurrent(item.permalink_url)
                            }
                          }
                        },
                        [
                          _c("b-img", {
                            staticClass: "playerThumbImage",
                            attrs: {
                              thumbnail: "",
                              fluid: "",
                              src: item.artwork_url
                            },
                            on: {
                              error: function($event) {
                                return _vm.imgFallback($event)
                              }
                            }
                          }),
                          _vm._v(" "),
                          _c(
                            "div",
                            {
                              staticClass:
                                "d-flex w-100 justify-content-between playerDescription"
                            },
                            [
                              _c("h5", { staticClass: "mb-1" }, [
                                _vm._v(_vm._s(item.title))
                              ]),
                              _vm._v(" "),
                              _c("small", [
                                _vm._v(
                                  _vm._s(
                                    item.user
                                      ? item.user.username + ":" + item.id
                                      : item.id
                                  )
                                )
                              ])
                            ]
                          )
                        ],
                        1
                      )
                    }),
                    1
                  )
                ],
                1
              )
            }),
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "b-alert",
        {
          staticClass: "customizedAlert",
          attrs: {
            show:
              typeof _vm.alertContent !== "undefined" &&
              _vm.alertContent.length > 0,
            variant: "danger",
            dismissible: ""
          },
          on: {
            dismissed: function($event) {
              _vm.alertContent = ""
            }
          }
        },
        [_vm._v(_vm._s(_vm.alertContent))]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=1.bundle.js.map