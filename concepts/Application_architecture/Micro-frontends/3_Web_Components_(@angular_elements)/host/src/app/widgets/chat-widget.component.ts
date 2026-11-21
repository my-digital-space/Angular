import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isBot: boolean;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <div class="chat-wrapper" [class.collapsed]="!isOpen()">
      @if (isOpen()) {
        <div class="chat-card">
          <!-- Widget Header -->
          <div class="widget-header">
            <div class="agent-info">
              <span class="status-indicator"></span>
              <div>
                <div class="agent-name">{{ supportAgent() }}</div>
                <div class="user-context">User ID: {{ userId() }}</div>
              </div>
            </div>
            <div class="header-btns">
              <button class="icon-btn" (click)="minimizeWidget()" title="Minimize">_</button>
              <button class="icon-btn close-btn" (click)="closeWidget()" title="Close">×</button>
            </div>
          </div>

          <!-- Technical Isolation Strip -->
          <div class="tech-strip">
            <span>&lt;support-chat-widget&gt;</span>
            <span>Shadow DOM Isolated</span>
          </div>

          <!-- Message History -->
          <div class="messages-list">
            @for (msg of messages(); track msg.time + msg.sender) {
              <div class="msg-bubble" [class.bot-msg]="msg.isBot" [class.user-msg]="!msg.isBot">
                <div class="msg-meta">
                  <span class="msg-sender">{{ msg.sender }}</span>
                  <span class="msg-time">{{ msg.time }}</span>
                </div>
                <div class="msg-text">{{ msg.text }}</div>
              </div>
            }

            @if (isTyping()) {
              <div class="typing-indicator">
                <span></span><span></span><span></span>
                <span class="typing-text">Agent is replying...</span>
              </div>
            }
          </div>

          <!-- Input Footer -->
          <div class="widget-footer">
            <input
              type="text"
              class="chat-input"
              [(ngModel)]="inputText"
              (keydown.enter)="sendMessage()"
              placeholder="Ask a question..."
            />
            <button class="send-btn" (click)="sendMessage()">
              Send
            </button>
          </div>
        </div>
      } @else {
        <!-- Collapsed Floating Action Pill -->
        <button class="launcher-pill" (click)="reopenWidget()">
          💬 <span>Live Support ({{ userId() }})</span>
        </button>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-sizing: border-box;
      color: #f8fafc;
    }
    * { box-sizing: border-box; }

    .chat-wrapper {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 10000;
      width: 360px;
      max-width: calc(100vw - 2rem);
    }
    .chat-wrapper.collapsed {
      width: auto;
    }

    .chat-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 14px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), 0 0 15px rgba(56, 189, 248, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 480px;
      animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes popIn {
      from { transform: scale(0.92) translateY(10px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .widget-header {
      padding: 0.85rem 1rem;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .agent-info {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .status-indicator {
      width: 10px;
      height: 10px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }
    .agent-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: #f8fafc;
    }
    .user-context {
      font-size: 0.725rem;
      color: #94a3b8;
    }
    .header-btns {
      display: flex;
      gap: 0.25rem;
    }
    .icon-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.1rem;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .icon-btn:hover {
      background: #334155;
      color: #f8fafc;
    }
    .close-btn:hover {
      background: #e11d48;
      color: #fff;
    }

    .tech-strip {
      background: #020617;
      padding: 0.3rem 0.75rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: #38bdf8;
      font-family: monospace;
      border-bottom: 1px solid #1e293b;
    }

    .messages-list {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: #0b1120;
    }

    .msg-bubble {
      max-width: 85%;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      font-size: 0.85rem;
      line-height: 1.4;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .bot-msg {
      align-self: flex-start;
      background: #1e293b;
      border: 1px solid #334155;
      color: #f1f5f9;
      border-bottom-left-radius: 2px;
    }
    .user-msg {
      align-self: flex-end;
      background: #0284c7;
      color: #ffffff;
      border-bottom-right-radius: 2px;
    }
    .msg-meta {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.68rem;
      opacity: 0.75;
    }
    .msg-sender { font-weight: 600; }
    .msg-time { font-family: monospace; }
    .msg-text { word-break: break-word; }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.4rem 0.6rem;
      background: #1e293b;
      border-radius: 8px;
      align-self: flex-start;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .typing-indicator span:not(.typing-text) {
      width: 5px;
      height: 5px;
      background: #38bdf8;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    .typing-text { margin-left: 0.35rem; }

    .widget-footer {
      padding: 0.75rem;
      background: #1e293b;
      border-top: 1px solid #334155;
      display: flex;
      gap: 0.5rem;
    }
    .chat-input {
      flex: 1;
      background: #0f172a;
      border: 1px solid #475569;
      border-radius: 6px;
      padding: 0.55rem 0.75rem;
      color: #f8fafc;
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .chat-input:focus {
      border-color: #38bdf8;
    }
    .send-btn {
      background: #0284c7;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 0.55rem 0.9rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .send-btn:hover {
      background: #0369a1;
    }

    .launcher-pill {
      background: linear-gradient(135deg, #0284c7, #6366f1);
      color: #ffffff;
      border: none;
      border-radius: 9999px;
      padding: 0.75rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(2, 132, 199, 0.45);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .launcher-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(2, 132, 199, 0.6);
    }
  `]
})
export class ChatWidgetComponent {
  // Signal Inputs: HTML attributes map automatically (PDF Page 9-10)
  readonly userId = input<string>('Guest');
  readonly supportAgent = input<string>('Sarah (AI Tier 3)');

  // Signal Outputs: Emits standard DOM CustomEvents to the host
  readonly chatClosed = output<void>();
  readonly messageSent = output<ChatMessage>();

  readonly isOpen = signal(true);
  readonly isTyping = signal(false);

  inputText = '';

  readonly messages = signal<ChatMessage[]>([
    {
      sender: 'Sarah (AI Tier 3)',
      text: 'Hello! I am your embedded Angular 22 Web Component assistant. How can I help you today?',
      time: '12:00 PM',
      isBot: true
    }
  ]);

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      sender: `User (${this.userId()})`,
      text,
      time,
      isBot: false
    };

    this.messages.update(list => [...list, userMsg]);
    this.inputText = '';

    // Dispatches DOM CustomEvent 'messageSent'
    this.messageSent.emit(userMsg);

    this.isTyping.set(true);
    setTimeout(() => {
      this.isTyping.set(false);
      const botReply: ChatMessage = {
        sender: this.supportAgent(),
        text: `Got your note: "${text}". I am a framework-agnostic Web Component with full Shadow DOM style encapsulation!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBot: true
      };
      this.messages.update(list => [...list, botReply]);
    }, 1000);
  }

  minimizeWidget(): void {
    this.isOpen.set(false);
  }

  closeWidget(): void {
    this.isOpen.set(false);
    // Dispatches DOM CustomEvent 'chatClosed'
    this.chatClosed.emit();
  }

  reopenWidget(): void {
    this.isOpen.set(true);
  }
}
