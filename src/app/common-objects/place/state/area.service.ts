import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { environment } from '@web-environment/environment';
import { Messages } from '@web/shared/messages';
import { isNotEmpty } from '@web/util';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Area } from './area.model';
import { AreaStore } from './area.store';

const baseUrl = `${environment.apiUrl}/common-objects/place/areas`;

@Injectable({ providedIn: 'root' })
export class AreaService {
  constructor(
    private store: AreaStore,
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  findAll(type: string = ''): Observable<Area[]> {
    return this.http
      .get<Area[]>(baseUrl, { params: { type } })
      .pipe(
        tap(entities => isNotEmpty(entities) && this.store.upsertMany(entities))
      );
  }

  findByID(areaID: ID): Observable<Area> {
    return this.http
      .get<Area>(`${baseUrl}/${areaID}`)
      .pipe(tap(entity => this.store.upsert(areaID, entity)));
  }

  removeByIDs(areaIDs: ID[]) {
    return this.http.post(`${baseUrl}/delete`, areaIDs).pipe(
      tap(() => this.store.remove(areaIDs)),
      tap(() => this.message.success(Messages.RECORD_REMOVE_SUCCESS))
    );
  }

  save(model: Area) {
    return this.http.put<Area>(`${baseUrl}/${model.areaID}`, model).pipe(
      tap(() => this.store.upsert(model.areaID, model)),
      tap(() => this.message.success(Messages.RECORD_SAVE_SUCCESS))
    );
  }
}
