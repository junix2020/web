import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Toolbar, NewFormToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { Router, ActivatedRoute } from '@angular/router';
import { PartiesService } from '../services/parties.service';
import { PartiesCommonService } from '../services/parties-common.service';
import { takeUntil, map } from 'rxjs/operators';
import { OrganizationsFormComponent } from '../components/organizations-form.component';

@Component({
  selector: 'app-organizations-new-page',
  template: `
 <!-- <pre> {{ state$ | async | json }} </pre>  -->
<div class="organizations-form">
      <nz-collapse>
            <nz-collapse-panel 
                  nzHeader="New Organization"
                  [nzDisabled]="false"
                  [nzActive]="true"
                  [nzShowArrow]="false">
                  <app-organizations-form
                     [status]="status"
                     [isMsg]="isMsg"
                     [isDisabled]="isDisabled"
                     (onSave)="onSave($event)"
                     (resetForm)="onEmptyForm()"
                     >
                  </app-organizations-form>
            </nz-collapse-panel>
      </nz-collapse>
      
      
 </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class OrganizationsNewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  // view child decorator with child components
  @ViewChild(OrganizationsFormComponent, { static: false }) organizationsFormComponent: OrganizationsFormComponent;

  // a variable to destroy the observable
  destroy$ = new Subject();

  // all needed variables
  status: string;
  isDisabled: boolean = false;
  isMsg: boolean;
  partyId: string;
  flag: boolean;
  state$: Observable<object>;
  source: any;
  picklistName: string;
  itemsParse: any[];

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
    //set flag to enable form
    this.isMsg = true;

      this.state$ = this.activatedRoute.paramMap.pipe(
          map(() => window.history.state)
      );
    this.state$.subscribe(s => {
      var stringParse: any;
      stringParse = JSON.parse(JSON.stringify(s));
      try {
        this.source = stringParse.source;
        } catch (e) { }
    });

    // get the current status from the service ex. New, Edit and View
    this.status = this.getOrganizationStatus();
    if (this.status == null) {
      this.status = 'New';
      this.partiesCommonService.setStatus({ status: this.status });
    }

    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.toolbar.load(...NewFormToolbars());

    // get the current flag from serive
    this.flag = this.getFlagStatus();

    // set flag to clear the form and execute the city area form reset method
    if (!this.flag) {
      // call the reset method to initialize the form
      this.organizationsFormComponent.organizationFormReset();
      // set the current flag to true indicates that form reset should be executed at one time only
      this.partiesCommonService.setPartyFlag({ flag: true });
    } else if (this.flag) {
      // check if it is from picklist source party set toolbar save to enable
      if (this.source != undefined || this.source != null) {
            this.isMsg = true;
        }
    }

  }

  ngAfterViewInit() {
  }

  // method to call the toolbar type
  onToolbarItemClicked(type: ToolbarItemType) {

    switch (type) {

      case ToolbarType.Save:
        this.organizationsFormComponent.saveOrganization();
        break;

      case ToolbarType.New:
        this.organizationsFormComponent.organizationFormReset();
        break;

      case ToolbarType.Close:
        this.partiesCommonService.setPartyId({ partyID: this.partyId });
        const url = window.location.pathname;
        var newUrl = url.slice(0, url.search('new') - 1);

        this.router.navigate([newUrl]);
        break;
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

  // method to call the service to save the data
  onSave(event): void {
    this.partyId = event.partyID;
    // set a new person party id in the service
    this.partiesCommonService.setPartyId({ partyID: this.partyId });
    this.partiesService.saveOrganization(event, this.getOrganizationStatus().toLowerCase());
  }
  
  // method to empty child component form
  onEmptyForm() {
    this.organizationsFormComponent.onEmptyForm();
  }

  // method to destroy the observable
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

  }

}
