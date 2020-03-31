import wuh_01 from "../images/wuh_new/wuhan_01.gif";
import wuhan_01_logo from "../images/wuh_new/wuhan_01_logo.png";
import wuh_03 from "../images/wuh_new/wuhan_03.gif";
import wuh_03_logo from "../images/wuh_new/wuhan_03_logo.png";
import wuh_05 from "../images/wuh_new/wuhan_05.gif";
import wuhan_05_logo from "../images/wuh_new/wuhan_05_logo.png";
import wuh_07 from "../images/wuh_new/wuhan_07.gif";
import wuhan_07_logo from "../images/wuh_new/wuhan_07_logo.png";
import wuh_09 from "../images/wuh_new/wuhan_09.gif";
import wuhan_09_logo from "../images/wuh_new/wuhan_09_logo.png";
import wuhan_2_01 from "../images/wuh_new/wuhan_2_01.gif";
import wuhan_2_01_logo from "../images/wuh_new/wuhan_2_01_logo.png";
import wuhan_2_03 from "../images/wuh_new/wuhan_2_03.gif";
import wuhan_2_03_logo from "../images/wuh_new/wuhan_2_03_logo.png";
import wuhan_2_05 from "../images/wuh_new/wuhan_2_05.gif";
import wuhan_2_05_logo from "../images/wuh_new/wuhan_2_05_logo.png";
import wuhan_2_07 from "../images/wuh_new/wuhan_2_07.gif";
import wuhan_2_07_logo from "../images/wuh_new/wuhan_2_07_logo.png";
import wuhan_2_09 from "../images/wuh_new/wuhan_2_09.gif";
import wuhan_2_09_logo from "../images/wuh_new/wuhan_2_09_logo.png";

//成都
import chengdu_01 from "../images/chengdu_new/chengdu_01.gif";
import logo_chengdou_1 from "../images/chengdu_new/logo_chengdou_1.png";
import chengdu_03 from "../images/chengdu_new/chengdu_03.gif";
import chengdu_03_logo from "../images/chengdu_new/chengdu_03_logo.png";
import chengdu_05 from "../images/chengdu_new/chengdu_05.gif";
import chengdu_05_logo from "../images/chengdu_new/chengdu_05_logo.png";
import chengdu_07 from "../images/chengdu_new/chengdu_07.gif";
import chengdu_07_logo from "../images/chengdu_new/chengdu_07_logo.png";
import chengdu_09 from "../images/chengdu_new/chengdu_09.gif";
import chengdu_09_logo from "../images/chengdu_new/chengdu_09_logo.png";
import chengdu_2_01 from "../images/chengdu_new/chengdu_2_01.gif";
import chengdu_2_01_logo from "../images/chengdu_new/chengdu_2_01_logo.png";
import chengdu_2_03 from "../images/chengdu_new/chengdu_2_03.gif";
import chengdu_2_03_logo from "../images/chengdu_new/chengdu_2_03_logo.png";
import chengdu_2_05 from "../images/chengdu_new/chengdu_2_05.gif";
import chengdu_2_05_logo from "../images/chengdu_new/chengdu_2_05_logo.png";
import chengdu_2_07 from "../images/chengdu_new/chengdu_2_07.gif";
import chengdu_2_07_logo from "../images/chengdu_new/chengdu_2_07_logo.png";
import chengdu_2_09 from "../images/chengdu_new/chengdu_2_09.gif";
import chengdu_2_09_logo from "../images/chengdu_new/chengdu_2_09_logo.png";

