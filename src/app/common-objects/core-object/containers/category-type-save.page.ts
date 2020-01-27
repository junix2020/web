import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryTypeService, StatusTypeService } from '@web/graphql';
import { CategoryType, CategoryTypeStatus } from '@web/graphql/models';
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
  selector: 'app-category-type-save-page',
  template: `
    <ng-template #headerTemplate>
      <div class="header">
        Category Type
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
          <app-category-type-form
            formControlName="categoryType"
          ></app-category-type-form>
        </nz-collapse-panel>
      </nz-collapse>
    </form>
  `,
  styles: [],
})
export class CategoryTypeSavePage
  implements OnInit, OnDestroy, OnToolbarItemClick {
  form: FormGroup;
  editMode = false;
  editFlag = false;
  destroy$ = new Subject();

  statuses: Partial<CategoryTypeStatus>[] = [];

  constructor(
    private toolbar: Toolbar,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private service: CategoryTypeService,
    private statusTypeService: StatusTypeService,
  ) {}

  buildForm() {
    this.form = this.formBuilder.group({
      categoryType: [],
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
    const { categoryType } = this.route.snapshot.data as {
      categoryType: CategoryType;
    };

    // Resolver data isn't null, enter edit mode
    if (isNotNil(categoryType)) {
      this.editMode = true;

      const status = categoryType.statuses.find(i => i.endDateTime === null);

      // Patch form value
      this.form.controls.categoryType.patchValue({
        ...categoryType,
        status: status.statusType.name,
      });

      this.statuses = categoryType.statuses;

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

  async addStatus(categoryTypeID: string, statusName: string) {
    const { statusTypeID } = await this.statusTypeService
      .findByName(statusName)
      .toPromise();

    const status: Partial<CategoryTypeStatus> = {
      categoryTypeStatusID: uuid(),
      categoryTypeID: categoryTypeID,
      startDateTime: new Date(),
      statusTypeID,
      endDateTime: null,
    };

    this.statuses = [...this.statuses, status];
  }

  async onSave(statusName: string = 'Active') {
    const { categoryType } = this.form.value;

    const currentStatus = this.statuses.find(i => i.endDateTime === null);

    // Different status, add history
    if (currentStatus) {
      if (currentStatus.statusType.name !== statusName) {
        await this.addStatus(categoryType.categoryTypeID, statusName);
      }
    } else {
      await this.addStatus(categoryType.categoryTypeID, statusName);
    }

    const entity: Partial<CategoryType> = {
      categoryTypeID: categoryType.categoryTypeID,
      code: categoryType.code,
      name: categoryType.name,
      description: categoryType.description,
      statuses: this.statuses,
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
    if (this.form.value.categoryType.status === 'Draft' || !this.editMode) {
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
