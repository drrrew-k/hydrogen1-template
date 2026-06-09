"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.action = exports.loader = exports.meta = void 0;
var CustomerUpdateMutation_1 = require("~/graphql/customer-account/CustomerUpdateMutation");
var remix_runtime_1 = require("@netlify/remix-runtime");
var react_1 = require("@remix-run/react");
exports.meta = function () {
    return [{ title: 'Profile' }];
};
function loader(_a) {
    var context = _a.context;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, context.customerAccount.handleAuthStatus()];
                case 1:
                    _b.sent();
                    return [2 /*return*/, remix_runtime_1.json({})];
            }
        });
    });
}
exports.loader = loader;
function action(_a) {
    var _b, _c;
    var request = _a.request, context = _a.context;
    return __awaiter(this, void 0, void 0, function () {
        var customerAccount, form, customer, validInputKeys, _i, _d, _e, key, value, _f, data, errors, error_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    customerAccount = context.customerAccount;
                    if (request.method !== 'PUT') {
                        return [2 /*return*/, remix_runtime_1.json({ error: 'Method not allowed' }, { status: 405 })];
                    }
                    return [4 /*yield*/, request.formData()];
                case 1:
                    form = _g.sent();
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 4, , 5]);
                    customer = {};
                    validInputKeys = ['firstName', 'lastName'];
                    for (_i = 0, _d = form.entries(); _i < _d.length; _i++) {
                        _e = _d[_i], key = _e[0], value = _e[1];
                        if (!validInputKeys.includes(key)) {
                            continue;
                        }
                        if (typeof value === 'string' && value.length) {
                            customer[key] = value;
                        }
                    }
                    return [4 /*yield*/, customerAccount.mutate(CustomerUpdateMutation_1.CUSTOMER_UPDATE_MUTATION, {
                            variables: {
                                customer: customer
                            }
                        })];
                case 3:
                    _f = _g.sent(), data = _f.data, errors = _f.errors;
                    if (errors === null || errors === void 0 ? void 0 : errors.length) {
                        throw new Error(errors[0].message);
                    }
                    if (!((_b = data === null || data === void 0 ? void 0 : data.customerUpdate) === null || _b === void 0 ? void 0 : _b.customer)) {
                        throw new Error('Customer profile update failed.');
                    }
                    return [2 /*return*/, remix_runtime_1.json({
                            error: null,
                            customer: (_c = data === null || data === void 0 ? void 0 : data.customerUpdate) === null || _c === void 0 ? void 0 : _c.customer
                        })];
                case 4:
                    error_1 = _g.sent();
                    return [2 /*return*/, remix_runtime_1.json({ error: error_1.message, customer: null }, {
                            status: 400
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.action = action;
function AccountProfile() {
    var _a, _b, _c;
    var account = react_1.useOutletContext();
    var state = react_1.useNavigation().state;
    var action = react_1.useActionData();
    var customer = (_a = action === null || action === void 0 ? void 0 : action.customer) !== null && _a !== void 0 ? _a : account === null || account === void 0 ? void 0 : account.customer;
    return (React.createElement("div", { className: "account-profile" },
        React.createElement("h2", null, "My profile"),
        React.createElement("br", null),
        React.createElement(react_1.Form, { method: "PUT" },
            React.createElement("legend", null, "Personal information"),
            React.createElement("fieldset", null,
                React.createElement("label", { htmlFor: "firstName" }, "First name"),
                React.createElement("input", { id: "firstName", name: "firstName", type: "text", autoComplete: "given-name", placeholder: "First name", "aria-label": "First name", defaultValue: (_b = customer.firstName) !== null && _b !== void 0 ? _b : '', minLength: 2 }),
                React.createElement("label", { htmlFor: "lastName" }, "Last name"),
                React.createElement("input", { id: "lastName", name: "lastName", type: "text", autoComplete: "family-name", placeholder: "Last name", "aria-label": "Last name", defaultValue: (_c = customer.lastName) !== null && _c !== void 0 ? _c : '', minLength: 2 })),
            (action === null || action === void 0 ? void 0 : action.error) ? (React.createElement("p", null,
                React.createElement("mark", null,
                    React.createElement("small", null, action.error)))) : (React.createElement("br", null)),
            React.createElement("button", { type: "submit", disabled: state !== 'idle' }, state !== 'idle' ? 'Updating' : 'Update'))));
}
exports["default"] = AccountProfile;
