<template>
  <section class="container">
    <div class="content-wrapper">
      <section class="content">
      <section v-if="showQuestion">
        <question-list @lastQuestion="lastQuestion"></question-list>
        <brands></brands>
      </section>
      <section v-else class="result">
        <section class="question-result">
          <h4 class="title">测试结果</h4>
          <section class="desc">
            您的牙齿属于重度畸形牙齿，您平日刷牙容易伤到牙龈导致流血，由于畸形牙齿会降低咀嚼功能，导致胃肠负担加重，久而久之会产生消化不良或胃肠疾病，且牙周环境恶劣，口腔问题发病率远高于一般人群，容貌受影响程度高，建议马上诊治，饭后要认真刷牙。
          </section>
          <section class="recommend">
            <p>去哪家医院可以更好、更安全?</p>
            <p>小爱已为您筛选出以下5家医院</p>
          </section>
        </section>
        <section class="recommend-hospital">
          <hospital-list type="chengdu"></hospital-list>
        </section>
      </section>
    </section>
    </div>
  </section>
</template>

<script>
  import communityService from "~/services/communityService.js";
  import { dataCollectMixin } from "~/mixins";

  export default {
    name: "toothWuh",
    components: {
      brands:()=> import("./components/brands"),
      questionList:() => import("./components/questionList"),
      hospitalList:() => import("./components/hospitalList")
    },
    mixins: [dataCollectMixin],
    data () {
      return {
        showQuestion:true
      };
    },
    filters: {
    },
    created() {
    },
    mounted(){
      if(this.$platformInfo.os && this.$platformInfo.os.isWeibo){
        this.getUidStatic();
      }
      if ("scrollRestoration" in history) {
        // 默认值为'auto'
        history.scrollRestoration = "manual";
      }
    },
    methods: {
      lastQuestion(){
        meteor.track("form", {convert_id: 1655943426773003 });
        this.showQuestion = false;
        
      },
      getUidStatic(){
        let uid = this._getThird("id");
        if(!uid) return false;
        const { channel } = this.$route.query;
        let d = {
          contentId:"chengdu",
          uid:this._getThird("id"),
          channel
        };
        communityService.addStaticUid(d).catch((e)=>{});
      }
    },
    head() {
      let innerHTML = "";
      innerHTML = `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?be80a72ce8e8dea7f5e034c8edea95c1";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();`;
      return {
        script:[
          {
            type: "text/javascript",
            innerHTML: innerHTML,
          }
        ],
        __dangerouslyDisableSanitizers: ["script"]
      };
    }
  };
</script>

<style lang="less" scoped>
  @import "./css/style.less";
</style>
