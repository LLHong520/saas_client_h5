<template>
  <section class="container">
    <div class="content-wrapper">
      <section class="content">
      <section v-if="showQuestion">
        <question-list-new @lastQuestion="lastQuestion" :questionType="questionType"></question-list-new>
        <brands-new></brands-new>
      </section>
      <section v-else class="result">
        <test-result :questionType="questionType"></test-result>
        <hospital-list-new :type="city"></hospital-list-new>
      </section>
    </section>
    </div>
  </section>
</template>

<script>
  import communityService from "~/services/communityService.js";
  import { dataCollectMixin } from "~/mixins";
  //允许城市map
  const cityMap = { wuh:420100,chengdu:510100};

  export default {
    name: "tooth",
    provide(){
      return {
        injectData:{
          city:this.city,
          contentId:this.questionType,
          channel:this.channel,
          cityId:cityMap[this.city],
          bizId:this.bizId,
        }
      };
    },
    components: {
      brandsNew:()=> import("./components/brandsNew"),
      questionListNew:() => import("./components/questionListNew"),
      hospitalListNew:() => import("./components/hospitalListNew"),
      testResult:()=> import("./components/testResult")
    },
    mixins: [dataCollectMixin],
    data () {
      const { channel } = this.$route.query;
      this.channel = channel || "";
      return {
        showQuestion:true
      };
    },
    computed: {
      city(){
        const { city } = this.$route.query;
        return cityMap[city] ? city : "wuh";
      },
      questionType(){
        //允许问题组map
        const allowTypeArr = [1,2];
        const { type }= this.$route.query;
        return allowTypeArr.includes(Number(type)) ? type : 1;
      },
      bizId(){
        return `${this.city}_${this.questionType}`;
      }
    },
    filters: {
    },
    created() {
    },
    mounted(){
      if(this.$platformInfo.os && this.$platformInfo.os.isWeibo && this._getThird("id")){
        this.getUidStatic();
        this.handleAddFans();
      }
      if ("scrollRestoration" in history) {
        // 默认值为'auto'
        history.scrollRestoration = "manual";
      }
    },
    methods: {
      lastQuestion(){
        this.showQuestion = false;
        if(this.city=="chengdu"){
          meteor.track("form", {convert_id: 1655943426773003 });
        }else{
          meteor.track("form", {convert_id: 1655943865902087 });
        }
      },
      getUidStatic(){
        let d = {
          bizId:this.bizId,
          uid:this._getThird("id"),
          channel:this.channel,
          uidType:0,
          bizType:2
        };
        communityService.addCollectUidRecord(d).catch((e)=>{});
      },
      handleAddFans(){
        let weiboUID = this._getThird("id");
        let d = {
          weiboUID,
          questionType:this.questionType,
          channel:this.channel
        };
        communityService.addFansForStaticPage(d).then(res => {
          if(res.status == 200){
            let messageData = {
              bizId:this.bizId,
              weiboUID,
              channel:this.channel
            };
            this.handleSendPrivateMessage(messageData);
          }else{
            this.$toast.tip(res.message);
          }
        });
      },
      handleSendPrivateMessage(d = {}){
        communityService.sendPrivateMsgForStaticPage(d).catch((e)=>{});
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
      let OCPXHTML = `
        (function(root) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        script.src = "https://cheka.biz.weibo.com/index";
        script.onerror = function () {
          var request = new XMLHttpRequest();
          var web_url = window.encodeURIComponent(window.location.href);
          var url = "https://cheka.biz.weibo.com/v1/error";
          var data = {
            "error":{
              "url": web_url,
              "message": "404",
              "name": "__SDK_CDN__",
              "detail": {}
            }
          };
          request.open("POST", url, true);
          request.send("param=" + encodeURIComponent(data));
        };
        console.log("nowOCPX");
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.appendChild(script);
        })(window);
      `;
      let jrttHTML = `
        (function(r,d,s,l){var meteor=r.meteor=r.meteor||[];meteor.methods=["track","off","on"];meteor.factory=function(method){return function(){
        var args=Array.prototype.slice.call(arguments);args.unshift(method);meteor.push(args);return meteor}};for(var i=0;i<meteor.methods.length;i++){
        var key=meteor.methods[i];meteor[key]=meteor.factory(key)}meteor.load=function(){var js,fjs=d.getElementsByTagName(s)[0];js=d.createElement(s);
        js.src="https://analytics.snssdk.com/meteor.js/v1/"+l+"/sdk";fjs.parentNode.insertBefore(js,fjs)};meteor.load();if(meteor.invoked){return}
        meteor.invoked=true;meteor.track("pageview")})(window,document,"script","1655053520532488");
        `;
      return {
        script:[
          {
            type: "text/javascript",
            innerHTML: innerHTML,
          },
          {
            type:"text/javascript",
            innerHTML:OCPXHTML
          },
          {
            type:"text/javascript",
            innerHTML:jrttHTML
          }
        ],
        __dangerouslyDisableSanitizers: ["script"]
      };
    }
  };
</script>

<style lang="less" scoped>
  @import "./css/styleNew.less";
</style>
