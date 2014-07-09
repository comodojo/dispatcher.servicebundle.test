<?php namespace comodojo\Dispatcher\Service;

class test_rawparameters extends service {
	
	public function setup() {

		$this->setContentType("text/html");

	}

	public function post() {

		return $this->getParameters(true);

	}

}

?>