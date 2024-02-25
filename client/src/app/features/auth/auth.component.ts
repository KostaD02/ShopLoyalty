import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthComponent {}
