import cn from 'classnames';
import { uniqueId } from 'lodash-es';
import React, { memo } from 'react';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { IMakeNotification } from '../lib/types.js';
import { getCssValue } from '../lib/utils.jsx';
import s from './Notifications.module.css';
import {
  Context,
  makeActions,
  storeSlice,
  useSetGlobalState,
  useStore,
} from './notificationsUtils.js';

export { useStore as useNotifications };

export const NotificationsProvider = props => {
  const { children } = props;

  const initializedStoreSlice = Object.keys(storeSlice).reduce((acc, key) => {
    const makeFn = storeSlice[key];
    return { ...acc, [key]: makeFn() };
  }, {});

  const globalStoreState = (set, get) => ({
    setGlobalState: set,
    ...makeActions(set, get),
    ...initializedStoreSlice,
  });

  const globalStore: any = createStore(immer(globalStoreState));

  return <Context.Provider value={globalStore}>{children}</Context.Provider>;
};

export const Notifications = memo(() => {
  const setGlobalState = useSetGlobalState();
  const notifications = useStore(state => state.notifications);
  const removeNotification = useStore(state => state.removeNotification);

  React.useEffect(() => {
    const rootStyles = getComputedStyle(document.querySelector(`.${s.root}`)!);
    const animationDuration =
      getCssValue(rootStyles.getPropertyValue('--animationDuration')) * 1000;
    setGlobalState({ notificationAnimationDuration: animationDuration });
  }, []);

  return (
    <div className={s.root}>
      {notifications.map(el => (
        <div
          key={el.id}
          className={cn(s.item, {
            [s.item_hidden]: el.isHidden,
            [s.item_inverseAnimation]: el.isInverseAnimation,
          })}
        >
          <div>
            <div className="font-bold uikit__text-primary">{el.title}</div>
            {el.text && <div className="text-justify">{el.text}</div>}
            {el.component && React.createElement(el.component)}
          </div>
          <i
            className="far fa-circle-xmark text-lg ml-2 uikit__fa uikit__fa_big uikit__fa_link"
            onClick={() => removeNotification(el.id)}
          ></i>
        </div>
      ))}
    </div>
  );
});

export const makeNotification: IMakeNotification = opts => {
  const { title, text, component, autoremoveTimeout = 10_000 } = opts;

  const notification: any = {
    id: uniqueId(),
    title,
    isHidden: true,
    isInverseAnimation: false,
    autoremoveTimeout,
  };

  if (text) {
    return { ...notification, text };
  } else {
    return { ...notification, component };
  }
};
