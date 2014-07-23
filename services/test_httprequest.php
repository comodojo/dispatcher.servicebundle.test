<?php namespace Comodojo\Dispatcher\Service;

use Comodojo\Httprequest\Httprequest;

class test_httprequest extends Service {
    
    public function setup() {

    }

    public function get() {

    	$logger = $this->getLogger();

        $http = new Httprequest("https://maps.googleapis.com/maps/api/geocode/json?address=Piazza%20del%20Colosseo+Roma");

        $body = $http->setPort(443)->get();

        $header = $http->getReceivedHeaders();
        
        $logger->debug('Response headers', $header);

        return $body;

    }

}