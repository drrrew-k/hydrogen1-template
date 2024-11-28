import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  Link,
  type V2_MetaFunction,
} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import tileCross from '../img/tile1.png';
import tileDentist from '../img/tile2.png';
import tileVet from '../img/tile3.png';
import tileCulinary from '../img/tile4.png';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections {
    collections(first: 3, query: "title:Apparel") {
      nodes {
        id
        title
        handle
      }
    }
  }
`;

// const PRODS = `#graphql
//   query RecommendedProducts {
//     products(first: 3) {
//       nodes {
//         id
//         title
//         handle
//       }
//     }
//   }
// `;

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style }}
      onClick={onClick}
    >Next</div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style }}
      onClick={onClick}
    >Prev</div>
  );
}


export function SimpleSlider({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  return (
      
      <div className='site-section'>
        <div className="collection-heading">
          <h2>Best Sellers</h2>
        </div>
        <Await resolve={products}>
          {({products}) => (
              <Slider {...settings}>
                  {products.nodes.map((item) => (
                    <div className='slider-item' key={item.id}>
                      <div className='slider-upper-block' style={{backgroundImage: 'url(' + item.images.nodes[0].url + ')'}}>
                        <Image
                          data={item.images.nodes[0]}
                          aspectRatio="1/1"
                          style={{visibility: 'hidden'}}
                          sizes="(min-width: 45em) 20vw, 50vw"
                          />
                      </div>
                      <div className='slider-lower-block'>
                        <h4>{item.title}</h4>
                        <span className='price'>
                          <Money data={item.priceRange.minVariantPrice} />
                        </span>
                      </div>
                    </div>
                  ))}
              </Slider>
          )}
        </Await>
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


const PRODS = `#graphql
query RecommendedProducts {
  products(first:10, query: "tag:store1") {
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

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;
  // const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const {collections} = await storefront.query(COLLECTIONS_QUERY);
  const featuredCollection = collections.nodes[0];
  // const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const recommendedProducts = storefront.query(PRODS);
  const brand = storefront.query(LOGO_QUERY).then( r => {
    console.log("Brand fetched!");
    console.log(r.shop.brand);
  }).catch(err => {
    console.log(err);
  });

  console.log("context:");
  console.log(`${context.env.BACKEND_URL}` + "/get-store1-settings");
  // const store_settings = await fetch(`${context.env.BACKEND_URL}/get-store1-settings`).then(r => r.json() );
  // let store_settings = {};
  // store_settings = await fetch(`${context.env.BACKEND_URL}/get-store1-settings`).then(r => r.json().then(data => {return data;}) );
  const store_settings = await fetch(`${context.env.BACKEND_URL}/get-store1-settings`); //.then(r => r.json().then(data => {console.log("Data returned!"); return data;}) ).catch(err => {console.log("ERR!", err)});
  console.log("store settings: ");
  console.log(store_settings);
  return defer({
    featuredCollection,
    recommendedProducts,
    brand,
    store_settings: await store_settings.json(),
    backend_url: context.env.CMS_API_URL,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  
  console.log("data from Homepage:");
  console.log(data);
  // console.log(data.store_settings.data.attributes.block1_logo.data.attributes.url);
  console.log("EOL==============================================================");
  return (
    <div className="home">
      <HeroImage key="hero1" title = "Outfitting teams in quality scrubs and uniforms since 1983" buttons={['shop men', 'shop women']} />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <SimpleSlider products={data.recommendedProducts} />
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
      <CategoryRow products={data.recommendedProducts} store_settings={data.store_settings} url={data.backend_url} />
      
      {/* <Await resolve={data.store_settings}>
        {({store_settings}) => (
          <CategoryRow products={data.recommendedProducts} store_settings={data.store_settings} url={data.backend_url} />
        )}
      </Await> */}

      <HeroImage key="hero2" title="Looking to outfit your team?" buttons={['Get a quote']} />
      <TextTilesRow />
      <HeroImage key="hero3" title="Let our team help your team" />
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
            <p className='hero-title'>{title}</p>
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

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  const image = collection ? collection.image : null;
  return (
    <>
      {(collection && collection.handle) && (
        <Link
          className="featured-collection"
          to={`/collections/${collection.handle}`}
        >
          {image && (
            <div className="featured-collection-image">
              <Image data={image} sizes="100vw" />
            </div>
          )}
          <h1>{collection.title}</h1>
        </Link>
      )}
    </>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended products</h2>
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
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const LOGO_QUERY = `#graphql
  query{
    shop {
      id
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
  }
`;

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
