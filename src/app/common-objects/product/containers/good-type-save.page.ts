import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodTypeService, StatusTypeService } from '@web/graphql';
import {
  CategoryTypeStatus,
  GoodType,
  ProductTypeStatus,
} from '@web/graphql/models';
import { Messages } from '@web/shared/messages';
import {
  formNewToolbars,
  OnToolbarItemClick,
  Toolbar,
  ToolbarItemType,
  ToolbarType,
} from '@web/shell';
import { navigateUp } from '@web/util/navigateUp';
import { isNotNil, NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

@Component({
  selector: 'app-good-type-save-page',
  template: `
    <ng-template #headerTemplate>
      <div class="header">
        Good Type
        <ng-container *ngIf="editMode">
          <span class="spacer"></span>
          <nz-switch
            [ngModel]="editFlag"
            (ngModelChange)="onEditFlagChange($event)"
            [nzCheckedChildren]="checkedTemplate"
            [nzUnCheckedChildren]="unCheckedTemplate"
          >
          </nz-switch>
          <ng-template #checkedTemplate>Edit On</ng-template>
          <ng-template #unCheckedTemplate>Edit Off</ng-template>
        </ng-container>
      </div>
    </ng-template>
    <form nz-form [formGroup]="form">
      <nz-collapse>
        <nz-collapse-panel
          [nzHeader]="headerTemplate"
          [nzActive]="true"
          [nzShowArrow]="false"
          [nzDisabled]="true"
        >
          <app-good-type-form formControlName="goodType"></app-good-type-form>
        </nz-collapse-panel>
      </nz-collapse>
    </form>
  `,
  styles: [],
})
export class GoodTypeSavePage implements OnInit, OnDestroy, OnToolbarItemClick {
  form: FormGroup;
  editMode = false;
  editFlag = false;
  destroy$ = new Subject();

  pStatuses: Partial<ProductTypeStatus>[] = [];
  cStatuses: Partial<CategoryTypeStatus>[] = [];

  constructor(
    private toolbar: Toolbar,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private service: GoodTypeService,
    private statusTypeService: StatusTypeService,
  ) {}

  buildForm() {
    this.form = this.formBuilder.group({
      goodType: [],
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.form.valid) {
        this.toolbar.enable(ToolbarType.SAVE);
        if (!this.editMode) {
          this.toolbar.enable(ToolbarType.DRAFT);
        }
      } else {
        this.toolbar.disable(ToolbarType.SAVE, ToolbarType.DRAFT);
      }
    });
  }

  fetchFormData() {
    const { goodType } = this.route.snapshot.data as {
      goodType: GoodType;
    };

    // Resolver data isn't null, enter edit mode
    if (isNotNil(goodType)) {
      this.editMode = true;

      const status = goodType.categoryType.statuses.find(
        i => i.endDateTime === null,
      );

      // Patch form value
      this.form.controls.goodType.patchValue({
        ...goodType.categoryType.categoryType,
        status: status.statusType.name,
      });

      this.cStatuses = goodType.categoryType.categoryType.statuses;
      this.pStatuses = goodType.categoryType.statuses;

      // Check query params for edit flag
      const editMode = this.route.snapshot.queryParams.edit;
      this.onEditFlagChange(editMode === 'true');
    }
  }

  ngOnInit() {
    this.buildForm();
    this.toolbar.load(...formNewToolbars());
    this.toolbar.clicked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.onToolbarItemClicked(type));
    this.fetchFormData();
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
    }
  }

  async onSave(status: string = 'Active') {
    const { goodType } = this.form.value;
    const { statusTypeID } = await this.statusTypeService
      .findByName(status)
      .toPromise();

    // Create statuses
    const pStatus: Partial<ProductTypeStatus> = {
      productTypeStatusID: uuid(),
      productTypeCategoryTypeID: goodType.categoryTypeID,
      startDateTime: new Date(),
      statusTypeID,
      endDateTime: null,
    };
    const cStatus: Partial<CategoryTypeStatus> = {
      categoryTypeStatusID: uuid(),
      categoryTypeID: goodType.categoryTypeID,
      startDateTime: new Date(),
      statusTypeID,
      endDateTime: null,
    };

    this.pStatuses = [...this.pStatuses, pStatus];
    this.cStatuses = [...this.cStatuses, cStatus];

    const entity: Partial<GoodType> = {
      categoryTypeID: goodType.categoryTypeID,
      categoryType: {
        categoryTypeID: goodType.categoryTypeID,
        categoryType: {
          categoryTypeID: goodType.categoryTypeID,
          code: goodType.code,
          name: goodType.name,
          description: goodType.description,
          statuses: this.cStatuses,
        },
        statuses: this.pStatuses,
      },
    };

    this.service.save(entity).subscribe(() => {
      this.form.reset();
      this.message.success(Messages.RECORD_SAVE_SUCCESS);
      this.router.navigate([`../${entity.categoryTypeID}`], {
        relativeTo: this.route,
      });
    });
  }

  onEditFlagChange(value: boolean) {
    if (value) {
      this.form.enable();
      this.enableSaveToolbar();
    } else {
      this.form.disable();
      this.disableSaveToolbar();
    }
    this.editFlag = value;
  }

  enableSaveToolbar() {
    this.toolbar.enable(ToolbarType.SAVE);
    if (this.form.value.goodType.status === 'Draft' || !this.editMode) {
      this.toolbar.enable(ToolbarType.DRAFT);
    }
  }

  disableSaveToolbar() {
    this.toolbar.disable(ToolbarType.SAVE, ToolbarType.DRAFT);
  }

  onClose() {
    navigateUp(this.router);
  }
}
