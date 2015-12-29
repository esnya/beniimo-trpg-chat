<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title><?php echo $title_for_layout; ?></title>

	 <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
	<meta name="apple-mobile-web-app-capable" content="yes" />
	 <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

	<meta name="description" content="">
	<meta name="author" content="">

	<?php echo $this->Html->css('bootstrap.min'); ?>
	<?php echo $this->Html->css('bootstrap-theme.min'); ?>
	<?php echo $this->fetch('css'); ?>
</head>
<body ontouchmove="event.preventDefault();" onload="window.scrollTo(0,0);">
	<?php echo $this->fetch('content'); ?>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
	<?php echo $this->Html->script('bootstrap.min'); ?>
	<?php echo $this->fetch('script'); ?>
</body>
</html>
