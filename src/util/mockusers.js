const users = [
    {
        "username": "bobesponja",
        "avatar": "https://static.wikia.nocookie.net/wikiesponja/images/f/f0/150px-SpongeBob_SquarePants.png"
    },
    {
        "username": "sirigueijo",
        "avatar": "https://static.wikia.nocookie.net/wikiesponja/images/2/2d/Sr_Sirigueijo_de_Bob_Esponja.png"
    },
    {
        "username": "patrick",
        "avatar": "https://static.wikia.nocookie.net/wikiesponja/images/d/d8/Patrick_Estrela_de_Bob_Esponja.png"
    },
    {
        "username": "plankton",
        "avatar": "https://static.wikia.nocookie.net/wikiesponja/images/6/61/Plankton_de_Bob_Esponja.png"
    },
    {
        "username": "gary",
        "avatar": "https://static.wikia.nocookie.net/wikiesponja/images/e/e0/Gary_de_Bob_Esponja.png"
    }
];

for (let i = 0; i < users.length; i++) {
    const user = users[i];
    fetch('https://tweetero.onrender.com/sign-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}
