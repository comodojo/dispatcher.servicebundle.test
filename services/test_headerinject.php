<?php namespace comodojo\Dispatcher\Service;

class test_headerinject extends service {
	
	public function setup() {

		$this->setHeader("C-Inject-setup","foo");

	}

	public function get() {

		$this->setHeader("C-Inject-get","boo");

		return "This test service should inject two custom headers to response";

	}

}

?>