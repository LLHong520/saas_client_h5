<template>
  <section class="container">
    <ul>
      <li v-for="(item,index) in notices" :key="index">
        <nuxt-link :to="{path:'/notices/'+item.id}">
         {{ item.title }}
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
import sysServices from "~/services/sysService.js";

export default {
  components: {},
  data(){
    return {
      notices: []
    };
  },
  created(){
    this.queryList();
  },
  methods:{
    queryList(){
      sysServices.queryList({})
        .then(((res)=>{
          if(res.status==200){
            this.notices=res.data.data.list;
          }
        }));
    }
  },
  head(){
    return {
      title: "我是users",
    };
  }
};
</script>

<style>
</style>
