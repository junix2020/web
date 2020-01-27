import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CityAreaCommonService {

    cityArea$ = new BehaviorSubject<any>(
        {
            "areaID": null
        }
    )

    flag$ = new BehaviorSubject<any>(
        {
            flag: false
        }
    )

    status$ = new BehaviorSubject<any>(
        {
            status: null
        }
    )

    setCityAreaFlag(params) {
        this.flag$.next(params);
    }

    setCityAreaId(params) {
        this.cityArea$.next(params);
    }

    setStatus(params) {
        this.status$.next(params);
    }
}
