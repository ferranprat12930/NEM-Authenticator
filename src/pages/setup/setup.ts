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
import {Component, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController, NavController, Slides, ToastController} from "ionic-angular";
import {Account} from "nem-library";
import {Storage} from "@ionic/storage";
import {HomePage} from "../home/home";
import {SetupAccountModal} from "./setup-account.modal";

@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html'
})
export class SetupPage {
  form: FormGroup;
  @ViewChild(Slides) slides: Slides;
  account: Account;
  privateKey: string;

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private storage: Storage) {
    this.form = formBuilder.group({
      myAccount: [false, Validators.requiredTrue]
    });
  }

  confirm() {
    this.storage.set('PRIVATE_KEY', this.privateKey).then(x => {
        this.navCtrl.setRoot(HomePage);
      }
    );
  }

  openSetupAccountModal() {
    let modal = this.modalCtrl.create(SetupAccountModal);
    modal.onDidDismiss((privateKey) => {
      if (privateKey != null) {
        this.privateKey = privateKey;
        this.account = Account.generateWithPrivateKey(privateKey);
        this.slides.lockSwipeToNext(false);
        this.slides.slideNext(500);
      }
    });
    modal.present();
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 2 && this.account === undefined) {
      this.slides.lockSwipeToNext(true);
    } else {
      this.slides.lockSwipeToNext(false);
    }
  }
}
