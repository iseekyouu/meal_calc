<?php

$DBH = require_once ('../db/db.php');
$dataArr = require ('../lib/getJson.php');
$pdoSet = require_once ('../lib/pdoSet.php');


$allowed = array('Name', 'Protein', 'Fat', 'Carbo', 'Amount');
$query = 'insert into tbl_product SET '.$pdoSet($allowed, $values, $dataArr);
try {
    // product insert
    $stm = $DBH->prepare($query);
    $stm->execute($values);
    $id = $DBH->lastInsertId();

    if (empty($dataArr['CategoryID'])) return false;
    // create link between Product and Category
    $allowed = array('CategoryID','ProductID');
    $query = 'insert into tbl_productsInCategory SET'.$pdoSet($allowed, $values ,
            array(
                'CategoryID' => $dataArr['CategoryID'],
                'ProductID' => $id
            ));
    $stm = $DBH->prepare($query);
    $stm->execute($values);
    echo $id;
} catch (Exception $e){
    header("Status: 500 ".$e->getMessage());
    echo $e;
}