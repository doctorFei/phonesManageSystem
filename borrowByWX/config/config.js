((win, objName) => {

  if (process.env.NODE_ENV == "development") {
    //测试环境配置
    win[objName] = {
      BAIDUID: 'c46b48228d9fe5271e0c7e0d5a890340',
      getUserInfoUrl: ''
    }
  } else {
    //生产环境配置
    win[objName] = {
      BAIDUID: '',
      getUserInfoUrl: ''
    }
  }
})(window, 'CFG');
