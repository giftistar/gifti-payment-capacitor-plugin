var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Plugins } from '@capacitor/core';
const { IamportCapacitor } = Plugins;
const REDIRECT_URL = 'https://danal.giftistar.net';
export class GiftyPayment {
    constructor() {
        this.isCallbackCalled = false;
        this.triggerCallback = `function(response) {
      const query = [];
      Object.keys(response).forEach(key => {
        query.push(key + '=' + response[key]);
      });

      location.href = 'https://danal.giftistar.net';
    }`;
    }
    addListener(callback) {
        IamportCapacitor.addListener('IMPOver', ({ url }) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isCallbackCalled) { // 콜백 중복 호출 방지
                let _url = url;
                console.log('IMPOVER listen', url);
                this.isCallbackCalled = true;
                callback(url);
            }
        }));
    }
    //순서를 적어놓자면 
    // 앱에서는 payment 메소드를 호출한다. 
    // payment는 다시 브릿지를 통해 플러그인을 호출한다. 
    // 호출대상은 plugin.swift 파일이다. 
    payment(options) {
        try {
            const { target_url, callback } = options;
            const newOptions = {
                target_url
            };
            this.addListener(callback);
            return IamportCapacitor.startIamportActivity(newOptions);
        }
        catch (e) {
            console.log('gifti-payment-capacitor plugin error', JSON.stringify(e));
        }
    }
    getPaymentType(data) {
        const { pg, pay_method } = data;
        if (pay_method === 'trans') {
            if (pg.includes('html5_inicis')) {
                return 'inicis';
            }
            if (pg.includes('nice')) {
                return 'nice';
            }
        }
        return 'payment';
    }
    certification(options) {
        const { userCode, data, callback } = options;
        const newOptions = {
            type: 'certification',
            userCode,
            data,
            triggerCallback: this.triggerCallback,
            redirectUrl: REDIRECT_URL,
        };
        this.addListener(callback);
        return IamportCapacitor.startIamportActivity(newOptions);
    }
}
//# sourceMappingURL=plugin.js.map