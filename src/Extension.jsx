import React, { Component, Fragment } from 'react';
import * as items from './items';

export default function Extension() {
  return (
    <Fragment>
      <h3>Library</h3>
      <ul className="you_icon cf">
        {
          Object.keys(items)
            .filter(key => key !== 'USEFUL_ITEMS')
            .filter(key => !!document.querySelector(`div#infoBarQImage${items[key]}`))
            .map(key => {
              const li = document.querySelector(`div#infoBarQImage${items[key]}`)
                .parentElement
                .parentElement;
              // Useful items should be duplicated rather than moved
              if (!items.USEFUL_ITEMS.includes(key)) {
                li.style.display = 'none';
              }
              return <li key={key} dangerouslySetInnerHTML={{ __html: li.innerHTML }} />;
            })
        }
      </ul>
    </Fragment>
  );
}
