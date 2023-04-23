var host = "http://127.0.0.1:3000";

async function signup()
{
    var account = document.getElementById("account").value;
    var password = document.getElementById("password").value;
    var name = document.getElementById("name").value;
    var gender = document.getElementById("gender").value;
    var age = document.getElementById("age").value;
    var role = document.getElementById("role").value;

    var body = {
        account: account,
        password: password,
        name: name,
        gender: gender,
        age: age,
        role: role
    };

    var res = await fetch(`${host}/signup`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(body)
    });
    res = await res.json();

    alert(res.message);
}