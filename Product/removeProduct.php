<?php
$DBH = require_once ('../db/db.php');

if (!$_SERVER["CONTENT_TYPE"] ==  'application/json') return false;
$postData = file_get_contents('php://input');
$dataArr = json_decode($postData, true);
$ID = $dataArr['ID'];
if (empty($ID)) return false;

$query = 'delete from tbl_product where id = :ID';
try {
    $stm = $DBH->prepare($query);
    $stm->execute(['ID' => $ID]);
    return true;
} catch (Exception $e){
    echo $e;
}