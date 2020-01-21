
$(document).ready(function () {
    console.log("hello world");
    $(document).on("click", "#newArticles", function () {
        window.location.replace("/scrape");
    })
    $(document).on("click", "#clearArticles", function () {
        window.location.replace("/clear");
    })
    $(".saveArt").on("click", function () {

        var id = $(this);
        var docId = id.attr("data-id")
        console.log("dopcId", docId)
        $.ajax({
            type: "POST",
            url: "/update/" + docId,
            datatype: "json",
            data: {
                saved: true
            },
            success: function (data) {
                console.log("saved", data)
                $("#li-"+docId).remove();
                // location.reload();
            }


        });
        $(document).on("click", "#homeNav", function (req, res) {
            // event.preventDefault();
            window.location.replace('/')
        })
        $(document).on("click", "#saveNav", function (req, res) {
            // event.preventDefault();
           window.location.replace('/saved')
        })

    })
})