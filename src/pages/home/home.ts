import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
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

  constructor(public navCtrl: NavController) {
    const accountHttp = new AccountHttp({domain: 'bob.nem.ninja'});
    this.unconfirmedTransactionsEndpoint = Observable.interval(5000).flatMap(x => {
      return accountHttp.unconfirmedTransactions('TAZM4LSMAHPDEKHJJO6MVMBQ3C2KCJME5A2DYFOJ');
    });
  }

  ngOnInit(): void {
    this.unconfirmedTransactionsEndpoint.subscribe(
      value => this.unconfirmedTransactions = value
    );
  }

  cosignTransaction(unconfirmedTransaction: UnconfirmedTransaction) {
    const transactionHttp = new TransactionHttp();
    transactionHttp.prepareAnnounce({
      privateKey: "",
      transaction: {
        timeStamp: unconfirmedTransaction.transaction.timeStamp,
        fee: 6000000,
        type: 4098,
        deadline: unconfirmedTransaction.transaction.deadline,
        version: unconfirmedTransaction.transaction.version,
        signer: "5d5d829644625eb6554273f70b1187d904761fab4c5c0e5f01666f6725e9278b",
        otherHash: {
          data: unconfirmedTransaction.meta.data
        },
        otherAccount: "TAZM4LSMAHPDEKHJJO6MVMBQ3C2KCJME5A2DYFOJ"
      }
    }).subscribe(x => {
      console.log("SUCCESS", x)
    }, err => console.log("ERROR", err))
  }

}
