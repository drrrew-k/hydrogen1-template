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

  return defer({featuredCollection, recommendedProducts, brand});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroImage />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function HeroImage() {
  return(
    <>
      <section className="hero-image-section">
        <img className='hero-image' src="https://cdn.shopify.com/s/files/1/0510/3258/8438/files/tiro-completo-menina-asiatica-feliz-indo-de-ferias-turista-com-mala-sorrindo-e-parecendo-otimista1.jpg?v=1701264728" />
        
        <section className="img-texts">
          <p className='hero-title'>Hero title</p>
          <p className='hero-subtitle'>Hero subtitle</p>
          <div className="hero-button">
            <a href="#" onClick={() => {return false;}}>Shop Now</a>
          </div>
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
