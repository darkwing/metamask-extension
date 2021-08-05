import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { usePrevious } from '../../../hooks/usePrevious';
import { toggleShowLoadingHeartbeatAnimation } from '../../../store/actions';

export default function LoadingHeartBeat({ active }) {
  const heartNode = useRef(null);
  const previousActive = usePrevious(active);

  const BASE_CLASSNAME = 'loading-heartbeat';
  const LOADING_CLASS = `${BASE_CLASSNAME}--active`;

  const dispatch = useDispatch();

  // dispatch(toggleShowLoadingHeartbeatAnimation(active));

  // When the loading animation completes, remove the className to disappear again
  /*
  useEffect(() => {
    const eventName = 'animationend';
    const node = heartNode?.current;
    const eventHandler = () => {
      console.log("animation ended!")
      node?.classList.remove(LOADING_CLASS);
      useDispatch(toggleShowLoadingHeartbeatAnimation(false));
    };

    console.log("node ", node, eventName)

    node?.addEventListener(eventName, eventHandler);
    return () => {
      node?.removeEventListener(eventName, eventHandler);
    };
  }, [heartNode, LOADING_CLASS, useDispatch]);
  */

  return (
    <div
      className={classNames(BASE_CLASSNAME, {
        [LOADING_CLASS]: active,
      })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      ref={heartNode}
    ></div>
  );
}

LoadingHeartBeat.propTypes = {
  active: PropTypes.bool,
};
