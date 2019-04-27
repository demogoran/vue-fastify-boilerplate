(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

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

/***/ "./client/templates/LoginPage.vue":
/*!****************************************!*\
  !*** ./client/templates/LoginPage.vue ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LoginPage_vue_vue_type_template_id_0aed66ec___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LoginPage.vue?vue&type=template&id=0aed66ec& */ "./client/templates/LoginPage.vue?vue&type=template&id=0aed66ec&");
/* harmony import */ var _LoginPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LoginPage.vue?vue&type=script&lang=js& */ "./client/templates/LoginPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _LoginPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LoginPage.vue?vue&type=style&index=0&lang=scss& */ "./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _LoginPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _LoginPage_vue_vue_type_template_id_0aed66ec___WEBPACK_IMPORTED_MODULE_0__["render"],
  _LoginPage_vue_vue_type_template_id_0aed66ec___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "client/templates/LoginPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./client/templates/LoginPage.vue?vue&type=script&lang=js&":
/*!*****************************************************************!*\
  !*** ./client/templates/LoginPage.vue?vue&type=script&lang=js& ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--0!../../node_modules/vue-loader/lib??vue-loader-options!./LoginPage.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./client/templates/LoginPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss&":
/*!**************************************************************************!*\
  !*** ./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/src??postcss!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib??vue-loader-options!./LoginPage.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/index.js?!./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_postcss_node_modules_sass_loader_lib_loader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./client/templates/LoginPage.vue?vue&type=template&id=0aed66ec&":
/*!***********************************************************************!*\
  !*** ./client/templates/LoginPage.vue?vue&type=template&id=0aed66ec& ***!
  \***********************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_template_id_0aed66ec___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./LoginPage.vue?vue&type=template&id=0aed66ec& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./client/templates/LoginPage.vue?vue&type=template&id=0aed66ec&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_template_id_0aed66ec___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginPage_vue_vue_type_template_id_0aed66ec___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./client/templates/LoginPage.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--0!./node_modules/vue-loader/lib??vue-loader-options!./client/templates/LoginPage.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************/
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

/* harmony default export */ __webpack_exports__["default"] = ({
  mixins: [Object(_js_utils_helpers_js__WEBPACK_IMPORTED_MODULE_2__["handleSave"])(['login'])],
  data: function data() {
    return {
      login: "admin",
      password: "test",
      alertContent: ""
    };
  },
  methods: {
    accountLogin: function () {
      var _accountLogin = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var result;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.alertContent = "";
                _context.next = 3;
                return Object(_js_utils_helpers_js__WEBPACK_IMPORTED_MODULE_2__["fetchJSON"])("/api/user/login", "post", {
                  login: this.login,
                  password: this.password
                });

              case 3:
                result = _context.sent;
                this.alertContent = result.errorMessage;
                console.log(result);
                if (!result.error) this.$router.push("/");

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function accountLogin() {
        return _accountLogin.apply(this, arguments);
      }

      return accountLogin;
    }(),
    accountCreate: function () {
      var _accountCreate = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        var result;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.alertContent = "";
                _context2.next = 3;
                return Object(_js_utils_helpers_js__WEBPACK_IMPORTED_MODULE_2__["fetchJSON"])("/api/user/create", "post", {
                  login: this.login,
                  password: this.password
                });

              case 3:
                result = _context2.sent;
                this.alertContent = result.errorMessage;
                console.log(result, this.alertContent);
                if (!result.error) this.$router.push("/");

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function accountCreate() {
        return _accountCreate.apply(this, arguments);
      }

      return accountCreate;
    }()
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/index.js?!./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??postcss!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib??vue-loader-options!./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, "html, body {\n  height: 100%;\n}\n#app {\n  height: 100%;\n}\n.loginContainer {\n  max-width: 500px;\n  position: relative;\n  height: 100%;\n}\n.loginContainer .actionButton {\n    margin-top: 10px;\n    margin-right: 10px;\n}\n.loginContainer .fixedPrepend .input-group-text {\n    width: 100px;\n}\n.loginContainer .customizedAlert {\n    position: absolute;\n    width: 100%;\n    bottom: 0;\n    left: 0;\n}\n", ""]);



/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/index.js?!./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??postcss!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib??vue-loader-options!./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/src??postcss!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib??vue-loader-options!./LoginPage.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/index.js?!./client/templates/LoginPage.vue?vue&type=style&index=0&lang=scss&");

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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./client/templates/LoginPage.vue?vue&type=template&id=0aed66ec&":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./client/templates/LoginPage.vue?vue&type=template&id=0aed66ec& ***!
  \*****************************************************************************************************************************************************************************************************/
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
    { staticClass: "loginContainer", attrs: { "align-self": "start" } },
    [
      _c(
        "b-row",
        [
          _c(
            "b-input-group",
            {
              staticClass: "mt-3 fixedPrepend",
              attrs: { prepend: _vm.$t("Username") }
            },
            [
              _c("b-form-input", {
                model: {
                  value: _vm.login,
                  callback: function($$v) {
                    _vm.login = $$v
                  },
                  expression: "login"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "b-input-group",
            {
              staticClass: "mt-3 fixedPrepend",
              attrs: { prepend: _vm.$t("Password") }
            },
            [
              _c("b-form-input", {
                attrs: { type: "password" },
                model: {
                  value: _vm.password,
                  callback: function($$v) {
                    _vm.password = $$v
                  },
                  expression: "password"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "b-button",
            {
              staticClass: "actionButton",
              attrs: { variant: "info" },
              on: {
                click: function($event) {
                  return _vm.accountLogin()
                }
              }
            },
            [_vm._v(_vm._s(_vm.$t("Login")))]
          ),
          _vm._v(" "),
          _c(
            "b-button",
            {
              staticClass: "actionButton",
              attrs: { variant: "info" },
              on: {
                click: function($event) {
                  return _vm.accountCreate()
                }
              }
            },
            [_vm._v(_vm._s(_vm.$t("Create")))]
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
//# sourceMappingURL=2.bundle.js.map