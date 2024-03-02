import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FRONTEND_ENDPOINT } from '@app-shared/consts';
import { SweetAlertService } from '@app-shared/services';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [ZXingScannerModule, AsyncPipe],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ScannerComponent {
  private readonly sweetAlertService = inject(SweetAlertService);
  private readonly router = inject(Router);
  private readonly platform = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platform);

  readonly agreed$ = new BehaviorSubject<boolean>(false);
  readonly isAgreed$ = this.agreed$.asObservable();

  onSuccess(result: string) {
    const url = result.split(FRONTEND_ENDPOINT).slice(1).pop() || '';
    const regexUrl = /^\/scan\/product\/[A-Za-z0-9_\-]+$/;
    if (!regexUrl.test(url)) {
      this.sweetAlertService.displayModal(
        'warning',
        'Incorrect QR code',
        'QR code must be generated from our website :)',
      );
      return;
    }

    this.router.navigateByUrl(url);
  }

  onPermission(agreed: boolean) {
    this.agreed$.next(agreed);
  }
}
