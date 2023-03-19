var config = require('./config.js');
var utils = require('./utils.js');

function supportLanguages() {
    return config.supportedLanguages.map(([standardLang]) => standardLang);
}

function tts(query, completion) {
    (async () => {
        const targetLanguage = utils.langMap.get(query.lang);
        if (!targetLanguage) {
            const err = new Error();
            Object.assign(err, {
                _type: 'unsupportLanguage',
                _message: '不支持该语种',
            });
            throw err;
        }
        const originText = '[' + targetLanguage + ']' + query.text + '[' + targetLanguage + ']'
        let base64Result = ''
        try {
            $log.error(originText)
            const speaker = $option.speaker;

            const socket = $websocket.new({
                url: "wss://eastus.api.speech.microsoft.com/cognitiveservices/websocket/v1?TrafficType=AzureDemo&Authorization=bearer%20undefined&X-ConnectionId=988D4F54946C40419FD7DA2B94CB4101",
                allowSelfSignedSSLCertificates: true,
                timeoutInterval: 100,
                header: {
                    'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'no-cache',
            'Host': 'eastus.api.speech.microsoft.com',
            'Origin': 'https://azure.microsoft.com',
                'Pragma': 'no-cache',
                    'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Sec-WebSocket-Key': 'gfsEymqWiYWyV7/jYdmDGw==',
            'Sec-WebSocket-Version': 13,
            'Upgrade': 'websocket',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
                }
            })
            socket.open()
            socket.listenOpen(function (socket) {
                $log.error(`did open`);
                socket.sendString(`Path: speech.config
X-RequestId: EB12DA2B975E4E5EAA85FE39D7BBA325
X-Timestamp: 2023-03-18T10:36:36.605Z
Content-Type: application/json

{"context":{"system":{"name":"SpeechSDK","version":"1.23.0","build":"JavaScript","lang":"JavaScript"},"os":{"platform":"Browser/MacIntel","name":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36","version":"5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"}}}`)
                socket.sendString(`Path: synthesis.context
X-RequestId: EB12DA2B975E4E5EAA85FE39D7BBA325
X-Timestamp: 2023-03-18T10:36:36.605Z
Content-Type: application/json

{"synthesis":{"audio":{"metadataOptions":{"bookmarkEnabled":false,"punctuationBoundaryEnabled":"false","sentenceBoundaryEnabled":"false","sessionEndEnabled":true,"visemeEnabled":false,"wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"},"language":{"autoDetection":false}}}`)
                socket.sendString(`
            Path: ssml
X-RequestId: EB12DA2B975E4E5EAA85FE39D7BBA325
X-Timestamp: 2023-03-18T10:36:36.606Z
Content-Type: application/ssml+xml

<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" version="1.0" xml:lang="en-US">
          <voice name="en-US-JennyNeural">
            <mstts:express-as>
              <prosody rate="1" pitch="0%">you can replace this text with any text you wish.</prosody>
            </mstts:express-as>
          </voice>
        </speak>
            `);
            })

            socket.listenError(function (socket, error) {
                $log.error(`did error`);
                $log.error(socket);
                $log.error(JSON.stringify(error));
            })

            socket.listenReceiveData(function (socket, data) {
                $log.error(`did receive data: length=${data.length}`);
                $log.error(data);
                completion({
                    result: {
                        "type": "base64",
                        "value": data,
                        "raw": {}
                    },
                });
            })
            socket.listenReceiveString(function (socket, string) {
                $log.error(`did receive string: ${string}`);
            })

        } catch (e) {
            $log.error(e)
        }

    })().catch((err) => {
        completion({
            error: {
                type: err._type || 'unknown',
                message: err._message || '未知错误',
                addtion: err._addtion,
            },
        });
    });
}

exports.supportLanguages = supportLanguages;
exports.tts = tts;
