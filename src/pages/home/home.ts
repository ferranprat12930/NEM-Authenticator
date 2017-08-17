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
  Address,
  ConfirmedTransactionListener,
  MultisigSignatureTransaction,
  MultisigTransaction,
  TimeWindow,
  Transaction,
  TransactionHttp,
  TransactionTypes,
  UnconfirmedTransactionListener
} from "nem-library";
import {LocalDateTime} from "js-joda";
import {MultisigTransactionInfo} from "nem-library/dist/src/models/transaction/TransactionInfo";

@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage {
  private account: Account;
  unconfirmedTransactions: MultisigTransactionPlusView[];
  loader: Loading;
  accountPulling: Observable<MultisigTransactionPlusView[]>;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public accountHttp: AccountHttp,
              public transactionHttp: TransactionHttp,
              private storage: Storage) {
    this.loader = loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
    });

    this.storage.get('PRIVATE_KEY').then(privateKey => {
      this.account = Account.createWithPrivateKey(privateKey);
      this.accountPulling = accountHttp.unconfirmedTransactions(this.account.address)
        .flatMap(_ => _)
        .filter(transaction => transaction.type == TransactionTypes.MULTISIG)
        .map(multisigTransaction => new MultisigTransactionPlusView(<MultisigTransaction> multisigTransaction, false, false))
        .toArray();
      this.fetchTransactions();

      let multisig = new Address("TBUAUC3VYKPP3PJPOH7A7BCB2C4I64XZAAOZBO6N");
      new UnconfirmedTransactionListener().given(multisig)
        .subscribe(transaction => {
          if (transaction.type == TransactionTypes.MULTISIG) {
            this.unconfirmedTransactions.push(new MultisigTransactionPlusView(<MultisigTransaction>transaction, false, false));
          }
        });

      new ConfirmedTransactionListener().given(multisig)
        .subscribe(transaction => {
          console.log("CONFIRMED TRANSACTION", transaction);
          if (transaction.type == TransactionTypes.MULTISIG) {
            this.unconfirmedTransactions = this.unconfirmedTransactions
              .filter(x => {
                const innerData = x.transaction.hashData.data;
                const confirmedTransactionInnerData = (<MultisigTransactionInfo>(<MultisigTransaction>transaction).getTransactionInfo()).innerHash.data;
                console.log("InnerData", innerData);
                console.log("confirmedTransactionInnerData", confirmedTransactionInnerData);
                return innerData != confirmedTransactionInnerData;
              })
          }
        })
    });
  }

  fetchTransactions(refresher?: any) {
    this.unconfirmedTransactions = [];
    this.accountPulling.subscribe(
      value => {
        this.unconfirmedTransactions = value;
        this.loader.dismiss();
        if (refresher) refresher.complete();
      },
      error => {
        this.loader.dismiss();
        this.toastCtrl.create({
          message: "Check your Internet connection",
          duration: 2000
        }).present();
        if (refresher) refresher.complete();
      }
    );
  }

  doRefresh(refresher) {
    this.fetchTransactions(refresher);
  }

  cosignTransaction(unconfirmedTransaction: MultisigTransactionPlusView) {
    if (unconfirmedTransaction.transaction.signatures.length == 0) {
      let modal = this.modalCtrl.create(TransactionModal, {unconfirmedTransaction: unconfirmedTransaction.transaction});
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

  private signTransaction(unconfirmedTransaction: MultisigTransactionPlusView) {
    const multisigSignedTransaction = MultisigSignatureTransaction.create(
      TimeWindow.createWithDeadline(),
      unconfirmedTransaction.transaction.otherTransaction.signer.address,
      unconfirmedTransaction.transaction.hashData
    );
    unconfirmedTransaction.signing = true;
    const signedTransaction = this.account.signTransaction(multisigSignedTransaction);
    this.transactionHttp.announceTransaction(signedTransaction).subscribe(x => {
        console.log(x);
        unconfirmedTransaction.signing = false;
        unconfirmedTransaction.signed = true;
      }, err => {
        unconfirmedTransaction.signing = false;
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
}

class MultisigTransactionPlusView {
  constructor(public transaction: MultisigTransaction,
              public signing: boolean,
              public signed: boolean) {
  }

  transactionType(): TransactionTypes {
    return this.transaction.type;
  }

  signerAddress(): string {
    return this.transaction.signer.address.pretty();
  }

  timeStamp(): LocalDateTime {
    return this.transaction.timeWindow.timeStamp;
  }

  deadline(): LocalDateTime {
    return this.transaction.timeWindow.deadline;
  }

  getTransactionData(): MultisigTransactionInfo {
    return <MultisigTransactionInfo>this.transaction.getTransactionInfo();
  }
}
