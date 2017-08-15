<template>
	<div class="field-detail-wrap">
	    <!-- 填写个人信息窗口 -->
	    <popup
	      :closeOnClickModal="false"
	      class="popue-field-detail"
	      v-model="popupVisible"
	      position="right"
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

export default {

  name: 'fieldDetail',

  data () {
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
		searchService: false,
    };
  },
  props:{
  	visable:{
  		default:false
  	}
  },
  watch:{
  	visable(val){
  		this.popupVisible=val;
  	}
  },
  components:{
		Popup,
		Field,
		Toast,
		mtButton: Button,
		[Header.name]:Header  	
  }
};
</script>

<style lang="css" scoped>
	@import url('fieldDetail.less');
</style>