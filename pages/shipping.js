import router from 'next/router';
import React, { useContext } from 'react';
import { Store } from '../util/Store';
import dynamic from 'next/dynamic';

function Shipping() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  if (!userInfo) {
    router.push('/login?redirect=shipping');
  }
  return <div>Shipping</div>;
}

export default dynamic(() => Promise.resolve(Shipping), { ssr: false });
