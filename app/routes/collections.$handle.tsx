import {defer, redirect, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {useLoaderData, Link, type MetaFunction, useSearchParams} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import { useSubmit } from "@remix-run/react";

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);
  const {handle} = args.params;

  let filterOptions = await fetch('https://services.mybcapps.com/bc-sf-filter/filter?shop=avida-healthwear-inc.myshopify.com&build_filter_tree=true')
  .then(r => r.json())
  .then(r => {
    let products = r.products;

    let filters = r.filter.options.filter(element => {
      if(['Price', 'Gender', 'Product Type', 'Vendor'].includes(element.label)) {
        return true;
      } else {
        return false;
      }
      // return Object.keys(element).includes('label') && element.label != '';
      // return Object.keys(element).includes('label') && element.label != '';
    });


    return {products: products, filters: filters }

  }).then(e => {
    
    e.filters.map(el => {
        if(Object.keys(el).includes('manuvalues') && el.manualValues) {
          return el.manualValues;
        }
        return el.values;
      });

    return e;
  });

  const products = filterOptions.products;
  var filteredVals = [];
  var filters = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(filterOptions);
    }, 1000);
}).then(r => {
  let fil = [];

  let innerItems = {};
   filterOptions.filters.forEach(el => {
    innerItems = {};
    innerItems.label = el.label;
    innerItems.values = [];
    if(Object.keys(el).includes('manualValues') && el.manualValues) {
       el.manualValues.map(item => {
        innerItems.values.push(item);
      });
      fil.push(innerItems);
    } else {
      if(el.values.length) {
        el.values.map(item => {
          innerItems.values.push(item['key']);
        });
        fil.push(innerItems);
      }
    }
  });
  return fil;
});

  return defer({...deferredData, ...criticalData, products, filters, handle});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

// export default function Collection() {
//   const {collection} = useLoaderData<typeof loader>();

//   return (
//     <div className="collection">
//       <h1>{collection.title}</h1>
//       <p className="collection-description">{collection.description}</p>
//       <PaginatedResourceSection
//         connection={collection.products}
//         resourcesClassName="products-grid"
//       >
//         {({node: product, index}) => (
//           <ProductItem
//             key={product.id}
//             product={product}
//             loading={index < 8 ? 'eager' : undefined}
//           />
//         )}
//       </PaginatedResourceSection>
//       <Analytics.CollectionView
//         data={{
//           collection: {
//             id: collection.id,
//             handle: collection.handle,
//           },
//         }}
//       />
//     </div>
//   );
// }

export function FilterList(el, onchange, filters, handle, query) {

  function dd(document, tag) {
    // document.querySelector('#filters-form').submit();
  }

  return (
    <div>
      
        <div className='form-group'>
          <p>

            <label className="cb-container link"><span>{el.el}</span>
              <input type="checkbox" name="tags" value={el.el} onChange={el.onchange} defaultChecked={el.query.includes(el.el)}/>
              <span className="checkmark"></span>
            </label>

          </p>
        </div>
    </div>
  );
}

export default function Collection() {
  const [query] = useSearchParams();

  const enabledFilters = query.getAll('tags');
  const {collection, menu, allItems, products, filters, handle} = useLoaderData<typeof loader>();
  // console.log("pdorudcts:");
  // console.log(products);

  // const checkedStates = new Array(filters.length).fill({tag: "TheTest", checked: false});
  let checkedStates = [];
    
  for(let i = 0; i < filters.length; i++) {
    checkedStates.push({tag: filters[i], checked: false});
  }


  //https://services.mybcapps.com/bc-sf-filter/filter?shop=cheatersfirststore.myshopify.com&build_filter_tree=true
  //r['filter']['options'][3]
  //https://services.mybcapps.com/bc-sf-filter/search?shop=cheatersfirststore.myshopify.com&tag=Culinary

  const submit = useSubmit();

  return (
    <div className="collection">
      <div className='left-side collection-filters'>
            
        <form method='get' action={`/collections/${handle}?search`} id="filters-form" onChange={(e) => submit(e.currentTarget)}>
            
            {
              filters.map((el) => {
               
                return <> <h2>{el.label}</h2>
                {el.values.map(item => {
                  return <FilterList el={item} onchange={submit} filters={checkedStates} handle={handle} query={enabledFilters} />
                })}
                </>
              })
            }

        </form>
        {/* {Object.keys(allItems).length > 0 && allItems['submenu_1']?.length > 0 &&
          <section className="collection-sub-menu">
            {allItems['submenu_1']?.map((el) => {
              return <p><a href={"/collections/" + el.url}>{el.title}</a></p>
            })}
          </section>
        }

        {Object.keys(allItems).length > 0 && allItems['submenu_2']?.length > 0 &&
          <section className="collection-sub-menu">
            {allItems['submenu_2']?.map((el) => {
              return <p><a href={"/collections/" + el.url}>{el.title}</a></p>
            })}
          </section>
        } */}
      </div>

      <div className="collection-data">

        <section className="collection-intro">

          <div className='right-side'>
            {collection.image && 
              <div className="collection-img" style={{backgroundImage: 'url(' + collection.image.url + ')'}}>
                <img src={collection.image.url} alt={collection.title + " collection"} />
              </div>
            }
            <div className='collection-details'>
              <p className='collection-header'>Shop {collection.title.toLowerCase()}</p>
              <p className="collection-description">{collection.description}</p>
            </div>
          </div>
          
        </section>

        <div className="collection-products">
          {products.map(el => {
            return enabledFilters.length ?
              el.tags.some(val => enabledFilters.includes(val) && el.collections.some(c => c.handle == collection.handle)) && <SingleItem item={el} />
              :
              <>{ el.collections.some(c => c.handle == collection.handle) && <SingleItem item={el} /> }</>
              ;
          })}

        </div>
        {/* <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <PreviousLink>
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
              <p className='collection-products-header'><span>All items</span> <span>Sort by</span></p>
              <ProductsGrid products={nodes} collection={collection} />
              <br />
              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </>
          )}
        </Pagination> */}
      </div>
    </div>
  );
}

export function SingleItem({item}) {
  return (
    <div
      className="product-link"
    >
      <div>
      <div className='slider-item single-item' key={item.id}>
      <Link
      className="product-link"
      key={item.id}
      prefetch="intent"
      to={`/products/${item.handle}`}
    >
        
              <div className='slider-upper-block' style={{backgroundImage: 'url(' + ((item.images && Object.keys(item.images).length > 0) ? item.images[Object.keys(item.images)[0]] : "")  + ')', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                <Image
                  data={(item.images && Object.keys(item.images).length > 0 ? item.images[Object.keys(item.images)[0]] : "")}
                  aspectRatio="1/1"
                  style={{visibility: 'hidden'}}
                  sizes="(min-width: 45em) 20vw, 50vw"
                  />
              </div>
              <div className='slider-lower-block'>
                <h4>{item.title}</h4>
                <span className='price'>
                  ${item.variants[Object.keys(item.variants)[0]].price}
                </span>
              </div>
        </Link>
        </div>
      {/* <div className='single-product'>
        <img className='single-product-image' src={item.images[Object.keys(item.images)[0]]} />
        {item.title}
      </div> */}
      </div>
      </div>
  )
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
      description
      image {
        url
      }
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
  }
` as const;
