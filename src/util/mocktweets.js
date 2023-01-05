const users = [
    "bobesponja",
    "sirigueijo",
    "patrick",
    "plankton",
    "gary"
];

const sendTweet = async (username) => {
    for (let i = 0; i < 15; i++) {
        const tweet = {
            username: username,
            tweet: `eu amo o ${username} ${i + 1}!`
        };
        const response = await fetch('https://tweetero.onrender.com/tweets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tweet)
        });
        console.log(`username: ${username}, response.status: ${response.status}`);
    }
};

const sendTweets = async () => {
    for (let i = 0; i < users.length; i++) {
        const username = users[i];
        await sendTweet(username);
    }
}

sendTweets();