var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgShuffle = function SvgShuffle(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 21 21"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    stroke: "#94A1B2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M13.4 3h4.17v4.17m-14.17 10L17.57 3m0 10.83V18H13.4m-.83-5 5 5M3.4 3.83 7.57 8"
  })));
};
export default SvgShuffle;