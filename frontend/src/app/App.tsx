import { useCallback, useEffect, useMemo, useState } from 'react'

type ConnectorStatus = 'good' | 'slow' | 'broken'

type ConnectorSummary = {
  id: string
  name: string
  currentStatus: ConnectorStatus
  lastCheckedAt?: string
  latencyMs?: number
}

type LoadState = 'loading' | 'ready' | 'error'

type ConnectorResponse = ConnectorSummary[] | { connectors?: ConnectorSummary[] }

const formatTimestamp = (value?: string) => {
  if (!value) {
    return 'Never checked'
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Invalid timestamp'
  }
  return parsed.toLocaleString()
}

const formatLatency = (value?: number) => {
  if (value === undefined || value === null) {
    return 'n/a'
  }
  return `${Math.round(value)} ms`
}

const statusLabel: Record<ConnectorStatus, string> = {
  good: 'Good',
  slow: 'Slow',
  broken: 'Broken',
}

const statusTone: Record<ConnectorStatus, string> = {
  good: 'status-pill status-good',
  slow: 'status-pill status-slow',
  broken: 'status-pill status-broken',
}

const extractConnectors = (payload: ConnectorResponse): ConnectorSummary[] => {
  if (Array.isArray(payload)) {
    return payload
  }
  return payload.connectors ?? []
}

const App = () => {
  const [connectors, setConnectors] = useState<ConnectorSummary[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)

  const loadConnectors = useCallback(async () => {
    setState('loading')
    setError(null)

    try {
      const response = await fetch('/api/connectors')
      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`)
      }
      const payload = (await response.json()) as ConnectorResponse
      setConnectors(extractConnectors(payload))
      setState('ready')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setState('error')
    }
  }, [])

  useEffect(() => {
    void loadConnectors()
  }, [loadConnectors])

  const summary = useMemo(() => {
    return connectors.reduce(
      (acc, connector) => {
        acc.total += 1
        if (connector.currentStatus === 'good') {
          acc.good += 1
        }
        if (connector.currentStatus === 'slow') {
          acc.slow += 1
        }
        if (connector.currentStatus === 'broken') {
          acc.broken += 1
        }
        if (connector.lastCheckedAt) {
          acc.latest = acc.latest
            ? new Date(connector.lastCheckedAt) > new Date(acc.latest)
              ? connector.lastCheckedAt
              : acc.latest
            : connector.lastCheckedAt
        }
        return acc
      },
      {
        total: 0,
        good: 0,
        slow: 0,
        broken: 0,
        latest: undefined as string | undefined,
      },
    )
  }, [connectors])

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Retail API Guardian</p>
          <h1>Connector Health Dashboard</h1>
          <p className="subtitle">
            Track live connector status, recent checks, and investigate issues in one place.
          </p>
        </div>
        <div className="header-actions">
          <button className="button ghost" type="button" onClick={loadConnectors}>
            Refresh
          </button>
          <button className="button primary" type="button" disabled>
            Recheck connectors
          </button>
        </div>
      </header>

      <section className="status-grid">
        <div className="stat-card">
          <p className="stat-label">Total connectors</p>
          <p className="stat-value">{summary.total}</p>
          <p className="stat-meta">Last update: {formatTimestamp(summary.latest)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Healthy</p>
          <p className="stat-value">{summary.good}</p>
          <p className="stat-meta">Stable integrations</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Needs attention</p>
          <p className="stat-value">
            {summary.slow + summary.broken}
            <span className="stat-hint"> / {summary.total}</span>
          </p>
          <p className="stat-meta">Slow or broken connectors</p>
        </div>
      </section>

      <section className="main-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Connectors</h2>
            <span className="panel-meta">{summary.total} tracked</span>
          </div>

          {state === 'loading' && (
            <div className="panel-state">
              <p>Loading connector health...</p>
              <span className="hint">We are reaching the backend API.</span>
            </div>
          )}

          {state === 'error' && (
            <div className="panel-state error">
              <p>We could not load connector data.</p>
              <span className="hint">
                Start the backend with <code>npm run dashboard</code> and refresh.
              </span>
              <span className="hint">Error: {error}</span>
            </div>
          )}

          {state === 'ready' && connectors.length === 0 && (
            <div className="panel-state empty">
              <p>No connector data yet.</p>
              <span className="hint">
                Once the API returns data, health status and history will appear here.
              </span>
            </div>
          )}

          {state === 'ready' && connectors.length > 0 && (
            <div className="connector-list">
              {connectors.map((connector) => (
                <button key={connector.id} className="connector-row" type="button">
                  <div>
                    <p className="connector-name">{connector.name}</p>
                    <p className="connector-meta">Last check: {formatTimestamp(connector.lastCheckedAt)}</p>
                  </div>
                  <div className="connector-stats">
                    <span className={statusTone[connector.currentStatus]}>
                      {statusLabel[connector.currentStatus]}
                    </span>
                    <span className="latency">{formatLatency(connector.latencyMs)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="panel side">
          <div className="panel-header">
            <h2>Investigation</h2>
            <span className="panel-meta">History and analysis</span>
          </div>
          <div className="panel-state empty">
            <p>Select a connector to view history.</p>
            <span className="hint">Analysis recommendations will appear here when available.</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
