import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { uuid } from '@web/util/uuid';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Area, AreaQuery, AreaService } from '../state';

@Component({
  selector: 'app-province-form',
  template: `
    <nz-form-item nz-form [nzNoColon]="true" [formGroup]="form">
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="areaType">
          Area Type
        </nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <input nz-input readonly formControlName="areaType" id="areaType" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="code">Code</nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <input nz-input formControlName="code" id="code" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="name">
          Display Name
        </nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <input nz-input formControlName="name" id="name" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="description">
          Description
        </nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <textarea
            nz-input
            rows="3"
            formControlName="description"
            id="description"
          ></textarea>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="country">
          Country
        </nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <app-pick-list
            header="Country"
            placeholder="Select a country"
            formControlName="country"
            [items]="countries$ | async"
          ></app-pick-list>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control [nzSpan]="24" [nzOffset]="6">
          <label nz-checkbox formControlName="permanentRecordIndicator">
            <span>Permanent Record Indicator</span>
          </label>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="areaClassifications">
          Classifications
        </nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <app-area-classification-list-box
            formControlName="areaClassifications"
            areaType="Province"
            id="areaClassifications"
          ></app-area-classification-list-box>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="status">
          Status
        </nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <input readonly nz-input formControlName="status" id="status" />
        </nz-form-control>
      </nz-form-item>
    </nz-form-item>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProvinceFormComponent,
      multi: true,
    },
  ],
})
export class ProvinceFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  destroy$ = new Subject();
  countries$: Observable<Area[]>;
  form: FormGroup;
  onTouched: () => void;

  constructor(
    private formBuilder: FormBuilder,
    private service: AreaService,
    private query: AreaQuery,
  ) {}

  writeValue(value: any): void {
    value && this.form.patchValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(disabled: boolean): void {
    disabled ? this.form.disable() : this.form.enable();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      areaID: [uuid()],
      areaType: ['Province'],
      code: [],
      name: [],
      description: [],
      country: [],
      permanentRecordIndicator: [false],
      status: ['New'],
      areaClassifications: [[]],
    });
    this.countries$ = this.query.selectAll({
      filterBy: a => a.areaType === 'Country',
    });
    this.service.findAll('Country').subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
