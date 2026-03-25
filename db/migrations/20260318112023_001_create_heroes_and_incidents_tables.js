/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};
exports.up = async (knex) => {
    //bazowa
  await knex.schema.createTable('heroes', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.enum('power', ['flight', 'strength', 'telepathy', 'speed', 'invisibility']).notNullable();
    table.enum('status', ['available', 'busy']).notNullable();
    table.timestamps(true, true); // created_at, updated_at
  });

  await knex.schema.createTable('incidents', (table) => {
    table.increments('id').primary();
    table.string('location').notNullable();
    table.enum('level', ['low', 'medium', 'critical']).notNullable();
    table.enum('status', ['open', 'assigned', 'resolved']).notNullable();
    table.integer('hero_id').unsigned().nullable().references('id').inTable('heroes').onDelete('SET NULL');
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('incidents');
  await knex.schema.dropTableIfExists('heroes');
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
