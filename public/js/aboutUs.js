$(document).ready(function() {
	var x = $("body").css("width").toString();
	console.log(x);
	$(".video").css("width", x.split("px")[0] / 2 + "px");
	$(".video").css("height", x.split("px")[0] * 0.5 / 640 * 360 + "px");
	$( window ).resize(function() {
		var x = $("body").css("width").toString();
		$(".video").css("width", x.split("px")[0] / 2 + "px");
		$(".video").css("height", x.split("px")[0] * 0.5 / 640 * 360 + "px");
	});
})