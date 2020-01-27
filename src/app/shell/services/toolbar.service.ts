import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Provides utility functions to control the toolbar.
 */
@Injectable({
    providedIn: 'root'
})
export class Toolbar {
    private _loaded$ = new Subject<ToolbarItem[]>();
    private _clicked$ = new Subject<ToolbarItemType>();
    private _disabled$ = new Subject<ToolbarItemType>();
    private _enabled$ = new Subject<ToolbarItemType>();
    private _loadedToolbars: ToolbarItem[] = [];

    /**
     * Returns the currently loaded toolbar items.
     */
    get loadedToolbars(): ToolbarItem[] {
        return this._loadedToolbars;
    }

    /**
     * An observable that emits when a toolbar is loaded.
     */
    loaded$ = this._loaded$.asObservable();

    /**
     * An observable that emits the toolbar type when it is clicked.
     */
    clicked$ = this._clicked$.asObservable().pipe(debounceTime(100));

    /**
     * An observable that emits whenever a request to disable a toolbar is processed.
     * This should be observed by the implementing shell.
     */
    disabled$ = this._disabled$.asObservable();

    /**
     * An observable that emits whenever a request to enable a toolbar is processed.
     * This should be observed by the implementing shell.
     */
    enabled$ = this._enabled$.asObservable();

    /**
     * Loads a toolbar. Any shell subscribed to the subject should render the toolbar accordingly.
     * @param items the toolbar items to load
     */
    load(...items: ToolbarItem[]) {
        this._loaded$.next(items);
        this._loadedToolbars = items;
    }

    /**
     * Emit a toolbar click. This should be called by the implementing shell.
     * Unless you want things to go wrong, feel free to forcibly do a toolbar click.
     * @param type the toolbar type emitting the click
     */
    click(type: ToolbarItemType) {
        this._clicked$.next(type);
    }

    /**
     * Disable a toolbar item.
     * @param items the toolbars to disable.
     */
    disable(...items: ToolbarItemType[]) {
        for (const item of items) {
            this._disabled$.next(item);
        }
    }

    /**
     * Enable a toolbar item.
     * @param items the toolbars to enable.
     */
    enable(...items: ToolbarItemType[]) {
        for (const item of items) {
            this._enabled$.next(item);
        }
    }
}

export interface OnToolbarItemClick {
    /**
     * Called when a toolbar item is clicked.
     * @param type the type of the toolbar
     */
    onToolbarItemClicked(type: ToolbarItemType);
}

/**
 * Toolbar item that emits an event when clicked.
 */
export interface ToolbarItem {
    /**
     * Toolbar label.
     */
    label: string;
    /**
     * The user defined toolbar type.
     */
    type: ToolbarItemType;
    /**
     * Toolbar disabled state.
     */
    disabled?: boolean;
}

/**
 * Predefined toolbar types. User may define their own types.
 */
export enum ToolbarType {
  NAV = 'NAV',
  NEW = 'NEW',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  REFRESH = 'REFRESH',
  FILTER = 'FILTER',
  CLOSE = 'CLOSE',
  SAVE = 'SAVE',
  DRAFT = 'DRAFT',
  REACTIVATE = 'REACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  COLUMNS = 'COLUMNS',

  // generic toolbars
  New = 'New',
  Delete = 'Delete',
  Save = 'Save',
  Close = 'Close',
  Edit = 'Edit',
  View = 'View',
  Columns = 'Columns',
  Refresh = 'Refresh',
  Add = 'Add',
  Invoke = 'Invoke',
  Show = 'Show',
  Hide = 'Hide',
  Filter = 'Filter',
  Setup = 'Setup',
  Help = 'Help',
  Login = 'Login',
  Logout = 'Logout',
  SaveDraft = 'Save Draft',
  Duplicate = 'Duplicate',
  Cancel = 'Cancel',
  Select = 'Select',
  Remove = 'Remove',

    cityAreaEditNew = 'CityAreaEditNew',
    cityAreaEditDelete = 'CityAreaEditDELETE',
    cityAreaEditSave = 'CityAreaEditSAVE',
    cityAreaEditClose = 'CityAreaEditClose',

