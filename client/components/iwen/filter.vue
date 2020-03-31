<template>
  <div class="articleType" :style="{ top: navBarheight + 'px' }">
    <span v-for="(item, index) in list" :key="index" :class="{ active: tabIndex == item.type }">
        <span v-if="!item.children"  @click="changeTab(item)">{{ item.name }}</span>
        <span v-if="item.children && item.children.length > 0" @click="changeTab(item)" :class="{open: typeIsShow}">
          <span>{{item.name}}</span>
          <em></em>
        </span>

      <!-- 文章分类 -->
        <div v-if="item.children" v-show="typeIsShow" class="tab_items" :style="{ top:navBarheight + 40 + 'px' }">
          <ul>
            <li v-for="(cItem, cindex) in item.children" :key="cItem.id">
              <label @click="changeChildren(cItem, item)" :class="{ active: cItem.id === typeIndex }">{{cItem.name}}</label>
            </li>
          </ul>
        </div>
      </span>
    <!-- 遮罩-->
    <div class="type_shadow" v-show="typeIsShow" @click="typeIsShow = !typeIsShow" :style="{ top: navBarheight + 40 + 'px' }"></div>
  </div>
</template>

<script>
  export default {
    props: {
      value: String,
      list: {
        type: Array
      }
    },
    data(){
      return {
        tabIndex: "",
        typeIndex: -1, //分类
        typeIsShow: false,
        navBarheight: 44,
      };
    },
    computed: {
      isOtherAgent() {
        if (this.$platformInfo) {
          let os = this.$platformInfo.os;
          let getters = this.$store.getters;

          return os.isWx || os.isWeibo || os.isMp || getters.isInApp || getters.isInSinaHealApp;
        } else {
          return false;
        }
      },
    },
    created() {
      this.tabIndex = this.value;

      if (this.isOtherAgent) {
        this.navBarheight = 0;
      }
    },
    methods:{
      reset() {
        // 重置data
        Object.assign(this.$data, this.$options.data());
      },
      changeTab(item) {
        if (!item.children) {
          this.typeIsShow = false;
          this.tabIndex = item.type;
          this.$emit("input", item.type);
          this.$emit("change", item);
          this.$emit("changeTab", item.type, item);
        } else {
          this.typeIsShow = !this.typeIsShow;
        }
      },
      changeChildren(item, parent) {
        //选择分类
        parent.name = item.name;
        this.typeIsShow = false;
        this.tabIndex = this.typeIndex = parent.type = item.id;
        this.$emit("input", item.id);
        this.$emit("change", parent);
        this.$emit("changeChildren", item.id, parent);
      },
    }
  };
</script>

<style lang="less" scoped>
  .articleType {
    position: fixed;
    display: flex;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #EFEFEF;
    top: 0px;
    margin: 0 auto;
    width: 100%;
    max-width: 760px;
    z-index: 996;

    &.inApp {
      top: 0px;
    }
  }

  .blank40 {
    height: 40px;
  }

  .articleType span {
    display: block;
    flex: 1;
    box-flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
    width: 100%;
  }

  .articleType span:nth-child(3n) span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: auto;
    max-width: 75%;
    vertical-align: middle;
  }

  .articleType span em {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: url(../../assets/images/btn_more@2x.png) no-repeat center center;
    background-size: 10px 10px;
    margin-left: 5px;
    transition: all 0.3s;
  }

  .articleType span.open em {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .articleType span.active {
    color: #282828;
    background: url(../../assets/images/current_line.gif) no-repeat center bottom;
    span {
      color: #282828;
    }
  }

  .tab_items {
    position: fixed;
    background-color: #fff;
    left: 50%;
    top: 40px;
    width: 100%;
    max-width: 760px;
    transform: translateX(-50%);
    box-sizing: border-box;
    padding: 15px 15px 5px 4px;
    z-index: 996;
    max-height: 296px;
    overflow-y: scroll;

    &.inApp {
      top: 44px;
    }
  }

  .tab_items li {
    float: left;
    width: 33.333%;
    margin: 0 0 10px 0;
  }

  .tab_items li label {
    display: block;
    margin-left: 11px;
    line-height: 37px;
    height: 37px;
    border-radius: 4px;
    border: 1px solid #D6D6D6;
    text-align: center;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 5px;
    color: #282828;
  }

  .tab_items li .active {
    color: #2688FC;
  }

  .type_shadow {
    position: fixed;
    left: 50%;
    top: 40px;
    width: 100%;
    max-width: 760px;
    height: 100%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.4);
    z-index: 995;
  }

</style>
