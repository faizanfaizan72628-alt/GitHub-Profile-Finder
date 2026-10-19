
const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const profile = document.getElementById("profile");

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (!username) {
        message.textContent = "Please enter a username.";
        return;
    }

    profile.classList.add("hidden");
    message.textContent = "Searching...";
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";

    try {
        const response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}`
        );

        if (response.status === 404) {
            throw new Error("GitHub username not found.");
        }

        if (!response.ok) {
            throw new Error(
                response.status === 403
                    ? "API rate limit reached. Try again later."
                    : "Unable to fetch profile. Please try again."
            );
        }

        const user = await response.json();

        document.getElementById("avatar").src = user.avatar_url;
        document.getElementById("avatar").alt =
            `${user.login}'s profile picture`;

        document.getElementById("name").textContent =
            user.name || user.login;

        document.getElementById("login").textContent =
            "@" + user.login;

        document.getElementById("bio").textContent =
            user.bio || "No bio available.";

        document.getElementById("repos").textContent =
            user.public_repos;

        document.getElementById("followers").textContent =
            user.followers;

        document.getElementById("following").textContent =
            user.following;

        document.getElementById("location").textContent =
            user.location ? "📍 " + user.location : "";

        document.getElementById("profileLink").href =
            user.html_url;

        profile.classList.remove("hidden");
        message.textContent = "Profile found successfully!";

    } catch (error) {
        message.textContent = error.message.includes("fetch")
            ? "Network error. Check your internet connection."
            : error.message;
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
});
