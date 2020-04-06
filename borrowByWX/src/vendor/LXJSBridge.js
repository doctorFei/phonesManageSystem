(function(global, factory) {
  if (typeof define === "function" && (define.amd || define.cmd)) {
    define(function() {
      return factory(global);
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(global);
  } else {
    factory(global);
  }
}(typeof window !== "undefined" ? window : this, function(window) {
  var LXJSBridge = window.LXJSBridge || (window.LXJSBridge = {});
  var UA = window.navigator.userAgent.toLowerCase(); //判断浏览器类型
  var REG_IOS = /(ipad|iphone|ipod).*?/; //ios正则
  var REG_ANDROID = /(android).*?/; //android正则

  var self = LXJSBridge;
  var JSBRIDGE_PROTOCOL = "iflytek:"; //JSBridge协议
  var callbacks = {}; //回调函数池
  var callbackId = Math.floor(Math.random() * 2000000000); //回调函数index种子
  self.eventHandlers = {}; //事件Handler池
  var IOS = REG_IOS.test(UA); //是否是IOS标识
  var ANDROID = REG_ANDROID.test(UA); //是否是Android标识
  var iosIFrame; //IOS交互时使用的临时iframe
  self.debug = false;

  //上传标识,防止用户未返回时多次点击
  var uploadFlags = {};


  /**
   * JS调用Native(内部调用，外部也可直接使用)
   * service: 类名
   * action: 方法名
   * params: 参数对象
   * callbackFunc: 回调函数
   */
  self.invoke = function(service, action, params, callbackFunc) {

    //生成回调函数ID,并保存
    var cbId = null;
    if (callbackFunc) {
      cbId = service + "." + action + "." + callbackId++;
      callbacks[cbId] = callbackFunc;
    }

    console.log(service + "." + action + ", 请求参数: " + JSON.stringify(
      params));
    if (self.debug) {
      alert(service + "." + action + ", 请求参数: " + JSON.stringify(params));
    }

    //上传逻辑定制
    if (action.indexOf("upload") > -1) {
      if (uploadFlags[service + "." + action]) {
        var ret = {
          "code": "uploading"
        };
        self.callbackFromNative(cbId, JSON.stringify(ret));
        return;
      } else {
        uploadFlags[service + "." + action] = "uploading";
      }
    }

    if (ANDROID) {
      androidInvoke(service, action, params, cbId);
    } else if (IOS) {
      iosInvoke(service, action, params, cbId);
    } else {
      //androidInvoke(service, action, params, cbId);
      console.log("platform unsupport.");
    }
  };



  /**
   * 监听Native事件(内部调用，外部也可直接使用)
   * service: 类名
   * action: 方法名
   * callbackFunc: 回调函数
   * params: 一些特殊功能的参数,大部分情况下不需要
   */
  self.on = function(service, action, callbackFunc, params) {
    if (!service || !action) {
      console.log("service and action is empty.");
      return false;
    }


    if (!callbackFunc || typeof callbackFunc !== "function") {
      console.log("callbackFunc is unvalid.");
      return false;
    }

    //采用队列方式, 增加到事件监听队列中
    var eventId = service + "." + action;
    console.log("注册事件: " + eventId);
    if (self.debug) {
      alert("注册事件: " + eventId);
    }

    if (!self.eventHandlers[eventId]) {
      self.eventHandlers[eventId] = [];

      if (ANDROID) {
        //为了兼容Android老事件
        if (params && params.subscribe) {
          androidSubscribe(service, action, eventId);
        }
      } else if (IOS) {
        iosSubscribe(service, action, eventId);
      } else {
        console.log("platform unsupport.");
      }
    }
    self.eventHandlers[eventId].push(callbackFunc);
  };

  /**
   * 解绑Native事件
   * service: 类名
   * action: 方法名
   */
  self.off = function(service, action) {
    if (!service || !action) {
      console.log("service and action is empty.");
      return false;
    }

    var eventId = service + "." + action;
    console.log("解绑事件: " + eventId);
    if (self.debug) {
      alert("解绑事件: " + eventId);
    }

    //TODO 通知Native

    self.eventHandlers[eventId] && delete self.eventHandlers[eventId];
  };

  /**
   * Native返回结果
   * cbId: 回调处理函数ID
   * result: 返回结果
   */
  self.callbackFromNative = function(cbId, result, is64) {
    try {
      //解决特殊字符崩溃问题
      if (is64 === "1" || is64 === "true") {
        msg = b64Decode(msg);
      }

      console.log(cbId + ", 返回参数: " + result);
      if (self.debug) {
        alert(cbId + ", 返回参数: " + result + ", is64: " + is64);
      }

      var cbf = null;

      cbf = callbacks[cbId];
      if (cbId && cbf) {
        //上传逻辑定制
        if (cbId.indexOf("upload") > -1 && result.indexOf("uploading") ==
          -1) {
          var upId = cbId.substring(0, cbId.lastIndexOf("."));
          if (uploadFlags[upId]) {
            delete uploadFlags[upId];
          }
        }

        if (cbId && cbf) {
          delete callbacks[cbId];
        }

        //cbf.apply(null, result);
        cbf(result, cbId);
      }
    } catch (err) {
      console.log("callbackFromNative error, callbackId: " + cbId +
        ", error: " + err);
      if (self.debug) {
        alert("callbackFromNative error, callbackId: " + cbId +
          ", error: " + err);
      }
    }

    //if(cbId && cbf){
    //    delete callbacks[cbId];
    //}
  };

  /**
   * Native发布事件
   * eventId: 事件Id
   * msg: 消息内容
   */
  self.fireFromNative = function(eventId, msg, is64) {
    try {
      //解决特殊字符崩溃问题
      if (is64 === "1" || is64 === "true") {
        msg = b64Decode(msg);
      }

      console.log("事件回调通知: " + eventId + ", 消息内容: " + msg);
      if (self.debug) {
        alert("事件回调通知: " + eventId + ", 消息内容: " + msg + ", is64: " + is64);
      }

      var handlers = self.eventHandlers[eventId];
      if (handlers) {
        // 依次调用通道上的所有事件处理函数
        for (var i = 0; i < handlers.length; ++i) {
          //setTimeout(handlers[i].apply(window, msg), 0);
          setTimeout(handlers[i](msg), 0);
        }
      } else {
        console.log("事件回调通知: " + eventId + ", 无监听处理函数");
        if (self.debug) {
          alert("事件回调通知: " + eventId + ", 无监听处理函数");
        }
      }
    } catch (err) {
      console.log("fireFromNative error, eventId: " + eventId +
        ", error: " + err);
      if (self.debug) {
        alert("fireFromNative error, eventId: " + eventId + ", error: " +
          err);
      }
    }
  };

  function androidInvoke(service, action, params, cbId) {
    setTimeout(androidExec(service, action, params, cbId), 0);
  }

  function androidExec(service, action, params, cbId) {
    try {
      var req = [params];
      //兼容安卓老版本，参数直接传数组的方法
      if (params && params instanceof Array) {
        req = params;
      }
      //异步
      if (params && params.async) {
        params.callbackId = cbId;
        prompt(JSBRIDGE_PROTOCOL + JSON.stringify([service, action]), JSON.stringify(
          req));
        //同步
      } else {
        var result = prompt(JSBRIDGE_PROTOCOL + JSON.stringify([service,
          action
        ]), JSON.stringify(req));
        //var result = {code: "OK", message: {netType: "wifi"}};
        if (cbId) {
          self.callbackFromNative(cbId, result);
        }
      }
    } catch (err) {
      console.log("invoke(prompt) native exception, " + service + "." +
        action + ", 异常: " + err);
      if (self.debug) {
        alert("invoke(prompt) native exception, " + service + "." + action +
          ", 异常: " + err);
      }
    }
  }

  function iosInvoke(service, action, params, cbId) {
    setTimeout(iosExec(service, action, params, cbId), 0);
  }

  function iosExec(service, action, params, cbId) {
    try {
      var req = {
        "className": service,
        "functionName": action
      };
      params && params.success && delete params.success;
      params && params.fail && delete params.fail;
      params && params.complete && delete params.complete;
      if (params) {
        req.params = [params];
      }
      if (cbId) {
        req.callbackId = cbId;
      }
      console.log("iosExec req: " + JSON.stringify(req));
      if (self.debug) {
        alert("iosExec req: " + JSON.stringify(req));
      }
      window.webkit.messageHandlers.iflytek.postMessage(JSON.stringify(req));
    } catch (err) {
      console.log("invoke(ios) native exception, " + service + "." + action +
        ", 异常: " + err);
      if (self.debug) {
        alert("invoke(ios) native exception, " + service + "." + action +
          ", 异常: " + err);
      }
    }
  }

  function androidSubscribe(service, action, eventId) {
    console.log("androidSubscribe eventId: " + eventId);
    if (self.debug) {
      alert("androidSubscribe eventId: " + eventId);
    }
    androidInvoke(service, action, {
      async: true
    }, eventId);
  }

  function iosSubscribe(service, action, eventId) {
    iosExec(service, action, null, eventId);
  }

  function checkArgs(service, action, params, callbackFunc) {
    if (!service || !action) {
      console.log("service and action is empty.");
      return false;
    }

    if (callbackFunc && typeof callbackFunc !== "function") {
      console.log("callbackFunc is not function.");
      return false;
    }

    return true;
  }


  var _keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  function encode(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  function decode(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  function _utf8_encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  }

  function _utf8_decode(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) |
          (c3 & 63));
        i += 3;
      }
    }
    return string;
  }

  function b64Encode(str) {
    return encode(str);
  }

  function b64Decode(str) {
    return decode(str);
  }


  return LXJSBridge;
}));
