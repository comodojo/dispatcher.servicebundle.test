<?php namespace Comodojo\Dispatcher\Service;

class test_anymethod extends Service {
    
    public function setup() {

        $this->setContentType("application/json");

    }

    public function any() {

        $return = $this->test();

        return $this->serialize->toJson($return);

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