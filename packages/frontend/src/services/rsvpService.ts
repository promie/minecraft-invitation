const API_URL = import.meta.env.VITE_API_URL || ''
const STORAGE_KEY = 'minecraft-rsvp'

export interface RsvpData {
  name: string
  attending: 'yes' | 'no'
  guests: number
}

export interface RsvpResponse extends RsvpData {
  createdAt?: string
  updatedAt?: string
}

// Get RSVP from localStorage
export const getRsvpFromStorage = (): RsvpResponse | null => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as RsvpResponse
  } catch {
    return null
  }
}

// Save RSVP to localStorage
export const saveRsvpToStorage = (rsvp: RsvpResponse): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvp))
}

// Remove RSVP from localStorage
export const removeRsvpFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

// Get RSVP by name from API
export const getRsvp = async (name: string): Promise<RsvpResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/rsvp/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Failed to get RSVP: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching RSVP:', error)
    return null
  }
}

// Save RSVP (create or update)
export const saveRsvp = async (
  rsvpData: RsvpData,
): Promise<RsvpResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rsvpData),
    })

    if (!response.ok) {
      throw new Error(`Failed to save RSVP: ${response.statusText}`)
    }

    const data = await response.json()

    // If attending is "no", remove from localStorage, otherwise save it
    if (rsvpData.attending === 'no') {
      removeRsvpFromStorage()
    } else {
      saveRsvpToStorage(data)
    }

    return data
  } catch (error) {
    console.error('Error saving RSVP:', error)
    throw error
  }
}

// Update RSVP guests
export const updateRsvpGuests = async (
  name: string,
  guests: number,
): Promise<RsvpResponse | null> => {
  try {
    const response = await fetch(
      `${API_URL}/rsvp/${encodeURIComponent(name)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guests }),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to update RSVP: ${response.statusText}`)
    }

    const data = await response.json()

    // Update localStorage
    saveRsvpToStorage(data)

    return data
  } catch (error) {
    console.error('Error updating RSVP:', error)
    throw error
  }
}

