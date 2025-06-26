exports.up = function (knex) {
  return knex.schema.createTable('auth', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('userId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('password').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('auth');
};
