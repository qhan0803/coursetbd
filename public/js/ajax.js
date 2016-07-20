// navbar dropdown


var usedcolor = [];

$(document).ready(function() {
	$(".dropdown-toggle").dropdown();
});




function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

$(document).ready(function() {


$('#calendar').fullCalendar({
	header: {
				left: 'prev,next, today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
	defaultView: 'agendaWeek',
	views:{
		agendaDay:{			
			weekNumbers: false,
		},
	},
	eventClick: function(event) {
		var current_id = event.id;
		var data_id = current_id.split("-")[0];
		if (event.className == "single_course"){
			bind_course_detail(data_id);
		} 
		else if (event.className == "single_announce"){
			bind_announcement_detail(event);
		}
		else if (event.className == "single_event"){
			bind_event_detail(event);
		}
	},
	// eventMouseover: function( event, jsEvent, view ){
	// 	if (event.loc){
	// 		var addition = $("<div>"+" "+event.loc+"</div>");

	// 		addition.css("display","block");
	// 		if (event.className == "single_announce"){
	// 			addition.css("color","white")
	// 		}else{
	// 			addition.css("color","black")
	// 		}
	// 		$(this).append(addition);
	// 	}	
	// },
	// eventMouseout: function( event, jsEvent, view ){
		
	// 	$('#calendar').fullCalendar('updateEvent', event);
	// },
	height: window.innerHeight-75,
	timeFormat: 'h:mmt',
	allDaySlot: false,
	scrollTime: '08:00:00',

	weekNumbers: true,
	weekNumberCalculation:function(string){
		return (string-1454198400000)/604800000 + 1;
	},
	weekNumberTitle: 'Week ',
	eventRender: function(event){
		//method posted on StackOverflow
		 if (event.ranges){
				return (event.ranges.filter(function(range){ // test event against all the ranges

        	return (event.start.isBefore(range.end) &&
                event.end.isAfter(moment(range.start).subtract(1,'days')));

    			}).length)>0; //if it isn't in one of the ranges, don't render it (by returning false) //if it isn't in one of the ranges, don't render it (by returning false)
			}//if it isn't in one of the ranges, don't render it (by returning false)
		
		return true;
	},
	defaultTimedEventDuration: "00:30:00"
});

function Bind_Add_Accept_Reject_See() {
	$('.Add_friend_submit').click(function() {
		var now = $(this);
		$.ajax({
			url: '/Add_friend',
			data: {
				email: now.parent().attr('user_email')
			},
			type: 'GET',
			success: function(data) {
				var p = now.parent();
				var p2 = $("<div></div>");
				p2.text(data);
				now.detach();
				p.append(p2);
			},
			error: function(xhr, status, error) {
				console.log("Something Wrong");
			}

		})
	})
	$(".Accept_friend_submit").click(function() {
		var now = $(this);
		$.ajax({
			url: '/Accept_friend',
			data: {
				email: now.parent().attr('user_email')
			},
			type: 'GET',
			success: function(data) {
				now.parent().detach();
			},
			error: function(xhr, status, error) {
				console.log("Something Wrong");
			}
		})
	})
	$(".Reject_friend_submit").click(function() {
		var now = $(this);
		$.ajax({
			url: '/Reject_friend',
			data: {
				email: now.parent().attr('user_email')
			},
			type: 'GET',
			success: function(data) {
				now.parent().detach();
			},
			error: function(xhr, status, error) {
				console.log("Something Wrong");
			}
		})
	})
	$(".See_friend_courses").click(function() {
		var now = $(this);
		$.ajax({
			url: '/See_friend',
			data: {
				email: now.parent().attr('user_email')
			},
			type: 'GET',
			success: function(data) {
				var first = now.parent().attr('user_firstname')
				$(".element").remove();
				$(".noresult").remove();
				// console.log(data);
				var x = $("<div class = 'element friend_title'></div>");
				x.text(first + "'s Schedule");
				$(".sidebar_display").append(x);
				display_friendCal(data);
				display_data(data);
				$(".noresult").text("This friend does not have any courses");
			},
			error: function(xhr, status, error) {
				console.log("Something Wrong");
			}
		})
	})
}

function getColor(name) {
	// return "#000000";
	var color = 0;
	var ran = 0;
	for (var i = 0; i < name.length; i++)
		ran = ((ran * 13) + name[i].charCodeAt(0)) % 16777215;
	var find = false;

		for (var i in usedcolor)
			if (usedcolor[i].name == name) {
				find = true;
				color = usedcolor[i].red * 256 * 256 + usedcolor[i].green * 256 + usedcolor[i].blue;
			}
		if (!find) {
			while (true) {
				color = ran % 16777215;
				var r = Math.floor(color / (256 * 256)), g = Math.floor(color / 256) % 256, b = color % 256;
			

				// changed the font-color from black to dark blue. so 0 became 136.227.
				
				var ok = true;
				for (var i in usedcolor)
					if ((r - usedcolor[i].red) * (r - usedcolor[i].red) + (b - usedcolor[i].blue) * (b - usedcolor[i].blue) + (g - usedcolor[i].green) * (g - usedcolor[i].green) <= 600)
						ok = false;
				if (usedcolor.length > 20)
					ok = true;
				if (ok && r>150 && g>150 && b>150 )
				// if (.299*r + .587*g + .114*b > 160)
					break;

				ran = (ran * 13 + 19997) % 1000000007;
			}
			var r = Math.floor(color / (256 * 256)), g = Math.floor(color / 256) % 256, b = color % 256;
			var triplet = {
				"name": name,
				"red": r,
				"green": g,
				"blue": b
			};
			usedcolor.push(triplet);
		}
	color = color.toString(16);
	// var color = Math.floor(Math.random()*16777215).toString(16)
	while (color.length < 6)
		color = '0' + color;
	color = '#' + color;
	return color;
}

function add_course(data, course_section){
	for (var i = 0; i < 10; i++) {
		$('#calendar').fullCalendar('removeEvents', data.id + "-" + course_section+"-"+i );
	}
	
	var output = [];
	var count = 0;
	var has_EVE = false;
	var course_time = data.schedule[course_section];
	var course_type = data.schedule_type[course_section];
	var course_times = course_time.split(" ");
	var course_info = data.name.split(" ");
	var course_id = course_info[0];
	var course_loc = course_times[course_times.length-1];
	/* Remove eve */
	var time = course_times[0].replace(' EVE ','');
	/* Remove dots */
	time = time.replace('.','');
	var multitime = time.split(",");
	for (var num in multitime){
		var all_times = multitime[num].split("-");
		

		if (course_times[1].indexOf('EVE') !== -1){
			has_EVE = true;
			var separate = course_times[2].split("-");
			all_times[0] = all_times[0] + separate[0];
			all_times.push(separate[1]);
		}

		/* Separating strings to day and time */
		var letters = "QWERTYUIOPLKJHGFDSAZXCVBNM";
		var numbers = "";
		for (var i = 0; i < 10; i++) {
			numbers += i;
		}
		var time_days = "";
		var start_time = "";
		for (var i in all_times[0]){
			if (letters.indexOf(all_times[0][i]) !== -1){
				time_days += all_times[0][i];
			}
			if (numbers.indexOf(all_times[0][i]) !== -1){
				start_time += all_times[0][i];
			}
		}	
		function replacing(str, index, character) {
			return str.substr(0, index) + character + str.substr(index+character.length);
		}
		if (start_time.length>2){
			start_time = replacing(start_time,start_time.length-2,"5");
		}
		/* give the start time id */
		var start_ids = new Array();
		if (has_EVE){
			if (start_time.length>2){
				var x = Number(start_time) + 1200;
				start_time = x.toString();
			}
			else{
				var x = Number(start_time) + 12;
				start_time = x.toString();
			}
		}
		
		if (start_time.length>2){
			if (Number(start_time)<800){
				var x = Number(start_time) + 1200;
				start_time = x.toString();
			}
		}
		else{
			if (Number(start_time)<8){
				var x = Number(start_time) + 12;
				start_time = x.toString();
			}
		}

		for (var i in time_days){
			start_ids.push(time_days[i]+start_time);
		}

		/* Find out when the class ends */
		if (all_times.length>1){
			var end_time = all_times[1];
		}
		else if (start_time.length<3){
			var end_time = Number(start_time)+ 1;
			end_time = end_time.toString();
		}
		else{
			var end_time = Number(start_time) + 100;
			end_time = end_time.toString();
		}
		end_time = end_time.replace(".","");
		if (end_time.length>2){
			end_time = replacing(end_time,end_time.length-2,"5");
		}

		if (has_EVE){
			if (end_time.length>2){
				var x = Number(end_time) + 1200;
				end_time = x.toString();
			}
			else{
				var x = Number(end_time) + 12;
				end_time = x.toString();
			}
		}
		
		if (end_time.length>2){
			if (Number(end_time)<800){
				var x = Number(end_time) + 1200;
				end_time = x.toString();
			}
		}
		else{
			if (Number(end_time)<8){
				var x = Number(end_time) + 12;
				end_time = x.toString();
			}
		}

		//Formating for moment time format
		function convert_day_to_num(day){
			if (day == "M"){
				return 1;
			}
			else if (day == "T"){
				return 2;
			}
			else if (day == "W"){
				return 3;
			}
			else if (day == "R"){
				return 4;
			}
			else if (day == "F"){
				return 5;
			}
			else{
				return 0;
			}
		}
		var t_start, t_end, t_dow, t_id, t_title;
		var t_dow = new Array();

		if (start_time.length < 3){
			t_start = start_time + ":00";
		}
		else{
			len = start_time.length;
			start_time = replacing(start_time,start_time.length-2,"3");
			t_start = start_time.substring(0,len-2)+":"+start_time.substring(len-2);
		}
		if (end_time.length < 3){
			t_end = end_time + ":00";
		}
		else{
			len = end_time.length;
			end_time = replacing(end_time,end_time.length-2,"3");
			t_end = end_time.substring(0,len-2)+":"+end_time.substring(len-2);
		}

		for (var i in time_days){
			t_dow.push(convert_day_to_num(time_days[i]));
		}
		
		t_title = course_type.substring(0,3) + " " + course_id;
		t_id = data.id + "-" + course_section+"-"+count;
		count += 1;
		
		var color = getColor(data.name);
		

		//Make event objects
		t_course = {};
		t_course['id'] = t_id;
		t_course['className'] = "single_course";
		t_course['title']=t_title + "\n" +course_loc;
		t_course['start']=t_start;
		t_course['end'] = t_end;
		t_course['dow'] = t_dow;
		t_course['backgroundColor'] = color;
		t_course['textColor']="rgba(0,0,0,0.7019)";
		t_course['loc']=course_loc;
		t_course['borderColor'] = color;
		t_course['ranges'] = [];
		
		t_range = {};
		
		//Changing range for half-semester classes
		var s_ind,e_ind,s_ind_2;
		var sit1 = false;
		var sit2 = false;
		for (var x in course_times){
			if (course_times[x] == "(MEETS"){
				sit1 = true;
				s_ind = Number(x) + 1;
				e_ind = Number(x) + 3;
				
			}
			if (course_times[x] == "(ENDS"){
				sit2 = true;
				s_ind = Number(x) + 1;
				s_ind_2 = Number(x) +2;
			}

		}
		if (sit1){
			t_range['start']="2016/"+course_times[s_ind];
			var t_r_end = course_times[e_ind].substring(0,course_times[e_ind].length-1);
			real = (Number(t_r_end.charAt(t_r_end.length-1))+1).toString();
			t_r_end = replacing(t_r_end,t_r_end.length-1,real);
			t_range['end'] = "2016/"+ t_r_end;
		}
		else if (sit2){
			var t_r_end = (Number(course_times[s_ind_2].substring(0,course_times[s_ind_2].length-1))+1).toString();
			t_range['start'] = "2016-01-31";
			t_range['end'] = course_times[s_ind] + " " + t_r_end + " 2016";
		}
		else{
			//Normal start and end time
			t_range['start']="2016-01-31";
			t_range['end']="2016-05-12";
		}
		
		t_course['ranges'].push(t_range);
		output.push(t_course);
	}

	$('#calendar').fullCalendar('addEventSource',output);
}

function friend_add_course(data, course_section){
	for (var i = 0; i < 10; i++) {
		$('#friendCal').fullCalendar('removeEvents', data.id + "-" + course_section+"-"+i );
	}
	var output = [];
	var count = 0;
	var has_EVE = false;
	var course_time = data.schedule[course_section];
	var course_type = data.schedule_type[course_section];
	var course_times = course_time.split(" ");
	var course_info = data.name.split(" ");
	var course_id = course_info[0];
	var course_loc = course_times[course_times.length-1];
	/* Remove eve */
	var time = course_times[0].replace(' EVE ','');
	/* Remove dots */
	time = time.replace('.','');
	var multitime = time.split(",");
	for (var num in multitime){
		var all_times = multitime[num].split("-");
		

		if (course_times[1].indexOf('EVE') !== -1){
			has_EVE = true;
			var separate = course_times[2].split("-");
			all_times[0] = all_times[0] + separate[0];
			all_times.push(separate[1]);
		}

		/* Separating strings to day and time */
		var letters = "QWERTYUIOPLKJHGFDSAZXCVBNM";
		var numbers = "";
		for (var i = 0; i < 10; i++) {
			numbers += i;
		}
		var time_days = "";
		var start_time = "";
		for (var i in all_times[0]){
			if (letters.indexOf(all_times[0][i]) !== -1){
				time_days += all_times[0][i];
			}
			if (numbers.indexOf(all_times[0][i]) !== -1){
				start_time += all_times[0][i];
			}
		}	
		function replacing(str, index, character) {
			return str.substr(0, index) + character + str.substr(index+character.length);
		}
		if (start_time.length>2){
			start_time = replacing(start_time,start_time.length-2,"5");
		}
		/* give the start time id */
		var start_ids = new Array();
		if (has_EVE){
			if (start_time.length>2){
				var x = Number(start_time) + 1200;
				start_time = x.toString();
			}
			else{
				var x = Number(start_time) + 12;
				start_time = x.toString();
			}
		}
		
		if (start_time.length>2){
			if (Number(start_time)<800){
				var x = Number(start_time) + 1200;
				start_time = x.toString();
			}
		}
		else{
			if (Number(start_time)<8){
				var x = Number(start_time) + 12;
				start_time = x.toString();
			}
		}

		for (var i in time_days){
			start_ids.push(time_days[i]+start_time);
		}

		/* Find out when the class ends */
		if (all_times.length>1){
			var end_time = all_times[1];
		}
		else if (start_time.length<3){
			var end_time = Number(start_time)+ 1;
			end_time = end_time.toString();
		}
		else{
			var end_time = Number(start_time) + 100;
			end_time = end_time.toString();
		}
		end_time = end_time.replace(".","");
		if (end_time.length>2){
			end_time = replacing(end_time,end_time.length-2,"5");
		}

		if (has_EVE){
			if (end_time.length>2){
				var x = Number(end_time) + 1200;
				end_time = x.toString();
			}
			else{
				var x = Number(end_time) + 12;
				end_time = x.toString();
			}
		}
		
		if (end_time.length>2){
			if (Number(end_time)<800){
				var x = Number(end_time) + 1200;
				end_time = x.toString();
			}
		}
		else{
			if (Number(end_time)<8){
				var x = Number(end_time) + 12;
				end_time = x.toString();
			}
		}

		//Formating for moment time format
		function convert_day_to_num(day){
			if (day == "M"){
				return 1;
			}
			else if (day == "T"){
				return 2;
			}
			else if (day == "W"){
				return 3;
			}
			else if (day == "R"){
				return 4;
			}
			else if (day == "F"){
				return 5;
			}
			else{
				return 0;
			}
		}
		var t_start, t_end, t_dow, t_id, t_title;
		var t_dow = new Array();

		if (start_time.length < 3){
			t_start = start_time + ":00";
		}
		else{
			len = start_time.length;
			start_time = replacing(start_time,start_time.length-2,"3");
			t_start = start_time.substring(0,len-2)+":"+start_time.substring(len-2);
		}
		if (end_time.length < 3){
			t_end = end_time + ":00";
		}
		else{
			len = end_time.length;
			end_time = replacing(end_time,end_time.length-2,"3");
			t_end = end_time.substring(0,len-2)+":"+end_time.substring(len-2);
		}

		for (var i in time_days){
			t_dow.push(convert_day_to_num(time_days[i]));
		}
		
		t_title = course_type.substring(0,3) + " " + course_id;
		t_id = data.id + "-" + course_section+"-"+count;
		count += 1;
		
		var color = getColor(data.name);

		//Make event objects
		t_course = {};
		t_course['id'] = t_id;
		t_course['className'] = "friend_course";
		t_course['title']=t_title;
		t_course['start']=t_start;
		t_course['end'] = t_end;
		t_course['dow'] = t_dow;
		t_course['backgroundColor'] = color;
		t_course['textColor']="rgba(0,0,0,0.7019)";
		t_course['loc']=course_loc;
		t_course['borderColor'] = color;
		t_course['ranges'] = [];
		t_course['course'] = data.id;
		t_course['section'] = data.course_section;
		t_range = {};
		t_range['start']="2016-01-31";
		t_range['end']="2016-02-06";
		
		
		t_course['ranges'].push(t_range);
		output.push(t_course);
	}

	$('#friendCal').fullCalendar('addEventSource',output);
}

function add_event(data) {

	var custom = [];
	var c_a = {};
	var back_color = "#9b59b6";
	var c_dow = new Array();
	c_a['id'] = data._id;
	c_a['_id'] = data._id;
	c_a['title'] = data.title + "\n"+ data.location;
	c_a['start'] = data.time;
	c_a['className'] = "single_event";
	c_a['data'] = data;
	c_a['end'] = moment(data.time).add(data.duration,"minutes");
	if (data.duration < 30){
		c_a['end'] = moment(data.time).add(30,"minutes");
	}

	/*
	if(!data.duration || data.duration == 0){
		c_a['start'] = moment(data.time).subtract(30,"minutes");
		c_a['end'] = data.time;
	}
	*/
	c_a['loc']=data.location;
	c_a['des'] = data.description;
	c_a['textColor']="rgba(255,255,255,.92)";
	c_a['backgroundColor'] = back_color;
	c_a['borderColor'] = back_color;

	if (data.repeated == "true"){
		c_a['dow']=[moment(data.time).day()];
		c_a['ranges'] = [];
		var t_range = {};
		t_range['start']=moment(c_a['start']).format("YYYY")+"-"+moment(c_a['start']).format("MM")+"-"+moment(c_a['start']).format("DD");
		t_range['end']="2016-05-12";
		
		c_a['ranges'].push(t_range);
		c_a['start'] = moment(c_a['start']).format("HH:mm");
		c_a['end'] = moment(c_a['end']).format("HH:mm");
		var com_end = moment(c_a['end'],"HHmm");
		var com_start = moment(c_a['start'],"HHmm");

		 if (com_end.isBefore(com_start)){
		 	c_a['end'] = "23:59";
		 	window.alert("Please add overnight event separately for both days for repeated events");
			}
	}
	custom.push(c_a);
	// console.log(custom);
	$('#calendar').fullCalendar('addEventSource',custom);
}

function add_announcement(data) {
	// console.log(data);
	var t_announce = [];
	var t_a = {};
	var back_color;
	var t_dow = new Array();

	t_a['id'] = data._id;
	t_a['_id'] = data._id;
	t_a['title'] = data.course_id + " " + data.type + "\n"+ data.location;
	t_a['start'] = data.time;
	t_a['className'] = "single_announce";
	t_a['data'] = data;
	t_a['end'] = moment(data.time).add(data.duration,"minutes");
	if (data.duration < 30){
		t_a['end'] = moment(data.time).add(30,"minutes");
	}
	/*
	if(!data.duration || data.duration == 0){
		t_a['start'] = moment(data.time).subtract(30,"minutes");
		t_a['end'] = data.time;
	}
	*/
	t_a['loc']=data.location;
	t_a['des'] = data.description;
	t_a['TA'] = data.TA;
	t_a['textColor']="rgba(255,255,255,.92)";
	if (data.type == "Pset Due"){
		//Set Background Color
		back_color = "rgba(241, 196, 15,1.0)";
	}
	else if (data.type == "Office Hour"){
		back_color = "rgba(52, 152, 219,1.0)";
	}
	else if (data.type == "Review Session"){
		back_color = "rgba(211, 84, 0,1.0)";
	}
	else if (data.type == "Exam"){
		back_color = "rgba(231, 76, 60,1.0)";
	}
	t_a['backgroundColor'] = back_color;
	t_a['borderColor'] = back_color;
	t_a["r"]=data.repeated;
	if (data.repeated == "true"){
		t_a['dow']=[moment(data.time).day()];
		t_a['ranges'] = [];
		var t_range = {};
		t_range['start']=moment(t_a['start']).format("YYYY")+"-"+moment(t_a['start']).format("MM")+"-"+moment(t_a['start']).format("DD");
		//t_range['start']="2016-01-31"
		t_range['end']="2016-05-12";
		t_a['ranges'].push(t_range);
		t_a['start'] = moment(t_a['start']).format("HH:mm:ss");
		t_a['end'] = moment(t_a['end']).format("HH:mm:ss");
		
		var com_end = moment(t_a['end'],"HHmm");
		var com_start = moment(t_a['start'],"HHmm");
	if (com_end.isBefore(com_start)){
		 	t_a['end'] = "23:59";
		 	window.alert("Please add overnight event separately for both days for repeated events");
			}
		}
	t_announce.push(t_a);
	$('#calendar').fullCalendar('addEventSource',t_announce);
}

function bind_announcement_detail(event){
	$(".element").remove();
	$(".noresult").remove();
	var div = $("<div class = 'element'></div>");
	var p1 = $("<div class='label-primary'> "+event.title +"</div>");
	var p2 = $("<div> Additional Information: "+event.des +"</div>");
	var p3 = $("<div> Location: "+event.loc+"</div>");
	var p4 = $("<div> Date: " + event.data.time.split('T')[0]+"</div>");
	var p5 = $("<div> Start Time: " + event.data.time.split('T')[1]+"</div>");
	var p6 = $("<div> Duration: " + event.data.duration+" minutes</div>");
	
	div.append(p1);
	div.append(p4);
	div.append(p5);
	div.append(p6);
	
	div.append(p3);
	div.append(p2);
	
	
	div.append($("</br>"));
	var p9;
	p9 = $("<input type='button' value='Remove' class = 'toDelete btn btn-default'>");
	

	p9.css("font-style", "normal");	
	// p9.css("font-style", "normal");
	p9.css("display", "inline");
	if (event.TA)
		div.append(p9);
	$(".sidebar_display").append(div);
	p9.click(function() {
		$.ajax({
			url: '/remove_announcement',
			data: {
				_id: event._id
			},
			type: 'GET', 
			success: function(data) {
				// console.log(data);
				$('#calendar').fullCalendar('removeEvents', event.id);
				$(".element").remove();
			},
			error: function(xhr, status, error) {
				console.log("Something Wrong");
			}
		})
	})
}

function bind_event_detail(event){
	$(".element").remove();
	$(".noresult").remove();
	var div = $("<div class = 'element'></div>");
	var p1 = $("<div class='label-primary'> "+event.title +"</div>");
	var p2 = $("<div> Additional Information: "+event.des +"</div>");
	var p3 = $("<div> Location: "+event.loc+"</div>");
	var p4 = $("<div> Date: " + event.data.time.split('T')[0]+"</div>");
	var p5 = $("<div> Start Time: " + event.data.time.split('T')[1]+"</div>");
	var p6 = $("<div> Duration: " + event.data.duration+" minutes</div>");
	
	div.append(p1);
	div.append(p4);
	div.append(p5);
	div.append(p6);
	
	div.append(p3);
	div.append(p2);
	
	
	div.append($("</br>"));
	var p9;
	p9 = $("<input type='button' value='Remove' class = 'toDelete btn btn-default'>");
	

	p9.css("font-style", "normal");	
	// p9.css("font-style", "normal");
	p9.css("display", "inline");
	
	div.append(p9);
	$(".sidebar_display").append(div);
	// console.log(event._id);
	p9.click(function() {
		$.ajax({
			url: '/remove_event',
			data: {
				_id: event._id
			},
			type: 'GET', 
			success: function(data) {
				// console.log(data);
				$('#calendar').fullCalendar('removeEvents', event.id);
				$(".element").remove();
			},
			error: function(xhr, status, error) {
				console.log("Something Wrong");
			}
		})
	})
}

function add_all_course() {
	$.ajax({
		url: '/find_user_courses', 
		data: {
		},
		type: 'GET',
		success: function(data) {
			// console.log(data);
			for (var i = 0; i < data["courses"].length; i++)
				add_course(data["courses"][i].course, data["courses"][i].section);
			for (var i = 0; i < data["announcements"].length; i++)
				add_announcement(data["announcements"][i]);
			for (var i = 0; i < data["events"].length; i++)
				add_event(data["events"][i]);
			
			var reg_day = [];
			t_reg = {};

			t_reg['title']= 'Registration Day';
			t_reg["start"] = '2016-02-01T08:00';
			t_reg['end'] = '2016-02-01T09:00';

			t_reg['forceEventDuration'] = true;

			reg_day.push(t_reg);
			// console.log(reg_day);
			$('#calendar').fullCalendar('addEventSource', reg_day);
		},
		error: function(xhr, status, error) {
			console.log("Something Wrong");
		}
	})
}

function remove_course(data, course_section) {
	for (var i = 0; i < 10; i++) {
		$('#calendar').fullCalendar('removeEvents', data.id + "-" + course_section+"-"+i );
	}
}

function remove_all_course() {
	$(".fc-event").detach();
}

function temp_disappear(what) {
	$.ajax({
		url: '/get_course',
		data: {
			id: $(what).parent().parent().attr('course_id'),
			course_section: $(what).attr('course_section')
		},
		type: "GET",
		success: function(data) {
			if (data != "error") {
				remove_course(data, $(what).attr('course_section'));
			}
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	})
}

function temp_appear(what) {
	$.ajax({
		url: '/get_course',
		data: {
			id: $(what).parent().parent().attr('course_id'),
			course_section: $(what).attr('course_section')
		},
		type: "GET",
		success: function(data) {
			if (data != "error") {
				add_course(data, $(what).attr('course_section'));
			}
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	})
}

function bind_add_course(what) {
	var This = $(what);
	var p1 = $("<input type='button' value='Remove' class = 'toDelete btn btn-default'>");
	p1.attr('course_section', $(what).attr('course_section'));
	p1.click(function() {
		bind_remove_course(this);
	});
	/*
	p1.hover(function() {
		temp_disappear(this);
	}, function() {
		temp_appear(this);
	})
	*/
	This.replaceWith(p1);
	$.ajax({
		url: '/add_course',
		data: {
			id: p1.parent().parent().attr('course_id'),
			course_section: p1.attr('course_section')
		},
		type: "GET",
		success: function(data) {
			// console.log(data);
			if (data != "error") {
				add_course(data, p1.attr('course_section'));
			}
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	})
}

function bind_remove_course(what) {
	var This = $(what);
	var par = This.parent();
	var p1 = $("<input type='button' value='Add' class = 'toCal btn btn-primary'>");
	p1.attr('course_section', $(what).attr('course_section'));
	p1.click(function() {
		bind_add_course(this);
	});
	p1.hover(function() {
		temp_appear(this);
	}, function() {
		temp_disappear(this);
	})
	This.replaceWith(p1);
	$.ajax({
		url: '/remove_course',
		data: {
			id: p1.parent().parent().attr('course_id'),
			course_section: p1.attr('course_section')
		},
		type: "GET",
		success: function(data) {
			if (data != "error") {
				remove_course(data, p1.attr('course_section'));
			}
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	})
}

function bind_course_detail(id) {
	$.ajax({
		url: '/course_detail', 
		data: {
			id: id,
		},
		type: "GET",
		success: function(data) {
			if (data != "error") {
				$(".element").remove();
				$(".noresult").remove();
				var div = $("<div class = 'element' course_id = " +data.id +"></div>");
				var p1 = $("<div class='label-primary'> "+data.name +"</div>");
				var p2 = $("<div> "+data.description +"</div>");
				var p3 = $("<div> "+data.instructor+"</div>");
				var p4 = $("<div> "+data.prereqs +", "+data.level.substring(0,8)+", "+data.units+"</div>");
				// var p5 = $("<div> "+data.level +"</div>");
				// var p6 = $("<div> "+data.units +"</div>");
				var p7 = $("<a target='_blank' href="+data.evaluation+">evaluation</a>");
				
				div.append(p1,p2,p3,p4,p7,$("</br>"));
				var pre = "";
				for (var j in data.schedule) {
					if (data.schedule[j] == 'To be arranged')
						continue;
					if (data.schedule_type[j] != pre) {
						var p8 = $("<div></div>");
						p8.text(data.schedule_type[j] + " schedule: ");
						var br = "</br>";
						p8.append(br);
						p8.css("font-style", "italic");

						pre = data.schedule_type[j];
						div.append(p8);
					}
					var p9;
					if (data.exist[j]) {
						p9 = $("<input type='button' value='Remove' class = 'toDelete btn btn-default'>");
						/*
						p9.hover(function() {
							temp_disappear(this);
						}, function() {
							temp_appear(this);
						})
						*/
					}
					else {
						p9 = $("<input type='button' value='Add' class = 'toCal btn btn-primary'>");
						p9.hover(function() {
							temp_appear(this);
						}, function() {
							temp_disappear(this);
						})
					}
					p9.attr("course_section", j);
					p9.css("font-style", "normal");
					p8.append(p9);
					p9 = $("<div></div>");

					p9.attr("course_section", j);
					
					p9.text(data.schedule[j]);
					p9.css("font-style", "normal");
					p9.css("display", "inline");
					p8.append(p9);
					p8.append("</br>");
				}

				var p10 = $("<div></div>");
				// p10.text(data.number + " people are going to this class.");
				// div.append(p10);
				// p10 = $("<div></div>");
				// p10.text(data["users"].length + " of your friends are going to this class. They are:");
				if (data["users"].length <= 1)
					p10.text(data["users"].length + " friend is going to this class:");
				else
					p10.text(data["users"].length + " friends are going to this class:");
				
				div.append(p10);

				$(".sidebar_display").append(div);
				
				display_data(data);
				$(".noresult").text("");
				$(".toCal").click(function() {
					bind_add_course(this);
				})
				$(".toDelete").click(function() {
					bind_remove_course(this);
				})
			}else {
				console.log("Uh oh there was an error");
			}
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	})
}

function display_data(data) {
	var text = $('.search_text').val();
	if (data["courses"])
	data["courses"].sort(function(a, b) {
		if (a.name.toLowerCase().indexOf(text) != b.name.toLowerCase().indexOf(text))
			return a.name.toLowerCase().indexOf(text) - b.name.toLowerCase().indexOf(text);
		else
			if (a.name < b.name)
				return -1;
			else
				return 1;
	});
	data["users"].sort(function(a, b) {
		if (a.friendtype != b.friendtype)
			return b.friendtype - a.friendtype;
		else {
			if (a.lastname < b.lastname)
				return -1;
			else
				return 1;
		}
	})
	var count = 0;
	for (var i in data["courses"]) {
		if (i > 0 && data["courses"][i].name == data["courses"][i - 1].name)
			continue;
		var div = $("<div class = 'element' course_id = "+data["courses"][i].id +" id = 'course_id"+data["courses"][i].id+"'></div>");
		var p1 = $("<div class='name label-primary'> "+data["courses"][i].name +"</div>");
		var p2 = $("<div class='description'> "+data["courses"][i].description +"</div>");
		var p3 = $("<div class='instructors'> "+"Instructors:"+"   "+data["courses"][i].instructor+"</div>");
		var p4 = $("<div class='prereqs'> "+data["courses"][i].prereqs +", "+data["courses"][i].level.substring(0,8)+", "+data["courses"][i].units+"</div>");
		// var p5 = $("<div> "+data["courses"][i].level +"</div>");
		// var p6 = $("<div> "+data["courses"][i].units +"</div>");
		var p7 = $("<a target='_blank' href="+data["courses"][i].evaluation+">evaluation</a>");
		
		div.append(p1,p2,p3,p4,p7,$("</br>"));
		var pre = "";



		for (var j in data["courses"][i].schedule) {
			if (data["courses"][i].schedule[j] == 'To be arranged')
				continue;
			if (data["courses"][i].schedule_type[j] != pre) {
				var p8 = $("<div class='schedule'></div>");
				p8.text(data["courses"][i].schedule_type[j] + " schedule: ");
			
				p8.css("font-style", "italic");
				// p8.css("font-weight", "bold");
				
				var br = "</br>";
				p8.append(br);

				pre = data["courses"][i].schedule_type[j];
				div.append(p8);
			}
			var p9;
			if (data["courses"][i].exist[j]) {
				p9 = $("<input type='button' value='Remove' class = 'toDelete btn btn-default'>");
				/*
				p9.hover(function() {
					temp_disappear(this);
				}, function() {
					temp_appear(this);
				})
			*/
			}
			else {
				p9 = $("<input type='button' value='Add' class = 'toCal btn btn-primary'>");
				p9.hover(function() {
					temp_appear(this);
				}, function() {
					temp_disappear(this);
				})
			}
			p9.css("font-style", "normal");
			
			p9.attr("course_section", j);
			p8.append(p9);
			p9 = $("<div></div>");
			p9.text(data["courses"][i].schedule[j]);
			p9.css("font-style", "normal");
			
			p9.css("display", "inline");
			p8.append(p9);
			p8.append("</br>");
		}


		

		var p10 = $("<button class='btn btn-success' type='button' data-toggle='collapse' data-target='#collapse"+data["courses"][i].id+"' aria-expanded='false' aria-controls='collapseExample'>Friends  <i class='fa fa-heart'></i></button>");
		var p11 = $("<div class = 'collapse' id='collapse"+data["courses"][i].id+"'></div>");

		div.append(p10, p11);

		p10.click(function() {
			var what = $(this);
			$.ajax({
				url: '/course_detail', 
				data: {
					id: what.attr('data-target').split('apse')[1],
				},
				type: "GET",
				success: function(data) {
					// console.log(data);
					what.next().children().detach();
					var p1 = $("<div></div>");
					if (data["users"].length <= 1)
						p1.text(data["users"].length + " friend is going to this class:");
					else
						p1.text(data["users"].length + " friends are going to this class:");
					
					what.next().append(p1);
					data["users"].sort(function(a, b) {
						if (a.friendtype != b.friendtype)
							return b.friendtype - a.friendtype;
						else {
							if (a.lastname < b.lastname)
								return -1;
							else
								return 1;
						}
					})
					for (var i in data["users"]) {
						var div = $("<div class = 'element' user_email = "+ data["users"][i].email+" user_firstname = " + data["users"][i].firstname+"> </div>");
						var p1 = $("<div> Name: "+data["users"][i].firstname  + " " + data["users"][i].lastname+"</div>");
						div.append(p1);
						p1 = $("<div> Email:"+data["users"][i].email+"</div>");
						div.append(p1);
						var p2;
						if (data["users"][i].friendtype == 3) {
							p2 = $("<input type='button' value='View Schedule' class = 'btn btn-primary See_friend_courses'>");
						}else if (data["users"][i].friendtype == 0) {
							p2 = $("<input type='button' value='Add as Friend' class = 'btn btn-primary Add_friend_submit'>");
						}else if (data["users"][i].friendtype == 2) {
							p2 = $("<input type='button' value='Accept' class = 'btn btn-primary Accept_friend_submit'>");
						}else {
							p2 = $("<div>Request Sent</div>");
						}
						div.append(p2);
						if (data["users"][i].friendtype == 2)
							div.append($("<input type='button' value='Delete' class = 'btn btn-default Reject_friend_submit'>"));
						what.next().append(div);

						count += 1;
					}

					Bind_Add_Accept_Reject_See();
				},
				error: function(xhr, status, error) {
					console.log("Uh oh there was an error: " + error);
				}
			})
		})

		$(".sidebar_display").append(div);
		count += 1;
	}
	
	/* Add to Calender */
	$(".toCal").click(function() {
		bind_add_course(this);
	})
	$(".toDelete").click(function() {
		bind_remove_course(this);
	})
	// $(".course_detail").click(function() {
	// 	bind_course_detail($(this).parent().attr('course_id'));
	// })

	for (var i in data["users"]) {
		var div = $("<div class = 'element' user_email = "+ data["users"][i].email+" user_firstname = " + data["users"][i].firstname+"> </div>");
		var p1 = $("<div> Name: "+data["users"][i].firstname  + " " + data["users"][i].lastname+"</div>");
		div.append(p1);
		p1 = $("<div> Email: "+data["users"][i].email+"</div>");
		div.append(p1);
		var p2;
		if (data["users"][i].friendtype == 3) {
			p2 = $("<input type='button' value='View Schedule' class = 'btn btn-primary See_friend_courses'>");
		}else if (data["users"][i].friendtype == 0) {
			p2 = $("<input type='button' value='Add as Friend' class = 'btn btn-primary Add_friend_submit'>");
		}else if (data["users"][i].friendtype == 2) {
			p2 = $("<input type='button' value='Accept' class = 'btn btn-primary Accept_friend_submit'>");
		}else {
			p2 = $("<div>Request Sent</div>");
		}
		div.append(p2);
		if (data["users"][i].friendtype == 2)
			div.append($("<input type='button' value='Delete' class = 'btn btn-default Reject_friend_submit'>"));
		$(".sidebar_display").append(div);
		count += 1;
	}
	if (count == 0) {
		var div = $("<div class = 'noresult'> No result found </div>");
		$(".sidebar_display").append(div);
	}
	Bind_Add_Accept_Reject_See();
}


function display_friendCal(data){
	var div = $("<div class= 'element' id = friendCal> </div>");
	$(".sidebar_display").append(div);
	$("#friendCal").fullCalendar({
		header: {
				left: '',
				center: '',
				right: ''
			},
		defaultView: 'agendaWeek',
		views:{
		agendaWeek:{			
			weekends: false,
			columnFormat: "ddd"
			}
		},
		height: "auto",
		contentHeight: "auto",
		minTime: "08:00:00",
		maxTime: "22:00:00",
		eventClick: function(event) {
			$("#course_id"+event.course).find("input").eq(event.section).click();
		},
		eventMouseover: function(event){
			$("#course_id"+event.course).find("input").eq(event.section).mouseenter();
		},
		eventMouseout: function(event){
			$("#course_id"+event.course).find("input").eq(event.section).mouseout();
		},
		//height: window.innerHeight-75,
		timeFormat: 'h:mmt',
		allDaySlot: false,
		scrollTime: '08:00:00',
		slotDuration: "01:00:00",
		defaultDate: '2016-02-01',
		displayEventTime: false,
		weekends: false,
		eventRender: function(event){
			//method posted on StackOverflow
			
			if (event.ranges){
				return (event.ranges.filter(function(range){ // test event against all the ranges
        	return (event.start.isBefore(range.end) &&
                event.start.isAfter(moment(range.start).subtract(1,'days')));

    			}).length)>0; //if it isn't in one of the ranges, don't render it (by returning false) //if it isn't in one of the ranges, don't render it (by returning false)
			}
			return true;
			}
	});
	for (var i = 0; i < data['courses'].length; i++)
		friend_add_course(data['courses'][i], data['courses'][i].course_section);

}

add_all_course();



$(".sidebar_searchbar input").mouseenter(function(){
	$(".sidebar_searchbar button").css("background-color",  "rgb(66, 133, 244)");
	$(".sidebar_searchbar button").css("box-shadow",  ".5px .5px 1px 1px rgb(66, 133, 244)");

});
$(".sidebar_searchbar input").mouseout(function(){
		$(".sidebar_searchbar button").css("background-color", "" );
		$(".sidebar_searchbar button").css("box-shadow",  "");

	  });

$(".search_submit").click(function() {
	$(".element").remove();
	$(".noresult").remove();	
	$(".sidebar_searchbar button").css("box-shadow",  ".5px .5px 1px 1px rgb(66, 133, 244)");

	countcourse = 0;
	var text = $(".search_text").val();
	if (text.length < 1) {
		return ;
	}
	$.ajax({
		url: '/search_element',
		data: {
			text: text,
		},
		type: 'GET',
		success: function(data) {
			// update the HTML element with the returned data
			$(".element").remove();
			$(".noresult").remove();
			display_data(data);
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	});
});                                 

$(".friends_requests").click(function() {
	if ($(this).css("color") != "rgba(255, 255, 255, 1)")
	$.ajax({
		url: '/friends_requests',
		data: {
		},
		type: 'GET',
		success: function(data) {
			// update the HTML element with the returned data
			$(".element").remove();
			$(".noresult").remove();
			display_data(data);
			$(".noresult").text("You have no new friend request.");
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	});
	$(".request_count").fadeOut("slow");
});

var color = 0;

$(".friends_list").click(function() {

	$(".element").remove();
	$(".noresult").remove();
	if ($(this).css("color") === "rgba(255, 255, 255, 0.8)" || $(this).css("color") === "rgba(255, 255, 255, 0.6)")
	$.ajax({
		url: '/friends_list',
		data: {
		},
		type: 'GET',
		success: function(data) {
			$(".element").remove();
			$(".noresult").remove();
			display_data(data);
			$(".noresult").text("Please search and add some friends!");
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	});
	
});


$(".login_submit").click(function() {
	$(".error").text("");
	$.ajax({
		url: '/login',
		data: {
			email: $(".login_email").val().toLowerCase(),
			password: $.md5($(".login_password").val(), $(".login_email").val().toLowerCase())
		},
		type: 'GET',
		success: function(data) {
			if (data == "Invalid email or password") {
				$(".login_submit").parent().find(".error").text(data);
				$('.login_email').css("borderColor", "rgb(255, 180, 0)");
				$('.login_email').css("background-color", "#FFF8E6");
				$('.login_password').css("borderColor", "rgb(255, 180, 0)");
				$('.login_password').css("background-color", "#FFF8E6");
			}
			else {
				location.reload();
			}
		},
		error: function(xhr, status, error) {
			console.log("Something Wrong");
		}
	});
});

$(".logout").click(function() {
	$.ajax({
		url: '/logout',
		data: {
		},
		type: 'GET',
		success: function(data) {
			location.reload();
		},
		error: function(xhr, status, error) {
			console.log("sdkskds");
		}
	});
});
// TA authorization window





$(".btn-close").click(function(){

	$('.login_bar').hide(500);
	$('.register_bar').hide(500);
	$('.ta_authorization_window').hide(500);
	$('.info').fadeIn(1000)
	$('.setting_bar').hide();
	$(".overlay").hide();
});

$(".register_submit").click(function() {
	$(".error").text("");
	var email = $(".register_email").val().toLowerCase(), password = $(".register_password").val(), password_c = $(".register_password_confirm").val(),
		firstname = $(".register_first_name").val(), lastname = $(".register_last_name").val();
	var valid = true;
	if (!validateEmail(email)) {
		$(".register_email").next().text("Not a valid email address");
		valid = false;
		document.getElementById('register_email').style.borderColor = "rgb(255, 180, 0)";
		document.getElementById('register_email').style.background = "#FFF8E6";
	}else {
		document.getElementById('register_email').style.borderColor = "transparent";
		document.getElementById('register_email').style.background = "white";
	}
	if (password.length < 6) {
		$(".register_password").next().text("At least 6 characters");
		valid = false;
		document.getElementById('register_password').style.borderColor = "rgb(255, 180, 0)";
		document.getElementById('register_password').style.background = "#FFF8E6";
		
	}else if (password.length > 18){
		$(".register_password").next().text("At most 18 characters");
		valid = false;
		document.getElementById('register_password').style.borderColor = "rgb(255, 180, 0)";
		document.getElementById('register_password').style.background = "#FFF8E6";

	}else{
		document.getElementById('register_password').style.borderColor = "transparent";
		document.getElementById('register_password').style.background = "white";
	}
	if (password != password_c || password.length <6 ){
		valid = false;
		document.getElementById('register_password_confirm').style.borderColor = "rgb(255, 180, 0)";
		document.getElementById('register_password_confirm').style.background = "#FFF8E6";
			if (password != password_c ) {
				$(".register_password_confirm").next().text("Password does not match");
				valid = false;
			}
	}else {
		document.getElementById('register_password_confirm').style.borderColor = "transparent";
		document.getElementById('register_password_confirm').style.background = "white";
	}


	if (!firstname) {
		$(".register_first_name").next().text("Cannot be blank");
		valid = false;
		document.getElementById('register_first_name').style.borderColor = "rgb(255, 180, 0)";
		document.getElementById('register_first_name').style.background = "#FFF8E6";
	}else {
		document.getElementById('register_first_name').style.borderColor = "transparent";
		document.getElementById('register_first_name').style.background = "white";
	}
	if (!lastname) {
		$(".register_last_name").next().text("Cannot be blank");
		valid = false;
		document.getElementById('register_last_name').style.borderColor = "rgb(255, 180, 0)";
		document.getElementById('register_last_name').style.background = "#FFF8E6";
	}else {
		document.getElementById('register_last_name').style.borderColor = "transparent";
		document.getElementById('register_last_name').style.background = "white";
	}
	if (valid) {

		 
		$.ajax({
			url: '/register',
			data: {
				email: email,
				password: $.md5(password, email),
				firstname: firstname,
				lastname: lastname
			},
			type: 'GET',
			success: function(data) {
				if (data == "Email already exists") {
					$(".register_email").next().text(data);
					document.getElementById('register_email').style.borderColor = "rgb(255, 180, 0)";
					document.getElementById('register_email').style.background = "#FFF8E6";
				}
				else if (data == "good") {
					$(".register_submit").attr("disabled", "disabled");
					var now = 60;
					function countdown() {
						if (now == 0) {
							$(".register_submit").removeAttr("disabled");
							$(".register_submit").val("SIGN UP");
							return;
						}
						$(".register_submit").val(now + "s");
						now -= 1;
						setTimeout(countdown, 1000);
					}
					countdown();
					$(".register_email").prev().prev().prev().prev().text("Hello " +firstname);
					$(".register_email").prev().prev().prev().text("Please check your email to complete the sign up process!");
				}else {
					$(".register_email").prev().prev().prev().prev().text("");
					$(".register_email").prev().prev().prev().text("");
					$(".register_email").prev().prev().text(data);
				}
			},
			error: function(xhr, status, error) {
				console.log("Something Wrong");
			}
		});
	}
});

// $(".setting").click(function() {
// 	$('.setting_bar').show("slow");
// 	$('.overlay').show();


// });

$(".setting_submit").click(function() {
	$(".setting_error").text("");
	var password_o = $(".setting_password_old").val(), password = $(".setting_password").val(), password_c = $(".setting_password_confirm").val(),
		firstname = $(".setting_first_name").val(), lastname = $(".setting_last_name").val();
	
	if (0 < password.length && password.length < 6) {
		$(".setting_error").text("At least 6 characters");
		return ;
	}
	
	if (password != password_c) {
		$(".setting_error").text("Password does not match");
		return ;
	}

	$.ajax({
		url: '/getuser',
		data: {
		},
		type: 'GET',
		success: function(data) {
			$.ajax({
				url: '/setting',
				data: {
					password_o: $.md5(password_o, data),
					password: password.length == 0 ? "" : $.md5(password, data),
					firstname: firstname,
					lastname: lastname
				},
				type: 'GET',
				success: function(data) {
					$(".setting_error").text(data);
					if(data=="Wrong Password"){
						$(".setting_password_old").css("borderColor", "rgb(255, 180, 0)");
						$('.setting_password_old').css("background-color", "#FFF8E6");
					}else{
						$(".setting_password_old").css("borderColor", "");
						$('.setting_password_old').css("background-color", "");
						
					}

					location.reload();
				},
				error: function(xhr, status, error) {
					console.log("Something Wrong");
				}
			});
		},
		error: function(xhr, status, error) {
			console.log("Something Wrong");
		}
	})
});

$(".ta_authorization_submit").click(function() {
	$.ajax({
		url: '/ta_authorization_submit',
		data: {
			course: $(".ta_class_authorization").val(),
			passcode: $.md5($(".activation_code").val())
		},
		type: 'GET',
		success: function(data) {
			if (data == "Successful"){
				location.reload();
				$(".activation_code").css("borderColor", "white");
				$('.activation_code').css("background-color", "white");
			}else{
				$("#ta_authorization_modal").find(".error").text(data);

					$(".activation_code").css("borderColor", "rgb(255, 180, 0)");
					$('.activation_code').css("background-color", "#FFF8E6");
				}
		},
		error: function(xhr, status, error) {
			console.log("Something Wrong");
		}
	})
});



$(".login_password").keypress(function(event) {
	if (event.which == 13) {
		event.preventDefault();
		$(".login_submit").click();
	}
});

$(".register_last_name").keypress(function(event) {
	if (event.which == 13) {
		event.preventDefault();
		$(".register_submit").click();
	}
});

$(".search_text").keypress(function(event) {
	if (event.which == 13) {
		event.preventDefault();
		$(".search_submit").click();
	}
});

$(".username").click(function() {
	if ($(".notification").css("color") == "rgba(255, 255, 255, 0.8)" || $(".notification").css("color") == "rgb(255, 255, 255)")
		$(".notification").css("color", "rgba(255, 255, 255, 0.6)");
	if ($(".friends_requests").css("color") == "rgba(255, 255, 255, 0.8)" || $(".friends_requests").css("color") == "rgb(255, 255, 255)")
		$(".friends_requests").css("color", "rgba(255, 255, 255, 0.6)");
	if ($(".friends_list").css("color") == "rgba(255, 255, 255, 0.8)" || $(".friends_list").css("color") == "rgb(255, 255, 255)")
		$(".friends_list").css("color", "rgba(255, 255, 255, 0.6)");
	
	if ($(".username").css("color") != "rgb(255, 255, 255)") {

		$(".username").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,1)"
		});
		$(".username").unbind('mouseenter mouseleave');
		$(".username").hover(function() {
			$(".username").attr("on", '1');
		}, function() {
			$(".username").attr("on", '0');
		});
	}else {
		$(".username").css("color", "rgba(255, 255, 255, 0.8)");
		if ($(".username").attr("on") == 0)
			$(".username").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
		else
			$(".username").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
		$(".username").unbind('mouseenter mouseleave');
		$(".username").hover(function() {
			$(".username").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
			$(".username").attr("on", '1');
		}, function() {
			$(".username").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
			$(".username").attr("on", '0');
		});
	}
})

$(".notification").click(function() {
	if ($(".username").css("color") == "rgba(255, 255, 255, 0.8)" || $(".username").css("color") == "rgb(255, 255, 255)")
		$(".username").css("color", "rgba(255, 255, 255, 0.6)");
	if ($(".friends_requests").css("color") == "rgba(255, 255, 255, 0.8)" || $(".friends_requests").css("color") == "rgb(255, 255, 255)")
		$(".friends_requests").css("color", "rgba(255, 255, 255, 0.6)");
	if ($(".friends_list").css("color") == "rgba(255, 255, 255, 0.8)" || $(".friends_list").css("color") == "rgb(255, 255, 255)")
		$(".friends_list").css("color", "rgba(255, 255, 255, 0.6)");

	$(".notification_count").fadeOut("slow");
	if ($(".notification").css("color") != "rgb(255, 255, 255)") {

		$(".notification").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,1)"
		});
		$(".notification").unbind('mouseenter mouseleave');
		$(".notification").hover(function() {
			$(".notification").attr("on", '1');
		}, function() {
			$(".notification").attr("on", '0');
		});
	}else {
		$(".notification").css("color", "rgba(255, 255, 255, 0.8)");
		if ($(".notification").attr("on") == 0)
			$(".notification").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
		else
			$(".notification").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
		$(".notification").unbind('mouseenter mouseleave');
		$(".notification").hover(function() {
			if ($(".notification").css("color") != "rgb(231, 76, 60)")
			$(".notification").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
			$(".notification").attr("on", '1');
		}, function() {
			if ($(".notification").css("color") != "rgb(231, 76, 60)")
			$(".notification").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
			$(".notification").attr("on", '0');
		});
	}
})
$("html").click(function() {
	
	if ($(".notification").css("color") == "rgba(255, 255, 255, 0.8)" || $(".notification").css("color") == "rgb(255, 255, 255)")
		$(".notification").css("color", "rgba(255, 255, 255, 0.6)");
	


	if ($(".friends_requests").css("color") != "rgb(231, 76, 60)") {
		if ($(".friends_requests").css("color") == "rgba(255, 255, 255, 0.8)") {
			$(".friends_requests").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,1)",
		
			});
			$(".friends_requests").unbind('mouseenter mouseleave');
			$(".friends_requests").hover(function() {
				$(".friends_requests").attr("on", '1');
			}, function() {
				$(".friends_requests").attr("on", '0');
			});
		}else {
			if ($(".friends_requests").attr("on") == 0)
				$(".friends_requests").css({
					transition : 'color 0.2s ease-in-out',
					"color": "rgba(255,255,255,0.6)"
				});
			else
				$(".friends_requests").css({
					transition : 'color 0.2s ease-in-out',
					"color": "rgba(255,255,255,0.8)"
				});
			$(".friends_requests").unbind('mouseenter mouseleave');
			$(".friends_requests").hover(function() {
				$(".friends_requests").css({
					transition : 'color 0.2s ease-in-out',
					"color": "rgba(255,255,255,0.8)"
				});
				$(".friends_requests").attr("on", '1');
			}, function() {
				$(".friends_requests").css({
					transition : 'color 0.2s ease-in-out',
					"color": "rgba(255,255,255,0.6)"
				});
				$(".friends_requests").attr("on", '0');
			});
			
		}
	}

	if ($(".friends_list").css("color") == "rgba(255, 255, 255, 0.8)") {
		$(".friends_list").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,1)"
		});
		$(".friends_list").unbind('mouseenter mouseleave');
		$(".friends_list").hover(function() {
			$(".friends_list").attr("on", '1');
		}, function() {
			$(".friends_list").attr("on", '0');
		});
	}else {
		if ($(".friends_list").attr("on") == 0)
			$(".friends_list").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
		else
			$(".friends_list").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
		$(".friends_list").unbind('mouseenter mouseleave');
		$(".friends_list").hover(function() {
			$(".friends_list").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
			$(".friends_list").attr("on", '1');
		}, function() {
			$(".friends_list").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
			$(".friends_list").attr("on", '0');
		});
	}


	if ($(".username").css("color") == "rgba(255, 255, 255, 0.8)" || $(".username").css("color") == "rgb(255, 255, 255)")
		$(".username").css("color", "rgba(255, 255, 255, 0.6)");
	

	if ($(".ta_portal").css("color") == "rgba(255, 255, 255, 0.8)") {
		$(".ta_portal").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,1)",
	
		});
		$(".ta_portal").unbind('mouseenter mouseleave');
		$(".ta_portal").hover(function() {
			$(".ta_portal").attr("on", '1');
		}, function() {
			$(".ta_portal").attr("on", '0');
		});
	}else {
		if ($(".ta_portal").attr("on") == 0)
			$(".ta_portal").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
		else
			$(".ta_portal").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
		$(".ta_portal").unbind('mouseenter mouseleave');
		$(".ta_portal").hover(function() {
			$(".ta_portal").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
			$(".ta_portal").attr("on", '1');
		}, function() {
			$(".ta_portal").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
			$(".ta_portal").attr("on", '0');
		});
		
	}



	if ($(".quick_add").css("color") == "rgba(255, 255, 255, 0.8)") {
		$(".quick_add").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,1)",
	
		});
		$(".quick_add").unbind('mouseenter mouseleave');
		$(".quick_add").hover(function() {
			$(".quick_add").attr("on", '1');
		}, function() {
			$(".quick_add").attr("on", '0');
		});
	}else {
		if ($(".quick_add").attr("on") == 0)
			$(".quick_add").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
		else
			$(".quick_add").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
		$(".quick_add").unbind('mouseenter mouseleave');
		$(".quick_add").hover(function() {
			$(".quick_add").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.8)"
			});
			$(".quick_add").attr("on", '1');
		}, function() {
			$(".quick_add").css({
				transition : 'color 0.2s ease-in-out',
				"color": "rgba(255,255,255,0.6)"
			});
			$(".quick_add").attr("on", '0');
		});
		
	}

})

