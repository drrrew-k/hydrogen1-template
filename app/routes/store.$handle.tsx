import {defer, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  useMatches,
  type V2_MetaFunction,
  type FetcherWithComponents,
} from '@remix-run/react';

import {Suspense} from 'react';
import type {CartQueryData} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {type ActionArgs, json} from '@shopify/remix-oxygen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartMain} from '~/components/Cart';
import {Image, Money} from '@shopify/hydrogen';

export const meta: V2_MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};


const PRODS = `#graphql
query RecommendedProducts($query: String!) {
  products(first:10, query: $query) {
    nodes{
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 1) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
}
 `;


export async function loader({params, request, context}: LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // // await the query for the critical product data
  // const {product} = await storefront.query(PRODUCT_QUERY, {
  //   variables: {handle, selectedOptions},
  // });

  // if (!product?.id) {
  //   throw new Response(null, {status: 404});
  // }


  const recommendedProducts = storefront.query(PRODS, {variables: {query: 'tag:' + handle} });

  return defer({handle, recommendedProducts});
}


export default function Cart() {
  const [root] = useMatches();
  const cart = root.data?.cart as Promise<CartApiQueryFragment | null>;
  const data = useLoaderData<typeof loader>();

  return (
    <div className="cart">
      <h1>Store {data.handle} </h1>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await errorElement={<div>An error occurred</div>} resolve={cart}>
          {(cart) => {
            return <CartMain layout="page" cart={cart} />;
          }}
        </Await>
      </Suspense>

      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}
