var dispatcher = {

	tests: {},

	totalUnitTests: 0,

	totalUnitTests_success: 0,

	totalUnitTests_fail: 0,

	loadTests: function() {

		var basepath = dispatcher.rewrite ? location.href.split("/test/") : location.href.split("?service=test");

		return $.getJSON( basepath[0]+"/vendor/comodojo/dispatcher.servicebundle.test/tests.json", {} );

	},

	publishTests: function() {

		var menu = '<ul class="nav nav-sidebar">';

		for (var i in dispatcher.tests) {
			
			menu += '<li id="menu_'+i+'"><a href="#'+i+'">'+dispatcher.tests[i].name+'</a></li>'

		};

		menu += '</ul>';

		$(".sidebar").html(menu);

	},

	isTestRegistered: function(test) {

		return typeof dispatcher.tests[test] == "object" ? true : false;

	},

	getTestPattern: function(test) {

		return dispatcher.tests[test];

	},

	getTestTarget: function(test) {

		var paths = window.location.pathname.split("/");

		var path = "/";

		if (dispatcher.rewrite) {

			for ( var i = 1; i < paths.length-2; i++ ) {

				path += paths[i]+"/";

			}

			return window.location.origin+path+test+"/";

		} else {

			for ( var i = 1; i < paths.length-1; i++ ) {

				path += paths[i]+"/";

			}

			return window.location.origin+path+"?service="+test;

		}

	},

	execCompare: function(test, pattern) {

		var target = dispatcher.getTestTarget(test);

		var method = typeof pattern.send.method == "string" ? pattern.send.method : 'GET';

		var content = typeof pattern.send.content != "undefined" ? pattern.send.content : null;

		var headers = typeof pattern.send.headers == "object" ? pattern.send.headers : {};

		dispatcher.execCompareTrigger(target, method, content, headers, pattern);

	},

	execMultiCompare: function(test, pattern) {

		var target = dispatcher.getTestTarget(test);

		var t, method, content, headers;

		for (var t in pattern.tests) {

			method = typeof pattern.tests[t].send.method == "string" ? pattern.tests[t].send.method : 'GET';

			content = typeof pattern.tests[t].send.content != "undefined" ? pattern.tests[t].send.content : null;

			headers = typeof pattern.tests[t].send.headers == "object" ? pattern.tests[t].send.headers : {};

			dispatcher.execCompareTrigger(target, method, content, headers, pattern.tests[t]);

		}

	},

	execCompareTrigger: function(target, method, content, headers, pattern) {

		var data, cdata = '', mymethod = method.toUpperCase();

		if ( mymethod == "GET" && typeof content == "object") {
			data = null;
			for (var i in content) {
				cdata += dispatcher.rewrite ? content[i]+'/' : '&'+i+"="+content[i];
			}
		}
		else {
			data = content;
		}

		$.ajax(target+cdata, {
			type: mymethod,
			data: data,
			headers: headers,
			async: false,
		}).done(function(data, textStatus, jqXHR) {

			dispatcher.parseResult(jqXHR, pattern);

		}).fail(function(jqXHR, textStatus, errorThrown) {

			dispatcher.parseResult(jqXHR, pattern);

		});

	}, 

	execPerformance: function(test, pattern) {

		var times = typeof pattern.times == "number" ? pattern.times : 3;

		var delay = typeof pattern.times == "number" ? pattern.delay : 500;

		var iter = 1;

		$(".main").append('<table class="table table-striped" id="performance_'+test+'"><thead><tr><th>#</th><th>Request Elaboration Time (sec)</th><th>Routing Time (sec)</th><th>Service Exec Time (sec)</th><th>Total Time (sec)</th></tr></thead><tbody></tbody></table>');

		dispatcher.totalUnitTests += times;

		dispatcher.execPerformanceTrigger(times+1, iter, delay, pattern, test);

	},

	execPerformanceTrigger: function(times, iter, delay, pattern, test) {

		times = times-1;

		if ( times == 0 ) {

			dispatcher.testReport();

			return;

		}

		var target = dispatcher.getTestTarget(test);

		var method = typeof pattern.send.method == "string" ? pattern.send.method : 'GET';

		var content = typeof pattern.send.content != "undefined" ? pattern.send.content : null;

		var headers = typeof pattern.send.headers == "object" ? pattern.send.headers : {};

		var data, cdata = '', mymethod = method.toUpperCase();

		if ( dispatcher.rewrite && mymethod == "GET" && typeof content == "object") {
			data = null;
			for (var i in content) {
				cdata += content[i]+'/';
			}
		}
		else {
			data = content;
		}

		$.ajax(target+cdata, {
			type: mymethod,
			data: data,
			headers: headers,
			async: false,
		}).done(function(data, textStatus, jqXHR) {

			if ( $('#performance_'+test).is("table") ) {

				dispatcher.parsePerformance(jqXHR, iter, test);

				dispatcher.totalUnitTests_success += 1;

				setTimeout(function() {

					dispatcher.execPerformanceTrigger(times, iter+1, delay, pattern, test);

				}, delay);

			}
			

		}).fail(function(jqXHR, textStatus, errorThrown) {

			if ( $('#performance_'+test).is("table") ) {

				$('#performance_'+test+' > tbody:last').append('<tr><td colspan=5>Test Error: '+errorThrown+'</td></tr>');

				dispatcher.totalUnitTests_fail += 1;

			}

		});

	},

	execCall: function(test, pattern) {

		var target = dispatcher.getTestTarget(test);

		var method = typeof pattern.send.method == "string" ? pattern.send.method : 'GET';

		var content = typeof pattern.send.content != "undefined" ? pattern.send.content : null;

		var headers = typeof pattern.send.headers == "object" ? pattern.send.headers : {};

		dispatcher.totalUnitTests = 1;

		dispatcher.execCallTrigger(target, method, content, headers, test);

	},

	execMultiCall: function(test, patterm) {

		var target = dispatcher.getTestTarget(test);

		var t, method, content, headers;

		for (var t in pattern.tests) {

			method = typeof pattern.tests[t].send.method == "string" ? pattern.tests[t].send.method : 'GET';

			content = typeof pattern.tests[t].send.content != "undefined" ? pattern.tests[t].send.content : null;

			headers = typeof pattern.tests[t].send.headers == "object" ? pattern.tests[t].send.headers : {};

			dispatcher.totalUnitTests += 1;

			dispatcher.execCallTrigger(target, method, content, headers, test);

		}

	},

	execCallTrigger: function(target, method, content, headers, test) {

		var data, cdata = '', mymethod = method.toUpperCase();

		if ( mymethod == "GET" && typeof content == "object") {
			data = null;
			for (var i in content) {
				cdata += dispatcher.rewrite ? content[i]+'/' : '&'+i+"="+content[i];
			}
		}
		else {
			data = content;
		}

		$.ajax(target+cdata, {
			type: mymethod,
			data: data,
			headers: headers,
			async: false,
		}).done(function(data, textStatus, jqXHR) {

			dispatcher.parseCall(jqXHR, test, true);

		}).fail(function(jqXHR, textStatus, errorThrown) {

			dispatcher.parseCall(jqXHR, test, false);

		});

	},

	parseResult: function(xhr, pattern) {

		var completed = 0;

		var failed = 0;

		var total = 0;

		var rstatus, tstatus, tmessage;

		if ( typeof pattern.receive.status == "number" ) {

			total++;

			rstatus = xhr.statusCode().status;

			if ( rstatus == pattern.receive.status ) {

				completed++;

				dispatcher.reportTestComponent(true, "Response HTTP status code should be <code>"+pattern.receive.status+"</code", rstatus);

			}
			else {

				failed++;

				dispatcher.reportTestComponent(false, "Response HTTP status code should be <code>"+pattern.receive.status+"</code", rstatus);

			}

		}

		if ( typeof pattern.receive.headers == "object" ) {

			for (var i=0; i < pattern.receive.headers.length; i++) {

				total++;

				var hvalue = xhr.getResponseHeader(pattern.receive.headers[i].header);

				if ( hvalue == pattern.receive.headers[i].value ) {

					completed++;

					rstatus = pattern.receive.headers[i].header+": "+hvalue;

					dispatcher.reportTestComponent(true, "Response should contain header <code>"+pattern.receive.headers[i].header+"</code> with value <code>"+pattern.receive.headers[i].value+"</code>", rstatus);

				}
				else {

					failed++;

					rstatus = hvalue == null ? "header not defined" : pattern.receive.headers[i].header+": "+hvalue;

					dispatcher.reportTestComponent(false, "Response should contain header <code>"+pattern.receive.headers[i].header+"</code> with value <code>"+pattern.receive.headers[i].value+"</code>", rstatus);

				}

			}

		}

		if ( typeof pattern.receive.response == "object" ) {

			for (var i=0; i < pattern.receive.response.length; i++) {

				total++;

				var content = xhr.statusCode().responseText;

				switch (pattern.receive.response[i].rule) {

					case "match":
						tmessage = "Response should match <code>"+pattern.receive.response[i].content+"</code>";
						tstatus = content == pattern.receive.response[i].content ? true : false;
						rstatus = content;
						break;

					case "!match":
						tmessage = "Response should not match <code>"+pattern.receive.response[i].content+"</code>";
						tstatus = content == pattern.receive.response[i].content ? false : true;
						rstatus = content;
						break;

					case "contain":
						tmessage = "Response should contain <code>"+pattern.receive.response[i].content+"</code>";
						tstatus = content.indexOf(pattern.receive.response[i].content) == -1 ? false : true;
						rstatus = content;
						break;

					case "!contain":
						tmessage = "Response should not contain <code>"+pattern.receive.response[i].content+"</code>";
						tstatus = content.indexOf(pattern.receive.response[i].content) == -1 ? true : false;
						rstatus = content;
						break;

				}				

				if ( tstatus ) {

					completed++;

					dispatcher.reportTestComponent(true, tmessage, rstatus);

				}
				else {

					failed++;

					dispatcher.reportTestComponent(false, tmessage, rstatus);

				}

			}

		}

		dispatcher.totalUnitTests += total;
		dispatcher.totalUnitTests_success += completed;
		dispatcher.totalUnitTests_fail += failed;

	},

	parsePerformance: function(xhr, iter, test) {

		var request = xhr.getResponseHeader("D-Request-Sec");

		var route = xhr.getResponseHeader("D-Route-Sec");

		var result = xhr.getResponseHeader("D-Result-Sec");

		var total = xhr.getResponseHeader("D-Total-Sec");

		$('#performance_'+test+' > tbody:last').append('<tr><td>'+iter+'</td><td>'+parseFloat(request).toFixed(6)+'</td><td>'+parseFloat(route).toFixed(6)+'</td><td>'+parseFloat(result).toFixed(6)+'</td><td>'+parseFloat(total).toFixed(6)+'</td></tr>');

	},

	parseCall: function(xhr, test, success) {

		var rstatus = xhr.statusCode().status;

		var content = xhr.statusCode().responseText;

		if (success) {

			dispatcher.totalUnitTests_success += 1;

		}
		else {

			dispatcher.totalUnitTests_fail += 1;

		}

		$(".main").append('<p>Test call: <mark>'+test+'</mark></p>');

		$(".main").append('<div class="bs-callout bs-callout-'+(success ? 'success' : 'danger')+'"><span class="glyphicon glyphicon-'+(success ? 'ok' : 'remove')+'" style="float:right;"></span><h4>Test result</h4><code>'+content+'</code></div></div>');

	},

	routeTest: function(test) {

		dispatcher.totalUnitTests = 0;

		dispatcher.totalUnitTests_success = 0;

		dispatcher.totalUnitTests_fail = 0;

		if ( dispatcher.isTestRegistered(test) ) {

			pattern = dispatcher.getTestPattern(test);

			$(".main").html('<h1 class="page-header">Testing: <span style="italic">'+test+'</span></h1><h3><small>'+pattern.description+'</small></h3>');

			switch (pattern.type) {

				case "compare":

					dispatcher.execCompare(test, pattern);

					dispatcher.testReport();

					break;

				case "multicompare":

					dispatcher.execMultiCompare(test, pattern);

					dispatcher.testReport();

					break;

				case "call":

					dispatcher.execCall(test, pattern);

					dispatcher.testReport();

					break;

				case "multicall":

					dispatcher.execMultiCall(test, pattern);

					dispatcher.testReport();

					break;

				case "performance":

					dispatcher.execPerformance(test, pattern);

					break;

				default:

					$(".main").html("<h3>Test not runnable (wrong type)</h3>");

					break;

			}

		}
		else {

			$(".main").html("<h3>Test not found</h3>");

		}

	},

	reportTestComponent: function(result, message, report) {

		$(".main").append('<p>Test case: <mark>'+message+'</mark></p>');

		$(".main").append('<div class="bs-callout bs-callout-'+(result ? 'success' : 'danger')+'"><span class="glyphicon glyphicon-'+(result ? 'ok' : 'remove')+'" style="float:right;"></span><h4>Test result</h4><code>'+report+'</code></div></div>');

	},

	testReport: function() {

		var completed = dispatcher.totalUnitTests_success, failed = dispatcher.totalUnitTests_fail, total = dispatcher.totalUnitTests;

		$(".main").append('<div class="row placeholders">');

		if ( completed == total ) {

			$(".main").append('<blockquote class="bg-success"><p>All tests completed!</p><footer>Completed: '+completed+'</footer><footer>Failed: '+failed+'</footer><footer>Total: '+total+'</footer></blockquote>');

		}
		else if ( failed == total ) {

			$(".main").append('<div class="bg-danger"><p>All tests failed<p><ul><li>Completed: '+completed+'</li><li>Failed: '+failed+'</li><li>Total: '+total+'</li></ul></div>');

		}
		else {

			$(".main").append('<div class="bg-warning"><p>Some tests failed<p><ul><li>Completed: '+completed+'</li><li>Failed: '+failed+'</li><li>Total: '+total+'</li></ul></div>');

		}

		$(".main").append('</div>');

	}

};

