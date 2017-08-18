import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";

import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {XEMPipe} from "../pipes/xem.pipe";
import {TransactionModal} from "../pages/home/transaction.modal";
import {IonicStorageModule} from "@ionic/storage";
import {SetupPage} from "../pages/setup/setup";
import {SetupAccountModal} from "../pages/setup/setup-account.modal";
import {AccountHttp, TransactionHttp} from "nem-library";
import {AccountHttpInstanceFactory} from "../values/account-http.value";
import {TransactionHttpInstanceFactory} from "../values/transaction-http.value";
import {TransactionTypePipe} from "../pipes/transaction-type.pipe";
import {LocalTimeParserPipe} from "../pipes/local-time-parser.pipe";
import {TransferTransactionComponent} from "../components/transfer-transaction/transfer-transaction.component";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SetupPage,
    XEMPipe,
    TransactionTypePipe,
    LocalTimeParserPipe,
    TransactionModal,
    SetupAccountModal,
    TransferTransactionComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TransactionModal,
    SetupPage,
    SetupAccountModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: AccountHttp, useFactory: AccountHttpInstanceFactory},
    {provide: TransactionHttp, useFactory: TransactionHttpInstanceFactory}
  ]
})
export class AppModule {}
