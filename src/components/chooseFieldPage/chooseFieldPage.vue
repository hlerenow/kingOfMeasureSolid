<template>
    <!-- 填写个人信息窗口 -->
    <popup
      :closeOnClickModal="false"
      class="popue-user-info"
      v-model="popupVisible"
      popup-transition="popup-fade">  
        <div class="popup-content">
            <div class="title">填写土地信息</div>
            <div class="tips">填写准确的信息后，测量的土地面积准确率会更高哦</div>
            <div class="map-wrap">
	       		<show-field :visable="popupVisible" :fields="bounds"></show-field>
            </div>
            <field label="土地名称" :state="nameState" placeholder="必填" v-model="fieldName"></field>
            <field label="作物"  :state="cropState" placeholder="必填" type="email" v-model="crop"></field> 
            <div class="field-area" v-if="showArea">
            	<span class="label">土地面积</span> <span class="data"> {{area | formatArea}}</span>
            </div>
            <div class="btn-tool clear" v-show="!showComeBack">
	            <mt-button id="calculateArea" @click.native="saveUserInfo" size="small" type="primary">计算面积</mt-button>
	            <mt-button id="reChoose" @click.native="cancel" size="small" type="primary">取消</mt-button>
            </div>
            <div class="btn-tool clear" v-show="showComeBack">
	            <mt-button id="calculateArea" @click.native="cancel" size="small" type="primary">继续圈地</mt-button>
            </div>
        </div>  
    </popup>
</template>

<script>
import {Popup,Field,Toast,Button } from 'mint-ui'
import showField from '@/components/showField/showField'
import * as util from "@/components/LMapEditorMobile/util"

export default {

	name: 'chooseFieldFinish',

	data() {
		return {
			showArea:false,
			showComeBack:false,
			crop: "",
			c:false,
			fieldName: "",
			nameState: "",
			cropState: "",
			active: "tab1",
			popupVisible: true,
			bounds: [],
			area: 0
		};
	},
	components: {
		Popup,
		Field,
		mtButton: Button,
		showField
	},
	props: {
		visable: {
			default: false
		},
	},
	watch: {
		visable: function(val) {
			this.popupVisible = val;
			if(!val){
				this.showArea=false;
				this.showComeBack=false;
				this.crop="",
				this.fieldName="";
				this.cropState="";
				this.nameState="";
			}
		},
		crop(){
			if(this.crop==""){
				this.cropState="error";
				return ;
			}else{
				this.cropState="success";
			}				
		},
		fieldName(){

			if(this.fieldName==""){
				this.nameState="error";
				return ;
			}else{
				this.nameState="success";
			}					
		}
	},
	mounted() {
		this.init();
		// console.log(this.visable);
		this.popupVisible = this.visable;
	},
	methods: {
		init() {
			this.$bus.$on("finish", (bounds) => {
				this.bounds = [{
					bounds: bounds
				}];
			});
		},
		cancel() {
			this.$bus.$emit("reChoose");
		},
		saveUserInfo() {
			/*将数据发送到服务器*/
			/*成功后就可进入 圈地界面*/
			/*数据校验*/
			if(this.fieldName==""){
				this.nameState="error";
				return ;
			}else{
				this.nameState="success";
			}

			if(this.crop==""){
				this.cropState="error";
				return ;
			}else{
				this.cropState="success";
			}	
						

			if(!(this.nameState=="success"&&this.cropState=="success")){
				return;
			}

			/*计算面积*/
			this.area = util.calculateArea(this.bounds[0].bounds);
			this.showArea=true;
			this.showComeBack=true;


	        var userInfo=JSON.parse(localStorage.getItem("user"));
			this.$bus.$emit("submitField",{
				timestamp:Date.now(),
				bounds:this.bounds[0].bounds,
				name:userInfo.name,
				sex:userInfo.sex?"男":"女",
				email:userInfo.email,
				phone:userInfo.phone,
				crop:this.crop,
				fieldName:this.fieldName,
				area:this.area
			});

			/*cnzz 统计*/
		    window._czc.push(["_trackEvent","土地圈选","成功圈选土地","使用了测地王",this.username]);

		    /*接口尚未完成*/
			/* 发送数据到 服务器 */
			
			// Toast({
			// 	message: '信息保存成功，即将进入圈地界面',
			// 	duration: 3000,
			// 	position: "middle",
			// 	className: "popup-tips"
			// });
		}
	},
	filters:{
		formatArea(val){
			if(val>=666.7){
				return (val/666.7).toFixed(2)+"亩";
			}else{
				return (val).toFixed(2)+"平方米";
			}
		}
	}
};
</script>

<style lang="less" scoped>
  .popue-user-info{
    width:100%;
    padding:0.5rem;
    background-color: transparent;
    .popup-content{
      border-radius: 2px;
      padding:0.5rem;
      background-color:white;
      width:100%;
		
	  .btn-tool{
		  	margin-top: 1.5rem;
	      #calculateArea,#reChoose{
	      	border-radius:2px;
		   }

	      #calculateArea{
	      	float:right;
	      }
	      #reChoose{
	      	float:left;
	      }
	  	
	  }
	  .field-area{
	  	font-size:0.8rem;
	  	margin-top:0.5rem;
	  	.data{
	  		padding-left: 1.0rem;
	  		font-size:0.7rem;
	  	}
	  }
      .map-wrap{
      	width:100%;
      	overflow: hidden;
      	height:7.5rem;
      }
      .title{
        padding:0.5rem;
        text-align: center;
      }

      .tips{
        font-size:0.6rem;
        color:gray;
        text-align:center;
      }
      .sex-box{
        font-size:0.8rem;
        padding:0 0.5rem;
        display:flex;
        align-items:center;
        .mint-switch-core::before {
            background-color: #FF5722;
        }     

        .show-label{
          margin-left:3.7rem;
          padding-right: 0.5rem;
          height:100%;
        }
        .sex-radios{
          margin-right: 0.5rem;
        }
      }
    }
  }

</style>