
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/admin/Layout";
import { CategoriesManagement } from "@/components/admin/CategoriesManagement";

const Categories = () => {
  return (
    <>
      <Helmet>
        <title>Categories | Admin Panel</title>
      </Helmet>
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Categories Management</h1>
          <CategoriesManagement />
        </div>
      </Layout>
    </>
  );
};

export default Categories;
