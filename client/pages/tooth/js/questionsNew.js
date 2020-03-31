/***
 * @description key => 对应query.type 的值
 * @type {{}}
 */
//type = 1 question = 1
import under_18 from "../images/question_1/under_18@2x.png";
import years_old_18_25 from "../images/question_1/18_25_years_old@2x.png";
import years_old_25_35 from "../images/question_1/25_35_years_old@2x.png";
import years_and_older_35 from "../images/question_1/35_years_and_older@2x.png";
//type = 1 question = 2
import fangs_icon from "../images/question_1/fangs_icon@2x.png";
import earth_day from "../images/question_1/earth_day@2x.png";
import center_line_uneven from "../images/question_1/center_line_uneven@2x.png";
import other_problems from "../images/question_1/other_problems@2x.png";
//type = 1 question = 3
import correction_price from "../images/question_1/correction_price.png";
import long_cycle from "../images/question_1/long_cycle.png";
import word_of_mouth_and_services from "../images/question_1/word_of_mouth_and_services.png";
import distance_from_me from "../images/question_1/distance_from_me.png";

//type = 2 question = 1
import teeth_often from "../images/question_2/teeth_often.png";
import fangs_icon_2 from "../images/question_2/fangs_icon.png";
import loose_teeth from "../images/question_2/loose_teeth.png";
import thin_teeth from "../images/question_2/thin_teeth.png";

//type = 2 question = 2
import offline_advertising from "../images/question_2/offline_advertising.png";
import discount_icon from "../images/question_2/discount_icon.png";
import online_advertising from "../images/question_2/online_advertising.png";
import popular_science_promotion from "../images/question_2/popular_science_promotion.png";

//type = 2 question = 3
import within_1_month from "../images/question_2/within_1_month.png";
import months_1_3 from "../images/question_2/1_3_months.png";
import months_3_6 from "../images/question_2/3_6_months.png";
import after_6_months from "../images/question_2/after_6_months.png";

const QUESTIONS = {
  1:[
    {
      title:"你的年龄是？",
      type:1,//保留
      options:[
        {
          name:"18岁以下",
          image:under_18,
          width:"80",
          imageWrapperStyle:{
            "text-align":"right"
          }
        },
        {
          name:"18-25岁",
          image:years_old_18_25,
          width:"80",
          imageWrapperStyle:{
            "text-align":"right"
          }
        },
        {
          name:"25岁-35岁",
          image:years_old_25_35,
          width:"80",
          imageWrapperStyle:{
            "text-align":"right"
          }
        },
        {
          name:"35岁以上",
          image:years_and_older_35,
          width:"80",
          imageWrapperStyle:{
            "text-align":"right"
          }
        }
      ]
    },
    {
      title:"照镜子，您的牙齿情况是？",
      type:1,//保留
      options:[
        {
          name:"龅牙",
          image:fangs_icon,
          width:"120",
          imageWrapperStyle:{
            "text-align":"center"
          }
        },
        {
          name:"地包天",
          image:earth_day,
          width:"116",
          imageWrapperStyle:{
            "text-align":"center"
          }
        },
        {
          name:"中线不齐",
          image:center_line_uneven,
          width:"93",
          imageWrapperStyle:{
            "text-align":"center"
          }
        },
        {
          name:"其它牙齿问题",
          image:other_problems,
          width:"95",
          imageWrapperStyle:{
            "text-align":"center"
          }
        }
      ]
    },
    {
      title:"若您想矫牙，最在意的是？",
      type:1,//保留
      options:[
        {
          name:"矫正价格",
          image:correction_price,
          width:"77",
          imageWrapperStyle:{
            "margin-top":"12px",
            "text-align":"center"
          }
        },
        {
          name:"预约到就医周期长",
          image:long_cycle,
          width:"78",
          imageWrapperStyle:{
            "margin-top":"12px",
            "text-align":"center"
          }
        },
        {
          name:"医院口碑和服务",
          image:word_of_mouth_and_services,
          width:"66",
          imageWrapperStyle:{
            "margin-top":"12px",
            "text-align":"center"
          }
        },
        {
          name:"离我的距离",
          image:distance_from_me,
          width:"81",
          imageWrapperStyle:{
            "margin-top":"12px",
            "text-align":"center"
          }
        }
      ]
    }
  ],
  2:[
    {
      title:"您现在正待解决的口腔问题为？",
      type:2,//保留
      options:[
        {
          name:"",
          image:teeth_often,
          width:"102",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:fangs_icon_2,
          width:"79",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:loose_teeth,
          width:"102",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:thin_teeth,
          width:"103",
          imageWrapperStyle:{
          },
          type:2
        }
      ]
    },
    {
      title:"若矫牙，您了解医院信息的渠道是？",
      type:2,//保留
      options:[
        {
          name:"",
          image:offline_advertising,
          width:"102",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:discount_icon,
          width:"126",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:online_advertising,
          width:"102",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:popular_science_promotion,
          width:"103",
          imageWrapperStyle:{
          },
          type:2
        }
      ]
    },
    {
      title:"若您决定牙齿矫正，多久会开始？",
      type:2,//保留
      options:[
        {
          name:"",
          image:within_1_month,
          width:"92",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:months_1_3,
          width:"90",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:months_3_6,
          width:"91",
          imageWrapperStyle:{
          },
          type:2
        },
        {
          name:"",
          image:after_6_months,
          width:"116",
          imageWrapperStyle:{
          },
          type:2
        }
      ]
    }
  ]
};
export default QUESTIONS;
