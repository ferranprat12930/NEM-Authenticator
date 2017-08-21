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
import {
  Account,
  AccountHttp,
  ConfirmedTransactionListener,
  MultisigSignatureTransaction,
  MultisigTransaction,
  NEMLibrary,
  TimeWindow,
  Transaction,
  TransactionHttp,
  TransactionTypes,
  UnconfirmedTransactionListener
} from "nem-library";
import {LocalDateTime} from "js-joda";
import {MultisigTransactionInfo} from "nem-library/dist/src/models/transaction/TransactionInfo";
import {NetworkTypes} from "nem-library/dist/src/models/node/NetworkTypes";
import {AccountService} from "../../services/account.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage {
  NEMLibrary = NEMLibrary;
  NetworkTypes = NetworkTypes;

  private account: Account;
  unconfirmedTransactions: MultisigTransactionPlusView[];
  loader: Loading;
  accountPulling: Observable<MultisigTransactionPlusView[]>;

   constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public accountHttp: AccountHttp,
              private accountService: AccountService,
              public transactionHttp: TransactionHttp,
              private translateService: TranslateService) {
     this.translateService.get("LOADING_WAIT_TEXT").subscribe(value => {
       this.loader = loadingCtrl.create({
         content: value
       });
       this.loader.present().then(() => {
       });

     });

    this.account = this.accountService.getAccount();
    this.accountPulling = accountHttp.unconfirmedTransactions(this.account.address)
      .flatMap(_ => _)
      .filter(transaction => transaction.type == TransactionTypes.MULTISIG)
      .map(multisigTransaction => new MultisigTransactionPlusView(<MultisigTransaction> multisigTransaction, false, false))
      .toArray();
    this.fetchTransactions();

    let multisig = accountService.getMultisig();
    new UnconfirmedTransactionListener().given(multisig)
      .delay(1000)
      .subscribe(_ => {
        this.fetchTransactions();
      });

    new ConfirmedTransactionListener().given(multisig)
      .subscribe(transaction => {
        if (transaction.type == TransactionTypes.MULTISIG) {
          this.unconfirmedTransactions = this.unconfirmedTransactions
            .filter(x => {
              const innerData = x.transaction.hashData.data;
              const confirmedTransactionInnerData = (<MultisigTransactionInfo>(<MultisigTransaction>transaction).getTransactionInfo()).innerHash.data;
              return innerData != confirmedTransactionInnerData;
            })
        }
      })
  }

  async fetchTransactions(refresher?: any) {
    let noInternetMessage = await this.translateService.get("ERROR_NO_INTERNET").toPromise();
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
          message: noInternetMessage,
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
    if (!unconfirmedTransaction.signed) {
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
        unconfirmedTransaction.signing = false;
        unconfirmedTransaction.signed = true;
      }, err => {
        unconfirmedTransaction.signing = false;
      }
    );
  }

  private async showAlreadyConfirmedTransactionToast() {
    let toast = this.toastCtrl.create({
      message: await this.translateService.get("ERROR_TRANSACTION_SIGNED").toPromise(),
      duration: 3000
    });
    toast.present();
  }
}

class MultisigTransactionPlusView {
  constructor(public transaction: MultisigTransaction,
              public signing: boolean,
              public signed: boolean) {
    this.signed = this.transaction.signatures.length == 1;
  }

  transactionType(): TransactionTypes {
    return this.transaction.otherTransaction.type;
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
