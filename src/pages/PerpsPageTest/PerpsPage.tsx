import React from 'react';
import { useAccount, useQuery } from '@orderly.network/hooks';
import { AccountStatusEnum } from '@orderly.network/types';
import { Button, Card, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { useActiveWeb3React, useGetSigner } from '~/hooks';
import { useEffect } from 'react';

export const PerpsPage = () => {
  const { account, state } = useAccount();
  const { data, error } = useQuery('/v1/public/info', {
    formatter: (data) => data,
  });
  const { account: quickSwapAccount, library, chainId } = useActiveWeb3React();

  useEffect(() => {
    if (!library || !quickSwapAccount) return;
    account.setAddress(quickSwapAccount, {
      provider: window.ethereum,
      chain: {
        id: chainId,
      },
    });
  }, [library, account]);
  return (
    <Flex
      style={{ margin: '1.5rem' }}
      gap='3'
      align='center'
      justify='center'
      direction='column'
    >
      <Heading>Account</Heading>

      <Card style={{ maxWidth: 240 }}>
        {state.accountId ? (
          <>
            <Flex gap='2' direction='column'>
              <Container>
                <Text as='div' size='2' weight='bold'>
                  Orderly Account ID:
                </Text>
                <Text as='div' size='2'>
                  {state.accountId}
                </Text>
              </Container>
              <Container>
                <Text as='div' size='2' weight='bold'>
                  Address:
                </Text>
                <Text as='div' size='2'>
                  {state.address}
                </Text>
              </Container>
              <Container>
                <Text as='div' size='2' weight='bold'>
                  User ID:
                </Text>
                <Text as='div' size='2'>
                  {state.userId}
                </Text>
              </Container>
            </Flex>
          </>
        ) : (
          <Text as='div' size='3' weight='bold' color='red'>
            Not connected!
          </Text>
        )}
      </Card>

      <Button
        disabled={state.status !== AccountStatusEnum.NotSignedIn}
        onClick={() => {
          account.createAccount();
        }}
        style={{ color: 'white' }}
      >
        Create Account
      </Button>

      <Button
        disabled={
          state.status > AccountStatusEnum.DisabledTrading ||
          state.status === AccountStatusEnum.NotConnected
        }
        onClick={() => {
          account.createOrderlyKey(30);
        }}
        style={{ color: 'white' }}
      >
        Create Orderly Key
      </Button>
    </Flex>
  );
};

export default PerpsPage;
