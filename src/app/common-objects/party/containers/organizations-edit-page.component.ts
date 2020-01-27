import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrganizationsFormComponent } from '../components/organizations-form.component';
import { Toolbar, EditFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { Router, ActivatedRoute } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { PartiesCommonService } from '../services/parties-common.service';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'organizations-edit-page',
  template:
    `
 <!-- <pre>{{ state$ | async | json }} </pre>  -->
 <div class="organizations-edit-page-form">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="Edit Organization"
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
                     (resetForm)="onEmptyForm()"
                     >
                  </app-organizations-form>
             </nz-collapse-panel>
      </nz-collapse>
    
   </div>
`
})
export class OrganizationsEditPageComponent implements OnInit, AfterViewInit, OnDestroy {
  // all variables needed in this component
  organization$: Observable<any>;
  status: string;
  private sub: any;
  partyId: string;
  state$: Observable<object>;
  source: string;
  isMsg: boolean;

  // an variable to destroy an observable
  destroy$ = new Subject();

  // a view child decorator was used with child components
  @ViewChild(OrganizationsFormComponent, { static: false }) organizationsFormComponent: OrganizationsFormComponent;

  constructor(
    private toolbar: Toolbar,
    private router: Router,
    private partiesService: PartiesService,
    private partiesCommonService: PartiesCommonService,
    public activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    //set flag to enable form
    this.isMsg = true;

    // get area Id from the service and assign it to property
    this.partyId = this.getOrganizationPartyId(); // get area id from the service

    this.state$ = this.activatedRoute.paramMap.pipe(
      map(() => window.history.state)
    );
    this.state$.subscribe(s => {
      var stringParse: any;
      stringParse = JSON.parse(JSON.stringify(s));
      this.source = stringParse.source;
    })

    this.status = this.getOrganizationStatus();
    if (this.status == null) {
      this.status = 'Edit';
      this.partiesCommonService.setStatus({ status: this.status });
    }

    // subscribe toolbar item
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.toolbar.load(...EditFormToolbars());

    // if flag was set to true don't retrieve again the booking batch 
    if (this.getFlagStatus()) {
      // check if it is from picklist source customer party set toolbar save to enable
      if (this.source != undefined || this.source != null) {
        this.isMsg = true;
        this.organizationsFormComponent.setDeleteToolbar();
        this.organizationsFormComponent.setEnableDisableForm(this.isMsg);
      }
      // if flag is false do the first retrieve booking batch from the server
    } else {
      this.organization$ = this.partiesService.getOrganizationByID(this.partyId); // call the service to retrieve data from server
      if (this.partyId == undefined || this.partyId == null) {
        return;
      }
      this.organization$.subscribe(res => {
        this.organizationsFormComponent.setResults(res); // display data to child window
      })

      // set flag to true to indicate data should be retrieved once
      this.partiesCommonService.setPartyFlag({ flag: true });
    }
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
  getOrganizationPartyId(): string {
    var partyId: string;
    this.partiesCommonService.party$.subscribe(p => {
      partyId = p.partyID;
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

  ngAfterViewInit() {
  }

  // method to call the service to save the data into the remote server
  onSave(event): void {
    this.partyId = event.partyID;
    // set id in the service
    this.partiesCommonService.setPartyId({ partyID: this.partyId });
    this.partiesService.saveOrganization(event, this.getOrganizationStatus().toLowerCase());
  }

  // method call the toolbar service
  onToolbarItemClicked(type: ToolbarItemType) {
    var status: string;
    var activity: string;
    switch (type) {
      case ToolbarType.New:
        var status = 'New';
        // set the current status to view
        this.partiesCommonService.setStatus({ status: status });
        // set the flag default: false
        this.partiesCommonService.setPartyFlag({ flag: false });
        // navigate to component
        this.router.navigateByUrl('/common-objects/party/organization/' + status.toLowerCase());
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
        var newUrl = url.slice(0, url.search('edit') - 1);
        this.router.navigateByUrl(newUrl);
        break;
    }

  }

  // method to enable toolbar delete
  onEnableDelete() {
    this.toolbar.enable(ToolbarType.Delete);
  }

  // method disable toolbar delete
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
