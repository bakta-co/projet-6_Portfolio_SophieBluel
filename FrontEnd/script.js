const galleryjs = document.getElementById("gallery-js");
const galleryModal = document.getElementById("gallery-modal");
const baseURL = "http://localhost:5678/api/";
let data; 
let data2;
document.addEventListener("DOMContentLoaded", function () {
  updateLoginLogoutLink();

  // afficher les projets dans la gallery //
  fetch(baseURL + "works")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((projet) => {
        const projetElement = document.createElement("div");
        projetElement.id = `projet-${projet.id}`;

        projetElement.innerHTML = `
      <img src="${projet.imageUrl}" alt="${projet.title}">
      <figcaption>${projet.title}</figcaption>
    `;
        galleryjs.appendChild(projetElement);
      });
    });

  // filtrer les projets //

  const category = document.getElementById("filter-buttons");
  fetch(baseURL + "categories")
    .then((response2) => response2.json())
    .then((categorydata) => {
      data2 = categorydata;

      const allButton = document.createElement("button");
      allButton.textContent = "Tous";
      allButton.addEventListener("click", () => filterByCategory("all"));
      category.appendChild(allButton);

      categorydata.forEach((bouton) => {
        const boutonFiltre = document.createElement("button");
        boutonFiltre.textContent = bouton.name;
        boutonFiltre.addEventListener("click", () =>
          filterByCategory(bouton.id)
        );
        category.appendChild(boutonFiltre);
      });
    });
    
  function filterByCategory(category) {
    if (category === "all") {
      projetsFiltres = data;
    } else {
      projetsFiltres = data.filter((projet) => projet.categoryId === category);
    }
    galleryjs.innerHTML = "";
    projetsFiltres.forEach((projet) => {
      const projetElement = document.createElement("div");
      projetElement.innerHTML = `
            <img src="${projet.imageUrl}" alt="${projet.title}">
            <figcaption>${projet.title}</figcaption>
          `;
      galleryjs.appendChild(projetElement);
    });
  }

  // mise à jour connexion et deconnexion

  function updateLoginLogoutLink() {
    const loginLogoutLink = document.getElementById("loginLogoutLink");
    let isLoggedIn = localStorage.getItem("token") != undefined;

    if (isLoggedIn) {
      document.getElementById("filter-buttons").style.display = "none";
      document.getElementById("modifications").innerHTML =
        '<a href="#modal"><i class="fa-regular fa-pen-to-square"></i> modifier</a>';

      loginLogoutLink.textContent = "Logout";

      loginLogoutLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        updateLoginLogoutLink(false);
        window.location.href = "index.html";
        loginLogoutLink.href = "index.html";
      });
    } else {
      loginLogoutLink.textContent = "Login";
      loginLogoutLink.href = "login.html";
    }
  }
});
