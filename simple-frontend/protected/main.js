var host = "http://127.0.0.1:3000";

window.onload = async () => {
    var accessToken = localStorage.getItem('accessToken');

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

        if(res.code == 403)
        {
            // refresh
            console.log("Refresh token: ");
            var refreshToken = localStorage.getItem("refreshToken");
            var res = await fetch(`${host}/refresh`, {
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                }),
                method: 'POST',
            });
            res = await res.json();

            console.log(res);

            if(res.isSuccess)
            {
                alert("Refresh token successfully!");
                localStorage.setItem("accessToken", res.data.newAccessToken);

            }else{
                alert("Refresh token failed!");
                window.location.href = 'http://127.0.0.1:5500/simple-frontend/signin/';
            }

        }else{
            // redirect to signin
            window.location.href = 'http://127.0.0.1:5500/simple-frontend/signin/';
        }
    }
}