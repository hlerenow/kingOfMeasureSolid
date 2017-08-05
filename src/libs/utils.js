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
	var x = point[0],
		y = point[1];

	var inside = false;

	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {

		var xi = vs[i][0],
			yi = vs[i][1];
		var xj = vs[j][0],
			yj = vs[j][1];

		var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

		if (intersect) inside = !inside;
	}
	return inside;
};

/*格式化面积单位*/
util.fomatArea = function(area) {
	area = parseFloat(area);
	if (area < 10000) {
		return area.toFixed(2) + " 平方米";
	} else {
		return (area / 10000).toFixed(2) + " 公顷";
	}
}


/*设备中文名映射*/
util.getDevDataName = function(val) {
	switch (val.toLowerCase()) {
		case 'lux':
			return "光照强度";
			break;
		case 'air_temperature':
			return '空气温度';
			break;
		case 'humidity':
			return '空气湿度';
			break;
		case 'wind_speed':
			return '风速';
			break;
		case 'pressure':
			return '压强';
			break;
		case 'soil_temperature':
			return '土壤温度';
			break;
		case 'depth_temperature':
			return '土壤温度';
			break;
		case 'soil_moisture':
			return '土壤湿度';
			break;
		case 'soil_conductivity':
			return '土壤传导率';
			break;
		case 'co2':
			return '二氧化碳浓度';
			break;
		case 'rain_hourly':
			return '降雨量';
			break;
		case 'surface_temperature':
			return '土壤表层温度';
			break;
		case 'depth_temperature':
			return '土壤分层温度';
			break;

	}

	return "";
}

/*设备读数单位映射*/
util.getDevDataUnit = function(val) {
	switch (val) {
		case 'lux':
			return "lux";
			break;
		case 'air_temperature':
			return '℃';
			break;
		case 'humidity':
			return '%';
			break;
		case 'wind_speed':
			return 'm/s';
			break;
		case 'pressure':
			return 'hpa';
			break;
		case 'soil_temperature':
			return '℃';
			break;
		case 'depth_temperature':
			return '℃';
			break;
		case 'soil_moisture':
			return '';
			break;
		case 'soil_conductivity':
			return '';
			break;
		case 'co2':
			return 'ppm';
			break;
		case 'rain_hourly':
			return 'mm';
			break;
		case 'surface_temperature':
			return '℃';
			break;
		case 'depth_temperature':
			return '℃';
			break;
	}

	return "";
}



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

/*将后端字段转化为 前端字段 映射 ，完全可以不必要的*/
util.mapValEndToFont = function(data) {
	var res = {};

	for (var i in data) {
		if (i == 'air_temperature') {
			res['airT'] = data[i]
			continue;
		}

		if (i == 'wind_speed') {
			res['windSpeed'] = data[i];
			continue;
		}

		if (i == 'soil_moisture') {
			res["soilMositure"] = data[i];
			continue;
		}

		if (i == 'soil_temperature') {
			res["soilT"] = data[i];
			continue;
		}

		if (i == 'soil_conductivity') {
			res["soilConductivity"] = data[i];
			continue;
		}
		if (i == 'rain_hourly') {
			res["rainfall"] = data[i];
			continue;
		}

		res[i] = data[i];
	}

	return res;
}

/*为中间件服务，将字段名准华为中间件字段名*/
util.mapValFrontToEnd = function(i) {

	if (i == 'airT') {

		return 'air_temperature';
	}

	if (i == 'windSpeed') {
		return 'wind_speed';
	}

	if (i == 'soilMositure') {
		return 'soil_moisture';
	}

	if (i == 'soilT') {
		return "soil_temperature";
	}

	if (i == 'soilConductivity') {
		return "soil_conductivity";
	}

	if (i == 'rainfall') {
		return "rain_hourly";
	}

	return i;
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


/*判断光照状态*/
util.judgeLuxState = function(lux) {
	lux = parseFloat(lux);
	if (lux <= 200) {
		return '无光';
	}

	if (lux <= 2000) {
		return "光照微弱";
	}

	if (lux <= 5000) {
		return "光照弱";
	}

	if (lux <= 10000) {
		return "光照不足";
	}
	if (lux <= 20000) {
		return "光照较充足";
	}

	if (lux <= 40000) {
		return "光照充足";
	}

	if (lux <= 80000) {
		return "光照较强烈";
	}

	return "光照强烈";
}

/*判断风速*/
util.judgeWindSpeed = function(windSpeed) {
	windSpeed = parseFloat(windSpeed);

	if (windSpeed <= 0.2) {
		return "无风";
	}

	if (windSpeed <= 5.5) {
		return '风力柔和';
	}

	if (windSpeed <= 10.8) {
		return "风力较强";
	}

	return "风力强";
}

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