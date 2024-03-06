import React, { lazy, useEffect } from 'react';
import { Box, Grid } from '@material-ui/core';
import HelpIcon from '~/assets/images/HelpIcon1.svg?react';
import SupplyLiquidity from './SupplyLiquidity';
import { useTranslation } from 'react-i18next';
import '~/pages/styles/pools.scss';
import VersionToggle from '~/components/Toggle/VersionToggle';
import { useIsV2 } from '~/state/application/hooks';
import { SupplyLiquidityV3 } from './v3/SupplyLiquidityV3';
import { getConfig } from '../../config/index';
import { useActiveWeb3React } from '~/hooks';
import { ChainId } from '@uniswap/sdk';
import { HypeLabAds } from '~/components';
import { useParams } from 'react-router-dom';
import { SingleTokenSupplyLiquidity } from './SingleToken/SupplyLiquidity';

const YourLiquidityPools = lazy(() => import('./YourLiquidityPools'));
const MyLiquidityPoolsV3 = lazy(() => import('./v3/MyLiquidityPoolsV3'));

const PoolsPage: React.FC = () => {
  const { t } = useTranslation();
  const { isV2, updateIsV2 } = useIsV2();
  const { chainId } = useActiveWeb3React();
  const chainIdToUse = chainId ?? ChainId.MATIC;
  const config = getConfig(chainIdToUse);
  const v3 = config['v3'];
  const v2 = config['v2'];
  const ichiEnabled = config['ichi']['available'];
  const showVersion = (v2 && v3) || (v2 && ichiEnabled) || (v3 && ichiEnabled);
  const params: any = useParams();
  const version = params?.version ?? 'v3';

  const helpURL = import.meta.env.VITE_HELP_URL;

  useEffect(() => {
    if (!v2) {
      updateIsV2(false);
    }
  }, [updateIsV2, v2]);

  return (
    <Box width='100%' mb={3}>
      <Box className='pageHeading'>
        <Box className='flex row items-center'>
          <h1 className='h4'>{t('pool')}</h1>
          {showVersion && (
            <Box ml={2}>
              <VersionToggle />
            </Box>
          )}
        </Box>

        {helpURL && (
          <Box
            className='helpWrapper'
            onClick={() => window.open(helpURL, '_blank')}
          >
            <small>{t('help')}</small>
            <HelpIcon />
          </Box>
        )}
      </Box>
      <Box margin='24px auto'>
        <HypeLabAds />
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={5}>
          <Box className='wrapper'>
            {version === 'singleToken' ? (
              <SingleTokenSupplyLiquidity />
            ) : !isV2 ? (
              <SupplyLiquidityV3 />
            ) : (
              <SupplyLiquidity />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={7}>
          <Box className='wrapper'>
            {!isV2 ? <MyLiquidityPoolsV3 /> : <YourLiquidityPools />}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PoolsPage;
