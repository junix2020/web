import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PartiesCommonService {

  lastPick$ = new BehaviorSubject<any>({
    pickName: null
  })

  toggle$ = new BehaviorSubject<any>({
    toggleName: null
  })

  enableEdit$ = new BehaviorSubject<any>({
    editEnable: false
  })

  saveSource$ = new BehaviorSubject<any>({
    sourceName: null
  })

  party$ = new BehaviorSubject<any>({
    partyID: null
  })

  flag$ = new BehaviorSubject<any>({
    flag: false
  })

  status$ = new BehaviorSubject<any>({
    status: null
  })

  setPartyFlag(params) {
     this.flag$.next(params);
  }

  setPartyId(params) {
    this.party$.next(params);
  }

  setStatus(params) {
   this.status$.next(params);
  }

  setSource(params) {
    this.saveSource$.next(params);
  }

  setLastPick(params) {
    this.lastPick$.next(params);
  }

  setEnableEdit(params) {
    this.enableEdit$.next(params);
  }

  setToggle(params) {
    this.toggle$.next(params);
  }
 
}
