<script>
	var user_id = '<?php echo h($user_id); ?>';
	var base_url = '<?php echo $this->Html->url('/'); ?>';
</script>
<?php
	$this->Html->css('Chat.flip', array('inline' => false));
	$this->Html->css('Chat.client', array('inline' => false));
	$this->Html->script('Chat.flip', array('inline' => false));
	$this->Html->script('Chat.common', array('inline' => false));
	$this->Html->script('Chat.client', array('inline' => false));
?>

<div id="Chat">
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
				<span class="sr-only"><?php echo __('Toggle navigation'); ?></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#"><?php echo __('Chat'); ?></a>
		</div><!-- header -->

		<!-- Collect the nav links, forms, and other content for toggling -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav">
				<li><a href="#" id="NewRoom" data-toggle="modal" data-target="#CreateRoomModal"><?php echo __('New Room');?></a></li>
				<li><a href="#" id="Logout"><?php echo __('Logout');?></a></li>
				<li><a href="#" id="AddCharacter"><?php echo __('Add Character');?></a></li>
				<li><a href="#" id="AddNPC" data-toggle="modal" data-target="#AddNPCModal"><?php echo __('Add NPC');?></a></li>
				<li><a href="#" id="EditRoom" data-toggle="modal" data-target="#EditRoomModal"><?php echo __('Edit Room');?></a></li>
				<li><a href="#" id="EditMap" data-toggle="modal" data-target="#EditMapModal"><?php echo __('Edit Map');?></a></li>
			</ul>
		</div><!-- collapse -->
	</div><!-- container -->
	</nav>

	<div id="Pages" class="pages">
		<div id="ListPage" class="page">
			<div class="container">
				<div class="row">
					<div id="RoomList" ontouchmove="event.stopPropagation();">
					</div>
				</div>
			</div> <!-- container -->
		</div> <!-- page -->

		<div id="RoomPage" class="page">
			<div id="CharacterInstanceListContainer" ontouchmove="event.stopPropagation();">
				<div class="container">
					<div class="row">
						<div class="table-responsive">
							<table id="CharacterInstanceList" class="table table-striped table-condensed acordion">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div> <!-- row -->
				</div> <!-- container -->
			</div> <!-- CharacterInstanceListContainer -->

			<div id="MapContainer" class="container">
				<div id="LeftImage" class="hidden-xs"></div>
				<div id="MapInnerContainer">
					<div id="MapToolbar">
						<div class="text-center">
							<div class="btn-group">
								<button class="btn btn-default btn-xs" data-action="zoom" data-zoom="+1">
									<span class="glyphicon glyphicon-zoom-in"></span>
								</button>
								<button class="btn btn-default btn-xs" data-action="zoom" data-zoom="-1">
									<span class="glyphicon glyphicon-zoom-out"></span>
								</button>
							</div>
						</div> <!-- row -->
					</div> <!-- MapToolbar -->
					<div id="Map" ontouchmove="event.stopPropagation()">
						<div id="MapCharacters">
						</div>
						<div id="MapTiles" data-name="data[Room][map_background_url]" data-uploadbase="<?php echo $this->Html->url(array('controller' => 'rooms', 'action' => 'upload_image'))?>">
						</div>
					</div> <!-- Map -->
				</div> <!-- MapInnerContainer -->
				<div id="RightImage" class="hidden-xs"></div>
			</div><!-- container -->
			<div id="ChatMessageList" ontouchmove="event.stopPropagation();">
			</div>
			<form id="ChatMessageForm" role="form" action="" onsubmit="return false">
				<div id="ChatMessageFormLine1">
					<select id="ChatMessageCharacter" class="form-control input-sm" name="ChatMessageCharacter"></select>
					<input id="ChatMessageName" class="form-control input-sm" name="ChatMessageName" value="GM" placeholder="<?php echo __('Name'); ?>">
					<input id="ChatMessageMessage" class="form-control input-sm" type="ChatMessageMessage" placeholder="<?php echo __('Message'); ?>">
					<div class="hidden-xs">
						<input type="submit" id="ChatMessageSubmit" class="btn btn-primary form-control input-sm btn-sm " value="<?echo __('Submit'); ?>">
					</div>
				</div>
				<div id="ChatMessageFormLine2" class="visible-xs">
					<input type="submit" id="ChatMessageSubmitSm" class="btn btn-primary form-control input-sm btn-sm" value="<?echo __('Submit'); ?>">
				</div>
			</form>
		</div> <!-- page -->
	</div> <!-- pages -->

	<div class="modal fade" id="CreateRoomModal" tabindex="-1" role="dialog" aria-labelledby="CreateRoomModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<form action="" onsubmit="return false;">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="CreateRoomModalLabel"><?php echo __('Create Room')?></h4>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label for="CreateRoomName"><?php echo __('Name'); ?></label>
							<input class="form-control" type="text" id="CreateRoomName" name="name">
						</div>
						<div class="form-group">
							<label for="CreateRoomGameType"><?php echo __('Game Type'); ?></label>
							<select class="form-control" id="CreateRoomGameType" name="game_type">
								<option value="sword_world2"><?php echo __('Sword World 2.0'); ?></option>
								<option value="kancolle"><?php echo __('Kancolle RPG'); ?></option>
							</select>
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary" id="CreateRoomCreate"><?php echo __('Create'); ?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
					</div>
				</form>
			</div>
		</div>
	</div><!-- modal -->

	<div class="modal fade" id="AddCharacterModal" tabindex="-1" role="dialog" aria-labelledby="AddCharacterModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<form id="AddCharacterForm" onsubmit="return false;">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="AddCharacterModalLabel"><?php echo __('Add Character')?></h4>
					</div>
					<div class="modal-body">
						<select class="form-control" id="AddCharacterCharacter" name="character_id">
						</select>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary" id="AddCharacterButton"><?php echo __('Add'); ?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
					</div>
				</form>
			</div>
		</div>
	</div><!-- modal -->

	<div class="modal fade" id="AddNPCModal" tabindex="-1" role="dialog" aria-labelledby="AddNPCModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<form id="AddNPCForm" onsubmit="return false;">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="AddNPCModalLabel"><?php echo __('Add NPC')?></h4>
					</div>
					<div class="modal-body">
						<input type="text" class="form-control" id="AddNPCName" name="name">
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary" id="AddNPCButton"><?php echo __('Add'); ?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
					</div>
				</form>
			</div>
		</div>
	</div><!-- modal -->

	<div class="modal fade" id="CharacterInstanceModal" tabindex="-1" role="dialog" aria-labelledby="CharacterInstanceModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<form id="CharacterInstanceForm" onsubmit="return false;">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="CharacterInstanceModalLabel"></h4>
					</div>
					<div class="modal-body">
						<input type="hidden" id="CharacterInstanceFormId" name="id">
						<div class="parameters">
						</div>
						<div class="form-group">
							<label for="CharacterInstanceFormMemo"><?php echo __('Memo'); ?></label>
							<input class="form-control" type="text" id="CharacterInstanceFormMemo" name="memo">
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary" id="CharacterInstanceSave"><?php echo __('Save'); ?></button>
						<button type="button" class="btn btn-danger" id="CharacterInstanceRemove"><?php echo __('Remove'); ?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
					</div>
				</form>
			</div>
		</div>
	</div><!-- modal -->

	<div class="modal fade" id="NPCInstanceModal" tabindex="-1" role="dialog" aria-labelledby="NPCInstanceModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<form id="NPCInstanceForm" onsubmit="return false;">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="NPCInstanceModalLabel"></h4>
					</div>
					<div class="modal-body">
						<input type="hidden" id="NPCInstanceFormId" name="id">
						<div class="form-group">
							<label for="NPCInstanceFormName"><?php echo __('Name'); ?></label>
							<input class="form-control" type="text" id="CharacterInstanceFormName" name="name">
						</div>
						<div class="parameters">
						</div>
						<div class="form-group">
							<label for="NPCInstanceFormMemo"><?php echo __('Memo'); ?></label>
							<input class="form-control" type="text" id="CharacterInstanceFormMemo" name="memo">
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary" id="NPCInstanceSave"><?php echo __('Save'); ?></button>
						<button type="button" class="btn btn-danger" id="NPCInstanceRemove"><?php echo __('Remove'); ?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
					</div>
				</form>
			</div>
		</div>
	</div><!-- modal -->

	<div class="modal fade" id="EditRoomModal" tabindex="-1" role="dialog" aria-labelledby="EditRoomModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<form id="EditRoomForm" onsubmit="return false;">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="EditRoomModalLabel"><?php echo __('Edit Room'); ?></h4>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label for="RoomName"><?php echo __('Name'); ?></label>
							<input class="form-control" type="text" id="RoomName" name="name">
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary" id="EditRoomSave"><?php echo __('Save'); ?></button>
						<button type="button" class="btn btn-danger" id="EditRoomRemove" disabled><?php echo __('Remove'); ?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
					</div>
				</form>
			</div>
		</div>
	</div><!-- modal -->

	<div class="modal fade" id="EditMapModal" tabindex="-1" role="dialog" aria-labelledby="EditMapModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<form id="EditMapForm" onsubmit="return false;">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="EditMapModalLabel"><?php echo __('Edit Map'); ?></h4>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label for="MapWidth"><?php echo __('MapWidth'); ?></label>
							<input class="form-control" type="number" id="MapWidth" name="map_width">
						</div>
						<div class="form-group">
							<label for="MapHeight"><?php echo __('MapHeight'); ?></label>
							<input class="form-control" type="number" id="MapHeight" name="map_height">
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary" id="EditMapSave"><?php echo __('Save'); ?></button>
						<button type="button" class="btn btn-success" id="EditMapUpload" data-toggle="modal" data-target="#UploadMapImageModal"><?php echo __('Upload Image'); ?></button>
						<button type="button" class="btn btn-danger" id="EditMapRemoveImage" disabled><?php echo __('Remove Image'); ?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
					</div>
				</form>
			</div>
		</div>
	</div><!-- modal -->

	<div class="modal fade" id="UploadMapImageModal" tabindex="-1" role="dialog" aria-labelledby="UploadMapImageModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="UploadMapImageModalLabel"><?php echo __('Upload Map Image'); ?></h4>
				</div>
				<div class="modal-body" data-upload="<?php echo $this->Html->url(array('controller' => 'rooms', 'action' => 'upload_image')); ?>">
					<?php echo __('Drag and drop to upload image.'); ?>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo __('Cancel'); ?></button>
				</div>
			</form>
		</div>
	</div>
</div><!-- modal -->
</div>
