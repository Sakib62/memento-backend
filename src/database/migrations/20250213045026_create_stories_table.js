export function up(knex) {
  return knex.schema.createTable('stories', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table
      .string('authorUsername')
      .notNullable()
      .references('username')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('authorName').notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable('stories');
}
