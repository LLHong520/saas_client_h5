<template>
  <section class="test-result">
    <testResult1 v-if="questionType == 1"></testResult1>
    <testResult2 v-else-if="questionType == 2"></testResult2>
  </section>
</template>

<script>

  export default {
    name: "testResult",
    components: {
      testResult1:()=>import("./testResult1"),
      testResult2:()=>import("./testResult2"),
    },
    props: {
      questionType:{
        type:[String,Number]
      }
    },
    mixins: [],
    directives: {},
    filters: {},
    data() {
      return {};
    },
    computed: {
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {}
  };
</script>

<style scoped lang="less">
  .test-result{
    padding: 0 7px;
  }
</style>