$(".ta_portal").hover(function() {
	$(".ta_portal").css({
		transition : 'color 0.2s ease-in-out',
		"color": "rgba(255,255,255,0.8)"
	})
	$(".ta_portal").attr("on", '1');
}, function() {
	$(".ta_portal").css({
		transition : 'color 0.2s ease-in-out',
		"color": "rgba(255,255,255,0.6)"
	})
	$(".ta_portal").attr("on", '0');
});

$(".quick_add").hover(function() {
	$(".quick_add").css({
		transition : 'color 0.2s ease-in-out',
		"color": "rgba(255,255,255,0.8)"
	})
	$(".quick_add").attr("on", '1');
}, function() {
	$(".quick_add").css({
		transition : 'color 0.2s ease-in-out',
		"color": "rgba(255,255,255,0.6)"
	})
	$(".quick_add").attr("on", '0');
});



$(".notification").hover(function() {
	if ($(".notification").css("color") != "rgb(231, 76, 60)") {
		$(".notification").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,0.8)"
		});
	}
	$(".notification").attr("on", '1');
}, function() {
	if ($(".notification").css("color") != "rgb(231, 76, 60)") {
		$(".notification").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,0.6)"
		});
	}
	$(".notification").attr("on", '0');
});


$(".username").hover(function() {
	$(".username").css({
		transition : 'color 0.2s ease-in-out',
		"color": "rgba(255,255,255,0.8)"
	});
	$(".username").attr("on", '1');
}, function() {
	$(".username").css({
		transition : 'color 0.2s ease-in-out',
		"color": "rgba(255,255,255,0.6)"
	});
	$(".username").attr("on", '0');
});


