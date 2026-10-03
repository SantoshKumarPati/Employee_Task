const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const username =
        document.querySelector("#username")
        .value
        .trim();

    const password =
        document.querySelector("#password")
        .value;

    const message =
        document.querySelector("#loginMessage");

    try {

        const response =
            await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })

            });

        if (!response.ok) {

            message.textContent =
                "Invalid username or password";

            return;
        }

        window.location.href = "/index.html";

    } catch (error) {

        message.textContent =
            "Unable to connect to server";

        console.log(error);
    }

});