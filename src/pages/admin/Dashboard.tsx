
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/admin/Layout";
import { DashboardOverview } from "@/components/admin/DashboardOverview";

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | Admin Panel</title>
      </Helmet>
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <DashboardOverview />
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
