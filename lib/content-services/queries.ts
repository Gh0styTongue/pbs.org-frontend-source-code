import graphql, { GraphQLPlatformType } from '@/lib/content-services/graphql';
import { ViewingHistoryResponse } from '@/lib/types/api/viewing-history';
import { ShowFeaturedPreviewResponse } from '@/lib/types/api/show-data';
import { SVPType } from '@/lib/helpers/content-config';

declare global {
  interface Window {
    pbsPlatform?: string;
    SVP?: SVPType
  }
}

export const VIEWING_HISTORY_QUERY = `
  query {
    viewerContext {
      viewingHistory {
        slug
        percentageWatched
      }
    }
  }
`;

export async function fetchViewingHistory(userId: string) {
  const platform = window.pbsPlatform as GraphQLPlatformType

  const options = {
    query: VIEWING_HISTORY_QUERY,
    userId,
    platform
  }

  const response = await graphql(options) as ViewingHistoryResponse
  return response?.data?.viewerContext?.viewingHistory || []
}

const FEATURED_PREVIEW = `
  query ShowFeaturedPreview($slug: String!) {
    showContext(showSlug: $slug) {
      featuredPreview {
        cid
        slug
        title
        videoType
        mezzanine16x9ImageUrl
        availability
      }
    }
  }
`;


export async function fetchFeaturedPreview(slug: string, platform: GraphQLPlatformType) {
  const options = {
    query: FEATURED_PREVIEW,
    variables: {slug},
    platform
  }

  const response: ShowFeaturedPreviewResponse = await graphql(options);

  return response.data.showContext.featuredPreview;
}
