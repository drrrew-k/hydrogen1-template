import {json, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type V2_MetaFunction, useSearchParams, useSubmit} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import { useState } from 'react';
import { useLocation } from "@remix-run/react";
import Product from './($locale).products.$handle';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data.collection.title} Collection`}];
};

const https = require('https');

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
    console.log("handle:", handle);
    let fields = r.collection ? r.collection.metafields.length : 0;
    console.log("r:", r);
    
    if(fields) {
      await Promise.all(r.collection.metafields?.map(async (el, idx) => {
        if(el) {
          listVals[el.key] = JSON.parse(el.value);
        }
      }))
    }
    
    return r;
  });
  
  console.log("collection:", collection);

  const lvl = await Promise.all(Object.keys(listVals).map(async el => {
    let cur_item = '';
    let data = await Promise.all(listVals[el].map(async (el1) => {
      cur_item = el;
      allItems[cur_item] = [];
      let coll_data = storefront.query(COLLECTION_QUERY2, {
        variables: {id: el1}
      }).then(r1 => {
        // console.log(r1.collection.title);
        // console.log("allItems:", allItems);
        allItems[cur_item].push({title: r1.collection.title, url: r1.collection.handle});
        return r1.collection.title;
      });
      return coll_data;
    }));

    return data;
  }));
  console.log("Lvl:", lvl);
  console.log("allItems final:", allItems);
  

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }


  // let filterOptions = await fetch('https://services.mybcapps.com/bc-sf-filter/filter?shop=cheatersfirststore.myshopify.com&build_filter_tree=true')
  let filterOptions = await fetch('https://services.mybcapps.com/bc-sf-filter/filter?shop=avida-healthwear-inc.myshopify.com&build_filter_tree=true')
  .then(r => r.json())
  .then(r => {
    console.log("Response fecthed!", r.filter.options);
    console.log("Products:!", r.products.nodes);
    let products = r.products;
    // console.log("products!", [products]);
    // console.log("Details", r.filter.options[3].values);
    // let filters = r.filter.options.filter(element => {
    //   return element.label == 'Industry';
    // });

    let filters = r.filter.options.filter(element => {
      return element.label == 'Size' || element.label == 'Color';
    });


    // console.log("checkedStates:");
    // console.log(checkedStates);

    return {products: products, filters: filters }

  });


  // console.log("data:", filterOptions.filters[0].manualValues);
  console.log("data:", filterOptions);
  // console.log("products:", filterOptions.products);
  // filterOptions = filterOptions[0].manualValues;
  // console.log("manualValues:", filterOptions);
  const products = filterOptions.products; 
  console.log("The filters:");
  const filters = (filterOptions.filters.length > 0 && Object.keys(filterOptions.filters[0]).includes('manualValues')) ? filterOptions.filters[0].manualValues : [];
  // const checkedStates = filterOptions.checkedStates;
  return json({collection, menu, allItems, products, filters, handle});
}

export function FilterList(el, filters, handle, query) {

  function dd(tag) {
    // document.querySelector('#filters-form').submit();
  }

  console.log("checkedStates from FilterList:", el);
  return (
    <div>
      
        <div className='form-group'>
          <p>

            <label className="cb-container link"><span>{el.el}</span>
              <input type="checkbox" name="tags" value={el.el} defaultChecked={el.query.includes(el.el)} />
              <span className="checkmark"></span>
            </label>

          </p>
        </div>
    </div>
  );
}

export function SingleItem({item}) {
  // console.log(item);
  // const variant = item.variants[0];
  console.log("variant:");
  console.log(item);
  // const variantUrl = useVariantUrl(item.handle, variant.selectedOptions);
  // const variantUrl = useVariantUrl(item.handle, '42449850728598');
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

export default function Collection() {
  const queryParams = useLocation();
  const [query] = useSearchParams();

  const enabledFilters = query.getAll('tags');
  const {collection, menu, allItems, products, filters, handle} = useLoaderData<typeof loader>();
  console.log("pdorudcts:");
  console.log(products);

  // const checkedStates = new Array(filters.length).fill({tag: "TheTest", checked: false});
  let checkedStates = [];
  console.log("filters BEFORE:");
  console.log(filters);
  console.log("checkedStates BEFORE:");
  console.log(checkedStates);
    
  for(let i = 0; i < filters.length; i++) {
    console.log("checkedStates.length:", checkedStates.length);
    checkedStates.push({tag: filters[i], checked: false});
    console.log("filters[i]: ", filters[i]);
    console.log("checkedStates[i]: ", checkedStates[i]);
    console.log("checkedStates SETTING:", checkedStates[i]);
    console.log("checkedStates:", checkedStates);
  }
  console.log("filters AFTER:");
  console.log(filters);
  console.log("checkedStates AFTER:", checkedStates);

  console.log("queryParams.search");
  console.log(queryParams.search);


  // checkedStates[0].checked = true;
  // console.log("checkedStates:", checkedStates);
  //https://services.mybcapps.com/bc-sf-filter/filter?shop=cheatersfirststore.myshopify.com&build_filter_tree=true
  //r['filter']['options'][3]
  //https://services.mybcapps.com/bc-sf-filter/search?shop=cheatersfirststore.myshopify.com&tag=Culinary
  const submit = useSubmit();

  return (
    <div className="collection">
      <div className='left-side collection-filters'>
        <form method='get' action={`/collections/${handle}?search`} id="filters-form" onChange={(e) => submit(e.currentTarget)}>
          <h2>Industry</h2>
            {
              filters.map((el) => {
                return <FilterList el={el} filters={checkedStates} handle={handle} query={enabledFilters} />
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
              el.collections.some(c => c.handle == collection.handle) && <SingleItem item={el} />
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

function ProductsGrid({products, collection}: {products: ProductItemFragment[]}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            collection={collection}
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
  collection
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <div className="product-item">
      <Link
        className="product-link"
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
        {product.featuredImage && (
          <div className="image-wrapper"
            style={{backgroundImage: 'url(' + product.featuredImage.url + ')', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
            {/* <Image
              style={{visibility: 'hidden'}}
              className='product-image'
              width="auto"
              alt={product.featuredImage.altText || product.title}
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
            /> */}
          </div>
        )}

        <div className="product-colors">
          {product.options.map((el) => {  
            if(el.name == 'Color') {
              return el.values.length > 0 ?
                <>
                    {el.values.map((inner) => {
                        return <div className='color-option-wrapper'>
                            <span className='color-option' style={{width: '10px', height: '10px', backgroundColor: inner}}></span>
                        </div>
                    })}
                </>
              : 
                <></>
            } else {
              return <></>
            }
          })}
        </div>

        <div className="product-details">
          <div className="row product-info">
            {/* <div className="brand">{collection.title}</div> */}
            <span>{product.title}</span>
            <span>{product.priceRange.minVariantPrice.amount != product.priceRange.maxVariantPrice.amount && 'from'} <Money data={product.priceRange.minVariantPrice} /></span>
          </div>
        </div>
      </Link>

      <div className='product-card product-options'>

        {product.options.map((el) => {  
          if(el.name == 'Size') {
            return el.values.length > 0 ?
              <>
                <select>
                  {el.values.map((inner) => {
                    return <option value="{inner}">{inner}</option>
                  })}
                </select>
              </>
            : 
              <></>
          } else {
            return <></>
          }
        })}
      </div>
          
    </div>
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
    options {
      name
      values
    }
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
