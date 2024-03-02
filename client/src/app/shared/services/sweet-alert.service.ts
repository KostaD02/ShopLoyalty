import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  displayToast(
    title: string,
    icon: SweetAlertIcon,
    color: string,
    time: number = 1500,
  ): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: color,
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: time,
      timerProgressBar: true,
    });
    Toast.fire({
      icon,
      title,
    });
  }

  displayModal(icon: SweetAlertIcon, title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
    });
  }

  displayError(error: { error: { messages: string[] } }) {
    const messages = error.error.messages;
    if (messages.length === 1) {
      this.displayToast(messages[0], 'error', 'red');
    } else {
      this.displayModal('error', 'Error', messages.join());
    }
  }
}
