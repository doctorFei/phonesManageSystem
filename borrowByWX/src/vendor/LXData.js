/**
 * @desc 封装百度统计流程，简化使用流程
 * @author xwliu@iflytek.com
 * @class
 */
(function(win, className) {
  var loc = win.location,
    nav = win.navigator,
    ua = navigator.userAgent.toLocaleLowerCase(),
    IOS = /iphone/.test(ua),
    ANDROID = /android/.test(ua);

  win['_hmt'] = [];

  /**
   * @desc 构造函数，初始化对象
   * @constructs
   * @arg {string} id 针对每个url,百度统计生成的id,必传参数
   * @arg {boolean} auto 是否自动PV跟踪，默认false，不自动统计pv，需要调用接口统计
   */
  function Cstrts(id, auto) {
    if (!id) {
      alert("需要百度统计生成的id参数！");
    }

    if (!document.querySelector(".baidu" + id)) {

      if (!auto) {
        win['_hmt'].push(['_setAutoPageview', false]);
      }

      var hm = document.createElement("script");
      hm.setAttribute("class", "baidu" + id);
      hm.src = "https://hm.baidu.com/hm.js?" + id;
      document.querySelector("head").appendChild(hm);
    }
  }
  /**
   * @desc 公开方法
   * @public
   */
  Cstrts.prototype = {

    /**
     * @desc 查询url中字符串的值
     * @arg {string} str 查询字符串
     * @arg {boolean} igonore 是否忽略大小写，true 忽略；false不忽略；默认不忽略
     * @return {string} 查询字符串值
     */
    queryUrl: function(str, ignore) {
      var reg = "[?&]" + str + "=[^&]+",
        attr = ignore ? 'gi' : 'g',
        res = '';

      decodeURIComponent(loc.search).toString().replace(new RegExp(reg,
          attr),
        function(r) {
          res = r.split("=")[1];
        });

      return res;
    },
    /**
     * @desc 页面事件统计
     * @arg {string} type 事件类型
     * @arg {string} channel 渠道号对应的字符串
     */
    trackEvent: function(type, channel) {
      if (!type) {
        alert("统计事件需要事件名称参数！");
      }
      var cnStr = !channel ? 'channel' : channel,
        cn = this.queryUrl(cnStr),
        userAgent = nav.userAgent.toLocaleLowerCase(),
        label = '';

      if (userAgent.match(/MicroMessenger/i) == "micromessenger") {
        label = '微信端';
      } else if (userAgent.indexOf("android") > -1) {
        label = '安卓端';
      } else if (userAgent.indexOf("iphone") > -1) {
        label = 'ios端';
      } else {
        label = '其他';
      }

      win['_hmt'].push(['_trackEvent', label, type, cn]);
    },
    /**
     * @desc 统计页面PV，不传参数使用百度统计默认统计行为
     * @arg {string} url 自定义的待统计的url，必须是'/'开头的相对路径，否则无法统计到自定义的url，不传，使用原来的url
     * @arg {string} args 原始url中的参数字符串,可以传多个
     */
    trackPV: function(url, args) {

      var length = arguments && arguments.length,
        pageUrl = loc.pathname,
        index = 0,
        para = '';

      if (length > 0) {
        var tempUrl = arguments[0];

        if (tempUrl.indexOf("/") > -1) {
          index = 1;
          para = length > 1 ? '?' : '';
          pageUrl = tempUrl;
        } else {
          para = '?';
        }
      } else {
        return;
      }

      for (var i = index; i < length; i++) {
        para += arguments[i] + "=" + this.queryUrl(arguments[i]);
        if (i < length - 1) {
          para += "&";
        }
      }

      if (IOS) {
        pageUrl += '/ios';
      } else if (ANDROID) {
        pageUrl += '/android';
      }
      win['_hmt'].push(['_trackPageview', pageUrl + para]);
    }
  };

  if (!win[className]) {
    win[className] = Cstrts;
  } else {
    alert(className + '字符串已被注册到window中!');
  }

}(window, 'LXData'));
