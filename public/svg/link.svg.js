var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgLink = function SvgLink(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "#fff",
    "aria-hidden": "true",
    className: "link_svg__pbs-link",
    viewBox: "0 0 17 17"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M9.7 1.8c.7-.7 1.7-1.1 2.8-1.1 2.2 0 3.9 1.8 3.9 3.9 0 1-.4 2-1.1 2.8l-1.4 1.4c-.2.1-.4.2-.6.2s-.4-.1-.5-.2-.2-.3-.2-.5.1-.4.2-.5l1.4-1.4c.5-.5.7-1.1.7-1.7 0-1.3-1.1-2.4-2.4-2.4-.7 0-1.3.3-1.7.7l-3 2.8c-.5.5-.7 1.1-.7 1.8 0 .8.4 1.6 1.1 2.1.2.1.3.3.3.5s0 .4-.1.6-.3.3-.5.3-.4 0-.6-.1c-1.1-.7-1.8-2-1.8-3.3 0-1 .4-2 1.1-2.8zm-.6 4.3c.2 0 .4 0 .6.1 1.1.7 1.8 2 1.8 3.3 0 1-.4 2-1.1 2.8l-2.9 2.9c-.7.7-1.7 1.1-2.8 1.1-2.2 0-3.9-1.8-3.9-3.9 0-1 .4-2 1.1-2.8l1.4-1.4c.1-.1.3-.2.5-.2s.4.1.5.2.2.3.2.5-.1.4-.2.5l-1.4 1.4c-.5.5-.7 1.1-.7 1.7 0 1.3 1.1 2.4 2.4 2.4.7 0 1.3-.3 1.7-.7l2.9-2.9c.5-.5.7-1.1.7-1.7 0-.8-.4-1.6-1.1-2.1-.1 0-.2-.1-.2-.3s0-.4.1-.6c.1-.1.2-.2.4-.3"
  })));
};
export default SvgLink;