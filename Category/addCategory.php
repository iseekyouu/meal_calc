<?php
$DBH = require_once ('../db/db.php');
$dataArr = require ('../lib/getJson.php');
$pdoSet = require_once ('../lib/pdoSet.php');

$allowed = array('Name');

if (!empty($dataArr['ID'])){
    $query = 'update tbl_category SET '.$pdoSet($allowed, $values, $dataArr).' where `ID` = '.$dataArr['ID'];
} else {
    $query = 'insert into tbl_category SET '.$pdoSet($allowed, $values, $dataArr);
}

try {
    $stm = $DBH->prepare($query);
    $stm->execute($values);
    $id = $DBH->lastInsertId();
    echo $id;
} catch (Exception $e){
    echo $e;
}

