<template>
  <section class="container">
    <m-header title="发布帖子"></m-header>
    <div class="edit_box">
      <div class="tit">
        <input type="text" v-model="postInfo.title" placeholder="请输入标题">
      </div>
      <div class="post_cont">
        <!-- <div class="edit_area"></div> -->
        <!-- <div>
          <textarea class="edit_area" name="" v-model="postInfo.content" placeholder="请填写内容" rows=""></textarea>
        </div> -->
        <!-- 富文本编辑器 -->
        <simpleEditor ref="simpleEditor" @changeing="changeingHandler" @imgdelHandler="imgdelHandler" holderTxt="请填写内容">
        </simpleEditor>
        <!-- 图片列表 -->
        <!-- <div class="img_box">
          <ul v-if="imgFiles.length > 0" class="pre_photo pre_photo3 clearfix">
            <li v-for="(item,index) in imgs" :key="index" @click="preview(index)">
              <a href="javascript:;" class="delete" @click.stop="delImg(index)"></a>
              <div class="img_wrapper">
                <img :src="item.url" />
              </div>
              <span class="tip" v-if="item.status==0">等待上传</span>
              <span class="tip err" @click.stop="uploadImg(index)" v-else-if="item.status==-1">重新上传</span>
              <span class="tip" v-else-if="item.status==2">上传中</span>
              <span class="tip suc" v-else>已上传</span>
            </li>
          </ul>
        </div> -->
        <!-- /图片列表 -->
      </div>
    </div>

    <!-- 上传按钮 -->
    <div class="up_btn_wrapper">
      <div class="up_btn">
        <!-- <input type="file"> -->
        <!-- v-show="!choose_img_on" -->
        <p v-show="imgsNum==0">上传图片</p>
        <p v-show="imgsNum>0">{{imgsNum}}/20</p>
        <template v-if="refreshInput">
          <input :id="inputId" v-if="!choose_img_on" accept="image/*" name="" type="file" @change="handleFileChange"
            ref="inputer" />
        </template>
      </div>
    </div>
    <!-- /上传按钮 -->

    <div v-if="tagList.length >0 " class="mt10 box_wrapper">
      <div class="common_hd">
        <h3>添加标签</h3>
      </div>
      <div class="common_bd">
        <div class="marks_box">
          <span v-for="(item,index) in tagList" :key="index" :class="{'active': item.is_check}" @click="checkThis(index)">
            {{item.name}}
          </span>
        </div>
      </div>
    </div>
    <div class="blank56"></div>
    <div class="btn_box">
      <a href="javascript:;" :class="{'disabled': !enable}" class="btn" @click="uploadFile">发布</a>
    </div>
    <!-- 加载中 -->
    <loading ref="uploadingImg" />
    <!-- 加载中 -->
    <!-- 图片预览层 -->
    <!-- <transition enter-active-class='animated slideInUp' leave-active-class='animated slideOutDown' mode='out-in'>
      <div class="blackpre" v-show="is_perview">
        <div class="bal_head">
          <a class="green_back" href="javascript:;" @click="hidePreview">
            返回</a>
          <h2>预览</h2>
          <a class="seven_del" @click="delImg(previewIndex)"></a>
        </div>
        <div class="black_img" @click="hidePreview">
          <img :src="previewImg.url" />
        </div>
      </div>
    </transition> -->
    <!-- /图片预览层 -->
  </section>
</template>

