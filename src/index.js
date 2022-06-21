import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const API_KEY = '28144653-5088632044d19e3dab312bf72';
const API_URL = "https://pixabay.com/api/";


const refs = {
    searchForm: document.querySelector('.search-form'),
    btnSubmit: document.querySelector('.submit'),
    btnLoadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
}


refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);


let searchQuery = '';
let page = 1;
refs.btnLoadMore.style.display = 'none';
let total = 0;
let totalHits = 0;

async function getImage(searchQuery) {
    try {
        const response = await axios.get(`${API_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
        );
        total += response.data.hits.length;
        totalHits = response.data.totalHits;
        if (totalHits < 1) {
            return onError()
            }
            return response.data;
        } catch (error) {
            console.log(error);
        }
        // console.log(result)
    }

function onSearch(event) {
        event.preventDefault();
    
        searchQuery = event.currentTarget.elements.searchQuery.value;
        const url = `${API_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
        console.log(url);

        if (onSearch !== '') {
            page = 1;
            onLoadMore();
        }
    }

    function onError(error) {
        error = Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }

    function onLoadMore() {
        refs.btnLoadMore.style.display = 'none';
        getImage(searchQuery).then(data => {
            renderCardImage(data.hits);
            refs.btnLoadMore.style.display = 'block';
            if (page >= 2) {
                console.log(page);
                Notify.success(`Hooray! We found ${data.totalHits} images.`);
            } else if (total >= totalHits) {
                Notify.warning(
                    'We`re sorry, but you`ve reached the end of search results.'
                );
                refs.btnLoadMore.style.display = 'none';
            }
        });
        page += 1;
    }

    function renderCardImage(img) {
        refs.gallery.innerHTML = '';
        const createMarkup = img
            .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
                return `
        <div class="photo-card">
            <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags} " loading="lazy" /></a>
            <div class="info">
                <div class="info-wrap">
                    <p class="info-item">
                    <b>Likes</b>
                    <br>${likes}</br>
                    </p>
                </div>
                
                <div class="info-wrap">
                    <p class="info-item">
                    <b>Views</b>
                    <br>${views}</br>
                    </p>
                </div>
                
                <div class="info-wrap">
                    <p class="info-item">
                    <b>Comments</b>
                    <br>${comments}</br>
                    </p>
                </div>
                
                <div class="info-wrap">
                    <p class="info-item">
                    <b>Downloads</b>
                    <br>${downloads}</br>
                    </p>
                </div>
                
            </div>
        </div>`;
            }).join('');
        refs.gallery.insertAdjacentHTML('beforeend', createMarkup);
        const lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionPosition: 'bottom', captionDelay: 250,
});
console.log(lightbox);
    }

