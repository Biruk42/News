let currentPage = 1;
let currentCategory = "general"; // Default category
let currentKeyword = null;
let isLoading = false;
let lastArticleCount = 0;

function fetchNews(isSearching) {
  if (isLoading) return;
  isLoading = true;
  let url = `http://localhost:3000/news?page=${currentPage}`;

  if (isSearching) {
    const keyword = document.getElementById("searchKeyword").value;
    url += `&keyword=${keyword}`;
  } else {
    const category =
      currentCategory || document.getElementById("category").value;
    url += `&category=${category}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const newsContainer = document.getElementById("newsContainer");
      if (currentPage === 1) {
        newsContainer.innerHTML = "";
      }
      const articleWithImage = data.articles.filter(
        (article) => article.urlToImage
      );
      if (
        articleWithImage.length === 0 ||
        articleWithImage.length === lastArticleCount
      ) {
        displayNoMoreNews();
        isLoading = false;
        return;
      }
      lastArticleCount = articleWithImage.length;
      articleWithImage.forEach((article) => {
        const newsItem = `
            <div class="newsItem">
                <div class="newsImage">
                    <img src="${article.urlToImage}" alt="${article.title}">                    
                </div>
                <div class="newsContent">
                    <div class="info">
                        <h5>${article.source.name}</h5>
                        <span>|</span>
                        <h5>${article.publishedAt}</h5>
                    </div>
                    <h2>${article.title}</h2>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read More</a>
                </div>
            </div>
        `;
        newsContainer.innerHTML += newsItem;
      });
      currentPage++;
      isLoading = false;
    })
    .catch((error) => {
      console.log("There was an error fetching the news:", error);
      isLoading = false;
    });
}

function displayNoMoreNews() {
  const newsContainer = document.getElementById("newsContainer");
  newsContainer.innerHTML += "<p>No more news to load</p>";
}

window.onscroll = function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    if (currentKeyword) {
      fetchNews(true);
    } else {
      fetchNews(false);
    }
  }
};

document.getElementById("searchKeyword").addEventListener("input", function () {
  currentPage = 1;
  currentCategory = null;
  currentKeyword = this.value;
  lastArticleCount = 0; // Reset lastArticleCount when changing the keyword
});

document.getElementById("fetchCategory").addEventListener("click", function () {
  currentPage = 1;
  currentKeyword = null;
  currentCategory = document.getElementById("category").value;
  lastArticleCount = 0; // Reset lastArticleCount when changing the category
  fetchNews(false);
});

// Fetch news when the page loads
document.addEventListener("DOMContentLoaded", function () {
  fetchNews(false);
});
