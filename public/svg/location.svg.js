var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgLocation = function SvgLocation(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M8.661 3.93a3.93 3.93 0 1 0-7.317 1.994h-.001L4.731 12l3.388-6.076a3.9 3.9 0 0 0 .542-1.993Zm-3.93-2.648A2.65 2.65 0 0 1 7.38 3.93a2.65 2.65 0 0 1-2.65 2.65 2.65 2.65 0 0 1-2.648-2.65A2.65 2.65 0 0 1 4.73 1.283Z"
  })));
};
export default SvgLocation;