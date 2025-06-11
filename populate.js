const list = [
    {"title": "Lali", "todo": "testing the system", "userId": "123412341231"},
    {"title": "Alexa", "todo": "installing drivers", "userId": "123412341232"},
    {"title": "anshul", "todo": "upgrading RAM", "userId": "123412341233"},
    {"title": "surekha", "todo": "cleaning fan", "userId": "123412341234"},
    {"title": "swaroop", "todo": "setting up OS", "userId": "123412341235"},
    {"title": "rohan", "todo": "fixing WiFi issue", "userId": "123412341236"},
];

const populate = async () => {
    for (let i of list) {
        await fetch('http://localhost:3000/api/', {
            method: 'POST',
            headers: {
                'Content-type' : "application/json"
            },
            body: JSON.stringify(i)
        })
    }
}

populate();