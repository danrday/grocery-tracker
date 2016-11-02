
exports.up = function(knex, Promise) {


    return Promise.all([

      knex.schema.createTable('user', function(table){
          table.increments('user_id').primary();
          table.string('user_name');
          table.string('password_hash');
      }),
      
      knex.schema.createTable('stores', function(table){
          table.increments('location_id').primary();
          table.string('company_name');
          table.string('store_address');
      }),

      knex.schema.createTable('official_product', function(table){
          table.integer('product_upc').primary();
          table.string('official_name');
          table.string('image_link');
      }),

      knex.schema.createTable('product_locations', function(table){
          table.increments('p_l_id').primary();
          table.integer('location_id')
            .references('location_id')
            .inTable('stores');
          table.integer('product_upc')
            .references('product_upc')
            .inTable('official_product');
      }),

        knex.schema.createTable('receipt', function(table) {
            table.increments('receipt_id').primary();
            table.integer('location_id')
                 .references('location_id')
                 .inTable('stores');
            table.string('date_of_purchase');
            table.float('total');
            table.float('tax');
            table.integer('user_id')
                 .references('user_id')
                 .inTable('user');
        }),

        knex.schema.createTable('product_categories', function(table){
            table.increments('category_id').primary();
            table.string('category');
            table.integer('subcategory_id')
                 .references('category_id')
                 .inTable('product_categories');
        }),

        knex.schema.createTable('receipt_item', function(table){
            table.increments('item_id').primary();
            table.integer('product_upc')
                 .references('product_upc')
                 .inTable('official_product');
            table.float('price');
            table.float('member_savings');
            table.string('shorthand_name');
            table.integer('receipt_id')
                 .references('receipt_id')
                 .inTable('receipt');
            table.integer('category_id')
                  .references('category_id')
                  .inTable('product_categories');
        })

    ])
};


exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('receipt_item'),
        knex.schema.dropTable('product_categories'),
        knex.schema.dropTable('receipt'),
        knex.schema.dropTable('official_product'),
        knex.schema.dropTable('stores'),
        knex.schema.dropTable('product-locations'),
        knex.schema.dropTable('user')
    ])
};