const HOSPITALS = {
  wuh:[
    {
      id:1,
      img:wuh_01,
      icon:wuhan_01_logo,
      name:"爱齿尔口腔（品牌连锁）",
      desc:"爱齿尔口腔，作为一家高端齿科品牌连锁机构，距今已成立18年，且爱齿尔口腔严格按照欧美牙科医学标准要求，引入源自欧洲的服务理念，与德国、美国、韩国、澳大利亚等国家和地区的口腔医疗单位建立了良好的学术交流与技术合作关系。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"Invisialign隐适美 ¥48000.00",
          oldText:"原价¥48640.00"
        },
        {
          currentText:"青少年金属托槽矫正 ¥12800.00",
          oldText:"原价¥14240.00"
        },
        {
          currentText:"时代天使隐形矫正 ¥38000.00",
          oldText:"原价¥38460.00"
        },
        {
          currentText:"预防性洁牙套餐 ¥208.00",
          oldText:"原价¥980.00"
        }
      ]
    },
    {
      id:3,
      img:wuh_03,
      icon:wuh_03_logo,
      name:"固瑞齿科（品牌连锁）",
      desc:"固瑞齿科是2000年由加拿大、香港和中国大共同投资并管理的医疗机构，秉承“以患者为中心”的管理理念，倡导“家庭式牙医”的诊疗服务，力求在安全、舒适的环境下为您提供“量身定制”的口腔医疗服务，致力成为国内高级牙科诊所的领军者之一。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"德国金属自锁矫正 ¥16900.00",
          oldText:"原价¥19930.00"
        },
        {
          currentText:"美国隐适美隐形矫正 ¥39999.00",
          oldText:"原价¥46929.00"
        },
        {
          currentText:"代金券 ¥1800.00",
          oldText:"原价¥2000.00"
        },
        {
          currentText:"单颗牙齿窝沟封闭 ¥80.00",
          oldText:"原价¥300.00"
        }
      ]
    },
    {
      id:5,
      img:wuh_05,
      icon:wuhan_05_logo,
      name:"朗歌口腔（品牌连锁）",
      desc:"朗歌口腔，武汉首家以牙齿矫正为特色的专科口腔医疗连锁机构，2013年由正畸专科牙医与海归企管人士共同创办于武汉，专注于每位顾客的个性化设计及治疗。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"正雅全隐形矫正 ¥26000.00",
          oldText:"原价¥27240.00"
        },
        {
          currentText:"时代天使全隐形矫正 ¥26000.00",
          oldText:"原价¥27240.00"
        },
        {
          currentText:"隐适美隐形矫正 ¥35800.00",
          oldText:"原价¥41240.00"
        },
        {
          currentText:"代金券 ¥11.00",
          oldText:"原价¥200.00"
        }
      ]
    },
    {
      id:7,
      img:wuh_07,
      icon:wuhan_07_logo,
      name:"萌芽齿科（品牌连锁）",
      desc:"萌芽齿科是由一群在这个行业内兢兢业业工作十余年，拥有共同梦想的资深牙医们一同创办。萌芽齿科汇集国内知名口腔医生，其中以陈峰主任、贺玉主任、蔡春芳主任、胡铁霞主任率领的医生专家团队共计30余人，他们均毕业于武汉大学，拥有精湛的技术和高端齿科人性化的服务理念。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"进口陶瓷半隐形矫正 ¥14500.00",
          oldText:"原价¥24988.00"
        },
        {
          currentText:"数字化矫正初诊检查套餐 ¥899.00",
          oldText:"原价¥2000.00"
        },
        {
          currentText:"口腔基础检查套餐 ¥9.90",
          oldText:"原价¥238.00"
        },
        {
          currentText:"国产金属矫正套餐 ¥6980.00",
          oldText:"原价¥13420.00"
        }
      ]
    },
    {
      id:9,
      img:wuh_09,
      icon:wuhan_09_logo,
      name:"仁爱口腔(美学矫正单位)",
      desc:"武汉仁爱医院是由国家卫生部门审核批准一所集医疗、预防、科研为一体的现代化医保定点医院，其综合实力深受广大市民一致认可，医院口腔科-仁爱口腔，口口相传，专于种植，精于正畸，汇聚江城三甲口腔专家、教授入驻仁爱，每天轮流坐诊，享受更优质的就医服务。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"金属托槽矫正 ¥5900.00",
          oldText:"原价¥12830.00"
        },
        {
          currentText:"牙齿矫正安心变美(含口扫) ¥1.00",
          oldText:"原价¥6420.00"
        },
        {
          currentText:"数字化舌侧隐形矫正 ¥52800.00",
          oldText:"原价¥72800.00"
        },
        {
          currentText:"时代天使全隐形矫正 ¥19800.00",
          oldText:"原价¥29680.00"
        }
      ]
    },
    {
      id:"2_01",
      img:wuhan_2_01,
      icon:wuhan_2_01_logo,
      name:"清华阳光口腔（品牌连锁）",
      desc:"清华阳光口腔是经卫生局审核批准成立的大型专业口腔连锁医疗机构。由来自全球的牙科医生和跨国企业的管理精英于2005年创立，集口腔医疗、预防、保健、科研为一体的专业口腔诊疗机构。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"进口陶瓷隐形矫正 ¥7500.00",
          oldText:"原价¥12830.00"
        },
        {
          currentText:"特价金属托槽矫正套餐 ¥3980.00",
          oldText:"原价¥7710.00"
        },
        {
          currentText:"数隐适美全隐形矫正 ¥35000.00",
          oldText:"原价¥47470.00"
        },
        {
          currentText:"时代天使隐形矫正 ¥16800.00",
          oldText:"原价¥27720.00"
        }
      ]
    },
    {
      id:"2_03",
      img:wuhan_2_03,
      icon:wuhan_2_03_logo,
      name:"牙达人齿科（医保定点）",
      desc:"武汉牙达人口腔医院是华中地区现代化数字化齿科医院、华中民营口腔医院和市医保定点医院。2009年牙达人进驻武汉以来，便倡导一种全新的舒适口腔理念，坚持人才和科技有效结合，为患者带来满意的诊疗效果。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"进口陶瓷隐形矫正 ¥7500.00",
          oldText:"原价¥9210.00"
        },
        {
          currentText:"特价金属托槽矫正套餐 ¥3980.00",
          oldText:"原价¥7710.00"
        },
        {
          currentText:"隐适美全隐形矫正 ¥35000.00",
          oldText:"原价¥47470.00"
        },
        {
          currentText:"时代天使隐形矫正 ¥16800.00",
          oldText:"原价¥27720.00"
        }
      ]
    },
    {
      id:"2_05",
      img:wuhan_2_05,
      icon:wuhan_2_05_logo,
      name:"咿呀口腔（集团医院）",
      desc:"咿呀口腔，成立于2003年，是由美国gIDE种植大师、美国罗马琳达大学种植硕士晏峰院长领衔下的口腔医疗集团。现旗下拥有10多家医疗机构，覆盖8个大小城市，总营业面积达5000平方米，拥有200多台全球的现代化口腔综合设备，韩国、美国进口口腔CBCT设备5台，德国数字化曲面断层X光机10台，医务人员150余名。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"牙齿隐形矫正 ¥14999.00",
          oldText:"原价¥15799.00"
        },
        {
          currentText:"金属托槽矫正 ¥5800.00",
          oldText:"原价¥6870.00"
        },
        {
          currentText:"半隐形陶瓷矫正 ¥19800.00 ",
          oldText:"原价¥20870.00"
        },
        {
          currentText:"代金券 ¥960.00",
          oldText:"原价¥1000.00"
        }
      ]
    },
    {
      id:"2_07",
      img:wuhan_2_07,
      icon:wuhan_2_07_logo,
      name:"德韩口腔（品牌连锁）",
      desc:"德韩口腔发源于德韩，致力于以现代化服务标准，提供高质量口腔医疗保健服务。作为连锁机构品牌的机构，以口腔种植、口腔矫正、口腔美容、口腔修塑、儿童口腔、口腔综合治疗与防护为一体，启用专科口腔医师、过硬口腔技术以及医疗设备服务广大爱牙人士。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"隐适美全隐形矫正 ¥46000.00",
          oldText:"原价¥54000.00"
        },
        {
          currentText:"时代天使全隐形正畸 ¥27000.00",
          oldText:"原价¥49999.00"
        },
        {
          currentText:"牙齿矫正方案设计套餐 ¥9.90",
          oldText:"原价¥1000.00"
        },
        {
          currentText:"国产陶瓷半隐形矫正 ¥12000.00",
          oldText:"原价¥21500.00"
        }
      ]
    },
    {
      id:"2_09",
      img:wuhan_2_09,
      icon:wuhan_2_09_logo,
      name:"优益佳口腔（连锁口腔）",
      desc:"优益佳口腔品牌由创始人杨丕波在武汉创立，致力于打造亲民社区型口腔门诊，并进行了标准化和系统化的整合。依托优益佳口腔自身强大的口腔临床、科研、教学人才和医生资源平台，并将联合了国内优秀的口腔医师团队和国外先进的口腔诊疗技术。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"正雅隐形矫正 ¥26800.00",
          oldText:"原价¥31740.00"
        },
        {
          currentText:"陶瓷半隐形托槽矫正 ¥9999.00",
          oldText:"原价¥13740.00"
        },
        {
          currentText:"东方美学金属托槽矫正 ¥8362.00",
          oldText:"原价¥8868.00"
        },
        {
          currentText:"冰晶陶瓷隐形托槽矫正 ¥13800.00",
          oldText:"原价¥18740.00"
        }
      ]
    },
  ],
  chengdu:[
    {
      id:1,
      img:chengdu_01,
      icon:logo_chengdou_1,
      name:"拜博口腔（全国连锁）",
      desc:"拜德以诚，博爱天下\r\n26年行业深耕铸就拜博口碑品牌，全国200家交互看诊，“签约治疗，全国联保”，目前已在成都武侯区、金牛区、锦江区以及德阳市、眉山市拥有多家专业口腔医疗机构。其中牙齿矫正、牙齿种植均达到领先水平。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"德国金属自锁矫正¥16900.00",
          oldText:"原价¥19930.00"
        },
        {
          currentText:"美国隐适美隐形矫正¥39999.00",
          oldText:"原价¥46929.00"
        },
        {
          currentText:"儿童矫正方案设计¥69.00",
          oldText:"原价¥830.00"
        },
        {
          currentText:"儿童窝沟封闭（2颗起）¥117.60",
          oldText:"原价¥270.00"
        }
      ]
    },
    {
      id:3,
      img:chengdu_03,
      icon:chengdu_03_logo,
      name:"极光口腔（矫正种植中心）",
      desc:"极光口腔是成都锦江极光口腔门诊部有限公司旗下的一个品牌[1]，商品服务为：医疗诊所服务;医院;牙科;医药咨询;整形外科;治疗服务;牙齿正畸服务;医疗辅助;医疗护理;远程医学服务。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"儿童预防矫正(6-12岁) ¥4800.00",
          oldText:"原价¥22440.00"
        },
        {
          currentText:"隐适美全隐形牙齿矫正 ¥55500.00",
          oldText:"原价¥60850.00"
        },
        {
          currentText:"儿童防龋保健(3-6岁) ¥680.00",
          oldText:"原价¥5560.00"
        },
        {
          currentText:"进口金属托槽牙齿矫正 ¥6888.00",
          oldText:"原价¥7138.00"
        }
      ]
    },
    {
      id:5,
      img:chengdu_05,
      icon:chengdu_05_logo,
      name:"青苗儿童口腔（矫正中心）",
      desc:"青苗儿童口腔（Kidsmile Dental）成立于2012年，青苗人本着“诚信为本，服务至上”的理念，为我国5-12岁儿童提供专业特色的 “咬合诱导”个性化矫正服务。通过一次次的科普课堂、一次次的口腔检查，让更多家长了解孩子的口腔健康状况，帮助我国儿童自小就拥有整齐健康的牙齿和美丽自信的笑容。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"护牙成长卡— 一年期 ¥1990.00",
          oldText:"原价¥2600.00"
        },
        {
          currentText:"儿童预防矫正(6-12岁) ¥4800.00",
          oldText:"原价¥22440.00"
        },
        {
          currentText:"护牙成长卡—三年期 ¥3980.00",
          oldText:"原价¥4100.00"
        },
        {
          currentText:"儿童早期矫正检查 ¥218.00",
          oldText:"原价¥520.00"
        }
      ]
    },
    {
      id:7,
      img:chengdu_07,
      icon:chengdu_07_logo,
      name:"瑞泰口腔（品牌连锁）",
      desc:"瑞泰口腔医院隶属国内口腔连锁医疗机构-瑞尔集团。总部位于北京朝阳区，得到了美国宾夕法尼亚大学口腔医学院及新加坡T32牙科联盟提供的技术支持，遍布北京，成都，重庆，西安等城市设有50余家医院和口腔门诊部，是集医疗、科研、教学、预防、保健为一体的全国连锁的口腔医疗机构。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"时代天使隐形矫正 ¥28000.00",
          oldText:"原价¥44440.00"
        },
        {
          currentText:"进口隐适美矫正套餐 ¥110.00",
          oldText:"原价¥1380.00"
        },
        {
          currentText:"单人正畸检查 ¥4800.00",
          oldText:"原价¥5560.00"
        },
        {
          currentText:"代金券 ¥50.00",
          oldText:"原价¥500.00"
        }
      ]
    },
    {
      id:9,
      img:chengdu_09,
      icon:chengdu_09_logo,
      name:"圣贝口腔（品牌连锁）",
      desc:"成都武侯圣贝口腔门诊部成立于2011年7月，总投资千万元。成都武侯圣贝口腔门诊部以先进、精密、专业的设备和技术为依托，对病症准确定位定性，拥有大批先进医疗设备，以科技造福百姓，特色服务大众。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"进口陶瓷半隐形矫正 ¥14500.00 ",
          oldText:"原价¥24988.00"
        },
        {
          currentText:"矫正预售礼劵 ¥1.00",
          oldText:"原价¥1600.00"
        },
        {
          currentText:"口腔基础检查套餐 ¥9.90",
          oldText:"原价¥238.00"
        },
        {
          currentText:"国产金属矫正套餐 ¥6980.00",
          oldText:"原价¥13420.00"
        }
      ]
    },
    {
      id:"2_01",
      img:chengdu_2_01,
      icon:chengdu_2_01_logo,
      name:"唐牙科（品牌连锁）",
      desc:"唐牙科目前拥有20多家系统化、标准化、特色化、精品化的专业牙科连锁机构，分布于成都青羊区、武侯区、成华区、锦江区、华阳等地。其中包括六大种植中心，分别是晋阳门诊、金沙门诊、红瓦寺门诊、簇桥门诊、科华门诊和青羊宫门诊，并拥有美国、芬兰、瑞士、德国等先进口腔设备及系统。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"半透明隐形矫正 ¥23000.00",
          oldText:"原价¥32440.00"
        },
        {
          currentText:"隐适美全隐形牙齿矫正 ¥55500.00",
          oldText:"原价¥60850.00"
        },
        {
          currentText:"国产金属托槽矫正 ¥4800.00",
          oldText:"原价¥5560.00"
        },
        {
          currentText:"进口金属托槽牙齿矫正 ¥6888.00",
          oldText:"原价¥7138.00"
        }
      ]
    },
    {
      id:"2_03",
      img:chengdu_2_03,
      icon:chengdu_2_03_logo,
      name:"亚非牙科（品牌连锁）",
      desc:"亚非牙科始创于1988年,30余年历史,国际高端牙科品牌,由华西口腔正畸专家周秀坤教授、华西口腔种植专家张举之教授创立,开设有牙齿种植、牙齿正畸等口腔医疗服务。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"牙齿隐形矫正 ¥14999.00",
          oldText:"原价¥15799.00"
        },
        {
          currentText:"舒适牙周SPA-不只是洁牙 ¥680.00",
          oldText:"原价¥1200.00"
        },
        {
          currentText:"数字化成人金属托矫正 ¥4998.00",
          oldText:"原价¥12000.00"
        },
        {
          currentText:"金属矫治（儿童） ¥12999.00",
          oldText:"原价¥15518.00"
        }
      ]
    },
    {
      id:"2_05",
      img:chengdu_2_05,
      icon:chengdu_2_05_logo,
      name:"新桥口腔（口腔连锁）",
      desc:"成都新桥牙科是具有13年悠久历史的原成都康桥医院口腔中心迁址、扩建、升级而来，拥有多名在国内口腔领域极具影响力的华西资深专家亲自主诊，在正畸（隐形矫正）牙病防治领域的尖端实力，是本地大型专业口腔诊疗机构。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"时代天使全隐形矫正 ¥24800.00",
          oldText:"原价¥33044.00"
        },
        {
          currentText:"隐适美隐形正畸牙套 ¥38000.00 ",
          oldText:"原价¥53244.00"
        },
        {
          currentText:"数字化成人金属托矫正 ¥999.00",
          oldText:"原价¥1450.00"
        },
        {
          currentText:"数字化Insignia矫正 ¥999.00",
          oldText:"原价¥1450.00"
        }
      ]
    },
    {
      id:"2_07",
      img:chengdu_2_07,
      icon:chengdu_2_07_logo,
      name:"华美牙科（品牌连锁）",
      desc:"成都华美牙科始建1996年，旗下拥有15家成都牙科医院及成都口腔医院，在成都、都江堰、双流、金堂、邛崃、华阳、龙泉、内江、新都、重庆等大成都范围均有直营牙科。在四川、成都赢得良好口碑，成为广大消费者心目中*值得信赖的成都牙科医院。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"全隐形国产正雅正畸 ¥16800.00",
          oldText:"原价¥22800.00"
        },
        {
          currentText:"金属自锁进口牙矫正 ¥15800.00",
          oldText:"原价¥18800.00"
        },
        {
          currentText:"数字化舌侧隐形矫正 ¥52800.00",
          oldText:"原价¥72800.00"
        },
        {
          currentText:"隐适美神速版-iGO ¥29800.00",
          oldText:"原价¥39800.00"
        }
      ]
    },
    {
      id:"2_09",
      img:chengdu_2_09,
      icon:chengdu_2_09_logo,
      name:"美莱口腔中心（品牌连锁）",
      desc:"美莱集团历经19年品牌沉淀，目前在北京、上海、广州、重庆、成都、深圳、苏州、昆明、贵阳、福州、宁波、长沙等地建立了26院品牌连锁，是目前规模至大且实力雄厚的医疗美容连锁集团。成都美莱位于成都市青羊区青华路31号，毗邻名胜古迹杜甫草堂，生态公园浣花溪，医美品质追求，为广大爱美群众提供最好的医护保障。",
      recommendTitle:"优惠促销",
      services:[
        {
          currentText:"进口陶瓷半隐形矫正 ¥14500.00",
          oldText:"原价¥24988.00"
        },
        {
          currentText:"矫正预售礼劵 ¥1.00 ",
          oldText:"原价¥1600.00"
        },
        {
          currentText:"口腔基础检查套餐 ¥9.90",
          oldText:"原价¥238.00"
        },
        {
          currentText:"国产金属矫正套餐 ¥6980.00",
          oldText:"原价¥13420.00"
        }
      ]
    },
  ]
};
export default HOSPITALS;
