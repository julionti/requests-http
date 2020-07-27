import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

export enum AlertTypes {
  DANGER = 'danger',
  SUCCESS = 'success'
}

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {

constructor(private modalService: BsModalService) { }

  private showAlert(message, type: AlertTypes) {
  const bsModalRef = this.modalService.show(AlertModalComponent);
  bsModalRef.content.type = type;
  bsModalRef.content.message = message;
}

showAlertDanger(message: string) {
  this.showAlert(message, AlertTypes.DANGER);
}

showAlertSuccess(message: string) {
  this.showAlert(message, AlertTypes.SUCCESS);
}
}