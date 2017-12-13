<?php
return array(
    'host' => 'localhost',
    'user' => 'root',
    'pass' => '107666',
    'dbname' => 'meal_calc',
    'opt' => [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]
);