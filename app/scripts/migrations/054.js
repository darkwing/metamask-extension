import { cloneDeep } from 'lodash';

const version = 54;

/**
 * Remove tokens that don't have an address due to
 * lack of previous addToken validation.  Also removes
 * an unwanted, undefined image property
 */
export default {
  version,
  async migrate(originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData);
    versionedData.meta.version = version;

    const { PreferencesController } = versionedData.data;

    if (PreferencesController.tokens) {
      PreferencesController.tokens = PreferencesController.tokens.filter(
        ({ address }) => address,
      );
    }

    if (PreferencesController.hiddenTokens) {
      PreferencesController.hiddenTokens = PreferencesController.hiddenTokens.filter(
        Boolean,
      );
    }

    if (PreferencesController.accountHiddenTokens) {
      Object.keys(PreferencesController.accountHiddenTokens).forEach(
        (address) => {
          const networks = Object.keys(
            PreferencesController.accountHiddenTokens[address],
          );
          networks.forEach((network) => {
            PreferencesController.accountHiddenTokens[address][
              network
            ] = PreferencesController.accountHiddenTokens[address][
              network
            ].filter(Boolean);
          });
        },
      );
    }

    if (PreferencesController.accountTokens) {
      Object.keys(PreferencesController.accountTokens).forEach((account) => {
        const networks = Object.keys(
          PreferencesController.accountTokens[account],
        );
        networks.forEach((network) => {
          PreferencesController.accountTokens[account][
            network
          ] = PreferencesController.accountTokens[account][network].filter(
            ({ address }) => address,
          );
        });
      });
    }

    if (
      PreferencesController.assetImages &&
      'undefined' in PreferencesController.assetImages
    ) {
      delete PreferencesController.assetImages.undefined;
    }

    return versionedData;
  },
};
