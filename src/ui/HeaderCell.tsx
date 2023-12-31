import cn from 'classnames';
import { isEmpty, isNil } from 'lodash-es';
import { useState } from 'react';
import sortImg from '../assets/img/sort.svg';
import sortDownImg from '../assets/img/sortDown.svg';
import sortUpImg from '../assets/img/sortUp.svg';
import { IHeaderCellProps, ISortOrder } from '../lib/types.js';
import { filterTypes, sortOrders } from '../lib/utils.jsx';
import s from './HeaderCell.module.css';
import { Popup, usePopup } from './Popup.jsx';
import { SearchFilter, SelectFilter } from './TableFilters.jsx';

const getSortOrderIcon = (sortOrder: ISortOrder) => {
  switch (sortOrder) {
    case sortOrders.asc:
      return sortDownImg;
    case sortOrders.desc:
      return sortUpImg;
    default:
      return sortImg;
  }
};

export const HeaderCell = (props: IHeaderCellProps) => {
  const {
    children,
    name,
    onSortChange,
    onFilterChange,
    filters,
    sortable = false,
    sortBy,
    sortOrder: parentSortOrder = null,
    className = '',
  } = props;

  const sortOrder = sortBy === name ? parentSortOrder : null;
  const filterObj = filters[name];
  const filterType = filterObj?.filterType;

  const [isOpen, setIsOpen] = useState(false);

  const { refs, getReferenceProps, popupProps } = usePopup({
    placement: 'bottom-end',
    isOpen,
    setIsOpen,
  });

  const { onClick: onReferenceClick, ...restReferenceProps } = getReferenceProps() as any;
  const stopPropagation = e => e.stopPropagation();
  const onFilterIconClick = e => {
    stopPropagation(e);
    onReferenceClick(e);
  };

  const ownOnSortChange = () => {
    if (!sortable) return;

    let newSortOrder: ISortOrder = null;
    if (isNil(sortOrder)) newSortOrder = sortOrders.asc;
    if (sortOrders.asc === sortOrder) newSortOrder = sortOrders.desc;

    onSortChange(newSortOrder, name);
  };

  return (
    <th
      className={cn(s.headCell, className, { [s.headCell_sortable]: sortable })}
      onClick={ownOnSortChange}
      ref={refs.setPositionReference}
    >
      <div className="flex items-center justify-between p-2">
        <div>{children}</div>
        <div className="flex items-center">
          {filterType && (
            <i
              className={cn('fa fa-filter', s.filterIcon, {
                [s.filterIcon_active]: !isEmpty(filterObj.filter),
              })}
              ref={refs.setReference}
              {...restReferenceProps}
              onClick={onFilterIconClick}
            ></i>
          )}

          {sortable && <img src={getSortOrderIcon(sortOrder)} className={s.sortIcon} />}
        </div>
      </div>

      {filterType && (
        <Popup {...popupProps}>
          <div
            className="p-2 rounded shadow border border-slate-200 bg-white"
            onClick={stopPropagation}
          >
            {filterType === filterTypes.search && (
              <SearchFilter
                name={name}
                filter={filterObj.filter}
                onFilter={onFilterChange}
                setIsOpen={setIsOpen}
              />
            )}
            {filterType === filterTypes.select && (
              <SelectFilter
                name={name}
                filter={filterObj.filter}
                onFilter={onFilterChange}
                setIsOpen={setIsOpen}
                filterOptions={filterObj.filterOptions}
              />
            )}
          </div>
        </Popup>
      )}
    </th>
  );
};
