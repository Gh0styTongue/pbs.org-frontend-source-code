var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgPlay = function SvgPlay(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    className: "play_svg__play",
    viewBox: "0 0 10 12"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M9.37 6.05.89.75C.73.65.57.74.57.9v10.7c0 .16.16.24.32.16l8.48-5.31c.15-.16.15-.32 0-.4"
  })));
};
export default SvgPlay;