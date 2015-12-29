<?php
	class RoomsController extends ChatAppController {
		public $components = array('RequestHandler', 'AjaxImage.AjaxImage');

		public function upload_image($id = null) {
			$filepath = App::pluginPath($this->plugin) . 'webroot/map_background/';
			$this->AjaxImage->upload_image($id, 'Room', 'Room.map_background_url', $this, array(
				'filepath' => $filepath,
				'url' => str_replace('/upload_image', '', Router::url(array(
					'plugin' => $this->plugin,
					'controller' => null,
					'map_background',
				))) . '/'
			));
		}
	}
