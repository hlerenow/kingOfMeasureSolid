<template>
  <div :id="mapId" class="l-map" :style="{width,height}">
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'

import util from "@/libs/utils"
import LUtil from "@/libs/leafletUtils"


export default {

  name: 'LEditorMap',

  data () {
    return {
      mapId:'Map_'+util.randomString(6),
      map:{},
      options:{
          preferCanvas: true, //优先使用canvas 绘画 地图
          zoomControl: false, //缩放控件
          attributionControl: false, //右下角角标
          maxZoom: 24,
          dragging: true,
          zoom: 14,
          nativeZoom:18,
          scrollWheelZoom: true,
          selecFinish:false        
      }
    };
  },
  props:{
    width: {
      type: String,
      default: "800px"
    },
    height: {
      type: String,
      default: "500px"
    },
    editeZoom:{
      default:13
    }
  },
  mounted(){
    console.log(LUtil);
    this.map=LUtil.createMap(this.mapId,{...this.options,editable: true});
    this.$emit("mapInitEnd");

    var _this=this;

    this.map.on("click",function(e){
      console.log(e);
      LUtil.addCircle(_this.map,[e.latlng.lat,e.latlng.lng]);
    });
    console.log(eviltransform);
    this.map.panTo(eviltransform.wgs2gcj(30.671021,104.073076));
  },
  beforeDestroy(){
    this.map.remove();
  },  
  methods:{
  }
};
</script>

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