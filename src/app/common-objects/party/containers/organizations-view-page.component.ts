import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrganizationsFormComponent } from '../components/organizations-form.component';
import { Toolbar, ViewFormToolbars, ToolbarItemType, ToolbarType, ToggleViewFormToolbars } from '../../../shell';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { PartiesCommonService } from '../services/parties-common.service';
import { filter, map, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'organizations-view-page',
  template:
    `
 <!-- <pre>{{ state$ | async | json }} </pre> -->
 <div class="organizations-view-form">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="View Organization"
                  [nzDisabled]="false"
                  [nzActive]="true"
                  [nzShowArrow]="false">
                  <app-organizations-form
                     [partyId]="partyId"
                     [status]="status"
                     [isMsg]="isMsg"
                     (onSave)="onSave($event)"
                     (enableDelete)="onEnableDelete()"
                     (disableDelete)="onDisableDelete()"
                     (enableSave)="onEnableSave()"
                     (disableSave)="onDisableSave()"
                     (edit)="onEditToolbars()"
                     (resetForm)="onEmptyForm()"
                   >
                  </app-organizations-form>
               </nz-collapse-panel>
       </nz-collapse>
</div>
`
})
export class OrganizationsViewPageComponent implements OnInit, AfterViewInit, OnDestroy {
  // all variables needed
  organization$: Observable<any>;
  status: string;
  private sub: any;
  partyId: string;
  state$: Observable<object>;
  sourceData: any;
  isMsg: boolean;

  // a variable to destroy the observable
  destroy$ = new Subject();

  // a view child decorator with child components
  @ViewChild(OrganizationsFormComponent, { static: false }) organizationsFormComponent: OrganizationsFormComponent;

