import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getEstimatedGasFeeTimeBounds,
  getGasFeeEstimates,
  isEIP1559Network,
} from '../ducks/metamask/metamask';
import { getGasFeeEstimatesAndStartPolling } from '../store/actions';

export function useGasFeeEstimates() {
  const supportsEIP1559 = useSelector(isEIP1559Network);
  const gasFeeEstimates = useSelector(getGasFeeEstimates);
  const estimatedGasFeeTimeBounds = useSelector(getEstimatedGasFeeTimeBounds);
  useEffect(() => {
    let pollToken;
    getGasFeeEstimatesAndStartPolling().then((newPollToken) => {
      pollToken = newPollToken;
    });
    return () => {
      if (pollToken) {
        // TODO: unsubscribe from polling;
      }
    };
  }, []);

  const isGasEstimatesLoading = supportsEIP1559
    ? typeof gasFeeEstimates?.estimatedBaseFee === 'undefined'
    : typeof gasFeeEstimates?.gasPrice === 'undefined';

  return { gasFeeEstimates, estimatedGasFeeTimeBounds, isGasEstimatesLoading };
}
