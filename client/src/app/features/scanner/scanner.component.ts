import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ScannerComponent {
  private readonly platform = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platform);
}
