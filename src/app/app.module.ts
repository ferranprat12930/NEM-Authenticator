import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Http, HttpModule} from "@angular/http";

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
import {ProvisionNamespaceTransactionComponent} from "../components/provision-namespace-transaction/provision-namespace-transaction.component";
import {MultisigAggregateModificationTransactionComponent} from "../components/multisig-aggregate-transaction/multisig-aggregate-modification-transaction.component";
import {MosaicSupplyChangeTransactionComponent} from "../components/mosaic-supply-change-transaction/mosaic-supply-change-transaction.component";
import {MosaicDefinitionCreationTransactionComponent} from "../components/mosaic-definition-transaction/mosaic-definition-creation-transaction.component";
import {ImportanceTransferTransactionComponent} from "../components/importance-transaction/importance-transfer-transaction.component";
import {AccountService} from "../services/account.service";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {LoginModal} from "../components/login-modal/login.modal";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    LoginModal,
    TransferTransactionComponent,
    ProvisionNamespaceTransactionComponent,
    MultisigAggregateModificationTransactionComponent,
    MosaicSupplyChangeTransactionComponent,
    MosaicDefinitionCreationTransactionComponent,
    ImportanceTransferTransactionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TransactionModal,
    SetupPage,
    SetupAccountModal,
    LoginModal
  ],
  providers: [
    AccountService,
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: AccountHttp, useFactory: AccountHttpInstanceFactory},
    {provide: TransactionHttp, useFactory: TransactionHttpInstanceFactory}
  ]
})
export class AppModule {}
