import '../css/styles.css';
import PicsApiService from './api-pixabey';
import Notiflix from 'notiflix';

const refs = {
  formEl: document.querySelector('.js-search-form'),
  galleryEl: document.querySelector('.gallery'),
  buttonLoadMoreEl: document.querySelector('.load-more'),
};

const picsApiService = new PicsApiService();

refs.formEl.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  picsApiService.query = e.target.elements['searchQuery'].value.trim();

  if (picsApiService.query === '') {
    refs.buttonLoadMoreEl.classList.add('is-hidden');
    return;
  }

  try {
    const data = await picsApiService.fetchPhotos();
    if (!data.hits.length) {
      refs.buttonLoadMoreEl.classList.add('is-hidden');
      return;
    }
    renderGalleryMarkup(images);
    refs.buttonLoadMoreEl.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
  }
}

function renderGalleryMarkup(images) {
  const galleryMarkup = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <div class="photo-card">
        <a class='gallery-item' href='${largeImageURL}'>
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>
        `;
    })
    .join('');
  refs.galleryEl.innerHTML = galleryMarkup;
}
