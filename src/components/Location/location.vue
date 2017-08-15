<template>
	<div class="search-pos-wrap">
	    <!-- 填写个人信息窗口 -->
	    <div @click="popupVisible=true" class="icon-btn"><img src="../..//assets/pos.png" /></div>
	    <popup
	      :closeOnClickModal="false"
	      class="popue-pos"
	      v-model="popupVisible"
	      position="left"
	      pop-transition="popup-fade">  
			<mt-header title="位置定位">
			    <mt-button icon="back" slot="left" @click.native="popupVisible=false">返回</mt-button>
			</mt-header>      	
	        <div class="popup-content">
	            <div class="tips"></div>
	            <field label="城市"  placeholder="必填" v-model="city"></field>
	            <field label="地名"   placeholder="必填" v-model="address"></field> 
	            <mt-button size="large" type="primary" @click.native="search" >搜索</mt-button>
	        	<div class="result-tips" v-show="!firstSearch">搜索结果：</div>
		        <ul class="city-list" v-show="addressList.length">
		        	<li @click="selectAddress(index)" v-for="(item,index) in addressList">{{item.name}}</li>
		        </ul>
		        <p class="no-data" v-show="addressList.length==0&&(!firstSearch)">
		        	暂无搜索结果
		        </p>
	        </div>  
	    </popup>
	</div>
</template>

<script>
import {
	Popup,
	Field,
	Toast,
	Button,
	Header
} from 'mint-ui'

import showField from '@/components/showField/showField'
import * as util from "@/components/LMapEditorMobile/util"

export default {

	name: 'localtion',

	data() {
		return {
			/*是否是第一次搜索*/
			firstSearch:true,
			/*弹窗是否可见*/
			popupVisible: false,
			city: "",
			address: "",
			pos: [0, 0],
			fieldName: "",
			crop: "",
			addressList: [],
			searchService: false
		};
	},
	watch:{
		city(val){
			this.searchService = this.getSearchHandle(this.city);
			if (this.city.trim() == "") {
				this.city = this.cityName;
			}			
		}
	},
	components: {
		Popup,
		Field,
		Toast,
		mtButton: Button,
		[Header.name]:Header
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			var _this = this;
			var nowCity = new BMap.LocalCity();

			nowCity.get((obj) => {
				var pos = eviltransform.bd2gcj(obj.center.lat, obj.center.lng);
				this.pos = pos;
				this.city = obj.name;
				/*生成搜索句柄服务*/
				this.searchService = this.getSearchHandle(this.city);
			});
		},
		search() {
			/*服务已经实例化完成*/
			if(this.searchService&&this.address.trim()!=""){
				/*判断是否是进入页面的第一次搜索*/
				this.searchService.search(this.address);

				if(this.firstSearch){
					this.firstSearch=false;
				}
			}
		},
		selectAddress(index) {
			this.$bus.$emit("searchFinish",this.addressList[index]);
			this.popupVisible=false;
		},
		changeCity() {
			this.searchService = this.getSearchHandle(this.city);
			if (this.city.trim() == "") {
				this.city = this.cityName;
			}
		},
		/*获取搜索服务句柄*/
		getSearchHandle(city) {
			var local = new BMap.LocalSearch(city, {
				onSearchComplete: (res) => {
					var count = res.getCurrentNumPois();
					var tempRes = [];
					for (var i = 0; i < count; i++) {
						var point = res.getPoi(i);
						tempRes.push({
							name: point.title,
							pos: point.point
						});
					}
					if (tempRes.length > 0) {
						this.addressList = tempRes;
					} else {
						this.addressList = [];
					}
				}
			});
			return local;
		}
	}
};
</script>

<style lang="less" scoped>
	.search-pos-wrap{
		.icon-btn{
			width:2.0rem;
			height:2.0rem;
			position:absolute;
			background-color:white;
			overflow:hidden;
			left:0.5rem;
			top:.5rem;
			z-index: 999;
			border-radius:50%;
			img{
				height:80%;
				width:auto;
				position:relative;
				left:50%;
				top:50%;
				transform:translateX(-50%) translateY(-50%);
			}
		}
	}

	.popue-pos{
		width:100%;
		height:100%;
		.popup-content{
			padding:0.5rem;
		}

		.title{
			text-align:center;
			padding:0.5rem 0;
		}
		.result-tips{
			font-size:0.7rem;
			padding:1rem 0 0;
		}		
		.city-list{
			list-style: none;
			padding-left:0;
			display:block;
			height:10.0rem;
			overflow-x: hidden;
			overflow-y: auto;

			li{
				padding:0.25rem 0.5rem;
				font-size:0.7rem;
				border-bottom: 1px solid #eee;
			}
		}
		.no-data{
			font-size:0.7rem;
			text-align:center;
			padding:1rem 0;
		}
	}
</style>