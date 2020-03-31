import communityService from "~/services/communityService.js";
import { dataCollectMixin } from "~/mixins";
const OCPX_EVENT_FACTORY = {
  wuh1:444261,
  wuh2:444262,
  chengdu1:444263,
  chengdu2:444264
};
const pageDataCollectMixin = {
  inject:{
    injectData:{
      default: ()=> { return {};}
    }
  },
  mixins:[dataCollectMixin],
  methods:{
    recordPage(d = {}){
      let uidType = this.getUidType();
      const defaultData = {
        ...this.injectData,
        uidType,
        uid:this._getThird("id")
      };
      d = Object.assign(defaultData,d);
      communityService.addRecord(d).catch((e)=>{}).finally(()=>{});
    },
    getUidType(){
      let uidType = "";
      let os = this.$platformInfo.os;
      if(os.isWeibo){
        uidType = "weibo";
      }else if(os.isWx){
        uidType = "weixin";
      }
      return uidType;
    },
    execOcpxCode(){
      let OCPX_KEY = `${this.injectData.city}${this.injectData.contentId}`;
      console.log(OCPX_KEY);
      try{
        window.wbadmt.send({"eventid":`${OCPX_EVENT_FACTORY[OCPX_KEY]}` ,"eventtype":"form","eventvalue":""});
      }catch(e){
        console.log("ocpx执行错误");
      }
    }
  }
};
export default pageDataCollectMixin;
