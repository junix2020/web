import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  formNewToolbars,
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
    <form [formGroup]="form">
      <nz-collapse>
        <nz-collapse-panel
          nzHeader="Barangay"
          [nzActive]="true"
          [nzShowArrow]="false"
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
  `,
  styles: []
})
export class BarangayNewPage implements OnInit, OnDestroy, OnToolbarItemClick {
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private toolbar: Toolbar,
    private router: Router,
    private route: ActivatedRoute,
    private service: AreaService,
    private formBuilder: FormBuilder
  ) {}

  buildForm() {
    this.form = this.formBuilder.group({
      barangay: [],
      associatedAreas: []
    });
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.form.valid) {
        this.toolbar.enable(ToolbarType.SAVE, ToolbarType.DRAFT);
      } else {
        this.toolbar.disable(ToolbarType.SAVE, ToolbarType.DRAFT);
      }
    });
  }

  ngOnInit() {
    this.buildForm();
    this.toolbar.load(...formNewToolbars());
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToolbarItemClicked(type: ToolbarItemType) {
    switch (type) {
      case ToolbarType.CLOSE:
        this.onClose();
        break;
      case ToolbarType.SAVE:
        this.onSave();
        break;
      case ToolbarType.DRAFT:
        this.onSave('Draft');
        break;
    }
  }

  onSave(status = 'Active') {
    const { barangay } = this.form.value;
    const area = { ...barangay, status } as Area;
    this.service.save(area).subscribe(() => {
      this.form.reset();
      this.router.navigate([`../${area.areaID}`], { relativeTo: this.route });
    });
  }

  onClose() {
    navigateUp(this.router);
  }
}
