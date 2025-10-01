import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shopping-list-modal',
  templateUrl: './shopping-list-modal.component.html',
  styleUrl: './shopping-list-modal.component.css',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TextareaModule, ToastModule],
  providers: [MessageService]
})
export class ShoppingListModalComponent {
  @Input() visible: boolean = false;
  @Input() shoppingList: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(private messageService: MessageService) {}

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.shoppingList);
      this.messageService.add({
        severity: 'success',
        summary: 'Copied!',
        detail: 'Shopping list copied to clipboard',
        life: 3000
      });
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      this.fallbackCopyToClipboard();
    }
  }

  private fallbackCopyToClipboard() {
    const textArea = document.createElement('textarea');
    textArea.value = this.shoppingList;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.messageService.add({
        severity: 'success',
        summary: 'Copied!',
        detail: 'Shopping list copied to clipboard',
        life: 3000
      });
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Copy Failed',
        detail: 'Unable to copy to clipboard',
        life: 3000
      });
    } finally {
      document.body.removeChild(textArea);
    }
  }
}