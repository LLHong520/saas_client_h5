<template>
  <div class="box_wrapper notice mt10" v-if="dataList.length != 0">
    <div class="tab_box">
      <div class="tab">
        <ul>
          <li v-for="item in tab" :key="item.index" :class="{ active: tabActive == item.index }" @click="onTab(item.index)">{{ item.name }}</li>
        </ul>
        <nuxt-link :to="{path: `/news/?type=${ tabActive }` }">查看更多</nuxt-link>
      </div>
      <div class="tab-content">
        <div class="tab-item" v-for="(item, index) in tab" :class="{ active: tabActive == item.index }">
          <news-list :list="item.data" :type="tabActive == 1 ? 10 : 11"></news-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { commonMixin } from "~/mixins";
  import homeService from "~/services/homeService";
  import newsList from "@/components/list_template/news.vue";

  export default {
    mixins: [commonMixin],
    components: {
      newsList
    },
    data() {
      return {
        tabActive: 1,
        tab: [
          /*{
            name: "健康知识",
            index: 1,
            data: []
          },
          {
            name: "资讯公告",
            index: 2,
            data: []
          }*/
        ],
        dataList: [],
        tab1: "健康知识",
        tab2: "资讯公告",
      };
    },
    async created() {
      if (this.GET_PAGE_PERMISSION_MODULE("5")) {
        this.tab1 = this.$store.getters.getCurrPermissionObj("5").label || this.tab1;
        await this.getData(1);
      }

      if (this.GET_PAGE_PERMISSION_MODULE("6")) {
        this.tab2 = this.$store.getters.getCurrPermissionObj("6").label || this.tab2;
        await this.getData(2);
      }
    },
    methods: {
      onTab(type) {
        this.tabActive = type;
      },
      async getData(type) {
        let name = type == 1 ? this.tab1 : this.tab2;
        let params = {
          type: type // 1：健康知识 2：资讯公告
        };

        await homeService.getHealthInfo(params)
          .then((res) => {
            if (res.status == 200 && res.data && res.data.length > 0) {
              this.dataList = [...this.dataList, ...res.data ];

              this.tab.push({
                name: name,
                index: type,
                data: res.data || []
              });

              this.tabActive = this.tab[0].index || 1;
            }
          });
      }
    }
  };

</script>

<style lang="less" scoped>

</style>
