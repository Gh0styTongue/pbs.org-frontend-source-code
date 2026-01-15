var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgCalendar = function SvgCalendar(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "aria-hidden": "true"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    fill: "#000",
    d: "M9.6 10.8H1.2V4.2h8.4M7.8 0v1.2H3V0H1.8v1.2h-.6C.534 1.2 0 1.734 0 2.4v8.4A1.2 1.2 0 0 0 1.2 12h8.4a1.2 1.2 0 0 0 1.2-1.2V2.4a1.2 1.2 0 0 0-1.2-1.2H9V0m-.6 6.6h-3v3h3z"
  })));
};
export default SvgCalendar;