<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VariableScopeController extends Controller
{
    public $course = 'BSIT';
    public function index()
    {
        $student = "Denver";
        $message = "Hello, World! " . $student;
        
        return response() -> json([
            "student" => $student,
            "message" => $message,
            "course" => $this -> course
        ]);
    }

    public function read()
    {
       $student = "Denver";
        return response() -> json([
            "course" => $this -> course,
            "greet" => $this -> greet($student)
        ]);
    }

    public function greet($name) {
        return response() -> json([
            "message" => "Hello, " . $name
        ]);
    }

}

