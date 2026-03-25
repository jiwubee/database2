exports.seed = async function(knex) {
  await knex('heroes').insert([
    { id: 1, name: 'Hero A', power: 'flight', status: 'available', missions_count: 0 },
    { id: 2, name: 'Hero B', power: 'strength', status: 'busy', missions_count: 5 },
    { id: 3, name: 'Hero C', power: 'telepathy', status: 'available', missions_count: 2 },
    { id: 4, name: 'Hero D', power: 'speed', status: 'retired', missions_count: 20 },
    { id: 5, name: 'Hero E', power: 'invisibility', status: 'available', missions_count: 1 }
  ]);
};