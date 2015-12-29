<div id="chat-index" class="chat-page">
	<div class="container">
		<div class="row chat-list" id="chat-rooms" data-model="Room" data-reverse="true">
			<div class="chat-template chat-room col-md-4" tabindex="0" data-model="Room">
				<div class="chat-room-informations">
					<h1 class="chat-field" data-model="Room" data-field="name">&nbsp;</h1>
					<div class="chat-field" data-model="GameType" data-field="name">&nbsp;</div>
					<div class="chat-field" data-model="User" data-field="name">&nbsp;</div>
					<div>
						<span class="chat-field" data-model="Room" data-field="players"></span>
						&nbsp;<?php echo __('players'); ?>
					</div>
				</div>
				<div class="chat-room-toggle">
					<span class="glyphicon glyphicon-chevron-right"></span>
				</div>
				<div class="chat-room-buttons">
					<button class="chat-button btn btn-primary" data-action="join"><?php echo __('Join'); ?></button>
					<button class="chat-button btn btn-success" data-action="view"><?php echo __('View'); ?></button>
				</div>
			</div><!-- /.col -->
		</div><!-- /.row -->
	</div><!-- /.container -->
</div><!-- /.chat-page -->

<div id="chat-index-modal-room-add" class="modal fade">
	<form id="chat-index-room-add" action="" onsubmit="return false">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only"><?php echo __('Close'); ?></span></button>
					<h4 class="modal-title"><?php echo __('Create New Room'); ?></h4>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label for="chat-index-room-add-name"><?php echo __('Room Name'); ?></label>
						<input id="chat-index-room-add-name" class="form-control" type="text" name="name" required>
					</div>
					<div class="form-group">
						<label for="chat-index-room-game-type"><?php echo __('Game Type'); ?></label>
						<select id="chat-index-room-add-game-type" class="form-control" name="game_type">
							<option value=""><?php echo __('No Select'); ?></option>
							<option value="sword_world2"><?php echo __('Sword World 2.0'); ?></option>
							<option value="kancolle"><?php echo __('Kancolle RPG'); ?></option>
						</select>
					</div>
				</div>
				<div class="modal-footer">
					<input class="btn btn-primary" type="submit" value="<?php echo __('Create'); ?>">
					<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
				</div>
			</div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	</form>
</div><!-- /.modal -->
