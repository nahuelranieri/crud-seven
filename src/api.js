const BASE_URL = import.meta.env.VITE_API_URL || 'https://market.sevensport.com.ar/api'

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const details = body.errors ? Object.values(body.errors).flat().join(' ') : body.message
    throw new Error(details || `Error ${response.status}`)
  }

  return response.status === 204 ? null : response.json()
}

export const getSizeTemplates = () => request('/size-templates-meli')

export const createSizeTemplate = (data) =>
  request('/size-templates-meli', { method: 'POST', body: JSON.stringify(data) })

export const updateSizeTemplate = (id, data) =>
  request(`/size-templates-meli/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteSizeTemplate = (id) =>
  request(`/size-templates-meli/${id}`, { method: 'DELETE' })

export const getOptions = (name) => request(`/options/${name}`)
