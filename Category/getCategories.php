<?php
$DBH = require_once ('../db/db.php');

$query = 'select * from tbl_category';
try {
    $stm = $DBH->prepare($query);
    $stm->execute();
    echo json_encode($data = $stm->fetchAll());
} catch (Exception $e){
    echo $e;
}
