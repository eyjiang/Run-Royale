import { Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const mockupWidth = 375;
const mockupHeight = 812;

const statusBarHeight = getStatusBarHeight();

export default {
  calcWidth: width => windowWidth * (width / mockupWidth),
  calcHeight: height => windowHeight * (height / mockupHeight),
  statusBarHeight: statusBarHeight,
  isSmallDevice: windowWidth < 375
  // window: {
  //   width,
  //   height,
  // },
  // isSmallDevice: width < 375,
};
