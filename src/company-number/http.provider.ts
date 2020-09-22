import { Provider } from "@nestjs/common";
import Axios from 'axios'

export const HttpProvider: Provider = {
    provide: "HTTP",
    useFactory: async () => Axios.create({
        headers: {
            "Accept": "application/xml; charset=UTF-8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Content-Length": "257",
            "Content-Type": "application/xml; charset=UTF-8",
            "Host": "teht.hometax.go.kr",
            "Origin": "https://teht.hometax.go.kr",
            "Referer": "https://teht.hometax.go.kr/websqua,websquare.html?w2xPath=/ui/ab/a/a/UTEABAAA13.xml",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
        },
        baseURL: "https://teht.hometax.go.kr/wqAction.do?actionId=ATTABZAA001R08&screenId=UTEABAAA13&popupYn=false&realScreenId="
    })
}