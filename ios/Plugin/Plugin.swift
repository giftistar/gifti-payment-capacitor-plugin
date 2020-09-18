import UIKit
import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(IamportCapacitor)
public class IamportCapacitor: CAPPlugin, IamportDelegate {
    var iamportViewController:IamportViewController? = nil;

    @objc func startIamportActivity(_ call: CAPPluginCall) {
            self.iamportViewController = IamportPaymentViewController(call: call)
            self.iamportViewController?.delegate = self;
            self.bridge.viewController.present(self.iamportViewController!, animated: true, completion: nil)
    }
    
    func onOver(type: String)
    {
        print(type)
        let data = [
            "url" : type,
        ]
        self.notifyListeners("IMPOver", data: data)
    }
}

protocol IamportDelegate: class
{
    func onOver(type: String)
}
