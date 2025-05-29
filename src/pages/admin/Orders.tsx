
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/admin/Layout";
import { OrdersManagement } from "@/components/admin/OrdersManagement";

const Orders = () => {
  return (
    <>
      <Helmet>
        <title>Orders | Admin Panel</title>
      </Helmet>
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
          <OrdersManagement />
        </div>
      </Layout>
    </>
  );
};

export default Orders;
