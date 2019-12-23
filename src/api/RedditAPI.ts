import localforage from "localforage";
import {setup} from "axios-cache-adapter";

const cacheStore = localforage.createInstance({
    name: "pokemon_go_friends_reddit",
});

const api = setup({
    baseURL: "https://www.reddit.com",
    cache: {
        maxAge: 15 * 60 * 1000,
        readHeaders: false,
        store: cacheStore,
        exclude: {query: false},
    },
});

export type Sort = "new" | "hot";

export function getSubreddit(sort: Sort) {
    return api.get(`/r/PokemonGoFriends/${sort}.json?limit=100`);
}
