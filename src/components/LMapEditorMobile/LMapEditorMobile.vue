<template>
	<div class="l-map-mobile-wrap">
    <location id="location"></location>
    <choose-field-page :visable="painterState==1" ></choose-field-page>
    <mt-header  v-show="painterState==0" title="圈地中..." class="header">
        <template slot="left">
          <div id="come-back" @click="clearPrePoint" class="tool">撤销</div>
        </template>
        <template slot="right">
          <div id="finish" class="tool" @click="chooseFieldFinish">完成</div>
        </template>
    </mt-header>  
    <div :id="mapId" class="l-map choose-field">
      <div id="add-point" v-show="painterState!=1" class="hover-botton"></div>
			<div id="add-point-btn" v-show="painterState!=1" @click="addFieldPoint"  ></div>
		</div>	
	</div>
</template>
<script>

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import * as util from "./util"
import chooseFieldPage from "components/chooseFieldPage/chooseFieldPage"
import {Button,Header} from "mint-ui"
import Location from "@/components/Location/location"
  



export default {

  name: 'LMapEditorMobile',

  data () {
    return {
      initOk:false,
    	mapId:util.randomString(6),
    	painterState:-1,//-1  可以圈地 ，0 圈地中 ， 1 圈地结束
    	map:null,
    	/*是否进如选地状态*/
    	drawStart:false, 
    	/*当前土地的*/
    	pointQuene:[],
    	/*当前点实例*/
    	nowPoint:null,
    	/*当前土地多边形 实例*/
    	polygon:null,
      vrPoint:null,
      /*解决颜色填充不了bug*/
      bounds:[]
    };
  },
  components:{
    mtButton:Button,
    [Header.name]:Header,
    chooseFieldPage,
    Location
  },
  props:{
  	fields:{
  		default:function(){
  			return [];
  		}
  	},
    visable:{
      default:false
    }
  },
  watch:{
  	fields:function(newVal){
  		/*画出所有的回显 土地*/
  	},
    visable:function(val){
      if(val){
        if(!this.initOk){
          console.log(this.initOk);
           this.initMap();
           this.initOk=true;
        }
      }
    }
  },
  mounted(){
    if(this.visable){
      this.initMap();
      /*回显完成*/
      if(this.visable){
        this.initOk=true;
      }
    }
  },
  methods:{
  	...util,
    initMap(){
      /*注册事件 */

      this.$bus.$on("reChoose",()=>{
        this.reset();
      });

      var _this=this;
      this.$bus.$on("searchFinish",(payload)=>{

        _this.map.panTo(payload.pos);
        payload.pos=eviltransform.bd2gcj(payload.pos.lat,payload.pos.lng);
        let redIcon=L.icon({
            iconUrl: 'static/location-blue.png',
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -20]
          });

        L.marker(payload.pos,{
          "icon":redIcon
        }).addTo(_this.map);
      });

      if(this.map){
        this.map.remove();
      }
      /* 获取添加点的 btn  dom 元素 */
      this.addPointDom = document.getElementById('add-point');

      this.map = this.createMap(this.mapId);

      this.map.on("move",(e)=>{
        if(this.painterState==0){
          // this.addDashedLine();
        }
      });

      this.localtion();
    },
  	addFieldPoint(){
		  	var newPointPos=this.getWillPointLatLang();
	  		var line=null;
        /*判断属否可以圈地*/
        if(this.painterState==-1){
          this.painterState=0;
        }else if(this.painterState==1){
          return;
        }

	  		/*判断圈地是否结束*/
        if(this.pointQuene.length>2&&this.isFinish(newPointPos,this.pointQuene[0].latlngPos)){
          console.log("结束圈地");
          this.chooseFieldFinish();
	  			return;
	  		}


	  		if(this.pointQuene.length>0){
					line = this.addLine(this.map, this.pointQuene[this.pointQuene.length - 1].latlngPos, newPointPos);
	  		}
	  		
	  		/*添加 绘画过程 中的 实点*/
				var point = this.addCircle(this.map, newPointPos, {
					fill: true,
					fillColor: 'white',
					fillOpacity: 1,
					radius: 8,
          color:'#20a0ff'
				});


        /*添加记录过程中的点*/
        this.bounds.push([newPointPos.lat,newPointPos.lng]);
        /*这个变量储存的值，leaflet移动端 填充 多边形 路劲 会 有问题，*/
	  		this.pointQuene.push({
	    		/*点的实例*/
	    		point:point,
	    		latlngPos:newPointPos,
	    		/*点对应的线条实例，第一个点没有线条实例*/
	    		line:line  			
	  		});
  	},
    chooseFieldFinish(){
        /*点不能少于3个*/
        if(this.bounds.length<3){
          return;
        }

        this.$bus.$emit("finish",this.bounds);
        /*改变 绘画状态*/
        this.painterState=1;
        /*移除虚拟点*/
        if(this.vrPoint){
          this.vrPoint.remove();
        }


        /*移除所有的绘画中的点*/
        this.clearAllPoint();


        /*创建可编辑的土地*/
        this.createField();
    },
    addDashedLine() {
      if (this.pointQuene.length < 1) {
        return;
      }

      if (this.vrPoint) {
        this.vrPoint.remove();
      }

      var willPoint = this.getWillPointLatLang();
      var lastPoint = this.pointQuene[this.pointQuene.length - 1].latlngPos;
      this.vrPoint = this.addLine(this.map, lastPoint, willPoint, {
        dashArray: '8, 10',
        opacity: 0.8,
        weight: 3,
        color: '#fff',
        lineCap: 'square',
        className: "point-pre"
      });
    },
  	getWillPointLatLang(){
	  	var pos=this.addPointDom.getBoundingClientRect();
	  	var domCenter={
	  		x:(pos.left+pos.right)/2-4,
	  		y:(pos.top+pos.bottom)/2-4
	  	}  		

  		return this.map.containerPointToLatLng(domCenter); 		
  	},
  	/*撤销功能*/
  	clearPrePoint(){
      /*在绘画过程中才可以撤销*/
      if(this.painterState!=0){
        return;
      }

      var point=this.pointQuene.pop();
          this.bounds.pop();
      if(this.pointQuene.length!=0){
        // this.addDashedLine();
      }else{
        this.clearAllPoint();
        this.painterState=-1;
      }

      if(point){
        point.point.remove();
        if(point.line){
          point.line.remove();
        }
      }
  	 
    },
  	/*判断是否选择结束*/
  	isFinish(pos1,pos2){
  		var pos1Px=this.map.latLngToContainerPoint(pos1);
  		var pos2Px=this.map.latLngToContainerPoint(pos2);
  		var distance=pos1Px.distanceTo(pos2Px);
  		if(distance<30){
  			return true;
  		}else{
  			return false;
  		}
  	},
  	/*生成可编辑的土地多边形*/
  	createField(){
      var tempB=this.getFieldBounds();

      tempB=[].concat(tempB);

      this.ploygon=this.addPolygon(this.map,this.bounds,{
      });
  	},
  	/*回显土地*/
  	showField(){
      var showField= this.showFields();
      for(var i in showFields){
        this.addPolygon(this.map,showField[i].bounds);
      }
  	},
    getFieldBounds(){
      var res=[];
      var pointQuene=this.pointQuene;

      for(var i in pointQuene){
        res.push([pointQuene[i].latlngPos.lat,pointQuene[i].latlngPos.lng]);
      }

      return res;
    },
    /*清除绘画过程中所有的线和点*/
    clearAllPoint(){
      if(this.vrPoint){
        this.vrPoint.remove();
      }

      var pointQuene=this.pointQuene;

      for(var i in pointQuene){
        /*移除点*/
        if(pointQuene[i].point){
          pointQuene[i].point.remove();
        }

        if(pointQuene[i].line){
          pointQuene[i].line.remove();
        }
      }
    },
    /*重置圈地小工具,回到初始化的编辑状态*/
    reset(){
      if(this.ploygon){
        this.ploygon.remove();
      }

      this.clearAllPoint();
      this.drawStart=false;
      this.pointQuene=[];
      this.painterState=-1;
      this.bounds=[];
      this.nowPoint=null;
      this.polygon=null;
      this.vrPoint=null;    
    },
    localtion(){  
      var _this=this;
      var nowCity=new BMap.LocalCity();

      nowCity.get((obj)=>{
        obj;
        var pos=eviltransform.bd2gcj(obj.center.lat, obj.center.lng);
        this.map.panTo(pos);
        this.map.setZoom(10);
      });       
    }

  },

};
</script>

<style lang="less" scoped>
	@import url('LMapEditorMobile.less');
</style>

<style type="text/css">
  
  .leaflet-middle-icon{
    opacity: 0.8;
    width: 8px;
    height: 8px;
  }

  .leaflet-vertex-icon,.leaflet-middle-icon{
    border-radius: 20px;
    border: 3px solid #20a0ff;
    background-color: white;
    width: 15px;
    height: 15px;
  }

  .header{
    /*background-color: white;*/
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 999;
  }
</style>