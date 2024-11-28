<<<<<<< HEAD
import {useNonce, getShopAnalytics, Analytics} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@netlify/remix-runtime';
=======
import {useNonce} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
import {
  Links,
  Meta,
  Outlet,
  Scripts,
<<<<<<< HEAD
  useRouteError,
  useRouteLoaderData,
=======
  LiveReload,
  useMatches,
  useRouteError,
  useLoaderData,
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
<<<<<<< HEAD
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from '~/components/PageLayout';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
=======
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';
import type {HydrogenSession} from '../server';
import favicon from '../public/favicon.svg';
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';
import customStyles from './styles/custom.css';
import {Layout} from '~/components/Layout';
import {cssBundleHref} from '@remix-run/css-bundle';

import { useState, useLayoutEffect, useEffect } from 'react';

// This is important to avoid re-fetching root queries on sub-navigations
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
<<<<<<< HEAD
  defaultShouldRevalidate,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return defaultShouldRevalidate;
=======
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
};

export function links() {
  return [
<<<<<<< HEAD
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
=======
    ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'stylesheet', href: customStyles},
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

<<<<<<< HEAD
export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return defer({
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    header,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
=======
export async function loader({context}: LoaderArgs) {
  const {storefront, session, cart } = context;
  const customerAccessToken = await session.get('customerAccessToken');
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  // validate the customer access token is valid
  const {isLoggedIn, headers} = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  });

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });
  
  const headerPromise2 = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 's1-store2', // Adjust to your header menu handle
    },
  });

  const styles = storefront.query(CUSTOM_CSS_QUERY, {
    cache: storefront.CacheLong(),
  }); 
  
  //http://localhost:1337/api/store1-settings/1/?populate=*
  const STRAPI_URL = context.env.CMS_API_URL.replace(/\/$/, "");
  console.log("TEST URL:", `${context.env.BACKEND_URL}/get-css`);
  const cms_styles = fetch(`${context.env.BACKEND_URL}/get-css`).then(r => r.json() );
  const header_img = fetch(`${context.env.BACKEND_URL}/get-store1-settings`).then(r => r.json() );
  return defer(
    {
      cart: cartPromise,
      footer: footerPromise,
      header: await headerPromise,
      rightMenu: await headerPromise2,
      styles: await styles,
      cms_styles: await cms_styles,
      isLoggedIn,
      header_img: await header_img,
      publicStoreDomain,
    },
    {headers},
  );
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  // let bodyClass = 'body-dark';
  
  const [bodyClass, setBodyClass] = useState('body-dark');

  // console.log("Header data:");
  // console.log(data);
  // console.log(data.header_img.data.attributes.font_link);
  let fonts_data = data.header_img.data.attributes.font_link;
  fonts_data = fonts_data.split("\n");
  console.log("fonts_data == ");
  
  // let el = fonts_data[0];
  // el = el.replace('<link rel="preconnect" ', "");
  // el = el.replace('href="', "");
  // el = el.replace('">', "");



  // useLayoutEffect(() => {
  //   let savedStyle = window.localStorage.getItem("bodyStyle");
  //   if(savedStyle == null) {
  //     savedStyle = 'body-dark';
  //   }
  //   setBodyClass(savedStyle);
  // }, []);
  
  // useEffect(() => {
  //   const savedStyle = window.localStorage.getItem("bodyStyle");
  //   alert(savedStyle);
  //   alert('useLayoutEffect');
  //   setBodyClass(savedStyle);
  //   window.localStorage.setItem("bodyStyle", bodyClass);
  // }, [bodyClass]);
  
  
  function switchStyle(event: React.MouseEvent<HTMLDivElement>) {
    let newStyle = '';
    if(bodyClass == 'body-dark') {
      newStyle = 'body-light';
    } else {
      newStyle = 'body-dark';
    }
    setBodyClass(newStyle);
    window.localStorage.setItem("bodyStyle", newStyle);
  }
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
<<<<<<< HEAD
      </head>
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout {...data}>{children}</PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
=======
        
        {
          fonts_data.map(e => {
            let el = e;
            let f_type = 'preconnect'
            if(el.search("stylesheet") != -1) {
              f_type = 'stylesheet';
            }

            el = el.replace('<link ', "");
            el = el.replace('rel="preconnect"', "");
            el = el.replace('rel="stylesheet"', "");
            el = el.replace('crossorigin', "");
            el = el.replace('href="', "");
            el = el.replace('" >', "");
            el = el.replace('>', "");
            el = el.replace('"', "");
            return <link data-test="DD" rel={f_type} href={el.trim()}></link>
          })
        }
        
      </head>
      <body className={bodyClass}>
        <div className="change-styles" onClick={switchStyle}>Change styles; current: {bodyClass}</div>
        <style nonce={"nonce-" + nonce}>{data.styles.collection.metafields[0].value}</style>
        

        {/* <style>
          {data.cms_styles.snippets?.map((s) => {
            return s.code;
          })}
        </style> */}

          {data.cms_styles.snippets?.map((s) => {
            return <style dangerouslySetInnerHTML={{__html: s.code}} />
          })}
        
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} /> {/*this!!! */}
        <LiveReload nonce={nonce} />
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
      </body>
    </html>
  );
}

<<<<<<< HEAD
export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
=======
export function ErrorBoundary() {
  const error = useRouteError();
  const [root] = useMatches();
  const nonce = useNonce();

>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
<<<<<<< HEAD
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
=======
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...root.data}>
          <div className="route-error">
            <h1>Oops</h1>
            <h2>{errorStatus}</h2>
            {errorMessage && (
              <fieldset>
                <pre>{errorMessage}</pre>
              </fieldset>
            )}
          </div>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```ts
 * //
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 *  );
 *  ```
 *  */
async function validateCustomerAccessToken(
  session: HydrogenSession,
  customerAccessToken?: CustomerAccessToken,
) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return {isLoggedIn, headers};
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return {isLoggedIn, headers};
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;


const CUSTOM_CSS_QUERY = `#graphql
query {
  collection(handle: "temp") {
    id
    handle
    title
    metafields (identifiers: [{key:"custom_css", namespace:"custom"}]) {
      key
      value
      description
    }
  }
}
` as const;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
