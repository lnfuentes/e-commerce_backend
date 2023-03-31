const elementExist = id => document.getElementById(id) !== null;

function getCurrentURL() {
    return window.location.href;
}
  
function getParameters(currentURL) {
    const myParams = {};
    let urlString = currentURL;
    let paramString = urlString.split("?")[1];
    let queryString = new URLSearchParams(paramString);
    for (let pair of queryString.entries()) {
      myParams[pair[0]] = pair[1];
    }
    return myParams;
}

const convertParamsToQuery = (params) => {
    let query = "";
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        query += `${key}=${value}&`;
      }
    }
    return query;
};

const fetchContenidoProductos = async () => {
    const url = getCurrentURL()
    const params = getParameters(url);
    const query = convertParamsToQuery(params)
    const response = await fetch(`http://localhost:3434/api/products?${query}`);
    const data = await response.json();
    const myElement = document.getElementById("contenidoProductos");
    myElement.innerHTML = data.productos.payload.map((product) => {
      return `
              <div class="card col-3">
                  <img src="${product.thumbnail}" class="card-img-top" alt="...">
                  <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text">${product.price}</p>
                  <a href="#" id=${product._id} class="btn btn-primary">Añadir</a>
                  </div>
              </div>
              `;
    });

    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
        e.preventDefault();
        const id = e.target.id;
        console.log(id);
        window.location.href = `/product/${id}`;
        });
    });
}  

elementExist('contenidoProductos') && fetchContenidoProductos();

const fetchProducto = async () => {
    const url = getCurrentURL();
    const params = getParameters(url);
    const query = convertParamsToQuery(params);
    const response = await fetch(`http://localhost:3737/api/product?${query}`);
    const data = await response.json();
    const myElement = document.getElementById("contenidoProductos");
};


// LOGIN //

elementExist('login') && document.getElementById('login').addEventListener('click', e => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  }).then(res => res.json())
  .then(data => {
    if (data.message === "success") {
      window.location.href = "/products";
    } else {
      alert("usuario no encontrado");
    }
  })
  .catch(error => console.log(error))
});


// SIGNUP //

elementExist('signup') && document.getElementById('signup').addEventListener('click', e => {
  const first_name = document.getElementById('first_name').value; 
  const last_name = document.getElementById('last_name').value; 
  const email = document.getElementById('email').value; 
  const password = document.getElementById('password').value; 
  const age = document.getElementById('age').value; 

  if(!first_name || !last_name || !email || !password || !age) {
    return alert('todos los campos son obligatorios');
  } else {
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        age
      })
    }).then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
  }
});


// ACTUALIZAR CONTRASEÑA //

elementExist("forgot") && document.getElementById("forgot").addEventListener("click", e => {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const repeatPassword = document.getElementById("repeatPassword").value;

    fetch('/forgot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password, repeatPassword})
    }).then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
    
});