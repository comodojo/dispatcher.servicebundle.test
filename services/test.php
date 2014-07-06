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

		$template->addMenuItem("Test1", DISPATCHER_BASEURL."#test1/", "side");

		$template->addMenuItem("Test2", DISPATCHER_BASEURL."#test2/", "side");

		$template->setContent("<h1>Test content here</h1>");

		$template->addScript(DISPATCHER_BASEURL."vendor/comodojo/dispatcher.servicebundle.test/resources/js/jquery.history.js");

		$template->addScript(DISPATCHER_BASEURL."vendor/comodojo/dispatcher.servicebundle.test/resources/js/dispatcher.test.js");

		return $template->serialize();

	}

}

?>