<?php

$DBH = require_once ('../db/db.php');
$dataArr = require ('../lib/getJson.php');
$pdoSet = require_once ('../lib/pdoSet.php');


$allowed = array('Name', 'Protein', 'Fat', 'Carbo', 'Amount');

if (!empty($dataArr['ID'])){
    $query = 'update tbl_product SET '.$pdoSet($allowed, $values, $dataArr).' where `ID` = '.$dataArr['ID'];
} else {
    return false;
}

try {
    // product insert
    $stm = $DBH->prepare($query);
    $stm->execute($values);

    if (empty($dataArr['CategoryID'])) return false;

    // create link between Product and Category

    $query = 'select ID from tbl_productsInCategory where ProductID = '.$dataArr['ID'];
    $stm = $DBH->prepare($query);
    $stm->execute();
    $data = $stm->fetchAll();
    if (!empty($data)) {
        $query = 'update tbl_productsInCategory SET `CategoryID` = :CategoryID where `ProductID` = :ID';
        $values = [];
        $values['CategoryID'] = $dataArr['CategoryID'];
        $values['ID'] = $dataArr['ID'];
    } else {
        $dataArr = array(
            'CategoryID' => $dataArr['CategoryID'],
            'ProductID' => $dataArr['ID']
        );
        $query = 'insert into tbl_productsInCategory SET'.$pdoSet(array('CategoryID','ProductID'), $values, $dataArr);
    }

    $stm = $DBH->prepare($query);
    $stm->execute($values);
    echo $id;
} catch (Exception $e){
    header("Status: 500 ".$e->getMessage());
    echo $e;
}