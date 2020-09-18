import { IamportCapacitorPlugin, PaymentOptions, PaymentData, CertificationOptions } from './definitions';
export declare class GiftyPayment implements IamportCapacitorPlugin {
    private isCallbackCalled;
    private triggerCallback;
    addListener(callback: any, type?: String): void;
    payment(options: PaymentOptions): Promise<PaymentOptions>;
    getPaymentType(data: PaymentData): String;
    certification(options: CertificationOptions): Promise<CertificationOptions>;
}
