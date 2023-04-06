import PicsApiService from './api-pixabey';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  buttonLoadMoreEl: document.querySelector('.load-more'),
  buttonSearch: document.querySelector('.search-button'),
};

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionDelay: 250,
});

refs.buttonLoadMoreEl.classList.add('is-hidden');

const picsApiService = new PicsApiService();

refs.formEl.addEventListener('submit', onSearch);
refs.buttonLoadMoreEl.addEventListener('click', buttonLoadMore);

async function onSearch(e) {
  refs.buttonLoadMoreEl.classList.add('is-hidden');
  e.preventDefault();
  galleryElClear();

  picsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  picsApiService.resetPage();
  if (!picsApiService.query) {
    refs.buttonLoadMoreEl.classList.add('is-hidden');
    Notiflix.Notify.warning('Please, fill the main field');
    return;
  }

  try {
    const images = await picsApiService.fetchPics();
    if (!images.hits.length) {
      refs.buttonLoadMoreEl.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    // console.log(images);
    renderGalleryMarkup(images.hits);
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
    if (refs.galleryEl.childElementCount >= images.totalHits) {
      refs.buttonLoadMoreEl.classList.add('is-hidden');
      return;
    }
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
          <a href='${largeImageURL}'>
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
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
  refs.galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
  lightbox.refresh();
  refs.buttonLoadMoreEl.classList.remove('is-hidden');
}

function galleryElClear() {
  refs.galleryEl.innerHTML = '';
}

async function buttonLoadMore() {
  picsApiService.incrementPage();
  try {
    const images = await picsApiService.fetchPics();
    // console.log(images);
    renderGalleryMarkup(images.hits);

    //   2 option how to do
    // let total = 0;
    // for (let i = 0; i < images.totalHits; i += 40) {
    //   if ((total += i >= images.totalHits)) {
    //     Notiflix.Notify.failure(
    //       "We're sorry, but you've reached the end of search results."
    //     );
    //     refs.buttonLoadMoreEl.classList.add('is-hidden');
    //     return;
    //   }
    // }

    if (refs.galleryEl.childElementCount >= images.totalHits) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      refs.buttonLoadMoreEl.classList.add('is-hidden');
      return;
    }
  } catch (error) {
    console.log(error);
  }
}
