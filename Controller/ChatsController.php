<?php
	App::uses('AppModel', 'Model');
	App::uses('User', 'Model');

	class ChatsController extends ChatAppController {
		public $uses = ['Chat.Room'];
		public $paginate = [
		'limit' => 100,
		];

		function chat() {
			$this->layout = 'Chat.chat';
			$this->set('user_id', User::getLoginId());
		}

		function chat_dev() {
			$this->layout = 'Chat.chat';
			$this->set('user_id', User::getLoginId());
		}
		function chat_test() {
			return $this->chat_dev();
		}

		function chat_mock() {
			return $this->chat_dev();
		}

		function index() {
			$this->set('rooms', $this->Room->find('all'));
		}

		function view($id = null) {
			$room = $this->Room->findById($id);
			if (!$room) {
				throw new NotFoundException;
			}

			$messages = $this->paginate('Chat.Message', ['room_id' => $id]);

			$this->set(compact('room', 'messages'));
		}
	}
