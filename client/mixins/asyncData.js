const asyncDataMixin = {
  async beforeMount() {
    // console.log("beforeMount======");
    // console.log(this.$options);
    // console.log(this.$router.history.current.path);
    if( typeof this.$root.$options.context.from == "undefined"
      && typeof this.$options.asyncData == "function") {
    // if( this.$root.$options.context.isStatic
    //   && typeof this.$root.$options.context.from == "undefined"
    //   && this.$router.history.current.path != "/"
    //   && typeof this.$options.asyncData == "function") {

      const data = await this.$options.asyncData(this.$root.$options.context);
      // console.log(this.$options);
      for(let k in data) {
        this[k] = data[k];
      }
    }
  }
};

export default asyncDataMixin;
