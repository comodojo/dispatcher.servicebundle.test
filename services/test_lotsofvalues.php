<?php namespace Comodojo\Dispatcher\Service;

class test_lotsofvalues extends Service {
    
    public function setup() {

        $this->expects("GET", Array("exp_1", "exp_2"));

        $this->likes("GET", Array("lik_1", "lik_2"));

        $this->expects("POST", Array(), Array("Lorem", "dolor", "amet", "adipisicing"));

        $this->likes("POST", Array(), Array("sed", "eiusmod", "incididunt"));

    }

    public function get() {

        return var_export($this->getAttributes(), true);

    }

    public function post() {

        return var_export($this->getParameters(), true);

    }

}