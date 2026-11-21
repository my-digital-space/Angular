import { EnvironmentInjector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ChatWidgetComponent } from './chat-widget.component';

export function registerChatWidgetCustomElement(injector: EnvironmentInjector): void {
  if (typeof window !== 'undefined' && !customElements.get('support-chat-widget')) {
    const chatElement = createCustomElement(ChatWidgetComponent, { injector });
    customElements.define('support-chat-widget', chatElement);
    console.log('[Angular Elements] <support-chat-widget> defined in CustomElementRegistry');
  }
}
