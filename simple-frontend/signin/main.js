var host = "http://127.0.0.1:3000";

async function signin()
{
    var account = document.getElementById("account").value;
    var password = document.getElementById("password").value;
    var body = {
        account: account,
        password: password
    };

    // JQuery AJAX
    // $.ajax(`${host}/signin`, {
    //     type: 'POST',
    //     data: {
    //         account: account,
    //         password: password
    //     },
    //     success: (data, status, xhr) => {
    //         console.log(status, data)
    //     },
    //     error: (jqXhr, textStatus, errorMessage) => {
    //         console.log(errorMessage);
    //     }
    // });

    // Fetch
    let res = await fetch(`${host}/signin`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(body)
    });
    res = await res.json();

    alert(res.message);

    // Store token in localstorage
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);

    // navigate page
    window.location.href = `http://127.0.0.1:5500/simple-frontend/protected/`;
}