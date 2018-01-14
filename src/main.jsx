import React from 'react';
import ReactDOM from 'react-dom';
import MutationSummary from 'mutation-summary';

import Extension from './Extension';
import * as items from './items';

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

    // Create the new elements to populate the category
    const elements = createElements();
    // If we don't have any, return early
    if (!elements.length) {
      return;
    }

    while (elements.length % 6 > 0) {
      elements.push(<li key={elements.length % 6} className="empty-icon" />);
    }

    // Decide where to put the new category; either before 'Lodgings' or at
    // the top.
    // TODO: binary sort the h3s and actually put the category in the correct
    // place
    const h3s = Array.from(document.querySelectorAll('.you_bottom_rhs > h3'));
    const lodgingsElement = (() => {
      // Almost every user will have a 'Lodgings' section...
      const els = h3s.filter(h3 => h3.innerText === 'Lodgings');
      if (els.length) {
        return els[0];
      }
      // ...but if they don't, stick the Library at the top
      return h3s[0];
    })();

    // Create and insert a container for the extension
    const parent = document.querySelector('div.you_bottom_rhs');
    const container = parent.insertBefore(document.createElement('div'), lodgingsElement);

    // Get a reference to the list of Curiosity items
    const curiosityUL = h3s.filter(el => el.innerText === 'Curiosity')[0].nextElementSibling;

    // Remove matching elements from the Curiosity category
    removeMatches({ curiosityUL });

    // Now we need to prune the li.empty-icon set from 'Curiosity' so that the total
    // number of items is 0 mod 6
    padWithEmptyIcons({ curiosityUL });

    // Render the extension
    ReactDOM.render(
      <Extension elements={elements}/>,
      container,
    );
  }
}

function createElements() {
  return Object.keys(items)
    .filter(key => !!document.querySelector(`div#infoBarQImage${items[key]}`))
    .map((key) => {
      const li = document.querySelector(`div#infoBarQImage${items[key]}`)
        .parentElement
        .parentElement;
      return <li key={key} dangerouslySetInnerHTML={{ __html: li.innerHTML }} />;
    });
}

function padWithEmptyIcons({ curiosityUL }) {
  // Start by removing all of the empty icons.
  [...curiosityUL.querySelectorAll('.empty-icon')].forEach(el => el.remove());
  // Now pad up to 0 mod 6
  while (curiosityUL.querySelectorAll('li').length % 6 > 0) {
    const li = document.createElement('li');
    li.classList.add('empty-icon');
    curiosityUL.appendChild(li);
  }
}

function removeMatches({ curiosityUL }) {
  // Iterate over the li elements in the list, skipping empty icons
  [...curiosityUL.querySelectorAll('li')].forEach((li) => {
    if ([...li.classList].includes('empty-icon')) {
      return;
    }
    // Look for a div whose ID starts with 'infoBarQImage' (a well-formed li
    // should contain one, but you never know) and remove it if its ID matches
    // one of our items
    const div = li.querySelector('div[id^="infoBarQImage"]');
    if (div) {
      if (Object.values(items).map(id => `infoBarQImage${id}`).includes(div.id)) {
        li.remove();
      }
    }
  });
}
