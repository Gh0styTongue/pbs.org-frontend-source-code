import ShowRow from "@/components/ShowRow/ShowRow";
import { ShowRowContent } from "@/lib/types/api/show-data";
interface FeaturedShowsRowProps {
  shows: ShowRowContent[];
}

const FeaturedShowsRow = (props: FeaturedShowsRowProps) => {
  const { shows } = props;

  return (
    <ShowRow
      shows={shows}
      title={'Featured Shows'}
    />
  )
}

export default FeaturedShowsRow;