$(".friends_list").hover(function() {
	$(".friends_list").css({
		transition : 'color 0.2s ease-in-out',
		"color": "rgba(255,255,255,0.8)"
	});
	$(".friends_list").attr("on", '1');
}, function() {
	$(".friends_list").css({
		transition : 'color 0.2s ease-in-out',
		"color": "rgba(255,255,255,0.6)"
	});
	$(".friends_list").attr("on", '0');
});

$(".friends_requests").hover(function() {
	if ($(".friends_requests").css("color") != "rgb(231, 76, 60)") {
		$(".friends_requests").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,0.8)"
		});
	}
	$(".friends_requests").attr("on", '1');
}, function() {
	if ($(".friends_requests").css("color") != "rgb(231, 76, 60)") {
		$(".friends_requests").css({
			transition : 'color 0.2s ease-in-out',
			"color": "rgba(255,255,255,0.6)"
		});
	}
	$(".friends_requests").attr("on", '0');
});



function Bind_notification_click(x, data) {
	x.click(function() {
		// console.log(data);
		if (data.type == "announcement") {
			$.ajax({
				url: '/find_announcement_by_id',
				data: {
					_id: data.id
				},
				success: function(data) {
					if (data == "") {
						$(".element").remove();
						$(".noresult").remove();
						var x = $("<div class='noresult'></div>");
						x.text("This announcement has been deleted");
						$(".sidebar_display").append(x);
					}else {
						$(".element").remove();
						$(".noresult").remove();
						var div = $("<div class = 'element'></div>");
						var p1 = $("<div class='label-primary' >"+data.course_id + " " + data.type +"</div>");
						var p2 = $("<div> Additional Information: "+data.description +"</div>");
						var p3 = $("<div> Location: "+data.location+"</div>");
						var p4 = $("<div> Date: " + data.time.split('T')[0]+"</div>");
						var p5 = $("<div> Start Time: " + data.time.split('T')[1]+"</div>");
						var p6 = $("<div> Duration: " + data.duration+" minutes</div>");
						
						div.append(p1);
						div.append(p4);
						div.append(p5);
						div.append(p6);
						div.append(p3);

						div.append(p2);

						div.append($("<br>"));
						var p9;
						p9 = $("<input type='button' value='Remove' class = 'toDelete btn btn-default'>");
						

						p9.css("font-style", "normal");	
						// p9.css("font-style", "normal");
						p9.css("display", "inline");

						if (data.TA)
							div.append(p9);
						$(".sidebar_display").append(div);
						p9.click(function() {
							$.ajax({
								url: '/remove_announcement',
								data: {
									_id: data._id
								},
								type: 'GET', 
								success: function(data1) {
									$('#calendar').fullCalendar('removeEvents', data._id);
									$(".element").remove();
								},
								error: function(xhr, status, error) {
									console.log("Something Wrong");
								}
							})
						})
					}
				},
				error: function(xhr, status, error) {
					console.log("Uh oh there was an error: " + error);
				}
			})
		}else {
			$.ajax({
				url: '/find_user_by_email',
				data: {
					email: data.id
				},
				success: function(data) {
					$(".noresult").remove();
					$(".element").remove();
					
					display_data(data);
				},
				error: function(xhr, status, error) {
					console.log("Uh oh there was an error: " + error);
				}
		})
		}
	})
}

