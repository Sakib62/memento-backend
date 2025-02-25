export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.datetime('joinDate').defaultTo(knex.fn.now());
    table.integer('role').defaultTo(0);
    table.datetime('passwordLastModificationTime').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('users');
}
