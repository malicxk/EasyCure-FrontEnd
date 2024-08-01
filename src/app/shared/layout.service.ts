import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private showHeaderSubject = new BehaviorSubject<boolean>(true);
  private showFooterSubject = new BehaviorSubject<boolean>(true);

  showHeader$ = this.showHeaderSubject.asObservable();
  showFooter$ = this.showFooterSubject.asObservable();

  constructor() {}

  setShowHeader(show: boolean) {
    this.showHeaderSubject.next(show);
  }

  setShowFooter(show: boolean) {
    this.showFooterSubject.next(show);
  }
}