$(".notification").click(function() {
	if ($(".notification_bar").length > 0) {
		$(".notification_bar").detach();
	}else {
		$(".notification_content").children().detach();
		
		$.ajax({
			url: '/notification',
			data: {
			},
			type: 'GET',
			success: function(data) {
				// console.log(data);
				for (var i = data.length - 1; i >= 0; i--) {
					var x = $("<li></li>");
					x.text(data[i].info);
					x.addClass("single_notification");
					//x.addClass("divider");
					x.text(data[i].info);
					x.css("font-weight","normal")
					x.css("font-size","14px")

					Bind_notification_click(x, data[i]);
					
					if (data[i].seen){
						x.css("background-color", "transparent");
						// x.css("box-shadow","none");

						x.css("color","rgba(125,125,125,0.8)")
						// x.append($("<i class='fa fa-times'></i>"));

						// $(".fa-times").click(function() {
							// $(".element").hide();
						// })

					}else{
						// x.css("box-shadow", "5px 5px 5px black");
						x.css("background-color","white")
						x.css("font-weight","bold")
						x.css("font-color","rgba(0,0,0,1)")
						x.append($("<i class='fa fa-envelope'></i>"));
						// x.css("padding","15px")
					}
					$(".notification_content").append(x);
					$(".notification_content").append($("<li class='divider notification_divider'></li>"))

				}
				
				if (data.length == 0) {
					var x = $("<li></li>");
					x.text("You don't have any notification yet. Stay tuned! ");
					x.addClass("single_notification");
					//x.addClass("divider");
					x.css("font-weight","normal")
					x.css("font-size","14px")
					
					Bind_notification_click(x, data[i]);
					
					x.css("background-color", "transparent");
						// x.css("box-shadow","none");

					x.css("color","rgba(125,125,125,0.8)");
					$(".notification_content").append(x);
					$(".notification_content").append($("<li class='divider notification_divider'></li>"));

				}
			},
			error: function(xhr, status, error) {
				console.log("Uh oh there was an error: " + error);
			}
		})
	}
})

