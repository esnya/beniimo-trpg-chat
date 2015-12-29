<div id="chat-view" class="chat-page">
	<div id="chat-view-column-side">
		<table class="table table-striped">
			<thead>
				<tr>
					<th><?php echo __('Connecting User'); ?></th>
					<th><?php echo __('Character Name'); ?></th>
				</tr>
			</thead>
			<tbody class="chat-list" data-model="Client">
				<tr class="chat-template chat-client" data-model="Client">
					<td class="chat-field" data-model="User" data-field="name"></td>
					<td class="chat-field" data-model="Client" data-field="name"></td>
				</tr>
			</tbody>
		</table>

		<table class="table table-striped">
			<thead>
				<tr>
					<th></th>
					<th><?php echo __('Character'); ?></th>
					<th><?php echo __('User'); ?></th>
					<th class="visible-swordworld2"><?php echo __('HP'); ?></th>
					<th class="visible-swordworld2"><?php echo __('MP'); ?></th>
					<th class="visible-kancolle"><?php echo __('HP'); ?></th>
					<th class="visible-kancolle"><?php echo __('MP'); ?></th>
				</tr>
			</thead>
			<tbody class="chat-list" data-model="CharacterInstance">
				<tr class="chat-template chat-character" data-model="CharacterInstance">
					<td>
						<!-- .btn-group -->
						<div class="btn-group">
							<button class="btn btn-xs btn-primary"><span class="glyphicon glyphicon-eye-open"><span class="sr-only"><? echo __('View'); ?></span></span></button>
							<button class="btn btn-xs btn-success"><span class="glyphicon glyphicon-pencil"><span class="sr-only"><? echo __('Edit'); ?></span></span></button>
						</div>
						<!-- /.btn-group -->
					</td>
					<td class="chat-field" data-model="CharacterInstance" data-field="name"></td>
					<td class="chat-field" data-model="User" data-field="name"></td>
					<td class="chat-field" data-model="CharacterInstance" data-field="parameter0"></td>
					<td class="chat-field" data-model="CharacterInstance" data-field="parameter1"></td>
				</tr>
			</tbody>
		</table>
	</div>

	<div id="chat-view-column-main">
		<!-- #chat-view-maps -->
		<div id="chat-view-map-tabs">
			<!-- .nav nav-tabs -->
			<ul class="nav nav-tabs" role="tablist">
				<li class="chat-visible-master"><a href="#chat-view-settings" data-toggle="tab"><span class="glyphicon glyphicon-cog"></span></a></li>
				<li class="chat-template" data-model="Map"><a class="chat-field" href="#chat-view-map%%id%%" data-model="Map" data-field="name" data-toggle="tab"></a></li>
				<li class="chat-visible-master"><a href="#" data-toggle="modal" data-target="#chat-view-modal-map-add"><span class="glyphicon glyphicon-plus"></span></a></li>
			</ul>
			<!-- /.nav nav-tabs -->

			<!-- .tab-content -->
			<div class="tab-content">
				<!-- #chat-view-settings.tab-pane -->
				<div id="chat-view-settings" class="tab-pane">
					<!-- .form-group -->
					<div class="form-group">
						<label for="chat-view-setting-room-name"><?php echo __('Room Name') ?></label>
						<input id="chat-view-setting-room-name" class="form-control" type="text">
					</div>
					<!-- /.form-group -->
				</div>
				<!-- /#chat-view-settings.tab-pane -->
				<!-- .tab-pane chat-map chat-template -->
				<div class="tab-pane chat-map chat-template" data-model="Map">
					tab pane
				</div>
				<!-- /.tab-pane chat-map chat-template -->

			</div>
			<!-- /.tab-content -->
		</div>
		<!-- /#chat-view-maps -->

		<!-- #chat-view-messsages -->
		<div id="chat-view-messages" class="chat-list" data-model="Message">
			<!-- .chat-template chat-message row -->
			<div class="chat-template chat-message row" data-model="Message">
				<div class="col-xs-3 chat-field" data-model="Message" data-field="name"></div>
				<div class="col-xs-9 col-sm-7 chat-field" data-model="Message" data-field="message"></div>
				<div class="hidden-xs col-sm-2 text-right chat-field" data-model="Message" data-field="modified"></div>
			</div>
			<!-- /.chat-template chat-message row -->
		</div>
		<!-- /#chat-view-messsages -->

		<!-- #chat-view-message-box -->
		<form id="chat-view-message-form" class="chat-item" data-model="Client" data-id="<?php echo h($user_id); ?>" onsubmit="return false">
			<a href="#" id="chat-view-message-form-setting" class="btn btn-default" data-toggle="modal" data-target="#chat-view-modal-message-setting">
				<span class="glyphicon glyphicon-cog"></span>
				<span class="chat-field" data-model="Client" data-field="name">Test Name</span>
			</a>
			<input id="chat-view-message-form-message" class="form-control" type="text" placeholder="<?php echo __('Input Message'); ?>">
			<input id="chat-view-message-form-submit" type="submit" class="form-control btn btn-primary" value="<?php echo __('Submit'); ?>">
		</form>
		<!-- /#chat-view-message-box -->
	</div>
