import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created with empty messages', () => {
    expect(service.messages().length).toBe(0);
  });

  it('should append new toast immutably when show() is called', () => {
    service.show('Test notification', 'success');
    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].text).toBe('Test notification');
    expect(service.messages()[0].type).toBe('success');
  });

  it('should dismiss toast by id', () => {
    service.show('Notice 1', 'info');
    const toastId = service.messages()[0].id;
    service.dismiss(toastId);
    expect(service.messages().length).toBe(0);
  });
});