    cityAreaListDelete = 'CityAreaListDELETE',
    cityAreaListEdit = 'CityAreaListEdit',
    cityAreaListView = 'CityAreaListView',
    cityAreaListNew = 'CityAreaListNew',
    cityAreaListColumns = 'CityAreaListColumns',
    cityAreaListRefresh = 'CityAreaListRefresh',
    cityAreaListClose = 'CityAreaListClose',

    cityAreaNewSave = 'CityAreaNewSave',
    cityAreaNewAdd = 'CityAreaNewAdd',
    cityAreaNewClose = 'CityAreaNewClose',
    cityAreaViewEdit = 'CityAreaViewEdit',
    cityAreaViewDelete = 'CityAreaViewDelete',
    cityAreaViewSave = 'CityAreaViewSave',
    cityAreaViewClose = 'CityAreaViewClose',

    bookingBatchListDelete = 'BookingBatchListDELETE',
    bookingBatchListEdit = 'BookingBatchListEdit',
    bookingBatchListView = 'BookingBatchAreaListView',
    bookingBatchListNew = 'BookingBatchListNew',
    bookingBatchListColumns = 'BookingBatchListColumns',
    bookingBatchListRefresh = 'BookingBatchListRefresh',
    bookingBatchListClose = 'BookingBatchListClose',

    bookingBatchNewAdd = 'BookingBatchNewAdd',
    bookingBatchNewSave = 'BookingBatchNewSave',
    bookingBatchNewClose = 'BookingBatchNewClose',

    bookingBatchEditNew = 'BookingBatchEditNew',
    bookingBatchEditSave = 'BookingBatchEditSave',
    bookingBatchEditDelete = 'BookingBatchEditDelete',
    bookingBatchEditClose = 'BookingBatchEditClose',

    bookingBatchViewEdit = 'BookingBatchViewEdit',
    bookingBatchViewDelete = 'BookingBatchViewDelete',
    bookingBatchViewSave = 'BookingBatchViewSave',
    bookingBatchViewClose = 'BookingBatchViewClose',

    pickListCancel = 'PickListCancel',
    pickListSelect = 'PickListSelect',

    // generic toolbar to be used to any module
    EditNew = 'EditNew',
    EditDelete = 'EditDelete',
    EditSave = 'EditSave',
    EditClose = 'EditClose',

    ListDelete = 'ListDelete',
    ListEdit = 'ListEdit',
    ListView = 'ListView',
    ListNew = 'ListNew',
    ListColumns = 'ListColumns',
    ListRefresh = 'ListRefresh',
    ListClose = 'ListClose',

    NewSave = 'NewSave',
    NewAdd = 'NewAdd',
    NewClose = 'NewClose',

    ViewEdit = 'ViewEdit',
    ViewDelete = 'ViewDelete',
    ViewSave = 'ViewSave',
    ViewClose = 'ViewClose',

}

export type ToolbarItemType = ToolbarType | string;

// Toolbar presets
export const toolbarItemView = () =>
    Object.create({ label: 'View', type: ToolbarType.VIEW, disabled: true });
export const toolbarItemNew = () =>
    Object.create({ label: 'New', type: ToolbarType.NEW });
export const toolbarItemEdit = () =>
    Object.create({ label: 'Edit', type: ToolbarType.EDIT, disabled: true });
export const toolbarItemDelete = () =>
    Object.create({ label: 'Delete', type: ToolbarType.DELETE, disabled: true });
export const toolbarItemRefresh = () =>
    Object.create({
        label: 'Refresh',
        type: ToolbarType.REFRESH
    });
export const toolbarItemFilter = () =>
    Object.create({ label: 'Filter', type: ToolbarType.FILTER });
export const toolbarItemClose = () =>
    Object.create({ label: 'Close', type: ToolbarType.CLOSE });
export const toolbarItemDraft = () =>
    Object.create({ label: 'Draft', type: ToolbarType.DRAFT, disabled: true });
export const toolbarItemSave = () =>
    Object.create({ label: 'Save', type: ToolbarType.SAVE, disabled: true });
export const toolbarItemReactivate = () =>
    Object.create({ label: 'Reactivate', type: ToolbarType.REACTIVATE });
export const toolbarItemDeactivate = () =>
    Object.create({ label: 'Deactivate', type: ToolbarType.DEACTIVATE });
