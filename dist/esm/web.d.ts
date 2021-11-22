import { WebPlugin } from '@capacitor/core';
import { IamportCapacitorPlugin, PaymentOptions, CertificationOptions } from './definitions';
export declare class IamportCapacitorWeb extends WebPlugin implements IamportCapacitorPlugin {
    constructor();
    payment(options: PaymentOptions): Promise<PaymentOptions>;
    certification(options: CertificationOptions): Promise<CertificationOptions>;
}
declare const IamportCapacitor: IamportCapacitorWeb;
export { IamportCapacitor };
