import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';
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
  private readonly platform = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platform);

  readonly agreed$ = new BehaviorSubject<boolean>(false);
  readonly isAgreed$ = this.agreed$.asObservable();

  onSuccess(result: string) {
    console.log(result);
  }

  onPermission(agreed: boolean) {
    this.agreed$.next(agreed);
  }
}
