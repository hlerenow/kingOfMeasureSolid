let util = {

};


/**
 * 获取一个指定长度的随机字符串
 * @param  {[type]} count [description]
 * @return {[type]}       [description]
 */
util.randomString = function(count) {
	return Math.random().toString(32).substring(3, count + 3);
}


/**
 * 判断对象是否为空对象
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
util.isEmptyObj = function(obj) {
	for (var i in obj) {
		return false;
	}

	return true;
}

/**
 * 即将字符串转换为Json对象变量，添加容错处理，解析失败时返回false 
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
util.strToJson = function(str) {
	if (str == "") {
		return false;
	}
	var res = {};
	try {
		res = JSON.parse(str);
	} catch (e) {
		return false;
	}

	return res;
};



/**
 * 判断一个点是否在多边形内部
 * 在边界上也返回 false ，多边形的点的顺时针或者逆时针绘制，杂乱无章的顺序点 会  或判断错误
 * @return {[type]} [description]
 */
util.ponitInField = function(point, vs) {


	var x = parseFloat(point[0]),
		y = parseFloat(point[1]);

	var inside = false;

	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = parseFloat(vs[i][0]),
			yi = parseFloat(vs[i][1]);
		var xj = parseFloat(vs[j][0]),
			yj = parseFloat(vs[j][1]);

		var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

		if (intersect) inside = !inside;
	}

	return inside;
}



/*Ga统计事件分析*/
util.googleAnalysisEvent = function(eventType, value) {
	ga('send', 'event', {
		'eventCategory': eventType,
		eventAction: 'click',
		eventLabel: value
	});
}

/*生长阶段颜色数组*/
util.groupBrandColors = ['#81c784', '#cddc39', '#4caf50', '#ffc107', '#ff5722', '#009688'];



/*地理度转度分秒*/
util.DtoDFM = function(degreen) {
	degreen = parseFloat(degreen);

	/*度*/
	var dFlage = degreen / degreen;
	var d = Math.floor(degreen);
	var f = Math.floor((degreen - d) * 60);
	var m = Math.floor(((degreen - d) * 60 - f) * 60);

	return {
		flage: dFlage,
		degreen: d,
		minutes: f,
		seconds: m
	}
}

/*将数据格式化为字符串*/

util.formatDegreenStr = function(lat, lng) {
	var la = this.DtoDFM(lat);
	var ln = this.DtoDFM(lng);

	var laStr = "";
	var lnStr = "";

	if (la.flage > 0) {
		laStr += "N ";
	} else {
		laStr = "S "
	}

	laStr += la.degreen + " 度 " + la.minutes + " 分 " + la.seconds + " 秒";

	if (ln.flage > 0) {
		lnStr += "E ";
	} else {
		lnStr = "W "
	}

	lnStr += ln.degreen + " 度 " + ln.minutes + " 分 " + ln.seconds + " 秒";

	return {
		latStr: laStr,
		lngStr: lnStr,
		latSource: la,
		lngSource: ln,
		latDir: {
			'-1': "S",
			"1": "N"
		},
		lngDir: {
			'-1': 'W',
			"1": "E"
		}
	}
}

export default util;