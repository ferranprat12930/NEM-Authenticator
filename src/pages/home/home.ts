import {Component} from "@angular/core";
import {Loading, LoadingController, ModalController, NavController, ToastController} from "ionic-angular";
import {
  Account,
  AccountHttp,
  MultisigSignatureTransaction,
  TransactionHttp,
  UnconfirmedTransaction,
  UnconfirmedTransactions
} from "nem-library";
import {Observable} from "rxjs";
import {TransactionModal} from "./transaction.modal";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private account: Account;
  unconfirmedTransactions: UnconfirmedTransaction[];
  loader: Loading;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public accountHttp: AccountHttp,
              public transactionHttp: TransactionHttp,
              private storage: Storage) {
    this.storage.get('PRIVATE_KEY').then(privateKey => {
      this.account = Account.generateWithPrivateKey(privateKey);
      Observable.interval(5000).startWith(0).flatMap(x => {
        return accountHttp.unconfirmedTransactions(this.account.address);
      }).map(x => {
        return this.removeAllTransactionsThatAreNotMultisig(x)
      }).subscribe(
        value => {
          this.unconfirmedTransactions = value;
          this.loader.dismiss();
        }
      );
    });
    this.loader = loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  cosignTransaction(unconfirmedTransaction: UnconfirmedTransaction) {
    if (unconfirmedTransaction.transaction.signatures.length == 0) {
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

  private signTransaction(unconfirmedTransaction: UnconfirmedTransaction) {
    const multisigSignedTransaction = MultisigSignatureTransaction.createGivenUnconfirmedTransaction(
      unconfirmedTransaction
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

  private removeAllTransactionsThatAreNotMultisig(unconfirmedTransactions: UnconfirmedTransactions): UnconfirmedTransaction[] {
    return unconfirmedTransactions.data.filter(x => {
      return x.transaction.type == 4100;
    });
  }
}
