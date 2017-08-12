<template>
	<div class="field-list-item-wrap">
		<div class="field-map-box">
			<show-field :visable="visable" :fields="[{bounds:field.bounds}]"></show-field>
		</div>
		<div class="field-detail-info">
			<p>编号：{{index}}</p>
			<p>土地名： {{field.fieldName}}</p>
			<p>作物： {{field.crop}}</p>
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
			if (val >= 666.7) {
				return (val / 666.7).toFixed(2) + "亩";
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
			height:4rem;
		}

		.field-detail-info{
			padding-left:0.5rem;
			font-size:0.6rem;

			p{
				line-height: 2;
			}
		}
	}
</style>