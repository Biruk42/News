const API_KEY = "78f1eaf4faee496c96eb4e5d6589a470";
let currentPage = 1;
let currentCategory = null;
let currentKeyword = null;
let isLoading = false;
let lastArticleCount = 0;

function fetchNews(isSearching) {
  if (isLoading) return;
  isLoading = true;
  let url;
  if (isSearching) {
    const keyword = document.getElementById("searchKeyword").value;
    url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}&page=${currentPage}`;
  } else {
    const category =
      currentCategory || document.getElementById("category").value;
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}&page=${currentPage}`;
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
