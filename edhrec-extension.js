const containers = document.getElementsByClassName('test_cardlistscontainer');
containers[0].className = 'cardlistscontainer';

const cards = document.getElementsByClassName('oneimage');

for(let i = 0; i < cards.length; i++) {
  const link = (cards[i].getAttribute('data-src') || cards[i].src)
    .replace('img.', '')
    .replace(/s\/normal\/\w*(?=\/)/g, '')
    .replace(/\.jpg\?\d*/g, '');
  const anchor = document.createElement('a');
  anchor.setAttribute('href', link);
  anchor.setAttribute('style', 'position: absolute; top: 0; right: 0; bottom: 50%; left: 0; z-index: 1;');
  cards[i].parentElement.appendChild(anchor);
}
