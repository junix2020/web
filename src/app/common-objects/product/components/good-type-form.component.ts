import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { uuid } from '@web/util/uuid';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-good-type-form',
  template: `
    <nz-form-item nz-form [formGroup]="form" [nzNoColon]="true">
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
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="status">
          Status
        </nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <input readonly nz-input formControlName="status" id="status" />
        </nz-form-control>
      </nz-form-item>
    </nz-form-item>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: GoodTypeFormComponent,
      multi: true,
    },
  ],
})
export class GoodTypeFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  destroy$ = new Subject();
  form: FormGroup;
  onTouched: () => void;

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      categoryTypeID: [uuid()],
      code: [],
      name: [],
      description: [],
      status: ['New'],
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
