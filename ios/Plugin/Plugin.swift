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


    // 이 메서드가 호출되면 웹뷰가 올라온다. 메인스레드에 올려야에러가 안난다. 
    @objc func startIamportActivity(_ call: CAPPluginCall) {
            print("payment plugin starting....")
            DispatchQueue.main.async {
                // 뷰컨트롤러를생성해야하는데, 기존에 있떤거 대충쓴다. 쓰일수도 있으니까.
                // 이제 뷰컨트롤러 swift 파일로간다.
            self.iamportViewController = IamportPaymentViewController(call: call)
            print("payment plugin starting2....")
            self.iamportViewController?.delegate = self;
            self.bridge?.viewController?.present(self.iamportViewController!, animated: true, completion: nil)
            print("payment plugin starting3....")
        }
                
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