export const toolbarItemColumns = () =>
    Object.create({ label: 'Columns', type: ToolbarType.COLUMNS });
export const listToolbars = (): ToolbarItem[] => [
    toolbarItemNew(),
    toolbarItemView(),
    toolbarItemEdit(),
    toolbarItemDelete(),
    toolbarItemRefresh(),
    toolbarItemColumns(),
    toolbarItemClose()
];
export const formNewToolbars = (): ToolbarItem[] => [
    toolbarItemSave(),
    toolbarItemDraft(),
    toolbarItemClose()
];
export const formEditToolbars = (): ToolbarItem[] => [
    toolbarItemNew(),
    toolbarItemSave(),
    toolbarItemDraft(),
    toolbarItemClose()
];

// city area edit
export const cityAreaEditToolbarItemNew = () =>
    Object.create({
        label: 'New',
        type: ToolbarType.cityAreaEditNew,
        disabled: false
    });
export const cityAreaEditToolbarItemDelete = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.cityAreaEditDelete,
        disabled: false
    });
export const cityAreaEditToolbarItemSave = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.cityAreaEditSave,
        disabled: false
    });
export const cityAreaEditToolbarItemClose = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.cityAreaEditClose,
        disabled: false
    });

export const cityAreaEditFormToolbars = (): ToolbarItem[] => [
    cityAreaEditToolbarItemNew(),
    cityAreaEditToolbarItemDelete(),
    cityAreaEditToolbarItemSave(),
    cityAreaEditToolbarItemClose()
];

// city area list
export const cityAreaListToolbarItemDelete = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.cityAreaListDelete,
        disabled: true
    });
export const cityAreaListToolbarItemEdit = () =>
    Object.create({
        label: 'Edit',
        type: ToolbarType.cityAreaListEdit,
        disabled: true
    });
export const cityAreaListToolbarItemView = () =>
    Object.create({
        label: 'View',
        type: ToolbarType.cityAreaListView,
        disabled: true
    });
export const cityAreaListToolbarItemNew = () =>
    Object.create({
        label: 'New',
        type: ToolbarType.cityAreaListNew,
        disabled: false
    });
export const cityAreaListToolbarItemRefresh = () =>
    Object.create({
        label: 'Refresh',
        type: ToolbarType.cityAreaListRefresh,
        disabled: false
    });
export const cityAreaListToolbarItemColumns = () =>
    Object.create({
        label: 'Columns',
        type: ToolbarType.cityAreaListColumns,
        disabled: false
    });
export const cityAreaListToolbarItemClose = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.cityAreaListClose,
        disabled: false
    });

export const cityAreaListFormToolbars = (): ToolbarItem[] => [
    cityAreaListToolbarItemNew(),
    cityAreaListToolbarItemView(),
    cityAreaListToolbarItemEdit(),
    cityAreaListToolbarItemDelete(),
    cityAreaListToolbarItemRefresh(),
    cityAreaListToolbarItemColumns(),
    cityAreaListToolbarItemClose()
];

// city area new
export const cityAreaNewToolbarItemSave = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.cityAreaNewSave,
        disabled: false
    });
export const cityAreaNewToolbarItemAdd = () =>
    Object.create({
        label: 'Add',
        type: ToolbarType.cityAreaNewAdd,
        disabled: false
    });
export const cityAreaNewToolbarItemClose = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.cityAreaNewClose,
        disabled: false
    });

export const cityAreaNewFormToolbars = (): ToolbarItem[] => [
    cityAreaNewToolbarItemSave(),
    cityAreaNewToolbarItemAdd(),
    cityAreaNewToolbarItemClose()
];

// city area view
export const cityAreaViewToolbarItemDelete = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.cityAreaViewDelete,
        disabled: true
    });
export const cityAreaViewToolbarItemClose = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.cityAreaViewClose,
        disabled: false
    });
export const cityAreaViewToolbarItemEdit = () =>
    Object.create({
        label: 'Edit',
        type: ToolbarType.cityAreaViewEdit,
        disabled: false
    });
export const cityAreaViewToolbarItemSave = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.cityAreaViewSave,
        disabled: true
    });

export const cityAreaViewFormToolbars = (): ToolbarItem[] => [
    cityAreaViewToolbarItemEdit(),
    cityAreaViewToolbarItemSave(),
    cityAreaViewToolbarItemDelete(),
    cityAreaViewToolbarItemClose()
];

