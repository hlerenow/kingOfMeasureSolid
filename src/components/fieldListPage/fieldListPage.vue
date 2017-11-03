<template>
	<div class="field-list-page-wrap">
    <p class="tips">免责声明：本报告存在一定误差，不应被用于任何对准确性</br>要求较高的用途，也不作为任何与土地面积有关的事务的依据</p>
    <div v-for="(item,index) in fieldList" v-if="lazyLoad">
    	<field-list-item @click.native="selectItem(item)" :visable="visable"  :index="index" :field="item" :key="item.timestamp"></field-list-item>
    </div>
    <div class="instruct" v-show="fieldList.length>0">
          <span class="big people">您</span>所拥有的土地总面积为<span class="area big">{{totalArea | area }}公顷</span>，已击败全国<span class="percent big">{{totalArea | level}}</span>的用户<br>
          还想知道温度？降雨？产量预估？         
    </div>
    <div class="space">
    </div>
		<div class="no-field" v-show="fieldList.length==0">暂无已测量土地<br>请去圈地页面添加土地</div>
    <div class="register">
      <p class="tips">如果想了解更多关于土地的信息，请下载云景安卓APP, 申请体验</p>
      <mt-button @click.native="register" size="large" class="register-btn" type="primary">一键下载云景</mt-button>
    </div> 
	</div>
</template>

<script>
import {Button,Field,MessageBox, CellSwipe} from "mint-ui"
import fieldListItem from "@/components/showField/fieldListItem"
import http from "@/libs/http"

export default {

  name: 'fieldListPage',

  data () {
    return {
      lazyLoad:false,
    	fieldList:[],
      fieldInfo:{},
      fieldDetailVisable:false,
      username:"",
      totalArea:0,
      delButton: [{
        content: 'Delete',
        style: { background: 'red', color: '#fff' },
        handler: function(){console.log(1)}
      }]
    }
  },
  props:{
  	visable:{
  		default:false
  	}
  },
  components:{
  	fieldListItem,
    mtButton:Button,
    Field,
    [CellSwipe.name]: CellSwipe
  },
  watch:{
    visable(val){
      if(val){
      /*获取手机号*/
        let user=JSON.parse(localStorage.getItem("user"));
        this.username=user.phone;         
      }
    },
    fieldList(val){
      var sum=0;
      for(var i in val){
        sum+=parseFloat(val[i].area);
      }
      this.totalArea=sum.toFixed(2);
    }
  },
  created(){

    /*注册事件*/
    this.$bus.$on("submitField", (field) => {
      
      /*获取手机号*/
        let user=JSON.parse(localStorage.getItem("user"));
        this.username = user.phone;     

        this.saveFieldToStorage(field);
    });

    /* 删除土地事件 */
    this.$bus.$on('delField', (field) => {
      for(let i in this.fieldList ) {
        if(this.fieldList[i] === field){
            this.fieldList[i].timestamp = 0;
            break;
        }
      }

      let tempList = this.checkTimeout(this.fieldList)

      this.fieldList = tempList 
      this.reStoreFieldAll(tempList)
      this.$bus.$emit("field-count",tempList.length);   
      
    })
    /* 回显本地存储的土地数据 */
    var temp = [];
    try {
      temp = JSON.parse(localStorage.getItem("fields")) || [];
      this.$bus.$emit("field-count",temp.length);   
      
    } catch (e) {
      temp = [];
    }
    this.fieldList = this.checkTimeout(temp);
  },
  mounted (){
    setTimeout(() => {
      this.lazyLoad = true
    })
  },
  methods:{
    reStoreFieldAll(fieldList){
      localStorage.setItem("fields",JSON.stringify(fieldList));
    },
  	saveFieldToStorage(field){
  		var temp=[];

  		try{
  			temp=JSON.parse(localStorage.getItem("fields"))||[];
  		}catch(e){
  			temp=[];
  		}

  		temp.push(field);
  		this.fieldList=temp;

      this.$bus.$emit("field-count",temp.length);   

  		localStorage.setItem("fields",JSON.stringify(temp));
      /*发送数据到服务器*/
  	},
    /*检查过期数据，过期时间为一周*/
    checkTimeout(list){
      var res=[];
      for(var i in list){
          var oldTime=parseInt(list[i].timestamp);
          if(Date.now()-oldTime<7*24*60*60*1000){
            res.push(list[i]);
          }
      }
      return res;
    },
    selectItem(item){
      /*选择了那块土地*/
      this.fieldDetailVisable=true;
    },
    /*提交注册申请*/
    register(){

      window.location.href = 'http://openbox.mobilem.360.cn/index/d/sid/3905006';
    }
  },
  filters:{
    level(val){
      if(val>0&&val<=(4.5*666.7)){
        return "0%";
      }
      if(val>(4.5*666.7)&&val<=(9*666.7)){
        return "15.8%";
      }
      if(val>(9*666.7)&&val<=(13.5*666.7)){
        return "50%";
      }

      if(val>(13.5*666.7)&&val<=(18*666.7)){
        return "65.8%";
      }

      if(val>(18*666.7)&&val<=(22.5*666.7)){
        return "97.2%";
      }      

      if(val>(22.6*666.7)){
        return "99.9%";
      }

      return "0%";

    },
    area(val){
        return (val / 10000).toFixed(2) ;    
    }
  }
};
</script>

<style lang="less" scoped>
	.field-list-page-wrap{
    position:relative;
		overflow-y:scroll;
		overflow-x: hidden;
		height:100%;
    background-color: white;
    .register{
      position:fixed;
      bottom:2.8rem;
      left:0;
      background-color:white;
      z-index: 999;
      width:100%;
      // box-shadow: 0 -5px 2px 2px gray;
      border-top:1px solid #f1f1f1;
    }

		.no-field{
			box-sizing:border-box;
			display:block;
			width:100%;
			text-align:center;
			padding: 1.0rem 0.5rem;
			line-height:2;
			color:#d2cece;
		}
    .tips{
      font-size:0.5rem;
      color:gray;
      padding:0.5rem 0.25rem 0.4rem;
      text-align:center;
    }
    .send-email{
      border-radius:0;
      font-size: 0.7rem;
    }
    .register-btn{
      font-size:1rem;
      border-radius:0;
    }
    .space{
      width:100%;
      height:6rem;
    }
    .instruct{
      text-align:center;
      padding:0.5rem;
      line-height:1.5;
      font-size: 0.5rem;
      .big{
        font-size:0.7rem;
        color:red;
      }
    }
	}
</style>
