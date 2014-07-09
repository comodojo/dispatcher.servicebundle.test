<?php namespace comodojo\Dispatcher\Service;

class test_exception extends service {
	
	public function get() {

		throw new \comodojo\Exception\DispatcherException("Error Processing Request", 400);

	}

}

?>