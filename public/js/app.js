$(document).ready(function () {
    $('.modal').modal();
    console.log("hello world");
    let lastClicked;
    $(document).on("click", "#newArticles", function () {
        window.location.replace("/scrape");
    })
    $(document).on("click", "#clearArticles", function () {
        window.location.replace("/clear");
    })
    $(document).on("click", ".saveArt", function (event) {
        event.preventDefault()
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
                $("#li-" + docId).remove();
            }
        });
    })
    $(".commentNotes").on("click", function () {
        lastClicked = $(this).attr("data-id")
        console.log("I'm in!!", this)
        $('#modal1').modal('open');
    })
    $(document).on('click', "#submit", function (event) {
        event.preventDefault();
        console.log("1", lastClicked)
        $.ajax({
            type: "POST",
            url: "/notes/" + lastClicked,
            datatype: "json",
            data: {
                note: $("#blog").val()
            },
            success: function (data) {
                console.log("data1", data)
                location.reload();
            }
        })
    })
    $(document).on("click", "#homeNav", function (req, res) {
        window.location.replace('/')
    })
    $(document).on("click", "#saveNav", function (req, res) {
        window.location.replace('/saved')
    })
    $(".remove").on("click", function () {
        let lastClicked = $(this);
        console.log("I'm in!!", lastClicked)
        $.ajax({
            type: "GET",
            url:"/delete/"+lastClicked.attr("data-id"),
            success: function (data) {
                console.log("data", data)
                location.reload();
            }
        });
    });

})