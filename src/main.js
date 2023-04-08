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
        let base64Result = ''
        try {
            const resp = await $http.request({
                method: "POST",
                url: "https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak",
                header: {
                    'authority': 'southeastasia.api.speech.microsoft.com',
                    'accept': '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    'origin': 'https://azure.microsoft.com',
                    'pragma': 'no-cache',
                    'referer': 'https://azure.microsoft.com/',
                    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
                },
                // body: {"lang": targetLanguage, "speaker": $option[targetLanguage + '-speaker'], "text": query.text},
                body: {
                    "ttsAudioFormat": "audio-24khz-160kbitrate-mono-mp3",
                    "ssml": `<speak xmlns=\"http://www.w3.org/2001/10/synthesis\" xmlns:mstts=\"http://www.w3.org/2001/mstts\" version=\"1.0\" xml:lang=\"${targetLanguage}\"><voice name=\"${$option[targetLanguage + '-speaker']}\"><mstts:express-as><prosody rate=\"1\" pitch=\"0%\">${query.text}</prosody></mstts:express-as></voice></speak>`
                }
            });
            let data2 = $data.fromData(resp.rawData);

            completion({
                result: {
                    "type": "base64",
                    "value": data2.toBase64(),
                    "raw": {}
                },
            });

        } catch (e) {
            $log.error(e)
        }

    })().catch((err) => {
        $log.error(err)
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
