import {json, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type V2_MetaFunction} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data.collection.title} Collection`}];
};

export async function loader({request, params, context}: LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const menuList = []; //{submenu1: [], submenu2: []};
  let allItems = {};
  let listVals = {};

  const {collection, menu} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  }).then(async r => {
    let f1 = r.collection.metafields.length;
    
    console.log("R:", r.collection.metafields);
    await Promise.all(r.collection.metafields.map(async (el, idx) => {
      if(el) {
        listVals[el.key] = JSON.parse(el.value);
      }
    }));
    console.log("listVals:", listVals);
    
    return r;
  });

  const lvl = await Promise.all(Object.keys(listVals).map(async el => {
    console.log("FD");
    let dd = '';
    let data = await Promise.all(listVals[el].map(async (el1) => {
      dd = el;
      console.log("DF");
      allItems[dd] = [];
      console.log("AllItems_DDD:", allItems);
      let coll_data = storefront.query(COLLECTION_QUERY2, {
        variables: {id: el1}
      }).then(r1 => {
        // console.log("DD:", dd);
        // console.log("AllItems_FFF:", allItems);
        // console.log("AllItems_[]]:", allItems[dd]);
        // console.log(r1.collection.title);
        // console.log("allItems:", allItems);
        allItems[dd].push({title: r1.collection.title, url: r1.collection.handle});
        // console.log("AllItems_[]1:", allItems[dd]);
        // console.log("allItems2:", allItems);
        return r1.collection.title;
      });
      // console.log("D:", coll_data.collection.title);
      return coll_data;
    }));

    // console.log(data);
    return data;
  }));
  // console.log("D:");
  console.log("Lvl:", lvl);
  console.log("allItems final:", allItems);
  // console.log("allItems:", allItems);
  
  
  
  // let f = JSON.parse(r.collection.metafields[1].value);
  // console.log("f:", f1);
  // let data = await Promise.all(f.map(async (el) => {
  //   let coll_data = await storefront.query(COLLECTION_QUERY2, {
  //     variables: {id: el}
  //   });
  //   console.log("D1:", coll_data);
  //   console.log("D:", coll_data.collection.title);
  //   menuList.push(coll_data.collection.title);
  //   return el;
  // }));

  // console.log("cdd:", menuList);

  // console.log(collection.metafields);
  // let cdd = 1;

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection, menu, allItems});
}

export default function Collection() {
  const {collection, menu, allItems} = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      <section className="collection-intro">
        <div className='left-side'>
          <section className="collection-sub-menu">
            {allItems.length && allItems['submenu_1'].map((el) => {
              return <p><a href={"/collections/" + el.url}>{el.title}</a></p>
            })}
          </section>

          <section className="collection-sub-menu">
            {allItems.length && allItems['submenu_2'].map((el) => {
              return <p><a href={"/collections/" + el.url}>{el.title}</a></p>
            })}
          </section>
          
        </div>

        <div className='right-side'>
          {collection.image && 
            <img src={collection.image.url} alt={collection.title + " collection"} />
          }
          <div className='collection-details'>
            <h1>{collection.title}</h1>
            <p className="collection-description">{collection.description}</p>
          </div>
        </div>
        

      </section>
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            <ProductsGrid products={nodes} />
            <br />
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </>
        )}
      </Pagination>
    </div>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      metafields (identifiers: [{key:"submenu_1", namespace:"custom"}, {key:"submenu_2", namespace:"custom"}]) {
        key
        value
        description
      }
      image {
        url
      }
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
    menu(handle: "main-menu") {
      id
    }
  }
` as const;


const COLLECTION_QUERY2 = `#graphql
  query($id: ID) {
       collection(id: $id) {
      title,
      handle
    }
  }
  
` as const;
