import { useState } from "react";

export function useGeoLocation(defaultLocation = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(defaultLocation);
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Geolocation is not supported by your browser");
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }
  return { isLoading, error, location, getPosition };
}
