var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgUp = function SvgUp(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 16 8"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "m7.8.475-7.2 6.6v.3c0 .2.1.2.2.2h14.5l.2-.3-.1-.2-7.2-6.6c-.2-.1-.4-.1-.4 0"
  })));
};
export default SvgUp;