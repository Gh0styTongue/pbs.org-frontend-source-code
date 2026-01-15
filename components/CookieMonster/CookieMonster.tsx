'use client';

// imports
import Cookies from 'js-cookie';
import { useEffect } from 'react';

// lib files
import { PBS_UID_COOKIE } from '@/lib/constants';

// 🍪 👹
// RWEB-9580 users who had a uid cookie set with `www.pbs.org` incorrectly need to have it removed
// @TODO remove this component sometime in the new year (2026)
const CookieMonster = () => {
  useEffect(() => {
    // note - this does not affect the correct cookie, which uses a domain of `.pbs.org`
    // it only affects cookies set to the default subdomain, i.e. `www.pbs.org`
    Cookies.remove(PBS_UID_COOKIE);
  }, [])

  return <></>;
};

export default CookieMonster;
