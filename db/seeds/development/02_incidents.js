const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  const heroes = await knex('heroes').select('id');

  const levels = ['low', 'medium', 'critical'];
  const statuses = ['open', 'assigned', 'resolved'];

  const incidents = [];

  for (let i = 0; i < 60; i++) {
    const status = faker.helpers.arrayElement(statuses);

    let hero_id = null;
    let assigned_at = null;
    let resolved_at = null;

    if (status === 'assigned' || status === 'resolved') {
      hero_id = faker.helpers.arrayElement(heroes).id;
      assigned_at = faker.date.recent();

      if (status === 'resolved') {
        resolved_at = faker.date.recent();
      }
    }

    incidents.push({
      location: faker.location.streetAddress(),
      district: faker.helpers.maybe(() => faker.location.city(), { probability: 0.7 }),
      level: faker.helpers.arrayElement(levels),
      status,
      hero_id,
      assigned_at,
      resolved_at
    });
  }

  await knex('incidents').insert(incidents);
};