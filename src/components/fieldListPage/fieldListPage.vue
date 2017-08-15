<template>
	<div class="field-list-page-wrap">
    <p class="tips">友情提示：您的测量结果会只会保留7天哦</p>
		<field-list-item :visable="visable" v-for="(item,index) in fieldList" :index="index" :field="item" :key="item.timestamp"></field-list-item>
		<div class="no-field" v-show="fieldList.length==0">暂无已测量土地<br>请去圈地页面添加土地</div>
	</div>
</template>

<script>
import {Button} from "mint-ui"
import fieldListItem from "@/components/showField/fieldListItem";

export default {

  name: 'fieldListPage',

  data () {
    return {
    	fieldList:[]
    };
  },
  props:{
  	visable:{
  		default:false
  	}
  },
  components:{
  	fieldListItem,
    mtButton:Button
  },
  created(){
    /*注册事件*/
    this.$bus.$on("submitField", (field) => {
      this.saveFieldToStorage(field);
    });

    /*回显本地存储的土地数据*/
    var temp = [];
    try {
      temp = JSON.parse(localStorage.getItem("fields")) || [];
    } catch (e) {
      temp = [];
    }


    this.fieldList = this.checkTimeout(temp);

  },
  methods:{
  	saveFieldToStorage(field){
  		var temp=[];

  		try{
  			temp=JSON.parse(localStorage.getItem("fields"))||[];
  		}catch(e){
  			temp=[];
  		}

  		temp.push(field);
  		this.fieldList=temp;
  		localStorage.setItem("fields",JSON.stringify(temp));
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
    }
  }
};
</script>

<style lang="less" scoped>
	.field-list-page-wrap{
		overflow-y:scroll;
		overflow-x: hidden;
		height:100%;
    background-color: white;
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
      padding:0.5rem 0.25rem 0;
      text-align:center;
    }
    .send-email{
      border-radius:0;
      font-size: 0.7rem;
    }
	}
</style>