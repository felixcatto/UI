import { Side } from '@floating-ui/react';
import { Draft } from 'immer';
import { makeActions, storeSlice } from '../ui/notificationsUtils.js';
import { filterTypes, sortOrders } from './utils.jsx';

export type Anyify<T> = { [K in keyof T]: any };

export type IMakeEnum = <T extends ReadonlyArray<string>>(
  ...args: T
) => { [key in T[number]]: key };

type IFn<T> = (freshState: T) => Partial<T>;
type ISetState<T> = (fnOrObject: Partial<T> | IFn<T>) => void;
export type IUseMergeState = <T>(initialState: T) => [state: T, setState: ISetState<T>];

export type ISelectOption = {
  value: any;
  label: string;
  [key: string]: any;
};
export type ISelectedOption = ISelectOption | null;

export type ISortOrder = keyof typeof sortOrders | null;
export type IFilterTypes = typeof filterTypes;

export type ISelectFilter = ISelectOption[];
export type ISearchFilter = string;

export type IMixedFilter = ISearchFilter | ISelectFilter;

export type ISelectFilterObj = {
  filterBy: string;
  filterType: IFilterTypes['select'];
  filter: ISelectFilter;
  filterOptions: ISelectFilter;
  customFilterFn?: (rowValue, filter: IMixedFilter) => boolean;
};

export type ISearchFilterObj = {
  filterBy: string;
  filterType: IFilterTypes['search'];
  filter: ISearchFilter;
  customFilterFn?: (rowValue, filter: IMixedFilter) => boolean;
};

export type IFilter = ISelectFilterObj | ISearchFilterObj;
export type IFiltersMap = Record<string, Anyify<IFilter> & { filterOptions?: any }>;

export type IHeaderCellProps = {
  children: any;
  name: string;
  onSortChange: (sortOrder: ISortOrder, sortBy: string) => void;
  onFilterChange: (filter: IMixedFilter, filterBy: string) => void;
  filters: IFiltersMap;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: ISortOrder;
  className?: string;
};

export type ISelectFilterProps = {
  name: string;
  setIsOpen: any;
  filterOptions: ISelectFilter;
  filter: ISelectFilter;
  onFilter: (filter: ISelectFilter, filterBy: string) => void;
};

export type ISearchFilterProps = {
  name: string;
  setIsOpen: any;
  filter: ISearchFilter;
  onFilter: (filter: ISearchFilter, filterBy: string) => void;
};

type INotificationText = { text: string; component?: undefined };
type INotificationComponent = {
  text?: undefined;
  component: () => JSX.Element;
};
export type INotification = {
  id: string;
  title: string;
  isHidden: boolean;
  isInverseAnimation: boolean;
  autoremoveTimeout: number | null;
} & (INotificationText | INotificationComponent);

type IMakeNotificationOpts = {
  title: INotification['title'];
  autoremoveTimeout?: INotification['autoremoveTimeout'];
} & (INotificationText | INotificationComponent);
export type IMakeNotification = (opts: IMakeNotificationOpts) => INotification;

type IRawStoreSlice = typeof storeSlice;
export type IStoreSlice = {
  [key in keyof IRawStoreSlice]: ReturnType<IRawStoreSlice[key]>;
};

export type IActions = ReturnType<typeof makeActions>;

type ISetStateUpdateFn = (state: Draft<IStoreSlice>) => Partial<IStoreSlice> | void;
export type ISetGlobalState = (arg: Partial<IStoreSlice> | ISetStateUpdateFn) => void;
export type IGetGlobalState = () => IStoreSlice & IActions;

export type IStore = IStoreSlice & IActions & { setGlobalState: ISetGlobalState };

export type IUseStore = <T>(selector: (state: IStore) => T) => T;

export type ITooltipContext = {
  x;
  y;
  strategy;
  refs;
  context;
  getReferenceProps;
  getFloatingProps;
  placement: Side;
  className;
  theme;
};
