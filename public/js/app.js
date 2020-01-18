var newArticles = $("#newArticles");
var clearArticles = $("#clearArticles");
$(document).ready(function () {
    console.log("hello world");
    $(document).on("click", "#newArticles", function () {
        event.preventDefault();
        window.location.replace("/articles");
    })
    $(document).on("click", "#clearArticles", function() {
        console.log("click")
        event.preventDefault();
        window.location.replace("/");
    })
    .catch(function(err) {
        console.log(err)
    });
})