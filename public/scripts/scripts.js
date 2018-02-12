const resetInputs = () => {
  $('#name-input').val('');
  $('#reason-input').val('');
  $('#cleanliness-select').val('Sparkling');
}

$('#garage-img').on('click', () => {
  $('#garage-img').slideUp(5000);
});

$('#submit-btn').on('click', (e) => {
  e.preventDefault();
  resetInputs();
});