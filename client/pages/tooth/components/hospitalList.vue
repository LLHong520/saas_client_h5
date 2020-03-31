<template>
  <section class="hospital-list">
    <section class="hospital-item" v-for="(v,k) in hospitalList" :key="k" @click="selectHospital(v)">
      <img :src="v.img" alt="">
    </section>
    <nuxt-link class="more" :to="locationRoute">查看更多推荐医院 >></nuxt-link>
    <dialogEdit v-model="dialogEditShow" :options="dialogEditOptions" @success="successDialogEdit"></dialogEdit>
  </section>
</template>

<script>
  import hospitalList from "../js/hospitals";
  import { PROJECT_ENV } from "~/config";
  export default {
    name: "hospitalList",
    components: {
      dialogEdit:()=> import("./dialog_edit")
    },
    props: {
      type:{
        type:String,
        default:"wuh"
      }
    },
    mixins: [],
    directives: {},
    filters: {},
    data() {
      this.hospitalList = hospitalList[this.type];
      return {
        dialogEditShow:false,
        dialogEditOptions:{},
        dictionary:{
          //生产地址
          locationList:{
            wuh:{
              path:"/appointment/hospital",
              query:{
                planId:"5de8bdda24aa9a0009bebbe6",
                channel:10
              }
            },
            chengdu:{
              path:"/appointment/hospital",
              query:{
                planId:"5dbfcfed3b3af500087c7721",
                channel:10
              }
            }
          }
        },
        oldScrollTop:0
      };
    },
    computed: {
      locationRoute(){
        if(PROJECT_ENV == "test"){
          return {
            path:"/appointment/hospital",
            query:{
              planId:"5de8bb462ab79c00076675c9",
              channel:0
            }
          };
        }
        return this.dictionary.locationList[this.type] || { name:"Index"};
      }
    },
    watch: {
      dialogEditShow(nval){
        if(nval){
          this.oldScrollTop = this.getScrollTop() || 0;
        }else{
          console.log(nval);
        }
      }
    },
    created() {
      console.log(PROJECT_ENV);
    },
    mounted() {
      let body = document.body;
      let html = document.documentElement;
      let timer = "";
      if(this.$platformInfo.os && this.$platformInfo.os.isiOS){
        body.addEventListener("focusout", () => { // 失焦
          clearTimeout(timer);
          // let scrollTop = this.getScrollTop();
          timer = setTimeout(() => {
            body.scrollTop = this.oldScrollTop;
            html.scrollTop = this.oldScrollTop;
          }, 200);
        });
        body.addEventListener("focusin", () => { // 聚焦
          this.oldScrollTop = this.getScrollTop() || 0;
        });
      }
    },
    methods: {
      selectHospital(v){
        this.dialogEditShow = true;
        this.dialogEditOptions = {
          id:v.id,
          type:this.type
        };
      },
      successDialogEdit(){

      },
      documentScrollTop(type) {
        /**
         * 注： 解决安卓、ios兼容问题
         * 1.安卓body使用overflow：hidden时，会回到顶部
         * 2.ios输入框聚焦时，虚拟键盘会把整个页面向上顶
         *
         * PS：程序执行顺序不能改（重要）
         * */
        // ios input虚拟键盘空白问题
        let ua = window.navigator.userAgent;
        let oldScrollTop = this.getScrollTop() || 0;
        let html = document.documentElement;
        let body = document.body;
        let ver = ua.match(/cpu iphone os (.*?) like mac os/i);
        let isIOS11 = "";

        // ios11 fixed布局的虚拟键盘会把input框遮住
        if (ver) {
          isIOS11 = ver[1].split("_")[0];
        }

        if (type == "open") {
          this.oldScrollTop = oldScrollTop;
          $("body").addClass("ios-fixed");

          // ios虚拟键盘问题
          if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) && isIOS11 != "11") {
            let timer = null;

            body.addEventListener("focusin", (e) => { // 聚焦
              clearTimeout(timer);
              timer = setTimeout(() => {
                body.scrollTop = body.clientHeight;
                html.scrollTop = html.clientHeight;
              }, 200);

            });

            body.addEventListener("focusout", () => { // 失焦
              clearTimeout(timer);
              timer = setTimeout(() => {
                body.scrollTop = this.oldScrollTop;
                html.scrollTop = this.oldScrollTop;
              }, 200);
            });
          }
        }

        body.scrollTop = this.oldScrollTop;
        html.scrollTop = this.oldScrollTop;

        // 安卓overflow：hidden问题
        if (this.$platformInfo.os.isAndroid) {
          let clientHeight = body.clientHeight;
          let top = this.oldScrollTop > clientHeight
            ? clientHeight / 3
            : this.oldScrollTop / 2;

          if (type == "open") {
            body.style.top = `-${top}px`;
          } else {
            body.style.top = "initial";
          }
        }
      },
      getScrollTop() {
        let scrollTop = 0;
        let ele = document.documentElement;

        if (ele && ele.scrollTop) {
          scrollTop = ele.scrollTop;
        } else if (document.body) {
          scrollTop = document.body.scrollTop;
        }

        return scrollTop;
      },
    }
  };
</script>

<style scoped lang="less">
 .hospital-list{
   .hospital-item{
     width: 100%;
     height:101px;
     background:rgba(238,238,238,1);
     border-radius:5px;
     margin-bottom: 9px;
     &:last-child{
       margin-bottom: 0;
     }
     img{
       height: 100%;
     }
   }
   .more{
     width:242px;
     height:36px;
     line-height: 36px;
     display: flex;
     align-items: center;
     justify-content: center;
     background:rgba(255,115,56,1);
     box-shadow:0px 8px 11px 0px rgba(255,115,56,0.26);
     font-size:18px;
     font-weight:400;
     color:rgba(255,255,255,1);
     border-radius:18px;
     margin: 19px auto 0;
   }
 }
</style>
