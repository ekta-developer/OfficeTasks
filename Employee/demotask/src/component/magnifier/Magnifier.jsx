import React from "react";
import { GlassMagnifier } from "react-image-magnifiers";

const Magnifier = ({
  image,
  magnifierActive = true,
  className = "",
  allowOverflow = true,
  magnifierBorderColor = "rgba(255,255,255,.5)",
  magnifierBorderSize = 3,
  magnifierBackgroundColor = "rgba(225,225,225,.5)",
  magnifierOffsetX = 0,
  magnifierOffsetY = 0,
  magnifierSize = "25%",
  square = false,
}) => {
  if (!image || !image.src) {
    return <p>No image available</p>;
  }

  return (
    <div className={`glass-magnifier-container ${className}`}>
      <figure className="product-main-image">
        {magnifierActive ? (
          <GlassMagnifier
            imageSrc={image.src}
            imageAlt={image.alt || "Product Image"}
            largeImageSrc={image.zoomSrc || image.src} // High-resolution zoom image
            allowOverflow={allowOverflow}
            magnifierBorderColor={magnifierBorderColor}
            magnifierBorderSize={magnifierBorderSize}
            magnifierBackgroundColor={magnifierBackgroundColor}
            magnifierOffsetX={magnifierOffsetX}
            magnifierOffsetY={magnifierOffsetY}
            magnifierSize={magnifierSize}
            square={square}
            cursorStyle="crosshair"
            mouseActivation="hover"
            touchActivation="tap"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            src={image.src}
            alt={image.alt || "Product Image"}
            className="static-image"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        )}
      </figure>
    </div>
  );
};

export default Magnifier;
