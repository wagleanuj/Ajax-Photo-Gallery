var counter = 0;
/*
 This method is called  while loading the page first and
 from different buttons like next , prev and sent

 next button requests for next image and comments
 prev button requests for previous image and comments
 comment button requests to post comment

 loadAll(0) is called while loading the page
 loadAll(1) is called when next button is pressed
 loadAll(2) is called when prev button is pressed
 loadAll(3) is called when comment button is pressed

 */
function loadAll(loadedFrom) {
    var once = false;
    var commentBox = document.getElementById('commentText');
//if loadedFrom is 0, it was loaded while loading the page, so set the counter to 0
    if (loadedFrom == 0) {
        counter = 0;
    }

    //if loadedFrom is 1, it was sent from next button, so increase the counter
    if (loadedFrom == 1) {
        counter = counter + 1;
    }
    //if loadedFrom is 2, it was sent from prev button, so decrease the counter
    else if (loadedFrom == 2) {
        counter = counter - 1;
    }

    //url that ajax will request to
    var url = "getImages.php?";
    //adding the id of the picture to be requested in the query
    var query = "id=" + counter;

    //if loadedFrom is 3, it was sent from the comment form, so
    //add the comment in the query by encoding it.
    if (loadedFrom == 3) {
        var comment = commentBox.value;
        query += "&comment=" + encodeURIComponent(comment);
    }
    // get an AJAX object
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200 || xhr.status == 400) {
                console.log(query);// for debugging use
                var response = xhr.responseText;
                console.log(response);//for debugging use
                var obj = JSON.parse(response);
                console.log(obj);//for debugging use
                //send the json object to the function renderHTMl()
                // to update the picture and comment field
                renderHTML(obj);
            }
            //if the status is not 200 or 400
            else {
                alert("unknown error");

            }

        }
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(query);// send the query to url
}


// this function takes the json parsed object and updates the comment and picture field with data
function renderHTML(indata) {
    var imageContainer = document.getElementById("imageField");
    var commentContainer = document.getElementById("comment");
    commentContainer.innerHTML = "";
    imageContainer.innerHTML = "<img src=img/" + indata['url'] + ">";
    var HTMLstring = "";
    //going through the json array to get all the comments in the comment container
    for (i = 0; i < indata["comments"].length; i++) {

        HTMLstring += "<p><b>" + indata['comments'][i] + "</b></p>";
    }
    commentContainer.insertAdjacentHTML('beforeend', HTMLstring);

}
//load the first image and its comment while loading the page
loadAll(0);
