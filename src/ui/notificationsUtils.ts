import { isNull } from 'lodash-es';
import { createContext, useContext } from 'react';
import { useStore as useStoreRaw } from 'zustand';
import { IGetGlobalState, INotification, ISetGlobalState, IUseStore } from '../lib/types.js';

export const Context = createContext(null as any);

export const makeActions = (set: ISetGlobalState, get: IGetGlobalState) => ({
  removeNotification: async id => {
    set(state => {
      const item = state.notifications.find(el => el.id === id);
      if (!item) return;
      item.isHidden = true;
      item.isInverseAnimation = true;
    });

    const { notificationAnimationDuration } = get();
    await new Promise(resolve => setTimeout(resolve, notificationAnimationDuration));
    set(state => ({ notifications: state.notifications.filter(el => el.id !== id) }));
  },

  addNotification: async (newNotification: INotification) => {
    const { autoremoveTimeout, id } = newNotification;
    set(state => ({ notifications: [newNotification].concat(state.notifications) }));

    await new Promise(resolve => setTimeout(resolve, 50));
    set(state => {
      const item = state.notifications.find(el => el.id === newNotification.id);
      if (!item) return;
      item.isHidden = false;
    });

    if (isNull(autoremoveTimeout)) return;
    await new Promise(resolve => setTimeout(resolve, autoremoveTimeout));
    const { notifications, removeNotification } = get();
    const isAlreadyRemoved = !notifications.find(el => el.id === id);
    if (isAlreadyRemoved) return;

    removeNotification(id);
  },
});

export const storeSlice = {
  notificationAnimationDuration: (initialState = 0) => initialState,

  notifications: (initialState: INotification[] = []) => initialState,
};

export const useStore: IUseStore = (selector: any) => {
  const globalStore = useContext(Context);
  return useStoreRaw(globalStore, selector);
};

export const useSetGlobalState = () => useStore(state => state.setGlobalState);
