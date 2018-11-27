// Setting card container class to old class
const container = document.getElementsByClassName('test_cardlistscontainer')[0];
container.className = 'cardlistscontainer';
const layoutSelect = container.children[0].children[0]; // no class on select
layoutSelect.style = 'margin-right: 2vw; float: right;';

// Adding buttons to cards
const cards = document.getElementsByClassName('card');

for(let i = 0; i < cards.length; i++) {
  let cardName = cards[i].parentElement.parentElement.getElementsByClassName('nwname')[0].innerHTML;
  if (cardName.length === 0) { // Commander
    cardName = cards[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('panel-title')[0].innerHTML
  }

  const anchor = document.createElement('a');
  const scryfallLink = 'https://scryfall.com/search?q='+ encodeURI(cardName) + '&unique=cards&as=grid&order=name';
  anchor.setAttribute('href', scryfallLink);
  anchor.setAttribute('class', 'scryfall-link');

  const addCardButton = document.createElement('a');
  addCardButton.setAttribute('class', 'add-card-button');
  addCardButton.setAttribute('cardName', cardName);
  const addCardButtonArrow = document.createElement('div');
  addCardButtonArrow.setAttribute('class', 'glyphicon glyphicon-chevron-right');
  addCardButton.appendChild(addCardButtonArrow);
  addCardButton.addEventListener('click', function(event) {
    addCardToDecklist(addCardButton.getAttribute('cardName'));
    event.preventDefault();
  });

  cards[i].appendChild(anchor);
  cards[i].appendChild(addCardButton);
}

// Decklist functionality

// Setup decklist views
const decklistDiv = document.createElement('div');
decklistDiv.setAttribute('class', 'decklist');

const decklistHeader = document.createElement('h2');
decklistHeader.setAttribute('class', 'decklist-header');
decklistHeader.innerHTML = 'Decklist';

const decklistCardsContainer = document.createElement('div');
decklistCardsContainer.setAttribute('class', 'decklist-cards-container');

const decklistButtonsWrapper = document.createElement('div');
decklistButtonsWrapper.setAttribute('class', 'decklist-buttons-wrapper');

const copyDecklistButton = document.createElement('div');
copyDecklistButton.setAttribute('class', 'copy-decklist-button decklist-button');
copyDecklistButton.innerHTML = 'Copy';
copyDecklistButton.addEventListener('click', function() {
  copyDecklist();
});

const clearDecklistButton = document.createElement('div');
clearDecklistButton.setAttribute('class', 'clear-decklist-button decklist-button');
clearDecklistButton.innerHTML = 'Clear';
clearDecklistButton.addEventListener('click', function() {
  clearDecklist();
});

decklistButtonsWrapper.appendChild(copyDecklistButton);
decklistButtonsWrapper.appendChild(clearDecklistButton);

decklistDiv.appendChild(decklistHeader);
decklistDiv.appendChild(decklistCardsContainer);
decklistDiv.appendChild(decklistButtonsWrapper);

document.body.appendChild(decklistDiv);

// Updates decklist view to match localStorage
function updateDecklist() {
  // Remove all existing nodes
  while (decklistCardsContainer.firstChild) {
    decklistCardsContainer.removeChild(decklistCardsContainer.firstChild);
  }

  // Grab decklist from local storage
  const decklist = getDecklist();

  // Re-add all nodes
  decklist.forEach(card => {
    const decklistCardWrapper = document.createElement('div');
    decklistCardWrapper.setAttribute('class', 'decklist-card-wrapper');

    const removeCardButton = document.createElement('div');
    removeCardButton.setAttribute('class', 'remove-card-button glyphicon glyphicon-remove');
    removeCardButton.addEventListener('click', function() {
      removeCardFromDecklist(card);
    });

    const decklistCard = document.createElement('div');
    decklistCard.setAttribute('class', 'decklist-card');
    decklistCard.innerHTML = card;

    decklistCardWrapper.appendChild(removeCardButton);
    decklistCardWrapper.appendChild(decklistCard);
    decklistCardsContainer.appendChild(decklistCardWrapper);
  });

  if (decklist.length == 0) {
    decklistCardsContainer.classList.add('empty');
  } else {
    decklistCardsContainer.classList.remove('empty');
  }
}

function addCardToDecklist(cardName) {
  const decklist = getDecklist();
  decklist.push(cardName);
  setDecklist(decklist);
  updateDecklist();
}

function removeCardFromDecklist(cardName) {
  let decklist = getDecklist();
  decklist = decklist.filter(card => {
    return card !== cardName;
  });
  setDecklist(decklist);
  updateDecklist();
}

function clearDecklist() {
  setDecklist([]);
  updateDecklist();
}

function copyDecklist() {
  const decklist = getDecklist();

  const copyArea = document.createElement('textarea');
  copyArea.value = decklist.join('\n');
  copyArea.style.position = 'absolute';
  copyArea.style.left = '-9999px';
  document.body.appendChild(copyArea);
  copyArea.select();
  document.execCommand('copy');
  document.body.removeChild(copyArea);
}

// Helpers for readability
const decklistLocalStorageKey = 'edhrec-extension-deck-list';

function getDecklist() {
  const decklist = (localStorage.getItem(decklistLocalStorageKey) || '');
  if (decklist.length == 0) {
    return [];
  }
  return decklist.split('|');
}

function setDecklist(decklist) {
  localStorage.setItem(decklistLocalStorageKey, decklist.join('|'));
}

// First update
updateDecklist();

