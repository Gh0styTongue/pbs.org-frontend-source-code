// imports
import { useAtom } from 'jotai';
import { useEffect, useRef, useState, useCallback, KeyboardEvent, Ref } from 'react';

// lib files
import { navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';
import { normalizeTextInput } from '@/lib/helpers/normalize-text-input';
import { ShowOrFranchiseEnum } from '@/lib/types/api/show-data';

// components
import LinkButton from '@/components/Button/LinkButton';
import SearchButtonLink from '@/components/Navigation/SearchButtonLink';
import ShowPoster, { FranchisePosterType, ShowPosterType } from '@/components/ShowPoster/ShowPoster';

// svgs
import SearchIcon from '@/public/svg/magnifying-glass.svg';

// styles
import styles from './SearchMenu.module.scss';

interface SearchMenuAutocompleteProps {
  depIsOpen?: boolean;
  stationId?: string;
  ref?: Ref<HTMLDivElement>;
}

interface autocompleteResult {
  title: string;
  slug: string;
  poster?: string;
  item_type?: ShowOrFranchiseEnum;
}

const DEBOUNCE_DELAY_MS = 300;
const DESKTOP_BREAKPOINT = '(min-width: 768px)';

const getAutocompleteLimit = (): number => {
  return window.matchMedia(DESKTOP_BREAKPOINT).matches ? 10 : 4;
};

const SearchMenuAutocomplete = (props: SearchMenuAutocompleteProps) => {
  const { depIsOpen, stationId = '', ref } = props;
  const [ navigation, setNavigation ] = useAtom(navigationAtom);
  const [ autocompleteResults, setAutocompleteResults ] = useState<Array<FranchisePosterType | ShowPosterType>>([]);
  const [ debouncedTextInput, setDebouncedTextInput ] = useState('');
  const [ fetchedAutocompleteAtLeastOnce, setFetchedAutocompleteAtLeastOnce ] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const posterRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const seeAllButtonRef = useRef<HTMLAnchorElement>(null);

  const isOpen = depIsOpen || navigation === NavigationStateEnum.SearchMenuOpen;

  let classNames = `${styles.search_menu}`

  if (isOpen) {
    classNames += ` ${styles.is_open}`
  }

  // Navigation helpers
  const getColumnsCount = useCallback(() => {
    return window.matchMedia(DESKTOP_BREAKPOINT).matches ? 5 : 4;
  }, []);

  const getGridDimensions = useCallback((itemCount: number) => {
    const columns = getColumnsCount();
    const rows = Math.ceil(itemCount / columns);
    return { columns, rows };
  }, [getColumnsCount]);

  const getCoordinatesFromIndex = useCallback((index: number) => {
    const columns = getColumnsCount();
    const row = Math.floor(index / columns);
    const col = index % columns;
    return { row, col };
  }, [getColumnsCount]);

  const getIndexFromCoordinates = useCallback((row: number, col: number) => {
    const columns = getColumnsCount();
    return row * columns + col;
  }, [getColumnsCount]);

  const focusPoster = useCallback((index: number) => {
    if (index >= 0 && index < posterRefs.current.length && posterRefs.current[index]) {
      posterRefs.current[index]?.focus();
    }
  }, []);

  const focusSearchInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const focusSeeAllButton = useCallback(() => {
    seeAllButtonRef.current?.focus();
  }, []);

  // Reset refs array when autocomplete results change
  useEffect(() => {
    posterRefs.current = new Array(autocompleteResults.length).fill(null);
  }, [autocompleteResults.length]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processResults = (results: any): Array<FranchisePosterType | ShowPosterType> => {

    const returnedResults: Array<FranchisePosterType | ShowPosterType> = [];

    const franchiseResults = results.franchises;
    franchiseResults.forEach((franchise: autocompleteResult) => {
      const franchiseResult = {
        item_type: ShowOrFranchiseEnum.Franchise,
        slug: franchise.slug,
        title: franchise.title,
        images: { 'franchise-poster2x3': franchise.poster || '' }
      }
      returnedResults.push(franchiseResult);
    });
    const showResults = results.shows || [];
    showResults.forEach((show: autocompleteResult) => {
      const showResult = {
        item_type: ShowOrFranchiseEnum.Show,
        slug: show.slug,
        title: show.title,
        images: { 'show-poster2x3': show.poster || '' }
      }
      returnedResults.push(showResult);
    });

    const limit = getAutocompleteLimit();

    return returnedResults.slice(0, limit);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchAutocomplete = async () => {
        // if the user has cleared the input, reset states
        if(debouncedTextInput.length === 0) {
          setFetchedAutocompleteAtLeastOnce(false);
          setAutocompleteResults([]);
          return;
        }

        const limit = getAutocompleteLimit();

        const url = `/api/v1/search/autocomplete/?q=${encodeURIComponent(debouncedTextInput)}&stationId=${stationId}&limit=${limit}`;
        const results = await fetch(url);
        const data = await results.json();
        setAutocompleteResults(processResults(data.results));
        setFetchedAutocompleteAtLeastOnce(true);
      }
      fetchAutocomplete();
    }, DEBOUNCE_DELAY_MS);

    return () => {
      clearTimeout(handler);
    };
  // Only run this useEffect when deboucedTextInput changes otherwise the timeout
  // can get cleared prematurely.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTextInput])

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (autocompleteResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusPoster(0); // Go to the first
        break;
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setDebouncedTextInput(normalizeTextInput(searchTerm));
  }

  const handlePosterKeyDown = (e: KeyboardEvent<HTMLAnchorElement>, currentIndex: number) => {
    const { columns, rows } = getGridDimensions(autocompleteResults.length);
    const { row, col } = getCoordinatesFromIndex(currentIndex);

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        let nextIndex = currentIndex + 1;
        if (nextIndex >= autocompleteResults.length) {
          // Wrap to first item
          nextIndex = 0;
        }
        focusPoster(nextIndex);
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        let nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          // Wrap to last item
          nextIndex = autocompleteResults.length - 1;
        }
        focusPoster(nextIndex);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        const nextRow = row + 1;
        if (nextRow < rows) {
          const nextIndex = getIndexFromCoordinates(nextRow, col);
          if (nextIndex < autocompleteResults.length) {
            focusPoster(nextIndex);
          } else {
            // Go to last item in that row
            const lastIndexInRow = Math.min(autocompleteResults.length - 1, nextRow * columns + columns - 1);
            focusPoster(lastIndexInRow);
          }
        } else {
          // Go to "See All Results" button
          focusSeeAllButton();
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (row === 0) {
          // Go back to search input
          focusSearchInput();
        } else {
          const prevRow = row - 1;
          const nextIndex = getIndexFromCoordinates(prevRow, col);
          focusPoster(nextIndex);
        }
        break;
      }
      case 'Tab': {
        // Allow natural tab progression
        break;
      }
      case 'Escape': {
        e.preventDefault();
        focusSearchInput();
        break;
      }
    }
  };

  const handleSeeAllButtonKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault();
        // Go to last poster
        if (autocompleteResults.length > 0) {
          focusPoster(autocompleteResults.length - 1);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        focusSearchInput();
        break;
      }
    }
  };

  const handleResultOrLinkClick = () => {
    setNavigation(NavigationStateEnum.Default);
    inputRef.current!.value = '';
    setDebouncedTextInput('');
    setAutocompleteResults([]);
  }

  const autoCompleteContent = () => {
    switch(true) {
      case fetchedAutocompleteAtLeastOnce && autocompleteResults.length === 0:
        return (
          <LinkButton
              href={`/search?q=${encodeURIComponent(debouncedTextInput)}`}
              onClick={handleResultOrLinkClick}
              className={styles.no_results_button}
            >
            See All Results
          </LinkButton>
        );
      case fetchedAutocompleteAtLeastOnce && autocompleteResults.length > 0:
        return (
          <>
            <ul
              className={styles.autocomplete_results}
              role="grid"
              id="autocomplete-grid"
              aria-label="Search results"
            >
              {autocompleteResults.map((result, index) => {
                const { row, col } = getCoordinatesFromIndex(index);
                return (
                  <li
                    key={result.slug}
                    className={styles.autocomplete_result_item}
                    role="gridcell"
                    aria-rowindex={row + 1}
                    aria-colindex={col + 1}
                  >
                    <ShowPoster
                      show={result}
                      width={160}
                      onClick={handleResultOrLinkClick}
                      ref={(el) => {
                        posterRefs.current[index] = el;
                      }}
                      onKeyDown={(e) => handlePosterKeyDown(e, index)}
                    />
                  </li>
                  )
                }
              )}
            </ul>
            <LinkButton
              href={`/search?q=${encodeURIComponent(debouncedTextInput)}`}
              className={styles.view_all_results_button}
              onClick={handleResultOrLinkClick}
              ref={seeAllButtonRef}
              onKeyDown={handleSeeAllButtonKeyDown}
            >
              See All Results
            </LinkButton>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className={styles.search_menu_wrapper} ref={ref}>
      <SearchButtonLink linkClassName={styles.search_link} />

      <div className={classNames}>
        <div className={styles.search_menu_inner}>
          <form action="/search/" className={styles.search_form}>
            <input
              type="search"
              aria-label="Search PBS"
              placeholder="Search ..."
              autoComplete="off"
              name="q"
              className={styles.search_input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              ref={inputRef}
              aria-haspopup="grid"
              aria-controls={debouncedTextInput.length > 0 ? 'autocomplete-grid' : undefined}
            />
            <button type="submit" aria-label="Go" className={styles.search_submit_button}>
              <SearchIcon />
            </button>
          </form>
          { debouncedTextInput.length > 0 && (
            <div className={styles.autocomplete_container}>
              { autoCompleteContent() }
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default SearchMenuAutocomplete;
