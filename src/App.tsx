import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { DashboardView } from "@/components/views/DashboardView";
import { NewOperationView } from "@/components/views/NewOperation/NewOperationView";
import { OperationsView } from "@/components/views/OperationsView";
import { OperationDetailView } from "@/components/views/OperationDetailView";
import { ProfileView } from "@/components/views/ProfileView";
import { LoginView } from "@/components/views/LoginView";
import { useAuth } from "@/context/AuthContext";
import { EnvioCartasView } from "@/components/views/EnvioCartasView";
import { SunatView } from "@/components/views/Sunat/SunatView";

// Componente guardián
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper para títulos del Header
  const getHeaderTitle = () => {
    if (location.pathname.includes('/operacion/')) return "Detalle de Operación";
    switch (location.pathname) {
      case "/": return undefined;
      case "/operaciones": return "Mis Operaciones";
      case "/nueva-operacion": return "Nueva Operación";
      case "/perfil": return "Perfil y Scoring";
      case "/envio-cartas": return "Envío de Cartas de Cesión";
      case "/sunat": return "Portal SUNAT";
      default: return undefined;
    }
  };

  // Convertimos rutas de URL al tipo esperado por tu Sidebar
  const getCurrentRouteLabel = () => {
    if (location.pathname.includes('/operacion/')) return "operation-detail";
    if (location.pathname === '/operaciones') return "operations";
    if (location.pathname === '/nueva-operacion') return "new-operation";
    if (location.pathname === '/perfil') return "profile";
    if (location.pathname === '/envio-cartas') return "envio-cartas";
    if (location.pathname === '/sunat') return "sunat";
    return "dashboard";
  };

  const handleNavigateSidebar = (route: string) => {
    const paths = {
      "dashboard": "/",
      "operations": "/operaciones",
      "new-operation": "/nueva-operacion",
      "sunat": "/sunat",
      "profile": "/perfil",
      "envio-cartas": "/envio-cartas",
    };
    navigate(paths[route as keyof typeof paths] || "/");
  };

  return (
    <Routes>
      {/* Ruta Pública */}
      <Route path="/login" element={<LoginView />} />

      {/* Rutas Protegidas enrutadas dentro de tu Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout 
            currentRoute={getCurrentRouteLabel()} 
            onNavigate={handleNavigateSidebar}
            headerTitle={getHeaderTitle()}
          >
            <DashboardView />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/operaciones" element={
        <ProtectedRoute>
          <Layout currentRoute="operations" onNavigate={handleNavigateSidebar} headerTitle="Mis Operaciones">
            {/* onNavigateToDetail ahora usa react-router */}
            <OperationsView onNavigateToDetail={(id, codigo) => navigate(`/operacion/${id}?codigo=${codigo}`)} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/operacion/:id" element={
        <ProtectedRoute>
          <Layout currentRoute="operation-detail" onNavigate={handleNavigateSidebar} headerTitle="Detalle de Operación">
            <OperationDetailWrapper />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/nueva-operacion" element={
        <ProtectedRoute>
          <Layout currentRoute="new-operation" onNavigate={handleNavigateSidebar} headerTitle="Nueva Operación">
            <NewOperationView onFinish={() => navigate("/operaciones")} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/envio-cartas" element={
        <ProtectedRoute>
          <Layout currentRoute="envio-cartas" onNavigate={handleNavigateSidebar} headerTitle="Envío de Cartas de Cesión">
            <EnvioCartasView />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/sunat" element={
        <ProtectedRoute>
          <Layout currentRoute="sunat" onNavigate={handleNavigateSidebar} headerTitle="Portal SUNAT">
            <SunatView />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/perfil" element={
        <ProtectedRoute>
          <Layout currentRoute="profile" onNavigate={handleNavigateSidebar} headerTitle="Perfil y Scoring">
            <ProfileView />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

import { useParams, useSearchParams } from "react-router-dom";
function OperationDetailWrapper() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get("codigo") || "Operación";
  const navigate = useNavigate();

  if (!id) return <div>ID inválido</div>;

  return <OperationDetailView operationId={id} operationCode={codigo} onBack={() => navigate('/operaciones')} />;
}