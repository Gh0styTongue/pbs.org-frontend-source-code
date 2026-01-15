var _g, _defs;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgSignal = function SvgSignal(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 15 12"
  }, props), _g || (_g = /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#signal_svg__a)"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M6.471 4.442a1.662 1.662 0 1 0 1.135 3.125 1.662 1.662 0 0 0-1.135-3.125"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "#fff",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.006,
    d: "M4.722 2.923C2.741 4.67 2.75 7.48 4.752 9.215"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "#fff",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.006,
    d: "M2.831 1.01c-3.118 2.749-3.104 7.17.047 9.901M9.422 9.09c1.981-1.747 1.972-4.556-.03-6.292"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "#fff",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.006,
    d: "M11.312 11.005c3.118-2.75 3.104-7.17-.047-9.902"
  }))), _defs || (_defs = /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "signal_svg__a"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M0 .501h14.141v11H0z"
  })))));
};
export default SvgSignal;