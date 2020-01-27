import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OnToolbarItemClick, Toolbar, ToolbarItemType, ToolbarType, ListToolbars } from '../../../shell';
import { Subject, Observable } from 'rxjs';
import { PersonsListDTO } from '../dtos/persons-list.dto';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PersonsListStore } from '../states/persons-list.store';
import { PersonsListQuery } from '../states/persons-list.query';
import { filter, map, takeUntil } from 'rxjs/operators';
import { navigateUp } from '../../../util/navigateUp';
import { PersonsListComponent } from '../components/persons-list.component';
import { PartiesService } from '../services/parties.service';
import { PartiesCommonService } from '../services/parties-common.service';

@Component({
  selector: 'app-persons-list-page',
  template: `
    <!-- <pre>{{ state$ | async | json }} </pre> -->
    <div class="persons-list-page">
      <nz-collapse>
        <nz-collapse-panel
          nzHeader="Persons List"
          [nzDisabled]="false"
          [nzActive]="true"
          [nzShowArrow]="false"
        >
          <ng-container *ngIf="persons$ | async as persons">
            <section [class.hide]="loading$ | async">
              <app-persons-list
                [persons]="persons"
                [partyId]="partyId"
                (enableDelete)="onEnableDelete()"
                (disableDelete)="onDisableDelete()"
                (enableViewEdit)="onEnableViewEdit()"
                (disableViewEdit)="onDisableViewEdit()"
              >
              </app-persons-list>
            </section>
          </ng-container>
        </nz-collapse-panel>
      </nz-collapse>
    </div>
  `
})
export class PersonsListPageComponent
  implements OnInit, OnDestroy, OnToolbarItemClick, AfterViewInit {
  // all variables needed
  destroy$ = new Subject();
  loading$: Observable<boolean>;
  persons$: Observable<PersonsListDTO[]>;
  state$: Observable<object>;
  sourceData: any;
  partyId: string;

  // view child decorator with child component 
  @ViewChild(PersonsListComponent, { static: false })
  personsListComponent: PersonsListComponent;

  constructor(
    private partiesService: PartiesService,
    private partiesCommonService: PartiesCommonService,
    private modal: NzModalService,
    private message: NzMessageService,
    private toolbar: Toolbar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private personsListStore: PersonsListStore,
    private personsListQuery: PersonsListQuery,
    private http: HttpClient
  ) { }

  // method to call the service and get all persons from the server
  getPersonsList() {
    this.persons$ = this.partiesService.getPersonsList();
    this.loading$ = this.personsListQuery.selectLoading();
        
  }

  // method or event to put all the initialization
  ngOnInit() {
    // check and execute a query against the store if data already exist,
    //and used the store as a source of data after retrieving from the server
    if (this.personsListQuery.getCount() > 0) {
      this.persons$ = this.personsListQuery.selectAll();
      
    } else {
      // call the method to retrieve all data the from server
      this.getPersonsList();
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
    if (this.getPersonPartyId() != null) {
      this.partyId = this.getPersonPartyId();
    } else {
      this.partyId = null;
    }

    
    this.ref.detectChanges();

    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.toolbar.load(...ListToolbars());
  }

  // method to get the current party id
  getPersonPartyId(): string {
    var partyId: string;
    this.partiesCommonService.party$.subscribe(p => {
      partyId = p.partyID;
    })
    return partyId;
  }

  // method or event to set service to default
  ngAfterViewInit() {
    // make sure the flag was reset to false value, the flag was used to clear the new form and and execute the addCityEntry method once.
    this.partiesCommonService.setPartyFlag({ flag: false }); // reset flag to false and city area will refer this flag
    this.partiesCommonService.setPartyId({ partyID: null });  // default/reset area id to null
    this.partiesCommonService.setSource({ sourceName: null });
    this.partiesCommonService.setEnableEdit({ editEnable: false });
    this.partiesCommonService.setToggle({ toggleName: null });
  }

  // method to call toolbar type 
  onToolbarItemClicked(type: ToolbarItemType) {
    var data = [];
    var partyId: string;

    switch (type) {
      case ToolbarType.New:
        var status = 'New';
        // set the service the current status to new
        this.partiesCommonService.setStatus({ status: status });
        // set the service the current flag status to false
        this.partiesCommonService.setPartyFlag({ flag: false });
        this.router.navigate([status.toLowerCase()], { relativeTo: this.activatedRoute });
        break;

      case ToolbarType.Close:
        navigateUp(this.router);
        break;

      case ToolbarType.Edit:
        var status = 'Edit';
        data = this.personsListComponent.getSelectedRow(); // call city list method to get the selected row
        if (data.length > 0) {
          data.map(d => {
            partyId = d.partyID;
          })

          // set party id use for list, component and treeview reference
          this.partiesCommonService.setPartyId({ partyID: partyId });
          // set the service to current status to edit
          this.partiesCommonService.setStatus({ status: status });
          // set default flag to false
          this.partiesCommonService.setPartyFlag({ flag: false });
          // navigate to component
          //this.router.navigate([status.toLowerCase()], { relativeTo: this.activatedRoute });
          this.router.navigateByUrl('/common-objects/party/person/' + status.toLowerCase() +'/' + partyId);
        }
        break;

      case ToolbarType.View:
        var status = 'View'
        data = this.personsListComponent.getSelectedRow(); // call persons list method to get the selected row
         if (data.length > 0) {
          data.map(d => {
            partyId = d.partyID;
          })

          // set person batch id use for list, component and treeview reference
          this.partiesCommonService.setPartyId({ partyID: partyId });
          // set the service to current status to view
          this.partiesCommonService.setStatus({ status: status });
          // set default flag to false
          this.partiesCommonService.setPartyFlag({ flag: false });
          // navigate to component
          this.router.navigateByUrl('/common-objects/party/person/' + status.toLowerCase() + '/' + partyId);
        }
        break;

      case ToolbarType.Delete:
        // call persons list component method to delete the person
        this.personsListComponent.onDeleteParty();
        break;

      case ToolbarType.Columns:
        // call persons list component method to open a dialog box to set visible or hide the column
        this.personsListComponent.openShowColDialog();
        break;

      case ToolbarType.Refresh:
        // reset all data in store
        this.personsListStore.remove();
        // method to call the service and retrieved data from the server
        this.getPersonsList();
        break;

      default:
        break;
    }
  }

  // method to enable toolbar delete
  onEnableDelete() {
    this.toolbar.enable(ToolbarType.Delete);
  }

  // method to disable toolbar delete
  onDisableDelete() {
    this.toolbar.disable(ToolbarType.Delete);
  }

  // method to enable toolbar view/edit
  onEnableViewEdit() {
    this.toolbar.enable(ToolbarType.View, ToolbarType.Edit);
  }

  // method to disable view edit
  onDisableViewEdit() {
    this.toolbar.disable(ToolbarType.View, ToolbarType.Edit);
  }

  // method or event to destroy the observable
  ngOnDestroy() {
    this.destroy$.next(); // destroy observable that was subscribed
    this.destroy$.complete();
  }


}
