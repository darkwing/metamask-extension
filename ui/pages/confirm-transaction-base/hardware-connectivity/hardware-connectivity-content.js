import React from 'react';
import PropTypes from 'prop-types';

import { useI18nContext } from '../../../hooks/useI18nContext';

import Button from '../../../components/ui/button';

import Typography from '../../../components/ui/typography/typography';
import {
  TYPOGRAPHY,
  FONT_WEIGHT,
} from '../../../helpers/constants/design-system';

export default function HardwareConnectivityContent({ deviceName }) {
  const t = useI18nContext();

  const onConnectClick = () => {
    // Connect hardware flow
  };

  switch (deviceName) {
    case 'Ledger':
      return (
        <div>
          <Typography variant={TYPOGRAPHY.H1} fontWeight={FONT_WEIGHT.BOLD}>
            {t('hardwareWalletConnectivityHelperHeading')}
          </Typography>
          {/* Image */}
          <ol>
            <li>Plug in your Ledger</li>
            <li>Enter your passcode</li>
            <li>Open the Ethereum app</li>
          </ol>
          <Button onClick={onConnectClick}>{t('connect')}</Button>
          <Button type="link">{t('advancedOptions')}</Button>
        </div>
      );
    default:
      return null;
  }
}

HardwareConnectivityContent.propTypes = {
  deviceName: PropTypes.string.isRequired,
};
