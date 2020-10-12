import { IamportCapacitorPlugin, PaymentData, CertificationOptions } from './definitions';
export declare class GiftyPayment implements IamportCapacitorPlugin {
    private isCallbackCalled;
    private triggerCallback;
    addListener(callback: any): void;
    payment(options: any): Promise<any>;
    getPaymentType(data: PaymentData): String;
    certification(options: CertificationOptions): Promise<CertificationOptions>;
}
