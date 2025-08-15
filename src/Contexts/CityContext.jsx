import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CitiesContext = createContext();
const URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  errorMessage: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "Loading":
      return { ...state, isLoading: true };
    case "Cities/Loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "City/Loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "City/Create":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "City/Delete":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id != action.payload),
      };
    case "AnyError":
      return { ...state, error: action.payload };
    default:
      throw new Error("Invalid action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "Loading" });
      try {
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        dispatch({ type: "Cities/Loaded", payload: data });
      } catch {
        dispatch({ type: "AnyError", payload: "Failed to fetch Cities data" });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(currentCity.id === id)) return;
      dispatch({ type: "Loading" });
      try {
        const res = await fetch(`${URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "City/Loaded", payload: data });
      } catch {
        dispatch({ type: "AnyError", payload: "Failed to fetch City data" });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "Loading" });
    try {
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      dispatch({ type: "City/Create", payload: data });
    } catch {
      dispatch({ type: "AnyError", payload: "Failed to create City data" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "Loading" });
    try {
      await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({
        type: "City/Delete",
        payload: id,
      });
    } catch {
      dispatch({ type: "AnyError", payload: "Failed to delete City data" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