//booking batch list
export const bookingBatchListToolbarItemNew = () =>
    Object.create({
        label: 'New',
        type: ToolbarType.bookingBatchListNew,
        disabled: false
    });
export const bookingBatchListToolbarItemView = () =>
    Object.create({
        label: 'View',
        type: ToolbarType.bookingBatchListView,
        disabled: true
    });
export const bookingBatchListToolbarItemEdit = () =>
    Object.create({
        label: 'Edit',
        type: ToolbarType.bookingBatchListEdit,
        disabled: true
    });
export const bookingBatchListToolbarItemDelete = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.bookingBatchListDelete,
        disabled: true
    });
export const bookingBatchListToolbarItemColumns = () =>
    Object.create({
        label: 'Columns',
        type: ToolbarType.bookingBatchListColumns,
        disabled: false
    });
export const bookingBatchListToolbarItemRefresh = () =>
    Object.create({
        label: 'Refresh',
        type: ToolbarType.bookingBatchListRefresh,
        disabled: false
    });
export const bookingBatchListToolbarItemClose = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.bookingBatchListClose,
        disabled: false
    });

export const bookingBatchListFormToolbars = (): ToolbarItem[] => [
    bookingBatchListToolbarItemNew(),
    bookingBatchListToolbarItemView(),
    bookingBatchListToolbarItemEdit(),
    bookingBatchListToolbarItemDelete(),
    bookingBatchListToolbarItemColumns(),
    bookingBatchListToolbarItemRefresh(),
    bookingBatchListToolbarItemClose()
]

export const bookingBatchNewToolbarItemAdd = () =>
    Object.create({
        label: 'Add',
        type: ToolbarType.bookingBatchNewAdd,
        disabled: false
    });
export const bookingBatchNewToolbarItemSave = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.bookingBatchNewSave,
        disabled: false
    })
export const bookingBatchNewToolbarItemClose = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.bookingBatchNewClose,
        disabled: false
    })

export const bookingBatchNewFormToolbars = (): ToolbarItem[] => [
    bookingBatchNewToolbarItemAdd(),
    bookingBatchNewToolbarItemSave(),
    bookingBatchNewToolbarItemClose()
]

export const bookingBatchEditToolbarItemSave = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.bookingBatchEditSave,
        disabled: false
    })

export const bookingBatchEditToolbarItemDelete = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.bookingBatchEditDelete,
        disabled: false
    })

export const bookingBatchEditToolbarItemClose = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.bookingBatchEditClose,
        disabled: false
    })

export const bookingBatchEditToolbarItemNew = () =>
    Object.create({
        label: 'New',
        type: ToolbarType.bookingBatchEditNew,
        disabled: false
    })

export const bookingBatchEditFormToolbars = (): ToolbarItem[] => [
    bookingBatchEditToolbarItemNew(),
    bookingBatchEditToolbarItemSave(),
    bookingBatchEditToolbarItemDelete(),
    bookingBatchEditToolbarItemClose()
]

export const bookingBatchViewToolbarItemEdit = () =>
    Object.create({
        label: 'Edit',
        type: ToolbarType.bookingBatchViewEdit,
        disabled: false
    })

export const bookingBatchViewToolbarItemDelete = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.bookingBatchViewDelete,
        disabled: false
    })

export const bookingBatchViewToolbarItemSave = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.bookingBatchViewSave,
        disabled: false
    })

export const bookingBatchViewToolbarItemClose = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.bookingBatchViewClose,
        disabled: false
    })

export const bookingBatchViewFormToolbars = (): ToolbarItem[] => [
    bookingBatchViewToolbarItemEdit(),
    bookingBatchViewToolbarItemSave(),
    bookingBatchViewToolbarItemDelete(),
    bookingBatchViewToolbarItemClose()
]

// picklist toolbars 
export const pickListToolbarItemCancel = () =>
    Object.create({
        label: 'Cancel',
        type: ToolbarType.pickListCancel,
        disabled: false
    })

export const pickListToolbarItemSelect = () =>
    Object.create({
        label: 'Select',
        type: ToolbarType.pickListSelect,
        disabled: false
    })

