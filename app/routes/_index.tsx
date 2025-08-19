import {defer, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);



  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const params = new URLSearchParams({
    store_id: '4',
  });
  const store_settings = await fetch(`${args.context.env.BACKEND_URL}/get-store1-settings?${params.toString()}`); //.then(r => r.json().then(data => {console.log("Data returned!"); return data;}) ).catch(err => {console.log("ERR!", err)});
  
  //rebuy: https://rebuyengine.com/api/v1/products/recommended?key=dafd5187be5b5ada05f761e64d42fe082068912b&format=pretty
  const recommendedProducts = await fetch(`https://rebuyengine.com/api/v1/products/recommended?key=${args.context.env.REBUY_KEY}&format=pretty`);
  
  console.log("store settings: ");
  console.log(store_settings);

  return defer({...deferredData, ...criticalData, store_settings: await store_settings.json(),
    backend_url: args.context.env.CMS_API_URL,
    recommendedProducts: await recommendedProducts.json(),
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const backend_url = data.backend_url.endsWith("/") ? data.backend_url.replace(/\/$/, "") : data.backend_url;

  return (
    <div className="home">
      <HeroImage imgsrc={(backend_url + data.store_settings.data.attributes.hero_image_top.data.attributes.url)} key="hero1" title = "Outfitting teams in quality scrubs and uniforms since 1983" buttons={['shop men', 'shop women']} />
      <FeaturedCollection collection={data.featuredCollection} />
      <CategoryRow products={data.recommendedProducts} store_settings={data.store_settings} url={data.backend_url} />
      <RecommendedProducts products={data.recommendedProducts} />
      <HeroImage imgsrc={(backend_url + data.store_settings.data.attributes.hero_image_middle.data.attributes.url)} key="hero2" title="Looking to outfit your team?" buttons={['Get a quote']} />
      <TextTilesRow />
      <HeroImage imgsrc={(backend_url + data.store_settings.data.attributes.hero_image_bottom.data.attributes.url)} key="hero3" title="Let our team help your team" />
    </div>
  );
}

export function TextTilesRow() {
  return (
      
      <>
        <div className='text-tiles-wrapper'>
            <div className='text-tiles'>
              <div className='text-tile' >
                <div className='tile-header'>
                    <span>Simple or complex customization</span>
                </div>
                <p className='tile-description'>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi inventore ut tempore nam totam repudiandae sint
                </p>
              </div>
              
              <div className='text-tile' >
                <div className='tile-header'>
                    <span>Favourable bulk pricing</span>
                </div>
                <p className='tile-description'>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi inventore ut tempore nam totam repudiandae sint
                </p>
              </div>
              
              <div className='text-tile' >
                <div className='tile-header'>
                    <span>We are fast</span>
                </div>
                <p className='tile-description'>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi inventore ut tempore nam totam repudiandae sint
                </p>
              </div>
              
              <div className='text-tile' >
                <div className='tile-header'>
                    <span>White glove service</span>
                </div>
                <p className='tile-description'>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi inventore ut tempore nam totam repudiandae sint
                </p>
              </div>
            </div>
        </div>
      </>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;

  const image = collection?.image;
  return (
    <div>
      <Link
        className="featured-collection"
        to={`/collections/${collection.handle}`}
      >
        <h2>{collection.title}</h2>
        
        {image && (
          <div className="featured-collection-image" style={{aspectRatio: "unset"}}>
            <Image data={image} sizes="100vw" />
          </div>
        )}
      </Link>

      <div className="recommended-products-grid">
        {collection.products.nodes.map(product => {
          return <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={{url: `${product.images.nodes[0].url}`}}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={{
                        amount: `${product.priceRange.minVariantPrice.amount}`,
                        currencyCode: "CAD"
                      }} />
                  </small>
                </Link>
        })}
      </div>
    </div>
  );
}

export function CategoryRow({
  products,
  store_settings,
  url,
}: {
  products: Promise<RecommendedProductsQuery>,
  store_settings: JSON,
  url: string,
}) {
  return (
      
      <div className='site-section'>
        <div className="collection-heading">
          <h2>Shop by Industry</h2>
        </div>
        <Await resolve={products}>
          {({products}) => (
            <div className='tiles'>
              <div className='category-tile' >
                <div className='tile-contents'>
                  <img
                    className='tile-image'
                    src={url.replace(/\/$/, "") + store_settings.data.attributes.block1_logo.data.attributes.url}
                    data-item="50"
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    />

                    <p className='tile-title'>Healthcare</p>
                </div>
              </div>
              
              <div className='category-tile' >
                <div className='tile-contents'>
                  <img
                    className='tile-image'
                    src={url.replace(/\/$/, "") + store_settings.data.attributes.block2_logo.data.attributes.url}
                    data-item="50"
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    />

                  <p className='tile-title'>Dentistry</p>
                </div>
              </div>
              
              <div className='category-tile' >
                <div className='tile-contents'>
                  <img
                    className='tile-image'
                    src={url.replace(/\/$/, "") + store_settings.data.attributes.block3_logo.data.attributes.url}
                    data-item="50"
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    />

                  <p className='tile-title'>Veterinary</p>
                </div>
              </div>
              
              <div className='category-tile' >
                <div className='tile-contents'>
                  <img
                    className='tile-image'
                    src={url.replace(/\/$/, "") + store_settings.data.attributes.block4_logo.data.attributes.url}
                    data-item="50"
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    />

                  <p className='tile-title'>Culinary</p>
                </div>
              </div>
            </div>
          )}
        </Await>
      </div>
  );
}

function HeroImage({
                title = 'Hero title',
                buttons = [],
                imgsrc="https://cdn.shopify.com/s/files/1/1721/8901/files/pexels-alexandra-haddad-9317179.jpg?v=1717795912"
          } : {title: string, buttons?: Array<String>, imgsrc?: string}) {
  return(
    <>
      <section className="hero-image-section" key={"key" + Math.random() * 10}>
        <img className='hero-image' src={imgsrc}/>
        
        <section className="img-texts">
          <section className='text-block'>
            <p className='hero-title' key={"key" + Math.random() * 10}>{title}</p>
            {/* <p className='hero-subtitle'>Hero subtitle</p> */}
          </section>
          <section className='button-block'>

          {buttons.map((b) => {
            return <div className="hero-button">
            <a href="#" onClick={() => {return false;}}>{b}</a>
          </div>
        })}



          </section>
        </section>

      </section>
    </>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  console.log('Prods:', products);
  return (
    <div className="recommended-products">
      <h2>For you</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.data.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={{url: `${product.image.src}`}}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={{
                            amount: `${product.variants[0].price}`,
                            currencyCode: "CAD"
                          }} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
    products(first: 5) {
      nodes {
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
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
