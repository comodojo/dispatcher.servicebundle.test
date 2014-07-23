<?php namespace Comodojo\Dispatcher\Service;

class test_rawparameters extends Service {
    
    public function setup() {

        $this->setContentType("text/html");

    }

    public function post() {

        return $this->getParameters(true);

    }

}