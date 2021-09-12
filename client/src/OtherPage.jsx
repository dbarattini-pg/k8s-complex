import React from 'react';
import { Link } from 'react-router-dom';

const OtherPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    I&apos;m some other page!
    <Link to="/" style={{ color: '#61dafb' }}>
      Go back home
    </Link>
  </div>
);

export default OtherPage;
