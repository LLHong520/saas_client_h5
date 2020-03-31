// import Auth from "../auth";

const state = {
  userInfo: {},
  identityInfo: {
    type:"patient"
  },
  is_login: false,
  appQueryString: null,
  token: "",
  comtyId: "",
  comtyInfo: null,
  orgId: "",
  location: null,
  isInApp: false,
  permission_map: {},
  permission_list: [],
  city: "",
  isDoctor: false
};

export default state;
