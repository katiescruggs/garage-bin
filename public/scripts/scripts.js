const resetInputs = () => {
  $('#name-input').val('');
  $('#reason-input').val('');
  $('#cleanliness-select').val('Sparkling');
}

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