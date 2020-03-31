<template>
  <div class="d-box filter">
    <h4>地区：深圳市</h4>
    <ul>
      <li
        v-for="(item, index) in areas"
        :key="index"
        :class="{ active: item == areaActive}"
        @click="onArea(item)"
      >{{ item }}</li>
    </ul>

    <h4>服务项目</h4>
    <ul>
      <li
        v-for="(item, index) in servers"
        :key="index"
        :class="{ active: item == serversActive}"
        @click="onServer(item)"
      >{{ item }}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        areaActive: "",
        serversActive: "",
        areas: [
          "全部",
          "罗湖区",
          "福田区",
          "南山区",
          "宝安区",
          "龙华区",
          // "盐田区",
          // "坪山新区",
          // "光明新区",
        ],
        servers: [
          "全部",
          "种牙",
          "正畸",
          "美白",
          "洗牙",
          // "拔牙",
          // "牙周治疗",
          // "牙齿矫正",
        ]
      };
    },
    created() {
      this.areaActive = this.areas[0];
      this.serversActive = this.servers[0];
    },
    methods: {
      onArea(item) {
        let val = item == "全部" ? "" : item;
        this.areaActive = item;
        this.$emit("area", val);
      },
      onServer(item) {
        let val = item == "全部" ? "" : item;
        this.serversActive = item;
        this.$emit("server", val);
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../css/style.less";
</style>

