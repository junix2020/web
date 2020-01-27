import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Toolbar, PickListToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { takeUntil, map } from 'rxjs/operators';
import { PartiesService } from '../services/parties.service';
import { PartiesStatusPickListComponent } from '../components/parties-status-picklist.component';
import { PartiesCommonService } from '../services/parties-common.service';
import { PersonsStatusPicklistQuery } from '../states/persons-status-picklist.query';
import { OrganizationsStatusPicklistQuery } from '../states/organizations-status-picklist.query';


@Component({
  selector: 'parties-status-picklist-page',
  template: `
    <nz-collapse>
      <nz-collapse-panel
        nzHeader="Status"
        [nzDisabled]="false"
        [nzActive]="true"
        [nzShowArrow]="false"
      >
        <ng-container *ngIf="statusTypes$ | async as statusTypes">
            <parties-status-picklist
            [statusTypes]=" statusTypes"
            (itemSelect)="onItemSelect($event)"
            (itemDoubleClick)="onItemDoubleClick($event)"
          >
          </parties-status-picklist>       
        </ng-container>
      </nz-collapse-panel>
    </nz-collapse>
  `
})
export class PartiesStatusPickListPageComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // a variable that store observable
  statusTypes$: Observable<any>;
  state$: Observable<any>;
  isLoading$: Observable<boolean>;
  // a variable to stare data(s) from state$ observable
  sourceParty: string;
  statusTypeId: string;
  // default assocation id and stattus type id
  associationTypeId = 'f748c8f6-3315-4d9d-be1c-77be6c6df90f'; // Subsequent Association Type

  // a variable that destroy observable
  destroy$ = new Subject();

  // a view child decorator with component
  @ViewChild(PartiesStatusPickListComponent, { static: false }) partiesStatusPickListComponent: PartiesStatusPickListComponent;

  constructor(
    private partiesService: PartiesService,
    private partiesCommonService: PartiesCommonService,
    private personsStatusPicklistQuery: PersonsStatusPicklistQuery,
    private organizationsStatusPicklistQuery: OrganizationsStatusPicklistQuery,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toolbar: Toolbar
  ) { }

  // method or event that all initializations are put in here
  ngOnInit() {

    this.state$ = this.activatedRoute.paramMap.pipe(
      map(() => window.history.state)
    );

    this.state$.subscribe(s => {
      var stringParse: any;
      stringParse = JSON.parse(JSON.stringify(s));
      this.sourceParty = stringParse.source;
    })
    // subscribe toolbar item
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.toolbar.load(...PickListToolbars());
    this.getPartyStatusTypes();
  }

  // method to call the service to retrieve data(s) from the server
  getPartyStatusTypes() {
    this.getSourceParty(this.sourceParty);
    this.partiesCommonService.setSource({ sourceName: this.sourceParty });
  }

  getSourceParty(partySource: string) {
    switch (partySource) {
      case 'person':
        // Person (Type) status type id
        this.statusTypeId = '5436c634-3347-4de5-bab2-cf1b8bee279f';
        // use store data(s) once it was already retrieved from the server
        if (this.personsStatusPicklistQuery.getCount() > 0) {
          this.statusTypes$ = this.personsStatusPicklistQuery.selectAll();
          this.isLoading$ = this.personsStatusPicklistQuery.selectLoading();
        } else {
          // retrieve data from the server
          this.statusTypes$ = this.partiesService.getPartiesStatus(this.associationTypeId, this.statusTypeId, partySource);
          this.isLoading$ = this.personsStatusPicklistQuery.selectLoading();
        }
        break;
      case 'organization':
        // Organization (Type) status type id
        this.statusTypeId = 'a9e48dab-1f32-47a7-b513-6b5b385933a3';
        // use store data(s) once it was already retrieved from the server
        if (this.organizationsStatusPicklistQuery.getCount() > 0) {
          this.statusTypes$ = this.organizationsStatusPicklistQuery.selectAll();
          this.isLoading$ = this.organizationsStatusPicklistQuery.selectLoading();
        } else {
          // retrieve data from the server
          this.statusTypes$ = this.partiesService.getPartiesStatus(this.associationTypeId, this.statusTypeId, partySource);
          this.isLoading$ = this.organizationsStatusPicklistQuery.selectLoading();
        }
        break;
      default:
        break;
    }
  }
  
  ngAfterViewInit() {

  }

  // method to call toolbar service
  onToolbarItemClicked(type: ToolbarItemType) {
    switch (type) {

      case ToolbarType.Cancel:
        this.onCancel();
        break;

      case ToolbarType.Select:
        this.onSelect();
        break;
    }

  }

  // method to select the current grid item
  onSelect() {
    this.partiesStatusPickListComponent.onSelect();
  }

  // method to cancel the selected item ang return to parent url
  onCancel() {
    this.partiesStatusPickListComponent.onCancel();
  }

  // method or event to destroy observable
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // net yet implemented
  onItemDoubleClick(item: any) { }
  onItemSelect(item: any) { }

}
