"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.loader = exports.meta = void 0;
var remix_runtime_1 = require("@netlify/remix-runtime");
var react_1 = require("@remix-run/react");
var hydrogen_1 = require("@shopify/hydrogen");
var PaginatedResourceSection_1 = require("~/components/PaginatedResourceSection");
exports.meta = function (_a) {
    // return [{title: `Hydrogen | ${data?.blog.title ?? ''} blog`}];
    var data = _a.data;
    var storeTitle = data.store_settings.data.attributes.store_name || 'Hydrogen';
    return [{ title: storeTitle + " | Blogs" }];
};
function loader(args) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredData, criticalData, store_settings, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    deferredData = loadDeferredData(args);
                    return [4 /*yield*/, loadCriticalData(args)];
                case 1:
                    criticalData = _b.sent();
                    return [4 /*yield*/, fetch(args.context.env.BACKEND_URL + "/get-store1-settings")];
                case 2:
                    store_settings = _b.sent();
                    _a = criticalData;
                    return [4 /*yield*/, store_settings.json()];
                case 3:
                    _a.store_settings = _b.sent();
                    return [2 /*return*/, remix_runtime_1.defer(__assign(__assign({}, deferredData), criticalData))];
            }
        });
    });
}
exports.loader = loader;
/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
function loadCriticalData(_a) {
    var context = _a.context, request = _a.request, params = _a.params;
    return __awaiter(this, void 0, void 0, function () {
        var paginationVariables, blog;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    paginationVariables = hydrogen_1.getPaginationVariables(request, {
                        pageBy: 4
                    });
                    if (!params.blogHandle) {
                        throw new Response("blog not found", { status: 404 });
                    }
                    return [4 /*yield*/, Promise.all([
                            context.storefront.query(BLOGS_QUERY, {
                                variables: __assign({ blogHandle: params.blogHandle }, paginationVariables)
                            }),
                        ])];
                case 1:
                    blog = (_b.sent())[0].blog;
                    if (!(blog === null || blog === void 0 ? void 0 : blog.articles)) {
                        throw new Response('Not found', { status: 404 });
                    }
                    return [2 /*return*/, { blog: blog }];
            }
        });
    });
}
/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(_a) {
    var context = _a.context;
    return {};
}
function Blog() {
    var blog = react_1.useLoaderData().blog;
    var articles = blog.articles;
    return (React.createElement("div", { className: "blog" },
        React.createElement("h1", null, blog.title),
        React.createElement("div", { className: "blog-grid" },
            React.createElement(PaginatedResourceSection_1.PaginatedResourceSection, { connection: articles }, function (_a) {
                var article = _a.node, index = _a.index;
                return (React.createElement(ArticleItem, { article: article, key: article.id, loading: index < 2 ? 'eager' : 'lazy' }));
            }))));
}
exports["default"] = Blog;
function ArticleItem(_a) {
    var article = _a.article, loading = _a.loading;
    var publishedAt = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(article.publishedAt));
    return (React.createElement("div", { className: "blog-article", key: article.id },
        React.createElement(react_1.Link, { to: "/blogs/" + article.blog.handle + "/" + article.handle },
            article.image && (React.createElement("div", { className: "blog-article-image" },
                React.createElement(hydrogen_1.Image, { alt: article.image.altText || article.title, aspectRatio: "3/2", data: article.image, loading: loading, sizes: "(min-width: 768px) 50vw, 100vw" }))),
            React.createElement("h3", null, article.title),
            React.createElement("small", null, publishedAt))));
}
// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
var BLOGS_QUERY = "#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    contentHtml\n    handle\n    id\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n  }\n";
