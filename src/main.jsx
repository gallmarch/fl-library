import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import MutationSummary from 'mutation-summary';

// eslint-disable-next-line no-unused-vars
import styles from './styles.scss'
import reducer from './reducer';
import Extension from './Extension';

watchForInventorySection();

function watchForInventorySection() {
  const rootNode = document.querySelector('#mainContentViaAjax');
  const queries = [{ element: 'div.you_bottom_rhs' }];

  return new MutationSummary({
    rootNode,
    queries,
    callback,
  });

  function callback(summaries) {
    const summary = summaries[0];

    // Return early if we're on the wrong page
    if (!summary.added.length) {
      return;
    }

    // Create a container element
    const parent = document.querySelector('div.you_bottom_rhs');
    const h3s = Array.from(parent.querySelectorAll('h3'));
    console.info(h3s);
    const lodgingsElement = (() => {
      // Almost every user will have a 'Lodgings' section...
      const elements = h3s.filter(h3 => h3.innerText === 'Lodgings');
      if (elements.length) {
        return elements[0];
      }
      // ...but if they don't, stick the Library at the top
      return h3s[0];
    })();
    const container = parent.insertBefore(document.createElement('div'), lodgingsElement);

    if (summary.added.length) {
      ReactDOM.render(
        <Extension />,
        container,
      );
    }
  }
}
