<template>
  <section class="question-wrapper">
    <section class="question-list">
      <template v-for="(v,k) in questionList">
        <question-item :title="`${k+1+'.'+v.title}`" :question="v" v-show="currentIndex == k" :key="k" @nextQuestion="nextQuestion"></question-item>
      </template>
    </section>
    <section class="question-op">
      <!--<section class="question-op-l" @click="prev" v-show="currentIndex > 0">上一题</section>-->
      <section class="question-op-r">剩{{questionLen-(currentIndex+1)}}题</section>
    </section>
  </section>
</template>

<script>
  import questionList from "../js/questions";

  export default {
    name: "questionList",
    components: {
      questionItem:()=> import("./questionItem")
    },
    props: {},
    mixins: [],
    directives: {},
    filters: {},
    data() {
      return {
        questionList,
        currentIndex:0
      };
    },
    computed: {
      questionLen(){
        return this.questionList.length;
      }
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      nextQuestion(){
        this.currentIndex = ++this.currentIndex;
        if(this.currentIndex >= this.questionLen){
          this.$emit("lastQuestion");
        }
      },
      prev(){
        if(this.currentIndex <=0 ) return false;
        this.currentIndex = this.currentIndex - 1;
      }
    }
  };
</script>

<style scoped lang="less">
  .question-wrapper{
    border-bottom: 2px solid #DCDCDC;
    .question-op{
      display: flex;
      align-items: center;
      font-size:15px;
      font-family:AlibabaPuHuiTi;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:36px;
      height: 36px;
      position: relative;
      .question-op-l{
        position: absolute;
        left: 0;
      }
      .question-op-r{
        position: absolute;
        right: 0;
      }
    }
  }
</style>
