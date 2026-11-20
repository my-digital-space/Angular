import { TestBed } from '@angular/core/testing';
import { NotifyService } from './notify.service';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

describe('NotifyService', () => {
  let service: NotifyService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [NotifyService]
    });
    service = TestBed.inject(NotifyService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with null message', () => {
    expect(service.message()).toBeNull();
  });

  it('should show message and clear after 3000ms timeout', () => {
    service.show('Saved!');
    expect(service.message()).toBe('Saved!');

    vi.advanceTimersByTime(3000);
    expect(service.message()).toBeNull();
  });
});