  constructor(
    private toolbar: Toolbar,
    private router: Router,
    private route: ActivatedRoute,
    private partiesService: PartiesService,
    private partiesCommonService: PartiesCommonService,
    public activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // set flag to disable form
    this.isMsg = false;
    this.onEnableEdit();
    // get party Id form the serive and assign it to property
    this.partyId = this.getOrganizationId(); // get party id from the service

    this.status = this.getOrganizationStatus();
    if (this.status == null) {
      this.status = 'View';
      this.partiesCommonService.setStatus({ status: this.status });
    }

    // for state object
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

    })

    this.status = this.getOrganizationStatus();
    if (this.status == null) {
      this.status = 'View';
      this.partiesCommonService.setStatus({ status: this.status });
    }

    if (this.getToggleName() == 'Edit') {
      this.onEditToolbars();
    } else if (this.status == 'View') {
      this.toolbar.clicked$
        .pipe(takeUntil(this.destroy$))
        .subscribe(type => this.onToolbarItemClicked(type));
      this.onViewToolbars();
      this.onEnableEdit();
      if (this.getEnableEdit()) {
        this.onEnableSave();
      }
    } 
        
    // if flag was set to true don't retrieve again the person
    if (this.getFlagStatus()) {
      this.isMsg = true;
      // check if it is from picklist source person party set toolbar save to enable
      if (this.sourceData.source != undefined || this.sourceData.source != null) {
        this.onEnableSave();
        this.organizationsFormComponent.setDeleteToolbar();
        this.organizationsFormComponent.setEnableDisableForm(this.isMsg);
        //this.onSetAssocaitedAreaViewEdit();
      }
      // if flag is false do the first retrieve person from the server
    } else {
      this.organization$ = this.partiesService.getOrganizationByID(this.partyId); // call the service to retrieve data from server
      if (this.partyId == undefined || this.partyId == null) {
        return;
      }
      // subscribe the person then set the result to display in the form
      this.organization$.subscribe(res => {
        this.organizationsFormComponent.setResults(res); // component method to execute displayRetrieveData method
      })

      // set flag to true to indicate data should be retrieved once
      this.partiesCommonService.setPartyFlag({ flag: true });
    }
  }

  ngAfterViewInit() {

  }

  // method to get the toggle name
  getToggleName(): string {
    var name: string;
    this.partiesCommonService.toggle$.subscribe(n => {
      name = n.toggleName;
    })
    return name;
  }

  // method to call the service to save data
  onSave(event): void {
    this.partyId = event.partyID;
    // set a new booking batch id in the service
    this.partiesCommonService.setPartyId({ partyID: this.partyId });
    this.partiesService.savePerson(event, this.getOrganizationStatus().toLowerCase());
  }

  // method to get the retieve flag status
  getFlagStatus(): boolean {
    var flag: boolean;
    this.partiesCommonService.flag$.subscribe(f => {
      flag = f.flag;
    });
    return flag;
  }

  // method to get the saved booking batch id
  getOrganizationId(): string {
    var partyId: string;
    this.partiesCommonService.party$.subscribe(a => {
      partyId = a.partyID;
    })
    return partyId;
  }

  // method to get the status from the service
  getOrganizationStatus(): string {
    var status: string;
    this.partiesCommonService.status$.subscribe(s => {
      status = s.status;
    })
    return status;
  }

  // method to call the toolbar item type
  onToolbarItemClicked(type: ToolbarItemType) {
    var status: string;
    var activity: string;
    switch (type) {
      case ToolbarType.Edit:
        this.onEditToolbars();
        break;
      case ToolbarType.New:
        var status = 'New';
        // set the current status to view
        this.partiesCommonService.setStatus({ status: status });
        // set the flag default: false
        this.partiesCommonService.setPartyFlag({ flag: false });
        // navigate to component
        this.router.navigateByUrl('/common-objects/party/organization/' + status.toLowerCase());
        break;

      case ToolbarType.View:
        this.onViewToolbars();
        break;
      case ToolbarType.Save:
        this.organizationsFormComponent.saveOrganization();
        break;

      case ToolbarType.Delete:
        var id = [];
        id.push(this.partyId);
        this.partiesService.deletePartyByIDs(id, 'organization');
        this.partiesCommonService.setPartyId({ partyID: null });
        this.organizationsFormComponent.organizationFormReset();
        this.partiesService.sendNotification('Record successfully deleted!');
      case ToolbarType.Close:
        const url = window.location.pathname;
        var newUrl = url.slice(0, url.search('view') - 1);
        this.router.navigateByUrl(newUrl);
        break;
    }

  }

  onEditToolbars() {
    // set view toolbar
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.toolbar.load(...ToggleViewFormToolbars());
    this.isMsg = true;
    this.onEnableEdit();
    this.onEnableSave();
    this.organizationsFormComponent.setDeleteToolbar();
    this.partiesCommonService.setEnableEdit({ editEnable: true });
    this.partiesCommonService.setToggle({ toggleName: 'Edit' });
    this.organizationsFormComponent.setEnableDisableForm(this.isMsg);

  }

  onViewToolbars() {
    // set back edit toolbar
    this.status = 'View';
    this.toolbar.load(...ViewFormToolbars());
    // set flag to disable form
    this.isMsg = false;
    this.organizationsFormComponent.setDeleteToolbar();
    this.partiesCommonService.setStatus({ status: this.status });
    this.partiesCommonService.setToggle({ toggleName: 'View' });
    this.partiesCommonService.setEnableEdit({ editEnable: false });
    this.organizationsFormComponent.setEnableDisableForm(this.isMsg);
    this.onDisableSave();
    this.onEnableEdit();
  }


  // method to enable toolbar delete
  onEnableDelete() {
    this.toolbar.enable(ToolbarType.Delete);
  }

  // method to disable toolbar delete
  onDisableDelete() {
    this.toolbar.disable(ToolbarType.Delete);
  }

  // method to enable toolbar save
  onEnableSave() {
    this.toolbar.enable(ToolbarType.Save);
  }

  // method to disable toolbar save
  onDisableSave() {
    this.toolbar.disable(ToolbarType.Save);
  }

  getEnableEdit(): boolean {
    var edit: boolean;
    this.partiesCommonService.enableEdit$.subscribe(e => {
      edit = e.editEnable;
    })
    return edit;
  }

  // method to enable toolbar save
  onEnableEdit() {
    this.toolbar.enable(ToolbarType.Edit);
  }

  // method to empty the form if delete toolbar was clicked
  onEmptyForm() {
    this.organizationsFormComponent.onEmptyForm();
  }

  // method to unsubscribe the observable
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
