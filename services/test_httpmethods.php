<?php namespace Comodojo\Dispatcher\Service;

class test_httpmethods extends Service {
    
    public function setup() {

        $this->setContentType("application/json");

    }

    public function get() {

        $return = $this->test('GET');

        return $this->serialize->toJson($return);

    }

    public function put() {

        $return = $this->test('PUT');

        return $this->serialize->toJson($return);

    }

    public function post() {

        $return = $this->test('POST');

        return $this->serialize->toJson($return);

    }

    public function delete() {

        $return = $this->test('DELETE');

        return $this->serialize->toJson($return);

    }

    private function test($method) {

        return Array(
            "METHOD"        =>  $method,
            "HTTPMETHOD"    =>  $_SERVER['REQUEST_METHOD'],
            "ATTRIBUTES"    =>  $this->getAttributes(),
            "PARAMETERS"    =>  $this->getParameters()
        );

    }

}