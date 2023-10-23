import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.css']
})
export class EditPopupComponent {
  @Input() isOpen: boolean = false;
  @Input() closable: boolean = true;
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();

  openPopup() {
    this.isOpen = true;
  }

  onClosePopup() {
    this.isOpen = false;
    this.closePopup.emit();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.closable) {
      if (event.target === event.currentTarget) {
        this.onClosePopup();
      }
    }
  }
}
