<template>
	<div class="teach-box">
		<ol class="level1">
			<li>如何快速定位到我所在的区域？

				<ol class="leve2" type="a">
					<li>点击左上方的<b>蓝色小气球</b>,输入您所在的区域</li>
					<li>点击搜索,在搜索结果中找到您需要的位置，点击完成定位</li>
				</ol>
			</li>
			<li>如何开始圈地？

				<ol class="leve2" type="a">
					<li>通过移动过和缩放地图找到您的地块</li>
					<li>移动地图使中心<b>红色定位点</b>位于您地块的轮廓线上</li>
					<li>点击下方<b>蓝色按钮</b>，完成第一个定点的放置</li>
					<li>用同样的方法完成其他定位点的放置。注意，当您防止了超过三个定位点时，图形会自动闭合。此时，您仍可继续放置定位点</li>
					<li>如果您对放置的定位点不满意，可以点击左侧的<b>撤销</b> 按钮，取消放置</li>
					<li>当您对定位点都满意后，点击右侧的<b>确认</b> 按钮，并在弹窗中输入地块名称和作物种类</li>
					<li>点击<b>计算面积</b>按钮，结果马上呈现在您面前。当然，您也可以点击<b>取消</b>以取消测量</li>
					<li>点击<b>继续圈地</b>按钮，您就可以测量更多的土地了</li>
					<li>想查看已经测过的土地？请点击下方的<b>已测土地</b>按钮。所有的地块，在这里一目了然</li>
				</ol>
			</li>

		</ol>
	</div>
</template>

<script>
export default {

  name: 'teach',

  data () {
    return {

    };
  }
};
</script>

<style lang="less" scoped>
.teach-box{
	padding-right:1rem;
	font-size:0.7rem;
	width:100%;
	height:100%;
	overflow:auto;
	.level1{
		padding-left:1.5rem;
		& > li{
			padding-bottom:30px;
		}	

		.leve2{
			padding-top: 0.5rem;
			padding-left: 1.0rem;
			& > li{
				padding:0.25rem 0;
			}
		}	
	}
}
</style>