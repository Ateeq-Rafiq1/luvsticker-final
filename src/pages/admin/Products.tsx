
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/admin/Layout";
import { ProductsManagement } from "@/components/admin/ProductsManagement";

const Products = () => {
  return (
    <>
      <Helmet>
        <title>Products | Admin Panel</title>
      </Helmet>
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Products Management</h1>
          <ProductsManagement />
        </div>
      </Layout>
    </>
  );
};

export default Products;
