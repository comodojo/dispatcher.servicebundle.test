<?php namespace comodojo\Dispatcher\Service;

class test_nocontent extends service {
	
	public function setup() {

		$this->setStatusCode(204);

	}

	public function get() {

	}

	public function put() {

		$this->setStatusCode(202);

	}

	public function post() {

	}

	public function delete() {

	}

}

?>