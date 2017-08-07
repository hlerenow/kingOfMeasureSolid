<template>
	<div class="l-map-mobile-wrap">
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
      /*解决颜色填充不了bug，*/
      bouds:[]

    };
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
           this.initMap();
           this.initOk=true;
        }
      }
    }
  },
  mounted(){
    if(this.visable){
      this.initMap();

    }
  },
  methods:{
  	...util,
    initMap(){
      if(this.map){
        this.map.remove();
      }
      /* 获取添加点的 btn  dom 元素 */
      this.addPointDom = document.getElementById('add-point');

      this.map = this.createMap(this.mapId);

      this.map.on("move",(e)=>{
        if(this.painterState==0){
          this.addDashedLine();
        }
      });
    },
  	addFieldPoint(){
		  	var newPointPos=this.getWillPointLatLang();

            this.bouds.push([newPointPos.lat,newPointPos.lng]);

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
          
          this.$emit("finish",this.getFieldBouds());
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

	  		this.pointQuene.push({
	    		/*点的实例*/
	    		point:point,
	    		latlngPos:newPointPos,
	    		/*点对应的线条实例，第一个点没有线条实例*/
	    		line:line  			
	  		});
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
	  		x:(pos.left+pos.right)/2,
	  		y:(pos.top+pos.bottom)/2
	  	}  		

  		return this.map.containerPointToLatLng(domCenter); 		
  	},
  	/*撤销功能*/
  	clearPrePoint(){
      var point=this.pointQuene.pop();
      this.addDashedLine();
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
      var tempB=this.getFieldBouds();

      tempB=[].concat(tempB);

      L.polygon(this.bouds,{
        color:'red'
      }).addTo(this.map);
  	},
  	/*回显土地*/
  	showField(){
      var showField= this.showFields();
      for(var i in showFields){
        this.addPolygon(this.map,showField[i].bounds);
      }
  	},
    getFieldBouds(){
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
      this.clearAllPoint();
      this.drawStart=false;
      this.pointQuene=[];
      this.nowPoint=null;
      this.polygon=null;
      this.vrPoint=null;    
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
</style>