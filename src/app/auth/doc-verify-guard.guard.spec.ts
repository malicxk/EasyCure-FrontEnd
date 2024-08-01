import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { docVerifyGuardGuard } from './authGuards/doc-verify-guard.guard';

describe('docVerifyGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => docVerifyGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
