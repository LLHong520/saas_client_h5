<template>
  <div class="d-dialog">
    <transition name="bg">
      <div v-show="isShow" class="d-dialog-bg" @click="close"></div>
    </transition>

    <transition name="bounce">
      <div class="d-dialog-container" v-show="isShow" @click="close">
        <div class="container d-date-picker" @click.stop>
          <!--<transition name="around">
            <div v-show="!isShowDatePicker">

            </div>
          </transition>-->
          <div class="top top-time">
            <span class="title" @click="showDatePicker">
              {{ calendarAbbr }}
              <span class="icon">
                <i @click.stop="changeDay(-1)"></i>
                <i @click.stop="changeDay(1)"></i>
              </span>
            </span>
          </div>
          <div class="content">
            <div v-if="isNotSchedule" class="no-match">医生暂未确定排班表，提前预约后优先安排面诊</div>
            <div v-else class="filter">
              <h4>上午</h4>
              <ul>
                <li
                  v-for="(item, index) in AM"
                  :key="index"
                  :class="{
                    active: item.interval == active.interval,
                    disabled: item.disabled === true
                  }"
                  @click="onSelect(item)"
                  :iw="`{id:'yuyueTimeChoose',desc:'预约时间选择', ext:{time:'${item.interval}'}}`"
                >{{ item.interval }}</li>
              </ul>

              <h4>下午</h4>
              <ul>
                <li
                  v-for="(item, index) in PM"
                  :key="index"
                  :class="{
                    active: item.interval == active.interval,
                    disabled: item.disabled === true
                  }"
                  @click="onSelect(item)"
                  :iw="`{id:'yuyueTimeChoose',desc:'预约时间选择', ext:{time:'${item.interval}'}}`"
                >{{ item.interval }}</li>
              </ul>
            </div>
          </div>
          <div class="bottom">
            <div class="button" iw="{id:'yuyueTimeChooseSubmitButton',desc:'预约时间选择确定按钮'}"  @click="confirm">确定</div>
          </div>

          <transition name="bg">
            <div v-show="isShowDatePicker" class="content d-date-picker-container">
              <no-ssr>
                <v-date-picker
                  ref="datePicker"
                  v-model="calendar"
                  :available-dates="{ start: minDate, end: maxDate }"
                  locale="zh-CN"
                  @dayclick="datePickerClick"
                  is-inline
                  is-expanded
                ></v-date-picker>
              </no-ssr>
            </div>
          </transition>

        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import communityService from "~/services/communityService.js";

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
      }
    },
    data() {
      return {
        isSubmit: false,
        isShowDatePicker: false,
        isShow: false,
        params: {
          phone: "",
          userName: "",
        },
        active: {},
        calendar: new Date(),
        allTntervals: [
          { interval: "08:00 ~ 08:30", belong: "am" },
          { interval: "08:30 ~ 09:00", belong: "am" },
          { interval: "09:00 ~ 09:30", belong: "am" },
          { interval: "09:30 ~ 10:00", belong: "am" },
          { interval: "10:00 ~ 10:30", belong: "am" },
          { interval: "10:30 ~ 11:00", belong: "am" },
          { interval: "11:00 ~ 11:30", belong: "am" },
          { interval: "11:30 ~ 12:00", belong: "am" },

          { interval: "14:00 ~ 14:30", belong: "pm" },
          { interval: "14:30 ~ 15:00", belong: "pm" },
          { interval: "15:00 ~ 15:30", belong: "pm" },
          { interval: "15:30 ~ 16:00", belong: "pm" },
          { interval: "16:00 ~ 16:30", belong: "pm" },
          { interval: "16:30 ~ 17:00", belong: "pm" },
          { interval: "17:00 ~ 17:30", belong: "pm" },
          { interval: "17:30 ~ 18:00", belong: "pm" },
        ],
        dayMap:{
          0: "周日",
          1: "周一",
          2: "周二",
          3: "周三",
          4: "周四",
          5: "周五",
          6: "周六",
        },
        minDate: "",
        maxDate: "",
      };
    },
    computed: {
      AM() {
        return this.allTntervals.filter( a => { return a.belong == "am"; });
      },
      PM() {
        return this.allTntervals.filter( a => { return a.belong == "pm"; });
      },
      isNotSchedule() {
        // 医生是否有排班
        return this.allTntervals.every( a => { return a.isExist == false; });
      },
      calendarAbbr() {
        let calendar = new Date(this.calendar);
        let year = calendar.getFullYear();
        let month = calendar.getMonth() + 1;
        let date = calendar.getDate();
        let day = calendar.getDay(); // 星期几

        return `${ year }.${ month }.${ date }(${ this.dayMap[day] })`;
      }
    },
    watch: {
      value() {
        this.isShow = this.value;
      },
      isShow(val) {
        val ? this.open() : this.close();
      },
      isNotSchedule(nval){
        if(nval === true){
          this.changeDay(1);
        }
      }
    },
    created() {
      this.isShow = this.value;
    },
    methods: {
      _setTime(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
      },
      checkLimit(time, isDay) {
        // time: 时间戳
        let afterTime = new Date();
        let beforeTime = new Date();

        if (isDay) {
          // 日期整点
          afterTime = this._setTime(afterTime);
          beforeTime.setMonth(beforeTime.getMonth() + 1);
          beforeTime = this._setTime(beforeTime);
        } else {
          afterTime.setHours(afterTime.getHours() + 2);// 两个小时后的
          beforeTime.setMonth(beforeTime.getMonth() + 1);// 一个月内
        }

        if (time) {
          return afterTime.getTime() <= time && time <= beforeTime.getTime();
        } else {
          this.minDate = afterTime;
          this.maxDate = beforeTime;
        }
      },
      changeDay(day) {
        let calendar = new Date(this.calendar);
        calendar.setDate(calendar.getDate() + day);

        if (this.checkLimit(calendar.getTime(), true)) {
          this.calendar = calendar;
          this.getDoctorTime(); // 关闭时，calendar会变化，所以在watch调会有问题
        } else {
          this.$toast.tip("只能选择今天后一个月内的时间");
        }
      },
      showDatePicker() {
        this.isShowDatePicker = true;
      },
      datePickerClick(data) {
        this.calendar = new Date(data.dateTime);
        this.isShowDatePicker = false;
        this.getDoctorTime(); // 关闭时，calendar会变化，所以在watch调会有问题
      },
      onSelect(item) {
        if (item.disabled === true) {
          return;
        }

        if (this.active.interval == item.interval) {
          this.active = {};
        } else {
          this.active = item;
        }
      },
      open() {
        this.active = this.options.active || {};

        if (this.options.calendar) {
          this.calendar = this.options.calendar;
        }

        this.checkLimit();
        this.getDoctorTime();
        this.$emit("open");
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
        Object.assign(this.$data, this.$options.data());// 重置数据
      },
      confirm() {
        let params = {
          name: this.getDateFullName(),
          calendar: this.calendar,
          active: this.active,
          options: this.options,
          startTime: this.getDateFullName(1),
          endTime: this.getDateFullName(2),
          appointmentTime: this.getDateFullName(3),
        };

        this.$emit("confirm", params);
        this.close();
      },
      getDateFullName(type = 0) {
        let calendar = new Date(this.calendar);
        let year = calendar.getFullYear();
        let month = calendar.getMonth() + 1;
        let date = calendar.getDate();
        let day = calendar.getDay(); // 星期几
        let time = "";
        let name = "";
        let str = "";
        let hasSelect = this.active.interval;

        if (hasSelect) {
          // time = this.active.interval.split("~")[0];
          time = this.active.interval;
          name = this.active.belong == "am" ? "上午" : "下午";
        }

        // 列表筛选格式：2019-08-15 08:30:00  -- 开始时间
        if (type == 1) {
          time = time.length == 0 ? "00:00" : time;
          return `${ year }-${ this.fix(month) }-${ this.fix(date) } ${ time.slice(0, 5) }:00`;
        }

        // 列表筛选格式：2019-08-15 08:30:00  -- 结束时间
        if (type == 2) {
          time = time.length == 0 ? "00:00" : time;
          time = time.length > 5 ? time.slice(8, 13) : time;
          return `${ year }-${ this.fix(month) }-${ this.fix(date) } ${ time.slice(0, 5) }:00`;
        }

        // 提交表单格式：2019/08/15(周四) 08:00-08:30
        if (type == 3) {
          str = hasSelect ? this.active.interval.replace(" ~ ", "-") : "";
          return `${ year }/${ this.fix(month) }/${ this.fix(date) }(${ this.dayMap[day] }) ${ str }`;
        }

        // 展示格式：8月15日周四，下午17:30
        str = hasSelect ? `，${ name }${ time }` : "";
        let result = `${ month }月${ date }日${ this.dayMap[day] }${ str }`;

        if (this.options.type) {
          return result;
        } else {
          return hasSelect ? result : "";
        }
      },
      cancel() {
        this.$emit("cancel");
        this.close();
      },
      getDoctorTime() {
        if (!this.options.item) {
          return;
        }

        let { item } = this.options;
        let planId = this.$route.query.planId;
        let calendar = new Date(this.calendar);
        let year = calendar.getFullYear();
        let month = calendar.getMonth() + 1;
        let date = calendar.getDate();

        let params = {
          day: `${ year }-${ this.fix(month) }-${ this.fix(date) }`,
          doctorId: item.doctorId,
          planId: planId,
        };

        communityService.findDoctorTimesById(params).then( res => {
          if (res.status == 200 && res.data && res.data.length > 0) {
            this.getAppointmentTime(res.data[0].times);
          } else {
            this.getAppointmentTime([]);
          }
        });
      },
      getAppointmentTime(arr) {
        // 获取医生时间
        if (!arr) { return; }
        let allTime = [];

        arr.forEach( item => {
          let times = this._getTimeInterval(item);
          allTime = allTime.concat(times);
        });

        // 筛选可预定时间
        this.allTntervals = this.allTntervals.map( item => {
          let isExist = "";

          isExist = allTime.some( a => {
            return a.interval == item.interval && this.checkLimit(a.start);
          });

          return {
            ...item,
            isExist: isExist,
            disabled: !isExist
          };
        });
      },
      _getTimeInterval(obj) {
        let result = [];
        let start = obj.startTime;
        let end = obj.endTime;
        let isNight = new Date(start);

        // 判断是否为超过晚上18点
        if (isNight.getHours() >= 18) {
          return result;
        }

        let interval = 30 * 60 * 1000; // 30分钟
        let current = obj.startTime + interval;

        while (current <= end) {
          result.push({
            time: current,
            start: start,
            end: current,
            interval: this._getInterval(start, current)
          });
          start += interval;
          current += interval;
        };

        return result;
      },
      _getInterval(start, end) {
        let startDate = new Date(start);
        let endDate = new Date(end);
        let startTime = this.fix(startDate.getHours()) + ":" + this.fix(startDate.getMinutes());
        let endTime = this.fix(endDate.getHours()) + ":" + this.fix(endDate.getMinutes());

        return startTime + " ~ " + endTime;
      },
      fix(num) {
        return num >= 10 ?
          num :
          "0" + num;
      }
    }
  };

</script>

<style lang="less" scoped>
  @import "../css/style.less";
</style>

