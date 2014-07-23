<?php namespace Comodojo\Dispatcher\Service;

class test_headerinject extends Service {
    
    public function setup() {

        $this->setHeader("C-Inject-Setup","foo");

    }

    public function get() {

        $this->setHeader("C-Inject-Get","boo");

        return "This test service should inject two custom headers to response";

    }

}