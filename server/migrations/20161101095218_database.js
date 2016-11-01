
exports.up = function(knex, Promise) {


    return Promise.all([

      knex.schema.createTable('user', function(table){
          table.increments('user_id').primary();
          table.string('user_name');
          table.string('password_hash');
      }),

        knex.schema.createTable('receipt', function(table) {
            table.increments('receipt_id').primary();
            table.integer('location_id')
                 .references('location_id')
                 .inTable('product_locations');
            table.string('date_of_purchase');
            table.integer('total');
            table.integer('tax');
            table.integer('user_id')
                 .references('user_id')
                 .inTable('user');
        }),

        knex.schema.createTable('receipt_item', function(table){
            table.increments('item_id').primary();
            table.integer('upc_id')
                 .references('upc_id')
                 .inTable('official_product');
            table.integer('price');
            table.integer('member_savings');
            table.string('short_hand_name');
            table.integer('receipt_id')
                 .references('receipt_id')
                 .inTable('receipt');
            table.integer('category_id')
                  .references('category_id')
                  .inTable('product_categories');
        }),

        knex.schema.createTable('official_product', function(table){
            table.increments('upc_id').primary();
            table.integer('product_upc');
            table.integer('official_name');
            table.string('image_link');
            table.integer('product_locations')
                 .references('location_id')
                 .inTable('product_locations');
        }),

        knex.schema.createTable('product_categories', function(table){
            table.increments('category_id').primary();
            table.string('category');
            table.integer('subcategory_id')
                 .references('category_id')
                 .inTable('product_categories');
        })

    ])
};


exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('posts'),
        knex.schema.dropTable('comments')
    ])
};
