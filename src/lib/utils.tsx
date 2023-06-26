import { isFunction } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import stringMath from 'string-math';
import { IMakeEnum, IUseMergeState } from './types.js';

export const makeEnum: IMakeEnum = (...args) =>
  args.reduce((acc, key) => ({ ...acc, [key]: key }), {} as any);

export const sortOrders = makeEnum('asc', 'desc');
export const filterTypes = makeEnum('search', 'select');

export const useMergeState: IUseMergeState = initialState => {
  const [state, setState] = useState(initialState);

  const setImmerState = useCallback(fnOrObject => {
    if (isFunction(fnOrObject)) {
      const fn = fnOrObject;
      setState(curState => {
        const newState = fn(curState);
        return { ...curState, ...newState };
      });
    } else {
      const newState = fnOrObject;
      setState(curState => ({ ...curState, ...newState }));
    }
  }, []);

  return [state, setImmerState];
};

export const makeCaseInsensitiveRegex = str =>
  new RegExp(str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');

export const getCssValue = (cssValue: string) =>
  stringMath(cssValue.trim().replaceAll('calc', '').replaceAll('s', ''));

export const Portal = ({ children, selector }) => {
  const ref: any = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return mounted ? createPortal(children, ref.current) : null;
};