// picklist toolbars
export const pickListFormToolbars = (): ToolbarItem[] => [
    pickListToolbarItemCancel(),
    pickListToolbarItemSelect()
]

// edit form toolbars
export const editNewToolbarItem = () =>
    Object.create({
        label: 'New',
        type: ToolbarType.EditNew,
        disabled: false
    })

export const editSaveToolbarItem = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.EditSave,
        disabled: false
    })

export const editCloseToolbarItem = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.EditClose,
        disabled: false
    })

export const editDeleteToolbarItem = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.EditDelete,
        disabled: false
    })

// edit forms toolbars
export const editFormToolbars = (): ToolbarItem[] => [
    editNewToolbarItem(),
    editSaveToolbarItem(),
    editDeleteToolbarItem(),
    editCloseToolbarItem()
]

// list form toolbars
export const listDeleteToolbarItem = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.ListDelete,
        disabled: true
    })

export const listEditToolbarItem = () =>
    Object.create({
        label: 'Edit',
        type: ToolbarType.ListEdit,
        disabled: true
    })

export const listViewToolbarItem = () =>
    Object.create({
        label: 'View',
        type: ToolbarType.ListView,
        disabled: false
    })

export const listNewToolbarItem = () =>
    Object.create({
        label: 'New',
        type: ToolbarType.ListNew,
        disabled: false
    })

export const listColumnsToolbarItem = () =>
    Object.create({
        label: 'Columns',
        type: ToolbarType.ListColumns,
        disabled: false
    })

export const listRefreshToolbarItem = () =>
    Object.create({
        label: 'Refresh',
        type: ToolbarType.ListRefresh,
        disabled: false
    })


export const listCloseToolbarItem = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.ListClose,
        disabled: false
    })

// list form toolbars
export const listFormToolbars = (): ToolbarItem[] => [
    listNewToolbarItem(),
    listViewToolbarItem(),
    listEditToolbarItem(),
    listDeleteToolbarItem(),
    listColumnsToolbarItem(),
    listRefreshToolbarItem(),
    listCloseToolbarItem()

]

// new form toolbars
export const newSaveToolbarItem = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.NewSave,
        disabled: false
    })

export const newAddToolbarItem = () =>
    Object.create({
        label: 'Add',
        type: ToolbarType.NewAdd,
        disabled: false
    })

export const newCloseToolbarItem = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.NewClose,
        disabled: false
    })

// new form toolbars
export const newFormToolbars = (): ToolbarItem[] => [
    newAddToolbarItem(),
    newSaveToolbarItem(),
    newCloseToolbarItem()
]

// view form toolbars
export const viewEditToolbarItem = () =>
    Object.create({
        label: 'Edit',
        type: ToolbarType.ViewEdit,
        disabled: false
    })

export const viewDeleteToolbarItem = () =>
    Object.create({
        label: 'Delete',
        type: ToolbarType.ViewDelete,
        disabled: false
    })

export const viewSaveToolbarItem = () =>
    Object.create({
        label: 'Save',
        type: ToolbarType.ViewSave,
        disabled: false
    })

export const viewCloseToolbarItem = () =>
    Object.create({
        label: 'Close',
        type: ToolbarType.ViewClose,
        disabled: false
    })

// view form toolbars
export const viewFormToolbars = (): ToolbarItem[] => [
    viewEditToolbarItem(),
    viewDeleteToolbarItem(),
    viewSaveToolbarItem(),
    viewCloseToolbarItem()
]

// generic toolbars
export const NewToolbarItem = () =>
    Object.create({
      label: 'New',
      type: ToolbarType.New,
      disabled: false
    })
export const DeleteToolbarItem = () =>
  Object.create({
    label: 'Delete',
    type: ToolbarType.Delete,
    disabled: true
  })
export const SaveToolbarItem = () =>
  Object.create({
    label: 'Save',
    type: ToolbarType.Save,
    disabled: false
  })
export const CloseToolbarItem = () =>
  Object.create({
    label: 'Close',
    type: ToolbarType.Close,
    disabled: false
  })
export const EditToolbarItem = () =>
  Object.create({
    label: 'Edit',
    type: ToolbarType.Edit,
    disabled: true
  })
export const ViewToolbarItem = () =>
  Object.create({
    label: 'View',
    type: ToolbarType.View,
    disabled: false
  })
