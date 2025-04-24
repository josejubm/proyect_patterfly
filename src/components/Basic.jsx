import React from 'react';
import { Masthead, MastheadMain, MastheadBrand, MastheadContent, Brand } from '@patternfly/react-core';

export const BasicHeader = () => {
  return (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <Brand src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg" alt="Logo" heights={{ default: '36px' }} />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <h1 style={{ marginLeft: '20px', fontSize: '20px' }}>Mi Header Básico</h1>
      </MastheadContent>
    </Masthead>
  );
};

export default BasicHeader;
