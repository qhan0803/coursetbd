var express = require('express');
var router = express.Router();

//Database in memory
var db = require('../db-setup.js');


/* database for search */
var courses = require('../courses.js')
var course_psw = [];
var users = [];
var ips = [];
var predate = "";
/* GET home page. */

	
	//jquery.md5.js begins (copied)
	/*
	* Add integers, wrapping at 2^32. This uses 16-bit operations internally
	* to work around bugs in some JS interpreters.
	*/
	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF),
			msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	* Bitwise rotate a 32-bit number to the left.
	*/
	function bit_rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	* These functions implement the four basic operations the algorithm uses.
	*/
	function md5_cmn(q, a, b, x, s, t) {
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	}
	function md5_ff(a, b, c, d, x, s, t) {
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t) {
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t) {
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t) {
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	* Calculate the MD5 of an array of little-endian words, and a bit length.
	*/
	function binl_md5(x, len) {
		/* append padding */
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var i, olda, oldb, oldc, oldd,
			a =  1732584193,
			b = -271733879,
			c = -1732584194,
			d =  271733878;

		for (i = 0; i < x.length; i += 16) {
			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;

			a = md5_ff(a, b, c, d, x[i],       7, -680876936);
			d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
			b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
			d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
			c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
			d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
			d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

			a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
			d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
			c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
			b = md5_gg(b, c, d, a, x[i],      20, -373897302);
			a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
			d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
			c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
			d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
			c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
			a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
			d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
			c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
			b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
			d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
			b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
			d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
			c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
			d = md5_hh(d, a, b, c, x[i],      11, -358537222);
			c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
			a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
			d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
			b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

			a = md5_ii(a, b, c, d, x[i],       6, -198630844);
			d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
			c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
			d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
			d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
			a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
			d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
			b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
		}
		return [a, b, c, d];
	}

	/*
	* Convert an array of little-endian words to a string
	*/
	function binl2rstr(input) {
		var i,
			output = '';
		for (i = 0; i < input.length * 32; i += 8) {
			output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
		}
		return output;
	}

	/*
	* Convert a raw string to an array of little-endian words
	* Characters >255 have their high-byte silently ignored.
	*/
	function rstr2binl(input) {
		var i,
			output = [];
		output[(input.length >> 2) - 1] = undefined;
		for (i = 0; i < output.length; i += 1) {
			output[i] = 0;
		}
		for (i = 0; i < input.length * 8; i += 8) {
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
		}
		return output;
	}

	/*
	* Calculate the MD5 of a raw string
	*/
	function rstr_md5(s) {
		return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	}

	/*
	* Calculate the HMAC-MD5, of a key and some data (raw strings)
	*/
	function rstr_hmac_md5(key, data) {
		var i,
			bkey = rstr2binl(key),
			ipad = [],
			opad = [],
			hash;
		ipad[15] = opad[15] = undefined;                        
		if (bkey.length > 16) {
			bkey = binl_md5(bkey, key.length * 8);
		}
		for (i = 0; i < 16; i += 1) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
		return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	}

	/*
	* Convert a raw string to a hex string
	*/
	function rstr2hex(input) {
		var hex_tab = '0123456789abcdef',
			output = '',
			x,
			i;
		for (i = 0; i < input.length; i += 1) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F) +
				hex_tab.charAt(x & 0x0F);
		}
		return output;
	}

	/*
	* Encode a string as utf-8
	*/
	function str2rstr_utf8(input) {
		return unescape(encodeURIComponent(input));
	}

	/*
	* Take string arguments and return either raw or hex encoded strings
	*/
	function raw_md5(s) {
		return rstr_md5(str2rstr_utf8(s));
	}
	function hex_md5(s) {
		return rstr2hex(raw_md5(s));
	}
	function raw_hmac_md5(k, d) {
		return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
	}
	function hex_hmac_md5(k, d) {
		return rstr2hex(raw_hmac_md5(k, d));
	}
	
	md5 = function (string, key, raw) {
		if (!key) {
			if (!raw) {
				return hex_md5(string);
			} else {
				return raw_md5(string);
			}
		}
		if (!raw) {
			return hex_hmac_md5(key, string);
		} else {
			return raw_hmac_md5(key, string);
		}
	};
	
	//jquery.md5.js ends
	
