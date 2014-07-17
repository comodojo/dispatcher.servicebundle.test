<?php namespace comodojo\Dispatcher\Service;

use comodojo\DispatcherLibrary\httprequest;

class test_httprequest extends service {
	
	public function setup() {

	}

	public function get() {

		$http = new httprequest("https://maps.googleapis.com/maps/api/geocode/json?address=Piazza%20del%20Colosseo+Roma");

		$return = $http->setPort(443)->get();

		$head = $http->getReceivedHeaders();

		\comodojo\Dispatcher\debug($head);

		return $return;

	}

}

?>