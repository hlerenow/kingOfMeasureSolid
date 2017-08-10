<template>
  <div id="app">
    <!-- 填写个人信息窗口 -->
    <popup
      :closeOnClickModal="false"
      class="popue-user-info"
      v-model="popupVisible"
      popup-transition="popup-fade">  
        <div class="popup-content">
            <div class="title">填写个人信息</div>
            <div class="tips">填写个人信息后即可进行土地圈选</div>
            <field label="姓名" placeholder="必填" v-model="user.name"></field>
            <div class="sex-box clear">
                性别
                <div class="show-label">
                    <template v-if="user.sex">先生</template>
                    <template v-if="!user.sex">女士</template>
                </div>
                <mt-switch class="sex-radios" v-model="user.sex"></mt-switch>    
            </div>
            <field label="手机号"  :attr="{ maxlength: 11}"  placeholder="选填" type="tel" v-model="user.phone"></field>      
            <field label="邮箱" :state="emailState" placeholder="必填" type="email" v-model="user.email"></field> 
            <mt-button @click.native="saveUserInfo" :disabled="btnState" size="large" type="primary">开始圈地</mt-button>
        </div>  
    </popup>
    <tab-container class="tab-container" v-model="active" >
      <tab-container-item  id="tab1" class="tab-item choose-field">
        <l-map-editor-mobile  :visable="active=='tab1'" @finish="addOneField" ></l-map-editor-mobile>
      </tab-container-item>
      <tab-container-item id="tab2">
       <show-field :visable="active=='tab2'" :fields="chooseAllFields"></show-field>
      </tab-container-item>
      <tab-container-item id="tab3"  :visable="active=='tab3'">
        3<!-- <cell v-for="n in 7" title="tab-container 3"></cell> -->
      </tab-container-item>
    </tab-container>
    <tabbar class="bar-bottom" v-model="active" >
        <tab-item  id="tab1">
            <img slot="icon" src="./assets/map.png">        
            圈地
        </tab-item>
        <tab-item id="tab2">
            <img slot="icon" src="./assets/land.png">        
            已测土地
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

import {Toast,Button, TabContainer, TabContainerItem, Tabbar, TabItem,Popup,Radio,Field,Switch } from 'mint-ui';

export default {
  name: 'app',
  data(){
    return {
      user:{
        name:"",
        sex:true,
        phone:"",
        email:""
      },
      emailState:"",
      phoneState:"",
      btnState:true,
      active:"tab1",
      chooseAllFields:[],
      popupVisible:true
    }
  },
  props:{

  },
  computed:{

  },
  watch:{
    "user.name"(){
      this.validate();
    },
    "user.email"(){
      this.validate();
    }
  },
  components:{
    showField,
    LMapEditorMobile,
    TabContainer,
    TabContainerItem,
    Tabbar,
    TabItem,
    Popup,
    Radio,
    Field,
    mtSwitch:Switch,
    mtButton:Button,
  },
  created(){
  },
  methods:{
    select(id){
      console.log(id);
    },
    addOneField(bounds){
      this.chooseAllFields.push({
        name:"23123",
        bounds:bounds
      });
    },
    init(){
      /*检查是否填写个人信息，若没有填写则显示弹窗 提示 用户填写*/
    },
    validate(){
      // var phoneReg=/^(\+?0?86\-?)?1[345789]\d{9}$/;
      // if(!phoneReg.exec(this.user.phone)){
      //   this.phoneState="error";
      //   return;
      // }

      var emailReg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if(!emailReg.exec(this.user.email)){
        this.emailState="error";
        return;
      }else{
        this.emailState="success";
      }



      if(this.user.name!=""&&this.user.email!=""){
          this.btnState=false;
      }
    },
    saveUserInfo(){
      /*将数据发送到服务器*/
      /*成功后就可进入 圈地界面*/
      localStorage.setItem("user",JSON.stringify(this.user));
      console.log(Toast);
      Toast({
        message: '信息保存成功，即将进入圈地界面',
        duration: 999000,
        position:"middle",
        className:"popup-tips"
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

.clear{
  &:before,&:after{
        content:"";
        display: block;
        clear: both;
        width:0;
        height:0;    
  }
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;

  .popue-user-info{
    width:100%;
    padding:0.5rem;
    background-color: transparent;
    .popup-content{
      border-radius: 2px;
      padding:0.5rem;
      background-color:white;
      width:100%;
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
          margin-left:4rem;
          padding-right: 0.5rem;
          height:100%;
        }
        .sex-radios{
          margin-right: 0.5rem;
        }
      }
    }
  }

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
          border:3px solid white;
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
