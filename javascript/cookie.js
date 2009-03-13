/* --------------------------------------------------------------------------------
 * Cookies
 * -------------------------------------------------------------------------------- */

var Cookies = {
	create: function(name, value, days) {
		var string = name + "=" + escape (value);
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			string += "; expires=" + date.toGMTString();
		}
		document.cookie = string + "; path=/";
	},

	read: function(name) {
		var nameEQ = name + "=";
		return unescape ((document.cookie.split(/;\s*/).detect(function(cookie) {
			return (cookie.indexOf(nameEQ) == 0);
		}) || "").substr(nameEQ.length));
	},

	exists: function(name) {
		return this.read(name) !== "";
	}
};