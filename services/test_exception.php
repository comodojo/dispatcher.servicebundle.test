<?php namespace Comodojo\Dispatcher\Service;

class test_exception extends Service {
    
    public function get() {

        throw new \Comodojo\Exception\DispatcherException("Error Processing Request", 400);

    }

}