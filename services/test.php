<?php namespace Comodojo\Dispatcher\Service;

use \Comodojo\Dispatcher\Template\TemplateBootstrap;

class test extends Service {
    
    // private $available_themes = array(
    //     "amelia", "cerulean", "cosmo", "custom", "cyborg", "darkly",
    //     "default", "flatly", "journal", "lumen", "readable", "simplex",
    //     "slate", "spacelab", "superhero", "united", "yeti"
    // );

    public function setup() {

        $this->setContentType("text/html");

        // $this->likes("GET",array("theme"));

    }

    public function get() {

        // $attributes = $this->getAttributes();

        // if ( isset($attributes['theme']) ) $theme = in_array($attributes['theme'], $this->available_themes) ? $attributes['theme'] : "default";
        // else $theme = "default";

        $theme = "default";

        $template = new TemplateBootstrap("dash", $theme);

        if ( DISPATCHER_USE_REWRITE ) {

            $test_link  = DISPATCHER_BASEURL.'test/';

            $about_link = DISPATCHER_BASEURL.'about/';

        } else {

            $test_link  = DISPATCHER_BASEURL.'?service=test';

            $about_link = DISPATCHER_BASEURL.'?service=about';

        }

        $template->setTitle("Comodojo dispatcher")->setBrand("comodojo::dispatcher");

        $template->addMenu("right")
                 ->addMenuItem("Test", $test_link, "right")
                 ->addMenuItem("About", $about_link, "right");

        $template->setContent("<h1>Test content here</h1>");

        $template->addScript(DISPATCHER_BASEURL."vendor/comodojo/dispatcher.servicebundle.test/resources/js/dispatcher.test.js?".microtime());

        $template->addScript(DISPATCHER_BASEURL."vendor/comodojo/dispatcher.servicebundle.test/resources/js/dispatcher.working.mode.js.php?rw=".(DISPATCHER_USE_REWRITE ? '1' : '0').'&'.microtime());

        return $template->serialize();

    }

}