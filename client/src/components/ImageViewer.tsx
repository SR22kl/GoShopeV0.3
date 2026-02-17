import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
} from "react-icons/fa";

interface Photo {
  public_id: string;
  url: string;
}

interface ImageViewerProps {
  photos: Photo[];
  productName: string;
}

const ImageViewer = ({ photos, productName }: ImageViewerProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const currentPhoto = photos[selectedIndex];

  return (
    <>
      {/* Main Image Viewer */}
      <div className="flex flex-col gap-4">
        {/* Large Image Display */}
        <div
          className="relative rounded-lg overflow-hidden md:h-[500px] h-[350px] flex items-center justify-center cursor-pointer group"
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={currentPhoto?.url}
            alt={productName}
            className="max-h-full max-w-full object-contain"
          />

          {/* Expand Button */}
          <button className="absolute top-4 right-4 bg-violet-600/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100">
            <FaExpand className="text-lg" />
          </button>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:-translate-x-1 duration-300 ease-in-out bg-violet-600/80  text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <FaChevronLeft className="text-lg" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-violet-600/80 hover:translate-x-1 duration-300 ease-in-out text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <FaChevronRight className="text-lg" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-violet-600/80 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {photos.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {photos.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={photo.public_id}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? "border-purple-600 shadow-lg"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={photo.url}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-4 right-4 text-white hover:text-red-500 text-3xl transition-colors duration-300 ease-in cursor-pointer z-50"
          >
            <FaTimes className=" cursor-pointer" />
          </button>

          {/* Fullscreen Carousel */}
          <div className="w-full h-full flex items-center justify-center relative">
            <img
              src={currentPhoto?.url}
              alt={productName}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 text-white hover:text-gray-400 text-4xl transition-colors cursor-pointer"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 text-white hover:text-gray-400 text-4xl transition-colors cursor-pointer"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Image Counter */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 px-4 py-2 rounded-full text-lg border border-gray-400 bg-white/80">
                {selectedIndex + 1} / {photos.length}
              </div>
            )}
          </div>

          {/* Fullscreen Thumbnails */}
          {photos.length > 1 && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.public_id}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedIndex === index
                      ? "border-purple-400 shadow-lg"
                      : "border-gray-600 hover:border-gray-500 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={`${productName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageViewer;
