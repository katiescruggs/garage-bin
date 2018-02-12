
exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(function () { 
      return knex('items').insert([
        {name: 'dresser', reason: 'maybe one day...', cleanliness: 'Dusty'},
        {name: 'box fan', reason: 'I hate it but Ian wants it', cleanliness: 'Rancid'}
      ]);
    });
};
