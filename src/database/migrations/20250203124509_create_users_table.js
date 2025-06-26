exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username').notNullable().unique();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.datetime('joinDate').defaultTo(knex.fn.now());
    table.integer('role').defaultTo(0);
    table.datetime('passwordLastModificationTime').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
