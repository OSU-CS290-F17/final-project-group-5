function createBlogPost(title, date, info){

    var blogPostArgs = {
        postTitle: title,
        date: date,
        info: info
    };

    var blogPostHTML = Handlebars.templates.blogpost(blogPostArgs);

    return blogPostHTML;
}


function resetInputs(){
    var blogTitle = document.getElementById('blog-title-input').value = '';
    var blogBody = document.getElementById('blog-body-input').value = '';
    var blogDate = document.getElementById('blog-date-input').value = '';
}

function handleDeletePost(event){
    var result = confirm("Want to delete this blog post?");
    if (result) { 
    var postToDelete = event.currentTarget.parentNode;
    
    var deleteRequest = new XMLHttpRequest();
    var deleteURL = '/blog';
    deleteRequest.open('DELETE', deleteURL);
    console.log(postToDelete.dataset.id);

    var delObj = {
        id: postToDelete.dataset.id
    };

    var requestBody = JSON.stringify(delObj);

    deleteRequest.setRequestHeader('Content-type', 'application/json');
    deleteRequest.addEventListener('load', function(event){
        if(event.target.status !== 200){
            alert("Error deleting blog post to DB: " + event.target.response);
        }
        else{
            var postContainer = postToDelete.parentNode;
            postContainer.removeChild(postToDelete);
            console.log("things happened");
        }
    });

    deleteRequest.send(requestBody);
    }
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

                postContainer.insertAdjacentHTML('afterbegin', newBlogPost);
                resetInputs();
            }
        });
        
        postRequest.send(requestBody);
    }
}

window.addEventListener('DOMContentLoaded', function () {
    var deleteButtons = document.getElementsByClassName('delete-blog-post');
    var blogCancelButton = document.getElementById('blog-cancel');
    var blogAcceptButton = document.getElementById('blog-accept');
    blogAcceptButton.addEventListener('click', handleBlogAccept);
    blogCancelButton.addEventListener('click', resetInputs);
    for (var i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', handleDeletePost);
    }
});
