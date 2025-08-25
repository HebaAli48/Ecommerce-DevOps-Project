import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cart, Share, WishList } from "../../utils/Icons";
import StarRating from "../UI/StarRating";
import post from "../../assets/images/post2.jpg";
import ShareModal from "../UI/ShareModal";
import URL from "../../utils/URL";

const CategoryProducts = () => {
  const [searchParams] = useSearchParams();
  const subCategoryId = searchParams.get("subCategoryId");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    url: "",
    image: "",
    price: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!subCategoryId) return; // Prevent API call if subCategoryId is missing

      try {
        const response = await axios.post(`${URL}/products/subcategory`, {
          subCategoryId,
        });
        setProducts(response.data.products);
        console.log(
          "🚀 ~ fetchProducts ~ response.data.products:",
          response.data.products
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [subCategoryId]); // Re-fetch when subCategoryId changes

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return <p className="text-center text-gray-600">Loading products...</p>;
  }

  return (
    <div className="container mx-auto p-6 px-16">
      <h2 className="text-3xl font-bold text-center mb-6 text-secondary-color">
        Products in Subcategory
      </h2>
      <div className="my-10">
        <img
          src={post}
          alt="post"
          className="w-full h-full rounded-lg shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No products found.
          </p>
        ) : (
          products.map((product, i) => (
            <div
              key={product._id || i}
              className="flex flex-col border rounded-lg shadow-md hover:scale-[102%] transition-transform duration-300 cursor-pointer h-full"
              onClick={() => handleProductClick(product._id)}
            >
              {/* Product Image */}
              <div className="w-full h-64 overflow-hidden rounded-t-lg">
                <img
                  src={`${
                    product.imgsUrls[0]
                  }`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col flex-grow p-4">
                {/* Product Name */}
                <span className="font-medium text-lg text-text-color mb-2">
                  {product.name.length > 50
                    ? `${product.name.substring(0, 50)}...`
                    : product.name}
                </span>

                {/* Vendor and Rating */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">
                    {product.vendor?.length > 30
                      ? `${product.vendor.substring(0, 30)}...`
                      : product.vendor}
                  </p>
                  <span className="flex items-center gap-1">
                    <StarRating rating={product.review || 0} />
                    <span className="text-zinc-500">{product.review || 0}</span>
                  </span>
                </div>

                {/* Price */}
                <div className="flex justify-end items-center mb-4">
                  {product.price && (
                    <span className="text-gray-500 line-gray-200 line-through mr-2">
                      {product?.price?.original}
                    </span>
                  )}
                  <span className="text-xl font-bold text-secondary-color">
                    {product?.price?.final}
                  </span>
                </div>
                {/* // */}
                {/* Buttons */}
                <div className="flex justify-around items-center p-4 border-t mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Add to cart:", product.name);
                    }}
                    className="text-secondary-color hover:text-text-color transition-colors duration-300"
                  >
                    {Cart}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Add to wishlist:", product.name);
                    }}
                    className="text-secondary-color hover:text-text-color transition-colors duration-300"
                  >
                    {WishList}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsShareModalOpen(true);
                      setSelectedProduct({
                        url: `/product/${product._id}`,
                        image: product.imgsUrls[0],
                        price: product.finalPrice,
                      });
                    }}
                    className="text-secondary-color hover:text-text-color transition-colors duration-300"
                  >
                    {Share}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productUrl={selectedProduct.url}
        productImage={selectedProduct.image}
        productPrice={selectedProduct.price}
      />
    </div>
  );
};

export default CategoryProducts;
