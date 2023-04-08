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
                url: $option['server'] ? $option['server'] : "http://127.0.0.1:9529/mstts",
                header: {'Content-Type': 'application/json'},
                body: {"lang":targetLanguage,"speaker":$option[targetLanguage+'-speaker'],"text":query.text},
             });
            base64Result = resp.data
            completion({
                result: {
                    "type": "base64",
                    "value": base64Result,
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
