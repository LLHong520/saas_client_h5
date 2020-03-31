<template>
  <section class="result">
    <section class="result-header">
      <p>感谢您的配合，您的牙齿已经</p>
      <p>初步具备得牙周疾病的条件</p>
    </section>
    <section class="result-consequence">出现牙齿清洁困难、口臭、以及体质逐渐肥胖等情况，根据您的回答，<strong>为您匹配出10家匹配度最高的医院，</strong>可视情况选择合适的地点就医，优惠可在预约后到店使用。</section>
  </section>
</template>

<script>

  export default {
    name: "testResult2",
    components: {},
    props: {},
    mixins: [],
    directives: {},
    filters: {},
    data() {
      return {
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {}
  };
</script>

<style scoped lang="less">
  .result{
    padding-bottom: 27px;
    .result-header{
      margin-bottom: 17px;
      p{
        display: inline-block;
        font-size:18px;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:24px;
        background:rgba(51,51,51,1);
        margin-top: 2px;
        &:first-child{
          margin-top: 0;
        }
      }
    }
    .result-consequence{
      line-height:16px;
      color: #333333;
      font-size: 12px;
    }
  }
</style>
