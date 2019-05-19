"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _BasicController2 = _interopRequireDefault(require("../libs/BasicController"));

var _SoundCloudAPI = require("../libs/SoundCloudAPI");

var _Helpers = require("../libs/Helpers");

var _Localization = _interopRequireDefault(require("../libs/Localization"));

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["", "/search"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["", "/trackinfo"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var MusicController =
/*#__PURE__*/
function (_BasicController) {
  (0, _inherits2["default"])(MusicController, _BasicController);

  function MusicController(fastify) {
    var _this;

    (0, _classCallCheck2["default"])(this, MusicController);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MusicController).call(this));
    _this.allowedMethods = {
      "MusicController.TrackInfo": false
    };
    fastify.post((_templateObject(), _this.apiPrefix), _this.TrackInfo);
    fastify.post((_templateObject2(), _this.apiPrefix), _this.Search);
    return _this;
  }

  (0, _createClass2["default"])(MusicController, [{
    key: "TrackInfo",
    value: function () {
      var _TrackInfo = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(request) {
        var data, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = request.body;

                if (data.ids) {
                  _context.next = 3;
                  break;
                }

                throw _Localization["default"].MISSED_DATA;

              case 3:
                _context.next = 5;
                return _SoundCloudAPI.SoundCloudAPI.getTracksCompact(data.ids);

              case 5:
                result = _context.sent;
                return _context.abrupt("return", {
                  result: result
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function TrackInfo(_x) {
        return _TrackInfo.apply(this, arguments);
      }

      return TrackInfo;
    }()
  }, {
    key: "Search",
    value: function () {
      var _Search = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(request) {
        var data, result;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data = request.body;

                if (data.q) {
                  _context2.next = 3;
                  break;
                }

                throw _Localization["default"].MISSED_DATA;

              case 3:
                _context2.next = 5;
                return _SoundCloudAPI.SoundCloudAPI.searchAudio(data.q);

              case 5:
                result = _context2.sent;
                return _context2.abrupt("return", {
                  result: (0, _Helpers.ResultToKinds)(JSON.parse(result).collection)
                });

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function Search(_x2) {
        return _Search.apply(this, arguments);
      }

      return Search;
    }()
  }]);
  return MusicController;
}(_BasicController2["default"]);

module.exports = MusicController;