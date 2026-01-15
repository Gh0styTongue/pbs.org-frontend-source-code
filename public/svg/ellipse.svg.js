var _circle;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgEllipse = function SvgEllipse(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 11 11"
  }, props), _circle || (_circle = /*#__PURE__*/React.createElement("circle", {
    cx: 5.475,
    cy: 5.25,
    r: 5,
    fill: "#fff"
  })));
};
export default SvgEllipse;