import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "./config";

const categories = [
  { title: "Watching", id: "CURRENT" },
  { title: "To Watch", id: "PLANNING" },
  { title: "Watched", id: "COMPLETED" },
  { title: "On Hold", id: "PAUSED" },
  { title: "Dropped", id: "DROPPED" },
];


export const addMovie = async (uid, movie, isAuthenticated, status) => {
  if (!db) {
    toast.error("Firebase is not configured for this deployment. Saving is disabled.");
    throw new Error("Firebase disabled");
  }

  if (!isAuthenticated) {
    toast.error("❌ You lack the required authentication! Log in to inscribe your saga.");
    throw new Error("User is not authenticated. Please log in to add a post.");
  }

  if (!uid || !movie || !movie.id) {
    toast.warn("⚠️ An unknown force prevents the movie from being recorded! Check your data.");
    throw new Error("Invalid movie data or missing user ID.");
  }

  const category = categories.find((c) => c.id === status);
  if (!category) {
    toast.warn("⚠️ Invalid status selected! Please choose a valid category.");
    throw new Error("Invalid status category.");
  }

  const existingMovie = await findMovieFromCollection(uid, movie.id);
  if (existingMovie) {
    await deleteDoc(doc(db, "savedMovies", uid, existingMovie.status, movie.id.toString()));
  }

  const movieDataSave = {
    uid,
    ...movie,
    status: category.id,
    createdAt: serverTimestamp(),
  };

  return toast.promise(
    setDoc(doc(db, "savedMovies", uid, category.id, movie.id.toString()), movieDataSave),
    {
      pending: "⏳ Adding movie to your collection...",
      success: `🎉 The movie has been added to your '${category.title}' list!`,
      error: "🔥 A dark force has intervened! The movie could not be saved."
    }
  );
};


export const findMovieFromCollection = async (uid, movieId) => {
  if (!db) {
    // No DB configured — return null as nothing is stored
    return null;
  }

  if (!uid || !movieId) {
    throw new Error("User ID and Movie ID are required to search.");
  }

  const moviePromises = categories.map(async (category) => {
    const movieQuery = query(
      collection(db, "savedMovies", uid, category.id),
      where("id", "==", movieId)
    );
    const movieSnap = await getDocs(movieQuery);

    if (!movieSnap.empty) {
      return { status: category.id, data: movieSnap.docs[0].data() };
    }
    return null;
  });

  const results = await Promise.all(moviePromises);
  return results.find((result) => result !== null) || null;
}

export const getTotalMoviesCount = async (uid, getByStatus = false) => {
  if (!db) {
    // Return sensible defaults when DB unavailable
    return getByStatus ? { total: 0, breakdown: categories.map(c => ({ status: c.id, count: 0, movies: [] })) } : 0;
  }

  if (!uid) {
    throw new Error("User ID is required to fetch movie data.");
  }

  const counts = await Promise.all(
    categories.map(async (category) => {
      const collectionRef = collection(db, "savedMovies", uid, category.id);
      const movieSnap = await getDocs(collectionRef);
      return {
        status: category.id,
        count: movieSnap.size,
        movies: getByStatus ? movieSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) : []
      };
    })
  );

  const totalCount = counts.reduce((total, category) => total + category.count, 0);

  if (getByStatus) {
    return { total: totalCount, breakdown: counts };
  }

  return totalCount;
};




export const getMoviesByStatus = async (uid, status) => {
  if (!db) {
    return [];
  }

  if (!uid || !status) {
    throw new Error("User ID and status are required to fetch movies.");
  }

  const category = categories.find((c) => c.id === status);
  if (!category) {
    throw new Error("Invalid status category.");
  }

  const collectionRef = collection(db, "savedMovies", uid, category.id);
  const movieSnap = await getDocs(collectionRef);

  return movieSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

