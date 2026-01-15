var _circle, _circle2, _circle3;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgKabob = function SvgKabob(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    className: "kabob_svg__kabob-icon",
    viewBox: "0 0 7 22"
  }, props), _circle || (_circle = /*#__PURE__*/React.createElement("circle", {
    cx: 3.25,
    cy: 2.83,
    r: 2.5
  })), _circle2 || (_circle2 = /*#__PURE__*/React.createElement("circle", {
    cx: 3.25,
    cy: 10.5,
    r: 2.5
  })), _circle3 || (_circle3 = /*#__PURE__*/React.createElement("circle", {
    cx: 3.25,
    cy: 18.17,
    r: 2.5
  })));
};
export default SvgKabob;