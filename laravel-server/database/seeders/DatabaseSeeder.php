<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Address;
use App\Models\Order;
use App\Models\Review;
use App\Models\OrderProduct;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        //Product::factory()->count(20)->create();

        // $users = User::factory(10)->create();

        $categories = Category::factory(10)->create();

        // Post::factory(2000)
        // ->recycle($users)
        // ->create();

        Category::factory(10)->create();
        Address::factory(10)->create();
        Order::factory(10)->create();
        Product::factory(2000)
        ->recycle($categories)
        ->create();
        Review::factory(10)->create();
        OrderProduct::factory(10)->create();
    }
}
