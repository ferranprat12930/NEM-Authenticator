import {Component, OnInit} from "@angular/core";
import {Loading, LoadingController, NavController} from "ionic-angular";
import {UnconfirmedTransaction, UnconfirmedTransactions} from "nem-library/dist/src/models/UnconfirmedTransactions";
import {AccountHttp, TransactionHttp} from "nem-library";
import {Observable} from "rxjs";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  unconfirmedTransactions: UnconfirmedTransactions;
  private unconfirmedTransactionsEndpoint: Observable<any>;
  loader: Loading;

  constructor(public navCtrl: NavController,
              private loadingCtrl: LoadingController) {
    this.loader = loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    const accountHttp = new AccountHttp({domain: 'bob.nem.ninja'});
    this.unconfirmedTransactionsEndpoint = Observable.interval(5000).flatMap(x => {
      return accountHttp.unconfirmedTransactions('TAZM4LSMAHPDEKHJJO6MVMBQ3C2KCJME5A2DYFOJ');
    });
  }

  ngOnInit(): void {
    this.unconfirmedTransactionsEndpoint.subscribe(
      value => {
        this.unconfirmedTransactions = value;
        this.loader.dismiss();
      }
    );
  }

  cosignTransaction(unconfirmedTransaction: UnconfirmedTransaction) {
    //const transactionHttp = new TransactionHttp();
    
  }

}
