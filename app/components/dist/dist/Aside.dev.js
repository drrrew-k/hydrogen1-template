"use strict";

exports.__esModule = true;
exports.useAside = exports.Aside = void 0;

var react_1 = require("react");
/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */


function Aside(_a) {
  var children = _a.children,
      heading = _a.heading,
      type = _a.type;

  var _b = useAside(),
      activeType = _b.type,
      close = _b.close;

  var expanded = type === activeType;
  return React.createElement("div", {
    "aria-modal": true,
    className: "overlay " + (expanded ? 'expanded' : ''),
    role: "dialog"
  }, React.createElement("button", {
    className: "close-outside",
    onClick: close
  }), React.createElement("aside", null, React.createElement("header", null, React.createElement("h3", null, heading), React.createElement("button", {
    className: "close reset",
    onClick: close
  }, "\xD7")), React.createElement("main", null, children)));
}

exports.Aside = Aside;
var AsideContext = react_1.createContext(null);

Aside.Provider = function AsideProvider(_a) {
  var children = _a.children;

  var _b = react_1.useState('closed'),
      type = _b[0],
      setType = _b[1];

  return React.createElement(AsideContext.Provider, {
    value: {
      type: type,
      open: setType,
      close: function close() {
        return setType('closed');
      }
    }
  }, children);
};

function useAside() {
  var aside = react_1.useContext(AsideContext);

  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }

  return aside;
}

exports.useAside = useAside;