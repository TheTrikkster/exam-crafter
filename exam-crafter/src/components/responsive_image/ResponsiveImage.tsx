'use client';
import Image from 'next/image';
import './ResponsiveImage.scss';
import useWindowSize from '../window_size/useWindowSize';
import HeaderImage5 from '../../../public/home5.png';
import HeaderImage1 from '../../../public/home1.png';
import HeaderImage2 from '../../../public/home2.png';
import HeaderImage3 from '../../../public/home3.png';
import HeaderImage4 from '../../../public/home4.png';
import Mobile1 from '../../../public/Mobile1.png';
import Mobile2 from '../../../public/Mobile2.png';

// type ImageProps = {
//   blurDataURL: string;
//   blurHeight: number;
//   blurWidth: number;
//   height: number;
//   src: string;
//   width: number;
// };

// type SrcAndClassType = {
//   src: string;
//   class: string;
// };

// type PhotoType = ImageProps | SrcAndClassType;

// interface PhotoGalleryProps {
//   photosToShow: PhotoType[];
// }

const PhotoGallery = () => {
  const width = useWindowSize();
  const photos = [
    HeaderImage5,
    HeaderImage1,
    HeaderImage2,
    HeaderImage3,
    HeaderImage4
  ];

  const photosMobile = [
    { src: Mobile1, class: 'ResponsiveImage_small' },
    { src: HeaderImage2, class: 'ResponsiveImage_big' },
    { src: Mobile2, class: 'ResponsiveImage_small' }
  ];

  if (width === null) {
    return null;
  }

  const isMobile = width <= 768;
  const photosToShow = isMobile ? photosMobile : photos;

  return (
    <div className="w-full flex gap-x-3">
      {photosToShow.map((photo, index: number) => {
        if ('class' in photo) {
          return (
            <Image
              key={index}
              src={photo.src}
              alt="un étudiant qui apprend"
              className={`photo-gallery ${photo.class}`}
            />
          );
        } else {
          return (
            <Image
              key={index}
              src={photo}
              alt="un étudiant qui apprend"
              className="photo-gallery"
            />
          );
        }
      })}
    </div>
  );
};

export default PhotoGallery;
