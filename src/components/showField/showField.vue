<template>
<div class="wrap">
	<div :id="mapId" class="l-map show-field"></div>	
</div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import * as util from "@/components/LMapEditorMobile/util"



export default {

  name: 'showField',

  data () {
    return {
    	map:null,
    	mapId:util.randomString(6),
    	allLayer:[],
    	text:"1"
    };
  },
  props:{
  	visable:{
  		default:false
  	},
  	fields:{
  		default:function(){
  			return [];
  		}
  	}
  },
  watch:{
  	visable:function(val){
      this.initMap(val);
  	},
    fields:function(){

      // this.showAllField();
    }
  },
  mounted(){
      this.initMap(this.visable);
  },
  beforeDestroy(){
  	this.clearAllLayer();
  },
  methods:{
  	...util,
    initMap(val){
      /*清除之前的地图数据*/


      if(val){
        this.$nextTick(()=>{
          this.clearAllLayer();
          this.map=this.createMap(this.mapId,{
            dragging:false,
            doubleClickZoom:false,
            preferCanvas:true,
            tap:false,
            touchZoom:false
          });
          this.showAllField();

        });
      }else{
        // if(this.map){
        //   this.clearAllLayer();
        // }
      }      
    },
  	showAllField(){
  		var fields=this.fields;
  		for(var i in fields){
  			this.allLayer.push(this.addPolygon(this.map,fields[i].bounds));
  		}
  	},
  	clearAllLayer(){
  		if(this.map){
  			this.map.remove();
  		};

  		var allLayer=this.allLayer;

  		for(var i in allLayer){
  			allLayer[i].remove();
  		}
  	}
  }
};
</script>

<style lang="css" scoped>
.show-field,.wrap{
	width: 100%;
	height: 100%;
}
</style>