<template>
  <ul class="article-ul">
    <li v-for="(item, index) in list" :key="index">
      <nuxt-link :to="{path:'/news/' + item.id + `?type=${ type }` }" :class="{ reverse: reverse }">
        <div v-if="item.cover && item.cover.url" class="img"><img :src="item.cover.url" alt=""></div>
        <div class="content">
          <h3>{{ item.title }}</h3>
          <div class="msg">
            <div class="img">
              <img v-if="item.pic && item.pic.url" v-lazy="item.pic.url">
              {{ item.publisher }}
            </div>
            <div class="other">
              <span>{{ dateFormat(item.createTime) }}</span>
            </div>
          </div>
        </div>
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
  import utils from "@/utils/index.js";

  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      reverse: {
        type: Boolean,
        default: false
      },
      type: {
        type: Number,
        default: 10
      }
    },
    data(){
      return {

      };
    },
    created(){

    },
    methods:{
      dateFormat(time) {
        return utils.dateFormat(time, "YMD");
      }
    }
  };
</script>
<style lang="less" scoped>

</style>
