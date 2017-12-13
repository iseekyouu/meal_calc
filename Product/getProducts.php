<?php
/**
 * Created by PhpStorm.
 * User: anatoly
 * Date: 11.12.17
 * Time: 11:13
 */
$DBH = require_once ('../db/db.php');

$query = 'SELECT p.ID, p.Name, p.Protein, p.Fat, p.Carbo, p.Amount, c.Name CategoryName, c.ID CategoryID
    FROM tbl_product p
    left join tbl_productsInCategory pc on pc.ProductID = p.ID
    left join tbl_category c on c.ID = pc.CategoryID';
try {
    $stm = $DBH->prepare($query);
    $stm->execute();
    echo json_encode($data = $stm->fetchAll());
} catch (Exception $e){
    echo $e;
}
