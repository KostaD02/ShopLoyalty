import { Injectable } from '@angular/core';
import { FRONTEND_ENDPOINT } from '@app-shared/consts';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  downloadCanvas(
    canvas: HTMLCanvasElement,
    imageName: string,
    extension: 'png' | 'jpg' = 'png',
  ) {
    const image =
      canvas
        ?.toDataURL('image/png', 1.0)
        .replace('image/png', 'image/octet-stream') || '';
    const link = document.createElement('a');
    link.style.display = 'none';
    link.download = `${imageName}.${extension}`;
    link.href = image;
    link.click();
    link.remove();
  }

  generateUrlForQrCode(productID: string) {
    return `${FRONTEND_ENDPOINT}/scan/product/${productID}`;
  }
}
