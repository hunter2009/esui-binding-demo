(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Event'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Event'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Event);
    global.main = mod.exports;
  }
})(this, function (exports, _Event) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.delegate = exports.fromEvent = exports.Event = exports.version = undefined;

  var _Event2 = _interopRequireDefault(_Event);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * 版本号
   *
   * @type {string}
   */
  var version = exports.version = '2.2.0';

  /**
   * {@link Event}类
   *
   * @type {Function}
   */
  /**
   * mini-event
   * Copyright 2013 Baidu Inc. All rights reserved.
   *
   * @ignore
   * @file 入口
   * @author otakustay
   */

  exports.Event = _Event2.default;


  /**
   * 参考{@link Event#fromEvent}
   */
  var fromEvent = exports.fromEvent = _Event2.default.fromEvent;

  /**
   * 参考{@link Event#delegate}
   */
  var delegate = exports.delegate = _Event2.default.delegate;
});