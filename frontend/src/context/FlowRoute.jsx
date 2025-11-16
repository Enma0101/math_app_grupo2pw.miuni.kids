export function FlowRoute({ children }) {
  const { token, initializing, lastValidRoute, setLastValidRoute } = useAuth();
  const location = useLocation();

  if (initializing) return null;
  if (!token) return <Navigate to="/login" replace />;

  const currentIndex = ROUTE_FLOW.indexOf(location.pathname);
  const lastIndex = ROUTE_FLOW.indexOf(lastValidRoute);

  // Decidir nueva última ruta válida
  const newLastValidRoute =
    location.pathname === "/Home" || currentIndex === lastIndex + 1
      ? location.pathname
      : lastValidRoute;

  // Actualizar la última ruta válida solo si cambió
  useEffect(() => {
    if (newLastValidRoute !== lastValidRoute) {
      setLastValidRoute(newLastValidRoute);
    }
  }, [newLastValidRoute, lastValidRoute, setLastValidRoute]);

  // Validar acceso
  if (location.pathname !== "/Home" && (currentIndex === -1 || currentIndex > lastIndex + 1)) {
    return <Navigate to={lastValidRoute || "/Home"} replace />;
  }

  return children;
}
