<?php namespace Comodojo\Dispatcher\Service;

class test_serialization extends Service {
    
    public function setup() {

        $this->likes('GET',array('format'));

    }

    public function get() {

        $format = $this->getAttribute("format");

        $result = array(
            "METHOD"        =>  $method,
            "HTTPMETHOD"    =>  $_SERVER['REQUEST_METHOD'],
            "ATTRIBUTES"    =>  $this->getAttributes(),
            "PARAMETERS"    =>  $this->getParameters()
        );

        switch (strtoupper($format)) {

            case 'DUMP':
                
                $return = $this->serialize->toDump($result);

                break;

            case 'EXPORT':
                
                $return = $this->serialize->toExport($result);

                break;

            case 'XML':

                $this->setContentType("application/xml");

                $return = $this->serialize->toXml($result, true);

                break;

            case 'YAML':

                $this->setContentType("application/yaml");

                $return = $this->serialize->toYaml($result, true);

                break;
            
            default:

                $this->setContentType("application/json");

                $return = $this->serialize->toJson($result);

                break;

        }

        return $return;

    }

}
