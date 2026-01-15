var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgAdd = function SvgAdd(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 16 17"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M14.5 7.2H9V1.8a1 1 0 0 0-2.2 0v5.4H1.5a1 1 0 0 0 0 2.1H7v5.4a1 1 0 0 0 2.2 0V9.3h5.4a1 1 0 0 0 0-2.1Z"
  })));
};
export default SvgAdd;