import {LOGIN_URL} from "@/config";
function goLogin(refer,type){
  refer=refer==undefined? "":refer;
  if(type==="wb"){
    // alert(LOGIN_URL + "/sys/logByWeiBo?display=pc&refer=" + refer);
    location.href = LOGIN_URL + "/sys/logByWeiBo?display=pc&refer=" + refer;
  }else{
    location.href=LOGIN_URL+"/sys/logByWeiXin?refer="+refer;
  }
}
export default goLogin;
