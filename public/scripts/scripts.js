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

const displayCount = (length) => {
  $('#items-count').text(length);
}

const displayCleanliness = (items) => {
  let cleanliness = items.reduce((cleanliness, item) => {
    cleanliness[item.cleanliness] += 1;
    return cleanliness;
  }, { Sparkling: 0, Dusty: 0, Rancid: 0 });

  $('#sparkling-span').text(cleanliness.Sparkling);
  $('#dusty-span').text(cleanliness.Dusty);
  $('#rancid-span').text(cleanliness.Rancid);
}

const updateCleanliness = (cleanliness) => {
  const spanId = cleanliness.toLowerCase() + '-span';
  const newText = parseInt($(`#${spanId}`).text()) + 1
  $(`#${spanId}`).text(newText);
}

const displayItems = (items) => {
  items.forEach(item => {
    $('#items-holder').append(`
      <div class="item">
        <h4 data-id=${item.id}>${item.name}</h4>
        <div class="details">
          <p>This is lingering here because ${item.reason}</p>
          <select id="select-${item.id}">
            <option value="Sparkling">Sparkling</option>
            <option value="Dusty">Dusty</option>
            <option value="Rancid">Rancid</option>
          </select>
        </div>
      </div>`);
    $(`#select-${item.id}`).val(item.cleanliness);
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
  displayItems([{ id, name, reason, cleanliness }]);
  updateCleanliness(cleanliness);
};

const sortAscending = (a, b) => {
  const valueA = $(a).find('h4').text().toLowerCase();
  const valueB = $(b).find('h4').text().toLowerCase();
  return (valueA > valueB) ? 1 : -1;
}

const sortDescending = (a, b) => {
  const valueA = $(a).text().toLowerCase();
  const valueB = $(b).text().toLowerCase();
  return (valueA < valueB) ? 1 : -1;
}

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

$('#items-holder').on('click', 'li', (e) => {
  console.log(e.target);
  console.log('id', $(e.target).data('id'));
});

$('#asc-btn').on('click', () => {
  $('.item').sort(sortAscending).appendTo('#items-holder');
});

$('#desc-btn').on('click', () => {
  $('.item').sort(sortDescending).appendTo('#items-holder');
})

$(document).ready(async () => {
  const items = await fetchItems();
  displayCount(items.length);
  displayCleanliness(items);
  displayItems(items);
});