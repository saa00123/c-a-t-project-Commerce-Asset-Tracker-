<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->get();

        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function show(Product $product)
    {
        $product->load('assets');

        return Inertia::render('Products/Show', [
            'product' => $product
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => ['required', 'string', 'max:255', 'unique:products', 'regex:/^[A-Z]+-\d{3,}$/'],
            'name' => 'required|string|max:255',
        ], [
            'sku.regex' => 'The SKU must match the format: UPPERCASE-NUMBERS (e.g., TSHIRT-001). Minimum 3 digits required.',
        ]);

        Product::create([
            'workspace_id' => $request->user()->workspace_id,
            'sku' => $validated['sku'],
            'name' => $validated['name'],
        ]);

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index');
    }
}
