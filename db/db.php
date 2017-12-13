<?php
$dbConfig = require_once ('config.php');

try {
    $DBH = new PDO("mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']}",
        $dbConfig['user'], $dbConfig['pass'], $dbConfig['opt']
    );
    $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    return $DBH;
}
catch(PDOException $e) {
echo "Хьюстон, у нас проблемы с коннектом к БД";
file_put_contents('PDOErrors.txt', $e->getMessage(), FILE_APPEND);
}