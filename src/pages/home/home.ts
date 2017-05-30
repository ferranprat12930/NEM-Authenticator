import {Component, OnInit} from "@angular/core";
import {Loading, LoadingController, NavController, ToastController} from "ionic-angular";
import {
  Account,
  AccountHttp,
  MultisigSignatureTransaction,
  TransactionHttp,
  UnconfirmedTransaction,
  UnconfirmedTransactions
} from "nem-library";
import {Observable} from "rxjs";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  readonly address = 'TAZM4LSMAHPDEKHJJO6MVMBQ3C2KCJME5A2DYFOJ';
  unconfirmedTransactions: UnconfirmedTransaction[];
  private unconfirmedTransactionsEndpoint: Observable<UnconfirmedTransactions>;
  loader: Loading;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.loader = loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    const accountHttp = new AccountHttp({domain: 'bob.nem.ninja'});
    this.unconfirmedTransactionsEndpoint = Observable.interval(5000).startWith(0).flatMap(x => {
      return accountHttp.unconfirmedTransactions(this.address);
    });
  }

  ngOnInit(): void {
    this.unconfirmedTransactionsEndpoint.subscribe(
      value => {
        this.unconfirmedTransactions = value.data.filter(x => {
          return x.transaction.type == 4100;
        });
        this.loader.dismiss();
      }
    );
  }

  cosignTransaction(unconfirmedTransaction: UnconfirmedTransaction) {
    if (unconfirmedTransaction.transaction.signatures.length == 0) {
      this.signTransaction(unconfirmedTransaction);
    } else {
      this.showAlreadyConfirmedTransactionToast();
    }
  }

  private signTransaction(unconfirmedTransaction: UnconfirmedTransaction) {
    const transactionHttp = new TransactionHttp({domain: 'bob.nem.ninja'});
    const account = new Account(this.address,
      '5d5d829644625eb6554273f70b1187d904761fab4c5c0e5f01666f6725e9278b',
      '');
    const multisigSignedTransaction = new MultisigSignatureTransaction(
      unconfirmedTransaction.transaction.timeStamp,
      unconfirmedTransaction.transaction.deadline,
      unconfirmedTransaction.transaction.fee,
      'TBUAUC3VYKPP3PJPOH7A7BCB2C4I64XZAAOZBO6N',
      {data: unconfirmedTransaction.meta.data},
      account.publicKey
    );
    const signedTransaction = account.signTransaction(multisigSignedTransaction);
    console.log(multisigSignedTransaction);
    transactionHttp.announceTransaction(signedTransaction).subscribe(x => {
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

}
