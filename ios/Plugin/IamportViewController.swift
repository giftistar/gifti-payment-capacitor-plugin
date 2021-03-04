//
//  IamportViewController.swift
//  Plugin
//
//  Created by deedee on 14/11/2019.
//  Copyright © 2019 Max Lynch. All rights reserved.
//

import Foundation
import Capacitor
import UIKit
import WebKit

class IamportViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {
    weak var delegate:IamportDelegate?
    var webView: WKWebView!
    var userCode: String!
    var data: String = ""
    var appScheme: String = ""
    var triggerCallback: String = ""
    var redirectUrl: String!
    var loadingFinished: Bool = false
    var target_url : String = ""    
    convenience init(call: CAPPluginCall) {
        self.init()
        
        print("call123",call)

        // 여기서는 필요한 데이터를 받아오는것이다. 앱에서 옵션으로 줬던 값을 받아서 타겟 url을 만들자. 
        NotificationCenter.default.addObserver(self, selector: #selector(self.onDidReceiveData(_:)), name: Notification.Name(CAPNotifications.URLOpen.name()), object: nil)
        
        self.userCode = call.getString("userCode") ?? "iamport"

        let data = call.getObject("data") ?? [:]
        self.data = self.objectToString(data: data)
        
        let appScheme = data["app_scheme"]
        if (appScheme != nil) {
            self.appScheme = appScheme as! String
        }
        self.target_url = call.getString("target_url") ?? "https://danal.giftistar.net"
        
        
    }
    
    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.uiDelegate = self
        webView.navigationDelegate = self
        view = webView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        /// 여기서 데이터들을 조합해 url 링크를 만들도록 하자. 
        let myRequest = URLRequest(url: URL(string: self.target_url)!)
        webView.load(myRequest)
    }
    
    @available (iOS 8.0, *)
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        let navigationUrl = navigationAction.request.url!
        let url = navigationUrl.absoluteString;

        // 라우팅을 감지하는 듯 하다. 끝나는 거면 끝나는 동작을, 앱이라면 앱 동작을 주도록한다. 
        // 종료와 url 만드는 정도만 하면 끝날거같다. 
        print(url);
        if (self.isOver(url: url)) {
            self.webView.stopLoading()
            self.webView.removeFromSuperview()
            self.webView.navigationDelegate = nil
            self.webView = nil
            
            self.dismiss(animated: true)
            delegate?.onOver(type: url)
            
            decisionHandler(.cancel)
        } else if (self.isUrlStartsWithAppScheme(url: url)) {
            self.openThirdPartyApp(url: url)
            decisionHandler(.cancel)
        } else {
            decisionHandler(.allow)
        }
    }
    
    /* 종료 여부 판단 */
    func isOver(url: String) -> Bool {
        return url.contains("purchase-basket-callback")  || url.contains("error") || url.contains("Cancel") || url.contains("callback-toss-payments-done")   ;
    }
    
    func isUrlStartsWithAppScheme(url : String) -> Bool {
        let splittedScheme = url.components(separatedBy: "://");
        let scheme = splittedScheme[0];
        return scheme != "http" && scheme != "https" && scheme != "about:blank" && scheme != "file";
    }
    
    func openThirdPartyApp(url: String) {}
    
    func objectToString(data: [String: Any]) -> String {
        do {
            let data = try JSONSerialization.data(withJSONObject: data, options: .prettyPrinted)
            return String(data: data, encoding: String.Encoding.utf8) ?? ""
        } catch {
            return ""
        }
    }
    
    @objc func onDidReceiveData(_ notification: Notification) {}
}
