import { createEl } from '../../scripts/scripts.js';

export default async function decorate(blockEl) {
  const blockWrapperEl = blockEl.parentElement;
  const formEl = createEl('div', {
    class: 'search-form-container',
  }, `
    <h3>Search for Certificates of Product Quality and Analysis</h3>
    <p>Enter the Part Number and Serial / Lot Number to receive a copy of the certification for that item</p>
  `, blockEl);
  const searchFormEl = createEl('div', {
    id: 'search-form',
  }, `
      <label>
        Part Number
        <input id="part" value="999994-999"/>
      </label>
      <label>
        Serial Number/Lot Number
        <input id="lot"/>
      </label>
      <button>Search</button>
  `, formEl);
  const resultsEl = createEl('div', {
    id: 'search-results'
  }, `
    <h2>Results</h2>
    <ul>
    </ul>
  `, blockWrapperEl);

  const searchButtonEl = searchFormEl.querySelector('button');
  searchButtonEl.addEventListener('click', async () => {
    resultsEl.style.visibility = 'visible';
    const part = searchFormEl.querySelector('#part').value;
    const lot = searchFormEl.querySelector('#lot').value;
    const result = await findDocument(part, lot);
    const listEl = resultsEl.querySelector('ul');
    if(result.url) {
      const fileName = `${part}_${lot}.pdf`;
      listEl.innerHTML = `<a href="${result.url}" download="${fileName}">${fileName}</a>`;
    } else {
      listEl.innerHTML = `<span>No Document Found</span>`;
    }
  });
}

const host = (window.location.href.includes('localhost')) ? 'tc48z2mdi2.execute-api.us-east-1.amazonaws.com' : 'api.agilentpoc.cazzaran.com';
async function findDocument(part, lot) {
  const req = await fetch(`/api/search?part=${part}&lot=${lot}`, {
    credentials: "include",
    headers: {
      "Accept": "application/json",
    }
  },)
  const result = await req.json();
  return result;
}
