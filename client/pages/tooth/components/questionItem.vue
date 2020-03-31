<template>
  <div class="question-item">
    <div class="question-title">{{title}}</div>
    <ul class="question-options">
      <li class="question-option" v-for="(v,k) in question.options" :key="k" :class="{ active:activeIndex === k}" @click="selectIndex(k)">（{{k+1}}）{{v.name}}</li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: "questionItem",
    components: {},
    props: {
      title:{
        type:String,
        default:""
      },
      question:{
        type:Object,
        default: ()=>{
          return {
            options:[]
          };
        }
      }
    },
    mixins: [],
    directives: {},
    filters: {},
    data() {
      return {
        activeIndex:""
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      selectIndex(idx){
        this.activeIndex = idx;
        this.$emit("nextQuestion");
      }
    }
  };
</script>

<style scoped lang="less">
  .question-item{
    .question-title{
      font-size:22px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:26px;
      margin-bottom: 15px;
    }
    .question-options{
      .question-option{
        height:40px;
        line-height: 40px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border-radius:20px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(192,192,192,1);
        padding: 0 19px;
        font-size:15px;
        font-weight:400;
        color: #333333;
        margin-bottom: 8px;
        &.active{
          background:rgba(255,115,56,1);
          color: #fff;
          border:1px solid rgba(255,115,56,1);
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
  }
  @media screen and (max-width: 374px){
    .question-item{
        .question-title{
          font-size: 16px;
          line-height: normal;
        }
        .question-options{
          .question-option{
            font-size: 12px;
          }
      }
    }
  }
</style>
