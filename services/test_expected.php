<?php namespace comodojo\Dispatcher\Service;

class test_expected extends service {
	
	public function setup() {

		$this->expects("GET", Array("foo", "bar"));

		$this->expects("POST", Array(), Array("baz", "taz"));

	}

	public function get() {

		return "Intresting conversation using GET";

	}

	public function post() {

		return "Intresting conversation using POST";

	}

}

?>