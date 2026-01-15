// imports
import { useState, useEffect } from 'react';

// components
import Modal from '@/components/Modal/Modal';
import ITSImage from '@/components/ITSImage/ITSImage';

// styles
import styles from './EmbedModal.module.scss'

interface EmbedModalVideoProps {
  image: string;
  ancestor_title: string;
  title: string;
  show: {
    season: number;
    episode: number;
  };
  legacy_tp_media_id: string;
}

export interface EmbedModal {
  video: EmbedModalVideoProps;
  playerEmbedHost: string;
  isOpen: boolean;
  onClose?: () => void;
}

const config = {
  aspectRatio: 1.77, // 16:9
  minWidth: 320,
  minHeight: 224,
  topBarHeight: 43 // height of the viral player top bar, which needs to be accounted for
};

function EmbedModal(props: EmbedModal) {
  const { video, playerEmbedHost, isOpen: isOpenProp } = props
  const { image, title, show,
    ancestor_title: ancestorTitle,
    legacy_tp_media_id: legacyTPMediaId,
  } = video

  const embedUrl = `${playerEmbedHost}/viralplayer/${legacyTPMediaId}/`

  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(332)

  const [inputWidth, setInputWidth] = useState(512)
  const [inputHeight, setInputHeight] = useState(332)

  const [isOpen, setIsOpen] = useState(isOpenProp)

  const [fixedCopyButtonText, setFixedCopyButtonText] = useState('Copy')
  const [responsiveCopyButtonText, setResponsiveCopyButtonText] = useState('Copy')
  const [fixedIframeSnippet, setFixedIframeSnippet] = useState(`<iframe width="${width}" height="${height}" src="${embedUrl}" allowfullscreen allow="encrypted-media" style="border: 0;"></iframe>`)

  const closeEmbedModal = () => {
    setIsOpen(false)
    props.onClose?.()
  }

  const calculateDimensions = (w: number, h: number) => ([
    Math.round((h - config.topBarHeight) * config.aspectRatio),
    Math.round(w / config.aspectRatio + config.topBarHeight)
  ])

  // onChange update the the input field with it's own value
  // onBlur validate and set all fields
  const widthBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    let elWidth = parseInt(event.currentTarget.value, 10)

    // set value to minimum width if input is too low or invalid
    if (isNaN(elWidth) || (elWidth < config.minWidth)) {
      elWidth = config.minWidth;
    }

    const [,newHeight] = calculateDimensions(elWidth, height)

    setWidth(elWidth)
    setInputWidth(elWidth)
    setHeight(newHeight)
    setInputHeight(newHeight)
  }

  const heightBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    let elHeight = parseInt(event.currentTarget.value, 10)

    // set value to minimum height if input is too low or invalid
    if (isNaN(elHeight) || (elHeight < config.minHeight)) {
      elHeight = config.minHeight;
    }

    const [newWidth] = calculateDimensions(width, elHeight)

    setWidth(newWidth)
    setInputWidth(newWidth)
    setHeight(elHeight)
    setInputHeight(elHeight)
  }

  const widthHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const elWidth = parseInt(event.currentTarget.value, 10)
    setInputWidth(elWidth)
  }

  const heightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const elHeight = parseInt(event.currentTarget.value, 10)
    setInputHeight(elHeight)
  }

  useEffect(() => {
    setIsOpen(isOpenProp)
  }, [isOpenProp])

  useEffect(() => {
    setFixedIframeSnippet(`<iframe width="${width}" height="${height}" src="${embedUrl}" allowfullscreen allow="encrypted-media" style="border: 0;"></iframe>`)
  }, [width, height, embedUrl])

  const responsiveIframeSnippet = `<div class="pbs-viral-player-wrapper" style="position: relative; padding-top: calc(56.25% + 43px);"><iframe src="${embedUrl}" allowfullscreen allow="encrypted-media" style="position: absolute; top: 0; width: 100%; height: 100%; border: 0;"></iframe></div>`

  const copyFixedSnippet = async () => {
    try {
      await navigator.clipboard.writeText(fixedIframeSnippet)
      setFixedCopyButtonText('Copied')
      setTimeout(() => setFixedCopyButtonText('Copy'), 3000)
    } catch (error) {
      setFixedCopyButtonText('Copy failed. Please try again.')
      console.error('Error copying snippet to clipboard', error)
    }
  }

  const copyResponsiveSnippet = async () => {
    try {
      await navigator.clipboard.writeText(responsiveIframeSnippet)
      setResponsiveCopyButtonText('Copied')

      setTimeout(() => setResponsiveCopyButtonText('Copy'), 3000)
    } catch (error) {
      setResponsiveCopyButtonText('Copy failed. Please try again.')
      console.error('Error copying snippet to clipboard', error)
    }
  }

  return (
    <Modal isOpen={isOpen} className={styles.embed_modal} onClose={() => closeEmbedModal()}>
      <div className={styles.embed_modal__dialog}>
        <div className={styles.embed_modal__topbar}>
          <h2 className={styles.embed_modal__topbar_title}>Embed Video</h2>
        </div>
        <div className={styles.embed_modal__content}>
          <div className={styles.embed_modal__info}>
            { image && (
              <ITSImage
                src={image}
                alt={video.title}
                width={185}
                height={104}
                className={styles.embed_modal__image}
              />
            )}

            <p className={styles.embed_modal__show_title}>{ancestorTitle}</p>
            <h3 className={styles.embed_modal__video_title}>{title}</h3>

            <p className={styles.embed_modal__meta}>S{show.season} Ep{show.episode}</p>
          </div>

          <h3 className={styles.embed_modal__iframe_title}>
            Fixed iFrame
          </h3>

          <div className={styles.embed_modal__edit_dimensions}>
            <label htmlFor="embed-width">
              Width: <span className="visuallyhidden">in pixels</span>
            </label>
            <input
              type="number"
              id="embed-width"
              name="width"
              min={320}
              value={inputWidth}
              onChange={widthHandler}
              onBlur={widthBlurHandler}
              step={1}
            />
            <span aria-hidden="true">px</span>

            <label htmlFor="embed-height">
              Height: <span className="visuallyhidden">in pixels</span>
            </label>
            <input
              type="number"
              id="embed-height"
              name="height"
              min={258}
              value={inputHeight}
              onChange={heightHandler}
              onBlur={heightBlurHandler}
              step={1}
            />
            <span aria-hidden="true">px</span>
          </div>

          <div className={styles.embed_modal__input_button}>
            <input
              id="fixed-iframe-text"
              aria-labelledby="fixed-iframe-title"
              className={styles.embed_modal__text_for_copying}
              type="text"
              aria-hidden="true"
              value={fixedIframeSnippet}
              readOnly={true}
            >
            </input>

            <button
              data-copy-target="fixed-iframe-text"
              className={styles.embed_modal__copy_button}
              aria-label="Click to copy the fixed iFrame"
              onClick={copyFixedSnippet}
            >
              <span aria-hidden="true">{fixedCopyButtonText}</span>
            </button>
          </div>

          <h3 className={styles.embed_modal__iframe_title}>
            Responsive iFrame
          </h3>

          <div className={styles.embed_modal__input_button}>
            <input
              id="fixed-iframe-text"
              aria-labelledby="fixed-iframe-title"
              className={styles.embed_modal__text_for_copying}
              type="text"
              aria-hidden="true"
              value={responsiveIframeSnippet}
              readOnly={true}
            >
            </input>

            <button
              data-copy-target="fixed-iframe-text"
              className={styles.embed_modal__copy_button}
              aria-label="Click to copy the fixed iFrame"
              onClick={copyResponsiveSnippet}
            >
              <span aria-hidden="true">{responsiveCopyButtonText}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default EmbedModal
