import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  formEditToolbars,
  OnToolbarItemClick,
  Toolbar,
  ToolbarItemType,
  ToolbarType
} from '@web/shell';
import { navigateUp } from '@web/util/navigateUp';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Area, AreaService } from '../state';

@Component({
  template: `
    <ng-template #headerTemplate>
      <div class="header">
        Barangay
        <span class="spacer"></span>
        <nz-switch
          [ngModel]="editFlag"
          (ngModelChange)="onEditModeChange($event)"
          [nzCheckedChildren]="checkedTemplate"
          [nzUnCheckedChildren]="unCheckedTemplate"
        >
        </nz-switch>
        <ng-template #checkedTemplate>Edit On</ng-template>
        <ng-template #unCheckedTemplate>Edit Off</ng-template>
      </div>
    </ng-template>
    <form [formGroup]="form">
      <nz-collapse>
        <nz-collapse-panel
          [nzHeader]="headerTemplate"
          [nzShowArrow]="false"
          [nzActive]="true"
          [nzDisabled]="true"
        >
          <app-barangay-form formControlName="barangay"></app-barangay-form>
        </nz-collapse-panel>
      </nz-collapse>
      <nz-collapse>
        <nz-collapse-panel
          nzHeader="Associated Areas"
          [nzActive]="true"
          [nzShowArrow]="false"
        >
          <app-associated-area-list-form
            formControlName="associatedAreas"
          ></app-associated-area-list-form>
        </nz-collapse-panel>
      </nz-collapse>
    </form>
  `
})
export class BarangayEditPage implements OnInit, OnDestroy, OnToolbarItemClick {
  form: FormGroup;
  editFlag = false;
  destroy$ = new Subject();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toolbar: Toolbar,
    private route: ActivatedRoute,
    private service: AreaService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.toolbar.load(...formEditToolbars());
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    // Check query params for edit flag
    const editMode = this.route.snapshot.queryParams.edit;
    this.onEditModeChange(editMode === 'true');
    this.populateForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      barangay: [],
      associatedAreas: []
    });
  }

  enableSaveToolbar() {
    this.toolbar.enable(ToolbarType.SAVE);
    if (this.form.value.barangay.status === 'Draft') {
      this.toolbar.enable(ToolbarType.DRAFT);
    }
  }

  disableSaveToolbar() {
    this.toolbar.disable(ToolbarType.SAVE, ToolbarType.DRAFT);
  }

  populateForm() {
    const area = this.route.snapshot.data.area as Area;
    this.form.controls.barangay.patchValue(area);

    if (area.status !== 'Draft') {
      this.toolbar.disable(ToolbarType.DRAFT);
    }
  }

  onToolbarItemClicked(type: ToolbarItemType) {
    switch (type) {
      case ToolbarType.NEW:
        this.router.navigate(['../new'], { relativeTo: this.route });
        break;
      case ToolbarType.SAVE:
        this.onSave();
        break;
      case ToolbarType.DRAFT:
        this.onSave('Draft');
        break;
      case ToolbarType.CLOSE:
        navigateUp(this.router);
        break;
    }
  }

  onSave(status = 'Active') {
    const { barangay } = this.form.value;
    const area = { ...barangay, status } as Area;
    this.service.save(area).subscribe(() => {
      this.form.controls.barangay.patchValue({ status });
      this.onEditModeChange(false);
    });
  }

  onEditModeChange(value: boolean) {
    if (value) {
      this.form.enable();
      this.enableSaveToolbar();
    } else {
      this.form.disable();
      this.disableSaveToolbar();
    }
    this.editFlag = value;
  }
}
