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
import {NEMLibrary, NetworkTypes, Password, QRService, SimpleWallet} from "nem-library";
import {TranslateService} from "@ngx-translate/core";

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
              private viewCtrl: ViewController,
              private translateService: TranslateService) {
    this.form = formBuilder.group({
      password: ['',
        Validators.compose([Validators.required])]
    });
    NEMLibrary.reset();
  }

  scanWalletQR() {
    NEMLibrary.reset();
    this.barcodeScanner.scan().then(barcode => {
      this.walletQRText = JSON.parse(barcode.text);
      if (this.walletQRText.v == 1) {
        NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
      } else if (this.walletQRText.v == 2) {
        NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);
      }
    });
  }

  verifyAccount() {
    try {
      const password = new Password(this.form.get('password').value);
      const qrService = new QRService();
      const privateKey = qrService.decryptWalletQRText(password, this.walletQRText);
      const simpleWallet = SimpleWallet.createWithPrivateKey("NEM Auth Account", password, privateKey);
      this.viewCtrl.dismiss({
        wallet: simpleWallet,
        account: simpleWallet.open(password)
      })
    } catch (e) {
      this.translateService.get("ERROR_CHECK_PASSWORD").subscribe(value => {
        this.toastCtrl.create({
          message: value,
          duration: 1000
        }).present();
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
