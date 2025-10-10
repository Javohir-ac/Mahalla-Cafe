import React, { useState } from 'react'
import styles from './ImageLoader.module.scss'

interface ImageLoaderProps {
  src?: string
  alt: string
  className?: string
  placeholderText?: string
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className = '',
  placeholderText = 'No Image',
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // If no source provided or image failed to load, show placeholder
  if (!src || imageError) {
    return (
      <div className={`${styles.placeholderContainer} ${className}`}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderText}>{placeholderText}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${styles.image} ${imageLoaded ? styles.loaded : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {!imageLoaded && !imageError && (
        <div className={styles.loadingPlaceholder}>
          <div className={styles.placeholderText}>Loading...</div>
        </div>
      )}
    </div>
  )
}

export default ImageLoader
