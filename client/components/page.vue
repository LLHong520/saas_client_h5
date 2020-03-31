<template>
  <div class="load_data" @click="loadFnCallback" :class="{'border_on':border_on}">
    <span>{{title}}</span><em v-if="!loading"></em>
  </div>
</template>

<script>
export default {
  name: "mHeader",
  props: {
    border_on: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    title:{
      type:String,
      default:"查看更多",
    }
  },
  data() {
    return {};
  },
  components: {
  },
  computed: {},
  methods: {
    loadFnCallback(){
      console.log("sss");
      this.$emit("loadFn");
    }
  }
};
</script>

<style scoped>
.load_data{
  height: 48px;
  line-height: 48px;
  font-size: 13px;
  color: #999;
  text-align: center;
}
.load_data em{
  display: inline-block;
  width: 10px;
  height: 10px;
  background: url(../assets/images/btn_more@2x.png) no-repeat center center;
  background-size: 10px 10px;
  margin-left: 4px;
}
.border_on{
  border-top:1px solid #EFEFEF;
}
</style>
