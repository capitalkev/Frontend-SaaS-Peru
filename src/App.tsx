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
  // CAMBIO 1: Guardamos un objeto con el ID (para la API) y el Código (para el título)
  const [selectedOp, setSelectedOp] = React.useState<{ id: string, codigo: string } | null>(null);

  const handleNavigate = (route: Route) => {
    setCurrentRoute(route);
    if (route !== "operation-detail") {
      setSelectedOp(null);
    }
  };

  // CAMBIO 2: Recibimos ambos valores
  const handleNavigateToDetail = (id: string | number, codigo: string) => {
    setSelectedOp({ id: String(id), codigo });
    setCurrentRoute("operation-detail");
  };

  const getHeaderTitle = () => {
    switch (currentRoute) {
      case "dashboard": return undefined;
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
      {/* CAMBIO 3: Pasamos ambos valores al detalle */}
      {currentRoute === "operation-detail" && selectedOp && (
        <OperationDetailView 
          operationId={selectedOp.id} 
          operationCode={selectedOp.codigo} 
          onBack={() => handleNavigate("operations")} 
        />
      )}
      {currentRoute === "profile" && <ProfileView />}
    </Layout>
  );
}