<?php namespace Comodojo\Dispatcher\Service;

class test_cache extends Service {
    
    public function setup() {

        $this->setContentType("application/json");

    }

    public function any() {

        $return = $this->test();

        sleep(2);

        return $this->serialize->toJSON($return);

    }

    private function test() {

        return Array(
            "METHOD"        =>  "ANY",
            "HTTPMETHOD"    =>  $_SERVER['REQUEST_METHOD'],
            "ATTRIBUTES"    =>  $this->getAttributes(),
            "PARAMETERS"    =>  $this->getParameters()
        );

    }

}