const list = [
    {"title": "HP", "todo": "testing the system", "completed": true},
    {"title": "Dell", "todo": "installing drivers", "completed": false},
    {"title": "Lenovo", "todo": "upgrading RAM", "completed": true},
    {"title": "Asus", "todo": "cleaning fan", "completed": false},
    {"title": "Acer", "todo": "setting up OS", "completed": true},
    {"title": "Apple", "todo": "fixing WiFi issue", "completed": false},
    {"title": "MSI", "todo": "calibrating display", "completed": true},
    {"title": "Samsung", "todo": "recovering data", "completed": true},
    {"title": "Sony", "todo": "repairing keyboard", "completed": false},
    {"title": "Toshiba", "todo": "updating antivirus", "completed": true},
    {"title": "LG", "todo": "running diagnostics", "completed": false},
    {"title": "Microsoft", "todo": "replacing hard drive", "completed": true},
    {"title": "Google", "todo": "checking battery health", "completed": false},
    {"title": "Razer", "todo": "optimizing system", "completed": true},
    {"title": "Alienware", "todo": "installing drivers", "completed": false},
    {"title": "HP", "todo": "calibrating display", "completed": true},
    {"title": "Dell", "todo": "updating firmware", "completed": true},
    {"title": "Lenovo", "todo": "recovering data", "completed": false},
    {"title": "Asus", "todo": "testing the system", "completed": true},
    {"title": "Acer", "todo": "fixing WiFi issue", "completed": false},
    {"title": "Apple", "todo": "repairing keyboard", "completed": true},
    {"title": "MSI", "todo": "upgrading RAM", "completed": false},
    {"title": "Samsung", "todo": "cleaning fan", "completed": true},
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