function createBlogPost(title, date, info){

    var blogPostArgs = {
        postTitle: title,
        date: date,
        info: info
    };

    var blogPostHTML = Handlebars.templates.blogpost(blogPostArgs);

    return blogPostHTML;
}

function updateProgress (event) {
    if (event.lengthComputable) {
      var percentComplete = event.loaded / event.total;
      console.log(percentComplete, "this much")
    } else {
      console.log("WTF");
    }
}

function resetInputs(){
    var blogTitle = document.getElementById('blog-title-input').value = '';
    var blogBody = document.getElementById('blog-body-input').value = '';
    var blogDate = document.getElementById('blog-date-input').value = '';
}


function handleBlogAccept(){

    var blogTitle = document.getElementById('blog-title-input').value.trim();
    var blogBody = document.getElementById('blog-body-input').value.trim();
    var blogDate = document.getElementById('blog-date-input').value.trim();

    if(!blogTitle || !blogBody || !blogDate){
        alert("You must input all fields!");
    }
    else{
        var postRequest = new XMLHttpRequest();
        var postURL = '/blog';
        postRequest.open('post', postURL);
        console.log("== title:", blogTitle);
        console.log("== info:", blogBody);
        console.log("== date:", blogDate);

        var blogObj = {
            blogTitle: blogTitle,
            blogDate: blogDate,
            blogBody: blogBody
        };

        var requestBody = JSON.stringify(blogObj);

        postRequest.setRequestHeader('Content-Type', 'application/json');

        postRequest.addEventListener('load', function(event){
            if(event.target.status !== 200){
                alert("Error uploading blog post to DB: " + event.target.response);
            }
            else{
                var newBlogPost = createBlogPost(blogTitle, blogDate, blogBody);
                var postContainer = document.querySelector('.blog');

                postContainer.insertAdjacentHTML('beforeend', newBlogPost);
                resetInputs();
            }
        });
        
        postRequest.send(requestBody);
    }
}

window.addEventListener('DOMContentLoaded', function () {
    var blogCancelButton = document.getElementById('blog-cancel');
    var blogAcceptButton = document.getElementById('blog-accept');
    blogAcceptButton.addEventListener('click', handleBlogAccept);
    blogCancelButton.addEventListener('click', resetInputs);
});
