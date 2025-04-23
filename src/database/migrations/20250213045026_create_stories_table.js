export function up(knex) {
  return knex.schema.createTable('stories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title').notNullable();
    table.text('description').notNullable();
    table
      .uuid('authorId')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table.specificType('tags', 'jsonb').defaultTo(knex.raw("'[]'::jsonb"));
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('stories');
}