$(function(){

	if (!window.location.origin) {
		window.location.origin = window.location.protocol+"//"+window.location.host;
	}

	dispatcher.loadTests().done( function( json ) {

		dispatcher.tests = json;

		dispatcher.publishTests();

		$("<style type='text/css'> .bs-callout { margin: 20px 0; padding: 15px 30px 15px 15px; border-left: 5px solid #eee; } .bs-callout h4 { margin-top: 0; } .bs-callout p:last-child { margin-bottom: 0; } .bs-callout code, .bs-callout .highlight { background-color: #fff; } .bs-callout-danger { background-color: #fcf2f2; border-color: #dFb5b4; } .bs-callout-warning { background-color: #fefbed; border-color: #f1e7bc; } .bs-callout-info { background-color: #f0f7fd; border-color: #d0e3f0; } .bs-callout-success { background-color: #f0f7fd; border-color: #3c763d; } </style>").appendTo("head");

		$('.nav-sidebar a').click(function(evt) {
		var target = evt.target.href;
		target = target.replace( /^[^#]*#?(.*)$/, '$1' );
		if ( target == "" ) {
			return;
		}
		else {
			dispatcher.routeTest(target);
		}
	});

	}).fail(function( jqxhr, textStatus, error ) {
		
		var err = textStatus + ", " + error;
		alert( "Error loading tests: " + err );

	});

});