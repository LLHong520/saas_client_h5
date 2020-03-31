<template>
  <!-- 相关帖子列表 -->
  <div class="box_wrapper mt10" v-if="dataList.length > 0">
    <div class="common_hd">
      <h3>{{ title }}</h3>
      <!-- <nuxt-link :to="{path:'/tieba'}" class="toMore"></nuxt-link> -->
    </div>
    <ul class="postList">
      <li v-for="(item,index) in dataList" :key="index">
        <nuxt-link :to="{ path:'/tieba/'+item.id }">
          <div class="author_bar">
            <span class="face"><img :src="GET_IMG_URL(item.userPhoto)" alt=""></span>
            <span class="author_name">{{ item.userName}}</span>
            <span class="time">{{ item.publishTime }}</span>
          </div>
          <div class="post_tit">{{ item.title }}</div>
          <div class="post_footer">
            <div class="marks">
              <span v-for="(mark,index) in item.postTagsList" :key="index">{{ mark.name | limit(8) }}</span>
            </div>
            <div class="replyNum">{{ item.replyCount }}评论</div>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import { commonMixin } from "~/mixins";
  import postBarService from "~/services/postBarService.js";

  export default {
    name: "index_article",
    mixins: [commonMixin],
    props: {
      title: {
        type: String,
        default: "相关帖子"
      },
      postsId: {
        type: String,
      },
      postBarId: {
        type: String,
      }
    },
    data() {
      return {
        dataList: []
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        postBarService.getPostsByPage({
          postBarId: this.postBarId,
          excludeIds: [this.postsId],
          pageNum: 1,
          pageSize: 3,
        }).then( res => {
          if (res.status == 200) {
            this.dataList = res.data || [];
          }
        });
      }
    }
  };
</script>

<style scoped>
  @import "~/assets/css/list.css";
</style>
