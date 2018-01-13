/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';
import * as items from './items';

export default function Extension({ elements }) {
  return (
    <Fragment>
      <h3>Library</h3>
      <ul className="you_icon cf">
        {elements}
      </ul>
    </Fragment>
  );
}
