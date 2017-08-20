/*
 * MIT License
 *
 * Copyright (c) 2017 Aleix Morgadas <aleixmorgadas@openmailbox.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {Component} from "@angular/core";
import {NavParams, ToastController, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Password, QRService, SimpleWallet} from "nem-library";

@Component({
  selector: 'setup-account-modal',
  templateUrl: 'setup-account.modal.html'
})
export class SetupAccountModal {
  form: FormGroup;
  walletQRText;

  constructor(params: NavParams,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private barcodeScanner: BarcodeScanner,
              public viewCtrl: ViewController) {
    this.form = formBuilder.group({
      password: ['',
        Validators.compose([Validators.required])]
    });
  }

  scanWalletQR() {
    this.barcodeScanner.scan().then(barcode => {
      this.walletQRText = JSON.parse(barcode.text);
    });
  }

  verifyAccount() {
    let password = new Password(this.form.get('password').value);
    try {
      let qrService = new QRService();
      let privateKey = qrService.decryptWalletQRText(password, this.walletQRText);
      let simpleWallet = SimpleWallet.createWithPrivateKey("NEM Auth Account", password, privateKey);
      this.viewCtrl.dismiss({
        wallet: simpleWallet,
        account: simpleWallet.open(password)
      })
    } catch (e) {
      this.toastCtrl.create({
        message: "Check your password",
        duration: 1000
      }).present();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
