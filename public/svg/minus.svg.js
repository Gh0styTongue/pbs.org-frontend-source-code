var _rect;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgMinus = function SvgMinus(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "aria-hidden": "true",
    className: "minus_svg__pbs-minus",
    viewBox: "0 0 16 3"
  }, props), _rect || (_rect = /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 2.4,
    y: 0.4,
    fill: "#fff",
    rx: 1.2
  })));
};
export default SvgMinus;