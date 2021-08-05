import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { I18nContext } from '../../../contexts/i18n';
import { useShouldAnimateGasEstimations } from '../../../hooks/useShouldAnimateGasEstimations';
import { getShowLoadingHeartbeatAnimation } from '../../../selectors';

import TransactionDetailItem from '../transaction-detail-item/transaction-detail-item.component';
import LoadingHeartBeat from '../../ui/loading-heartbeat';

export default function TransactionDetail({ rows = [], onEdit }) {
  const t = useContext(I18nContext);
  const shouldAnimate = useShouldAnimateGasEstimations();
  const disableEdit = useSelector(getShowLoadingHeartbeatAnimation);

  return (
    <div className="transaction-detail">
      {process.env.IN_TEST === 'true' ? null : (
        <LoadingHeartBeat active={shouldAnimate} />
      )}
      {onEdit && (
        <div className="transaction-detail-edit">
          <button onClick={onEdit} disabled={disableEdit}>
            {t('edit')}
          </button>
        </div>
      )}
      <div className="transaction-detail-rows">{rows}</div>
    </div>
  );
}

TransactionDetail.propTypes = {
  rows: PropTypes.arrayOf(TransactionDetailItem).isRequired,
  onEdit: PropTypes.func,
};
