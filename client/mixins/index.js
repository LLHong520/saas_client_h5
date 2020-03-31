import comtyId from "./comtyIdValid";
import common from "./common";
import asyncData from "./asyncData";
import share from "./share";
import wxTemplateMsg from "./wxTemplateMsg";
import dataCollect from "./dataCollect";
import showPostBar from "./showPostBar";
import auth from "./auth";
import hack from "./hack";

export const comtyIdValid = { ...comtyId};
export const commonMixin = { ...common};
export const asyncDataMixin = { ...asyncData};
export const shareMixin = { ...share};
export const wxTemplateMsgMixin = { ...wxTemplateMsg };
export const dataCollectMixin = { ...dataCollect };
export const showPostBarMixin = { ...showPostBar };
export const authMixin = { ...auth };
export const hackMixin = { ... hack };
