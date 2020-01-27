import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  cityAreaListFormToolbars,
  OnToolbarItemClick,
  Toolbar,
  ToolbarItemType,
  ToolbarType
} from '@web/shell';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { navigateUp } from '../../../util/navigateUp';
import { CityListComponent } from '../components/city-list.component';
import { AreaDTO } from '../dto/area.dto';
import { CityAreasService } from '../services/city-areas.service';
import { AreasQuery } from '../state/areas.query';
import { AreasStore } from '../state/areas.store';
import { CityAreaCommonService } from '../services/city-area-common-service';

@Component({
  selector: 'app-city-page',
  template: `
    <!-- <pre>{{ state$ | async | json }} </pre> -->
    <div class="city-list-page">
      <nz-collapse>
        <nz-collapse-panel
          nzHeader="City"
          [nzDisabled]="false"
          [nzActive]="true"
          [nzShowArrow]="false"
        >
          <ng-container *ngIf="cities$ | async as cities">
            <section [class.hide]="loading$ | async">
              <app-city-list
                [cities]="cities"
                [areaId]="areaId"
                (enableDelete)="onEnableDelete()"
                (disableDelete)="onDisableDelete()"
                (enableViewEdit)="onEnableViewEdit()"
                (disableViewEdit)="onDisableViewEdit()"
              >
              </app-city-list>
            </section>
          </ng-container>
        </nz-collapse-panel>
      </nz-collapse>
    </div>
  `
})
export class CityListPageComponent
    implements OnInit, OnDestroy, OnToolbarItemClick, AfterViewInit {
// all variables needed
  destroy$ = new Subject();
  loading$: Observable<boolean>;
  cities$: Observable<AreaDTO[]>;
  state$: Observable<object>;
  sourceData: any;
  areaId: string;

// view child decorator with child component 
  @ViewChild(CityListComponent, { static: false })
  cityListComponent: CityListComponent;

  constructor(
    private cityAreasService: CityAreasService,
    private cityAreaCommonService: CityAreaCommonService,
    private modal: NzModalService,
    private message: NzMessageService,
    private toolbar: Toolbar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private areasStore: AreasStore,
    private areasQuery: AreasQuery,
    private http: HttpClient
  ) {}

// method to call the service and get all cities from the server
    getCities() {
      this.cities$ = this.cityAreasService.getCities();
      this.loading$ = this.areasQuery.selectLoading();
    }

// method or event to put all the initialization
    ngOnInit() {
      // check and execute a query against the store if data already exist,
      //and used the store as a source of data after retrieving from the server
      if (this.areasQuery.getAll().length > 0) {
        this.cities$ = this.areasQuery.selectAll();
      } else {
        // call the method to retrieve all data the from server
        this.getCities();
      }

      // ---- for state object --------------------------------------------//
        this.state$ = this.router.events.pipe(
          filter(e => e instanceof NavigationStart),
          map(() => {
            const currentNav = this.router.getCurrentNavigation();
            return currentNav.extras.state;
          })
        );
        this.state$ = this.activatedRoute.paramMap.pipe(
          map(() => window.history.state)
        );
        this.state$.subscribe(s => {
          this.sourceData = s;
        });
      // ----------------------------------------------------------------//

      // assign current booking batch id from the service
      if (this.getCityAreaId() != null) {
          this.areaId = this.getCityAreaId();
      } else {
          this.areaId = null;
      }

      this.ref.detectChanges();

      this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
       this.toolbar.load(...cityAreaListFormToolbars());
    }

// method to get the current booking batch id
    getCityAreaId(): string {
      var areaId: string;
        this.cityAreaCommonService.cityArea$.subscribe(c => {
            areaId = c.areaID;
        })
        return areaId;
    }

// method or event to set service to default
    ngAfterViewInit() {
      // make sure the flag was reset to false value, the flag was used to clear the new form and and execute the addCityEntry method once.
      this.cityAreaCommonService.setCityAreaFlag({ flag: false }); // reset flag to false and city area will refer this flag
      this.cityAreaCommonService.setCityAreaId({ areaID: null });  // default/reset area id to null
    }

// method to call toolbar type 
  onToolbarItemClicked(type: ToolbarItemType) {
    var data = [];
    var areaId: string;

    switch (type) {
      case ToolbarType.cityAreaListNew:
        var status = 'New';
        // set the service the current status to new
        this.cityAreaCommonService.setStatus({ status: status });
        // set the service the current flag status to false
        this.cityAreaCommonService.setCityAreaFlag({ flag: false });
        this.router.navigate([status.toLowerCase()], { relativeTo: this.activatedRoute });
        break;

      case ToolbarType.cityAreaListClose:
        navigateUp(this.router);
        break;

      case ToolbarType.cityAreaListEdit:
        var status = 'Edit';
        data = this.cityListComponent.getSelectedRow(); // call city list method to get the selected row
        if (data.length > 0) {
            data.map(d => {
              areaId = d.areaID;
            })

            // set area id use for list, component and treeview reference
              this.cityAreaCommonService.setCityAreaId({ areaID: areaId }); 
            // set the service to current status to edit
              this.cityAreaCommonService.setStatus({ status: status });
            // set default flag to false
              this.cityAreaCommonService.setCityAreaFlag({ flag: false }); 
            // navigate to component
              this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + status.toLowerCase() + '/' + areaId);
        }
        break;

      case ToolbarType.cityAreaListView:
        var status = 'View'
        data = this.cityListComponent.getSelectedRow(); // call city list method to get the selected row
        if (data.length > 0) {
            data.map(d => {
              areaId = d.areaID;
            })

            // set booking batch id use for list, component and treeview reference
              this.cityAreaCommonService.setCityAreaId({ areaID: areaId });
            // set the service to current status to view
              this.cityAreaCommonService.setStatus({ status: status });
            // set default flag to false
              this.cityAreaCommonService.setCityAreaFlag({ flag: false }); 
            // navigate to component
              this.router.navigateByUrl('/common-objects/place/area/political-area/city/' + status.toLowerCase() + '/' + areaId ); 
        }
        break;

      case ToolbarType.cityAreaListDelete:
          // call city list component method to delete the city
              this.cityListComponent.onDeleteCityArea(); 
              break;

      case ToolbarType.cityAreaListColumns:
          // call city list component method to open a dialog box to set visible or hide the column
            this.cityListComponent.openShowColDialog(); 
            break;

      case ToolbarType.cityAreaListRefresh:
          // reset all data in store
            this.areasStore.remove();
          // method to call the service and retrieved data from the server
            this.getCities(); 
            break;

      default:
        break;
    }
  }

// method to enable toolbar delete
    onEnableDelete() {
        this.toolbar.enable(ToolbarType.cityAreaListDelete);
    }

// method to disable toolbar delete
    onDisableDelete() {
        this.toolbar.disable(ToolbarType.cityAreaListDelete);
    }

// method to enable toolbar view/edit
    onEnableViewEdit() {
        this.toolbar.enable(ToolbarType.cityAreaListView, ToolbarType.cityAreaListEdit);
    }

// method to disable view edit
    onDisableViewEdit() {
        this.toolbar.disable(ToolbarType.cityAreaListView, ToolbarType.cityAreaListEdit);
    }

// method or event to destroy the observable
    ngOnDestroy() {
      this.destroy$.next(); // destroy observable that was subscribed
      this.destroy$.complete();
    }

  
}
