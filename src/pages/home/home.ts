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
import {Loading, LoadingController, ModalController, NavController, ToastController} from "ionic-angular";
import {Observable} from "rxjs";
import {TransactionModal} from "./transaction.modal";
import {Storage} from "@ionic/storage";
import {
  Account,
  AccountHttp,
  MultisigSignatureTransaction,
  MultisigTransaction,
  TimeWindow,
  Transaction,
  TransactionHttp,
  TransactionTypes
} from "nem-library";

@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage {
  private account: Account;
  unconfirmedTransactions: MultisigTransaction[];
  loader: Loading;
  accountPulling: Observable<MultisigTransaction[]>;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public accountHttp: AccountHttp,
              public transactionHttp: TransactionHttp,
              private storage: Storage) {
    this.storage.get('PRIVATE_KEY').then(privateKey => {
      this.account = Account.createWithPrivateKey(privateKey);
      this.accountPulling = Observable.interval(5000).startWith(0).flatMap(x => {
        return accountHttp.unconfirmedTransactions(this.account.address);
      }).map(x => {
        return this.removeAllTransactionsThatAreNotMultisig(x)
      });
      this.accountPulling.subscribe(
        value => {
          this.unconfirmedTransactions = value;
          this.loader.dismiss();
        },
        error => {
          this.toastCtrl.create({
            message: "Check your Internet connection",
            duration: 2000
          }).present();
          this.loader.dismiss();
        }
      );
    });
    this.loader = loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  doRefresh(refresher) {
    this.accountPulling.subscribe(
      value => {
        this.unconfirmedTransactions = value;
        refresher.complete();
      }, error => {
        this.toastCtrl.create({
          message: "Check your Internet connection",
          duration: 2000
        }).present();
        refresher.complete();
      }
    );
  }

  cosignTransaction(unconfirmedTransaction: MultisigTransaction) {
    if (unconfirmedTransaction.signatures.length == 0) {
      let modal = this.modalCtrl.create(TransactionModal, {unconfirmedTransaction: unconfirmedTransaction});
      modal.onDidDismiss((agreed) => {
        if (agreed) {
          this.signTransaction(unconfirmedTransaction);
        }
      });
      modal.present();
    } else {
      this.showAlreadyConfirmedTransactionToast();
    }
  }

  private signTransaction(unconfirmedTransaction: MultisigTransaction) {
    const multisigSignedTransaction = MultisigSignatureTransaction.create(
      TimeWindow.createWithDeadline(),
      unconfirmedTransaction.otherTransaction.signer.address,
      unconfirmedTransaction.hashData
    );
    const signedTransaction = this.account.signTransaction(multisigSignedTransaction);
    this.transactionHttp.announceTransaction(signedTransaction).subscribe(x => {
        console.log(x);
      }
    );
  }

  private showAlreadyConfirmedTransactionToast() {
    let toast = this.toastCtrl.create({
      message: "transaction already signed, pending to be included in a block",
      duration: 3000
    });
    toast.present();
  }

  private removeAllTransactionsThatAreNotMultisig(unconfirmedTransactions: Transaction[]): MultisigTransaction[] {
    return unconfirmedTransactions.filter(x => {
      return x.type == TransactionTypes.MULTISIG;
    }).map(x => <MultisigTransaction>x);
  }
}
