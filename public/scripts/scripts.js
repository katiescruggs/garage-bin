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
    $('#items-ul').append(`<li>${item.name}</li>`);
  });
};

const addItem = async (name, reason, cleanliness) => {
  const initialPost = await fetch('/api/v1/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, reason, cleanliness });
  });

  const id = await initialPost.json();
  console.log(id);
};

$('#garage-btn').on('click', () => {
  $('#garage-img').slideToggle(5000);

  let open = $('#garage-btn').text() === 'Open Your Garage';
  let text = open ? 'Close Your Garage' : 'Open Your Garage';

  $('#garage-btn').text(text);
});

$('#submit-btn').on('click', (e) => {
  e.preventDefault();
  resetInputs();
});

$(document).ready(async () => {
  const items = await fetchItems();
  displayItems(items);
});