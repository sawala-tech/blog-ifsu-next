import api from '@services/api'

// function untuk mengambil data dari api
export const fetcher = (url) => {
  if (!url) return null
  return api
    .get(url)
    .then((res) => {
      return res.data
    })
    .catch(() => null)
}
