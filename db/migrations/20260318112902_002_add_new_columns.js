/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async(knex) => {
  await knex.schema.alterTable('heroes', (table) => {
    table.integer('missions_count').notNullable().defaultTo(0);
  })
  await knex.schema.alterTable('incidents', (table) => {
    table.integer('district').nullable();
    table.integer('assigned_at').nullable();
    table.integer('resolved_at').nullable();
  });
  await knex.raw(`
    ALTER TABLE heroes 
    DROP CONSTRAINT heroes_status_check;
  `);
  
  await knex.raw(`
    ALTER TABLE heroes 
    ADD CONSTRAINT heroes_status_check 
    CHECK (status IN ('available', 'busy', 'retired'));
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
