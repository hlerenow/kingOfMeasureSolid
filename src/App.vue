<template>
  <div id="app">
    <user-info></user-info>
    <tab-container class="tab-container" v-model="active" >
      <tab-container-item  id="tab1" class="tab-item choose-field">
        <l-map-editor-mobile  :visable="active=='tab1'" ></l-map-editor-mobile>
      </tab-container-item>
      <tab-container-item id="tab2" class="tab-item">
        <field-list-page :visable="active=='tab2'"></field-list-page>
      </tab-container-item>
      <tab-container-item id="tab3" class="tab-item"  >
        <teach></teach>
      </tab-container-item>
    </tab-container>
    <tabbar class="bar-bottom" v-model="active" >
        <tab-item  id="tab1">
            <img slot="icon" src="./assets/map.png">        
            圈地
        </tab-item>
        <tab-item id="tab2">
            <img slot="icon" src="./assets/land.png">        
            已测土地 <mt-badge type="success">{{fieldCount}}</mt-badge>
        </tab-item>
        <tab-item  id="tab3">
            <img slot="icon" src="./assets/question.png">       
            快速教程
        </tab-item>              
    </tabbar> 
  </div>
</template>

<script>
import LMapEditorMobile from '@/components/LMapEditorMobile/LMapEditorMobile'
import showField from '@/components/showField/showField'
import userInfo from '@/components/userInfo/userInfo'
import fieldListPage from "@/components/fieldListPage/fieldListPage"
import teach from "@/components/teach/teach"
import http from "@/libs/http"

import {Badge ,TabContainer, TabContainerItem, Tabbar, TabItem} from 'mint-ui';

export default {
  name: 'app',
  data(){
    return {
      active:"tab1",
      chooseAllFields:[],
      fieldCount:0
    }
  },
  components:{
    showField,
    userInfo,
    LMapEditorMobile,
    TabContainer,
    TabContainerItem,
    Tabbar,
    TabItem,
    fieldListPage,
    teach,
    [Badge.name]:Badge 
  },
  created(){
    this.$bus.$on("field-count",(count)=>{
      this.fieldCount = count;
    });
    this.wxShareConfig()
  },
  mounted(){
  },
  methods:{
    async wxShareConfig () {
      let res = ''
      try {
        res = await http.get('http://dev.yeegen.com/api/signature')
        res = JSON.parse(res)
      } catch (e) {
        return
      }

      wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx39a4c55fa21dd16f', // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature,// 必填，签名，见附录1
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });    

      wx.ready( () => {
          console.log("ok");
          this.wxShare()
      })
    },
    wxShare () {
      wx.onMenuShareAppMessage({
          title: '测地王', // 分享标题
          desc: '想测更多的地吗？', // 分享描述
          link: 'http://dev.yeegen.com/king', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://dev.yeegen.com/king/static/logo.jpg', // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () { 
              // 用户确认分享后执行的回调函数
              alert("分享成功")
          },
          cancel: function () { 
              // 用户取消分享后执行的回调函数
          }
      });      
    }
  },
  filters:{

  }
}
</script>

<style lang="less">
.popup-tips{
  z-index: 2005;
}
html,body{
  font-size:20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  position: fixed;
}

div{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

p{
  padding:0;
  margin:0;
}
.clear{
  &:before,&:after{
        content:"";
        display: block;
        clear: both;
        width:0;
        height:0;    
  }
}

.teach-tips{
    text-align: center;
    margin-top: 13.0rem;
    color: gray;
    font-size:0.7rem;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  .bar-bottom{
    height:3rem;
  }
  .tab-container{
    width:100%;
    height:100%;
    .mint-tab-container-wrap{
      padding-bottom: 2.8rem;
      width:100%;
      height:100%;
      box-sizing:border-box;
      .tab-item{
        width:100%;
        height:100%;

        &.choose-field{
          border-bottom: 0;
        }
      }
    }
  }
}
/* 隐藏站长统计字样 */
#cnzz_stat_icon_1263557514{
  display:none;
}
</style>
