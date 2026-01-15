'use client'

import { useAtom } from 'jotai';
import { userProfile } from '@/lib/atoms/profile';
import FeaturedShowsRow from './FeaturedShowsRow';
import { useHasMounted } from '@/lib/hooks';
import TopPicksShowRow from './TopPicksShowRow';
import { ShowRowContent } from '@/lib/types/api/show-data';
interface TopPicksOrFeaturedShowsRowProps {
  featuredShows: ShowRowContent[];
}

const TopPicksOrFeaturedShowsRow = (props: TopPicksOrFeaturedShowsRowProps) => {
  const { featuredShows } = props;
  const hasMounted = useHasMounted();
  const [ profile ] = useAtom(userProfile);

  // Checks if component is mounted on the client before attempting to 
  // hydrate, otherwise a hydration error occurs
  if (!hasMounted) {
    return null;
  }

  // Render Top Picks Show Row only if the user is signed in
  // otherwise render the Featured Shows Row
  if (profile) {
    return <TopPicksShowRow featuredShows={featuredShows} />
  } else {
    return (
      <FeaturedShowsRow shows={featuredShows} />
    )
  }
}

export default TopPicksOrFeaturedShowsRow;
