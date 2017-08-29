<template>
	<div class="l-map-mobile-wrap">
    <location id="location"></location>
    <choose-field-page :visable="painterState==1" ></choose-field-page>
    <div :id="mapId" class="l-map choose-field">
      <div id="add-point" v-show="painterState!=1" class="hover-botton"></div>
			<div id="add-point-btn" v-show="painterState!=1" @click="addFieldPoint"  ></div>
      <div class="revoke tool" v-show="painterState==0" @click="revoke"><img src="../../assets/back.png" /></div>
      <div class="finish tool" v-show="painterState==0" @click="chooseFieldFinish"><img src="../../assets/ok.png" /></div>
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

import * as eviltransform from "@/libs/transform"
// require("eviltransform");
  
export default {

  name: 'LMapEditorMobile',

  data () {
    return {
      firstPoint:null,
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
      tempPloygon:null,
      vrPoint:null,
      /*解决颜色填充不了bug*/
      bounds:[],
      /*用于存储 圈地过程中 的点 和线*/
      tempPointLineLayer:[],
      marker:null
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
  beforeDestory () {
    this.map.remove()
  },
  methods:{
  	...util,
    initMap(){
      /*注册事件 */
      this.$bus.$on("reChoose",()=>{
        this.reset();
      });

      var _this=this;
      /*地址搜索完成             */
      this.$bus.$on("searchFinish",(payload)=>{
        /*坐标系转换*/
        var tempPos=eviltransform.bd2gcj(payload.pos.lat,payload.pos.lng);

        _this.map.flyTo(tempPos);
        let redIcon=L.icon({
            iconUrl: 'static/location-blue.png',
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -20]
          });
        if(this.marker){
          this.marker.remove();
          this.marker=null;
        }
        this.marker=L.marker(tempPos,{
          "icon":redIcon
        }).addTo(_this.map);
      });

      if(this.map){
        this.map.remove();
      }
      /* 获取添加点的 btn  dom 元素 */
      this.addPointDom = document.getElementById('add-point');

      this.map = this.createMap(this.mapId);
      this.localtion();
    },
    /*圈地过程中添加点*/
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
        if(this.pointQuene.length>2&&this.isFinish(newPointPos,this.pointQuene[0])){
          console.log("结束圈地");
          this.chooseFieldFinish();
	  			return;
	  		}

        this.pointQuene.push([newPointPos.lat,newPointPos.lng]);

        this.drawPolygon(this.pointQuene);
        this.drawLinePoint(this.pointQuene);

        // this.
	  		
  	},
    /*圈地完成*/
    chooseFieldFinish(){
        /*点不能少于3个*/
        if(this.pointQuene.length<3){
          return;
        }

        this.$bus.$emit("finish",this.pointQuene);

        console.log("绘制完成");
        /*改变 绘画状态*/
        this.painterState=1;
    },
    /*获取下一个点*/
  	getWillPointLatLang(){
	  	var pos=this.addPointDom.getBoundingClientRect();
	  	var domCenter={
	  		x:(pos.left+pos.right)/2,
	  		y:(pos.top+pos.bottom)/2
	  	}  		
  		return this.map.containerPointToLatLng(domCenter); 		
  	},
    /*绘画圈地过程中的点和线*/
    drawLinePoint(points){
      this.clearLinePoint();
      var res=[];

      for(let i=0;i<points.length;i++){
          let _opt = {
            fill: true,
            fillColor: 'white',
            fillOpacity: 1,
            radius: 8,
            color:'#20a0ff'
          };
          let handle = L.circleMarker(points[i], _opt).addTo(this.map);         

          res.push(handle);

          if (points.length==2&&i==1) {

            let _opt = {
              opacity: 0.6,
              weight: 2,
              color: '#fff',
              lineCap: 'square',
            };

            let line = L.polyline([points[i - 1], points[i]], _opt).addTo(this.map);

            res.push(line);
          }
      }

      this.tempPointLineLayer=res;
    },
    /*清除绘画过程中的点和线*/
    clearLinePoint(){
      var tempPointLineLayer=this.tempPointLineLayer;
      for(let i in tempPointLineLayer){
        if(tempPointLineLayer[i].remove){
            tempPointLineLayer[i].remove();
        }
      }
      this.tempPointLineLayer=[];
    },
    /*绘制绘画过程中的多边形*/
    drawPolygon(points){
      if(this.tempPloygon){
        this.tempPloygon.remove();
      }
      /*绘制*/
      if(points.length<3){
        return ;
      }
      this.tempPloygon=L.polygon(points,{
            fill: true,
            fillColor: 'green',
            fillOpacity: 0.5,
            color:'white',
            weight:0.5      
      }).addTo(this.map);
    },
  	/*撤销功能*/
  	revoke(){
      this.pointQuene.pop();
      this.drawPolygon(this.pointQuene);
      this.drawLinePoint(this.pointQuene);

      if(this.pointQuene.length==0){
        /*退出编辑状态*/
        this.painterState=-1;
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
    /*重置圈地小工具,回到初始化的编辑状态*/
    reset(){
      if(this.tempPloygon){
        this.tempPloygon.remove();
      }      
      this.clearLinePoint();


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