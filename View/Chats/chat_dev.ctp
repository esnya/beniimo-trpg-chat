<script>
	var user_id = '<?php echo h($user_id); ?>';
	var base_url = '<?php echo $this->Html->url('/'); ?>';
</script>
<?php echo $this->Html->css('Chat.chat',  ['inline' => false]); ?>
<?php echo $this->Html->css('Chat.chat.webkit',  ['inline' => false]); ?>
<?php echo $this->Html->script('Chat.chat',  ['inline' => false]); ?>
<div id="chat" data-mode="index">
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
				<span class="sr-only"><?php echo __('Toggle navigation'); ?></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand chat-visible-index" href="#"><?php echo __('Rooms'); ?></a>
			<a id="chat-room-name" class="navbar-brand chat-visible-view" href="#">&nbsp;</a>
		</div><!-- header -->

		<!-- Collect the nav links, forms, and other content for toggling -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav">
				<li class="chat-visible-index"><a href="#" data-toggle="modal" data-target="#chat-index-modal-room-add"><?php echo __('New Room');?></a></li>
				<li class="chat-visible-view"><a href="#" class="chat-button" data-action="logout"><?php echo __('Logout');?></a></li>
				<!-- <li><a href="#" onclick="$('#chat').attr('data-mode', 'index'); return false; ">Mode = index</a></li> -->
				<!-- <li><a href="#" onclick="$('#chat').attr('data-mode', 'view'); return false; ">Mode = view</a></li> -->
				<!-- <li><a href="#" onclick="$('#chat').attr('data-master', true); return false; ">Master = true</a></li> -->
				<!-- <li><a href="#" onclick="$('#chat').attr('data-master', false); return false; ">Master = false</a></li> -->
				<!-- <li class="chat-visible-index"><a href="#" data-toggle="modal" data-target="#chat-modal-connecting"><?php echo __('Modal Connecting');?></a></li> -->
				<!-- <li class="chat-visible-index"><a href="#" data-toggle="modal" data-target="#chat-modal-reconnect"><?php echo __('Modal Reconnect');?></a></li> -->
				<!-- <li class="chat-visible-index"><a href="#" data-toggle="modal" data-target="#chat-modal-failed"><?php echo __('Modal Failed');?></a></li> -->
			</ul>
		</div><!-- .collapse -->
	</div><!-- .container -->
	</nav>

	<div id="chat-pages">
		<?php echo $this->element('chat_index'); ?>
		<?php echo $this->element('chat_view'); ?>
	</div>
</div><!-- #chat -->

<div id="chat-modal-connecting" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title"><?php echo __('Connectiong'); ?></h4>
			</div>
			<div class="modal-body">
				<?php echo __('Prease Wait'); ?>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="chat-modal-reconnect" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title"><?php echo __('Already Connected'); ?></h4>
			</div>
			<div class="modal-body">
				<?php echo __('You are already connected from other client.'); ?>
				<?php echo __('Do you want to disconnect old connection and reconnect now?'); ?>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary"><?php echo __('Yes'); ?></button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="chat-modal-closed" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title"><?php echo __('Connection Closed'); ?></h4>
			</div>
			<div class="modal-body">
				<?php echo __('Connection closed.'); ?>
				<?php echo __('Prease reload this page to reconnect.'); ?>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="chat-modal-failed" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title"><?php echo __('Connection Failed'); ?></h4>
			</div>
			<div class="modal-body">
				<?php echo __('Connection failed.'); ?>
				<?php echo __('Prease reload this page to retry.'); ?>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<?php echo $this->fetch('content'); ?>
