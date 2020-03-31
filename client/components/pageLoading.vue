<template>
  <div>
    <!-- 点击加载 -->
    <div v-if="!end && !empty" class="load_data" @click="loadFnCallback" :class="{'border_on': border_on}">
      <img v-if="loading" src="~/assets/images/pageLoading.gif"/>
      <span>{{ loading ? loadingTxt : title }}</span>
      <em v-if="!loading" class="icon more"></em>
    </div>

    <!-- 底线 -->
    <div v-if="end && !empty" class="bottom" :class="{'inline':inline}">{{ bottomTxt }}</div>

    <empty v-if="!loading && empty" :isFullScreen="isFullScreen"></empty>

    <m-loading :loading="firstLoading"></m-loading>
  </div>
</template>

<script>
  import empty from "@/components/empty.vue";
  import loading from "@/components/loading.vue";

  export default {
    components: {
      empty,
      mLoading: loading
    },
    props: {
      border_on: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      loadingTxt: {
        type: String,
        default: "加载中...",
      },
      title: {
        type:String,
        default:"查看更多",
      },
      end: {
        type: Boolean,
        default: false
      },
      bottomTxt: {
        type: String,
        default: "- 这是我的底线 -",
      },
      inline: {
        type:Boolean,
        default: false
      },
      empty: {
        type:Boolean,
        default: false
      },
      isFullScreen: {
        type:Boolean,
        default: true
      }
    },
    data() {
      return {};
    },
    computed: {
      firstLoading() {
        return this.loading && this.empty;
      }
    },
    methods: {
      loadFnCallback(){
        this.$emit("loadFn");
      }
    }
  };
</script>

<style scoped>
  .load_data{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    line-height: 48px;
    font-size: 13px;
    color: #999;
    text-align: center;
  }
  .load_data .icon{
    display: inline-block;
    width: 10px;
    height: 10px;
  }
  .load_data img{
    margin-right: 4px;
    width: 20px;
    height: 20px;
  }
  .load_data .icon.more{
    margin-left: 4px;
    background: url(../assets/images/btn_more@2x.png) no-repeat center center;
    background-size: 10px 10px;
  }

  .border_on{
    border-top:1px solid #EFEFEF;
  }
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
