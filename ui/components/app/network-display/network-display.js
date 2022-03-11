import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import {
  NETWORK_TYPE_RPC,
  NETWORK_TYPE_TO_ID_MAP,
  NATIVE_CURRENCY_TOKEN_IMAGE_MAP,
} from '../../../../shared/constants/network';

import LoadingIndicator from '../../ui/loading-indicator';
import ColorIndicator from '../../ui/color-indicator';
import {
  COLORS,
  SIZES,
  TYPOGRAPHY,
} from '../../../helpers/constants/design-system';
import Chip from '../../ui/chip/chip';
import IconCaretDown from '../../ui/icon/icon-caret-down';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { isNetworkLoading, getNativeCurrencyImage } from '../../../selectors';

export default function NetworkDisplay({
  colored,
  outline,
  iconClassName,
  indicatorSize,
  disabled,
  labelProps,
  targetNetwork,
  onClick,
}) {
  const networkIsLoading = useSelector(isNetworkLoading);

  const networkImage = useSelector(getNativeCurrencyImage);

  const currentNetwork = useSelector((state) => ({
    nickname: state.metamask.provider.nickname,
    type: state.metamask.provider.type,
    chainId: state.metamask.provider.chainId,
  }));
  const t = useI18nContext();

  const { nickname: networkNickname, type: networkType } =
    targetNetwork ?? currentNetwork;

  const leftIcon = networkImage ? (
    <img src={networkImage} width="12" height="12" />
  ) : (
    <LoadingIndicator
      alt={t('attemptingConnect')}
      title={t('attemptingConnect')}
      isLoading={networkIsLoading}
    >
      <ColorIndicator
        color={networkType === NETWORK_TYPE_RPC ? COLORS.UI4 : networkType}
        size={indicatorSize}
        type={ColorIndicator.TYPES.FILLED}
        iconClassName={
          networkType === NETWORK_TYPE_RPC && indicatorSize !== SIZES.XS
            ? 'fa fa-question'
            : undefined
        }
      />
    </LoadingIndicator>
  );

  return (
    <Chip
      borderColor={outline ? COLORS.UI3 : COLORS.TRANSPARENT}
      onClick={onClick}
      leftIcon={leftIcon}
      rightIcon={
        iconClassName && (
          <IconCaretDown
            size={16}
            className={classnames('network-display__icon', iconClassName)}
          />
        )
      }
      label={
        networkType === NETWORK_TYPE_RPC
          ? networkNickname ?? t('privateNetwork')
          : t(networkType)
      }
      className={classnames('network-display', {
        'network-display--colored': colored,
        'network-display--disabled': disabled,
        [`network-display--${networkType}`]: colored && networkType,
        'network-display--clickable': typeof onClick === 'function',
      })}
      labelProps={{
        variant: TYPOGRAPHY.H7,
        ...labelProps,
      }}
    />
  );
}
NetworkDisplay.propTypes = {
  colored: PropTypes.bool,
  indicatorSize: PropTypes.oneOf(Object.values(SIZES)),
  labelProps: Chip.propTypes.labelProps,
  targetNetwork: PropTypes.shape({
    type: PropTypes.oneOf([
      ...Object.values(NETWORK_TYPE_TO_ID_MAP),
      NETWORK_TYPE_RPC,
    ]),
    nickname: PropTypes.string,
  }),
  outline: PropTypes.bool,
  disabled: PropTypes.bool,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func,
};

NetworkDisplay.defaultProps = {
  colored: true,
  indicatorSize: SIZES.LG,
};
