import * as React from "react";
import { Layout } from "@/components/Layout";
import { Route } from "@/components/Sidebar";
import { DashboardView } from "@/components/views/DashboardView";
import { NewOperationView } from "@/components/views/NewOperation/NewOperationView";
import { OperationsView } from "@/components/views/OperationsView";
import { OperationDetailView } from "@/components/views/OperationDetailView";
import { ProfileView } from "@/components/views/ProfileView";

export default function App() {
  const [currentRoute, setCurrentRoute] = React.useState<Route>("dashboard");
  const [detailId, setDetailId] = React.useState<string | null>(null);

  const handleNavigate = (route: Route) => {
    setCurrentRoute(route);
    if (route !== "operation-detail") {
      setDetailId(null);
    }
  };

  const handleNavigateToDetail = (id: string) => {
    setDetailId(id);
    setCurrentRoute("operation-detail");
  };

  const getHeaderTitle = () => {
    switch (currentRoute) {
      case "dashboard": return undefined; // Uses default greeting
      case "operations": return "Mis Operaciones";
      case "new-operation": return "Nueva Operación";
      case "profile": return "Perfil y Scoring";
      case "operation-detail": return "Detalle de Operación";
      default: return undefined;
    }
  };

  return (
    <Layout 
      currentRoute={currentRoute} 
      onNavigate={handleNavigate}
      headerTitle={getHeaderTitle()}
    >
      {currentRoute === "dashboard" && <DashboardView />}
      {currentRoute === "new-operation" && (
        <NewOperationView onFinish={() => handleNavigate("operations")} />
      )}
      {currentRoute === "operations" && (
        <OperationsView onNavigateToDetail={handleNavigateToDetail} />
      )}
      {currentRoute === "operation-detail" && (
        <OperationDetailView onBack={() => handleNavigate("operations")} />
      )}
      {currentRoute === "profile" && <ProfileView />}
    </Layout>
  );
}
