import { type TerrainAchievements } from '../types/terrainTypes';
import { TerrainState } from '@/helpers';

export default async function fetchUnitAchievements(): Promise<TerrainAchievements[] | undefined> {
  try {
    if (!TerrainState.getToken()) return undefined;
    const response = await fetch('https://achievements.terrain.scouts.com.au/units/' + TerrainState.getUnitID() + '/achievements', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: TerrainState.getToken()
      },
      redirect: 'error',
      referrerPolicy: 'strict-origin-when-cross-origin'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData.results;
  } catch (e) {
    console.log('Error fetching unit achievements: ' + e);
    return undefined;
  }
}
