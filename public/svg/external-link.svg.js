var _path, _path2;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
var SvgExternalLink = function SvgExternalLink(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    className: "external-link_svg__external-link",
    viewBox: "0 0 18.5 15.6"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M14.2 9.1h-.7c-.1 0-.2 0-.2.1-.1.1-.1.1-.1.2v3.3c0 .4-.2.8-.5 1.2-.3.3-.7.5-1.2.5H3c-.5 0-.8-.2-1.2-.5-.3-.3-.5-.7-.5-1.2V4.2c0-.4.2-.8.5-1.2.3-.2.7-.4 1.2-.4h7.3c.1 0 .2 0 .2-.1.1-.1.1-.1.1-.2v-.7c0-.1 0-.2-.1-.2-.1-.1-.1-.1-.2-.1H3q-1.2 0-2.1.9c-.6.5-.9 1.2-.9 2v8.5q0 1.2.9 2.1t2.1.9h8.6q1.2 0 2.1-.9t.9-2.1V9.5c0-.1 0-.2-.1-.2-.2-.1-.2-.2-.3-.2"
  })), _path2 || (_path2 = /*#__PURE__*/React.createElement("path", {
    d: "M18.3.2c-.2-.1-.3-.2-.5-.2h-5.3c-.2 0-.3.1-.5.2-.1.1-.2.3-.2.5s.1.3.2.5L13.8 3 7.2 9.5c-.1.1-.1.2-.1.3s0 .2.1.2l1.2 1.2c.1.1.1.1.2.1s.2 0 .2-.1l6.7-6.6 1.8 1.8c.1.1.3.2.5.2s.3-.1.5-.2c.1-.1.2-.3.2-.5V.7c0-.2-.1-.4-.2-.5"
  })));
};
export default SvgExternalLink;