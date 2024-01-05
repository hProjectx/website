// OAuth configuration
const CLIENT_ID = '230339971942-ujtk685hh6rov6ba64i9s90pco9gquu6.apps.googleusercontent.com';
// const API_KEY = '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';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

// Function to handle the initialization of the API
function initClient() {
    gapi.client.init({
        // apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
    }).then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        
        // // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        
    })
}

// Function to update the sign-in status
function updateSigninStatus(isSignedIn) {
    console.log('Status' + isSignedIn)
    // Your logic for handling sign-in status changes can go here
}

// Function to start the OAuth process
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Function to sign out the user
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Function to post a comment
function postComment() {
    var videoInput = document.getElementById('videoInput').value;
    var commentInput = document.getElementById('commentInput').value;

    // Extract video ID from the input
    var videoId = extractVideoId(videoInput);

    if (videoId) {
        // Use the API to post the comment (similar to the previous example)
        // ...

    } else {
        alert('Invalid video input. Please enter a valid video ID or link.');
    }
}

// Function to update the sign-in status
function updateSigninStatus(isSignedIn) {
    var authButton = document.getElementById('authButton');
    var postCommentButton = document.getElementById('postCommentButton');

    if (isSignedIn) {
        authButton.style.display = 'none';
        postCommentButton.disabled = false;
    } else {
        authButton.style.display = 'block';
        postCommentButton.disabled = true;
    }
}

// Function to post a comment
function postComment() {
    var videoInput = document.getElementById('videoInput').value;
    var commentInput = document.getElementById('commentInput').value;

    // Extract video ID from the input
    var videoId = extractVideoId(videoInput);

    if (videoId) {
        var request = gapi.client.youtube.commentThreads.insert({
            'part': 'snippet',
            'resource': {
                'snippet': {
                    'videoId': videoId,
                    'topLevelComment': {
                        'snippet': {
                            'textOriginal': commentInput,
                        },
                    },
                },
            },
        });

        request.execute(function(response) {
            console.log(response);
            // Handle the response here
        });
    } else {
        alert('Invalid video input. Please enter a valid video ID or link.');
    }
}


// Function to extract video ID from input
function extractVideoId(input) {
    var match;

    // Check if the input is a long YouTube URL
    match = input.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

    if (match && match[1]) {
        return match[1];
    }

    // Check if the input is a short YouTube URL
    match = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);

    if (match && match[1]) {
        return match[1];
    }

    // If no match is found, assume that the input is already a valid video ID
    return input;
}



// Load the API and OAuth client asynchronously
gapi.load('client:auth2', initClient);
