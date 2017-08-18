/*leaflet */
import L from 'leaflet';
/*leaflet产 编辑插件*/

export const a = function() {
	console.log("test");
}

/*地图贴图配置*/
const mapconf = {
	googleNewMapUrl: "http://www.google.cn/maps/vt?lyrs=s,h@726&gl=cn&x={x}&y={y}&z={z}",
	gaodeUrl: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
	urlSatellite: 'http://www.google.cn/maps/vt?lyrs=s,h&gl=cn&x={x}&y={y}&z={z}', //只有卫星图没有坐标
	url: "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
	url: "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
	annotion: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
}

/*生成一个长度可控的随机字符串*/
export const randomString = function(count) {
	return Math.random().toString(32).substring(3, count + 3);
}

/*判读对象是否为空*/
export const isEmptyObj = function(obj) {
	for (var i in obj) {
		return false;
	}
	return true;
}

/*创建一个leaflet地图实例，并返回*/
export const createMap = function(mapId, options) {
	options = options || {};
	const defaultOption = {
		zoomControl: false, //缩放控件
		attributionControl: false, //右下角角标
		maxZoom: 24,
		dragging: true,
		zoom: 4
	};

	var _opt = Object.assign(defaultOption, options);

	const map = L.map(mapId, _opt);

	/*选择卫星图*/
	L.tileLayer(mapconf.urlSatellite, {
		maxZoom: 24,
		maxNativeZoom: 20,
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
	}).addTo(map);

	return map;
}

/*画一个圆圈*/
export const addCircle = function(map, pos, options) {
	options = options || {};
	var _opt = Object.assign({
		radius: 10,
		color: "#3fd9af",
		fillColor: "green",
		fillOpacity: 1,
		borderWidth: 1
	}, options);
	var handle = L.circleMarker(pos, _opt);
	handle.addTo(map);
	return handle;
}

/*画一条线*/
export const addLine = function(map, pos1, pos2, options) {
	var _opt = Object.assign({
		opacity: 0.6,
		weight: 2,
		color: '#fff',
		lineCap: 'square',
	}, options);

	var line = L.polyline([pos1, pos2], _opt).addTo(map);

	return line;
}

/*画一个多边形*/
export const addPolygon = function(map, latlngs, options) {

	var latlngs = latlngs;

	var _opt = Object.assign({
		color: "white",
		opacity: 1,
		weight: 1,
		fill: true,
		fillColor: "green",
		fillOpacity: 0.5,
	}, options || {});

	var handle = L.polygon(latlngs, _opt).addTo(map);
	this.map.fitBounds(handle.getBounds());
	return handle;
}

export const getComutedStyle = function(el) {
	var style = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle;
	return style;
}

export const calculateArea = function(latLngs) {
	var pointsCount = latLngs.length,
		area = 0.0,
		d2r = Math.PI / 180,
		p1, p2;

	if (pointsCount > 2) {
		for (var i = 0; i < pointsCount; i++) {
			p1 = latLngs[i];
			p2 = latLngs[(i + 1) % pointsCount];
			area += ((p2[1] - p1[1]) * d2r) *
				(2 + Math.sin(p1[0] * d2r) + Math.sin(p2[0] * d2r));
		}
		area = area * 6378137.0 * 6378137.0 / 2.0;
	}

	return Math.abs(area);
}