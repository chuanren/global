<?php
ob_start();
require("menu.htm");
$this->menu=ob_get_clean();
?>