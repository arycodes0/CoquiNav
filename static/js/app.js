// File contains all main app scripts for CoquiNav website
import { initializeApp } from "firebase/app";
import firebaseConfig, { database } from './firebase-config.js';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore"; 
import { getUserById } from "./auth.js";

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Home Page
let map;
let userMarker;

export async function initMap() {
  console.log("initMap called");

  // Default position if geolocation is not available
  const defaultPosition = { lat: 18.2208, lng: -66.5901 };

  // Request needed libraries
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // Initialize the map at the default position
  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: defaultPosition,
    mapId: "c0e8940d67cdd1a",
  });

  // Try to get the user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Center the map on the user's location
        map.setCenter(userPosition);

        // Add a marker at the user's location
        userMarker = new AdvancedMarkerElement({
          position: userPosition,
          map: map,
          title: "You are here",
        });
      },
      () => {
        console.warn("Geolocation permission denied or error retrieving location.");
      }
    );
  } else {
    console.warn("Geolocation is not supported by this browser.");
  }
  try {
    await createEventMarkers();
} catch (error) {
    console.error("Error creating event markers:", error);
}
}


// Function to get the current location of the user
export async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => reject(error)
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

// Convert latitude and longitude to an address
export async function getAddressFromCoords(latitude, longitude) {
    const geocoder = new google.maps.Geocoder();
    const location = { lat: latitude, lng: longitude };

    return new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (results, status) => {
            if (status === "OK" && results[0]) {
                resolve(results[0].formatted_address);
            } else {
                reject(new Error("Unable to retrieve address."));
            }
        });
    });
}

async function geocodeAddress(address) {
    const response = await google.maps.GeocodingLibrary;
    const data = await response.json();
    if (data.status === "OK") {
        return data.results[0].geometry.location;
    } else {
        console.error("Geocode was not successful for the following reason:", data.status);
        return null;
    }
}

// Function to create an event
export async function createEvent(userId, eventData) {
    try {
        // Check if address needs geocoding
        if (eventData.address) {
            const location = await geocodeAddress(eventData.address);
            if (location) {
                eventData.lat = location.lat;
                eventData.lng = location.lng;
            } else {
                throw new Error("Failed to geocode address.");
            }
        }
        
        // Add a new document to the events collection with event details
        const docRef = await addDoc(collection(database, 'events'), {
            ...eventData,
            userId: userId
        });
        
        console.log("Event created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
}

// Function to get all events with host information
export async function getAllEvents() {
    try {
        const eventsQuery = query(collection(database, "events"));
        const querySnapshot = await getDocs(eventsQuery);
        
        const events = [];
        for (const doc of querySnapshot.docs) {
            const eventData = { id: doc.id, ...doc.data() };
            const userInfo = await getUserById(eventData.userId);
            
            if (userInfo) {
                eventData.hostName = `${userInfo.firstName} ${userInfo.lastName}`;
            } else {
                eventData.hostName = "Unknown Host";
            }

            events.push(eventData);
        }
        return events;
    } catch (error) {
        console.error("Error retrieving events:", error);
        throw error;
    }
}

// Function to fetch event locations with coordinates from all events
async function fetchEventLocations() {
    try {
        const events = await getAllEvents();

        // Map events to only include events with valid latitude and longitude
        const eventLocations = events
            .map(event => {
                // Check if the event has both latitude and longitude under `coordinates`
                if (event.coordinates && event.coordinates.latitude && event.coordinates.longitude) {
                    return { 
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        hostName: event.hostName,
                        coordinates: { 
                            lat: event.coordinates.latitude, 
                            lng: event.coordinates.longitude 
                        }
                    };
                }
                console.warn(`Missing coordinates for event: ${event.title}`);
                return null;
            })
            .filter(Boolean);

        return eventLocations;
    } catch (error) {
        console.error("Error fetching event locations:", error);
        throw error;
    }
}

// Function to create markers for each event on the map
async function createEventMarkers() {
    const events = await fetchEventLocations();

    events.forEach(event => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: event.coordinates,
            map: map,
            title: event.title,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="info-box">
                    <h3 class="info-box-title">${event.title}</h3>
                    <p class="info-box-description">${event.description}</p>
                    <p class="info-box-host"><strong>Host:</strong> ${event.hostName}</p>
                </div>
            `,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
}
