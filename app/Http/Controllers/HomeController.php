<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    //render home component
    public function home()
    {
        return Inertia::render('Home');
    }
}
