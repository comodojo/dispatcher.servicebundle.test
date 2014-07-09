<?php namespace comodojo\Dispatcher\Service;

class test_supportedmethods extends service {
	
	public function setup() {

		$this->setSupportedMethods("DELETE");

	}

	public function delete() {

		return "DELETE method supported";

	}

}

?>