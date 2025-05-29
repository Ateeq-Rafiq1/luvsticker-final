
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/admin/Layout";
import { MaterialsManagement } from "@/components/admin/MaterialsManagement";

const Materials = () => {
  return (
    <>
      <Helmet>
        <title>Materials | Admin Panel</title>
      </Helmet>
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Materials Management</h1>
          <MaterialsManagement />
        </div>
      </Layout>
    </>
  );
};

export default Materials;
