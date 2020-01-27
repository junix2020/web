import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleTypeService } from '@web/graphql';
import { RoleType } from '@web/graphql/models';
import { Messages } from '@web/shared/messages';
import {
  OnToolbarItemClick,
  Toolbar,
  toolbarItemClose,
  toolbarItemSave,
  ToolbarItemType,
  ToolbarType,
} from '@web/shell';
import { navigateUp } from '@web/util/navigateUp';
import { isNotNil, NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-role-type-save-page',
  template: `
    <ng-template #headerTemplate>
      <div class="header">
        Service Type
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
          <app-role-type-form formControlName="roleType"></app-role-type-form>
        </nz-collapse-panel>
      </nz-collapse>
    </form>
  `,
  styles: [],
})
export class RoleTypeSavePage implements OnInit, OnDestroy, OnToolbarItemClick {
  form: FormGroup;
  editMode = false;
  editFlag = false;
  destroy$ = new Subject();

  constructor(
    private toolbar: Toolbar,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private service: RoleTypeService,
  ) {}

  buildForm() {
    this.form = this.formBuilder.group({
      roleType: [],
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.form.valid) {
        this.toolbar.enable(ToolbarType.SAVE);
      } else {
        this.toolbar.disable(ToolbarType.SAVE);
      }
    });
  }

  fetchFormData() {
    const { roleType } = this.route.snapshot.data as {
      roleType: RoleType;
    };

    // Resolver data isn't null, enter edit mode
    if (isNotNil(roleType)) {
      this.editMode = true;

      // Patch form value
      this.form.controls.roleType.patchValue(roleType);

      // Check query params for edit flag
      const editMode = this.route.snapshot.queryParams.edit;
      this.onEditFlagChange(editMode === 'true');
    }
  }

  ngOnInit() {
    this.buildForm();
    this.toolbar.load(toolbarItemSave(), toolbarItemClose());
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
    }
  }

  async onSave() {
    const { roleType } = this.form.value;

    const entity: Partial<RoleType> = {
      roleTypeID: roleType.roleTypeID,
      code: roleType.code,
      name: roleType.name,
      description: roleType.description,
    };

    this.service.save(entity).subscribe(() => {
      this.form.reset();
      this.message.success(Messages.RECORD_SAVE_SUCCESS);
      this.router.navigate([`../${entity.roleTypeID}`], {
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
  }

  disableSaveToolbar() {
    this.toolbar.disable(ToolbarType.SAVE);
  }

  onClose() {
    navigateUp(this.router);
  }
}
