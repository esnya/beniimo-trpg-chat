<?php
	$this->extend('chat_dev');
	$this->Html->css('//code.jquery.com/qunit/qunit-1.15.0.css',  ['inline' => false]);
	$this->Html->script('//code.jquery.com/qunit/qunit-1.15.0.js',  ['inline' => false]);
	$this->Html->script('Chat.test',  ['inline' => false]);
?>

<div id="chat-modal-test" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Test Result</h4>
			</div>
			<div class="modal-body">
				<div id="qunit"></div>
				<div id="qunit-fixture"></div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" data-dismiss="modal">Close</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
