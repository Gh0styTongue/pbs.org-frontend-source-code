// lib files
import safeFetch from "@/lib/helpers/safe-fetch"

// components
import { ShowRowContent } from "@/lib/types/api/show-data";

export async function sendRecommendationPutEvent(showId: string, recommendationId: string) {
  const searchParams = new URLSearchParams();
  searchParams.append('showId', showId);
  searchParams.append('recommendationId', recommendationId);

  const response = await safeFetch(
    `/api/rec-engine/?${searchParams.toString()}`,
    { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  return response.ok
}

export async function handleRecommendedShowClick(show: ShowRowContent) {
  const showId = show.cid;
  const recommendationId = show?.recommendation_id;
  if(!recommendationId) {
    console.error('No recommendationId found for show:', showId);
    return;
  }
  sendRecommendationPutEvent(showId, recommendationId);
};