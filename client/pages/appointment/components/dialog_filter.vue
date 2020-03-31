<template>
  <div class="d-dialog">
    <transition name="bg">
      <div v-show="isShow" class="d-dialog-bg" @click="close"></div>
    </transition>

    <transition name="bounce">
      <div class="d-dialog-container" v-show="isShow" @click="close">
        <div class="container" @click.stop>
          <div class="top top-btn">
            <span class="cancel" @click="close">取消</span>
            <span class="title">选择{{ typeName }}</span>
            <span class="confirm-text" @click="confirm">确定</span>
          </div>

          <div class="content">
            <div class="filter">
              <ul>
                <li
                  v-for="(item, index) in showList"
                  :key="item.id"
                  :class="{
                    active: item.is_check,
                  }"
                  @click="onSelect(item, index)"
                >{{ item.name }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        default:{

        }
      }
    },
    data() {
      return {
        type: "brand",// brand 、 service
        selectType:1,//1是多选,2是单选
        isShow: false,
        brandList: [],
        serviceList: [],
        showList: [],
        select: [],
        areas: [
          "全部",
          "罗湖区",
          "福田区",
          "南山区",
          "宝安区",
          "龙华区",
        ],
      };
    },
    computed: {
      typeName() {
        return this.type == "brand" ? "品牌" : "项目";
      }
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
      // this.active = this.areas[0];
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {

      },
      onSelect(obj, objIndex) {
        let isIndex;

        let isSelect = this.select.some( (item, index) => {
          isIndex = index;
          return item.id == obj.id;
        });

        if (isSelect) {
          obj.is_check = false;
          this.select.splice(isIndex, 1);
        } else {
          /*if (this.select.length >= limit) {
            this.$toast.tip(`最多选择${ limit }个标签`);
            return;
          }*/
          // obj.is_check = true;
          if(this.selectType==1){
            //多选模式
            this.select.push(obj);
          }else{
            //单选模式
            this.select.splice(0,1,obj);
            this.showList.forEach((item)=>{
              item.is_check=false;
              return item;
            });
          }
          obj.is_check = true;
        }
        this.$set(this.showList, objIndex, obj);
      },
      open() {
        let type = this.options.type;

        this.type = type;
        this.select = this.options.select;
        this.showList = this[type + "List"] = this.options.list;
        this.selectType=this.options.selectType||1;

        // 选中
        this.showList = this.showList.map( a => {
          let isTure = this.select.some( b => { return b.id == a.id; });
          a.is_check = isTure;
          return a;
        });

        this.$emit("open");
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
      },
      confirm() {
        let result = {
          select: this.select,
          type: this.type,
          selectType: this.selectType,
          
        };
        if(this.selectType==2){
          result.item=this.options.item;
          result.type2=this.options.type2;
        }

        this.$emit("confirm", result);
        this.close();
      },
      cancel() {
        this.$emit("cancel");
        this.close();
      }
    }
  };

</script>

<style lang="less" scoped>
  @import "../css/style.less";
</style>

