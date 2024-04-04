import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import ProductCard from "./components/ProductCard";

const productsPerPage = 10;

export default function App() {
  const [products, setProducts] = useState([]);
  const [willLoad, setWillLoad] = useState(true);
  const [page, setPage] = useState(0);
  const loaderRef = useRef();

  useEffect(() => {
    // function to fetch data
    const loadProducts = async () => {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${productsPerPage}&skip=${
          productsPerPage * page
        }`
      );
      const data = await res.json();

      if (data.products.length === 0) {
        setWillLoad(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver((items) => {
      const loaderItem = items[0];

      if (loaderItem.isIntersecting && willLoad) {
        loadProducts();
      }
    });

    observer.observe(loaderRef.current);

    // clean up
    return () => observer.disconnect();
  }, [page, willLoad]);

  return (
    <div>
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <div ref={loaderRef}>
        <h4 className="text-center">Loading.....</h4>
      </div>
    </div>
  );
}
