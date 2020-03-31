<template>
  <div
    class="simple_editor clearfix needsclick"
    :placeholder="holderTxt"
    contenteditable="true"
    :id="editorId"
    ref="vEditor"
    @input="changeText"
    @focus="focusHandler"
    @blur="blurHandler">
  <!-- 键盘是否展开{{bShowRec}}{{innerHeight}} -->
    <slot>
      <div v-if="content!=''" v-html="content" class="needsclick"></div>
    </slot>
  </div>
</template>
<script type="text/ecmascript-6">
import simpleEditor from "./editor";
import { commonMixin } from "@/mixins";
export default {
  mixins: [ commonMixin],
  props: {
    changeing:{
      type:Function,
      default:()=>{}
    },
    imgdelHandler:{
      type:Function,
      default:()=>{}
    },
    content:{
      type:String,
      default:""
    },
    holderTxt:{
      type:String,
      default:"请输入文章内容，可插入图片，最多20000字"
    },
  },
  data(){
    return {
      editorId:"editor"+new Date().getTime(),
      editor:null,
      bShowRec:false,
      isEdit:true,
      innerHeight:0,
    };
  },
  created(){},
  mounted() {
    let options={
      instance:this
    };
      // console.log(options);
    this.editor=new simpleEditor(this.$refs.vEditor,options);
    var This=this;
    //监听键盘弹起和收缩事件
    var winHeight = window.innerHeight;
    if (this.$platformInfo.os.isAndroid)
    {
      window.addEventListener("resize", function(e) {
        var tempHeight = window.innerHeight;
        if (tempHeight < winHeight)
        {
          This.bShowRec = false;
        } else {
          This.bShowRec = true;
        }
      });
    }
  },
  methods:{
    setContent(html){
      return this.editor.setContent(html);
    },
    getContent(){
      return this.editor.getContent();
    },
    getHtml(){
      return this.editor.getHtml();
    },
    getImgNum(){
      return this.editor.getImgNum();
    },
    appendImg(imgObj){
      this.editor.appendImg(imgObj);
    },
    updateImgUrl(imgObj){
      this.editor.updateImgUrl(imgObj);
    },
    changeText(){
      this.$emit("changeing",this.getHtml());
    },
    focusHandler(){
      this.bShowRec = true;
      this.innerHeight = $(window).scrollTop();
    },
    blurHandler(){
      this.bShowRec = false;
      this.innerHeight = window.innerHeight;
    },
    imgDelCall(picId){
      console.log("+++++++++++++++");
      this.$emit("imgdelHandler",picId);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less">
.simple_editor .editor-img{
  position: relative;
  width: 100px;
  height: auto;
  img{
    width:100%;
  }
  .scale-icon{
    position: absolute;
    left: 0;
    top: 0;
    display:block;
    width: 24px;
    height: 24px;
    background: url('./images/button-suofang@2x.png') no-repeat center;
    background-size: contain;
  }
  .del-icon{
    position: absolute;
    right: 0;
    top: 0;
    display:block;
    width: 24px;
    height: 24px;
    background: url('./images/icon-close@2x.png') no-repeat center;
    background-size: contain;
  }
}
</style>
<style scoped lang="less" rel="stylesheet/less">
.simple_editor{
  line-height: 150%;
  height:300px;
  overflow-y: scroll;
  user-select: text;
  -webkit-user-select:text;
  &:before,&:after {
    line-height:20px;
  }
}
.simple_editor p,.simple_editor div{
  user-select: text;
  -webkit-user-select:text;
  min-width: 50px;
  margin: 10px 0;
}
// .simple_editor:empty:before{
//   content:attr(placeholder);
//   font-size: 16px;
//   color: #999;
//   padding:12px 0 0;
// }
// .simple_editor:focus{
//   content:none;
// }
.simple_editor {
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
  }
  /deep/ a{
    text-decoration:underline!important;
    color: #72ACE3!important;
  }
  /deep/ i,/deep/ em{
    font-style: italic;
  }
}
</style>
