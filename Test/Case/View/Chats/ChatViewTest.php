<?
App::uses('ChatsController', 'Chat.Controller');
App::uses('ChatAppController', 'Chat.Controller');
App::uses('View', 'View');

class ChatViewTest extends CakeTestCase {
	public function setUp() {
		parent::setUp();

		$request = $this->getMock('CakeRequest');
		$this->ChatsController = new ChatsController($request);
		$this->ChatsController->view = 'chat_dev';
		$this->ChatsController->layout = 'Chat.chat';
		$this->View = new View($this->ChatsController);
		$this->View->viewPath = '../Plugin/Chat/View/Chats';
	}

	public function tearDown() {
		parent::tearDown();
		unset($this->ChatView);
	}

	public function testChatContainer() {
	}
}
