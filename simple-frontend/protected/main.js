var host = "http://127.0.0.1:3000";

window.onload = async () => {
    var accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);

    var res = await fetch(`${host}/protected/token`, {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        method: 'GET',
    });
    res = await res.json();

    if(res.isSuccess)
    {
        alert("You are successfully authenticated!");
    }else{
        alert("Unauthenticated!");
        window.location.href = 'http://127.0.0.1:5500/simple-frontend/signin/';
    }
}