for (var i in courses) {
	course_psw.push(courses[i].hashed_psw);
	delete courses[i].hashed_psw;
}

router.get('/', function (req, res, next) {
	db.users.find({}).toArray(function (err, peeps) {
		users = peeps;
	});

	if (req.session.user)
		res.render('index', { title: 'CourseTBD', user: req.session.user, firstname: req.session.firstname, TA: req.session.TA});
	else
		res.render('index', { title: 'CourseTBD'});
});

router.get('/about_us',function (req,res,next){
	res.render("aboutUs",{ title: 'CourseTBD'});
})

router.get('/search_element', function (req, res, next) {
	var text = req.query.text.toLowerCase();
	var obj = {
		"courses": [],
		"users": []
	}
	var pp = [];
	for (var i in courses) {
		if (courses[i].name.toLowerCase().indexOf(text) >= 0) {
			var p = new Promise(function(resolve, reject) {
				var t = (JSON.parse(JSON.stringify(courses[i])));
				db.courses.find({"email": req.session.user, "course_id": t.id.toString()}).toArray(function (err, peeps) {
					var exist = [];
					for (var j = 0; j < t.schedule.length; j++)
						exist[j] = false;
					for (var j = 0; j < peeps.length; j++)
						exist[peeps[j].course_section] = true;
					t["exist"] = exist;
					obj["courses"].push(t);
					resolve();
				})
			})
			pp.push(p);
		}
	}
	for (var i in users) 
		if (users[i].email != req.session.user) {
		if (users[i].firstname.toLowerCase().indexOf(text) >= 0 || users[i].lastname.toLowerCase().indexOf(text) >= 0 || (users[i].firstname + " " + users[i].lastname).toLowerCase().indexOf(text) >= 0 || users[i].email.toLowerCase().indexOf(text) >= 0) {
			var p = new Promise(function(resolve, reject) {
				var x = users[i];
				db.friends.find({$or: [{"first": req.session.user, "second": x.email}, {"second": req.session.user, "first": x.email}]}).toArray(function (err, peeps) {
					delete x.password;
					if (peeps.length == 0)
						x.friendtype = 0;
					else {
						var mutual = false;
						for (var j = 0; j < peeps.length; j++)
							mutual |= peeps[j].complete;
						if (mutual) {
							x.friendtype = 3;
						}else if (peeps[0].second == req.session.user) {
							x.friendtype = 2;
						}else x.friendtype = 1;
					}
					obj["users"].push(x);
					resolve();
				});
			});
			pp.push(p);
		}
	}
	Promise.all(pp).then(function() {
		res.send(obj);
	});
});

router.get('/find_user_by_email', function (req, res, next) {
	var text = req.query.email;
	var obj = {
		"courses": [],
		"users": []
	}
	var pp = [];
	for (var i in users) 
		if (users[i].email != req.session.user) {
		if (users[i].email == text) {
			var p = new Promise(function(resolve, reject) {
				var x = users[i];
				db.friends.find({$or: [{"first": req.session.user, "second": x.email}, {"second": req.session.user, "first": x.email}]}).toArray(function (err, peeps) {
					delete x.password;
					if (peeps.length == 0)
						x.friendtype = 0;
					else {
						var mutual = false;
						for (var j = 0; j < peeps.length; j++)
							mutual |= peeps[j].complete;
						if (mutual) {
							x.friendtype = 3;
						}else if (peeps[0].second == req.session.user) {
							x.friendtype = 2
						}else x.friendtype = 1;
					}
					obj["users"].push(x);
					resolve();
				});
			});
			pp.push(p);
		}
	}
	Promise.all(pp).then(function() {
		res.send(obj);
	})
})

