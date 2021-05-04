import axios from 'axios'
const baseUrl = '/api/foods'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const getFoodDB = () => {
  const request = axios.get('api/foodDB')
  return request.then(response => response.data)
}
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.data
}

const deleteItem = (id, deletedObject) => {
  const request = axios.delete(`${baseUrl}/${id}`, deletedObject)
  return request.then(response => response.data)
}

export default { getAll, getFoodDB, create, update, deleteItem, setToken }