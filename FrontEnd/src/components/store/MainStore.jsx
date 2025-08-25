import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../UI/Button";
import Loading from "../UI/Loading";
import URL from "../../utils/URL";
import axios from "axios";

const MainStore = () => {
  const [productSubCategories, setProductSubCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [visibleSubcategories, setVisibleSubcategories] = useState([]); // Initialize as empty array
  const navigate = useNavigate(); // Initialize useNavigate

  const handleShowMore = (index) => {
    setVisibleSubcategories((prev) =>
      prev.map((count, i) => (i === index ? count + 4 : count))
    );
  };

  const handleSubcategoryClick = (id) => {
    console.log("🚀 ~ handleSubcategoryClick ~ id:", id);

    // Navigate to the Products page with query parameters
    navigate(`/products?subCategoryId=${id}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${URL}/product-sub-category/`);
        setProductSubCategories(response.data.categories); // Set the fetched categories
        // console.log(
        //   "🚀 ~ fetchCategories ~ response.data.categories:",
        //   response.data.categories
        // );

        // Initialize visibleSubcategories based on the fetched data
        setVisibleSubcategories(response.data.categories.map(() => 4)); // Show 4 subcategories initially for each category
      } catch (error) {
        console.error("Error fetching product categories:", error);
      } finally {
        setLoading(false); // Hide loading once data is fetched (or on error)
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loading />; // Show loading component while fetching

  return (
    <div className="container mx-auto p-6 px-16">
      <h2 className="text-3xl font-bold text-center mb-6 text-secondary-color">
        Explore Our Store
      </h2>

      {productSubCategories.map((category, index) => (
        <div key={category.categoryId} className="mb-10">
          {/* Category Title */}
          <h3 className="text-2xl font-semibold mb-3 border-b-2 pb-2 text-secondary-color">
            {category.name}
          </h3>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.subcategories
              .slice(0, visibleSubcategories[index]) // Use visibleSubcategories[index] to control the number of visible subcategories
              .map((sub, i) => (
                <div
                  key={i}
                  className="border h-[250px] w-full rounded-lg shadow-md text-center hover:scale-105 cursor-pointer"
                  onClick={() => handleSubcategoryClick(sub._id)}
                >
                  <img
                    src={`${sub.image}`}
                    alt={sub.name}
                    className="mx-auto h-[200px] w-full rounded-t-md object-cover"
                  />
                  <p className="font-medium h-[50px] flex items-center justify-center text-white bg-light-color rounded-b-lg">
                    {sub.name}
                  </p>
                </div>
              ))}
          </div>

          {/* Show More Button */}
          {visibleSubcategories[index] < category.subcategories.length && (
            <div className="flex justify-center items-center">
              <Button
                primary={false}
                onClick={() => handleShowMore(index)}
                className="mt-3"
              >
                Show More{" "}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MainStore;
