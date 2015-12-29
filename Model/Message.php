<?php
	class Message extends ChatAppModel {
		public $belongsTo = array(
			'Chat.Room',
			'User',
			'GameType',
		);
	}