</div><!-- /#chat-view.chat-page -->

<div id="chat-view-modal-map-add" class="modal fade">
	<form id="chat-view-map-add" action="" onsubmit="return false">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only"><?php echo __('Close'); ?></span></button>
					<h4 class="modal-title"><?php echo __('Create New Map'); ?></h4>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label for="chat-view-map-add-name"><?php echo __('Map Name'); ?></label>
						<input class="form-control" type="text" name="name" required>
					</div>
				</div>
				<div class="modal-footer">
					<input type="submit" class="btn btn-primary" value="<?php echo __('Create'); ?>">
					<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Close'); ?></button>
				</div>
			</div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	</form>
</div><!-- /.modal -->

<div id="chat-view-modal-message-setting" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only"><?php echo __('Close'); ?></span></button>
				<h4 class="modal-title"><?php echo __('Message Settings'); ?></h4>
			</div>
			<form id="chat-view-message-setting" class="chat-form" action="" onsubmit="return false" data-model="Client" data-id="<?php echo h($user_id); ?>">
				<div class="modal-body">
					<div class="form-group">
						<label for="chat-view-message-setting-type"><?php echo __('Type'); ?></label>
						<div class="radio">
							<label>
								<input id="chat-view-message-setting-type-user" class="chat-input" type="radio" name="message_type" value="1">
								<?php echo __('As User'); ?>
							</label>
						</div>
						<div class="radio">
							<label>
								<input id="chat-view-message-setting-type-characterinstance" class="chat-input" type="radio" name="message_type" value="2">
								<?php echo __('As Character / NPC'); ?>
							</label>
						</div>
						<div class="radio">
							<label>
								<input id="chat-view-message-setting-type-free" class="chat-input" type="radio" name="message_type" value="3">
								<?php echo __('Input By Free'); ?>
							</label>
						</div>
					</div>

					<div class="form-group">
						<label for="chat-view-mesage-setting-characterinstance"><?php echo __('Select Character / NPC'); ?></label>
						<select id="chat-view-message-setting-characterinstance" class="form-control chat-list chat-input" name="character_instance_id" data-model="CharacterInstance">
							<option class="chat-template chat-field" data-model="CharacterInstance" data-field="name" value="%%id%%"></option>
						</select>
					</div>

					<div class="form-group">
						<label for="chat-view-mesage-setting-name"><?php echo __('Input Name'); ?></label>
						<input id="chat-view-message-setting-name" class="form-control chat-input" type="text" name="name">
					</div>

					<div class="form-group">
						<label for="chat-view-mesage-setting-whisper"><?php echo __('Whisper For'); ?></label>
						<select id="chat-view-message-setting-whisper" class="form-control" name="whisper">
							<option value="" selected><?php echo __('For All'); ?></option>
							<option class="chat-template chat-field" data-model="Client" data-model="Client" data-field="name" value="%%Client.id%%"></option>
						</select>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal"><?php echo __('Close'); ?></button>
				</div>
			</form>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
