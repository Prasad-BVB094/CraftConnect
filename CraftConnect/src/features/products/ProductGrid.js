import React from "react";
import ProductCard from "./ProductCard";

function ProductGrid(props) {
  const { products } = props;

  return React.createElement(
    React.Fragment,
    null,

    products.map((item, index) =>
      React.createElement(ProductCard, {
        key: index,
        product: item,
        onView: () => window.location.href = `/product/${item.id}`,
      })
    )
  );
}

export default ProductGrid;
