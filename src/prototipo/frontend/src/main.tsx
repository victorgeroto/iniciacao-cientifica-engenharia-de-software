import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { session } from "./lib/api";
import { LoginPage } from "./pages/LoginPage";
import { MethodPage } from "./pages/MethodPage";
import { TasksPage } from "./pages/TasksPage";
import "./index.css";

// Telas com gráficos (Recharts) carregadas sob demanda.
const MetricsPage = lazy(() => import("./pages/MetricsPage").then((m) => ({ default: m.MetricsPage })));
const LoadTestPage = lazy(() => import("./pages/LoadTestPage").then((m) => ({ default: m.LoadTestPage })));

const loading = <p className="text-sm text-fg-muted" role="status">Carregando…</p>;

function RequireSession({ children }: { children: JSX.Element }) {
  return session.current() ? children : <Navigate to="/login" replace />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <RequireSession>
              <Layout />
            </RequireSession>
          }
        >
          <Route path="/tarefas" element={<TasksPage />} />
          <Route path="/metricas" element={<Suspense fallback={loading}><MetricsPage /></Suspense>} />
          <Route path="/carga" element={<Suspense fallback={loading}><LoadTestPage /></Suspense>} />
          <Route path="/metodo" element={<MethodPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/tarefas" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
