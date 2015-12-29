<?php
	class Room extends ChatAppModel {
		public $belongsTo = array(
			'User',
			'GameType',
		);

		public $hasMany = array(
			'Chat.Message',
		);
	}
