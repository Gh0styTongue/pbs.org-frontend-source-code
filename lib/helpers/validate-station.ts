import { ValidStationIdResponse } from '@/lib/types/api/responses/v1/station/valid'

async function validateStationId(stationId: string) {
  const route = `/api/v1/station/${stationId}/valid/`

  const response = await fetch(route)
  const json = await response.json() as ValidStationIdResponse
  return json.valid
}

export default validateStationId
