import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplitterService {
  private _mouseUp$ = new Subject<void>();

  mouseUp$ = this._mouseUp$.asObservable();

  mouseUp() {
    this._mouseUp$.next();
  }
}
