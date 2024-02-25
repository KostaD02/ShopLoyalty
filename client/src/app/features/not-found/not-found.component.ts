import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxCubeLoaderComponent } from 'ngx-cube-loader';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NgxCubeLoaderComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundComponent {}
