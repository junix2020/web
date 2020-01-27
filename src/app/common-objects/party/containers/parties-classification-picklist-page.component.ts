import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Toolbar, PickListToolbars, ToolbarItemType, ToolbarType } from '../../../shell';
import { takeUntil, filter, map } from 'rxjs/operators';
import { PartiesClassificationListDTO } from '../dtos/parties-classification-list.dto';
import { PartiesService } from '../services/parties.service';
import { PartiesClassificationPicklistComponent } from '../components/parties-classification-picklist.component';
import { PartiesCommonService } from '../services/parties-common.service';
import { PersonsClassificationPicklistQuery } from '../states/persons-classification-picklist.query';
import { OrganizationsClassificationPicklistQuery } from '../states/organizations-classification-picklist.query';
import { PersonsClassificationPicklistStore } from '../states/persons-classification-picklist.store';


@Component({
  selector: 'parties-classifcation-picklist-page',
  template: `
 <!-- <pre> {{ state$ | async | json }} </pre> -->
   <nz-collapse>
      <nz-collapse-panel
        nzHeader="Party Classifications"
        [nzDisabled]="false"
        [nzActive]="true"
        [nzShowArrow]="false"
      >
        <ng-container
          *ngIf="classifications$ | async as classifications"
        >
          <section [class.hide]="isLoading$ | async">
            <parties-classification-picklist
              [classifications]="classifications"
          >
            </parties-classification-picklist>
          </section>
        </ng-container>
      </nz-collapse-panel>
    </nz-collapse>
  `
})
export class PartiesClassificationPicklistPageComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // a variable that store observable
  classifications$: Observable<PartiesClassificationListDTO[]>;
  isLoading$: Observable<boolean>;
  state$: Observable<object>;
  sourceParty: string;
  categoryTypeId: string;
  // a variable the desctroy observable
  destroy$ = new Subject();

  // a view child decorator with component
  @ViewChild(PartiesClassificationPicklistComponent, { static: false }) personsOccupationPickListComponent: PartiesClassificationPicklistComponent;
  constructor(
    private partiesService: PartiesService,
    public partiesCommonService: PartiesCommonService,
    private personsClassificationPicklistQuery: PersonsClassificationPicklistQuery,
    private personsClassificationPicklistStore: PersonsClassificationPicklistStore,
    private organizationsClassificationPicklistQuery: OrganizationsClassificationPicklistQuery,
    public router: Router, public activatedRoute: ActivatedRoute,
    private toolbar: Toolbar,
    private ref: ChangeDetectorRef
  ) { }

  // method or event that all initialzations are put here
  ngOnInit() {
      this.state$ = this.activatedRoute.paramMap.pipe(
      map(() => window.history.state)
    );
    //--------------------------------------------------------------------//
    
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
    this.getPartyClassifications();
  }

  // method to call the service to retrieve data(s) from the server
  getPartyClassifications() {
    this.getSourceParty(this.sourceParty);
    this.partiesCommonService.setSource({ sourceName: this.sourceParty });
  }

  getSourceParty(partySource: string) {
    switch (partySource) {
      case 'person':
        // Occupation (Type) category type id
        this.categoryTypeId = 'e225f3b6-62c0-402d-a652-7cf422a5501b';
        // use store data(s) once it was already retrieved from the server
        if (this.personsClassificationPicklistQuery.getCount() > 0) {
          this.classifications$ = this.personsClassificationPicklistQuery.selectAll();
          this.isLoading$ = this.personsClassificationPicklistQuery.selectLoading();
        } else {
          // retrieve data from the server
          this.classifications$ = this.partiesService.getPartyClassifications(this.categoryTypeId, partySource);
          this.isLoading$ = this.personsClassificationPicklistQuery.selectLoading();
        }
        break;
      case 'organization':
        // Business (Type) category type id
        this.categoryTypeId = 'c99e054f-de65-4d68-b14b-a3dc39f61a84';
        // use store data(s) once it was already retrieved from the server 
        if (this.organizationsClassificationPicklistQuery.getCount() > 0) {
          this.classifications$ = this.organizationsClassificationPicklistQuery.selectAll();
          this.isLoading$ = this.personsClassificationPicklistQuery.selectLoading();
        } else {
          // retrieve data from the server
          this.classifications$ = this.partiesService.getPartyClassifications(this.categoryTypeId, partySource);
          this.isLoading$ = this.organizationsClassificationPicklistQuery.selectLoading();
        }
        break;
      default:
        break;
    }
  }

  // method to call service toolbar
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

  // method to select current grid item and return to parent url
  onSelect() {
    this.personsOccupationPickListComponent.onSelect();
  }

  // method to cancel the grid selection and return to parent url
  onCancel() {
    this.personsOccupationPickListComponent.onCancel();
  }

  // method or event to destroy observable
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

  }

  ngAfterViewInit() {
   
  }
}
