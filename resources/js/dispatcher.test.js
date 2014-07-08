var dispatcher = {

	tests: {},

	loadTests: function() {

	},

	publishTests: function() {

		var menu = '<ul class="nav nav-sidebar">';

		for (var i in dispatcher.tests) {
			
			menu += '<li id="menu_'+i+'"><a href="#'+i+'">'+dispatcher.tests[i].description+'</a></li>'

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

	execTest: function(test, pattern) {

		var paths = window.location.pathname.split("/");

		var path = "/";

		for ( var i = 1; i < paths.length-2; i++ ) {

			path += paths[i]+"/";

		}

		var target = window.location.origin+path+test+"/";

		var method = typeof pattern.send.method == "string" ? pattern.send.method : 'GET';

		var content = typeof pattern.send.content != "undefined" ? pattern.send.content : null;

		var headers = typeof pattern.send.headers == "object" ? pattern.send.headers : {};

		var myCall = $.ajax(target, {
			type: method,
			data: content,
			headers: headers
		}).done(function(data, textStatus, jqXHR) {

			dispatcher.parseResult(jqXHR, pattern);

		}).fail(function(jqXHR, textStatus, errorThrown) {

			dispatcher.parseResult(jqXHR, pattern);

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

		dispatcher.reportTestComplete(completed, failed, total);

	},

	execPerformance: function(test, pattern) {

		var times = typeof pattern.times == "number" ? pattern.times : 3;

		var delay = typeof pattern.times == "number" ? pattern.delay : 500;

		var iter = 1;

		$(".main").append('<table class="table table-striped" id="performance_'+test+'"><thead><tr><th>#</th><th>Request Elaboration Time (sec)</th><th>Routing Time (sec)</th><th>Service Exec Time (sec)</th><th>Total Time (sec)</th></tr></thead><tbody></tbody></table>');

		dispatcher.execPerformanceTrigger(times+1, iter, delay, pattern, test);

	},

	execPerformanceTrigger: function(times, iter, delay, pattern, test) {

		times = times-1;

		if ( times == 0 ) {

			return;

		}

		var paths = window.location.pathname.split("/");

		var path = "/";

		for ( var i = 1; i < paths.length-2; i++ ) {

			path += paths[i]+"/";

		}

		var target = window.location.origin+path+test+"/";

		var method = typeof pattern.send.method == "string" ? pattern.send.method : 'GET';

		var content = typeof pattern.send.content != "undefined" ? pattern.send.content : null;

		var headers = typeof pattern.send.headers == "object" ? pattern.send.headers : {};

		var myCall = $.ajax(target, {
			type: method,
			data: content,
			headers: headers
		}).done(function(data, textStatus, jqXHR) {

			if ( $('#performance_'+test).is("table") ) {

				dispatcher.parsePerformance(jqXHR, iter, test);

				setTimeout(function() {

					dispatcher.execPerformanceTrigger(times, iter+1, delay, pattern, test);

				}, delay);

			}
			

		}).fail(function(jqXHR, textStatus, errorThrown) {

			if ( $('#performance_'+test).is("table") ) {

				$('#performance_'+test+' > tbody:last').append('<tr><td colspan=5>Test Error: '+errorThrown+'</td></tr>');

			}

		});

	},

	parsePerformance: function(xhr, iter, test) {

		var request = xhr.getResponseHeader("D-Request-sec");

		var route = xhr.getResponseHeader("D-Route-sec");

		var result = xhr.getResponseHeader("D-Result-sec");

		var total = xhr.getResponseHeader("D-Total-sec");

		$('#performance_'+test+' > tbody:last').append('<tr><td>'+iter+'</td><td>'+parseFloat(request).toFixed(6)+'</td><td>'+parseFloat(route).toFixed(6)+'</td><td>'+parseFloat(result).toFixed(6)+'</td><td>'+parseFloat(total).toFixed(6)+'</td></tr>');

	},

	routeTest: function(test) {

		if ( dispatcher.isTestRegistered(test) ) {

			pattern = dispatcher.getTestPattern(test);

			$(".main").html('<h1 class="page-header">Testing: <span style="italic">'+test+'</span></h1><h3><small>'+pattern.description+'</small></h3>');

			if ( pattern.type == "performance" ) {

				dispatcher.execPerformance(test, pattern);

			}
			else if ( pattern.type == "multitest" ) {

			}
			else {

				dispatcher.execTest(test, pattern);

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

	reportTestComplete: function(completed, failed, total) {

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

	dispatcher.publishTests();

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

	if (!window.location.origin) {
		window.location.origin = window.location.protocol+"//"+window.location.host;
	}

	$("<style type='text/css'> .bs-callout { margin: 20px 0; padding: 15px 30px 15px 15px; border-left: 5px solid #eee; } .bs-callout h4 { margin-top: 0; } .bs-callout p:last-child { margin-bottom: 0; } .bs-callout code, .bs-callout .highlight { background-color: #fff; } .bs-callout-danger { background-color: #fcf2f2; border-color: #dFb5b4; } .bs-callout-warning { background-color: #fefbed; border-color: #f1e7bc; } .bs-callout-info { background-color: #f0f7fd; border-color: #d0e3f0; } .bs-callout-success { background-color: #f0f7fd; border-color: #3c763d; } </style>").appendTo("head");

});