import { Plugins } from '@capacitor/core';
import queryString from 'query-string';
import {
  IamportCapacitorPlugin,
  PaymentOptions,
  PaymentData,
  CertificationOptions,
} from './definitions';

const { IamportCapacitor, Device } = Plugins;

const REDIRECT_URL = 'http://localhost/iamport';

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
    IamportCapacitor.addListener('IMPOver', async ({ url }: any) => {

      if (!this.isCallbackCalled) { // 콜백 중복 호출 방지
        console.log('IMPOVER listen', url)
        this.isCallbackCalled = true;
      }
    });
  }

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
    return IamportCapacitor.startIamportActivity(newOptions);
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

    return IamportCapacitor.startIamportActivity(newOptions);
  }
}