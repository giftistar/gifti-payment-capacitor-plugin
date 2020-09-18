import { Plugins } from '@capacitor/core';
import queryString from 'query-string';
import {
  IamportCapacitorPlugin,
  PaymentOptions,
  PaymentData,
  CertificationOptions,
} from './definitions';

const { IamportCapacitor } = Plugins;

const REDIRECT_URL = 'https://danal.giftistar.net';

export class GiftyPayment implements IamportCapacitorPlugin {
  private isCallbackCalled: boolean = false;
  private triggerCallback: string = `function(response) {
      const query = [];
      Object.keys(response).forEach(key => {
        query.push(key + '=' + response[key]);
      });

      location.href = 'https://danal.giftistar.net';
    }`;

  addListener(callback: any, type?: String) {
    callback
    type;
    (IamportCapacitor as any).addListener('IMPOver', async ({ url }: any) => {

      if (!this.isCallbackCalled) { // 콜백 중복 호출 방지
        console.log('IMPOVER listen', url)
        this.isCallbackCalled = true;
      }
    });
  }

  //순서를 적어놓자면 
  // 앱에서는 payment 메소드를 호출한다. 
  // payment는 다시 브릿지를 통해 플러그인을 호출한다. 
  // 호출대상은 plugin.swift 파일이다. 
  payment(options: PaymentOptions): Promise<PaymentOptions> {
    const { userCode, data, callback } = options;
    const type = this.getPaymentType(data);
    const newOptions = {
      type,
      userCode,
      data: {
        ...data,
        m_redirect_url: REDIRECT_URL,
      },
      triggerCallback: this.triggerCallback,
      redirectUrl: REDIRECT_URL,
    };
    this.addListener(callback, type);
    return (IamportCapacitor as any).startIamportActivity(newOptions);
  }

  getPaymentType(data: PaymentData): String {
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

  certification(options: CertificationOptions): Promise<CertificationOptions> {
    const { userCode, data, callback } = options;
    const newOptions = {
      type: 'certification',
      userCode,
      data,
      triggerCallback: this.triggerCallback,
      redirectUrl: REDIRECT_URL,
    };
    this.addListener(callback);

    return (IamportCapacitor as any).startIamportActivity(newOptions);
  }
}