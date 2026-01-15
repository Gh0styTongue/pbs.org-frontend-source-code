var _circle, _path, _path2;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgCompassRose = function SvgCompassRose(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 18 19"
  }, props), _circle || (_circle = /*#__PURE__*/React.createElement("circle", {
    cx: 9,
    cy: 9.5,
    r: 9,
    fill: "#5680FF"
  })), _path || (_path = /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    fillRule: "evenodd",
    d: "M.919 9.535c0-4.426 3.62-8.027 8.07-8.027s8.07 3.601 8.07 8.027c0 4.427-3.62 8.028-8.07 8.028S.919 13.962.919 9.535m6.498-1.562 1.54-5.215c-3.733.017-6.766 3.034-6.783 6.748zM2.174 9.566 7.417 11.1l1.54 5.215c-3.733-.016-6.766-3.034-6.783-6.748Zm6.846 6.748 1.54-5.215 5.243-1.533c-.017 3.714-3.05 6.732-6.783 6.748m6.784-6.808c-.017-3.714-3.05-6.731-6.783-6.748l1.54 5.215z",
    clipRule: "evenodd"
  })), _path2 || (_path2 = /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    fillRule: "evenodd",
    d: "m6.934 6.508-.224.76-.765.224-1.19-2.168 2.18 1.184Zm6.288-1.184-1.19 2.168-.764-.223-.225-.761 2.18-1.184Zm-2.179 7.239.225-.761.765-.224 1.19 2.168zm-5.099-.985-1.19 2.168 2.18-1.183-.224-.761z",
    clipRule: "evenodd"
  })));
};
export default SvgCompassRose;