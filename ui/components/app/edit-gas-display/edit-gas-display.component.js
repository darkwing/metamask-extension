import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '../../ui/button';
import Typography from '../../ui/typography/typography';
import {
  COLORS,
  TYPOGRAPHY,
  FONT_WEIGHT,
} from '../../../helpers/constants/design-system';

import InfoTooltip from '../../ui/info-tooltip';
import TransactionTotalBanner from '../transaction-total-banner/transaction-total-banner.component';
import RadioGroup from '../../ui/radio-group/radio-group.component';
import AdvancedGasControls from '../advanced-gas-controls/advanced-gas-controls.component';
import ActionableMessage from '../../ui/actionable-message/actionable-message';

import { I18nContext } from '../../../contexts/i18n';
import { useGasFeeEstimates } from '../../../hooks/useGasFeeEstimates';

import { getShouldShowFiat } from '../../../selectors';
import { useUserPreferencedCurrency } from '../../../hooks/useUserPreferencedCurrency';
import { useCurrencyDisplay } from '../../../hooks/useCurrencyDisplay';
import { SECONDARY } from '../../../helpers/constants/common';
import { decGWEIToHexWEI } from '../../../helpers/utils/conversions.util';

export default function EditGasDisplay({
  alwaysShowForm,
  type,
  showEducationButton,
  onEducationClick,
  dappSuggestedGasFee,
  dappOrigin,
}) {
  const t = useContext(I18nContext);

  const { isGasEstimatesLoading, gasFeeEstimates } = useGasFeeEstimates();

  const [warning] = useState(null);
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [
    dappSuggestedGasFeeAcknowledged,
    setDappSuggestedGasFeeAcknowledged,
  ] = useState(false);

  const requireDappAcknowledgement =
    dappSuggestedGasFee && !dappSuggestedGasFeeAcknowledged;
  const [estimateToUse, setEstimateToUse] = useState('high');

  const [maxPriorityFee, setMaxPriorityFee] = useState(
    gasFeeEstimates?.[estimateToUse]?.suggestedMaxPriorityFeePerGas,
  );
  const [maxFee, setMaxFee] = useState(
    gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas,
  );
  const [gasLimit, setGasLimit] = useState(21000);
  const [gasPrice, setGasPrice] = useState(0);

  const prevIsGasEstimatesLoading = useRef(true);
  useEffect(() => {
    if (
      prevIsGasEstimatesLoading.current === true &&
      isGasEstimatesLoading === false &&
      estimateToUse
    ) {
      setMaxPriorityFee(
        gasFeeEstimates?.[estimateToUse]?.suggestedMaxPriorityFeePerGas,
      );
      setMaxFee(gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas);
    }
  }, [isGasEstimatesLoading, estimateToUse, gasFeeEstimates]);

  const { currency, numberOfDecimals } = useUserPreferencedCurrency(SECONDARY);
  const showFiat = useSelector(getShouldShowFiat);

  const [, maxPriorityParts] = useCurrencyDisplay(
    decGWEIToHexWEI(maxPriorityFee * gasLimit),
    {
      numberOfDecimals,
      currency,
    },
  );
  const maxPriorityFeeFiat = showFiat ? maxPriorityParts.value : '';

  const [, maxFeeParts] = useCurrencyDisplay(
    decGWEIToHexWEI(maxFee * gasLimit),
    {
      numberOfDecimals,
      currency,
    },
  );
  const maxFeeFiat = showFiat ? maxFeeParts.value : '';

  return (
    <div className="edit-gas-display">
      <div className="edit-gas-display__content">
        {warning && (
          <div className="edit-gas-display__warning">
            <ActionableMessage
              className="actionable-message--warning"
              message={warning}
            />
          </div>
        )}
        {requireDappAcknowledgement && (
          <div className="edit-gas-display__dapp-acknowledgement-warning">
            <ActionableMessage
              className="actionable-message--warning"
              message={t('gasDisplayDappWarning', [dappOrigin])}
              useIcon
            />
          </div>
        )}
        {type === 'speed-up' && (
          <div className="edit-gas-display__top-tooltip">
            <Typography
              color={COLORS.BLACK}
              variant={TYPOGRAPHY.H8}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              {t('speedUpTooltipText')}{' '}
              <InfoTooltip
                position="top"
                contentText={t('speedUpExplanation')}
              />
            </Typography>
          </div>
        )}

        <TransactionTotalBanner total={maxFeeFiat} detail="" timing="" />
        {requireDappAcknowledgement && (
          <Button
            className="edit-gas-display__dapp-acknowledgement-button"
            onClick={() => setDappSuggestedGasFeeAcknowledged(true)}
          >
            {t('gasDisplayAcknowledgeDappButtonText')}
          </Button>
        )}
        {!requireDappAcknowledgement && (
          <RadioGroup
            name="gas-recommendation"
            options={[
              { value: 'low', label: t('editGasLow'), recommended: false },
              { value: 'medium', label: t('editGasMedium'), recommended: false },
              { value: 'high', label: t('editGasHigh'), recommended: false },
            ]}
            selectedValue={estimateToUse}
            onChange={(value) => {
              setEstimateToUse(value);
              setMaxPriorityFee(
                gasFeeEstimates?.[value]?.suggestedMaxPriorityFeePerGas,
              );
              setMaxFee(gasFeeEstimates?.[value]?.suggestedMaxFeePerGas);
            }}
          />
        )}
        {!alwaysShowForm && (
          <button
            className="edit-gas-display__advanced-button"
            onClick={() => setShowAdvancedForm(!showAdvancedForm)}
          >
            {t('advancedOptions')}{' '}
            {showAdvancedForm ? (
              <i className="fa fa-caret-up"></i>
            ) : (
              <i className="fa fa-caret-down"></i>
            )}
          </button>
        )}
        {!requireDappAcknowledgement && (alwaysShowForm || showAdvancedForm) && (
          <AdvancedGasControls
            gasFeeEstimates={gasFeeEstimates}
            estimateToUse={estimateToUse}
            isGasEstimatesLoading={isGasEstimatesLoading}
            onManualChange={() => {
              setEstimateToUse(undefined);
            }}
            gasLimit={gasLimit}
            setGasLimit={setGasLimit}
            maxPriorityFee={maxPriorityFee}
            setMaxPriorityFee={setMaxPriorityFee}
            maxFee={maxFee}
            setMaxFee={setMaxFee}
            gasPrice={gasPrice}
            setGasPrice={setGasPrice}
            maxPriorityFeeFiat={maxPriorityFeeFiat}
            maxFeeFiat={maxFeeFiat}
          />
        )}
      </div>
      {!requireDappAcknowledgement && showEducationButton && (
        <div className="edit-gas-display__education">
          <button onClick={onEducationClick}>
            {t('editGasEducationButtonText')}
          </button>
        </div>
      )}
    </div>
  );
}

EditGasDisplay.propTypes = {
  alwaysShowForm: PropTypes.bool,
  type: PropTypes.oneOf(['customize-gas', 'speed-up']),
  showEducationButton: PropTypes.bool,
  onEducationClick: PropTypes.func,
  dappSuggestedGasFee: PropTypes.number,
  dappOrigin: PropTypes.string,
};

EditGasDisplay.defaultProps = {
  alwaysShowForm: false,
  type: 'customize-gas',
  showEducationButton: false,
  onEducationClick: undefined,
  dappSuggestedGasFee: 0,
  dappOrigin: '',
};
