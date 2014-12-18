<?php namespace Comodojo\Dispatcher\Service;

class test_othermethods extends Service {
    
    public function options() {

        $methods = implode(",", $this->getImplementedMethods());

        $this->setHeader("Allow",$methods);

        $this->setHeader("Access-Control-Allow-Methods",$methods);

        $this->setHeader("Access-Control-Allow-Origin","*");

        $this->setHeader("Access-Control-Max-Age",1728000);

        return;

    }

    public function head() {

        $this->setHeader("Access-Control-Allow-Origin","*");

        return;

    }

}