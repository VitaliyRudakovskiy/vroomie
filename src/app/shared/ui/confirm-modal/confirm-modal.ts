import { Component, input, output } from '@angular/core';
import { Button } from '@shared/ui';

@Component({
  selector: 'app-confirm-modal',
  imports: [Button],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
  visible = input.required<boolean>();

  modalTitle = input.required<string>();
  description = input.required<string>();
  confirmLabel = input('Yes');
  cancelLabel = input('Cancel');
  loading = input(false);

  confirm = output<void>();
  cancelEvent = output<void>();

  onClose(): void {
    this.cancelEvent.emit();
  }

  onApply(): void {
    this.confirm.emit();
  }
}
