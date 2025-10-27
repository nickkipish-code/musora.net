/**
 * Утилита для работы с Nominatim API (OpenStreetMap)
 * Позволяет искать адреса и выполнять геокодирование без API ключей
 */

export interface NominatimResult {
  display_name: string;
  place_id: number;
  lat: string;
  lon: string;
  boundingbox: string[];
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export interface NominatimSearchResult {
  display_name: string;
  place_id: number;
  lat: string;
  lon: string;
  boundingbox: string[];
}

/**
 * Поиск адресов через Nominatim Search API
 */
export async function searchAddress(query: string): Promise<NominatimSearchResult[]> {
  try {
    // Ограничиваем поиск Украиной и используем украинский язык
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ua&limit=5&accept-language=uk&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'мусора.нет App',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Nominatim search error:', error);
    throw error;
  }
}

/**
 * Reverse geocoding - определение адреса по координатам
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<NominatimResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=uk&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'мусора.нет App',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Nominatim reverse geocoding error:', error);
    throw error;
  }
}

/**
 * Forward geocoding - получение координат по адресу
 */
export async function forwardGeocode(address: string): Promise<NominatimResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=ua&limit=1&accept-language=uk&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'мусора.нет App',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Nominatim forward geocoding error:', error);
    throw error;
  }
}

/**
 * Форматирует адрес из Nominatim результата
 */
export function formatAddress(result: NominatimResult): string {
  if (result.address) {
    const addr = result.address;
    const parts: string[] = [];
    
    if (addr.road) parts.push(addr.road);
    if (addr.house_number) parts.push(addr.house_number);
    
    const city = addr.city || addr.town || addr.village || '';
    if (city) parts.push(city);
    
    return parts.length > 0 ? parts.join(', ') : result.display_name;
  }
  
  return result.display_name;
}

