document.addEventListener("DOMContentLoaded", function () {
  const modalContainer = document.querySelector(".modal-container");
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  var body = document.body;
  const add = document.querySelector(".ajouter");
  const modalContent = document.querySelector(".modal");
  const page1 = document.querySelector(".page1");
  const page2 = document.querySelector(".page2");
  const fleche = document.querySelector(".fa-arrow-left");
  const baseURL = "http://localhost:5678/api/";


  // modal + galerie//

  modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", toggleModal)
  );

  function toggleModal() {
    modalContainer.classList.toggle("active");
    body.classList.toggle("body-active");
  }

  fetch(baseURL + "works")
    .then((response) => response.json())
    .then((projetdata) => {
      data = projetdata;
      data.forEach((projet) => {
        const modifElement = document.createElement("div");

        modifElement.innerHTML = `
                <img src="${projet.imageUrl}" alt="${projet.title}">
                <a class="delete-request" data-id="${projet.id}"><i class="fa-solid fa-trash-can poubelle"></i></a>
            `;

        galleryModal.appendChild(modifElement);
      });

      toDelete();
    });

    //supprimer au clic sur la corbeille //

  function toDelete() {
    const deleteLinks = document.querySelectorAll(".delete-request");
    deleteLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();

        const id = this.getAttribute("data-id");
        this.parentElement.remove();
        const elementASupprimer = document.getElementById(`projet-${id}`);
        if (elementASupprimer) {
          elementASupprimer.remove();
        }
        token = localStorage.getItem("token");
        fetch(baseURL + "works/" + id, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Erreur lors de la suppression : ${response.status} ${response.statusText}`
              );
            }
            if (response.status === 204) {
              return null;
            }
            return response.json();
          })
          .then((res) => {
            //
          });
      });
    });
  }

  //afficher la 2nde page de la modal //

  add.addEventListener("click", function (e) {
    e.preventDefault();

    modalContent.innerHTML = "";
    modalContent.appendChild(page2);
    page2.style.display = "block";
  });

  // revenir a la page 1 et reset formulaire //

  fleche.addEventListener("click", function (e) {
    e.preventDefault();

    modalContent.innerHTML = "";
    modalContent.appendChild(page1);
    page2.style.display = "none";
    imgSRC.remove();
    form.reset();
  });

  // ajouter une catégorie au nouveau projet //

  function getCategories() {
    fetch(baseURL + "categories")
      .then((response) => response.json())
      .then((categories) => {
        const categorySelect = document.getElementById("categorie");

        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.text = category.name;
          categorySelect.appendChild(option);
        });
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      );
  }
  window.onload = getCategories;

  let inputImage = document.querySelector("input[type='file']");
  let selectedPic = document.querySelector(".div-img");
  let imgSRC = document.createElement("img");
  const fileInput = document.querySelector('.add-btn input[type="file"]');

  // Afficher l'image choisi//

  inputImage.addEventListener("change", function () {
    imgSRC.classList.add("selected-img");
    imgSRC.src = URL.createObjectURL(
      inputImage.form.elements["image"].files[0]
    );

    imgSRC.style.maxWidth = "173px";
    imgSRC.style.maxHeight = "169px";
    selectedPic.appendChild(imgSRC);
  });

  // Changer d'image au clic sur l'image déjà choisi
  inputImage.addEventListener("change", function () {
    const file = fileInput.files[0];

    if (file) {
      imgSRC.src = URL.createObjectURL(file);
      imgSRC.style.cursor = "pointer";
    }
  });

  imgSRC.addEventListener("click", function () {
    fileInput.click();
  });

  // reset formulaire + page 1 

  document
    .querySelector(".modal-trigger")
    .addEventListener("click", function () {
      imgSRC.remove();
      form.reset();
      modalContent.innerHTML = "";
      modalContent.appendChild(page1);
      page2.style.display = "none";
    });

    // ajouter un projet

  function addArticle() {
    const form = document.querySelector(".form-add");
    const formData = new FormData();
    const galleryjs = document.getElementById("gallery-js");

    const fileImage = form.elements["image"].files[0];

    formData.append("title", form.elements["title"].value);
    formData.append("category", form.elements["categorie"].value);
    formData.append("image", fileImage);

    const token = localStorage.getItem("token");
    fetch(baseURL + "works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error (`Erreur lors de la requête POST : ${response.status} ${response.statusText}`)
        // }
        //console.log(response.json())
        return response.json();
      })
      .then((data) => {
        const projetElement = document.createElement("div");

        projetElement.innerHTML = `
           <img src="${data.imageUrl}" alt="${data.title}">
           <figcaption>${data.title}</figcaption>
       `;
        //console.log(projetElement);
        galleryjs.appendChild(projetElement);
        updateGallery();
      })
      .catch((error) =>
        console.error("Erreur lors de l'ajout de l'article :", error)
      );
  }

  // reset formulaire + page 1

  const form = document.querySelector(".form-add");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    addArticle();
    modalContent.appendChild(page1);
    page2.style.display = "none";
    imgSRC.remove();
    form.reset();
  });

  // afficher nouveau projet dans les galeries 

  function updateGallery() {
    const galleryjs = document.getElementById("gallery-js");
    const modalGallery = document.getElementById("gallery-modal");

    galleryjs.innerHTML = "";
    modalGallery.innerHTML = "";

    fetch(baseURL + "works")
      .then((response) => response.json())
      .then((projetdata) => {
        projetdata.forEach((projet) => {
          const projetElement = document.createElement("div");
          projetElement.id = `projet-${projet.id}`;

          projetElement.innerHTML = `
                        <img src="${projet.imageUrl}" alt="${projet.title}">
                        <figcaption>${projet.title}</figcaption>
                    `;

          galleryjs.appendChild(projetElement);

          const modalProjetElement = document.createElement("div");

          modalProjetElement.innerHTML = `
                <img src="${projet.imageUrl}" alt="${projet.title}">
                <a href="#" class="delete-request" data-id="${projet.id}"><i class="fa-solid fa-trash-can poubelle"></i></a>
                `;
          modalGallery.appendChild(modalProjetElement);
          toDelete();
        });
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des données de la galerie :",
          error
        )
      );
  }

});
