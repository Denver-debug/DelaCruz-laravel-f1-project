<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    
    public function definition(): array
    {

         // Indexed Array 
        // $categories = [ 
        //     'Hardware', 
        //     'Electrical', 
        //     'Plumbing' 
        // ]; 
 
        // // Multidimensional Array 
        // $products = [ 
        //     [ 
        //         'category' => $categories[0], 
        //         'name' => 'hammer', 
        //         'price' => 250, 
        //     ], 
        //     [ 
        //         'category' => $categories[1], 
        //         'name' => 'extension wire', 
        //         'price' => 450, 
        //     ], 
        //     [ 
        //         'category' => $categories[2], 
        //         'name' => 'water pipe', 
        //         'price' => 180, 
        //     ], 
        // ]; 
        //        // Select random product 
        // $product = $this->faker->randomElement($products); 
 
        // // Format product name 
        // $name = ucwords( 
        //     strtolower( 
        //         trim($product['name']) 
        //     ) 
        // ); 
 
        // return [ 
        //     'name' => $name, 
        //     'slug' => Str::slug($name), 
        //     'category' => ucwords( 
        //         strtolower( 
        //             trim($product['category']) 
        //         ) 
        //     ), 
 
        //     'price' => $product['price'], 
        //     'quantity' => $this->faker->numberBetween(1, 100), 
        //     'status' => 'Available', 
        // ];

        return [
            'category_id' => Category::factory(),
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 10, 500),
        ];
    }
}
