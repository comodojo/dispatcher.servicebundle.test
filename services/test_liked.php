<?php namespace Comodojo\Dispatcher\Service;

class test_liked extends Service {
    
    public function setup() {

        $this->likes("GET", Array("foo", "bar"));

        $this->likes("POST", Array(), Array("baz", "taz"));

    }

    public function get() {

        $attributes =  $this->getAttributes();

        return empty($attributes) ? "Nothing to show here" : var_export($attributes, true);

    }

    public function post() {

        $parameters =  $this->getParameters();

        return empty($parameters) ? "Nothing to show here" : var_export($parameters, true);

    }

}