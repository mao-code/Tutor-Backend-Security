var host = "http://127.0.0.1:3000";

window.onload = async () => {
    var accessToken = localStorage.getItem('accessToken');

    var res = await fetch(`${host}/protected/token/role`, {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        method: 'GET',
    });
    res = await res.json();

    if(res.isSuccess)
    {
        alert("Role Authenticated successfully!");
    }else{
        alert("Permission denied!");
        window.location.href = 'http://127.0.0.1:5500/simple-frontend/signin/';
    }
}