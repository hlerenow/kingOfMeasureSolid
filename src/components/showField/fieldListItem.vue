<template>
	<div class="field-list-item-wrap">
		<div class="field-map-box">
			<show-field :visable="visable" :fields="[{bounds:field.bounds}]"></show-field>
		</div>
		<div class="field-detail-info">
			<p>编号：{{index+1}}</p>
			<p>土地名： {{field.fieldName}}</p>
			<p>作物： {{field.crop}}</p>
			<div class="no-data">温度：<img class="blur-img" src="../../assets/blur-number.jpg" /><span class="pre-tips">需注册云景才能查看</span></div>
			<div class="no-data">降雨：<img class="blur-img" src="../../assets/blur-number.jpg" /><span class="pre-tips">需注册云景才能查看</span></div>
			<div class="no-data">产量预估：<img class="blur-img" src="../../assets/blur-number.jpg" /><span class="pre-tips">需注册云景才能查看</span></div>
			<div class="no-data">健康警报：<img class="blur-img" src="../../assets/blur-number.jpg" /><span class="pre-tips">需注册云景才能查看</span></div>
			<p>面积： {{field.area | formatArea }}</p>
		</div>
	</div>
</template>


<script>
import showField from "@/components/showField/showField"
export default {

	name: 'fieldListItem',

	data() {
		return {
		};
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
	filters: {
		formatArea(val) {
			if (val >= 10000) {
				return (val / 10000).toFixed(2) + "公顷";
			} else {
				return (val).toFixed(2) + "平方米";
			}
		}
	}
};
</script>

<style lang="less" scoped>
	.field-list-item-wrap{
		display:flex;
		border-bottom:1px solid #e3e3e3;
		align-items:center;
		padding:0.5rem;
		.field-map-box{
			width:6rem;
			height:8rem;
		}

		.field-detail-info{
			padding-left:0.5rem;
			font-size:0.6rem;

			p,div{
				line-height: 2;
			}
		}
		.no-data{
			display:flex;
			align-items:center;
			// justify-content:center;
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