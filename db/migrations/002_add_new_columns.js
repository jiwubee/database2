/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.alterTable('heroes', (table) => {
    table.integer('missions_count').notNullable().defaultTo(0);
  });

  await knex.schema.alterTable('incidents', (table) => {
    table.string('district').nullable();
    table.timestamp('assigned_at').nullable();
    table.timestamp('resolved_at').nullable();
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
exports.down = async (knex) => {
  await knex.raw(`
    ALTER TABLE heroes 
    DROP CONSTRAINT heroes_status_check;
  `);

  await knex.raw(`
    ALTER TABLE heroes 
    ADD CONSTRAINT heroes_status_check 
    CHECK (status IN ('available', 'busy'));
  `);

  await knex.schema.alterTable('incidents', (table) => {
    table.dropColumn('district');
    table.dropColumn('assigned_at');
    table.dropColumn('resolved_at');
  });

  await knex.schema.alterTable('heroes', (table) => {
    table.dropColumn('missions_count');
  });
};