router.get('/course_detail', function (req, res, next) {
	var ok = true;
	if (req.query.id < 0 || req.query.id >= courses.length)
		ok = false;
	if (ok) {
		db.courses.find({"course_id": req.query.id}).toArray(function (err, peeps) {
			var x = (JSON.parse(JSON.stringify(courses[req.query.id])));
			x["users"] = [];
			var used = {};
			var count = 0;
			var pp = [];
			for (var i = 0; i < peeps.length; i++) {
				if (!used[peeps[i].email]) {
					count += 1;
					used[peeps[i].email] = true;
					var ok = false;
					var p = new Promise(function(resolve, reject) {
						var email = peeps[i].email;
						db.friends.find({$or: [{"first": req.session.user, "second": peeps[i].email, "complete": true}, {"second": req.session.user, "first": peeps[i].email, "complete": true}]}).toArray(function (err, peeps1) {
							if (peeps1.length > 0 && peeps1[0].first != peeps1[0].second) {
								db.users.find({"email": email}).toArray(function (err1, peeps2) {
									var xx = peeps2[0];
									xx.friendtype = 3;
									x["users"].push(xx);
									resolve();
								})
							}else
								resolve();
						})
					})
					pp.push(p);
				}
			}
			x["number"] = count;
			var p = new Promise(function (resolve, reject) {
				db.courses.find({"course_id": req.query.id, "email": req.session.user}).toArray(function (err, peeps) {
					var exist = [];
					for (var j = 0; j < x.schedule.length; j++)
						exist[j] = false;
					for (var j = 0; j < peeps.length; j++)
						exist[peeps[j].course_section] = true;
					x["exist"] = exist;
					resolve();
				})
			})
			pp.push(p);
			Promise.all(pp).then(function() {
				res.send(x);
			})
		})
		
	}else res.send("error");
});

router.get('/add_course', function (req, res, next) {
	var ok = true;
	var p1 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
			if (peeps.length < 1)
				ok = false;
			resolve();
		})
	})
	var p2 = new Promise(function(resolve, reject) {
		db.courses.find({"email": req.session.user, "course_id": req.query.id, "course_section": req.query.course_section}).toArray(function(err, peeps) {
			if (peeps.length == 1)
				ok = false;
			resolve();
		})
	})
	var p = [p1, p2];
	if (req.query.id < 0 || req.query.id >= courses.length || req.query.course_section < 0 || req.query.course_section >= courses[req.query.id].schedule.length)
		ok = false;
	Promise.all(p).then(function() {
		if (!ok) {
			res.send("error");
		} else {
			db.courses.insert({"email": req.session.user, "course_id": req.query.id, "course_section": req.query.course_section});
			res.send(courses[req.query.id]);
		}
	})
});

router.get('/remove_course', function (req, res, next) {
	var ok = true;
	var p1 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.session.user}).toArray(function(err, peeps) {
			if (peeps.length < 1)
				ok = false;
			resolve();
		})
	})
	var p2 = new Promise(function(resolve, reject) {
		db.courses.find({"email": req.session.user, "course_id": req.query.id, "course_section": req.query.course_section}).toArray(function(err, peeps) {
			if (peeps.length < 1)
				ok = false;
			resolve();
		})
	})
	var p = [p1, p2];
	Promise.all(p).then(function() {
		if (!ok) {
			res.send("error");
		} else {
			db.courses.remove({"email": req.session.user, "course_id": req.query.id, "course_section": req.query.course_section});
			res.send(courses[req.query.id]);
		}
	})
});

router.get('/get_course', function (req, res, next) {
	var ok = true;
	var p1 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.session.user}).toArray(function(err, peeps) {
			if (peeps.length < 1)
				ok = false;
			resolve();
		})
	})
	Promise.all([p1]).then(function() {
		if (!ok) {
			res.send("error");
		} else {
			res.send(courses[req.query.id]);
		}
	})
});

router.get('/find_user_courses', function (req, res, next) {
	var used = [];
	db.courses.find({"email": req.session.user}).toArray(function (err, peeps) {
		var data = {};
		data["announcements"] = [];
		data["courses"] = [];
		var pp = [];
		for (var i = 0; i < peeps.length; i++) {
			var p = {};
			p["course"] = courses[peeps[i].course_id];
			p["section"] = peeps[i].course_section;
			if (!used[peeps[i].course_id]) {
				used[peeps[i].course_id] = true;
				var p1 = new Promise(function (resolve, reject) {
					var course_id = peeps[i].course_id;
					db.TA.find({"course_id": course_id, "user": req.session.user}).toArray(function (err, peeps2) {
						var is = false;
						if (peeps2.length > 0)
							is = true;
						db.announcement.find({"course_id": course_id}).toArray(function (err, peeps1) {
							for (var j = 0; j < peeps1.length; j++) {
								peeps1[j].TA = is;
								peeps1[j].course_id = courses[peeps1[j].course_id].name.split(' ')[0];
								data["announcements"].push(peeps1[j]);
							}
							resolve();
						})
					})
				})
				pp.push(p1);
			}
			data["courses"].push(p);
		}
		db.events.find({"user": req.session.user}).toArray(function (err, peeps) {
			data["events"] = peeps;
			Promise.all(pp).then(function() {
				res.send(data);
			});
		})
		
	})
});

