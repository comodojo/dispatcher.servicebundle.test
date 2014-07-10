<?php namespace comodojo\Dispatcher\Service;

class test_liked extends service {
	
	public function setup() {

		$this->likes("GET", Array("foo", "bar"));

		$this->likes("POST", Array(), Array("baz", "taz"));

	}

	public function get() {

		return var_export($this->getAttributes(), true);

	}

	public function post() {

		return var_export($this->getParameters(), true);

	}

}

?>