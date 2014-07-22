<?php namespace Comodojo\Dispatcher\Service;

use Comodojo\Httprequest\Httprequest;

class test_httprequest extends service {
    
    public function setup() {

    }

    public function get() {

    	$logger = $this->getLogger();

        $http = new Httprequest("https://maps.googleapis.com/maps/api/geocode/json?address=Piazza%20del%20Colosseo+Roma");

        $return = $http->setPort(443)->get();

        $head = $http->getReceivedHeaders();

        $logger->debug('Received headers',$head);

        return $return;

    }

}