router.get('/find_announcement_by_id', function (req, res, next) {
	var mongo = require('mongodb');
	var o_id = new mongo.ObjectID(req.query._id);

	db.announcement.find({"_id": o_id}).toArray(function (err, peeps) {
		// console.log(o_id);
		if (peeps.length == 0) {
			res.send("");
		}else {
			db.TA.find({"user": req.session.user, "course_id": peeps[0].course_id}).toArray(function (err, peeps1) {
				if (peeps1.length > 0) {
					peeps[0].TA = true;
				}else
					peeps[0].TA = false;
				peeps[0].course_id = courses[peeps[0].course_id].name.split(' ')[0];
				res.send(peeps[0]);
			})
		}
	})
})

router.get('/friends_requests', function (req, res, next) {
	var obj = {
		"courses": [],
		"users": []
	}
	db.friends.find({"second": req.session.user, "complete": false}).toArray(function(err, peeps) {
		db.users.update({email: req.session.user}, {$set: {unseenreq: 0}}, {multi: true});
		var pp = [];
		for (var i = 0; i < peeps.length; i++) {
			var p = new Promise(function(resolve, reject) {
				db.users.find({"email": peeps[i].first}).toArray(function(err, peeps1) {
					var x = peeps1[0];
					delete x.password;
					x.friendtype = 2;
					obj["users"].push(x);
					resolve();
				})
			})
			pp.push(p);
		}
		Promise.all(pp).then(function() {
			res.send(obj);	
		});
	})
});

router.get('/friends_list', function (req, res, next) {
	var obj = {
		"courses": [],
		"users": []
	}
	db.friends.find({$or: [{"first": req.session.user, "complete": true}, {"second": req.session.user, "complete": true}]}).toArray(function (err, peeps) {
		var pp = [];
		for (var i = 0; i < peeps.length; i++) {
			var p = new Promise(function(resolve, reject) {
				if (peeps[i].first != req.session.user)
					db.users.find({"email": peeps[i].first}).toArray(function(err, peeps1) {
						var x = peeps1[0];
						delete x.password;
						x.friendtype = 3;
						obj["users"].push(x);
						resolve();
					})
				else if (peeps[i].second != req.session.user)
					db.users.find({"email": peeps[i].second}).toArray(function(err, peeps1) {
						var x = peeps1[0];
						delete x.password;
						x.friendtype = 3;
						obj["users"].push(x);
						resolve();
					})
				else resolve();
			})
			pp.push(p);
		}
		Promise.all(pp).then(function() {
			res.send(obj);	
		});
	})
});

