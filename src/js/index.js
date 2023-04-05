import PicsApiService from './api-pixabey';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  buttonLoadMoreEl: document.querySelector('.load-more'),
};

const picsApiService = new PicsApiService();

refs.formEl.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  galleryElClear();

  picsApiService.query = e.target.elements['searchQuery'].value.trim();

  try {
    const images = await picsApiService.fetchPics();
    if (images.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    // console.log(images);
    renderGalleryMarkup(images.hits);
  } catch (error) {
    console.log(error);
  }
}

function renderGalleryMarkup(images) {
  const galleryMarkup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
          <div class="photo-card">
          <a class='gallery-item' href='${largeImageURL}'>
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>
          `;
      }
    )
    .join('');
  refs.galleryEl.innerHTML = galleryMarkup;
}

function galleryElClear() {
  refs.galleryEl.innerHTML = '';
}
