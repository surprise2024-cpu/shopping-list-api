import { Song } from '../models/item';

// In-memory storage for songs
let songs: Song[] = []

// Variable to keep track of the current ID for new songs
let currentId = 0;

// Function to retrieve all songs
export const getAllSongs = (): Song[] => {
    return songs;
}

// Function to retrieve a song by its ID
export const getSongById = (id: number): Song | undefined => {
    const song = songs.find((song) => song.id === id);
    return song;
}

// Function to add a new song
export const addSong = (title: string, artist: string, duration: number ): Song => {
    const newSong: Song = {
        id: currentId++,
        title,
        artist, 
        duration
    }

    songs.push(newSong);

    return newSong;
}


