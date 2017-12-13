<?php
if (!$_SERVER["CONTENT_TYPE"] ==  'application/json') return false;
$postData = file_get_contents('php://input');
$dataArr = json_decode($postData, true);
return $dataArr;