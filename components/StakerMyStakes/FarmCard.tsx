import React, { useMemo } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { CurrencyLogo, DoubleCurrencyLogo } from 'components';
import { ChainId, Token } from '@uniswap/sdk';
import { useActiveWeb3React } from 'hooks';
import { formatNumber, getTokenFromAddress } from 'utils';
import { useSelectedTokenList } from 'state/lists/hooks';
import { getAddress } from 'ethers/lib/utils';
import { useTranslation } from 'next-i18next';
import RangeBadge from 'components/v3/Badge/RangeBadge';
import FarmStakeButtons from './FarmStakeButtons';
import { formatReward } from 'utils/formatReward';
import TotalAPRTooltip from 'components/TotalAPRToolTip';
import { useUSDCPricesFromAddresses } from 'utils/useUSDCPrice';

interface FarmCardProps {
  el: any;
  chainId: ChainId;
  poolApr?: number;
  farmApr?: number;
}

export default function FarmCard({ el, poolApr, farmApr }: FarmCardProps) {
  const { t } = useTranslation();
  const { chainId } = useActiveWeb3React();
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  const tokenMap = useSelectedTokenList();
  const poolToken0 = el.pool.token0 as any;
  const poolToken1 = el.pool.token1 as any;
  const token0Address = poolToken0.id ?? poolToken0.address;
  const token1Address = poolToken1.id ?? poolToken1.address;

  const token0 =
    chainId && token0Address
      ? getTokenFromAddress(token0Address, chainId, tokenMap, [
          new Token(
            chainId,
            getAddress(token0Address),
            Number(el.pool.token0.decimals),
          ),
        ])
      : undefined;

  const token1 =
    chainId && token1Address
      ? getTokenFromAddress(token1Address, chainId, tokenMap, [
          new Token(
            chainId,
            getAddress(token1Address),
            Number(el.pool.token1.decimals),
          ),
        ])
      : undefined;

  const outOfRange: boolean =
    el.pool && el.tickLower && el.tickUpper
      ? Number(el.pool.tick) < el.tickLower ||
        Number(el.pool.tick) >= el.tickUpper
      : false;

  const HOPToken = getTokenFromAddress(
    '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc',
    chainId,
    tokenMap,
    [],
  );

  const rewardToken = el.eternalRewardToken;
  const earned = el.eternalEarned;
  const bonusEarned = el.eternalBonusEarned;
  const bonusRewardToken =
    el.pool &&
    el.pool.id &&
    el.pool.id.toLowerCase() === '0x0db644468cd5c664a354e31aa1f6dba1d1dead47'
      ? HOPToken
      : el.eternalBonusRewardToken;

  const rewardTokenAddresses = useMemo(() => {
    const addresses = [];
    if (rewardToken) addresses.push(rewardToken.address);
    if (bonusRewardToken) addresses.push(bonusRewardToken.address);
    return addresses;
  }, [bonusRewardToken, rewardToken]);
  const rewardTokenUSDPrices = useUSDCPricesFromAddresses(rewardTokenAddresses);
  const rewardTokenPrice = rewardTokenUSDPrices?.find(
    (item) =>
      rewardToken &&
      item.address.toLowerCase() === rewardToken.address.toLowerCase(),
  );
  const bonusRewardTokenPrice = rewardTokenUSDPrices?.find(
    (item) =>
      bonusRewardToken &&
      item.address.toLowerCase() === bonusRewardToken.address.toLowerCase(),
  );

  const usdAmount =
    Number(earned) * (rewardTokenPrice ? rewardTokenPrice.price : 0) +
    Number(bonusEarned) *
      (bonusRewardTokenPrice ? bonusRewardTokenPrice.price : 0);

  return (
    <Box>
      <Box
        className='flex flex-wrap items-center justify-between'
        borderRadius='10px'
      >
        {isMobile && (
          <Box mb={1}>
            <RangeBadge removed={false} inRange={!outOfRange} />
          </Box>
        )}

        <Box
          className='flex flex-wrap items-center'
          width={isMobile ? '100%' : '85%'}
        >
          <Box
            className='flex items-center'
            width={isMobile ? '100%' : '60%'}
            mb={isMobile ? 2 : 0}
          >
            <Box className='v3-tokenId-wrapper' mr={1}>
              <span>{el.id}</span>
            </Box>
            {token0 && token1 && (
              <DoubleCurrencyLogo
                currency0={token0}
                currency1={token1}
                size={30}
              />
            )}
            {token0 && token1 && (
              <Box ml='8px'>
                <p className='small'>{`${token0.symbol} / ${token1.symbol}`}</p>
                <a
                  className='small'
                  href={`/#/pool/${+el.id}`}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {t('viewPosition')}
                </a>
              </Box>
            )}
            {!isMobile && (
              <Box ml={1}>
                <RangeBadge removed={false} inRange={!outOfRange} />
              </Box>
            )}
          </Box>

          {isMobile ? (
            <>
              <Box
                className='flex items-center justify-between'
                mb={2}
                width='100%'
              >
                <small className='text-secondary'>{t('poolAPR')}</small>
                <small className='text-success'>
                  {poolApr ? formatNumber(poolApr) : '~'}%
                </small>
              </Box>
              <Box
                className='flex items-center justify-between'
                mb={2}
                width='100%'
              >
                <small className='text-secondary'>{t('farmAPR')}</small>
                <small className='text-success'>
                  {farmApr ? formatNumber(farmApr) : '~'}%
                </small>
              </Box>
            </>
          ) : (
            <Box className='flex items-center' width='20%'>
              <small className='text-success'>
                {formatNumber((poolApr ?? 0) + (farmApr ?? 0))}%
              </small>
              <Box ml={0.5} className='flex'>
                <TotalAPRTooltip farmAPR={farmApr ?? 0} poolAPR={poolApr ?? 0}>
                  <picture>
                    <img src='/assets/images/circleinfo.svg' alt='info' />
                  </picture>
                </TotalAPRTooltip>
              </Box>
            </Box>
          )}
          <Box
            className='flex items-center justify-between'
            mb={isMobile ? 2 : 0}
            width={isMobile ? '100%' : '20%'}
          >
            {isMobile && (
              <small className='text-secondary'>{t('earnedRewards')}</small>
            )}
            <Box textAlign={isMobile ? 'right' : 'left'}>
              <small className='weight-600'>${formatNumber(usdAmount)}</small>
              <Box
                className={`flex items-center ${isMobile ? 'justify-end' : ''}`}
              >
                {rewardToken && (
                  <CurrencyLogo size='16px' currency={rewardToken} />
                )}

                {rewardToken && (
                  <Box ml='6px'>
                    <p className='caption'>{`${formatReward(Number(earned))} ${
                      rewardToken.symbol
                    }`}</p>
                  </Box>
                )}
              </Box>
              {bonusRewardToken && (
                <Box
                  className={`flex items-center ${
                    isMobile ? 'justify-end' : ''
                  }`}
                >
                  <CurrencyLogo size='16px' currency={bonusRewardToken} />
                  <Box ml='6px'>
                    <p className='caption'>{`${formatReward(
                      Number(bonusEarned),
                    )} ${bonusRewardToken.symbol}`}</p>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box className='flex items-center' width={isMobile ? '100%' : '15%'}>
          <FarmStakeButtons el={el} />
        </Box>
      </Box>
    </Box>
  );
}