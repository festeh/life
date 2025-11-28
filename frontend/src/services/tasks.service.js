const DIMAIST_API_URL = import.meta.env.VITE_DIMAIST_API_URL || 'https://dimaist.dimalip.in'

export const tasksService = {
  async getTasks() {
    const response = await fetch(`${DIMAIST_API_URL}/tasks`)
    return response.json()
  }
}
