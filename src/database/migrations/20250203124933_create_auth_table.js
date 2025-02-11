export function up(knex) {
  return knex.schema.createTable('auth', (table) => {
    table.increments('id').primary();
    table
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('password').notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable('auth');
}