export const ColumnsToolbarItem = () =>
  Object.create({
    label: 'Columns',
    type: ToolbarType.Columns,
    disabled: false
  })
export const RefreshToolbarItem = () =>
  Object.create({
    label: 'Refresh',
    type: ToolbarType.Refresh,
    disabled: false
  })
export const AddToolbarItem = () =>
  Object.create({
    label: 'Add',
    type: ToolbarType.Add,
    disabled: false
  })
export const InvokeToolbarItem = () =>
  Object.create({
    label: 'Invoke',
    type: ToolbarType.Invoke,
    disabled: false
  })
export const ShowToolbarItem = () =>
  Object.create({
    label: 'Show',
    type: ToolbarType.Show,
    disabled: false
  })
export const HideToolbarItem = () =>
  Object.create({
    label: 'Hide',
    type: ToolbarType.Hide,
    disabled: false
  })
export const FilterToolbarItem = () =>
  Object.create({
    label: 'Filter',
    type: ToolbarType.Filter,
    disabled: false
  })
export const SetupToolbarItem = () =>
  Object.create({
    label: 'Setup',
    type: ToolbarType.Setup,
    disabled: false
  })
export const HelpToolbarItem = () =>
  Object.create({
    label: 'Help',
    type: ToolbarType.Help,
    disabled: false
  })
export const LoginToolbarItem = () =>
  Object.create({
    label: 'Login',
    type: ToolbarType.Login,
    disabled: false
  })
export const LogoutToolbarItem = () =>
  Object.create({
    label: 'Logout',
    type: ToolbarType.Logout,
    disabled: false
  })
export const SaveDraftToolbarItem = () =>
  Object.create({
    label: 'Save Draft',
    type: ToolbarType.SaveDraft,
    disabled: false
  })
export const DuplicateToolbarItem = () =>
  Object.create({
    label: 'Duplicate',
    type: ToolbarType.Duplicate,
    disabled: false
  })
export const CancelToolbarItem = () =>
  Object.create({
    label: 'Cancel',
    type: ToolbarType.Cancel,
    disabled: false
  })
export const SelectToolbarItem = () =>
  Object.create({
    label: 'Select',
    type: ToolbarType.Select,
    disabled: false
  })
export const RemoveToolbarItem = () =>
  Object.create({
    label: 'Remove',
    type: ToolbarType.Remove,
    disabled: false
  })

// picklist toolbars
export const PickListToolbars = (): ToolbarItem[] => [
  CancelToolbarItem(),
  SelectToolbarItem()
];

export const ListToolbars = (): ToolbarItem[] => [
  NewToolbarItem(),
  ViewToolbarItem(),
  EditToolbarItem(),
  DeleteToolbarItem(),
  RefreshToolbarItem(),
  ColumnsToolbarItem(),
  CloseToolbarItem(),
  SetupToolbarItem(),
  
];

export const ViewFormToolbars = (): ToolbarItem[] => [
  NewToolbarItem(),
  EditToolbarItem(),
  SaveDraftToolbarItem(),
  SaveToolbarItem(),
  DuplicateToolbarItem(),
  DeleteToolbarItem(),
  CloseToolbarItem(),
  HelpToolbarItem(),
];

export const ToggleViewFormToolbars = (): ToolbarItem[] => [
  NewToolbarItem(),
  ViewToolbarItem(),
  SaveDraftToolbarItem(),
  SaveToolbarItem(),
  DuplicateToolbarItem(),
  DeleteToolbarItem(),
  CloseToolbarItem(),
  HelpToolbarItem(),
];

export const NewFormToolbars = (): ToolbarItem[] => [
  NewToolbarItem(),
  SaveDraftToolbarItem(),
  SaveToolbarItem(),
  DuplicateToolbarItem(),
  DeleteToolbarItem(),
  CloseToolbarItem(),
  SetupToolbarItem(),
  HelpToolbarItem()
];

export const EditFormToolbars = (): ToolbarItem[] => [
  NewToolbarItem(),
  SaveDraftToolbarItem(),
  SaveToolbarItem(),
  DuplicateToolbarItem(),
  DeleteToolbarItem(),
  CloseToolbarItem(),
  SetupToolbarItem(),
  HelpToolbarItem()

];



