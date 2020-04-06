(function(global, factory) {
  if (typeof define === "function" && (define.amd || define.cmd)) {
    define(function() {
      return factory(global)
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(global);
  } else {
    factory(global);
  }
}(typeof window !== "undefined" ? window : this, function(window) {
  var BaseParam = {};

  var UA = window.navigator.userAgent.toLowerCase(), //判断浏览器类型
    REG_IOS = /(ipad|iphone|ipod).*?/, //ios正则
    REG_ANDROID = /(android).*?/; //android正则
  var IOS = REG_IOS.test(UA); //是否是IOS标识
  var ANDROID = REG_ANDROID.test(UA); //是否是Android标识

  /**
   * JS调用Native
   * service: 类名
   * action: 方法名
   * params: 参数对象
   * reqObj: 请求对象
   */
  function invoke(service, action, params, reqObj) {
    //定制处理
    if (ANDROID && (action === "getCurrentPosition" || action ===
        "getDuration" || action === "getBaseInfo")) {
      androidCustomInvoke(service, action, params, reqObj);
      return;
    }

    LXJSBridge.invoke(service, action, appendBaseParam(params), reqObj && (
      reqObj.success || reqObj.fail || reqObj.complete) ? function(
      result) {
      var ret = {};
      if (!!result) {
        var resp = eval("(" + result + ")");
        ret = resp.message;
        if (!ret) {
          ret = {};
        }

        if (!ret.errorCode) {
          ret.code = resp.code;
        } else {
          if (ret.errorCode == 0 || ret.errorcode == 0) {
            ret.code = "OK";
          } else {
            ret.code = "ERROR";
          }
        }

        if (BaseParam.debug) {
          console.log("回调JS函数结果ret:" + JSON.stringify(ret));
          //alert("回调JS函数结果ret:" + JSON.stringify(ret));
        }

        switch (ret.code) {
          case "OK":
            reqObj.success && reqObj.success(ret);
            break;
          default:
            reqObj.fail && reqObj.fail(ret);
        }
      }
      reqObj.complete && reqObj.complete(ret);
    } : null);
  };

  function androidCustomInvoke(service, action, params, reqObj) {
    LXJSBridge.invoke(service, action, appendBaseParam(params), reqObj && (
      reqObj.success || reqObj.fail || reqObj.complete) ? function(
      result, callbackId) {
      var funArr = callbackId.split(".");
      var s = funArr[0];
      var a = funArr[1];
      var resp = eval("(" + result + ")");
      var ret = resp.message;
      if (typeof ret != "object") {
        if (a === "getDuration") {
          ret = {
            code: "",
            duration: resp.message
          };
        } else if (a === "getCurrentPosition") {
          ret = {
            code: "",
            currentPosition: resp.message
          }
        }
      } else {
        if (action === 'getBaseInfo') {
          for (var key in ret) {
            if (key == 'appId') {
              if (!ret['aid']) {
                ret['aid'] = ret['appId'];
              }
            }
          }
        }
      }
      if (!ret) {
        ret = {};
      }

      if (!ret.errorCode) {
        ret.code = resp.code;
      } else {
        if (ret.errorCode == 0 || ret.errorcode == 0) {
          ret.code = "OK";
        } else {
          ret.code = "ERROR";
        }
      }

      if (BaseParam.debug) {
        console.log("回调JS函数结果ret:" + JSON.stringify(ret));
        //alert("回调JS函数结果ret:" + JSON.stringify(ret));
      }

      switch (ret.code) {
        case "OK":
          reqObj.success && reqObj.success(ret);
          break;
        default:
          reqObj.fail && reqObj.fail(ret);
      }

      reqObj.complete && reqObj.complete(ret);
    } : null);
  }


  /**
   * 监听Native事件
   * service: 类名
   * action: 方法名
   * reqObj: 请求对象
   */
  function on(service, action, reqObj, params) {
    LXJSBridge.on(service, action, function(result) {
      var ret = {};
      if (!!result) {
        var resp = eval("(" + result + ")");
        ret = resp.message;
        if (!ret) {
          ret = {};
        }

        if (!ret.errorCode) {
          ret.code = resp.code;
        } else {
          if (ret.errorCode == 0 || ret.errorcode == 0) {
            ret.code = "OK";
          } else {
            ret.code = "ERROR";
          }
        }
        if (BaseParam.debug) {
          console.log("回调JS函数结果ret:" + JSON.stringify(ret));
          //alert("回调JS函数结果ret:" + JSON.stringify(ret));
        }

        switch (ret.code) {
          case "OK":
            reqObj.success && reqObj.success(ret);
            break;
          default:
            reqObj.fail && reqObj.fail(ret);
        }
      }

      reqObj.complete && reqObj.complete(ret);
    }, params);
  };


  function appendBaseParam(params) {
    if (typeof params == 'object' || !params) {
      params = params || {};
      params.debug = BaseParam.debug;
      params.appId = BaseParam.appId;
      //params.verifyAppId=BaseParam.appId;
      //params.verifySignType="md5";
      //params.verifyTimestamp=BaseParam.timestamp+"";
      //params.verifyNonceStr=BaseParam.nonceStr;
      //params.verifySignature=BaseParam.signature;
    }
    return params;
  };

  function getBaseOfAndroid(reqObj) {
    reqObj.isNeedLbs = reqObj.isNeedLbs === false ? false : true;
    if (!reqObj.isNeedLbs) {
      invoke("SystemComponents", "getBaseInfo", null, reqObj);
    } else {
      LXJSSDK.getBaseInfo({
        isNeedLbs: false,
        success: function(ret) {
          var result = ret;
          LXJSSDK.getLbsInfo({
            success: function(ret) {
              for (var key in ret) {
                result[key] = ret[key];
                if (key == 'addressName') {
                  result['pos'] = ret['addressName'];
                  delete result['addressName'];
                } else if (key == 'latitude') {
                  result['lat'] = ret['latitude'];
                  delete result['longitude'];
                } else if (key == 'longitude') {
                  result['long'] = ret['longitude'];
                  delete result['longitude'];
                }
              }
              reqObj.success && reqObj.success(result);
            },
            fail: function(ret) {
              reqObj.fail && reqObj.fail(ret);
            },
            complete: function(ret) {
              reqObj.complete && reqObj.complete(ret);
            }
          });
        }
      });
    }
  };

  function getBaseOfIOS(reqObj) {
    LXJSSDK.isNeedLbs = reqObj.isNeedLbs;
    LXJSSDK.IOSCB = reqObj.success;
    window.location.href = "iflytek://SystemComponents.getBaseInfo";
  };

  var LXJSSDK = {
    IOSCfg: {
      "pver": "3.0",
      "aid": "108ViaFly",
      "osid": "iPhone",
      "clientver": '0.0.0000'
    },
    isNeedLbs: false,
    IOSLoadBase: false,
    IOSLoadLbs: false,
    IOSCB: null,

    //初始化接口
    config: function(reqObj) {
      BaseParam = reqObj;
      if (BaseParam.debug) {
        LXJSBridge.debug = true;
      }
      if (ANDROID) {
        invoke("LxBrowserComponents", "isEventCallBackForJS", true);
      }
    },
    ready: function(reqObj) {
      //TODO
    },
    error: function(reqObj) {
      //TODO
    },

    //基础接口
    encryptString: function(reqObj) {
      invoke("CommonComponents", "encryptContent", {
        originalString: reqObj.originalString,
        type: reqObj.type
      }, reqObj);
    },
    getBaseInfo: function(reqObj) {
      try {
        if (ANDROID) {
          getBaseOfAndroid(reqObj);
        } else if (IOS) {
          getBaseOfIOS(reqObj);
        } else {
          console.log("platform unsupport.");
        }
      } catch (e) {
        //alert("getBaseInfo error:" + e);
      }
    },
    getLbsInfo: function(reqObj) {
      if (ANDROID) {
        invoke("LBSComponents", "getLbsInfo", null, reqObj);
      } else if (IOS) {} else {
        console.log("platform unsupport.");
      }
    },


    //设备相关接口
    getDeviceId: function(reqObj) {
      invoke("CommonComponents", "getDeviceId", null, reqObj);
    },
    getDeviceInfo: function(reqObj) {
      invoke("CommonComponents", "getDeviceInfo", {
        keys: reqObj.keys
      }, reqObj);
    },
    getNetworkType: function(reqObj) {
      invoke("CommonComponents", "getNetworkType", null, reqObj);
    },
    onNetworkChanged: function(reqObj) {
      on("CommonComponents", "onNetworkChange", reqObj);
    },

    getUserInfo: function(reqObj) {
      invoke("CommonComponents", "getUserInfo", {
        keys: reqObj.keys
      }, reqObj);
    },

    //图像相关接口
    saveImage: function(reqObj) {
      invoke("CommonComponents", "savePic", {
        picUrl: reqObj.url,
        async: true
      }, reqObj);
    },
    chooseImage: function(reqObj) {
      invoke("PicComponents", "choosePic", {
        count: !reqObj.count ? '1' : reqObj.count,
        async: true
      }, reqObj);
    },
    uploadImage: function(reqObj) {
      invoke("PicComponents", "uploadPic", {
        localId: reqObj.localId,
        uploadType: reqObj.uploadType,
        async: true
      }, reqObj);
    },


    //分享相关接口
    shareWX: function(reqObj) {
      invoke("ShareComponents", "shareToWX", {
        shareTitle: reqObj.title,
        shareText: reqObj.desc,
        shareUrl: reqObj.link,
        imgWebUrl: reqObj.imgUrl,
        isTimeLine: reqObj.type == "1" ? "true" : "false",
        isShowSheet: reqObj.isShowSheet == "1" ? "true" : "false"
      });
    },
    //分享到微信，有回调，支持图片分享
    shareWXCallback: function(reqObj) {
      invoke("ShareComponents", "shareToWXWithCallback", {
        shareType: reqObj.shareType,
        shareUrl: reqObj.link,
        imgWebUrl: reqObj.imgUrl,
        shareTitle: reqObj.title,
        shareText: reqObj.desc,
        isTimeLine: reqObj.type == "1" ? "true" : "false",
        isShowSheet: reqObj.isShowSheet == "1" ? "true" : "false",
        async: true
      }, reqObj);
    },
    shareWB: function(reqObj) {
      invoke("ShareComponents", "shareToWB", {
        shareTitle: reqObj.title,
        shareText: reqObj.desc,
        shareUrl: reqObj.link,
      });
    },

    //音频相关接口
    startRecord: function() {
      invoke("AudioComponents", "startRecord");
    },
    stopRecord: function() {
      invoke("AudioComponents", "stopRecord");
    },
    onRecordStatus: function(reqObj) {
      on("AudioComponents", "onRecording", reqObj, {
        subscribe: true
      });
    },
    playVoice: function(reqObj) {
      if ("1" == reqObj.type) {
        invoke("MediaPlayerComponents", "playNetMedia", reqObj.resId);
      } else if ("2" == reqObj.type) {
        invoke("MediaPlayerComponents", "playLocalMedia", reqObj.resId);
      }
    },
    pauseVoice: function(reqObj) {
      invoke("MediaPlayerComponents", "pauseMedia");
    },
    resumeVoice: function(reqObj) {
      invoke("MediaPlayerComponents", "resumeMedia");
    },
    stopVoice: function(reqObj) {
      invoke("MediaPlayerComponents", "stopMedia");
    },
    getCurrentPosition: function(reqObj) {
      invoke("MediaPlayerComponents", "getCurrentPosition", null,
        reqObj);
    },
    getDuration: function(reqObj) {
      invoke("MediaPlayerComponents", "getDuration", null, reqObj);
    },
    onVoicePlayStatus: function(reqObj) {
      if (ANDROID) {
        on("Voice", "Completed", {
          complete: reqObj.complete
        });
        on("Voice", "Error", {
          fail: reqObj.fail
        });
        on("Voice", "Prepared", {
          complete: reqObj.complete
        });
      } else {
        on("MediaPlayerComponents", "onPlayStatusChange", reqObj);
      }
    },
    uploadVoice: function(reqObj) {
      invoke("ListeningComponents", "startUploadAudio", {
        localId: reqObj.localId,
        async: true
      }, reqObj);
    },

    //智能相关接口
    startListen: function() {
      invoke("ListeningComponents", "listeningStart", {
        is64: true
      });
    },
    onListenStatus: function(reqObj) {
      on("ListeningComponents", "onStatusChange", reqObj);
    },

    startListenTransfer: function(reqObj) {
      invoke("ListeningComponents", "startListeningWithoutUI", {
        engine: reqObj.engine,
        saveAudio: reqObj.isSaveAudio,
        is64: true
      });
    },
    stopListenTransfer: function(reqObj) {
      invoke("ListeningComponents", "stopListeningWithoutUI");
    },
    cancelListenTransfer: function() {
      invoke("ListeningComponents", "cancelListeningWithoutUI");
    },
    onListenTransfer: function(reqObj) {
      on("ListeningComponents", "onListeningWithoutUI", reqObj, {
        subscribe: true
      });
    },
    // 合成文本
    startTTS: function(reqObj) {
      invoke("SynthesizeComponents", "ttsSpeak", reqObj.text);
    },
    // 监听合成过程
    onTTS: function(reqObj) {
      on("SynthesizeComponents", "onStatusChange", reqObj);
    },
    //停止合成过程，可以停止ttsSpeakMultiLan接口的播报行为
    stopTTS: function() {
      invoke("SynthesizeComponents", "stopTts");
    },
    // 多语种合成播报
    ttsSpeakMultiLan: function(reqObj) {
      invoke("SynthesizeComponents", "ttsSpeakMultiLan", {
        content: reqObj.content,
        language: reqObj.language
      });
    },

    //业务相关接口
    getBizCfg: function(reqObj) {
      invoke("CommonComponents", "getBizConfig", {
        keys: reqObj.keys
      }, reqObj);
    },
    showFlowTip: function() {
      invoke("CommonComponents", "showFlowDataTip");
    },
    onSelectedFlowTip: function(reqObj) {
      on("CommonComponents", "onFlowTipSelect", reqObj);
    },
    //退出H5页面，返回至灵犀首页
    turnToHomePage: function() {
      invoke("CommonComponents", "turnToHomePage");
    },
    //退出H5页面，返回灵犀翻译首页
    turnToTranslatePage: function() {
      invoke("CommonComponents", "turnToTranslatePage");
    },
    //从H5页面跳转到灵犀app原生页面
    turnToNativePage: function(reqObj) {
      invoke("CommonComponents", "turnToNativePage", reqObj);
    },
    //提交反馈意见
    feedBack: function(reqObj) {
      if (ANDROID) {
        invoke("SystemComponents", "feedBack", [reqObj.content, reqObj.contact]);
      } else {
        invoke("SystemComponents", "feedBack", {
          content: reqObj.content,
          contact: reqObj.contact
        });
      }
    },

    //界面操作
    showDate: function(reqObj) {
      invoke("CommonComponents", "showDate", {
        dateYear: reqObj.year,
        dateMonth: reqObj.month,
        dateDay: reqObj.day,
        async: true
      }, reqObj);
    },

    //客户端记录日志
    logger: function(reqObj) {
      invoke("LogComponents", "addLog", {
        code: reqObj.code,
        starttime: !reqObj.time ? Date.now() : reqObj.time,
        result: !reqObj.result ? "success" : reqObj.result,
        extend: reqObj.content
      })
    },

    //获取灵犀版本渠道号，目前只支持android
    getAppChannel: function(reqObj) {
      invoke("CommonComponents", "getChannel", {
        type: reqObj.type,
        async: true
      }, reqObj);
    },

    //文字复制到系统粘贴板
    clipboard: function(reqObj) {
      invoke("CommonComponents", "copyToClipboard", {
        content: reqObj.content
      });
    },
    //文字全屏显示
    textFullScreen: function(reqObj) {
      invoke("CommonComponents", "turnToFullScreenPage", {
        content: reqObj.content
      });
    },
    //页面回退时，上个页面渲染通知页面，仅android适用
    onPageResume: function(reqObj) {
      if (ANDROID) {
        invoke("LxBrowserComponents", "isEventCallBackForJS", true);
        on("LxBrowserComponents", "onPageResume", reqObj);
        on("LxBrowserComponents", "onActivityResume", reqObj);
      } else if (IOS) {
        on("CommonComponents", "onWebViewRefreshData", reqObj);
      }
    },
    //根据原文译文生成翻译图片
    getTranslateImage: function(reqObj) {
      invoke("PicComponents", "synthesisPic", {
        original: reqObj.origin,
        translated: reqObj.target,
        async: true
      }, reqObj);
    },
    //加咪咕币
    addCoin: function(reqObj) {
      invoke("CommonComponents", "addCoin", {
        opCode: reqObj.opCode
      });
    },
    //调用听书播放器
    listenBookPlayer: function(reqObj) {
      invoke("MediaPlayerComponents", "listenBookPlayer", {
        contentID: reqObj.contentID,
        chapterID: reqObj.chapterID,
        offset: !reqObj.offset ? 0 : Math.round(parseInt(reqObj.offset)),
        resType: !reqObj.resType ? 1 : parseInt(reqObj.resType),
        callOrigin: parseInt(reqObj.callOrigin)
      })
    },
    //获取咪咕统一登录token
    getMiguToken: function(reqObj) {
      invoke("SystemComponents", "getMiguToken", {
        async: true
      }, reqObj);
    },
    //绑定手机号
    bindPhoneNum: function(reqObj) {
      invoke("CommonComponents", "bindPhoneNum", {
        async: true
      }, reqObj);
    },
    //解绑手机号
    unBindPhoneNum: function(reqObj) {
      invoke("CommonComponents", "unbindPhoneNum", {
        async: true
      }, reqObj);
    },
    //上报翻译错误纠错接口
    translateErrorSubmit: function(reqObj) {
      invoke("CommonComponents", "translateErrorSubmit", {
        errortype: reqObj.errortype,
        content: reqObj.content,
        nickname: reqObj.nickname,
        async: true
      }, reqObj)
    },
    //页面回退功能
    goBackPage: function(reqObj) {
      invoke("CommonComponents", "goBackPage");
    },
    //音乐二级页面音乐播放能力
    cardMusicPlayer: function(reqObj) {
      invoke("MediaPlayerComponents", "cardMusicPlayer", {
        seq: reqObj.seq,
        list: JSON.stringify(reqObj.list)
      });
    }
  };

  window.lx = window.iLingxi = LXJSSDK;
  return LXJSSDK;
}));


function onPageResume(msg) {
  LXJSBridge.fireFromNative("LxBrowserComponents.onPageResume", msg);
}

function onActivityResume(msg) {
  LXJSBridge.fireFromNative("LxBrowserComponents.onActivityResume", msg);
}

function onNetConnectChange(msg) {
  LXJSBridge.fireFromNative("CommonComponents.onNetworkChange", msg);
}

function onPlayPrepared(msg) {
  LXJSBridge.fireFromNative("Voice.Prepared", JSON.stringify({
    code: 'OK',
    message: {
      status: 'play'
    }
  }));
}

function onPlayCompleted(msg) {
  LXJSBridge.fireFromNative("Voice.Completed", JSON.stringify({
    code: 'OK',
    message: {
      status: 'finish'
    }
  }));
}

function onPlayError(msg) {
  var ret = '{code:"' + msg + '"}';
  LXJSBridge.fireFromNative("Voice.Error", ret);
}

function onListeningComplete(msg, is64) {
  LXJSBridge.fireFromNative("ListeningComponents.onStatusChange", msg, is64);
}

function onTtsPlayComplete(msg) {
  var ret = '{code:"OK"}';
  if (msg != '0') {
    ret = '{code:"' + msg + '"}';
  }
  LXJSBridge.fireFromNative("SynthesizeComponents.onStatusChange", ret);
}

function onFlowDataTipResult(msg) {
  LXJSBridge.fireFromNative("CommonComponents.onFlowTipSelect", msg);
}

function onOCCallback(posStr) {
  var functionname;
  try {
    var posObj = eval("(" + posStr + ")");
    functionname = posObj.function;
    if (functionname === "getBaseInfo") {
      //LXJSSDK.extendObj(LXJSSDK.IOSCfg, posObj.message);
      for (var key in posObj.message) {
        lx.IOSCfg[key] = posObj.message[key]
      }

      lx.IOSLoadBase = true;
      //            if(lx.isNeedLbs)
      //                window.location.href = 'iflytek://LBSComponents.getLbsInfo';
      //       }else if (functionname === "getLbsInfo"){
      //            lx.IOSCfg.long = posObj.message.longitude;
      //            lx.IOSCfg.lat = posObj.message.latitude;
      //            lx.IOSCfg.pos = posObj.message.addressName;
      //            lx.IOSCfg.city = posObj.message.city;
      //            lx.IOSLoadLbs = true;
    }

    //        if(lx.isNeedLbs){
    //            if((lx.IOSLoadBase && lx.IOSLoadLbs) || functionname === "getLbsInfo") {
    //               lx.IOSLoadBase = false;
    //                lx.IOSLoadLbs = false;
    //                lx.isNeedLbs = false;
    //                lx.IOSCB(lx.IOSCfg);
    //                lx.IOSCB = null;
    //            }
    //        }else{
    lx.IOSLoadBase = false;
    lx.IOSLoadLbs = false;
    lx.isNeedLbs = false;
    lx.IOSCB(lx.IOSCfg);
    lx.IOSCB = null;
    //        }
  } catch (e) {
    //alert(e);
    console.log("onOCCallback error:" + e);
  }
};
