import {useNonce} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
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
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
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
};

export function links() {
  return [
    ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'stylesheet', href: customStyles},
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
  console.log("TEST URL:", `${STRAPI_URL}/get-css`);
  const cms_styles = fetch(`${STRAPI_URL}/get-css`).then(r => r.json() );
  const header_img = fetch(`${STRAPI_URL}/get-store1-settings`).then(r => r.json() );
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

  console.log("Header data:");
  console.log(data.header_img.data.font_link);

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

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />

        {/* fonts: */}
        {/* {"" + data.header_img.data.attributes.font_link}  */}
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />

      </head>
      <body className={bodyClass}>
        <div className="change-styles" onClick={switchStyle}>Change styles; current: {bodyClass}</div>
        <style nonce={"nonce-" + nonce}>{data.styles.collection.metafields[0].value}</style>
        

        <style>
          {data.cms_styles.snippets?.map((s) => {
            return s.code;
          })}
        </style>
        
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} /> {/*this!!! */}
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const [root] = useMatches();
  const nonce = useNonce();

  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
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
