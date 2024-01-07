const baseURL= "http://localhost:5678/api/";
document.addEventListener('DOMContentLoaded', function () {

  document.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email");
      const password = document.getElementById("password");

      fetch(baseURL + 'users/login', {
          method: "POST",
          body: JSON.stringify({
              email: email.value,
              password: password.value,
                }),
          headers: {
              "Content-type": "application/json; charset=UTF-8",
          },
      })
      .then(response => {
          if (!response.ok) {
            document.getElementById("form-message").textContent = "Erreur dans l’identifiant ou le mot de passe";
            throw new Error(`Identifiants invalides. Statut : ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          const token = data.token;
          localStorage.setItem('token', token);

          if (token) {
          window.location.href = 'index.html';
          }
        })
      .catch(error => {
          console.error("Erreur lors de la connexion :", error.message);
      });
    }); 
});
            
