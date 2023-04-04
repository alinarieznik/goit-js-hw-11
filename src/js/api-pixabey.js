import axios from 'axios';
console.log(axios);

const API_KEY = '35068014-d2964fc8ed114a598c6b7cf51';
const BASE_URL = 'https://pixabay.com/api/';

export default class PicsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPics() {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          key: `${API_KEY}`,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: 40,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
