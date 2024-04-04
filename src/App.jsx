import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

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
      // console.log(data);
      if (data.products.length === 0) {
        setWillLoad(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setPage((prevPage) => prevPage + 1);
      }
    };
    console.log(products);
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
      <div>{/* to show products  */}</div>
      <div ref={loaderRef}>Loading more.....</div>
    </div>
  );
}
