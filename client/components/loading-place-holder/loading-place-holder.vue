<template>
  <article>
    <div class="kepu-cell-con">
      <div class="cell-img"></div>
      <div class="cell-text">
        <p class="cell-title"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
        <div class="cell-doc-info">
          <p class="info"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
        </div>
      </div>
    </div>
    </article>
</template>

<script >

export default {
  name:"doc-item"
};
</script>
<style scoped lang="less" rel="stylesheet/less">
 .kepu-cell{
    border-radius:10px;
    box-shadow: rgba(0,0,0,.1) 0 1px 8px;
    margin-bottom: 10px;
  }


  .kepu-cell-con{
    background-color:#fff;
    padding:15px;
    display:flex;
    border-bottom:2px solid #F2F5F8;
    .cell-text{
      display:flex;
      flex:1;
      flex-direction: column;
    }
    .cell-title{
      flex:1;
      font-size:10px;
      color: #129B83;
      font-weight: bold;
      span{
        display: inline-block;
        width: 100px;
        background-color: #F2F5F8;
        animation: myfirst 1.5s infinite;
        -moz-animation: myfirst 1.5s infinite;	/* Firefox */
        -webkit-animation: myfirst 1.5s infinite;	/* Safari 和 Chrome */
        -o-animation: myfirst 1.5s infinite;	/* Opera */
      }
    }
    .cell-doc-info{
      color: #666;
      span{
        display: inline-block;
        width: 200px;
        background-color: #F2F5F8;
        margin-top:10px;
        animation: mySec 1.5s 0.5s infinite;
        -moz-animation: mySec 1.5s .5s infinite;	/* Firefox */
        -webkit-animation: mySec 1.5s .5s infinite;	/* Safari 和 Chrome */
        -o-animation: mySec 1.5s .5s infinite;	/* Opera */
      }
    }
    .cell-img{
      width: 40px;
      height: 40px;
      background-color: #F2F5F8;
      margin-right: 20px;
      overflow: hidden;
      border-radius:50%;
      img{
        width: 40px;
        height: 40px;
        border-radius:50%;
      }
    }
  }

@keyframes myfirst
{
  0% {
    width: 80px;
  }
  50% {
    width: 150px;
  }
  100% {
    width: 80px;
  }
}

@-moz-keyframes myfirst /* Firefox */
{
  0% {
    width: 80px;
  }
  50% {
    width: 150px;
  }
  100% {
    width: 80px;
  }
}

@-webkit-keyframes myfirst /* Safari 和 Chrome */
{
  0% {
    width: 80px;
  }
  50% {
    width: 150px;
  }
  100% {
    width: 80px;
  }
}

@-o-keyframes myfirst /* Opera */
{
  0% {
    width: 80px;
  }
  50% {
    width: 150px;
  }
  100% {
    width: 80px;
  }
}


@keyframes mySec
{
  0% {
    width: 80px;
  }
  50% {
    width: 200px;
  }
  100% {
    width: 80px;
  }
}

@-moz-keyframes mySec /* Firefox */
{
  0% {
    width: 80px;
  }
  50% {
    width: 200px;
  }
  100% {
    width: 80px;
  }
}

@-webkit-keyframes mySec /* Safari 和 Chrome */
{
  0% {
    width: 80px;
  }
  50% {
    width: 200px;
  }
  100% {
    width: 80px;
  }
}

@-o-keyframes mySec /* Opera */
{
  0% {
    width: 80px;
  }
  50% {
    width: 200px;
  }
  100% {
    width: 80px;
  }
}

</style>