router.get('/Accept_friend', function (req, res, next) {
	var ok = true;
	var p0 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	var p1 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.query.email}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	var p2 = new Promise(function(resolve, reject) {
		db.friends.find({"second": req.session.user, "first": req.query.email, "complete": false}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	Promise.all([p0, p1, p2]).then(function() {
		if (!ok) res.send("error");
		else {
			db.friends.update({"second": req.session.user, "first": req.query.email}, {$set: {complete: true}}, {multi: true});
		
			var x = new Date().toString().substring(0, 21);
			x = x.substring(3, 15) + " at " + x.substring(16, 21);
			db.notification.insert({"user": req.query.email, "info": req.session.firstname + " accepted your friend request on "+ x, "seen": false, "type": "friend", "id": req.session.user});
			res.send("ok");
		}
	})
});

router.get('/Reject_friend', function (req, res, next) {
	var ok = true;
	var p0 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	var p1 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.query.email}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	var p2 = new Promise(function(resolve, reject) {
		db.friends.find({"second": req.session.user, "first": req.query.email, "complete": false}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	Promise.all([p0, p1, p2]).then(function() {
		if (!ok) res.send("error");
		else {
			db.friends.remove({"second": req.session.user, "first": req.query.email});
			res.send("ok");
		}
	})
});

router.get('/Add_friend', function (req, res, next) {
	var ok = true;
	var p0 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	var p1 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.query.email}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	var p2 = new Promise(function(resolve, reject) {
		db.friends.find({$or: [{"first": req.session.user, "second": req.query.email}, {"second": req.session.user, "first": req.query.email}]}).toArray(function (err, peeps) {
			if (peeps.length > 0)
				ok = false;
			resolve();
		});
	});
	Promise.all([p0, p1, p2]).then(function() {
		if (!ok) res.send("error");
		else {
			db.friends.insert({"first": req.session.user, "second": req.query.email, "complete": false});
			db.users.find({"email": req.query.email}).toArray(function (err, peeps) {
				if (peeps.length > 0)
				db.users.update({"email": req.query.email}, {$set: {unseenreq: peeps[0].unseenreq + 1}}, {multi: true});
			})
			res.send("Request Sent");
		}
	})
});

router.get('/See_friend', function (req, res, next) {
	var ok = true;
	var p0 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	var p1 = new Promise(function(resolve, reject) {
		db.users.find({"email": req.query.email}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	var p2 = new Promise(function(resolve, reject) {
		db.friends.find({$or: [{"first": req.session.user, "second": req.query.email, "complete" : true}, {"second": req.session.user, "first": req.query.email, "complete": true}]}).toArray(function (err, peeps) {
			if (peeps.length == 0)
				ok = false;
			resolve();
		});
	});
	Promise.all([p0, p1, p2]).then(function() {
		if (!ok) res.send("error");
		else {
			db.courses.find({"email": req.query.email}).toArray(function (err, peeps) {
				var obj = {
					"courses": [],
					"users": []
				}
				var pp = [];
				for (var i = 0; i < peeps.length; i++) {
					var p = new Promise(function (resolve, reject) {
						var xx = (JSON.parse(JSON.stringify(courses[peeps[i].course_id])));
						xx["course_section"] = peeps[i].course_section;
						db.courses.find({"email": req.session.user, "course_id": peeps[i].course_id}).toArray(function (err, peeps) {
							var exist = [];
							for (var j = 0; j < xx.schedule.length; j++)
								exist[j] = false;
							for (var j = 0; j < peeps.length; j++)
								exist[peeps[j].course_section] = true;
							xx["exist"] = exist;
							obj["courses"].push(xx);
							resolve();
						})
					})
					pp.push(p);
				}
				Promise.all(pp).then(function() {
					res.send(obj);
				})
			})
		}
	})
});

router.get('/login', function (req, res, next) {
	var email = req.query.email, password = req.query.password;
	db.users.find({"email": req.query.email}).toArray(function (err, peeps) {
		if (peeps.length > 0 && peeps[0].password == req.query.password) {
			req.session.user = email;
			req.session.firstname = peeps[0].firstname;
			req.session.TA = peeps[0].TA;
			res.render('index', { title: 'CourseTBD', user: req.session.user, firstname: req.session.firstname, TA: req.session.TA});
		}else {
			res.send("Invalid email or password");
		}
	});
});

router.get('/logout', function (req, res, next) {
	req.session.reset();
	res.render('index', { title: 'CourseTBD'});
});

router.get('/register', function (req, res, next) {
	var d = new Date();
	if (d.toString().substring(0, 10) != predate) {
		predate = d.toString().substring(0, 10);
		ips = [];
	}
	console.log(ips[req.ip]);
	if (ips[req.ip] >= 5) {
		res.send("Your ip has been temporarily blocked due to suspicious behavior.");
		return ;
	}
	db.users.find({"email": req.query.email}).toArray(function (err, peeps) {
		if (peeps.length > 0) {
			res.send("Email already exists");
		}else {
			db.pending.remove({"email": req.query.email});
			var psc = md5(req.query.email, req.query.password);
			psc = md5(psc, Math.random());
			db.pending.insert({"email": req.query.email, "password": req.query.password, "firstname": req.query.firstname, "lastname": req.query.lastname, passcode: psc});
			var email = require('mailer');
			email.send({
				host : "smtp.gmail.com",
				port : "465",
				ssl : true,
				domain : "domain.com",
				to : req.query.email,
				from : "coursetbd@gmail.com",
				subject : "Welcome to Course TBD",
				html: "Click on this link to complete your sign up process:<a href=http://coursetbd.eastus.cloudapp.azure.com/activate?email="+req.query.email+"&passcode="+psc+">link</a>",
				authentication : "login",        // auth login is supported; anything else $
				username : 'coursetbd@gmail.com',
				password : 'coursetbd!#9&0,/%7-=+7.j'
				},
				function(err, result){
					if(err){ res.send("error");self.now.error(err); console.log(err); return;}
					else {
						if (!ips[req.ip]) {
							ips[req.ip] = 1;
						}else {
							ips[req.ip] += 1;
						}
						res.send("good");
						console.log('looks good');
					}
			});

		}
	});
});

router.get('/activate', function (req, res, next) {
	req.session.reset();
	db.pending.find({"email": req.query.email, "passcode": req.query.passcode}).toArray(function (err, peeps) {
		if (peeps.length == 0) {
			res.redirect('/');
		}else {
			db.users.insert({"email": peeps[0].email, "password": peeps[0].password, "firstname": peeps[0].firstname, "lastname": peeps[0].lastname});
			db.friends.insert({"first": peeps[0].email, "second": peeps[0].email, "complete": true});
			users.push({"email": peeps[0].email, "password": peeps[0].password, "firstname": peeps[0].firstname, "lastname": peeps[0].lastname});
			db.pending.remove({"email": req.query.email, "passcode": req.query.passcode});
			req.session.user = peeps[0].email;
			req.session.firstname = peeps[0].firstname;
			res.redirect('/');
		}
	})
})

router.get('/setting', function (req, res, next) {
	db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
		if (peeps.length > 0) {
			if (peeps[0].password == req.query.password_o) {
				if (req.query.password.length > 0)
					db.users.update({email: req.session.user}, {$set: {password: req.query.password}}, {multi: true});
				if (req.query.firstname.length > 0) {
					db.users.update({email: req.session.user}, {$set: {firstname: req.query.firstname}}, {multi: true});
					req.session.firstname = req.query.firstname;
				}
				if (req.query.lastname.length > 0)
					db.users.update({email: req.session.user}, {$set: {lastname: req.query.lastname}}, {multi: true});
				res.send("Successful!");
			}else res.send("Wrong Password");
		}else res.send("error");
	});
});

router.get('/getuser', function (req, res, next) {
	res.send(req.session.user);
});

router.get('/ta_authorization_submit', function (req, res, next) {
	db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
		if (peeps.length == 0) {
			res.send("error");
			return ;
		}
		var find = false;
		for (var i in course_psw)
		if (courses[i].name.split(' ')[0] == req.query.course && req.query.passcode == course_psw[i]) {
			find = true;
			db.users.update({email: req.session.user}, {$set: {TA: true}}, {multi: true});
			req.session.TA = true;
			db.TA.find({"user": req.session.user, "course_id": i}).toArray(function (err, peeps1) {
				if (peeps1.length > 0) {
					res.send("Already exist");
				}else {
					db.TA.insert({"user": req.session.user, "course_id": i});
					res.send("Successful");
					if (courses[i].schedule.length > 0)
						db.courses.insert({"email": req.session.user, "course_id": i, "course_section": "0"});
				}
			})
			return ;
		}
		if (!find)
			res.send("Wrong Passcode");
	})
})

router.get('/ask_notification', function (req, res, next) {
	console.log(req.session.user);
	var info = {};
	db.notification.find({"user": req.session.user, "seen": false}).toArray(function (err, peeps) {
		info["notification"] = peeps;
		db.notification.update({"user": req.session.user, "seen": false}, {$set: {"pushed": true}}, {multi: true});
		db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
			if (peeps.length > 0)
				info["request"] = peeps[0].unseenreq;
			res.send(info);	
		})
	})
})

