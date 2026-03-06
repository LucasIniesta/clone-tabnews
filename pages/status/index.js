import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <DatabaseStatus />
    </>
  );
}

function DatabaseStatus() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const loading = "Carregando...";

  const updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  const databaseVersion = data.dependencies.database.version;
  const databaseOpenedConnections =
    data.dependencies.database.opened_connections;
  const databaseMaxConnections = data.dependencies.database.max_connections;

  if (isLoading && !data) {
    return <div>{loading}</div>;
  }

  return (
    <>
      <p>Última atualização: {updatedAtText}</p>
      <div>Versão: {databaseVersion}</div>
      <div>Conexões abertas: {databaseOpenedConnections}</div>
      <div>Conexões máximas: {databaseMaxConnections}</div>
    </>
  );
}
