<?php namespace comodojo\Dispatcher\Service;

use \comodojo\Dispatcher\Template\TemplateBootstrap;

class test extends service {
	
	public function setup() {

		$this->setContentType("text/html");

	}

	public function get() {

		$template = new TemplateBootstrap("dash");

		$template->setTitle("Comodojo dispatcher")->setBrand("comodojo/dispatcher");

		$template->addMenuItem("Test", DISPATCHER_BASEURL."test/");

		$template->addMenuItem("About", DISPATCHER_BASEURL."about/", "right");

		$template->setContent("<h1>Test content here</h1>");

		$template->addScript(DISPATCHER_BASEURL."vendor/comodojo/dispatcher.servicebundle.test/resources/js/dispatcher.test.js?".microtime());

		$template->addScript(DISPATCHER_BASEURL."vendor/comodojo/dispatcher.servicebundle.test/resources/js/dispatcher.working.mode.js.php?rw=".(DISPATCHER_USE_REWRITE ? '1' : '0').'&'.microtime());

		return $template->serialize();

	}

}

?>