function ask_notification() {
	$.ajax({
		url: '/ask_notification',
		data: {
		},
		type: 'GET',
		success: function(data) {
			if (data["notification"].length > 0) {
				$(".notification_count").text(data["notification"].length);
				$(".notification_count").fadeIn("slow");
				// for (var i = 0; i < data["notification"].length; i++) {
				// if (!data["notification"][i].pushed) {
				// 	var tt = "info";
				// 	if (data["notification"][i].info.substring(0, 4) == "Your")
				// 		tt = 'success';
				// 	$.notify({
				// 		// options
				// 		message: data["notification"][i].info
				// 	},{
				// 		// settings
				// 		type: tt,
				// 		placement: {
				//             from: "bottom",
				//             align: "left"
				//         },
				// 		animate: {
				// 			enter: 'animated fadeInDown',
				// 			exit: 'animated fadeOutUp'
				// 		},
				// 	});
				// }
				// }
			}else {
				$(".notification_count").fadeOut("slow");
			}
			if (data["request"] && data["request"] > 0) {
				$(".request_count").text(data["request"]);
				$(".request_count").fadeIn("slow");
			}else {
				$(".request_count").fadeOut("slow");
			}
			
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	});
	setTimeout(ask_notification, 10000);
}

ask_notification();

$(".ta_portal").click(function() {
	$.ajax({
		url: '/getTAcourses',
		data: {
		},
		type: 'GET',
		success: function(data) {
			$(".ta_class").children().detach();
			for (var i = 0; i < data.length; i++) {
				var x = $("<option></option>");
				x.text(data[i]);
				$(".ta_class").append(x);
			}
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	})
})

$(".create_announcement").click(function() {
	$(".error").text("");
	var ok = true;
	if ($(".ta_location").val() == "") {
		$(".create_announcement").prev().text("Please complete the highlighted fields!");
			$('.ta_location').css("borderColor", "rgb(255, 180, 0)");
			$('.ta_location').css("background-color", "#FFF8E6");
		ok = false;
	}else{
		$('.ta_location').css("borderColor", "");
		$('.ta_location').css("background-color", "");
	}


	if($(".ta_duration").val()<0 || $(".ta_duration").val()>500 ){
		$(".create_announcement").prev().text("Please enter a valid number.");
			$('.ta_duration').css("borderColor", "rgb(255, 180, 0)");
				$('.ta_duration').css("background-color", "#FFF8E6");
		ok = false;

	}else{
		$('.ta_duration').css("borderColor", "");
		$('.ta_duration').css("background-color", "");
	}


	if ($(".ta_date_and_time").val() == "") {
		$(".create_announcement").prev().text("Please complete the highlighted fields!");
			$('.ta_date_and_time').css("borderColor", "rgb(255, 180, 0)");
				$('.ta_date_and_time').css("background-color", "#FFF8E6");
		ok = false;
	}else{
		$('.ta_date_and_time').css("borderColor", "");
		$('.ta_date_and_time').css("background-color", "");
	}
	// console.log($('.ta_repeat').is(":checked"));
	if (ok)
	$.ajax({
		url: '/create_announcement',
		data: {
			course: $(".ta_class option:selected").text(),
			type: $(".ta_type option:selected").text(),
			location: $(".ta_location").val(),
			time: $(".ta_date_and_time").val(),
			duration: $(".ta_duration").val() == "" ? 0 : $(".ta_duration").val(),
			description: $(".ta_description").val(),
			repeated: $('.ta_repeat').is(":checked")
		},
		type: 'GET',
		success: function(data) {
			if (data != "error") {
				location.reload();
			}else {
				 console.log("error");
			}
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	})
})

$(".add_event").click(function() {
	$(".error").text("");
	var ok = true;

	if ($(".personal_title").val().length == 0) {
		ok = false;
		$(".add_event").prev().text("Please complete the highlighted fields.");

		$('.personal_title').css("borderColor", "rgb(255, 180, 0)");
		$('.personal_title').css("background-color", "#FFF8E6");
	}else{
		$('.personal_title').css("borderColor", "");
		$('.personal_title').css("background-color", "");
	}
	if ($(".personal_date_and_time").val().length == 0) {
		ok = false;

		$(".add_event").prev().text("Please complete the highlighted fields.");

		$('.personal_date_and_time').css("borderColor", "rgb(255, 180, 0)");
		$('.personal_date_and_time').css("background-color", "#FFF8E6");
	}else{
		$('.personal_date_and_time').css("borderColor", "");
		$('.personal_date_and_time').css("background-color", "");
	}
	if($(".personal_duration").val()<0 || $(".personal_duration").val()>500 ){
		$(".add_event").prev().text("Please enter a valid number.");
			$('.personal_duration').css("borderColor", "rgb(255, 180, 0)");
				$('.personal_duration').css("background-color", "#FFF8E6");
		ok = false;
	}else{
		$('.personal_duration').css("borderColor", "");
		$('.personal_duration').css("background-color", "");
	}
	if (ok)
	$.ajax({
		url: '/add_event',
		data: {
			title: $(".personal_title").val(),
			location: $(".personal_location").val(),
			time: $(".personal_date_and_time").val(),
			duration: $("personal_duration").val() == "" ? 0 : $(".personal_duration").val(),
			description: $(".personal_description").val(),
			repeated: $('.personal_repeat').is(":checked")
		},
		type: 'GET',
		success: function(data) {
			if (data != "error") {
				location.reload();
			}else {
				 console.log("error");
			}
		},
		error: function(xhr, status, error) {
			console.log("Uh oh there was an error: " + error);
		}
	})
})

});



function printPage() {
	// printDiv('fullCalendar');
    window.print();
}
