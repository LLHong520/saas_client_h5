<template>
  <div class="rich_text" v-html="richHtml"></div>
</template>

<script>
export default {
  props: {
    richHtml: {
      type: String,
      default: ""
    }
  }
};
</script>


<style lang="less" scoped>
.rich_text {
  /deep/ strong,
  /deep/ b,
  /deep/ h1,
  /deep/ h2,
  /deep/ h3,
  /deep/ h4,
  /deep/ h5,
  /deep/ h6 {
    font-weight: bold;
  }
  /deep/ h1 {
    display: block;
    font-size: 2em;
  }
  /deep/ h2 {
    display: block;
    font-size: 1.5em;
  }
  /deep/ h3 {
    display: block;
    font-size: 1.17em;
  }
  /deep/ h5 {
    display: block;
    font-size: 0.83em;
  }
  /deep/ h6 {
    display: block;
    font-size: 0.67em;
  }
  /deep/ img {
    display: initial;
    max-width: 100%;
  }
  /deep/ a {
    text-decoration: underline !important;
    color: #72ace3 !important;
  }
  /deep/ i,
  /deep/ em {
    font-style: italic;
  }
  /deep/ table {
    margin-bottom: 10px;
    border-collapse: collapse;
    display: table;
    tbody {
      tr {
        td {
          // background-color: red;
          padding: 5px 10px;
          border: 1px solid #ddd;
        }
      }
    }
  }
  /deep/ ul {
    padding-left: 15px;
    li{
      list-style: inherit;
    }
    p {
      margin: 5px 0;
    }
  }
}
</style>