<script>
  import {
    commonMixin,
    comtyIdValid
  } from "~/mixins";
  let lrz = null;
  if (process.client) {
    lrz = require("lrz");
  };
  import simpleEditor from "@/components/simple_editor";
  import loading from "~/components/loading.vue";
  import tools from "~/utils/tools.js";
  import header from "~/components/header.vue";
  import sysService from "~/services/sysService.js";
  import postBarService from "~/services/postBarService.js";

  export default {
    name: "post",
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      loading: loading,
      simpleEditor: simpleEditor,
    },
    middleware: ["checkLogin"],
    data() {
      return {
        refreshInput: true,
        action: "add",
        postsId: "",
        imgsNum: 0,
        tagList: [],
        postInfo: {
          title: "",
          content: "",
        },
        is_perview: false,
        imgs: [],
        imgIds: [],
        imgFiles: [],
        previewImg: "",
        postingTip: "",
        inputId: new Date().getTime(),
        previewIndex: -1,
        posting: false,
        postBarId: "",
        comtyId: "",
      };
    },
    created() {
      this.postBarId = this.$route.query.postBarId;
      this.postsId = this.$route.query.postsId;
      this.comtyId = this.$route.query.comtyId;
      if (this.postsId) {
        this.getPostInfo();
        this.action = "update";
      } else {
        this.getPostTagsByList();
      }
    },
    mounted() {},
    computed: {
      enable() {
        let is = false;
        if (tools.isEmpty(this.postInfo.title) || tools.isEmpty(this.postInfo.content) || this.posting) {
          is = false;
        } else {
          is = true;
        };
        return is;
      },
      checkTags() {
        let choose_tags = [];
        for (let index in this.tagList) {
          if (this.tagList[index].is_check) {
            choose_tags.push(this.tagList[index].id);
          }
        }
        return choose_tags;
      },
      choose_img_on() {
        return this.imgFiles.length >= 5;
      }
    },
    methods: {
      /*编辑帖子时提交 */
      updatePostTopic() {
        let This = this;
        let title = this.postInfo.title;
        // let content = tools.getFormatFakeHtml(This.postInfo.content);
        let content = this.getHtml();
        let data = {
          id: this.postsId,
          title,
          content,
          imgIds: this.imgIds,
          postTags: this.checkTags,
          userId: This.postInfo.userId,
          userName: This.postInfo.userName,
          userPhoto: This.postInfo.userPhoto,
          userType: This.postInfo.userType,
          status: This.postInfo.status,
          updateUserId: This.VX_userInfo.id,
          isEssence: This.postInfo.isEssence,
          isTop: This.postInfo.isTop,
          isRecommend: This.postInfo.isRecommend,
          postBarId: this.postBarId,
          communityId: this.comtyId,
          orgId: this.VX_orgId
        };
        this.posting = true;
        postBarService.updatePosts(data).then((res) => {
          This.posting = false;
          if (res.status == 200) {
            This.postInfo.title = "";
            This.postInfo.content = "";
            This.imgIds = [];
            This.postTags = [];
            This.imgFiles = [];
            This.$toast.tip("编辑成功");
            setTimeout(function () {
              This.$router.replace({
                path: "/tieba/" + This.postsId,
                query: {
                  comtyId: This.comtyId
                }
              });
            }, 500);
          };
        });
      },
      /*编辑器文字改变回调 */
      changeingHandler(newText) {
        this.postInfo.content = newText;
        this.refreshImgNum();
        console.log("改变了");
      },
      getPostTagsByList() {
        postBarService.getPostTagsByList({
          postBarId: this.postBarId
        }).then(res => {
          if (res.status == 200 && res.data) {
            let array = [];
            res.data.map((item) => {
              let is_check = false;
              if (this.action == "update") {
                is_check = this.postInfo.postTags.indexOf(item.id) >= 0 ? true : false;
              }
              array.push({
                ...item,
                is_check: is_check
              });
            });
            this.tagList = array;
          }
        });
      },
      preview(index) {
        this.is_perview = true;
        this.previewIndex = index;
        this.previewImg = this.imgs[index];
      },
      hidePreview() {
        this.is_perview = false;
      },
      delImg(index) {
        if (this.imgs[index].status == 2) {
          this.$toast.tip("图片上传中，请上传成功后删除~");
          return;
        }
        let This = this;
        if (this.imgs[index].status == 1) {
          topicService.img_remove({
            picId: this.imgIds[index]
          }).then(() => {
            This.imgs.splice(index, 1);
            This.imgIds.splice(index, 1);
            This.imgFiles.splice(index, 1);
          }, function () {
            This.$toast.tip("删除图片失败，请重试~");
          });
        } else {
          this.imgs.splice(index, 1);
          this.imgFiles.splice(index, 1);
        }
        this.is_perview = false;
      },
      uploadImg(index) {
        let This = this;
        This.imgs[index].status = 2;
        let params = This.imgFiles[index];
        //提交到服务器
        var fd = new FormData();
        fd.append("file", params.blob);
        sysService.uploadImg(fd).then((res) => {
          This.$refs.uploadingImg.finish();
          if (res.status == 200 && res.data) {
            // This.$toast.tip("上传成功~",JSON.stringify(res));
            // document.execCommand("insertimage", 0, res.data.url);
            This.imgs[index].status = 1;
            This.imgIds.push(res.data.id);
            This.updateImgUrl(This.imgs[index].elId, res.data.url);
          } else {
            This.imgs[index].status = -1;
            This.$toast.tip("上传失败！");
            This.imgs.splice(index, 1);
            This.imgFiles.splice(index, 1);
          }
        }, function () {
          This.imgs[index].status = -1;
          This.$toast.tip("上传失败！");
          This.imgs.splice(index, 1);
          This.imgFiles.splice(index, 1);
        });
      },
      handleFileChange() {
        console.log(this.imgsNum);
        if (this.imgsNum == 20) {
          this.$toast.tip("只允许上传20张图片哦");
          return;
        }
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        if (inputDOM.files.length === 0) return;
        this.file = inputDOM.files[0];
        let size = (this.file.size / 1024 / 1024).toFixed(2);
        if (size > 5) {
          this.$toast.tip("请选择小于5M的图片哦~");
          return;
        }
        let This = this;
        inputDOM.value = ""; //
        // this.refreshInput = !this.refreshInput; //
        // setTimeout(() => {
        //   This.refreshInput = !This.refreshInput; //
        // }, 200);
        This.$refs.uploadingImg.start();
        //插件压缩
        lrz(this.file, {
          quality: 0.3,
          width: 800
        }).then(function (rst) {
          let newImgItem = {
            url: rst.base64,
            status: 0,
            elId: "img" + new Date().getTime()
          };
          This.imgs.push(newImgItem);
          This.inputId = new Date().getTime();
          // 处理成功会执行
          This.imgFiles.push({
            name: This.file.name,
            blob: rst.file
          });
          console.log("压缩成功");

          console.log(newImgItem.elId);
          console.log(rst.base64);
          console.log("压缩成功");
          This.appendImg(newImgItem.elId, rst.base64);
          console.log("插入成功");
          // alert($(".simple_editor").eq(0).html());
          // alert($(".simple_editor").get(0).outerHTML);
          //压缩完直接上传
          This.imgs[This.imgFiles.length - 1].status = 2;
          This.uploadImg(This.imgFiles.length - 1);
        }).catch(function () {
          This.$refs.uploadingImg.finish();
          // 处理失败会执行
          This.$toast.tip("上传失败，请重新上传");
        }).always(function () {
          // 不管是成功失败，都会执行
          This.initing_page = false;
        });
      },
      handleFileChangeNew() {
        console.log(this.imgsNum);
        if (this.imgsNum == 5) {
          this.$toast.tip("只允许上传五张图片哦");
          return;
        }
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        if (inputDOM.files.length === 0) return;
        this.file = inputDOM.files[0];
        let size = (this.file.size / 1024 / 1024).toFixed(2);
        if (size > 5) {
          this.$toast.tip("请选择小于5M的图片哦~");
          return;
        }
        let This = this;
        inputDOM.value = ""; //
        this.refreshInput = !this.refreshInput; //
        setTimeout(() => {
          This.refreshInput = !This.refreshInput; //
        }, 200);

        //压缩完直接上传
        this.getImgBase64AndUpload(this.file);
      },
      getImgBase64AndUpload(file) {
        let This = this;
        // var reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function (e) {
        //   let base64Code = this.result;
        //   let newImgItem = {
        //     url: base64Code,
        //     status: 0,
        //     elId:"img" + new Date().getTime()
        //   };
        //   This.imgs.push(newImgItem);
        //   This.inputId = new Date().getTime();
        //   // 处理成功会执行
        //   This.imgFiles.push({
        //     name: file.name,
        //     blob: file
        //   });
        //   This.imgs[This.imgFiles.length - 1].status = 2;
        //   let index =  This.imgFiles.length - 1;
        //   This.appendImg(newImgItem.elId, base64Code);
        //   This.uploadFileDirectly(file,index);
        // };
        let newImgItem = {
          url: "",
          status: 0,
          elId: "img" + new Date().getTime()
        };
        This.imgs.push(newImgItem);
        This.inputId = new Date().getTime();
        // 处理成功会执行
        This.imgFiles.push({
          name: "",
          blob: file
        });
        This.imgs[This.imgFiles.length - 1].status = 2;
        let index = This.imgFiles.length - 1;
        // This.appendImg(newImgItem.elId, base64Code);
        This.uploadFileDirectly(file, index);
        // This.uploadAvater(file, index);
      },
      uploadFileDirectly(file, index) {
        let This = this;
        This.$refs.uploadingImg.start();
        //上传
        var fd = new FormData();
        fd.append("fileName", "222222");
        fd.append("fileData", file);
        sysService.imgUpload(fd).then((res) => {
          This.$refs.uploadingImg.finish();
          // This.$toast.tip("请求成功！");
          if (res.status == 200 && res.data) {
            // setTimeout(() => {
            //   This.$toast.tip("上传成功！");
            // }, 1000);
            This.imgs[index].status = 1;
            This.imgs[index].url = res.data.url;
            This.imgIds.push(res.data.id);
            // This.updateImgUrl(This.imgs[index].elId, res.data.url);
            This.appendImg(res.data.picId, res.data.picId);

          } else {
            This.imgs[index].status = -1;
            This.$toast.tip("上传失败！");
            This.imgs.splice(index, 1);
            This.imgFiles.splice(index, 1);
          }
        }).catch(function () {
          // 处理失败会执行
          This.$refs.uploadingImg.finish();
          This.imgs[index].status = -1;
          This.$toast.tip("上传失败，请重新上传");
          This.imgs.splice(index, 1);
          This.imgFiles.splice(index, 1);
        });
      },
      checkThis(index) {
        let choose_num = this.tagList.filter((item) => {
          return item.is_check == true;
        }).length;
        if (!this.tagList[index].is_check && choose_num === 2) {
          this.$toast.tip("只允许选择两个标签哦~");
          return;
        }
        this.tagList[index].is_check = !this.tagList[index].is_check;
      },
      uploadFile() {
        let contentText = this.$refs.simpleEditor.getContent();
        if (!this.enable || this.posting) {
          return;
        };
        if (this.postInfo.title.length > 30) {
          this.$toast.tip("标题不能超过30个字哦~");
          return;
        }
        if (contentText.length > 5000) {
          this.$toast.tip("内容不能超过5000个字哦~");
          return;
        }
        let isAllUploadSuc = this.imgs.every(function (item) {
          return item.status == 1;
        });
        if (!isAllUploadSuc) {
          this.$toast.tip("图片上传成功才可以发布哦~", "请稍候...");
          return;
        } else {
          this.posting = true;
          this.postingTip = "发帖中...";
          this.postTopic();
        }
      },
      getPostInfo() {
        postBarService.getPostsById({
          id: this.postsId
        }).then(res => {
          if (res.status == 200 && res.data) {
            this.postInfo = res.data || {};
            this.setContent(res.data.content);
            this.getPostTagsByList();
          }
        });
      },
      postTopic() {
        if (this.action == "update") {
          this.updatePostTopic();
          return;
        }
        let This = this;
        let title = this.postInfo.title;
        // let content = tools.getFormatFakeHtml(This.postInfo.content);
        let content = this.getHtml();
        let data = {
          title,
          content,
          postTags: this.checkTags,
          imgIds: this.imgIds,
          userId: This.VX_userInfo.id,
          userName: This.VX_userInfo.nickName,
          userPhoto: This.VX_userInfo.headPicUrl,
          postBarId: this.postBarId,
          orgId: this.VX_orgId,
          communityId: this.comtyId,
          status: "1"
        };
        this.posting = true;
        postBarService.addPosts(data).then((res) => {
          This.posting = false;
          if (res.status == 200) {
            // This.join_moment();
            this.addUserOperationRecord({
              operationType:1,
              objType:2,
              objTitle:this.postInfo.title
            });
            This.postInfo.title = "";
            This.postInfo.content = "";
            This.imgIds = [];
            This.postTags = [];
            This.imgFiles = [];
            This.$toast.tip("发帖成功");
            
            setTimeout(function () {
              This.$router.replace({
                path: "/tieba/" + res.data.id,
                query: {
                  comtyId: This.comtyId
                }
              });
            }, 500);
          };
        });
      },
      uploadAvater(file, index) {
        let This = this;
        This.$refs.uploadingImg.start();
        let data = {};
        sysService.getUploadUrl(data).then((res) => {
          if (res.status == 200) {
            This.doUpload({
              file: file,
              index: index,
              data: res.data,
            });
          }
        });
      },
      doUpload(fileParams) {
        console.log("去上传");
        console.log(fileParams.file);
        let This = this;
        let index = fileParams.index;
        let params = fileParams.data;
        params.file = fileParams.file;
        console.log(params);
        console.log(params.param.OSSAccessKeyId);
        // let url = params.url;
        var fd = new FormData();
        fd.append("OSSAccessKeyId", params.param.OSSAccessKeyId);
        fd.append("Signature", params.param.Signature);
        fd.append("key", params.param.key);
        fd.append("policy", params.param.policy);
        fd.append("success_action_status","200");
        fd.append("callback","");
        fd.append("file", params.file);
        console.log(fd);
        // return;
        sysService.uploadToAliyun({
          fd: fd,
          // url
          url:"https://img.wenwo.com/"
        })
          .then((res) => {
            This.$refs.uploadingImg.finish();
            console.log("上传成功");
            console.log(params.param.key);
            console.log(params.param.key);
            let imageKey = params.param.key;
            // let imageUrl = This.GET_IMG_URL(imageKey);
            let imageUrl = "https://img.wenwo.com/"+imageKey;
            console.log(imageKey);
            console.log(imageUrl);
            This.imgs[index].status = 1;
            This.imgs[index].url = imageUrl;
            This.imgIds.push(imageKey);
            This.appendImg(imageKey, imageUrl);
            console.log(This.imgs);
            console.log(This.imgIds);
          }).catch(function () {
            // 处理失败会执行
            This.$refs.uploadingImg.finish();
            This.imgs[index].status = -1;
            This.$toast.tip("上传失败，请重新上传");
            This.imgs.splice(index, 1);
            This.imgFiles.splice(index, 1);
          });
      },
      appendImg(picId, url) {
        this.$refs.simpleEditor.appendImg({
          id: picId,
          url: url,
        });
        this.refreshImgNum();
      },
      updateImgUrl(elId, url) {
        this.$refs.simpleEditor.updateImgUrl({
          id: elId,
          url: url,
        });
        this.refreshImgNum();
      },
      setContent(content) {
        this.$refs.simpleEditor.setContent(content);
        this.refreshImgNum();
      },
      imgdelHandler() {
        this.refreshImgNum();
      },
      refreshImgNum() {
        console.log("this.$refs.simpleEditor.getImgNum()");
        console.log(this.$refs.simpleEditor.getImgNum());
        this.imgsNum = this.$refs.simpleEditor.getImgNum();
      },
      getHtml() {
        let content = this.$refs.simpleEditor.getHtml();
        return content;
      }
    },
    head() {
      return {
        title: "发布帖子",
      };
    }
  };

