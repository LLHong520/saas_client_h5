<template>
  <div class="d-dialog" v-show="isShow" @click="close">
    <div class="container" @click.stop>
      <div class="content">
        <div v-for="(item, index) in dataList" :key="index">
          <h4>{{ item.title }}</h4>
          <input v-model="item.answer" type="text" placeholder="请输入内容" maxlength="50">
        </div>

      </div>
      <div class="bottom">
        <span @click="close">{{ cancelBtn }}</span>
        <span class="primary" @click="onSubmit">{{ confirmBtn }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import articleService from "~/services/articleService.js";

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      confirmBtn: {
        type: String,
        default: "确定"
      },
      cancelBtn: {
        type: String,
        default: "取消"
      },
      options: {
        type: Object,
      }
    },
    data() {
      return {
        isSubmit: false,
        isShow: false,
        dataList: []
      };
    },
    watch: {
      value() {
        this.isShow = this.value;
      },
      isShow(val) {
        val ? this.open() : this.close();
      }
    },
    created() {
      this.isShow = this.value;
    },
    methods: {
      onSubmit() {
        if (!this.verify()) { return; }

        let parent = this.$parent;
        let question = this.getAnswer(this.dataList);
        let answerText = this.getAnswerText(this.dataList);
        let time = new Date().getTime();
        let params = {
          startTime: parent.startTime,
          endTime: time,
          userId: parent.VX_is_login ? parent.VX_userInfo.id : `tourist${ parent.startTime }`,
          question: question,
          answerText: answerText,
          questionnaireId: parent.pid,
        };

        if (parent.VX_is_login && parent.VX_userInfo.accountBinding) {
          params.openUId = parent.VX_userInfo.accountBinding.weiboUid || "";
          params.openUType = 1;
        }

        articleService.addCommunityQuestionAnswer(params).then( res => {
          if (res.status == 200) {
            this.$toast.tip("提交成功");
            this.close();
          }
        }).finally( () => {
          this.isSubmit = false;
        });
      },
      getAnswer(arr, attr){
        let newArr = JSON.parse(JSON.stringify(arr));
        let result = [];
        let exclude = [];

        newArr.forEach( item => {
          if (exclude.indexOf(item.type) < 0) {
            let obj = {
              questionId: item.id,
              answer: item.answer
            };

            if (attr) {
              obj.isNumber = item.numberLimit;
              obj[attr] = item[attr];
            }
            result.push(obj);
          }
        });
        return result;
      },
      getAnswerText(arr) {
        let newArr = JSON.parse(JSON.stringify(arr));
        let answerText = "";

        newArr.forEach( item => {
          answerText += `,[${ item.answer }]`;
        });

        return answerText.substring(1);
      },
      verify() {
        let question = this.getAnswer(this.dataList, "title");
        let reg = /^[1-9]+[0-9]*]*$/; // 正整数
        let result = true;

        for(let index in question) {
          if (!question[index].answer) {
            this.$toast.tip(`请补充“${ question[index].title }”`);
            result = false;
            break;
          }

          if (question[index].isNumber && !reg.test(question[index].answer)) {
            this.$toast.tip(`“${ question[index].title }”只能输入数字`);
            result = false;
            break;
          }
        }

        return result;
      },
      open() {
        this.dataList = this.options.cardQuestion;
        this.$emit("open");
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
        Object.assign(this.$data, this.$options.data());// 重置数据
      },
      confirm() {
        this.$emit("confirm");
      },
      cancel() {
        this.$emit("cancel");
      }
    }
  };

</script>

<style lang="less" scoped>
  .d-dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: 0 auto;
    max-width: 760px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .4);
    z-index: 999;
    .container {
      width: 80%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      font-size: 15px;
      text-align: center;
      .title {

      }
      .content {
        padding: 22px 15px;
        font-weight: bold;
        text-align: left;
        color: #2D2D2D;
        h3 {
          font-size: 17px;
          font-weight: bold;
        }
        p {
          margin-top: 5px;
          color: #999;
          font-size: 12px;
          font-weight: normal;
        }
        h4 {
          margin-top: 18px;
          font-size: 13px;
        }
        input {
          display: block;
          margin-top: 5px;
          padding: 10px;
          width: 100%;
          font-size: 13px;
          background:rgba(243,244,245,1);
          border-radius:5px;
        }
      }
      .bottom {
        display: flex;
        border-top: 1px solid #E7E7E7;
        font-size: 17px;
        span {
          flex: 1;
          padding: 13px;
          + span {
            border-left: 1px solid #E7E7E7;
          }
          &.primary {
            color: #007AFF;
            &.disabled {
              color:rgba(0, 122, 255, .5)
            }
          }
        }
      }
    }
  }
</style>
