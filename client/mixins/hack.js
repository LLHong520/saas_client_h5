import { changeDoctorName, changeDoctorComty } from "@/consts/hack.js";

const hackMixin = {
  _data: {
    changeDoctorName
  },
  computed: {
    hackDoctorName(query) {
      let name = this.checkHackComtyID();
      return name;
    }
  },
  methods: {
    checkHackComtyID(query) {
      let { comtyId } = query || this.$route.query;

      if (comtyId && changeDoctorComty.includes(comtyId)) {
        return changeDoctorName;
      }

      return "医生";
    }
  }
};

export default hackMixin;