router.get('/notification', function (req, res, next) {
	db.notification.find({"user": req.session.user}).toArray(function (err, peeps) {
		var info = [];
		for (var i = 0; i < peeps.length; i++) {
			info.push(peeps[i]);
		}
		res.send(info);
		db.notification.update({"user": req.session.user}, {$set: {"seen": true}}, {multi: true});
	});
})

router.get('/getTAcourses', function (req, res, next) {
	db.TA.find({"user": req.session.user}).toArray(function (err, peeps) {
		var x = [];
		for (var i = 0; i < peeps.length; i++)
			x.push(courses[peeps[i].course_id].name.split(' ')[0]);
		res.send(x);
	})
})

router.get('/create_announcement', function (req, res, next) {
	var course_id = -1;
	for (var i in courses)
		if (courses[i].name.split(' ')[0] == req.query.course)
			course_id = i;
	if (course_id == -1) {
		res.send("error");
	}else
	db.TA.find({"user": req.session.user, "course_id": course_id}).toArray(function (err, peeps) {
		if (peeps.length == 0) {
			res.send("error");
		}else {
			var data = {"course_id": course_id, "type": req.query.type, "location": req.query.location, "time": req.query.time, "duration": req.query.duration, "description": req.query.description, "repeated": req.query.repeated};
			// console.log(data);
			db.announcement.insert(data);
			res.send("Successful");
			var iid = data._id;
			db.courses.find({"course_id": course_id}).toArray(function (err, peeps) {
			var used = [];
			var course = courses[course_id].name.split(' ')[0];
			for (var i = 0; i < peeps.length; i++)
				if (!used[peeps[i].email]) {
					used[peeps[i].email] = true;
					var x = new Date().toString().substring(0, 21);
					x = x.substring(3, 15) + " at " + x.substring(16, 21);
					db.notification.insert({"user": peeps[i].email, "info": "Your " + course + " TA posted a new announcement on "+x, "seen": false, "type": "announcement", "id": iid});
				}
			})
		}
	})
})

