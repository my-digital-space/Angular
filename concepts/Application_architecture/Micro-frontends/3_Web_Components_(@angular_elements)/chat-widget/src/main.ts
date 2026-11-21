import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { ChatWidgetComponent } from './app/chat-widget.component';

(async () => {
  try {
    // 1. Create a headless Angular application injector (no root router needed)
    const app = await createApplication({
      providers: []
    });

    // 2. Convert the Angular component into a native browser Custom Element class
    const chatElement = createCustomElement(ChatWidgetComponent, {
      injector: app.injector
    });

    // 3. Register the HTML tag name in the browser's CustomElementRegistry
    if (!customElements.get('support-chat-widget')) {
      customElements.define('support-chat-widget', chatElement);
      console.log('[Angular Elements] <support-chat-widget> registered successfully!');
    }
  } catch (err) {
    console.error('[Angular Elements] Error registering custom element:', err);
  }
})();
