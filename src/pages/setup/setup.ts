import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html'
})
export class SetupPage {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      privateKey: ['', Validators.compose([Validators.required, Validators.minLength(64), Validators.maxLength(66)])]
    });
  }

  confirm() {

  }
}
