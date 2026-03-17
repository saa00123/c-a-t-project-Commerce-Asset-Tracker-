<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->latest();

        if ($request->has('search') && $request->search !== null) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
        }

        $products = $query->paginate(10)->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only('search')
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

        $product = Product::create([
            'workspace_id' => $request->user()->workspace_id,
            'sku' => $validated['sku'],
            'name' => $validated['name'],
        ]);

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'CREATED',
            'subject_type' => Product::class,
            'subject_id' => $product->id,
            'description' => "Created new product: {$product->name} ({$product->sku})",
        ]);

        return redirect()->route('products.index');
    }

    public function destroy(Request $request, Product $product)
    {
        $productName = $product->name;
        $productSku = $product->sku;

        $product->delete();

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'DELETED',
            'subject_type' => Product::class,
            'subject_id' => $product->id,
            'description' => "Deleted product: {$productName} ({$productSku})",
        ]);

        return redirect()->route('products.index');
    }
}
