import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.css']
})
export class EditPopupComponent {
  @Input() isOpen: boolean = false;
  @Input() closable: boolean = true;
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();
  @Output() editTransaction: EventEmitter<number> = new EventEmitter<number>(); // Додайте вивід події для передачі transactionId

  transactionId: number | undefined;

  popupStyles: any = {};

  openPopup(transactionId: number) {
    this.transactionId = transactionId;
    this.isOpen = true;
  }

  onClosePopup() {
    this.isOpen = false;
    this.closePopup.emit();
  }

  sendPostRequest() {
    // Тут ви можете викликати метод editTransaction() та передати transactionId
    if (this.transactionId !== undefined) {
      this.editTransaction.emit(this.transactionId);
    }
  }
}
