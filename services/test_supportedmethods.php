<?php namespace Comodojo\Dispatcher\Service;

class test_supportedmethods extends Service {
    
    public function setup() {

        $this->setSupportedMethods("DELETE");

    }

    public function delete() {

        return "DELETE method supported";

    }

}