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
  const cleanliness = {
    Sparkling: 0,
    Dusty: 0,
    Rancid: 0
  };

  $('.change-cleanliness').each((index, clean) => {
    cleanliness[$(clean).val()] += 1;
  });

  $('#sparkling-span').text(cleanliness.Sparkling);
  $('#dusty-span').text(cleanliness.Dusty);
  $('#rancid-span').text(cleanliness.Rancid);
}

const displayItems = (items) => {
  items.forEach(item => {
    $('#items-holder').append(`
      <div class="item">
        <h4 data-id=${item.id}>${item.name}</h4>
        <div class="details">
          <p>${item.reason}</p>
          <select id="select-${item.id}" class="change-cleanliness">
            <option value="Sparkling">Sparkling</option>
            <option value="Dusty">Dusty</option>
            <option value="Rancid">Rancid</option>
          </select>
        </div>
      </div>`);
    $(`#select-${item.id}`).val(item.cleanliness);
  });
};

const addItem = async (itemPayload) => {
  const id = await postItem(itemPayload);
  displayItems([{ id: id, name, reason, cleanliness }]);
  displayCleanliness();
};

const postItem = async (itemPayload) => {
  const initialPost = await fetch('/api/v1/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(itemPayload)
  });

  const id = await initialPost.json();
  return id.id;
};

const patchCleanliness = async (id, newCleanliness) => {
  const initialPatch = await fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cleanliness: newCleanliness })
  });
};

const sortAscending = (a, b) => {
  const valueA = $(a).find('h4').text().toLowerCase();
  const valueB = $(b).find('h4').text().toLowerCase();
  return (valueA > valueB) ? 1 : -1;
};

const sortDescending = (a, b) => {
  const valueA = $(a).text().toLowerCase();
  const valueB = $(b).text().toLowerCase();
  return (valueA < valueB) ? 1 : -1;
};

$('#garage-btn').on('click', () => {
  $('#garage-img').slideToggle(2500);

  const open = $('#garage-btn').text() === 'Open Your Garage';
  const text = open ? 'Close Your Garage' : 'Open Your Garage';

  $('#garage-btn').text(text);
});

$('#submit-btn').on('click', (e) => {
  e.preventDefault();
  const name = $('#name-input').val();
  const reason = $('#reason-input').val();
  const cleanliness = $('#cleanliness-select').val();
  addItem({ name, reason, cleanliness });
  resetInputs();
});

$('#items-holder').on('click', 'h4', (e) => {
  $(e.target).siblings('.details').toggle();
});

$('#asc-btn').on('click', () => {
  $('.item').sort(sortAscending).appendTo('#items-holder');
});

$('#desc-btn').on('click', () => {
  $('.item').sort(sortDescending).appendTo('#items-holder');
});

$('#items-holder').on('change', '.change-cleanliness', async function () {
  const id = $(this).parent().siblings('h4').data('id');
  const newCleanliness = $(this).val();
  displayCleanliness();
  await patchCleanliness(id, newCleanliness);
});

$(document).ready(async () => {
  const items = await fetchItems();
  displayCount(items.length);
  displayItems(items);
  displayCleanliness();
});