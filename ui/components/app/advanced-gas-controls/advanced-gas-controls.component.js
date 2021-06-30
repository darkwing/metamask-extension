import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { I18nContext } from '../../../contexts/i18n';
import Typography from '../../ui/typography/typography';
import {
  FONT_WEIGHT,
  TYPOGRAPHY,
  COLORS,
} from '../../../helpers/constants/design-system';
import AdvancedGasControlsRow from './advanced-gas-controls-row.component';

export default function AdvancedGasControls({
  estimateToUse,
  gasFeeEstimates,
  maxPriorityFee,
  maxFee,
  setMaxPriorityFee,
  setMaxFee,
}) {
  const t = useContext(I18nContext);

  const [gasLimit, setGasLimit] = useState(undefined);

  // Used in legacy version
  const [gasPrice, setGasPrice] = useState(0);

  return (
    <div className="advanced-gas-controls">
      <AdvancedGasControlsRow
        titleText={t('gasLimit')}
        onChange={setGasLimit}
        tooltipText=""
        titleDetailText=""
        value={gasLimit}
      />
      {process.env.SHOW_EIP_1559_UI ? (
        <>
          <AdvancedGasControlsRow
            titleText={t('maxPriorityFee')}
            titleUnit="(GWEI)"
            tooltipText=""
            onChange={(value) => {
              setMaxPriorityFee(value);
            }}
            value={maxPriorityFee}
            titleDetailText={
              <>
                <Typography
                  tag="span"
                  color={COLORS.UI4}
                  variant={TYPOGRAPHY.H8}
                  fontWeight={FONT_WEIGHT.BOLD}
                >
                  {t('gasFeeEstimate')}:
                </Typography>{' '}
                <Typography
                  tag="span"
                  color={COLORS.UI4}
                  variant={TYPOGRAPHY.H8}
                >
                  {
                    gasFeeEstimates?.[estimateToUse]
                      ?.suggestedMaxPriorityFeePerGas
                  }
                </Typography>
              </>
            }
          />
          <AdvancedGasControlsRow
            titleText={t('maxFee')}
            titleUnit="(GWEI)"
            tooltipText=""
            onChange={(value) => {
              setMaxFee(value);
            }}
            value={maxFee}
            titleDetailText={
              <>
                <Typography
                  tag="span"
                  color={COLORS.UI4}
                  variant={TYPOGRAPHY.H8}
                  fontWeight={FONT_WEIGHT.BOLD}
                >
                  {t('gasFeeEstimate')}:
                </Typography>{' '}
                <Typography
                  tag="span"
                  color={COLORS.UI4}
                  variant={TYPOGRAPHY.H8}
                >
                  {gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas}
                </Typography>
              </>
            }
          />
        </>
      ) : (
        <>
          <AdvancedGasControlsRow
            titleText={t('gasPrice')}
            titleUnit="(GWEI)"
            onChange={setGasPrice}
            tooltipText={t('editGasPriceTooltip')}
            titleDetailText=""
            value={gasPrice}
          />
        </>
      )}
    </div>
  );
}

AdvancedGasControls.propTypes = {
  estimateToUse: PropTypes.oneOf(['high', 'medium', 'low']),
  gasFeeEstimates: PropTypes.oneOf([
    PropTypes.shape({
      gasPrice: PropTypes.string,
    }),
    PropTypes.shape({
      low: PropTypes.object,
      medium: PropTypes.object,
      high: PropTypes.object,
      estimatedBaseFee: PropTypes.string,
    }),
  ]),
  setMaxPriorityFee: PropTypes.func,
  setMaxFee: PropTypes.func,
  maxPriorityFee: PropTypes.number,
  maxFee: PropTypes.number,
};
