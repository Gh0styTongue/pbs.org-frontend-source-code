var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgDown = function SvgDown(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 16 8"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M7.8 7.5.6.9V.6C.6.4.7.4.8.4h14.5l.2.3-.1.2-7.2 6.6c-.2.1-.4.1-.4 0"
  })));
};
export default SvgDown;