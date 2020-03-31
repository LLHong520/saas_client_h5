<template>
  <div class="question-item">
    <div class="question-title">{{title}}</div>
    <ul class="question-options">
      <template  v-for="(v,k) in question.options">
        <li class="question-option question-option-2" :key="k" v-if="v.type == 2" :class="{ active:activeIndex === k}" @click="selectIndex(k)">
          <div class="image-wrapper" :style="v.imageWrapperStyle || {}">
            <img :src="v.image" alt="" :width="v.width+'px'">
          </div>
          <div class="check-icon"></div>
        </li>
        <li class="question-option question-option-1" :key="k" v-else :class="{ active:activeIndex === k}" @click="selectIndex(k)">
          <p class="name">{{v.name}}</p>
          <div class="image-wrapper" :style="v.imageWrapperStyle || {}">
            <img :src="v.image" alt="" :width="v.width+'px'">
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>

  export default {
    name: "questionItemNew",
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
        this.$emit("nextQuestion",{
          answer:idx+1
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .question-item{
    .question-title{
      font-size:18px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:26px;
      margin-bottom: 15px;
    }
    .question-options{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .question-option{
        display: flex;
        box-sizing: border-box;
        border-radius:10px;
        background:rgba(255,255,255,1);
        border:1px solid #DCDCDC;
        padding: 13px 8px 0 8px;
        font-size:15px;
        font-weight:400;
        color: #333333;
        margin-bottom: 10px;
        width: calc((100% - 8px) /2);
        height: 127px;
        overflow: hidden;
        &:last-child{
          margin-bottom: 0;
        }
      }
      .question-option-1{
        flex-direction: column;
        color: #666666;
        .name{
          margin-bottom: 3px;
          flex-shrink: 0;
          font-size:15px;
          font-weight:500;
          color:rgba(102,102,102,1);
        }
        .image-wrapper{
          flex: 1;
          overflow: hidden;
        }
      }
      .question-option-2{
        position:relative;
        .image-wrapper{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        &.active{
          .check-icon{
            background: url("../images/question_2/selected_icon.png") no-repeat center;
            background-size: cover;
          }
        }
        .check-icon{
          width: 24px;
          height: 24px;
          background: url("../images/question_2/unchecked.png") no-repeat center;
          background-size: cover;
          position: absolute;
          bottom: 6px;
          right: 9px;
        }
      }
    }
  }
  @media screen and (max-width: 374px){
    .question-item{
      .question-options{
        .question-option-1{
          .name{
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
