# bob-plugin-akl-microsoft-free-tts
微软语音tts免费bob插件,完全无需秘钥

免费无限次使用微软Microsoft tts 文字转语音,根据网页版JavaScript开发的bobplugin;所以只要官网不改,理论上就可以无限使用;

### 微软接口更新,以后都不用启动任何服务了,如果你是商店版bob,直接下载0.1.0之后的版本即可

下载微软语音插件[bob-plugin-akl-microsoft-free-tts_v0.1.0.bobplugin](https://github.com/akl7777777/bob-plugin-akl-microsoft-free-tts/releases/download/v0.1.0/bob-plugin-akl-microsoft-free-tts_v0.1.0.bobplugin)

**直接双击即可使用,商店版后面不用看了,社区版我后面再想办法**


使用方法如下(总共分三步):

#### 第0步: 下载

下载右侧的release中的[mstts_server_MacOS](https://github.com/akl7777777/bob-plugin-akl-microsoft-free-tts/releases/download/v0.0.9/mstts_server_MacOS)

下载微软语音插件[bob-plugin-akl-microsoft-free-tts_v0.0.9.bobplugin](https://github.com/akl7777777/bob-plugin-akl-microsoft-free-tts/releases/download/v0.0.9/bob-plugin-akl-microsoft-free-tts_v0.0.9.bobplugin)

#### 第一步: 运行mstts_server可执行文件(往下翻,支持添加自启动,无需每次启动)

(注意: macos由于对软件限制较⼤，对未知来源的程序是禁⽌使⽤的，所以双击多半打不开，此时需要按 下⾯的步骤进⾏操作。)

打开终端,执行如下命令: chmod a+x <你的mstts_server_MacOS可执行文件存放的路径>

第⼀次跑时需要输⼊chmod。以后每次运⾏时，其它步骤不变，只是不必再输该chmod命令。

当然,如果你不想占用自己电脑的资源,有条件也可以用公司办公室的其他[Windows电脑启动服务](https://github.com/akl7777777/bob-plugin-akl-microsoft-free-tts/releases/download/v0.0.9/mstts_windows.exe)


也可以使用公司或个人的[Linux服务器启动服务](https://github.com/akl7777777/bob-plugin-akl-microsoft-free-tts/releases/download/v0.0.9/mstts_server_linux)



#### 第二步:

配置服务器域名,本地启动默认域名是http://127.0.0.1:9529/mstts 可以不用修改;如果服务部署在其他机器,可以根据自己机器的域名来配置

#### 第三步:

双击.bobplugin后缀的文件即可安装;安装后尽情享受吧!



使用效果图:

<img width="745" alt="image" src="https://user-images.githubusercontent.com/84266551/226151255-69846e9b-f30e-49c1-8cca-11651ba128f1.png">

### MacOS添加自启动操作手册

1.下载[mstts_server_MacOS](https://github.com/akl7777777/bob-plugin-akl-microsoft-free-tts/releases/download/v0.0.9/mstts_server_MacOS)
(记得要在已下载的文件存放的路径下打开终端)

```
sudo mv mstts_server_MacOS /usr/local/bin/mstts
sudo chmod +x /usr/local/bin/mstts
```

2.下载并且移动[com.akl.mstts.free.plist](https://github.com/akl7777777/bob-plugin-akl-microsoft-free-tts/releases/download/v0.0.9/com.akl.mstts.free.plist)
(记得要在已下载的文件存放的路径下打开终端)
```
mv com.akl.mstts.free.plist ~/Library/LaunchAgents/com.akl.mstts.free.plist
```

3.添加自启动服务
```
launchctl load ~/Library/LaunchAgents/com.akl.mstts.free.plist
launchctl start ~/Library/LaunchAgents/com.akl.mstts.free.plist
```

**单独调用服务方式如下:**

入参:
{"lang":"zh-CN","speaker":"zh-CN-XiaoxiaoNeural","text":"可能是代码逻辑有点问题,后续我考虑修复下"}
返回:
base64

<img width="960" alt="image" src="https://user-images.githubusercontent.com/84266551/226151660-94f6e604-bb6d-44c5-ae27-12876de2fb93.png">


### 友情链接==>ChatGPT免费桌面版客户端(支持Windows,macOS,Android)
桌面版ChatGPT下载地址:[OpenAI-ChatGPT免费桌面版客户端](https://github.com/akl7777777/free-chatgpt-client-pub)

手机版ChatGPT下载地址:[OpenAI-ChatGPT免费手机版客户端](https://github.com/akl7777777/free-chatgpt-client-mobile-pub)

### bob插件大合集:

>[微软语音tts免秘钥bob插件](https://github.com/akl7777777/bob-plugin-akl-microsoft-free-tts)

>[OpenAI ChatGPT(免秘钥)插件](https://github.com/akl7777777/bob-plugin-akl-chatgpt-free-translate)

>[DeepL翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-deepl-free-translate)

>[有道翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate)

>[CNKI学术翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-cnki-free-translate)

>[火山翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-volcengine-free-translate)

>[百度翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-baidu-free-translate)

>[腾讯翻译君插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-tencent-free-translate)

>[腾讯交互翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-transmart-free-translate)

>[彩云小译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-caiyunxiaoyi-free-translate)

>[只为日语 - MOJi辞書（じしょ）](https://github.com/akl7777777/bob-plugin-akl-mojidict-translate)

>[Papago Naver 韩语翻译(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-papago-free-translate)

>[Bob翻译剪切板图片的AlfredWorkflow](https://github.com/akl7777777/BobTranslateClipboard)

>[Bob的Postman接口调试插件](https://github.com/akl7777777/bob-plugin-akl-postman)


# 开发不易,如果喜欢可以请作者喝一杯可乐,谢谢!


![image](https://user-images.githubusercontent.com/84266551/226151419-6d639052-6d9f-4cdb-ab24-f423f4a7c8c9.png)
