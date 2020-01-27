import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Utility service that allows you to temporarily hide the route component and inject another component
 * at runtime.
 *
 * @sadness
 * This kind of service wouldn't have to exist if replacing route enabled panels were not a requirement.
 */
@Injectable({
  providedIn: 'root'
})
export class PanelService {
  private _loaded$ = new Subject<TemplateRef<any>>();
  private _unloaded$ = new Subject<void>();
  private _outletVisibilityChange = new Subject<boolean>();

  /**
   * An observable that emits when a panel is to be loaded.
   */
  loaded$ = this._loaded$.asObservable();

  /**
   * An observable that emits when the loaded panel should be unloaded.
   */
  unloaded$ = this._unloaded$.asObservable();

  /**
   * An observable that emits the value of visbility of the routing outlet.
   */
  outletVisibilityChange$ = this._outletVisibilityChange.asObservable();

  showOutlet() {
    this._outletVisibilityChange.next(true);
  }

  hideOutlet() {
    this._outletVisibilityChange.next(false);
  }

  load(templateRef: TemplateRef<any>) {
    this._loaded$.next(templateRef);
  }

  unload() {
    this._unloaded$.next();
  }
}
