<template>
  <div class="bottom" :class="{'inline':inline}">{{title}}</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "- 这是我的底线 -",
    },
    inline:{
      type:Boolean,
      default:false
    }
  },
};
</script>


<style scoped>
.bottom{
  font-size: 13px;
  color: #CFCFCF;
  line-height: 30px;
  text-align: center;
  padding: 15px 0 50px 0;
}
.inline{
  padding: 0;
  border-top:1px solid #EFEFEF;
}
</style>
