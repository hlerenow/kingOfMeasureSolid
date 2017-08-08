<template>
  <div id="app">
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

import { TabContainer, TabContainerItem, Tabbar, TabItem } from 'mint-ui';

export default {
  name: 'app',
  data(){
    return {
      active:"tab1",
      chooseAllFields:[],
    }
  },
  props:{

  },
  computed:{

  },
  watch:{

  },
  components:{
    showField,
    LMapEditorMobile,
    TabContainer,
    TabContainerItem,
    Tabbar,
    TabItem
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
    }
  },
  filters:{

  }
}
</script>

<style lang="less">

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

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
          border:3px solid white;
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
