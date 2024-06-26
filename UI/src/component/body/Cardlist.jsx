import React from "react";
import { IMG_CDN_URL } from "../body/config";

const RestaurantCard = (props) => {
  const { id, name, areaName, avgRating, cloudinaryImageId, base64Image, sla } =
    props;
  return (
    <div key={id} className="w-72 border-2 p-3 shadow-md">
      {base64Image ? (
        <img
          className="rounded-lg hover:scale-95 transition-all duration-500  cursor-pointer"
          alt="res-logo"
          src={`data:image/jpeg;base64,${base64Image}`}
        />
      ) : (
        <img
          className="rounded-lg hover:scale-95 transition-all duration-500  cursor-pointer"
          alt="res-logo"
          src={IMG_CDN_URL + cloudinaryImageId}
        />
      )}

      <h3 className="font-semibold">{name}</h3>
      <div className="flex justify-between">
        <p>{areaName}</p>
        <h3 className="text-orange-500">
          <span className="font-bold">{sla.deliveryTime}</span> min/
          <span>
            <span className="font-bold">{avgRating}</span> star
          </span>
        </h3>
      </div>
    </div>
  );
};

export const withPromotedLabel = (WrappedComponent) => {
  return ({ ...props }) => {
    return (
      <div className="relative">
        <div className="absolute top-0 left-0 bg-red-500 text-white p-1 rounded-md">
          Promoted
        </div>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default RestaurantCard;
