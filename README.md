# 管理系统描述
![测试机管理系统](https://img-blog.csdnimg.cn/20181116164454418.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwODY4Mjg5,size_16,color_FFFFFF,t_70)
### 一、支持三种登录方式：
1. 普通登录模式
2. 超级管理员模式
3. 管理员模式

#### 1、普通登录模式
 
  普通登录模式只支持测试机的查看和申领，并且支持快速搜索。点击详情可以查看手机的详情信息。点击申领时弹出申领二维码，签借人通过微信扫描二维码完成测试机的申领。

#### 2、管理员登录模式
管理员模式下的权限分为普通管理员和超级管理员。

普通管理员功能描述
1. 支持添加设备，设备管理，签借人管理。设备管理部分支持设备的查看，删除，修改。签借人管理可查看测试机申领人，申领机型，申领时间。

超级管理员功能描述

1. 所有可登录用户必须由超级管理员录入（姓名及域账号）——以部门为组。
2. 超级管理员模式下可以添加和管理普通管理员
3. 支持添加设备，设备管理，签借人管理。设备管理部分支持设备的查看，删除，修改。签借人管理可查看测试机申领人，申领机型，申领时间。
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181116164631880.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwODY4Mjg5,size_16,color_FFFFFF,t_70)

### 微信端申领需求描述 
每台测试机上均有一个二维码，测试机的申领需要使用微信扫一扫，通过域账号和相应的密码进行登录，登陆后会将微信ID与域账号进行绑定，下次扫描后可直接进入申领页面。


申领页面展示该测试机的申领情况，是已申领还是未申领。以及测试机的详细信息。
若测试机未申领，可点击申领按钮一键申领。若测试机已被申领，可点击申请转让按钮，由当前测试机拥有人通过微信扫一扫即可完成转让。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181116165027547.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwODY4Mjg5,size_16,color_FFFFFF,t_70)