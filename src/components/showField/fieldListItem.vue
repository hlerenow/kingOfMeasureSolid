<template>
	<div class="field-list-item-wrap">
		<div class="tool-top">
			NO.{{index+1}} 
			<div class="del-button" @click="delField"></div>
		</div>
		<div class="flex-box-detail">
			<div class="field-map-box">
				<show-field :visable="visable" :fields="[{bounds:field.bounds}]"></show-field>
			</div>
			<div class="field-detail-info">
				<p class="area-line">面积： <span v-html='formatArea'></span></p>
				<p>土地名： {{field.fieldName}}</p>
				<p>作物： {{field.crop}}</p>
				<div class="more-info first ">
					<div class="no-data float-left">温度：<img class="blur-img" src="../../assets/blur-number.jpg" /></div>
					<div class="no-data float-right">产量预估：<img class="blur-img" src="../../assets/blur-number.jpg" /></div>
				</div>
				<div class="more-info">
					<div class="no-data float-left clear">降雨：<img class="blur-img" src="../../assets/blur-number.jpg" /></div>
					<div class="no-data float-right">健康警报：<img class="blur-img" src="../../assets/blur-number.jpg" /></div>					
				</div>
				<span class="pre-tips">以上四项信息需注册云景才能查看</span>
			</div>
		</div>
	</div>
</template>


<script>
import {MessageBox} from 'mint-ui'
import showField from "@/components/showField/showField"
export default {
	name: 'fieldListItem',
	data() {
		return {
		};
	},
	computed:{
		formatArea() {
			var val = this.field.area

			if (val >= 10000) {
				return '<span  class="big-num" >'+(val / 10000).toFixed(2)+'</span><span class="unit">公顷</span>';
			} else {
				return '<span  class="big-num" >'+(val / 10000).toFixed(2)+'</span><span class="unit">平方米</span>';
			}
		}		
	},
	props: {
		field: {
			default: function() {
				return {};
			},
			type: Object
		},
		visable:{
			default:false
		},
		index:{
			default:0
		}
	},
	components: {
		showField
	},
	methods:{
		delField () {
		MessageBox.alert('删除土地 ' + this.field.fieldName + '?').then(action => {
			this.$bus.$emit("delField",this.field)
		});			
		}
	}
};
</script>

<style lang="less" scoped>
	.clear{
		clear: both;
	}
	.float-right{
		float: right;
	}

	.float-left{
		float: left;
	}
	.tool-top{
		font-size: 0.7rem;
		padding-bottom: 0.2rem;
	}
	.field-list-item-wrap{
		width:100%;
		display:flex;
		flex-direction: column;
		border-bottom:1px solid #e3e3e3;
		border-top:1px solid #e3e3e3;
		padding:0.5rem;
		.field-map-box{
			float: left;
			width:6rem;
			height:8rem;
		}
		.del-button{
			top: 0.5rem;
			cursor: pointer;
			width: 20px;
			height: 20px;
			float: right;
			position: relative;
			&::before,&::after{
				content: '';
				display: block;
				height: 1px;
				width: 100%;
				position: absolute;
				left: 0;
				background-color: gray;
				top: 0;
				transform :rotate( 45deg );
			}
			&::after{
				transform :rotate( -45deg );
			}
			&::before{
				transform :rotate( 45deg );
			}			
		}
		.flex-box-detail{
		}
		.field-detail-info{
			overflow: hidden;
			box-sizing: border-box;
			padding-left:1rem;
			font-size:0.6rem;
			p,div{
				line-height: 2;
			}
		}
		.more-info{
			width: 100%;
			overflow: hidden;
			&.first{
				margin-top: 10px;
			}
		}
		.no-data{
			box-sizing: border-box;
			display:flex;
			align-items:center;
			&.float-left{
				width: 40%;
			}
		}
		.blur-img{
			width:1.5rem;
			height:0.75rem;

		}
		.pre-tips{
			font-size:0.4rem;
			color:#e42727;
		}
	}
</style>
<style lang="css">
	.unit,.big-num{
		color: #26a2ff;
	}
	.unit{
		font-size: 0.6rem;
	}
	.big-num{
		padding: 0 0.5rem;
		font-size: 1.0rem;
	}	
</style>