</script>

<style lang="less" scoped>
  .edit_box {
    background-color: #fff;
    padding: 0 15px 15px;

    .tit {
      height: 55px;
      box-sizing: border-box;
      padding: 15px 0;
      border-bottom: 1px dashed #D9D9D9;

      input {
        display: block;
        height: 25px;
        line-height: 25px;
        font-size: 20px;
        border: 0;
        width: 100%;
      }
    }

    .post_cont {
      padding: 12px 0;

      .edit_area {
        display: block;
        width: 100%;
        min-height: 200px;
        font-size: 16px;
        line-height: 22px;
        height: auto;
        border: 0;
      }

      .img_box {
        position: relative;

        img {
          display: block;
          max-width: 100%;
        }

        .delete {
          position: absolute;
          width: 19px;
          height: 19px;
          background: url(~@/assets/images/btn_icon_cancel_pure@2x.png) no-repeat center center;
          background-size: 19px 19px;
          border: 2px solid #fff;
          box-sizing: border-box;
          border-radius: 10px;
          display: block;
          right: 5px;
          top: 5px;
        }
      }
    }
  }

  .up_btn_wrapper {
    padding: 15px;
    background-color: #fff;
  }

  .up_btn {
    position: relative;
    width: 80px;
    height: 80px;
    border: 1px dashed #D6D6D6;
    background: #F6F8FB url(~@/assets/images/icon_camera@2x.png) no-repeat center 17px;
    background-size: 33px 25px;
    border-radius: 4px;
    text-align: center;
    box-sizing: border-box;
    padding-top: 48px;
    color: #999;
    font-size: 11px;

    input {
      position: absolute;
      width: 80px;
      height: 80px;
      opacity: 0;
      left: 0;
      top: 0;
    }
  }

  .marks_box {
    padding-bottom: 30px;

    span {
      display: inline-block;
      padding: 0 8px;
      border: 1px solid #EFF2F7;
      border-radius: 24px;
      margin-right: 10px;
      margin-top: 10px;
      line-height: 24px;
      background-color: #F6F8FB;
      white-space: nowrap;
      font-size: 12px;

      &.active {
        color: #2688FC;
        background-color: #DAEBFF;
        border-color: #CAE2FF;
        color: #2688FC;
      }
    }
  }

  .btn_box {
    position: fixed;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    padding: 8px 15px;
    background-color: #fff;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    width: 100%;
    height: 56px;

    .btn {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 15px;
      background-color: #2688FC;
      border-radius: 20px;
      display: block;

      &.disabled {
        background: #CFCFCF;
      }
    }
  }

  .blank56 {
    height: 66px;
  }


  .pre_photo li {
    display: inline-block;
    margin: 0 5px 5px 0;
    border: 1px solid #fff;
    position: relative;

    .icon-del {
      position: absolute;
      right: -5px;
      top: -5px;
    }

    .tip {
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 0px;
      right: 0px;
      left: 0px;
      font-size: 15px;
      text-align: center;
      color: #fff;
      padding: 5px;

      &.err {
        background-color: rgba(255, 0, 0, 0.5);
      }

      &.suc {
        background-color: rgba(0, 255, 0, 0.5);
      }
    }
  }

  .pre_photo li .img_wrapper {
    width: 98px;
    height: 98px;
    cursor: pointer;
    overflow: hidden;
    background-color: #fff;
  }

  .pre_photo li img {
    width: 98px;
    cursor: pointer;
  }

  .pre_photo3 {
    margin-top: 10px;
    padding-left: 10px;
  }

  @media screen and (max-width: 320px) {
    .pre_photo li img {
      width: 84px;
      height: 84px;
      cursor: pointer;
    }
  }

  .pre_photo li.pre_photo_add {
    width: 96px;
    height: 114px;
    margin-top: 1px;
    padding-bottom: 15px;
    color: #999;
    font-size: 14px;
    margin-left: 11px;
    // background: url(./images/icon_photo@3x.png) no-repeat 0px 0px;
    background-size: contain;

    span {
      position: relative;
      top: 0px;
      left: 5px;
      z-index: 2;
      font-size: 12px;
    }
  }

  .pre_photo li.pre_photo_add input {
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    position: relative;
    z-index: 10;
  }

  @media screen and (max-width: 320px) {
    .pre_photo li.pre_photo_add {
      width: 82px;
      height: 82px;
    }

    .pre_photo li .img_wrapper {
      width: 82px;
      height: 82px;
      cursor: pointer;
      overflow: hidden
    }
  }

  @media screen and (min-width: 414px) {
    .pre_photo li.pre_photo_add {
      width: 114px;
      height: 114px;
    }
  }

</style>
