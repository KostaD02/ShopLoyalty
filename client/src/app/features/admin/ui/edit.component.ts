import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [],
  template: ``,
  styles: `
    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 5px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent {}
