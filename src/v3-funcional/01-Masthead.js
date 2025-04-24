// src/01-Masthead.js
import React from 'react';
import {
  Masthead,
  MastheadMain,
  MastheadToggle,
  MastheadBrand,
  MastheadLogo,
  MastheadContent,
  Button
} from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/js/icons/bars-icon';

import './01-Masthead.css';
import LogoHT from './assets/images/LogoHT-v1.png';  // ✅ Importa el logo

const CustomMasthead = () => {
  return (
    <Masthead id="inline-masthead" display={{ default: 'inline' }}>
      <MastheadMain>
        <MastheadToggle>
          <Button
                className="custom-bar-icon"
                variant="plain"
                onClick={() => {}}
                aria-label="Global navigation"
                icon={<BarsIcon />}
	  />
        </MastheadToggle>

        <MastheadBrand>
          <MastheadLogo>
            <img src={LogoHT} alt="Logo HT" />
          </MastheadLogo>
        </MastheadBrand>

        <div className="masthead-grow-space"></div>
      </MastheadMain>

      <MastheadContent>
        <span>🔧 Área de contenido</span>
      </MastheadContent>
    </Masthead>
  );
};

export default CustomMasthead;

