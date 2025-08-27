import { useState } from 'react';
import {Link, useNavigate,} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';



export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {open} = useAside();


  const navigate = useNavigate();
  const [countItems, setCountItems] = useState(1);


  //VariantSelector: https://shopify.dev/docs/storefronts/headless/hydrogen/cart/variant-selector

  return (
    <>

      <div className="product-form">
        {/* <VariantSelector
          handle={product.handle}
          options={product.options.filter((option) => option.values.length > 1)}
          variants={variants}
        >
          {({option}) => <ProductOptions key={option.name} option={option} />}
        </VariantSelector> */}


        <VariantSelector
          handle={product.handle}
          options={product.options.filter((option) => option.values.length > 1)}
          variants={variants}
        >
          {({option}) => {
            return (<>
              <div className="product-options" key={option.name}>
                <p className='bold'>{option.name}</p>
                <div className="product-options-grid">
                  <div className="dropdown-wrapper">
                    <select className="dropdown custom" onChange={((e) => {
                          navigate(e.target[e.target.selectedIndex].getAttribute('data-link'));
                          // return redirect(e.target[e.target.selectedIndex].getAttribute('data-link'));
                        })}>

                      {option.values.map(({value, isAvailable, isActive, to}) => {
                        return (
                          <option
                            data-link={to}
                            key={option.name + value}
                            value={value}>
                              {value}
                          </option>
                          
                        );
                      })}


                    </select>
                  </div>
              </div>
            </div>
          </>);
        }}
        </VariantSelector>

        <div className="product-options">
            <p><strong>Quantity</strong></p>
            <div className="product-options-grid">
              <div className="dropdown-wrapper">
                <select className="dropdown custom count-dropdown" onChange={((e) => { setCountItems(parseInt(e.target.value)); })}>
                  
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                  
                </select>
              </div>

            </div>
          </div>

        <AddToCartButton
        className="btn_addtocart"
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: countItems,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
      </div>
    </>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}
