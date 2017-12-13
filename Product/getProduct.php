<?php
/**
 * Created by PhpStorm.
 * User: anatoly
 * Date: 12.12.17
 * Time: 8:29
 */

$DBH = require_once ('../db/db.php');
$pdoSet = require ('../lib/pdoSet.php');
$allowed = array('CategoryID');
$dataArr = require ('../lib/getJson.php');

$query = 'SELECT p.ID, p.Name, p.Protein, p.Fat, p.Carbo, p.Amount, c.Name CategoryName, c.ID CategoryID
    FROM tbl_product p
     join tbl_productsInCategory pc on pc.ProductID = p.ID
     join tbl_category c on c.ID = pc.CategoryID
    where '.$pdoSet($allowed, $values, $dataArr);
try {
    $stm = $DBH->prepare($query);
    $stm->execute($values);
    echo json_encode($data = $stm->fetchAll());
} catch (Exception $e) {
    echo $e;
}