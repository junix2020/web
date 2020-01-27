import { Injectable } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';
/**
 * Provides utiilty function to control the tree area.
 */
@Injectable({
  providedIn: 'root'
})
export class Tree {
  private _loaded$ = new BehaviorSubject<NzTreeNodeOptions[]>([]);
  private _selected$ = new BehaviorSubject<NzTreeNodeOptions>(null);

  /**
   * An observable that emits when nodes are loaded.
   */
  loaded$ = this._loaded$.asObservable();

  /**
   * An observable that emits when a node is selected.
   */
  selected$ = this._selected$.asObservable();

  /**
   * Loads the tree nodes passed.
   * @param items the items to be used in the tree
   */
  load(items: NzTreeNodeOptions[]) {
    this._loaded$.next(items);
  }

  select(item: NzTreeNodeOptions) {
    this._selected$.next(item);
  }
}
