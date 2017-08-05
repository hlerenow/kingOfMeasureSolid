import util from "libs/utils";

/*格式化单个设备读数*/
export const getDevTabDataSingle=function(devices){
	var res=[];


	for(var i=0;i<devices.length;i++){
		var dev=devices[i];
		
		/*是st传感器,跳过*/


		if(dev.device.toLowerCase().indexOf('st')>-1){
			continue;
		}
		var latest_reading=dev.latest_reading;

		for(var j in dev.latest_reading){

			var temp={
				type:"single",
				key:j,
				name:util.getDevDataName(j),
				value:latest_reading[j],
				unit:util.getDevDataUnit(j),
				readTime:dev.last_reading_time,
				devId:dev.device
			};

			res.push(temp);
		}
	}
	return res;
}	

/* 格式化 多个读数的 设备 数据*/
export const getDevTabDataMul=function(devices){
	var res=[];
	/*循环设备*/
	for(var i=0;i<devices.length;i++){
		var dev=devices[i];

		/*不是st传感器,跳过*/
		if(dev.device.toLowerCase().indexOf('st')<0){
			continue;
		}
		
		var latest_reading=dev.latest_reading;
		for(var j in dev.latest_reading){
			var data=latest_reading[j];
			if(typeof data!="object"){
				var temp={
					type:"single",
					key:j,
					name:util.getDevDataName(j),
					value:data,
					unit:util.getDevDataUnit(j),
					readTime:dev.last_reading_time,
					devId:dev.device
				};
			}else{
				var temp={
					type:"multipart",
					key:j,
					name:util.getDevDataName(j),
					value:data['20']||data['40']||data['60']||data['80']||data['100']||data['120']||data['140']||data['160']||"",
					unit:util.getDevDataUnit(j),
					readTime:dev.last_reading_time,
					devId:dev.device
				};
			}
			res.push(temp);
		}
	}

	return res;
}

/*获取某一块土地的的设备*/
export const getFieldDev=function(field,allDevs){
	var result=[];
	var tempBouds = field.bounds.slice(0, field.bounds.length - 1);

	for(var j in allDevs){
		var dev=allDevs[j];
		/*如果设备没有坐标,则过滤*/
		if(!dev.location||!dev.location.lat||!dev.location.lon){
			continue;
		}

		/*修改数据 location 为数组*/
		dev.location=[dev.location.lat,dev.location.lon];

		
		if(util.ponitInField(dev.location,tempBouds)){
			result.push(dev);
		}
	}
	return result;
}