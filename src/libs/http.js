const http = {
	get(url, success) {
		success = success || function() {};
		var p = new Promise(function(ok, fail) {
			let xhr = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveObject('Microsoft.XMLHTTP');
			xhr.open("GET", url);
			xhr.onreadystatechange = function() {
				if (xhr.readyState > 3) {
					if (xhr.status == 200) {
						success(xhr.responseText);
						ok(xhr.responseText);
					} else {
						fail(xhr);
					}
				}
			};

			xhr.setRequestHeader("X-Request-With", 'XMLHttpRequest');
			xhr.timeout = function(e) {
				fail(e);
			};

			xhr.send();
		}).catch((e) => {
			console.log(e);
		});
		return p;
	},
	post(url, data, success) {
		success = success || function() {};
		var p = new Promise(function(ok, fail) {
			let xhr = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveObject('Microsoft.XMLHTTP');
			xhr.open("POST", url);
			xhr.onreadystatechange = function() {
				if (xhr.readyState > 3) {
					if (xhr.status == 200) {
						success(xhr.responseText);
						ok(xhr.responseText);
					} else {
						fail(xhr);
					}
				}
			};

			xhr.setRequestHeader("X-Request-With", 'XMLHttpRequest');
			xhr.timeout = function(e) {
				fail(e);
			};

			xhr.send(JSON.stringify(data));
		})

		return p;
	}
}

export default http;