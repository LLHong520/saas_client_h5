<template>
  <div>
    <div class="blank49">&nbsp;</div>
    <ul class="f_nav">
      <li @click="switchTo('/')" :class="{active:activeKey == 'index'}">
        <img :src="activeKey == 'index' ? tabBarImgArr[0].selected : tabBarImgArr[0].normal" width="24" alt="首页">
        首页
      </li>
      <li @click="switchTo('/find')" :class="{active:activeKey == 'find'}">
        <img :src="activeKey == 'find' ? tabBarImgArr[1].selected : tabBarImgArr[1].normal" width="24" alt="发现">
        发现
      </li>
      <li v-if="$store.getters.getCurrPermission('2')" @click="switchTo('/tieba')" :class="{active:activeKey == 'tieba'}">
        <img :src="activeKey == 'tieba' ? tabBarImgArr[2].selected : tabBarImgArr[2].normal" width="24" alt="圈子">
        {{ $store.getters.getCurrPermissionObj('2').label || "圈子" }}
      </li>
      <li v-if="!VX_isInApp" @click="switchTo('/my')" :class="{active:activeKey == 'my'}">
        <img :src="activeKey == 'my' ? tabBarImgArr[3].selected : tabBarImgArr[3].normal" width="24" alt="我的">
        我的
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    props: {
      activeIndex: {
        type: Number,
        default: ""
      }
    },
    computed: {
      activeKey() {
        return this.$route.name;
      },
      ...mapGetters({
        VX_isInApp:"isInApp"
      })
    },
    updated() {},
    data() {
      return {
        tabBarImgArr: [ //图片切换
          {
            normal: require("~/assets/images/nav_icons/tabbar_icon_home@2x.png"),
            selected: require("~/assets/images/nav_icons/tabbar_icon_home_pre@2x.png")
          },
          {
            normal: require("~/assets/images/nav_icons/tabbar_icon_find@2x.png"),
            selected: require("~/assets/images/nav_icons/tabbar_icon_find_pre@2x.png")
          },
          {
            normal: require("~/assets/images/nav_icons/tabbar_icon_post@2x.png"),
            selected: require("~/assets/images/nav_icons/tabbar_icon_post_pre@2x.png")
          },
          {
            normal: require("~/assets/images/nav_icons/tabbar_icon_me@2x.png"),
            selected: require("~/assets/images/nav_icons/tabbar_icon_me_pre@2x.png")
          }
        ]
      };
    },
    methods: {
      switchTo(path) {
        this.$router.replace(path);
      }
    }
  };

</script>


<style lang="less" scoped>
  .blank49 {
    width: 100%;
    height: 49px;
  }

  .f_nav {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 49px;
    background-color: #fff;
    display: flex;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
    line-height: 20px;
    z-index: 995;
  }

  .f_nav li {
    text-align: center;
    box-flex: 1;
    flex: 1;
    color: #323232;
    font-size: 10px;
    padding-top: 5px;
    line-height: 18px;

    &.active {
      color: #2688FC;
    }

    img {
      display: block;
      margin: 0 auto;
    }
  }

  img {
    background-color: transparent;
  }

  @media only screen and (min-width: 760px) {
    .f_nav {
      position: fixed;
      width: 760px;
      margin-left: -380px;
      left: 50%;
    }
  }

</style>
