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
import axios from 'axios';
import { useState, useLayoutEffect, useEffect } from 'react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);
  const {handle} = args.params;
  
  const options = { timeout: 8000 };
  const controller = new AbortController();



  let filterOptions = await axios.get('https://services.mybcapps.com/bc-sf-filter/search/collections?shop=avida-healthwear-inc.myshopify.com&q=' + handle).then(async collection_response => {
    console.log("The response", collection_response.data.collections[0].id);
    const collectionId = collection_response.data.collections[0].id;

  //collection_scope=5882937350 (collection id)
  // https://services.mybcapps.com/bc-sf-filter/search/collections?shop=avida-healthwear-inc.myshopify.com&q=activewear
  // https://services.mybcapps.com/bc-sf-filter/filter?shop=avida-healthwear-inc.myshopify.com&collection_scope=609320966
  // let filterOptions = await axios.get('https://services.mybcapps.com/bc-sf-filter/filter?shop=avida-healthwear-inc.myshopify.com&build_filter_tree=true', { timeout: 10000 })
  console.log("And the link is: ", 'https://services.mybcapps.com/bc-sf-filter/filter?shop=avida-healthwear-inc.myshopify.com&build_filter_tree=true&collection_scope=' + collectionId);
  let filterOptions = await axios.get('https://services.mybcapps.com/bc-sf-filter/filter?shop=avida-healthwear-inc.myshopify.com&build_filter_tree=true&collection_scope=' + collectionId, { timeout: 10000 })
  .then(r => {
    console.log("Rsposnsse:", r);
    let products = r.data.products;

    let filters = r.data.filter.options.filter(element => {
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

  return filterOptions;
});


  // //collection_scope=5882937350 (collection id)
  // let filterOptions = await axios.get('https://services.mybcapps.com/bc-sf-filter/filter?shop=avida-healthwear-inc.myshopify.com&build_filter_tree=true', { timeout: 10000 })
  // .then(r => {
  //   console.log("Rsposnsse:", r);
  //   let products = r.data.products;

  //   let filters = r.data.filter.options.filter(element => {
  //     if(['Price', 'Gender', 'Product Type', 'Vendor'].includes(element.label)) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //     // return Object.keys(element).includes('label') && element.label != '';
  //     // return Object.keys(element).includes('label') && element.label != '';
  //   });


  //   return {products: products, filters: filters }

  // }).then(e => {
    
  //   e.filters.map(el => {
  //       if(Object.keys(el).includes('manuvalues') && el.manualValues) {
  //         return el.manualValues;
  //       }
  //       return el.values;
  //     });

  //   return e;
  // });

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
  const priceFilter = query.get('max-price');
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

  /* range input */
  // const rangeInput = document.querySelectorAll(".range-input input"),
  // priceInput = document.querySelectorAll(".price-input input"),
  // range = document.querySelector(".slider .progress");
  // let priceGap = 1000;

  // priceInput.forEach((input) => {
  //   input.addEventListener("input", (e) => {
  //     let minPrice = parseInt(priceInput[0].value),
  //       maxPrice = parseInt(priceInput[1].value);

  //     if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
  //       if (e.target.className === "input-min") {
  //         rangeInput[0].value = minPrice;
  //         range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
  //       } else {
  //         rangeInput[1].value = maxPrice;
  //         range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
  //       }
  //     }
  //   });
  // });

  /* end range input */

  let priceInputChange = function (e) {
    const priceInput = document.querySelectorAll(".price-input input");
    const rangeInput = document.querySelectorAll(".range-input input");
    const range = document.querySelector(".slider .progress");
    let priceGap = 100;
    let minPrice = parseInt(priceInput[0].value);
    //let maxPrice = parseInt(priceInput[1].value);

    // if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
    if (maxPrice <= rangeInput[1].max) {
      if (e.target.className === "input-min") {
        // rangeInput[0].value = minPrice;
        // range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
        range.style.left = (0 / rangeInput[0].max) * 100 + "%";
      } else {
        // rangeInput[1].value = maxPrice;
        rangeInput[0].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
      }
    }
  }

  let rangeChange = function (e) {
    const priceInput = document.querySelectorAll(".price-input input");
    const rangeInput = document.querySelectorAll(".range-input input");
    const range = document.querySelector(".slider .progress");
    let priceGap = 100;
    // let minPrice = parseInt(priceInput[0].value);
    let maxPrice = parseInt(priceInput[0].value);
    
    // let minVal = parseInt(rangeInput[0].value);
    let maxVal = parseInt(rangeInput[0].value);

            
    if (maxVal - 0 < 0) {
      if (e.target.className === "range-min") {
        rangeInput[0].value = maxVal - priceGap;
      } else {
        rangeInput[1].value = minVal + priceGap;
      }
    } else {
      // priceInput[0].value = minVal;
      priceInput[0].value = maxVal;
      // range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      range.style.right = 100 - (maxVal / rangeInput[0].max) * 100 + "%";
    }
  
  }

  const ShowElement = function(el, enabledFilters) {
    let included = true;
    if(enabledFilters.length) {
      included = el.tags.some(val => enabledFilters.includes(val) && el.collections.some(c =>
        c.handle == collection.handle)
      );
    } else {
      console.log("Working");
      console.log("Collection handle = " + collection.handle);
      console.log(el.collections.map(el => {
        console.log(el);
      }));
      console.log(el.collections.includes("Activewear"));
      included = el.collections.some(c => c.handle == collection.handle);
    }
    
    if(included) {
      if(priceFilter) {
        included = el.variants.some(val => {return parseFloat(val.price) <= parseFloat(priceFilter)});
      }
    }

    return included;

    // return enabledFilters.length ?
    //           el.tags.some(val => enabledFilters.includes(val) && el.collections.some(c =>
    //               c.handle == collection.handle)
    //             )
    //           :
    //           el.collections.some(c => c.handle == collection.handle);
    //           ;
  } 

  const [openFilters, setOpenFilters] = useState(false);
  function toggleFilters(event: React.MouseEvent<HTMLDivElement>) {
    setOpenFilters(!openFilters);
  }

  return (
    <div className="collection">
      <div className={'left-side collection-filters ' +( openFilters ? 'active' : '')}>
            
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

            <h2>Price</h2>
            <section>
              <div className="price-input">
                {/* <div className="field">
                  <span>Min</span>
                  <input type="number" className="input-min" defaultValue="2500" onInput={priceInputChange} />
                </div>
                <div className="separator">-</div> */}
                <div className="field">
                  <span>Max</span>
                  <input type="number" className="input-max" defaultValue="500"  onInput={priceInputChange}/>
                </div>
              </div>
              <div className="slider">
                <div className="progress"></div>
              </div>
              <div className="range-input">
                {/* <input type="range" className="range-min" min="0" max="10000" defaultValue="1500" step="100" onChange={rangeChange} /> */}
                <input type="range" name="max-price" className="range-max" min="0" max="1500" defaultValue="500" step="10" onChange={rangeChange} />
              </div>
            </section>

            <input type="submit" className='apply-filters' onClick={e => toggleFilters(e)} value="Apply" />
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
          <p className="open-filters" onClick={e => toggleFilters(e)}>
            Open filters
          </p>

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
              return ShowElement(el, enabledFilters) && <SingleItem item={el} collections={el.collections} />

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

export function SingleItem({item, collections}) {
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
                {collections.map(el => {
                  el.handle + "|"
                })}
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
