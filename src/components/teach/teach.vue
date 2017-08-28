<template>
	<div class="teach-box" v-if="visable">
		<div class="other-words">
			免责声明：本工具存在一定误差，不应被用于任何对准确性要求较高的用途，也不作为任何与土地面积有关的法律事务的依据。
		</div>
		<ol class="level1" type="1">
			<li>开始圈地
				<ol type="a" class="level2">
					<li>使用测地王需要用手机号注册，请尽量使用您常用的手机号。</li>
					<li>如果点击“了解并开始圈地”，则代表您了解并认可我们的免责协议，接下来，您就可以开始圈地和测量了。<br>
						<img src="http://dev.yeegen.com/statics/start.gif" alt="">
					</li>
				</ol>
			</li>

			<li>快速定位
				<ol type="a" class="level2">
					<li>点击左上方的蓝色小气球，输入您所在的区域。</li>
					<li>点击搜索，在搜索结果中找到您需要的位置，点击完成定位<br>
						<img src="http://dev.yeegen.com/statics/location.gif" alt="">
					</li>
				</ol>
			</li>

			<li>缩放和拖动
				<ol type="a" class="level2">
					<li>通过移动和缩放地图找到您的地块<br>
						<img src="http://dev.yeegen.com/statics/drag.gif">
					</li>
				</ol>
			</li>

			<li>定点/撤销
				<ol type="a" class="level2">
					<li>移动地图使中心红色定位点位于您地块的轮廓线上</li>
					<li>点击下方蓝色按钮，完成第一个定点的放置</li>
					<li>用同样的方法完成其他定位点的放置。注意，当您防止了超过三个定位点时，图形会自动闭合。此时，您仍可继续放置定位点</li>
					<li>如果您对放置的定位点不满意，可以点击左侧的 撤销 按钮，取消放置<br>
						<img src="http://dev.yeegen.com/statics/pos_back.gif">
					</li>
				</ol>
			</li>
			
			<li>计算耕地面积
				<ol type="a" class="level2">
					<li>当您对定位点都满意后，点击右侧的 确认 按钮，并在弹窗中输入地块名称和作物种类</li>
					<li>点击 计算面积 按钮，结果马上呈现在您面前。当然，您也可以点击 取消 以取消测量</li>
					<li>当您对定位点击 继续圈地 按钮，您就可以测量更多的土地了。<br>
						<img src="http://dev.yeegen.com/statics/calculate.gif" alt="">
					</li>
				</ol>
			</li>

			<li>查看耕地面积/删除已测土地
				<ol type="a" class="level2">
					<li>想查看已经测过的土地？请点击下方的 已测土地 按钮。所有的地块，在这里一目了然</li>
					<li>点击地块旁边的“X”，可以删除已经测量的地块<br>
						<img src="http://dev.yeegen.com/statics/list.gif" alt="">
					</li>
				</ol>
			</li>

			<li>注册云景
				<ol type="a" class="level2">
					<li>如果您想用另外的手机号码注册，可以点击已有号码，然后进行修改</li>
					<li>点击一键注册云景，即可提交注册申请<br>
            <img src="http://dev.yeegen.com/statics/register.gif" alt="">
					</li>
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
    	getData:false
    };
  },
  props:{
  	visable:{
  		default:false
  	}
  }
};
</script>

<style lang="less" scoped>
.teach-box{
	background-color: white;
	.other-words{
		font-size:12px;
		font-weight: bold;
		text-align: center;
		padding:10px;
	}
	padding-right:1rem;
	font-size:0.7rem;
	width:100%;
	height:100%;
	overflow:auto;
	.level1{
		padding-left:1.5rem;
		img{
			padding: 10px 0;
		}
		& > li{
			padding-bottom:30px;
		}	

		.level2{
			padding-top: 0.5rem;
			padding-left: 20px;
			& > li{
				padding:0.25rem 0;
			}
		}	
	}
}
</style>

<!-- 
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
 -->