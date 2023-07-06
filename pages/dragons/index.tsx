import React, { useEffect } from 'react';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import DragonsLair from 'components/pages/dragons/DragonsLair';
import DragonsSyrup from 'components/pages/dragons/DragonsSyrup';
import styles from 'styles/pages/Dragon.module.scss';
import { useTranslation } from 'next-i18next';
import AdsSlider from 'components/AdsSlider';
import Image from 'next/image';
import { DLDQUICK, DLQUICK } from 'constants/v3/addresses';
import { ChainId } from '@uniswap/sdk';
import { useActiveWeb3React } from 'hooks';
import { getConfig } from 'config';
import { useRouter } from 'next/router';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const DragonPage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('xs'));
  const { t } = useTranslation();
  //showing old dragons lair until we're ready to deploy

  const { chainId } = useActiveWeb3React();
  const chainIdToUse = chainId ?? ChainId.MATIC;
  const quickToken = DLQUICK[chainIdToUse];
  const dQuickToken = DLDQUICK[chainIdToUse];
  const config = getConfig(chainIdToUse);
  const showLair = config['lair']['available'];
  const showOld = config['lair']['oldLair'];
  const showNew = config['lair']['newLair'];
  const router = useRouter();

  useEffect(() => {
    if (!showLair) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLair]);

  return (
    <Box width='100%' mb={3}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={4}>
          {showNew && (
            <Box className={styles.dragonWrapper}>
              <Box className={styles.dragonBg}>
                <Image
                  src='/assets/images/DragonBg2.svg'
                  alt='Dragon Lair'
                  width={395}
                  height={232}
                />
              </Box>
              <Image
                src='/assets/images/DragonLairMask.svg'
                alt='Dragon Mask'
                className={styles.dragonMask}
                width={395}
                height={366}
              />
              <Box className={styles.dragonTitle}>
                <h5>{t('newDragonLair')}</h5>
                <small>
                  {t('dragonLairTitle', {
                    symbol: quickToken?.symbol,
                    symbol1: dQuickToken?.symbol,
                  })}
                </small>
              </Box>
              <DragonsLair isNew={true} />
            </Box>
          )}
          {showOld && (
            <Box className={styles.dragonWrapper} mt='10px'>
              <Box className={styles.dragonBg} style={{ maxHeight: 170 }}>
                <Image
                  src='/assets/images/DragonBg2.svg'
                  alt='Dragon Lair'
                  width={395}
                  height={232}
                />
              </Box>
              <Image
                src='/assets/images/DragonLairMask.svg'
                alt='Dragon Mask'
                className={styles.dragonMask}
                width={395}
                height={366}
              />
              <Box className={styles.dragonTitle} width='85%'>
                <h5>{t('dragonLair')}</h5>
                <small>{t('oldDragonLairTitle')}</small>
              </Box>
              <DragonsLair isNew={false} />
            </Box>
          )}
          <Box maxWidth={isMobile ? '320px' : '352px'} margin='16px auto 0'>
            <AdsSlider sort='dragons' />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Box className={styles.dragonWrapper}>
            <Box className={styles.dragonBg}>
              <Image
                src={
                  isMobile
                    ? '/assets/images/DragonBg2.svg'
                    : '/assets/images/DragonBg1.svg'
                }
                alt='Dragon Syrup'
                width={isMobile ? 352 : 821}
                height={isMobile ? 207 : 151}
              />
            </Box>
            <Box className={styles.dragonTitle}>
              <h5>{t('dragonSyrup')}</h5>
              <small>{t('dragonSyrupTitle')}</small>
            </Box>
            <DragonsSyrup />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default DragonPage;