router.get('/add_event', function (req, res, next) {
	db.users.find({"email": req.session.user}).toArray(function (err, peeps) {
		if (peeps.length == 0) {
			res.send("error");
		}else {
			data = {"user": req.session.user, "title": req.query.title, "location": req.query.location, "time": req.query.time, "duration": req.query.duration, "description": req.query.description, "repeated": req.query.repeated};
			db.events.insert(data);
			res.send("Successful");
		}
	})
})

router.get('/remove_announcement', function (req, res, next) {
	var mongo = require('mongodb');
	var o_id = new mongo.ObjectID(req.query._id);
	
	db.announcement.find({"_id": o_id}).toArray(function (err, peeps) {
		if (peeps.length == 0)
			res.send("error1");
		else {
			db.TA.find({"user": req.session.user, "course_id": peeps[0].course_id}).toArray(function (err, peeps1) {
				if (peeps1.length == 0) {
					res.send("error2");
				}else {
					db.announcement.remove({"_id": o_id});
					res.send("ok");
				}
			})
		}
	})
})

router.get('/remove_event', function (req, res, next) {
	var mongo = require('mongodb');
	var o_id = new mongo.ObjectID(req.query._id);
	
	db.events.find({"_id": o_id}).toArray(function (err, peeps) {
		if (peeps.length == 0)
			res.send("error1");
		else {
			if (peeps[0].user != req.session.user)
				res.send("error2");
			else {
					db.events.remove({"_id": o_id});
					res.send("ok");
				}
		}
	})
})

router.get('/facebook_login', function (req, res, next) {
	var data = req.query.data;
	var email = data["me"].id + "@facebook.com";
	var firstname = "";
	var lastname = "";
	if (data["me"].name.split(' ').length > 0) {
		firstname = data["me"].name.split(' ')[0];
		lastname = data["me"].name.split(' ')[data["me"].name.split(' ').length - 1];
	}else firstname = data["me"].name;
	req.session.reset();
	req.session.user = email;
	req.session.firstname = firstname;
	db.users.find({"email": email}).toArray(function (err, peeps) {
		if (peeps.length > 0) {
			req.session.TA = peeps[0].TA;
		}else {
			db.users.insert({"email": email, "firstname": firstname, "lastname": lastname, "unseenreq": 0, "TA": false});
			req.session.TA = false;
			for (var i = 0; i < data["friends"]["data"].length; i++) {
				db.users.find({"email": data["friends"]["data"][i].id + "@facebook.com"}).toArray(function (err, peeps) {
				if (peeps.length > 0) {
						db.friends.insert({"first": email, "second": peeps[0].email, "complete": false});
						db.users.update({"email": peeps[0].email}, {$set: {unseenreq: peeps[0].unseenreq + 1}}, {multi: true});
					}
				})
			}
		}
		res.send("ok");
	})
})

module.exports = router;
