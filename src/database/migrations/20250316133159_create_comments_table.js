export function up(knex) {
  return knex.schema.createTable('comments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .uuid('storyId')
      .notNullable()
      .references('id')
      .inTable('stories')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table.string('comment', 1000).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('comments');
}
