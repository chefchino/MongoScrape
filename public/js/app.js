
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
                console.log("saved", data)
                // $(".saveArt").html("<button class='comment' data-id'" +data._id+"'>Comment</button")
                $("#li-" + docId).remove();
                // location.reload();
            }


        });

    })
    $(".commentNotes").on("click", function () {
        lastClicked = $(this).attr("data-id")
        console.log("I'm in!!", lastClicked)
        $('#modal1').modal('open');
    })

    $(document).on("click", "#homeNav", function (req, res) {
        // event.preventDefault();
        window.location.replace('/')
    })
    $(document).on("click", "#saveNav", function (req, res) {
        // event.preventDefault();
        window.location.replace('/saved')
    })
    $(document).on('click', "#submit", function (event) {
        event.preventDefault();
        console.log("1", lastClicked)
        $.ajax({
            type: "POST",
            url: "/notes/" + lastClicked,
            datatype: "json",
            data: {
                comment: $("#blog").val()
            },
            success: function (data) {
                console.log("data1", data)
            }
        })

    })



})