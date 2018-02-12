const resetInputs = () => {
  $('#name-input').val('');
  $('#reason-input').val('');
  $('#cleanliness-select').val('Sparkling');
};

const fetchItems = async () => {
  const initialFetch = await fetch('/api/v1/items');
  const itemResults = await initialFetch.json();
  return itemResults.results;
};

const displayItems = (items) => {
  $('#items-count').text(items.length);
  items.forEach(item => {
    $('#items-ul').append(`<li data-id=${item.id}>${item.name}</li>`);
  });
};

const addItem = async (name, reason, cleanliness) => {
  const initialPost = await fetch('/api/v1/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, reason, cleanliness })
  });

  const id = await initialPost.json();
  displayItems([{ id, name, reason, cleanliness}]);
};

$('#garage-btn').on('click', () => {
  $('#garage-img').slideToggle(5000);

  let open = $('#garage-btn').text() === 'Open Your Garage';
  let text = open ? 'Close Your Garage' : 'Open Your Garage';

  $('#garage-btn').text(text);
});

$('#submit-btn').on('click', (e) => {
  e.preventDefault();
  let name = $('#name-input').val();
  let reason = $('#reason-input').val();
  let cleanliness = $('#cleanliness-select').val();
  addItem(name, reason, cleanliness);
  resetInputs();
});

$('#items-ul').on('click', 'li', (e) => {
  console.log(e.target);
  console.log('id', $(e.target).data('id'));
  console.log('reason', $(e.target).data('reason'));
  console.log('cleanliness', $(e.target).data('cleanliness'));
});

$(document).ready(async () => {
  const items = await fetchItems();
  displayItems(items);
});