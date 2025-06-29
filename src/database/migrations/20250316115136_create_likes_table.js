exports.up = async function (knex) {
  await knex.schema.createTable('likes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').notNullable();
    table.uuid('storyId').notNullable();

    table
      .foreign('userId')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .foreign('storyId')
      .references('id')
      .inTable('stories')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table.unique(['userId', 'storyId']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('likes');
};
