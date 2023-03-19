package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"io/ioutil"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"time"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func hr_cr(hr int) string {
	corrected := (hr - 1) % 24
	return strconv.Itoa(corrected)
}

func fr(input_string string) string {
	corr := ""
	i := 2 - len(input_string)
	for i > 0 {
		corr += "0"
		i--
	}
	return corr + input_string
}

func getXTime() string {
	now := time.Now()
	return fr(strconv.Itoa(now.Year())) + "-" + fr(strconv.Itoa(int(now.Month()))) + "-" + fr(strconv.Itoa(now.Day())) + "T" + fr(hr_cr(now.Hour())) + ":" + fr(strconv.Itoa(now.Minute())) + ":" + fr(strconv.Itoa(now.Second())) + "." + strconv.Itoa(now.Nanosecond()/1000000) + "Z"
}

func transferMsTTSData(SsmlText string, outputPath string) (string, error) {
	reqId := uuid.New().String()
	fmt.Println(reqId)

	endpoint2 := fmt.Sprintf("wss://eastus.api.speech.microsoft.com/cognitiveservices/websocket/v1?TrafficType=AzureDemo&Authorization=bearer%%20undefined&X-ConnectionId=%s", reqId)

	u, err := url.Parse(endpoint2)
	if err != nil {
		return "", err
	}

	header := make(http.Header)
	header.Set("Origin", "https://azure.microsoft.com")

	ws, _, err := websocket.DefaultDialer.Dial(u.String(), header)
	if err != nil {
		return "", err
	}
	defer ws.Close()

	payload_1 := "{\"context\":{\"system\":{\"name\":\"SpeechSDK\",\"version\":\"1.12.1-rc.1\",\"build\":\"JavaScript\",\"lang\":\"JavaScript\",\"os\":{\"platform\":\"Browser/Linux x86_64\",\"name\":\"Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0\",\"version\":\"5.0 (X11)\"}}}}"
	message_1 := fmt.Sprintf("Path : speech.config\r\nX-RequestId: %s\r\nX-Timestamp: %s\r\nContent-Type: application/json\r\n\r\n%s", reqId, getXTime(), payload_1)
	if err := ws.WriteMessage(websocket.TextMessage, []byte(message_1)); err != nil {
		return "", err
	}

	payload_2 := "{\"synthesis\":{\"audio\":{\"metadataOptions\":{\"sentenceBoundaryEnabled\":false,\"wordBoundaryEnabled\":false},\"outputFormat\":\"audio-16khz-32kbitrate-mono-mp3\"}}}"
	message_2 := fmt.Sprintf("Path : synthesis.context\r\nX-RequestId: %s\r\nX-Timestamp: %s\r\nContent-Type: application/json\r\n\r\n%s", reqId, getXTime(), payload_2)
	if err := ws.WriteMessage(websocket.TextMessage, []byte(message_2)); err != nil {
		return "", err
	}

	payload_3 := SsmlText
	message_3 := fmt.Sprintf("Path: ssml\r\nX-RequestId: %s\r\nX-Timestamp: %s\r\nContent-Type: application/ssml+xml\r\n\r\n%s", reqId, getXTime(), payload_3)
	if err := ws.WriteMessage(websocket.TextMessage, []byte(message_3)); err != nil {
		return "", err
	}

	end_resp_pat := regexp.MustCompile("Path:turn.end")
	audio_stream := make([]byte, 0)
	for {
		_, response, err := ws.ReadMessage()
		if err != nil {
			return "", err
		}
		fmt.Println("receiving...")
		if end_resp_pat.MatchString(string(response)) {
			break
		} else if bytes.Contains(response, []byte("Path:audio\r\n")) {
			needle := []byte("Path:audio\r\n")
			startInd := bytes.Index(response, needle) + len(needle)
			audio_stream = append(audio_stream, response[startInd:]...)
		}
	}

	//if err := ioutil.WriteFile(fmt.Sprintf("%s.mp3", outputPath), audio_stream, 0644); err != nil {
	//	return "", err
	//}
	str := base64.StdEncoding.EncodeToString(audio_stream)
	return str, nil
}

func main() {

	http.HandleFunc("/mstts", func(w http.ResponseWriter, r *http.Request) {
		// 获取请求参数body
		body, err := ioutil.ReadAll(r.Body)
		// 获取body中的参数
		var params map[string]interface{}
		err = json.Unmarshal(body, &params)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// 获取参数
		lang := params["lang"].(string)
		speaker := params["speaker"].(string)
		text := params["text"].(string)

		base64Str, err := transferMsTTSData(
			fmt.Sprintf(`
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" version="1.0" xml:lang="%s">
          <voice name="%s">
            <mstts:express-as>
              <prosody rate="1" pitch="0%%">%s</prosody>
            </mstts:express-as>
          </voice>
        </speak>
`, lang, speaker, text), "test")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, base64Str)
	})

	// 启动HTTP服务，监听9529端口
	err := http.ListenAndServe(":9529", nil)
	if err != nil {
		panic(err)
	}

}
