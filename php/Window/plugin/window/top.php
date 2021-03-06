<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $this->charset;?>">
<title><?php echo $this->title;?></title>
<script src="/global/javascript/prototype.js"></script>
<script src="/global/javascript/setColWidth.js"></script>
<script src="/global/javascript/setPointer.js"></script>
<script src="/global/javascript/input.js"></script>
<script src="/global/javascript/calendar.js"></script>
<script src="/global/javascript/editor.js"></script>
<script src="/global/FCKeditor/fckeditor.js"></script>
<script src="/global/php/Window/plugin/window/window.js"></script>
<script src="/global/menu/contextMenu.js"></script>
<style>@import url('/global/menu/vMenu.css');</style>
<style>@import url("/global/php/Window/plugin/window/window.css");</style>
</head>
<body id="windowBody">
<div id="windowTop">
	<div id="windowLogo"><span><?php echo $this->title;?></span></div>
	<?php echo $this->menu;?>
</div>
<div id="windowMain">