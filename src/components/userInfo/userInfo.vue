<template>
    <!-- 填写个人信息窗口 -->
    <popup
      :closeOnClickModal="false"
      class="popue-user-info"
      v-model="popupVisible"
      popup-transition="popup-fade">  
        <div class="popup-content">
            <div class="title">填写手机号</div>
            <div class="tips">填写手机后即可进行土地圈选</div>
            <!-- <field label="姓名" placeholder="必填" v-model="user.name"></field> -->
<!--             <div class="sex-box clear">
                性别
                <div class="show-label">
                    <template v-if="user.sex">先生</template>
                    <template v-if="!user.sex">女士</template>
                </div>
                <mt-switch class="sex-radios" v-model="user.sex"></mt-switch>    
            </div> -->
            <field label="手机号"  :attr="{ maxlength: 11}"  placeholder="必填" type="tel" v-model="user.phone"></field>      
            <!-- <field label="邮箱" :state="emailState" placeholder="必填" type="email" v-model="user.email"></field>  -->
            <mt-button @click.native="saveUserInfo" :disabled="btnState" size="large" type="primary">开始圈地</mt-button>
        </div>  
    </popup>
</template>

<script>
import {Popup,Radio,Field,Switch,Toast,Button } from 'mint-ui'

export default {

  name: 'userInfo',

  data () {
    return {
      user:{
        name:"",
        sex:true,
        phone:"",
        email:"",
        createdTime:""
      },
      emailState:"",
      phoneState:"",
      btnState:true,
      active:"tab1",
      chooseAllFields:[],
      popupVisible:true          	

    };
  },
  components:{
    Popup,
    Radio,
    Field,
    mtSwitch:Switch,
    mtButton:Button,  	
  },
  watch:{
    "user.name"(){
      this.validate();
    },
    "user.phone"(){
      this.validate();
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    addOneField(bounds){
      this.chooseAllFields.push({
        name:"23123",
        bounds:bounds
      });
    },
    init(){
      /*检查是否填写个人信息，若没有填写则显示弹窗 提示 用户填写*/
      this.checkUserInfo();

    },
    checkUserInfo(){
      let userInfo="";
      try{
        userInfo=JSON.parse(localStorage.getItem("user"));
        if(!userInfo){
          this.popupVisible=true;
          return;
        }

        /*检查是否过期,过期时间为一周*/
        if(Date.now()-userInfo.createdTime>(1*24*60*60*1000+60*60*1000)){
          localStorage.setItem("user","");
          this.popupVisible=true;
          return;
        }else{
          this.popupVisible=false;
        }

        this.user=userInfo;

      }catch(e){
        console.log(e);
        /*用户之前没有填写个人信息,提示用户填写个人信息*/
        this.popupVisible=true;
      }      
    },
    validate(){
      var phoneReg=/^(\+?0?86\-?)?1[345789]\d{9}$/;
      if(!phoneReg.exec(this.user.phone)){
        this.phoneState="error";
        return;
      }

      // var emailReg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      // if(!emailReg.exec(this.user.email)){
      //   this.emailState="error";
      //   return;
      // }else{
      //   this.emailState="success";
      // }

      // if(this.user.name!=""&&this.user.email!=""){
          this.btnState=false;
      // }
    },
    saveUserInfo(){
      /*将数据发送到服务器*/
      /*成功后就可进入 圈地界面*/
      this.user.createdTime=Date.now();

      localStorage.setItem("user",JSON.stringify(this.user));
      console.log(Toast);
      setTimeout(()=>{
        this.popupVisible=false;
      },3000);
      Toast({
        message: '信息保存成功，即将进入圈地界面',
        duration: 3000,
        position:"middle",
        className:"popup-tips"
      });
    }  	
  }  
};
</script>

<style lang="less">
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
            background-color: #E91E63;
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