const CLIENT_ID = '230339971942-ujtk685hh6rov6ba64i9s90pco9gquu6.apps.googleusercontent.com';
const CURRENT_LOCATION = window.location.origin + window.location.pathname;
let params = {};
let access_token = undefined;

// Parse query string to see if page request is coming from OAuth 2.0 server.
function parse_query_string() {
    const fragmentString = location.hash.substring(1);
    let regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
        access_token = params['access_token'];
        return true;
    }
    return false;
}



function handelLoginState(state) {
    const authStatus = document.getElementById('authStatus');
    const authButton = document.getElementById('authButton');
    const removeAuthButton = document.getElementById('removeAuthButton');
    const postCommentButton = document.getElementById('postCommentButton');

    if (state) {
        authStatus.textContent = 'Authorized!';
        authStatus.style.color = 'green';
        
        authButton.textContent = 'Reauthorize';
        removeAuthButton.removeAttribute('hidden');

        postCommentButton.removeAttribute('disabled');
    } else {
        authStatus.textContent = 'Not Authorized!';
        authStatus.style.color = 'red';
        
        authButton.textContent = 'Authorize';
        removeAuthButton.setAttribute('hidden', '');

        postCommentButton.setAttribute('disabled', '');
    }
}


function load() {
    let loginState = parse_query_string();
    console.log(`Login State: ${loginState}`);
    handelLoginState(loginState);
}

document.onload = load()

// If there's an access token, try an API request.
// Otherwise, start OAuth 2.0 flow.
function trySampleRequest() {
    var params = JSON.parse(localStorage.getItem('oauth2-test-params'));

    if (params && params['access_token']) {
        var xhr = new XMLHttpRequest();
        xhr.open(
            'GET',
            'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest' +
            'access_token=' + params['access_token']
        );
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.response);
            } else if (xhr.readyState === 4 && xhr.status === 401) {
                // Token invalid, so prompt for user permission.
                oauth2SignIn();
            }
        };
        xhr.send(null);
    } else {
        oauth2SignIn();
    }
}


// Create form to request access token from Google's OAuth 2.0 server.
function oauth2SignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create element to open OAuth 2.0 endpoint in new window.
    const form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = {
        'client_id': CLIENT_ID,
        'redirect_uri': CURRENT_LOCATION,
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
        'response_type': 'token'
    };

    // Add form parameters as hidden input values.
    for (let p in params) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

function extractVideoId(input) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = input.match(regex);

    // Check if input matches the url case
    if (match && match[1] && match[1].length === 11) {
        return match[1];
    // Check if input matches raw ID case
    } else if (input.length === 11 && /^[a-zA-Z0-9_-]+$/.test(input)) {
        return input;
    } else {
        return false;
    }
}

function postCommentHandel() {
    let videoInput = document.getElementById('videoInput').value;
    let commentInput = document.getElementById('commentInput').value;
    // Clear the previous status
    setCommentPostStatus();

    // Extract video ID from the input
    let videoId = extractVideoId(videoInput);

    // Check if video ID and Comment is valid
    if (!videoId) {
        setCommentPostStatus('Invalid video input. Please enter a valid video ID or link.', false);
        return 
    }
    if (commentInput.length == 0) {
        setCommentPostStatus('Your comment is empty!', false);
        return
    }

    postComment(videoId, commentInput, access_token);
}

function setCommentPostStatus(message='', status=false) {
    console.log('test')
    const commentPostStatus = document.getElementById('commentPostStatus')

    commentPostStatus.innerHTML = message;
    // Set the text color to green if status is true, otherwise set to red
    let color = 'red'
    if (status) {
        color = 'green'
    }
    commentPostStatus.style.color = color;
}

function postComment(videoId, commentText, accessToken) {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            snippet: {
                videoId: videoId,
                topLevelComment: {
                    snippet: {
                        textOriginal: commentText,
                    },
                },
            },
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw { error: errorData.error};
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Comment posted successfully:', data);
        console.log(data)
        
        setCommentPostStatus('Comment Posted Successfully', true)
    })
    .catch(error => {
        let message = error.error.message
        let code = error.error.code
        console.error('Error posting comment:', `${message}\nStatus: ${code}`);
        
        setCommentPostStatus(message, false)
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Get the elements
    var videoInput = document.getElementById('videoInput');
    var commentInput = document.getElementById('commentInput');
    var commentPostStatus = document.getElementById('commentPostStatus');

    // Add event listeners for input changes
    videoInput.addEventListener('input', clearCommentStatus);
    commentInput.addEventListener('input', clearCommentStatus);

    // Function to clear commentPostStatus
    function clearCommentStatus() {
        commentPostStatus.textContent = ''; // Clear the content
    }
});

